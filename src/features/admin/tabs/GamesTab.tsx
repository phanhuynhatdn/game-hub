import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { GAME_REGISTRY } from '../../../core/config/gameRegistry';
import { BaseButton } from '../../../components/shared';

interface GamesTabProps {
  isGameActive: (gameId: string) => boolean;
  onToggleGame: (gameId: string) => void;
}

export const GamesTab: React.FC<GamesTabProps> = ({ isGameActive, onToggleGame }) => {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-glass">
      <div className="p-5 border-b border-white/5 bg-slate-900/80">
        <h3 className="font-bold text-slate-200">Game & Feature Modules</h3>
        <p className="text-xs text-slate-400 mt-1">
          Enable or disable features globally across all clients instantly.
        </p>
      </div>

      <div className="divide-y divide-white/5">
        {/* Global Chat Toggle Entry */}
        <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl">💬</div>
            <div>
              <h4 className="font-bold text-slate-200">Global Chat Room</h4>
              <p className="text-xs text-slate-400">Main lobby chatting system</p>
            </div>
          </div>
          <BaseButton
            size="sm"
            variant={isGameActive('global-chat') ? 'danger' : 'primary'}
            leftIcon={isGameActive('global-chat') ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            onClick={() => onToggleGame('global-chat')}
          >
            {isGameActive('global-chat') ? 'Disable' : 'Enable'}
          </BaseButton>
        </div>

        {/* Dynamic Games */}
        {GAME_REGISTRY.map((game, index) => {
          const active = isGameActive(game.id);
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={game.id}
              className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl">
                  {game.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{game.titleKey.replace('home.', '')}</h4>
                  <p className="text-xs text-slate-400">{game.descriptionKey.replace('home.', '')}</p>
                </div>
              </div>
              <BaseButton
                size="sm"
                variant={active ? 'danger' : 'primary'}
                leftIcon={active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                onClick={() => onToggleGame(game.id)}
              >
                {active ? 'Disable' : 'Enable'}
              </BaseButton>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
