import React from 'react';
import { Palette, Check, Lock, X } from 'lucide-react';
import { BaseModal } from '../../../components/shared';
import { AVAILABLE_THEMES } from '../../../core/constants/themes.constants';
import type { AdminUser } from '../../../types/user.types';
import type { ThemeId } from '../../../types/theme.types';

interface ThemeUnlockModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onToggleTheme: (userId: string, themeId: ThemeId) => void;
}

export const ThemeUnlockModal: React.FC<ThemeUnlockModalProps> = ({
  user,
  onClose,
  onToggleTheme,
}) => {
  return (
    <BaseModal
      isOpen={!!user}
      onClose={onClose}
      title="MANAGE THEMES"
      description={user ? `Manage backgrounds for ${user.username}` : ''}
      headerIcon={<Palette className="w-10 h-10 text-indigo-400" />}
    >
      {user && (
        <div className="space-y-3">
          {AVAILABLE_THEMES.map((theme) => {
            const isUnlocked = user.unlockedThemes.includes(theme.id);
            const isDefault = theme.isFree; // Cannot lock free themes usually, but up to admin logic

            return (
              <div
                key={theme.id}
                onClick={() => {
                  if (!isDefault) onToggleTheme(user.id, theme.id);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isDefault ? 'opacity-50 cursor-not-allowed bg-slate-950/70 border-white/5 text-slate-400' : 'cursor-pointer hover:bg-white/5'
                } ${
                  isUnlocked && !isDefault
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200'
                    : !isDefault
                    ? 'bg-slate-950/30 border-white/5 text-slate-300'
                    : ''
                }`}
              >
                <div>
                  <span className="text-sm font-bold block">{theme.name}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{theme.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isDefault ? (
                    <span className="text-[10px] uppercase font-bold text-slate-500">Default</span>
                  ) : isUnlocked ? (
                    <div className="flex items-center gap-2 text-indigo-400">
                      <span className="text-[10px] font-bold uppercase">Unlocked</span>
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-[10px] font-bold uppercase">Locked</span>
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </BaseModal>
  );
};
