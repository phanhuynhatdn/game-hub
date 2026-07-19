import React, { lazy } from "react";
import { AppRoute } from "../../types/common.types";

export interface GameMetadata {
  id: AppRoute;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  thumbnailColor: string;
  component: React.LazyExoticComponent<any>;
}

export const GAME_REGISTRY: GameMetadata[] = [
  {
    id: AppRoute.AMBIENT_FOCUS,
    titleKey: "home.ambientFocus",
    descriptionKey: "home.ambientFocusDesc",
    icon: "🧘",
    thumbnailColor: "from-blue-400 to-indigo-600",
    component: lazy(() => import("../../features/ambient-focus/AmbientFocus")),
  },
  {
    id: AppRoute.MINESWEEPER,
    titleKey: "home.minesweeper",
    descriptionKey: "home.minesweeperDesc",
    icon: "💣",
    thumbnailColor: "from-slate-700 to-purple-700",
    component: lazy(() => import("../../features/minesweeper/Minesweeper")),
  },
  {
    id: AppRoute.CHRISTMAS,
    titleKey: "home.christmas",
    descriptionKey: "home.christmasDesc",
    icon: "🎄",
    thumbnailColor: "from-red-700 to-green-700",
    component: lazy(() => import("../../features/christmas/ChristmasMatch")),
  },
  {
    id: AppRoute.TET_RUNNER,
    titleKey: "home.tetRunner",
    descriptionKey: "home.tetRunnerDesc",
    icon: "🧹",
    thumbnailColor: "from-red-500 to-yellow-500",
    component: lazy(() => import("../../features/tet-runner/TetRunner")),
  },
];
