import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionClick,
  className = '',
}) => {
  return (
    <div className={`flex items-end justify-between mb-4 ${className}`}>
      <div>
        <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="text-xs font-semibold text-slate-400 hover:text-emerald-400 uppercase tracking-wider transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
