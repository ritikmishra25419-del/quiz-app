const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) { console.error('DB connection failed:', err); return; }
  console.log('MySQL connected');
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    character_name VARCHAR(50),
    character_emoji VARCHAR(10),
    category VARCHAR(50),
    score INT NOT NULL,
    total INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// POST /scores — save a score
app.post('/scores', (req, res) => {
  const { name, character_name, character_emoji, category, score, total } = req.body;
  db.query(
    'INSERT INTO scores (name, character_name, character_emoji, category, score, total) VALUES (?, ?, ?, ?, ?, ?)',
    [name, character_name, character_emoji, category, score, total],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// GET /leaderboard — top 10 scores
app.get('/leaderboard', (req, res) => {
  db.query(
    'SELECT name, character_name, character_emoji, category, score, total FROM scores ORDER BY score DESC, created_at ASC LIMIT 10',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));