/** A single game visibility entry from the database */
export interface GameConfig {
  gameId: string;
  isActive: boolean;
}

/** Admin stats returned by GET /admin/stats */
export interface AdminStats {
  totalUsers: number;
  totalScores: number;
  totalChats: number;
  gamesConfig: GameConfig[];
}
