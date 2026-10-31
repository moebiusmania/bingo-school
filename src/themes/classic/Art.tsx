/** Hand-made inline SVG artwork for the Classic theme. */
import type { ArtProps } from '../types.ts';

/** A five-pointed star path centred on (cx, cy). */
function starPath(cx: number, cy: number, r: number, inner = 0.45): string {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * inner : r;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rad).toFixed(2)} ${(cy + Math.sin(a) * rad).toFixed(2)}`;
  }
  return `${d}Z`;
}

/** A friendly owl in a graduation cap. */
export function Owl({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 120' aria-hidden='true'>
      {/* body and wings */}
      <ellipse cx='50' cy='76' rx='33' ry='40' fill='#8a5a3c' />
      <ellipse cx='50' cy='88' rx='21' ry='24' fill='#f1dcb8' />
      <path d='M20 62q-11 24 3 42q9-16 6-40z' fill='#6f4630' />
      <path d='M80 62q11 24-3 42q-9-16-6-40z' fill='#6f4630' />
      <path d='M41 82q4 4 8 0M51 82q4 4 8 0M46 92q4 4 8 0' stroke='#c9a877' stroke-width='2' fill='none' stroke-linecap='round' />
      {/* eyes and beak */}
      <circle cx='36' cy='52' r='14' fill='#fff' stroke='#6f4630' stroke-width='3' />
      <circle cx='64' cy='52' r='14' fill='#fff' stroke='#6f4630' stroke-width='3' />
      <circle cx='38' cy='53' r='6' fill='#1b2233' />
      <circle cx='62' cy='53' r='6' fill='#1b2233' />
      <circle cx='40' cy='51' r='2' fill='#fff' />
      <circle cx='64' cy='51' r='2' fill='#fff' />
      <path d='M44 62h12l-6 9z' fill='#ffb52e' />
      {/* graduation cap */}
      <path d='M28 28v8q22 9 44 0v-8z' fill='#2a2f4a' />
      <path d='M50 8L90 24L50 40L10 24z' fill='#3a4066' />
      <path d='M50 24L82 30v15' stroke='#ffd84a' stroke-width='2.5' fill='none' stroke-linecap='round' />
      <circle cx='82' cy='47' r='3.5' fill='#ffd84a' />
      {/* feet */}
      <path d='M36 114h12M52 114h12' stroke='#ffb52e' stroke-width='5' stroke-linecap='round' />
    </svg>
  );
}

/** A shiny pink bingo ball with a star on it. */
export function BingoBall({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 100' aria-hidden='true'>
      <defs>
        <radialGradient id='cl-ball' cx='38%' cy='32%' r='72%'>
          <stop offset='0' stop-color='#ff9cc0' />
          <stop offset='.55' stop-color='#f03f7f' />
          <stop offset='1' stop-color='#a81850' />
        </radialGradient>
      </defs>
      <circle cx='50' cy='50' r='45' fill='url(#cl-ball)' />
      <circle cx='50' cy='50' r='25' fill='#fff' />
      <path d={starPath(50, 51, 18)} fill='#ffc21f' />
      <ellipse cx='32' cy='23' rx='13' ry='7' fill='#fff' opacity='.55' transform='rotate(-30 32 23)' />
    </svg>
  );
}

export function StarIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 100' aria-hidden='true'>
      <path d={starPath(50, 53, 46)} fill='#ffd84a' stroke='#c98a12' stroke-width='5' stroke-linejoin='round' />
      <path d={starPath(50, 53, 22)} fill='#fff2b0' />
    </svg>
  );
}

export function PencilIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 100' aria-hidden='true'>
      <g transform='rotate(45 50 50)'>
        <rect x='38' y='-2' width='24' height='12' rx='5' fill='#ff7fa8' />
        <rect x='38' y='9' width='24' height='8' fill='#cfd6dd' />
        <rect x='38' y='17' width='24' height='56' fill='#ffc21f' />
        <rect x='46' y='17' width='8' height='56' fill='#ffd95e' />
        <path d='M38 73h24l-12 25z' fill='#f1d3a8' />
        <path d='M45 88h10l-5 10z' fill='#2a2f4a' />
      </g>
    </svg>
  );
}

export function EraserIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 100' aria-hidden='true'>
      <g transform='rotate(-30 50 50)'>
        <rect x='10' y='30' width='80' height='42' rx='8' fill='#ff7fa8' />
        <path d='M48 30h34a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H48z' fill='#6fb6ff' />
        <rect x='44' y='30' width='6' height='42' fill='#fff' />
      </g>
    </svg>
  );
}

export function PaperIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 100' aria-hidden='true'>
      <path d='M6 46L94 8L70 90L46 62z' fill='#fff' />
      <path d='M46 62L94 8L38 78z' fill='#c8d6e0' />
    </svg>
  );
}

const CAGE_BALLS = [
  [122, 104, '#ff5c93'], [158, 92, '#ffd84a'], [182, 120, '#4fd8c4'],
  [140, 134, '#a98bff'], [108, 138, '#7fd0ff'], [170, 150, '#ff8a4c'],
] as const;

/** A bingo cage on a stand. `cageClass` spins the wires, `ballClass` shakes the balls. */
export function BingoCage({ class: cls, cageClass, ballClass }: ArtProps & { cageClass?: string; ballClass?: string }) {
  return (
    <svg class={cls} viewBox='0 0 300 230' aria-hidden='true'>
      {/* stand */}
      <path d='M70 226L108 120h12L92 226zM230 226L192 120h-12L208 226z' fill='#7a4e34' />
      <rect x='40' y='214' width='220' height='16' rx='6' fill='#8f5d40' />
      {/* axle */}
      <rect x='44' y='112' width='212' height='8' rx='4' fill='#c9d3da' />
      <circle cx='258' cy='116' r='12' fill='#ffc21f' />
      <path d='M258 116v-26' stroke='#c9d3da' stroke-width='6' stroke-linecap='round' />
      <circle cx='258' cy='88' r='7' fill='#ff5c93' />
      {/* balls */}
      {CAGE_BALLS.map(([cx, cy, fill], i) => (
        <g key={i} class={ballClass} style={{ animationDelay: `${-i * 0.09}s` }}>
          <circle cx={cx} cy={cy} r='17' fill={fill} />
          <circle cx={cx} cy={cy} r='8' fill='#fff' />
        </g>
      ))}
      {/* wire cage */}
      <g class={cageClass} fill='none' stroke='#dfe7ec' stroke-width='5'>
        <circle cx='150' cy='116' r='92' />
        <ellipse cx='150' cy='116' rx='46' ry='92' />
        <ellipse cx='150' cy='116' rx='92' ry='46' />
        <path d='M150 24v184M58 116h184' />
      </g>
    </svg>
  );
}
