import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, ListPlus, Radio } from 'lucide-react';
import { Track } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { formatTime } from '../../data/mockData';
import { PenguinLogo } from '../brand/PenguinLogo';

interface SongRowProps {
  track: Track;
  index: number;
  queueContext?: Track[];
  showAlbum?: boolean;
  showDateAdded?: boolean;
}

export const SongRow: React.FC<SongRowProps> = ({
  track,
  index,
  queueContext,
  showAlbum = true,
  showDateAdded = false,
}) => {
  const { currentTrack, isPlaying, playTrack, toggleLike, isLiked, addToQueue, navigateTo } = useMusicPlayer();
  const [showMenu, setShowMenu] = useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const isPlayingThis = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  const handleRowClick = () => {
    playTrack(track, queueContext);
  };

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTrack(track, queueContext);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(track.id);
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('artist', { artistId: track.artistId });
  };

  const handleAlbumClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('album', { albumId: track.albumId });
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group grid grid-cols-12 items-center px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer select-none ${
        isCurrent
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'hover:bg-white/[0.04] text-slate-300'
      }`}
    >
      {/* Col 1: Index / Play Button */}
      <div className="col-span-1 flex items-center justify-start text-xs font-mono tabular-nums text-slate-400 w-8">
        <div className="relative w-6 h-6 flex items-center justify-center">
          {isPlayingThis ? (
            <div className="flex items-end gap-0.5 group-hover:hidden">
              <span className="w-0.5 bg-emerald-400 h-3 animate-eq-1" />
              <span className="w-0.5 bg-emerald-400 h-4 animate-eq-2" />
              <span className="w-0.5 bg-emerald-400 h-2.5 animate-eq-3" />
            </div>
          ) : (
            <span className={`group-hover:hidden ${isCurrent ? 'text-emerald-400 font-semibold' : ''}`}>
              {index + 1}
            </span>
          )}

          <button
            onClick={handlePlayToggle}
            className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full hover:scale-110 text-white transition-transform"
            title={isPlayingThis ? 'Pause' : 'Play'}
          >
            {isPlayingThis ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Col 2: Title & Artist + Cover */}
      <div className={`${showAlbum ? 'col-span-6 md:col-span-5' : 'col-span-9 md:col-span-8'} flex items-center gap-3 min-w-0 pr-3`}>
        {/* Mini Artwork */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-white/5">
          <div className={`absolute inset-0 bg-gradient-to-br ${track.coverGradient}`} />
          {track.coverImage ? (
            <img src={track.coverImage} alt={track.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <PenguinLogo size="xs" variant="icon" />
            </div>
          )}
        </div>

        {/* Title and artist */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-sm font-semibold truncate ${
                isCurrent ? 'text-emerald-400' : 'text-slate-100 group-hover:text-white'
              }`}
            >
              {track.title}
            </span>
            {track.isExplicit && (
              <span className="text-[9px] uppercase font-bold px-1 rounded bg-slate-700/80 text-slate-300">
                E
              </span>
            )}
          </div>
          <button
            onClick={handleArtistClick}
            className="text-xs text-slate-400 hover:text-slate-200 hover:underline truncate block text-left mt-0.5"
          >
            {track.artist}
          </button>
        </div>
      </div>

      {/* Col 3: Album (optional) */}
      {showAlbum && (
        <div className="hidden md:block col-span-4 min-w-0 pr-3">
          <button
            onClick={handleAlbumClick}
            className="text-xs text-slate-400 hover:text-slate-200 hover:underline truncate block text-left"
          >
            {track.album}
          </button>
        </div>
      )}

      {/* Col 4: Actions & Duration */}
      <div className={`${showAlbum ? 'col-span-5 md:col-span-2' : 'col-span-2 md:col-span-3'} flex items-center justify-end gap-3 text-xs`}>
        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          className={`p-1 rounded-md transition-colors ${
            liked
              ? 'text-rose-500 opacity-100'
              : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-200'
          }`}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Tabular Duration */}
        <span className="font-mono tabular-nums text-slate-400 text-xs w-10 text-right">
          {formatTime(track.duration)}
        </span>

        {/* Options Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-slate-400 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 bottom-full mb-1 w-44 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-30 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  addToQueue(track);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg text-left"
              >
                <ListPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add to queue</span>
              </button>
              <button
                onClick={() => {
                  navigateTo('album', { albumId: track.albumId });
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg text-left"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Go to album</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
