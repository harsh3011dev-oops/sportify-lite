import React from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { formatTime } from '../data/mockData';
import { PenguinLogo } from '../components/brand/PenguinLogo';

export const FullScreenPlayer: React.FC = () => {
  const {
    isFullScreenPlayerOpen,
    toggleFullScreenPlayer,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    seekTo,
    togglePlay,
    nextTrack,
    prevTrack,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    isLiked,
    toggleLike,
    volume,
    setVolumeLevel,
    isMuted,
    toggleMute,
  } = useMusicPlayer();

  if (!isFullScreenPlayerOpen || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#08090c] flex flex-col justify-between p-6 md:p-12 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Dynamic Ambient Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentTrack.coverGradient} opacity-30 blur-3xl pointer-events-none`} />
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          onClick={toggleFullScreenPlayer}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          title="Minimize player"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Playing From Album
          </span>
          <span className="text-sm font-semibold text-slate-200">{currentTrack.album}</span>
        </div>

        <div className="p-2">
          <PenguinLogo size="sm" variant="listening" />
        </div>
      </div>

      {/* Center Artwork & Visualizer */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto max-w-lg mx-auto w-full">
        {/* Large Album Artwork with glowing rim */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-8 group">
          <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.coverGradient}`} />
          {currentTrack.coverImage ? (
            <img src={currentTrack.coverImage} alt={currentTrack.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <PenguinLogo size="hero" variant="listening" />
            </div>
          )}

          {/* Equalizer animation when playing */}
          {isPlaying && (
            <div className="absolute bottom-4 inset-x-0 flex items-end justify-center gap-1.5 h-12">
              <span className="w-1.5 bg-emerald-400 rounded-full animate-eq-1" />
              <span className="w-1.5 bg-cyan-400 rounded-full animate-eq-2" />
              <span className="w-1.5 bg-teal-400 rounded-full animate-eq-3" />
              <span className="w-1.5 bg-emerald-400 rounded-full animate-eq-4" />
            </div>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="min-w-0 pr-4">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white truncate">
              {currentTrack.title}
            </h2>
            <p className="text-base text-slate-400 mt-1 truncate">{currentTrack.artist}</p>
          </div>

          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-3 rounded-full transition-transform active:scale-90 ${
              liked ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="w-full mb-6">
          <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2 cursor-pointer">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6 md:gap-8 w-full">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition-colors ${
              isShuffle ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-white hover:text-emerald-400 transition-transform active:scale-90"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-white hover:text-emerald-400 transition-transform active:scale-90"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 transition-colors ${
              repeatMode !== 'off' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Bar: Volume Slider */}
      <div className="relative z-10 flex items-center justify-center gap-3 max-w-xs mx-auto w-full">
        <button onClick={toggleMute} className="text-slate-400 hover:text-white">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <div className="relative flex-1 flex items-center">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-300 rounded-full"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolumeLevel(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
