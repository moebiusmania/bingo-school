import type { DrawPhase } from '../../components/DrawOverlay.tsx';
import { Cauldron, Cobweb, Spider } from './Art.tsx';
import styles from './Decor.module.css';

/** Cobwebs in the top corners of the board and a spider dropping in from time to time. */
export function BoardDecor() {
  return (
    <>
      <Cobweb class={`${styles.boardWeb} ${styles.left}`} />
      <Cobweb class={`${styles.boardWeb} ${styles.right}`} />
      <Spider class={styles.spider} />
    </>
  );
}

/** Cobwebs in the bottom corners of a printed card. */
export function CardDecor() {
  return (
    <>
      <Cobweb class={`${styles.cardWeb} ${styles.left}`} />
      <Cobweb class={`${styles.cardWeb} ${styles.right}`} />
    </>
  );
}

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  x: 10 + Math.random() * 80,
  delay: -i * 0.23,
  size: 1 + Math.random() * 2.2,
}));

/** A bubbling cauldron that rumbles while it's being stirred. */
export function DrawMachine({ phase }: { phase: DrawPhase }) {
  return (
    <>
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          class={styles.bubble}
          style={{
            left: `${b.x}%`,
            width: `${b.size}vh`,
            height: `${b.size}vh`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
      <Cauldron class={`${styles.cauldron} ${phase === 'shuffling' ? styles.stirring : ''}`} />
    </>
  );
}

/** A drawn number turns into a little pumpkin: the gradient is in theme.css, this adds the stem. */
export const drawnCellClass = styles.pumpkin;
