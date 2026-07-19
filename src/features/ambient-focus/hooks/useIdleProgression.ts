import { useState, useEffect } from 'react';
import { getChillPoints, saveChillPoints } from '../storage';

export const useIdleProgression = () => {
  const [chillPoints, setChillPoints] = useState<number>(0);

  useEffect(() => {
    setChillPoints(getChillPoints());

    let intervalId: ReturnType<typeof setInterval>;

    const startTimer = () => {
      intervalId = setInterval(() => {
        setChillPoints((prev) => {
          const newPoints = prev + 1;
          saveChillPoints(newPoints);
          return newPoints;
        });
      }, 60000); // 1 minute
    };

    const stopTimer = () => {
      if (intervalId) clearInterval(intervalId);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    // Initial check
    if (!document.hidden) {
      startTimer();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // For testing purposes: a mock function to spend points
  const unlockScene = (cost: number, onSuccess: () => void) => {
    if (chillPoints >= cost) {
      const newPoints = chillPoints - cost;
      setChillPoints(newPoints);
      saveChillPoints(newPoints);
      onSuccess();
      return true;
    }
    return false;
  };

  return { chillPoints, unlockScene };
};
