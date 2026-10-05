import React, { useState } from 'react';
import { LayoutGrid, List, Heart, Music, Disc, Users, Clock } from 'lucide-react';
import {
  MOCK_PLAYLISTS,
  MOCK_ALBUMS,
  MOCK_ARTISTS,
  MOCK_TRACKS,
} from '../data/mockData';
import { PlaylistCard } from '../components/common/PlaylistCard';
import { AlbumCard } from '../components/common/AlbumCard';
import { ArtistCard } from '../components/common/ArtistCard';
import { SongRow } from '../components/common/SongRow';
import { SongCard } from '../components/common/SongCard';
import { EmptyState } from '../components/common/EmptyState';
import { useMusicPlayer } from '../context/MusicPlayerContext';

type TabType = 'all' | 'playlists' | 'liked' | 'artists' | 'albums' | 'history';

export const LibraryView: React.FC = () => {
  const { likedSongIds, history, navigateTo } = useMusicPlayer();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [filterQuery, setFilterQuery] = useState('');

  const likedTracks = MOCK_TRACKS.filter((t) => likedSongIds.has(t.id));

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All', icon: Music },
    { id: 'playlists', label: 'Playlists', icon: Disc },
    { id: 'liked', label: `Liked Songs (${likedSongIds.size})`, icon: Heart },
    { id: 'artists', label: 'Artists', icon: Users },
    { id: 'albums', label: 'Albums', icon: Disc },
    { id: 'history', label: 'Recently Played', icon: Clock },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white">
            Your Library
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Collection of your saved playlists, favorite songs, albums, and artists
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              layoutMode === 'grid'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              layoutMode === 'list'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* ALL OR PLAYLISTS */}
      {(activeTab === 'all' || activeTab === 'playlists') && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display text-white">Playlists</h3>
          </div>
          {layoutMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {MOCK_PLAYLISTS.map((p) => (
                <PlaylistCard key={p.id} playlist={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-1 bg-slate-900/40 p-2 rounded-2xl border border-white/[0.04]">
              {MOCK_PLAYLISTS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateTo('playlist', { playlistId: p.id })}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center font-bold text-emerald-400">
                      ♫
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{p.title}</div>
                      <div className="text-xs text-slate-400">{p.trackCount} songs · {p.owner}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{p.duration}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* LIKED SONGS */}
      {(activeTab === 'all' || activeTab === 'liked') && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display text-white">
              Liked Songs ({likedTracks.length})
            </h3>
            {activeTab === 'all' && (
              <button
                onClick={() => setActiveTab('liked')}
                className="text-xs text-slate-400 hover:text-emerald-400 font-semibold"
              >
                View All
              </button>
            )}
          </div>

          {likedTracks.length > 0 ? (
            layoutMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {likedTracks.map((t) => (
                  <SongCard key={`liked-${t.id}`} track={t} queueContext={likedTracks} />
                ))}
              </div>
            ) : (
              <div className="space-y-1 bg-slate-900/40 p-2 rounded-2xl border border-white/[0.04]">
                {likedTracks.map((t, idx) => (
                  <SongRow key={`liked-row-${t.id}`} track={t} index={idx} queueContext={likedTracks} />
                ))}
              </div>
            )
          ) : (
            <EmptyState
              title="No liked songs yet"
              description="Tap the heart icon on any song you love to save it to your personal library."
              actionText="Discover Songs"
              onAction={() => navigateTo('home')}
            />
          )}
        </section>
      )}

      {/* ARTISTS */}
      {(activeTab === 'all' || activeTab === 'artists') && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display text-white">Artists</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MOCK_ARTISTS.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* ALBUMS */}
      {(activeTab === 'all' || activeTab === 'albums') && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display text-white">Albums</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MOCK_ALBUMS.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* RECENTLY PLAYED HISTORY */}
      {(activeTab === 'history') && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display text-white">Playback History</h3>
          </div>
          {history.length > 0 ? (
            <div className="space-y-1 bg-slate-900/40 p-2 rounded-2xl border border-white/[0.04]">
              {history.map((t, i) => (
                <SongRow key={`history-${t.id}-${i}`} track={t} index={i} queueContext={history} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No history yet"
              description="Songs you listen to will automatically appear here."
              actionText="Play some music"
              onAction={() => navigateTo('home')}
            />
          )}
        </section>
      )}
    </div>
  );
};
