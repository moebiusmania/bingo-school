import { theme } from '@theme';
import { useMemo } from 'preact/hooks';
import { BingoCard } from './BingoCard.tsx';
import { generateCards } from './generateCards.ts';
import styles from './CardsPage.module.css';

const CARD_COUNT = 24;
const CARDS_PER_SHEET = 3;
const DEFAULT_SEED = 2026;

function readSeed(): number {
  const seed = Number(new URLSearchParams(location.search).get('seed'));
  return Number.isInteger(seed) && seed > 0 ? seed : DEFAULT_SEED;
}

function Scissors() {
  return (
    <svg class={styles.scissors} viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' aria-hidden='true'>
      <circle cx='6' cy='6' r='3' />
      <circle cx='6' cy='18' r='3' />
      <path d='M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12' />
    </svg>
  );
}

export function CardsPage() {
  const seed = readSeed();
  const sheets = useMemo(() => {
    const cards = generateCards(CARD_COUNT, seed);
    return Array.from(
      { length: Math.ceil(cards.length / CARDS_PER_SHEET) },
      (_, i) => cards.slice(i * CARDS_PER_SHEET, (i + 1) * CARDS_PER_SHEET),
    );
  }, [seed]);

  const newSet = () => {
    const url = new URL(location.href);
    url.searchParams.set('seed', String(1 + Math.floor(Math.random() * 999_999)));
    location.href = url.href;
  };

  return (
    <>
      <header class={styles.toolbar}>
        <a class={styles.back} href={import.meta.env.BASE_URL}>← Back to the board</a>
        <div class={styles.info}>
          <strong>{theme.meta.name} cards</strong>
          <span>
            {CARD_COUNT} cards · {sheets.length} A4 pages · set #{seed}
          </span>
          <small>Cut along the dashed lines. If colors are missing in the print preview, enable “Background graphics”.</small>
        </div>
        <button type='button' class={styles.secondary} onClick={newSet}>New set</button>
        <button type='button' class={styles.primary} onClick={() => print()}>Print / Save PDF</button>
      </header>

      <main class={styles.sheets}>
        {sheets.map((cards, i) => (
          <section key={i} class={styles.sheet} aria-label={`Page ${i + 1}`}>
            {cards.map((card, j) => (
              <div key={card.id} class={styles.slot}>
                {j > 0 && <Scissors />}
                <BingoCard card={card} />
              </div>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
