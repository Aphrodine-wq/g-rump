import { MusicPlatform, SpeechToText, TextToSpeech } from './ServiceTypes';

// Mock Spotify Integration
export class SpotifyService implements MusicPlatform {
  name: 'spotify' = 'spotify';
  private isConnected = false;

  async connect(): Promise<boolean> {
    console.log('Spotify: Connecting...');
    await new Promise(r => setTimeout(r, 1000));
    this.isConnected = true;
    console.log('Spotify: Connected');
    return true;
  }

  async play(trackId: string): Promise<void> {
    if (!this.isConnected) throw new Error('Spotify not connected');
    console.log(`Spotify: Playing track ${trackId}`);
  }

  async pause(): Promise<void> {
    console.log('Spotify: Paused');
  }

  async search(query: string): Promise<any[]> {
    console.log(`Spotify: Searching for ${query}`);
    return [
      { id: 'mock-1', title: `Song matching ${query}`, artist: 'Mock Artist' }
    ];
  }
}

// Mock Voice Service (Google/AWS wrapper)
export class VoiceService implements SpeechToText, TextToSpeech {
  private recognition: any;
  public onResult: (text: string) => void = () => {};

  constructor() {
    // Basic browser support check
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      
      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          // @ts-ignore
          .map(result => result[0].transcript)
          .join('');
        this.onResult(transcript);
      };
    }
  }

  startListening() {
    if (this.recognition) {
      this.recognition.start();
      console.log('Voice: Listening...');
    } else {
      console.warn('Voice: Browser does not support Speech Recognition');
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      console.log('Voice: Stopped');
    }
  }

  async speak(text: string, voice: string = 'Google US English'): Promise<void> {
    console.log(`TTS (${voice}): ${text}`);
    
    // Browser fallback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }
}
