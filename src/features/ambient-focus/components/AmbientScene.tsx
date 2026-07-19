import React from 'react';
import { SceneTheme } from '../types';
import { AnimatedClouds } from './AnimatedClouds';
import { AnimatedWaves } from './AnimatedWaves';

interface AmbientSceneProps {
  theme: SceneTheme;
  filterStyle?: React.CSSProperties;
}

export const AmbientScene: React.FC<AmbientSceneProps> = ({ theme, filterStyle }) => {
  if (theme === SceneTheme.RICE_FIELD) {
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center overflow-hidden pointer-events-none transition-all duration-[2000ms]"
        style={{ backgroundImage: 'url(/images/ricefield.png)', ...filterStyle }}
      >
        <AnimatedClouds />
        {/* Subtle CSS animation overlay to add life */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent mix-blend-multiply"></div>
      </div>
    );
  }

  // Default COASTAL theme
  return (
    <div 
      className="absolute inset-0 bg-cover bg-center overflow-hidden pointer-events-none transition-all duration-[2000ms]"
      style={{ backgroundImage: 'url(/images/coastal.png)', ...filterStyle }}
    >
      <AnimatedClouds />
      
      {/* Subtle CSS animation overlay to add life */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent mix-blend-multiply"></div>
      
      <AnimatedWaves />
    </div>
  );
};
