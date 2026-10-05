#!/usr/bin/env python3
"""
Sportify Lite - Legally-Cleared Multilingual Music Catalog Ingester / Scraper Script
--------------------------------------------------------------------------------------
This script fetches and ingests rights-cleared, public-domain, or Creative Commons audio tracks
and metadata, respecting exact language percentage targets, and appends real-time records
to data/catalog_inventory.tsv.

Language Target Distribution:
- Hindi (25%)
- English (20%)
- Punjabi (10%)
- Telugu (8%)
- Tamil (8%)
- Bengali (6%)
- Marathi (5%)
- Kannada (5%)
- Malayalam (4%)
- Gujarati (3%)
- Bhojpuri (3%)
- Other Indian / International (3%)

Usage:
  python catalog_ingester.py --total 10000 --output ./ingested_catalog --tsv ./data/catalog_inventory.tsv
"""

import os
import sys
import json
import hashlib
import argparse
import logging
import asyncio
import datetime
import aiohttp
from typing import Dict, List, Any
from dataclasses import dataclass, asdict

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("CatalogIngester")

# 1. Target Language Distribution Matrix (%)
LANGUAGE_DISTRIBUTION: Dict[str, Dict[str, Any]] = {
    "hi": {"name": "Hindi", "percentage": 25.0, "search_terms": ["hindi", "bollywood", "indian classical", "ghazal"]},
    "en": {"name": "English", "percentage": 20.0, "search_terms": ["pop", "rock", "indie", "lofi", "electronic"]},
    "pa": {"name": "Punjabi", "percentage": 10.0, "search_terms": ["punjabi", "bhangra", "folk punjabi"]},
    "te": {"name": "Telugu", "percentage": 8.0, "search_terms": ["telugu", "tollywood", "telugu classical"]},
    "ta": {"name": "Tamil", "percentage": 8.0, "search_terms": ["tamil", "kollywood", "carnatic"]},
    "bn": {"name": "Bengali", "percentage": 6.0, "search_terms": ["bengali", "rabindra sangeet", "baul"]},
    "mr": {"name": "Marathi", "percentage": 5.0, "search_terms": ["marathi", "lavani", "marathi folk"]},
    "kn": {"name": "Kannada", "percentage": 5.0, "search_terms": ["kannada", "sandalwood"]},
    "ml": {"name": "Malayalam", "percentage": 4.0, "search_terms": ["malayalam", "mollywood"]},
    "gu": {"name": "Gujarati", "percentage": 3.0, "search_terms": ["gujarati", "garba", "dandiya"]},
    "bho": {"name": "Bhojpuri", "percentage": 3.0, "search_terms": ["bhojpuri", "bhojpuri folk"]},
    "other": {"name": "Other", "percentage": 3.0, "search_terms": ["instrumental", "world", "ambient"]}
}

TSV_HEADER = "serial_no\tsong_id\ttitle\tartist\talbum\tlanguage_code\tlanguage_name\tgenre\tduration_seconds\tsource_url\tcover_url\tcontent_hash\taudio_quality\tlicense\tingested_at\tstatus\n"


@dataclass
class SongMetadata:
    id: str
    title: str
    artist: str
    album: str
    language_code: str
    language_name: str
    genre: str
    duration: int
    release_year: int
    audio_url: str
    cover_url: str
    license: str
    content_hash: str = ""


class CatalogIngester:
    def __init__(self, target_total: int, output_dir: str, tsv_path: str, jamendo_client_id: str = None):
        self.target_total = target_total
        self.output_dir = output_dir
        self.tsv_path = os.path.abspath(tsv_path)
        self.jamendo_client_id = jamendo_client_id or os.getenv("JAMENDO_CLIENT_ID", "56b40978")
        self.session: aiohttp.ClientSession = None
        self.tsv_lock = asyncio.Lock()
        self.serial_counter = 0
        
        self.language_counts: Dict[str, int] = {lang: 0 for lang in LANGUAGE_DISTRIBUTION}
        self.language_targets: Dict[str, int] = {
            lang: int((info["percentage"] / 100.0) * target_total)
            for lang, info in LANGUAGE_DISTRIBUTION.items()
        }
        
        # Ensure directories exist
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(os.path.join(output_dir, "audio"), exist_ok=True)
        os.makedirs(os.path.join(output_dir, "covers"), exist_ok=True)
        os.makedirs(os.path.dirname(self.tsv_path), exist_ok=True)

        # Initialize TSV file with header if missing
        self._init_tsv_file()

    def _init_tsv_file(self):
        """Creates TSV file with headers if it does not exist, or counts existing rows."""
        if not os.path.exists(self.tsv_path) or os.path.getsize(self.tsv_path) == 0:
            with open(self.tsv_path, "w", encoding="utf-8") as f:
                f.write(TSV_HEADER)
            self.serial_counter = 0
            logger.info(f"📊 Initialized TSV Inventory file at: {self.tsv_path}")
        else:
            with open(self.tsv_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                self.serial_counter = max(0, len(lines) - 1)
            logger.info(f"📊 Found existing TSV Inventory with {self.serial_counter} recorded tracks.")

    def sanitize_text(self, text: Any) -> str:
        """Sanitizes text fields to avoid breaking TSV formatting (replaces tabs & newlines)."""
        if text is None:
            return ""
        return str(text).replace("\t", " ").replace("\n", " ").replace("\r", " ").strip()

    async def log_to_tsv(self, meta: SongMetadata, source_url: str, audio_quality: str = "96k", status: str = "INGESTED"):
        """Asynchronously appends a track record to catalog_inventory.tsv cleanly."""
        async with self.tsv_lock:
            self.serial_counter += 1
            now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
            
            row = "\t".join([
                str(self.serial_counter),
                self.sanitize_text(meta.id),
                self.sanitize_text(meta.title),
                self.sanitize_text(meta.artist),
                self.sanitize_text(meta.album),
                self.sanitize_text(meta.language_code),
                self.sanitize_text(meta.language_name),
                self.sanitize_text(meta.genre),
                str(meta.duration),
                self.sanitize_text(source_url),
                self.sanitize_text(meta.cover_url),
                self.sanitize_text(meta.content_hash),
                self.sanitize_text(audio_quality),
                self.sanitize_text(meta.license),
                now_iso,
                status
            ]) + "\n"
            
            with open(self.tsv_path, "a", encoding="utf-8") as f:
                f.write(row)

    def calculate_sha256(self, file_bytes: bytes) -> str:
        """Calculates SHA-256 hash for deduplication."""
        return hashlib.sha256(file_bytes).hexdigest()

    async def fetch_jamendo_tracks(self, lang_code: str, search_term: str, count: int) -> List[Dict[str, Any]]:
        url = "https://api.jamendo.com/v3.0/tracks/"
        params = {
            "client_id": self.jamendo_client_id,
            "format": "json",
            "limit": min(count, 200),
            "fuzzytags": search_term,
            "audioformat": "mp32",
            "include": "licenses"
        }
        
        try:
            async with self.session.get(url, params=params, timeout=15) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data.get("results", [])
                else:
                    logger.warning(f"Jamendo API returned status {resp.status} for term '{search_term}'")
                    return []
        except Exception as e:
            logger.error(f"Error fetching from Jamendo for '{search_term}': {e}")
            return []

    async def download_media(self, url: str, destination_path: str) -> bytes:
        try:
            async with self.session.get(url, timeout=30) as resp:
                if resp.status == 200:
                    data = await resp.read()
                    with open(destination_path, "wb") as f:
                        f.write(data)
                    return data
        except Exception as e:
            logger.error(f"Failed to download media from {url}: {e}")
        return None

    async def process_language_catalog(self, lang_code: str, lang_info: Dict[str, Any]):
        target_count = self.language_targets[lang_code]
        logger.info(f"🚀 Starting Ingestion for [{lang_info['name']}] | Target: {target_count} songs ({lang_info['percentage']}%)")
        
        collected = 0
        search_terms = lang_info["search_terms"]
        
        for term in search_terms:
            if collected >= target_count:
                break
                
            needed = target_count - collected
            tracks = await self.fetch_jamendo_tracks(lang_code, term, needed)
            
            for track in tracks:
                if collected >= target_count:
                    break
                
                track_id = str(track.get("id"))
                audio_remote_url = track.get("audio")
                image_remote_url = track.get("image")
                
                if not audio_remote_url:
                    continue
                
                audio_filename = f"{lang_code}_{track_id}.mp3"
                cover_filename = f"{lang_code}_{track_id}.jpg"
                
                audio_path = os.path.join(self.output_dir, "audio", audio_filename)
                cover_path = os.path.join(self.output_dir, "covers", cover_filename)
                
                # Download audio & compute SHA-256 for deduplication
                audio_bytes = await self.download_media(audio_remote_url, audio_path)
                if not audio_bytes:
                    continue
                
                content_hash = self.calculate_sha256(audio_bytes)
                
                # Download cover thumbnail
                if image_remote_url:
                    await self.download_media(image_remote_url, cover_path)
                
                # Construct Metadata Object
                meta = SongMetadata(
                    id=track_id,
                    title=track.get("name", "Unknown Title"),
                    artist=track.get("artist_name", "Unknown Artist"),
                    album=track.get("album_name", "Single"),
                    language_code=lang_code,
                    language_name=lang_info["name"],
                    genre=term.capitalize(),
                    duration=track.get("duration", 180),
                    release_year=2024,
                    audio_url=f"audio/{audio_filename}",
                    cover_url=f"covers/{cover_filename}",
                    license=track.get("license_ccurl", "Creative Commons"),
                    content_hash=content_hash
                )
                
                # Save Individual JSON Manifest
                meta_json_path = os.path.join(self.output_dir, f"{lang_code}_{track_id}.json")
                with open(meta_json_path, "w", encoding="utf-8") as f:
                    json.dump(asdict(meta), f, ensure_ascii=False, indent=2)
                
                # Appends record to catalog_inventory.tsv real-time
                await self.log_to_tsv(meta, source_url=audio_remote_url, audio_quality="96k", status="INGESTED")
                
                collected += 1
                self.language_counts[lang_code] = collected
                
                if collected % 10 == 0 or collected == target_count:
                    logger.info(f"[{lang_info['name']}] Progress: {collected}/{target_count} ({int(collected/target_count*100)}%) -> Logged to TSV")

    async def run(self):
        connector = aiohttp.TCPConnector(limit=10)
        async with aiohttp.ClientSession(connector=connector) as session:
            self.session = session
            logger.info("=" * 60)
            logger.info(f"🎯 Starting Multilingual Catalog Ingestion | Target: {self.target_total} Songs")
            logger.info(f"📄 Output Inventory TSV Path: {self.tsv_path}")
            logger.info("=" * 60)
            
            tasks = [
                self.process_language_catalog(lang_code, info)
                for lang_code, info in LANGUAGE_DISTRIBUTION.items()
            ]
            
            await asyncio.gather(*tasks)
            
            # Write master summary index
            manifest_path = os.path.join(self.output_dir, "catalog_manifest.json")
            summary = {
                "total_requested": self.target_total,
                "total_ingested": sum(self.language_counts.values()),
                "tsv_inventory": self.tsv_path,
                "language_breakdown": self.language_counts
            }
            with open(manifest_path, "w", encoding="utf-8") as f:
                json.dump(summary, f, indent=2)
                
            logger.info("=" * 60)
            logger.info("✅ Catalog Ingestion Complete!")
            logger.info(f"📊 Summary Manifest saved to: {manifest_path}")
            logger.info(f"📑 TSV Inventory updated at: {self.tsv_path}")
            logger.info("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Sportify Lite Catalog Ingester with Real-time TSV Logging")
    parser.add_argument("--total", type=int, default=100, help="Total songs target (default: 100)")
    parser.add_argument("--output", type=str, default="./ingested_catalog", help="Output directory path")
    parser.add_argument("--tsv", type=str, default="./data/catalog_inventory.tsv", help="Path to catalog inventory TSV file")
    parser.add_argument("--api-key", type=str, default="56b40978", help="Jamendo API Client ID")
    
    args = parser.parse_args()
    
    ingester = CatalogIngester(
        target_total=args.total,
        output_dir=args.output,
        tsv_path=args.tsv,
        jamendo_client_id=args.api_key
    )
    
    asyncio.run(ingester.run())


if __name__ == "__main__":
    main()
