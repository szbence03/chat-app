import { Router } from 'express';

const router = Router();

interface User {
  id: string;
  name: string;
  email: string;
}

let users: User[] = [];
let nextUserId = 1;

// Create user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  const newUser: User = { id: String(nextUserId++), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Read all users
router.get('/', (req, res) => {
  res.json(users);
});

// Read single user
router.get('/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

// Update user
router.put('/:id', (req, res) => {
  const { name, email } = req.body;
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

// Delete user
router.delete('/:id', (req, res) => {
  const initialLength = users.length;
  users = users.filter((u) => u.id !== req.params.id);

  if (users.length === initialLength) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ message: 'User deleted successfully' });
});

export default router;
