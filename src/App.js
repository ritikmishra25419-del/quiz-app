import { useState } from 'react';
import './App.css';
import questions from './questions';

function App() {
  const [current, setCurrent] = useState(0);

  return (
    <div>
      <h2>{questions[current].question}</h2>
      {questions[current].options.map((option, i) => (
        <button key={i}>{option}</button>
      ))}
    </div>
  );
}

export default App;
