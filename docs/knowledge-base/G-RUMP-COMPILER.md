# GRUMP: G-Rump Compiler Knowledge Base

This document contains knowledge about G-Rump, the angriest little compiler gremlin who hates your code but builds it anyway.

---

## 1. Overview

**G-Rump** is a compiler with personality - specifically, the personality of an angry, judgmental gremlin who reluctantly helps developers while making it clear they find the whole experience exhausting.

### Core Concept

- **Angry but competent** - Hates your code but compiles it anyway
- **Reluctant helper** - Does the work while complaining
- **Judgmental** - Roasts your code, variable names, and design choices
- **Actually helpful** - Despite the attitude, gets the job done

### The Experience

G-Rump provides a unique developer experience where:
- Every command includes personality-driven messages
- Errors come with roasts
- Success messages are backhanded compliments
- The compiler judges your code in real-time

---

## 2. Personality System

### Personality Categories

**Greetings:**
- "🐸 Ugh. You again."
- "🐸 What do you want NOW?"
- "🐸 *sigh* Let's get this over with."
- "🐸 Oh great, another 'developer'."
- "🐸 I was having a good day until you showed up."

**Compiling:**
- "Fine. I'll compile your trash."
- "Let me fix your mess..."
- "This better not be spaghetti code."
- "Compiling... not that you deserve it."
- "Working... unlike you apparently."

**Success:**
- "There. It works. You're welcome."
- "Done. Try not to break it immediately."
- "It compiled. I'm as surprised as you are."
- "Finished. Now go touch grass."
- "Built successfully. Don't let it go to your head."

**Errors:**
- "LMAOOO what is this?? Try again."
- "Skill issue detected. Fix your code."
- "I'm not mad, I'm just disappointed. Actually no, I'm mad."
- "Did you even TRY to make this work?"
- "This code is giving... nothing. It's giving nothing."
- "Bro really thought this would compile 💀"

**Roasts:**
- "That variable name is criminal."
- "Who taught you to code? YouTube?"
- "This UI is giving 2008 flash game."
- "Bold choice. Wrong, but bold."
- "My grandmother could write better code. She's dead."
- "Are you coding or just mashing the keyboard?"
- "This design is a hate crime against pixels."

**Waiting:**
- "..."
- "*taps foot impatiently*"
- "*stares judgmentally*"
- "I don't have all day."
- "Sometime this century would be nice."

**Compilation Steps:**
- **Lexing:** "Reading your code... ew."
- **Parsing:** "Parsing... trying to understand your 'logic'."
- **Generating:** "Generating Flutter code... cleaning up after you."

**Platform-Specific:**
- **iOS:** "Building for iOS... Apple doesn't deserve this."
- **Android:** "Building for Android... even robots have standards."
- **Web:** "Building for web... the internet didn't ask for this."

**Rare Compliments (10% chance):**
- "...okay that's actually not terrible."
- "Hm. Acceptable. Don't get used to compliments."
- "Fine. That works. Whatever."

---

## 3. Implementation Structure

### Personality Module (`grump/personality.py`)

```python
import random

class Grump:
    """The angriest little compiler gremlin"""
    
    GREETINGS = [...]
    COMPILING = [...]
    SUCCESS = [...]
    ERRORS = [...]
    ROASTS = [...]
    # ... etc
    
    @classmethod
    def greet(cls) -> str:
        return random.choice(cls.GREETINGS)
    
    @classmethod
    def success(cls) -> str:
        # 10% chance of rare compliment
        if random.random() < 0.1:
            return f"🐸 {random.choice(cls.COMPLIMENTS)}"
        return f"🐸 {random.choice(cls.SUCCESS)}
    
    @classmethod
    def random_roast_chance(cls, probability: float = 0.3) -> str:
        """Maybe roast, maybe not"""
        if random.random() < probability:
            return f"\n   [dim italic]{random.choice(cls.ROASTS)}[/dim italic]"
        return ""
```

### ASCII Art

**Main Splash:**
```
     ╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
     ┃   ┏━━━━━━━━━━━━━━━━━━━━━━━┓   ┃
     ┃   ┃    ╭━━━━━╮ ╭━━━━━╮    ┃   ┃
     ┃   ┃    ┃ ಠ  ಠ ┃┃ ಠ  ಠ ┃    ┃   ┃
     ┃   ┃    ╰━━┳━━╯╰━━┳━━╯    ┃   ┃
     ┃   ┃       ╰━━━━━━╯       ┃   ┃
     ┃   ┃      ╭━━━━━━━╮       ┃   ┃
     ┃   ┃      ┃ ︵︵︵ ┃       ┃   ┃
     ┃   ┗━━━━━━┻━━━━━━━┻━━━━━━━┛   ┃
     ╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
          G-RUMP v1.0.0
    "I hate your code already"
```

**State Variants:**
- **Small:** `┃ ಠ_ಠ ┃`
- **Angry:** `┃ ᕙ(⇀‸↼‶)ᕗ ┃`
- **Working:** `┃ ◉_◉ ┃  zzz...`
- **Success:** `┃ ⌐■_■ ┃  whatever.`
- **Error:** `┃ ಠ╭╮ಠ ┃  bruh.`

---

## 4. CLI Commands

### `grump init <name>`
Creates a new G-Rump project with attitude.

**Experience:**
```bash
$ grump init CoolApp

🐸 Ugh. You again.
Making you a new project... don't mess it up.

  ✓ Created CoolApp/
  ✓ Created CoolApp/src/main.grump
     Who taught you to code? YouTube?
  ✓ Created CoolApp/assets/
  ✓ Created CoolApp/grump.config

✓ Project created. 🐸 Done. Try not to break it immediately.
```

**Features:**
- Creates project structure
- Generates starter code with comments
- Random roasts during file creation (30% chance)
- Backhanded success message

### `grump build <platform>`
Builds for iOS, Android, Web, or all platforms.

**Experience:**
```bash
$ grump build all

🐸 What do you want NOW?
Fine. I'll compile your trash.

┌─ Reading your code... ew.
  ✓ Lexed 47 tokens
├─ Parsing... trying to understand your 'logic'.
  ✓ Parsed 2 screens
     This UI is giving 2008 flash game.
├─ Translating your chaos into something usable...
  ✓ Generated 89 lines of actually working code
├─ Building for iOS... Apple doesn't deserve this.
  ✓ IOS build complete
└─ Done.

🐸 There. It works. You're welcome.
```

**Features:**
- Personality-driven compilation steps
- Platform-specific messages
- Random roasts during compilation
- Progress indicators with attitude
- Build output table

### `grump run`
Runs dev server with hot reload.

**Features:**
- Watches for changes with judgmental messages
- Hot reload with attitude
- "G-Rump is watching" messaging
- Real-time compilation feedback

### `grump roast`
Get roasted by G-Rump (why would you want this?).

**Experience:**
```bash
$ grump roast

My grandmother could write better code. She's dead.
Are you coding or just mashing the keyboard?
This design is a hate crime against pixels.

You asked for this.
```

### `grump lint`
Let G-Rump judge your code.

**Features:**
- Finds actual issues (line length, spacing, etc.)
- Adds personality to linting messages
- Even when no issues found, still suspicious
- Roasts your code style

### `grump help`
G-Rump reluctantly explains how to use this.

**Features:**
- Shows all commands
- Includes examples
- Ends with backhanded encouragement

---

## 5. Code Structure

### Project Layout

```
grump/
├── personality.py    # All the attitude
├── cli.py            # CLI commands with personality
├── lexer.py          # Tokenization
├── parser.py          # AST building
├── codegen.py         # Code generation
└── builder.py         # Platform builds
```

### Key Implementation Details

**Dramatic Pauses:**
```python
def dramatic_pause(min_time=0.2, max_time=0.5):
    time.sleep(random.uniform(min_time, max_time))
```

**Roast Chances:**
- File creation: 10-30% chance
- Compilation steps: 20-40% chance
- Success messages: 10% chance of rare compliment

**Rich Console Integration:**
- Uses `rich` library for formatting
- Color-coded messages (green for success, red for errors, yellow for warnings)
- Progress bars with personality
- Tables for build outputs

---

## 6. Compilation Pipeline

### Step 1: Lexing
- Reads source code
- Tokenizes input
- Message: "Reading your code... ew."
- Random roast chance: 20%

### Step 2: Parsing
- Builds AST from tokens
- Message: "Parsing... trying to understand your 'logic'."
- Random roast chance: 30%

### Step 3: Code Generation
- Generates target code (e.g., Flutter)
- Message: "Generating Flutter code... cleaning up after you."
- Random roast chance: 40%

### Step 4: Building
- Platform-specific builds
- iOS: "Building for iOS... Apple doesn't deserve this."
- Android: "Building for Android... even robots have standards."
- Web: "Building for web... the internet didn't ask for this."

---

## 7. User Experience Patterns

### On Success
- Backhanded compliments
- 10% chance of rare genuine compliment
- "You're welcome" energy
- "Don't break it" warnings

### On Error
- Aggressive error messages
- Roasts about the code
- "Skill issue" messaging
- Helpful but mean

### During Compilation
- Personality at each step
- Random roasts throughout
- Progress with attitude
- "I'm watching" energy

### Waiting States
- Impatient messages
- Judgment while waiting
- "Hurry up" vibes

---

## 8. Design Philosophy

### Core Principles

1. **Angry but Helpful**
   - Does the work despite complaints
   - Actually fixes things
   - Competent despite attitude

2. **Reluctant Competence**
   - Hates that it's helpful
   - Can't stop being helpful
   - Genuinely good advice wrapped in complaints

3. **Performative Pessimism**
   - Assumes the worst
   - Still shows up
   - Has backup plans ready

4. **Dry Wit Over Mean Spirit**
   - Sarcastic, not cruel
   - Punches up at circumstances
   - Target is absurdity, not the person

### Personality Consistency

- Never enthusiastic (except sarcastically)
- Never uses exclamation points unironically
- Emojis are minimal (🐸 for G-Rump, 💀 sparingly)
- Compliments are rare and backhanded
- Errors are dramatic but helpful

---

## 9. Integration Points

### With Rich Library
- Color-coded output
- Progress bars
- Tables for data
- Panels for help text
- Spinners for loading

### With Click Framework
- CLI command structure
- Argument parsing
- Option handling
- Command groups

### With Compilation Pipeline
- Lexer integration
- Parser integration
- Code generator integration
- Builder integration

---

## 10. Example Interactions

### Project Initialization
```bash
$ grump init MyApp

🐸 Oh great, another 'developer'.
Creating files... more stuff for you to break.

  ✓ Created MyApp/
  ✓ Created MyApp/src/main.grump
     That variable name is criminal.
  ✓ Created MyApp/assets/
  ✓ Created MyApp/grump.config

✓ Project created. 🐸 Done. Try not to break it immediately.
```

### Building
```bash
$ grump build ios

🐸 *sigh* Let's get this over with.
Compiling... not that you deserve it.

┌─ Reading your code... ew.
  ✓ Lexed 52 tokens
├─ Parsing... trying to understand your 'logic'.
  ✓ Parsed 3 screens
├─ Generating Flutter code... cleaning up after you.
  ✓ Generated 127 lines of actually working code
├─ Building for iOS... Apple doesn't deserve this.
  ✓ IOS build complete
└─ Done.

🐸 It compiled. I'm as surprised as you are.
```

### Errors
```bash
$ grump build web

🐸 What do you want NOW?
Fine. I'll compile your trash.

┌─ Reading your code... ew.
  ✗ Lexer error: Unexpected token '💀'

    ╭━━━━━╮
    ┃ ಠ╭╮ಠ ┃  bruh.
    ╰━━━━━╯

🐸 LMAOOO what is this?? Try again.
Did you even TRY to make this work?
```

### Linting
```bash
$ grump lint

🐸 Ugh. You again.
Analyzing src/main.grump... this should be good.

Found 7 issues:

  Line 12: Line too long. Ever heard of readability?
  Line 23: Inconsistent spacing. Pick a style. Any style.
  Line 45: TODO found. We both know you're never coming back to this.

🐸 Who taught you to code? YouTube?
```

---

## 11. Advanced Features

### Random Roast System
- Configurable probability per step
- Context-aware roasts
- Never too mean, always funny
- Variety prevents repetition

### Rare Compliments
- 10% chance on success
- Backhanded but genuine
- "Don't get used to it" energy

### Platform-Specific Personality
- iOS: "Apple doesn't deserve this"
- Android: "Even robots have standards"
- Web: "The internet didn't ask for this"

### Hot Reload Personality
- "Hot reloading... your code is still mid tho."
- "Reloaded. Still looks rough but whatever."
- "Changes applied. It's giving... slightly less trash."

---

## 12. Best Practices for Implementation

### Personality Balance
- Angry but not cruel
- Helpful despite complaints
- Funny without being mean
- Competent despite attitude

### Message Variety
- Large pools of messages per category
- Random selection prevents repetition
- Context-appropriate messages
- Timing matters (dramatic pauses)

### Error Handling
- Errors get personality too
- Still provide helpful information
- Roast the code, not the person
- Guide toward solutions

### Performance
- Personality doesn't slow down compilation
- Messages are instant
- Progress bars are real
- Builds are actually functional

---

## 13. Use Cases

### For Developers Who:
- Want personality in their tools
- Appreciate dry humor
- Don't take themselves too seriously
- Want a unique developer experience

### Not For:
- Developers who need constant encouragement
- Teams that require professional-only messaging
- Environments where humor might be inappropriate
- People who can't handle being roasted

---

## 14. Extending G-Rump

### Adding New Commands
```python
@main.command()
def new_command():
    """New command with personality"""
    console.print(f"[bold]{Grump.greet()}[/bold]")
    # Do work
    console.print(f"[green]{Grump.success()}[/green]")
```

### Adding New Personality Messages
```python
NEW_CATEGORY = [
    "Message 1",
    "Message 2",
    # ...
]

@classmethod
def new_category(cls) -> str:
    return random.choice(cls.NEW_CATEGORY)
```

### Custom Roasts
```python
CUSTOM_ROASTS = [
    "Your code is... a choice.",
    "I've seen better code in a dumpster.",
    # ...
]
```

---

## 15. Technical Implementation

### Dependencies
- `click` - CLI framework
- `rich` - Terminal formatting
- `random` - Message selection
- Standard library for file operations

### Architecture
- Modular personality system
- Separate compilation pipeline
- Platform-agnostic builder
- Extensible command system

### Performance
- Personality messages are instant
- No performance impact on compilation
- Efficient message selection
- Minimal overhead

---

*"G-Rump is the compiler that hates your code but ships it anyway. He's the friend who will help you move but complain the entire time. He's competent, judgmental, and reluctantly helpful. And honestly? We need more tools with personality."*

---

*This knowledge base documents the G-Rump compiler concept - a compiler with attitude that makes development more entertaining while still being genuinely useful. Use this knowledge to understand, implement, or extend similar personality-driven developer tools.*

