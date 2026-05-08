import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

interface Post {
  id: string;
  title: string;
  content: string;
}

let posts: Post[] = [];
let nextId = 1;

// Create post
app.post('/api/posts', (req, res) => {
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
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Read single post
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  res.json(post);
});

// Update post
app.put('/api/posts/:id', (req, res) => {
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
app.delete('/api/posts/:id', (req, res) => {
  const initialLength = posts.length;
  posts = posts.filter((p) => p.id !== req.params.id);

  if (posts.length === initialLength) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.json({ message: 'Post deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
