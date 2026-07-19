import React, { useState, useEffect, Suspense } from 'react';
import { LogOut, Settings, Palette, Check, Lock, X } from 'lucide-react';
import { GAME_REGISTRY } from './core/config/gameRegistry';
import { HomePage } from './components/HomePage';
import { AppRoute } from './types/common.types';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { fetchWithAuth, logout } from './core/services/api';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const AVAILABLE_THEMES = [
  { id: 'COASTAL', name: 'Coastal Theme 🏖️', desc: 'Free & Default starry sky' },
  { id: 'RICEFIELD', name: 'Ricefield Theme 🌾', desc: 'Golden & green emerald field (Premium)' },
  { id: 'CYBERPUNK', name: 'Cyberpunk Theme 🌆', desc: 'Neon magenta and cyan retro grid (Premium)' },
  { id: 'SUNSET', name: 'Sunset Theme 🌅', desc: 'Warm orange and purple horizon (Premium)' },
  { id: 'SNOWY', name: 'Snowy Theme ❄️', desc: 'Chilly white and sky blue winter (Premium)' },
];

const getThemeBackdrop = (theme: string = 'COASTAL') => {
  switch (theme) {
    case 'RICEFIELD':
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-emerald-600/15 blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-amber-600/10 blur-[120px]"></div>
        </div>
      );
    case 'CYBERPUNK':
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-fuchsia-600/15 blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-cyan-500/10 blur-[120px]"></div>
        </div>
      );
    case 'SUNSET':
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-orange-500/15 blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-purple-600/10 blur-[120px]"></div>
        </div>
      );
    case 'SNOWY':
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-sky-200/10 blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-slate-400/10 blur-[120px]"></div>
        </div>
      );
    case 'COASTAL':
    default:
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-indigo-700/15 blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-rose-600/10 blur-[120px]"></div>
        </div>
      );
  }
};

const App: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AppRoute>(AppRoute.HOME);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [showThemeSelector, setShowThemeSelector] = useState<boolean>(false);
  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);

  // Parse JWT token from URL query parameters (Google OAuth callback redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      
      // Clean query parameter from URL bar
      urlParams.delete('token');
      const newRelativePathQuery = 
        window.location.pathname + 
        (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState(null, '', newRelativePathQuery);
    }

    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      setLoadingUser(true);
      fetchWithAuth('/auth/profile')
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('username', profile.username);
        })
        .catch((err) => {
          console.error('Failed to load profile:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        })
        .finally(() => {
          setLoadingUser(false);
        });
    }
  }, []);

  const handleSelectTheme = async (themeId: string) => {
    if (!user) return;
    
    // Check if theme is unlocked
    const isUnlocked = user.unlockedThemes?.includes(themeId) || themeId === 'COASTAL';
    if (!isUnlocked) {
      setShowThemeSelector(false);
      setShowDonateModal(true);
      return;
    }

    try {
      const result = await fetchWithAuth('/auth/theme', {
        method: 'PUT',
        body: JSON.stringify({ theme: themeId }),
      });
      setUser((prev: any) => ({ ...prev, activeTheme: result.activeTheme }));
    } catch (err) {
      console.error('Failed to update active background theme:', err);
    }
  };

  // Find selected game from registry
  const SelectedGame = GAME_REGISTRY.find(g => g.id === mode);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030014] flex items-center justify-center text-white text-2xl font-bold animate-pulse">Loading...</div>}>
      {/* Global Glow Backdrop Spheres */}
      {getThemeBackdrop(user?.activeTheme)}

      {/* Global Utilities Header (Top Right) */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* User Panel / Google Login Button */}
        {user ? (
          <div className="flex items-center gap-3 bg-slate-900/60 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-white shadow-glass select-none">
            {/* Theme Selector Palette icon */}
            <button
              onClick={() => setShowThemeSelector(true)}
              className="p-1 hover:text-indigo-400 text-slate-400 transition-colors mr-1 cursor-pointer flex items-center justify-center"
              title="Change background theme"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Admin Dashboard gear icon */}
            {user.role === 'ADMIN' && (
              <button
                onClick={() => setMode(AppRoute.ADMIN)}
                className="p-1 hover:text-indigo-400 text-slate-400 transition-colors mr-1 cursor-pointer flex items-center justify-center"
                title="Admin Dashboard"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-indigo-500/30" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-200 font-bold border border-indigo-500/30 text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-100">{user.username}</span>
              <span className="text-[10px] text-indigo-300 font-medium">{user.chillPoints} chill pts</span>
            </div>
            <button 
              onClick={logout} 
              className="ml-2 p-1 text-slate-400 hover:text-rose-400 transition-colors" 
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          !loadingUser && (
            <button
              onClick={() => {
                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                window.location.href = `${apiBase}/auth/google`;
              }}
              className="flex items-center gap-2 glass-button px-4 py-2.5 rounded-2xl text-white font-semibold text-sm shadow-glass group"
            >
              <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Login</span>
            </button>
          )
        )}

        {/* Global Language Switcher */}
        <LanguageSwitcher />
      </div>

      {/* Route: Home */}
      {mode === AppRoute.HOME && <HomePage onSelectGame={(route) => setMode(route as AppRoute)} />}

      {/* Route: Admin */}
      {mode === AppRoute.ADMIN && <AdminDashboard onBack={() => setMode(AppRoute.HOME)} />}

      {/* Route: Dynamic Games */}
      {SelectedGame && (
        <SelectedGame.component onBack={() => setMode(AppRoute.HOME)} />
      )}

      {/* Theme Selector Modal Popup */}
      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 text-white select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-slate-900/90 border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-glass relative"
            >
              <button
                onClick={() => setShowThemeSelector(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <Palette className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-center font-black text-lg tracking-wider uppercase mb-1">
                BACKGROUND THEMES
              </h3>
              <p className="text-center text-xs text-slate-400 mb-6">
                Choose your favorite glow scenery backdrop
              </p>

              <div className="space-y-3">
                {AVAILABLE_THEMES.map((theme) => {
                  const isUnlocked = user?.unlockedThemes?.includes(theme.id) || theme.id === 'COASTAL';
                  const isActive = user?.activeTheme === theme.id;
                  
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200 shadow-glass-glow'
                          : isUnlocked
                          ? 'bg-slate-950/30 border-white/5 text-slate-200 hover:bg-white/5'
                          : 'bg-slate-950/70 border-white/5 opacity-50 text-slate-500'
                      }`}
                    >
                      <div>
                        <span className="text-sm font-bold block">{theme.name}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">{theme.desc}</span>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Donate / Upgrade Modal Dialog */}
      <AnimatePresence>
        {showDonateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 text-white text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-slate-900/90 border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-glass relative"
            >
              <button
                onClick={() => setShowDonateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] animate-bounce" />
              <h3 className="text-lg font-black tracking-wide mb-2 uppercase">Unlock Premium Theme</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Độ màu ưa thích của bạn bằng cách donate ủng hộ để mở khóa vĩnh viễn hình nền cao cấp này!
              </p>

              <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl mb-6 text-left space-y-2">
                <p className="text-xs text-slate-400">💳 Nộp tiền ủng hộ qua MoMo/Ngân hàng:</p>
                <p className="text-sm font-bold text-slate-200">BIDV: 31210000XXXXXX</p>
                <p className="text-[10px] text-slate-500">Nội dung chuyển khoản kèm theo Username của bạn để Admin duyệt mở khóa ngay lập tức!</p>
              </div>

              <button
                onClick={() => setShowDonateModal(false)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-glass cursor-pointer"
              >
                Đồng ý
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Suspense>
  );
};

export default App;