import { Router } from 'express';
import { authenticateToken, AuthRequest } from './auth.js';

const router = Router();

interface Post {
  id: string;
  title: string;
  content: string;
  userId?: string; // Tying post to user
}

const posts: Post[] = [];
let nextId = 1;

// Create post (protected)
router.post('/', authenticateToken, (req: AuthRequest, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }

  const userId = typeof req.user === 'object' ? req.user.id : undefined;

  const newPost: Post = { id: String(nextId++), title, content, userId };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// Read all posts
router.get('/', (req, res) => {
  res.json(posts);
});

// Read single post
router.get('/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  res.json(post);
});

// Update post (protected)
router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  const { title, content } = req.body;
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const userId = typeof req.user === 'object' ? req.user.id : undefined;
  if (post.userId && post.userId !== userId) {
    res.status(403).json({ error: 'Forbidden: You cannot edit this post' });
    return;
  }

  if (title) post.title = title;
  if (content) post.content = content;

  res.json(post);
});

// Delete post (protected)
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  const postIndex = posts.findIndex((p) => p.id === req.params.id);

  if (postIndex === -1) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const post = posts[postIndex];
  const userId = typeof req.user === 'object' ? req.user.id : undefined;
  if (post.userId && post.userId !== userId) {
    res.status(403).json({ error: 'Forbidden: You cannot delete this post' });
    return;
  }

  posts.splice(postIndex, 1);
  res.json({ message: 'Post deleted successfully' });
});

export default router;
