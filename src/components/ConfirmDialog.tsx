import { theme } from '@theme';
import { useEffect, useRef } from 'preact/hooks';
import styles from './Dialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const { Mascot } = theme.art;

export function ConfirmDialog({ open, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current!;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      class={styles.dialog}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        // clicking the backdrop closes the dialog
        if (e.target === ref.current) onCancel();
      }}
    >
      <div class={styles.content}>
        <Mascot class={styles.mascot} />
        <h2 class={styles.heading}>Start a new game?</h2>
        <p class={styles.text}>{theme.text.resetWarning}</p>
        <div class={styles.actions}>
          <button type='button' class={`${styles.action} ${styles.cancel}`} onClick={onCancel} autofocus>
            No, keep playing
          </button>
          <button type='button' class={`${styles.action} ${styles.confirm}`} onClick={onConfirm}>
            Yes, new game!
          </button>
        </div>
      </div>
    </dialog>
  );
}
