# Phase 1: Mobile App Parity (Grump 2.0 Migration)

**Goal**: Bring the mobile app's visual identity in line with the new Web design by replacing the "Minimal" face with the full-featured Grump 2.0 rig (including arms, hands, and advanced mood states).

1. **Create** **`mobile/components/Grump2.tsx`**

   * **Structure**: Implement the full face hierarchy using `View` and `react-native-svg` (Face container, Eyes, Eyebrows, Mouth, Nose, Arms, Hands).

   * **Styling**: Port the CSS variables from `Grump2.css` into React Native `StyleSheet` definitions.

   * **Animation**: Use React Native's `Animated` API to replicate the "idle" animations (breathing, blinking, floating) and "mood" transitions (color shifts, eyebrow rotation).

   * **Props**: Support the same props as the web version (`size`, `mood`, etc.).

2. **Integrate Grump 2.0 into Mobile Views**

   * **`ChatView.tsx`**: Replace `<MinimalGrumpFace />` with `<Grump2 />`. Update logic to pass the correct mood state (e.g., 'typing', 'annoyed', 'neutral') to the new component.

   * **`OnboardingView.tsx`**: Replace the legacy avatar with `<Grump2 />`.

3. **Cleanup Legacy Mobile Code**

   * Delete `mobile/components/MinimalGrumpFace.tsx` once the replacement is verified.

# Phase 2: Web Feature Polish

**Goal**: Ensure the "Game Dev Workspace" feature is functional (or at least gracefully mocked) and verify backend connections.

1. **Audit** **`GameDevWorkspace.tsx`**

   * Review the `handleCompile` function.

   * If the backend route `/api/game/compile` does not exist (which my search suggests it doesn't), I will implement a client-side mock or a clear "Not Implemented" state to prevent runtime errors during the demo.

2. **Verify Chat Intelligence**

   * Review `ChatStore` to ensure it handles message states gracefully, even if the backend LLM isn't fully wired up yet.

# Phase 3: Deployment Verification

1. **Sync to Git**: Ensure all mobile changes are committed and pushed.
2. **Build Check**: Verify that the changes don't break the Expo build process.

