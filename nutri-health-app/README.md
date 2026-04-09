# NutriHealth Mobile App

React Native mobile application for NutriHealth - helping children aged 7-12 make healthier food choices through AI-powered food scanning and nutritional education.

## Features

- **Food Scanner**: Take photos or select from gallery to analyze food
- **Nutritional Analysis**: AI-powered insights using Google Gemini
- **Child-Friendly Design**: Large buttons, clear colors, simple language
- **Daily Tracker**: Monitor healthy eating goals and progress
- **Healthier Alternatives**: Get suggestions for better food choices
- **Offline Support**: Graceful handling when network is unavailable

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with Drawer navigation
- **Language**: TypeScript
- **Design System**: Custom design tokens (colors, typography, spacing)
- **Image Handling**: expo-image-picker
- **Fonts**: Plus Jakarta Sans, Be Vietnam Pro (Google Fonts)

## Project Structure

```
nutri-health-app/
├── app/
│   ├── _layout.tsx          # Root layout with drawer navigation
│   ├── index.tsx            # Home page (Daily Tracker)
│   └── scanner/
│       ├── index.tsx        # Scanner page
│       └── results.tsx      # Results page
├── components/
│   ├── Button.tsx           # Primary button with gradient
│   ├── SecondaryButton.tsx  # Action chip button
│   ├── Card.tsx             # Container component
│   └── Typography/
│       ├── Display.tsx      # Display text
│       ├── Body.tsx         # Body text
│       └── Headline.tsx     # Headline text
├── constants/
│   ├── Colors.ts            # Color palette
│   ├── Typography.ts        # Font scales
│   ├── Spacing.ts           # Spacing scale
│   └── Radius.ts            # Border radius values
├── services/
│   └── api.ts               # Backend API integration
├── assets/                  # Images and fonts
├── app.json                 # Expo configuration
└── package.json             # Dependencies
```

## Design System

### Colors
- **Primary (Green)**: #006b1b, #91f78e
- **Secondary (Orange)**: #ff8a00, #ffd699
- **Tertiary (Red)**: #e63946, #ffb3ba
- **Surface Hierarchy**: Tonal layering for depth

### Typography
- **Display**: Plus Jakarta Sans (bold, friendly)
- **Body**: Be Vietnam Pro (readable, soft)
- Scales from 12px to 56px

### Layout
- Squircle radius (minimum 8px)
- Consistent spacing scale
- Child-friendly large touch targets

## Setup

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development) or Xcode (for iOS)
- Physical device or emulator

### Installation

1. **Install dependencies**
   ```bash
   cd nutri-health-app
   npm install
   ```

2. **Download fonts** (Optional but recommended)
   
   Download from Google Fonts and place in `assets/fonts/`:
   - Plus Jakarta Sans (Bold, SemiBold)
   - Be Vietnam Pro (Regular, Medium, Bold)
   
   Or the app will use system defaults until fonts are loaded.

3. **Configure backend URL**
   
   Edit `services/api.ts` and update the backend URL:
   ```typescript
   const BACKEND_URL = __DEV__ 
     ? 'http://YOUR_LOCAL_IP:8000'  // For testing on physical device
     : 'https://your-app.onrender.com';  // Production URL
   ```

### Running the App

1. **Start Expo development server**
   ```bash
   npm start
   ```

2. **Choose your platform**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app for physical device

### Development on Physical Device

For testing on a physical Android device:

1. Install Expo Go from Play Store
2. Ensure device is on same WiFi as development machine
3. Update `services/api.ts` with your local IP address:
   ```typescript
   const BACKEND_URL = 'http://192.168.1.XXX:8000';
   ```
4. Scan QR code from terminal

## Backend Integration

The app connects to the NutriHealth FastAPI backend for food analysis.

### API Endpoint

**POST /scan**
- Upload: Image file (JPEG/PNG, max 5MB)
- Response: Food analysis with nutritional info and alternatives

### Response Format

```typescript
{
  food_name: string,
  nutritional_info: {
    calories?: number,
    carbohydrates?: number,
    protein?: number,
    fats?: number
  },
  health_assessment: string,
  alternatives: Array<{
    name: string,
    description?: string
  }>
}
```

## App Screens

### 1. Daily Tracker (Home)
- Welcome message
- Daily goals tracking (fruits/veggies, water, meals)
- Progress visualization
- Quick access to scanner

### 2. Food Scanner
- "Take Photo" button (opens camera)
- "Choose from Gallery" button (opens gallery)
- Loading state during analysis
- Error handling with child-friendly messages

### 3. Results
- Food name display
- Health assessment
- Nutritional breakdown
- Healthier alternatives
- "Scan Another" button

## Permissions

The app requires the following permissions:

**Android** (in `app.json`):
- `android.permission.CAMERA`
- `android.permission.READ_MEDIA_IMAGES`
- `android.permission.READ_EXTERNAL_STORAGE`
- `android.permission.WRITE_EXTERNAL_STORAGE`

**iOS** (in `app.json`):
- `NSCameraUsageDescription`
- `NSPhotoLibraryUsageDescription`

## Building for Production

### Android APK

```bash
# Build APK
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

### iOS App

```bash
# Build for iOS
eas build --platform ios --profile production
```

## Troubleshooting

### "Network request failed"
- Check backend is running
- Verify backend URL in `services/api.ts`
- Ensure device/emulator can reach backend
- Check firewall settings

### Camera/Gallery not working
- Verify permissions in `app.json`
- Rebuild app after adding permissions
- Check device settings allow camera access

### Images not uploading
- Check file size (max 5MB)
- Verify file type (JPEG or PNG)
- Check network connectivity
- Review backend logs for errors

### Fonts not loading
- Download fonts from Google Fonts
- Place in `assets/fonts/` directory
- Update paths in `constants/Typography.ts`
- Restart development server

## Development Tips

### Hot Reload
- Expo provides hot reload out of the box
- Save files to see changes instantly
- Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS) for dev menu

### Debugging
- Use React Native Debugger
- Enable remote debugging in dev menu
- Use console.log() statements
- Check Expo Dev Tools in browser

### Code Quality
```bash
# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

## Environment Variables

For different environments, update `services/api.ts`:

```typescript
const BACKEND_URL = __DEV__ 
  ? process.env.EXPO_PUBLIC_API_URL_DEV || 'http://localhost:8000'
  : process.env.EXPO_PUBLIC_API_URL_PROD || 'https://your-api.onrender.com';
```

Then use `.env` files for configuration (requires expo-constants).

## Testing Checklist

- [ ] App launches successfully
- [ ] Drawer navigation opens from right
- [ ] Camera permission prompt works
- [ ] Gallery permission prompt works
- [ ] Can take photo with camera
- [ ] Can select image from gallery
- [ ] File size validation (5MB)
- [ ] Loading indicator shows during upload
- [ ] Results display correctly
- [ ] Error messages are child-friendly
- [ ] "Scan Another" navigation works
- [ ] Offline behavior is graceful

## Design Guidelines

When adding new features, follow these principles:

1. **Child-Friendly**
   - Large buttons and text
   - Clear, simple language
   - Bright, inviting colors
   - Emoji for visual interest

2. **Accessibility**
   - Minimum touch target 44x44px
   - High contrast text
   - Clear visual hierarchy
   - Screen reader support

3. **Consistency**
   - Use design system constants
   - Follow established patterns
   - Maintain spacing rhythm
   - Reuse components

## Performance Optimization

- Images compressed before upload
- API responses cached locally
- Lazy loading for heavy components
- Optimized re-renders with React.memo

## Future Enhancements

- User authentication
- Progress tracking history
- Achievement badges
- Meal planning features
- Social sharing
- Offline food database

## License

Proprietary - NutriHealth Project

## Support

For issues and questions, please contact the development team or check the backend API documentation at `/docs`.

---

**Built with ❤️ for healthier kids**
