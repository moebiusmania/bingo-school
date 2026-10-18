/** Tiny event bus so any component can fire particle bursts on the FX canvas. */

/**
 * Draws one particle of roughly `size` radius, centred on the origin (already
 * translated and rotated). `ctx.fillStyle` is set to `color` beforehand.
 */
export type ParticleShape = (ctx: CanvasRenderingContext2D, size: number, color: string) => void;

export interface BurstOptions {
  count?: number;
  power?: number;
  colors?: readonly string[];
  shapes?: readonly ParticleShape[];
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
