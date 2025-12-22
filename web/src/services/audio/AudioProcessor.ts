// Audio Processor Service
// Handles file playback, streaming, normalization, and volume control

export class AudioProcessor {
  private ctx: AudioContext;
  private compressor: DynamicsCompressorNode;
  private masterGain: GainNode;
  private activeSources: Map<string, AudioBufferSourceNode | MediaElementAudioSourceNode> = new Map();

  constructor(context: AudioContext) {
    this.ctx = context;
    
    // Audio Pipeline: Source -> Compressor (Normalization) -> Master Gain -> Destination
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  /**
   * Load and play an audio file (Buffer based)
   * Supports MP3, WAV, AAC, FLAC, OGG via browser decoding
   */
  async playFile(url: string, id: string = 'main'): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.compressor);
      
      source.start(0);
      this.activeSources.set(id, source);
      
      source.onended = () => this.activeSources.delete(id);
    } catch (error) {
      console.error(`AudioProcessor: Failed to play file ${url}`, error);
      throw error;
    }
  }

  /**
   * Stream audio using HTML5 Audio Element (Adaptive Bitrate via browser)
   */
  playStream(url: string, id: string = 'stream'): HTMLAudioElement {
    const audio = new Audio(url);
    audio.crossOrigin = 'anonymous';
    
    // Connect to Web Audio API for processing
    const source = this.ctx.createMediaElementSource(audio);
    source.connect(this.compressor);
    
    audio.play().catch(e => console.error('Stream play failed', e));
    this.activeSources.set(id, source);
    
    return audio;
  }

  setVolume(value: number) {
    // Clamp between 0 and 1
    const vol = Math.max(0, Math.min(1, value));
    this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
  }

  stopAll() {
    this.activeSources.forEach((source) => {
      if (source instanceof AudioBufferSourceNode) {
        source.stop();
      } else {
        // MediaElementAudioSourceNode doesn't have stop, active element needs to be paused
        // This is a simplified implementation
        source.disconnect();
      }
    });
    this.activeSources.clear();
  }

  getDiagnosticInfo() {
    return {
      state: this.ctx.state,
      activeSources: this.activeSources.size,
      volume: this.masterGain.gain.value,
      compressionReduction: this.compressor.reduction
    };
  }
}
