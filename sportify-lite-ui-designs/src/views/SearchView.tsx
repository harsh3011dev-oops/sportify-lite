import React, { useState, useEffect, useMemo } from 'react';
import {
  MOCK_CATEGORIES,
  MOCK_TRACKS,
  MOCK_ARTISTS,
  MOCK_ALBUMS,
  MOCK_PLAYLISTS,
} from '../data/mockData';
import { SearchBar } from '../components/common/SearchBar';
import { SongCard } from '../components/common/SongCard';
import { SongRow } from '../components/common/SongRow';
import { ArtistCard } from '../components/common/ArtistCard';
import { AlbumCard } from '../components/common/AlbumCard';
import { PlaylistCard } from '../components/common/PlaylistCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { EmptyState } from '../components/common/EmptyState';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Track } from '../types/music';
import {
  Flame,
  Heart,
  Zap,
  Globe,
  Coffee,
  Music,
  Radio,
  Sparkles,
  Disc,
  Feather,
  Sun,
  Headphones,
} from 'lucide-react';

const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  Flame,
  Heart,
  Zap,
  Globe,
  Coffee,
  Music,
  Radio,
  Sparkles,
  Disc,
  Feather,
  Sun,
  Headphones,
};

export const SearchView: React.FC = () => {
  const { viewParams, allTracks } = useMusicPlayer();
  const [searchTerm, setSearchTerm] = useState(viewParams.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(viewParams.categoryFilter || null);
  
  const [liveTracks, setLiveTracks] = useState<Track[]>([]);

  // Sync state if navigation params change
  React.useEffect(() => {
    if (viewParams.searchQuery !== undefined) {
      setSearchTerm(viewParams.searchQuery);
    }
  }, [viewParams.searchQuery]);

  const isQuerying = searchTerm.trim().length > 0 || selectedCategory !== null;

  // Search API effect
  useEffect(() => {
    const q = searchTerm.trim() || selectedCategory;
    if (!q) {
      setLiveTracks([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tracks?q=${encodeURIComponent(q)}&limit=50`);
        const json = await response.json();
        if (json.data) {
           const formatted = json.data.map((t: any) => {
            let dur = 0;
            if (t.duration && t.duration.includes(':')) {
              const [m, s] = t.duration.split(':');
              dur = parseInt(m) * 60 + parseInt(s);
            }
            return {
              id: t.id,
              title: t.title,
              artist: t.artist,
              artistId: 'api-artist',
              album: t.album || 'Unknown',
              albumId: 'api-album',
              duration: dur || 200,
              coverGradient: 'from-gray-900 via-gray-800 to-black',
              coverImage: t.cover_url,
              genre: 'Music',
              plays: Math.floor(Math.random() * 10000000),
              releaseDate: '2025-01-01',
              isExplicit: false
            };
          });
          setLiveTracks(formatted);
        }
      } catch (e) {
        console.error(e);
      }
    }, 400); // Debounce 400ms
    
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  // Filtered results
  const searchResults = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const cat = selectedCategory?.toLowerCase();

    // Use liveTracks for tracks, fallback to MOCK if we have to, but liveTracks is better
    let tracks = liveTracks;
    if (!q && cat) {
       // if it's just a category, and api didn't return much, fallback to allTracks
       if (tracks.length === 0) {
           tracks = allTracks.filter(t => t.genre?.toLowerCase().includes(cat));
       }
    }

    return { tracks, artists: [], albums: [], playlists: [] };
  }, [searchTerm, selectedCategory, liveTracks, allTracks]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Prominent Search Input */}
      <div className="max-w-2xl">
        <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Search
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mb-6">
          Find your favorite tracks, artists, albums, and curated playlists.
        </p>
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            if (val) setSelectedCategory(null);
          }}
          placeholder="What do you want to listen to?"
          autoFocus={false}
          className="shadow-xl"
        />
      </div>

      {/* Category active indicator */}
      {selectedCategory && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filtering by category:</span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
            {selectedCategory}
            <button
              onClick={() => setSelectedCategory(null)}
              className="hover:text-white ml-1 font-bold"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* IF NOT SEARCHING: Show Browse All Categories Grid */}
      {!isQuerying && (
        <section>
          <SectionHeader
            title="Browse All Categories"
            subtitle="Explore genres, cultures, and sonic moods"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {MOCK_CATEGORIES.map((cat) => {
              const IconComp = iconComponents[cat.iconName] || Music;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.title)}
                  className={`group relative h-28 md:h-32 rounded-2xl p-4 overflow-hidden cursor-pointer bg-gradient-to-br ${cat.gradient} shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl select-none`}
                >
                  {/* Category Title */}
                  <h3 className={`text-base font-bold font-display leading-tight ${cat.textColor}`}>
                    {cat.title}
                  </h3>

                  {/* Icon at Bottom Right */}
                  <div className="absolute -bottom-2 -right-2 text-white/30 group-hover:text-white/50 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                    <IconComp className="w-16 h-16" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* IF SEARCHING: Show Rich Results across Songs, Artists, Albums, and Playlists */}
      {isQuerying && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Result + Songs Rows */}
          {searchResults.tracks.length > 0 && (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Result Card */}
              <div className="lg:col-span-5">
                <h3 className="text-lg font-bold font-display text-white mb-3">Top Result</h3>
                <div className="h-full">
                  <SongCard track={searchResults.tracks[0]} queueContext={searchResults.tracks} />
                </div>
              </div>

              {/* Matching Songs Rows */}
              <div className="lg:col-span-7">
                <h3 className="text-lg font-bold font-display text-white mb-3">Songs</h3>
                <div className="space-y-1 rounded-2xl bg-slate-900/40 p-2 border border-white/[0.04]">
                  {searchResults.tracks.slice(0, 4).map((track, i) => (
                    <SongRow
                      key={`search-row-${track.id}`}
                      track={track}
                      index={i}
                      queueContext={searchResults.tracks}
                      showAlbum={false}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* List the remaining songs */}
          {searchResults.tracks.length > 4 && (
            <section className="mt-8">
              <h3 className="text-lg font-bold font-display text-white mb-3">More Tracks</h3>
              <div className="space-y-1 rounded-2xl bg-slate-900/40 p-2 border border-white/[0.04]">
                {searchResults.tracks.slice(4, 20).map((track, i) => (
                  <SongRow
                    key={`more-search-row-${track.id}`}
                    track={track}
                    index={i + 4}
                    queueContext={searchResults.tracks}
                    showAlbum={true}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Artists Results */}
          {searchResults.artists.length > 0 && (
            <section>
              <SectionHeader title="Artists" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {/* Albums Results */}
          {searchResults.albums.length > 0 && (
            <section>
              <SectionHeader title="Albums" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}

          {/* Playlists Results */}
          {searchResults.playlists.length > 0 && (
            <section>
              <SectionHeader title="Playlists" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}

          {/* Empty search state if nothing matches */}
          {searchResults.tracks.length === 0 &&
            searchResults.artists.length === 0 &&
            searchResults.albums.length === 0 &&
            searchResults.playlists.length === 0 && (
              <EmptyState
                title={`No results found for "${searchTerm || selectedCategory}"`}
                description="Check your spelling or search for another artist, track title, or genre."
                actionText="Clear Search"
                onAction={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
              />
            )}
        </div>
      )}
    </div>
  );
};
