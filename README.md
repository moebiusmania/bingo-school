# Bingo School

A themed bingo (tombola) board for the classroom, made for children aged 7–10. Pick a theme, currently Classic ("Classic Bingo", for any time of year), Halloween ("Spooky Bingo") or Christmas ("Xmas Bingo"), each with its own look, sounds and challenges. The teacher runs it on a big widescreen display and the class plays along with printed cards. Between draws, the host can launch short English-language challenges.

**Play it:** [moebiusmania.github.io/bingo-school](https://moebiusmania.github.io/bingo-school/)

## Features

- **Themes.** Every theme has its own page, artwork, sounds, voice and set of challenges, and keeps its own game in progress.
- **Animated draws.** The numbers 1–99 come out of a themed draw machine, such as a spinning bingo cage, a bubbling cauldron or a rattling gift box, are read aloud, and fly onto the board. Draws use `crypto.getRandomValues`, so they are fair.
- **Sound without audio files.** Every effect is synthesized live with the Web Audio API. The Web Speech API reads each number aloud.
- **Keyboard friendly.** Press Space or Enter to draw the next number, or to skip the reveal.
- **English challenges.** There are 5 levels, one for each win from 2 in a row to Bingo, with 7 short exercises each: spelling, plurals, opposites, verbs and more. The host marks each answer **Correct** or **Wrong**, and the board celebrates or groans.
- **Printable cards.** 24 unique tombola cards fit 3 to an A4 sheet, ready to cut. Every number appears on 3–4 cards. The layout is seeded, so a printed set can always be reproduced.
- **Answers page for the host.** It lists every challenge with its answer and works on a phone.
- **Remembers the game.** The game state and settings are saved in the browser, so a page reload doesn't lose the game.

## Pages

| Page | URL | Who it's for |
| --- | --- | --- |
| Home | [`/bingo-school/`](https://moebiusmania.github.io/bingo-school/) | Anyone: lists the themes |
| Board | `/bingo-school/<theme>/`: [Classic](https://moebiusmania.github.io/bingo-school/classic/), [Halloween](https://moebiusmania.github.io/bingo-school/halloween/), [Christmas](https://moebiusmania.github.io/bingo-school/xmas/) | The class, on a widescreen display (1150 px wide or more) |
| Cards | `/bingo-school/<theme>/cards` | Print, cut and hand out. Add `?seed=123` for a different set |
| Answers | `/bingo-school/<theme>/answers` | The host only, on any device |

## Scope

Bingo School is built for one teacher running one game on one desktop screen. Phone and tablet layouts are out of scope for the board and the cards. The answers page is the exception and also works on a phone. There are no accounts, no server and no network play. Everything runs in the browser and is hosted as a static site on GitHub Pages.

## Stack

- [Bun](https://bun.sh/) as the runtime, package manager and task runner. Dependencies are listed in `package.json`.
- [Vite](https://vite.dev/) for the multi-page build: a home page, plus a board, cards and answers page for each theme.
- [Preact](https://preactjs.com/) 11 and TypeScript.
- CSS Modules. The layout uses container query units, so the board scales to fill the screen.
- Canvas 2D for the themed skies, the flying characters and the particle effects. The artwork is hand-made inline SVG.
- Web Audio API and Web Speech API.
- [Fredoka](https://fonts.google.com/specimen/Fredoka) for body text and a display font per theme (Fredoka again for Classic, [Creepster](https://fonts.google.com/specimen/Creepster), [Mountains of Christmas](https://fonts.google.com/specimen/Mountains+of+Christmas)), from Fontsource.

## Run it locally

You need [Bun](https://bun.sh/docs/installation).

```sh
git clone git@github.com:moebiusmania/bingo-school.git
cd bingo-school
bun install
bun run dev
```

Then open <http://localhost:5173/bingo-school/> and pick a theme. The dev server is also reachable from other devices on your network, which is handy for checking the answers page on a phone.

| Command | What it does |
| --- | --- |
| `bun install` | Install the dependencies |
| `bun run dev` | Start the dev server with hot reload, for the home page and every theme |
| `bun run check` | Type-check the project |
| `bun run build` | Build the home page and every theme into `dist/` |
| `bun run preview` | Serve the whole built site locally |

### Changing the challenges

Each theme has its own challenges: [`src/themes/classic/challenges.json`](src/themes/classic/challenges.json), [`src/themes/halloween/challenges.json`](src/themes/halloween/challenges.json) and [`src/themes/xmas/challenges.json`](src/themes/xmas/challenges.json). There are 5 levels with 7 challenges each, and every challenge has a `title`, a `prompt` and an `answer`. In a prompt, `\n` starts a new line. The board and the answers page both read this file, so there is nothing else to update.

### Themes

Everything themed about the game (colors, fonts, artwork, sounds, texts, challenges and page titles) lives in a folder under [`src/themes/`](src/themes/): [`classic/`](src/themes/classic/), [`halloween/`](src/themes/halloween/) and [`xmas/`](src/themes/xmas/). The game itself doesn't change between themes. Every theme is published at its own path, named after its folder, and listed on the home page. To make a new one, copy a theme folder and register its `meta.json` in [`src/themes/meta.ts`](src/themes/meta.ts): the build, the deployment and the home page pick it up from there. [`src/themes/types.ts`](src/themes/types.ts) documents every slot a theme fills.

### Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It type-checks, builds the home page and every theme, and publishes `dist/` to GitHub Pages. The home page is served from `/bingo-school/` and each theme from `/bingo-school/<theme>/`, the `base` values set in `vite.config.ts`.

## Contributing

Contributions are welcome, especially new challenges. Read [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up the project, the conventions to follow and how to open a pull request.

## License

[MIT](LICENSE) © 2026 Salvatore Laisa
