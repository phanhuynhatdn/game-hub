export interface GameState {
  isGameOver: boolean;
  score: number;
  highScore: number;
  isPlaying: boolean;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  type: 'dish' | 'question';
}