import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API } from '../api';

interface Post {
  id: string;
  title: string;
  content: string;
  userId?: string;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const currentUser = API.getUser();

  useEffect(() => {
    fetch(API.url(`/api/posts/${id}`))
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setEditTitle(data.title);
        setEditContent(data.content);
      })
      .catch(() => setError('Nem sikerült betölteni a bejegyzést.'));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Biztosan törlöd?')) return;
    const res = await fetch(API.url(`/api/posts/${id}`), {
      method: 'DELETE',
      headers: API.headers(),
    });
    if (res.ok) navigate('/');
  };

  const handleSave = async () => {
    const res = await fetch(API.url(`/api/posts/${id}`), {
      method: 'PUT',
      headers: API.headers(),
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPost(updated);
      setEditing(false);
    }
  };

  if (error)
    return (
      <main className="main">
        <div className="alert alert-error">{error}</div>
      </main>
    );
  if (!post)
    return (
      <main className="main">
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          Betöltés...
        </p>
      </main>
    );

  const isOwner = currentUser && post.userId === currentUser.id;

  return (
    <main className="main">
      <Link
        to="/"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1rem' }}
      >
        ← Vissza
      </Link>

      <div className="card">
        <h1 style={{ fontSize: '1.3rem', marginBottom: '.4rem' }}>
          {post.title}
        </h1>
        <hr />
        <p>{post.content}</p>
      </div>

      {isOwner && (
        <div style={{ marginTop: '.75rem', display: 'flex', gap: '.5rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setEditing(true)}
          >
            Szerkesztés
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Törlés
          </button>
        </div>
      )}

      {editing && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Bejegyzés szerkesztése</h2>
            <div className="form-group">
              <label htmlFor="edit-title">Cím</label>
              <input
                id="edit-title"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-content">Tartalom</label>
              <textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setEditing(false)}
              >
                Mégse
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Mentés
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
