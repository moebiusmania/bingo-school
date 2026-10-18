# Contributing to Spooky Bingo

Thanks for helping make classroom bingo spookier! This guide explains how to set up the project, what to keep in mind while changing it, and how to send your changes.

## Ways to help

- **Write challenges.** New or better English exercises are the easiest and most useful contribution. See [Writing challenges](#writing-challenges) below.
- **Report bugs.** Open an issue that says what you did, what you expected and what happened. Include your browser and screen size.
- **Suggest ideas.** Open an issue before you start a large feature, so we can agree on the approach first.
- **Fix bugs or improve the code.** Pick an open issue or send a focused pull request.

## Setup

You need [Bun](https://bun.sh/docs/installation). Run `bun install` once to install the dependencies listed in `package.json`.

```sh
git clone git@github.com:<your-user>/bingo-school.git
cd bingo-school
bun install
bun run dev   # http://localhost:5173/bingo-school/
```

## Before you open a pull request

The project has no automated tests, so please check your changes by hand:

1. `bun run check` passes.
2. `bun run build` passes.
3. You tried your change in a browser. For the board, use a desktop window at least 1150 px wide. For the answers page, also try a phone-sized window.

The deploy workflow runs the same check and build, so a pull request that fails them can't be deployed.

## Conventions

- **English only.** All UI text, code, comments and commit messages are in English.
- **Desktop first.** The board and the cards are designed for a widescreen desktop monitor, and phone layouts are out of scope for them. Only the answers page needs to work on a phone.
- **Sizing.** Board and control panel CSS uses container query units (`cqh`/`cqw`) relative to the app, not `vh`/`vw`. Full-screen overlays and dialogs use `vh`/`vw`. Board cells must keep their `data-num` attribute, because the draw animation uses it to find each cell.
- **Base path.** The site is served from `/bingo-school/`. Write in-app links with `import.meta.env.BASE_URL`, never a hard-coded `/`.
- **Preact 11.** Numeric style values don't get an automatic `px`, so pass strings with units, for example `'12px'`. CSS custom properties can go straight into `style` objects.
- **No audio files.** Sound effects are synthesized with the Web Audio API. Theme-neutral ones go in `src/audio/defaultSounds.ts`, themed ones in the theme's `sounds.ts`.
- **Themes.** Components in `src/components/` stay theme-neutral: take artwork, text and sounds from `theme` (`import { theme } from '@theme'`), and colors only from the tokens in the theme's `theme.css`. Anything that only makes sense for one theme goes in its folder under `src/themes/`.
- **Storage.** Anything saved in `localStorage` uses the theme's `storagePrefix` (`spooky-bingo:`, `xmas-bingo:`) and is wrapped in `try`/`catch`.
- **Match the surrounding code.** Follow the naming, formatting and comment style of the file you're editing. Strings use single quotes.

[`CLAUDE.md`](CLAUDE.md) has a more detailed tour of the architecture: the draw state machine, the rendering layers, audio and the printable cards.

## Writing challenges

Challenges live in each theme's `challenges.json`: [`src/themes/halloween/challenges.json`](src/themes/halloween/challenges.json) and [`src/themes/xmas/challenges.json`](src/themes/xmas/challenges.json):

```json
{ "title": "Spell it!", "prompt": "Spell the word:\nGHOST", "answer": "G - H - O - S - T" }
```

- **`title`** is a short heading the children see, such as "Spell it!", "Opposites" or "Fill the gap".
- **`prompt`** is the exercise itself. Keep it short enough to read from the back of a classroom. Use `\n` for a line break.
- **`answer`** is shown after the host marks the answer, and on the answers page. If more than one answer is fine, start with "For example:".

Guidelines:

- **Audience.** The players are children aged 7–10 who are learning English. Use simple words and a friendly tone, and match the theme of the file (Halloween or Christmas) where you can.
- **Difficulty.** Each level should be a small step up from the one before. Level 1 is single words: colors, animals, counting. Level 5 asks for short sentences and simple grammar, such as the past tense, comparatives or spotting a mistake.
- **Answerable out loud.** A child should be able to answer in under a minute, without writing anything down.
- **Five per level.** The board deals each level's challenges like a shuffled deck. If you add more, keep the number roughly even across levels.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Keep each pull request focused on one change.
3. Describe what you changed and why. For visual changes, add a screenshot.
4. Make sure `bun run check` and `bun run build` pass.

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
