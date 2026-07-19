import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Star, Clock, Calendar } from 'lucide-react';
import { BaseModal } from '../../components/shared';
import { scoresApi } from '../../core/services/scores.api';
import type { LeaderboardEntry } from '../../core/services/scores.api';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [selectedGameId, setSelectedGameId] = useState('minesweeper');
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setLoadingScores(true);
      
      scoresApi
        .getLeaderboard(selectedGameId)
        .then((data) => {
          if (isMounted) setScores(data);
        })
        .catch((err) => {
          console.error('Failed to fetch scoreboard:', err);
          if (isMounted) setScores([]);
        })
        .finally(() => {
          if (isMounted) setLoadingScores(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, selectedGameId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-slate-900/80 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-glass relative text-white"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 select-none">
              <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
              <h2 className="text-2xl font-black tracking-wide">LEADERBOARD</h2>
            </div>

            {/* Game Tab Selector */}
            <div className="flex gap-2 p-1 bg-slate-950/50 border border-white/5 rounded-2xl mb-6 select-none">
              <button
                onClick={() => setSelectedGameId('minesweeper')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  selectedGameId === 'minesweeper'
                    ? 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💣 Minesweeper
              </button>
              <button
                onClick={() => setSelectedGameId('tet-runner')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  selectedGameId === 'tet-runner'
                    ? 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏃 Tet Runner
              </button>
            </div>

            {/* Scores Table */}
            <div className="min-h-[250px]">
              {loadingScores ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 select-none">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-400 font-bold text-sm">Loading Scores...</span>
                </div>
              ) : scores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 select-none">
                  <span className="text-4xl mb-3">👻</span>
                  <p className="font-bold text-sm">No scores submitted yet.</p>
                  <p className="text-xs mt-1 text-slate-600">Be the first to secure a spot!</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/20">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-400 text-xs font-bold uppercase select-none bg-slate-950/40">
                        <th className="py-3 px-4 text-center">Rank</th>
                        <th className="py-3 px-4">Player</th>
                        <th className="py-3 px-4 text-right">Score</th>
                        <th className="py-3 px-4 text-right">Time</th>
                        <th className="py-3 px-4 text-right hidden sm:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((item, index) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          key={item.id}
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                            index === 0 ? 'bg-yellow-500/5' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center font-black select-none">
                            {index === 0 ? (
                              <span className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">🥇</span>
                            ) : index === 1 ? (
                              <span className="text-slate-300">🥈</span>
                            ) : index === 2 ? (
                              <span className="text-amber-600">🥉</span>
                            ) : (
                              index + 1
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-200">
                            {item.user.username}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-indigo-400 flex items-center justify-end gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-current text-indigo-400" />
                            {item.score}
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-300 font-semibold">
                            <span className="flex items-center justify-end gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {item.timeInSec}s
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-500 text-xs hidden sm:table-cell">
                            <span className="flex items-center justify-end gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-600" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
