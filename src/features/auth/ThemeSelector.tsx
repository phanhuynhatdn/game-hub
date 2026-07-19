import React from 'react';
import { Palette, Check, Lock } from 'lucide-react';
import { BaseModal } from '../../components/shared';
import { AVAILABLE_THEMES } from '../../core/constants/themes.constants';
import { useAuthStore } from '../../core/store/useAuthStore';
import { ThemeId } from '../../types/theme.types';
import { UserRole } from '../../types/user.types';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onShowDonate: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  isOpen,
  onClose,
  onShowDonate,
}) => {
  const { user, selectTheme } = useAuthStore();

  const handleSelectTheme = (themeId: ThemeId) => {
    if (!user) return;
    
    const themeMeta = AVAILABLE_THEMES.find(t => t.id === themeId);
    if (!themeMeta) return;

    const isUnlocked = 
      user.role === UserRole.ADMIN || 
      themeMeta.isFree || 
      user.unlockedThemes.includes(themeId);

    if (!isUnlocked) {
      onClose();
      onShowDonate();
      return;
    }

    selectTheme(themeId);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="BACKGROUND THEMES"
      description="Choose your favorite glow scenery backdrop"
      headerIcon={<Palette className="w-10 h-10 text-indigo-400" />}
    >
      <div className="space-y-3">
        {AVAILABLE_THEMES.map((theme) => {
          const isUnlocked = 
            user?.role === UserRole.ADMIN || 
            theme.isFree || 
            user?.unlockedThemes.includes(theme.id);
          const isActive = user?.activeTheme === theme.id;
          
          return (
            <div
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : isUnlocked
                  ? 'bg-slate-950/30 border-white/5 text-slate-200 hover:bg-white/5'
                  : 'bg-slate-950/70 border-white/5 opacity-50 text-slate-500'
              }`}
            >
              <div>
                <span className="text-sm font-bold block">{theme.name}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{theme.description}</span>
              </div>
              <div className="flex items-center gap-2">
                {isActive ? (
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>
                ) : !isUnlocked ? (
                  <Lock className="w-4 h-4 text-slate-500" />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </BaseModal>
  );
};
