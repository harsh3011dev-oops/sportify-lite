export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // in seconds
  coverGradient: string; // CSS gradient string for high-fidelity fallback & vibrant aesthetics
  coverIcon?: string;
  coverImage?: string;
  genre: string;
  plays: number;
  releaseDate: string;
  lyrics?: string[];
  audioUrl?: string; // Future streaming endpoint
  isExplicit?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverGradient: string;
  coverImage?: string;
  releaseYear: number;
  genre: string;
  trackCount: number;
  duration: string;
  description: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  avatarGradient: string;
  avatarImage?: string;
  bannerGradient: string;
  monthlyListeners: number;
  bio: string;
  verified: boolean;
  popularTrackIds: string[];
  albumIds: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverGradient: string;
  coverImage?: string;
  trackCount: number;
  duration: string;
  owner: string;
  isCurated?: boolean;
  trackIds: string[];
}

export interface Category {
  id: string;
  title: string;
  gradient: string;
  textColor: string;
  featuredGenre: string;
  iconName: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  history: Track[];
  likedSongIds: Set<string>;
}

export type ViewType = 
  | 'home'
  | 'search'
  | 'library'
  | 'liked'
  | 'recently_played'
  | 'artist'
  | 'album'
  | 'playlist'
  | 'settings';

export interface ViewParams {
  artistId?: string;
  albumId?: string;
  playlistId?: string;
  searchQuery?: string;
  categoryFilter?: string;
}
