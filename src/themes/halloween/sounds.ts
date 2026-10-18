import { defaultSounds } from '../../audio/defaultSounds.ts';
import type { SoundPack } from '../../audio/sound.ts';

export const sounds: SoundPack = {
  ...defaultSounds,

  /** Bubbling cauldron with a slowing-down wheel tick. */
  shuffle(s, seconds) {
    s.noise({ dur: seconds, vol: 0.18, attack: 0.3, filter: 'lowpass', freq: 160, reverb: 0 });
    s.tone({
      type: 'sawtooth', freq: 55, dur: seconds, vol: 0.07, attack: 0.4,
      filter: { type: 'lowpass', freq: 220 }, reverb: 0,
    });

    const scale = [880, 987.8, 1174.7, 1318.5, 1568];
    for (let t = 0, gap = 0.05; t < seconds - 0.15; t += gap, gap *= 1.07) {
      s.tone({
        type: 'triangle', freq: scale[Math.floor(Math.random() * scale.length)],
        at: t, dur: 0.06, vol: 0.1, reverb: 0.15,
      });
    }
    for (let t = 0.05; t < seconds - 0.1; t += 0.07 + Math.random() * 0.14) {
      const f = 160 + Math.random() * 260;
      s.tone({ freq: f, to: f * 2.6, at: t, dur: 0.08, vol: 0.13, reverb: 0.1 });
    }
  },

  /** Magical chime, a deep "bong" and a ghostly "woooo". */
  reveal(s) {
    s.tone({ freq: 110, to: 98, dur: 1.8, vol: 0.28, attack: 0.005, reverb: 0.5 });
    s.tone({ type: 'triangle', freq: 220, to: 196, dur: 1.2, vol: 0.1, attack: 0.005, reverb: 0.5 });
    [440, 523.25, 659.25, 880, 1046.5, 1318.5].forEach((freq, i) =>
      s.tone({ type: 'triangle', freq, at: 0.05 + i * 0.07, dur: 1, vol: 0.12, reverb: 0.6 })
    );
    s.tone({
      freq: 2093, at: 0.4, dur: 1.2, vol: 0.04, attack: 0.2, reverb: 0.8,
      vibrato: { rate: 9, depth: 18 },
    });
    s.tone({
      freq: 280, path: [[0.35, 520], [0.75, 470], [1.2, 300]], at: 0.55, dur: 1.3,
      vol: 0.11, attack: 0.25, reverb: 0.8, vibrato: { rate: 5.5, depth: 14 },
    });
  },

  /** Sweeping wind followed by a witch cackle. */
  reset(s) {
    s.noise({ dur: 1.1, vol: 0.28, attack: 0.15, filter: 'bandpass', freq: 3200, to: 220, q: 2 });
    for (let i = 0; i < 7; i++) {
      const f = 1000 - i * 45;
      s.tone({
        type: 'sawtooth', freq: f, to: f * 0.78, at: 0.4 + i * 0.13, dur: 0.11,
        vol: 0.09, attack: 0.01, reverb: 0.4,
        filter: { type: 'bandpass', freq: 1500, q: 3 },
        vibrato: { rate: 32, depth: 60 },
      });
    }
  },
};
