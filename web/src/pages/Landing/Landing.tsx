import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Landing.css';

export default function Landing() {
  return (
    <div className="page-landing">
      <Header />
      <main className="landing-content">
        <h1 className="landing-title">Você escreve, a gente formata.</h1>
        <p className="landing-lead">
          Escreva o conteúdo com comandos simples e veja o documento tomando forma
          ao lado, em tempo real. Quando terminar, baixe em <strong>.docx</strong>.
        </p>
        <Link to="/writer" className="landing-cta">Novo documento →</Link>

        <ul className="landing-features">
          <li><strong>Editor + pré-visualização</strong> lado a lado, estilo Overleaf.</li>
          <li><strong>Marcação simples</strong>: títulos, seções, tabelas, imagens e referências.</li>
          <li><strong>Roda no navegador</strong>, sem instalar nada e sem enviar seu texto a servidor nenhum.</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}
