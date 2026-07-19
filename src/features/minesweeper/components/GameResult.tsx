import React from "react";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { GameStatus } from "../types";

interface GameResultProps {
  status: GameStatus;
  score: number;
  time: number;
}

export const GameResult: React.FC<GameResultProps> = ({
  status,
  score,
  time,
}) => {
  if (status === "playing") return null;
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className={`w-full max-w-md mx-auto text-center p-6 rounded-2xl border backdrop-blur-xl shadow-glass mt-8 ${
          status === "won"
            ? "bg-emerald-950/40 border-emerald-500/30 shadow-neon-green"
            : "bg-rose-950/40 border-rose-500/30 shadow-neon-pink"
        }`}
      >
        <div className="text-4xl mb-3">
          {status === "won" ? (
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2 animate-bounce">
              <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <span className="text-3xl animate-pulse">💥</span>
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
          {status === "won" ? t("minesweeper.win") : t("minesweeper.lose")}
        </h2>
        
        <p className="text-slate-300 font-medium">
          {status === "won" ? (
            <>
              {t("minesweeper.stats.score")}: <span className="text-emerald-400 font-bold">{score}</span>
              {" | "}
              {t("minesweeper.stats.time")}: <span className="text-emerald-400 font-bold">{time}s</span>
            </>
          ) : (
            <span className="text-rose-300">{t("common.retry") || "Better luck next time!"}</span>
          )}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
export default GameResult;
