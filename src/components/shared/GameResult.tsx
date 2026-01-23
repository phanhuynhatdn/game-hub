import React from 'react';
import { Trophy } from 'lucide-react';
import { GameStatus } from '../../types/minesweeper.types';

interface GameResultProps {
  status: GameStatus;
  score: number;
  time: number;
}

export const GameResult: React.FC<GameResultProps> = ({ status, score, time }) => {
  if (status === 'playing') return null;

  return (
    <div
      className={`text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
        status === 'won'
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-bounce'
          : 'bg-gradient-to-r from-red-500 to-pink-500'
      }`}
    >
      <div className="text-3xl sm:text-4xl mb-2">
        {status === 'won' ? (
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-yellow-300 animate-spin" />
        ) : (
          '💥'
        )}
      </div>
      <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">
        {status === 'won' ? '🎉 Chiến Thắng!' : '😢 Thua Rồi!'}
      </h2>
      <p className="text-sm sm:text-xl text-white">
        {status === 'won' ? `Điểm: ${score} | Thời gian: ${time}s` : 'Cố gắng lần sau nhé!'}
      </p>
    </div>
  );
};