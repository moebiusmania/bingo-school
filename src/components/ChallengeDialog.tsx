import { theme } from '@theme';
import { useEffect, useRef, useState } from 'preact/hooks';
import { sound } from '../audio/sound.ts';
import {
  type Challenge,
  CHALLENGE_LEVELS,
  type ChallengeLevel,
  LEVEL_HUES,
  LEVEL_NAMES,
  nextChallenge,
} from '../game/challenges.ts';
import { ChallengeCard } from './ChallengeCard.tsx';
import { FxCanvas } from './FxCanvas.tsx';
import dialogStyles from './Dialog.module.css';
import styles from './ChallengeDialog.module.css';

interface ChallengeDialogProps {
  open: boolean;
  onClose: () => void;
}

const { ChallengeIcon, Token } = theme.art;

export function ChallengeDialog({ open, onClose }: ChallengeDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<
    { level: ChallengeLevel; challenge: Challenge } | null
  >(null);

  useEffect(() => {
    const dialog = ref.current!;
    if (open && !dialog.open) {
      setActive(null);
      dialog.showModal();
    } else if (!open && dialog.open) dialog.close();
  }, [open]);

  const select = (level: ChallengeLevel) => {
    sound.click();
    setActive({ level, challenge: nextChallenge(level) });
  };

  return (
    <dialog
      ref={ref}
      class={dialogStyles.dialog}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {/* native dialogs sit above the page's FxCanvas, so bursts need their own canvas in here */}
      {open && <FxCanvas />}

      {active
        ? (
          <ChallengeCard
            key={active.challenge.prompt}
            level={active.level}
            levelName={LEVEL_NAMES[active.level]}
            challenge={active.challenge}
            onBack={() => {
              sound.click();
              setActive(null);
            }}
            onClose={onClose}
          />
        )
        : (
          <div class={`${dialogStyles.content} ${styles.content}`}>
            <ChallengeIcon class={styles.icon} />
            <h2 class={dialogStyles.heading}>Choose a challenge!</h2>
            <p class={dialogStyles.text}>{theme.text.challengeQuestion}</p>

            <div class={styles.levels}>
              {CHALLENGE_LEVELS.map((level) => {
                const isBingo = level === 5;
                return (
                  <button
                    key={level}
                    type='button'
                    class={`${styles.level} ${isBingo ? styles.bingo : ''}`}
                    style={{ '--hue': LEVEL_HUES[level], '--delay': level }}
                    onClick={() => select(level)}
                  >
                    <span class={styles.levelLabel}>Level</span>
                    <span class={styles.levelNumber}>{level}</span>
                    <span
                      class={isBingo ? styles.bingoLabel : styles.levelName}
                    >
                      {LEVEL_NAMES[level]}
                    </span>
                    <span
                      class={styles.difficulty}
                      aria-label={`Difficulty ${level} of 5`}
                    >
                      {CHALLENGE_LEVELS.map((i) => (
                        <Token
                          key={i}
                          class={i <= level
                            ? styles.tokenOn
                            : styles.tokenOff}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            <div class={dialogStyles.actions}>
              <button
                type='button'
                class={`${dialogStyles.action} ${dialogStyles.cancel}`}
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
    </dialog>
  );
}
