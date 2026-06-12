const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    character_name VARCHAR(50),
    character_emoji VARCHAR(10),
    category VARCHAR(50),
    score INT NOT NULL,
    total INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`).then(() => console.log('Table ready'))
  .catch(err => console.error('Table error:', err));

// POST /scores
app.post('/scores', async (req, res) => {
  const { name, character_name, character_emoji, category, score, total } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO scores (name, character_name, character_emoji, category, score, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, character_name, character_emoji, category, score, total]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, character_name, character_emoji, category, score, total FROM scores ORDER BY score DESC, created_at ASC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));