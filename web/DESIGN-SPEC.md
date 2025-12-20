# Grump Web Client - Design Specification
## Version: 2.0 - Enhanced UI/UX

---

## 🎨 Design Philosophy

**Core Principle:** Grump is not a chat interface with a character. **Grump IS the interface.**

The design should feel:
- **Theatrical** - Every interaction has weight and presence
- **Alive** - Grump exists whether you're typing or not
- **Premium** - Polished, modern, but with personality
- **Dark & Moody** - Matches Grump's cranky aesthetic
- **Focused** - Nothing distracts from the conversation

---

## 📐 Layout Structure

### Overall Container
```
┌─────────────────────────────────────────┐
│  NAVIGATION BAR (Fixed Top)             │  ← 56px height
├─────────────────────────────────────────┤
│                                         │
│  AVATAR SECTION (Fixed)                 │  ← 180px height
│  ┌──────────────┐                       │
│  │   GRUMP'S    │                       │
│  │     FACE     │                       │
│  │  (120x120px) │                       │
│  └──────────────┘                       │
│  "What do you want."                    │
├─────────────────────────────────────────┤
│                                         │
│  MESSAGES AREA (Scrollable)             │  ← Flex: 1 (takes remaining space)
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │  [User messages align right]    │   │
│  │  [Grump messages align left]    │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  INPUT BAR (Fixed Bottom)               │  ← 80px height
│  [Text Input] [Send Button]             │
├─────────────────────────────────────────┤
│  TAB BAR (Fixed Bottom)                 │  ← 60px height
│  [Chat] [History] [Settings]            │
└─────────────────────────────────────────┘
```

### Key Measurements
- **Viewport:** 100vw × 100vh (full screen)
- **Navigation Bar:** 56px height
- **Avatar Section:** 180px height (includes padding)
- **Input Bar:** 80px height (includes padding)
- **Tab Bar:** 60px height
- **Messages Area:** Flex: 1 (fills remaining space)

---

## 🎨 Color Palette

### Primary Colors
```css
--grump-bg: #0A0A0A;              /* Deep black background */
--grump-surface: #1A1A1A;         /* Elevated surfaces (cards, inputs) */
--grump-surface-elevated: #252525; /* Hover states, active items */
--grump-border: #2A2A2A;          /* Subtle borders (was #333) */
--grump-border-light: #3A3A3A;    /* Hover borders */
```

### Accent Colors
```css
--grump-accent: #FF6B6B;          /* Primary accent (Grump's signature red) */
--grump-accent-hover: #FF5252;    /* Hover state */
--grump-accent-active: #FF4444;   /* Active/pressed state */
--grump-accent-glow: rgba(255, 107, 107, 0.2); /* Glow effects */
```

### Text Colors
```css
--grump-text-primary: #F5F5F5;    /* Main text (was #E0E0E0 - brighter) */
--grump-text-secondary: #9E9E9E;  /* Secondary text (was #888 - brighter) */
--grump-text-tertiary: #6E6E6E;   /* Disabled/placeholder text */
```

### Message Bubbles
```css
--grump-user-bubble: #2A2A2A;     /* User message background */
--grump-user-bubble-border: #3A3A3A; /* User message border */
--grump-grump-bubble: #1A1A1A;    /* Grump message background */
--grump-grump-bubble-border: rgba(255, 107, 107, 0.3); /* Grump message border */
```

### Status Colors
```css
--grump-success: #4CAF50;
--grump-error: #FF4444;
--grump-warning: #FF9800;
```

---

## 📱 Component Specifications

### 1. Navigation Bar
**Location:** Fixed top, z-index: 1000
**Height:** 56px
**Background:** `var(--grump-surface)`
**Border:** Bottom border `1px solid var(--grump-border)`
**Padding:** `16px 24px` (horizontal), `12px` (vertical)

**Content:**
- Left: Title "Chat with Grump" (18px, font-weight: 600)
- Right: "New" button (text button, accent color)

**Styling:**
```css
.nav-bar {
  height: 56px;
  padding: 12px 24px;
  background: var(--grump-surface);
  border-bottom: 1px solid var(--grump-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(26, 26, 26, 0.95);
}
```

---

### 2. Avatar Section
**Location:** Below nav bar, fixed position
**Height:** 180px total (includes padding)
**Padding:** `24px 16px`
**Background:** `var(--grump-bg)` with subtle gradient

**Layout:**
```
┌─────────────────────────────┐
│      [Padding: 24px top]     │
│                             │
│    ┌──────────────┐         │
│    │              │         │
│    │  GRUMP FACE  │ 120px   │
│    │  (animated)  │         │
│    │              │         │
│    └──────────────┘         │
│                             │
│  "What do you want."        │  ← 14px font, secondary color
│      [8px margin top]       │
│                             │
│      [Padding: 24px bottom] │
└─────────────────────────────┘
```

**Styling:**
```css
.avatar-section {
  height: 180px;
  padding: 24px 16px;
  background: linear-gradient(to bottom, 
    var(--grump-bg) 0%, 
    rgba(10, 10, 10, 0.98) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid var(--grump-border);
}

.avatar-container {
  width: 120px;
  height: 120px;
  position: relative;
}

.status-text {
  font-size: 14px;
  color: var(--grump-text-secondary);
  margin-top: 12px;
  font-weight: 400;
  letter-spacing: 0.3px;
}
```

---

### 3. Messages Container
**Location:** Between avatar and input bar
**Layout:** Flex: 1 (fills remaining space)
**Padding:** `20px 24px` (more generous)
**Gap:** `16px` between messages

**Message Bubble Specifications:**

**User Messages (Right-aligned):**
- Max width: 70% (was 75%)
- Background: `var(--grump-user-bubble)`
- Border: `1px solid var(--grump-user-bubble-border)`
- Border radius: `20px 20px 4px 20px` (tail on right)
- Padding: `14px 18px`
- Font size: `15px`
- Line height: `1.5`
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.3)`

**Grump Messages (Left-aligned):**
- Max width: 75%
- Background: `var(--grump-grump-bubble)`
- Border: `1px solid var(--grump-grump-bubble-border)`
- Border radius: `20px 20px 20px 4px` (tail on left)
- Padding: `14px 18px`
- Font size: `15px`
- Line height: `1.5`
- Shadow: `0 2px 8px rgba(255, 107, 107, 0.1)`
- Accent glow on hover

**Empty State:**
- Centered vertically and horizontally
- Font size: `16px`
- Color: `var(--grump-text-secondary)`
- Icon or illustration (optional)

**Styling:**
```css
.messages-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 24px;
  background: var(--grump-bg);
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 100%;
}

.user-message {
  align-self: flex-end;
  max-width: 70%;
  background: var(--grump-user-bubble);
  border: 1px solid var(--grump-user-bubble-border);
  border-radius: 20px 20px 4px 20px;
  padding: 14px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.grump-message {
  align-self: flex-start;
  max-width: 75%;
  background: var(--grump-grump-bubble);
  border: 1px solid var(--grump-grump-bubble-border);
  border-radius: 20px 20px 20px 4px;
  padding: 14px 18px;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.1);
  transition: all 0.2s;
}

.grump-message:hover {
  border-color: rgba(255, 107, 107, 0.5);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
}
```

---

### 4. Input Bar
**Location:** Fixed above tab bar
**Height:** 80px (includes padding)
**Padding:** `16px 24px`
**Background:** `var(--grump-surface)` with blur
**Border:** Top border `1px solid var(--grump-border)`
**Shadow:** Top shadow for elevation

**Layout:**
```
┌─────────────────────────────────────┐
│  [16px padding]                     │
│  ┌──────────────────┐  ┌──────┐   │
│  │  Text Input      │  │ Send │   │
│  │  (rounded)       │  │ (●)  │   │
│  └──────────────────┘  └──────┘   │
│  [16px padding]                     │
└─────────────────────────────────────┘
```

**Input Field:**
- Flex: 1 (takes available space)
- Height: `48px`
- Border radius: `24px`
- Padding: `12px 20px`
- Font size: `15px`
- Background: `var(--grump-surface)`
- Border: `1px solid var(--grump-border)`
- Focus border: `2px solid var(--grump-accent)`

**Send Button:**
- Size: `48px × 48px`
- Border radius: `50%` (circle)
- Background: `var(--grump-accent)`
- Icon: Arrow up (↑) or send icon
- Hover: Scale 1.05, darker accent
- Active: Scale 0.95

**Styling:**
```css
.input-bar {
  height: 80px;
  padding: 16px 24px;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--grump-border);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  height: 48px;
  padding: 12px 20px;
  background: var(--grump-surface);
  border: 1px solid var(--grump-border);
  border-radius: 24px;
  color: var(--grump-text-primary);
  font-size: 15px;
  transition: all 0.2s;
}

.input-field:focus {
  border: 2px solid var(--grump-accent);
  outline: none;
  box-shadow: 0 0 0 4px var(--grump-accent-glow);
}

.send-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--grump-accent);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background: var(--grump-accent-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}
```

---

### 5. Tab Bar
**Location:** Fixed bottom
**Height:** 60px
**Background:** `var(--grump-surface)` with blur
**Border:** Top border `1px solid var(--grump-border)`
**Shadow:** Top shadow

**Layout:**
```
┌─────────────────────────────────────┐
│  [Chat]  [History]  [Settings]     │
│    💬       📚         ⚙️          │
└─────────────────────────────────────┘
```

**Tab Item:**
- Flex: 1 (equal width)
- Padding: `8px 16px`
- Gap: `6px` (icon to text)
- Icon size: `24px`
- Text size: `12px`
- Active color: `var(--grump-accent)`
- Inactive color: `var(--grump-text-secondary)`

**Styling:**
```css
.tab-bar {
  height: 60px;
  padding: 8px 0;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--grump-border);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-shrink: 0;
  z-index: 1000;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: none;
  border: none;
  color: var(--grump-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-item.active {
  color: var(--grump-accent);
}

.tab-item:hover:not(.active) {
  color: var(--grump-text-primary);
}
```

---

## 🎭 Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
  'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Font Sizes
- **Navigation Title:** 18px, weight: 600
- **Status Text:** 14px, weight: 400
- **Message Content:** 15px, weight: 400, line-height: 1.5
- **Input Text:** 15px, weight: 400
- **Tab Labels:** 12px, weight: 400
- **Timestamps:** 11px, weight: 400

### Letter Spacing
- **Status Text:** 0.3px
- **Navigation:** 0.2px
- **Default:** 0px

---

## ✨ Animations & Transitions

### Message Entry
- **User messages:** Slide in from right, fade in
- **Grump messages:** "Slam" animation (scale 0.8 → 1.0, bounce)
- **Duration:** 0.3s
- **Easing:** cubic-bezier(0.34, 1.56, 0.64, 1)

### Button Interactions
- **Hover:** Scale 1.05, 0.2s ease
- **Active:** Scale 0.95, 0.1s ease
- **Focus:** Glow effect, 0.2s ease

### Avatar Breathing
- **Duration:** 3s cycle
- **Scale:** 1.0 → 1.02 → 1.0
- **Easing:** ease-in-out

### Scrollbar
- **Width:** 6px
- **Track:** Transparent
- **Thumb:** `var(--grump-border)`
- **Hover:** `var(--grump-text-secondary)`

---

## 📐 Spacing System

### Padding Scale
- **XS:** 4px
- **SM:** 8px
- **MD:** 12px
- **LG:** 16px
- **XL:** 20px
- **2XL:** 24px
- **3XL:** 32px

### Gap Scale
- **XS:** 4px
- **SM:** 8px
- **MD:** 12px
- **LG:** 16px
- **XL:** 20px

### Border Radius
- **Small:** 8px
- **Medium:** 12px
- **Large:** 20px
- **Pill:** 24px
- **Circle:** 50%

---

## 🎯 Responsive Design

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Adjustments
- Reduce padding: `16px` → `12px`
- Reduce avatar size: `120px` → `100px`
- Reduce message max-width: `70%` → `85%`
- Tab bar icons only (hide text labels)

---

## 🔍 Accessibility

### Focus States
- All interactive elements have visible focus indicators
- Focus ring: `2px solid var(--grump-accent)` with `4px` offset
- Focus ring color: `var(--grump-accent-glow)`

### Contrast Ratios
- Text on background: Minimum 4.5:1
- Text on accent: Minimum 4.5:1
- Interactive elements: Minimum 3:1

### Keyboard Navigation
- Tab order: Logical flow
- Enter/Space: Activate buttons
- Escape: Close modals/overlays

---

## 🎨 Visual Enhancements

### Shadows
```css
/* Elevation levels */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 4px 12px rgba(255, 107, 107, 0.3);
```

### Backdrop Blur
- Navigation bar: `blur(10px)`
- Input bar: `blur(10px)`
- Tab bar: `blur(10px)`

### Gradients
- Avatar section: Subtle gradient from `var(--grump-bg)` to transparent
- Message bubbles: Subtle inner shadow for depth

---

## 📋 Implementation Checklist

### Phase 1: Core Layout
- [ ] Update color variables in `index.css`
- [ ] Fix navigation bar height and styling
- [ ] Improve avatar section spacing
- [ ] Enhance message bubble design
- [ ] Polish input bar
- [ ] Update tab bar styling

### Phase 2: Animations
- [ ] Add message entry animations
- [ ] Enhance button interactions
- [ ] Improve scrollbar styling
- [ ] Add hover effects

### Phase 3: Polish
- [ ] Add backdrop blur effects
- [ ] Implement shadow system
- [ ] Improve typography
- [ ] Add focus states
- [ ] Test responsive design

---

## 🎯 Design Goals

1. **Premium Feel** - Every pixel matters
2. **Personality** - Grump's character shines through
3. **Clarity** - Nothing is confusing
4. **Performance** - Smooth 60fps animations
5. **Accessibility** - Works for everyone

---

**"Fine. I look better now. Happy?"** — Grump

