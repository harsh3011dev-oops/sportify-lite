#!/usr/bin/env python3
"""
Sportify Lite - FFmpeg Audio Transcoder Worker
----------------------------------------------
This module receives incoming audio URLs, downloads the source media,
converts/transcodes it into target MP3 bitrates using FFmpeg, calculates SHA-256 hashes,
and dispatches converted media to configured Datastore Destinations via StorageDestinationRouter.
"""

import os
import sys
import json
import hashlib
import subprocess
import tempfile
import urllib.request
import logging
from typing import Dict, Any, Optional
from storage_destinations import StorageDestinationRouter

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("AudioTranscoder")


class AudioTranscoderWorker:
    def __init__(self, output_temp_dir: Optional[str] = None):
        self.temp_dir = output_temp_dir or tempfile.gettempdir()
        self.storage_router = StorageDestinationRouter()

    def calculate_sha256(self, filepath: str) -> str:
        """Calculates SHA-256 hash of file for deduplication."""
        hasher = hashlib.sha256()
        with open(filepath, "rb") as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()

    def download_source_url(self, audio_url: str, output_path: str) -> bool:
        """Downloads audio file from URL to local temporary path."""
        try:
            logger.info(f"📥 Downloading source audio from URL: {audio_url}")
            req = urllib.request.Request(
                audio_url,
                headers={"User-Agent": "Mozilla/5.0 (Sportify-TranscoderWorker)"}
            )
            with urllib.request.urlopen(req) as resp, open(output_path, "wb") as out_file:
                out_file.write(resp.read())
            logger.info(f"✅ Download complete: {output_path} ({os.path.getsize(output_path)} bytes)")
            return True
        except Exception as e:
            logger.error(f"❌ Error downloading audio from URL '{audio_url}': {e}")
            return False

    def convert_to_mp3(self, input_filepath: str, output_filepath: str, bitrate: str = "96k") -> bool:
        """
        Converts/transcodes any input audio format into optimized MP3 using FFmpeg binary.
        """
        cmd = [
            "ffmpeg",
            "-y",                     # Overwrite output file without asking
            "-i", input_filepath,     # Input file
            "-vn",                    # Disable video stream if any
            "-ar", "44100",           # Sample rate 44.1kHz
            "-ac", "2",               # Stereo audio channels
            "-b:a", bitrate,          # Target Bitrate (e.g. 96k, 128k, 64k)
            "-f", "mp3",              # Target format MP3
            output_filepath
        ]
        
        logger.info(f"⚙️ Running FFmpeg Transcode: {' '.join(cmd)}")
        try:
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
            logger.info(f"✅ Conversion successful! Saved to: {output_filepath}")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ FFmpeg execution failed:\n{e.stderr}")
            return False
        except FileNotFoundError:
            logger.error("❌ FFmpeg binary not found in PATH! Make sure ffmpeg is installed.")
            return False

    def process_and_dispatch(
        self,
        audio_url: str,
        song_id: str,
        language: str = "hi",
        target_bitrate: str = "96k",
        destination_provider: str = "local"
    ) -> Dict[str, Any]:
        """
        Full Pipeline Execution:
        1. Download raw audio from URL
        2. Transcode to MP3 using FFmpeg
        3. Compute SHA-256 hash for deduplication
        4. Dispatch output to datastore destination via StorageRouter
        """
        raw_temp_path = os.path.join(self.temp_dir, f"raw_{song_id}.tmp")
        converted_mp3_path = os.path.join(self.temp_dir, f"converted_{song_id}_{target_bitrate}.mp3")

        try:
            # Step 1: Download
            if not self.download_source_url(audio_url, raw_temp_path):
                return {"status": "error", "message": "Failed to download source audio"}

            # Step 2: Convert to MP3 via FFmpeg
            if not self.convert_to_mp3(raw_temp_path, converted_mp3_path, bitrate=target_bitrate):
                return {"status": "error", "message": "FFmpeg transcoding failed"}

            # Step 3: Deduplication Hash
            content_hash = self.calculate_sha256(converted_mp3_path)
            file_size = os.path.getsize(converted_mp3_path)

            # Step 4: Storage Router Dispatch
            dest_key = f"audio/{language}/{target_bitrate}/{song_id}.mp3"
            dispatch_result = self.storage_router.dispatch(
                source_filepath=converted_mp3_path,
                destination_key=dest_key,
                provider_name=destination_provider
            )

            return {
                "status": "success",
                "song_id": song_id,
                "language": language,
                "bitrate": target_bitrate,
                "content_hash": content_hash,
                "file_size_bytes": file_size,
                "storage_destination": dispatch_result
            }

        finally:
            # Cleanup temp files
            for p in [raw_temp_path, converted_mp3_path]:
                if os.path.exists(p):
                    try:
                        os.remove(p)
                    except Exception:
                        pass


if __name__ == "__main__":
    # Command Line Interface execution test
    if len(sys.argv) < 3:
        print("Usage: python audio_transcoder.py <AUDIO_URL> <SONG_ID> [LANG] [BITRATE] [PROVIDER]")
        sys.exit(1)

    url = sys.argv[1]
    sid = sys.argv[2]
    lang = sys.argv[3] if len(sys.argv) > 3 else "hi"
    bitrate = sys.argv[4] if len(sys.argv) > 4 else "96k"
    provider = sys.argv[5] if len(sys.argv) > 5 else "local"

    worker = AudioTranscoderWorker()
    res = worker.process_and_dispatch(url, sid, lang, bitrate, provider)
    print(json.dumps(res, indent=2))
