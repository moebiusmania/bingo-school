import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { burstAt } from '../fx/fx.ts';
import { numberToWords, randomPhrase } from '../game/numberWords.ts';
import { Cauldron } from './Art.tsx';
import styles from './DrawOverlay.module.css';

export type DrawPhase = 'shuffling' | 'revealing' | 'flying';

interface DrawOverlayProps {
  phase: DrawPhase;
  number: number;
  /** Numbers flashed in the orb while the cauldron is being stirred. */
  pool: readonly number[];
  onSkip: () => void;
}

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  x: 10 + Math.random() * 80,
  delay: -i * 0.23,
  size: 1 + Math.random() * 2.2,
}));

export function DrawOverlay({ phase, number, pool, onSkip }: DrawOverlayProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(() => pool[0] ?? number);
  const [flyTransform, setFlyTransform] = useState<string>();
  const phrase = useMemo(randomPhrase, [number]);

  // Flash random numbers while stirring
  useEffect(() => {
    if (phase !== 'shuffling') return;
    const id = setInterval(() => {
      setShown(pool[Math.floor(Math.random() * pool.length)] ?? number);
    }, 80);
    return () => clearInterval(id);
  }, [phase, pool, number]);

  useEffect(() => {
    if (phase !== 'revealing') return;
    // wait for the orb to finish jumping out of the cauldron
    const t = setTimeout(() => burstAt(orbRef.current, { count: 90, power: 16, size: 11 }), 350);
    return () => clearTimeout(t);
  }, [phase]);

  // Fly the orb onto its cell on the board
  useLayoutEffect(() => {
    if (phase !== 'flying') return;
    const cell = document.querySelector(`[data-num="${number}"]`);
    const anchor = anchorRef.current;
    const orb = orbRef.current;
    if (!cell || !anchor || !orb) return;
    const c = cell.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    const scale = Math.min(c.width, c.height) / orb.offsetWidth;
    const dx = c.left + c.width / 2 - a.left;
    const dy = c.top + c.height / 2 - a.top;
    setFlyTransform(`translate(${dx}px, ${dy}px) scale(${scale})`);
  }, [phase, number]);

  const value = phase === 'shuffling' ? shown : number;

  return (
    <div
      class={`${styles.overlay} ${styles[phase]}`}
      onClick={phase === 'revealing' ? onSkip : undefined}
      role='dialog'
      aria-label='Drawing a number'
    >
      <div class={styles.caption}>
        {phase === 'shuffling'
          ? <span class={styles.stirring}>Stirring the cauldron…</span>
          : <span class={styles.phrase} key={number}>{phrase}</span>}
      </div>

      <div class={styles.anchor} ref={anchorRef}>
        <div
          class={styles.orb}
          ref={orbRef}
          style={flyTransform && phase === 'flying' ? { transform: flyTransform } : undefined}
        >
          <div class={styles.rays} />
          <div class={styles.orbInner}>
            <span class={styles.orbNumber} key={phase === 'shuffling' ? 's' : 'r'}>{value}</span>
          </div>
        </div>
      </div>

      <div class={styles.words}>
        {phase !== 'shuffling' && <span key={number}>{numberToWords(number)}</span>}
      </div>

      <div class={styles.cauldronWrap}>
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
        <Cauldron class={styles.cauldron} />
      </div>

      {phase === 'revealing' && <div class={styles.hint}>Click or press Space to continue</div>}
    </div>
  );
}
