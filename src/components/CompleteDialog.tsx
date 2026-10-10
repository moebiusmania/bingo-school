import { JackOLantern } from './Art.tsx';
import styles from './Dialog.module.css';

interface CompleteDialogProps {
  onNewGame: () => void;
  onClose: () => void;
}

/** Shown when every number has been drawn. */
export function CompleteDialog({ onNewGame, onClose }: CompleteDialogProps) {
  return (
    <div class={styles.scrim} onClick={onClose}>
      <div class={`${styles.content} ${styles.celebrate}`} onClick={(e) => e.stopPropagation()}>
        <div class={styles.pumpkins}>
          {[0, 1, 2].map((i) => <JackOLantern key={i} class={styles.dancer} />)}
        </div>
        <h2 class={styles.heading}>All 99 numbers are out!</h2>
        <p class={styles.text}>What a spooktacular game!</p>
        <div class={styles.actions}>
          <button type='button' class={`${styles.action} ${styles.cancel}`} onClick={onClose}>
            Look at the board
          </button>
          <button type='button' class={`${styles.action} ${styles.confirm}`} onClick={onNewGame}>
            Play again!
          </button>
        </div>
      </div>
    </div>
  );
}
