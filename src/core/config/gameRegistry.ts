import React, { lazy } from 'react';

export interface GameMetadata {
  id: string;
  titleKey: string;      // Key trong i18n
  descriptionKey: string;
  icon: string;          // Emoji hoặc Lucide icon name
  thumbnailColor: string;
  component: React.LazyExoticComponent<any>;
}

export const GAME_REGISTRY: GameMetadata[] = [
  {
    id: 'minesweeper',
    titleKey: 'home.minesweeper',
    descriptionKey: 'home.minesweeperDesc',
    icon: '💣',
    thumbnailColor: 'from-slate-700 to-purple-700',
    component: lazy(() => import('../../features/minesweeper/Minesweeper'))
  },
  {
    id: 'christmas',
    titleKey: 'home.christmas',
    descriptionKey: 'home.christmasDesc',
    icon: '🎄',
    thumbnailColor: 'from-red-700 to-green-700',
    component: lazy(() => import('../../features/christmas/ChristmasMatch'))
  }
];