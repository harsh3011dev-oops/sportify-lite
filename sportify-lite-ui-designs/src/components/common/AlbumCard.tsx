import React from 'react';
import { Play, Disc } from 'lucide-react';
import { Album } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PenguinLogo } from '../brand/PenguinLogo';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const { playTrack, navigateTo, currentTrack, isPlaying } = useMusicPlayer();

  const isCurrentAlbum = currentTrack?.albumId === album.id;
  const isPlayingAlbum = isCurrentAlbum && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  const handleCardClick = () => {
    navigateTo('album', { albumId: album.id });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col p-3 rounded-2xl glass-card cursor-pointer transition-all duration-300 select-none hover:shadow-xl hover:shadow-black/50"
    >
      {/* Square Album Cover */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-br shadow-inner">
        <div className={`absolute inset-0 bg-gradient-to-br ${album.coverGradient} transition-transform duration-500 group-hover:scale-105`} />
        
        {/* Subtle Vinyl Disc Peeking out */}
        <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full border border-white/10 opacity-30 pointer-events-none" />

        {/* Ambient Penguin Brand Mark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
          <PenguinLogo size="lg" variant="icon" />
        </div>

        {/* Circular Play Button Overlay in Bottom-Right */}
        <div
          className={`absolute bottom-2.5 right-2.5 transition-all duration-300 transform ${
            isPlayingAlbum
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform duration-150"
            title="Play Album"
          >
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Album Info */}
      <div className="min-w-0">
        <h4 className="text-sm font-semibold truncate text-slate-100 group-hover:text-emerald-400 transition-colors" title={album.title}>
          {album.title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
          <span>{album.releaseYear}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{album.artist}</span>
        </div>
      </div>
    </div>
  );
};
