import { Difficulty, GameConfig } from "../types";

// Cấu hình gốc (Desktop)
const DESKTOP_CONFIG: Record<Difficulty, GameConfig> = {
  easy: { rows: 9, cols: 9, mines: 10, points: 100 },
  medium: { rows: 16, cols: 16, mines: 40, points: 300 },
  hard: { rows: 16, cols: 30, mines: 99, points: 600 },
  expert: { rows: 20, cols: 30, mines: 150, points: 1000 },
};

// Cấu hình Mobile (Tối ưu chiều dọc - Vertical Scrolling UX)
const MOBILE_CONFIG: Record<Difficulty, GameConfig> = {
  easy: { rows: 12, cols: 8, mines: 12, points: 100 }, // Dễ: Vừa màn hình
  medium: { rows: 20, cols: 10, mines: 35, points: 300 }, // TB: Hơi dài tí
  hard: { rows: 30, cols: 12, mines: 75, points: 600 }, // Khó: Dài, cuộn dọc
  expert: { rows: 40, cols: 14, mines: 110, points: 1000 }, // Siêu khó: Rất dài
};

export const getResponsiveConfig = (difficulty: Difficulty): GameConfig => {
  // Check an toàn cho Server Side Rendering (nếu có dùng Next.js sau này)
  if (typeof window === "undefined") return DESKTOP_CONFIG[difficulty];

  const isMobile = window.innerWidth < 768;
  return isMobile ? MOBILE_CONFIG[difficulty] : DESKTOP_CONFIG[difficulty];
};