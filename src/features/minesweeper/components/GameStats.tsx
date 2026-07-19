import React from "react";
import { Bomb, Clock, RotateCcw, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

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
    "flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md min-w-[110px] justify-center transition-all duration-300";
  const labelClass = "text-slate-100 font-extrabold text-lg select-none";

  return (
    <div className="flex gap-4 mb-6 justify-center flex-wrap items-center">
      {/* Mines Left Widget */}
      <div className={`${statCardClass} hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]`}>
        <div className="p-1.5 bg-rose-500/10 border border-rose-500/30 rounded-lg">
          <Bomb className="w-4 h-4 text-rose-400 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]" />
        </div>
        <span className={labelClass}>{minesLeft}</span>
      </div>

      {/* Time Widget */}
      <div className={`${statCardClass} hover:border-sky-500/30 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]`}>
        <div className="p-1.5 bg-sky-500/10 border border-sky-500/30 rounded-lg">
          <Clock className="w-4 h-4 text-sky-400 animate-pulse drop-shadow-[0_0_4px_rgba(56,189,248,0.4)]" />
        </div>
        <span className={labelClass}>{time}s</span>
      </div>

      {/* Score Widget */}
      <div className={`${statCardClass} hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]`}>
        <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <Trophy className="w-4 h-4 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]" />
        </div>
        <span className={labelClass}>{score}</span>
      </div>

      {/* Play Again (Reset) Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="group relative px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
        <span>{t("minesweeper.playAgain")}</span>
      </motion.button>
    </div>
  );
};
export default GameStats;
