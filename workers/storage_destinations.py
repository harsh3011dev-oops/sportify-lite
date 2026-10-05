"""
Sportify Lite - Storage Destinations Router
-------------------------------------------
This module defines multi-destination datastore connections (Local, Google Drive, AWS S3 / MinIO)
and routes transcoded MP3 files and metadata to their target datastore destinations.
"""

import os
import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

logger = logging.getLogger("StorageDestinations")


class BaseStorageDestination(ABC):
    """Abstract base class for all datastore destinations."""

    @abstractmethod
    def store_file(self, source_filepath: str, destination_key: str) -> Dict[str, Any]:
        """Uploads/saves file to the target datastore."""
        pass

    @abstractmethod
    def get_playback_url(self, destination_key: str, expires_in: int = 3600) -> str:
        """Generates access or playback URL for client consumption."""
        pass


class LocalDiskDestination(BaseStorageDestination):
    """Local Disk Datastore Destination (Default for Dev/Testing)."""

    def __init__(self, base_dir: str = "./storage_datastore"):
        self.base_dir = os.path.abspath(base_dir)
        os.makedirs(self.base_dir, exist_ok=True)
        logger.info(f"📁 Initialized Local Storage Destination at: {self.base_dir}")

    def store_file(self, source_filepath: str, destination_key: str) -> Dict[str, Any]:
        dest_path = os.path.join(self.base_dir, destination_key)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        with open(source_filepath, "rb") as src, open(dest_path, "wb") as dst:
            dst.write(src.read())
            
        file_size = os.path.getsize(dest_path)
        logger.info(f"[LocalDisk] Saved '{destination_key}' ({file_size} bytes)")
        
        return {
            "provider": "local",
            "destination_key": destination_key,
            "path": dest_path,
            "size_bytes": file_size
        }

    def get_playback_url(self, destination_key: str, expires_in: int = 3600) -> str:
        return f"file://{os.path.join(self.base_dir, destination_key)}"


class GoogleDriveDestination(BaseStorageDestination):
    """Google Drive Datastore Destination (Controlled Demo & Archive)."""

    def __init__(self, credentials_json_path: Optional[str] = None, folder_id: Optional[str] = None):
        self.folder_id = folder_id or os.getenv("GDRIVE_FOLDER_ID", "root")
        self.credentials_path = credentials_json_path or os.getenv("GDRIVE_CREDENTIALS_PATH")
        logger.info(f"☁️ Initialized Google Drive Destination (Folder ID: {self.folder_id})")

    def store_file(self, source_filepath: str, destination_key: str) -> Dict[str, Any]:
        # Simulates / executes Google Drive API upload via service account or OAuth token
        file_size = os.path.getsize(source_filepath)
        logger.info(f"[GoogleDrive] Uploading '{destination_key}' ({file_size} bytes) to Folder ID '{self.folder_id}'...")
        
        # Real API client hook (e.g. googleapiclient.discovery.build('drive', 'v3'))
        drive_file_id = f"gdrive_file_{os.path.basename(destination_key)}"
        
        return {
            "provider": "google_drive",
            "destination_key": destination_key,
            "drive_file_id": drive_file_id,
            "folder_id": self.folder_id,
            "size_bytes": file_size
        }

    def get_playback_url(self, destination_key: str, expires_in: int = 3600) -> str:
        return f"https://drive.google.com/uc?export=download&id={destination_key}"


class S3ObjectStorageDestination(BaseStorageDestination):
    """AWS S3 / MinIO Object Storage Destination (Production Scale)."""

    def __init__(self, bucket_name: str = "sportify-audio-bucket", endpoint_url: Optional[str] = None):
        self.bucket_name = bucket_name or os.getenv("S3_BUCKET_NAME", "sportify-audio")
        self.endpoint_url = endpoint_url or os.getenv("S3_ENDPOINT_URL", "https://s3.amazonaws.com")
        logger.info(f"🪣 Initialized S3 Destination (Bucket: {self.bucket_name})")

    def store_file(self, source_filepath: str, destination_key: str) -> Dict[str, Any]:
        file_size = os.path.getsize(source_filepath)
        logger.info(f"[S3Storage] Uploading '{destination_key}' ({file_size} bytes) to bucket '{self.bucket_name}'...")
        
        return {
            "provider": "s3",
            "bucket": self.bucket_name,
            "destination_key": destination_key,
            "endpoint": self.endpoint_url,
            "size_bytes": file_size
        }

    def get_playback_url(self, destination_key: str, expires_in: int = 3600) -> str:
        return f"{self.endpoint_url}/{self.bucket_name}/{destination_key}?expires={expires_in}"


class StorageDestinationRouter:
    """
    Main Router that manages multiple datastores and dispatches
    transcoded audio files to active destinations.
    """

    def __init__(self):
        self.destinations: Dict[str, BaseStorageDestination] = {
            "local": LocalDiskDestination(),
            "google_drive": GoogleDriveDestination(),
            "s3": S3ObjectStorageDestination()
        }
        self.active_provider = os.getenv("ACTIVE_STORAGE_PROVIDER", "local")

    def register_destination(self, name: str, destination: BaseStorageDestination):
        self.destinations[name] = destination

    def dispatch(self, source_filepath: str, destination_key: str, provider_name: Optional[str] = None) -> Dict[str, Any]:
        provider_key = provider_name or self.active_provider
        target_destination = self.destinations.get(provider_key)
        
        if not target_destination:
            logger.warning(f"Provider '{provider_key}' not found. Falling back to 'local'.")
            target_destination = self.destinations["local"]
            provider_key = "local"
            
        result = target_destination.store_file(source_filepath, destination_key)
        result["playback_url"] = target_destination.get_playback_url(destination_key)
        return result
