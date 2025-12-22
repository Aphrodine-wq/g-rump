# UI/UX Redesign & Game Integration Plan

## 1. Visual Design: The "White Minimalism" Standard
**Goal:** Shift from the current dark/mixed aesthetic to a pristine, Apple Arcade-quality white minimalist design.
- **Palette**: Pure White (`#FFFFFF`) backgrounds, Off-White (`#F5F5F7`) for secondary surfaces. Text will be varying shades of Slate (`#1E293B` to `#94A3B8`).
- **No Borders**: Remove all `border-` classes. Replace definition with layered shadows:
  - *Layer 1*: `shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
  - *Layer 2*: `shadow-xl` (0 20px 25px rgba(0,0,0,0.05)) for floating elements.
- **Typography**: San Francisco / Inter. Tight tracking, heavy headings, readable body.
- **Transparency**: REMOVED. Solid backgrounds with blur only on overlay modals (if strictly necessary), but preferring solid sheets.

## 2. Animation: 120fps "Liquid" Motion
**Goal:** Ensure every pixel moves with physics-based intent.
- **Web (Framer Motion)**:
  - Replace CSS transitions with `framer-motion` springs.
  - **Page Transitions**: `AnimatePresence` with "push" effects (slide over) instead of fades.
  - **Micro-interactions**: Buttons scale down (`scale: 0.95`) on press.
- **Engine Optimization (`Grump2.js`)**:
  - Refactor `tween` engine to use `performance.now()` delta-time exclusively to ensure 120hz monitor support.
  - decouple logic rate (60hz) from render rate (monitor hz).

## 3. Game Design: Deep Integration
**Goal:** Make "Grump" more than a chatbot; make him a Tamagotchi-style game.
- **Bridge**: Create `useGrumpEngine` hook to sync vanilla JS state (`mood`, `energy`) to React.
- **New Features**:
  - **Annoyance Meter**: Visual gauge of Grump's patience.
  - **XP System**: Earn "Patience Points" by calming him down or "Chaos Points" by annoying him.
  - **Unlockables**: Spend points to unlock new backgrounds (White, Off-White, Eggshell - *very minimalist jokes*) or accessories.
- **Interactions**:
  - *Poke*: Click to annoy.
  - *Soothe*: Smooth gestures to calm.

## 4. Mobile: iOS Native Feel
- **Expo/React Native**:
  - Update `_layout.tsx` to White theme.
  - Use `react-native-reanimated` for shared element transitions.
  - Implement Haptics (via `expo-haptics`) for every interaction (Poke = Heavy, Type = Light).

## Execution Steps
1.  **Configure Tailwind**: Setup the "White Minimalism" design tokens.
2.  **Refactor Web App**: Apply new design to `App.tsx`, `ChatInterface`, and `LandingPage`.
3.  **Upgrade Engine**: Optimize `Grump2.js` for 120fps and add Event Bridge.
4.  **Implement Game Loop**: Add XP/Unlock UI.
5.  **Polish Mobile**: Apply design parity to `mobile/`.
