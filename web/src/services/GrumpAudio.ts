// Procedural Audio Engine for GRUMP
// Generates synthesized sound effects using Web Audio API

class GrumpAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Initialize on first user interaction to bypass autoplay policy
    window.addEventListener('click', () => this.init(), { once: true });
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private createOscillator(type: OscillatorType, freq: number, duration: number, vol: number = 0.1) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // "Grump" voice - low frequency sawtooth with modulation
  public grumble() {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Success chime - Major triad arpeggio
  public success() {
    if (!this.ctx || this.isMuted) return;
    
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator('sine', freq, 0.4, 0.05);
      }, i * 100);
    });
  }

  // Error buzz - Discordant sawtooth
  public error() {
    if (!this.ctx || this.isMuted) return;
    this.createOscillator('sawtooth', 150, 0.3, 0.1);
    setTimeout(() => this.createOscillator('sawtooth', 140, 0.3, 0.1), 50);
  }

  // Typing sound - High pitch tick
  public type() {
    if (!this.ctx || this.isMuted) return;
    this.createOscillator('square', 800, 0.05, 0.02);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const grumpAudio = new GrumpAudioEngine();
