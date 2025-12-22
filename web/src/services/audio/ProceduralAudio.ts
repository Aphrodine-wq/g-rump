// Procedural Audio Engine
// Generates synthesized sound effects using Web Audio API

export class ProceduralAudio {
  private ctx: AudioContext;
  private masterGain: GainNode;

  constructor(context: AudioContext) {
    this.ctx = context;
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
  }

  private createOscillator(type: OscillatorType, freq: number, duration: number, vol: number = 0.1) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // "Grump" voice - low frequency sawtooth with modulation
  public grumble() {
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
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Success chime - Major triad arpeggio
  public success() {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator('sine', freq, 0.4, 0.05);
      }, i * 100);
    });
  }

  // Error buzz - Discordant sawtooth
  public error() {
    this.createOscillator('sawtooth', 150, 0.3, 0.1);
    setTimeout(() => this.createOscillator('sawtooth', 140, 0.3, 0.1), 50);
  }

  // Typing sound - High pitch tick
  public type() {
    this.createOscillator('square', 800, 0.05, 0.02);
  }

  public setVolume(vol: number) {
    this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
  }
}
