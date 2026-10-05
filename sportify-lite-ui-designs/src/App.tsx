/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MusicPlayerProvider, useMusicPlayer } from './context/MusicPlayerContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomPlayer } from './components/layout/BottomPlayer';
import { NowPlayingPanel } from './components/layout/NowPlayingPanel';
import { MobileNav } from './components/layout/MobileNav';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { LikedSongsView } from './views/LikedSongsView';
import { RecentlyPlayedView } from './views/RecentlyPlayedView';
import { ArtistView } from './views/ArtistView';
import { AlbumView } from './views/AlbumView';
import { PlaylistView } from './views/PlaylistView';
import { SettingsView } from './views/SettingsView';
import { QueueModal } from './views/QueueModal';
import { FullScreenPlayer } from './views/FullScreenPlayer';
import { ExportZipModal } from './components/export/ExportZipModal';
import { X } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    viewParams,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleMute,
    isExportModalOpen,
    setExportModalOpen,
  } = useMusicPlayer();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global keyboard shortcuts (Space for Play/Pause, M for mute, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.shiftKey && (e.key === 'N' || e.key === 'n')) {
        nextTrack();
      } else if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        prevTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, nextTrack, prevTrack]);

  // Render the current view according to navigation state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'library':
        return <LibraryView />;
      case 'liked':
        return <LikedSongsView />;
      case 'recently_played':
        return <RecentlyPlayedView />;
      case 'artist':
        return <ArtistView artistId={viewParams.artistId} />;
      case 'album':
        return <AlbumView albumId={viewParams.albumId} />;
      case 'playlist':
        return <PlaylistView playlistId={viewParams.playlistId} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#08090c] text-slate-100 overflow-hidden select-none">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex shrink-0 h-full pb-20">
        <Sidebar />
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 flex flex-col bg-slate-950 shadow-2xl">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-full pb-14" onClick={() => setMobileSidebarOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Navigation Bar */}
        <TopBar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Scrollable Main Content & Right-Side Panel Flex Container */}
        <div className="flex-1 flex min-w-0 overflow-hidden relative pb-20 md:pb-22">
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 min-w-0 scroll-smooth">
            <div className="max-w-7xl mx-auto">{renderCurrentView()}</div>
          </main>

          {/* Right-Side Optional Now Playing Panel (Collapsible) */}
          <div className="hidden xl:block h-full">
            <NowPlayingPanel />
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM AUDIO PLAYER */}
      <BottomPlayer />

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <MobileNav />

      {/* FULL-SCREEN IMMERSIVE PLAYER MODAL */}
      <FullScreenPlayer />

      {/* UP NEXT PLAY QUEUE MODAL */}
      <QueueModal />

      {/* EXPORT PROJECT ZIP MODAL */}
      <ExportZipModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <MusicPlayerProvider>
      <AppContent />
    </MusicPlayerProvider>
  );
}
