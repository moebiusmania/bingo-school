import { theme } from '@theme';
import { CHALLENGE_LEVELS, CHALLENGES, LEVEL_HUES, LEVEL_NAMES } from '../game/challenges.ts';
import styles from './AnswersPage.module.css';

/** Host-only cheat sheet: every challenge from challenges.json with its answer. */
export function AnswersPage() {
  return (
    <>
      <header class={styles.toolbar}>
        <a class={styles.back} href={import.meta.env.BASE_URL}>← Back to the board</a>
        <div class={styles.info}>
          <strong>Challenge answers</strong>
          <span>For the host only. {theme.text.answersWarning}</span>
        </div>
        <button type='button' class={styles.print} onClick={() => print()}>Print</button>
      </header>

      <main class={styles.levels}>
        {CHALLENGE_LEVELS.map((level) => (
          <section key={level} class={styles.level} style={{ '--hue': LEVEL_HUES[level] }}>
            <h2 class={styles.levelHeading}>
              <span class={styles.levelNumber}>Level {level}</span> {LEVEL_NAMES[level]}
            </h2>
            <ol class={styles.list}>
              {CHALLENGES[level].map((challenge, i) => (
                <li key={i} class={styles.item}>
                  <span class={styles.title}>{challenge.title}</span>
                  <p class={styles.prompt}>{challenge.prompt}</p>
                  <p class={styles.answer}>
                    <span class={styles.answerLabel}>Answer:</span> {challenge.answer}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </main>
    </>
  );
}
