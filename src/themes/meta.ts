/**
 * Registry of the available themes. vite.config.ts reads it to fill the HTML
 * <head> of every page, so it must stay free of anything but JSON imports.
 */
import halloween from './halloween/meta.json' with { type: 'json' };

export interface ThemeMeta {
  /** Page title and social share site name, e.g. "Spooky Bingo". */
  name: string;
  /** A single emoji, used as the favicon. */
  favicon: string;
  /** `<meta name="theme-color">`. */
  themeColor: string;
  /** Social share image, relative to public/ (1200×630). */
  ogImage: string;
  ogImageAlt: string;
  description: { board: string; cards: string; answers: string };
}

export const THEMES: Record<string, ThemeMeta> = { halloween };

export const DEFAULT_THEME = 'halloween';
