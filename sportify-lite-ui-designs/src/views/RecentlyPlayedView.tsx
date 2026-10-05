import React from 'react';
import { Play, Clock, Sparkles } from 'lucide-react';
import { MOCK_TRACKS } from '../data/mockData';
import { Track } from '../types/music';
import { SongRow } from '../components/common/SongRow';
import { EmptyState } from '../components/common/EmptyState';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const RecentlyPlayedView: React.FC = () => {
  const { history, playTrack, navigateTo } = useMusicPlayer();
  const displayTracks: Track[] = history.length > 0 ? history : MOCK_TRACKS.slice(0, 8);

  const handlePlayAll = () => {
    if (displayTracks.length > 0) {
      playTrack(displayTracks[0], displayTracks);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Playback Activity</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Recently Played
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Tracks you recently streamed and explored.
        </p>
      </div>

      {displayTracks.length > 0 ? (
        <section>
          <div className="grid grid-cols-12 px-4 py-2 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-6 md:col-span-5">Title</div>
            <div className="hidden md:block col-span-4">Album</div>
            <div className="col-span-5 md:col-span-2 text-right flex items-center justify-end gap-1">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1 bg-slate-900/40 p-2 rounded-2xl border border-white/[0.04]">
            {displayTracks.map((track, idx) => (
              <SongRow
                key={`recent-${track.id}-${idx}`}
                track={track}
                index={idx}
                queueContext={displayTracks}
                showAlbum={true}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="No listening history yet"
          description="Stream some songs to build your listening history."
          actionText="Browse Home"
          onAction={() => navigateTo('home')}
        />
      )}
    </div>
  );
};
