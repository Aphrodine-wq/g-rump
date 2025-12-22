# ZenCoder AI Coding Agent - Detailed Instructions

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design Principles](#architecture--design-principles)
3. [Code Style & Conventions](#code-style--conventions)
4. [File Structure & Organization](#file-structure--organization)
5. [Development Workflow](#development-workflow)
6. [Technology Stack](#technology-stack)
7. [Coding Standards](#coding-standards)
8. [Error Handling](#error-handling)
9. [Testing Requirements](#testing-requirements)
10. [Performance Guidelines](#performance-guidelines)
11. [Security Best Practices](#security-best-practices)
12. [Documentation Standards](#documentation-standards)
13. [Git Workflow](#git-workflow)
14. [Common Patterns & Anti-Patterns](#common-patterns--anti-patterns)
15. [Troubleshooting Guide](#troubleshooting-guide)

---

## Project Overview

### What is G-Rump?
G-Rump is an animation-first programming language and platform that enables developers to create interactive animations and games using a specialized domain-specific language (DSL). The platform consists of:

- **G-Rump Compiler**: Rust-based compiler that translates G-Rump code to multiple targets (iOS/Swift, Android/Kotlin, Web/JavaScript, Flutter/Dart)
- **Web Client**: React/TypeScript frontend for creating animations and games
- **iOS App**: Native Swift app for mobile animation creation
- **Backend API**: Node.js/Express server handling AI-powered animation generation
- **Game Development Workspace**: Integrated IDE for coding games in G-Rump

### Core Philosophy
1. **Animation-First**: Every feature should consider animation and visual feedback
2. **Developer Experience**: Tools should be intuitive and powerful
3. **Cross-Platform**: Code once, deploy everywhere
4. **Performance**: 60fps+ animations are non-negotiable
5. **Personality**: Grump character adds personality and humor to the platform

---

## Architecture & Design Principles

### Frontend Architecture (Web)

```
┌─────────────────────────────────────────────────────────┐
│                    App.tsx (Root)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │         ErrorBoundary (Error Handling)           │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  View Router (Landing/Chat/Templates/etc)   │ │  │
│  │  │  ┌──────────────────────────────────────┐  │ │  │
│  │  │  │  Component Tree                      │  │ │  │
│  │  │  │  - ChatInterface                     │  │ │  │
│  │  │  │  - GameDevWorkspace                  │  │ │  │
│  │  │  │  - Grump2 (Always Visible)           │  │ │  │
│  │  │  └──────────────────────────────────────┘  │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**State Management:**
- **Zustand** for global state (ChatStore, WorkspaceStore)
- **React Context** for component-level state
- **Local State** (useState) for UI-only state
- **URL Parameters** for sharing/deep linking

**Component Hierarchy:**
1. **App.tsx** - Root component, view routing
2. **ErrorBoundary** - Catches all React errors
3. **View Components** - LandingPage, ChatInterface, GameDevWorkspace, etc.
4. **Feature Components** - Grump2, MessageBubble, AnimationPreview
5. **Utility Components** - LoadingSkeleton, Toast, Modal

### Backend Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Express Server (server.js)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Middleware Stack                                │  │
│  │  - CORS, Body Parser, Error Handler             │  │
│  │  - Usage Limiter, Auth (future)                 │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Route Handlers                                   │  │
│  │  - /api/chat - Chat API                          │  │
│  │  - /api/animation - Animation generation         │  │
│  │  - /api/game - Game compilation                  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Services Layer                                   │  │
│  │  - animationService.js                           │  │
│  │  - phaserCodegen.js                               │  │
│  │  - usageService.js                               │  │
│  │  - groq.js / anthropic.js                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Compiler Architecture (Rust)

```
┌─────────────────────────────────────────────────────────┐
│              G-Rump Compiler Pipeline                    │
│                                                           │
│  Source Code → Lexer → Parser → Analyzer → Optimizer    │
│                    ↓                                      │
│              Code Generator                               │
│        (Swift/Kotlin/JS/Dart)                            │
└─────────────────────────────────────────────────────────┘
```

**Key Modules:**
- `lexer/` - Tokenizes source code
- `parser/` - Builds AST from tokens
- `analyzer/` - Type checking, validation
- `optimizer/` - Code optimization passes
- `codegen/` - Target-specific code generation
- `runtime/` - Runtime components (ECS, animation engine)

---

## Code Style & Conventions

### TypeScript/JavaScript

**Naming Conventions:**
```typescript
// Components: PascalCase
export default function ChatInterface() { }

// Functions/Variables: camelCase
const handleSend = () => { }
const messageText = ''

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3
const API_BASE_URL = 'https://api.example.com'

// Types/Interfaces: PascalCase
interface ChatMessage { }
type View = 'chat' | 'dashboard'

// Files: kebab-case
chat-interface.tsx
animation-preview.tsx
```

**File Organization:**
```typescript
// 1. Imports (external first, then internal)
import React from 'react'
import { motion } from 'framer-motion'
import ChatInterface from './ChatInterface'

// 2. Types/Interfaces
interface Props { }

// 3. Constants
const DEFAULT_CONFIG = { }

// 4. Component
export default function Component() { }

// 5. Helper functions
function helperFunction() { }
```

**Component Structure:**
```typescript
export default function Component({ prop1, prop2 }: Props) {
  // 1. Hooks (useState, useEffect, etc.)
  const [state, setState] = useState(initial)
  
  // 2. Refs
  const ref = useRef(null)
  
  // 3. Effects
  useEffect(() => { }, [])
  
  // 4. Event handlers
  const handleClick = () => { }
  
  // 5. Render
  return <div>...</div>
}
```

### Rust

**Naming Conventions:**
```rust
// Modules: snake_case
mod parser;

// Structs: PascalCase
struct ChatMessage { }

// Functions: snake_case
fn parse_message() { }

// Constants: UPPER_SNAKE_CASE
const MAX_TOKENS: usize = 1000;

// Types: PascalCase
type Result<T> = std::result::Result<T, GrumpError>;
```

**Error Handling:**
```rust
// Always use Result types
fn parse_code(input: &str) -> Result<AST> {
    // Use ? operator for error propagation
    let tokens = tokenize(input)?;
    let ast = parse(tokens)?;
    Ok(ast)
}

// Custom error types
#[derive(Debug)]
enum GrumpError {
    LexerError(String),
    ParserError(String),
    TypeError(String),
}
```

### CSS

**Naming:**
```css
/* BEM-like naming for components */
.chat-interface { }
.chat-interface__header { }
.chat-interface__header--active { }

/* Or simpler component-based */
.chat-header { }
.chat-messages { }
.chat-input { }
```

**Organization:**
```css
/* 1. Component root */
.component-name { }

/* 2. Child elements */
.component-name-child { }

/* 3. Modifiers */
.component-name--modifier { }

/* 4. Responsive */
@media (max-width: 768px) { }
```

---

## File Structure & Organization

### Web Client Structure
```
web/
├── public/
│   ├── grump2.js          # Global Grump2 script
│   └── vite.svg
├── src/
│   ├── components/        # React components
│   │   ├── ChatInterface.tsx
│   │   ├── GameDevWorkspace.tsx
│   │   ├── Grump2.tsx
│   │   └── ...
│   ├── store/             # Zustand stores
│   │   ├── ChatStore.ts
│   │   └── WorkspaceStore.ts
│   ├── services/          # API services
│   │   ├── animationApi.ts
│   │   └── ...
│   ├── hooks/             # Custom hooks
│   │   ├── useKeyboardShortcuts.ts
│   │   └── ...
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
└── vite.config.ts
```

### Backend Structure
```
backend/
├── routes/
│   ├── chat.js
│   ├── animation.js
│   └── game.js
├── services/
│   ├── animationService.js
│   ├── phaserCodegen.js
│   ├── usageService.js
│   └── groq.js
├── middleware/
│   └── usageLimiter.js
├── server.js
└── package.json
```

### Compiler Structure
```
grump-compiler/
├── src/
│   ├── lexer/
│   ├── parser/
│   ├── analyzer/
│   ├── optimizer/
│   ├── codegen/
│   ├── runtime/
│   ├── cli/
│   └── error.rs
├── Cargo.toml
└── README.md
```

---

## Development Workflow

### 1. Starting Development

```bash
# Web client
cd web
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev

# Compiler (Rust)
cd grump-compiler
cargo build
cargo run -- build
```

### 2. Making Changes

**For New Features:**
1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement feature following architecture patterns
3. Add tests if applicable
4. Update documentation
5. Commit with descriptive message
6. Push and create PR

**For Bug Fixes:**
1. Create bugfix branch: `git checkout -b fix/bug-description`
2. Reproduce and fix bug
3. Add regression test if possible
4. Commit with fix description
5. Push and create PR

### 3. Code Review Checklist

- [ ] Code follows style guidelines
- [ ] No TypeScript/Rust errors
- [ ] No console.logs or debug code
- [ ] Error handling implemented
- [ ] Performance considerations addressed
- [ ] Accessibility considered
- [ ] Mobile responsive (if UI change)
- [ ] Documentation updated
- [ ] Tests pass (if applicable)

### 4. Testing Before Commit

```bash
# TypeScript type checking
cd web && npm run build

# Rust compilation
cd grump-compiler && cargo check

# Linting (if configured)
npm run lint
```

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Zustand** - State management
- **TailwindCSS** - Styling (if used)

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Groq API** - AI model inference
- **Anthropic API** - AI model inference (backup)

### Compiler
- **Rust** - Systems programming
- **Cargo** - Package manager

### Game Development
- **Phaser 3** - Game framework (compilation target)

---

## Coding Standards

### TypeScript Best Practices

**Always Type Everything:**
```typescript
// ❌ Bad
function process(data) {
  return data.map(item => item.value)
}

// ✅ Good
function process(data: DataItem[]): number[] {
  return data.map((item: DataItem) => item.value)
}
```

**Use Interfaces for Props:**
```typescript
// ✅ Good
interface ChatInterfaceProps {
  onNavigate?: (view: View) => void
  initialMessage?: string
}

export default function ChatInterface({ 
  onNavigate, 
  initialMessage 
}: ChatInterfaceProps) { }
```

**Handle Null/Undefined:**
```typescript
// ❌ Bad
const value = obj.property.nested

// ✅ Good
const value = obj?.property?.nested ?? defaultValue
```

**Use Enums for Constants:**
```typescript
// ✅ Good
enum View {
  Landing = 'landing',
  Chat = 'chat',
  Dashboard = 'dashboard'
}
```

### React Best Practices

**Use Functional Components:**
```typescript
// ✅ Good
export default function Component() {
  return <div>...</div>
}

// ❌ Avoid class components (unless ErrorBoundary)
```

**Memoize Expensive Computations:**
```typescript
// ✅ Good
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])
```

**Clean Up Effects:**
```typescript
// ✅ Good
useEffect(() => {
  const timer = setInterval(() => { }, 1000)
  return () => clearInterval(timer)
}, [])
```

**Extract Custom Hooks:**
```typescript
// ✅ Good
function useChatMessages() {
  const [messages, setMessages] = useState([])
  // ... logic
  return { messages, sendMessage }
}
```

### Rust Best Practices

**Use Result for Error Handling:**
```rust
// ✅ Good
fn parse(input: &str) -> Result<AST, GrumpError> {
    // ...
}

// ❌ Avoid unwrap() in production code
let value = result.unwrap(); // Only in tests
```

**Leverage Pattern Matching:**
```rust
// ✅ Good
match token {
    Token::Identifier(name) => { },
    Token::Number(n) => { },
    Token::EOF => break,
    _ => return Err(GrumpError::UnexpectedToken),
}
```

**Use Ownership Wisely:**
```rust
// ✅ Good - borrow when possible
fn process(data: &Data) { }

// Only own when necessary
fn take_ownership(data: Data) { }
```

---

## Error Handling

### Frontend Error Handling

**Error Boundaries:**
```typescript
// Always wrap app in ErrorBoundary
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**API Error Handling:**
```typescript
try {
  const result = await api.call()
  return result
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network error
  } else if (error instanceof ValidationError) {
    // Handle validation error
  } else {
    // Handle unknown error
    console.error('Unexpected error:', error)
  }
  throw error // Re-throw if needed
}
```

**User-Friendly Error Messages:**
```typescript
// ❌ Bad
throw new Error('ERR_001: Invalid input')

// ✅ Good
throw new Error('Please enter a valid email address')
```

### Backend Error Handling

**Consistent Error Format:**
```javascript
// ✅ Good
res.status(400).json({
  error: {
    message: 'Invalid request',
    code: 'INVALID_REQUEST',
    details: {
      field: 'email',
      reason: 'Must be a valid email address'
    }
  }
})
```

**Error Middleware:**
```javascript
// Centralized error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR'
    }
  })
})
```

### Rust Error Handling

**Custom Error Types:**
```rust
#[derive(Debug)]
pub enum GrumpError {
    LexerError { message: String, line: usize },
    ParserError { message: String, token: Token },
    TypeError { message: String, location: Span },
}

impl std::fmt::Display for GrumpError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            GrumpError::LexerError { message, line } => {
                write!(f, "Lexer error at line {}: {}", line, message)
            }
            // ...
        }
    }
}
```

---

## Testing Requirements

### Frontend Testing

**Component Testing:**
```typescript
// Test component rendering
describe('ChatInterface', () => {
  it('renders without crashing', () => {
    render(<ChatInterface />)
  })
  
  it('handles message sending', async () => {
    const { getByPlaceholderText, getByText } = render(<ChatInterface />)
    const input = getByPlaceholderText('Type your message...')
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(getByText('Send'))
    // Assert message appears
  })
})
```

**Hook Testing:**
```typescript
// Test custom hooks
describe('useChatMessages', () => {
  it('initializes with empty messages', () => {
    const { result } = renderHook(() => useChatMessages())
    expect(result.current.messages).toEqual([])
  })
})
```

### Backend Testing

**API Endpoint Testing:**
```javascript
describe('POST /api/chat', () => {
  it('responds with chat message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' })
      .expect(200)
    
    expect(response.body).toHaveProperty('response')
  })
})
```

### Compiler Testing

**Unit Tests:**
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_lexer_basic() {
        let input = "entity Player";
        let tokens = tokenize(input).unwrap();
        assert_eq!(tokens[0], Token::Entity);
        assert_eq!(tokens[1], Token::Identifier("Player".to_string()));
    }
}
```

---

## Performance Guidelines

### Frontend Performance

**Code Splitting:**
```typescript
// ✅ Lazy load routes
const GameDevWorkspace = lazy(() => import('./components/GameDevWorkspace'))
```

**Memoization:**
```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id
})
```

**Virtual Scrolling:**
```typescript
// For long lists
import { FixedSizeList } from 'react-window'
```

**Image Optimization:**
```typescript
// Use WebP, lazy loading
<img src="image.webp" loading="lazy" alt="..." />
```

### Backend Performance

**Caching:**
```javascript
// Cache expensive operations
const cache = new Map()
function getCachedResult(key) {
  if (cache.has(key)) {
    return cache.get(key)
  }
  const result = expensiveOperation()
  cache.set(key, result)
  return result
}
```

**Database Queries:**
```javascript
// Use indexes, limit results
const messages = await db.messages
  .find({ userId })
  .limit(50)
  .sort({ createdAt: -1 })
```

**Rate Limiting:**
```javascript
// Implement rate limiting
app.use('/api/', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))
```

### Animation Performance

**60fps Target:**
- Use `requestAnimationFrame` for animations
- Avoid layout thrashing
- Use CSS transforms instead of position changes
- Batch DOM updates

```typescript
// ✅ Good - uses transform
element.style.transform = `translateX(${x}px)`

// ❌ Bad - causes layout recalculation
element.style.left = `${x}px`
```

---

## Security Best Practices

### Frontend Security

**Input Validation:**
```typescript
// Always validate user input
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
```

**XSS Prevention:**
```typescript
// Use React's built-in escaping
// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe
<div>{userInput}</div>
```

**API Key Protection:**
```typescript
// ❌ Never expose API keys in frontend
const API_KEY = 'secret-key' // BAD

// ✅ Use environment variables
const API_URL = import.meta.env.VITE_API_URL
```

### Backend Security

**Input Validation:**
```javascript
// Validate all inputs
const { body, validationResult } = require('express-validator')

app.post('/api/chat', [
  body('message').trim().isLength({ min: 1, max: 1000 }),
  body('userId').isUUID()
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  // ...
})
```

**Authentication:**
```javascript
// Always authenticate requests
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  req.user = decodeToken(token)
  next()
}
```

**SQL Injection Prevention:**
```javascript
// Use parameterized queries
// ❌ Dangerous
db.query(`SELECT * FROM users WHERE id = ${userId}`)

// ✅ Safe
db.query('SELECT * FROM users WHERE id = ?', [userId])
```

---

## Documentation Standards

### Code Comments

**Function Documentation:**
```typescript
/**
 * Sends a chat message to the API and updates local state
 * 
 * @param message - The message text to send
 * @param userId - Optional user ID for tracking
 * @returns Promise resolving to the API response
 * @throws {NetworkError} If the network request fails
 * @throws {ValidationError} If the message is invalid
 * 
 * @example
 * ```typescript
 * const response = await sendMessage('Hello', 'user-123')
 * console.log(response.text)
 * ```
 */
async function sendMessage(
  message: string, 
  userId?: string
): Promise<ChatResponse> {
  // Implementation
}
```

**Component Documentation:**
```typescript
/**
 * ChatInterface Component
 * 
 * Main chat interface for the G-Rump platform. Displays messages,
 * handles user input, and manages chat state.
 * 
 * @component
 * @example
 * ```tsx
 * <ChatInterface 
 *   onNavigate={(view) => console.log(view)}
 *   initialMessage="Hello"
 * />
 * ```
 */
export default function ChatInterface({ onNavigate, initialMessage }: Props) {
  // ...
}
```

### README Files

Every major directory should have a README.md:
- Project overview
- Setup instructions
- Usage examples
- API documentation (if applicable)
- Contributing guidelines

---

## Git Workflow

### Branch Naming

```
feature/feature-name        # New features
fix/bug-description         # Bug fixes
refactor/component-name     # Code refactoring
docs/documentation-update   # Documentation
test/test-description       # Adding tests
```

### Commit Messages

**Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(chat): add message timestamp display

fix(compiler): resolve type checking error in match expressions

docs(api): update animation endpoint documentation

refactor(components): extract Grump2 to separate component
```

### Pull Request Process

1. **Create PR** with descriptive title and description
2. **Link related issues** if applicable
3. **Request review** from team members
4. **Address feedback** and update PR
5. **Merge** after approval and CI passes

---

## Common Patterns & Anti-Patterns

### ✅ Good Patterns

**Custom Hooks for Reusable Logic:**
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}
```

**Error Boundaries:**
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    logErrorToService(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

**Service Layer Pattern:**
```typescript
// services/animationApi.ts
export const animationApi = {
  async createAnimation(params: AnimationParams): Promise<Animation> {
    const response = await fetch('/api/animation/create', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    return response.json()
  }
}
```

### ❌ Anti-Patterns

**Avoid Prop Drilling:**
```typescript
// ❌ Bad - passing props through many levels
<App>
  <Layout>
    <Header>
      <Nav>
        <Button onClick={handleClick} /> {/* handleClick defined in App */}
      </Nav>
    </Header>
  </Layout>
</App>

// ✅ Good - use context or state management
const NavigationContext = createContext()
```

**Avoid Direct DOM Manipulation:**
```typescript
// ❌ Bad
useEffect(() => {
  document.getElementById('myElement').style.color = 'red'
}, [])

// ✅ Good
const [color, setColor] = useState('black')
return <div style={{ color }}>...</div>
```

**Avoid Mutating State:**
```typescript
// ❌ Bad
const newMessages = messages
newMessages.push(newMessage)
setMessages(newMessages)

// ✅ Good
setMessages([...messages, newMessage])
```

---

## Troubleshooting Guide

### Common Issues

**"Face element not found" Error:**
- Ensure Grump2 component is always rendered (not conditional)
- Check that script loads after DOM is ready (use `defer`)
- Verify MutationObserver is working correctly

**TypeScript Build Errors:**
- Run `npm run build` to see all errors
- Check for unused variables (remove or prefix with `_`)
- Verify all imports are correct
- Check type definitions match usage

**React Rendering Issues:**
- Check for infinite loops in useEffect dependencies
- Verify keys are unique in lists
- Ensure state updates are not causing re-renders

**Performance Issues:**
- Use React DevTools Profiler
- Check for unnecessary re-renders
- Verify memoization is working
- Check bundle size with `npm run build -- --analyze`

**Backend API Errors:**
- Check server logs
- Verify environment variables are set
- Test endpoints with Postman/curl
- Check rate limiting isn't blocking requests

---

## Additional Guidelines

### When Adding New Features

1. **Plan First**: Understand the architecture before coding
2. **Follow Patterns**: Use existing patterns in the codebase
3. **Test Locally**: Verify it works before committing
4. **Update Docs**: Document new features
5. **Consider Performance**: Will this scale?
6. **Think Mobile**: Is it responsive?
7. **Accessibility**: Can users with disabilities use it?

### When Fixing Bugs

1. **Reproduce**: Can you consistently reproduce the bug?
2. **Isolate**: Find the minimal code that causes the issue
3. **Fix**: Implement the fix following code standards
4. **Test**: Verify the fix works and doesn't break anything
5. **Document**: Add a comment explaining the fix if non-obvious

### Code Review Focus Areas

- **Correctness**: Does it work as intended?
- **Performance**: Will it cause performance issues?
- **Security**: Are there security vulnerabilities?
- **Maintainability**: Is the code easy to understand?
- **Testing**: Are there adequate tests?
- **Documentation**: Is it well documented?

---

## Quick Reference

### File Extensions
- `.tsx` - React components with TypeScript
- `.ts` - TypeScript files
- `.css` - Stylesheets
- `.rs` - Rust source files
- `.js` - JavaScript files (backend)

### Import Paths
```typescript
// Absolute imports (from src/)
import { useChat } from '../store/ChatStore'
import ChatInterface from './ChatInterface'

// Relative imports
import './ChatInterface.css'
```

### Common Commands
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Rust
cargo build          # Build compiler
cargo test           # Run tests
cargo run -- build   # Run compiler

# Git
git status           # Check status
git add -A           # Stage all changes
git commit -m "..."  # Commit changes
git push             # Push to remote
```

---

## Final Notes

- **Always think about the user experience** - Every change should improve UX
- **Performance matters** - 60fps animations are a requirement
- **Code quality over speed** - Take time to write good code
- **Document as you go** - Future you will thank present you
- **Test your changes** - Don't assume it works
- **Ask questions** - Better to ask than guess wrong

Remember: You're building a platform that makes animation and game development accessible. Every line of code should reflect that mission.

---

**Last Updated:** 2024
**Version:** 1.0.0

