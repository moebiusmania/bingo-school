/**
 * The audio engine: every sound effect is synthesized on the fly with the
 * Web Audio API, no audio files needed. The effects themselves are recipes of
 * tones and noise bursts, defined by each theme's SoundPack (see sound.ts).
 */

export interface ToneOptions {
  type?: OscillatorType;
  freq: number;
  /** Exponential glide target reached at the end of the note. */
  to?: number;
  /** Arbitrary pitch path as [secondsFromStart, frequency] points. */
  path?: Array<[number, number]>;
  at?: number;
  dur: number;
  vol?: number;
  attack?: number;
  reverb?: number;
  vibrato?: { rate: number; depth: number };
  filter?: { type: BiquadFilterType; freq: number; q?: number };
}

export interface NoiseOptions {
  at?: number;
  dur: number;
  vol?: number;
  attack?: number;
  reverb?: number;
  filter: BiquadFilterType;
  freq: number;
  to?: number;
  q?: number;
}

const MASTER_VOLUME = 0.8;
/** Effects volume while the voice is speaking, so the number is heard clearly. */
const DUCKED_VOLUME = 0.12;

function makeImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
  }
  return buffer;
}

export class Synth {
  #ctx: AudioContext | null = null;
  #master!: GainNode;
  #reverbIn!: GainNode;
  #noise!: AudioBuffer;
  #muted = false;
  #ducked = false;

  setMuted(muted: boolean): void {
    this.#muted = muted;
    this.#applyVolume();
  }

  /** Lowers the effects while speech is playing. */
  duck(ducked: boolean): void {
    this.#ducked = ducked;
    this.#applyVolume();
  }

  #applyVolume(): void {
    if (!this.#ctx) return;
    const target = this.#muted ? 0 : this.#ducked ? DUCKED_VOLUME : MASTER_VOLUME;
    this.#master.gain.setTargetAtTime(target, this.#ctx.currentTime, 0.08);
  }

  /** Lazily creates the audio graph (browsers require a user gesture first). */
  #context(): AudioContext | null {
    if (this.#muted) return null;
    if (!this.#ctx) {
      const ctx = new AudioContext();
      this.#master = ctx.createGain();
      this.#master.gain.value = MASTER_VOLUME;
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.ratio.value = 4;
      this.#master.connect(compressor).connect(ctx.destination);

      const convolver = ctx.createConvolver();
      convolver.buffer = makeImpulse(ctx, 2.8, 2.6);
      this.#reverbIn = ctx.createGain();
      this.#reverbIn.gain.value = 0.6;
      this.#reverbIn.connect(convolver).connect(this.#master);

      this.#noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = this.#noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.#ctx = ctx;
    }
    if (this.#ctx.state === 'suspended') void this.#ctx.resume();
    return this.#ctx;
  }

  #bus(ctx: AudioContext, reverb: number): GainNode {
    const bus = ctx.createGain();
    bus.connect(this.#master);
    if (reverb > 0) {
      const send = ctx.createGain();
      send.gain.value = reverb;
      bus.connect(send).connect(this.#reverbIn);
    }
    return bus;
  }

  #envelope(ctx: AudioContext, t0: number, dur: number, vol: number, attack: number): GainNode {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    return g;
  }

  tone(o: ToneOptions): void {
    const ctx = this.#context();
    if (!ctx) return;
    const t0 = ctx.currentTime + (o.at ?? 0);
    const osc = ctx.createOscillator();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur);
    for (const [t, f] of o.path ?? []) osc.frequency.linearRampToValueAtTime(f, t0 + t);

    if (o.vibrato) {
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = o.vibrato.rate;
      depth.gain.value = o.vibrato.depth;
      lfo.connect(depth).connect(osc.frequency);
      lfo.start(t0);
      lfo.stop(t0 + o.dur + 0.05);
    }

    let node: AudioNode = osc;
    if (o.filter) {
      const f = ctx.createBiquadFilter();
      f.type = o.filter.type;
      f.frequency.value = o.filter.freq;
      f.Q.value = o.filter.q ?? 1;
      node = node.connect(f);
    }
    node
      .connect(this.#envelope(ctx, t0, o.dur, o.vol ?? 0.2, o.attack ?? 0.01))
      .connect(this.#bus(ctx, o.reverb ?? 0.2));
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.05);
  }

  noise(o: NoiseOptions): void {
    const ctx = this.#context();
    if (!ctx) return;
    const t0 = ctx.currentTime + (o.at ?? 0);
    const src = ctx.createBufferSource();
    src.buffer = this.#noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = o.filter;
    filter.Q.value = o.q ?? 1;
    filter.frequency.setValueAtTime(o.freq, t0);
    if (o.to) filter.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur);
    src
      .connect(filter)
      .connect(this.#envelope(ctx, t0, o.dur, o.vol ?? 0.2, o.attack ?? 0.01))
      .connect(this.#bus(ctx, o.reverb ?? 0.1));
    src.start(t0, Math.random());
    src.stop(t0 + o.dur + 0.05);
  }
}
