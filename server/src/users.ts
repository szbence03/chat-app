import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest } from './auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

let users: User[] = [];
let nextUserId = 1;

// Register user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = { id: String(nextUserId++), name, email, passwordHash };
  users.push(newUser);

  res
    .status(201)
    .json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
});

// Read all users (protected)
router.get('/', authenticateToken, (req, res) => {
  const usersToReturn = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }));
  res.json(usersToReturn);
});

// Read single user (protected)
router.get('/:id', authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ id: user.id, name: user.name, email: user.email });
});

// Update user (protected)
router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  const { name, email } = req.body;
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (name) user.name = name;
  if (email) user.email = email;

  res.json({ id: user.id, name: user.name, email: user.email });
});

// Delete user (protected)
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  const initialLength = users.length;
  users = users.filter((u) => u.id !== req.params.id);

  if (users.length === initialLength) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ message: 'User deleted successfully' });
});

export default router;
