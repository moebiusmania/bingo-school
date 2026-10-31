/**
 * Dev server for the whole site on one port: the home page at /bingo-school/
 * and every theme at /bingo-school/<theme>/, each its own Vite server.
 */
import { createServer as createHttpServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { createServer, type ViteDevServer } from 'vite';
import { THEMES } from '../src/themes/meta.ts';

const PORT = 5173;

const httpServer = createHttpServer((req, res) => {
  const url = req.url ?? '/';
  const site = themes.find(({ path }) => url === path || url.startsWith(`${path}/`) || url.startsWith(`${path}?`));
  (site?.vite ?? home).middlewares(req, res);
});

const start = (mode: string): Promise<ViteDevServer> =>
  createServer({
    mode,
    // every server pre-bundles its own dependencies, a shared cache would clash
    cacheDir: `${process.cwd()}/node_modules/.vite/${mode}`,
    server: { middlewareMode: true, ws: { server: httpServer } },
  });

const home = await start('home');
const themes = await Promise.all(
  Object.keys(THEMES).map(async (mode) => {
    const vite = await start(mode);
    return { vite, path: vite.config.base.slice(0, -1) };
  })
);

// all interfaces: always reachable from other devices on the LAN, handy for the answers page on a phone
httpServer.listen(PORT, '0.0.0.0', () => {
  const lan = Object.values(networkInterfaces())
    .flat()
    .filter((address) => address?.family === 'IPv4' && !address.internal)
    .map((address) => address?.address);
  console.log();
  for (const host of ['localhost', ...lan]) console.log(`  http://${host}:${PORT}${home.config.base}`);
  console.log();
});
