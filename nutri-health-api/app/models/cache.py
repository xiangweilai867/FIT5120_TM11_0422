"""
Cache Model
Stores scan results with TTL for performance optimization
"""

import uuid
from datetime import datetime, timedelta
from sqlalchemy import Column, String, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base


class ScanCache(Base):
    """
    Cache table for storing food scan results.
    Uses image hash as unique identifier with 1-day TTL.
    """
    
    __tablename__ = "scan_cache"
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Image hash for deduplication
    image_hash = Column(String(64), unique=True, nullable=False, index=True)
    
    # Cached response data (stored as JSON)
    response_data = Column(JSONB, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    
    # Index for efficient cleanup of expired entries
    __table_args__ = (
        Index('idx_expires_at', 'expires_at'),
    )
    
    def __init__(self, image_hash: str, response_data: dict, ttl_days: int = 1):
        """
        Initialize a new cache entry.
        
        Args:
            image_hash: SHA-256 hash of the image
            response_data: Scan results to cache
            ttl_days: Time-to-live in days (default: 1)
        """
        self.image_hash = image_hash
        self.response_data = response_data
        self.created_at = datetime.utcnow()
        self.expires_at = self.created_at + timedelta(days=ttl_days)
    
    def is_expired(self) -> bool:
        """Check if this cache entry has expired."""
        return datetime.utcnow() > self.expires_at
    
    def __repr__(self):
        return f"<ScanCache(hash={self.image_hash[:8]}..., expires={self.expires_at})>"
