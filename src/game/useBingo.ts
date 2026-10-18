import { theme } from '@theme';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

export const TOTAL_NUMBERS = 99;
const STORAGE_KEY = `${theme.storagePrefix}:drawn`;

function loadDrawn(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(
      (n): n is number => Number.isInteger(n) && n >= 1 && n <= TOTAL_NUMBERS,
    );
    return [...new Set(valid)];
  } catch {
    return [];
  }
}

/** Unbiased random integer in [0, max) using the crypto API. */
function randomInt(max: number): number {
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf); while (buf[0] >= limit);
  return buf[0] % max;
}

export function useBingo() {
  const [drawn, setDrawn] = useState<number[]>(loadDrawn);
  /** Bumped on every reset so the board can replay its intro animation. */
  const [gameId, setGameId] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drawn));
    } catch {
      // Storage unavailable (private mode etc.): the game still works in memory.
    }
  }, [drawn]);

  const drawnSet = useMemo(() => new Set(drawn), [drawn]);
  const remaining = useMemo(
    () =>
      Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).filter((n) =>
        !drawnSet.has(n)
      ),
    [drawnSet],
  );

  const pick = useCallback(
    () => (remaining.length ? remaining[randomInt(remaining.length)] : null),
    [remaining],
  );

  const commit = useCallback((n: number) => {
    setDrawn((d) => (d.includes(n) ? d : [...d, n]));
  }, []);

  const reset = useCallback(() => {
    setDrawn([]);
    setGameId((g) => g + 1);
  }, []);

  return {
    drawn,
    drawnSet,
    remaining,
    latest: drawn.at(-1) ?? null,
    pick,
    commit,
    reset,
    gameId,
  };
}
