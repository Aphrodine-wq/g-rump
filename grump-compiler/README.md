# G-Rump Language Compiler

**The Animation-First Programming Language for Games**

G-Rump is a modern programming language designed specifically for game development and animation. It compiles to iOS (Swift + Metal), Android (Kotlin + OpenGL), Web (JavaScript + WebGL), and Flutter (Dart + Skia).

## 🎯 Core Philosophy

> "Animation is not an afterthought. It's the point."

G-Rump treats animation as a first-class citizen, with native syntax for timelines, keyframes, easing, and more.

## ✨ Features

### Core Language
- ✅ **Animation-First Syntax**: Native support for animations, timelines, and keyframes
- ✅ **Entity Component System**: Built-in ECS for game logic
- ✅ **Type System**: Strong typing with animation primitives (vec2, color, duration, etc.)
- ✅ **Ownership Model**: Rust-like memory safety
- ✅ **Multi-Platform**: Compile to iOS, Android, Web, Flutter

### Advanced Features
- ✅ **Async/Await**: Modern asynchronous programming
- ✅ **Behavior Trees**: AI system with selectors, sequences, conditions, and actions
- ✅ **Shader System**: Custom shaders with uniforms (Metal/GLSL/WebGL)
- ✅ **Networking**: Built-in multiplayer support with sync and RPC
- ✅ **Macro System**: Code generation and metaprogramming
- ✅ **Plugin System**: Extensible architecture with plugin support
- ✅ **Debugger Integration**: Built-in debugging tools
- ✅ **Package Management**: Dependency management with versioning
- ✅ **Hot Reload**: Rapid development with live code updates
- ✅ **Visual Scripting**: Visual node-based programming support

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/g-rump.git
cd g-rump/grump-compiler

# Build the compiler
cargo build --release

# Install globally (optional)
cargo install --path .
```

## 🚀 Quick Start

### Hello World

```grump
@app "Hello G-Rump"
@fps 60

scene Main {
    Sprite("hero.png") {
        position: (100, 200)
        animate(loop) {
            y: 200 -> 220 -> 200
        } duration: 1s, ease: bounce
    }
}
```

### Async Example

```grump
async fn load_texture(path: string) -> result<Texture, Error> {
    let data = await fetch(path)
    return decode_image(data)
}
```

### Behavior Tree Example

```grump
behavior_tree enemy_ai {
    selector {
        sequence {
            condition: player_in_range(100)
            action: attack()
        }
        action: patrol()
    }
}
```

### Shader Example

```grump
shader dissolve {
    uniforms {
        progress: float = 0.0
        noise_texture: texture
    }
    vertex { /* vertex code */ }
    fragment { /* fragment code */ }
}
```

## 📚 Documentation

- [Language Specification](LANGUAGE-EXTENSIONS.md) - Complete feature documentation
- [Examples](EXAMPLES.md) - Code examples for all features
- [Feature Summary](COMPLETE-FEATURE-SUMMARY.md) - Implementation status
- [Implementation Plan](FEATURE-IMPLEMENTATION-PLAN.md) - Development roadmap

## 🎮 Example Projects

See the `examples/` directory for complete examples:
- `async-example.grump` - Async/await patterns
- `behavior-tree-example.grump` - AI behavior trees
- `shader-example.grump` - Custom shaders
- `network-example.grump` - Multiplayer networking
- `macro-example.grump` - Code generation macros
- `plugin-example.grump` - Plugin system
- `debugger-example.grump` - Debugging tools
- `package-example.grump` - Package management

## 🛠️ Compiler Usage

```bash
# Compile a G-Rump file
grump compile game.grump --target ios

# Run with hot reload
grump run game.grump --hot-reload

# Debug mode
grump debug game.grump

# Check syntax
grump check game.grump

# Format code
grump format game.grump
```

## 🏗️ Architecture

```
┌─────────────┐
│   Source    │  .grump files
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Lexer    │  Tokenization
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Parser    │  AST construction
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Analyzer   │  Type checking, validation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Optimizer  │  Dead code elimination, optimization
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Codegen    │  Target code generation
└──────┬──────┘
       │
       ├──► Swift + Metal (iOS)
       ├──► Kotlin + OpenGL (Android)
       ├──► JavaScript + WebGL (Web)
       └──► Dart + Skia (Flutter)
```

## 🎨 Why G-Rump?

| Feature | Unity/C# | Flutter/Dart | SwiftUI | **G-Rump** |
|---------|----------|--------------|---------|------------|
| Animation | Component | Library | Modifier | **Native syntax** |
| Timelines | Editor | None | None | **First-class** |
| State Machines | Asset | Manual | None | **Built-in** |
| Easing | Import | Limited | Limited | **30+ built-in** |
| Physics | Built-in | Plugin | None | **Native** |
| Particles | Built-in | Plugin | None | **Native syntax** |
| Learning Curve | Steep | Medium | Medium | **Minimal** |

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

See [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

G-Rump is built with love (and a healthy dose of grumpiness) for game developers who want to focus on creating, not fighting with frameworks.

---

**Made with G-Rump** 🐸
