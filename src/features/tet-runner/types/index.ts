export enum TetRunnerState {
  IDLE = 'IDLE',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  text: string;
  passed: boolean;
}