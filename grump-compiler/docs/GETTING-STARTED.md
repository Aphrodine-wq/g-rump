# Getting Started with G-Rump

Welcome to G-Rump! This guide will help you get started building games with the animation-first programming language.

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/g-rump.git
cd g-rump/grump-compiler

# Build the compiler
cargo build --release

# The `grump` CLI will be at:
# ./target/release/grump
```

## Your First G-Rump Program

Create a file `hello.grump`:

```grump
@app "Hello G-Rump"
@fps 60

scene Main {
    Text("Hello, G-Rump!") {
        position: screen.center
        font: "Arial"
        size: 48
        color: #ffffff
        
        animate(loop) {
            scale: 1.0 -> 1.2 -> 1.0
        } duration: 2s, ease: sine
    }
}
```

Compile it:

```bash
grump build hello.grump --target ios
```

## Project Structure

```
my-game/
├── grump.manifest      # Project configuration
├── src/
│   ├── main.grump      # Entry point
│   ├── scenes/         # Game scenes
│   ├── entities/       # Game entities
│   └── components/     # Reusable components
├── assets/             # Sprites, audio, fonts
└── build/              # Compiled output
```

## Key Concepts

### 1. Everything is Animatable

In G-Rump, animation is native syntax:

```grump
Sprite("hero.png") {
    animate {
        position: (0, 0) -> (100, 100)
        rotation: 0deg -> 360deg
        scale: 1.0 -> 1.5 -> 1.0
    } duration: 1s, ease: expo.out
}
```

### 2. State Machines are Built-In

```grump
entity Player {
    state machine {
        state idle {
            sprite: "idle.png"
            on input.right -> running
        }
        
        state running {
            sprite: "run.png"
            on input.release -> idle
        }
    }
}
```

### 3. Physics is Native

```grump
entity Ball {
    physics {
        body: circle(16)
        mass: 1.0
        bounce: 0.8
    }
}
```

## Next Steps

- Read the [Language Specification v2.0](../docs/knowledge-base/G-RUMP-LANGUAGE-SPECIFICATION-V2.md)
- Check out [examples](../examples/)
- Join the community (coming soon!)

## Getting Help

🐸 **G-Rump says**: "Read the docs. Then read them again. Then ask questions. In that order."

