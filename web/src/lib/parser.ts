// =============================================================================
//  Parser da marcação do Format4You.
//
//  O texto é escrito com comandos que começam com "#" e terminam em ":".
//  Comandos de bloco iniciam um novo bloco (título, seção, parágrafo...);
//  comandos em linha ligam/desligam estilos (negrito, itálico) do texto que
//  vem depois, dentro do mesmo bloco.
//
//  A linguagem foi mantida a mesma das versões antigas, só organizada.
// =============================================================================

export type Run = { text: string; bold: boolean; italic: boolean };

export type Block =
  | { type: 'title'; runs: Run[] }
  | { type: 'author'; runs: Run[] }
  | { type: 'institute'; runs: Run[] }
  | { type: 'email'; runs: Run[] }
  | { type: 'abstract'; runs: Run[] }
  | { type: 'resumo'; runs: Run[] }
  | { type: 'section'; number?: string; runs: Run[] }
  | { type: 'subsec'; number?: string; runs: Run[] }
  | { type: 'text'; runs: Run[] }
  | { type: 'caption'; number?: string; justified: boolean; runs: Run[] }
  | { type: 'tableTitle'; number?: string; justified: boolean; runs: Run[] }
  | { type: 'reference'; runs: Run[] }
  | { type: 'image'; url: string; width?: number; height?: number }
  | { type: 'table'; rows: Run[][][] };

// Comandos que começam um bloco novo, mapeados para o tipo do bloco.
const BLOCK_COMMANDS: Record<string, Block['type']> = {
  '#title:': 'title',
  '#author:': 'author',
  '#institute:': 'institute',
  '#email:': 'email',
  '#abstract:': 'abstract',
  '#resumo:': 'resumo',
  '#section:': 'section',
  '#subsec:': 'subsec',
  '#text:': 'text',
  '#t:': 'text',
  '#caption:': 'caption',
  '#caption-justified:': 'caption',
  '#table-title:': 'tableTitle',
  '#table-title-justified:': 'tableTitle',
  '#ref:': 'reference',
};

type Counters = { section: number; subsec: number; picture: number; table: number };

function rest(line: string): string {
  const idx = line.indexOf(':');
  return idx === -1 ? '' : line.slice(idx + 1);
}

/** Lê uma string com toggles (#b: #bc: #i: #ic:) e devolve runs estilizados. */
function parseRuns(text: string, state = { bold: false, italic: false }): Run[] {
  const runs: Run[] = [];
  const tokens = text.split(/(\s+)/); // mantém os espaços
  let buffer = '';
  const flush = () => {
    if (buffer) {
      runs.push({ text: buffer, bold: state.bold, italic: state.italic });
      buffer = '';
    }
  };
  for (const token of tokens) {
    switch (token.trim()) {
      case '#b:': flush(); state.bold = true; break;
      case '#bc:': flush(); state.bold = false; break;
      case '#i:': flush(); state.italic = true; break;
      case '#ic:': flush(); state.italic = false; break;
      case '#t:': flush(); runs.push({ text: '\t', bold: state.bold, italic: state.italic }); break;
      default: buffer += token;
    }
  }
  flush();
  // Remove espaços sobrando nas pontas
  return runs
    .map((r) => r)
    .filter((r, i, arr) => !(r.text.trim() === '' && (i === 0 || i === arr.length - 1)));
}

function numbered(prefix: string, runs: Run[]): Run[] {
  return [{ text: prefix, bold: runs[0]?.bold ?? false, italic: runs[0]?.italic ?? false }, ...runs];
}

/** Interpreta o texto inteiro em uma lista de blocos. */
export function parseDocument(source: string): Block[] {
  const blocks: Block[] = [];
  const counters: Counters = { section: 0, subsec: 0, picture: 0, table: 0 };
  let order = false;

  const lines = source.replace(/\r\n/g, '\n').split('\n');
  let i = 0;

  const firstToken = (line: string) => line.trimStart().split(/\s+/)[0] ?? '';

  while (i < lines.length) {
    const line = lines[i];
    const cmd = firstToken(line);

    // Comentário / linha vazia de controle
    if (cmd === '#:') { i++; continue; }
    if (line.trim() === '') { i++; continue; }

    if (cmd === '#order:') {
      order = /^(true|t)$/i.test(rest(line).trim());
      i++;
      continue;
    }
    if (cmd === '#template:') {
      i++; // troca de template não muda o preview; mantido por compatibilidade
      continue;
    }

    if (cmd === '#img:') {
      const parts = rest(line).trim().split(/\s+/);
      const url = parts[0] ?? '';
      const width = parts[1] ? Number(parts[1]) : undefined;
      const height = parts[2] ? Number(parts[2]) : width;
      if (url) blocks.push({ type: 'image', url, width, height });
      i++;
      continue;
    }

    if (cmd === '#table:') {
      const rows: Run[][][] = [];
      let cells: Run[][] = [];
      let cell = '';
      i++;
      while (i < lines.length && firstToken(lines[i]) !== '#tablec:') {
        const tokens = lines[i].split(/(\s+)/);
        for (const tk of tokens) {
          if (tk.trim() === '#celc:') { cells.push(parseRuns(cell)); cell = ''; }
          else if (tk.trim() === '#rowc:') { rows.push(cells); cells = []; }
          else cell += tk;
        }
        i++;
      }
      if (cell.trim()) cells.push(parseRuns(cell));
      if (cells.length) rows.push(cells);
      i++; // pula o #tablec:
      if (rows.length) blocks.push({ type: 'table', rows });
      continue;
    }

    const blockType = BLOCK_COMMANDS[cmd];
    if (blockType) {
      const justified = cmd.includes('justified');
      let runs = parseRuns(rest(line).replace(/^\s/, ''));

      if (order && blockType === 'section') {
        counters.section++; counters.subsec = 0;
        runs = numbered(`${counters.section}. `, runs);
        blocks.push({ type: 'section', number: `${counters.section}`, runs });
      } else if (order && blockType === 'subsec') {
        counters.subsec++;
        const num = `${counters.section}.${counters.subsec}`;
        runs = numbered(`${num}. `, runs);
        blocks.push({ type: 'subsec', number: num, runs });
      } else if (order && blockType === 'caption') {
        counters.picture++;
        runs = numbered(`Figura ${counters.picture}. `, runs);
        blocks.push({ type: 'caption', number: `${counters.picture}`, justified, runs });
      } else if (order && blockType === 'tableTitle') {
        counters.table++;
        runs = numbered(`Tabela ${counters.table}. `, runs);
        blocks.push({ type: 'tableTitle', number: `${counters.table}`, justified, runs });
      } else if (blockType === 'caption' || blockType === 'tableTitle') {
        blocks.push({ type: blockType, justified, runs } as Block);
      } else {
        blocks.push({ type: blockType, runs } as Block);
      }
      i++;
      continue;
    }

    // Linha sem comando: parágrafo comum
    blocks.push({ type: 'text', runs: parseRuns(line) });
    i++;
  }

  return blocks;
}

export const runsToText = (runs: Run[]): string => runs.map((r) => r.text).join('');
