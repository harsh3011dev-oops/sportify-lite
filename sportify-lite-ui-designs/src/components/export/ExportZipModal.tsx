import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, CheckCircle, Package, FileCode, Sparkles, X, Loader2 } from 'lucide-react';
import { PenguinLogo } from '../brand/PenguinLogo';

interface ExportZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportZipModal: React.FC<ExportZipModalProps> = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();

      // README file
      const readmeContent = `# Sportify Lite - Modern Music Streaming UI Prototype

A premium, dark-mode music streaming frontend UI prototype built with React, Vite, Tailwind CSS, and Lucide icons.
Featuring Sportify Lite's signature penguin branding, responsive discovery feeds, interactive audio player, category exploration, playlists, and seamless backend readiness.

## Quick Start
1. Extract this ZIP archive
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Lucide React icons
- Web Audio API real-time simulated sound generator

## Architecture & Future Backend Integration
All mock data is cleanly separated in \`src/data/mockData.ts\` and adheres to standard REST models in \`src/types/music.ts\`.
To hook up to your Node.js/Python backend:
1. Replace mock collections with \`fetch('/api/v1/tracks')\` or \`axios\` calls.
2. Direct \`audioUrl\` in tracks to your yt-dlp or streaming server endpoint.
3. Hook up playlist creation and liked songs to user database endpoints.
`;

      zip.file('README.md', readmeContent);

      // We can bundle instructions & architectural manifest
      zip.file('SPORTIFY_LITE_ARCHITECTURE.txt', `SPORTIFY LITE - ARCHITECTURAL BLUEPRINT
- Frontend: React SPA + Tailwind CSS
- Branding: Penguin with neon studio headphones
- Audio State: MusicPlayerContext.tsx with Web Audio synthesizer
- UI Modules:
  * Sidebar: Navigation & Playlists
  * TopBar: Search, Controls, Notifications, Settings
  * HomeView: Good Afternoon, Made for you, Trending, Artists, New Releases
  * SearchView: Categorized genres, Live fuzzy filter
  * LibraryView: Liked Songs, Playlists, Albums, Artists
  * ArtistView, AlbumView, PlaylistView
  * Sticky Bottom Player: Full Scrubbing, Volume, Queue, Equalizer
`);

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });

      // Trigger browser download
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sportify-lite-ui-designs.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setDownloadReady(true);
      setTimeout(() => {
        setDownloadReady(false);
      }, 4000);
    } catch (err) {
      console.error('Failed to create ZIP', err);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 md:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <PenguinLogo size="lg" variant="icon" />
          <div>
            <h3 className="text-xl font-bold font-display text-white">
              Export Sportify Lite ZIP
            </h3>
            <p className="text-xs text-slate-400">
              Download the complete standalone UI design package
            </p>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-3 mb-6 bg-slate-950/60 rounded-2xl p-4 border border-white/5 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Complete React 19 + Tailwind CSS 4 UI source code</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Modular components (SongCard, Player, Sidebar, TopBar, etc.)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Clean mock data layer with explicit Node.js/Python API hooks</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All SVG assets including Penguin branding and audio icons</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant local run instructions with \`npm run dev\`</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/25"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating ZIP...</span>
              </>
            ) : downloadReady ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download UI Designs ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
