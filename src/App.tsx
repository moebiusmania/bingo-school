import { theme } from '@theme';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { sound } from './audio/sound.ts';
import { speakNumber, stopSpeaking } from './audio/speech.ts';
import { ChallengeDialog } from './components/ChallengeDialog.tsx';
import { Board } from './components/Board.tsx';
import { CompleteDialog } from './components/CompleteDialog.tsx';
import { ConfirmDialog } from './components/ConfirmDialog.tsx';
import { ControlPanel } from './components/ControlPanel.tsx';
import { type DrawPhase, DrawOverlay } from './components/DrawOverlay.tsx';
import { FullscreenButton } from './components/FullscreenButton.tsx';
import { FxCanvas } from './components/FxCanvas.tsx';
import { burst, burstAt } from './fx/fx.ts';
import { useStoredBoolean } from './game/useStoredBoolean.ts';
import { TOTAL_NUMBERS, useBingo } from './game/useBingo.ts';
import styles from './App.module.css';

type Phase = 'idle' | DrawPhase;

const { Background, Foreground } = theme;

const SHUFFLE_MS = 2200;
const REVEAL_MS = 2600;
const FLY_MS = 750;
const RESET_MS = 1500;

export function App() {
  const game = useBingo();
  const [phase, setPhase] = useState<Phase>('idle');
  const [pending, setPending] = useState<number | null>(null);
  const [resetting, setResetting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [soundOn, setSoundOn] = useStoredBoolean(`${theme.storagePrefix}:sound`, true);
  const [voiceOn, setVoiceOn] = useStoredBoolean(`${theme.storagePrefix}:voice`, true);

  const busy = phase !== 'idle' || resetting;
  const finished = game.remaining.length === 0;

  useEffect(() => {
    sound.setMuted(!soundOn);
    if (!soundOn) stopSpeaking();
  }, [soundOn]);

  const startDraw = useCallback(() => {
    if (busy || confirmOpen || challengeOpen) return;
    const n = game.pick();
    if (n === null) return;
    setPending(n);
    setPhase('shuffling');
    sound.shuffle(SHUFFLE_MS / 1000);
  }, [busy, confirmOpen, challengeOpen, game.pick]);

  const skipReveal = useCallback(() => {
    if (phase === 'revealing') setPhase('flying');
  }, [phase]);

  // Drive the draw animation: shuffling -> revealing -> flying -> idle
  useEffect(() => {
    if (pending === null) return;
    let timer: number | undefined;
    switch (phase) {
      case 'shuffling':
        timer = setTimeout(() => setPhase('revealing'), SHUFFLE_MS);
        break;
      case 'revealing':
        sound.reveal();
        if (soundOn && voiceOn) speakNumber(pending);
        timer = setTimeout(() => setPhase('flying'), REVEAL_MS);
        break;
      case 'flying': {
        sound.whoosh();
        const completesGame = game.drawn.length + 1 === TOTAL_NUMBERS;
        timer = setTimeout(() => {
          game.commit(pending);
          setPhase('idle');
          setPending(null);
          sound.land();
          requestAnimationFrame(() =>
            burstAt(document.querySelector(`[data-num="${pending}"]`), { count: 35, power: 9, size: 7 })
          );
          if (completesGame) {
            setTimeout(() => {
              setCelebrating(true);
              sound.fanfare();
              for (let i = 0; i < 5; i++) {
                setTimeout(
                  () => burst(innerWidth * (0.2 + Math.random() * 0.6), innerHeight * (0.2 + Math.random() * 0.4), { count: 70, power: 15 }),
                  i * 300,
                );
              }
            }, 700);
          }
        }, FLY_MS);
        break;
      }
    }
    return () => clearTimeout(timer);
  }, [phase]);

  const requestReset = useCallback(() => {
    if (busy) return;
    sound.click();
    setConfirmOpen(true);
  }, [busy]);

  const confirmReset = useCallback(() => {
    setConfirmOpen(false);
    setCelebrating(false);
    stopSpeaking();
    setResetting(true);
    sound.reset();
  }, []);

  useEffect(() => {
    if (!resetting) return;
    const timer = setTimeout(() => {
      game.reset();
      setResetting(false);
    }, RESET_MS);
    return () => clearTimeout(timer);
  }, [resetting]);

  // Space / Enter draws a number (or skips the reveal), unless another button has focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'Enter' && e.code !== 'NumpadEnter') return;
      if (confirmOpen || challengeOpen || celebrating) return;
      const target = e.target as HTMLElement | null;
      // only a button focused with the keyboard (Tab) keeps its own Space/Enter behaviour
      if (target?.closest('button:not([data-draw]):focus-visible')) return;
      e.preventDefault();
      if (e.type !== 'keydown' || e.repeat) return;
      if (phase === 'revealing') skipReveal();
      else startDraw();
    };
    addEventListener('keydown', onKey);
    addEventListener('keyup', onKey);
    return () => {
      removeEventListener('keydown', onKey);
      removeEventListener('keyup', onKey);
    };
  }, [confirmOpen, challengeOpen, celebrating, phase, skipReveal, startDraw]);

  return (
    <>
      {Background && <Background />}
      <main class={styles.app}>
        <Board
          drawn={game.drawnSet}
          latest={game.latest}
          resetting={resetting}
          gameId={game.gameId}
        />
        <ControlPanel
          drawn={game.drawn}
          latest={game.latest}
          busy={busy}
          finished={finished}
          soundOn={soundOn}
          voiceOn={voiceOn}
          onDraw={startDraw}
          onReset={requestReset}
          onChallenge={() => {
            sound.click();
            setChallengeOpen(true);
          }}
          onToggleSound={() => {
            setSoundOn((on) => !on);
            if (!soundOn) requestAnimationFrame(() => sound.click());
          }}
          onToggleVoice={() => {
            sound.click();
            setVoiceOn((on) => !on);
          }}
        />
      </main>
      {Foreground && <Foreground />}
      <FullscreenButton />

      {phase !== 'idle' && pending !== null && (
        <DrawOverlay phase={phase} number={pending} pool={game.remaining} onSkip={skipReveal} />
      )}

      <ChallengeDialog
        open={challengeOpen}
        onClose={() => {
          sound.click();
          setChallengeOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={confirmReset}
        onCancel={() => {
          sound.click();
          setConfirmOpen(false);
        }}
      />

      {celebrating && (
        <CompleteDialog
          onNewGame={confirmReset}
          onClose={() => {
            sound.click();
            setCelebrating(false);
          }}
        />
      )}

      <FxCanvas />
    </>
  );
}
