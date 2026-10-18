import type { SoundPack } from './sound.ts';

/** Theme-neutral effects that any theme can spread into its SoundPack. */
export const defaultSounds: Pick<SoundPack, 'click' | 'whoosh' | 'land' | 'correct' | 'wrong' | 'fanfare'> = {
  /** Short "plip" for button presses. */
  click(s) {
    s.tone({ type: 'square', freq: 520, to: 820, dur: 0.08, vol: 0.06, reverb: 0 });
  },

  /** Swoosh while the number flies to the board. */
  whoosh(s) {
    s.noise({ dur: 0.65, vol: 0.22, attack: 0.25, filter: 'bandpass', freq: 400, to: 3200, q: 1.4 });
  },

  /** Pop + sparkle when the number lands on its cell. */
  land(s) {
    s.tone({ freq: 900, to: 160, dur: 0.18, vol: 0.28, attack: 0.003, reverb: 0.1 });
    s.noise({ dur: 0.09, vol: 0.25, attack: 0.002, filter: 'lowpass', freq: 1200 });
    s.tone({ type: 'triangle', freq: 1318.5, at: 0.06, dur: 0.35, vol: 0.08, reverb: 0.6 });
    s.tone({ type: 'triangle', freq: 1975.5, at: 0.12, dur: 0.4, vol: 0.06, reverb: 0.6 });
  },

  /** Challenge answered right: bright "ta-da!" arpeggio with sparkles. */
  correct(s) {
    s.tone({ freq: 700, to: 1400, dur: 0.12, vol: 0.12, attack: 0.005, reverb: 0.1 });
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      s.tone({ type: 'square', freq, at: 0.08 + i * 0.09, dur: 0.12, vol: 0.05, reverb: 0.3 });
      s.tone({ type: 'triangle', freq, at: 0.08 + i * 0.09, dur: 0.14, vol: 0.1, reverb: 0.3 });
    });
    [1046.5, 1318.5, 1568].forEach((freq) =>
      s.tone({ type: 'triangle', freq, at: 0.38, dur: 1.1, vol: 0.09, attack: 0.01, reverb: 0.6 })
    );
    for (let i = 0; i < 8; i++) {
      s.tone({
        freq: 2000 + Math.random() * 1800, at: 0.42 + i * 0.07, dur: 0.18,
        vol: 0.035, reverb: 0.7,
      });
    }
  },

  /** Challenge answered wrong: a sad trombone, "wah wah wah waaah". */
  wrong(s) {
    s.tone({ freq: 140, to: 60, dur: 0.25, vol: 0.25, attack: 0.003, reverb: 0.1 });
    const notes = [233.08, 220, 207.65];
    notes.forEach((freq, i) =>
      s.tone({
        type: 'sawtooth', freq, to: freq * 0.97, at: 0.15 + i * 0.32, dur: 0.3, vol: 0.12,
        attack: 0.03, reverb: 0.3, filter: { type: 'lowpass', freq: 900 },
      })
    );
    s.tone({
      type: 'sawtooth', freq: 196, to: 180, at: 1.11, dur: 1.1, vol: 0.13, attack: 0.04,
      reverb: 0.4, filter: { type: 'lowpass', freq: 800 }, vibrato: { rate: 6, depth: 7 },
    });
  },

  /** Victory fanfare when every number has been drawn. */
  fanfare(s) {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      s.tone({ type: 'square', freq, at: i * 0.14, dur: 0.18, vol: 0.06, reverb: 0.3 });
      s.tone({ type: 'triangle', freq, at: i * 0.14, dur: 0.2, vol: 0.1, reverb: 0.3 });
    });
    [523.25, 659.25, 783.99, 1046.5].forEach((freq) =>
      s.tone({ type: 'triangle', freq, at: 0.6, dur: 1.4, vol: 0.09, attack: 0.02, reverb: 0.6 })
    );
  },
};
