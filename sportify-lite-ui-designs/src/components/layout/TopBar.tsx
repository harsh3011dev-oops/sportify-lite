import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Download,
  Menu,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { SearchBar } from '../common/SearchBar';
import { PenguinLogo } from '../brand/PenguinLogo';

interface TopBarProps {
  onToggleMobileSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileSidebar }) => {
  const {
    canNavigateBack,
    canNavigateForward,
    navigateBack,
    navigateForward,
    currentView,
    viewParams,
    navigateTo,
    setExportModalOpen,
  } = useMusicPlayer();

  const [notificationOpen, setNotificationOpen] = useState(false);

  // Search input binding
  const searchQuery = currentView === 'search' ? (viewParams.searchQuery || '') : '';

  const handleSearchChange = (val: string) => {
    navigateTo('search', { searchQuery: val });
  };

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between gap-4 bg-slate-950/40 backdrop-blur-xl border-b border-white/[0.04] sticky top-0 z-30 select-none">
      {/* Left Navigation Zone: Mobile Toggle + History Arrows */}
      <div className="flex items-center gap-2">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Back / Forward History Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={navigateBack}
            disabled={!canNavigateBack}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canNavigateBack
                ? 'bg-slate-900/90 text-white hover:bg-slate-800'
                : 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
            }`}
            title="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={navigateForward}
            disabled={!canNavigateForward}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canNavigateForward
                ? 'bg-slate-900/90 text-white hover:bg-slate-800'
                : 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
            }`}
            title="Go forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Zone: Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="What do you want to play?"
        />
      </div>

      {/* Right Zone: Actions (Notifications, Settings, Export ZIP) */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Download ZIP quick action */}
        <button
          onClick={() => setExportModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
          title="Export source code ZIP"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Export ZIP</span>
        </button>

        {/* Notifications Icon with simulated popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="What's New"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          </button>

          {notificationOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 z-40 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">What's New</span>
                <span className="text-[10px] text-emerald-400 font-mono">v1.0 Lite</span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Welcome to Sportify Lite! Explore curated Bollywood, Lo-Fi, and global hits powered by Penguin Audio.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex items-center gap-3">
                <PenguinLogo size="xs" variant="icon" />
                <span className="text-[11px] text-slate-300">Clean architecture ready for Node.js / Python REST API.</span>
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button
          onClick={() => navigateTo('settings')}
          className={`p-2 rounded-full transition-colors ${
            currentView === 'settings'
              ? 'bg-white/10 text-emerald-400'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Preferences & Audio Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
