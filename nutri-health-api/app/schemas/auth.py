"""
Pydantic schemas for authentication
Defines request/response models for authentication endpoints
"""

from pydantic import BaseModel


class Token(BaseModel):
    """
    OAuth2 token response schema.
    
    Returned by the /token endpoint after successful authentication.
    """
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """
    Token payload data schema.
    
    Represents the decoded JWT token claims.
    """
    username: str
