import React from 'react';
import { Home, Eye, EyeOff, Settings } from 'lucide-react';
import { useGameSettings } from '../../core/hooks/useGameSettings';
import { GAME_REGISTRY } from '../../core/config/gameRegistry';
import { useTranslation } from 'react-i18next';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { isVisible, toggleVisibility } = useGameSettings();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-800 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <Settings className="animate-spin-slow" />
            <h1 className="text-2xl font-bold">Admin Management</h1>
          </div>
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <Home />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {GAME_REGISTRY.map(game => (
            <div key={game.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{game.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800">{t(game.titleKey)}</h3>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">{game.id}</p>
                </div>
              </div>
              
              <button 
                onClick={() => toggleVisibility(game.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all ${
                  isVisible(game.id) 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isVisible(game.id) ? <><Eye size={18}/> Visible</> : <><EyeOff size={18}/> Hidden</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};