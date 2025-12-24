---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
G-Rump is a multi-platform AI assistant with a unique personality-driven interface. It features an animation-first programming language, a compiler, and clients for Web, iOS, and Mobile. The project is organized as a monorepo containing the backend, web client, compiler, mobile app, and native iOS app.

## Repository Structure
- **backend/**: Node.js/Express API server.
- **web/**: React/Vite web client.
- **grump-compiler/**: Rust-based compiler for the G-Rump language.
- **mobile/**: React Native/Expo mobile application.
- **ios/**: Native Swift iOS application.
- **grump-ai/**: Next.js frontend and Node.js backend for the AI animation service.

## Projects

### Backend (`backend/`)
**Configuration File**: `package.json`

#### Language & Runtime
**Language**: Node.js (ES Modules)
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- express
- @anthropic-ai/sdk
- axios
- cors
- dotenv
- express-rate-limit
- pdf-parse

#### Build & Installation
```bash
npm install
npm start      # Run production
npm run dev    # Run development
```

### Web Client (`web/`)
**Configuration File**: `package.json`, `vite.config.ts`

#### Language & Runtime
**Language**: TypeScript, React
**Build System**: Vite
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- react
- react-dom
- framer-motion
- zustand
- axios

**Development Dependencies**:
- typescript
- tailwindcss
- vite
- @vitejs/plugin-react

#### Build & Installation
```bash
npm install
npm run dev    # Start dev server
npm run build  # Build for production
npm run preview
```

### G-Rump Compiler (`grump-compiler/`)
**Configuration File**: `Cargo.toml`

#### Language & Runtime
**Language**: Rust (Edition 2021)
**Build System**: Cargo

#### Dependencies
**Main Dependencies**:
- logos (Lexer)
- lalrpop (Parser)
- anyhow, thiserror (Error handling)
- serde, serde_json
- clap (CLI)
- colored
- walkdir
- regex
- rand

#### Build & Installation
```bash
cargo build
cargo run -- build
```

### Mobile App (`mobile/`)
**Configuration File**: `package.json`, `app.json`

#### Language & Runtime
**Language**: TypeScript, React Native
**Framework**: Expo (SDK 54)
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- expo
- react-native
- expo-router
- zustand
- axios
- react-native-svg

#### Build & Installation
```bash
npm install
npm start      # Start Expo
npm run android
npm run ios
npm run web
```

### iOS App (`ios/`)
**Configuration File**: `Grump.xcodeproj`

#### Language & Runtime
**Language**: Swift
**Platform**: iOS 16.0+
**IDE**: Xcode 15.0+

#### Build & Installation
Open `ios/Grump.xcodeproj` in Xcode and build/run on a simulator or device.

### Grump AI (`grump-ai/`)

#### Frontend (`grump-ai/frontend/`)
**Framework**: Next.js, React
**Language**: TypeScript
**Dependencies**: next, react, framer-motion, zustand, axios, tailwindcss
**Commands**: `npm run dev`, `npm run build`

#### Backend (`grump-ai/backend/`)
**Language**: Node.js (ES Modules)
**Dependencies**: uuid

## Root Commands
The root `package.json` provides scripts to manage the workspace:

```bash
npm run install:all   # Install dependencies for backend and web
npm run start:all     # Start backend and web concurrently
npm run dev:all       # Start backend and web in dev mode
```
