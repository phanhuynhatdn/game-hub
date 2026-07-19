import React from 'react';
import { Ban, UserCheck, Shield } from 'lucide-react';
import { BaseAvatar, BaseButton } from '../../../components/shared';
import type { AdminUser } from '../../../types/user.types';
import { UserRole } from '../../../types/user.types';

interface UsersTabProps {
  users: AdminUser[];
  onToggleBan: (userId: string) => void;
  onOpenThemeUnlock: (user: AdminUser) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ users, onToggleBan, onOpenThemeUnlock }) => {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-glass overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase select-none bg-slate-950/80">
            <th className="py-4 px-5">User</th>
            <th className="py-4 px-5">Role</th>
            <th className="py-4 px-5 text-right">Chill Pts</th>
            <th className="py-4 px-5 text-center">Status</th>
            <th className="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                u.isBanned ? 'opacity-50' : ''
              }`}
            >
              <td className="py-3 px-5">
                <div className="flex items-center gap-3">
                  <BaseAvatar username={u.username} size="w-8 h-8" />
                  <div>
                    <p className="font-bold text-slate-200">{u.username}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-5">
                {u.role === UserRole.ADMIN ? (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                    User
                  </span>
                )}
              </td>
              <td className="py-3 px-5 text-right font-bold text-indigo-300">
                {u.chillPoints}
              </td>
              <td className="py-3 px-5 text-center">
                {u.isBanned ? (
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full">
                    BANNED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    ACTIVE
                  </span>
                )}
              </td>
              <td className="py-3 px-5 text-right space-x-2 whitespace-nowrap">
                <BaseButton
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenThemeUnlock(u)}
                >
                  Themes ({u.unlockedThemes.length})
                </BaseButton>

                {u.role !== UserRole.ADMIN && (
                  <BaseButton
                    size="sm"
                    variant={u.isBanned ? 'primary' : 'danger'}
                    leftIcon={u.isBanned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    onClick={() => onToggleBan(u.id)}
                  >
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </BaseButton>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
