import React from 'react';
import { LogOut, Settings, Palette } from 'lucide-react';
import { BaseAvatar } from '../../components/shared';
import { useAuthStore } from '../../core/store/useAuthStore';
import { UserRole } from '../../types/user.types';

interface UserPanelProps {
  onOpenThemeSelector: () => void;
  onOpenAdmin: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({
  onOpenThemeSelector,
  onOpenAdmin,
}) => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 bg-slate-900/60 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-white shadow-glass select-none">
      {/* Theme Selector Palette icon */}
      <button
        onClick={onOpenThemeSelector}
        className="p-1 hover:text-indigo-400 text-slate-400 transition-colors mr-1 cursor-pointer flex items-center justify-center"
        title="Change background theme"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* Admin Dashboard gear icon */}
      {user.role === UserRole.ADMIN && (
        <button
          onClick={onOpenAdmin}
          className="p-1 hover:text-indigo-400 text-slate-400 transition-colors mr-1 cursor-pointer flex items-center justify-center"
          title="Admin Dashboard"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}
      
      <BaseAvatar src={user.avatarUrl} username={user.username} />

      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-100">{user.username}</span>
        <span className="text-[10px] text-indigo-300 font-medium">
          {user.chillPoints} chill pts
        </span>
      </div>
      
      <button 
        onClick={logout} 
        className="ml-2 p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer" 
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};
