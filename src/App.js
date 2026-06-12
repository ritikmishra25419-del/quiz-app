import { useState, useEffect } from 'react';
import './App.css';
import questions from './questions';

const CHARACTERS = [
  { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut', color: '#60a5fa' },
  { id: 'alien', emoji: '👾', name: 'Alien', color: '#a78bfa' },
  { id: 'robot', emoji: '🤖', name: 'Robot', color: '#34d399' },
  { id: 'wizard', emoji: '🧙‍♂️', name: 'Wizard', color: '#f472b6' },
  { id: 'ninja', emoji: '🥷', name: 'Ninja', color: '#fbbf24' },
];

const CATEGORIES = ['Web Development', 'JavaScript', 'React', 'CSS', 'General CS'];
const TIMER_SECONDS = 20;

// ───────────────── Stars ─────────────────
function Stars() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));
  return (
    <div className="stars">
      {stars.map((s) => (
        <div key={s.id} className="star" style={{
          top: `${s.top}%`, left: `${s.left}%`,
          width: s.size, height: s.size,
          animationDelay: `${s.delay}s`,
          animationDuration: `${s.duration}s`,
        }} />
      ))}
    </div>
  );
}

// ───────────────── Character Select ─────────────────
function CharacterSelect({ onDone }) {
  const [name, setName] = useState('');
  const [picked, setPicked] = useState(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const valid = name.trim().length > 1 && picked;

  return (
    <div className="card char-card">
      <div className="card-tag">🚀 Mission Briefing</div>
      <h2 className="card-title">Who's Flying<br /><span className="grad">Today?</span></h2>
      <input
        className="name-input"
        placeholder="Enter your name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={20}
      />
      <p className="section-label">Choose your character</p>
      <div className="char-grid">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            className={`char-btn ${picked?.id === c.id ? 'char-picked' : ''}`}
            style={{ '--char-color': c.color }}
            onClick={() => setPicked(c)}
          >
            <span className="char-emoji">{c.emoji}</span>
            <span className="char-name">{c.name}</span>
          </button>
        ))}
      </div>
      <p className="section-label">Choose category</p>
      <div className="cat-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${category === cat ? 'cat-picked' : ''}`}
            onClick={() => setCategory(cat)}
          >{cat}</button>
        ))}
      </div>
      <button
        className={`launch-btn ${valid ? '' : 'disabled'}`}
        disabled={!valid}
        onClick={() => onDone({ name: name.trim(), character: picked, category })}
      >
        Continue to Launch Pad →
      </button>
    </div>
  );
}

// ───────────────── Home ─────────────────
function Home({ player, onStart, onLeaderboard }) {
  const totalQuestions = questions[player.category].length;
  return (
    <div className="card home-card">
      <div className="planet" />
      <div className="orbit-ring" />
      <div className="player-avatar" style={{ '--char-color': player.character.color }}>
        {player.character.emoji}
      </div>
      <div className="card-tag">Welcome, {player.name}</div>
      <h1 className="home-title">Ready to<br /><span className="grad">Launch?</span></h1>
      <p className="home-sub">
        {totalQuestions} questions · {player.category}<br />
        {TIMER_SECONDS} seconds each
      </p>
      <div className="home-stats">
        <div className="stat">
          <span className="stat-n">{totalQuestions}</span>
          <span className="stat-l">Questions</span>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <span className="stat-n">{TIMER_SECONDS}s</span>
          <span className="stat-l">Per Q</span>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <span className="stat-n">{player.character.emoji}</span>
          <span className="stat-l">{player.character.name}</span>
        </div>
      </div>
      <button className="launch-btn" onClick={onStart}>🚀 Launch Quiz</button>
      <button className="lb-btn" onClick={onLeaderboard}>🏆 View Leaderboard</button>
    </div>
  );
}

// ───────────────── Quiz ─────────────────
function Quiz({ player, onFinish }) {
  const categoryQuestions = questions[player.category];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  const q = categoryQuestions[current];

  useEffect(() => {
    if (answered) return;
    if (timeLeft === 0) { handleNext(); return; }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered]);

  function handleAnswer(option) {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === q.answer) setScore((prev) => prev + 1);
    setTimeout(handleNext, 1000);
  }

  function handleNext() {
    if (current + 1 >= categoryQuestions.length) {
      onFinish(score);
      return;
    }
    setCurrent((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(TIMER_SECONDS);
  }

  const progress = ((current + 1) / categoryQuestions.length) * 100;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft <= 5 ? '#ff6b9d' : timeLeft <= 10 ? '#ffd93d' : '#6bcb77';

  function btnClass(opt) {
    if (!answered) return 'opt-btn';
    if (opt === q.answer) return 'opt-btn correct';
    if (opt === selected) return 'opt-btn wrong';
    return 'opt-btn';
  }

  return (
    <div className="card quiz-card">
      <div className="quiz-top">
        <div className="q-player">
          <span className="q-avatar">{player.character.emoji}</span>
          <span className="q-name">{player.name}</span>
        </div>
        <span className="q-count"><strong>{current + 1}</strong>/{categoryQuestions.length}</span>
        <span className="q-score">⚡ {score} pts</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="timer-row">
        <div className="timer-track">
          <div className="timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
        </div>
        <span className="timer-txt" style={{ color: timerColor }}>{timeLeft}s</span>
      </div>
      <h2 className="q-text">{q.question}</h2>
      <div className="opts">
        {q.options.map((opt, i) => (
          <button key={i} className={btnClass(opt)} onClick={() => handleAnswer(opt)}>
            <span className="opt-label">{String.fromCharCode(65 + i)}</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ───────────────── Leaderboard ─────────────────
function Leaderboard({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://quiz-backend-tdb3.onrender.com/leaderboard')
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="card leaderboard-card">
      <div className="card-tag">🏆 Hall of Fame</div>
      <h2 className="card-title">Top <span className="grad">Commanders</span></h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="loader" />
        </div>
      ) : (
        <div className="lb-list">
          {entries.length === 0 && (
            <p className="empty-lb">No scores yet. Be the first! 🚀</p>
          )}
          {entries.map((e, i) => (
            <div key={i} className={`lb-row ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
              <span className="lb-rank">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <span className="lb-emoji">{e.character_emoji}</span>
              <div className="lb-info">
                <span className="lb-name">{e.name}</span>
                <span className="lb-cat">{e.category}</span>
              </div>
              <span className="lb-score">{e.score}/{e.total}</span>
            </div>
          ))}
        </div>
      )}
      <button className="launch-btn" style={{ marginTop: '24px' }} onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}

// ───────────────── Result ─────────────────
function Result({ player, score, total, onRestart, onLeaderboard }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="card result-card">
      <div className="res-avatar" style={{ '--char-color': player.character.color }}>
        {player.character.emoji}
      </div>
      <h2 className="res-title">Mission {pct >= 50 ? 'Complete' : 'Failed'}</h2>
      <div className="score-box">
        <span className="score-big">{score}</span>
        <span className="score-of">/{total}</span>
      </div>
      <p className="score-pct">{pct}% Accuracy</p>
      <p className="score-msg">
        {pct >= 80 ? `🏆 Elite Commander, ${player.name}!` :
         pct >= 50 ? `🔥 Good mission, ${player.name}!` :
         `📚 Back to training, ${player.name}!`}
      </p>
      <div className="res-btns">
        <button className="launch-btn" onClick={onRestart}>🔄 New Mission</button>
        <button className="lb-btn" onClick={onLeaderboard}>🏆 Leaderboard</button>
      </div>
    </div>
  );
}

// ───────────────── App ─────────────────
export default function App() {
  const [screen, setScreen] = useState('character');
  const [player, setPlayer] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  async function saveScore(score) {
    try {
      await fetch('https://quiz-backend-tdb3.onrender.com/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: player.name,
          character_name: player.character.name,
          character_emoji: player.character.emoji,
          category: player.category,
          score: score,
          total: questions[player.category].length,
        }),
      });
    } catch (e) {
      console.error('Failed to save score:', e);
    }
  }

  return (
    <div className="app">
      <Stars />
      {screen === 'character' && (
        <CharacterSelect onDone={(p) => { setPlayer(p); setScreen('home'); }} />
      )}
      {screen === 'home' && player && (
        <Home
          player={player}
          onStart={() => setScreen('quiz')}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'quiz' && player && (
        <Quiz
          player={player}
          onFinish={(s) => {
            setFinalScore(s);
            saveScore(s);
            setScreen('result');
          }}
        />
      )}
      {screen === 'result' && player && (
        <Result
          player={player}
          score={finalScore}
          total={questions[player.category].length}
          onRestart={() => { setScreen('character'); setPlayer(null); setFinalScore(0); }}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'leaderboard' && (
        <Leaderboard onBack={() => setScreen(player ? 'home' : 'character')} />
      )}
    </div>
  );
}