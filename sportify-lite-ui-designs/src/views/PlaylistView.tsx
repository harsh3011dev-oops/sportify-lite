import React, { useState } from 'react';
import { Play, Clock, Heart, MoreHorizontal, Shuffle, Share2 } from 'lucide-react';
import { getPlaylistById, getTrackById, MOCK_PLAYLISTS } from '../data/mockData';
import { Track } from '../types/music';
import { SongRow } from '../components/common/SongRow';
import { PenguinLogo } from '../components/brand/PenguinLogo';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface PlaylistViewProps {
  playlistId?: string;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlistId = 'playlist-chill' }) => {
  const { playTrack } = useMusicPlayer();
  const [isSaved, setIsSaved] = useState(true);

  const playlist = getPlaylistById(playlistId) || MOCK_PLAYLISTS[0];
  const tracks: Track[] = playlist.trackIds.map(getTrackById).filter(Boolean) as Track[];

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative -mx-4 md:-mx-8 -mt-6 p-6 md:p-10 overflow-hidden rounded-b-3xl">
        <div className={`absolute inset-0 bg-gradient-to-b ${playlist.coverGradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/70 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          {/* Playlist Artwork */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-slate-900 flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-br ${playlist.coverGradient}`} />
            <div className="relative z-10 opacity-40">
              <PenguinLogo size="hero" variant="icon" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">
              {playlist.isCurated ? 'Editorial Playlist' : 'Custom Playlist'}
            </span>

            <h1 className="text-2xl md:text-5xl font-black font-display text-white tracking-tight mt-1 mb-2">
              {playlist.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed mb-4">
              {playlist.description}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-slate-400 font-medium mb-6">
              <span className="text-slate-200 font-semibold">{playlist.owner}</span>
              <span aria-hidden="true">·</span>
              <span>{tracks.length} songs</span>
              <span aria-hidden="true">·</span>
              <span>{playlist.duration}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-sm shadow-xl shadow-emerald-500/25 transition-transform"
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                <span>Play</span>
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-full transition-colors ${
                  isSaved
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
                title={isSaved ? 'Saved to your library' : 'Save to library'}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-emerald-400' : ''}`} />
              </button>

              <button
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="More options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <section>
        {/* Table Column Labels */}
        <div className="grid grid-cols-12 px-4 py-2 border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-6 md:col-span-5">Title</div>
          <div className="hidden md:block col-span-4">Album</div>
          <div className="col-span-5 md:col-span-2 text-right flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1 bg-slate-900/40 p-2 rounded-2xl border border-white/[0.04]">
          {tracks.map((track, idx) => (
            <SongRow
              key={track.id}
              track={track}
              index={idx}
              queueContext={tracks}
              showAlbum={true}
            />
          ))}
          {tracks.length === 0 && (
            <p className="p-4 text-xs text-slate-400 italic">No tracks in this playlist yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};
