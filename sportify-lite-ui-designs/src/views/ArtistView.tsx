import React from 'react';
import { Play, CheckCircle, Users, Heart } from 'lucide-react';
import { getArtistById, MOCK_TRACKS, MOCK_ALBUMS, MOCK_ARTISTS, formatPlays } from '../data/mockData';
import { SongRow } from '../components/common/SongRow';
import { AlbumCard } from '../components/common/AlbumCard';
import { ArtistCard } from '../components/common/ArtistCard';
import { PenguinLogo } from '../components/brand/PenguinLogo';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { SectionHeader } from '../components/common/SectionHeader';

interface ArtistViewProps {
  artistId?: string;
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artistId = 'artist-1' }) => {
  const { playTrack } = useMusicPlayer();
  const artist = getArtistById(artistId) || MOCK_ARTISTS[0];

  // Get popular tracks for this artist
  const popularTracks = MOCK_TRACKS.filter((t) => t.artistId === artist.id);
  // Get albums by this artist
  const artistAlbums = MOCK_ALBUMS.filter((al) => al.artistId === artist.id);
  // Related artists
  const relatedArtists = MOCK_ARTISTS.filter((a) => a.id !== artist.id).slice(0, 4);

  const handlePlayAll = () => {
    if (popularTracks.length > 0) {
      playTrack(popularTracks[0], popularTracks);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Large Artist Hero Header */}
      <div className="relative -mx-4 md:-mx-8 -mt-6 p-6 md:p-12 overflow-hidden rounded-b-3xl">
        {/* Dynamic Banner Gradient with glow */}
        <div className={`absolute inset-0 bg-gradient-to-b ${artist.bannerGradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/40 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Circular Artist Avatar */}
          <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl border-2 border-white/10 shrink-0 flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-tr ${artist.avatarGradient}`} />
            <div className="relative z-10 opacity-70">
              <PenguinLogo size="hero" variant="icon" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            {artist.verified && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-3">
                <CheckCircle className="w-3.5 h-3.5 fill-cyan-400 text-slate-900" />
                <span>Verified Artist</span>
              </div>
            )}

            <h1 className="text-3xl md:text-6xl font-black font-display text-white tracking-tight mb-2">
              {artist.name}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-slate-300 font-medium mb-4">
              <span>{formatPlays(artist.monthlyListeners)} monthly listeners</span>
            </div>

            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed mb-6">
              {artist.bio}
            </p>

            {/* Play Button & Follow Action */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-7 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-sm shadow-xl shadow-emerald-500/25 transition-transform"
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                <span>Play Artist</span>
              </button>

              <button className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-white text-xs font-semibold hover:bg-white/5 transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Songs */}
      <section>
        <SectionHeader title="Popular Songs" subtitle="Most streamed tracks by listeners" />
        <div className="space-y-1 bg-slate-900/40 p-2 rounded-2xl border border-white/[0.04]">
          {popularTracks.map((track, idx) => (
            <SongRow
              key={track.id}
              track={track}
              index={idx}
              queueContext={popularTracks}
              showAlbum={true}
            />
          ))}
          {popularTracks.length === 0 && (
            <p className="p-4 text-xs text-slate-400 italic">No tracks cataloged yet.</p>
          )}
        </div>
      </section>

      {/* Albums / Discography */}
      {artistAlbums.length > 0 && (
        <section>
          <SectionHeader title="Albums" subtitle="Official studio albums" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artistAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* Related Artists */}
      <section>
        <SectionHeader title="Fans Also Like" subtitle="Similar sounds and companion artists" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {relatedArtists.map((rel) => (
            <ArtistCard key={rel.id} artist={rel} />
          ))}
        </div>
      </section>
    </div>
  );
};
