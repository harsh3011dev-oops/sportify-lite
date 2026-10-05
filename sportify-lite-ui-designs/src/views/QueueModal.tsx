import React from 'react';
import { X, Trash2, Play, Music, ListPlus } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { formatTime } from '../data/mockData';
import { PenguinLogo } from '../components/brand/PenguinLogo';

export const QueueModal: React.FC = () => {
  const {
    isQueueModalOpen,
    toggleQueueModal,
    currentTrack,
    queue,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = useMusicPlayer();

  if (!isQueueModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold font-display text-white">Play Queue</h3>
            <span className="text-xs text-slate-400">({queue.length} tracks)</span>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Clear queue"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={toggleQueueModal}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Now Playing Section */}
        {currentTrack && (
          <div className="mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Now Playing
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 relative bg-slate-800">
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.coverGradient}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-emerald-300 truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{currentTrack.artist}</div>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400">Playing</span>
            </div>
          </div>
        )}

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Up Next
          </div>

          {queue.map((track, idx) => (
            <div
              key={track.id + idx}
              className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              <div
                onClick={() => playTrack(track)}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              >
                <div className="text-xs font-mono text-slate-400 w-4">{idx + 1}</div>
                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 relative bg-slate-800">
                  <div className={`absolute inset-0 bg-gradient-to-br ${track.coverGradient}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                    {track.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{track.artist}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-slate-400 text-xs tabular-nums">
                  {formatTime(track.duration)}
                </span>
                <button
                  onClick={() => removeFromQueue(track.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from queue"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {queue.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <PenguinLogo size="sm" variant="icon" className="mb-2 opacity-50 justify-center" />
              <p>No tracks in queue. Add songs from your library or search!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
