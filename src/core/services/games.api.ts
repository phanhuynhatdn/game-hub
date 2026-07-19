import { http } from './http.service';
import type { GameConfig } from '../../types/game.types';

/** All REST calls related to game configuration */
export const gamesApi = {
  /** GET /games/config — returns visibility config for all registered games */
  getConfig(): Promise<GameConfig[]> {
    return http.get<GameConfig[]>('/games/config');
  },
};
