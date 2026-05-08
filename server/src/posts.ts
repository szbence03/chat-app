import { Router } from 'express';

const router = Router();

interface Post {
  id: string;
  title: string;
  content: string;
}

let posts: Post[] = [];
let nextId = 1;

// Create post
router.post('/', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }
  const newPost: Post = { id: String(nextId++), title, content };
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

// Update post
router.put('/:id', (req, res) => {
  const { title, content } = req.body;
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  if (title) post.title = title;
  if (content) post.content = content;

  res.json(post);
});

// Delete post
router.delete('/:id', (req, res) => {
  const initialLength = posts.length;
  posts = posts.filter((p) => p.id !== req.params.id);

  if (posts.length === initialLength) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.json({ message: 'Post deleted successfully' });
});

export default router;
