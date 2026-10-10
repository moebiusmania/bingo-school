import { useRef, useState } from 'preact/hooks';
import { sound } from '../audio/sound.ts';
import { burst, burstAt } from '../fx/fx.ts';
import { type Challenge, type ChallengeLevel, LEVEL_HUES } from '../game/challenges.ts';
import { Ghost, JackOLantern } from './Art.tsx';
import dialogStyles from './Dialog.module.css';
import styles from './ChallengeCard.module.css';

type Result = 'correct' | 'wrong';

interface ChallengeCardProps {
  level: ChallengeLevel;
  levelName: string;
  challenge: Challenge;
  onBack: () => void;
  onClose: () => void;
}

export function ChallengeCard(
  { level, levelName, challenge, onBack, onClose }: ChallengeCardProps,
) {
  const [result, setResult] = useState<Result | null>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const judge = (r: Result) => {
    setResult(r);
    if (r === 'correct') {
      sound.correct();
      // wait for the stamp to land before throwing confetti
      setTimeout(() => {
        burstAt(stampRef.current, { count: 70, power: 14 });
        const card = cardRef.current?.getBoundingClientRect();
        if (!card) return;
        setTimeout(
          () =>
            burst(card.left, card.top + card.height * 0.4, {
              count: 50,
              power: 13,
            }),
          150,
        );
        setTimeout(
          () =>
            burst(card.right, card.top + card.height * 0.4, {
              count: 50,
              power: 13,
            }),
          300,
        );
      }, 250);
    } else {
      sound.wrong();
      setTimeout(
        () =>
          burstAt(stampRef.current, {
            count: 30,
            power: 6,
            shapes: ['dot'],
            colors: ['#8a7f99', '#5d5370', '#b9a8d1'],
          }),
        250,
      );
    }
  };

  return (
    <div
      ref={cardRef}
      class={`${dialogStyles.content} ${styles.card}`}
      style={{ '--hue': LEVEL_HUES[level] }}
      data-result={result ?? undefined}
    >
      <span class={styles.badge}>
        Level {level} · {levelName}
      </span>
      <h2 class={dialogStyles.heading}>{challenge.title}</h2>
      <p class={styles.prompt}>{challenge.prompt}</p>

      {result && (
        <>
          <div ref={stampRef} class={styles.stamp}>
            {result === 'correct'
              ? <JackOLantern class={styles.stampArt} />
              : <Ghost class={styles.stampArt} />}
            <span>{result === 'correct' ? 'Correct!' : 'Oops!'}</span>
          </div>
          <p class={styles.answer}>
            <span class={styles.answerLabel}>Answer:</span> {challenge.answer}
          </p>
        </>
      )}

      <div class={dialogStyles.actions}>
        {result
          ? (
            <>
              <button
                type='button'
                class={`${dialogStyles.action} ${dialogStyles.cancel}`}
                onClick={onBack}
              >
                Another challenge
              </button>
              <button
                type='button'
                class={`${dialogStyles.action} ${dialogStyles.confirm}`}
                onClick={onClose}
              >
                Back to the board
              </button>
            </>
          )
          : (
            <>
              <button
                type='button'
                class={`${styles.judge} ${styles.wrong}`}
                onClick={() => judge('wrong')}
              >
                <span aria-hidden='true'>✘</span> Wrong
              </button>
              <button
                type='button'
                class={`${styles.judge} ${styles.correct}`}
                onClick={() => judge('correct')}
              >
                <span aria-hidden='true'>✔</span> Correct
              </button>
            </>
          )}
      </div>
    </div>
  );
}
