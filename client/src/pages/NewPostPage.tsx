import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../api';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (!title || !content) {
      setError('Cím és tartalom kötelező.');
      return;
    }
    try {
      const res = await fetch(API.url('/api/posts'), {
        method: 'POST',
        headers: API.headers(),
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Hiba történt.');
        return;
      }
      navigate('/');
    } catch {
      setError('A szerver nem elérhető.');
    }
  };

  return (
    <main className="main">
      <div className="section-head">
        <h2>Új bejegyzés</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="form-group">
          <label htmlFor="title">Cím</label>
          <input
            id="title"
            type="text"
            placeholder="Bejegyzés címe"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Tartalom</label>
          <textarea
            id="content"
            placeholder="Írd le a gondolataidat..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div
          style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}
        >
          <Link to="/" className="btn btn-ghost">
            Mégse
          </Link>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Közzétesz
          </button>
        </div>
      </div>
    </main>
  );
}
