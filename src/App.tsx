import React, { useState } from 'react';
import { GameMode } from './types/minesweeper.types';
import { HomePage } from './components/HomePage';
import { MinesweeperGame } from './components/games/MinesweeperGame';
import { ChristmasMatching } from './components/games/ChristmasMatching';


const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('home');

  return (
    <main className="antialiased text-slate-900">
      {gameMode === 'home' && <HomePage onSelectGame={setGameMode} />}
      {gameMode === 'minesweeper' && <MinesweeperGame onBack={() => setGameMode('home')} />}
      {gameMode === 'christmas' && <ChristmasMatching onBack={() => setGameMode('home')} />}
    </main>
  );
};

export default App;