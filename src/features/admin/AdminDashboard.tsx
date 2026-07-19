import React, { useState, useEffect } from 'react';
import { Home, Eye, EyeOff, ShieldAlert, Users, MessageSquare, Trophy, Shield, Trash2, Ban, UserCheck, RefreshCw, BarChart2 } from 'lucide-react';
import { GAME_REGISTRY } from '../../core/config/gameRegistry';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithAuth } from '../../core/services/api';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { t } = useTranslation();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'stats' | 'games' | 'users' | 'chats'>('stats');

  // Backend data states
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [gamesConfig, setGamesConfig] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // Loading & refresh states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch admin dashboard details
  const fetchAdminData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);

    try {
      // 1. Fetch system statistics
      const statsData = await fetchWithAuth('/admin/stats');
      setStats(statsData);
      setGamesConfig(statsData.gamesConfig);

      // 2. Fetch list of registered users
      const usersData = await fetchWithAuth('/admin/users');
      setUsers(usersData);

      // 3. Fetch chat history (using existing chat history or public chat)
      const chatData = await fetchWithAuth('/chat/history?limit=100');
      setChatHistory(chatData);
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

  // Moderate: Toggle Game Availability
  const handleToggleGame = async (gameId: string) => {
    try {
      const updated = await fetchWithAuth(`/admin/games/${gameId}`, { method: 'PATCH' });
      
      // Update local state
      setGamesConfig((prev) => {
        const index = prev.findIndex((g) => g.gameId === gameId);
        if (index > -1) {
          const next = [...prev];
          next[index] = updated;
          return next;
        } else {
          return [...prev, updated];
        }
      });
    } catch (err) {
      console.error('Failed to toggle game availability:', err);
    }
  };

  // Moderate: Ban / Unban User
  const handleToggleBan = async (userId: string) => {
    try {
      const result = await fetchWithAuth(`/admin/users/${userId}/ban`, { method: 'PUT' });
      
      // Update local user list
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: result.isBanned } : u))
      );
      
      // Refresh stats counters
      fetchAdminData(false);
    } catch (err) {
      console.error('Failed to moderate user status:', err);
    }
  };

  // Moderate: Delete Chat message
  const handleDeleteChat = async (messageId: string) => {
    try {
      await fetchWithAuth(`/admin/chat/${messageId}`, { method: 'DELETE' });
      
      // Remove from local list
      setChatHistory((prev) => prev.filter((m) => m.id !== messageId));
      
      // Refresh stats counters
      fetchAdminData(false);
    } catch (err) {
      console.error('Failed to delete chat message:', err);
    }
  };

  // Check visibility state of a game
  const isGameActive = (gameId: string) => {
    const config = gamesConfig.find((g) => g.gameId === gameId);
    return config ? config.isActive : true; // default true if configuration record not yet in DB
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white p-4 md:p-8 flex items-center justify-center relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-600/10 blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-5xl bg-slate-950/45 border border-slate-900 shadow-glass rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col h-[85vh]">
        
        {/* Header Block */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/30">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.4)]" />
            <div>
              <h1 className="text-xl font-black tracking-wider">ADMIN CONTROL PORTAL</h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">system administration & audits</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAdminData(false)}
              disabled={loading || refreshing}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              title="Return to lobby"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex gap-2 px-6 py-3 border-b border-white/5 bg-slate-950/20 select-none">
          {[
            { id: 'stats', label: 'Overview', icon: BarChart2 },
            { id: 'games', label: 'Games Config', icon: Eye },
            { id: 'users', label: 'User Moderator', icon: Users },
            { id: 'chats', label: 'Chat Auditor', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 shadow-glass-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Panel Pane */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-400 font-bold text-sm">Loading system records...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'stats' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Stats Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { title: 'Registered Gamers', count: stats?.totalUsers || 0, icon: Users, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' },
                      { title: 'Leaderboard Records', count: stats?.totalScores || 0, icon: Trophy, color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
                      { title: 'Shoutbox Messages', count: stats?.totalChats || 0, icon: MessageSquare, color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
                    ].map((card, idx) => {
                      const Icon = card.icon;
                      return (
                        <div key={idx} className={`p-6 rounded-2xl border ${card.color} flex items-center justify-between shadow-sm`}>
                          <div>
                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{card.title}</span>
                            <h3 className="text-3xl font-black mt-2">{card.count}</h3>
                          </div>
                          <Icon className="w-10 h-10 opacity-70" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Audit Panel Overview info */}
                  <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/20">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3">System Health Status</h3>
                    <div className="space-y-3.5 text-sm text-slate-300">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span>Database Server Host</span>
                        <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Neon Serverless (Active)
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span>WebSocket Socket.io Namespace</span>
                        <span className="font-semibold text-indigo-400">Default (Live)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Configured Games</span>
                        <span className="font-semibold text-slate-200">{GAME_REGISTRY.length} games</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'games' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl mb-4 text-xs text-slate-400 select-none">
                    💡 Disabling a game removes it instantly from the public homepage for all clients.
                  </div>
                  {GAME_REGISTRY.map((game) => {
                    const active = isGameActive(game.id);
                    return (
                      <div
                        key={game.id}
                        className="flex items-center justify-between p-4 bg-slate-900/20 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all shadow-inner"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{game.icon}</span>
                          <div>
                            <h3 className="font-bold text-slate-200">{t(game.titleKey)}</h3>
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest">{game.id}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleGame(game.id)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                            active
                              ? 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 shadow-glass-glow'
                              : 'bg-slate-900/60 border border-white/5 text-slate-500'
                          }`}
                        >
                          {active ? (
                            <>
                              <Eye className="w-4 h-4" /> Allowed
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" /> Hidden
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/20"
                >
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase select-none bg-slate-950/40">
                        <th className="py-3 px-4">Gamer</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4 text-center">Role</th>
                        <th className="py-3 px-4 text-right">Chill Pts</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-200">{u.username}</td>
                          <td className="py-3.5 px-4 text-slate-400 text-xs">{u.email}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300' : 'bg-indigo-500/10 text-indigo-400'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-semibold text-slate-300">{u.chillPoints}</td>
                          <td className="py-3.5 px-4 text-center">
                            {u.isBanned ? (
                              <span className="text-rose-500 font-bold text-xs select-none">Banned / Muted</span>
                            ) : (
                              <span className="text-emerald-500 font-medium text-xs select-none">Active</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {u.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleToggleBan(u.id)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  u.isBanned
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                                }`}
                                title={u.isBanned ? 'Unban User' : 'Ban & Mute User'}
                              >
                                {u.isBanned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'chats' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl mb-2 text-xs text-slate-400 select-none">
                    🚫 Deleting messages removes them instantly from the chat timeline globally.
                  </div>
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 select-none">
                      <span className="text-2xl mb-2">💬</span>
                      <p className="font-bold text-xs">No chat logs recorded.</p>
                    </div>
                  ) : (
                    chatHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-center justify-between p-3.5 bg-slate-900/20 border border-white/5 rounded-2xl hover:border-rose-500/20 transition-all gap-4"
                      >
                        <div className="flex gap-3 items-center min-w-0">
                          {msg.user.avatarUrl ? (
                            <img src={msg.user.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border border-slate-800" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-850 flex items-center justify-center text-slate-400 font-bold border border-slate-750 text-xs">
                              {msg.user.username.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 select-none">
                              <span className="text-xs font-bold text-indigo-300">{msg.user.username}</span>
                              <span className="text-[8px] text-slate-600 font-medium">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-200 mt-0.5 break-all">{msg.message}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteChat(msg.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};