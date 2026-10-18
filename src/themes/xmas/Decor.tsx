import type { DrawPhase } from '../../components/DrawOverlay.tsx';
import { GiftBox, Holly } from './Art.tsx';
import styles from './Decor.module.css';

const BULB_COLORS = ['#ff4d5e', '#ffd84a', '#5fd47a', '#7fd4ff'];
const BULBS = Array.from({ length: 22 }, (_, i) => ({ color: BULB_COLORS[i % BULB_COLORS.length], delay: -i * 0.37 }));

/** Snow on top of the board, a string of fairy lights and holly in the top corners. */
export function BoardDecor() {
  return (
    <>
      <div class={styles.snow} />
      <div class={styles.lights}>
        {BULBS.map((b, i) => (
          <span key={i} class={styles.bulb} style={{ '--bulb': b.color, animationDelay: `${b.delay}s` }} />
        ))}
      </div>
      <Holly class={`${styles.boardHolly} ${styles.left}`} />
      <Holly class={`${styles.boardHolly} ${styles.right}`} />
    </>
  );
}

/** Holly in the bottom corners of a printed card. */
export function CardDecor() {
  return (
    <>
      <Holly class={`${styles.cardHolly} ${styles.left}`} />
      <Holly class={`${styles.cardHolly} ${styles.right}`} />
    </>
  );
}

const SPARKLES = Array.from({ length: 14 }, (_, i) => ({
  x: 15 + Math.random() * 70,
  delay: -i * 0.2,
  size: 0.8 + Math.random() * 1.6,
}));

/** A present that rattles while the numbers shuffle and pops its lid for the reveal. */
export function DrawMachine({ phase }: { phase: DrawPhase }) {
  const shuffling = phase === 'shuffling';
  return (
    <>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          class={styles.sparkle}
          style={{
            left: `${s.x}%`,
            width: `${s.size}vh`,
            height: `${s.size}vh`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <GiftBox
        class={`${styles.gift} ${shuffling ? styles.shaking : ''}`}
        lidClass={`${styles.lid} ${shuffling ? styles.rattling : styles.open}`}
      />
    </>
  );
}

/** A drawn number turns into a bauble: the gradient is in theme.css, this adds the cap and hook. */
export const drawnCellClass = styles.bauble;
