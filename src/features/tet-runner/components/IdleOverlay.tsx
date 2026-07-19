import React from "react";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface IdleOverlayProps {
  onStart: () => void;
  onBack: () => void;
}

export const IdleOverlay: React.FC<IdleOverlayProps> = ({ onStart, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030014]/60 p-6 text-center z-20 backdrop-blur-sm select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 md:p-10 max-w-md w-full flex flex-col items-center border border-white/10 shadow-glass"
      >
        <div className="text-7xl mb-6 animate-float filter drop-shadow-[0_0_15px_rgba(253,224,71,0.3)]">🧹</div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 uppercase tracking-tight text-glow-blue">
          {t("tetRunner.title")}
        </h1>
        
        <div className="w-12 h-1 bg-indigo-500 rounded-full mb-6"></div>

        <p className="text-slate-300 mb-8 text-sm md:text-base font-medium px-4 py-2 bg-white/5 border border-white/5 rounded-2xl w-full">
          {t("home.tetRunnerDesc")}
        </p>

        <div className="flex gap-4 w-full" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="flex-grow-2 flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-bold py-3.5 rounded-2xl text-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all cursor-pointer uppercase"
          >
            {t("tetRunner.btnPlay")}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm"
          >
            <Home size={22} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
export default IdleOverlay;
