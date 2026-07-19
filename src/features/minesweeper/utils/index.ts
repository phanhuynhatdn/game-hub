import { Cell, CellState, GameConfig } from "../types";

export const initBoard = (
  config: GameConfig,
  safeRow?: number,
  safeCol?: number,
): Cell[][] => {
  const board: Cell[][] = Array(config.rows)
    .fill(null)
    .map(() =>
      Array(config.cols)
        .fill(null)
        .map(() => ({
          isMine: false,
          neighborMines: 0,
          state: CellState.HIDDEN,
        })),
    );

  let placed = 0;
  while (placed < config.mines) {
    const r = Math.floor(Math.random() * config.rows);
    const c = Math.floor(Math.random() * config.cols);
    const isSafe =
      safeRow !== undefined &&
      safeCol !== undefined &&
      Math.abs(r - safeRow) <= 1 &&
      Math.abs(c - safeCol) <= 1;

    if (!board[r][c].isMine && !isSafe) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  // Calculate neighbor mines
  for (let r = 0; r < config.rows; r++) {
    for (let c = 0; c < config.cols; c++) {
      if (!board[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < config.rows &&
              nc >= 0 &&
              nc < config.cols &&
              board[nr][nc].isMine
            ) {
              count++;
            }
          }
        }
        board[r][c].neighborMines = count;
      }
    }
  }

  return board;
};

export const revealCell = (
  board: Cell[][],
  row: number,
  col: number,
  config: GameConfig,
): Cell[][] => {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));

  const reveal = (r: number, c: number) => {
    if (r < 0 || r >= config.rows || c < 0 || c >= config.cols) return;
    if (newBoard[r][c].state !== CellState.HIDDEN) return;

    newBoard[r][c].state = CellState.REVEALED;

    if (newBoard[r][c].neighborMines === 0 && !newBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          reveal(r + dr, c + dc);
        }
      }
    }
  };

  reveal(row, col);
  return newBoard;
};
