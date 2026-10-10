/** Tiny event bus so any component can fire particle bursts on the FX canvas. */

export type ParticleShape = 'star' | 'candy' | 'dot' | 'pumpkin';

export interface BurstOptions {
  count?: number;
  power?: number;
  colors?: string[];
  shapes?: ParticleShape[];
  size?: number;
}

type Listener = (x: number, y: number, options: BurstOptions) => void;
const listeners = new Set<Listener>();

export function burst(x: number, y: number, options: BurstOptions = {}): void {
  for (const listener of listeners) listener(x, y, options);
}

export function burstAt(el: Element | null, options: BurstOptions = {}): void {
  if (!el) return;
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, options);
}

export function onBurst(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
