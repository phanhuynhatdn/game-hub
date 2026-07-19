import React from 'react';
import { Clock, FastForward, Pause, CloudRain, Snowflake, Sun, Volume2, VolumeX, Timer, Home, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { TimeMode, WeatherType, SceneTheme } from '../../types';

interface FloatingBubblesProps {
  timeMode: TimeMode;
  toggleTimeMode: () => void;
  weather: WeatherType;
  toggleWeather: () => void;
  isFocusActive: boolean;
  focusTimeLeft: string;
  toggleFocus: () => void;
  isAudioPlaying: boolean;
  toggleAudio: () => void;
  theme: SceneTheme;
  toggleTheme: () => void;
  onBack: () => void;
}

export const FloatingBubbles: React.FC<FloatingBubblesProps> = ({
  timeMode, toggleTimeMode,
  weather, toggleWeather,
  isFocusActive, focusTimeLeft, toggleFocus,
  isAudioPlaying, toggleAudio,
  theme, toggleTheme,
  onBack
}) => {
  // Common bubble styling
  const baseBubbleClass = "w-14 h-14 rounded-full flex items-center justify-center text-white backdrop-blur-xl border border-white/10 bg-slate-900/40 shadow-glass transition-all duration-300 cursor-pointer relative overflow-hidden";

  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-50 select-none">
      
      {/* Home Bubble */}
      <motion.button 
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack} 
        className={baseBubbleClass}
        title="Go to Lobby"
      >
        <Home size={20} />
      </motion.button>

      {/* Theme Switching Bubble */}
      <motion.button 
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme} 
        className={baseBubbleClass}
        title="Change Scene Theme"
      >
        <Map size={20} className="text-emerald-300 drop-shadow-[0_0_4px_rgba(110,231,183,0.4)]" />
      </motion.button>

      {/* Audio Play/Mute Bubble */}
      <motion.button 
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleAudio} 
        className={`${baseBubbleClass} ${isAudioPlaying ? 'bg-pink-500/20 border-pink-500/30 shadow-neon-pink' : ''}`}
        title={isAudioPlaying ? "Mute Lo-Fi Audio" : "Play Lo-Fi Audio"}
      >
        {isAudioPlaying ? (
          <Volume2 size={20} className="text-pink-400 animate-pulse drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]" />
        ) : (
          <VolumeX size={20} className="text-slate-400" />
        )}
      </motion.button>

      {/* Weather Cycling Bubble */}
      <motion.button 
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleWeather} 
        className={`${baseBubbleClass} ${weather !== WeatherType.CLEAR ? 'bg-sky-500/20 border-sky-500/30 shadow-neon-blue' : ''}`}
        title="Cycle Weather Type"
      >
        {weather === WeatherType.CLEAR && <Sun size={20} className="text-yellow-400" />}
        {weather === WeatherType.RAIN && <CloudRain size={20} className="text-sky-400 animate-bounce-short" />}
        {weather === WeatherType.SNOW && <Snowflake size={20} className="text-blue-300 animate-spin" style={{ animationDuration: '6s' }} />}
      </motion.button>

      {/* Pomodoro Focus Timer Bubble */}
      <motion.button 
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleFocus} 
        className={`group ${baseBubbleClass} ${isFocusActive ? 'bg-red-500/20 border-red-500/30 shadow-neon-pink' : ''}`}
        title="Toggle Pomodoro Timer"
      >
        <Timer size={20} className={isFocusActive ? "text-red-400 animate-pulse" : "text-slate-200"} />
        {/* Hover overlay timer text */}
        <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-950/80 border border-slate-800 backdrop-blur-xl rounded-xl text-white font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-glass">
          {focusTimeLeft}
        </div>
      </motion.button>

      {/* Day/Night Time Mode Bubble */}
      <motion.button 
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTimeMode} 
        className={baseBubbleClass}
        title="Cycle Time Flow Mode"
      >
        {timeMode === TimeMode.SYNC && <Clock size={20} className="text-slate-300" />}
        {timeMode === TimeMode.TIMELAPSE && <FastForward size={20} className="text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]" />}
        {timeMode === TimeMode.PAUSE && <Pause size={20} className="text-rose-400 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]" />}
      </motion.button>

    </div>
  );
};
export default FloatingBubbles;
