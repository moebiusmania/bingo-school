/**
 * Generates unique bingo cards in the classic tombola layout:
 * 3 rows × 10 columns, 5 numbers per row (15 per card).
 * Column 0 holds 1–9, column 1 holds 10–19, … column 9 holds 90–99,
 * sorted top to bottom. Generation is seeded, so the same seed always
 * reproduces the same printed set.
 */

export const ROWS = 3;
export const COLS = 10;
const PER_ROW = 5;
const PER_CARD = ROWS * PER_ROW;

export interface BingoCardData {
  id: number;
  /** rows[r][c] is a number or null for an empty (decorated) cell. */
  rows: (number | null)[][];
}

type Random = () => number;

/** Small deterministic PRNG (mulberry32). */
function seeded(seed: number): Random {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: Random): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function columnNumbers(col: number): number[] {
  const start = col === 0 ? 1 : col * 10;
  return Array.from({ length: col * 10 + 10 - start }, (_, i) => start + i);
}

/** Decides which cells hold a number: every row gets 5, every column 1–3. */
function makeMask(rand: Random): boolean[][] | null {
  const counts = Array<number>(COLS).fill(1);
  for (let extra = PER_CARD - COLS; extra > 0;) {
    const c = Math.floor(rand() * COLS);
    if (counts[c] < ROWS) {
      counts[c]++;
      extra--;
    }
  }

  const rowLeft = Array<number>(ROWS).fill(PER_ROW);
  const mask = Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(false));
  const order = shuffle([...Array(COLS).keys()], rand).sort((a, b) => counts[b] - counts[a]);
  for (const c of order) {
    const rows = shuffle([...Array(ROWS).keys()], rand)
      .filter((r) => rowLeft[r] > 0)
      .sort((a, b) => rowLeft[b] - rowLeft[a]);
    if (rows.length < counts[c]) return null;
    for (const r of rows.slice(0, counts[c])) {
      mask[r][c] = true;
      rowLeft[r]--;
    }
  }
  return mask;
}

export function generateCards(count: number, seed: number): BingoCardData[] {
  const rand = seeded(seed);
  /** How many cards each number already appears on, to spread numbers evenly. */
  const usage = new Map<number, number>();
  const seen = new Set<string>();
  const cards: BingoCardData[] = [];

  while (cards.length < count) {
    const mask = makeMask(rand);
    if (!mask) continue;

    const rows: (number | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const picked: number[] = [];
    for (let c = 0; c < COLS; c++) {
      const slots = mask.map((row, r) => (row[c] ? r : -1)).filter((r) => r >= 0);
      const numbers = shuffle(columnNumbers(c), rand)
        .sort((a, b) => (usage.get(a) ?? 0) - (usage.get(b) ?? 0))
        .slice(0, slots.length)
        .sort((a, b) => a - b);
      slots.forEach((r, i) => (rows[r][c] = numbers[i]));
      picked.push(...numbers);
    }

    const key = picked.sort((a, b) => a - b).join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    for (const n of picked) usage.set(n, (usage.get(n) ?? 0) + 1);
    cards.push({ id: cards.length + 1, rows });
  }
  return cards;
}
