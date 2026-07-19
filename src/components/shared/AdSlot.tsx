import React from 'react';

interface AdSlotProps {
  /** Label for the placeholder, e.g., 'Leaderboard Ad', 'Footer Ad' */
  label?: string;
  className?: string;
}

/**
 * AdSlot — Centralized placeholder for future advertisement banners.
 * Ensures consistent layout reservation to prevent Cumulative Layout Shift (CLS)
 * when ads are eventually loaded.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  label = 'Advertisement',
  className = 'w-[728px] h-[90px]', // Standard Leaderboard Ad size fallback
}) => {
  return (
    <div
      className={[
        'flex items-center justify-center rounded-xl select-none',
        'bg-slate-900/40 border border-dashed border-white/10 text-slate-500/50 text-xs font-mono tracking-widest',
        className,
      ].join(' ')}
      aria-hidden="true"
    >
      [ {label} ]
    </div>
  );
};
