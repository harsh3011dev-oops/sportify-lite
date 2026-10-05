import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Laptop,
  Maximize2,
  ChevronUp,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { formatTime } from '../../data/mockData';
import { PenguinLogo } from '../brand/PenguinLogo';

export const BottomPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    navigateTo,
    toggleNowPlaying,
    isNowPlayingOpen,
    toggleQueueModal,
    toggleFullScreenPlayer,
  } = useMusicPlayer();

  const [devicePopoverOpen, setDevicePopoverOpen] = useState(false);

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekTo(Number(e.target.value));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeLevel(Number(e.target.value));
  };

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-4 h-4 text-slate-400" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4 text-slate-300" />;
    return <Volume2 className="w-4 h-4 text-slate-300" />;
  };

  return (
    <footer className="fixed bottom-0 inset-x-0 h-20 md:h-22 bg-[#0c0d12]/95 border-t border-white/[0.08] backdrop-blur-2xl px-3 md:px-6 z-40 flex items-center justify-between select-none shadow-[0_-8px_30px_rgba(0,0,0,0.7)]">
      {/* LEFT: Current Track Metadata */}
      <div className="flex items-center gap-3 w-1/4 min-w-[170px] max-w-[280px]">
        {/* Track Artwork */}
        <div
          onClick={toggleFullScreenPlayer}
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/10 group cursor-pointer"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.coverGradient}`} />
          {currentTrack.coverImage ? (
            <img src={currentTrack.coverImage} alt={currentTrack.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <PenguinLogo size="sm" variant="icon" />
            </div>
          )}
          {/* Subtle overlay hover hint */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <ChevronUp className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title and artist */}
        <div className="min-w-0 flex-1">
          <div
            onClick={() => navigateTo('album', { albumId: currentTrack.albumId })}
            className="text-xs md:text-sm font-semibold text-slate-100 hover:text-emerald-400 truncate cursor-pointer transition-colors"
            title={currentTrack.title}
          >
            {currentTrack.title}
          </div>
          <div
            onClick={() => navigateTo('artist', { artistId: currentTrack.artistId })}
            className="text-[11px] md:text-xs text-slate-400 hover:text-slate-200 truncate cursor-pointer transition-colors mt-0.5"
            title={currentTrack.artist}
          >
            {currentTrack.artist}
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-1.5 rounded-full transition-colors ${
            liked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
          }`}
          title={liked ? 'Remove from Liked' : 'Save to Liked Songs'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* CENTER: Playback Controls & Progress Bar */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-xl px-2">
        {/* Controls row */}
        <div className="flex items-center gap-3 md:gap-5 mb-1.5">
          {/* Shuffle button */}
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors hidden sm:block ${
              isShuffle ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
            title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <Shuffle className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>

          {/* Previous track */}
          <button
            onClick={prevTrack}
            className="p-1.5 rounded-full text-slate-300 hover:text-white transition-transform active:scale-95"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4 md:w-5 md:h-5 fill-current" />
          </button>

          {/* Play / Pause button */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            ) : (
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Next track */}
          <button
            onClick={nextTrack}
            className="p-1.5 rounded-full text-slate-300 hover:text-white transition-transform active:scale-95"
            title="Next track"
          >
            <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
          </button>

          {/* Repeat button */}
          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full transition-colors hidden sm:block ${
              repeatMode !== 'off' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            ) : (
              <Repeat className="w-3.5 h-3.5 md:w-4 md:h-4" />
            )}
          </button>
        </div>

        {/* Progress & Time bar */}
        <div className="w-full flex items-center gap-2 md:gap-3 text-[11px] font-mono tabular-nums text-slate-400">
          <span className="w-9 text-right">{formatTime(currentTime)}</span>

          <div className="relative flex-1 range-hover-container flex items-center">
            {/* Custom Background track */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Invisible native range overlay */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <span className="w-9 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT: Volume & Utilities */}
      <div className="flex items-center justify-end gap-2 md:gap-3 w-1/4 min-w-[140px] max-w-[280px]">
        {/* Up Next Queue */}
        <button
          onClick={toggleQueueModal}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          title="Play Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Device icon */}
        <div className="relative">
          <button
            onClick={() => setDevicePopoverOpen(!devicePopoverOpen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors hidden sm:block"
            title="Connect to a device"
          >
            <Laptop className="w-4 h-4" />
          </button>

          {devicePopoverOpen && (
            <div
              className="absolute right-0 bottom-full mb-3 w-60 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-3 z-50 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-xs font-semibold text-white mb-2">Connect to a device</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs">
                  <Laptop className="w-4 h-4" />
                  <div className="min-w-0">
                    <div className="font-semibold">Current Browser</div>
                    <div className="text-[10px] text-slate-400">Sportify Lite Web Engine</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl text-slate-400 text-xs opacity-60">
                  <PenguinLogo size="xs" variant="icon" />
                  <span>Penguin Studio Speakers (AirPlay)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Volume Controls */}
        <div className="hidden lg:flex items-center gap-2 w-28 range-hover-container">
          <button
            onClick={toggleMute}
            className="text-slate-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {renderVolumeIcon()}
          </button>
          <div className="relative flex-1 flex items-center">
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-200 group-hover:bg-emerald-400 rounded-full transition-all"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Fullscreen Player toggle */}
        <button
          onClick={toggleFullScreenPlayer}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors hidden sm:block"
          title="Fullscreen Visualizer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Now Playing Panel Toggle */}
        <button
          onClick={toggleNowPlaying}
          className={`p-1.5 rounded-full transition-colors hidden xl:block ${
            isNowPlayingOpen ? 'text-emerald-400 bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Now Playing View"
        >
          <ChevronUp className={`w-4 h-4 transform transition-transform ${isNowPlayingOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </footer>
  );
};
