import { theme } from '@theme';
import { TOTAL_NUMBERS } from '../game/useBingo.ts';
import styles from './Board.module.css';

interface BoardProps {
  drawn: ReadonlySet<number>;
  latest: number | null;
  resetting: boolean;
  /** Changing this remounts the cells, replaying the intro animation. */
  gameId: number;
}

const NUMBERS = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);
const { BoardDecor, Token } = theme.art;

export function Board({ drawn, latest, resetting, gameId }: BoardProps) {
  return (
    <section class={styles.frame} aria-label='Bingo board'>
      {BoardDecor && <BoardDecor />}

      <div class={styles.grid} key={gameId}>
        {NUMBERS.map((n) => {
          const isDrawn = drawn.has(n);
          const cls = [
            styles.cell,
            isDrawn && styles.drawn,
            isDrawn && theme.drawnCellClass,
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
        {/* the 100th slot of the 10×10 grid */}
        <div class={styles.corner} style={{ '--i': 100 }}>
          <Token class={styles.cornerArt} />
        </div>
      </div>
    </section>
  );
}
