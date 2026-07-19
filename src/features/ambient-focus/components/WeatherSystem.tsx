import React, { useMemo } from 'react';
import { WeatherType } from '../types';

interface WeatherSystemProps {
  weather: WeatherType;
}

export const WeatherSystem: React.FC<WeatherSystemProps> = ({ weather }) => {
  const particles = useMemo(() => Array.from({ length: 30 }), []);

  if (weather === WeatherType.CLEAR) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${weather === WeatherType.RAIN ? 0.5 + Math.random() * 0.5 : 2 + Math.random() * 3}s`;
        const animationDelay = `-${Math.random() * 2}s`;
        const opacity = 0.3 + Math.random() * 0.5;

        if (weather === WeatherType.RAIN) {
          return (
            <div
              key={i}
              className="absolute top-[-20px] w-[2px] h-[20px] bg-blue-200 animate-fall"
              style={{ left, animationDuration, animationDelay, opacity }}
            />
          );
        }

        // Snow
        return (
          <div
            key={i}
            className="absolute top-[-20px] text-white animate-fall"
            style={{ left, animationDuration, animationDelay, opacity, fontSize: `${10 + Math.random() * 10}px` }}
          >
            ❄
          </div>
        );
      })}
    </div>
  );
};
