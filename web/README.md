# Grump Web Client

Windows-compatible web version of Grump that syncs with the same backend API as the iOS app.

## Features

- ✅ Full chat interface with Grump personality
- ✅ Animated Grump avatar with expressions
- ✅ Real-time message streaming
- ✅ Syncs with iOS app via shared backend
- ✅ Electron wrapper for native Windows app
- ✅ Responsive design

## Setup

### Prerequisites

- Node.js 18+ and npm
- Backend server running (see `../backend/README.md`)

### Installation

```bash
cd web
npm install
```

### Development

Run the web app in development mode:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

For production, update this to your production backend URL.

## Electron App (Windows)

### Development

Run as Electron app during development:

```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server
2. Launch Electron when ready

### Build

Build for production:

```bash
npm run build
npm run electron:build
```

This creates a Windows installer in the `dist` folder.

## Architecture

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Framer Motion** - Animations
- **Zustand** - State management (via React Context)
- **Axios** - HTTP client
- **Vite** - Build tool
- **Electron** - Desktop wrapper

## Sync with iOS

Both the iOS app and web client connect to the same backend API at `http://localhost:3000/api/chat`. They share:

- Same conversation history (via backend)
- Same Grump personality
- Same API endpoints

**Note:** For true sync, you'd need to implement:
- User authentication
- Cloud storage for messages
- Real-time updates (WebSockets)

Currently, each client maintains its own local state but uses the same backend for AI responses.

## Building for Production

1. Update `.env` with production API URL
2. Build the web app: `npm run build`
3. Build Electron app: `npm run electron:build`

The Windows installer will be in `dist/`.

## Troubleshooting

### Can't connect to backend

- Ensure backend is running on `http://localhost:3000`
- Check `VITE_API_URL` in `.env`
- For Electron, ensure CORS is configured on backend

### Electron app won't start

- Make sure you've run `npm install`
- Check that Vite dev server is running (for dev mode)
- Check console for errors

## License

ISC

