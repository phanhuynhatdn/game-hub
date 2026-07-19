import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]',
  ghost:
    'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-white/10',
  danger:
    'bg-rose-600/80 hover:bg-rose-500 text-white border border-rose-500/30',
  glass:
    'bg-slate-900/60 hover:bg-slate-800/70 text-white border border-white/10 backdrop-blur-md shadow-glass',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  );
};
