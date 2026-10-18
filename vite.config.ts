import { defineConfig, loadEnv, type Plugin } from 'vite';
import preact from '@preact/preset-vite';
import { DEFAULT_THEME, type ThemeMeta, THEMES } from './src/themes/meta.ts';

/** Published on GitHub Pages as a project site, under /bingo-school/. Dev and preview use it too. */
const BASE = '/bingo-school/';
const SITE_URL = `https://moebiusmania.github.io${BASE}`;

/** Serves cards/ and answers/ without the trailing slash too (GitHub Pages redirects those itself). */
const PAGE_URL = new RegExp(`^${BASE}(cards|answers)(\\?.*)?$`);

function rewritePages(req: { url?: string }, _res: unknown, next: () => void) {
  const match = req.url?.match(PAGE_URL);
  if (match) req.url = `${BASE}${match[1]}/${match[2] ?? ''}`;
  next();
}

const pageRoutes: Plugin = {
  name: 'page-routes',
  configureServer: (server) => void server.middlewares.use(rewritePages),
  configurePreviewServer: (server) => void server.middlewares.use(rewritePages),
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Fills the %THEME_*% placeholders in each page's <head> from the theme's meta.json. */
function themeHead(meta: ThemeMeta): Plugin {
  const values: Record<string, string> = {
    THEME_URL: SITE_URL,
    THEME_NAME: meta.name,
    THEME_FAVICON: meta.favicon,
    THEME_COLOR: meta.themeColor,
    THEME_OG_IMAGE: meta.ogImage,
    THEME_OG_IMAGE_ALT: meta.ogImageAlt,
    THEME_DESCRIPTION_BOARD: meta.description.board,
    THEME_DESCRIPTION_CARDS: meta.description.cards,
    THEME_DESCRIPTION_ANSWERS: meta.description.answers,
  };
  return {
    name: 'theme-head',
    transformIndexHtml: {
      // before Vite's own %ENV% replacement, which would warn about unknown names
      order: 'pre',
      handler: (html) =>
        html.replace(/%(THEME_[A-Z_]+)%/g, (match, key: string) =>
          key in values ? escapeHtml(values[key]) : match
        ),
    },
  };
}

export default defineConfig(({ mode }) => {
  // THEME=xmas bun run build (or a THEME line in .env) picks a folder in src/themes/
  const theme = loadEnv(mode, '.', '').THEME || DEFAULT_THEME;
  const meta = THEMES[theme];
  if (!meta) {
    throw new Error(`Unknown THEME "${theme}". Available: ${Object.keys(THEMES).join(', ')}`);
  }

  return {
    base: BASE,
    plugins: [preact(), pageRoutes, themeHead(meta)],
    resolve: {
      alias: { '@theme': `/src/themes/${theme}/index.ts` },
    },
    css: {
      modules: { localsConvention: 'camelCaseOnly' },
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        input: {
          board: 'index.html',
          cards: 'cards/index.html',
          answers: 'answers/index.html',
        },
      },
    },
  };
});
