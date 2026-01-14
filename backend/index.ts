import express from 'express';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = Number(process.env.PORT) || 6969;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDbPath = path.join(__dirname, 'ideas.db');
const dbPath = process.env.DB_PATH || defaultDbPath;
const distPath = path.join(__dirname, '..', 'dist');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ideaText TEXT NOT NULL,
    date TEXT NOT NULL,
    isEdit INTEGER NOT NULL DEFAULT 0
  )
`);

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
  ideaText: string;
  date: string;
  isEdit: number;
};

const selectIdeas = db.prepare('SELECT id, ideaText, date, isEdit FROM ideas ORDER BY id ASC');
const selectIdeaById = db.prepare('SELECT id, ideaText, date, isEdit FROM ideas WHERE id = ?');
const insertIdea = db.prepare('INSERT INTO ideas (ideaText, date, isEdit) VALUES (?, ?, ?)');
const updateIdea = db.prepare('UPDATE ideas SET ideaText = ? WHERE id = ?');
const deleteIdea = db.prepare('DELETE FROM ideas WHERE id = ?');

app.get('/ideas', (_req, res) => {
  const ideas = (selectIdeas.all() as IdeaRow[]).map((idea) => ({
    ...idea,
    isEdit: idea.isEdit === 1
  }));

  res.json(ideas);
});

app.post('/ideas', (req, res) => {
  const ideaText = typeof req.body?.ideaText === 'string' ? req.body.ideaText.trim() : '';

  if (!ideaText) {
    res.status(400).json({ message: 'ideaText is required' });
    return;
  }

  const date = new Date().toISOString();
  const info = insertIdea.run(ideaText, date, 0);

  res.status(201).json({
    id: Number(info.lastInsertRowid),
    ideaText,
    date,
    isEdit: false
  });
});

app.put('/ideas/:id', (req, res) => {
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

  const info = updateIdea.run(ideaText, id);

  if (info.changes === 0) {
    res.status(404).json({ message: 'Idea not found' });
    return;
  }

  const updated = selectIdeaById.get(id) as IdeaRow;

  res.json({
    ...updated,
    isEdit: updated.isEdit === 1
  });
});

app.delete('/ideas/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  const info = deleteIdea.run(id);

  if (info.changes === 0) {
    res.status(404).json({ message: 'Idea not found' });
    return;
  }

  res.sendStatus(204);
});

app.use(express.static(distPath));
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
