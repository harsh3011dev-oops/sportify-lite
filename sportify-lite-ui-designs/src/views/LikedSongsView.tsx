import React from 'react';
import { Play, Heart, Clock } from 'lucide-react';
import { MOCK_TRACKS } from '../data/mockData';
import { Track } from '../types/music';
import { SongRow } from '../components/common/SongRow';
import { EmptyState } from '../components/common/EmptyState';
import { PenguinLogo } from '../components/brand/PenguinLogo';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const LikedSongsView: React.FC = () => {
  const { likedSongIds, playTrack, navigateTo } = useMusicPlayer();
  const likedTracks: Track[] = MOCK_TRACKS.filter((t) => likedSongIds.has(t.id));

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative -mx-4 md:-mx-8 -mt-6 p-6 md:p-10 overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950 via-purple-950/60 to-[#08090c]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          {/* Liked Songs Heart Badge Artwork */}
          <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-700 via-rose-600 to-amber-500 shrink-0 flex items-center justify-center">
            <Heart className="w-20 h-20 fill-white text-white drop-shadow-lg" />
            <div className="absolute bottom-2 right-2 opacity-50">
              <PenguinLogo size="sm" variant="icon" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-400">
              Playlist
            </span>

            <h1 className="text-3xl md:text-6xl font-black font-display text-white tracking-tight mt-1 mb-3">
              Liked Songs
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-slate-300 font-medium mb-6">
              <span className="text-white font-semibold">Your Library</span>
              <span aria-hidden="true">·</span>
              <span>{likedTracks.length} tracks</span>
            </div>

            {/* Play Button */}
            {likedTracks.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-sm shadow-xl shadow-emerald-500/25 transition-transform"
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                <span>Play All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Track List */}
      {likedTracks.length > 0 ? (
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
            {likedTracks.map((track, idx) => (
              <SongRow
                key={track.id}
                track={track}
                index={idx}
                queueContext={likedTracks}
                showAlbum={true}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="Songs you like will appear here"
          description="Save songs by tapping the heart icon anywhere in Sportify Lite."
          actionText="Find songs to like"
          onAction={() => navigateTo('home')}
        />
      )}
    </div>
  );
};
