import { Bat, Cobweb, Ghost, JackOLantern } from '../components/Art.tsx';
import type { BingoCardData } from './generateCards.ts';
import styles from './BingoCard.module.css';

const DECORATIONS = [JackOLantern, Bat, Ghost];

export function BingoCard({ card }: { card: BingoCardData }) {
  let empties = 0;
  return (
    <article class={styles.card} aria-label={`Bingo card ${card.id}`}>
      <Cobweb class={`${styles.web} ${styles.webLeft}`} />
      <Cobweb class={`${styles.web} ${styles.webRight}`} />

      <header class={styles.header}>
        <div class={styles.brand}>
          <Ghost class={styles.ghost} />
          <div class={styles.title}>
            <span>Spooky</span>
            <span>Bingo</span>
          </div>
        </div>
        <div class={styles.name}>
          <span class={styles.nameLabel}>Name</span>
          <div class={styles.nameBox} />
        </div>
        <div class={styles.badge}>
          <small>Card</small>
          {String(card.id).padStart(2, '0')}
        </div>
      </header>

      <div class={styles.grid}>
        {card.rows.flatMap((row, r) =>
          row.map((n, c) => {
            if (n !== null) return <div key={`${r}-${c}`} class={styles.cell}>{n}</div>;
            const Deco = DECORATIONS[(empties++ + card.id) % DECORATIONS.length];
            return (
              <div key={`${r}-${c}`} class={styles.empty}>
                <Deco class={styles.deco} />
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}
