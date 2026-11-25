import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { Block, Run } from './parser';

const toRuns = (runs: Run[]) =>
  runs.map((r) => new TextRun({ text: r.text, bold: r.bold, italics: r.italic }));

const centered = (runs: Run[], opts: object = {}) =>
  new Paragraph({ alignment: AlignmentType.CENTER, children: toRuns(runs), ...opts });

async function fetchImage(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

/** Converte os blocos em parágrafos/tabelas do docx. */
async function buildChildren(blocks: Block[]): Promise<(Paragraph | Table)[]> {
  const children: (Paragraph | Table)[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'title':
        children.push(centered(block.runs, { heading: HeadingLevel.TITLE, spacing: { after: 200 } }));
        break;
      case 'author':
      case 'institute':
      case 'email':
        children.push(centered(block.runs));
        break;
      case 'abstract':
      case 'resumo':
        children.push(new Paragraph({ children: toRuns(block.runs), spacing: { after: 160 } }));
        break;
      case 'section':
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: toRuns(block.runs) }));
        break;
      case 'subsec':
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: toRuns(block.runs) }));
        break;
      case 'text':
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: toRuns(block.runs) }));
        break;
      case 'caption':
      case 'tableTitle':
        children.push(centered(block.runs, { spacing: { before: 80, after: 80 } }));
        break;
      case 'reference':
        children.push(new Paragraph({ children: toRuns(block.runs), spacing: { after: 80 } }));
        break;
      case 'image': {
        const data = await fetchImage(block.url);
        if (data) {
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data,
                  type: 'png',
                  transformation: { width: block.width ?? 300, height: block.height ?? 200 },
                }),
              ],
            })
          );
        }
        break;
      }
      case 'table': {
        const rows = block.rows.map(
          (cells) =>
            new TableRow({
              children: cells.map(
                (cell) =>
                  new TableCell({
                    children: [new Paragraph({ children: toRuns(cell) })],
                  })
              ),
            })
        );
        children.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
        break;
      }
    }
  }

  return children;
}

export async function downloadDocx(blocks: Block[], fileName: string): Promise<void> {
  const children = await buildChildren(blocks);
  const doc = new Document({
    sections: [{ properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, children }],
  });
  const blob = await Packer.toBlob(doc);
  const name = (fileName.trim() || 'documento').replace(/\.docx$/i, '');
  saveAs(blob, `${name}.docx`);
}
