/** Hand-made inline SVG artwork used across the app. */

interface ArtProps {
  class?: string;
}

export function Ghost({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 120' aria-hidden='true'>
      <path
        d='M50 6C24 6 12 28 12 56v54l12-11 13 13 13-13 13 13 13-13 12 11V56C88 28 76 6 50 6Z'
        fill='#f6f2ff'
        stroke='#cbbcf0'
        stroke-width='2'
      />
      <ellipse cx='37' cy='48' rx='7' ry='10' fill='#2a1838' />
      <ellipse cx='63' cy='48' rx='7' ry='10' fill='#2a1838' />
      <circle cx='39' cy='44' r='2.5' fill='#fff' />
      <circle cx='65' cy='44' r='2.5' fill='#fff' />
      <ellipse cx='50' cy='70' rx='8' ry='6' fill='#2a1838' />
      <ellipse cx='27' cy='62' rx='6' ry='3.5' fill='#ffb3d1' opacity='.7' />
      <ellipse cx='73' cy='62' rx='6' ry='3.5' fill='#ffb3d1' opacity='.7' />
    </svg>
  );
}

export function JackOLantern({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 100' aria-hidden='true'>
      <defs>
        <radialGradient id='jol-body' cx='45%' cy='40%' r='65%'>
          <stop offset='0' stop-color='#ffb347' />
          <stop offset='.6' stop-color='#f27d0c' />
          <stop offset='1' stop-color='#b84a00' />
        </radialGradient>
        <radialGradient id='jol-fire' cx='50%' cy='60%' r='60%'>
          <stop offset='0' stop-color='#fffbe0' />
          <stop offset='.5' stop-color='#ffd84a' />
          <stop offset='1' stop-color='#ff9500' />
        </radialGradient>
      </defs>
      <path d='M48 22c0-8 3-14 10-17l4 5c-5 3-7 7-7 12z' fill='#4b8a2a' />
      <ellipse cx='50' cy='60' rx='45' ry='36' fill='url(#jol-body)' />
      <ellipse cx='50' cy='60' rx='22' ry='36' fill='none' stroke='#a84300' stroke-width='2' opacity='.45' />
      <ellipse cx='50' cy='60' rx='8' ry='36' fill='none' stroke='#a84300' stroke-width='2' opacity='.45' />
      <g fill='url(#jol-fire)' class='jol-glow'>
        <path d='M24 52l12-15 9 15z' />
        <path d='M55 52l9-15 12 15z' />
        <path d='M45 66l5-8 5 8z' />
        <path d='M20 70q30 22 60 0l-6 2-4 6-6-5-6 6-6-6-6 6-6-6-4 4-6-5z' />
      </g>
    </svg>
  );
}

export function Cauldron({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 300 230' aria-hidden='true'>
      <defs>
        <linearGradient id='cd-pot' x1='0' x2='1'>
          <stop offset='0' stop-color='#14101c' />
          <stop offset='.35' stop-color='#3b3350' />
          <stop offset='1' stop-color='#0d0a14' />
        </linearGradient>
        <radialGradient id='cd-slime' cx='50%' cy='40%' r='60%'>
          <stop offset='0' stop-color='#d4ff7a' />
          <stop offset='1' stop-color='#39b81e' />
        </radialGradient>
        <linearGradient id='cd-fire' x1='0' y1='1' x2='0' y2='0'>
          <stop offset='0' stop-color='#ff4d00' />
          <stop offset='.6' stop-color='#ffb300' />
          <stop offset='1' stop-color='#fff2a0' />
        </linearGradient>
      </defs>
      <g fill='url(#cd-fire)' class='cd-flames'>
        <path d='M95 230c-10-20 5-30 8-48 10 18 20 26 10 48z' />
        <path d='M135 230c-14-28 6-42 12-66 12 26 26 38 12 66z' />
        <path d='M180 230c-10-22 6-32 10-52 10 20 20 30 8 52z' />
      </g>
      <rect x='70' y='190' width='14' height='30' rx='4' fill='#14101c' />
      <rect x='216' y='190' width='14' height='30' rx='4' fill='#14101c' />
      <path d='M40 80Q28 205 150 210Q272 205 260 80Z' fill='url(#cd-pot)' />
      <path d='M70 110Q66 170 110 190' stroke='#6f6390' stroke-width='6' fill='none' stroke-linecap='round' opacity='.5' />
      <ellipse cx='150' cy='78' rx='122' ry='24' fill='#2a2338' />
      <ellipse cx='150' cy='80' rx='108' ry='16' fill='url(#cd-slime)' class='cd-slime' />
      <circle cx='110' cy='78' r='9' fill='#b6ff6a' class='cd-bubble' />
      <circle cx='180' cy='82' r='6' fill='#b6ff6a' class='cd-bubble' style='animation-delay:-.4s' />
      <circle cx='150' cy='76' r='11' fill='#b6ff6a' class='cd-bubble' style='animation-delay:-.8s' />
    </svg>
  );
}

/** A corner cobweb, drawn for the top-left corner (mirror it with CSS). */
export function Cobweb({ class: cls }: ArtProps) {
  const spokes = [0, 18, 36, 54, 72, 90].map((deg) => (deg * Math.PI) / 180);
  const rings = [22, 44, 68, 96];
  const pt = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r] as const;

  let d = spokes.map((a) => `M0 0L${pt(118, a).join(' ')}`).join('');
  for (const r of rings) {
    for (let i = 0; i < spokes.length - 1; i++) {
      const [x1, y1] = pt(r, spokes[i]);
      const [x2, y2] = pt(r, spokes[i + 1]);
      const [cx, cy] = pt(r * 0.8, (spokes[i] + spokes[i + 1]) / 2);
      d += `${i === 0 ? `M${x1} ${y1}` : ''}Q${cx} ${cy} ${x2} ${y2}`;
    }
  }
  return (
    <svg class={cls} viewBox='0 0 120 120' aria-hidden='true'>
      <path d={d} fill='none' stroke='rgba(230, 220, 255, .45)' stroke-width='1.2' />
    </svg>
  );
}

export function Spider({ class: cls }: ArtProps) {
  return (
    <div class={cls} aria-hidden='true'>
      <svg viewBox='0 0 60 60'>
        <g stroke='#120818' stroke-width='3' fill='none' stroke-linecap='round'>
          <path d='M22 28l-12-8-6 6M22 32l-14-2-6 8M22 36l-12 6-4 10M24 40l-8 10-2 8' />
          <path d='M38 28l12-8 6 6M38 32l14-2 6 8M38 36l12 6 4 10M36 40l8 10 2 8' />
        </g>
        <ellipse cx='30' cy='36' rx='11' ry='13' fill='#1d0d26' />
        <circle cx='30' cy='22' r='8' fill='#1d0d26' />
        <circle cx='27' cy='21' r='2.6' fill='#fff' />
        <circle cx='33' cy='21' r='2.6' fill='#fff' />
        <circle cx='27.6' cy='21.6' r='1.2' fill='#000' />
        <circle cx='33.6' cy='21.6' r='1.2' fill='#000' />
        <path d='M27 26q3 2 6 0' stroke='#fff' stroke-width='1.2' fill='none' />
      </svg>
    </div>
  );
}

export function CauldronIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 48 48' aria-hidden='true'>
      <circle cx='18' cy='9' r='3' fill='#b6ff6a' />
      <circle cx='27' cy='6' r='2' fill='#b6ff6a' />
      <path d='M6 18q-2 22 18 23 20-1 18-23z' fill='#1d1428' />
      <ellipse cx='24' cy='18' rx='20' ry='5' fill='#2e2440' />
      <ellipse cx='24' cy='18' rx='16' ry='3' fill='#7dff4d' />
      <rect x='10' y='39' width='4' height='6' rx='1' fill='#1d1428' />
      <rect x='34' y='39' width='4' height='6' rx='1' fill='#1d1428' />
    </svg>
  );
}

export function WitchHatIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 48 48' aria-hidden='true'>
      <path d='M24 3l-10 32h22L30 12q4-2 6 2-2-8-12-11z' fill='#2a1240' />
      <ellipse cx='24' cy='37' rx='21' ry='5' fill='#2a1240' />
      <rect x='14' y='29' width='21' height='5' fill='#ffcc33' />
      <rect x='22' y='28.5' width='5' height='6' fill='none' stroke='#8a5a00' stroke-width='1.5' />
    </svg>
  );
}

export function BroomIcon({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 48 48' aria-hidden='true'>
      <path d='M40 4L20 28' stroke='#8a5a2b' stroke-width='4' stroke-linecap='round' />
      <path d='M18 24l8 8-4 3-14 9-4-4 9-14z' fill='#e8b04a' />
      <path d='M10 34l6-4M12 38l7-5M8 30l6-5' stroke='#a8741f' stroke-width='1.5' />
      <path d='M17 25l8 8' stroke='#c0392b' stroke-width='3' />
    </svg>
  );
}

export function SpeakerIcon({ class: cls, on }: ArtProps & { on: boolean }) {
  return (
    <svg class={cls} viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'>
      <path d='M4 9h4l5-4v14l-5-4H4z' fill='currentColor' />
      {on
        ? <path d='M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12' />
        : <path d='M17 9l5 6M22 9l-5 6' />}
    </svg>
  );
}

export function VoiceIcon({ class: cls, on }: ArtProps & { on: boolean }) {
  return (
    <svg class={cls} viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'>
      <path d='M4 5h16v11H10l-5 4v-4H4z' fill={on ? 'currentColor' : 'none'} />
      {!on && <path d='M3 3l18 18' />}
    </svg>
  );
}

export function Bat({ class: cls }: ArtProps) {
  return (
    <svg class={cls} viewBox='0 0 100 60' aria-hidden='true'>
      <path
        d='M50 18c-3 0-5 2-6 4l-3-7-2 9C33 14 20 8 2 12c8 4 12 10 12 18 5-4 11-4 15 1 2-5 8-6 12-2 2 4 5 7 9 7s7-3 9-7c4-4 10-3 12 2 4-5 10-5 15-1 0-8 4-14 12-18-18-4-31 2-37 12l-2-9-3 7c-1-2-3-4-6-4z'
        fill='#120818'
      />
      <circle cx='46.5' cy='24' r='1.8' fill='#ffdd55' />
      <circle cx='53.5' cy='24' r='1.8' fill='#ffdd55' />
    </svg>
  );
}
