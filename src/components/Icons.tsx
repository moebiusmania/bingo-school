/** Theme-neutral UI icons. They draw with currentColor. */

interface IconProps {
  class?: string;
  on: boolean;
}

export function SpeakerIcon({ class: cls, on }: IconProps) {
  return (
    <svg class={cls} viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'>
      <path d='M4 9h4l5-4v14l-5-4H4z' fill='currentColor' />
      {on
        ? <path d='M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12' />
        : <path d='M17 9l5 6M22 9l-5 6' />}
    </svg>
  );
}

export function VoiceIcon({ class: cls, on }: IconProps) {
  return (
    <svg class={cls} viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'>
      <path d='M4 5h16v11H10l-5 4v-4H4z' fill={on ? 'currentColor' : 'none'} />
      {!on && <path d='M3 3l18 18' />}
    </svg>
  );
}
