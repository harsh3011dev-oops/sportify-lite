import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, ListPlus, Radio } from 'lucide-react';
import { Track } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PenguinLogo } from '../brand/PenguinLogo';

interface SongCardProps {
  track: Track;
  queueContext?: Track[];
}

export const SongCard: React.FC<SongCardProps> = ({ track, queueContext }) => {
  const { currentTrack, isPlaying, playTrack, toggleLike, isLiked, addToQueue, navigateTo } = useMusicPlayer();
  const [showMenu, setShowMenu] = useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const isPlayingThis = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playTrack(track, queueContext);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(track.id);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('artist', { artistId: track.artistId });
  };

  const handleCardClick = () => {
    playTrack(track, queueContext);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col p-3 rounded-2xl glass-card cursor-pointer transition-all duration-300 select-none hover:shadow-xl hover:shadow-black/50"
    >
      {/* Square Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-br shadow-inner">
        {/* Dynamic Stylized Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${track.coverGradient} transition-transform duration-500 group-hover:scale-105`} />
        
        {track.coverImage ? (
          <img src={track.coverImage} alt={track.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
            <PenguinLogo size="lg" variant="icon" />
          </div>
        )}

        {/* Subtle Vinyl Radial Texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/60 pointer-events-none" />

        {/* Equalizer Waveform if playing */}
        {isPlayingThis && (
          <div className="absolute top-2 left-2 flex items-end gap-0.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30">
            <span className="w-1 bg-emerald-400 rounded-full animate-eq-1" />
            <span className="w-1 bg-emerald-400 rounded-full animate-eq-2" />
            <span className="w-1 bg-emerald-400 rounded-full animate-eq-3" />
            <span className="w-1 bg-emerald-400 rounded-full animate-eq-4" />
          </div>
        )}

        {/* Like Button on Artwork Top-Right */}
        <button
          onClick={handleLikeClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 ${
            liked
              ? 'bg-rose-500/20 text-rose-400 opacity-100'
              : 'bg-black/40 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/60'
          }`}
          title={liked ? 'Remove from Liked' : 'Save to Liked Songs'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Circular Play Button Overlay in Bottom-Right */}
        <div
          className={`absolute bottom-2.5 right-2.5 transition-all duration-300 transform ${
            isPlayingThis
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform duration-150"
            title={isPlayingThis ? 'Pause' : 'Play'}
          >
            {isPlayingThis ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Track Details */}
      <div className="flex items-start justify-between gap-1 min-w-0">
        <div className="min-w-0 flex-1">
          <h4
            className={`text-sm font-semibold truncate transition-colors ${
              isCurrent ? 'text-emerald-400' : 'text-slate-100 group-hover:text-white'
            }`}
            title={track.title}
          >
            {track.title}
          </h4>
          <button
            onClick={handleArtistClick}
            className="text-xs text-slate-400 hover:text-slate-200 truncate mt-0.5 text-left block w-full transition-colors"
            title={track.artist}
          >
            {track.artist}
          </button>
        </div>

        {/* 3-Dot Options Menu */}
        <div className="relative shrink-0">
          <button
            onClick={handleMenuClick}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              className="absolute right-0 bottom-full mb-1 w-44 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-1.5 z-30 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  addToQueue(track);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <ListPlus className="w-4 h-4 text-emerald-400" />
                <span>Add to queue</span>
              </button>
              <button
                onClick={() => {
                  toggleLike(track.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                <span>{liked ? 'Liked' : 'Like song'}</span>
              </button>
              <button
                onClick={() => {
                  navigateTo('album', { albumId: track.albumId });
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Go to album</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
