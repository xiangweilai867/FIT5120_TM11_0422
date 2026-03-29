# Stories System Implementation Plan

## Overview
Implement a short story section in the NutriHealth app where users can browse and listen to educational stories with images and audio narration.

## Technical Decisions

### Storage Structure (S3-Ready)
```
nutri-health-api/stories/
├── stories.json              # Main index/manifest
├── story-1/
│   ├── cover.jpg
│   └── pages/
│       ├── page-1.jpg
│       ├── page-1.mp3
│       ├── page-2.jpg
│       ├── page-2.mp3
│       └── ...
├── story-2/
│   └── ...
```

**Rationale**: This folder-based structure translates perfectly to S3 bucket organization and allows for easy migration. Each story is self-contained with its assets.

### File Formats
- **Audio**: MP3 (universal platform support, good compression)
- **Images**: JPEG (best balance of quality/size, universal support)

### Data Structure

#### stories.json (Manifest File)
```json
{
  "stories": [
    {
      "id": "story-1",
      "title": "The Healthy Garden",
      "coverImage": "story-1/cover.jpg",
      "pageCount": 5
    },
    {
      "id": "story-2",
      "title": "Rainbow Vegetables",
      "coverImage": "story-2/cover.jpg",
      "pageCount": 4
    }
  ]
}
```

## Backend Implementation

### Phase 1: Storage Setup

1. **Create directory structure**
   - Create `/nutri-health-api/stories/` directory
   - Create subdirectories for 2-3 sample stories
   - Create `/pages/` subdirectory within each story folder

2. **Generate placeholder content**
   - Create placeholder images (simple colored rectangles with text)
   - Create silent audio files or simple audio placeholders
   - Create `stories.json` manifest file

### Phase 2: API Endpoints

Create `/nutri-health-api/app/routers/stories.py`:

#### Endpoints Required:
```python
# GET /stories
# Returns list of all available stories
# Response: { "stories": [...] }

# GET /stories/{story_id}/cover
# Returns cover image as file
# Response: Image file (JPEG)

# GET /stories/{story_id}/pages/{page_number}/image
# Returns page image as file
# Response: Image file (JPEG)

# GET /stories/{story_id}/pages/{page_number}/audio
# Returns page audio as file
# Response: Audio file (MP3)
```

#### Implementation Details:
- Use `FileResponse` from FastAPI to serve static files
- Add JWT authentication dependency (same as existing endpoints)
- Validate story_id and page_number exist
- Return 404 for missing resources
- Proper error handling and logging

### Phase 3: Router Registration

Update `/nutri-health-api/app/main.py`:
- Import stories router
- Register with `app.include_router(stories.router)`

## Frontend Implementation

### Phase 1: Navigation Setup

Update `/nutri-health-app/app/_layout.tsx`:
- Add "Stories" entry to Drawer navigation
- Configure route to `stories/index`

### Phase 2: API Service Layer

Create `/nutri-health-app/services/stories.ts`:

#### Functions Required:
```typescript
// Fetch list of available stories
export async function getStories(): Promise<Story[]>

// Get story cover image URL
export function getStoryCoverUrl(storyId: string): string

// Get story page image URL
export function getStoryPageImageUrl(storyId: string, pageNumber: number): string

// Get story page audio URL
export function getStoryPageAudioUrl(storyId: string, pageNumber: number): string
```

#### Implementation Details:
- Use same auth token handling as existing API calls
- Handle authentication errors (401)
- Timeout handling
- Error wrapping with ApiError

### Phase 3: Story List Screen

Create `/nutri-health-app/app/stories/index.tsx`:

#### Features:
- Fetch stories on mount
- Display loading state
- Show error state if fetch fails
- Render carousel/grid of story cards
- Each card shows cover image and title
- Navigate to story viewer on card tap

#### UI/UX Requirements (from design-guide.md):
- Use `surface` as background
- Story cards on `surface_container_lowest`
- Cards use `xl` (3rem) border radius (squircle effect)
- Implement carousel with horizontal scrolling
- Use `display-md` for title typography
- Follow "no-line" rule - use color blocking for separation

#### Recommended Libraries:
- `react-native-snap-carousel` for carousel
- Or use FlatList with horizontal scroll

### Phase 4: Story Viewer Screen

Create `/nutri-health-app/app/stories/[id].tsx`:

#### Features:
- Fetch story metadata
- Vertically scrolling pages
- Display page image
- Display page text (if any)
- "Listen" button to start audio
- Auto-advance to next page when audio completes
- Stop audio on navigation away

#### UI/UX Requirements:
- Each page should be full-screen viewable
- Use ScrollView with snap-to-page behavior
- Audio button uses `primary_container` with gradient
- Follow glassmorphism for overlay controls
- Smooth transitions between pages

#### Audio Playback:
- Use `expo-av` for audio playback
- Track current page
- Auto-scroll to next page on audio completion
- Handle audio cleanup on unmount
- Pause/stop when navigating away

### Phase 5: Component Creation

#### StoryCard Component (`/components/StoryCard.tsx`):
- Props: story (id, title, coverImage)
- Display cover image
- Display title
- Handle tap to navigate
- Follow design system (squircle, surface layering)

#### StoryPageViewer Component (can be part of [id].tsx):
- Display page image
- Display text overlay (if any)
- Audio controls
- Page indicator (e.g., "Page 2 of 5")

## Testing Checklist

### Backend Tests:
- [ ] Stories manifest endpoint returns correct data
- [ ] Cover images are served correctly
- [ ] Page images are served correctly
- [ ] Audio files are served correctly
- [ ] 404 returned for non-existent stories/pages
- [ ] Authentication required for all endpoints
- [ ] Invalid tokens rejected

### Frontend Tests:
- [ ] Story list loads and displays
- [ ] Carousel navigation works
- [ ] Story selection navigates to viewer
- [ ] Images load properly
- [ ] Audio plays when "Listen" clicked
- [ ] Audio auto-advances to next page
- [ ] Audio stops when navigating away
- [ ] Back navigation works
- [ ] Error states display properly
- [ ] Loading states display properly

## Dependencies to Install

### Backend:
- None (using existing FastAPI and dependencies)

### Frontend:
- `expo-av` (for audio playback) - if not already installed
- Consider: `react-native-snap-carousel` or similar for carousel

## File Checklist

### Backend Files:
- [ ] `nutri-health-api/stories/stories.json`
- [ ] `nutri-health-api/stories/story-1/cover.jpg`
- [ ] `nutri-health-api/stories/story-1/pages/page-1.jpg`
- [ ] `nutri-health-api/stories/story-1/pages/page-1.mp3`
- [ ] `nutri-health-api/app/routers/stories.py`
- [ ] Updated: `nutri-health-api/app/main.py`

### Frontend Files:
- [ ] `nutri-health-app/services/stories.ts`
- [ ] `nutri-health-app/app/stories/index.tsx`
- [ ] `nutri-health-app/app/stories/[id].tsx`
- [ ] `nutri-health-app/components/StoryCard.tsx`
- [ ] Updated: `nutri-health-app/app/_layout.tsx`

## Implementation Order

1. Backend storage setup (directories and placeholder content)
2. Backend API endpoints
3. Backend router registration
4. Frontend API service
5. Frontend navigation setup
6. Frontend story list screen
7. Frontend story viewer screen
8. UI polish and testing
9. End-to-end testing

## Notes

- Maximum 10 stories supported (as per scope)
- Stories are static content (pre-generated)
- Authentication uses existing JWT mechanism
- Audio format: MP3 for universal support
- Image format: JPEG for efficiency
- Design follows "The Culinary Playground" design system
- Structure is S3-migration ready for future scaling
