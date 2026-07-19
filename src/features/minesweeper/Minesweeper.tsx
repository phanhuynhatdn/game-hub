import React, { useState, useEffect } from 'react';
import { Home, Bomb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useMinesweeper } from './hooks/useMinesweeper';
import { DifficultySelector } from './components/DifficultySelector';
import { GameStats } from './components/GameStats';
import { GameBoard } from './components/GameBoard';
import { GameResult } from './components/GameResult';
import { Difficulty } from './types';

interface MinesweeperProps {
  onBack: () => void;
}

const Minesweeper: React.FC<MinesweeperProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  
  const { 
    board, gameStatus, flagCount, score, time, 
    explosionCell, config, handleCellClick, handleRightClick, resetGame 
  } = useMinesweeper(difficulty);

  // Trigger confetti explosion on win
  useEffect(() => {
    if (gameStatus === 'won') {
      // Fire confetti from left and right
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 28, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, animate a bit higher than they would
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [gameStatus]);

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Aurora Ambient Lighting Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none z-0 animate-aurora-2"></div>
      
      <div className="w-full max-w-5xl relative z-10">
        
        {/* Main Interface Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="bg-slate-950/45 border border-slate-900 shadow-glass rounded-3xl p-6 md:p-8 backdrop-blur-xl"
        >
          {/* Header Panel */}
          <div className="flex justify-between items-center mb-8">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack} 
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm"
              title={t('common.back')}
            >
              <Home size={22} />
            </motion.button>
            
            <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 px-6 py-2.5 rounded-2xl shadow-neon-blue">
              <Bomb className="text-indigo-400 w-6 h-6 animate-pulse hidden md:block" />
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase text-glow-blue">
                {t('minesweeper.title')}
              </h1>
            </div>
            
            <div className="w-12"></div>
          </div>

          {/* Difficulty Selector */}
          <DifficultySelector difficulty={difficulty} onChange={setDifficulty} />
          
          {/* Stats Bar */}
          <div className="my-6">
             <GameStats 
               minesLeft={config.mines - flagCount} 
               time={time} 
               score={score} 
               onReset={resetGame} 
             />
          </div>

          {/* Core Interactive Board */}
          <div className="relative">
            <GameBoard 
              board={board} 
              config={config} 
              explosionCell={explosionCell} 
              onCellClick={handleCellClick} 
              onRightClick={handleRightClick} 
            />
          </div>

          {/* Game Over / Win Display */}
          <GameResult status={gameStatus} score={score} time={time} />
        </motion.div>

        {/* Banner Ad Slot Placeholder */}
        <div className="mt-8 w-full max-w-4xl mx-auto h-[90px] bg-slate-950/20 border border-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase select-none">
          <span>Advertisement Slot</span>
          <span className="text-[8px] text-slate-700 font-medium mt-1">728x90 Leaderboard Banner</span>
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;