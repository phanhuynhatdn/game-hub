import React, { useState, useEffect, useRef } from "react";
import { Gamepad2, Trophy, X, Clock, Star, Calendar, MessageSquare, Send, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { GAME_REGISTRY } from "../core/config/gameRegistry";
import { GameCard } from "./GameCard";
import { AppRoute } from "../types/common.types";
import { InteractiveBackdrop } from "./InteractiveBackdrop";
import { fetchWithAuth } from "../core/services/api";

interface HomePageProps {
  onSelectGame: (gameId: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  const { t } = useTranslation();
  
  // Modal / Drawer States
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Dynamic game configurations (Admin control visibility)
  const [gameConfigs, setGameConfigs] = useState<any[]>([]);

  // Leaderboard States
  const [selectedGameId, setSelectedGameId] = useState("minesweeper");
  const [scores, setScores] = useState<any[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);

  // Chat States
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch active game list from backend
  useEffect(() => {
    fetchWithAuth("/games/config")
      .then((configs) => {
        if (Array.isArray(configs)) {
          setGameConfigs(configs);
        }
      })
      .catch((err) => {
        console.error("Failed to load game config visibility:", err);
      });
  }, []);

  // Filter games based on database visibility config (Default is true/visible)
  const visibleGames = GAME_REGISTRY.filter((game) => {
    const cfg = gameConfigs.find((c) => c.gameId === game.id);
    return cfg ? cfg.isActive : true;
  });

  const isGameActive = (gameId: string) => {
    const config = gameConfigs.find((c) => c.gameId === gameId);
    return config ? config.isActive : true;
  };

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showChat) {
      scrollToBottom();
    }
  }, [chatMessages, showChat]);

  // Fetch Leaderboard scores
  useEffect(() => {
    if (showLeaderboard) {
      setLoadingScores(true);
      fetchWithAuth(`/scores/${selectedGameId}`)
        .then((data) => {
          setScores(data);
        })
        .catch((err) => {
          console.error("Failed to fetch scoreboard:", err);
          setScores([]);
        })
        .finally(() => {
          setLoadingScores(false);
        });
    }
  }, [showLeaderboard, selectedGameId]);

  // Handle Real-Time Chat socket connection and history loading
  useEffect(() => {
    if (!showChat) {
      // Disconnect socket when chat is closed to save server resources
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setShowChat(false);
      setShowLoginPrompt(true);
      return;
    }

    // 1. Fetch chat message history from REST API
    setLoadingChat(true);
    fetchWithAuth("/chat/history")
      .then((history) => {
        setChatMessages(history);
      })
      .catch((err) => {
        console.error("Failed to load chat history:", err);
      })
      .finally(() => {
        setLoadingChat(false);
        setTimeout(scrollToBottom, 100);
      });

    // 2. Establish Socket.io connection with auth handshake token
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const socket = io(apiBase, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("WebSocket connected successfully");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    });

    socket.on("connect_error", (err) => {
      setIsConnected(false);
      console.error("WebSocket connection error:", err.message);
    });

    // Receive incoming broadcast messages
    socket.on("newMessage", (msg: any) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [showChat]);

  // Handle opening chat (with login verification)
  const handleOpenChat = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
    } else {
      setShowChat(true);
    }
  };

  // Send message via WebSocket
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !socketRef.current || !isConnected) return;

    socketRef.current.emit("sendMessage", { message: typedMessage });
    setTypedMessage("");
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* 1. Starry cursor-following background */}
      <InteractiveBackdrop />

      <div className="relative z-10 text-center max-w-6xl w-full py-12 md:py-20">
        
        {/* Title Block */}
        <motion.div 
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="mb-16 flex flex-col items-center select-none"
        >
          {/* Logo Frame */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-110"></div>
            <div className="relative bg-slate-900/60 border border-white/10 p-5 rounded-full shadow-glass-glow animate-float">
              <Gamepad2 className="w-14 h-14 text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-100 text-glow">
            {t("home.title")}
          </h1>
          
          {/* Subtitle Badge */}
          <div className="inline-block px-5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md">
            <p className="text-sm md:text-base font-semibold text-indigo-300 tracking-wider uppercase">
              {t("home.subtitle")}
            </p>
          </div>
        </motion.div>

        {/* Staggered Game Cards List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {visibleGames.map((game, index) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onSelect={onSelectGame} 
              index={index} 
            />
          ))}
        </div>

        {/* Banner Ad Slot Placeholder */}
        <div className="mt-16 w-full max-w-4xl mx-auto h-[90px] bg-slate-950/20 border border-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase select-none">
          <span>Advertisement Slot</span>
          <span className="text-[8px] text-slate-700 font-medium mt-1">970x90 Super Leaderboard</span>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-10 text-slate-500 text-xs font-semibold tracking-[0.2em] uppercase max-w-md mx-auto"
        >
          {t("home.footer")}
        </motion.div>
      </div>

      {/* 3. Floating Action Controls (FABs - Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row gap-3">
        {/* Chat Toggle Button */}
        {isGameActive('global-chat') ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpenChat}
            className="bg-indigo-600 hover:bg-indigo-500 p-4 rounded-full text-white shadow-glass-glow border border-indigo-400/20 cursor-pointer flex items-center justify-center"
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

        {/* Leaderboard Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowLeaderboard(true)}
          className="bg-gradient-to-r from-amber-500 to-yellow-400 p-4 rounded-full text-slate-950 shadow-glass-glow border border-yellow-300/30 cursor-pointer flex items-center justify-center"
          title="Scoreboard"
        >
          <Trophy className="w-6 h-6 font-bold" />
        </motion.button>
      </div>

      {/* 4. Glassmorphic Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
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
                onClick={() => setShowLeaderboard(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 select-none">
                <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                <h2 className="text-2xl font-black tracking-wide">LEADERBOARD</h2>
              </div>

              <div className="flex gap-2 p-1 bg-slate-950/50 border border-white/5 rounded-2xl mb-6 select-none">
                <button
                  onClick={() => setSelectedGameId("minesweeper")}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    selectedGameId === "minesweeper"
                      ? "bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 shadow-glass-glow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  💣 Minesweeper
                </button>
                <button
                  onClick={() => setSelectedGameId("tet-runner")}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    selectedGameId === "tet-runner"
                      ? "bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 shadow-glass-glow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🏃 Tet Runner
                </button>
              </div>

              <div className="min-h-[250px]">
                {loadingScores ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 select-none">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
                              index === 0 ? "bg-yellow-500/5" : ""
                            }`}
                          >
                            <td className="py-3.5 px-4 text-center font-black select-none">
                              {index === 0 ? (
                                <span className="text-yellow-400 text-glow">🥇</span>
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

      {/* 5. Authentication Required Warning Dialog Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-slate-900/90 border border-white/10 p-6 rounded-3xl w-full max-w-sm text-center shadow-glass relative text-white"
            >
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse" />
              <h3 className="text-lg font-bold mb-2">Đăng Nhập Bắt Buộc</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Bạn cần đăng nhập bằng tài khoản Google để tham gia cuộc trò chuyện trực tuyến toàn cầu.
              </p>

              <button
                onClick={() => {
                  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
                  window.location.href = `${apiBase}/auth/google`;
                }}
                className="w-full flex items-center justify-center gap-2 glass-button py-3 rounded-xl text-white font-bold shadow-glass group cursor-pointer"
              >
                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Login with Google</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Sliding Glassmorphic Global Chat Drawer (Right-aligned) */}
      <AnimatePresence>
        {showChat && (
          <>
            {/* Click-outside backdrop wrapper overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 w-full max-w-md h-full bg-slate-950/85 border-l border-white/10 backdrop-blur-xl shadow-2xl flex flex-col text-white"
            >
              {/* Drawer Header */}
              <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/30 select-none">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h3 className="font-black text-lg tracking-wide">GLOBAL CHAT</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" : "bg-rose-500"}`}></span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {isConnected ? "Connected (Live)" : "Connecting..."}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Message Scroll Pane */}
              <div 
                ref={chatScrollContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
              >
                {loadingChat ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 select-none">
                    <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-500 text-xs font-bold">Loading chat history...</span>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center select-none">
                    <span className="text-3xl mb-2">💬</span>
                    <p className="font-bold text-xs">No messages in room.</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Be the first to say hello!</p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => {
                    const isSelf = msg.user.username === localStorage.getItem("username") || 
                                   (msg.userId && msg.userId === JSON.parse(atob(localStorage.getItem("token")!.split(".")[1])).sub);

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={msg.id || index}
                        className={`flex gap-2.5 items-end ${isSelf ? "justify-end" : "justify-start"}`}
                      >
                        {/* Avatar for other users */}
                        {!isSelf && (
                          <div className="select-none flex-shrink-0">
                            {msg.user.avatarUrl ? (
                              <img src={msg.user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-800" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 text-xs uppercase">
                                {msg.user.username.charAt(0)}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message Bubble Container */}
                        <div className={`max-w-[70%] flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
                          {/* Username for other users */}
                          {!isSelf && (
                            <span className="text-[10px] text-slate-500 font-bold mb-1 ml-1 select-none">
                              {msg.user.username}
                            </span>
                          )}

                          {/* Message Bubble */}
                          <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm break-all leading-relaxed ${
                            isSelf
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none border border-indigo-500/20"
                              : "bg-slate-900/60 border border-white/5 text-slate-200 rounded-bl-none"
                          }`}>
                            {msg.message}
                          </div>

                          {/* Timestamp */}
                          <span className="text-[8px] text-slate-600 font-medium mt-1 mx-1 select-none">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Footer Form */}
              <form 
                onSubmit={handleSendMessage}
                className="p-4 border-t border-white/10 bg-slate-900/20 flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  disabled={!isConnected}
                  placeholder={isConnected ? "Write a message..." : "Connecting to chat room..."}
                  className="flex-1 bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50 text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!typedMessage.trim() || !isConnected}
                  className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600 cursor-pointer flex items-center justify-center flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;