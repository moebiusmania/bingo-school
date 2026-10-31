import type { ParticleShape } from '../../fx/fx.ts';

/** A strip of paper confetti in the burst color. */
export const confetti: ParticleShape = (ctx, size, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(-size * 0.8, -size * 0.3, size * 1.6, size * 0.6);
};
