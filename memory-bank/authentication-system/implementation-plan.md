# Authentication System Implementation Plan

## Overview
Implement OAuth2 Password + Bearer flow with hardcoded credentials for demo purposes. JWT tokens with 24-hour expiration, automatic authentication on app launch, and protection for business logic endpoints.

## Configuration Details

**Credentials:**
- Username: `demo`
- Password: `demo123`

**Token Settings:**
- TTL: 24 hours
- Algorithm: HS256 (HMAC-SHA256)
- Token Type: Bearer

**Protected Endpoints:**
- All business logic endpoints (currently `/scan`, future endpoints as well)
- Public endpoints: `/`, `/health`, `/docs`, `/redoc`, `/admin/cleanup-cache`

**Authentication Behavior:**
- No login screens
- Automatic authentication on app launch
- Token cached and reused until expiration

---

## Backend Implementation (FastAPI)

### 1. Dependencies & Configuration

#### Update requirements.txt
Add the following dependencies:
```txt
python-jose[cryptography]==3.3.0  # JWT token creation/validation
passlib[bcrypt]==1.7.4            # Password hashing
# python-multipart already present
```

#### Environment Variables
Add to `.env.example` and configure in Render.com:
```bash
# JWT Authentication
SECRET_KEY=<generate_with_openssl_rand_-hex_32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24

# Hardcoded Credentials (for reference only, not stored in env)
# USERNAME: demo
# PASSWORD: demo123
```

Generate SECRET_KEY:
```bash
openssl rand -hex 32
```

### 2. Authentication Module Structure

#### File: `app/auth.py`
Core authentication utilities:

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "development-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "24"))

# Hardcoded credentials
DEMO_USERNAME = "demo"
DEMO_PASSWORD_HASH = "<bcrypt_hash_of_demo123>"  # Will be generated on first run

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def authenticate_user(username: str, password: str) -> bool:
    """Authenticate user against hardcoded credentials"""
    if username != DEMO_USERNAME:
        return False
    # In real implementation, compare against hashed password
    # For demo, we'll hash the demo password on startup and compare
    demo_hash = get_password_hash(DEMO_PASSWORD)
    return verify_password(password, demo_hash)

def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return {"username": username}
    except JWTError:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Dependency to validate bearer token and get current user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = decode_access_token(token)
    if token_data is None:
        raise credentials_exception
    
    return token_data
```

#### File: `app/schemas/auth.py`
Pydantic models for authentication:

```python
from pydantic import BaseModel

class Token(BaseModel):
    """OAuth2 token response"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Token payload data"""
    username: str
```

#### File: `app/routers/auth.py`
Authentication endpoint:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import Token
from app.auth import authenticate_user, create_access_token

router = APIRouter(tags=["authentication"])

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token endpoint.
    
    Authenticates user and returns JWT bearer token.
    For this demo, only accepts hardcoded username/password.
    """
    # Validate credentials
    if not authenticate_user(form_data.username, form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": form_data.username})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
```

### 3. Protect Business Logic Endpoints

#### Update `app/routers/scan.py`
Add authentication requirement:

```python
from app.auth import get_current_user

# Update the scan endpoint signature
@router.post("/scan", response_model=ScanResponse)
async def scan_food_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),  # ADD THIS LINE
    db: Session = Depends(get_db)
):
    """
    Scan a food image and return nutritional analysis.
    Requires authentication.
    """
    # Rest of the implementation remains the same
    ...
```

### 4. Register Authentication Router

#### Update `app/main.py`
Register the auth router:

```python
from app.routers import scan, auth  # Add auth import

# Register routers
app.include_router(auth.router)  # Add this line
app.include_router(scan.router)
```

---

## Frontend Implementation (React Native)

### 1. Install Dependencies

```bash
cd nutri-health-app
npm install @react-native-async-storage/async-storage
```

### 2. Authentication Service

#### File: `nutri-health-app/services/auth.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const BACKEND_URL = __DEV__ 
  ? 'http://localhost:8000'
  : 'https://your-app.onrender.com';

// Hardcoded credentials (for demo only)
const DEMO_USERNAME = 'demo';
const DEMO_PASSWORD = 'demo123';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

/**
 * Request a new token from the backend
 */
async function requestNewToken(): Promise<string> {
  const formData = new URLSearchParams();
  formData.append('username', DEMO_USERNAME);
  formData.append('password', DEMO_PASSWORD);

  const response = await fetch(`${BACKEND_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  const data: TokenResponse = await response.json();
  
  // Calculate expiry time (24 hours from now)
  const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
  
  // Cache token and expiry
  await AsyncStorage.setItem(TOKEN_KEY, data.access_token);
  await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  
  return data.access_token;
}

/**
 * Check if cached token is expired
 */
async function isTokenExpired(): Promise<boolean> {
  const expiryStr = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryStr) return true;
  
  const expiry = parseInt(expiryStr, 10);
  return Date.now() >= expiry;
}

/**
 * Get valid authentication token
 * Returns cached token if valid, otherwise requests new one
 */
export async function getToken(): Promise<string> {
  // Check if we have a cached token
  const cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
  
  // If token exists and not expired, return it
  if (cachedToken && !(await isTokenExpired())) {
    return cachedToken;
  }
  
  // Otherwise, request new token
  return await requestNewToken();
}

/**
 * Clear cached token (for logout or error scenarios)
 */
export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * Initialize authentication on app startup
 * Automatically authenticates and caches token
 */
export async function initializeAuth(): Promise<void> {
  try {
    await getToken();
  } catch (error) {
    console.error('Failed to initialize authentication:', error);
    throw error;
  }
}
```

### 3. Update API Service

#### Update `nutri-health-app/services/api.ts`

```typescript
import { getToken, clearToken } from './auth';

// Update scanFood function
export async function scanFood(imageUri: string): Promise<ScanResponse> {
  try {
    // Get valid token
    const token = await getToken();
    
    // Create form data (existing code)
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(`${BACKEND_URL}/scan`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,  // ADD THIS LINE
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 - token expired or invalid
      if (response.status === 401) {
        // Clear cached token and retry once
        await clearToken();
        const newToken = await getToken();
        
        const retryResponse = await fetch(`${BACKEND_URL}/scan`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${newToken}`,
          },
        });
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new ApiError(
            errorData.detail || 'Authentication failed',
            retryResponse.status,
            errorData
          );
        }
        
        return await retryResponse.json();
      }

      // Handle other non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.detail || 'Failed to scan food',
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error: any) {
    // Handle errors (existing code)
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again!', 408);
    }
    if (error.message === 'Network request failed') {
      throw new ApiError('Network error. Please check your internet connection!', 0);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Something went wrong. Please try again!', 500, error);
  }
}
```

### 4. Initialize Authentication on App Launch

#### Update `nutri-health-app/app/_layout.tsx`

```typescript
import { initializeAuth } from '../services/auth';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  useEffect(() => {
    // Initialize authentication on app launch
    initializeAuth()
      .then(() => setIsAuthReady(true))
      .catch((error) => {
        console.error('Auth initialization failed:', error);
        // Still set ready to true to show app, errors will be handled per-request
        setIsAuthReady(true);
      });
  }, []);
  
  if (!isAuthReady) {
    // Show loading screen while authenticating
    return <SplashScreen />;  // Or your loading component
  }
  
  // Rest of your layout code
  return (
    // ... existing layout
  );
}
```

---

## Implementation Sequence

### Phase 1: Backend Foundation (30 min)
1. Update `requirements.txt` with auth dependencies
2. Generate SECRET_KEY: `openssl rand -hex 32`
3. Add SECRET_KEY to `.env` file
4. Create `app/auth.py` with JWT utilities
5. Create `app/schemas/auth.py` with token schemas
6. Test token generation/validation locally

### Phase 2: Backend Endpoints (20 min)
7. Create `app/routers/auth.py` with `/token` endpoint
8. Register auth router in `app/main.py`
9. Update `app/routers/scan.py` to require authentication
10. Install dependencies: `pip install python-jose[cryptography] passlib[bcrypt]`
11. Test with curl:
   ```bash
   # Get token
   curl -X POST "http://localhost:8000/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=demo&password=demo123"
   
   # Use token
   curl -X POST "http://localhost:8000/scan" \
     -H "Authorization: Bearer <token>" \
     -F "file=@test.jpg"
   ```

### Phase 3: Frontend Foundation (25 min)
12. Install AsyncStorage: `npm install @react-native-async-storage/async-storage`
13. Create `services/auth.ts` with token management
14. Implement automatic token acquisition
15. Test token caching and retrieval

### Phase 4: Frontend Integration (25 min)
16. Update `services/api.ts` to include bearer tokens
17. Implement 401 error handling with retry logic
18. Update app layout to initialize auth on launch
19. Test end-to-end authentication flow

### Phase 5: Testing & Documentation (20 min)
20. Test automatic re-authentication on token expiry
21. Test app behavior with backend down
22. Test token persistence across app restarts
23. Update README with authentication setup
24. Document deployment steps for Render.com

---

## Testing Checklist

### Backend Tests
- [ ] `/token` returns token for correct credentials (username: demo, password: demo123)
- [ ] `/token` returns 401 for wrong credentials
- [ ] `/token` validates form data format (OAuth2 spec)
- [ ] `/scan` requires valid bearer token
- [ ] `/scan` returns 401 without token
- [ ] `/scan` returns 401 with expired token
- [ ] `/scan` returns 401 with malformed token
- [ ] `/health` remains public (no auth required)
- [ ] Token expires after 24 hours
- [ ] Token signature is properly validated

### Frontend Tests
- [ ] App automatically authenticates on first launch
- [ ] Token is cached in AsyncStorage
- [ ] Token is included in all `/scan` requests
- [ ] 401 errors trigger token refresh and retry
- [ ] App works after cold restart (uses cached token)
- [ ] App works after 24+ hours (gets new token)
- [ ] Network errors handled gracefully
- [ ] Multiple concurrent requests use same token
- [ ] Token refresh only happens once on expiry

### Integration Tests
- [ ] End-to-end flow: Launch app → Scan image → Get results
- [ ] Token expiry during scan handled gracefully
- [ ] Backend restart doesn't break authentication
- [ ] Invalid credentials return proper error
- [ ] CORS headers allow Authorization header

---

## Security Considerations

1. **Secret Key Management**
   - Generate cryptographically secure SECRET_KEY (128+ bits)
   - Never commit SECRET_KEY to version control
   - Use different keys for dev/staging/production
   - Rotate keys periodically

2. **Transport Security**
   - Always use HTTPS in production
   - Tokens transmitted in Authorization header (not URL)
   - No sensitive data in logs

3. **Token Storage**
   - AsyncStorage acceptable for demo
   - Consider SecureStore for production apps
   - Clear token on logout/uninstall

4. **Password Security**
   - Use bcrypt even for hardcoded password (best practice)
   - Never log passwords
   - Generic error messages (don't reveal valid usernames)

5. **Rate Limiting** (Future Enhancement)
   - Consider rate limiting `/token` endpoint
   - Prevent brute force attacks
   - Monitor failed authentication attempts

6. **Token Validation**
   - Validate token signature on every request
   - Check expiration claim
   - Verify token structure
   - Handle malformed tokens gracefully

---

## API Examples

### Request Token
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=demo&password=demo123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vIiwiZXhwIjoxNzExNzM0MDAwfQ.signature",
  "token_type": "bearer"
}
```

### Use Token in Scan Request
```bash
curl -X POST "http://localhost:8000/scan" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@food.jpg"
```

### Invalid Token Response
```json
{
  "detail": "Could not validate credentials"
}
```

---

## Deployment Steps

### Render.com Configuration

1. **Add Environment Variables:**
   - Go to Render.com dashboard
   - Navigate to your service
   - Add environment variables:
     ```
     SECRET_KEY=<generated_secret_key>
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_HOURS=24
     ```

2. **Update Dependencies:**
   - Ensure `requirements.txt` includes auth dependencies
   - Render will automatically install them

3. **Verify CORS Settings:**
   - Ensure CORS allows Authorization header
   - Already configured in existing `app/main.py`

4. **Test Deployment:**
   - Deploy backend changes
   - Test `/token` endpoint
   - Test `/scan` with authentication
   - Verify 401 responses work correctly

### Frontend Configuration

1. **Update Backend URL:**
   - Update `BACKEND_URL` in `services/api.ts`
   - Use production Render.com URL

2. **Test on Device:**
   - Build app for testing
   - Verify automatic authentication
   - Test token persistence

---

## Documentation Updates

### README.md Updates

Add authentication section:

```markdown
## Authentication

This application uses OAuth2 Password + Bearer flow for authentication.

### Credentials (Demo Only)
- Username: `demo`
- Password: `demo123`

### How It Works
1. App automatically authenticates on launch
2. JWT token cached for 24 hours
3. Token included in all API requests
4. Automatic re-authentication on token expiry

### API Usage

Request token:
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=demo&password=demo123"
```

Use token in requests:
```bash
curl -X POST "http://localhost:8000/scan" \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@image.jpg"
```

### Development Setup

1. Generate SECRET_KEY:
   ```bash
   openssl rand -hex 32
   ```

2. Add to `.env`:
   ```
   SECRET_KEY=<generated_key>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_HOURS=24
   ```

3. Install dependencies:
   ```bash
   pip install python-jose[cryptography] passlib[bcrypt]
   ```
```

---

## Troubleshooting

### Common Issues

**Issue: 401 Unauthorized on all requests**
- Check if token is being sent in Authorization header
- Verify SECRET_KEY matches between token generation and validation
- Check token expiration time

**Issue: Token not persisting across app restarts**
- Verify AsyncStorage is properly installed
- Check if token and expiry are being saved
- Test AsyncStorage read/write operations

**Issue: CORS errors with Authorization header**
- Ensure CORS middleware allows Authorization header
- Verify allow_headers includes "Authorization"
- Check browser/app is sending preflight requests correctly

**Issue: Password hash mismatch**
- Ensure bcrypt is installed correctly
- Verify password hashing happens on startup
- Check password comparison logic

---

## Future Enhancements

1. **Multiple Users**
   - Database-backed user authentication
   - User registration endpoint
   - Role-based access control

2. **Refresh Tokens**
   - Separate access and refresh tokens
   - Longer refresh token lifetime
   - Automatic token refresh before expiry

3. **Social Authentication**
   - Google/Facebook OAuth integration
   - JWT from social providers
   - Account linking

4. **Security Improvements**
   - Rate limiting on authentication endpoints
   - Failed login attempt tracking
   - IP-based blocking
   - CAPTCHA for repeated failures

5. **Token Revocation**
   - Blacklist for revoked tokens
   - Admin endpoint to revoke tokens
   - Logout functionality

---

## Success Criteria

Implementation is complete when:
- [ ] Backend `/token` endpoint works with hardcoded credentials
- [ ] Backend `/scan` requires valid bearer token
- [ ] Frontend automatically authenticates on launch
- [ ] Frontend includes bearer token in all API requests
- [ ] Token persists across app restarts
- [ ] Token automatically refreshes after 24 hours
- [ ] 401 errors are handled gracefully with retry
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Deployed to Render.com with proper environment variables
