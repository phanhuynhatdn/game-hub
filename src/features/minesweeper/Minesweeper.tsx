import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  
  const { 
    board, gameStatus, flagCount, score, time, 
    explosionCell, config, handleCellClick, handleRightClick, resetGame 
  } = useMinesweeper(difficulty);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 md:p-8 border border-white/20 w-full max-w-5xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
            title={t('common.back')}
          >
            <Home />
          </button>
          <h1 className="text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500">
            {t('minesweeper.title')}
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

export default Minesweeper;