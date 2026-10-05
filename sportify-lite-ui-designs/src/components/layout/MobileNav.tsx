import React from 'react';
import { Home, Search, Library, Heart } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { ViewType } from '../../types/music';

export const MobileNav: React.FC = () => {
  const { currentView, navigateTo } = useMusicPlayer();

  const navItems: { label: string; view: ViewType; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Search', view: 'search', icon: Search },
    { label: 'Library', view: 'library', icon: Library },
    { label: 'Liked', view: 'liked', icon: Heart },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-slate-950/95 border-t border-white/[0.08] backdrop-blur-2xl z-50 flex items-center justify-around px-2 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => navigateTo(item.view)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
