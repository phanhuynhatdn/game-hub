import { useState, useEffect } from 'react';

export const useGameSettings = () => {
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('game_visibility_settings');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleVisibility = (gameId: string) => {
    const newMap = { ...visibilityMap, [gameId]: !visibilityMap[gameId] };
    setVisibilityMap(newMap);
    localStorage.setItem('game_visibility_settings', JSON.stringify(newMap));
  };

  // Mặc định là hiện (true) nếu chưa có trong map
  const isVisible = (gameId: string) => visibilityMap[gameId] !== false;

  return { isVisible, toggleVisibility, visibilityMap };
};