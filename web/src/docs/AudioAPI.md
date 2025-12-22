# Audio System Documentation

## Overview
The G-Rump Audio System is a modular, high-performance audio engine built on the Web Audio API. It supports procedural sound generation, file playback, and third-party service integrations.

## Architecture

### 1. AudioProcessor (`services/audio/AudioProcessor.ts`)
Handles raw audio manipulation.
- **Normalization**: Uses `DynamicsCompressorNode` to level audio output.
- **Streaming**: Supports HLS/DASH via browser native implementation.
- **Formats**: MP3, WAV, AAC, FLAC, OGG.

### 2. ProceduralAudio (`services/audio/ProceduralAudio.ts`)
Synthesizes sound effects in real-time (no assets required).
- `grumble()`: Sawtooth wave with LFO modulation.
- `success()`: Major triad arpeggio.
- `error()`: Discordant buzz.

### 3. Integrations (`services/audio/integrations/`)
- **Spotify**: Mock implementation of OAuth flow and playback control.
- **Voice**: Wraps `webkitSpeechRecognition` and `speechSynthesis`.

## Usage

```typescript
import { audioManager } from '../services/audio';

// Initialize (happens automatically on first click)
audioManager.init();

// Play procedural sound
audioManager.grump.success();

// Play file
await audioManager.processor?.playFile('https://example.com/sound.mp3');

// Text to Speech
audioManager.voice.speak('Hello World');
```

## Troubleshooting

### No Sound?
1. **Autoplay Policy**: Browsers block audio until user interaction. Ensure the user has clicked at least once.
2. **Format Support**: Check if the browser supports the file format (e.g. OGG on Safari).

### Rate Limits
- **Spotify**: 50 requests / second.
- **Google TTS**: 1 million characters / month (free tier).
