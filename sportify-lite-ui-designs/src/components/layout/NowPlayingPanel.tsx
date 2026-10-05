import React from 'react';
import { X, Heart, MoreHorizontal, Radio, ListPlus } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { formatTime } from '../../data/mockData';
import { PenguinLogo } from '../brand/PenguinLogo';

export const NowPlayingPanel: React.FC = () => {
  const {
    currentTrack,
    queue,
    playTrack,
    isLiked,
    toggleLike,
    isNowPlayingOpen,
    toggleNowPlaying,
    navigateTo,
  } = useMusicPlayer();

  if (!isNowPlayingOpen || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  return (
    <aside className="w-80 h-full shrink-0 flex flex-col bg-slate-950/90 border-l border-white/[0.06] backdrop-blur-xl select-none z-20 overflow-y-auto">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/[0.04]">
        <h3 className="text-sm font-bold font-display text-white">Now Playing</h3>
        <button
          onClick={toggleNowPlaying}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 space-y-6">
        {/* Large Album Artwork */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
          <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.coverGradient}`} />
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <PenguinLogo size="xl" variant="listening" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        </div>

        {/* Current Song Details */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4
              onClick={() => navigateTo('album', { albumId: currentTrack.albumId })}
              className="text-lg font-bold text-white hover:text-emerald-400 truncate cursor-pointer transition-colors"
              title={currentTrack.title}
            >
              {currentTrack.title}
            </h4>
            <p
              onClick={() => navigateTo('artist', { artistId: currentTrack.artistId })}
              className="text-sm text-slate-400 hover:text-slate-200 truncate cursor-pointer transition-colors mt-0.5"
            >
              {currentTrack.artist}
            </p>
          </div>

          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-2 rounded-full transition-colors ${
              liked ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* About the Artist Card */}
        <div className="rounded-2xl p-4 bg-slate-900/60 border border-white/5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            About the Artist
          </div>
          <div
            onClick={() => navigateTo('artist', { artistId: currentTrack.artistId })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
              <PenguinLogo size="xs" variant="icon" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {currentTrack.artist}
              </div>
              <div className="text-xs text-slate-400">View Artist Profile →</div>
            </div>
          </div>
        </div>

        {/* Lyrics Preview if available */}
        {currentTrack.lyrics && (
          <div className="rounded-2xl p-4 bg-emerald-950/20 border border-emerald-500/20">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Lyrics Preview
            </div>
            <div className="space-y-1.5 text-xs text-slate-200 font-medium italic leading-relaxed">
              {currentTrack.lyrics.slice(0, 3).map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Up Next ({queue.length})
            </span>
          </div>

          <div className="space-y-2">
            {queue.slice(0, 5).map((track, i) => (
              <div
                key={track.id + i}
                onClick={() => playTrack(track)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 relative bg-slate-800">
                    <div className={`absolute inset-0 bg-gradient-to-br ${track.coverGradient}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                      {track.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{track.artist}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{formatTime(track.duration)}</span>
              </div>
            ))}

            {queue.length === 0 && (
              <p className="text-xs text-slate-500 italic py-2">Queue is empty</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
