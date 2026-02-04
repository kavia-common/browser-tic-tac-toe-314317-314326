import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { calculateWinner, isDraw } from './App';

test('renders game title', () => {
  render(<App />);
  expect(screen.getByText(/tic tac toe/i)).toBeInTheDocument();
});

test('calculateWinner detects row win', () => {
  const squares = ['X', 'X', 'X', null, null, null, null, null, null];
  const result = calculateWinner(squares);
  expect(result.winner).toBe('X');
  expect(result.line).toEqual([0, 1, 2]);
});

test('isDraw detects draw when board full and no winner', () => {
  const squares = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
  expect(calculateWinner(squares).winner).toBeNull();
  expect(isDraw(squares)).toBe(true);
});
