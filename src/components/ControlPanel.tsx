import { numberToWords } from '../game/numberWords.ts';
import { TOTAL_NUMBERS } from '../game/useBingo.ts';
import { BroomIcon, CauldronIcon, Ghost, SpeakerIcon, VoiceIcon, WitchHatIcon } from './Art.tsx';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  drawn: readonly number[];
  latest: number | null;
  busy: boolean;
  finished: boolean;
  soundOn: boolean;
  voiceOn: boolean;
  onDraw: () => void;
  onReset: () => void;
  onChallenge: () => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
}

const HISTORY_SIZE = 6;

function WobblyText({ text, class: cls }: { text: string; class?: string }) {
  return (
    <span class={cls} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden='true' style={{ '--i': i }}>{ch}</span>
      ))}
    </span>
  );
}

export function ControlPanel(props: ControlPanelProps) {
  const { drawn, latest, busy, finished } = props;
  const history = drawn.slice(-HISTORY_SIZE - 1, -1).reverse();
  const progress = (drawn.length / TOTAL_NUMBERS) * 100;

  let drawLabel = 'Draw!';
  if (finished) drawLabel = 'All done!';
  else if (busy) drawLabel = 'Stirring…';

  return (
    <aside class={styles.panel}>
      <header class={styles.header}>
        <Ghost class={styles.ghost} />
        <h1 class={styles.title}>
          <WobblyText text='Spooky' class={styles.titleLine} />
          <WobblyText text='Bingo' class={styles.titleLine} />
        </h1>
      </header>

      <section class={styles.latestCard} aria-live='polite'>
        <div class={styles.latestLabel}>Last number</div>
        {latest === null
          ? (
            <>
              <div class={`${styles.latestOrb} ${styles.empty}`}>?</div>
              <div class={styles.latestWords}>Press “Draw!” to start</div>
            </>
          )
          : (
            <>
              <div class={styles.latestOrb} key={latest}>{latest}</div>
              <div class={styles.latestWords} key={`w${latest}`}>{numberToWords(latest)}</div>
            </>
          )}
      </section>

      <button
        type='button'
        data-draw
        class={`${styles.button} ${styles.drawButton}`}
        disabled={busy || finished}
        aria-busy={busy}
        onClick={props.onDraw}
      >
        <CauldronIcon class={styles.drawIcon} />
        <span class={styles.drawText}>
          {drawLabel}
          {!busy && !finished && <small>or press Space</small>}
        </span>
      </button>

      <button
        type='button'
        class={`${styles.button} ${styles.challengeButton}`}
        disabled={busy}
        onClick={props.onChallenge}
      >
        <WitchHatIcon class={styles.icon} />
        <span>Challenge</span>
      </button>

      <button
        type='button'
        class={`${styles.button} ${styles.resetButton}`}
        disabled={busy || drawn.length === 0}
        onClick={props.onReset}
      >
        <BroomIcon class={styles.icon} />
        <span>New game</span>
      </button>

      <section class={styles.progress}>
        <div class={styles.progressLabel}>
          <span>Numbers drawn</span>
          <b>
            {drawn.length} <small>/ {TOTAL_NUMBERS}</small>
          </b>
        </div>
        <div class={styles.track}>
          <div class={styles.fill} style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section class={styles.history}>
        <div class={styles.historyLabel}>Before that</div>
        <div class={styles.chips}>
          {history.length === 0 && <span class={styles.noHistory}>Nothing yet…</span>}
          {history.map((n) => <span key={n} class={styles.chip}>{n}</span>)}
        </div>
      </section>

      <footer class={styles.toggles}>
        <button
          type='button'
          class={styles.toggle}
          aria-pressed={props.soundOn}
          onClick={props.onToggleSound}
        >
          <SpeakerIcon on={props.soundOn} class={styles.toggleIcon} />
          Sound {props.soundOn ? 'on' : 'off'}
        </button>
        <button
          type='button'
          class={styles.toggle}
          aria-pressed={props.voiceOn}
          disabled={!props.soundOn}
          onClick={props.onToggleVoice}
        >
          <VoiceIcon on={props.voiceOn} class={styles.toggleIcon} />
          Voice {props.voiceOn ? 'on' : 'off'}
        </button>
      </footer>
    </aside>
  );
}
