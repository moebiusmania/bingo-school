/** Builds the whole site: the home page at dist/, then every theme at dist/<theme>/. */
import { build } from 'vite';
import { THEMES } from '../src/themes/meta.ts';

// home goes first: it empties dist/
for (const mode of ['home', ...Object.keys(THEMES)]) {
  await build({ mode });
}
