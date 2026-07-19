import React from 'react';
import type { ThemeId } from '../../types/theme.types';

export const ThemeBackdrop: React.FC<{ theme?: ThemeId | string }> = ({ theme = 'COASTAL' }) => {
  switch (theme) {
    case 'RICEFIELD':
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-emerald-600/15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-amber-600/10 blur-[120px]" />
        </div>
      );
    case 'CYBERPUNK':
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-fuchsia-600/15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>
      );
    case 'SUNSET':
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-orange-500/15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-purple-600/10 blur-[120px]" />
        </div>
      );
    case 'SNOWY':
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-sky-200/10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-slate-400/10 blur-[120px]" />
        </div>
      );
    case 'COASTAL':
    default:
      return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-indigo-700/15 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 rounded-full bg-rose-600/10 blur-[120px]" />
        </div>
      );
  }
};
