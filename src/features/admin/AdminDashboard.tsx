import React, { useState, useEffect } from 'react';
import { Home, Eye, Users, MessageSquare, Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { http } from '../../core/services/http.service';
import { BaseButton, Spinner } from '../../components/shared';
import { OverviewTab } from './tabs/OverviewTab';
import { GamesTab } from './tabs/GamesTab';
import { UsersTab } from './tabs/UsersTab';
import { ChatsTab } from './tabs/ChatsTab';
import { ThemeUnlockModal } from './components/ThemeUnlockModal';
import { useGameConfigStore } from '../../core/store/useGameConfigStore';
import type { AdminUser } from '../../types/user.types';
import type { ChatMessage } from '../../types/chat.types';
import type { AdminStats } from '../../types/game.types';
import type { ThemeId } from '../../types/theme.types';

interface AdminDashboardProps {
  onBack: () => void;
}

type TabKey = 'stats' | 'games' | 'users' | 'chats';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('stats');
  
  // Local state for Admin Dashboard data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  // Global Game Config Store for GamesTab
  const { isGameActive, setConfig, load: loadGameConfigs } = useGameConfigStore();

  const [modifyingUser, setModifyingUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);

    try {
      const [statsData, usersData, chatData] = await Promise.all([
        http.get<AdminStats>('/admin/stats'),
        http.get<AdminUser[]>('/admin/users'),
        http.get<ChatMessage[]>('/chat/history?limit=100'),
      ]);

      setStats(statsData);
      setUsers(usersData);
      setChatHistory(chatData);
      
      // Also resync global game config cache
      await loadGameConfigs();
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleGame = async (gameId: string) => {
    try {
      const updated = await http.patch<{ gameId: string; isActive: boolean }>(`/admin/games/${gameId}`);
      // Optimistic update of global store
      setConfig(updated.gameId, updated.isActive);
    } catch (err) {
      console.error('Failed to toggle game availability:', err);
    }
  };

  const handleToggleBan = async (userId: string) => {
    try {
      const result = await http.put<{ isBanned: boolean }>(`/admin/users/${userId}/ban`, {});
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: result.isBanned } : u))
      );
      fetchAdminData(false); // Refresh counts quietly
    } catch (err) {
      console.error('Failed to moderate user status:', err);
    }
  };

  const handleToggleUserTheme = async (userId: string, themeId: ThemeId) => {
    try {
      const result = await http.put<{ unlockedThemes: string[] }>(`/admin/users/${userId}/themes`, {
        theme: themeId,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, unlockedThemes: result.unlockedThemes } : u))
      );

      if (modifyingUser?.id === userId) {
        setModifyingUser((prev) => (prev ? { ...prev, unlockedThemes: result.unlockedThemes } : null));
      }
    } catch (err) {
      console.error('Failed to toggle user background theme:', err);
    }
  };

  const handleDeleteChat = async (messageId: string) => {
    try {
      await http.delete(`/admin/chat/${messageId}`);
      setChatHistory((prev) => prev.filter((m) => m.id !== messageId));
      fetchAdminData(false);
    } catch (err) {
      console.error('Failed to delete chat message:', err);
    }
  };

  const tabOptions = [
    { id: 'stats', label: 'Overview', icon: <Trophy className="w-4 h-4" /> },
    { id: 'games', label: 'Modules', icon: <Eye className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'chats', label: 'Chat Logs', icon: <MessageSquare className="w-4 h-4" /> },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Spinner size="w-12 h-12" className="mb-4" />
        <p className="text-slate-400 font-bold animate-pulse">Loading Admin Interface...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative z-20">
      <div className="bg-slate-900/80 border-b border-white/10 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BaseButton variant="ghost" onClick={onBack} leftIcon={<Home className="w-5 h-5" />}>
              Exit Admin
            </BaseButton>
            <h1 className="text-xl font-black tracking-wider border-l border-white/10 pl-4 hidden md:block text-slate-200">
              COMMAND CENTER
            </h1>
          </div>
          
          <BaseButton
            variant="ghost"
            onClick={() => fetchAdminData(false)}
            disabled={refreshing}
            leftIcon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </BaseButton>
        </div>
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-2 shadow-glass sticky top-28">
            <div className="flex flex-row md:flex-col gap-1 overflow-x-auto">
              {tabOptions.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'stats' && <OverviewTab stats={stats} />}
              {activeTab === 'games' && <GamesTab isGameActive={isGameActive} onToggleGame={handleToggleGame} />}
              {activeTab === 'users' && (
                <UsersTab users={users} onToggleBan={handleToggleBan} onOpenThemeUnlock={setModifyingUser} />
              )}
              {activeTab === 'chats' && <ChatsTab chatHistory={chatHistory} onDeleteChat={handleDeleteChat} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ThemeUnlockModal
        user={modifyingUser}
        onClose={() => setModifyingUser(null)}
        onToggleTheme={handleToggleUserTheme}
      />
    </div>
  );
};