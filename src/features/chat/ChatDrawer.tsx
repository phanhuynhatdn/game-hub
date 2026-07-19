import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatInput } from './ChatInput';
import { ChatSocket } from '../../core/services/socket.service';
import { chatApi } from '../../core/services/chat.api';
import { useAuthStore } from '../../core/store/useAuthStore';
import type { ChatMessage } from '../../types/chat.types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const socketRef = useRef<ChatSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 && isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle connection lifecycle and history loading
  useEffect(() => {
    if (!isOpen || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    let isMounted = true;

    // Load History
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const history = await chatApi.getHistory();
        if (isMounted) {
          setMessages(history);
          setTimeout(scrollToBottom, 100);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };
    fetchHistory();

    // Establish Socket
    const chatSocket = new ChatSocket();
    socketRef.current = chatSocket;
    
    chatSocket.connect({
      onStatusChange: (status) => {
        if (isMounted) setIsConnected(status);
      },
      onMessage: (msg) => {
        if (isMounted) {
          setMessages((prev) => [...prev, msg]);
        }
      },
      onError: (errStr) => {
        console.error('Chat error:', errStr);
      },
    });

    return () => {
      isMounted = false;
      chatSocket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isOpen, user]);

  const handleSendMessage = (text: string) => {
    if (socketRef.current?.isConnected) {
      socketRef.current.sendMessage(text);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 w-full max-w-md h-full bg-slate-950/85 border-l border-white/10 backdrop-blur-xl shadow-2xl flex flex-col text-white"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/30 select-none">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
                <div>
                  <h3 className="font-black text-lg tracking-wide">GLOBAL CHAT</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isConnected
                          ? 'bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      {isConnected ? 'Connected (Live)' : 'Connecting...'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 select-none">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-500 text-xs font-bold">Loading history...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center select-none">
                  <span className="text-3xl mb-2">💬</span>
                  <p className="font-bold text-xs">No messages in room.</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">Be the first to say hello!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isSelf = user ? user.username === msg.user.username : false;
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                    >
                      <ChatMessageItem msg={msg} isSelf={isSelf} />
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <ChatInput onSend={handleSendMessage} disabled={!isConnected} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
