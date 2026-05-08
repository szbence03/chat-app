import { Link, useNavigate } from 'react-router-dom';

interface Props {
  username?: string;
}

export default function Header({ username }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="site-header">
      <Link to="/" className="site-header__logo">
        Fórum
      </Link>
      <nav className="site-header__nav">
        {username && (
          <span className="site-header__user">
            Üdv, <strong>{username}</strong>
          </span>
        )}
        <Link to="/new-post" className="btn btn-primary btn-sm">
          + Új bejegyzés
        </Link>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Kilépés
        </button>
      </nav>
    </header>
  );
}
