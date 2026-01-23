import { useState, useEffect, useCallback } from "react";
import { initBoard, revealCell } from "../utils";

import {
  playClickSound,
  playFlagSound,
  playExplosionSound,
  playWinSound,
} from "../../../utils/soundUtils";
import { DIFFICULTIES } from "../config";
import { Cell, Difficulty, GameStatus } from "../types";
import { getResponsiveConfig } from "../utils/configUtils";

export const useMinesweeper = (difficulty: Difficulty) => {
  const [config, setConfig] = useState(() => getResponsiveConfig(difficulty));
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
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

    if (isTimerActive && gameStatus === "playing") {
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
    setGameStatus("playing");
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
      if (gameStatus !== "playing" || board[row][col].state === "flagged")
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
              if (c.isMine) c.state = "revealed";
            }),
          );
          setBoard(newBoard);
          setGameStatus("lost");
          setIsTimerActive(false);
        }, 300);
        return;
      }

      playClickSound();
      const newBoard = revealCell(board, row, col, config);
      setBoard(newBoard);

      const revealed = newBoard
        .flat()
        .filter((c) => c.state === "revealed").length;
      const totalSafe = config.rows * config.cols - config.mines;

      if (revealed === totalSafe) {
        playWinSound();
        const timeBonus = Math.max(0, 500 - time * 2);
        setScore(config.points + timeBonus);
        setGameStatus("won");
        setIsTimerActive(false);
      }
    },
    [board, gameStatus, firstClick, config, time],
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (gameStatus !== "playing" || board[row][col].state === "revealed")
        return;

      const newBoard = board.map((r) => r.map((c) => ({ ...c })));
      playFlagSound();

      if (newBoard[row][col].state === "hidden") {
        newBoard[row][col].state = "flagged";
        setFlagCount((c) => c + 1);
      } else {
        newBoard[row][col].state = "hidden";
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
