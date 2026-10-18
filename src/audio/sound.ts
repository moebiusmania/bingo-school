import { theme } from '@theme';
import { Synth } from './synth.ts';

/** The game's sound effects. Each theme provides its own recipes. */
export interface SoundPack {
  /** Button presses. */
  click(s: Synth): void;
  /** While the numbers shuffle; lasts `seconds`. */
  shuffle(s: Synth, seconds: number): void;
  /** The drawn number appears. */
  reveal(s: Synth): void;
  /** The number flies to the board. */
  whoosh(s: Synth): void;
  /** The number lands on its cell. */
  land(s: Synth): void;
  /** The board is cleared for a new game. */
  reset(s: Synth): void;
  /** Challenge answered right. */
  correct(s: Synth): void;
  /** Challenge answered wrong. */
  wrong(s: Synth): void;
  /** Every number has been drawn. */
  fanfare(s: Synth): void;
}

const synth = new Synth();
const pack = theme.sounds;

export const sound = {
  setMuted: (muted: boolean) => synth.setMuted(muted),
  /** Lowers the effects while speech is playing. */
  duck: (ducked: boolean) => synth.duck(ducked),
  click: () => pack.click(synth),
  shuffle: (seconds: number) => pack.shuffle(synth, seconds),
  reveal: () => pack.reveal(synth),
  whoosh: () => pack.whoosh(synth),
  land: () => pack.land(synth),
  reset: () => pack.reset(synth),
  correct: () => pack.correct(synth),
  wrong: () => pack.wrong(synth),
  fanfare: () => pack.fanfare(synth),
};
