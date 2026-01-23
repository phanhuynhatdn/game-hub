import React, { lazy } from "react";

export interface GameMetadata {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  thumbnailColor: string;
  component: React.LazyExoticComponent<any>;
}

export const GAME_REGISTRY: GameMetadata[] = [
  {
    id: "minesweeper",
    titleKey: "home.minesweeper",
    descriptionKey: "home.minesweeperDesc",
    icon: "💣",
    thumbnailColor: "from-slate-700 to-purple-700",
    component: lazy(() => import("../../features/minesweeper/Minesweeper")),
  },
  {
    id: "christmas",
    titleKey: "home.christmas",
    descriptionKey: "home.christmasDesc",
    icon: "🎄",
    thumbnailColor: "from-red-700 to-green-700",
    component: lazy(() => import("../../features/christmas/ChristmasMatch")),
  },
  {
    id: "tet-runner",
    titleKey: "home.tetRunner",
    descriptionKey: "home.tetRunnerDesc",
    icon: "🧹",
    thumbnailColor: "from-red-500 to-yellow-500",
    component: lazy(() => import("../../features/tet-runner/TetRunner")),
  },
];
