import React from 'react';
import { Play } from 'lucide-react';
import { Playlist } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { getTrackById } from '../../data/mockData';
import { PenguinLogo } from '../brand/PenguinLogo';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const { playTrack, navigateTo } = useMusicPlayer();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.trackIds.length > 0) {
      const firstTrack = getTrackById(playlist.trackIds[0]);
      const fullTracks = playlist.trackIds.map(getTrackById).filter(Boolean) as any;
      if (firstTrack) {
        playTrack(firstTrack, fullTracks);
      }
    }
  };

  const handleCardClick = () => {
    navigateTo('playlist', { playlistId: playlist.id });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col p-3 rounded-2xl glass-card cursor-pointer transition-all duration-300 select-none hover:shadow-xl hover:shadow-black/50"
    >
      {/* Square Playlist Artwork */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-br shadow-inner">
        <div className={`absolute inset-0 bg-gradient-to-br ${playlist.coverGradient} transition-transform duration-500 group-hover:scale-105`} />

        {/* Ambient Penguin Brand Mark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
          <PenguinLogo size="lg" variant="icon" />
        </div>

        {/* Subtle decorative mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Circular Play Button Overlay in Bottom-Right */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300">
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform duration-150"
            title={`Play ${playlist.title}`}
          >
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="min-w-0">
        <h4 className="text-sm font-semibold truncate text-slate-100 group-hover:text-emerald-400 transition-colors" title={playlist.title}>
          {playlist.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
          {playlist.description}
        </p>
      </div>
    </div>
  );
};
