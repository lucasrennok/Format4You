import type { Block, Run } from '../../lib/parser';
import './Preview.css';

function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run, i) => {
        let node: React.ReactNode = run.text;
        if (run.bold) node = <strong>{node}</strong>;
        if (run.italic) node = <em>{node}</em>;
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'title':
      return <h1 className="doc-title"><Runs runs={block.runs} /></h1>;
    case 'author':
      return <p className="doc-author"><Runs runs={block.runs} /></p>;
    case 'institute':
      return <p className="doc-meta"><Runs runs={block.runs} /></p>;
    case 'email':
      return <p className="doc-meta doc-email"><Runs runs={block.runs} /></p>;
    case 'abstract':
    case 'resumo':
      return <p className="doc-abstract"><Runs runs={block.runs} /></p>;
    case 'section':
      return <h2 className="doc-section"><Runs runs={block.runs} /></h2>;
    case 'subsec':
      return <h3 className="doc-subsec"><Runs runs={block.runs} /></h3>;
    case 'text':
      return <p className="doc-text"><Runs runs={block.runs} /></p>;
    case 'caption':
    case 'tableTitle':
      return <p className="doc-caption"><Runs runs={block.runs} /></p>;
    case 'reference':
      return <p className="doc-reference"><Runs runs={block.runs} /></p>;
    case 'image':
      return (
        <figure className="doc-figure">
          <img
            src={block.url}
            alt=""
            style={{ width: block.width ? `${block.width}px` : undefined }}
            onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.25')}
          />
        </figure>
      );
    case 'table':
      return (
        <table className="doc-table">
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c}><Runs runs={cell} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    default:
      return null;
  }
}

export default function Preview({ blocks }: { blocks: Block[] }) {
  return (
    <div className="preview" aria-label="Pré-visualização do documento">
      <div className="page">
        {blocks.length === 0 ? (
          <p className="preview-empty">A pré-visualização aparece aqui conforme você escreve.</p>
        ) : (
          blocks.map((block, i) => <BlockView key={i} block={block} />)
        )}
      </div>
    </div>
  );
}
