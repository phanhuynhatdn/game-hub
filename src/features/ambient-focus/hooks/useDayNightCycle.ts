import { useState, useEffect, useRef } from 'react';
import { TimeMode } from '../types';

export const useDayNightCycle = (initialMode: TimeMode = TimeMode.SYNC) => {
  const [timeMode, setTimeMode] = useState<TimeMode>(initialMode);
  // hour from 0 to 24 (float)
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours() + new Date().getMinutes() / 60);
  const pausedHourRef = useRef<number>(currentHour);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (timeMode === TimeMode.SYNC) {
        const now = new Date();
        setCurrentHour(now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600);
      } else if (timeMode === TimeMode.TIMELAPSE) {
        // 1 in-game day = 1 minute real time -> 24 hours = 60,000ms
        // 1 hour = 60,000 / 24 = 2500ms
        // hours per ms = 24 / 60000
        setCurrentHour((prev) => {
          let next = prev + delta * (24 / 60000);
          if (next >= 24) next -= 24;
          return next;
        });
      } else if (timeMode === TimeMode.PAUSE) {
        // Do nothing, freeze at current hour
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [timeMode]);

  // Calculate overlay styling based on currentHour
  const getOverlayStyle = () => {
    let background = 'transparent';
    let opacity = 0;

    // Dawn: 5 - 8
    // Noon: 8 - 16
    // Dusk: 16 - 19
    // Night: 19 - 5

    if (currentHour >= 5 && currentHour < 8) {
      // Dawn to Morning
      const progress = (currentHour - 5) / 3;
      background = 'linear-gradient(to top, #fcd34d, #f472b6)'; // yellow to pink
      opacity = 0.4 * (1 - progress); // fades out
    } else if (currentHour >= 8 && currentHour < 16) {
      // Noon (Clear)
      background = 'transparent';
      opacity = 0;
    } else if (currentHour >= 16 && currentHour < 19) {
      // Dusk
      const progress = (currentHour - 16) / 3;
      background = 'linear-gradient(to top, #fb923c, #c084fc)'; // orange to purple
      opacity = 0.4 * progress; // fades in
    } else {
      // Night (19 - 24, 0 - 5)
      let progress = 0;
      if (currentHour >= 19) {
        progress = (currentHour - 19) / 5; // 0 to 1
      } else {
        progress = 1; // full dark between 0 and 5
      }
      background = '#0f172a'; // slate-900
      opacity = 0.4 + (0.4 * progress); // darkens to 0.8
    }

    return {
      background,
      opacity,
      transition: timeMode === TimeMode.SYNC ? 'opacity 1s ease-in-out' : 'none'
    };
  };

  const getBackgroundFilterStyle = () => {
    let brightness = 100;
    let sepia = 0;
    let hueRotate = 0;
    let contrast = 100;
    let saturate = 100;

    if (currentHour >= 5 && currentHour < 8) {
      // Dawn
      const progress = (currentHour - 5) / 3;
      brightness = 60 + (40 * progress);
      sepia = 40 * (1 - progress);
      saturate = 100 + (20 * progress);
    } else if (currentHour >= 8 && currentHour < 16) {
      // Noon
      brightness = 100;
      sepia = 0;
      hueRotate = 0;
      contrast = 100;
      saturate = 120;
    } else if (currentHour >= 16 && currentHour < 19) {
      // Dusk
      const progress = (currentHour - 16) / 3;
      brightness = 100 - (30 * progress);
      sepia = 50 * progress;
      hueRotate = -20 * progress;
      contrast = 100 + (10 * progress);
      saturate = 120 + (30 * progress); // Very warm and saturated
    } else {
      // Night
      let progress = 0;
      if (currentHour >= 19) {
        progress = (currentHour - 19) / 5; 
      } else {
        progress = 1; 
      }
      brightness = 70 - (40 * progress);
      contrast = 110 + (10 * progress);
      saturate = 150 - (70 * progress);
      hueRotate = -20 + (40 * progress); // shifts to deeper blue
    }

    return {
      filter: `brightness(${brightness}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg) contrast(${contrast}%) saturate(${saturate}%)`,
      transition: timeMode === TimeMode.SYNC ? 'filter 1s ease-in-out' : 'none'
    };
  };

  const toggleTimeMode = () => {
    setTimeMode((prev) => {
      if (prev === TimeMode.SYNC) return TimeMode.TIMELAPSE;
      if (prev === TimeMode.TIMELAPSE) return TimeMode.PAUSE;
      return TimeMode.SYNC;
    });
  };

  return { timeMode, currentHour, getOverlayStyle, getBackgroundFilterStyle, toggleTimeMode };
};
