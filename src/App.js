import { useState } from 'react';
import './App.css';
import questions from './questions';

function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  function handleAnswer(option) {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
    setCurrent(current + 1);
  }

  if (current >= questions.length) {
    return (
      <div className="quiz-box">
        <h2>Quiz Complete!</h2>
        <p>Your score: {score} / {questions.length}</p>
        <button onClick={() => { setCurrent(0); setScore(0); }}>
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-box">
      <h2>{questions[current].question}</h2>
      {questions[current].options.map((option, i) => (
        <button key={i} onClick={() => handleAnswer(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

export default App;