import React from 'react';

interface SpinnerProps {
  /** Tailwind size classes e.g. 'w-6 h-6' */
  size?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'w-6 h-6', className = '' }) => (
  <div
    className={[
      size,
      'border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin',
      className,
    ].join(' ')}
    role="status"
    aria-label="Loading"
  />
);
