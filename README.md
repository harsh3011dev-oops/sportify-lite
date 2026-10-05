# 🎵 Sportify Lite - Scalable Music Streaming Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stack: Node.js + TypeScript](https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript-brightgreen)](https://nodejs.org)
[![Database: PostgreSQL + Redis](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Redis-blue)](https://www.postgresql.org)
[![Queue: BullMQ + FFmpeg](https://img.shields.io/badge/Processing-BullMQ%20%7C%20FFmpeg-orange)](https://ffmpeg.org)
[![Platform: Android](https://img.shields.io/badge/Client-Android-green)](https://developer.android.com)

**Sportify Lite** is a scalable, modular, Spotify-like music streaming platform engineered for high-performance audio delivery, rich user interaction, automated ingestion, and flexible distributed storage routing. 

Built specifically for competition demos and production scaling, the platform supports multi-user profiles, multilingual music discovery, dynamic playlists, favorites, real-time audio transcoding, hash-based deduplication, and pluggable storage providers (Google Drive, S3, Local, CDN).

> ⚠️ **Rights & Legal Compliance Notice:**  
> This platform strictly ingests and streams **rights-cleared, open-licensed, public-domain, or artist-authorized content**. Storage providers and API endpoints are designed to respect audio copyright compliance.

---

## 📑 Table of Contents

- [1. Core Architecture](#1-core-architecture)
- [2. System Features](#2-system-features)
- [3. Multilingual Catalog & Capacity Planning](#3-multilingual-catalog--capacity-planning)
- [4. Data Model & Database Design](#4-data-model--database-design)
- [5. Audio Storage & Storage Router](#5-audio-storage--storage-router)
- [6. Processing Pipeline & Automated Ingestion](#6-processing-pipeline--automated-ingestion)
- [7. Project Directory Structure](#7-project-directory-structure)
- [8. Security & Authorization](#8-security--authorization)
- [9. API Endpoint Specification](#9-api-endpoint-specification)
- [10. Development Roadmap](#10-development-roadmap)
- [11. Getting Started](#11-getting-started)

---

## 1. Core Architecture

The system uses a decoupled, multi-tier architecture where the **Android Client never communicates directly with database, cache, or storage providers**. All interactions flow securely through the **Backend API Gateways**.

```text
                               ┌──────────────────────┐
                               │     Android App      │
                               │                      │
                               │ Login / Search       │
                               │ Player / Playlist    │
                               │ Favorites / History  │
                               └──────────┬───────────┘
                                          │
                                          ▼
                               ┌──────────────────────┐
                               │      Backend API     │
                               │ Node.js + TypeScript │
                               └──────────┬───────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │                           │                           │
              ▼                           ▼                           ▼
       ┌────────────┐              ┌────────────┐              ┌────────────┐
       │ PostgreSQL │              │   Redis    │              │   Search   │
       │  Metadata  │              │Cache/Queue │              │   Engine   │
       └────────────┘              └─────┬──────┘              └────────────┘
                                          │
                                          ▼
                                    ┌───────────┐
                                    │   n8n     │
                                    │Automation │
                                    └─────┬─────┘
                                          │
                                          ▼
                                    ┌───────────┐
                                    │ Workers   │
                                    │ FFmpeg    │
                                    └─────┬─────┘
                                          │
                                          ▼
                               ┌──────────────────────┐
                               │    Storage Router    │
                               └──────────┬───────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              ▼                           ▼                           ▼
       Google Drive                 Object Storage                   CDN
 (Demo / Dev / Archive)               (S3 / MinIO)             (Edge Distribution)
```

### Key Architectural Layers:
1. **Android Application**: Full-featured native client handling media playback, queue management, user sessions, search, and offline history.
2. **Backend API**: Node.js + TypeScript (Fastify/Express) managing JWT authentication, API routing, business logic, authorization, rate limiting, and analytics.
3. **Relational Database (PostgreSQL)**: Stores system metadata (users, songs, artists, albums, playlists, genres, languages, storage references).
4. **Caching & Queue (Redis + BullMQ)**: Handles API response caching, rate limiting, session storage, and asynchronous audio processing worker jobs.
5. **Automation & Ingestion (n8n)**: Orchestrates workflow triggers, ingests rights-cleared media feeds, and enqueues worker tasks.
6. **Background Workers (FFmpeg)**: Validates input audio, calculates SHA-256 content hashes for deduplication, normalizes loudness, and transcodes to multi-bitrate audio targets (64kbps, 96kbps, 128kbps, 320kbps).
7. **Storage Router**: Polymorphic storage abstraction layer enabling dynamic media serving from Google Drive, AWS S3/MinIO, Local Storage, or Edge CDNs without client awareness.

---

## 2. System Features

### 📱 Android Application
* **Authentication**: Email/password signup & login with JWT authorization.
* **Music Player**: Play, pause, seek, next/previous track, queue re-ordering, and album art visualizer.
* **Quality Switcher**: Dynamically switch audio bitrates (e.g., 64kbps data-saver, 96kbps standard, 128kbps high quality).
* **Media Controls**: Background audio playback service integrated with Android system notifications and lock-screen controls.
* **Discovery & Social**: Multilingual browsing, genre filtering, search history, custom playlists, favorites, and recently played tracks.
* **Network Awareness**: Intelligent buffering based on cellular vs Wi-Fi connection states.

### ⚙️ Backend & Workers
* **Storage Router Abstraction**: Single unified API for playback URL retrieval regardless of underlying storage cloud.
* **Audio Transcoding**: FFmpeg pipeline generating normalized MP3/AAC/HLS formats.
* **SHA-256 Deduplication**: Prevents duplicate binary uploads by verifying audio content signatures before processing.
* **Search Indexing**: PostgreSQL full-text search with seamless migration path to Meilisearch / OpenSearch.
* **Admin & Analytics**: Dashboard APIs tracking upload statuses, storage usage, queue performance, and language/genre distribution.

---

## 3. Multilingual Catalog & Capacity Planning

### 📊 Target Catalog Distribution (100,000 Songs)

To simulate a realistic global streaming platform, the database schema supports dynamic, unlimited language mappings. Below is the reference target distribution for a 100k song catalog:

| Language | Approx. Share | Target Songs |
| :--- | :---: | :---: |
| **Hindi** | 25% | 25,000 |
| **English** | 20% | 20,000 |
| **Punjabi** | 10% | 10,000 |
| **Telugu** | 8% | 8,000 |
| **Tamil** | 8% | 8,000 |
| **Bengali** | 6% | 6,000 |
| **Marathi** | 5% | 5,000 |
| **Kannada** | 5% | 5,000 |
| **Malayalam** | 4% | 4,000 |
| **Gujarati** | 3% | 3,000 |
| **Bhojpuri** | 3% | 3,000 |
| **Other Indian/Int'l** | 3% | 3,000 |
| **Total Target** | **100%** | **100,000** |

*Note: The language table is database-driven (`languages` table) and extensible to any standard ISO language code (e.g., `hi`, `en`, `pa`, `te`, `ta`, `bn`, `mr`, `kn`, `ml`, `gu`, `bho`, `or`, `as`, `ur`, `ne`, `ks`).*

---

### 💾 Storage Capacity Matrix (100,000 Songs @ Avg 4 min/song)

| Bitrate Variant | Audio Storage | Practical Storage (+ Covers, Metadata, Cache) | Multi-Quality Target (64+96+128 kbps) |
| :--- | :---: | :---: | :---: |
| **64 kbps** (Data Saver) | ~192 GB | ~250 GB | -- |
| **96 kbps** (Standard) | ~288 GB | ~350 – 500 GB | Recommended MVP Base |
| **128 kbps** (High) | ~384 GB | ~500 GB | -- |
| **192 kbps** (Very High) | ~576 GB | ~750 GB | -- |
| **320 kbps** (Extreme) | ~960 GB | ~1.2 TB | Total Multi-Quality Capacity: **~1.0 – 2.0 TB** |

---

## 4. Data Model & Database Design

The PostgreSQL database maintains clean normalized metadata. Audio files and binary images are kept exclusively inside storage providers and referenced via `storage_objects`.

```mermaid
erDiagram
    USERS ||--o{ PLAYLISTS : creates
    USERS ||--o{ FAVORITES : marks
    USERS ||--o{ RECENTLY_PLAYED : listens
    PLAYLISTS ||--o{ PLAYLIST_SONGS : contains
    SONGS ||--o{ PLAYLIST_SONGS : listed_in
    SONGS ||--o{ FAVORITES : favorited_in
    SONGS ||--o{ RECENTLY_PLAYED : recorded_in
    SONGS }|--|| ARTISTS : primary_artist
    SONGS }|--|| ALBUMS : belongs_to
    SONGS ||--o{ SONG_LANGUAGES : categorized_in
    LANGUAGES ||--o{ SONG_LANGUAGES : contains
    SONGS ||--o{ SONG_GENRES : categorized_as
    GENRES ||--o{ SONG_GENRES : contains
    SONGS ||--o{ STORAGE_OBJECTS : maps_to
    STORAGE_PROVIDERS ||--o{ STORAGE_OBJECTS : hosts
```

### Core Schema Definition Summary

* **`users`**: `id`, `email`, `password_hash`, `name`, `role`, `created_at`
* **`artists`**: `id`, `name`, `bio`, `avatar_url`, `created_at`
* **`albums`**: `id`, `title`, `artist_id`, `cover_url`, `release_year`, `created_at`
* **`songs`**: `id`, `title`, `artist_id`, `album_id`, `duration_seconds`, `release_year`, `content_hash`, `created_at`
* **`languages`**: `id`, `name`, `code` (e.g. `hi`, `en`), `is_active`
* **`song_languages`**: `song_id`, `language_id` *(Supports multi-language tracks)*
* **`genres`**: `id`, `name`, `slug`
* **`playlists`**: `id`, `user_id`, `title`, `description`, `is_public`, `created_at`
* **`playlist_songs`**: `playlist_id`, `song_id`, `position`, `added_at`
* **`favorites`**: `user_id`, `song_id`, `created_at`
* **`recently_played`**: `id`, `user_id`, `song_id`, `played_at`, `duration_listened`
* **`storage_providers`**: `id`, `name` (`google_drive`, `s3`, `local`), `is_active`
* **`storage_objects`**: `id`, `song_id`, `provider_id`, `quality_label` (`96k`, `128k`), `storage_key`, `file_size_bytes`

---

## 5. Audio Storage & Storage Router

The system implements a pluggable `StorageRouter` pattern. The application code asks for a streaming reference, and the router resolves the correct location dynamically based on availability, user quality tier, and infrastructure cost rules.

```typescript
// Conceptual Interface for Storage Providers
export interface IStorageProvider {
  name: string;
  getPlaybackUrl(storageKey: string, expiresInSeconds: number): Promise<string>;
  uploadStream(fileStream: Readable, destinationPath: string): Promise<string>;
  deleteFile(storageKey: string): Promise<boolean>;
}

// Storage Router dynamically selects provider
export class StorageRouter {
  private providers: Map<string, IStorageProvider>;

  async getStreamUrl(songId: string, quality: string): Promise<string> {
    const object = await db.storageObjects.findFirst({ songId, quality });
    const provider = this.providers.get(object.providerName);
    return provider.getPlaybackUrl(object.storageKey, 3600); // 1-hour signed URL
  }
}
```

### Supported Storage Targets:
1. **Google Drive Provider**: Used for development, demo, archiving, and controlled media ingestion via Google Drive API.
2. **S3 / MinIO Provider**: Used for high-throughput production object storage with bucket policies.
3. **Local Storage Provider**: For local testing and standalone sandbox execution.
4. **CDN Integration**: AWS CloudFront or Cloudflare placed in front of object storage for edge audio streaming.

---

## 6. Processing Pipeline & Automated Ingestion

Incoming audio follows a strict validation, deduplication, and transcoding pipeline before becoming available for playback in the app.

```text
  Rights-Cleared Audio Source
              │
              ▼
       n8n Automation Flow
              │
              ▼
      Validation & Checks
              │
              ▼
   BullMQ (Redis Ingest Queue)
              │
              ▼
   FFmpeg Worker Transcoder ──► Calculate SHA-256 Hash
              │                         │
              │                         ▼
              │                Deduplication Check (PostgreSQL)
              │               ┌─────────┴─────────┐
              │             Exists?             New?
              │               │                   │
              │             Skip               Continue
              │                                   │
              ▼                                   ▼
    Generate Bitrate Variants           Upload via Storage Router
  (64kbps / 96kbps / 128kbps)            (Drive / S3 / Local)
              │                                   │
              └─────────────────┬─────────────────┘
                                │
                                ▼
                   Save PostgreSQL Metadata
                                │
                                ▼
                     Update Search Engine Index
```

---

## 7. Project Directory Structure

```text
sportify-lite/
├── android/                    # Android Native Application (Kotlin/Java)
│   ├── app/src/main/java/com/sportify/
│   │   ├── ui/                 # Activities, Fragments, Player View
│   │   ├── data/               # API Repositories, Retrofit Services
│   │   ├── player/             # ExoPlayer / Media3 Background Service
│   │   └── models/             # Data Models (Song, User, Playlist)
│   └── build.gradle
│
├── backend/                    # Core REST API Gateway
│   ├── src/
│   │   ├── auth/               # JWT & User Password Utilities
│   │   ├── users/              # Profile & Preferences Handlers
│   │   ├── songs/              # Track Metadata & Streaming Handlers
│   │   ├── artists/            # Artist Management
│   │   ├── albums/             # Album Controller & Services
│   │   ├── playlists/          # Playlist CRUD & Song Ordering
│   │   ├── favorites/          # Favorites Toggle & Retrieval
│   │   ├── history/            # Recently Played Tracking
│   │   ├── search/             # SQL Full-Text / Meilisearch Client
│   │   ├── playback/           # Playback Authorization & Event Logging
│   │   ├── storage/            # Storage Router Implementation
│   │   │   ├── StorageRouter.ts
│   │   │   ├── GoogleDriveProvider.ts
│   │   │   ├── S3Provider.ts
│   │   │   └── LocalProvider.ts
│   │   └── app.ts              # Fastify / Express Initialization
│   ├── package.json
│   └── tsconfig.json
│
├── workers/                    # Asynchronous Background Processing
│   ├── transcoder/             # FFmpeg Transcoding Engine
│   ├── uploader/               # Storage Router Bulk Transfer Worker
│   └── metadata/               # ID3 Tag Extraction & Hash Generator
│
├── n8n/                        # Ingestion Workflows
│   └── workflows/              # Exported n8n Ingestion Flow JSONs
│
├── database/                   # Database Scripts & Migrations
│   ├── migrations/             # SQL Schema Migration Scripts
│   └── seed/                   # Multilingual Catalog Seeding Data
│
├── docker-compose.yml          # Containerized Infrastructure (Postgres, Redis, n8n)
└── README.md                   # System Documentation
```

---

## 8. Security & Authorization

* **Password Security**: Passwords hashed using `argon2` or `bcrypt` with high cost factors.
* **Token Isolation**: Auth relies on short-lived JWT access tokens and HTTP-only secure refresh cookies.
* **Zero Credential Exposure**: Android application receives **only** temporary playback URLs; storage access keys, S3 secrets, and Google Drive tokens remain strictly on the backend.
* **Rate Limiting**: Redis-backed rate limiting applied to authentication, search, and streaming endpoint routes.
* **Signed Playback URLs**: Media URLs generated by the `StorageRouter` carry short-lived signatures (e.g., 1 hour expiry) to prevent hotlinking.

---

## 9. API Endpoint Specification

### Auth & User
* `POST /api/v1/auth/signup` - Register a new user
* `POST /api/v1/auth/login` - Authenticate and acquire access token
* `GET  /api/v1/users/me` - Fetch user profile & settings

### Catalog & Discovery
* `GET  /api/v1/songs` - Browse catalog with filters (`language`, `genre`, `page`, `limit`)
* `GET  /api/v1/songs/:id` - Fetch detailed track metadata
* `GET  /api/v1/artists/:id` - Fetch artist profile & top tracks
* `GET  /api/v1/albums/:id` - Fetch album tracklist

### Playback & Streaming
* `GET  /api/v1/songs/:id/play?quality=96k` - Generate temporary authorized playback reference URL
* `POST /api/v1/playback/event` - Record playback history & listen analytics

### Playlists & User State
* `GET    /api/v1/playlists` - Get user playlists
* `POST   /api/v1/playlists` - Create new playlist
* `POST   /api/v1/playlists/:id/songs` - Add track to playlist
* `DELETE /api/v1/playlists/:id/songs/:songId` - Remove track from playlist
* `POST   /api/v1/favorites/:songId` - Toggle song favorite
* `GET    /api/v1/history` - Get recently played songs

### Search
* `GET  /api/v1/search?q={query}&language={code}` - Unified search across songs, artists, and albums

### Admin Ingestion
* `POST /api/v1/admin/ingest` - Trigger ingestion pipeline for rights-cleared file/feed

---

## 10. Development Roadmap

### 🎯 Phase 1 — MVP (Competition Foundation)
- [x] Database Schema design & migration scripts.
- [ ] Core Backend API with JWT Auth, Songs, Artists, and Albums modules.
- [ ] Basic `StorageRouter` with Local & Google Drive providers.
- [ ] Native Android App with playback engine, track browsing, and search.

### 🚀 Phase 2 — User Engagement
- [ ] Playlists management & re-ordering.
- [ ] Favorites & Recently Played history tracking.
- [ ] Network-aware player quality selector (64k / 96k / 128k).

### ⚡ Phase 3 — Ingestion & Automation Pipeline
- [ ] Redis + BullMQ worker queue setup.
- [ ] FFmpeg automated transcoder & SHA-256 deduplication logic.
- [ ] n8n workflow integration for open-license ingestion.

### 🌐 Phase 4 — Production Storage & Search Scaling
- [ ] AWS S3 / MinIO provider integration into `StorageRouter`.
- [ ] Meilisearch / OpenSearch integration for sub-50ms search.
- [ ] Edge CDN streaming setup.

---

## 11. Getting Started

### Prerequisites
* **Node.js**: `v18.x` or later
* **Docker & Docker Compose**: Installed and running
* **FFmpeg**: Installed locally for worker development (`sudo apt install ffmpeg` / `brew install ffmpeg`)
* **Android Studio**: Ladybug / Jellyfish or newer with Android SDK 34+

### Quick Start (Local Backend Infrastructure)

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-org/sportify-lite.git
   cd sportify-lite
   ```

2. **Start Infrastructure Services (PostgreSQL, Redis, n8n)**:
   ```bash
   docker-compose up -d
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

4. **Configure Environment Variables**:
   Create a `.env` file inside `backend/`:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sportify_db
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_super_secret_jwt_key
   STORAGE_DEFAULT_PROVIDER=local
   LOCAL_STORAGE_PATH=./uploads
   ```

5. **Run Database Migrations & Seeds**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Start Backend Dev Server**:
   ```bash
   npm run dev
   ```

7. **Launch Workers**:
   ```bash
   cd ../workers
   npm install
   npm run start:transcoder
   ```

8. **Build & Run Android Client**:
   Open `android/` directory in Android Studio, sync Gradle, configure the API endpoint pointing to `http://10.0.2.2:3000/api/v1` for Android Emulator, and hit **Run**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
