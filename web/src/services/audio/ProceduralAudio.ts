
// Procedural Audio Engine
// Generates synthesized sound effects using Web Audio API
// Upgraded for G-Rump 3.0: FM Synthesis & Envelopes

export class ProceduralAudio {
  private ctx: AudioContext;
  private masterGain: GainNode;

  constructor(context: AudioContext) {
    this.ctx = context;
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.5;
  }

  // --- Sound Effects ---

  // A low, rumbling grumble (FM Synthesis)
  public grumble() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const modGain = this.ctx.createGain();

    // Carrier
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.3);

    // Modulator (for the "growl" texture)
    mod.type = 'sine';
    mod.frequency.setValueAtTime(30, t);
    
    // Connections
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.masterGain);

    // Envelopes
    modGain.gain.setValueAtTime(50, t);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.start(t);
    mod.start(t);
    osc.stop(t + 0.5);
    mod.stop(t + 0.5);
  }

  // A happy "ding" (Major arpeggio)
  public success() {
    const t = this.ctx.currentTime;
    
    const playNote = (freq: number, time: number) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.1, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(time);
      osc.stop(time + 0.5);
    };

    // C Major Arpeggio (C5, E5, G5, C6)
    playNote(523.25, t);
    playNote(659.25, t + 0.1);
    playNote(783.99, t + 0.2);
    playNote(1046.50, t + 0.3);
  }

  // An annoying error buzz
  public error() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Typewriter click
  public type() {
    // Noise burst simulation for mechanical click
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, t);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public setVolume(vol: number) {
    this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
  }
}
