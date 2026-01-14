import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const app = express();
const PORT = Number(process.env.PORT) || 6969;

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const ensureTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ideas (
      id SERIAL PRIMARY KEY,
      ideaText TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      isEdit BOOLEAN NOT NULL DEFAULT FALSE
    )
  `);
};

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

type IdeaRow = {
  id: number;
  ideatext: string;
  date: string;
  isedit: boolean;
};

app.get('/ideas', async (_req, res) => {
  try {
    const result = await pool.query<IdeaRow>('SELECT id, ideaText, date, isEdit FROM ideas ORDER BY id ASC');
    const ideas = result.rows.map((idea) => ({
      id: idea.id,
      ideaText: idea.ideatext,
      date: idea.date,
      isEdit: idea.isedit
    }));

    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load ideas' });
  }
});

app.post('/ideas', async (req, res) => {
  const ideaText = typeof req.body?.ideaText === 'string' ? req.body.ideaText.trim() : '';

  if (!ideaText) {
    res.status(400).json({ message: 'ideaText is required' });
    return;
  }

  try {
    const date = new Date().toISOString();
    const result = await pool.query<IdeaRow>(
      'INSERT INTO ideas (ideaText, date, isEdit) VALUES ($1, $2, $3) RETURNING id, ideaText, date, isEdit',
      [ideaText, date, false]
    );
    const created = result.rows[0];

    res.status(201).json({
      id: created.id,
      ideaText: created.ideatext,
      date: created.date,
      isEdit: created.isedit
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save idea' });
  }
});

app.put('/ideas/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const ideaText = typeof req.body?.ideaText === 'string' ? req.body.ideaText.trim() : '';

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  if (!ideaText) {
    res.status(400).json({ message: 'ideaText is required' });
    return;
  }

  try {
    const result = await pool.query<IdeaRow>(
      'UPDATE ideas SET ideaText = $1 WHERE id = $2 RETURNING id, ideaText, date, isEdit',
      [ideaText, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Idea not found' });
      return;
    }

    const updated = result.rows[0];

    res.json({
      id: updated.id,
      ideaText: updated.ideatext,
      date: updated.date,
      isEdit: updated.isedit
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update idea' });
  }
});

app.delete('/ideas/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  try {
    const result = await pool.query('DELETE FROM ideas WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Idea not found' });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete idea' });
  }
});

app.use(express.static(distPath));
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const startServer = async () => {
  await ensureTables();
  app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
