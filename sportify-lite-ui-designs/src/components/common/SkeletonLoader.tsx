import React from 'react';

export const CardSkeleton: React.FC<{ isCircle?: boolean }> = ({ isCircle = false }) => {
  return (
    <div className="p-3 rounded-2xl glass-card animate-pulse">
      <div
        className={`w-full aspect-square bg-slate-800/80 mb-3 ${
          isCircle ? 'rounded-full' : 'rounded-xl'
        }`}
      />
      <div className="h-4 bg-slate-800 rounded-md w-3/4 mb-2" />
      <div className="h-3 bg-slate-800/60 rounded-md w-1/2" />
    </div>
  );
};

export const RowSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl animate-pulse bg-white/[0.01]">
      <div className="flex items-center gap-3.5 flex-1">
        <div className="w-5 h-4 bg-slate-800 rounded" />
        <div className="w-10 h-10 bg-slate-800 rounded-lg shrink-0" />
        <div className="space-y-1.5 flex-1 max-w-xs">
          <div className="h-3.5 bg-slate-800 rounded w-2/3" />
          <div className="h-2.5 bg-slate-800/60 rounded w-1/3" />
        </div>
      </div>
      <div className="hidden md:block w-32 h-3 bg-slate-800/50 rounded mr-8" />
      <div className="w-10 h-3 bg-slate-800/50 rounded" />
    </div>
  );
};

export const SectionSkeleton: React.FC<{ cardCount?: number; isCircle?: boolean }> = ({
  cardCount = 4,
  isCircle = false,
}) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="h-6 w-48 bg-slate-800/70 rounded-md animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: cardCount }).map((_, i) => (
          <CardSkeleton key={i} isCircle={isCircle} />
        ))}
      </div>
    </div>
  );
};
