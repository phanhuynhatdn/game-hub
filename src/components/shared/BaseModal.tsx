import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  /** Max width CSS class, e.g. 'max-w-md' */
  maxWidth?: string;
  children: React.ReactNode;
  /** Optional element to show in place of the title (e.g. an icon) */
  headerIcon?: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  maxWidth = 'max-w-md',
  children,
  headerIcon,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          onClick={(e) => {
            if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
              onClose();
            }
          }}
        >
          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.92, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className={[
              'relative w-full bg-slate-900/90 border border-white/10',
              'rounded-3xl p-6 shadow-glass text-white select-none',
              maxWidth,
            ].join(' ')}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            {(headerIcon || title) && (
              <div className="flex flex-col items-center text-center mb-5">
                {headerIcon && <div className="mb-3">{headerIcon}</div>}
                {title && (
                  <h3 className="font-black text-lg tracking-wider uppercase">{title}</h3>
                )}
                {description && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
