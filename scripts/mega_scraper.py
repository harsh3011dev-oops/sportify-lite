#!/usr/bin/env python3
"""
Sportify Lite - MEGA SCRAPER (75 Million Target)
------------------------------------------------------
This scraper pulls 100% Unique Data from:
1. YouTube Music (via ytmusicapi)
2. Jamendo

It implements Strict Deduplication (Artist + Title hash) to ensure 0 duplicates.
"""

import os
import sys
import hashlib
import time
import json
import logging
import argparse
from typing import Dict, Any

from ytmusicapi import YTMusic
import requests

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("mega_scraper.log")
    ]
)
logger = logging.getLogger("MegaScraper")

# Diverse keywords to maximize yield without hitting pagination limits easily
LANG_QUERIES = {
    "hi": ["hindi pop", "bollywood romantic", "hindi lofi", "sufi hits", "classic bollywood", "hindi sad songs", "arjit singh hits", "lata mangeshkar", "kishore kumar"],
    "en": ["english pop", "global hits", "indie rock", "lofi beats", "jazz classics", "synthwave", "chill acoustic", "top 40", "ed sheeran", "taylor swift"],
    "pa": ["punjabi pop", "bhangra hits", "diljit dosanjh", "punjabi folk", "new punjabi", "punjabi hip hop", "karan aujla"],
    "te": ["telugu top hits", "tollywood romantic", "telugu classical", "telugu folk", "dsp hits", "allu arjun hits"],
    "ta": ["tamil hits", "kollywood songs", "ar rahman hits", "tamil folk", "carnatic music", "anirudh ravichander"],
    "mr": ["marathi pop", "marathi lavani", "marathi abhang", "ajay atul hits", "marathi folk", "marathi romantic"],
    "bn": ["bengali pop", "rabindra sangeet", "baul geeti", "arijit singh bengali", "bengali folk", "bengali sad songs"],
    "bho": ["bhojpuri hits", "bhojpuri folk", "pawan singh hits", "khesari lal yadav", "chhat pooja songs", "bhojpuri romantic"],
    "other": ["instrumental relax", "world music", "ambient sleep", "nature sounds", "meditation"]
}

TSV_HEADER = "serial_no\tsong_id\ttitle\tartist\talbum\tlanguage_code\tgenre\tduration_seconds\taudio_url\tcover_url\tcontent_hash\tlicense\tscraped_at\tsource\n"

class MegaScraper:
    def __init__(self, target: int, tsv_path: str):
        self.target = target
        self.tsv_path = os.path.abspath(tsv_path)
        self.seen_hashes = set()
        self.serial_counter = 0
        self.yt = YTMusic()
        
        os.makedirs(os.path.dirname(self.tsv_path), exist_ok=True)
        self._init_tsv()

    def _init_tsv(self):
        if not os.path.exists(self.tsv_path) or os.path.getsize(self.tsv_path) == 0:
            with open(self.tsv_path, "w", encoding="utf-8") as f:
                f.write(TSV_HEADER)
            self.serial_counter = 0
            logger.info(f"📊 Initialized Mega TSV at: {self.tsv_path}")
        else:
            with open(self.tsv_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                self.serial_counter = max(0, len(lines) - 1)
                for line in lines[1:]:
                    parts = line.split("\t")
                    if len(parts) >= 12:
                        self.seen_hashes.add(parts[10]) # hash is at index 10 now
            logger.info(f"📊 Resuming Mega Scraper. Existing tracks: {self.serial_counter}")

    def sanitize(self, text: Any) -> str:
        if not text:
            return "Unknown"
        s = str(text).replace("\t", " ").replace("\n", " ").replace("\r", " ").strip()
        return s if s else "Unknown"

    def compute_sha256(self, artist: str, title: str) -> str:
        # STRICT DEDUPLICATION: Only Artist + Title matters.
        raw = f"{artist.lower().strip()}:{title.lower().strip()}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def write_track(self, track: Dict[str, Any]) -> bool:
        track_hash = self.compute_sha256(track["artist"], track["title"])
        
        if track_hash in self.seen_hashes:
            return False
            
        self.seen_hashes.add(track_hash)
        self.serial_counter += 1
        now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        row = "\t".join([
            str(self.serial_counter),
            self.sanitize(track["id"]),
            self.sanitize(track["title"]),
            self.sanitize(track["artist"]),
            self.sanitize(track["album"]),
            self.sanitize(track["lang"]),
            self.sanitize(track["genre"]),
            str(track.get("duration", 180)),
            self.sanitize(track["audio_url"]),
            self.sanitize(track["cover_url"]),
            track_hash,
            self.sanitize(track.get("license", "Standard")),
            now_iso,
            self.sanitize(track["source"])
        ]) + "\n"

        with open(self.tsv_path, "a", encoding="utf-8") as f:
            f.write(row)
        return True

    def scrape_youtube(self, lang: str, query: str):
        logger.info(f"[YouTube] Searching for: {query}")
        try:
            # We request up to 500 songs per specific query
            results = self.yt.search(query, filter="songs", limit=500)
            added = 0
            for item in results:
                if self.serial_counter >= self.target:
                    break
                    
                videoId = item.get("videoId")
                title = item.get("title")
                
                artists_list = item.get("artists", [])
                artist = artists_list[0]["name"] if artists_list else "Unknown Artist"
                
                album_dict = item.get("album")
                album = album_dict["name"] if album_dict else "Single"
                
                duration_sec = item.get("duration_seconds", 180)
                
                thumbnails = item.get("thumbnails", [])
                cover_url = thumbnails[-1]["url"] if thumbnails else ""
                
                if not videoId or not title:
                    continue
                    
                track_obj = {
                    "id": f"yt_{videoId}",
                    "title": title,
                    "artist": artist,
                    "album": album,
                    "lang": lang,
                    "genre": "YouTube Search",
                    "duration": duration_sec,
                    "audio_url": f"https://music.youtube.com/watch?v={videoId}",
                    "cover_url": cover_url,
                    "license": "YouTube Standard",
                    "source": "YouTube Music"
                }
                
                if self.write_track(track_obj):
                    added += 1
            
            logger.info(f"[YouTube] Added {added} unique tracks for query '{query}'")
            # Anti-Ban delay
            time.sleep(0.2)
        except Exception as e:
            logger.error(f"[YouTube] Error for '{query}': {e}")
            time.sleep(2)

    def scrape_jamendo(self, lang: str, query: str):
        logger.info(f"[Jamendo] Searching for: {query}")
        url = "https://api.jamendo.com/v3.0/tracks/"
        offset = 0
        limit = 200
        added = 0
        
        while offset < 1000:
            if self.serial_counter >= self.target:
                break
                
            params = {
                "client_id": "56b40978",
                "format": "json",
                "limit": limit,
                "offset": offset,
                "tags": query,
                "audioformat": "mp32"
            }
            try:
                resp = requests.get(url, params=params, timeout=15)
                if resp.status_code != 200:
                    break
                data = resp.json()
                results = data.get("results", [])
                if not results:
                    break
                    
                for item in results:
                    track_obj = {
                        "id": f"jamendo_{item.get('id')}",
                        "title": item.get("name", "Unknown"),
                        "artist": item.get("artist_name", "Unknown"),
                        "album": item.get("album_name", "Single"),
                        "lang": lang,
                        "genre": "Indie Jamendo",
                        "duration": item.get("duration", 180),
                        "audio_url": item.get("audio", ""),
                        "cover_url": item.get("image", ""),
                        "license": "Creative Commons",
                        "source": "Jamendo"
                    }
                    if self.write_track(track_obj):
                        added += 1
                
                offset += limit
                time.sleep(1)
            except Exception as e:
                logger.error(f"[Jamendo] Error: {e}")
                break
        logger.info(f"[Jamendo] Added {added} unique tracks for query '{query}'")

    def run(self):
        logger.info(f"🚀 MEGA SCRAPER RUNNING... Target: {self.target} Unique Tracks")
        
        while self.serial_counter < self.target:
            for lang, queries in LANG_QUERIES.items():
                for query in queries:
                    if self.serial_counter >= self.target:
                        break
                    
                    self.scrape_youtube(lang, query)
                    self.scrape_jamendo(lang, query)
            
            logger.info("Cycle complete. Going to sleep for 2 seconds before expanding search...")
            time.sleep(2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--total", type=int, default=75000000)
    parser.add_argument("--tsv", type=str, default="./data/mega_inventory.tsv")
    args = parser.parse_args()
    
    scraper = MegaScraper(target=args.total, tsv_path=args.tsv)
    scraper.run()
