import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { GameMode } from '../types/minesweeper.types';

interface HomePageProps {
  onSelectGame: (game: GameMode) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="relative z-10 text-center max-w-5xl w-full">
        <div className="mb-12 animate-bounce-slow">
          <Gamepad2 className="w-24 h-24 mx-auto text-yellow-300 mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 mb-4">
            🎮 Game Hub
          </h1>
          <p className="text-xl text-white/90 font-semibold">Chọn trò chơi yêu thích của bạn!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <button
            onClick={() => onSelectGame('minesweeper')}
            className="group relative bg-gradient-to-br from-slate-700 to-purple-700 rounded-3xl p-10 shadow-2xl transition-all hover:scale-105 border-4 border-white/20"
          >
            <div className="text-7xl mb-6">💣</div>
            <h2 className="text-3xl font-bold text-white mb-4">Dò Mìn</h2>
            <p className="text-white/80">Thử thách trí tuệ với 4 cấp độ kinh điển.</p>
          </button>

          <button
            onClick={() => onSelectGame('christmas')}
            className="group relative bg-gradient-to-br from-red-700 to-green-700 rounded-3xl p-10 shadow-2xl transition-all hover:scale-105 border-4 border-white/20"
          >
            <div className="text-7xl mb-6">🎄</div>
            <h2 className="text-3xl font-bold text-white mb-4">Ghép Đôi</h2>
            <p className="text-white/80">Kết nối bạn bè ngẫu nhiên đêm Giáng Sinh.</p>
          </button>
        </div>
      </div>
    </div>
  );
};