import { useState, useEffect, useCallback } from 'react';
import { Cell, Difficulty, GameStatus } from '../types/minesweeper.types';

import { initBoard, revealCell } from '../utils/minesweeperUtils';
import { playSound } from '../utils/soundUtils';
import { DIFFICULTIES } from '../types/minesweeperConfig';

export const useMinesweeper = (difficulty: Difficulty) => {
  const config = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState<Cell[][]>(() => initBoard(config));
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [explosionCell, setExplosionCell] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && gameStatus === 'playing') {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, gameStatus]);

  const resetGame = useCallback(() => {
    setBoard(initBoard(config));
    setGameStatus('playing');
    setFlagCount(0);
    setScore(0);
    setTime(0);
    setIsTimerActive(false);
    setFirstClick(true);
    setExplosionCell(null);
  }, [config]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus !== 'playing' || board[row][col].state === 'flagged') return;

      if (firstClick) {
        const newBoard = initBoard(config, row, col);
        const revealed = revealCell(newBoard, row, col, config);
        setBoard(revealed);
        setFirstClick(false);
        setIsTimerActive(true);
        playSound(400, 0.1);
        return;
      }

      if (board[row][col].isMine) {
        playSound(100, 0.5, 'sawtooth');
        setExplosionCell({ row, col });
        setTimeout(() => {
          const newBoard = board.map(r => r.map(c => ({ ...c })));
          newBoard.forEach(r =>
            r.forEach(c => {
              if (c.isMine) c.state = 'revealed';
            })
          );
          setBoard(newBoard);
          setGameStatus('lost');
          setIsTimerActive(false);
        }, 300);
        return;
      }

      playSound(600, 0.1);
      const newBoard = revealCell(board, row, col, config);
      setBoard(newBoard);

      const revealed = newBoard.flat().filter(c => c.state === 'revealed').length;
      const totalSafe = config.rows * config.cols - config.mines;

      if (revealed === totalSafe) {
        playSound(800, 0.3);
        const timeBonus = Math.max(0, 500 - time * 2);
        setScore(config.points + timeBonus);
        setGameStatus('won');
        setIsTimerActive(false);
      }
    },
    [board, gameStatus, firstClick, config, time]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (gameStatus !== 'playing' || board[row][col].state === 'revealed') return;

      const newBoard = board.map(r => r.map(c => ({ ...c })));
      if (newBoard[row][col].state === 'hidden') {
        newBoard[row][col].state = 'flagged';
        setFlagCount(c => c + 1);
        playSound(700, 0.08);
      } else {
        newBoard[row][col].state = 'hidden';
        setFlagCount(c => c - 1);
        playSound(500, 0.08);
      }
      setBoard(newBoard);
    },
    [board, gameStatus]
  );

  return {
    board,
    gameStatus,
    flagCount,
    score,
    time,
    explosionCell,
    config,
    handleCellClick,
    handleRightClick,
    resetGame
  };
};