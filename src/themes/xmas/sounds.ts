import { defaultSounds } from '../../audio/defaultSounds.ts';
import type { SoundPack } from '../../audio/sound.ts';
import type { Synth } from '../../audio/synth.ts';

/** One shake of sleigh bells: a metallic hiss and a few inharmonic tings. */
function jingle(s: Synth, at: number, vol = 1) {
  s.noise({ at, dur: 0.07, vol: 0.07 * vol, attack: 0.002, filter: 'highpass', freq: 6500, reverb: 0.2 });
  for (let i = 0; i < 3; i++) {
    s.tone({
      type: 'triangle', freq: 2600 + Math.random() * 1800, at: at + i * 0.012, dur: 0.09,
      vol: 0.035 * vol, attack: 0.002, reverb: 0.3,
    });
  }
}

/** Glockenspiel notes, C major pentatonic. */
const GLOCKENSPIEL = [1046.5, 1174.7, 1318.5, 1568, 1760];

export const sounds: SoundPack = {
  ...defaultSounds,

  /** A present being shaken: a soft thump, sleigh bells and a slowing-down glockenspiel tick. */
  shuffle(s, seconds) {
    s.noise({ dur: seconds, vol: 0.12, attack: 0.3, filter: 'lowpass', freq: 200, reverb: 0 });
    for (let t = 0; t < seconds - 0.1; t += 0.13 + Math.random() * 0.05) jingle(s, t, 0.8 + Math.random() * 0.4);
    for (let t = 0, gap = 0.06; t < seconds - 0.15; t += gap, gap *= 1.07) {
      s.tone({
        type: 'triangle', freq: GLOCKENSPIEL[Math.floor(Math.random() * GLOCKENSPIEL.length)],
        at: t, dur: 0.08, vol: 0.08, reverb: 0.25,
      });
    }
  },

  /** A warm church bell, a sparkling celesta run and a last shake of bells. */
  reveal(s) {
    // bell partials: fundamental, the "hum" an octave below, and two inharmonic overtones
    s.tone({ freq: 392, dur: 2.2, vol: 0.2, attack: 0.003, reverb: 0.6 });
    s.tone({ freq: 196, dur: 2.4, vol: 0.1, attack: 0.003, reverb: 0.6 });
    s.tone({ freq: 392 * 2.76, dur: 1.2, vol: 0.06, attack: 0.003, reverb: 0.6 });
    s.tone({ freq: 392 * 5.4, dur: 0.6, vol: 0.03, attack: 0.003, reverb: 0.6 });
    [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568, 2093].forEach((freq, i) =>
      s.tone({ type: 'triangle', freq, at: 0.08 + i * 0.06, dur: 0.9, vol: 0.1, reverb: 0.6 })
    );
    s.tone({
      freq: 3136, at: 0.5, dur: 1.2, vol: 0.03, attack: 0.2, reverb: 0.8,
      vibrato: { rate: 9, depth: 25 },
    });
    for (let i = 0; i < 6; i++) jingle(s, 0.45 + i * 0.1, 1 - i * 0.12);
  },

  /** A gust of snowy wind and the bells tumbling down the scale. */
  reset(s) {
    s.noise({ dur: 1.1, vol: 0.25, attack: 0.15, filter: 'bandpass', freq: 2400, to: 300, q: 2 });
    [2093, 1760, 1568, 1318.5, 1174.7, 1046.5, 880].forEach((freq, i) =>
      s.tone({ type: 'triangle', freq, at: 0.35 + i * 0.09, dur: 0.3, vol: 0.08, reverb: 0.5 })
    );
    jingle(s, 1.05);
  },
};
