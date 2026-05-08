import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    try {
      const res = await fetch(API.url('/api/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Hibás e-mail vagy jelszó.');
        return;
      }
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch {
      setError('A szerver nem elérhető.');
    }
  };

  return (
    <section className="auth-wrap">
      <h1>Bejelentkezés</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="te@példa.hu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Jelszó</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSubmit}>
          Bejelentkezés
        </button>
      </div>

      <p className="auth-switch">
        Még nincs fiókod? <Link to="/register">Regisztráció</Link>
      </p>
    </section>
  );
}
