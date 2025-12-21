# GRUMP: Animation Knowledge Base

This document contains the deep knowledge Grump draws from. Not trivia—working intelligence.

---

## 1. Perception & Motion Science

### How Humans See Movement

**Persistence of Vision**
- The eye retains an image for ~1/25th of a second
- Below 12fps, motion is perceived as discrete images
- 12fps: minimum for motion perception
- 24fps: standard "smooth" (film)
- 30fps: broadcast/game standard
- 60fps: "hyper-real," shows flaws mercilessly

**Saccadic Movement**
- Eyes don't track smoothly—they jump and fixate
- Viewers fixate on: eyes first, then hands, then center of mass
- Silhouette is processed before detail (peripheral vision)
- High-contrast areas pull focus involuntarily

**Motion Blur Perception**
- Real motion blur occurs in the eye AND on film
- Absence of blur at high speed reads as "strobey" or "video game-y"
- Stylized animation often omits blur intentionally—the brain fills in
- Smear frames are blur translated to drawing

**Practical Application**
- If it won't read in silhouette, fix the pose first
- Eyes and hands need the cleanest arcs—that's where viewers look
- Fast actions need fewer frames with more spacing, not more frames
- Test animations at intended viewing size, not zoomed in

---

## 2. The 12 Principles (Actually Understood)

Not what they ARE—why they EXIST and when to break them.

### Squash & Stretch
**Why it exists:** Maintains volume while showing impact and flexibility. Tells the eye "this is alive, not rigid."
**The math:** Volume should stay constant. Stretch vertically = compress horizontally.
**When to break it:** Rigid objects (robots, armor). Stylized work where graphic clarity > physics.
**Common failure:** Applying it to things that shouldn't squash (skulls, weapons).

### Anticipation
**Why it exists:** Prepares the viewer for action. Without it, motion appears to teleport.
**The hierarchy:** Bigger action = bigger anticipation. A blink needs none. A jump needs a crouch.
**When to break it:** Surprise moments. Comedy (removing anticipation IS the joke). Snappy stylized work.
**Common failure:** Equal anticipation for all actions. Anticipation that's too slow, killing momentum.

### Staging
**Why it exists:** Clarity. One idea per moment. The viewer should never wonder what to look at.
**The test:** Squint. Silhouette only. Is the action readable?
**When to break it:** Intentional chaos. Crowd scenes. But even then, there's usually a focal point.
**Common failure:** Competing actions. Hands doing something interesting while the face does something else.

### Straight Ahead vs. Pose to Pose
**Straight ahead:** Draw frame 1, then 2, then 3. Fluid, organic, unpredictable. Good for: effects, chaos, creatures.
**Pose to pose:** Key poses first, breakdowns second, inbetweens last. Controlled, precise. Good for: acting, choreography.
**Reality:** Most work is hybrid. Block pose-to-pose, then go straight ahead for overlap and secondary.
**Common failure:** Pure pose-to-pose without breakdowns = robotic interpolation. Pure straight ahead = uncontrolled mess.

### Follow-Through & Overlapping Action
**Why it exists:** Nothing stops all at once. Different masses have different momentums.
**The hierarchy:** Heavy/loose = more drag. Light/stiff = less drag. Root leads, extremities follow.
**Overlap:** Not everything moves on the same frame. Offset your keys.
**Common failure:** Everything hitting poses simultaneously (twinning in time). Overlap that's too uniform.

### Slow In & Slow Out (Easing)
**Why it exists:** Real objects accelerate and decelerate. Linear motion looks mechanical.
**The curve:** Ease out of poses (slow start). Ease into poses (slow stop). Fast in the middle.
**When to break it:** Mechanical objects. Deliberate robotic feel. Extremely snappy styles.
**Common failure:** Over-easing (mushy, no punch). Under-easing (poppy, mechanical). Same ease on everything.

### Arcs
**Why it exists:** Organic motion follows curves. Joints rotate; they don't translate linearly.
**The rule:** Almost everything moves in arcs. Even a "straight" punch has arc in the shoulder/elbow.
**When to break it:** Mechanical pistons. Intentional robotic movement.
**Common failure:** Wrists and heads that move in straight lines between keys. IK solve pops.

### Secondary Action
**Why it exists:** Adds richness without distracting from primary action.
**The rule:** Must support, not compete. Hair moving during a walk = good. Hair doing a dance = competing.
**When to omit:** When primary action needs full focus. Fast actions. Limited animation styles.
**Common failure:** Secondary action that steals focus. No secondary action (feels dead).

### Timing
**Why it exists:** Timing IS emotion. Same poses, different timing = completely different feeling.
**The numbers:**
- 1-2 frames: instant, pop, shock
- 3-6 frames: fast, snappy, energetic
- 8-12 frames: natural, conversational
- 16-24 frames: slow, heavy, dramatic
- 24+ frames: very slow, labored, exhausted
**Common failure:** Even timing (everything same speed). Not matching timing to weight/emotion.

### Exaggeration
**Why it exists:** Reality is boring. Camera flattens. Animation must push to read.
**The spectrum:** Realistic → Heightened → Stylized → Cartoony
**The rule:** Push it until it breaks, then pull back 10%.
**Common failure:** Under-exaggeration (reads as stiff). Over-exaggeration for the style (reads as cartoon in realistic piece).

### Solid Drawing / Solid Posing
**Why it exists:** Forms must feel 3D even in 2D. Weight, volume, balance.
**The test:** Could this pose exist in 3D space? Does it have weight?
**The cheat:** Use perspective, foreshortening, overlap to sell depth.
**Common failure:** Flat poses. Twins (symmetry). Poses that couldn't balance in reality.

### Appeal
**Why it exists:** The audience must want to watch. Not "pretty"—magnetic.
**The truth:** Appeal is clarity + intention + personality. A villain can have appeal.
**The test:** Is there a clear idea? Does the character have a point of view?
**Common failure:** Generic. Safe. No specificity. Trying to please everyone.

---

## 3. Physics for Animators

### Center of Mass
**Location:** Roughly at the hips/pelvis for humanoids. Shifts with pose.
**The rule:** Center of mass must be supported or the character is falling.
**Walking:** Center of mass falls forward, legs catch it. Walking is controlled falling.
**Jumping:** Center of mass follows a parabola. The body rotates around it.

### Force & Momentum
**Initiation:** Force originates somewhere. A punch starts in the feet/hips, transfers up.
**Conservation:** Momentum doesn't disappear. A heavy character can't stop instantly.
**Transfer:** When force transfers (hit reaction), it enters at contact point, propagates through body.

### Weight Indicators
- **Heavy:** Slow acceleration, slow deceleration, anticipation before movement, settle after
- **Light:** Fast acceleration, fast deceleration, less anticipation needed
- **The cheat:** Timing and spacing sell weight more than anything else

### Gravity (Real vs. Animated)
**Real gravity:** 9.8m/s². Objects accelerate at same rate regardless of mass.
**Animated gravity:** We cheat constantly.
- Hang time at apex (longer than physics allows)
- Faster falls than rises (feels more dynamic)
- Variable gravity for comedy (Wile E. Coyote pause)

**Jump arc breakdown:**
- Rise: decelerating (ease out)
- Apex: near-stop, hang time (1-3 frames)
- Fall: accelerating (ease in), often faster than rise
- Land: compression, settle

### Cloth & Hair Physics
**Drag:** Loose materials trail behind motion
**Wave propagation:** Motion ripples from root to tip
**Settle:** Oscillation that diminishes over time
**The hierarchy:** Body leads → attachment point follows → material drags → tip is last

---

## 4. Acting Through Motion

### Intention Before Action
Every movement has a thought before it. The sequence:
1. Thought (internal—sometimes shown in eyes/face)
2. Decision (micro-beat)
3. Anticipation (body prepares)
4. Action (movement)
5. Reaction (settle, follow-through)

**Skipping steps:** Removes humanity. Feels robotic or unmotivated.

### Subtext in Motion
Same action, different intention:

**Picking up a cup:**
- Thirsty: direct, efficient, fast
- Nervous: hesitant, adjusting grip, checking
- Angry: sharp, tension in fingers, controlled force
- Exhausted: slow, heavy, minimal effort
- Suspicious: eyes first, then slow reach

**The key:** It's not WHAT they do, it's HOW they do it.

### Eye Direction
- Eyes lead the body by 2-4 frames
- Eyes hit the target before the head turns
- Blinks often accompany eye direction changes
- Blink on thought changes, not randomly
- Dead eyes = dead character (keep micro-movements)

### Breath
- Chest expansion/contraction is constant in living things
- Breath rate indicates state: fast = exertion/panic, slow = calm/exhaustion
- Breath is secondary action that costs almost nothing and adds life
- Hold breath = tension. Release = relief.

### Status & Power
**High status:** Slow, deliberate, takes up space, minimal movement, lets others wait
**Low status:** Fast, nervous, contracts, accommodates others, fills silence
**Shift in status:** Tempo and space usage change mid-scene

---

## 5. Systematic Critique Framework

### The Diagnosis Order

When something looks "off," check in this order:

1. **Silhouette** — Is the pose readable in black fill?
2. **Timing** — Is it too fast/slow for the action and weight?
3. **Spacing** — Are the intervals between frames correct for the easing?
4. **Arcs** — Do all parts travel in appropriate curves?
5. **Weight** — Does it feel like it has mass?
6. **Polish** — Overlap, secondary, settle, micro-details

**Why this order:** Each level depends on the previous. Perfect spacing won't save a bad silhouette.

### Named Failure Patterns

**Twinning**
- Symptom: Both sides of body mirror each other
- Cause: Lazy posing, copying/flipping
- Fix: Offset timing, vary poses asymmetrically

**Even Timing**
- Symptom: Metronomic, robotic feel
- Cause: Same frame count for everything
- Fix: Vary timing based on weight, intention, emphasis

**Linear Spacing**
- Symptom: Mechanical, constant speed
- Cause: No easing, linear interpolation
- Fix: Ease in and out, check spacing charts

**Floating**
- Symptom: No connection to ground, drifting
- Cause: Missing weight, bad foot plants, even timing
- Fix: Solid contact frames, ease into ground, anticipation before lift

**IK Pop**
- Symptom: Sudden jump in position, usually at joints
- Cause: IK solver flipping, bad keyframes at limits
- Fix: Check extension limits, add keys before/after problem, consider FK

**Dead Face**
- Symptom: Body animated, face static
- Cause: Forgot to animate face, or animated separately without integration
- Fix: Eyes lead action, brows show thought, face breathes

**Strobing**
- Symptom: Jittery, flickering motion
- Cause: Too few frames, inconsistent spacing, too much high-frequency detail
- Fix: Motion blur, smears, fewer frames with better spacing

**Mushy**
- Symptom: No punch, everything soft
- Cause: Over-easing, too many frames, no held poses
- Fix: Sharper easing, reduce frames, add holds on key poses

**Pose-to-Pose Robot**
- Symptom: Hits poses but interpolation between is dead
- Cause: Keys only on major poses, no breakdowns
- Fix: Add breakdowns, offset body part timing, check arcs

### The Fix Protocol

1. Identify the worst problem (use diagnosis order)
2. Fix ONLY that problem
3. Re-evaluate—often other issues were symptoms
4. Repeat until it works
5. Don't polish garbage—if blocking is broken, reblock

---

## 6. Game Animation Specifics

### State Machines
**Structure:** Idle → Walk → Run → Jump → Fall → Land → (back to Idle)
**Transitions:** Every connection needs: exit condition, transition time, blend type
**The trap:** Too many states = unmaintainable. Too few = no nuance.

### Blend Trees
**1D Blend:** Single parameter (speed: walk ↔ run)
**2D Blend:** Two parameters (direction X + direction Y)
**What's happening:** Engine interpolates between poses mathematically
**The problem:** Interpolation finds the shortest path, which isn't always anatomically correct
**The fix:** Add intermediate animations to guide the blend

### Root Motion vs. In-Place
**Root motion:** Animation drives character position. Precise, but code loses control.
**In-place:** Code drives position, animation is visual only. Flexible, but can slide.
**When to use root motion:** Precise footwork matters (climbing, vaulting), mocap
**When to use in-place:** Gameplay responsiveness priority, procedural movement

### Animation as Communication
**Telegraphing:** Player must read what's coming. Wind-up frames aren't just pretty—they're UI.
**Feedback:** Player must know their input registered. Instant response on input, even if action takes time.
**Readability:** In gameplay, clarity beats beauty. Silhouette matters even more than film.

### Frame Data
- **Startup:** Frames before hitbox/effect (can be canceled usually)
- **Active:** Frames where the action "counts"
- **Recovery:** Frames returning to neutral (vulnerable)
- **Cancel windows:** When player can interrupt into another action
- **Buffer frames:** Input leniency, accepts early input

### Common Frame Counts (60fps game)
- Jab/light attack: 3-6 startup, 2-4 active, 8-12 recovery
- Heavy attack: 12-20 startup, 4-8 active, 16-24 recovery
- Jump startup: 3-5 frames (too long = unresponsive)
- Turn around: 4-8 frames depending on style
- Get-hit reaction: 8-16 frames depending on severity

**For 30fps:** Roughly halve these numbers

### Additive Animation
**What it is:** Animation layered on top of base animation (breathing on top of idle, aim offset on top of locomotion)
**When it works:** Subtle additions, variations on base
**When it breaks:** Large movements, competing with base
**The trap:** Additive stacking = unpredictable results

---

## 7. Production Intelligence

### Scoping
**The multiplier:** Whatever you estimate, multiply by 2.5. Then add 20%.
**Priority tiers:**
- Tier 1: Player character, seen constantly. Polish the hell out of it.
- Tier 2: Main NPCs, enemies. Good but not perfect.
- Tier 3: Background, rare occurrences. Functional.

### Iteration Philosophy
**When to iterate:** Core doesn't read, timing is fundamentally off, client/director feedback
**When to restart:** Pose fundamentals are broken, you've iterated 3+ times without improvement
**When to ship:** It does the job, further polish has diminishing returns, deadline exists

### The "Good Enough" Threshold
- **Hero moment:** Never good enough. Keep polishing.
- **Standard gameplay:** When you stop noticing problems at real speed
- **Background:** When it doesn't distract
- **Prototype:** When it communicates the idea

### Collaboration Translation
**Talking to programmers:**
- Be specific: "I need an event trigger at frame 14" not "when the sword swings"
- Know your export: Formats, naming conventions, what breaks
- Understand their constraints: Frame budgets, bone limits, blend limitations

**Talking to designers:**
- Understand the game feel goal: "Snappy" means what exactly?
- Ask about cancel windows and input timing BEFORE animating
- Animation supports design, not the reverse

---

## 8. Tool Knowledge (Deep)

### Graph Editor Mastery

**Tangent Types:**
- **Auto:** Software guesses. Usually wrong at extremes.
- **Spline/Smooth:** Continuous curve. Good default.
- **Linear:** Constant speed. Mechanical.
- **Stepped:** Hold until next key. Blocking mode.
- **Flat:** Zero velocity at keyframe. Full stop.

**The S-Curve:** Slow out → fast middle → slow in. The bread and butter.
**Breaking tangents:** Split incoming/outgoing handles. Use for instant direction changes.
**Overshoots:** Push past target, settle back. Add life but can look swimmy.

### Gimbal Lock
**What it is:** When two rotation axes align, you lose a degree of freedom
**When it happens:** Extreme rotations, especially ±90° on middle axis
**Prevention:** Rotate in correct order. Change rotation order in rig settings.
**Fix:** Add keyframes before/after problem. Switch to different rotation order. Use Quaternion.

### Quaternion vs. Euler
**Euler:** Human-readable (X, Y, Z degrees). Editable in graph editor. Can gimbal lock.
**Quaternion:** Mathematically stable. No gimbal lock. Interpolates better. Can't edit intuitively.
**When to use Euler:** Posing, hand animation, anything you need to tweak
**When to use Quaternion:** Export, final animation, avoiding gimbal issues

### IK/FK Switching
**The problem:** Switching mid-animation causes pops
**The solution:** Match transforms at switch frame. Key both systems at transition.
**Advanced:** Use IK/FK blend attribute, animate the blend itself

### Blender-Specific
- **NLA Editor:** Non-linear animation. Stack and blend clips.
- **Action Editor:** Individual animation clips. Name them clearly.
- **Push Down:** Sends action to NLA strip. Don't lose your work.
- **Export:** FBX with "Apply Transform." Check scale (Blender is metric).

### Maya-Specific
- **Time Editor:** Maya's NLA equivalent. Powerful but complex.
- **Trax:** Legacy. Still works.
- **HumanIK:** Built-in retargeting. Useful but quirky.
- **Export:** FBX. Bake animation. Check up axis (Maya is Y-up).

### Unity-Specific
- **Animator Controller:** State machine visual editor
- **Animation window:** Keyframe editor. Limited but functional.
- **Avatar:** Humanoid rig definition. Set up correctly or suffer.
- **Animation Events:** Trigger code at specific frames. Essential for gameplay.
- **Root Motion:** Checkbox in animator. Test thoroughly.

### Unreal-Specific
- **Animation Blueprint:** Visual scripting for animation logic
- **Montages:** One-shot animations that play over state machine
- **Blendspaces:** Unreal's blend trees. 1D and 2D.
- **Control Rig:** In-engine rigging. Getting better but not Maya.
- **Root Motion:** More robust than Unity. Still test it.

---

## 9. Style Literacy

### Disney/Western Feature
**Characteristics:**
- Full animation (24fps on 1s and 2s)
- Squash and stretch emphasized
- Fluid arcs, smooth spacing
- Acting detail in face and hands
- High production value

**When to reference:** Character animation, acting shots, appeal studies

### Anime/Limited Animation
**Characteristics:**
- Drawings on 3s, 4s, or even held poses
- Impact frames, speed lines, screen shake as cheats
- Fewer drawings, more dramatic drawings
- Staggered animation (shaking held drawing)
- Effects animation carries workload

**The philosophy:** Fewer drawings, each one counts more. Economy of motion.
**When to reference:** Limited budget, stylized work, impact emphasis

### Western TV/Flash
**Characteristics:**
- Puppet/rigged characters
- Symbol swapping
- Limited key poses, heavy tweening
- Stylized designs that hide limitations
- Snappy timing to mask limited frames

**When to reference:** Rig-based production, budget constraints, motion graphics style

### Pixel Art
**Characteristics:**
- Very limited frame counts (4-8 frame cycles common)
- Each frame is a full redraw
- Sub-pixel animation (anti-aliasing creates motion)
- Hue shifting in shading
- Strong silhouettes mandatory

**The constraint:** Every pixel is visible. No hiding in detail.
**When to reference:** Retro style, low-res games, sprite work

### 3D Stylized
**Making 3D feel 2D:**
- Stepped interpolation (holds like drawings)
- Smear frames modeled or blend-shaped
- Broken rigs (limbs stretch, squash)
- Screen-space outlines
- Limited color palettes in shading

**When to reference:** Modern 3D that wants 2D energy (Spider-Verse, Guilty Gear)

### Motion Graphics / UI
**Characteristics:**
- Easing is everything
- Overshoot and settle
- Staggered timing on groups
- Scale, rotation, opacity as primary tools
- Less character, more shape

**When to reference:** Menu animation, logo animation, HUD elements

---

## 10. Reference Methodology

### Shooting Reference
**Camera placement:**
- Match intended final camera angle
- Also shoot perpendicular angles for spatial understanding
- Shoot wide enough to see full body

**Multiple takes:**
- Shoot "real" version first
- Then exaggerated version
- Then explore variations

**Speed:**
- Real-time for overall feel
- Slow-motion for breakdown moments
- You can slow down video; you can't add frames that don't exist

### Using Reference
**What to extract:**
- Timing (where are the hits?)
- Weight shift patterns
- Which body part leads
- Arc paths

**What to interpret:**
- Exact poses (adjust for character design)
- Exaggeration level (push beyond reference)
- Style translation (realistic ref → stylized output)

**The trap:** Copying reference exactly = rotoscope look. Reference informs; it doesn't dictate.

### Building a Library
**Organization:**
- By action type (walks, runs, jumps, hits, idles)
- By weight class (light, medium, heavy)
- By mood (happy, sad, angry, tired)
- By style (realistic, stylized, exaggerated)

**Sources:**
- Film (actors are animated by directors)
- Sports footage (peak human performance)
- Animal footage (creature reference)
- Your own footage (you're always available)

---

## 11. Non-Humanoid Animation

### Quadrupeds
**Walk gaits:**
- Walk: 3 feet on ground minimum (lateral sequence)
- Trot: Diagonal pairs move together
- Canter: 3-beat asymmetrical
- Gallop: 4-beat, moments of suspension

**Key difference from bipeds:** Spine flexion drives the motion. The spine is the engine.

### Birds
**Flight:**
- Downstroke = power (fast)
- Upstroke = recovery (slower, wing folds)
- Body bobs opposite to wings

**Walk:**
- Head stabilization (head stays still, body moves, then head catches up)
- This is real and essential for bird walk believability

### Insects
**Tripod gait:** Three legs move while three support. Alternate sets.
**Speed:** Faster = gait breaks down, legs blur
**The creep factor:** Unnaturally smooth = unsettling

### Fish/Swimming
**C-curve:** Body forms C shape, pushes against water
**Wave:** Motion travels from head to tail
**Fins:** Secondary action, stabilization

### Creatures (Invented)
**The rule:** Base on something real, then modify
**Questions:**
- Where is its weight? (Center of mass determines movement)
- What's its locomotion method? (Pick a real reference)
- How does it show emotion? (Eyes? Posture? Color?)

### Abstract/Shape Animation
**The cheat:** Give it eyes. Eyes = life.
**Secondary cheat:** Squash and stretch. Even a bouncing cube feels alive if it squashes.
**The principle:** Apply the 12 principles to anything, no matter how abstract.

---

## 12. Feedback & Mentality

### Giving Critique
**Order of operations:**
1. What's working (brief—not a compliment sandwich)
2. The biggest problem (one thing)
3. Specific fix (actionable)
4. Why it matters (context)

**Language:**
- "The spacing suggests..." not "You made it look..."
- "This could read better if..." not "This is wrong"
- "I'm seeing..." not "I don't like..."

### Receiving Critique
**What to extract:**
- Is this about execution or direction?
- Is the note specific or vibes?
- What's the actual problem they're reacting to?

**Translation:**
- "It feels off" = they see a problem but can't diagnose. Ask: "Where specifically?"
- "Make it more dynamic" = probably timing and spacing. Push the extremes.
- "It's too much" = pull back exaggeration OR improve easing

### Fighting Frame-Blindness
- Flip horizontally (forces brain to re-see)
- Watch at different speeds
- Watch on loop for 2 minutes straight
- Walk away and return tomorrow
- Show someone else (they see what you can't)

### The Hater Voice
**Useful version:** "This isn't working because [specific diagnosis]"
**Destructive version:** "This is bad and I'm bad"

**The difference:** Specific criticism is actionable. General criticism is paralysis.

---

## Quick Reference: Common Numbers

### Frame Counts (24fps)
| Action | Frames | Notes |
|--------|--------|-------|
| Blink | 2-4 | Down fast, up slower |
| Fast head turn | 4-6 | |
| Normal head turn | 8-12 | |
| Casual step | 12-16 | Per step |
| Walk cycle | 16-24 | Full cycle (2 steps) |
| Run cycle | 8-12 | Full cycle |
| Fast punch | 6-10 | Full action |
| Heavy swing | 16-24 | Full action |
| Jump | 20-30 | Takeoff to land |
| Anticipation | 4-8 | Proportional to action |
| Settle | 4-12 | Diminishing oscillation |

### Holds
| Purpose | Frames | Notes |
|---------|--------|-------|
| Beat/rhythm | 2-4 | Just enough to register |
| Emphasis | 4-8 | "Look at this pose" |
| Thought/reaction | 8-16 | Acting beat |
| Dramatic pause | 16-24 | Big moment |

### Spacing Ratios
| Easing | Ratio (in:middle:out) |
|--------|----------------------|
| Linear | 1:1:1 |
| Light ease | 2:1:2 |
| Standard ease | 3:1:3 |
| Heavy ease | 4:1:4 |
| Extreme snap | 6:1:2 (fast out, slow in) |

---

## 13. Glassmorphism: The New Lens (2025 Edition)

*"I've animated on 35 mm film, 2 K floppy-disc rotoscopes, Flash rigs that crashed every third export, and Unreal 5 Nanite scenes that compile while I sip coffee. Glassmorphism? Just another paintbrush—except the paint is light, the canvas is z-depth, and the viewer's finger is the camera operator."*

### What It Is

**3-layer visual metaphor:**
1. Background (usually a subtle gradient or dynamic video plate)
2. Mid-layer: frosted glass plane (15–40% opacity, 20–40px blur radius)
3. Foreground: micro-parallaxed elements, often with 1–2px inner glow to fake thickness

**Why animation matters more than ever:**
- The "glass" is pure cheat: no real refraction, no caustics. Motion sells the illusion.
- 60fps is non-negotiable; blur granularity at 120fps is visible on ProMotion iPads.
- Users *touch* the glass—hover, drag, tilt—so every pixel needs 3-frame reactivity or the magic dies.

### Motion Principles Specific to Glassmorphic UI

1. **Depth-sort easing:** foreground ease-out = 120ms, mid-layer = 180ms, background = 240ms. The stagger is tiny but the brain reads it as laminated glass sheets.
2. **Blur-driven anticipation:** scale the *backdrop-blur* radius 1 frame *before* the panel starts sliding; the user subconsciously preps for the reveal.
3. **Chromatic drag:** when a glass sheet moves fast, tint its leading edge +2% saturation and trailing edge –2%; the eye interprets this as spectral smear.
4. **Light-source reactivity:** bind a 2D directional light vector to the device gyro. Tilt the phone → specular shift on the glass → animate the inner-shadow angle over 6 frames.

### Tools That Actually Work (2025)

- **CSS:** `filter: blur()` + `backdrop-filter` + `transform: translateZ(0)` for composite-layer promotion.
- **Lottie/Bodymovin:** export *vector blur masks*—not Gaussian—so iOS doesn't raster on every frame.
- **Rive:** use State Machine **nested inputs** to drive blur radius; 60fps on mobile with 3% GPU.
- **Framer Motion:** `layout` prop automatically handles depth-sort easing; override with `layoutId` for shared-element transitions that feel like sliding glass panes.
- **WebGL/Three.js:** single quad with custom `MeshPhysicalMaterial`, `transmission: 0.92`, `thickness: 0.3`, `ior: 1.49`. Animate `ior` down to 1.33 on hover for "sweaty finger" micro-feedback.

### Perception & Motion Science – 2025 Addenda

**Foveal vs. Peripheral Blur:**
- Glassmorphism lives in peripheral vision; the frosted panel is rarely the focal point.
- Therefore **blur LOD:** full 40px Gaussian at 1° from gaze, drop to 15px at 5°. Chrome 128 finally exposes `eye-tracking` in WebXR; polyfill with mouse-velocity proxy.

**120Hz & Motion Sickness:**
- At 120fps, even 1px of jitter on a blur plane triggers vestibular mismatch.
- Fix: sub-pixel interpolation using `will-change: transform` and `translate3d(calc(), 0, 0)`—forces GPU raster at floating-point positions.

**Dark-Mode Refraction Shift:**
- In OLED black, the brain expects zero scatter. A 5% grey glass panel must *increase* blur radius by 8% or it reads as a smudge, not thickness.
- Rule: `blur_dark = blur_light × 1.08`.

### The 12 Principles – Glassmorphism Translation

| Principle | Classic Purpose | 2025 Glass Twist | Common Fail |
|-----------|-----------------|------------------|-------------|
| **Squash & Stretch** | Show material flexibility | Stretch = increase blur radius 20% while scaling 102%; squash = drop radius 10%, scale 98%. Keeps "volume" of transparency. | Blur radius overshoots → panel looks out-of-focus, not thick. |
| **Anticipation** | Prep viewer for action | Backdrop-blur *pre-animates* 1 frame (radius +5px) before panel slides. | No pre-blur → motion feels late even if translation is on frame. |
| **Staging** | One idea per shot | Only *one* glass pane animates at a time; others freeze (0.5% scale) to avoid depth competition. | Two panels easing simultaneously → user reads neither. |
| **Straight Ahead** | Fluid, organic | Micro-turbulence: add 0.3px noise to blur radius every frame using `requestVideoFrameCallback` for living texture. | Noise too high → frosted glass becomes sand-blasted. |
| **Follow-Through** | Nothing stops at once | Blur radius settles 4 frames *after* translation finishes; use exponential decay curve. | Blur stops same frame as translation → glass feels weightless. |
| **Slow In/Out** | Natural acceleration | Use `cubic-bezier(0.4, 0, 0.2, 1.4)`—overshoot 4% on blur radius for "springy" glass. | Standard ease → feels like plastic. |
| **Arcs** | Organic paths | Even horizontal slides need 0.5px vertical parallax arc so the glass doesn't feel CAD-perfect. | Linear X → UI feels robotic on 120Hz. |
| **Secondary Action** | Richness | Subtle chromatic aberration on edges (R channel offset 0.2px left, B 0.2px right) that lags 2 frames behind main motion. | Aberration too large → hologram, not glass. |
| **Timing** | Emotion | Micro-interactions: 80ms = confident, 120ms = thoughtful, 160ms = sluggish. | 200ms+ → user thinks the phone froze. |
| **Exaggeration** | Push reality | Push `transmission` to 0.98 (almost invisible) at apex of open animation, then snap back to 0.85. | Over-exaggerate → panel disappears completely, breaking affordance. |
| **Solid Drawing** | Volume | Glass must have *edge thickness*: 1px inner border with 0% blur, 15% opacity darker tint. | No edge → panel looks like a PNG, not glass. |
| **Appeal** | Watchability | Glass should invite touch—animate a 1% scale pulse every 3s when idle, synced with breath timing (4s loop). | No pulse → static wallpaper, not UI. |

### Physics for Glassmorphic Motion

**Index of Refraction (IOR) in Pixels:**
- Real glass: 1.52. In CSS we fake it by tinting the backdrop *cooler* 50K and darkening 2% per 10px of simulated thickness.
- Animate `ior` down to 1.33 (water) on long-press: user feels the glass "moisten" under finger.

**Total Internal Reflection (TIR) Cheat:**
- At 45° screen tilt, add 1px white streak at the bottom edge with 20% opacity, animate its width from 0 → 4px over 6 frames.
- GPU cost: one extra div with `linear-gradient`.

**Capillary Drag:**
- When finger drags across glass, move the *blur centroid* 1px *behind* the finger vector at 0.3 × finger velocity.
- Gives tactile "wet" feedback without haptics.

### Acting Through Motion – For UI Personas

**Micro-Intention Library (60fps counts):**

| Intention | Eye-track Focus | Glass Response | Frame Breakdown |
|-----------|-----------------|----------------|-----------------|
| **Curious hover** | 80ms dwell | Blur radius 20 → 24px + 1% scale | 0-6-12 (ease out) |
| **Dismissive swipe** | Velocity > 800px/s | Glass skew –3° Y, transmission 0.9 → 0.95, exit 120ms | 0-4-7 |
| **Delight (success)** | Pupil dilation spike | Rainbow specular sweep 4px across panel in 10 frames | 0-10 |
| **Uncertainty** | Gaze darts 3+ times | Micro-jitter: translateX ±0.3px random every frame for 18 frames | 0-18 |

**Breath Sync:**
- Match glass pulse to *actual* user breath if device has chest-facing radar (Pixel 9).
- Fallback: 4s loop at 0.8 × average respiratory rate (12 breaths/min → 5s loop).

### Systematic Critique – Glassmorphic Edition

**Diagnosis Order Updated:**
1. **Legibility** — Does text hit 4.5:1 contrast *through* the glass at *all* blur radii?
2. **Depth Layering** — Does the 3-layer parallax still read on a 5" phone at 300ppi?
3. **Blur Performance** — Chrome DevTools "Rendering" → FPS drop below 55? If yes, drop backdrop-resolution 50%.
4. **Motion Sickness** — Test on 120Hz iPad Pro in dark room. Any vestibular wobble?
5. **Gesture Race** — Can the user interrupt the 120ms animation at frame 3 and still get feedback?

**Named Failures (2025 crop):**
- **Blur Seizure:** radius keyframes on every frame → GPU can't cache render pass → 25fps.
- **Ghost Tilt:** gyro light-vector lags 2 frames behind glass rotation → panel looks detached.
- **Holo Drift:** chromatic aberration grows with distance from center → edges prismatic, breaks realism.
- **Vacuum Pop:** glass exits but blur plane stays 1 extra frame → background snaps sharp, user feels suction.

### Game Engines – Glass UI

**Unity 6 (UI Toolkit):**
- `UI Toolkit` supports `backdrop-filter` via custom `BackgroundBlur` shader graph; cost 0.4ms on iPhone 14.
- State Machine: create `BlurRadius` float, drive with `UIAnimationDriver` to keep 60fps sync.
- **Trap:** `Screen Space Overlay` canvas ignores blur—must use `Screen Space Camera` at 1% opacity clear panel.

**Unreal 5.4 (UMG):**
- `Retainer Box` with custom `Material Instance` (Domain: User Interface, Blend Mode: Translucent).
- Expose `BlurStrength` as parameter; animate via `Widget Animation` timeline.
- **Mobile:** disable `Mobile Tonemapper Subpass` or blur samples double-count → 3ms GPU cost.

**Godot 4.2:**
- `BackBufferCopy` node → `CanvasItem` shader with `SCREEN_TEXTURE` and `SCREEN_UV` offset by noise.
- Use `VisualShader` to avoid GLSL; still 60fps on Pixel 7.

### Production Intelligence – Glassmorphic Scoping

**Performance Budget (mobile):**
- **Total UI blur per frame:** ≤ 2 full-screen equivalents (iPhone 15 can do 60fps at 2.3).
- **Rule of 3:** max 3 glass panels animating simultaneously; others collapse to flat color at 90% opacity.
- **Fallback ladder:**
  1. Full blur
  2. 50% resolution blur
  3. Static pre-blurred texture swap
  4. Solid color + fake 1px inner shadow

**Asset Pipeline:**
- Export 1× and 2× *blur noise textures* (256px) to avoid procedural cost on low-end Android.
- Name convention: `GlassBlur_L_001.png` (L = light mode), `GlassBlur_D_001.png` (dark mode tint).
- Version in filename, **not** folder—designers swap textures in Figma without re-exporting code.

### Tool Knowledge – 2025 Deep Cuts

**CSS Houdini (Chrome 128+):**
```css
@supports (backdrop-filter: blur(1px)) {
  .glass {
    animation: blurPop 0.12s cubic-bezier(0.4,0,0.2,1.4);
  }
}
@keyframes blurPop {
  0%   { backdrop-filter: blur(20px); scale: 0.98; }
  60%  { backdrop-filter: blur(26px); scale: 1.02; }
  100% { backdrop-filter: blur(24px); scale: 1; }
}
```
- **Trap:** Safari still prefixes; use `@supports (-webkit-backdrop-filter: blur(1px))` first.

**Rive Advanced – State Machine Drivers:**
- Drive `BlurRadius` with `SMABlur` input; loop at 60fps but **only mark keyframes at 30fps**—cuts file size 40%.
- **Nested art-boards:** glass panel as child; parent handles translation, child handles blur—parallel evaluation, zero matrix re-calc.

**Figma Dev Mode (2025):**
- Right-click glass layer → `Copy as CSS` now exports `backdrop-filter` with *exact* blur radius and `rgba()` tint.
- **Pro tip:** add `/* motion: ease-out 120ms */` comment—designers and engineers share the same string, no drift.

**Chrome DevTools – "Blur Profiler":**
- Rendering tab → `Enable Backdrop Filter Debugging` → green overlay shows blur samples per quad.
- Aim for < 200 samples per frame on Adreno 730.

### Style Literacy – Glassmorphism Variants

**iOS 18 Semi-Opaque:**
- Blur radius 30px, saturation +20%, no chromatic aberration—clean, clinical.

**Android 15 Material You:**
- Dynamic color extraction → glass tint = `Primary-40` at 12% opacity; blur radius scales with display diagonal (dp).

**Cyberpunk Glass:**
- Add 1px scan-line shader that scrolls vertically every 8 frames; transmission flickers 0.85 → 0.9 at 12fps sub-loop.

**Brutalist Glass:**
- No edge rounding, 1px hard border, blur radius 4px only—feels like frosted Plexiglas® from the 1970s.

**Accessibility Glass:**
- User enables `Reduce Transparency` → replace blur with 8% solid grey + 1px border; animation duration 0ms (instant).

### Reference & Capture – Glass in the Wild

**Shooting Real Glass for Reference:**
- Use 50mm equivalent lens to match phone FOV.
- Back-light with 5600K LED panel; shoot 240fps to study how blur *actually* behaves when sheet moves.
- Extract: **edge-darkening** (subtle 3%) and **caustic bounce** (color temperature shifts 200K warmer on adjacent white).

**Macro Library:**
- Build 4K 120fps library of: shower doors, car windows, museum display cases, airplane porthole.
- Tag in **Frame.io** with `blur-radius`, `ior`, `thickness-mm` metadata—engineers copy-paste numbers.

### Non-Humanoid / Abstract – Glass Creatures

**Breathing Glass Blob:**
- Mesh: icosphere with 2-level subsurf.
- Shader: animate `ior` 1.33 → 1.49 on inhale; vertex displacement along normals ±2cm at 12s loop.
- **Secondary:** blur plane behind blob scales 98% → 102% opposite to displacement—sells suction.

**Glass Bird:**
- Wings: thin glass sheets; transmission 0.95 → 0.7 on down-stroke (fake flexion).
- **Feathers:** individual quads with `alphaTest` 0.5; motion-blur vector in vertex shader to avoid costly temporal AA.

### Feedback & Mentality – Glassmorphic Crit

**Giving Notes:**
- "The blur radius overshoots at frame 8, breaking the 40px budget—pull back 10% and re-test on Pixel 6."
- "Edge-darkening is missing on the trailing side; add 2% darken so the panel feels 3mm thick."

**Receiving Notes:**
- Translate "It feels too floaty" → blur radius is decaying with linear tangent; swap to exponential decay curve.
- Translate "Hurts my eyes" → saturation boost inside blur is +30%, reduce to +10% and re-evaluate.

**Frame-Blindness Cure:**
- Toggle `prefers-reduced-motion` in dev-tools—if glass still reads as glass without blur animation, the base design is solid.

### Quick Reference – Glassmorphic Numbers (60fps)

| Interaction | Frames | Blur Radius (px) | Notes |
|-------------|--------|------------------|-------|
| Tap feedback | 0-6 | 20 → 26 → 24 | Overshoot 8% |
| Long-press bloom | 0-18 | 20 → 32 (hold) → 20 | Ease out 240ms |
| Swipe dismiss | 0-12 | 24 → 0 | Linear blur decay |
| Modal enter | 0-18 | 0 → 28 | Exponential ease |
| Modal exit | 0-12 | 28 → 0 | Slight overshoot 2px |
| Breath idle | 0-240 | 24 → 26 → 24 | 4s loop |
| Gyro tilt (±15°) | Real-time | ±4px offset | 1:1 mapping, no ease |

---

*"Glassmorphism isn't a trend—it's a transparency shader the human brain has been running since we first stared through ice. Animate it like it's alive, because for 120 frames per second, it is. And remember: if the blur drops frames, the magic shatters louder than any glass cannon I ever rigged. Now go make something that feels like you could wipe the condensation off with your thumb."*

---

*"You now have the knowledge. Using it correctly is the next twenty years of your life. Good luck. You'll need it."*

