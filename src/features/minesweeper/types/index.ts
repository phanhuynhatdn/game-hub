export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export enum CellState {
  HIDDEN = 'hidden',
  REVEALED = 'revealed',
  FLAGGED = 'flagged',
}

export enum GameStatus {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}
export interface Cell {
  isMine: boolean;
  neighborMines: number;
  state: CellState;
}

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
  points: number;
}
