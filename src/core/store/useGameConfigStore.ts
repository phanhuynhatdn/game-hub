import { create } from 'zustand';
import { gamesApi } from '../services/games.api';
import type { GameConfig } from '../../types/game.types';

interface GameConfigState {
  configs: GameConfig[];
  isLoaded: boolean;

  /** Fetch game configs from the backend */
  load: () => Promise<void>;

  /** Check whether a specific game is currently active */
  isGameActive: (gameId: string) => boolean;

  /** Optimistically update a game config after admin toggle */
  setConfig: (gameId: string, isActive: boolean) => void;
}

export const useGameConfigStore = create<GameConfigState>((set, get) => ({
  configs: [],
  isLoaded: false,

  load: async () => {
    try {
      const configs = await gamesApi.getConfig();
      set({ configs, isLoaded: true });
    } catch (err) {
      console.error('[GameConfigStore] Failed to load game configs:', err);
    }
  },

  isGameActive: (gameId: string) => {
    const config = get().configs.find((c) => c.gameId === gameId);
    // Default to active if no record found in DB
    return config ? config.isActive : true;
  },

  setConfig: (gameId: string, isActive: boolean) => {
    set((state) => {
      const existing = state.configs.find((c) => c.gameId === gameId);
      if (existing) {
        return {
          configs: state.configs.map((c) =>
            c.gameId === gameId ? { ...c, isActive } : c,
          ),
        };
      }
      return { configs: [...state.configs, { gameId, isActive }] };
    });
  },
}));
