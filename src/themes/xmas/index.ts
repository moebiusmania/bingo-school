import '@fontsource/mountains-of-christmas/700.css';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import './theme.css';
import { dot, star } from '../../fx/shapes.ts';
import type { Theme } from '../types.ts';
import { CandyCaneIcon, GiftIcon, SantaHatIcon, Snowman, XmasTree } from './Art.tsx';
import challenges from './challenges.json' with { type: 'json' };
import { BoardDecor, CardDecor, DrawMachine, drawnCellClass } from './Decor.tsx';
import meta from './meta.json' with { type: 'json' };
import { bauble, snowflake } from './particles.ts';
import { SleighCanvas } from './SleighCanvas.tsx';
import { sounds } from './sounds.ts';
import { WinterSkyCanvas } from './WinterSkyCanvas.tsx';

export const theme: Theme = {
  meta,
  storagePrefix: 'xmas-bingo',
  title: ['Xmas', 'Bingo'],

  art: {
    Mascot: Snowman,
    Token: XmasTree,
    DrawIcon: GiftIcon,
    ChallengeIcon: SantaHatIcon,
    ResetIcon: CandyCaneIcon,
    DrawMachine,
    BoardDecor,
    CardDecor,
    cardFillers: [XmasTree, GiftIcon, Snowman, SantaHatIcon],
  },
  Background: WinterSkyCanvas,
  Foreground: SleighCanvas,
  drawnCellClass,

  text: {
    drawing: 'Jingling…',
    shuffling: 'Shaking the present…',
    drawPhrases: [
      'Ho ho ho! It\'s…',
      'Jingle bells!',
      'Merry number…',
      'Santa says…',
      'Snow way! It\'s…',
      'Look in the stocking…',
      'Ta-da! It\'s…',
    ],
    resetWarning: 'All the baubles will vanish from the board!',
    gameOver: 'What a merry game!',
    challengeQuestion: 'How frosty should it be?',
    answersWarning: 'No peeking, little elves!',
  },

  levelNames: {
    1: 'Ho Ho!',
    2: 'Three Elves!',
    3: 'Four Reindeer!',
    4: 'Five Snowmen!',
    5: 'Merry Christmas!',
  },
  // from icy to cosy: ice blue -> pine green -> gold -> gingerbread -> bauble red
  levelHues: {
    1: 230,
    2: 155,
    3: 90,
    4: 55,
    5: 20,
  },
  challenges,

  particles: {
    colors: ['#ff4d5e', '#ffd84a', '#ffffff', '#5fd47a', '#7fd4ff', '#ffb3c7'],
    shapes: [star, snowflake, dot, bauble],
    dudColors: ['#8796ad', '#5c6a80', '#b8c6da'],
  },
  sounds,
  // a little deeper and slower, like a jolly Santa
  voice: { pitch: 0.8, rate: 0.85 },
};
