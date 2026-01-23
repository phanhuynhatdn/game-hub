import React, { useState, Suspense } from 'react';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { GAME_REGISTRY } from './core/config/gameRegistry';
import { HomePage } from './components/HomePage';

// Thêm 'admin' vào kiểu dữ liệu
type AppMode = 'home' | 'admin' | string;

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('home');

  // Tìm game được chọn trong registry
  const SelectedGame = GAME_REGISTRY.find(g => g.id === mode);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      {/* Route: Home */}
      {mode === 'home' && <HomePage onSelectGame={setMode} />}

      {/* Route: Admin */}
      {/* {mode === 'admin' && <AdminDashboard onBack={() => setMode('home')} />} */}

      {/* Route: Dynamic Games */}
      {SelectedGame && (
        <SelectedGame.component onBack={() => setMode('home')} />
      )}
    </Suspense>
  );
};

export default App;