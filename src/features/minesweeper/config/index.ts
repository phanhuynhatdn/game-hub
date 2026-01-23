import { Difficulty, GameConfig } from "../types";

export const DIFFICULTIES: Record<Difficulty, GameConfig> = {
  easy: { rows: 9, cols: 9, mines: 10, points: 100 },
  medium: { rows: 16, cols: 16, mines: 40, points: 300 },
  hard: { rows: 16, cols: 30, mines: 99, points: 600 },
  expert: { rows: 20, cols: 30, mines: 150, points: 1000 }
};

export const CELL_COLORS = [
  '',
  'text-blue-600',
  'text-green-600',
  'text-red-600',
  'text-purple-600',
  'text-orange-600',
  'text-cyan-600',
  'text-pink-600',
  'text-gray-600'
];