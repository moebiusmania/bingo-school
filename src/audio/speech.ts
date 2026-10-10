import { numberToWords } from '../game/numberWords.ts';
import { sound } from './sound.ts';

const supported = 'speechSynthesis' in globalThis;
// Browsers load voices lazily: ask early so Daniel is ready for the first draw.
if (supported) speechSynthesis.getVoices();

/** Deep and slow for a spooky, but still clear, announcement. */
const PITCH = 0.75;
const RATE = 0.8;

/** Higher scores for the natural-sounding voices browsers ship; robotic ones last. */
function voiceScore(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;
  if (/natural|neural|online/.test(name)) score += 6;
  if (/premium|enhanced/.test(name)) score += 5;
  if (name.includes('google')) score += 4;
  if (/daniel|samantha|alex|karen|serena|aria|guy|jenny/.test(name)) score += 2;
  if (v.lang === 'en-US' || v.lang === 'en-GB') score += 1;
  if (/espeak|compact/.test(name)) score -= 6;
  return score;
}

function englishVoices(): SpeechSynthesisVoice[] {
  if (!supported) return [];
  return speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name));
}

/** The preferred voice; falls back to the best-ranked English voice if missing. */
const DEFAULT_VOICE = /\bdaniel\b/i;

/** Announces a drawn number, e.g. "Number… forty-two! … Four… two." */
export function speakNumber(n: number, delayMs = 450): void {
  if (!supported) return;
  speechSynthesis.cancel();
  const digits = n > 9 ? ` … ${String(n).split('').map(Number).map(numberToWords).join('… ')}.` : '';
  const utterance = new SpeechSynthesisUtterance(`Number… ${numberToWords(n)}!${digits}`);
  const voices = englishVoices();
  const voice = voices.find((v) => DEFAULT_VOICE.test(v.name)) ?? voices[0];
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? 'en-US';
  utterance.rate = RATE;
  utterance.pitch = PITCH;
  utterance.volume = 1;
  utterance.onstart = () => sound.duck(true);
  utterance.onend = utterance.onerror = () => sound.duck(false);
  setTimeout(() => speechSynthesis.speak(utterance), delayMs);
}

export function stopSpeaking(): void {
  if (supported) speechSynthesis.cancel();
  sound.duck(false);
}
