import { TOTAL_NUMBERS } from '../game/useBingo.ts';
import { Cobweb, JackOLantern, Spider } from './Art.tsx';
import styles from './Board.module.css';

interface BoardProps {
  drawn: ReadonlySet<number>;
  latest: number | null;
  resetting: boolean;
  /** Changing this remounts the cells, replaying the intro animation. */
  gameId: number;
}

const NUMBERS = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);

export function Board({ drawn, latest, resetting, gameId }: BoardProps) {
  return (
    <section class={styles.frame} aria-label='Bingo board'>
      <Cobweb class={`${styles.web} ${styles.webLeft}`} />
      <Cobweb class={`${styles.web} ${styles.webRight}`} />
      <Spider class={styles.spider} />

      <div class={styles.grid} key={gameId}>
        {NUMBERS.map((n) => {
          const isDrawn = drawn.has(n);
          const cls = [
            styles.cell,
            isDrawn && styles.drawn,
            n === latest && !resetting && styles.latest,
            resetting && (isDrawn ? styles.leaving : styles.shiver),
          ].filter(Boolean).join(' ');
          return (
            <div
              key={n}
              class={cls}
              data-num={n}
              style={{ '--i': n }}
              aria-label={isDrawn ? `${n}, drawn` : String(n)}
            >
              <span>{n}</span>
            </div>
          );
        })}
        <div class={styles.lantern} style={{ '--i': 100 }}>
          <JackOLantern class={styles.lanternArt} />
        </div>
      </div>
    </section>
  );
}
