export interface MusicPlatform {
  name: 'spotify' | 'soundcloud' | 'youtube';
  connect(): Promise<boolean>;
  play(trackId: string): Promise<void>;
  pause(): Promise<void>;
  search(query: string): Promise<any[]>;
}

export interface SpeechToText {
  startListening(): void;
  stopListening(): void;
  onResult: (text: string) => void;
}

export interface TextToSpeech {
  speak(text: string, voice?: string): Promise<void>;
}
