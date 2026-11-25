import { useState } from 'react';
import './SyntaxHelp.css';

const COMMANDS: [string, string][] = [
  ['#title:', 'Título do documento'],
  ['#author:', 'Autor (centralizado)'],
  ['#institute:', 'Instituto'],
  ['#email:', 'E-mail'],
  ['#abstract: / #resumo:', 'Resumo em inglês / português'],
  ['#section:', 'Seção'],
  ['#subsec:', 'Subseção'],
  ['#text:', 'Parágrafo de texto'],
  ['#b: ... #bc:', 'Liga / desliga negrito'],
  ['#i: ... #ic:', 'Liga / desliga itálico'],
  ['#img: url L A', 'Imagem com largura e altura opcionais'],
  ['#caption:', 'Legenda de figura'],
  ['#table-title:', 'Título de tabela'],
  ['#table: ... #tablec:', 'Tabela (células com #celc:, linhas com #rowc:)'],
  ['#ref:', 'Referência'],
  ['#order: true', 'Numera seções, figuras e tabelas'],
  ['#:', 'Comentário (não entra no documento)'],
];

export default function SyntaxHelp() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`help ${open ? 'open' : ''}`}>
      <button className="help-toggle" type="button" onClick={() => setOpen((v) => !v)}>
        {open ? '✕ Fechar ajuda' : '? Comandos'}
      </button>
      {open && (
        <div className="help-panel">
          <h2>Comandos</h2>
          <dl>
            {COMMANDS.map(([cmd, desc]) => (
              <div key={cmd} className="help-row">
                <dt><code>{cmd}</code></dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
