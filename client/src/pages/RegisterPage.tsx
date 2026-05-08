import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    try {
      const res = await fetch(API.url('/api/users/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sikertelen regisztráció.');
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setError('A szerver nem elérhető.');
    }
  };

  return (
    <section className="auth-wrap">
      <h1>Regisztráció</h1>

      {success && (
        <div className="alert alert-success">
          Sikeres regisztráció! Átirányítás...
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="form-group">
          <label htmlFor="name">Teljes név</label>
          <input
            id="name"
            type="text"
            placeholder="Kovács Péter"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            placeholder="min. 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <button className="btn btn-primary btn-full" onClick={handleSubmit}>
          Fiók létrehozása
        </button>
      </div>

      <p className="auth-switch">
        Van már fiókod? <Link to="/login">Bejelentkezés</Link>
      </p>
    </section>
  );
}
