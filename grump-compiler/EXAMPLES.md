# G-Rump Language Examples

This directory contains example code demonstrating all the new features in G-Rump.

## Examples

### 1. Async/Await (`async-example.grump`)
Demonstrates asynchronous operations for loading assets, network requests, and concurrent operations.

**Key Features:**
- `async fn` for asynchronous functions
- `await` for waiting on async operations
- Error handling with `result<T, E>`

### 2. Behavior Trees (`behavior-tree-example.grump`)
Shows how to create AI behavior using behavior trees with selectors, sequences, conditions, and actions.

**Key Features:**
- `behavior_tree` declarations
- `selector` (priority-based)
- `sequence` (all must succeed)
- `condition` and `action` nodes

### 3. Shaders (`shader-example.grump`)
Demonstrates custom shader creation with uniforms, vertex, and fragment shaders.

**Key Features:**
- `shader` declarations
- `uniforms` for shader parameters
- `vertex` and `fragment` shader code
- Shader application to entities

### 4. Networking (`network-example.grump`)
Shows multiplayer networking with synchronized state and RPC calls.

**Key Features:**
- `network` declarations
- `sync` for state synchronization
- `rpc` for remote procedure calls
- Network connection management

### 5. Macros (`macro-example.grump`)
Demonstrates code generation macros for reducing boilerplate.

**Key Features:**
- `macro` declarations
- Block parameters
- Code expansion
- Reusable patterns

### 6. Plugins (`plugin-example.grump`)
Shows how to use and declare plugins for extending functionality.

**Key Features:**
- `plugin` declarations
- Local and remote plugins
- Dependency management
- Plugin exports

### 7. Debugger (`debugger-example.grump`)
Demonstrates debugger integration for development and debugging.

**Key Features:**
- `debugger.break()` for breakpoints
- `debugger.watch()` for variable watching
- `debugger.log()` for logging
- `debugger.assert()` for assertions
- `debugger.trace()` for function tracing

### 8. Package Management (`package-example.grump`)
Shows package declarations and dependency management.

**Key Features:**
- `package` declarations
- Version constraints
- Git dependencies
- Local path dependencies
- Feature flags
- Dev dependencies

## Running Examples

```bash
# Compile an example
grump compile examples/async-example.grump --target ios

# Run with hot reload
grump run examples/behavior-tree-example.grump --hot-reload

# Debug an example
grump debug examples/debugger-example.grump
```

## Next Steps

1. Add more complex examples
2. Add game-specific examples
3. Add performance optimization examples
4. Add platform-specific examples

