import type { ComponentType } from 'preact';
import type { SoundPack } from '../audio/sound.ts';
import type { DrawPhase } from '../components/DrawOverlay.tsx';
import type { ParticleShape } from '../fx/fx.ts';
import type { Challenge, ChallengeLevel } from '../game/challenges.ts';
import type { ThemeMeta } from './meta.ts';

export interface ArtProps {
  class?: string;
}

export type Art = ComponentType<ArtProps>;

/**
 * Everything that gives the game its look, sound and content. The game logic
 * and layout never change between themes; a theme only fills these slots and
 * defines the color tokens in its own theme.css (see halloween/theme.css).
 */
export interface Theme {
  meta: ThemeMeta;
  /** Prefix of every localStorage key, so each theme keeps its own game and settings. */
  storagePrefix: string;
  /** The title in the control panel and on the printed cards, one word per line. */
  title: readonly [string, string];

  art: {
    /** Control panel header, reset dialog, printed cards and the "Oops!" stamp. */
    Mascot: Art;
    /** Board corner, difficulty pips, end-of-game dancers and the "Correct!" stamp. */
    Token: Art;
    DrawIcon: Art;
    ChallengeIcon: Art;
    ResetIcon: Art;
    /** What the numbers come out of, at the bottom of the draw overlay. */
    DrawMachine: ComponentType<{ phase: DrawPhase }>;
    /** Decorations laid over the board frame. */
    BoardDecor?: ComponentType;
    /** Decorations laid over each printed card. */
    CardDecor?: ComponentType;
    /** Fill the empty cells of the printed cards, in turn. */
    cardFillers: readonly Art[];
  };

  /** Fixed full-screen layer behind the board (use the `background` class from Layers.module.css). */
  Background?: ComponentType;
  /** Fixed full-screen layer above the board (use the `foreground` class from Layers.module.css). */
  Foreground?: ComponentType;
  /**
   * Extra class for drawn board cells, e.g. a pumpkin stem. Cells are size containers,
   * so size it in cq units. `::before` is taken by the latest-number ring; `::after` is free.
   */
  drawnCellClass?: string;

  text: {
    /** Draw button label while a number is being drawn. */
    drawing: string;
    /** Draw overlay caption while the numbers shuffle. */
    shuffling: string;
    /** One is picked at random above each revealed number. */
    drawPhrases: readonly string[];
    /** Second line of the "Start a new game?" dialog. */
    resetWarning: string;
    /** Second line of the "all numbers are out" dialog. */
    gameOver: string;
    /** Under "Choose a challenge!". */
    challengeQuestion: string;
    /** After "For the host only." on the answers page. */
    answersWarning: string;
  };

  /** What the class shouts for each win (ambo, terna, quaterna, cinquina, tombola). */
  levelNames: Record<ChallengeLevel, string>;
  /** OKLCH hue of each level's buttons, badges and answer sections. */
  levelHues: Record<ChallengeLevel, number>;
  challenges: Record<ChallengeLevel, Challenge[]>;

  particles: {
    colors: readonly string[];
    shapes: readonly ParticleShape[];
    /** The small grey puff for a wrong answer. */
    dudColors: readonly string[];
  };
  sounds: SoundPack;
  /** Speech settings for the number announcer. */
  voice: { pitch: number; rate: number };
}
