# Grump Animation Refinements v2.1
## Fixing the "Uncanny" Problem

---

## Part 1: Core Animation Principles (Currently Missing)

The current spec defines *what* moves but not *how* it should feel. These principles should govern ALL Grump animations:

### 1.1 The 12 Principles Applied to Grump

**Anticipation**
Every significant movement needs a wind-up:
- Eye roll: Eyes narrow slightly (50ms) before pupils begin rotation
- Blink: Eyebrows micro-lift 1pt (30ms) before eyelids descend
- Expression change: Brief "settle" into neutral (80ms) before transitioning to new expression
- Mouth open: Slight compression (squash) before expanding

```
WRONG:  [Neutral] → [Annoyed]  (instant snap)
RIGHT:  [Neutral] → [Micro-settle 80ms] → [Anticipation 60ms] → [Annoyed 200ms] → [Overshoot 40ms] → [Settle 100ms]
```

**Follow-Through & Overlapping Action**
Not everything stops at the same time:
- When expression changes: Eyebrows arrive first (lead), then eyes (primary), then mouth (follow)
- Stagger timing: Eyebrows 0ms, Eyes +40ms, Mouth +80ms, Glow +120ms
- After movement: Elements should "settle" with micro-oscillation (±0.5pt, 2-3 cycles, 150ms)

**Squash & Stretch**
The face should feel like it has mass:
- Blink: Eye whites compress vertically 15% as lids close, stretch 5% on open
- Surprise: Eyes stretch vertically 20%, compress horizontally 10%
- Heavy sigh: Entire face compresses 3% vertically, then slowly returns
- Impact (slam animation): Face squashes 5% on contact, bounces back

**Secondary Action**
Main action should trigger subtle secondary responses:
- Eye roll → Tech grid speeds up slightly (thinking harder about your nonsense)
- Deep frown → Mood glow pulses once (emotion spike)
- Surprised eyes → Eyebrows have slight independent wobble on settle
- Any mouth movement → Extremely subtle eye white deformation (face muscles connect)

### 1.2 Movement Hierarchy

**Problem:** Everything moving independently creates a "mask of floating parts" feeling.

**Solution:** Establish clear parent-child relationships with drag:

```
HIERARCHY:
Face Container (root)
├── Head Position (affects all children)
│   ├── Eyebrow Group (independent but influenced by head)
│   │   ├── Left Eyebrow
│   │   └── Right Eyebrow
│   ├── Eye Group
│   │   ├── Left Eye Assembly
│   │   │   ├── Eye White (deformable)
│   │   │   ├── Pupil (independent tracking + expression)
│   │   │   └── Eyelids (expression driven)
│   │   └── Right Eye Assembly (mirrored)
│   └── Mouth (expression driven)
├── Mood Glow (responds to expression, slight delay)
└── Accessories/Particles (physics-based, most delayed)
```

**Drag Values (how much children lag behind parent movement):**
- Eyebrows: 0.15 drag (move slightly after head)
- Eyes: 0.1 drag (almost immediate)
- Pupils: 0.25 drag (float slightly, more organic)
- Mouth: 0.2 drag
- Mood Glow: 0.4 drag (atmospheric, flows around)
- Accessories: 0.5 drag (physics objects)

---

## Part 2: Easing Curve Library

**Problem:** Linear or generic ease-in-out creates robotic movement.

### 2.1 Grump-Specific Curves

**grumpSnap** - For irritated, assertive movements
```
cubic-bezier(0.68, -0.1, 0.27, 1.2)
```
Quick start, slight overshoot, sharp settle. Use for: eyebrow furrows, annoyed blinks, message slams.

**grumpSettle** - For reluctant, heavy movements  
```
cubic-bezier(0.34, 0.8, 0.64, 1)
```
Slow acceleration, no overshoot, weighted landing. Use for: sighs, sleepy eyelids, giving up.

**grumpFloat** - For ambient/idle movements
```
cubic-bezier(0.45, 0.05, 0.55, 0.95)
```
Nearly linear but slightly softer. Use for: breathing, micro-movements, pupil drift.

**grumpBounce** - For rare positive reactions
```
cubic-bezier(0.175, 0.885, 0.32, 1.4)
```
Enthusiastic overshoot with bounce. Use for: impressed reaction, birthday hat, rare almost-smile.

**grumpMechanical** - For glitch/error states only
```
cubic-bezier(0.25, 0.1, 0.25, 1) with step(4) modifier
```
Intentionally slightly robotic. Use for: ERROR state, processing glitches.

### 2.2 Curve Application Map

| Animation Type | Curve | Duration Modifier |
|---------------|-------|-------------------|
| Blink down | grumpSnap | 0.8x |
| Blink up | grumpSettle | 1.2x |
| Eyebrow raise (annoyed) | grumpSnap | 1.0x |
| Eyebrow lower (settle) | grumpSettle | 1.5x |
| Pupil tracking | grumpFloat | continuous |
| Expression transition | grumpSettle | 1.0x |
| Eye roll | custom path (see below) | fixed 1000ms |
| Mouth shape change | grumpSettle | 0.7x |
| Glow pulse | grumpFloat | varies by mood |
| Particle spawn | grumpBounce | 1.0x |

---

## Part 3: Expression Transition System

**Problem:** Snapping between expressions breaks the illusion of a living character.

### 3.1 Transition Matrix

Not all expression changes should take the same path:

```
FROM → TO          TRANSITION TYPE       DURATION    SPECIAL BEHAVIOR
─────────────────────────────────────────────────────────────────────
Neutral → Any      Direct               200ms       Standard
Any → Neutral      Gradual settle       350ms       Slow return to baseline
Annoyed → Max      Escalation           150ms       Quick snap, building
Max → Neutral      Cool-down            600ms       Slow de-escalation, breathing
Skeptical ↔ Smug   Crossfade            180ms       Related expressions
Any → Soft         Gentle transition    400ms       No sudden movements
Soft → Any         Gradual              300ms       Respectful exit
Any → Error        Glitch-in            100ms       Intentionally jarring
Error → Any        Glitch-out           250ms       Shake-off, reboot feel
Any → Sleepy       Progressive          Per stage   See sleep system
Sleepy → Alert     Startle option       200ms       If interrupted
```

### 3.2 Transition Blending

For smooth expression changes, blend component states:

```javascript
// Pseudo-code for expression blending
function transitionExpression(from, to, progress, curve) {
  // Apply easing to progress
  const easedProgress = curve(progress);
  
  // Different components blend at different rates (overlapping action)
  const eyebrowProgress = curve(Math.min(1, progress * 1.3));      // Leads
  const eyeProgress = curve(progress);                              // Primary
  const mouthProgress = curve(Math.max(0, (progress - 0.1) / 0.9)); // Follows
  const glowProgress = curve(Math.max(0, (progress - 0.15) / 0.85)); // Most delayed
  
  return {
    eyebrows: lerp(from.eyebrows, to.eyebrows, eyebrowProgress),
    eyes: lerp(from.eyes, to.eyes, eyeProgress),
    mouth: lerp(from.mouth, to.mouth, mouthProgress),
    glow: lerp(from.glow, to.glow, glowProgress)
  };
}
```

### 3.3 The "Emotion Buffer" System

**Problem:** Rapid-fire triggers cause expression flickering.

**Solution:** Implement emotional inertia:

```
RULES:
1. Minimum expression hold time: 400ms (except ERROR)
2. Same expression re-trigger: Reset timer, intensify slightly (+5% on applicable values)
3. Conflicting emotion within buffer: Queue, don't interrupt
4. Escalating emotion (annoyed → max): Allow interrupt, faster transition
5. De-escalating: Always use full transition duration
```

---

## Part 4: Refined Component Behaviors

### 4.1 Eye System Overhaul

**Current Problem:** Eyes feel disconnected, robotic, or "googly."

**Fixes:**

**Pupil Movement Constraints:**
```
- Maximum velocity: 40pt/sec (prevents snapping)
- Acceleration curve: grumpFloat
- When changing direction: 30ms deceleration, 50ms acceleration
- Both pupils: Move together with 20ms stagger (left leads slightly)
- Convergence: Pupils angle slightly inward, not perfectly parallel tracks
```

**Eye White Deformation:**
```
- Pupils at edge: Eye white subtly bulges in that direction (2pt max)
- Blink: Vertical compression (mentioned above)
- Surprise: Whole eye scales, not just shape change
- Squint: Eye white compresses from bottom AND sides slightly
```

**Pupil Size Dynamics:**
```
Current: Discrete states (4pt shock, 12pt default, 16pt dilated)
Better:  Continuous with influence factors

BASE_SIZE = 12pt
FACTORS:
  + Light level simulation (±1pt, slow drift)
  + Emotional intensity (±2pt, expression-linked)
  + Focus/attention (±1.5pt, tracking something specific)
  + Rare "soul pupil" moments (+3pt, very brief, adds life)

TRANSITIONS:
  - Size changes: 200ms with grumpSettle curve
  - Never instant except ERROR state glitch
```

**Synchronized Blink Refinement:**
```
Current: Both eyes blink identically
Better:  Subtle asymmetry

- Lead eye closes 10ms earlier (randomize which eye per blink)
- Follower eye closes 10ms later
- Both open simultaneously (feels natural, hard to explain why)
- 5% of blinks: Slightly uneven (one eye 95% closed, other 100%)
- Blink speed variance: ±15% per blink (not metronomic)
```

### 4.2 Eyebrow System Overhaul

**Current Problem:** Eyebrows feel like floating rectangles, not connected to face.

**Fixes:**

**Shape Deformation:**
```
Add subtle flex to eyebrow shape, not just position/rotation:
- Raised: Slight upward arc (convex)
- Furrowed: Slight downward arc (concave)
- Inner raise: Thicker at inner edge (compression)
- Outer raise: Thicker at outer edge

Implementation: Bezier deformation, not just transforms
```

**Coupled Movement:**
```
Eyebrows should influence eyes slightly:
- Brow raise: Upper eyelids lift 2pt (skin pulls up)
- Brow furrow: Upper eyelids lower 1pt (skin pushes down)
- Asymmetric brow: Corresponding eye slightly more open/closed
```

**Micro-Expression Support:**
```
Between major states, allow micro-positions:
- "Thinking" flicker: 3pt lift, 100ms, settle
- "Processing" scrunch: Both in 2pt, hold during processing
- "Recognition" flash: Quick raise-lower, 150ms total
```

### 4.3 Mouth System Overhaul

**Current Problem:** Mouth shapes feel like stickers being swapped.

**Fixes:**

**Morph Targets Instead of Discrete Shapes:**
```
Define mouth as blend of 4 base parameters:
- Width: 20pt to 56pt (current)
- Height: 2pt to 24pt (current)  
- Curve: -1.0 (full frown) to +1.0 (full smile) [NEW]
- Asymmetry: -1.0 (left up) to +1.0 (right up) [NEW]

All 12 "shapes" become parameter combinations:
FLAT:         width=32, height=4, curve=0, asymmetry=0
FROWN_SLIGHT: width=30, height=4, curve=-0.3, asymmetry=0
SMIRK_LEFT:   width=34, height=5, curve=0.15, asymmetry=-0.6
etc.

BENEFIT: Can now interpolate between ANY shapes smoothly
```

**Mouth Elasticity:**
```
Add subtle "bounce" when changing shapes:
- Overshoot target by 8%
- Settle back over 80ms
- Feels like actual mouth muscles, not vector swap
```

**Corner Anchoring:**
```
Problem: Mouth feels like it floats
Solution: Define "corner points" that stay relatively fixed

- Mouth corners move less than center (40% of center movement)
- Creates stretching rather than sliding effect
- Corners have slight "pull" toward default position
```

---

## Part 5: Idle State Deep Dive

**Problem:** Idle looks either dead (too still) or twitchy (too much movement).

### 5.1 Layered Idle System

**Layer 1: Breathing (Always On)**
```
Current: Scale 0.98-1.02, 3.0s cycle
Refined:
- Primary breath: Face scale Y 0.99-1.01, 3.2s cycle
- Secondary breath: Face scale X 1.001-0.999, 3.2s cycle (inverse, slight)
- Eye whites: Scale 0.995-1.005, synced to primary (eyes "breathe" too)
- Eyebrows: Y position +0.5pt at inhale peak
- Mouth: Height +0.3pt at exhale (slight part)

CRUCIAL: Use sine easing, not linear. Breath should feel organic.
```

**Layer 2: Micro-Saccades (Subtle Eye Life)**
```
Current: Pupil drift ±2pt, 5s cycle, Perlin noise
Refined:
- Small saccades: ±0.8pt, every 200-600ms (random), instant movement
- Drift: ±1.5pt, 8-12s cycle, Perlin noise
- Refocus: Every 15-30s, both pupils shift 2-3pt, hold, return
- Blink correlation: Pupils often shift slightly after blink (natural)

This mimics how real eyes constantly make tiny adjustments.
```

**Layer 3: Attention Simulation**
```
Even when "idle," Grump should seem aware:
- Every 4-8s: Pupils briefly drift toward a "point of interest"
  - Text input area (if visible)
  - Last message
  - Random spot (10% chance, suspicious scan)
- Hold 500-1500ms, return to center
- Occasionally accompanied by micro-brow movement
```

**Layer 4: Attitude Maintenance**
```
Grump isn't neutral-idle, he's grump-idle:
- Default eyebrow position: 2pt lower than geometric neutral
- Default mouth: Slight downturn (curve: -0.15)
- Default eyelids: 8% closed (not wide-eyed alert)
- Occasional unprompted: Subtle sigh (every 45-90s of true idle)
```

### 5.2 Idle Variation by Context

**Fresh Session Idle:**
```
- More alert: Eyelids 5% closed (less sleepy)
- Slower blink rate: Every 4-6s (watchful)
- Breathing slightly faster: 2.8s cycle (anticipation)
```

**Extended Session Idle (15+ min):**
```
- Less alert: Eyelids 12% closed
- Normal blink rate: Every 3-5s
- Breathing normal: 3.2s cycle
- Occasional deeper sigh: Every 60s
```

**Post-Interaction Idle:**
```
- Brief "reset" period: 2s of minimal movement
- Then gradual return to standard idle
- Pupils return to center over 800ms (not instant snap)
```

---

## Part 6: Timing Refinements

### 6.1 Frame-Perfect Animation Specs

**Blink Timing (Refined):**
```
Standard Blink (180ms total, was 150ms):
  0-40ms:    Eyelids begin descent, accelerating
  40-70ms:   Eyelids at 80% closed, max velocity
  70-90ms:   Fully closed, brief hold (THE HOLD IS CRUCIAL)
  90-130ms:  Eyelids open, decelerating  
  130-180ms: Settle to open position, micro-bounce

The 20ms hold at closed prevents "flutter" feeling.
```

**Eye Roll Timing (1000ms, refined path):**
```
0-80ms:     Anticipation - eyes narrow 10%, pupils drift to center
80-200ms:   Pupils move up (both eyes converge slightly)
200-450ms:  Pupils arc outward and down (the actual "roll")
450-650ms:  Pupils continue arc, moving inward and up
650-850ms:  Pupils return to forward, settling
850-1000ms: Eyes relax, tiny bounce settle

PATH: Not circular. More of a "figure 8" that's been squashed.
This feels more natural - real eye rolls aren't perfect circles.
```

**Expression Change Timing:**
```
Component stagger for ANY expression change:
  T+0ms:     Eyebrows begin (fastest responders)
  T+30ms:    Eyelids begin 
  T+50ms:    Eye whites begin deformation
  T+60ms:    Pupils begin size/position change
  T+80ms:    Mouth begins
  T+100ms:   Mood glow begins transition

Total expression change: 250-400ms depending on complexity
Never less than 200ms (feels jarring)
Never more than 500ms (feels sluggish, except sleepy transitions)
```

### 6.2 Response to Input Timing

**User Starts Typing:**
```
0ms:        Detect keystroke
0-50ms:     Pupil focus (shift toward input area ~3pt)
50-150ms:   Eyebrows raise 4pt (attention)
150-250ms:  Transition to LISTENING expression
250ms+:     Pupil tracking active (follows text growth)
```

**User Stops Typing (1s delay):**
```
0ms:        Detect pause
0-300ms:    Hold current state (they might continue)
300-500ms:  If still paused, eyebrows relax slightly
500-800ms:  Expression softens toward neutral-attentive
800ms+:     If >3s pause, subtle "waiting" behaviors
            - Slow blink
            - Pupils drift slightly
            - But maintain attention posture
```

**User Sends Message:**
```
0ms:        Message sent
0-100ms:    Brief "intake" - eyes widen 5%, brows up 2pt
100-300ms:  Transition to PROCESSING
300ms+:     Processing behaviors until response ready
```

---

## Part 7: Problem-Specific Fixes

### 7.1 "Floating Face" Problem

**Symptom:** Face elements feel disconnected from each other.

**Fixes:**
1. Add subtle "face container" movement that all elements inherit
2. When any feature moves significantly, container tilts 0.3-0.8° toward it
3. Mood glow should feel like it emanates FROM the face, not surrounds it separately
   - Glow origin point: Behind face, not centered on canvas
   - Glow should subtly track face position (with heavy drag)

### 7.2 "Uncanny Valley" Problem

**Symptom:** Animations feel creepy or unsettling.

**Fixes:**
1. Reduce symmetry in all idle animations
   - Left and right features should NEVER be perfectly mirrored
   - 5-10% variance in position, timing, scale
2. Add imperfection to movements
   - Occasional micro-hesitation (30ms pause mid-movement, 3% chance)
   - Occasional incomplete movement (95% of target, 5% chance)
3. Never have eyes perfectly track cursor/text
   - Add 1-2pt random offset
   - Add 50-100ms variable lag
4. Avoid metronomic timing
   - All timers should have ±15% variance

### 7.3 "Hyperactive" Problem

**Symptom:** Too much movement, feels anxious or broken.

**Fixes:**
1. Implement movement budgeting
   - Track "total movement" across all components
   - If exceeds threshold, dampen new movements
   - Max 3 components moving significantly simultaneously
2. Add rest periods
   - After any significant animation, 400ms minimum of reduced activity
   - Micro-movements pause briefly after expressions
3. Prioritize movements
   - Expression changes suppress idle movements
   - Tracking suppresses random pupil drift
   - User-triggered > System-triggered > Ambient

### 7.4 "Dead Eyes" Problem

**Symptom:** Eyes feel lifeless, glassy.

**Fixes:**
1. Pupil size should ALWAYS be subtly changing (±0.5pt, slow drift)
2. Add specular highlight to eyes (small white dot, moves opposite to pupil)
3. Eye whites should have very subtle color temperature shift
   - Warmer (creamier) when friendly expressions
   - Cooler (bluer) when annoyed/skeptical
4. Eyelids should never be at exactly 0% or 100% (except blinks)
   - Minimum "resting" closure: 3%
   - Maximum alert opening: 97%

### 7.5 "Pose Snapping" Problem

**Symptom:** Character appears to teleport between poses.

**Fixes:**
1. Every parameter change must have minimum 80ms transition
2. Implement pose queuing with blending
   - If new pose requested during transition, blend from current interpolated state
   - Never snap to start of new animation
3. Add "momentum" to all movements
   - Objects in motion want to continue slightly
   - Arriving at target should have deceleration, not stop

---

## Part 8: Performance-Aware Simplification

For lower-end devices, reduce in this priority:

**Level 1 (Remove First):**
- Particle effects
- Tech grid animation
- Glow blur (use solid with opacity)
- Micro-movements on accessories

**Level 2:**
- Reduce micro-saccade frequency by 50%
- Simplify breathing (scale only, no component offsets)
- Reduce blink variants (standard only)

**Level 3:**
- Reduce expression transition steps
- Remove eye white deformation
- Disable pupil tracking (snap to expression defaults)

**Level 4 (Minimum Viable Animation):**
- Expressions: instant swap (no transition)
- Blink: simple opacity fade
- Breathing: disabled
- Pupils: fixed per expression

---

## Part 9: Testing Checklist

Before shipping any animation changes, verify:

**Idle State (30 seconds):**
- [ ] Does NOT look frozen at any point
- [ ] Does NOT look twitchy/anxious
- [ ] Breathing is visible but subtle
- [ ] Blinks feel natural, not metronomic
- [ ] Left/right asymmetry present

**Expression Transitions:**
- [ ] No component "snaps" to new position
- [ ] Eyebrows lead, mouth follows (stagger visible)
- [ ] Glow transitions feel smooth
- [ ] Rapid trigger changes don't cause flicker
- [ ] Return to neutral is slower than leaving it

**Eye Behavior:**
- [ ] Pupils don't feel "googly" or disconnected
- [ ] Tracking doesn't feel creepy (has lag/offset)
- [ ] Blinks include proper eye white compression
- [ ] Eyes maintain "grumpy" character even in neutral

**Timing Feel:**
- [ ] Nothing feels too slow (>500ms for standard actions)
- [ ] Nothing feels too fast (<80ms except micro-movements)
- [ ] Pauses exist between major animations
- [ ] Overall feel is "weighted" not "floaty"

**Edge Cases:**
- [ ] Rapid user input doesn't break state machine
- [ ] Extended idle (2+ min) doesn't drift into weirdness  
- [ ] Recovery from ERROR state feels natural
- [ ] Sleep → Wake transition isn't jarring

---

## Appendix: Quick Reference Values

**Standard Durations:**
- Micro-movement: 50-150ms
- Blink: 180ms
- Expression change: 250-350ms
- Major animation (eye roll): 800-1200ms
- State transition: 300-500ms

**Standard Easing:**
- Snap/assertive: cubic-bezier(0.68, -0.1, 0.27, 1.2)
- Settle/reluctant: cubic-bezier(0.34, 0.8, 0.64, 1)
- Ambient/float: cubic-bezier(0.45, 0.05, 0.55, 0.95)
- Bounce/positive: cubic-bezier(0.175, 0.885, 0.32, 1.4)

**Component Stagger:**
- Eyebrows: +0ms (lead)
- Eyelids: +30ms
- Eye whites: +50ms
- Pupils: +60ms
- Mouth: +80ms
- Glow: +100ms

**Maximum Concurrent Movement:**
- Major movements: 2 components
- Minor movements: 4 components
- Micro-movements: unlimited (they're subtle enough)

**Rest Periods:**
- Post-expression: 400ms minimum
- Post-major-animation: 600ms minimum
- Post-interaction: 200ms before idle resumes
