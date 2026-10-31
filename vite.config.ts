import { defineConfig, type Plugin, type UserConfig } from 'vite';
import preact from '@preact/preset-vite';
import { type ThemeMeta, THEMES } from './src/themes/meta.ts';

/**
 * Published on GitHub Pages as a project site, under /bingo-school/. Dev and preview use it too.
 * The home page lives there, and each theme is a separate build under /bingo-school/<theme>/.
 */
const BASE = '/bingo-school/';
const SITE_URL = `https://moebiusmania.github.io${BASE}`;

/** Vite mode that builds the home page instead of a theme. */
const HOME = 'home';

/** Serves cards/ and answers/ without the trailing slash too (GitHub Pages redirects those itself). */
function pageRoutes(base: string): Plugin {
  const pageUrl = new RegExp(`^${base}(cards|answers)(\\?.*)?$`);
  const rewritePages = (req: { url?: string }, _res: unknown, next: () => void) => {
    const match = req.url?.match(pageUrl);
    if (match) req.url = `${base}${match[1]}/${match[2] ?? ''}`;
    next();
  };
  return {
    name: 'page-routes',
    configureServer: (server) => void server.middlewares.use(rewritePages),
    configurePreviewServer: (server) => void server.middlewares.use(rewritePages),
  };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Fills the %THEME_*% placeholders in each page's <head> from the theme's meta.json. */
function themeHead(meta: ThemeMeta, url: string): Plugin {
  const values: Record<string, string> = {
    THEME_URL: url,
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
  const shared: UserConfig = {
    // reachable from other devices on the LAN, handy for the answers page on a phone
    server: { host: true },
    css: {
      modules: { localsConvention: 'camelCaseOnly' },
    },
  };

  // --mode xmas picks a folder in src/themes/, --mode home the home page
  const theme = mode;

  if (theme === HOME) {
    return {
      ...shared,
      root: 'home',
      base: BASE,
      // only built once, here: the share images stay at /bingo-school/<image>
      publicDir: '../public',
      plugins: [preact()],
      build: { target: 'esnext', outDir: '../dist', emptyOutDir: true },
    };
  }

  const meta = THEMES[theme];
  if (!meta) {
    throw new Error(`Unknown mode "${theme}". Available: ${[HOME, ...Object.keys(THEMES)].join(', ')}`);
  }

  const base = `${BASE}${theme}/`;

  return {
    ...shared,
    base,
    publicDir: false,
    plugins: [preact(), pageRoutes(base), themeHead(meta, `${SITE_URL}${theme}/`)],
    resolve: {
      alias: { '@theme': `/src/themes/${theme}/index.ts` },
    },
    build: {
      target: 'esnext',
      outDir: `dist/${theme}`,
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
