import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SceneTheme, WeatherType } from './types';
import { getUnlockedThemes, getSavedTheme, saveTheme, unlockTheme as saveUnlockedTheme } from './storage';
import { useIdleProgression } from './hooks/useIdleProgression';
import { useDayNightCycle } from './hooks/useDayNightCycle';
import { usePomodoro } from './hooks/usePomodoro';
import { AmbientScene } from './components/AmbientScene';
import { WeatherSystem } from './components/WeatherSystem';
import { DayNightOverlay } from './components/DayNightOverlay';
import { FloatingBubbles } from './components/bubbles/FloatingBubbles';
import { ProgressionUI } from './components/bubbles/ProgressionUI';

interface AmbientFocusProps {
  onBack: () => void;
}

const AmbientFocus: React.FC<AmbientFocusProps> = ({ onBack }) => {
  const { t } = useTranslation();
  
  // State
  const [theme, setTheme] = useState<SceneTheme>(getSavedTheme());
  const [unlockedThemes, setUnlockedThemes] = useState<SceneTheme[]>(getUnlockedThemes());
  const [weather, setWeather] = useState<WeatherType>(WeatherType.CLEAR);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Hooks
  const { chillPoints, unlockScene } = useIdleProgression();
  const { timeMode, getOverlayStyle, getBackgroundFilterStyle, toggleTimeMode } = useDayNightCycle();
  const { isActive: isFocusActive, formattedTime, toggleTimer } = usePomodoro();

  // Audio effect mock
  useEffect(() => {
    // In a real app, this would control an HTMLAudioElement
    // const audio = new Audio('/path/to/lofi.mp3');
    // if (isAudioPlaying) audio.play();
    // else audio.pause();
  }, [isAudioPlaying]);

  const handleToggleWeather = () => {
    setWeather((prev) => {
      if (prev === WeatherType.CLEAR) return WeatherType.RAIN;
      if (prev === WeatherType.RAIN) return WeatherType.SNOW;
      return WeatherType.CLEAR;
    });
  };

  const handleToggleTheme = () => {
    if (unlockedThemes.length <= 1) return;
    const currentIndex = unlockedThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % unlockedThemes.length;
    const newTheme = unlockedThemes[nextIndex];
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const handleUnlockTheme = (themeToUnlock: SceneTheme) => {
    const cost = themeToUnlock === SceneTheme.RICE_FIELD ? 60 : 0;
    const success = unlockScene(cost, () => {
      saveUnlockedTheme(themeToUnlock);
      setUnlockedThemes(getUnlockedThemes());
    });
    
    if (success) {
      setTheme(themeToUnlock);
      saveTheme(themeToUnlock);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 font-sans">
      
      {/* 1. Core Scene */}
      <AmbientScene theme={theme} filterStyle={getBackgroundFilterStyle()} />

      {/* 2. Weather Effects */}
      <WeatherSystem weather={weather} />

      {/* 3. Day/Night Lighting Overlay */}
      <DayNightOverlay style={getOverlayStyle()} />

      {/* 4. UI Layer */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <div className="pointer-events-auto h-full w-full relative">
          <ProgressionUI 
            chillPoints={chillPoints} 
            unlockedThemes={unlockedThemes} 
            onUnlockTheme={handleUnlockTheme} 
          />
          
          <FloatingBubbles 
            timeMode={timeMode}
            toggleTimeMode={toggleTimeMode}
            weather={weather}
            toggleWeather={handleToggleWeather}
            isFocusActive={isFocusActive}
            focusTimeLeft={formattedTime}
            toggleFocus={toggleTimer}
            isAudioPlaying={isAudioPlaying}
            toggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
            theme={theme}
            toggleTheme={handleToggleTheme}
            onBack={onBack}
          />
        </div>
      </div>

    </div>
  );
};

export default AmbientFocus;
