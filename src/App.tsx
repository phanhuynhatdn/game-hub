import React, { useState, useEffect, Suspense } from 'react';
import { GAME_REGISTRY } from './core/config/gameRegistry';
import { HomePage } from './components/HomePage';
import { AppRoute } from './types/common.types';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { useAuthStore } from './core/store/useAuthStore';
import { UserPanel } from './features/auth/UserPanel';
import { LoginButton } from './features/auth/LoginButton';
import { ThemeSelector } from './features/auth/ThemeSelector';
import { DonateModal } from './features/auth/DonateModal';
import { ThemeBackdrop } from './features/theme/ThemeBackdrop';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppRoute>(AppRoute.HOME);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  const { user, isLoading, bootstrap } = useAuthStore();

  // Bootstrap Auth on mount
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const SelectedGame = GAME_REGISTRY.find((g) => g.id === mode);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl font-bold animate-pulse">
          Loading...
        </div>
      }
    >
      {/* Global Background Layer */}
      <ThemeBackdrop theme={user?.activeTheme} />

      {/* Global Utilities Header (Top Right) */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {user ? (
          <UserPanel
            onOpenThemeSelector={() => setShowThemeSelector(true)}
            onOpenAdmin={() => setMode(AppRoute.ADMIN)}
          />
        ) : (
          !isLoading && <LoginButton />
        )}
        <LanguageSwitcher />
      </div>

      {/* Global Modals */}
      <ThemeSelector
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        onShowDonate={() => setShowDonateModal(true)}
      />
      <DonateModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
      />

      {/* Routing Layer */}
      {mode === AppRoute.HOME && (
        <HomePage onSelectGame={(route) => setMode(route as AppRoute)} />
      )}
      {mode === AppRoute.ADMIN && (
        <AdminDashboard onBack={() => setMode(AppRoute.HOME)} />
      )}
      {SelectedGame && (
        <SelectedGame.component onBack={() => setMode(AppRoute.HOME)} />
      )}
    </Suspense>
  );
};

export default App;