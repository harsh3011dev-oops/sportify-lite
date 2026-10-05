# Sportify Lite - Modern Music Streaming Application

A frontend UI prototype for **Sportify Lite**, featuring a premium dark theme, penguin branding, discovery feed, interactive sticky player, and modular design.

## Features

- **Branding**: Penguin with neon studio headphones mascot in vector SVG.
- **Left Sidebar**: Home, Search, Your Library, Liked Songs, Recently Played, and Playlists ("Chill Vibes", "Workout", "Bollywood", "Lo-Fi Nights", "Travel Mix").
- **Top Bar**: History back/forward buttons, search bar with voice search simulation, notification popover, settings, and one-click ZIP exporter.
- **Home Discovery**:
  - "Good Afternoon" / "Made for your listening" personalized header tiles
  - "Trending Now" cards with hover play animations
  - "Quick Picks" compact audio rows
  - "Recently Played"
  - "Popular Artists" circular cards
  - "Made For You" curated playlists
  - "New Releases"
- **Interactive Sticky Player**: Fixed bottom playback bar with album artwork, song title, artist, play/pause, prev/next, shuffle, repeat, scrubbable progress bar, volume control, and Web Audio API tone synthesis.
- **Right-Side Now Playing Panel**: Expanded artwork, artist bio, lyrics preview, and Up Next queue.
- **Full-Screen Visualizer**: Immersive music visualizer mode with equalizer bars and lyrics.
- **Search Experience**: Categorized genres (Bollywood, Hindi, Punjabi, English, Lo-Fi, Classical, Rock, Pop, Hip-Hop, Indie, Devotional, Instrumental) with live multi-entity filtering across Songs, Artists, Albums, and Playlists.
- **Library Page**: Tabbed filtering for Playlists, Liked Songs, Artists, Albums, and History with Grid/List layout toggle.
- **Dedicated Entity Views**:
  - Artist View with monthly listeners, verified badge, and discography
  - Album View with tracklist and Play All action
  - Playlist View with duration and like toggles
- **Empty States & Skeletons**: Tailored states featuring the Penguin mascot.
- **Responsive**: Desktop (sidebar + player + right panel), tablet, and mobile (bottom navigation + compact player).
- **One-Click ZIP Export**: Built-in in-browser ZIP export modal powered by JSZip.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local Vite development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Future Backend & Streaming Integration

All mock data is cleanly decoupled in `src/data/mockData.ts` and models are defined in `src/types/music.ts`:
- **Node.js / Python API**: Replace mock arrays with `fetch('/api/v1/tracks')` or `axios.get('/api/v1/search')`.
- **Audio Streaming Service (yt-dlp / S3)**: Set `audioUrl` on `Track` to stream directly to an HTML5 `<audio>` or Web Audio element.
- **User Database**: Hook the `likedSongIds` state in `MusicPlayerContext.tsx` into a user profile database.
