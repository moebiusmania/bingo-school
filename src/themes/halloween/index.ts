import '@fontsource/creepster';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import './theme.css';
import { dot, star } from '../../fx/shapes.ts';
import type { Theme } from '../types.ts';
import { Bat, BroomIcon, CauldronIcon, Ghost, JackOLantern, WitchHatIcon } from './Art.tsx';
import { BatsCanvas } from './BatsCanvas.tsx';
import challenges from './challenges.json' with { type: 'json' };
import { BoardDecor, CardDecor, DrawMachine, drawnCellClass } from './Decor.tsx';
import meta from './meta.json' with { type: 'json' };
import { candy, pumpkin } from './particles.ts';
import { SkyCanvas } from './SkyCanvas.tsx';
import { sounds } from './sounds.ts';

export const theme: Theme = {
  meta,
  storagePrefix: 'spooky-bingo',
  title: ['Spooky', 'Bingo'],

  art: {
    Mascot: Ghost,
    Token: JackOLantern,
    DrawIcon: CauldronIcon,
    ChallengeIcon: WitchHatIcon,
    ResetIcon: BroomIcon,
    DrawMachine,
    BoardDecor,
    CardDecor,
    cardFillers: [JackOLantern, Bat, Ghost],
  },
  Background: SkyCanvas,
  Foreground: BatsCanvas,
  drawnCellClass,

  text: {
    drawing: 'Stirring…',
    shuffling: 'Stirring the cauldron…',
    drawPhrases: [
      'Boo! It\'s…',
      'Abracadabra!',
      'Spooky number…',
      'The cauldron says…',
      'Hocus pocus!',
      'Eek! It\'s…',
      'Trick or treat!',
    ],
    resetWarning: 'All the pumpkins will vanish from the board!',
    gameOver: 'What a spooktacular game!',
    challengeQuestion: 'How spooky should it be?',
    answersWarning: 'No peeking, little monsters!',
  },

  levelNames: {
    1: 'Boo Boo!',
    2: 'Three Bats!',
    3: 'Four Cats!',
    4: 'Five Pumpkins!',
    5: 'Trick or Treat!',
  },
  // warmer and more dangerous: green -> yellow -> orange -> red -> purple
  levelHues: {
    1: 140,
    2: 100,
    3: 60,
    4: 28,
    5: 305,
  },
  challenges,

  particles: {
    colors: ['#ff9a1f', '#ffcc33', '#b46bff', '#7dff6b', '#ff5fa2', '#fff4d6'],
    shapes: [star, candy, dot, pumpkin],
    dudColors: ['#8a7f99', '#5d5370', '#b9a8d1'],
  },
  sounds,
  // deep and slow for a spooky, but still clear, announcement
  voice: { pitch: 0.75, rate: 0.8 },
};
