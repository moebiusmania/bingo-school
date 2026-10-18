/** Hand-made inline SVG artwork for the Christmas theme. */
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

/** A spiky holly leaf from (0, 0) to (len, 0). */
function hollyLeaf(len: number, wid: number, spikes = 4): string {
  const pts = Array.from({ length: spikes + 1 }, (_, i) => [len * (i / spikes), wid * Math.sin((Math.PI * i) / spikes)]);
  let d = 'M0 0';
  for (const side of [-1, 1]) {
    const edge = pts.map(([x, y]) => [x, side * y]);
    if (side === 1) edge.reverse();
    for (let i = 1; i < edge.length; i++) {
      const [x0, y0] = edge[i - 1];
      const [x1, y1] = edge[i];
      // pulling the curve towards the midrib makes the spikes
      d += `Q${(x0 + x1) / 2} ${((y0 + y1) / 2) * 0.45} ${x1} ${y1}`;
    }
  }
  return `${d}Z`;
}

const LEAF = hollyLeaf(70, 15);

export function Snowman({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 120' aria-hidden='true'>
      <circle cx='50' cy='88' r='28' fill='#f4f8ff' stroke='#c3d3ea' stroke-width='2' />
      <circle cx='50' cy='44' r='20' fill='#f4f8ff' stroke='#c3d3ea' stroke-width='2' />
      {/* top hat */}
      <rect x='36' y='2' width='28' height='22' rx='3' fill='#1b2233' />
      <rect x='36' y='17' width='28' height='5' fill='#d6283a' />
      <rect x='27' y='22' width='46' height='6' rx='3' fill='#1b2233' />
      {/* face */}
      <circle cx='43' cy='40' r='2.8' fill='#1b2233' />
      <circle cx='57' cy='40' r='2.8' fill='#1b2233' />
      <circle cx='44' cy='39' r='1' fill='#fff' />
      <circle cx='58' cy='39' r='1' fill='#fff' />
      <path d='M50 45l15 3.5-15 3z' fill='#ff8a1f' />
      <path d='M42 54q8 5 16 0' stroke='#1b2233' stroke-width='2' fill='none' stroke-linecap='round' />
      <ellipse cx='37' cy='50' rx='4.5' ry='2.8' fill='#ffb3c7' opacity='.7' />
      <ellipse cx='63' cy='50' rx='4.5' ry='2.8' fill='#ffb3c7' opacity='.7' />
      {/* scarf */}
      <path d='M31 61q19 8 38 0v7q-19 8-38 0z' fill='#d6283a' />
      <path d='M57 66l7 22-8 1-5-21z' fill='#b81f30' />
      <circle cx='50' cy='82' r='3' fill='#1b2233' />
      <circle cx='50' cy='94' r='3' fill='#1b2233' />
    </svg>
  );
}

export function XmasTree({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 100' aria-hidden='true'>
      <defs>
        <linearGradient id='xm-tree' x1='0' x2='1'>
          <stop offset='0' stop-color='#3fae5a' />
          <stop offset='1' stop-color='#1d6e36' />
        </linearGradient>
      </defs>
      <rect x='43' y='82' width='14' height='14' rx='2' fill='#7a4a24' />
      <path d='M50 46L13 84Q31 89 50 84Q69 89 87 84Z' fill='url(#xm-tree)' />
      <path d='M50 31L21 63Q35 67 50 63Q65 67 79 63Z' fill='url(#xm-tree)' />
      <path d='M50 16L29 43Q39 46 50 43Q61 46 71 43Z' fill='url(#xm-tree)' />
      <g stroke='#ffd84a' stroke-width='1.6' fill='none' opacity='.85'>
        <path d='M30 56Q50 64 70 54' />
        <path d='M22 77Q50 88 80 75' />
      </g>
      <g class='xm-twinkle'>
        <circle cx='40' cy='38' r='3' fill='#7fd4ff' />
        <circle cx='58' cy='52' r='3.5' fill='#ff4d5e' />
        <circle cx='38' cy='60' r='3.5' fill='#ffd84a' />
        <circle cx='64' cy='70' r='3.5' fill='#7fd4ff' />
        <circle cx='30' cy='79' r='3.5' fill='#ff4d5e' />
        <circle cx='50' cy='74' r='3' fill='#ffd84a' />
        <circle cx='74' cy='80' r='3' fill='#ff4d5e' />
      </g>
      <path d={starPath(50, 13, 11)} fill='#ffd84a' stroke='#e0a800' stroke-width='1.5' class='xm-star' />
    </svg>
  );
}

/** The present the numbers jump out of. The lid is its own group so it can open. */
export function GiftBox({ class: cls, lidClass }: ArtProps & { lidClass?: string }) {
  return (
    <svg class={cls} viewBox='0 0 300 230' aria-hidden='true'>
      <defs>
        <linearGradient id='gb-box' x1='0' x2='1'>
          <stop offset='0' stop-color='#a8182a' />
          <stop offset='.35' stop-color='#e8384a' />
          <stop offset='1' stop-color='#8c1222' />
        </linearGradient>
        <linearGradient id='gb-ribbon' x1='0' x2='1'>
          <stop offset='0' stop-color='#d9a300' />
          <stop offset='.45' stop-color='#ffe27a' />
          <stop offset='1' stop-color='#c08a00' />
        </linearGradient>
      </defs>
      <rect x='60' y='102' width='180' height='124' rx='8' fill='url(#gb-box)' />
      <g fill='#fff' opacity='.22'>
        <circle cx='88' cy='130' r='5' />
        <circle cx='112' cy='176' r='4' />
        <circle cx='196' cy='138' r='5' />
        <circle cx='214' cy='196' r='4' />
        <circle cx='84' cy='206' r='4' />
      </g>
      <rect x='138' y='102' width='24' height='124' fill='url(#gb-ribbon)' />
      <g class={lidClass}>
        <rect x='48' y='76' width='204' height='34' rx='6' fill='#c92a3b' />
        <rect x='48' y='100' width='204' height='10' rx='3' fill='#8c1222' opacity='.5' />
        <rect x='136' y='76' width='28' height='34' fill='url(#gb-ribbon)' />
        <g fill='url(#gb-ribbon)' stroke='#b07c00' stroke-width='2'>
          <path d='M150 76C122 40 94 52 110 72C118 80 138 80 150 76Z' />
          <path d='M150 76C178 40 206 52 190 72C182 80 162 80 150 76Z' />
          <path d='M146 80l-18 26 10 3 12-24zM154 80l18 26-10 3-12-24z' />
        </g>
        <circle cx='150' cy='76' r='10' fill='#ffe27a' stroke='#b07c00' stroke-width='2' />
      </g>
    </svg>
  );
}

/** A sprig of holly, drawn for the top-left corner (mirror it with CSS). */
export function Holly({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 120 120' aria-hidden='true'>
      <g fill='#2f9a4a' stroke='#1d6e36' stroke-width='2' stroke-linejoin='round'>
        <path d={LEAF} transform='translate(14 14) rotate(10)' />
        <path d={LEAF} transform='translate(14 14) rotate(72)' />
      </g>
      <g stroke='#1d6e36' stroke-width='1.5' fill='none' opacity='.7'>
        <path d='M14 14L82 26M14 14L35 80' />
      </g>
      <circle cx='20' cy='16' r='8' fill='#e8263b' />
      <circle cx='33' cy='12' r='7' fill='#d61f33' />
      <circle cx='18' cy='29' r='7' fill='#d61f33' />
      <g fill='#fff' opacity='.7'>
        <circle cx='17' cy='13' r='2.2' />
        <circle cx='31' cy='9.5' r='1.8' />
        <circle cx='16' cy='26.5' r='1.8' />
      </g>
    </svg>
  );
}

export function GiftIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 48 48' aria-hidden='true'>
      <rect x='8' y='21' width='32' height='22' rx='3' fill='#e8384a' />
      <rect x='6' y='14' width='36' height='9' rx='2' fill='#c92a3b' />
      <rect x='21' y='14' width='6' height='29' fill='#ffd84a' />
      <path d='M24 14C16 3 7 9 15 14ZM24 14C32 3 41 9 33 14Z' fill='#ffd84a' stroke='#c08a00' stroke-width='1' />
    </svg>
  );
}

export function SantaHatIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 48 48' aria-hidden='true'>
      <path d='M8 36C9 18 22 5 35 8c5 1 7 6 6 12-3-4-8-4-10 0l3 16z' fill='#d6283a' />
      <path d='M30 14c-6 2-12 10-14 22h6c1-9 4-16 8-22z' fill='#a8182a' opacity='.5' />
      <rect x='4' y='33' width='36' height='10' rx='5' fill='#f4f8ff' />
      <circle cx='41' cy='21' r='5.5' fill='#f4f8ff' />
    </svg>
  );
}

export function CandyCaneIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 48 48' aria-hidden='true'>
      <g transform='rotate(18 24 24)' fill='none' stroke-width='7' stroke-linecap='round'>
        <path d='M28 44V15a8 8 0 0 0-16 0' stroke='#f4f8ff' />
        <path d='M28 44V15a8 8 0 0 0-16 0' stroke='#d6283a' stroke-dasharray='4 5' />
      </g>
    </svg>
  );
}
