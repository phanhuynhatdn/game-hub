import React from 'react';
import { Difficulty } from '../../types/minesweeper.types';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (diff: Difficulty) => void;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '😊 Dễ' },
  { value: 'medium', label: '😐 TB' },
  { value: 'hard', label: '😰 Khó' },
  { value: 'expert', label: '💀 Siêu Khó' }
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onChange
}) => (
  <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 justify-center flex-wrap">
    {DIFFICULTY_OPTIONS.map(({ value, label }) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={`px-2 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold transition-all duration-300 ${
          difficulty === value
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);