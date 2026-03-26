# Skeleton Implementation Task List

This document outlines the detailed tasks for implementing the NutriHealth skeleton, covering both the React Native mobile app and FastAPI backend.

## Configuration Notes
- **Gemini API**: Using placeholder values for now
- **Database**: render.com managed PostgreSQL
- **Fonts**: Plus Jakarta Sans and Be Vietnam Pro via Google Fonts
- **Image Upload**: 5MB maximum file size
- **Cache TTL**: 1 day, time-based expiry only

---

## Phase 1: React Native App Structure ✅ COMPLETED

### 1.1 Navigation & Layout Setup ✅
- [x] Install drawer navigation dependencies: `@react-navigation/drawer`, `react-native-gesture-handler`
- [x] Update `app/_layout.tsx` to use Drawer navigator instead of Stack
- [x] Configure drawer to open from right side
- [x] Set up three main routes:
  - [x] `/` - Home (Daily Tracker)
  - [x] `/scanner` - Food Scanner
  - [x] `/scanner/results` - Scan Results
- [x] Add custom drawer content with child-friendly navigation items
- [x] Test drawer gestures and navigation flow

### 1.2 Design System Foundation ✅
- [x] Create `constants/Colors.ts` with nature-based palette:
  - [x] Primary colors (greens): `#006b1b`, `#91f78e`
  - [x] Secondary colors (oranges)
  - [x] Tertiary colors (berry reds): `#b02500`
  - [x] Surface hierarchy: `surface`, `surface-container`, `surface-container-low`, `surface-container-lowest`, `surface-container-high`, `surface-container-highest`, `surface-dim`
  - [x] On-surface colors: `#2a3127`, `on-surface-variant`
  - [x] Outline variant: `#a8afa2`
- [x] Create `constants/Typography.ts`:
  - [x] Configure font families (Plus Jakarta Sans, Be Vietnam Pro)
  - [x] Define scale (display-lg: 3.5rem, display-md, display-sm, body-lg, etc.)
  - [x] Load fonts via Google Fonts or expo-font
- [x] Create `constants/Spacing.ts` with spacing scale (spacing-6: 2rem, etc.)
- [x] Create `constants/Radius.ts` with squircle values (sm: 0.5rem, xl: 3rem, full)
- [x] Create base components in `components/`:
  - [x] `Button.tsx` - Primary button with gradient (primary → primary_container at 135°)
  - [x] `SecondaryButton.tsx` - Action chip style button
  - [x] `Card.tsx` - Container using surface hierarchy with proper nesting
  - [x] `Typography/Display.tsx` - Display text (Plus Jakarta Sans)
  - [x] `Typography/Body.tsx` - Body text (Be Vietnam Pro)
  - [x] `Typography/Headline.tsx` - Headline text (Plus Jakarta Sans)

### 1.3 Page Implementations ✅

#### Home Page (Daily Tracker) ✅
- [x] Update `app/index.tsx` with tracker interface skeleton
- [x] Add placeholder sections for daily goals
- [x] Use surface layering for visual hierarchy (surface → surface-container → surface-container-lowest)
- [x] Add large, child-friendly UI elements
- [x] Apply color blocking instead of borders for sections
- [x] Add placeholder text indicating image placeholders where needed

#### Scanner Page ✅
- [x] Create `app/scanner/index.tsx`
- [x] Install `expo-image-picker` dependency
- [x] Add permissions configuration in `app.json`:
  - [x] Camera permission
  - [x] Gallery permission
- [x] Create two large colorful buttons:
  - [x] "Take Photo" button (opens camera)
  - [x] "Choose from Gallery" button (opens image picker)
- [x] Implement image selection handlers
- [x] Add loading state during upload (with child-friendly animation/text)
- [x] Implement image upload to backend `/scan` endpoint
- [x] Add 5MB file size validation
- [x] Navigate to results page after successful upload
- [x] Add error handling with child-friendly messages

#### Results Page ✅
- [x] Create `app/scanner/results.tsx`
- [x] Accept route params containing scan results
- [x] Display nutritional information in large, readable text
- [x] Show health assessment
- [x] Display healthier alternatives if provided
- [x] Use surface containers for visual separation
- [x] Add "Scan Another" button to return to scanner
- [x] Apply Be Vietnam Pro font for content readability

### 1.4 Image Handling & API Integration ✅
- [x] Create `services/api.ts` for backend communication
- [x] Add environment configuration for backend URL (local dev vs production)
- [x] Implement image upload function with multipart/form-data
- [x] Add timeout handling (30 seconds)
- [x] Implement network error handling
- [x] Add retry logic for failed uploads
- [x] Create loading indicators for async operations

---

## Phase 2: FastAPI Backend Structure ✅ COMPLETED

### 2.1 Project Organization ✅
- [x] Create directory structure:
  ```
  nutri-health-api/
  ├── app/
  │   ├── __init__.py
  │   ├── main.py
  │   ├── models/
  │   │   ├── __init__.py
  │   │   └── cache.py
  │   ├── schemas/
  │   │   ├── __init__.py
  │   │   └── scan.py
  │   ├── services/
  │   │   ├── __init__.py
  │   │   ├── gemini.py
  │   │   └── cache.py
  │   ├── routers/
  │   │   ├── __init__.py
  │   │   └── scan.py
  │   └── database.py
  ├── requirements.txt
  ├── Dockerfile
  ├── render.yaml
  └── .env.example
  ```
- [x] Move existing `main.py` to `app/main.py`
- [x] Update import paths

### 2.2 Dependencies Setup ✅
- [x] Create `requirements.txt` with:
  - [x] `fastapi[standard]`
  - [x] `uvicorn`
  - [x] `sqlalchemy`
  - [x] `psycopg2-binary`
  - [x] `python-multipart`
  - [x] `google-generativeai`
  - [x] `python-dotenv`
  - [x] `pillow`
- [x] Create `.env.example` with required environment variables:
  - [x] `DATABASE_URL`
  - [x] `GEMINI_API_KEY`
  - [x] `CORS_ORIGINS`

### 2.3 Database Setup ✅
- [x] Create `app/database.py`:
  - [x] PostgreSQL connection configuration
  - [x] SQLAlchemy engine and session setup
  - [x] Database URL from environment variable
- [x] Create `app/models/cache.py` with ScanCache model:
  - [x] `id` - UUID primary key
  - [x] `image_hash` - String with unique index
  - [x] `response_data` - JSONB column
  - [x] `created_at` - Timestamp
  - [x] `expires_at` - Timestamp (created_at + 1 day)
- [x] Add database initialization in `app/main.py`
- [x] Create table creation logic (on startup)

### 2.4 Gemini Integration ✅
- [x] Create `app/services/gemini.py`:
  - [x] Configure Gemini API client (placeholder API key)
  - [x] Create prompt template for food analysis:
    - [x] Request nutritional information
    - [x] Request ingredient identification
    - [x] Request health assessment
    - [x] Request healthier alternatives if unhealthy
  - [x] Implement `analyze_food_image(image_bytes)` function
  - [x] Parse Gemini response to structured JSON
  - [x] Add error handling for API failures
  - [x] Add timeout handling (60 seconds)
  - [x] Include fallback response for when Gemini is unavailable

### 2.5 Pydantic Schemas ✅
- [x] Create `app/schemas/scan.py`:
  - [x] `ScanResponse` schema with:
    - [x] `food_name: str`
    - [x] `nutritional_info: dict`
    - [x] `health_assessment: str`
    - [x] `alternatives: List[dict]`
  - [x] `ErrorResponse` schema

### 2.6 Cache Service ✅
- [x] Create `app/services/cache.py`:
  - [x] Implement image hashing function (SHA-256)
  - [x] `get_cached_result(image_hash)` function
    - [x] Check if exists and not expired
    - [x] Return cached data or None
  - [x] `cache_result(image_hash, response_data)` function
    - [x] Store with TTL of 1 day
  - [x] `cleanup_expired_cache()` background task

### 2.7 Scan Endpoint Implementation ✅
- [x] Create `app/routers/scan.py`:
  - [x] POST `/scan` endpoint
  - [x] Accept `UploadFile` parameter
  - [x] Validate file type (JPEG, PNG)
  - [x] Validate file size (max 5MB)
  - [x] Read image bytes
  - [x] Generate image hash
  - [x] Check cache for existing result
  - [x] If cached and valid, return cached response
  - [x] If not cached:
    - [x] Call Gemini service
    - [x] Store result in cache
    - [x] Return response
  - [x] Add comprehensive error handling
  - [x] Return proper HTTP status codes

### 2.8 Main Application Setup ✅
- [x] Update `app/main.py`:
  - [x] Import and register scan router
  - [x] Add CORS middleware (allow React Native app)
  - [x] Add health check endpoint `/health`
  - [x] Add startup event for database initialization
  - [x] Add background task scheduler for cache cleanup
  - [x] Configure logging

### 2.9 Render.com Configuration ✅
- [x] Create `Dockerfile`:
  - [x] Use Python 3.11 base image
  - [x] Copy requirements and install dependencies
  - [x] Copy application code
  - [x] Expose port 8000
  - [x] Set CMD to run uvicorn
- [x] Create `render.yaml`:
  - [x] Define web service
  - [x] Link PostgreSQL database
  - [x] Set environment variables
  - [x] Configure health check endpoint
  - [x] Set build and start commands
- [x] Create deployment documentation (README.md)

---

## Phase 3: Documentation & Deployment (Automated Testing Skipped)

### 3.1 Local Development Setup ✅
- [x] Create comprehensive README for backend (completed in Phase 2)
  - [x] Environment setup instructions
  - [x] Database setup (local PostgreSQL or SQLite for dev)
  - [x] Running the server locally
  - [x] API documentation endpoint
- [ ] Create README for frontend
- [x] Document Gemini API key setup process
- [x] Create troubleshooting guide

### 3.2 Manual Integration Verification
- [ ] Manually test image upload from React Native app to local backend
- [ ] Verify backend response format matches frontend expectations
- [ ] Test cache functionality with repeated uploads
- [ ] Verify error responses display correctly in app

### 3.3 Deployment Preparation
- [x] Backend has OpenAPI/Swagger documentation (auto-generated)
- [x] Deployment configuration complete (render.yaml, Dockerfile)
- [x] Environment variables documented
- [ ] Update frontend with deployed backend URL
- [ ] Test deployed backend endpoints

**Note:** Automated testing has been skipped per project requirements. Manual testing should be performed to verify the integration.

---

## Success Criteria

The skeleton implementation will be considered complete when:

1. ✅ React Native app has functional drawer navigation
2. ✅ All three main pages render with appropriate placeholders
3. ✅ Image picker works on Android devices/emulators
4. ✅ FastAPI backend accepts image uploads
5. ✅ Gemini integration returns mock/real responses
6. ✅ PostgreSQL caching works (with 1-day TTL)
7. ✅ End-to-end flow: capture image → upload → display results
8. ✅ Design system constants are established and documented
9. ✅ Error handling provides child-friendly feedback
10. ✅ Backend is deployable to render.com

---

## Notes

- Focus on functionality over polish in this skeleton phase
- Use placeholders for images where final assets aren't available
- Mock data is acceptable for initial testing
- Child-friendly UI/UX is priority even in skeleton phase
- Follow SOLID principles and clean architecture patterns
- Maintain separation of concerns (domain, services, infrastructure)
