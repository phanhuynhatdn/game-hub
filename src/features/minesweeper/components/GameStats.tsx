import React from "react";
import { Bomb, Clock, Award, RotateCcw, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GameStatsProps {
  minesLeft: number;
  time: number;
  score: number;
  onReset: () => void;
}

export const GameStats: React.FC<GameStatsProps> = ({
  minesLeft,
  time,
  score,
  onReset,
}) => {
  const { t } = useTranslation();
  const statCardClass =
    "flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg min-w-[100px] justify-center";
  const labelClass = "text-white font-black text-lg drop-shadow-md";

  return (
    <div className="flex gap-3 sm:gap-6 mb-6 justify-center flex-wrap items-center">
      {/* Mines Left - Màu đỏ */}
      <div className={`${statCardClass} bg-rose-500/20 border-rose-400/30`}>
        <div className="p-1.5 bg-rose-500 rounded-full shadow-inner">
          <Bomb className="w-4 h-4 text-white" />
        </div>
        <span className={labelClass}>{minesLeft}</span>
      </div>

      {/* Time - Màu xanh dương */}
      <div className={`${statCardClass} bg-sky-500/20 border-sky-400/30`}>
        <div className="p-1.5 bg-sky-500 rounded-full shadow-inner">
          <Clock className="w-4 h-4 text-white animate-pulse" />
        </div>
        <span className={labelClass}>{time}s</span>
      </div>

      {/* Score - Màu vàng */}
      <div className={`${statCardClass} bg-amber-500/20 border-amber-400/30`}>
        <div className="p-1.5 bg-amber-500 rounded-full shadow-inner">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <span className={labelClass}>{score}</span>
      </div>

      {/* Reset Button - Nút nổi bật */}
      <button
        onClick={onReset}
        className="group relative px-6 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl shadow-[0_4px_0_#0f766e] active:shadow-none active:translate-y-[4px] transition-all border-t border-white/30"
      >
        <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-sm">
          <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline">{t("minesweeper.playAgain")}</span>
        </div>
      </button>
    </div>
  );
};
