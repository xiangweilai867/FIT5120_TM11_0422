"""
Authentication router
Handles user authentication and token generation
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import Token
from app.auth import authenticate_user, create_access_token
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["authentication"])


@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token endpoint.
    
    Authenticates user with username and password (as form data),
    and returns a JWT bearer token.
    
    For this demo application, only accepts hardcoded credentials:
    - Username: demo
    - Password: demo123
    
    Args:
        form_data: OAuth2 password request form containing username and password
        
    Returns:
        Token object with access_token and token_type
        
    Raises:
        HTTPException: 401 Unauthorized if credentials are invalid
    """
    logger.info(f"Login attempt for user: {form_data.username}")
    
    # Validate credentials against hardcoded values
    if not authenticate_user(form_data.username, form_data.password):
        logger.warning(f"Failed login attempt for user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token with username as subject
    access_token = create_access_token(data={"sub": form_data.username})
    
    logger.info(f"User '{form_data.username}' logged in successfully")
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
