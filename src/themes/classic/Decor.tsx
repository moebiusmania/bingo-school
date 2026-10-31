import type { DrawPhase } from '../../components/DrawOverlay.tsx';
import { BingoCage, StarIcon } from './Art.tsx';
import styles from './Decor.module.css';

const FLAG_COLORS = ['#ff5c93', '#ffd84a', '#4fd8c4', '#a98bff', '#7fd0ff'];
const FLAGS = Array.from({ length: 26 }, (_, i) => FLAG_COLORS[i % FLAG_COLORS.length]);

/** A string of party bunting along the top of the board. */
export function BoardDecor() {
  return (
    <div class={styles.bunting}>
      {FLAGS.map((color, i) => <span key={i} class={styles.flag} style={{ background: color }} />)}
    </div>
  );
}

/** A star in the bottom corners of a printed card. */
export function CardDecor() {
  return (
    <>
      <StarIcon class={`${styles.cardStar} ${styles.left}`} />
      <StarIcon class={`${styles.cardStar} ${styles.right}`} />
    </>
  );
}

/** A bingo cage that spins while the numbers shuffle. */
export function DrawMachine({ phase }: { phase: DrawPhase }) {
  const shuffling = phase === 'shuffling';
  return (
    <BingoCage
      class={styles.cage}
      cageClass={shuffling ? styles.spinning : styles.wires}
      ballClass={shuffling ? styles.tumbling : undefined}
    />
  );
}
