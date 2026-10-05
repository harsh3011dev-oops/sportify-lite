import React from 'react';
import {
  Home,
  Search,
  Library,
  Heart,
  Clock,
  ListMusic,
  PlusSquare,
  Sparkles,
  Download,
  Flame,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PenguinLogo } from '../brand/PenguinLogo';
import { MOCK_PLAYLISTS } from '../../data/mockData';

export const Sidebar: React.FC = () => {
  const { currentView, viewParams, navigateTo, setExportModalOpen } = useMusicPlayer();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, view: 'home' as const },
    { id: 'search', label: 'Search', icon: Search, view: 'search' as const },
    { id: 'library', label: 'Your Library', icon: Library, view: 'library' as const },
    { id: 'liked', label: 'Liked Songs', icon: Heart, view: 'liked' as const },
    { id: 'recently_played', label: 'Recently Played', icon: Clock, view: 'recently_played' as const },
  ];

  return (
    <aside className="w-64 h-full shrink-0 flex flex-col bg-slate-950/80 border-r border-white/[0.06] backdrop-blur-xl select-none z-20">
      {/* Brand Header */}
      <div
        onClick={() => navigateTo('home')}
        className="px-5 py-5 flex items-center cursor-pointer group"
      >
        <PenguinLogo size="md" variant="logo" showWordmark={true} />
      </div>

      {/* Main Navigation */}
      <div className="px-3 space-y-1 mb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.view)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/[0.06] mb-4" />

      {/* Playlists Header */}
      <div className="px-5 flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Your Playlists
        </span>
        <button
          onClick={() => navigateTo('playlist', { playlistId: 'playlist-chill' })}
          className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
          title="Create Playlist (Mock)"
        >
          <PlusSquare className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Playlists List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {MOCK_PLAYLISTS.map((playlist) => {
          const isSelected = currentView === 'playlist' && viewParams.playlistId === playlist.id;
          return (
            <button
              key={playlist.id}
              onClick={() => navigateTo('playlist', { playlistId: playlist.id })}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs truncate transition-all duration-150 block ${
                isSelected
                  ? 'text-emerald-400 font-semibold bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
              title={playlist.title}
            >
              {playlist.title}
            </button>
          );
        })}
      </div>

      {/* Bottom Export ZIP Banner */}
      <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-950/80 border border-emerald-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Export Designs</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-2.5 leading-snug">
          Download complete UI code package as ZIP.
        </p>
        <button
          onClick={() => setExportModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors border border-emerald-500/30 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download ZIP</span>
        </button>
      </div>
    </aside>
  );
};
