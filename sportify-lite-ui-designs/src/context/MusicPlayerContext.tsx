import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Track, Album, Artist, Playlist, RepeatMode, ViewType, ViewParams } from '../types/music';
import { MOCK_TRACKS, MOCK_PLAYLISTS, getAlbumById, getArtistById } from '../data/mockData';

interface MusicPlayerContextType {
  // Playback state
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  history: Track[];
  likedSongIds: Set<string>;
  allTracks: Track[]; // We add this to access live API tracks globally

  // Playback actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (seconds: number) => void;
  setVolumeLevel: (level: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;

  // Queue actions
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;

  // Navigation state & actions
  currentView: ViewType;
  viewParams: ViewParams;
  navigateTo: (view: ViewType, params?: ViewParams) => void;
  navigateBack: () => void;
  navigateForward: () => void;
  canNavigateBack: boolean;
  canNavigateForward: boolean;

  // UI state
  isNowPlayingOpen: boolean;
  toggleNowPlaying: () => void;
  isQueueModalOpen: boolean;
  toggleQueueModal: () => void;
  isFullScreenPlayerOpen: boolean;
  toggleFullScreenPlayer: () => void;
  isExportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation stack
  const [navHistory, setNavHistory] = useState<{ view: ViewType; params: ViewParams }[]>([
    { view: 'home', params: {} }
  ]);
  const [navIndex, setNavIndex] = useState(0);

  // Playback state
  const [allTracks, setAllTracks] = useState<Track[]>(MOCK_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(new Set());

  // UI Panels
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState<boolean>(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState<boolean>(false);
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // REAL HTML5 AUDIO REFERENCE
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch real tracks on mount
  useEffect(() => {
    const fetchRealTracks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tracks?limit=200');
        const json = await response.json();
        if (json.data && json.data.length > 0) {
          // Convert backend format to frontend UI format
          const formattedTracks: Track[] = json.data.map((t: any) => {
            // Parse duration "M:SS" into seconds
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
              coverGradient: 'from-gray-900 via-gray-800 to-black', // fallback
              coverImage: t.cover_url,
              genre: 'Music',
              plays: Math.floor(Math.random() * 10000000),
              releaseDate: '2025-01-01',
              isExplicit: false
            };
          });
          
          setAllTracks(formattedTracks);
          setCurrentTrack(formattedTracks[0]);
          setDuration(formattedTracks[0].duration);
          setQueue(formattedTracks.slice(1));
        }
      } catch (e) {
        console.error('Failed to fetch real tracks from API. Falling back to mock data.', e);
        setCurrentTrack(MOCK_TRACKS[0]);
        setDuration(MOCK_TRACKS[0].duration);
        setQueue(MOCK_TRACKS.slice(1));
      }
    };

    fetchRealTracks();
    
    // Initialize Audio Element
    audioRef.current = new Audio();
    // REMOVED crossOrigin="anonymous" to prevent CORS blocking from YouTube redirects
    
    // Event Listeners for Audio
    const audio = audioRef.current;
    
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Sometimes we can trust the native duration instead of the database duration
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const onEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Play/Pause when state changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(e => {
        console.error("Audio play failed (maybe autoplay block):", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle Track Source Change
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    // Pass the search query to yt-dlp backend
    const target = `${currentTrack.title} ${currentTrack.artist}`;
    const newSrc = `http://localhost:3000/api/play/${encodeURIComponent(target)}`;
    
    // Only reload if src changed
    if (!audioRef.current.src.endsWith(encodeURIComponent(target))) {
        audioRef.current.src = newSrc;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error(e));
        }
    }
  }, [currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Volume Change
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Navigation Logic
  const currentNav = navHistory[navIndex] || { view: 'home', params: {} };
  const currentView = currentNav.view;
  const viewParams = currentNav.params;

  const navigateTo = (view: ViewType, params: ViewParams = {}) => {
    const nextHistory = navHistory.slice(0, navIndex + 1);
    nextHistory.push({ view, params });
    setNavHistory(nextHistory);
    setNavIndex(nextHistory.length - 1);
  };

  const navigateBack = () => {
    if (navIndex > 0) setNavIndex((i) => i - 1);
  };

  const navigateForward = () => {
    if (navIndex < navHistory.length - 1) setNavIndex((i) => i + 1);
  };

  const canNavigateBack = navIndex > 0;
  const canNavigateForward = navIndex < navHistory.length - 1;

  // Play a specific track
  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (currentTrack) {
      setHistory((prev) => [currentTrack, ...prev.filter((t) => t.id !== currentTrack.id)].slice(0, 30));
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    // Real duration will be updated from audio metadata, but we set DB duration first
    setDuration(track.duration || 0); 
    setIsPlaying(true);

    if (newQueue) {
      setQueue(newQueue.filter((t) => t.id !== track.id));
    }
  };

  const togglePlay = () => {
    if (!currentTrack && allTracks.length > 0) {
      playTrack(allTracks[0]);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      let nextIdx = 0;
      if (isShuffle) {
        nextIdx = Math.floor(Math.random() * queue.length);
      }
      const next = queue[nextIdx];
      const remaining = queue.filter((_, idx) => idx !== nextIdx);

      if (currentTrack) {
        setHistory((prev) => [currentTrack, ...prev.filter((t) => t.id !== currentTrack.id)].slice(0, 30));
      }

      setCurrentTrack(next);
      setCurrentTime(0);
      setDuration(next.duration || 0);
      setQueue(remaining);
      setIsPlaying(true);
    } else if (repeatMode === 'all') {
      if (allTracks.length > 0) {
        const next = allTracks[0];
        setCurrentTrack(next);
        setCurrentTime(0);
        setDuration(next.duration || 0);
        setQueue(allTracks.slice(1));
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (history.length > 0) {
      const prev = history[0];
      const newHistory = history.slice(1);

      if (currentTrack) {
        setQueue((q) => [currentTrack, ...q]);
      }

      setCurrentTrack(prev);
      setCurrentTime(0);
      setDuration(prev.duration || 0);
      setHistory(newHistory);
      setIsPlaying(true);
    } else {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const seekTo = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration || 0));
    if (audioRef.current) {
        audioRef.current.currentTime = clamped;
    }
    setCurrentTime(clamped);
  };

  const setVolumeLevel = (level: number) => {
    const clamped = Math.max(0, Math.min(level, 1));
    setVolume(clamped);
    if (clamped > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const toggleLike = (trackId: string) => {
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const isLiked = (trackId: string) => likedSongIds.has(trackId);
  const addToQueue = (track: Track) => setQueue((q) => [...q, track]);
  const removeFromQueue = (trackId: string) => setQueue((q) => q.filter((t) => t.id !== trackId));
  const clearQueue = () => setQueue([]);
  
  const toggleNowPlaying = () => setIsNowPlayingOpen(!isNowPlayingOpen);
  const toggleQueueModal = () => setIsQueueModalOpen(!isQueueModalOpen);
  const toggleFullScreenPlayer = () => setIsFullScreenPlayerOpen(!isFullScreenPlayerOpen);

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    history,
    likedSongIds,
    allTracks,
    playTrack,
    togglePlay,
    pause,
    nextTrack,
    prevTrack,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    addToQueue,
    removeFromQueue,
    clearQueue,
    currentView,
    viewParams,
    navigateTo,
    navigateBack,
    navigateForward,
    canNavigateBack,
    canNavigateForward,
    isNowPlayingOpen,
    toggleNowPlaying,
    isQueueModalOpen,
    toggleQueueModal,
    isFullScreenPlayerOpen,
    toggleFullScreenPlayer,
    isExportModalOpen,
    setExportModalOpen: setIsExportModalOpen,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
