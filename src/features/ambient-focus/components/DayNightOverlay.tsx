import React from 'react';

interface DayNightOverlayProps {
  style: React.CSSProperties;
}

export const DayNightOverlay: React.FC<DayNightOverlayProps> = ({ style }) => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none mix-blend-multiply z-20"
      style={style}
    />
  );
};
