import { defaultSounds } from '../../audio/defaultSounds.ts';
import type { SoundPack } from '../../audio/sound.ts';
import type { Synth } from '../../audio/synth.ts';

/** One ball knocking against the cage: a short wooden click. */
function knock(s: Synth, at: number, vol = 1) {
  s.tone({
    type: 'triangle', freq: 700 + Math.random() * 500, to: 300, at, dur: 0.05,
    vol: 0.1 * vol, attack: 0.002, reverb: 0.1,
  });
  s.noise({ at, dur: 0.03, vol: 0.05 * vol, attack: 0.001, filter: 'bandpass', freq: 1800, reverb: 0.05 });
}

export const sounds: SoundPack = {
  ...defaultSounds,

  /** The cage turning: a low rumble and balls knocking, slowing down at the end. */
  shuffle(s, seconds) {
    s.noise({ dur: seconds, vol: 0.1, attack: 0.25, filter: 'lowpass', freq: 260, reverb: 0 });
    for (let t = 0, gap = 0.05; t < seconds - 0.1; t += gap + Math.random() * 0.03, gap *= 1.04) {
      knock(s, t, 0.7 + Math.random() * 0.5);
    }
  },

  /** A bright marimba run up to a warm chord. */
  reveal(s) {
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
      s.tone({ type: 'triangle', freq, at: i * 0.07, dur: 0.35, vol: 0.14, attack: 0.003, reverb: 0.35 })
    );
    [523.25, 659.25, 783.99, 1046.5].forEach((freq) =>
      s.tone({ freq, at: 0.38, dur: 1.2, vol: 0.08, attack: 0.01, reverb: 0.6 })
    );
  },

  /** An eraser wiping the board, then the balls rolling back down the scale. */
  reset(s) {
    for (let i = 0; i < 3; i++) {
      s.noise({ at: i * 0.22, dur: 0.2, vol: 0.2, attack: 0.04, filter: 'bandpass', freq: 1400, to: 2600, q: 1.5 });
    }
    [1046.5, 880, 783.99, 659.25, 523.25, 440].forEach((freq, i) => {
      s.tone({ type: 'triangle', freq, at: 0.7 + i * 0.08, dur: 0.22, vol: 0.09, reverb: 0.4 });
      knock(s, 0.7 + i * 0.08, 0.5);
    });
  },
};
