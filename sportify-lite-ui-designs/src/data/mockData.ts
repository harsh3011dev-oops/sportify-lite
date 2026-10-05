import { Track, Album, Artist, Playlist, Category } from '../types/music';

/**
 * ====================================================================================
 * SPORTIFY LITE - MOCK DATA LAYER
 * ====================================================================================
 * This module provides rich client-side mock data representing tracks, albums,
 * artists, playlists, and search categories.
 *
 * BACKEND INTEGRATION ARCHITECTURE:
 * When connecting to a real Python (FastAPI/Flask) or Node.js (Express/Nest) backend:
 * 1. Replace static arrays with API client calls (e.g., fetch('/api/v1/tracks'), GET /api/v1/search)
 * 2. Set `audioUrl` to point to your streaming audio proxy (e.g. `/api/v1/stream?trackId=...`)
 * 3. The data models in `src/types/music.ts` are 100% compliant with standard REST schemas.
 * ====================================================================================
 */

export const MOCK_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight Echoes',
    artist: 'The Weeknd',
    artistId: 'artist-1',
    album: 'After Hours Reimagined',
    albumId: 'album-1',
    duration: 215, // 3:35
    coverGradient: 'from-purple-900 via-indigo-900 to-black',
    genre: 'R&B / Synthwave',
    plays: 14820300,
    releaseDate: '2024-03-12',
    isExplicit: false,
    lyrics: [
      'Neon lights reflections on the pavement',
      'Driving through the quiet city streets',
      'Searching for a signal in the twilight',
      'Where the bass and the rhythm meets',
      'Lost in midnight echoes of you'
    ]
  },
  {
    id: 'track-2',
    title: 'Tum Hi Ho (Acoustic Redux)',
    artist: 'Arijit Singh',
    artistId: 'artist-2',
    album: 'Soulful Evenings',
    albumId: 'album-2',
    duration: 262, // 4:22
    coverGradient: 'from-amber-900 via-rose-950 to-neutral-950',
    genre: 'Bollywood',
    plays: 38402910,
    releaseDate: '2023-11-04',
    isExplicit: false,
    lyrics: [
      'Hum tere bin ab reh nahi sakte',
      'Tere bina kya wajood mera',
      'Tujhse juda agar ho jayenge',
      'Toh khud se hi ho jayenge juda',
      'Kyunki tum hi ho, ab tum hi ho'
    ]
  },
  {
    id: 'track-3',
    title: 'Levitating Nights',
    artist: 'Dua Lipa',
    artistId: 'artist-3',
    album: 'Future Nostalgia Deluxe',
    albumId: 'album-3',
    duration: 203, // 3:23
    coverGradient: 'from-pink-900 via-fuchsia-950 to-neutral-950',
    genre: 'Pop / Dance',
    plays: 52190340,
    releaseDate: '2023-08-15',
    isExplicit: false,
    lyrics: [
      'If you wanna run away with me, I know a galaxy',
      'And I can take you for a ride',
      'I had a premonition that we fell into a rhythm',
      'Where the music don\'t stop for life'
    ]
  },
  {
    id: 'track-4',
    title: 'Lover (Bhangra Pulse)',
    artist: 'Diljit Dosanjh',
    artistId: 'artist-4',
    album: 'MoonChild Era',
    albumId: 'album-4',
    duration: 198, // 3:18
    coverGradient: 'from-emerald-900 via-teal-950 to-neutral-950',
    genre: 'Punjabi Pop',
    plays: 29810450,
    releaseDate: '2024-01-20',
    isExplicit: false,
    lyrics: [
      'Tera ni lover, koi hor labh le',
      'Dil da ni maada tera Diljit',
      'Saanu te bas ik tera hi sahara',
      'Chann to sohna tera mukhda pyara'
    ]
  },
  {
    id: 'track-5',
    title: 'Kasoor (Winter Rain)',
    artist: 'Prateek Kuhad',
    artistId: 'artist-5',
    album: 'Cold Mess Epilogue',
    albumId: 'album-5',
    duration: 192, // 3:12
    coverGradient: 'from-cyan-950 via-slate-900 to-black',
    genre: 'Indie Folk',
    plays: 18450120,
    releaseDate: '2023-12-01',
    isExplicit: false,
    lyrics: [
      'Kahaan chale gaye woh din suhane',
      'Baatein adhuri, chup chup fasaane',
      'Yeh hawayein gungunati hai',
      'Teri hi yaadein laati hai'
    ]
  },
  {
    id: 'track-6',
    title: 'Kun Faya Kun (Sufi Resonance)',
    artist: 'A.R. Rahman',
    artistId: 'artist-6',
    album: 'Spiritual Odyssey',
    albumId: 'album-6',
    duration: 472, // 7:52
    coverGradient: 'from-yellow-950 via-amber-950 to-neutral-950',
    genre: 'Classical / Sufi',
    plays: 64201880,
    releaseDate: '2022-09-10',
    isExplicit: false,
    lyrics: [
      'Ya Nizamuddin Auliya, Ya Nizamuddin Sarkar',
      'Kadam badha le, hado ko mita le',
      'Aaja khaalipan mein piye ja shifa'
    ]
  },
  {
    id: 'track-7',
    title: 'Lo-Fi Chill & Study #7',
    artist: 'Penguin Beats Lab',
    artistId: 'artist-7',
    album: 'Subzero Beats Vol. 1',
    albumId: 'album-7',
    duration: 165, // 2:45
    coverGradient: 'from-teal-900 via-cyan-950 to-slate-950',
    genre: 'Lo-Fi',
    plays: 8904320,
    releaseDate: '2024-02-14',
    isExplicit: false,
    lyrics: ['(Instrumental Lo-Fi Ambient Chill beats)']
  },
  {
    id: 'track-8',
    title: 'Blinding Horizons',
    artist: 'The Weeknd',
    artistId: 'artist-1',
    album: 'After Hours Reimagined',
    albumId: 'album-1',
    duration: 200, // 3:20
    coverGradient: 'from-red-950 via-rose-950 to-black',
    genre: 'Synthwave',
    plays: 87102940,
    releaseDate: '2024-02-01',
    isExplicit: false
  },
  {
    id: 'track-9',
    title: 'Channa Mereya (Live in London)',
    artist: 'Arijit Singh',
    artistId: 'artist-2',
    album: 'Soulful Evenings',
    albumId: 'album-2',
    duration: 289,
    coverGradient: 'from-orange-950 via-red-950 to-black',
    genre: 'Bollywood',
    plays: 44102900,
    releaseDate: '2023-10-18',
    isExplicit: false
  },
  {
    id: 'track-10',
    title: 'G.O.A.T.',
    artist: 'Diljit Dosanjh',
    artistId: 'artist-4',
    album: 'MoonChild Era',
    albumId: 'album-4',
    duration: 224,
    coverGradient: 'from-amber-800 via-stone-900 to-black',
    genre: 'Punjabi Pop',
    plays: 67392110,
    releaseDate: '2023-06-11',
    isExplicit: true
  },
  {
    id: 'track-11',
    title: 'Rainy Cafe in Tokyo',
    artist: 'Penguin Beats Lab',
    artistId: 'artist-7',
    album: 'Subzero Beats Vol. 1',
    albumId: 'album-7',
    duration: 178,
    coverGradient: 'from-indigo-950 via-slate-900 to-black',
    genre: 'Lo-Fi',
    plays: 12402100,
    releaseDate: '2024-01-05',
    isExplicit: false
  },
  {
    id: 'track-12',
    title: 'Fix You (Celestial Mix)',
    artist: 'Coldplay',
    artistId: 'artist-8',
    album: 'A Sky Full Of Lights',
    albumId: 'album-8',
    duration: 295,
    coverGradient: 'from-blue-900 via-sky-950 to-black',
    genre: 'Rock / Alternative',
    plays: 78912300,
    releaseDate: '2023-05-19',
    isExplicit: false
  }
];

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: 'The Weeknd',
    avatarGradient: 'from-purple-600 via-indigo-700 to-neutral-900',
    bannerGradient: 'from-purple-950/90 via-indigo-950/60 to-black',
    monthlyListeners: 108420950,
    bio: 'Grammy-winning visionary Canadian artist known for atmospheric synthwave, brooding R&B, and infectious chart-topping pop hymns.',
    verified: true,
    popularTrackIds: ['track-1', 'track-8'],
    albumIds: ['album-1']
  },
  {
    id: 'artist-2',
    name: 'Arijit Singh',
    avatarGradient: 'from-amber-600 via-rose-700 to-neutral-900',
    bannerGradient: 'from-amber-950/90 via-rose-950/60 to-black',
    monthlyListeners: 89340210,
    bio: 'India’s most celebrated romantic and soulful playback maestro, known for timeless acoustic ballads and emotive melodies.',
    verified: true,
    popularTrackIds: ['track-2', 'track-9'],
    albumIds: ['album-2']
  },
  {
    id: 'artist-3',
    name: 'Dua Lipa',
    avatarGradient: 'from-fuchsia-600 via-pink-700 to-neutral-900',
    bannerGradient: 'from-pink-950/90 via-fuchsia-950/60 to-black',
    monthlyListeners: 76540190,
    bio: 'Global pop powerhouse redefining modern disco and dance grooves with sharp songwriting, basslines, and hypnotic energy.',
    verified: true,
    popularTrackIds: ['track-3'],
    albumIds: ['album-3']
  },
  {
    id: 'artist-4',
    name: 'Diljit Dosanjh',
    avatarGradient: 'from-emerald-600 via-teal-700 to-neutral-900',
    bannerGradient: 'from-emerald-950/90 via-teal-950/60 to-black',
    monthlyListeners: 42100800,
    bio: 'International superstar, Coachella trailblazer, and king of Punjabi beats, fusing traditional folk with global trap and pop.',
    verified: true,
    popularTrackIds: ['track-4', 'track-10'],
    albumIds: ['album-4']
  },
  {
    id: 'artist-5',
    name: 'Prateek Kuhad',
    avatarGradient: 'from-cyan-600 via-blue-700 to-neutral-900',
    bannerGradient: 'from-cyan-950/90 via-slate-950/60 to-black',
    monthlyListeners: 14200500,
    bio: 'Acclaimed singer-songwriter crafting gentle, bittersweet acoustic poetry that resonates across global indie music scenes.',
    verified: true,
    popularTrackIds: ['track-5'],
    albumIds: ['album-5']
  },
  {
    id: 'artist-6',
    name: 'A.R. Rahman',
    avatarGradient: 'from-yellow-600 via-amber-700 to-neutral-900',
    bannerGradient: 'from-yellow-950/90 via-amber-950/60 to-black',
    monthlyListeners: 54109400,
    bio: 'Two-time Academy Award winner and cultural icon blending Western classical harmony with Eastern ragas and electronic soundscapes.',
    verified: true,
    popularTrackIds: ['track-6'],
    albumIds: ['album-6']
  },
  {
    id: 'artist-7',
    name: 'Penguin Beats Lab',
    avatarGradient: 'from-teal-500 via-emerald-600 to-cyan-800',
    bannerGradient: 'from-teal-950/90 via-emerald-950/60 to-black',
    monthlyListeners: 9400200,
    bio: 'Official Sportify Lite in-house lo-fi collective crafting ambient study rhythms, vinyl scratches, and mellow chillhop.',
    verified: true,
    popularTrackIds: ['track-7', 'track-11'],
    albumIds: ['album-7']
  },
  {
    id: 'artist-8',
    name: 'Coldplay',
    avatarGradient: 'from-blue-600 via-sky-700 to-neutral-900',
    bannerGradient: 'from-blue-950/90 via-sky-950/60 to-black',
    monthlyListeners: 84310900,
    bio: 'Iconic British rock band renowned for uplifting stadium anthems, cosmic visuals, and transcendent melodies.',
    verified: true,
    popularTrackIds: ['track-12'],
    albumIds: ['album-8']
  }
];

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'album-1',
    title: 'After Hours Reimagined',
    artist: 'The Weeknd',
    artistId: 'artist-1',
    coverGradient: 'from-purple-900 via-indigo-950 to-black',
    releaseYear: 2024,
    genre: 'Synthwave / Pop',
    trackCount: 2,
    duration: '6 min 55 sec',
    description: 'A cinematic nocturnal trip through glossy city lights, analog synthesis, and heartbreaking memories.',
    tracks: [MOCK_TRACKS[0], MOCK_TRACKS[7]]
  },
  {
    id: 'album-2',
    title: 'Soulful Evenings',
    artist: 'Arijit Singh',
    artistId: 'artist-2',
    coverGradient: 'from-amber-900 via-rose-950 to-neutral-950',
    releaseYear: 2023,
    genre: 'Bollywood Romantic',
    trackCount: 2,
    duration: '9 min 11 sec',
    description: 'Intimate acoustic arrangements capturing the depth of longing, love, and monsoon nostalgia.',
    tracks: [MOCK_TRACKS[1], MOCK_TRACKS[8]]
  },
  {
    id: 'album-3',
    title: 'Future Nostalgia Deluxe',
    artist: 'Dua Lipa',
    artistId: 'artist-3',
    coverGradient: 'from-pink-900 via-fuchsia-950 to-neutral-950',
    releaseYear: 2023,
    genre: 'Dance Pop',
    trackCount: 1,
    duration: '3 min 23 sec',
    description: 'Electrifying basslines and dancefloor euphoria made for late-night celebrations.',
    tracks: [MOCK_TRACKS[2]]
  },
  {
    id: 'album-4',
    title: 'MoonChild Era',
    artist: 'Diljit Dosanjh',
    artistId: 'artist-4',
    coverGradient: 'from-emerald-900 via-teal-950 to-neutral-950',
    releaseYear: 2024,
    genre: 'Punjabi Pop',
    trackCount: 2,
    duration: '7 min 02 sec',
    description: 'Bhangra rhythm infused with futuristic trap drums, swagger, and vibrant storytelling.',
    tracks: [MOCK_TRACKS[3], MOCK_TRACKS[9]]
  },
  {
    id: 'album-5',
    title: 'Cold Mess Epilogue',
    artist: 'Prateek Kuhad',
    artistId: 'artist-5',
    coverGradient: 'from-cyan-950 via-slate-900 to-black',
    releaseYear: 2023,
    genre: 'Indie Acoustic',
    trackCount: 1,
    duration: '3 min 12 sec',
    description: 'Gentle fingerpicked guitar ballads that feel like warm coffee on a rainy afternoon.',
    tracks: [MOCK_TRACKS[4]]
  },
  {
    id: 'album-6',
    title: 'Spiritual Odyssey',
    artist: 'A.R. Rahman',
    artistId: 'artist-6',
    coverGradient: 'from-yellow-950 via-amber-950 to-neutral-950',
    releaseYear: 2022,
    genre: 'Classical Sufi',
    trackCount: 1,
    duration: '7 min 52 sec',
    description: 'A transcendent spiritual voyage merging qawwali vocals with orchestral soundscapes.',
    tracks: [MOCK_TRACKS[5]]
  },
  {
    id: 'album-7',
    title: 'Subzero Beats Vol. 1',
    artist: 'Penguin Beats Lab',
    artistId: 'artist-7',
    coverGradient: 'from-teal-900 via-cyan-950 to-slate-950',
    releaseYear: 2024,
    genre: 'Lo-Fi Chillhop',
    trackCount: 2,
    duration: '5 min 43 sec',
    description: 'Relaxed tempo, warm tape crackle, and soft keys designed for deep work and coding sessions.',
    tracks: [MOCK_TRACKS[6], MOCK_TRACKS[10]]
  },
  {
    id: 'album-8',
    title: 'A Sky Full Of Lights',
    artist: 'Coldplay',
    artistId: 'artist-8',
    coverGradient: 'from-blue-900 via-sky-950 to-black',
    releaseYear: 2023,
    genre: 'Alternative Stadium Rock',
    trackCount: 1,
    duration: '4 min 55 sec',
    description: 'Soaring guitars and piano chords engineered to illuminate stadiums and warm hearts.',
    tracks: [MOCK_TRACKS[11]]
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-chill',
    title: 'Chill Vibes',
    description: 'Mellow tunes, soft beats, and soothing vocals to unwind your evening.',
    coverGradient: 'from-emerald-800 via-teal-950 to-neutral-950',
    trackCount: 6,
    duration: '22 min',
    owner: 'Sportify Lite Editorial',
    isCurated: true,
    trackIds: ['track-7', 'track-5', 'track-11', 'track-2', 'track-1', 'track-12']
  },
  {
    id: 'playlist-workout',
    title: 'Workout',
    description: 'High-octane bass drops, rap, and power beats to crush your personal bests.',
    coverGradient: 'from-rose-800 via-red-950 to-neutral-950',
    trackCount: 5,
    duration: '18 min',
    owner: 'Sportify Lite Editorial',
    isCurated: true,
    trackIds: ['track-3', 'track-4', 'track-10', 'track-8', 'track-1']
  },
  {
    id: 'playlist-bollywood',
    title: 'Bollywood',
    description: 'Timeless melodies, romantic anthems, and iconic playback blockbusters.',
    coverGradient: 'from-amber-700 via-orange-950 to-neutral-950',
    trackCount: 4,
    duration: '21 min',
    owner: 'Sportify Lite Editorial',
    isCurated: true,
    trackIds: ['track-2', 'track-9', 'track-6', 'track-5']
  },
  {
    id: 'playlist-lofi',
    title: 'Lo-Fi Nights',
    description: 'Cosy vinyl crackle, gentle chords, and peaceful beats for late-night focus.',
    coverGradient: 'from-indigo-800 via-slate-950 to-neutral-950',
    trackCount: 5,
    duration: '19 min',
    owner: 'Penguin Lab',
    isCurated: true,
    trackIds: ['track-7', 'track-11', 'track-5', 'track-1', 'track-6']
  },
  {
    id: 'playlist-travel',
    title: 'Travel Mix',
    description: 'The ultimate road trip soundtrack through scenic horizons and open highways.',
    coverGradient: 'from-cyan-800 via-blue-950 to-neutral-950',
    trackCount: 6,
    duration: '25 min',
    owner: 'Sportify Lite Editorial',
    isCurated: true,
    trackIds: ['track-4', 'track-12', 'track-3', 'track-1', 'track-10', 'track-8']
  },
  {
    id: 'playlist-focus',
    title: 'Deep Focus',
    description: 'Ambient textures and steady rhythms to enter the flow state without distraction.',
    coverGradient: 'from-teal-800 via-slate-900 to-black',
    trackCount: 4,
    duration: '17 min',
    owner: 'Penguin Lab',
    isCurated: true,
    trackIds: ['track-7', 'track-11', 'track-6', 'track-5']
  }
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-bollywood',
    title: 'Bollywood',
    gradient: 'from-orange-600 to-amber-700',
    textColor: 'text-amber-100',
    featuredGenre: 'Bollywood',
    iconName: 'Flame'
  },
  {
    id: 'cat-hindi',
    title: 'Hindi',
    gradient: 'from-rose-600 to-red-800',
    textColor: 'text-rose-100',
    featuredGenre: 'Hindi',
    iconName: 'Heart'
  },
  {
    id: 'cat-punjabi',
    title: 'Punjabi',
    gradient: 'from-emerald-600 to-teal-800',
    textColor: 'text-emerald-100',
    featuredGenre: 'Punjabi Pop',
    iconName: 'Zap'
  },
  {
    id: 'cat-english',
    title: 'English',
    gradient: 'from-blue-600 to-indigo-800',
    textColor: 'text-blue-100',
    featuredGenre: 'Pop',
    iconName: 'Globe'
  },
  {
    id: 'cat-lofi',
    title: 'Lo-Fi',
    gradient: 'from-indigo-600 to-purple-800',
    textColor: 'text-indigo-100',
    featuredGenre: 'Lo-Fi',
    iconName: 'Coffee'
  },
  {
    id: 'cat-classical',
    title: 'Classical',
    gradient: 'from-amber-700 to-yellow-900',
    textColor: 'text-amber-100',
    featuredGenre: 'Classical',
    iconName: 'Music'
  },
  {
    id: 'cat-rock',
    title: 'Rock',
    gradient: 'from-red-700 to-stone-900',
    textColor: 'text-red-100',
    featuredGenre: 'Rock',
    iconName: 'Radio'
  },
  {
    id: 'cat-pop',
    title: 'Pop',
    gradient: 'from-pink-600 to-rose-700',
    textColor: 'text-pink-100',
    featuredGenre: 'Pop',
    iconName: 'Sparkles'
  },
  {
    id: 'cat-hiphop',
    title: 'Hip-Hop',
    gradient: 'from-yellow-600 to-amber-800',
    textColor: 'text-yellow-100',
    featuredGenre: 'Hip-Hop',
    iconName: 'Disc'
  },
  {
    id: 'cat-indie',
    title: 'Indie',
    gradient: 'from-teal-600 to-cyan-800',
    textColor: 'text-teal-100',
    featuredGenre: 'Indie Folk',
    iconName: 'Feather'
  },
  {
    id: 'cat-devotional',
    title: 'Devotional',
    gradient: 'from-amber-600 to-orange-800',
    textColor: 'text-amber-100',
    featuredGenre: 'Devotional',
    iconName: 'Sun'
  },
  {
    id: 'cat-instrumental',
    title: 'Instrumental',
    gradient: 'from-slate-700 to-zinc-900',
    textColor: 'text-slate-100',
    featuredGenre: 'Instrumental',
    iconName: 'Headphones'
  }
];

// Helper to look up track by ID
export function getTrackById(id: string): Track | undefined {
  return MOCK_TRACKS.find(t => t.id === id);
}

// Helper to look up album by ID
export function getAlbumById(id: string): Album | undefined {
  return MOCK_ALBUMS.find(a => a.id === id);
}

// Helper to look up artist by ID
export function getArtistById(id: string): Artist | undefined {
  return MOCK_ARTISTS.find(a => a.id === id);
}

// Helper to look up playlist by ID
export function getPlaylistById(id: string): Playlist | undefined {
  return MOCK_PLAYLISTS.find(p => p.id === id);
}

// Format seconds into "m:ss"
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format play counts like "14.8M"
export function formatPlays(count: number): string {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}
