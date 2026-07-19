import React from 'react';

interface BaseAvatarProps {
  src?: string | null;
  username: string;
  /** Tailwind size class, defaults to 'w-8 h-8' */
  size?: string;
  className?: string;
}

/**
 * BaseAvatar — shows user avatar image if available, else falls back
 * to a styled monogram (first letter of username).
 */
export const BaseAvatar: React.FC<BaseAvatarProps> = ({
  src,
  username,
  size = 'w-8 h-8',
  className = '',
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={`${username}'s avatar`}
        referrerPolicy="no-referrer"
        className={[size, 'rounded-full border border-indigo-500/30 object-cover', className].join(' ')}
      />
    );
  }

  return (
    <div
      className={[
        size,
        'rounded-full bg-indigo-600/30 flex items-center justify-center',
        'text-indigo-200 font-bold border border-indigo-500/30 text-sm shrink-0',
        className,
      ].join(' ')}
      aria-label={`${username}'s avatar`}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
};
