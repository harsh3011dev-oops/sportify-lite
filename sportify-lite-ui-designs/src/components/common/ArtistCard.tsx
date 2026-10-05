import React from 'react';
import { Play } from 'lucide-react';
import { Artist } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { getTrackById } from '../../data/mockData';
import { PenguinLogo } from '../brand/PenguinLogo';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { playTrack, navigateTo } = useMusicPlayer();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (artist.popularTrackIds.length > 0) {
      const firstTrack = getTrackById(artist.popularTrackIds[0]);
      if (firstTrack) {
        playTrack(firstTrack);
      }
    }
  };

  const handleCardClick = () => {
    navigateTo('artist', { artistId: artist.id });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col p-3 rounded-2xl glass-card cursor-pointer transition-all duration-300 select-none hover:shadow-xl hover:shadow-black/50"
    >
      {/* Circular Artist Avatar */}
      <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3.5 shadow-lg border border-white/5 bg-slate-900 flex items-center justify-center">
        {/* Dynamic Gradient Avatar */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${artist.avatarGradient} transition-transform duration-500 group-hover:scale-110`} />

        {/* Penguin Audio Monogram */}
        <div className="relative z-10 opacity-75 group-hover:opacity-90 transition-opacity">
          <PenguinLogo size="lg" variant="icon" />
        </div>

        {/* Circular Play Button Overlay in Bottom-Right */}
        <div className="absolute bottom-1 right-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300">
          <button
            onClick={handlePlayClick}
            className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-transform duration-150"
            title={`Play ${artist.name}`}
          >
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Artist Info */}
      <div className="min-w-0 text-left">
        <h4 className="text-sm font-semibold truncate text-slate-100 group-hover:text-emerald-400 transition-colors" title={artist.name}>
          {artist.name}
        </h4>
        <span className="text-xs text-slate-400 font-medium mt-0.5 block">
          Artist
        </span>
      </div>
    </div>
  );
};
