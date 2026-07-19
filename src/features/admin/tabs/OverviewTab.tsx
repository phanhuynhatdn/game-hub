import React from 'react';
import { Users, Trophy, MessageSquare, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AdminStats } from '../../../types/game.types';

interface OverviewTabProps {
  stats: AdminStats | null;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Users Stat */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/50 border border-indigo-500/20 p-5 rounded-2xl shadow-glass"
      >
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/20 p-3 rounded-xl border border-indigo-500/30">
            <Users className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-black text-slate-100">{stats.totalUsers}</h3>
          </div>
        </div>
      </motion.div>

      {/* Scores Stat */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-yellow-500/20 p-5 rounded-2xl shadow-glass"
      >
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-500/30">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scores</p>
            <h3 className="text-2xl font-black text-slate-100">{stats.totalScores}</h3>
          </div>
        </div>
      </motion.div>

      {/* Chats Stat */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/50 border border-rose-500/20 p-5 rounded-2xl shadow-glass"
      >
        <div className="flex items-center gap-4">
          <div className="bg-rose-500/20 p-3 rounded-xl border border-rose-500/30">
            <MessageSquare className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Messages</p>
            <h3 className="text-2xl font-black text-slate-100">{stats.totalChats}</h3>
          </div>
        </div>
      </motion.div>

      {/* Games Stat */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-900/50 border border-emerald-500/20 p-5 rounded-2xl shadow-glass"
      >
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
            <BarChart2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Games</p>
            <h3 className="text-2xl font-black text-slate-100">{stats.gamesConfig.length}</h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
