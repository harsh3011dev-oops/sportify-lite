import React from 'react';
import { Play, Clock, Heart, MoreHorizontal, Disc } from 'lucide-react';
import { getAlbumById, MOCK_ALBUMS } from '../data/mockData';
import { SongRow } from '../components/common/SongRow';
import { PenguinLogo } from '../components/brand/PenguinLogo';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface AlbumViewProps {
  albumId?: string;
}

export const AlbumView: React.FC<AlbumViewProps> = ({ albumId = 'album-1' }) => {
  const { playTrack, navigateTo } = useMusicPlayer();
  const album = getAlbumById(albumId) || MOCK_ALBUMS[0];

  const handlePlayAll = () => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative -mx-4 md:-mx-8 -mt-6 p-6 md:p-10 overflow-hidden rounded-b-3xl">
        <div className={`absolute inset-0 bg-gradient-to-b ${album.coverGradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/70 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          {/* Large Square Artwork */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-slate-900 flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-br ${album.coverGradient}`} />
            <div className="relative z-10 opacity-40">
              <PenguinLogo size="hero" variant="icon" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">
              Album
            </span>

            <h1 className="text-2xl md:text-5xl font-black font-display text-white tracking-tight mt-1 mb-3">
              {album.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs md:text-sm text-slate-300 font-medium mb-3">
              <button
                onClick={() => navigateTo('artist', { artistId: album.artistId })}
                className="font-bold text-white hover:text-emerald-400 hover:underline transition-colors"
              >
                {album.artist}
              </button>
              <span aria-hidden="true">·</span>
              <span>{album.releaseYear}</span>
              <span aria-hidden="true">·</span>
              <span>{album.tracks.length} songs</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{album.duration}</span>
            </div>

            <p className="text-xs text-slate-400 max-w-xl leading-relaxed mb-6">
              {album.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-sm shadow-xl shadow-emerald-500/25 transition-transform"
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                <span>Play All</span>
              </button>

              <button
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Save album to library"
              >
                <Heart className="w-5 h-5" />
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
          <div className="col-span-9 md:col-span-8">Title</div>
          <div className="col-span-2 md:col-span-3 text-right flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1 bg-slate-900/40 p-2 rounded-2xl border border-white/[0.04]">
          {album.tracks.map((track, idx) => (
            <SongRow
              key={track.id}
              track={track}
              index={idx}
              queueContext={album.tracks}
              showAlbum={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
