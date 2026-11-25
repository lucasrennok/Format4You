import { Link } from 'react-router-dom';
import leaf from '../../assets/images/icons/leaf.png';
import './Header.css';

type Props = { children?: React.ReactNode };

export default function Header({ children }: Props) {
  return (
    <header className="app-header">
      <Link to="/" className="brand">
        <img src={leaf} alt="" className="brand-logo" />
        <span className="brand-name">Format<strong>4</strong>You</span>
      </Link>
      <div className="header-actions">{children}</div>
    </header>
  );
}
