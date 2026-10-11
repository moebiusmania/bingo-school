import data from './challenges.json' with { type: 'json' };

export const CHALLENGE_LEVELS = [1, 2, 3, 4, 5] as const;
export type ChallengeLevel = (typeof CHALLENGE_LEVELS)[number];

export const LEVEL_NAMES: Record<ChallengeLevel, string> = {
  1: 'Boo Boo!',
  2: 'Three Bats!',
  3: 'Four Cats!',
  4: 'Five Pumpkins!',
  5: 'Trick or Treat!',
};

/** Same colors as the level buttons in ChallengeDialog.module.css. */
export const LEVEL_HUES: Record<ChallengeLevel, number> = {
  1: 140,
  2: 100,
  3: 60,
  4: 28,
  5: 305,
};

export interface Challenge {
  /** Short kid-facing heading, e.g. "Spell it!". */
  title: string;
  /** The exercise itself; `\n` starts a new line. */
  prompt: string;
  /** Shown after the host marks the answer. */
  answer: string;
}

export const CHALLENGES: Record<ChallengeLevel, Challenge[]> = data;

// Each level deals its challenges like a shuffled deck, so none repeats until all have been used
const decks = new Map<ChallengeLevel, Challenge[]>();
const lastDealt = new Map<ChallengeLevel, Challenge>();

export function nextChallenge(level: ChallengeLevel): Challenge {
  let deck = decks.get(level);
  if (!deck?.length) {
    deck = [...CHALLENGES[level]];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    // don't start a fresh deck with the challenge that just ended the previous one
    const top = deck.length - 1;
    if (top > 0 && deck[top] === lastDealt.get(level)) {
      [deck[0], deck[top]] = [deck[top], deck[0]];
    }
    decks.set(level, deck);
  }
  const challenge = deck.pop()!;
  lastDealt.set(level, challenge);
  return challenge;
}
