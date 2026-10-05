import React from 'react';
import {
  MOCK_TRACKS,
  MOCK_ALBUMS,
  MOCK_ARTISTS,
  MOCK_PLAYLISTS,
} from '../data/mockData';
import { SongCard } from '../components/common/SongCard';
import { AlbumCard } from '../components/common/AlbumCard';
import { ArtistCard } from '../components/common/ArtistCard';
import { PlaylistCard } from '../components/common/PlaylistCard';
import { SongRow } from '../components/common/SongRow';
import { SectionHeader } from '../components/common/SectionHeader';
import { PenguinLogo } from '../components/brand/PenguinLogo';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Sparkles, Play, Flame } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { playTrack, navigateTo, history } = useMusicPlayer();

  // Greeting based on real time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const trendingTracks = MOCK_TRACKS.slice(0, 5);
  const quickPicks = MOCK_TRACKS.slice(0, 6);
  const heroFeaturedTracks = MOCK_TRACKS.slice(0, 6);
  const recentlyPlayedList = history.length > 0 ? history.slice(0, 5) : MOCK_TRACKS.slice(4, 9);

  return (
    <div className="space-y-10 pb-20">
      {/* SECTION 1: Greeting & Hero Discovery Cards */}
      <section className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Personalized Feed
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white">
              {getGreeting()}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Made for your listening
            </p>
          </div>
        </div>

        {/* Quick Bento/Grid Access Cards (Inspired by modern streaming top tiles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {heroFeaturedTracks.map((track) => (
            <div
              key={`hero-${track.id}`}
              onClick={() => playTrack(track, heroFeaturedTracks)}
              className="group flex items-center rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.04] hover:border-emerald-500/20 overflow-hidden cursor-pointer transition-all duration-200 select-none shadow-sm"
            >
              <div className="relative w-16 h-16 shrink-0 bg-slate-800">
                <div className={`absolute inset-0 bg-gradient-to-br ${track.coverGradient}`} />
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <PenguinLogo size="xs" variant="icon" />
                </div>
              </div>

              <div className="flex-1 min-w-0 px-3.5">
                <div className="text-xs md:text-sm font-semibold text-slate-100 group-hover:text-emerald-400 truncate transition-colors">
                  {track.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {track.artist}
                </div>
              </div>

              {/* Hover play button */}
              <div className="mr-3 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(track, heroFeaturedTracks);
                  }}
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Trending Now */}
      <section>
        <SectionHeader
          title="Trending Now"
          subtitle="Top viral streams across global and regional charts"
          actionText="Show All"
          onActionClick={() => navigateTo('search')}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingTracks.map((track) => (
            <SongCard key={track.id} track={track} queueContext={trendingTracks} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Quick Picks (Compact horizontal song rows) */}
      <section className="p-4 md:p-6 rounded-3xl bg-slate-900/40 border border-white/[0.04]">
        <SectionHeader
          title="Quick Picks"
          subtitle="Start a quick listening session right now"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          {quickPicks.map((track, idx) => (
            <SongRow
              key={`quick-${track.id}`}
              track={track}
              index={idx}
              queueContext={quickPicks}
              showAlbum={false}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4: Recently Played */}
      <section>
        <SectionHeader
          title="Recently Played"
          subtitle="Jump back into what you were listening to"
          actionText="View History"
          onActionClick={() => navigateTo('recently_played')}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentlyPlayedList.map((track) => (
            <SongCard key={`recent-${track.id}`} track={track} queueContext={recentlyPlayedList} />
          ))}
        </div>
      </section>

      {/* SECTION 5: Popular Artists */}
      <section>
        <SectionHeader
          title="Popular Artists"
          subtitle="Top stream powerhouses and celebrated musicians"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_ARTISTS.slice(0, 5).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* SECTION 6: Made For You */}
      <section>
        <SectionHeader
          title="Made For You"
          subtitle="Playlists curated to match every vibe and mood"
          actionText="See All"
          onActionClick={() => navigateTo('library')}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_PLAYLISTS.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      {/* SECTION 7: New Releases */}
      <section>
        <SectionHeader
          title="New Releases"
          subtitle="Fresh albums and newly mastered drops"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_ALBUMS.slice(0, 5).map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
};
