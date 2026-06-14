# 🚀 Space Quiz — Full Stack Quiz Platform

A space-themed, multiplayer quiz web app with AI-ready architecture, real-time leaderboards, and category-based questions. Built with React, Node.js, PostgreSQL, and deployed on Vercel + Render.

🔗 **Live Demo:** https://quiz-app-58ck.vercel.app

---

## ✨ Features

- 🧑‍🚀 Character selection — 5 unique space characters
- 🗂️ 5 question categories — Web Development, JavaScript, React, CSS, General CS
- ⏱️ 20-second countdown timer per question with color feedback
- ✅ Instant answer feedback — green for correct, red for wrong
- 🏆 Global leaderboard — scores saved to cloud database
- 📊 Progress bar and live score tracking
- 🌌 Space theme with animated stars and glassmorphism UI
- 📱 Fully responsive

---

## 🛠️ Tech Stack

### Frontend
- React (Create React App)
- CSS3 — Glassmorphism, animations, gradients
- Deployed on **Vercel**

### Backend
- Node.js + Express.js
- REST API — POST /scores, GET /leaderboard
- Deployed on **Render**

### Database
- PostgreSQL via **Supabase**
- Stores player name, character, category, score, and timestamp

---

## 🗂️ Project Structure
quiz-app/

├── src/

│   ├── App.js          # All screens — Character Select, Home, Quiz, Leaderboard, Result

│   ├── App.css         # Space theme, glassmorphism, animations

│   └── questions.js    # 55 questions across 5 categories

├── public/

└── package.json
quiz-backend/

├── server.js           # Express API — /scores and /leaderboard

├── .env                # Database URL (not committed)

└── package.json
---

## 🚀 Run Locally

### Frontend
```bash
git clone https://github.com/ritikmishra25419-del/quiz-app.git
cd quiz-app
npm install
npm start
```

### Backend
```bash
git clone https://github.com/ritikmishra25419-del/quiz-backend.git
cd quiz-backend
npm install
# Create .env with DATABASE_URL and PORT=5000
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/scores` | Save a player's score |
| GET | `/leaderboard` | Get top 10 scores globally |

---

## 🧠 What I Learned

- Building a full stack app from scratch — React frontend to Node.js backend to PostgreSQL
- JWT-free REST API design with Express.js
- Connecting a React app to a live cloud database via API
- Deploying frontend and backend to separate cloud platforms
- Managing CORS, environment variables, and production builds

---

## 👨‍💻 Author

**Ritik Mishra**
- GitHub: [@ritikmishra25419-del](https://github.com/ritikmishra25419-del)
- LinkedIn: [linkedin.com/in/ritik-mishra-827162374](https://linkedin.com/in/ritik-mishra-827162374)