import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';

/** Published on GitHub Pages as a project site, under /bingo-school/. Dev and preview use it too. */
const BASE = '/bingo-school/';

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

export default defineConfig({
  base: BASE,
  plugins: [preact(), pageRoutes],
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
});
