import React, { useState } from "react";
import { Home } from "lucide-react";
import { useMinesweeper } from "../../hooks/useMinesweeper";
import { Difficulty } from "../../types/minesweeper.types";
import { DifficultySelector } from "../shared/DifficultySelector";
import { GameStats } from "../shared/GameStats";
import { GameBoard } from "../shared/GameBoard";
import { GameResult } from "../shared/GameResult";
import { useTranslation } from "react-i18next";

export const MinesweeperGame: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const {
    board,
    gameStatus,
    flagCount,
    score,
    time,
    explosionCell,
    config,
    handleCellClick,
    handleRightClick,
    resetGame,
  } = useMinesweeper(difficulty);
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="p-3 bg-white/20 rounded-xl text-white hover:bg-white/30"
          >
            <Home />
          </button>
          <h1 className="text-4xl font-bold text-white">
            💣 {t("minesweeper.title")}
          </h1>
          <div className="w-10"></div>
        </div>
        <DifficultySelector difficulty={difficulty} onChange={setDifficulty} />
        <GameStats
          minesLeft={config.mines - flagCount}
          time={time}
          score={score}
          onReset={resetGame}
        />
        <GameBoard
          board={board}
          config={config}
          explosionCell={explosionCell}
          onCellClick={handleCellClick}
          onRightClick={handleRightClick}
        />
        <GameResult status={gameStatus} score={score} time={time} />
      </div>
    </div>
  );
};
