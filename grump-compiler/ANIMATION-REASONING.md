# Animation Reasoning System

## The Fundamental Truth

> **Animation is decision compression over time, not interpolation.**

Humans judge animation by one question: **"Did that move for a reason?"**

If your AI can always answer that question—clearly, defensibly, consistently—then it will produce animation humans **trust**, not just tolerate.

## The Six Layers (In Order)

### Layer 1: Narrative Intent (Non-Negotiable)

Every animation answers: **"What is the audience supposed to understand *right now*?"**

This is not optional metadata. This is the *root* of everything.

```grump
intent "Communicate annoyance without hostility" {
    primary: "Show mild frustration"
    secondary: ["Maintain likability", "Avoid aggression"]
    forbidden: ["Anger", "Sarcasm", "Playfulness"]
    emotion: annoyed
    intensity: 0.6
}
```

**Rules:**
- If a movement could be interpreted as forbidden, it is disallowed
- Even if it looks "cool"
- Humans are ruthless here. AI must be too.

### Layer 2: Attention Hierarchy (What Leads)

Humans perceive animation in strict priority:

1. **Eyes** (always first)
2. Head orientation
3. Body mass
4. Limbs
5. Accessories / effects

```grump
hierarchy {
    leader: eyes
    secondary: [brows, head]
    tertiary: [body]
    still: [limbs, accessories]
}
```

**Rules:**
- Leader always moves first
- Followers cannot override leader
- Nothing moves "just because"
- If not contributing to attention flow → stay still

### Layer 3: Beat Structure (Time as Language)

Humans don't see continuous motion. They see **beats**—perceptual units of meaning.

```grump
beats {
    beat "anticipation" {
        duration: 0.08s
        stillness: true
        priority: 10
    }
    beat "eye_roll" {
        driver: eyes
        duration: 0.12s
        ease: fast_out
        priority: 10
    }
    beat "head_follow" {
        delay: 0.06s
        duration: 0.22s
        ease: heavy
        priority: 7
    }
    beat "recovery" {
        duration: 0.6s
        ease: smooth
        priority: 5
    }
}
```

**Rules:**
- Beats are discrete
- Beats can overlap
- Beats have priority
- This is why animation feels like acting

### Layer 4: Causal Chains (Why Things Move)

**Nothing moves unless something else caused it.**

```grump
causality {
    eye_roll → brows { delay: 0.02s, strength: 0.6 }
    head_tilt → body { delay: 0.05s, strength: 0.3 }
    emotion_change → brows { delay: 0.08s, strength: 0.8 }
}
```

**Rules:**
- No cause = no motion
- Random motion reads as *nervous*, *cheap*, or *procedural*
- Every movement must have a parent

### Layer 5: Temporal Relationships (The Secret Sauce)

This is where humans subconsciously decide: **"This was animated by a real person."**

```grump
timing {
    eye_movement: 120ms
    head_lag: 60ms
    body_lag: 120ms
    emotion_start_speed: 1.5x
    recovery_speed: 0.6x
}
```

**Key Truths:**
- Eyes move in ~100–150ms
- Head movement lags eyes by ~50–120ms
- Emotional actions start fast, end slow
- Recovery is slower than action
- Anticipation is shorter than payoff

**These ratios matter more than exact values.**

### Layer 6: Settling & Residue (Life)

Living things never stop cleanly.

```grump
settling {
    overshoot: 0.05
    asymmetry: 0.15
    delayed_stop: 30ms
    micro_settles: [
        { target: head, delay: 50ms, duration: 200ms, amount: 0.1 }
    ]
}
```

**Rules:**
- Force micro-settles
- Force slight overshoot
- Force asymmetry
- Force delayed stops
- If everything stops on the same frame → **dead**

## Why Keyframes Are a Trap

Keyframes are an *output format*, not a thinking tool.

If your AI thinks in keyframes:
- It will interpolate meaning
- It will smooth emotion away
- It will average decisions

**Instead**, generate Animation IR:

```json
{
  "intent": {
    "primary": "annoyance",
    "forbidden": ["anger", "hostility"]
  },
  "beats": [
    {
      "name": "anticipation",
      "duration": 0.08,
      "stillness": true
    },
    {
      "name": "eye_roll",
      "driver": "eyes",
      "duration": 0.12,
      "ease": "fast_out"
    }
  ]
}
```

**Then** compile this into:
- Curves
- Keyframes
- Shaders
- Whatever

This separation is **why the compiler approach is correct**.

## Accuracy Requires Constraints, Not Freedom

Humans animate well because they are constrained by:
- Anatomy
- Gravity
- Taste
- Experience
- Social norms

**AI must be *more constrained*, not less.**

**Hard Prohibitions:**
- ❌ No facial movement without emotional justification
- ❌ No simultaneous eye + brow peaks
- ❌ No head motion without eye motivation
- ❌ No looping idle that repeats exactly
- ❌ No particle effects unless they reinforce emotion

**Creativity emerges from constraint. Accuracy depends on it.**

## Stillness Is First-Class

Most AI animation fails because it is afraid of stillness.

**Your AI must intentionally choose:**
- When nothing moves
- How long nothing moves
- Which parts remain alive subtly

**Stillness:**
- Creates contrast
- Increases impact
- Signals confidence

**Treat stillness as a deliberate beat, not the absence of animation.**

## Human Validation Heuristics

Before outputting, self-check:

1. **Silhouette Test**: Does it read without details?
2. **Mute Test**: Does it work without sound?
3. **Speed Test**: Does it read at 0.25x and 2x?
4. **Scrub Test**: Can intent be understood when scrubbing?
5. **Animator Test**: Would an animator remove anything?

**If any fail:**
- Reduce motion
- Simplify beats
- Increase pauses

## The Final Truth

Humans do not judge animation by:
- ❌ Smoothness
- ❌ Resolution
- ❌ Frame rate
- ❌ Realism

They judge it by:

> **"Did that move for a reason?"**

If your AI can always answer that question—clearly, defensibly, consistently—then it will produce animation humans **trust**.

---

## Implementation in G-Rump

The animation reasoning system is implemented in:
- `grump-compiler/src/animation/reasoner.rs` - Core reasoning engine
- `grump-compiler/src/animation/mod.rs` - Module exports

**Usage:**

```grump
// In G-Rump code
animate character {
    intent: "Show mild annoyance"
    emotion: annoyed
    intensity: 0.6
    
    // The compiler reasons through all 6 layers
    // and generates proper animation
}
```

The compiler will:
1. Parse intent
2. Determine hierarchy
3. Create beats
4. Establish causality
5. Set timing relationships
6. Add settling
7. Validate against heuristics
8. Generate final animation code

**This is why G-Rump produces animation humans trust.**

