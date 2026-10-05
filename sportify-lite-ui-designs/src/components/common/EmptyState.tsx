import React from 'react';
import { PenguinLogo } from '../brand/PenguinLogo';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No songs yet',
  description = 'Your library is waiting for some music to get the party started.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 ${className}`}>
      {/* Penguin Mascot in Empty State mode with ambient glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-150" />
        <PenguinLogo size="hero" variant="empty" />
      </div>

      <h3 className="text-xl font-bold font-display text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-transform active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
