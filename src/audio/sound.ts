/**
 * All sound effects are synthesized on the fly with the Web Audio API:
 * no audio files needed.
 */

interface ToneOptions {
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

interface NoiseOptions {
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

class SoundEngine {
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

  #tone(o: ToneOptions): void {
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

  #noiseBurst(o: NoiseOptions): void {
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

  /** Short "plip" for button presses. */
  click(): void {
    this.#tone({ type: 'square', freq: 520, to: 820, dur: 0.08, vol: 0.06, reverb: 0 });
  }

  /** Bubbling cauldron with a slowing-down wheel tick. */
  shuffle(seconds: number): void {
    this.#noiseBurst({ dur: seconds, vol: 0.18, attack: 0.3, filter: 'lowpass', freq: 160, reverb: 0 });
    this.#tone({
      type: 'sawtooth', freq: 55, dur: seconds, vol: 0.07, attack: 0.4,
      filter: { type: 'lowpass', freq: 220 }, reverb: 0,
    });

    const scale = [880, 987.8, 1174.7, 1318.5, 1568];
    for (let t = 0, gap = 0.05; t < seconds - 0.15; t += gap, gap *= 1.07) {
      this.#tone({
        type: 'triangle', freq: scale[Math.floor(Math.random() * scale.length)],
        at: t, dur: 0.06, vol: 0.1, reverb: 0.15,
      });
    }
    for (let t = 0.05; t < seconds - 0.1; t += 0.07 + Math.random() * 0.14) {
      const f = 160 + Math.random() * 260;
      this.#tone({ freq: f, to: f * 2.6, at: t, dur: 0.08, vol: 0.13, reverb: 0.1 });
    }
  }

  /** Magical chime, a deep "bong" and a ghostly "woooo". */
  reveal(): void {
    this.#tone({ freq: 110, to: 98, dur: 1.8, vol: 0.28, attack: 0.005, reverb: 0.5 });
    this.#tone({ type: 'triangle', freq: 220, to: 196, dur: 1.2, vol: 0.1, attack: 0.005, reverb: 0.5 });
    [440, 523.25, 659.25, 880, 1046.5, 1318.5].forEach((freq, i) =>
      this.#tone({ type: 'triangle', freq, at: 0.05 + i * 0.07, dur: 1, vol: 0.12, reverb: 0.6 })
    );
    this.#tone({
      freq: 2093, at: 0.4, dur: 1.2, vol: 0.04, attack: 0.2, reverb: 0.8,
      vibrato: { rate: 9, depth: 18 },
    });
    this.#tone({
      freq: 280, path: [[0.35, 520], [0.75, 470], [1.2, 300]], at: 0.55, dur: 1.3,
      vol: 0.11, attack: 0.25, reverb: 0.8, vibrato: { rate: 5.5, depth: 14 },
    });
  }

  /** Swoosh while the number flies to the board. */
  whoosh(): void {
    this.#noiseBurst({ dur: 0.65, vol: 0.22, attack: 0.25, filter: 'bandpass', freq: 400, to: 3200, q: 1.4 });
  }

  /** Pop + sparkle when the number lands on its cell. */
  land(): void {
    this.#tone({ freq: 900, to: 160, dur: 0.18, vol: 0.28, attack: 0.003, reverb: 0.1 });
    this.#noiseBurst({ dur: 0.09, vol: 0.25, attack: 0.002, filter: 'lowpass', freq: 1200 });
    this.#tone({ type: 'triangle', freq: 1318.5, at: 0.06, dur: 0.35, vol: 0.08, reverb: 0.6 });
    this.#tone({ type: 'triangle', freq: 1975.5, at: 0.12, dur: 0.4, vol: 0.06, reverb: 0.6 });
  }

  /** Sweeping wind followed by a witch cackle. */
  reset(): void {
    this.#noiseBurst({ dur: 1.1, vol: 0.28, attack: 0.15, filter: 'bandpass', freq: 3200, to: 220, q: 2 });
    for (let i = 0; i < 7; i++) {
      const f = 1000 - i * 45;
      this.#tone({
        type: 'sawtooth', freq: f, to: f * 0.78, at: 0.4 + i * 0.13, dur: 0.11,
        vol: 0.09, attack: 0.01, reverb: 0.4,
        filter: { type: 'bandpass', freq: 1500, q: 3 },
        vibrato: { rate: 32, depth: 60 },
      });
    }
  }

  /** Challenge answered right: bright "ta-da!" arpeggio with sparkles. */
  correct(): void {
    this.#tone({ freq: 700, to: 1400, dur: 0.12, vol: 0.12, attack: 0.005, reverb: 0.1 });
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      this.#tone({ type: 'square', freq, at: 0.08 + i * 0.09, dur: 0.12, vol: 0.05, reverb: 0.3 });
      this.#tone({ type: 'triangle', freq, at: 0.08 + i * 0.09, dur: 0.14, vol: 0.1, reverb: 0.3 });
    });
    [1046.5, 1318.5, 1568].forEach((freq) =>
      this.#tone({ type: 'triangle', freq, at: 0.38, dur: 1.1, vol: 0.09, attack: 0.01, reverb: 0.6 })
    );
    for (let i = 0; i < 8; i++) {
      this.#tone({
        freq: 2000 + Math.random() * 1800, at: 0.42 + i * 0.07, dur: 0.18,
        vol: 0.035, reverb: 0.7,
      });
    }
  }

  /** Challenge answered wrong: a spooky sad trombone, "wah wah wah waaah". */
  wrong(): void {
    this.#tone({ freq: 140, to: 60, dur: 0.25, vol: 0.25, attack: 0.003, reverb: 0.1 });
    const notes = [233.08, 220, 207.65];
    notes.forEach((freq, i) =>
      this.#tone({
        type: 'sawtooth', freq, to: freq * 0.97, at: 0.15 + i * 0.32, dur: 0.3, vol: 0.12,
        attack: 0.03, reverb: 0.3, filter: { type: 'lowpass', freq: 900 },
      })
    );
    this.#tone({
      type: 'sawtooth', freq: 196, to: 180, at: 1.11, dur: 1.1, vol: 0.13, attack: 0.04,
      reverb: 0.4, filter: { type: 'lowpass', freq: 800 }, vibrato: { rate: 6, depth: 7 },
    });
  }

  /** Victory fanfare when every number has been drawn. */
  fanfare(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      this.#tone({ type: 'square', freq, at: i * 0.14, dur: 0.18, vol: 0.06, reverb: 0.3 });
      this.#tone({ type: 'triangle', freq, at: i * 0.14, dur: 0.2, vol: 0.1, reverb: 0.3 });
    });
    [523.25, 659.25, 783.99, 1046.5].forEach((freq) =>
      this.#tone({ type: 'triangle', freq, at: 0.6, dur: 1.4, vol: 0.09, attack: 0.02, reverb: 0.6 })
    );
  }
}

export const sound = new SoundEngine();
