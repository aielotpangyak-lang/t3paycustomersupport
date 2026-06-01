import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data.json');

async function getSubmissions() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveSubmission(submission: any) {
  const submissions = await getSubmissions();
  submissions.push(submission);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/submissions', async (req, res) => {
    try {
      const submission = {
        ...req.body,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID()
      };
      await saveSubmission(submission);
      res.json({ success: true, submission });
    } catch (error) {
      console.error('Error saving submission:', error);
      res.status(500).json({ error: 'Failed to save submission' });
    }
  });

  app.get('/api/submissions', async (req, res) => {
    try {
      const submissions = await getSubmissions();
      // Reverse order so newest is first
      res.json(submissions.reverse());
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
