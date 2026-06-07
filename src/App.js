import { useState, useEffect } from 'react';
import './App.css';
import questions from './questions';

const TIMER_SECONDS = 15;

function Home({ onStart }) {
  return (
    <div className="home-box">
      <div className="home-glow" />
      <div className="home-badge">⚡ Web Dev Edition</div>
      <h1 className="home-title">
        Think You Know<br />
        <span className="gradient-text">Web Dev?</span>
      </h1>
      <p className="home-sub">
        11 questions. 15 seconds each.<br />No cheating. No excuses.
      </p>
      <div className="home-stats">
        <div className="stat">
          <span className="stat-num">11</span>
          <span className="stat-label">Questions</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">15s</span>
          <span className="stat-label">Per Question</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">🏆</span>
          <span className="stat-label">Top Score</span>
        </div>
      </div>
      <button className="start-btn" onClick={onStart}>
        Start Quiz <span className="btn-arrow">→</span>
      </button>
      <p className="home-footer">Built with React · No signup needed</p>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('home');
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (screen !== 'quiz') return;
    if (answered) return;
    if (timeLeft === 0) { handleNext(); return; }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, screen]);

  function handleAnswer(option) {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === questions[current].answer) setScore(s => s + 1);
    setTimeout(() => handleNext(), 1000);
  }

  function handleNext() {
    setCurrent(p => p + 1);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(TIMER_SECONDS);
  }

  function restart() {
    setCurrent(0); setScore(0);
    setSelected(null); setAnswered(false);
    setTimeLeft(TIMER_SECONDS);
    setScreen('home');
  }

  function getButtonClass(option) {
    if (!answered) return 'option-btn';
    if (option === questions[current].answer) return 'option-btn correct';
    if (option === selected) return 'option-btn wrong';
    return 'option-btn';
  }

  if (screen === 'home') return <Home onStart={() => setScreen('quiz')} />;

  const progress = (current / questions.length) * 100;
  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft <= 5 ? '#ff6b9d' : timeLeft <= 10 ? '#ffd93d' : '#6bcb77';

  if (current >= questions.length) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-box result-box">
        <div className="result-emoji">
          {percent >= 80 ? '🏆' : percent >= 50 ? '🔥' : '📚'}
        </div>
        <h2>Quiz Complete!</h2>
        <div className="score-circle">
          <span className="score-number">{score}</span>
          <span className="score-total">/ {questions.length}</span>
        </div>
        <p className="score-percent">{percent}% Correct</p>
        <p className="score-msg">
          {percent >= 80 ? 'You actually know your stuff 🤙' : percent >= 50 ? 'Not bad, keep going 💪' : 'Touch grass, then study 😅'}
        </p>
        <div className="result-btns">
          <button className="start-btn" onClick={restart}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-box">
      <div className="quiz-header">
        <span className="question-count">
          <strong>{current + 1}</strong>/{questions.length}
        </span>
        <span className="score-badge">⚡ {score} pts</span>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="timer-row">
        <div className="timer-track">
          <div className="timer-fill" style={{ width: `${timerPercent}%`, background: timerColor }} />
        </div>
        <span className="timer-text" style={{ color: timerColor }}>{timeLeft}s</span>
      </div>

      <h2 className="question-text">{questions[current].question}</h2>

      <div className="options">
        {questions[current].options.map((option, i) => (
          <button key={i} className={getButtonClass(option)} onClick={() => handleAnswer(option)}>
            <span className="option-label">{String.fromCharCode(65 + i)}</span>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;