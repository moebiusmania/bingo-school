# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Spooky Bingo": a Halloween-themed interactive bingo (tombola) board for children aged 7–10, operated by a teacher on a widescreen desktop monitor. Mobile layouts are out of scope, except for the host-only `/answers` page, which must work on a phone. All UI text and code are in English.

Stack: Deno + Vite + Preact (v11) + TypeScript + CSS Modules. npm packages come in through `deno.json` `imports` with `nodeModulesDir: "auto"`. There is no `package.json`.

## Commands

```sh
deno task dev      # Vite dev server, exposed on the LAN (--host) for testing from other devices
deno task build    # production build to dist/ (three pages: board, cards, answers)
deno task preview  # serve the built dist/
deno task check    # type-check src/ and vite.config.ts
```

There are no tests and no lint task. Verify changes with `deno task check` and `deno task build`. Do not install headless browsers to check the UI; the user tests in their own browser.

## Architecture

### Pages (Vite multi-page)
- `index.html` → `src/main.tsx` → `App.tsx`: the board.
- `cards/index.html` → `src/cards/main.tsx`: printable player cards.
- `answers/index.html` → `src/answers/main.tsx`: host-only list of every challenge in `challenges.json` with its answer, printable.
- The site is published on GitHub Pages under `/bingo-school/`. `vite.config.ts` sets that as `base` (dev and preview too, so the local URL is `http://localhost:5173/bingo-school/`). In-app links must use `import.meta.env.BASE_URL`, never a hard-coded `/`.
- Each page's `<head>` has SEO and social share tags (Open Graph + Twitter) with absolute URLs to `https://moebiusmania.github.io/bingo-school/`. They all share `public/og-image.jpg` (1200×630). `/answers` is `noindex`.
- `.github/workflows/deploy.yml` type-checks, builds and deploys `dist/` to GitHub Pages on every push to `main` (or by hand from the Actions tab).
- A small plugin in `vite.config.ts` rewrites `/bingo-school/cards` and `/bingo-school/answers` to add the trailing slash in both dev and preview. Every page is listed in `build.rollupOptions.input`.
- `vite.config.ts` is type-checked by Deno without Node typings, so don't reference Node types like `IncomingMessage`. Use structural types instead.

### Board draw flow (`src/App.tsx`)
A phase state machine drives each draw: `idle → shuffling → revealing → flying → idle`. The timings are the `*_MS` constants.
- The number is picked at the start but only committed to game state (`useBingo().commit`) when the fly animation ends.
- `DrawOverlay` animates the orb onto its board cell by finding it with `document.querySelector('[data-num="N"]')`. Board cells must keep the `data-num` attribute.
- Reset goes through a confirm `<dialog>`, then a `resetting` phase that animates the cells out. After that, `useBingo().reset()` bumps `gameId`, which re-keys the board grid so its intro animation replays.
- Keyboard: Space/Enter draws a number, or skips the reveal while it's showing. It is ignored while a modal is open and when a non-draw button has keyboard (`:focus-visible`) focus.
- The Challenge button opens `ChallengeDialog` (levels 1–5; level 5 is Bingo; `LEVEL_NAMES` and `LEVEL_HUES` live in `src/game/challenges.ts`). Choosing a level swaps the picker for `ChallengeCard`, which shows an English exercise drawn from `src/game/challenges.json` (5 per level, `title`/`prompt`/`answer`; `\n` in a prompt is a line break). `nextChallenge()` deals each level like a shuffled deck so nothing repeats until all 5 are used. The host presses Correct or Wrong, which plays `sound.correct()`/`sound.wrong()`, a stamp and card animation, a particle burst, and reveals the answer.
- Native `<dialog>`s render above the page's `FxCanvas`, so `ChallengeDialog` mounts its own `FxCanvas` while open.

### State & persistence
`src/game/useBingo.ts` holds the drawn numbers, picked with unbiased `crypto.getRandomValues`. Game state and settings persist in `localStorage` under `spooky-bingo:*` keys. All access is wrapped in try/catch.

### Sizing model (important when touching CSS)
- `.app` (`App.module.css`) is a size container (`container-type: size`) with height `max(100dvh, 680px)` and `min-width: 1150px`. Below roughly a 13" laptop viewport the page scrolls instead of shrinking.
- Board and ControlPanel CSS use `cqh`/`cqw` units relative to `.app`, not `vh`/`vw`. A container's own properties can't use its own `cq` units, which is why `.app`'s own gap, padding and column width use `vw`/`vh`.
- Each board cell is also a size container. Anything inside a cell (number text, the pumpkin stem `::after`, the latest-number ring `::before`) is sized in `cq` units relative to the cell itself.
- Fixed overlays and dialogs (`DrawOverlay`, `Dialog.module.css`, `ChallengeDialog`) use `vh`/`vw`, because they always cover the viewport.

### Rendering layers
Fixed full-screen canvases are stacked by z-index: `SkyCanvas` (0, stars/moon/fog) < `.app` (1) < `BatsCanvas` (5) < `DrawOverlay` (10) < `CompleteDialog` scrim (30) < `FxCanvas` (50). Native `<dialog>`s sit in the top layer.
- Particle bursts go through a tiny event bus, `src/fx/fx.ts` (`burst`, `burstAt`), which `FxCanvas` listens to.
- Shared SVG artwork lives in `components/Art.tsx`. Its animated SVG parts use global (non-module) classes defined in `styles/global.css`, such as `jol-glow`, `cd-flames` and `cd-bubble`.

### Audio
- `src/audio/sound.ts`: every sound effect is synthesized with the Web Audio API (no audio files). The `AudioContext` is created lazily on first use. There's a master gain, a compressor and a generated convolution reverb.
- `duck()` lowers the effects while speech plays. `MASTER_VOLUME` and `DUCKED_VOLUME` were tuned with the user.
- `src/audio/speech.ts`: Web Speech API number announcer. It prefers a voice named "Daniel", then falls back to the best-ranked English voice. Speech can't be routed through Web Audio, so pitch and rate are the only way to make it sound spooky. The UI only has a voice on/off toggle; the user removed a voice picker.

### Printable cards (`src/cards/`)
- `generateCards.ts` produces 24 unique cards in the tombola layout: 3 rows × 10 columns, 5 numbers per row. Column `c` holds `c*10..c*10+9` (column 0 holds 1–9), sorted top to bottom.
- It uses a seeded PRNG (default seed 2026, overridable with `?seed=`) so a printed set can be reproduced exactly. Usage balancing makes every number 1–99 appear on 3–4 cards.
- Layout is in `mm`: A4 sheets with 3 cards each, every card exactly 99 mm (one third of the page height) so a printed page cuts into 3 cards. `print.css` sets `@page` and turns on `print-color-adjust: exact`.

### Preact 11 notes
- `style` objects accept CSS custom properties directly (`style={{ '--i': n }}`); no type casts are needed.
- Numeric style values don't get an automatic `px` suffix, so pass strings that include units.
- CSS Modules use `localsConvention: 'camelCaseOnly'`.
