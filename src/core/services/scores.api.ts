import { http } from './http.service';

/** A single leaderboard entry returned by GET /scores/:gameId */
export interface LeaderboardEntry {
  id: string;
  gameId: string;
  score: number;
  timeInSec: number | null;
  createdAt: string;
  user: {
    username: string;
    avatarUrl: string | null;
  };
}

/** Request body for submitting a new score */
export interface SubmitScorePayload {
  gameId: string;
  score: number;
  timeInSec?: number;
}

/** All REST calls related to game scores and leaderboards */
export const scoresApi = {
  /** GET /scores/:gameId — top 10 leaderboard for a given game */
  getLeaderboard(gameId: string): Promise<LeaderboardEntry[]> {
    return http.get<LeaderboardEntry[]>(`/scores/${gameId}`);
  },

  /** POST /scores — submit a new score for the authenticated user */
  submitScore(payload: SubmitScorePayload): Promise<LeaderboardEntry> {
    return http.post<LeaderboardEntry>('/scores', payload);
  },
};
