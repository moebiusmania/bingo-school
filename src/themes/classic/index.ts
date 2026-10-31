import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import './theme.css';
import { dot, star } from '../../fx/shapes.ts';
import type { Theme } from '../types.ts';
import { BingoBall, EraserIcon, Owl, PaperIcon, PencilIcon, StarIcon } from './Art.tsx';
import { BallsCanvas } from './BallsCanvas.tsx';
import challenges from './challenges.json' with { type: 'json' };
import { BoardDecor, CardDecor, DrawMachine } from './Decor.tsx';
import meta from './meta.json' with { type: 'json' };
import { PaperPlaneCanvas } from './PaperPlaneCanvas.tsx';
import { confetti } from './particles.ts';
import { sounds } from './sounds.ts';

export const theme: Theme = {
  meta,
  storagePrefix: 'classic-bingo',
  title: ['Classic', 'Bingo'],

  art: {
    Mascot: Owl,
    Token: BingoBall,
    DrawIcon: StarIcon,
    ChallengeIcon: PencilIcon,
    ResetIcon: EraserIcon,
    DrawMachine,
    BoardDecor,
    CardDecor,
    cardFillers: [BingoBall, PencilIcon, Owl, PaperIcon],
  },
  Background: BallsCanvas,
  Foreground: PaperPlaneCanvas,

  text: {
    drawing: 'Spinning…',
    shuffling: 'Spinning the cage…',
    drawPhrases: [
      'Here it comes…',
      'Eyes on the board!',
      'The next number is…',
      'Ready, class?',
      'And the ball says…',
      'Look at your cards!',
      'Ta-da! It\'s…',
    ],
    resetWarning: 'All the numbers will leave the board!',
    gameOver: 'What a great game!',
    challengeQuestion: 'How hard should it be?',
    answersWarning: 'No peeking, class!',
  },

  levelNames: {
    1: 'Double!',
    2: 'Triple!',
    3: 'Four Stars!',
    4: 'High Five!',
    5: 'Bingo!',
  },
  // from cool to warm: sky blue -> green -> yellow -> orange -> pink
  levelHues: {
    1: 225,
    2: 155,
    3: 90,
    4: 50,
    5: 355,
  },
  challenges,

  particles: {
    colors: ['#ff5c93', '#ffd84a', '#ffffff', '#4fd8c4', '#a98bff', '#7fd0ff'],
    shapes: [star, dot, confetti],
    dudColors: ['#7f97a3', '#587079', '#b4c8d1'],
  },
  sounds,
  // a friendly teacher, a touch slower than normal speech
  voice: { pitch: 1, rate: 0.9 },
};
