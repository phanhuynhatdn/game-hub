import React from 'react';
import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneTheme } from '../../types';

interface ProgressionUIProps {
  chillPoints: number;
  unlockedThemes: SceneTheme[];
  onUnlockTheme: (theme: SceneTheme) => void;
}

export const ProgressionUI: React.FC<ProgressionUIProps> = ({ chillPoints, unlockedThemes, onUnlockTheme }) => {
  const { t } = useTranslation();
  
  const RICE_FIELD_COST = 60; // 60 points to unlock

  return (
    <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-50 select-none">
      {/* Points Counter glass panel */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel px-4 py-2 flex items-center gap-2 border border-white/10 shadow-glass bg-slate-900/40 backdrop-blur-xl"
      >
        <Leaf className="text-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]" size={16} />
        <span className="text-white font-bold text-sm">{chillPoints} pts</span>
      </motion.div>

      {/* Unlock UI overlay */}
      <AnimatePresence>
        {!unlockedThemes.includes(SceneTheme.RICE_FIELD) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-4 rounded-2xl w-64 text-sm border border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col gap-2 shadow-glass"
          >
            <p className="font-extrabold text-white text-base">🌾 Rice Field Theme</p>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">Relax for 60 minutes to unlock this peaceful scenery.</p>
            
            <motion.button 
              whileHover={chillPoints >= RICE_FIELD_COST ? { scale: 1.03 } : {}}
              whileTap={chillPoints >= RICE_FIELD_COST ? { scale: 0.97 } : {}}
              onClick={() => onUnlockTheme(SceneTheme.RICE_FIELD)}
              disabled={chillPoints < RICE_FIELD_COST}
              className={`mt-2 py-2 rounded-xl font-bold transition-all text-xs uppercase cursor-pointer ${
                chillPoints >= RICE_FIELD_COST 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white' 
                  : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              Unlock ({RICE_FIELD_COST} pts)
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProgressionUI;
