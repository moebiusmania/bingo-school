# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

An interactive bingo (tombola) board with swappable themes (currently only "Spooky Bingo", Halloween) for children aged 7–10, operated by a teacher on a widescreen desktop monitor. Mobile layouts are out of scope, except for the host-only `/answers` page, which must work on a phone. All UI text and code are in English.

Stack: Bun + Vite + Preact (v11) + TypeScript + CSS Modules. Dependencies live in `package.json` (lockfile `bun.lock`). Scripts run Vite and `tsc` on the Bun runtime via `bun --bun`.

## Commands

```sh
bun install        # install dependencies
bun run dev        # Vite dev server, exposed on the LAN (--host) for testing from other devices
bun run build      # production build to dist/ (three pages: board, cards, answers)
THEME=halloween bun run build   # pick the theme (folder in src/themes/); also works with dev, or as a THEME line in .env
bun run preview    # serve the built dist/
bun run check      # type-check src/ and vite.config.ts (tsc --noEmit, see tsconfig.json)
```

There are no tests and no lint task. Verify changes with `bun run check` and `bun run build`. Do not install headless browsers to check the UI; the user tests in their own browser.

## Architecture

### Pages (Vite multi-page)
- `index.html` → `src/main.tsx` → `App.tsx`: the board.
- `cards/index.html` → `src/cards/main.tsx`: printable player cards.
- `answers/index.html` → `src/answers/main.tsx`: host-only list of every challenge in `challenges.json` with its answer, printable.
- The site is published on GitHub Pages under `/bingo-school/`. `vite.config.ts` sets that as `base` (dev and preview too, so the local URL is `http://localhost:5173/bingo-school/`). In-app links must use `import.meta.env.BASE_URL`, never a hard-coded `/`.
- Each page's `<head>` has SEO and social share tags (Open Graph + Twitter) with absolute URLs to `https://moebiusmania.github.io/bingo-school/`. Title, favicon, descriptions, theme color and share image are `%THEME_*%` placeholders that the `theme-head` plugin in `vite.config.ts` fills from the theme's `meta.json`. Halloween's share image is `public/og-image.jpg` (1200×630). `/answers` is `noindex`.
- `.github/workflows/deploy.yml` type-checks, builds and deploys `dist/` to GitHub Pages on every push to `main` (or by hand from the Actions tab).
- A small plugin in `vite.config.ts` rewrites `/bingo-school/cards` and `/bingo-school/answers` to add the trailing slash in both dev and preview. Every page is listed in `build.rollupOptions.input`.
- `vite.config.ts` imports `src/themes/meta.ts` (JSON imports only) and is type-checked without Node typings (`tsconfig.json` only loads `vite/client`), so don't reference Node types like `IncomingMessage`. Use structural types instead.

### Themes (`src/themes/`)
Game logic, layout, sizing and motion are theme-neutral. Everything that gives the game its look, sound and content comes from the active theme.
- `types.ts` defines the `Theme` contract. Core code imports the active theme with `import { theme } from '@theme'`. That alias is set in `vite.config.ts` from the `THEME` env var (default `halloween`), so only one theme is bundled. `tsconfig.json` maps `@theme` to Halloween for type-checking, and every theme's `index.ts` is typed as `Theme`.
- A theme folder has `index.ts` (the `Theme` object, plus side-effect imports of its fonts and `theme.css`), `meta.json` (HTML head; register it in `src/themes/meta.ts`), `theme.css` (design tokens on `:root`, plus any global classes its SVG artwork uses), `challenges.json`, its artwork, background/foreground canvases, extra particle shapes and sound recipes.
- **Colors**: component CSS uses only the tokens from `theme.css` (`--c-text`, `--c-surface*`, `--c-primary*`, `--c-secondary*`, `--c-accent*`, `--c-highlight`, glows, `--font-display`/`--font-body`, and the textured `--page-bg`, `--board-bg`, `--cell-bg`, `--cell-drawn-bg`, `--card-bg`), plus the per-level `--hue` set inline from `levelHues`. Translucent variants use `color-mix(in oklch, var(--token) N%, transparent)`, so tokens stay opaque. Neutral black/white shadows, the white paper tiles on printed cards and the red of a wrong answer stay literal. Every theme must define every token.
- **Art slots**: `Mascot` (panel header, reset dialog, cards, "Oops!" stamp), `Token` (board corner, difficulty pips, end-of-game dancers, "Correct!" stamp), the three button icons, `DrawMachine` (gets the draw `phase`), optional `BoardDecor`/`CardDecor`, `cardFillers` for empty card cells. `drawnCellClass` adds theme styling to drawn cells (Halloween's pumpkin stem in `::after`; `::before` is the latest-number ring).
- Theme-only CSS (cobwebs, spider, cauldron and bubbles, pumpkin stem) lives in the theme's own CSS module (`halloween/Decor.module.css`), not in `src/components/`.

### Board draw flow (`src/App.tsx`)
A phase state machine drives each draw: `idle → shuffling → revealing → flying → idle`. The timings are the `*_MS` constants.
- The number is picked at the start but only committed to game state (`useBingo().commit`) when the fly animation ends.
- `DrawOverlay` animates the orb onto its board cell by finding it with `document.querySelector('[data-num="N"]')`. Board cells must keep the `data-num` attribute.
- Reset goes through a confirm `<dialog>`, then a `resetting` phase that animates the cells out. After that, `useBingo().reset()` bumps `gameId`, which re-keys the board grid so its intro animation replays.
- Keyboard: Space/Enter draws a number, or skips the reveal while it's showing. It is ignored while a modal is open and when a non-draw button has keyboard (`:focus-visible`) focus.
- The Challenge button opens `ChallengeDialog` (levels 1–5, one per win: ambo, terna, quaterna, cinquina, tombola; each level's name is what the class shouts for that win; `src/game/challenges.ts` re-exports the theme's `levelNames`/`levelHues` as `LEVEL_NAMES`/`LEVEL_HUES`). Choosing a level swaps the picker for `ChallengeCard`, which shows an English exercise drawn from the theme's `challenges.json` (7 per level, `title`/`prompt`/`answer`; `\n` in a prompt is a line break). `nextChallenge()` deals each level like a shuffled deck so nothing repeats until all of a level's challenges are used. The host presses Correct or Wrong, which plays `sound.correct()`/`sound.wrong()`, a stamp and card animation, a particle burst, and reveals the answer.
- Native `<dialog>`s render above the page's `FxCanvas`, so `ChallengeDialog` mounts its own `FxCanvas` while open.

### State & persistence
`src/game/useBingo.ts` holds the drawn numbers, picked with unbiased `crypto.getRandomValues`. Game state and settings persist in `localStorage` under `spooky-bingo:*` keys. All access is wrapped in try/catch.

### Sizing model (important when touching CSS)
- `.app` (`App.module.css`) is a size container (`container-type: size`) with height `max(100dvh, 680px)` and `min-width: 1150px`. Below roughly a 13" laptop viewport the page scrolls instead of shrinking.
- Board and ControlPanel CSS use `cqh`/`cqw` units relative to `.app`, not `vh`/`vw`. A container's own properties can't use its own `cq` units, which is why `.app`'s own gap, padding and column width use `vw`/`vh`.
- Each board cell is also a size container. Anything inside a cell (number text, the pumpkin stem `::after`, the latest-number ring `::before`) is sized in `cq` units relative to the cell itself.
- Fixed overlays and dialogs (`DrawOverlay`, `Dialog.module.css`, `ChallengeDialog`) use `vh`/`vw`, because they always cover the viewport.

### Rendering layers
Fixed full-screen canvases are stacked by z-index: the theme's `Background` (0; Halloween's `SkyCanvas`: stars/moon/fog) < `.app` (1) < the theme's `Foreground` (5; Halloween's `BatsCanvas`) < `DrawOverlay` (10) < `CompleteDialog` scrim (30) < `FxCanvas` (50). Native `<dialog>`s sit in the top layer.
- Theme layers use the `background`/`foreground` classes from `components/Layers.module.css` and `runCanvas` from `components/canvas.ts`.
- Particle bursts go through a tiny event bus, `src/fx/fx.ts` (`burst`, `burstAt`), which `FxCanvas` listens to. A `ParticleShape` is a draw function; `fx/shapes.ts` has the neutral `star` and `dot`, themes add their own (Halloween: `candy`, `pumpkin`). Default colors and shapes come from `theme.particles`.
- Halloween's SVG artwork lives in `themes/halloween/Art.tsx`. Its animated SVG parts use global (non-module) classes defined in `themes/halloween/theme.css`, such as `jol-glow`, `cd-flames` and `cd-bubble`. Neutral UI icons (speaker, voice) are in `components/Icons.tsx`.

### Audio
- `src/audio/synth.ts`: the `Synth` engine. Every sound effect is synthesized with the Web Audio API (no audio files) from `tone()` and `noise()` calls. The `AudioContext` is created lazily on first use. There's a master gain, a compressor and a generated convolution reverb.
- `src/audio/sound.ts`: the `SoundPack` interface (click, shuffle, reveal, whoosh, land, reset, correct, wrong, fanfare) and the `sound` object the app calls, which runs the theme's recipes. `audio/defaultSounds.ts` holds the theme-neutral ones; Halloween overrides `shuffle` (cauldron), `reveal` (ghostly "woooo") and `reset` (witch cackle) in `themes/halloween/sounds.ts`.
- `duck()` lowers the effects while speech plays. `MASTER_VOLUME` and `DUCKED_VOLUME` were tuned with the user.
- `src/audio/speech.ts`: Web Speech API number announcer. It prefers a voice named "Daniel", then falls back to the best-ranked English voice. Speech can't be routed through Web Audio, so pitch and rate (from `theme.voice`) are the only way to give it character. The UI only has a voice on/off toggle; the user removed a voice picker.

### Printable cards (`src/cards/`)
- `generateCards.ts` produces 24 unique cards in the tombola layout: 3 rows × 10 columns, 5 numbers per row. Column `c` holds `c*10..c*10+9` (column 0 holds 1–9), sorted top to bottom.
- It uses a seeded PRNG (default seed 2026, overridable with `?seed=`) so a printed set can be reproduced exactly. Usage balancing makes every number 1–99 appear on 3–4 cards.
- Layout is in `mm`: A4 sheets with 3 cards each, every card exactly 99 mm (one third of the page height) so a printed page cuts into 3 cards. `print.css` sets `@page` and turns on `print-color-adjust: exact`.

### Preact 11 notes
- `style` objects accept CSS custom properties directly (`style={{ '--i': n }}`); no type casts are needed.
- Numeric style values don't get an automatic `px` suffix, so pass strings that include units.
- CSS Modules use `localsConvention: 'camelCaseOnly'`.
