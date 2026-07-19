import React from "react";
import { Home, RotateCcw, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface GameOverOverlayProps {
  score: number;
  onRetry: () => void;
  onBack: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ score, onRetry, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030014]/70 p-6 text-center z-40 backdrop-blur-sm select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 md:p-10 max-w-md w-full flex flex-col items-center border border-white/10 shadow-glass"
      >
        <div className="text-7xl mb-6 animate-float filter drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">😵‍💫</div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 uppercase tracking-tight text-glow-pink">
          {t("tetRunner.gameOverTitle")}
        </h2>
        
        <p className="text-slate-400 mb-6 text-sm font-medium italic">
          "{t("tetRunner.gameOverSub")}"
        </p>

        {/* Glowing Score Display */}
        <div className="w-full bg-slate-950/70 border border-slate-900 px-8 py-4 mb-8 rounded-2xl flex flex-col items-center shadow-inner">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Score</p>
          <span className="text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 text-glow-blue">{score}</span>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-3 gap-3 w-full" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            className="h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold flex justify-center items-center cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            title={t("common.retry")}
          >
            <RotateCcw size={22} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            className="h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white flex justify-center items-center cursor-pointer"
            title={t("common.back")}
          >
            <Home size={22} />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-14 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold flex justify-center items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <Share2 size={20} />
            <span className="hidden sm:inline text-sm uppercase">{t("tetRunner.shareText")}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
export default GameOverOverlay;
