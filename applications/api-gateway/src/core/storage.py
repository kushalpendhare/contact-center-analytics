# src/core/storage.py

import os
import uuid
from pathlib import Path

from src.core.config import settings


class StorageService:
    """Local file storage service. Will be replaced with S3 in AWS."""

    def __init__(self):
        self.base_dir = settings.UPLOAD_DIR
        Path(self.base_dir).mkdir(parents=True, exist_ok=True)

    def get_upload_path(self, tenant_id: int, project_id: int, filename: str) -> str:
        """Generate a path for storing uploaded files."""
        tenant_dir = Path(self.base_dir) / str(tenant_id) / str(project_id)
        tenant_dir.mkdir(parents=True, exist_ok=True)
        
        # Use unique filename to avoid collisions
        file_id = str(uuid.uuid4())
        ext = Path(filename).suffix
        unique_filename = f"{file_id}{ext}"
        
        return str(tenant_dir / unique_filename)

    def save_file(self, tenant_id: int, project_id: int, filename: str, file_data: bytes) -> str:
        """Save file to local storage and return the file path."""
        file_path = self.get_upload_path(tenant_id, project_id, filename)
        
        with open(file_path, 'wb') as f:
            f.write(file_data)
        
        return file_path

    def get_file(self, file_path: str) -> bytes:
        """Retrieve file from local storage."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        with open(file_path, 'rb') as f:
            return f.read()

    def delete_file(self, file_path: str) -> None:
        """Delete file from local storage."""
        if os.path.exists(file_path):
            os.remove(file_path)

    def get_presigned_url(self, file_path: str, expiration: int = 3600) -> str:
        """Mock presigned URL. In AWS, this will return an actual S3 presigned URL."""
        # For local testing, return a reference URL that can be used to download the file
        return f"/files{file_path}?expiration={expiration}"

    def file_exists(self, file_path: str) -> bool:
        """Check if file exists."""
        return os.path.exists(file_path)

    def get_file_size(self, file_path: str) -> int:
        """Get file size in bytes."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        return os.path.getsize(file_path)


# Global instance
storage_service = StorageService()
