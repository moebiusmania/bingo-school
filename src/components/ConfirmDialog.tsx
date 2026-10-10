import { useEffect, useRef } from 'preact/hooks';
import { Ghost } from './Art.tsx';
import styles from './Dialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

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
        <Ghost class={styles.ghost} />
        <h2 class={styles.heading}>Start a new game?</h2>
        <p class={styles.text}>All the pumpkins will vanish from the board!</p>
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
