# Root Package.json

I've created a root-level `package.json` for the Grump platform!

## What It Does

This root `package.json` provides convenient scripts to manage the entire project:

### Installation
```bash
npm run install:all
```
Installs dependencies for root, backend, and web.

### Development

**Start both backend and web:**
```bash
npm run start:all
```

**Start individually:**
```bash
npm run start:backend  # Backend only
npm run start:web       # Web client only
```

**Development mode (with auto-reload):**
```bash
npm run dev:all         # Both with watch mode
npm run dev:backend      # Backend with watch
npm run dev:web         # Web with hot reload
```

### Build
```bash
npm run build:web       # Build web client for production
```

## Project Structure

```
grump/
├── package.json        ← Root package (NEW!)
├── backend/
│   └── package.json    ← Backend dependencies
└── web/
    └── package.json    ← Web dependencies
```

## Quick Start

1. **Install everything:**
   ```bash
   npm run install:all
   ```

2. **Add your API key to `backend/.env`:**
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

3. **Start everything:**
   ```bash
   npm run start:all
   ```

That's it! The backend will run on port 3000 and web on port 5173.

---

**"Fine. I have a package.json now. Happy?"** — Grump

