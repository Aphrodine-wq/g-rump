# Grump iOS App

The iOS client for Grump, the world's crankiest AI assistant.

## Requirements

- Xcode 15.0 or later
- iOS 16.0 or later
- Swift 5.9 or later
- macOS 13.0 or later (for development)

## Setup

1. **Open the project in Xcode:**
   - Open `Grump.xcodeproj` (or create a new Xcode project and add the files)
   - Ensure the deployment target is set to iOS 16.0

2. **Configure the API endpoint:**
   - Open `ios/Grump/Services/APIClient.swift`
   - Update the `baseURL` constant:
     - For development: `http://localhost:3000` (requires backend running)
     - For production: Update to your production backend URL

3. **Build and run:**
   - Select a simulator or connected device
   - Press Cmd+R to build and run

## Project Structure

```
ios/Grump/
├── GrumpApp.swift          # App entry point
├── App/                     # App-level components
├── Views/                   # SwiftUI views
│   ├── ContentView.swift   # Main content view
│   ├── ChatView.swift      # Chat interface
│   └── OnboardingView.swift # First launch experience
├── Models/                  # Data models
│   ├── Message.swift       # Message model
│   └── ChatSession.swift   # Chat session model
├── Services/                # Business logic
│   ├── APIClient.swift     # Backend API client
│   └── ChatService.swift   # Chat orchestration
├── Storage/                 # Data persistence
│   └── ChatStore.swift     # SwiftData store
├── Components/              # Reusable UI components
│   ├── MessageBubbleView.swift
│   ├── InputBarView.swift
│   ├── TypingIndicatorView.swift
│   └── GrumpAvatarView.swift
└── Resources/               # Assets, colors, fonts
    └── Colors.swift        # Design system colors
```

## Features

### MVP Features Implemented

- ✅ Chat interface with message bubbles
- ✅ Grump avatar with animations
- ✅ Custom typing indicator
- ✅ Onboarding flow
- ✅ Local chat history (SwiftData)
- ✅ Dark theme design system
- ✅ Smooth animations and haptic feedback
- ✅ New chat functionality

## Configuration

### API Configuration

The app connects to the backend API. Update the base URL in `APIClient.swift`:

```swift
#if DEBUG
private let baseURL = "http://localhost:3000"
#else
private let baseURL = "https://your-production-api.com"
#endif
```

### Design System

Colors and design tokens are defined in `Resources/Colors.swift` matching the PRD specifications:
- Background: #0A0A0A
- Surface: #1A1A1A
- Accent: #FF6B6B
- Text Primary: #E0E0E0
- Text Secondary: #888888

## Development Notes

### SwiftData

The app uses SwiftData for local persistence. Models are defined with `@Model` macro:
- `ChatSession` - Stores conversation sessions
- `Message` - Stores individual messages

### State Management

- `ChatService` is an `ObservableObject` that manages chat state
- Uses `@EnvironmentObject` to share state across views
- Messages are persisted automatically via SwiftData

### Network

- Uses async/await for network requests
- Error handling with user-friendly messages
- Rate limiting handled by backend

## Testing

To test the app:

1. Start the backend server (see `backend/README.md`)
2. Run the iOS app in simulator
3. Send messages and verify responses from Grump

## Troubleshooting

### App won't connect to backend

- Ensure backend server is running
- Check API base URL in `APIClient.swift`
- For iOS simulator, `localhost` should work
- For physical device, use your computer's IP address

### SwiftData errors

- Ensure models are properly marked with `@Model`
- Check that ModelContainer is configured in `GrumpApp.swift`

## App Store Submission

Ready to submit Grump to the App Store? See the detailed guides:

- **[APP_STORE_SUBMISSION.md](APP_STORE_SUBMISSION.md)** - Complete step-by-step guide
- **[APP_STORE_CHECKLIST.md](APP_STORE_CHECKLIST.md)** - Submission checklist

### Quick Checklist

- [ ] Xcode project created with proper Bundle ID
- [ ] App Store Connect app created
- [ ] App icon (1024x1024) prepared
- [ ] Screenshots for required device sizes
- [ ] Production API endpoint configured
- [ ] App description and keywords written
- [ ] Privacy policy URL (if collecting data)
- [ ] Archive built and uploaded
- [ ] Submitted for review

## Next Steps

Future enhancements (from PRD):
- Chat history management UI
- Search conversations
- App Store optimization
- Analytics integration
- Export/share functionality
- Push notifications
- Premium features

