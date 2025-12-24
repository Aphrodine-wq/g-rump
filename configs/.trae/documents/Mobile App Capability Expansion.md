# Mobile App Capability Expansion Plan

I will bring the mobile application up to parity with the recent web enhancements and complete the pending roadmap items.

## 1. Haptic Feedback Integration
Implement tactile feedback to make interactions feel physical, matching the "grumpy" personality.
- **Library**: Install and configure `expo-haptics`.
- **Triggers**:
  - `impactAsync(Heavy)` when Grump gets angry.
  - `notificationAsync(Success)` when a task completes.
  - `selectionAsync()` for UI interactions (menu, typing).

## 2. Settings & History (Persistence)
Implement the missing screens and data persistence.
- **Settings Screen**: Create `SettingsView.tsx` with controls for:
  - Theme (Dark/Light/System)
  - Haptics (On/Off)
  - Animation Quality (Low/High)
- **History Persistence**: Update `ChatStore.tsx` to use `@react-native-async-storage/async-storage` for saving/loading chat sessions.

## 3. Audio System (Mobile)
Port the "Grump Audio" concept to mobile using `expo-av`.
- **Sound Service**: Create `MobileAudioService.ts` adapting the web's procedural logic (or using synthesized samples since Web Audio API isn't fully available in RN without a webview bridge, I will use `expo-av` with generated sound files or a WebView bridge if strictly procedural is required. *Correction*: For consistency and performance on mobile, I will use a **WebView bridge** to reuse the exact same `ProceduralAudio.ts` logic from the web, ensuring 1:1 sound parity without managing assets).

## 4. Accessibility Polish
- Add `accessibilityLabel` and `accessibilityHint` to all interactive elements in `HomeView` and `Grump2`.

## Execution Steps
1.  **Install Dependencies**: `expo-haptics`, `expo-av`.
2.  **Update Store**: Refactor `ChatStore.tsx` to persist messages.
3.  **Implement Settings**: Create `SettingsView.tsx` and route to it.
4.  **Implement Audio/Haptics**: Create the services and hook them into `HomeView`.

