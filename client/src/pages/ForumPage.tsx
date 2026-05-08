import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../api';

interface Post {
  id: string;
  title: string;
  content: string;
  userId?: string;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const currentUser = API.getUser();

  useEffect(() => {
    fetch(API.url('/api/posts'))
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => setError('Nem sikerült betölteni a bejegyzéseket.'));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Biztosan törlöd?')) return;
    const res = await fetch(API.url(`/api/posts/${id}`), {
      method: 'DELETE',
      headers: API.headers(),
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="main">
      <div className="section-head">
        <h2>Bejegyzések</h2>
        <span>{posts.length} bejegyzés</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {posts.length === 0 && !error && (
        <p className="empty">Még nincs egyetlen bejegyzés sem.</p>
      )}

      {posts.map((post) => (
        <article className="post-card" key={post.id}>
          <div className="post-card__title">{post.title}</div>
          <div className="post-card__body">
            {post.content.length > 120
              ? post.content.slice(0, 120) + '…'
              : post.content}
          </div>
          <div className="post-card__actions">
            <Link to={`/post/${post.id}`} className="btn btn-ghost btn-sm">
              Megnyitás
            </Link>
            {currentUser && post.userId === currentUser.id && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(post.id)}
              >
                Törlés
              </button>
            )}
          </div>
        </article>
      ))}
    </main>
  );
}
