import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './users';
import postsRouter from './posts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API route-ok
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

// Statikus fájlok (a Vite build kimenete)
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

// Minden egyéb kérést az index.html-re irányít (SPA fallback)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
