# G-RUMP LANGUAGE SPECIFICATION v2.0

**"The Animation-First Game Programming Language"**

> **Status**: In Active Development  
> **Primary Target**: iOS (Metal)  
> **Secondary Targets**: Android (OpenGL), Web (WebGL), Flutter (Dart)

---

## Table of Contents

1. [Foundations](#foundations)
   - [Language Philosophy](#language-philosophy)
   - [Type System](#type-system)
   - [Memory Model & Ownership](#memory-model--ownership)
   - [Module System](#module-system)
   - [Error Handling](#error-handling)

2. [Major Architecture](#major-architecture)
   - [Compiler Pipeline](#compiler-pipeline)
   - [Runtime Architecture](#runtime-architecture)
   - [Animation Engine Architecture](#animation-engine-architecture)

3. [Advanced Animation System](#advanced-animation-system)
   - [Curve Editor in Code](#curve-editor-in-code)
   - [Skeletal Animation System](#skeletal-animation-system)
   - [Procedural Animation](#procedural-animation)
   - [Advanced Particle System](#advanced-particle-system)

4. [iOS Game Design Specialty](#ios-game-design-specialty)
   - [iOS-Specific Features](#ios-specific-features)
   - [Metal Rendering Optimizations](#metal-rendering-optimizations)
   - [Performance Profiling & Optimization](#performance-profiling--optimization)

---

## FOUNDATIONS

### Language Philosophy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         G-RUMP CORE PRINCIPLES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. ANIMATION IS NOT A FEATURE, IT'S THE FOUNDATION                         │
│     Every object is animatable by default. Motion is a primitive.           │
│                                                                             │
│  2. READABILITY OVER BREVITY                                                │
│     Code should read like a storyboard. Non-programmers should              │
│     understand what's happening.                                            │
│                                                                             │
│  3. SENSIBLE DEFAULTS, FULL CONTROL                                         │
│     Everything works out of the box. Everything can be customized.          │
│                                                                             │
│  4. iOS FIRST, EVERYWHERE SECOND                                            │
│     Optimized for iOS/Metal. Android/Web are supported but iOS is king.     │
│                                                                             │
│  5. COMPILE-TIME SAFETY, RUNTIME PERFORMANCE                                │
│     Catch errors before they ship. Run at 60fps always.                     │
│                                                                             │
│  6. THE COMPILER HAS OPINIONS (and will share them)                         │
│     G-Rump guides you toward good practices. Aggressively.                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Type System

G-Rump features a comprehensive type system with **animation primitives as first-class types**:

#### Primitive Types
- **Numbers**: `int`, `int64`, `float`, `double`, `byte`
- **Boolean**: `bool`
- **Text**: `string`, `char`

#### Animation Primitives (First-Class Types!)
- **Vectors**: `vec2`, `vec3`, `vec4`
- **Spatial**: `point`, `size`, `rect`, `bounds`
- **Transform**: `transform` (position, rotation, scale)
- **Color**: `color` (rgba floats), `color8` (rgba bytes), `hsv`, `hsl`
- **Time**: `duration`, `timestamp`, `framestamp`
- **Curves & Easing**: `ease`, `curve`, `path`, `spline`
- **Angles**: `angle`, `rotation`, `quat`, `euler`
- **Ranges**: `range<T>` (interpolatable ranges for any type)

#### Composite Types
- **Collections**: `list<T>`, `array<T, N>`, `set<T>`, `map<K, V>`, `queue<T>`, `stack<T>`, `ring<T, N>`
- **Optional & Result**: `optional<T>`, `result<T, E>`
- **Tuples**: `tuple<A, B>`, `tuple<A, B, C>`

#### Animation-Specific Types
- **Keyframe**: `keyframe<T>` (time, value, ease, tangents)
- **Animation Curve**: `animation_curve<T>` (keyframes, loop, duration)
- **Pose**: `pose` (bone transforms for skeletal animation)
- **Frame**: `frame` (texture region, duration, events, hitboxes)
- **Clip**: `clip` (frames, fps, loop mode)

#### Type Modifiers
- **Animatable**: `animatable float` - can be tweened
- **Reactive**: `reactive int` - triggers updates when changed
- **Clamped**: `clamped<0, 100> int` - constrained values
- **Wrapped**: `wrapped<0, 360> angle` - wraps around

#### Units (Built into the Type System!)
- **Distance**: `10px`, `10pt`, `10%`, `10vw`, `10vh`
- **Time**: `1s`, `500ms`, `2frames`, `1beat`
- **Angles**: `90deg`, `1.57rad`, `0.25turn`

The compiler understands unit conversion automatically.

### Memory Model & Ownership

G-Rump uses a **simplified Rust-like ownership model** for performance:

- **Owned by default**: Values are owned
- **Borrowing**: `&T` for read access, `&mut T` for write access
- **Copy types**: Primitives are automatically copied
- **Move types**: Complex types transfer ownership
- **Explicit cloning**: `clone()` when you need a copy

#### Entity Component System (Built-In)
- **Entities**: Just IDs
- **Components**: Data structures
- **Systems**: Operate on component queries
- **Automatic batching**: G-Rump optimizes system execution

#### Object Pooling
- **Automatic pooling**: For frequently created/destroyed objects
- **Pre-allocation**: Pools are pre-allocated for performance
- **Zero-allocation**: Reuse objects from pools

### Module System

G-Rump uses a module system with conditional compilation:

```grump
module core {
    pub use player::Player
    pub use enemy::Enemy
    pub use physics::*
}

#[ios]
use platform::ios::GameCenter

#[android]
use platform::android::PlayGames
```

### Error Handling

G-Rump uses a **Result type** for recoverable errors:

```grump
fn load_texture(path: string) -> result<Texture, LoadError> {
    if not file_exists(path) {
        return err(LoadError::NotFound(path))
    }
    ok(decode_image(path)?)
}
```

**G-Rump's Error Messages** (with personality!):
- Type errors with helpful suggestions
- Animation warnings (e.g., "1ms animation? Just set it directly.")
- Performance suggestions (e.g., "O(n) → O(log n)")

---

## MAJOR ARCHITECTURE

### Compiler Pipeline

```
Source Files → Lexer → Parser → Analyzer → Optimizer → Codegen → Target Code
```

1. **Lexer**: Tokenizes source, handles units
2. **Parser**: Builds AST, validates syntax
3. **Analyzer**: Type checking, ownership analysis, animation validation
4. **Optimizer**: Dead code elimination, constant folding, animation optimization
5. **Codegen**: Generates Swift/Kotlin/Dart/JS

### Runtime Architecture

**Game Loop**:
- Input Gather → Update Systems → Late Update → Render Pass → Sync (VSync)

**Core Systems**:
- **Animation Engine**: Timeline, tweening, skeletal, procedural, particles
- **Physics Engine**: Rigid body, collision, joints, raycasting, triggers
- **Audio Engine**: Spatial, mixer, effects, streaming, sync
- **Rendering (Metal)**: Batching, shaders, post-FX, UI rendering
- **Scene Graph**: Hierarchy, transforms, culling, layers
- **Resource Manager**: Loading, caching, streaming, hot reload

**Entity Component System**:
- Entity pools
- Component queries
- Event system
- Command pattern

### Animation Engine Architecture

**Animation Controller** (one per animated entity):
- Manages animation state, blending, transitions

**Animation Layers**:
- **Base Layer**: Locomotion blend tree
- **Upper Body Layer**: Aiming, shooting (with bone masks)
- **Additive Layer**: Breathing, hit reactions (additive blending)

**Animation Sources**:
- **Clip Player**: Keyframe animations
- **Blend Tree**: 1D/2D parameter blending
- **Procedural**: IK, physics, look-at
- **Timeline**: Sequenced animations
- **State Machine**: Animation transitions
- **External**: Spine import support

**Animation Targets**:
- Transform (position, rotation, scale)
- Sprite (frame, color, opacity)
- Skeleton (bone transforms)
- Shader (uniforms, parameters)
- Audio (volume, pitch, pan)
- Any animatable property

---

## ADVANCED ANIMATION SYSTEM

### Curve Editor in Code

**Simple Tween**:
```grump
animate sprite.position {
    from: (0, 0)
    to: (100, 100)
    duration: 1s
    ease: expo.out
}
```

**Keyframe Animation with Curve Control**:
```grump
animate sprite.position {
    keyframes {
        0s: (0, 0) { ease_out: smooth }
        0.5s: (150, -50) { ease_in: sharp, ease_out: smooth }
        1s: (200, 0) { ease_in: bounce }
    }
}
```

**Bezier Curve Control** (like After Effects):
```grump
animate sprite.x {
    keyframes {
        0s: 0 { tangent_out: (0.4, 0) }
        1s: 100 { tangent_in: (0.6, 1) }
    }
}
```

**Spring Physics Animation**:
```grump
animate sprite.position {
    to: target.position
    spring: {
        stiffness: 300
        damping: 20
        mass: 1
    }
}
```

**Animation Expressions** (reactive bindings):
```grump
sprite.position := other.position + (50, 0)
sprite.scale := map(distance(self, player), near: 0, far: 500, to: 1.5, to: 0.5)
sprite.rotation := velocity.angle
sprite.rotation := wiggle(frequency: 5, amplitude: 10deg, octaves: 2)
```

### Skeletal Animation System

**Skeleton Definition**:
```grump
skeleton humanoid {
    root {
        hips {
            spine {
                chest {
                    neck { head { ... } }
                    shoulder_l { arm_upper_l { ... } }
                    shoulder_r { mirror: shoulder_l }
                }
            }
            leg_upper_l { ... }
            leg_upper_r { mirror: leg_upper_l }
        }
    }
    
    ik {
        arm_l: [shoulder_l, arm_upper_l, arm_lower_l, hand_l]
        leg_l: [leg_upper_l, leg_lower_l, foot_l]
    }
}
```

**Animation State Machine with Blend Trees**:
```grump
animator player_animator {
    layer base {
        blend tree locomotion {
            parameter: speed
            0: idle
            3: walk { speed: parameter / 3 }
            8: run { speed: parameter / 8 }
        }
    }
    
    layer upper_body {
        mask: [chest, neck, head, arms...]
        state attack { ... }
    }
    
    layer additive {
        blend_mode: additive
        state hit_react { ... }
        state breathing { always_active: true }
    }
}
```

### Procedural Animation

**Inverse Kinematics**:
```grump
ik {
    foot_l {
        chain: ik.leg_l
        target: ground_check(self.position + (-8, 0))
        align_to: surface_normal
        weight: if is_grounded { 1.0 } else { 0.0 }
    }
    
    head {
        chain: ik.spine
        target: look_target ?? camera.center
        speed: 5
    }
}
```

**Procedural Locomotion** (spider legs, tentacles):
```grump
entity Spider {
    legs: 8 {
        procedural_leg {
            segments: 3
            target { direction: body.facing + angle, distance: 40..60 }
            step { threshold: 30px, duration: 0.1s, height: 15px }
        }
    }
}
```

**Secondary Motion** (hair, cloth, tails):
```grump
hair {
    follow_through: head
    chain {
        segments: 5
        physics { gravity: 0.3, damping: 0.9, stiffness: 0.7 }
    }
    wind: scene.wind * 0.5
    collide: [body, shoulders]
}
```

**Soft Body Physics**:
```grump
entity Slime {
    soft_body {
        shape: circle
        points: 16
        physics { pressure: 1.0, stiffness: 0.3, damping: 0.9 }
        render { shader: gel { refraction: 0.1, specular: 0.8 } }
    }
}
```

### Advanced Particle System

**GPU-Accelerated Particles**:
```grump
particles fire {
    emit {
        rate: 100/s
        shape: cone { angle: 30deg, radius: 10, direction: up }
    }
    
    spawn {
        lifetime: 0.5s..1.5s
        speed: 50..100
        size: 10..20
        color: #ffaa00
    }
    
    over lifetime {
        size: curve { 0.0: 1.0, 0.3: 1.5, 1.0: 0.0 }
        color: gradient { 0.0: #ffff00, 0.3: #ff6600, 0.7: #ff0000, 1.0: #000000 }
        opacity: 1.0 -> 0.0, ease: quad.in
    }
    
    physics {
        gravity: (0, -50)
        drag: 0.5
        turbulence: { strength: 20, frequency: 2, octaves: 3 }
    }
    
    render {
        sprite: "fire_particle.png"
        blend: additive
        sort: by_age
        face_velocity: true
    }
    
    sub_emitters {
        on death { emit: smoke, count: 1 }
    }
}
```

**Ribbon/Trail Particles**:
```grump
particles sword_trail {
    type: ribbon
    ribbon {
        attach: sword.tip
        length: 20 points
        width: 15 -> 0
        texture: "trail.png"
    }
    emit_when: sword.velocity.magnitude > 100
}
```

---

## iOS GAME DESIGN SPECIALTY

### iOS-Specific Features

**Haptic Feedback** (Core Haptics):
```grump
haptics {
    pattern coin_collect {
        events: [
            transient(time: 0, intensity: 0.8, sharpness: 0.5),
            transient(time: 0.05, intensity: 0.4, sharpness: 0.8),
        ]
    }
}

on player.collect(coin) {
    haptic: coin_collect
}
```

**Advanced Touch Input**:
```grump
touch {
    gesture swipe {
        touches: 1
        direction: [left, right, up, down]
        min_velocity: 500
        
        on recognize(direction) {
            match direction {
                left -> player.dodge_left()
                right -> player.dodge_right()
                up -> player.jump()
                down -> player.slide()
            }
        }
    }
}
```

**Game Center Integration**:
```grump
game_center {
    leaderboards {
        define high_score {
            id: "com.game.leaderboard.highscore"
            sort: descending
        }
    }
    
    achievements {
        define first_win {
            id: "com.game.achievement.firstwin"
            points: 10
        }
    }
}

on game_over {
    game_center.submit(high_score, value: score)
    game_center.unlock(first_win)
}
```

**In-App Purchases**:
```grump
store {
    products {
        consumable coin_pack_small {
            id: "com.game.coins.100"
            coins: 100
        }
        
        subscription vip_monthly {
            id: "com.game.vip.monthly"
            duration: 1 month
        }
    }
}
```

**iCloud Save**:
```grump
cloud_save {
    sync {
        high_score: int
        unlocked_levels: list<int>
        save_game: SaveData { conflict_resolution: latest_wins }
    }
    auto_sync: true
}
```

**App Clips & Widgets**:
```grump
app_clip {
    entry: "src/app_clip/main.grump"
    include: ["assets/clip/*", "src/core/player.grump"]
}

widget game_status {
    sizes: [small, medium, large]
    data { daily_streak: int, next_reward_time: timestamp }
}
```

**Live Activities / Dynamic Island**:
```grump
live_activity match_status {
    view compact_leading { Image(player.avatar).size(20) }
    view compact_trailing { Text("{player.score} - {opponent.score}") }
    view expanded { HStack { PlayerScore(player), Text("VS"), PlayerScore(opponent) } }
}
```

### Metal Rendering Optimizations

**Pipeline Configuration**:
```grump
rendering {
    backend: metal
    pipeline {
        batch_size: 10000
        auto_batch: true
        atlas { max_size: 4096, auto_generate: true }
    }
}
```

**Custom Metal Shaders**:
```grump
shader water {
    uniforms {
        time: float
        wave_speed: float = 1.0
        water_color: color = #3388ff
    }
    
    vertex {
        let wave = sin(input.position.x * 0.1 + time * wave_speed) * wave_height
        output.position.y += wave
    }
    
    fragment {
        var color = water_color
        let fresnel = pow(1.0 - dot(view_dir, normal), 3.0)
        color = mix(color, reflect_color, fresnel * 0.3)
        output.color = color
    }
}
```

**2D Lighting System**:
```grump
lighting {
    ambient: #333344
    
    light torch {
        type: point
        color: #ffaa44
        radius: 150
        intensity: 1.0
        falloff: quadratic
    }
    
    light sun {
        type: directional
        color: #ffffee
        intensity: 0.8
        cast_shadows: true
    }
}
```

### Performance Profiling & Optimization

**Built-in Profiler**:
```grump
profiler {
    enabled: debug
    track { fps: true, frame_time: true, draw_calls: true, memory: true }
    overlay { position: top_left, show: [fps, frame_time, draw_calls] }
}
```

**Optimization Hints**:
```grump
@optimize(batch)
entity Bullet { ... }

@optimize(pool: 1000)
entity Particle { ... }

@optimize(lod: [50, 100, 200])
entity DetailedEnemy {
    lod 0 { skeleton: full, particles: all, shadows: true }
    lod 1 { skeleton: simplified, particles: reduced }
    lod 2 { sprite: static_image, animate: false }
}
```

**Device Capability Detection**:
```grump
device {
    let tier = device.performance_tier  # high | medium | low
    let has_120hz = device.supports_promotion
    
    quality {
        tier high { particles: 1.0, shadows: true, physics_rate: 120hz }
        tier medium { particles: 0.5, shadows: false, physics_rate: 60hz }
        tier low { particles: 0.2, shadows: false, physics_rate: 30hz }
    }
}
```

---

## Summary: G-Rump Complete Feature Set

### Foundations
✓ Strong type system with animation primitives  
✓ Rust-like ownership for performance  
✓ Entity Component System built-in  
✓ Module system with conditional compilation  
✓ Sassy error messages from G-Rump himself  

### Animation Engine
✓ After Effects-style curve editor in code  
✓ Spring physics animation  
✓ Expression bindings (reactive animation)  
✓ Full skeletal animation with IK  
✓ Animation state machines with blend trees  
✓ Procedural animation (legs, tentacles, soft bodies)  
✓ Secondary motion (hair, cloth, tails)  
✓ GPU particle system with sub-emitters  
✓ Ribbon/trail effects  

### iOS Specialization
✓ Metal rendering pipeline  
✓ Core Haptics integration  
✓ Advanced touch gestures  
✓ Game Center (leaderboards, achievements, multiplayer)  
✓ In-App Purchases  
✓ iCloud save sync  
✓ App Clips  
✓ Home Screen Widgets  
✓ Live Activities / Dynamic Island  
✓ Custom Metal shaders  
✓ 2D lighting system  
✓ Built-in profiler  
✓ Automatic quality scaling  

### Output
→ **iOS** (primary, Metal)  
→ **Android** (OpenGL ES)  
→ **Web** (WebGL)  

---

**🐸 "Your code is still mid but at least the animations are smooth."**

---

*This specification is part of G-Rump's knowledge base. The compiler implementation is in active development.*

