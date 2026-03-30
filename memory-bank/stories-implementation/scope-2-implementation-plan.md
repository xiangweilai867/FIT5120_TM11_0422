# Stories Feature Modification - Implementation Plan (Scope 2)

## Overview
This document outlines the implementation plan for modifying the stories feature as specified in `scope-2.md`. The changes include UI redesign, bug fixes, and enhanced user experience.

## Requirements Summary

### Story Viewer Changes
1. Display story text above each image (from text.json)
2. Implement continuous vertical scrolling (no snapping)
3. Single "Listen" button anchored at top of screen
4. Auto-scroll to next page when audio finishes
5. Auto-play next page's audio after scrolling
6. Each page takes ~1 screen height (top 50% text, bottom 50% image)

### Bug Fixes
1. Fix cover image sizing in carousel cards
2. Make carousel cards taller (75% of screen height)
3. Fix title truncation (allow multi-line display)
4. Fix back button navigation (should go to story list, not out of stories section)

### API Changes
1. Add text.json data fetching from API

## Implementation Plan

### Phase 1: Story Viewer Complete Redesign
**File: `nutri-health-app/app/stories/[id].tsx`**

#### 1.1 Data Structure & API Integration
- Add TypeScript interfaces:
  ```typescript
  interface StoryPage {
    storyText: string;
    imagePrompt: string;
  }
  
  interface StoryTextData {
    pages: StoryPage[];
  }
  ```
- Add state for story text data: `useState<StoryTextData | null>(null)`
- Fetch text.json from API when story loads using new service function
- Handle loading and error states for text data

#### 1.2 Layout Architecture
**Current Implementation Issues:**
- Uses `pagingEnabled` ScrollView (snapping behavior)
- Full-screen pages with only images
- Individual Listen buttons per page

**New Implementation:**
- Remove `pagingEnabled` prop from ScrollView
- Implement continuous vertical scrolling with `showsVerticalScrollIndicator={false}`
- Calculate page height: `SCREEN_HEIGHT` (accounting for safe areas and header)
- Structure per page:
  ```
  <View style={{ height: pageHeight }}>
    <View style={{ height: pageHeight * 0.5, padding }}>
      {/* Text content */}
    </View>
    <View style={{ height: pageHeight * 0.5 }}>
      {/* Image */}
    </View>
  </View>
  ```

#### 1.3 Fixed Listen Button Header
**Design:**
- Positioned absolutely at top of screen
- Dark semi-transparent background (rgba(0, 0, 0, 0.7) or similar)
- Button with speaker icon and "Listen"/"Stop" text
- Optional: Dropdown/menu icon on right (as shown in reference)
- z-index to keep above scrolling content

**Implementation:**
```typescript
<View style={styles.fixedHeader}>
  <TouchableOpacity onPress={handleListenPress}>
    <View style={styles.listenButton}>
      <Icon name="volume-up" /> {/* or appropriate icon */}
      <Text>{isPlaying ? 'Stop' : 'Listen'}</Text>
    </View>
  </TouchableOpacity>
</View>
```

#### 1.4 Audio Playback Logic
**Core Requirements:**
- Track currently visible page based on scroll position
- Play audio for currently visible page when Listen clicked
- Stop any playing audio before starting new one
- Auto-scroll and auto-play on audio finish

**Implementation Steps:**
1. Track current visible page:
   ```typescript
   const handleScroll = (event) => {
     const scrollY = event.nativeEvent.contentOffset.y;
     const pageIndex = Math.floor(scrollY / pageHeight);
     setCurrentPage(pageIndex + 1);
   };
   ```

2. Listen button handler:
   ```typescript
   const handleListenPress = async () => {
     if (isPlaying) {
       await stopAudio();
     } else {
       await playAudioForPage(currentPage);
     }
   };
   ```

3. Audio finish handler:
   ```typescript
   const handleAudioFinished = async (pageNumber) => {
     setIsPlaying(false);
     
     if (pageNumber < story.pageCount) {
       const nextPage = pageNumber + 1;
       
       // Auto-scroll to next page
       scrollViewRef.current?.scrollTo({
         y: (nextPage - 1) * pageHeight,
         animated: true
       });
       
       // Wait for scroll to complete, then play
       setTimeout(() => {
         playAudioForPage(nextPage);
       }, 500);
     }
     // If last page, just stay idle
   };
   ```

#### 1.5 Scroll Configuration
- Add `onScroll` event with `scrollEventThrottle={16}`
- Remove `pagingEnabled`
- Keep `showsVerticalScrollIndicator={false}`
- Remove `onMomentumScrollEnd` (no longer needed)

#### 1.6 Text Styling
**Requirements:**
- Match reference image (large serif font, good readability)
- Structure for easy per-story customization (future feature)

**Implementation:**
- Create text style constant matching reference design
- Use existing Typography constants as base
- Consider: serif font family, larger size, proper line height
- Structure to allow story-specific overrides:
  ```typescript
  const getStoryTextStyle = (storyId: string) => {
    // Future: return story-specific styles
    return defaultStoryTextStyle;
  };
  ```

**Style Properties:**
```typescript
const defaultStoryTextStyle = {
  ...Typography.bodyLarge,
  fontSize: 20, // Larger for readability
  lineHeight: 32,
  letterSpacing: 0.5,
  color: Colors.on_surface,
  // Future: fontFamily for serif font
};
```

---

### Phase 2: Story List Carousel Fixes
**File: `nutri-health-app/app/stories/index.tsx`**

#### 2.1 Card Height Adjustment
**Current:**
```typescript
const CARD_HEIGHT = CARD_WIDTH * 1.25; // 4:5 aspect ratio
```

**New:**
```typescript
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.75; // 75% of screen height
const CARD_WIDTH = CARD_HEIGHT * 0.7; // Maintain good proportions
```

#### 2.2 Cover Image Fix
**Current Issues:**
- Images only take 75% of card height
- May not be sizing/resizing properly

**Fix:**
```typescript
coverImage: {
  width: '100%',
  height: '85%', // Increase from 75% to 85-90%
  backgroundColor: Colors.surface_container, // Loading state
  resizeMode: 'cover', // Ensure proper fill
},
```

#### 2.3 Title Display Fix
**Current Issues:**
- `numberOfLines={2}` causes truncation
- Second line onwards not visible

**Fix:**
```typescript
titleContainer: {
  flex: 1, // Or fixed height: ~10-15% of card
  padding: Spacing.lg,
  justifyContent: 'center',
  backgroundColor: Colors.surface_container_lowest,
  minHeight: CARD_HEIGHT * 0.12, // Ensure minimum space
},
title: {
  ...Typography.headlineMedium,
  color: Colors.on_surface,
  marginBottom: Spacing.xs,
  // Remove or increase numberOfLines
  // Add ellipsizeMode if needed: ellipsizeMode: 'tail'
},
```

#### 2.4 Carousel Scrolling Adjustment
Update snap interval based on new card width:
```typescript
snapToInterval={CARD_WIDTH + Spacing.lg}
```

---

### Phase 3: Navigation Fix
**File: `nutri-health-app/app/stories/[id].tsx`**

#### 3.1 Back Button Override
**Current Issue:**
- Back button uses `router.back()` which exits stories section

**Fix:**
- Replace `router.back()` with `router.push('/stories')`
- Ensure audio cleanup before navigation
- Consider adding custom back button in header for clarity

**Implementation:**
```typescript
const handleBackPress = async () => {
  await cleanupAudio();
  router.push('/stories');
};

// In error state or custom back button:
<TouchableOpacity onPress={handleBackPress}>
  <Text>Back to Stories</Text>
</TouchableOpacity>
```

---

### Phase 4: API Service Enhancement
**File: `nutri-health-app/services/stories.ts`**

#### 4.1 Add Text Data Fetching
**New Function:**
```typescript
export interface StoryPage {
  storyText: string;
  imagePrompt: string;
}

export interface StoryTextData {
  pages: StoryPage[];
}

export async function getStoryText(storyId: string): Promise<StoryTextData> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${BASE_URL}/stories/story-${storyId}/text.json`,
      { headers }
    );
    
    if (!response.ok) {
      throw new ApiError('Failed to fetch story text', response.status);
    }
    
    const data: StoryTextData = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error while fetching story text');
  }
}
```

#### 4.2 Export New Types
Ensure types are exported for use in components:
```typescript
export type { StoryPage, StoryTextData };
```

---

## Implementation Order

1. **Phase 4 First** - Add API service (needed by Phase 1)
2. **Phase 1** - Story viewer redesign (largest change)
3. **Phase 2** - Story list fixes (visual improvements)
4. **Phase 3** - Navigation fix (quick fix)

## Testing Checklist

### Story Viewer
- [ ] Text loads from text.json correctly
- [ ] Continuous scrolling works smoothly
- [ ] Listen button stays fixed at top
- [ ] Audio plays for correct page based on scroll position
- [ ] Audio stops when Stop button pressed
- [ ] Audio auto-scrolls to next page on finish
- [ ] Audio auto-plays next page after scroll
- [ ] Last page audio stops without error
- [ ] Text displays properly (formatting, sizing)
- [ ] Images display correctly below text
- [ ] Page heights are consistent (~1 screen each)

### Story List
- [ ] Cards are taller (75% of screen)
- [ ] Cover images fill space properly
- [ ] Images resize correctly
- [ ] Multi-line titles display fully
- [ ] No title truncation issues
- [ ] Carousel scrolling works smoothly

### Navigation
- [ ] Back button goes to story list
- [ ] Does not exit stories section
- [ ] Audio cleans up properly on navigation

### General
- [ ] No console errors
- [ ] Loading states work correctly
- [ ] Error handling works
- [ ] Auth headers included in all requests

## Technical Notes

### Safe Area Handling
Consider safe area insets for:
- Fixed header positioning
- Page height calculations
- Content padding

### Performance Considerations
- Use `scrollEventThrottle={16}` for smooth tracking
- Optimize image loading/caching
- Properly cleanup audio on unmount

### Future Enhancements
- Per-story text styling support
- Story-specific themes
- Text animations
- Progress indicators
- Bookmarking/resume feature

## Dependencies
No new dependencies required. Uses existing:
- expo-av (audio playback)
- expo-router (navigation)
- React Native core components

## Estimated Complexity
- Phase 1: High (major redesign, complex audio logic)
- Phase 2: Low (style adjustments)
- Phase 3: Low (simple routing change)
- Phase 4: Medium (API integration)

## Risk Assessment
- **Audio auto-play timing**: May need adjustment for smooth UX
- **Scroll position tracking**: Must be accurate for correct audio
- **Performance**: Multiple images in ScrollView - monitor performance
- **Text overflow**: Long text may need scrolling within text area

## Success Criteria
✅ All pages scroll smoothly without snapping
✅ Single Listen button controls audio for visible page
✅ Audio auto-advances through story
✅ Text displays above images
✅ Carousel cards are taller with proper images
✅ Titles display fully without truncation
✅ Back button navigates to story list
