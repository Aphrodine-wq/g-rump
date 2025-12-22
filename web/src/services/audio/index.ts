import { AudioProcessor } from './AudioProcessor';
import { ProceduralAudio } from './ProceduralAudio';
import { SpotifyService, VoiceService } from './integrations/ExternalServices';

class AudioService {
  private ctx: AudioContext | null = null;
  public processor: AudioProcessor | null = null;
  public procedural: ProceduralAudio | null = null;
  public spotify: SpotifyService;
  public voice: VoiceService;

  constructor() {
    this.spotify = new SpotifyService();
    this.voice = new VoiceService();
    
    // Lazy init audio context
    window.addEventListener('click', () => this.init(), { once: true });
  }

  init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.processor = new AudioProcessor(this.ctx);
    this.procedural = new ProceduralAudio(this.ctx);
    
    console.log('AudioService: Initialized');
  }

  // Backward compatibility wrapper for GrumpAudio
  get grump() {
    if (!this.procedural) this.init();
    return this.procedural!;
  }
}

export const audioManager = new AudioService();
