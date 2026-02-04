import React, { useMemo, useState } from 'react';
import './App.css';

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine the current winner and winning line (if any) for a 3x3 board. */
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
export function isDraw(squares) {
  /** Return true if the board is full and there is no winner. */
  const { winner } = calculateWinner(squares);
  return !winner && squares.every((v) => v !== null);
}

function nextPlayer(current) {
  return current === 'X' ? 'O' : 'X';
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled, highlight }) {
  /** A single tic-tac-toe square button. */
  return (
    <button
      type="button"
      className={`ttt-square ${highlight ? 'ttt-square--highlight' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square: ${value}` : 'Empty square'}
    >
      <span className={`ttt-mark ${value === 'X' ? 'ttt-mark--x' : value === 'O' ? 'ttt-mark--o' : ''}`}>
        {value}
      </span>
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onPlay, disabled, winningLine }) {
  /** 3x3 game board grid. */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => (
        <Square
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          value={value}
          onClick={() => onPlay(idx)}
          disabled={disabled || value !== null}
          highlight={winningLine?.includes(idx) ?? false}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main Tic Tac Toe game page, including score, status, board, and reset controls. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => isDraw(squares), [squares]);

  const status = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return 'It’s a draw.';
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, draw, xIsNext]);

  const canPlay = !winner && !draw;

  // PUBLIC_INTERFACE
  const handlePlay = (index) => {
    /** Place the current player's mark at the specified index (if valid). */
    if (!canPlay) return;
    if (squares[index] !== null) return;

    const next = squares.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setSquares(next);

    const outcome = calculateWinner(next);
    const didDraw = isDraw(next);

    if (outcome.winner) {
      setScore((s) => ({ ...s, [outcome.winner]: s[outcome.winner] + 1 }));
    } else if (didDraw) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
    } else {
      setXIsNext((v) => !v);
    }
  };

  // PUBLIC_INTERFACE
  const resetBoard = () => {
    /** Reset only the board to start a new round; keeps score. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const resetAll = () => {
    /** Reset board and score. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setScore({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-card" aria-label="Tic Tac Toe game">
          <header className="ttt-header">
            <div>
              <h1 className="ttt-title">Tic Tac Toe</h1>
              <p className="ttt-subtitle">Play a quick round — first to 3 in a row wins.</p>
            </div>

            <div className="ttt-score" aria-label="Scoreboard">
              <div className="ttt-scoreItem">
                <div className="ttt-scoreLabel">X wins</div>
                <div className="ttt-scoreValue">{score.X}</div>
              </div>
              <div className="ttt-scoreItem">
                <div className="ttt-scoreLabel">O wins</div>
                <div className="ttt-scoreValue">{score.O}</div>
              </div>
              <div className="ttt-scoreItem">
                <div className="ttt-scoreLabel">Draws</div>
                <div className="ttt-scoreValue">{score.draws}</div>
              </div>
            </div>
          </header>

          <div className="ttt-status" role="status" aria-live="polite">
            <span className={`ttt-statusPill ${winner ? 'ttt-statusPill--winner' : draw ? 'ttt-statusPill--draw' : ''}`}>
              {status}
            </span>
          </div>

          <div className="ttt-boardWrap">
            <Board squares={squares} onPlay={handlePlay} disabled={!canPlay} winningLine={line} />
          </div>

          <footer className="ttt-actions">
            <button type="button" className="ttt-btn ttt-btn--primary" onClick={resetBoard}>
              Reset round
            </button>
            <button type="button" className="ttt-btn ttt-btn--ghost" onClick={resetAll}>
              Reset score
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
