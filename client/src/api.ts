// Fejlesztésben a Vite proxy kezeli az /api kéréseket (localhost:5173 → localhost:5000)
// Production buildben a szerver maga szolgálja ki az /api útvonalakat
const BASE = import.meta.env.DEV ? '' : '';

export const API = {
  url: (path: string) => `${BASE}${path}`,

  token: () => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      // Check if token is expired (payload.exp is in seconds, Date.now() is in ms)
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return null;
      }
      return t;
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  },

  headers: () => ({
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token')
      ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
      : {}),
  }),

  getUser: (): { id: string; email: string } | null => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },
};
