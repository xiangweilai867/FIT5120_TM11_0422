"""
Cache Service
Handles caching of scan results with TTL management
"""

import hashlib
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.cache import ScanCache

# Configure logging
logger = logging.getLogger(__name__)


def hash_image(image_bytes: bytes) -> str:
    """
    Generate SHA-256 hash of image bytes for deduplication.
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        Hex string of SHA-256 hash
    """
    return hashlib.sha256(image_bytes).hexdigest()


def get_cached_result(db: Session, image_hash: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve cached scan result if it exists and is not expired.
    
    Args:
        db: Database session
        image_hash: SHA-256 hash of the image
        
    Returns:
        Cached response data if found and valid, None otherwise
    """
    try:
        # Query for cache entry
        cache_entry = db.query(ScanCache).filter(
            ScanCache.image_hash == image_hash
        ).first()
        
        if not cache_entry:
            logger.info(f"No cache entry found for hash: {image_hash[:16]}...")
            return None
        
        # Check if expired
        if cache_entry.is_expired():
            logger.info(f"Cache entry expired for hash: {image_hash[:16]}...")
            # Delete expired entry
            db.delete(cache_entry)
            db.commit()
            return None
        
        logger.info(f"Cache hit for hash: {image_hash[:16]}...")
        return cache_entry.response_data
        
    except Exception as e:
        logger.error(f"Error retrieving cached result: {e}")
        return None


def cache_result(
    db: Session,
    image_hash: str,
    response_data: Dict[str, Any],
    ttl_days: int = 1
) -> bool:
    """
    Store scan result in cache with TTL.
    
    Args:
        db: Database session
        image_hash: SHA-256 hash of the image
        response_data: Scan results to cache
        ttl_days: Time-to-live in days (default: 1)
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Check if entry already exists
        existing = db.query(ScanCache).filter(
            ScanCache.image_hash == image_hash
        ).first()
        
        if existing:
            # Update existing entry
            existing.response_data = response_data
            existing.created_at = datetime.utcnow()
            existing.expires_at = datetime.utcnow()
            from datetime import timedelta
            existing.expires_at = existing.created_at + timedelta(days=ttl_days)
            logger.info(f"Updated cache entry for hash: {image_hash[:16]}...")
        else:
            # Create new entry
            cache_entry = ScanCache(
                image_hash=image_hash,
                response_data=response_data,
                ttl_days=ttl_days
            )
            db.add(cache_entry)
            logger.info(f"Created new cache entry for hash: {image_hash[:16]}...")
        
        db.commit()
        return True
        
    except Exception as e:
        logger.error(f"Error caching result: {e}")
        db.rollback()
        return False


def cleanup_expired_cache(db: Session) -> int:
    """
    Remove all expired cache entries from the database.
    Should be run periodically as a background task.
    
    Args:
        db: Database session
        
    Returns:
        Number of entries deleted
    """
    try:
        # Find all expired entries
        expired_entries = db.query(ScanCache).filter(
            ScanCache.expires_at < datetime.utcnow()
        ).all()
        
        count = len(expired_entries)
        
        if count > 0:
            # Delete expired entries
            for entry in expired_entries:
                db.delete(entry)
            
            db.commit()
            logger.info(f"Cleaned up {count} expired cache entries")
        
        return count
        
    except Exception as e:
        logger.error(f"Error cleaning up expired cache: {e}")
        db.rollback()
        return 0
