import { useEffect, useState } from 'preact/hooks';
import { sound } from '../audio/sound.ts';
import styles from './FullscreenButton.module.css';

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(() => document.fullscreenElement !== null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  if (!document.fullscreenEnabled) return null;

  const toggle = () => {
    sound.click();
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  };

  const label = isFullscreen ? 'Exit full screen' : 'Full screen';
  return (
    <button type='button' class={styles.button} onClick={toggle} title={label} aria-label={label}>
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>
        {isFullscreen
          ? <path d='M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5' />
          : <path d='M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5' />}
      </svg>
    </button>
  );
}
