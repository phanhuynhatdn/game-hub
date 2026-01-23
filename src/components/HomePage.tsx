import React from 'react';
import { Gamepad2, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GameMode } from '../types/common.types';

interface HomePageProps {
  onSelectGame: (game: GameMode) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => onSelectGame('admin')}
          className="p-3 bg-white/5 hover:bg-white/10 text-white/20 hover:text-white/80 rounded-full transition-all backdrop-blur-sm"
          title="Admin Settings"
        >
          <Settings size={20} />
        </button>
      </div> */}
      <button 
        onClick={toggleLanguage}
        className="fixed top-4 right-4 bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md z-50"
      >
        {i18n.language === 'vi' ? '🇺🇸 EN' : '🇻🇳 VI'}
      </button>
      <div className="relative z-10 text-center max-w-5xl w-full">
        <div className="mb-12 animate-bounce-slow">
          <Gamepad2 className="w-24 h-24 mx-auto text-yellow-300 mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-white/90 font-semibold">{t('home.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <button
            onClick={() => onSelectGame('minesweeper')}
            className="group relative bg-gradient-to-br from-slate-700 to-purple-700 rounded-3xl p-10 shadow-2xl transition-all hover:scale-105 border-4 border-white/20"
          >
            <div className="text-7xl mb-6">💣</div>
            <h2 className="text-3xl font-bold text-white mb-4">{t('minesweeper.title')}</h2>
            <p className="text-white/80">{t('home.minesweeperDesc')}</p>
          </button>

          <button
            onClick={() => onSelectGame('christmas')}
            className="group relative bg-gradient-to-br from-red-700 to-green-700 rounded-3xl p-10 shadow-2xl transition-all hover:scale-105 border-4 border-white/20"
          >
            <div className="text-7xl mb-6">🎄</div>
            <h2 className="text-3xl font-bold text-white mb-4">{t('christmas.title')}</h2>
            <p className="text-white/80">{t('home.christmasDesc')}</p>
          </button>
        </div>
      </div>
    </div>
  );
};