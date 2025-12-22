# iOS App Implementation & Audit Plan

## 1. Remaining Work Items

### 🎨 UI/UX Polish
- [ ] **Accessibility Audit**: Ensure VoiceOver labels are present on all interactable elements (`Grump2`, `MenuButton`, `Input`).
- [ ] **Haptic Feedback**: Integrate `expo-haptics` for button presses and message receipt.
- [ ] **Tablet Layout**: Optimize `HomeView` for iPad (split view support).
- [ ] **Dark/Light Mode**: Fully support system theme switching (currently hardcoded dark mode).

### ⚡ Performance
- [ ] **Animation Profiling**: Verify 60fps on iPhone 11 and above using Expo Dev Tools.
- [ ] **Image Optimization**: Replace any raster assets with SVGs where possible.
- [ ] **Memory Leak Check**: Monitor `useEffect` cleanup in `Grump2.tsx` (animations loops).

### 🛠 Features
- [ ] **Settings Screen**: Implement the settings menu (currently a placeholder).
- [ ] **History Persistence**: Ensure chat history survives app restarts (using `AsyncStorage` or SQLite).
- [ ] **Offline Mode**: Cache Grump's responses or provide offline fallback.

## 2. Quality Benchmarks

### Animation Fluidity
- **Target**: Constant 60fps (16.6ms frame time).
- **Metric**: No JS frame drops during `PanResponder` gestures (drawer drag).
- **Requirement**: Use `useNativeDriver: true` for all transforms and opacity changes.

### Environment Detail (Claude Style)
- **Palette**: Warm Grays (`#1C1C1E`), Off-White Accents (`#E5E5EA`), Subtle Shadows.
- **Lighting**: Soft, ambient lighting simulated via gradients and opacity layering.
- **Particles**: Minimalist floating particles (max 20 on screen) to add depth without clutter.

### Code Quality
- **Formatting**: 2-space indentation, semicolons required.
- **Typing**: Strict TypeScript usage (no `any` types).
- **Structure**: Components must be functional and use Hooks. Business logic separated into `store/`.

## 3. Style Guidelines

### Typography
- **Font**: System San Francisco (iOS) / Roboto (Android).
- **Weights**:
  - Headers: Semibold (600) or Bold (700).
  - Body: Regular (400).
  - Captions: Medium (500).
- **Spacing**: 
  - Line Height: 1.5x font size for readability.
  - Letter Spacing: slight positive tracking for headers.

### Colors (Dark Theme)
- **Background**: `#000000` (Absolute) -> `#1C1C1E` (Surface).
- **Primary Action**: `#32D74B` (Green) or `#0A84FF` (Blue).
- **Text**: `#E5E5EA` (Primary), `#8E8E93` (Secondary).
- **Error**: `#FF453A`.

## 4. Testing Protocol

1.  **Visual Regression**:
    *   Take screenshots of `HomeView` (Drawer Open vs Closed).
    *   Compare against Figma designs.
2.  **Performance**:
    *   Run "Perf Monitor" in Expo Go.
    *   Stress test: Send 50 messages rapidly to check list virtualization.
3.  **Environment**:
    *   Verify `GameEnvironment` renders correctly on different aspect ratios (iPhone SE vs iPhone 15 Pro Max).
