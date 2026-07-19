import { useState, useEffect, useCallback } from "react";
import { initBoard, revealCell } from "../utils";
import { scoresApi } from "../../../core/services/scores.api";

import {
  playClickSound,
  playFlagSound,
  playExplosionSound,
  playWinSound,
} from "../../../utils/soundUtils";
import { Cell, Difficulty, GameStatus, CellState } from "../types";
import { getResponsiveConfig } from "../utils/configUtils";

export const useMinesweeper = (difficulty: Difficulty) => {
  const [config, setConfig] = useState(() => getResponsiveConfig(difficulty));
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
  const [flagCount, setFlagCount] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [explosionCell, setExplosionCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isTimerActive && gameStatus === GameStatus.PLAYING) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, gameStatus]);

  const resetGame = useCallback(() => {
    const currentConfig = getResponsiveConfig(difficulty);
    setConfig(currentConfig);
    setBoard(initBoard(currentConfig));
    setGameStatus(GameStatus.PLAYING);
    setFlagCount(0);
    setScore(0);
    setTime(0);
    setIsTimerActive(false);
    setFirstClick(true);
    setExplosionCell(null);
  }, [difficulty]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus !== GameStatus.PLAYING || board[row][col].state === CellState.FLAGGED)
        return;

      if (firstClick) {
        const newBoard = initBoard(config, row, col);
        const revealed = revealCell(newBoard, row, col, config);
        setBoard(revealed);
        setFirstClick(false);
        setIsTimerActive(true);
        playClickSound();
        return;
      }

      if (board[row][col].isMine) {
        playExplosionSound();
        setExplosionCell({ row, col });
        setTimeout(() => {
          const newBoard = board.map((r) => r.map((c) => ({ ...c })));
          newBoard.forEach((r) =>
            r.forEach((c) => {
              if (c.isMine) c.state = CellState.REVEALED;
            }),
          );
          setBoard(newBoard);
          setGameStatus(GameStatus.LOST);
          setIsTimerActive(false);
        }, 300);
        return;
      }

      playClickSound();
      const newBoard = revealCell(board, row, col, config);
      setBoard(newBoard);

      const revealed = newBoard
        .flat()
        .filter((c) => c.state === CellState.REVEALED).length;
      const totalSafe = config.rows * config.cols - config.mines;

      if (revealed === totalSafe) {
        playWinSound();
        const timeBonus = Math.max(0, 500 - time * 2);
        const finalScore = config.points + timeBonus;
        setScore(finalScore);
        setGameStatus(GameStatus.WON);
        setIsTimerActive(false);

        // Submit score to backend if logged in
        if (localStorage.getItem('token')) {
          scoresApi.submitScore({
            gameId: 'minesweeper',
            score: finalScore,
            timeInSec: time,
          }).catch((err: any) => console.error('Failed to submit score:', err));
        }
      }
    },
    [board, gameStatus, firstClick, config, time],
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (gameStatus !== GameStatus.PLAYING || board[row][col].state === CellState.REVEALED)
        return;

      const newBoard = board.map((r) => r.map((c) => ({ ...c })));
      playFlagSound();

      if (newBoard[row][col].state === CellState.HIDDEN) {
        newBoard[row][col].state = CellState.FLAGGED;
        setFlagCount((c) => c + 1);
      } else {
        newBoard[row][col].state = CellState.HIDDEN;
        setFlagCount((c) => c - 1);
      }
      setBoard(newBoard);
    },
    [board, gameStatus],
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
    resetGame,
  };
};
