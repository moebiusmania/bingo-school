import { theme } from '@theme';
import type { BingoCardData } from './generateCards.ts';
import styles from './BingoCard.module.css';

const { CardDecor, Mascot, cardFillers } = theme.art;

export function BingoCard({ card }: { card: BingoCardData }) {
  let empties = 0;
  return (
    <article class={styles.card} aria-label={`Bingo card ${card.id}`}>
      {CardDecor && <CardDecor />}

      <header class={styles.header}>
        <div class={styles.brand}>
          <Mascot class={styles.mascot} />
          <div class={styles.title}>
            <span>{theme.title[0]}</span>
            <span>{theme.title[1]}</span>
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
            const Deco = cardFillers[(empties++ + card.id) % cardFillers.length];
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
