import React from 'react';
import { Bomb, Clock, Award, RotateCcw } from 'lucide-react';

interface GameStatsProps {
  minesLeft: number;
  time: number;
  score: number;
  onReset: () => void;
}

export const GameStats: React.FC<GameStatsProps> = ({ minesLeft, time, score, onReset }) => (
  <div className="flex gap-2 sm:gap-6 mb-4 sm:mb-6 justify-center flex-wrap">
    <div className="bg-white/20 px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 text-white font-semibold text-xs sm:text-base">
      <Bomb className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
      <span>{minesLeft}</span>
    </div>
    <div className="bg-white/20 px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 text-white font-semibold text-xs sm:text-base">
      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
      <span>{time}s</span>
    </div>
    <div className="bg-white/20 px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 text-white font-semibold text-xs sm:text-base">
      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
      <span>{score}</span>
    </div>
    <button
      onClick={onReset}
      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-base"
    >
      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="hidden sm:inline">Chơi Lại</span>
    </button>
  </div>
);