export type GameMode = 'home' | 'minesweeper' | 'christmas';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type CellState = 'hidden' | 'revealed' | 'flagged';
export type GameStatus = 'playing' | 'won' | 'lost';

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

export interface Pair {
  names: string[];
}