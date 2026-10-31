import { render } from 'preact';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/700.css';
import { THEMES } from '../src/themes/meta.ts';
import styles from './Home.module.css';

const BASE = import.meta.env.BASE_URL;

function Home() {
  return (
    <main class={styles.page}>
      <header class={styles.header}>
        <h1 class={styles.title}>Bingo School</h1>
        <p class={styles.intro}>Pick a theme, print the cards and play.</p>
      </header>
      <div class={styles.themes}>
        {Object.entries(THEMES).map(([id, meta]) => (
          <article class={styles.theme} style={{ '--theme-color': meta.themeColor }} key={id}>
            <a class={styles.play} href={`${BASE}${id}/`}>
              <span class={styles.emoji} aria-hidden="true">{meta.favicon}</span>
              <h2 class={styles.name}>{meta.name}</h2>
              <p class={styles.tagline}>{meta.tagline}</p>
            </a>
            <nav class={styles.links} aria-label={`${meta.name} pages`}>
              <a href={`${BASE}${id}/cards/`}>Cards</a>
              <a href={`${BASE}${id}/answers/`}>Answers</a>
            </nav>
          </article>
        ))}
      </div>
    </main>
  );
}

render(<Home />, document.getElementById('app')!);
