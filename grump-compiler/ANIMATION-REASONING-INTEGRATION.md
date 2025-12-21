# Animation Reasoning Integration

## Overview

The six-layer animation reasoning system has been integrated into the G-Rump compiler. This system ensures that all animations produced by G-Rump answer the question: **"Did that move for a reason?"**

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              G-Rump Animation Pipeline                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         Layer 1: Narrative Intent                        │
│  "What is the audience supposed to understand?"         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         Layer 2: Attention Hierarchy                    │
│  "What leads the motion? (Eyes → Head → Body)"          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         Layer 3: Beat Structure                         │
│  "What are the perceptual units of meaning?"            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         Layer 4: Causal Chains                          │
│  "Why do things move? (Cause → Effect)"                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         Layer 5: Temporal Relationships                 │
│  "How do things relate in time? (Eyes: 120ms, etc.)"   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         Layer 6: Settling & Residue                     │
│  "How does it feel alive? (Overshoot, asymmetry)"       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Animation IR (Intermediate)                 │
│  Complete reasoning result ready for compilation         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Validation (Human Heuristics)               │
│  - Silhouette test                                       │
│  - Speed test                                            │
│  - Animator test                                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Code Generation                             │
│  - Swift + Metal (iOS)                                   │
│  - Kotlin + OpenGL (Android)                             │
│  - JavaScript + WebGL (Web)                              │
│  - Dart + Skia (Flutter)                                 │
└─────────────────────────────────────────────────────────┘
```

## Implementation

### Core Module

**Location:** `grump-compiler/src/animation/reasoner.rs`

**Key Types:**
- `NarrativeIntent` - Layer 1: What are we communicating?
- `AttentionHierarchy` - Layer 2: What leads?
- `BeatStructure` - Layer 3: Perceptual units
- `CausalModel` - Layer 4: Cause → Effect
- `TemporalRelations` - Layer 5: Timing relationships
- `Settling` - Layer 6: Life and residue
- `AnimationIR` - Complete reasoning result

### Usage in Compiler

```rust
use grump_compiler::animation::AnimationReasoner;

// Create reasoner
let reasoner = AnimationReasoner::new();

// Reason about animation
let ir = reasoner.reason(
    "Show mild annoyance",
    Emotion::Annoyed,
    0.6
)?;

// Validate
let validation = ir.validate();
if !validation.valid {
    // Fix issues
}

// Generate code from IR
let code = codegen::from_animation_ir(&ir, Target::Ios)?;
```

### Integration Points

1. **Parser** - Parse animation intent from G-Rump code
2. **Analyzer** - Validate animation reasoning
3. **Optimizer** - Optimize animation IR
4. **Codegen** - Generate target code from IR

## Language Syntax

```grump
entity Character {
    animate {
        intent: "Show mild annoyance"
        emotion: annoyed
        intensity: 0.6
        
        // Compiler automatically reasons through all 6 layers
    }
}
```

## Next Steps

1. ✅ Animation reasoning system implemented
2. ✅ Animation IR created
3. ✅ Validation heuristics added
4. ⏳ Integrate into parser (parse intent from code)
5. ⏳ Integrate into analyzer (validate reasoning)
6. ⏳ Integrate into codegen (generate from IR)
7. ⏳ Add language syntax for intent declarations

## Files Created

- `grump-compiler/src/animation/reasoner.rs` - Core reasoning engine
- `grump-compiler/src/animation/mod.rs` - Module exports
- `grump-compiler/ANIMATION-REASONING.md` - Technical documentation
- `grump-compiler/ANIMATION-PHILOSOPHY.md` - Philosophy and approach
- `grump-compiler/examples/animation-reasoning-example.grump` - Examples

---

**This is why G-Rump produces animation humans trust, not just tolerate.**

