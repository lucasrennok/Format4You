import { useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Editor from '../../components/Editor/Editor';
import Preview from '../../components/Preview/Preview';
import SyntaxHelp from '../../components/SyntaxHelp/SyntaxHelp';
import { parseDocument } from '../../lib/parser';
import { downloadDocx } from '../../lib/renderDocx';
import { SAMPLE_TEXT } from '../../lib/defaultTemplate';
import './Writer.css';

export default function Writer() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [fileName, setFileName] = useState('documento');
  const [busy, setBusy] = useState(false);

  const blocks = useMemo(() => parseDocument(text), [text]);

  const handleDownload = async () => {
    setBusy(true);
    try {
      await downloadDocx(blocks, fileName);
    } catch (err) {
      console.error(err);
      alert('Não foi possível gerar o documento.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-writer">
      <Header>
        <div className="file-name">
          <input
            value={fileName}
            maxLength={40}
            onChange={(e) => setFileName(e.target.value)}
            aria-label="Nome do arquivo"
          />
          <span>.docx</span>
        </div>
        <SyntaxHelp />
        <button className="btn-download" type="button" onClick={handleDownload} disabled={busy}>
          {busy ? 'Gerando…' : 'Baixar .docx'}
        </button>
      </Header>

      <main className="workspace">
        <section className="pane pane-editor">
          <div className="pane-label">Marcação</div>
          <Editor value={text} onChange={setText} />
        </section>
        <section className="pane pane-preview">
          <div className="pane-label">Pré-visualização</div>
          <Preview blocks={blocks} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
