import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, MessageSquare, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_REGISTRY } from '../core/config/gameRegistry';
import { GameCard } from './GameCard';
import { InteractiveBackdrop } from './InteractiveBackdrop';
import { useGameConfigStore } from '../core/store/useGameConfigStore';
import { useAuthStore } from '../core/store/useAuthStore';
import { LeaderboardModal } from '../features/leaderboard/LeaderboardModal';
import { ChatDrawer } from '../features/chat/ChatDrawer';
import { BaseModal, BaseButton, AdSlot } from './shared';
import { GOOGLE_AUTH_URL } from '../core/constants/api.constants';
import type { AppRoute } from '../types/common.types';

interface HomePageProps {
  onSelectGame: (gameId: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  const { user } = useAuthStore();
  const { configs, load: loadConfigs, isGameActive } = useGameConfigStore();

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const visibleGames = GAME_REGISTRY.filter((game) => isGameActive(game.id));

  const handleOpenChat = () => {
    if (!user) setShowLoginPrompt(true);
    else setShowChat(true);
  };

  const handleLoginRedirect = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      <InteractiveBackdrop />

      <div className="relative z-10 text-center max-w-6xl w-full py-12 md:py-20 flex flex-col items-center">
        {/* Top Ad Slot Banner */}
        <div className="mb-12 w-full flex justify-center">
          <AdSlot label="Top Banner Ad - 728x90" className="hidden md:flex w-[728px] h-[90px]" />
        </div>

        {/* Title Block */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className="mb-16 flex flex-col items-center select-none"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-110" />
            <div className="relative bg-slate-900/60 border border-white/10 p-5 rounded-full shadow-glass-glow animate-float">
              <Gamepad2 className="w-16 h-16 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 via-white to-purple-400 mb-4 tracking-tighter drop-shadow-sm">
            CHILL HUB
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Your premium space to relax, play ambient games, and connect with others.
          </p>
        </motion.div>

        {/* Floating Utility Buttons (Leaderboard & Chat) */}
        <div className="flex justify-center gap-6 mb-16 relative z-30">
          {isGameActive('global-chat') ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleOpenChat}
              className="bg-indigo-600 hover:bg-indigo-500 p-4 rounded-full text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-400/20 cursor-pointer flex items-center justify-center transition-colors"
              title="Global Chat Room"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.button>
          ) : (
            <button
              disabled
              className="bg-slate-800/40 p-4 rounded-full text-slate-600 border border-slate-700/20 opacity-50 cursor-not-allowed flex items-center justify-center"
              title="Chat is temporarily disabled by admin"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLeaderboard(true)}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 p-4 rounded-full text-slate-950 shadow-[0_0_20px_rgba(250,204,21,0.4)] border border-yellow-300/30 cursor-pointer flex items-center justify-center transition-all"
            title="Scoreboard"
          >
            <Trophy className="w-6 h-6 font-bold" />
          </motion.button>
        </div>

        {/* Main Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto w-full relative z-20">
          {visibleGames.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} onSelect={onSelectGame} />
          ))}
          {visibleGames.length === 0 && configs.length > 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-bold">
              All games are currently disabled by the server administrator.
            </div>
          )}
        </div>
      </div>

      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <ChatDrawer isOpen={showChat} onClose={() => setShowChat(false)} />

      {/* Auth Prompt Modal */}
      <BaseModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Đăng Nhập Bắt Buộc"
        description="Bạn cần đăng nhập bằng tài khoản Google để tham gia cuộc trò chuyện trực tuyến toàn cầu."
        headerIcon={
          <ShieldAlert className="w-12 h-12 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse" />
        }
        maxWidth="max-w-sm text-center"
      >
        <BaseButton variant="glass" onClick={handleLoginRedirect} className="w-full">
          Login with Google
        </BaseButton>
      </BaseModal>
    </div>
  );
};