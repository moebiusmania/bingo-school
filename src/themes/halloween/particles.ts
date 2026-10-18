import type { ParticleShape } from '../../fx/fx.ts';

/** A wrapped sweet. */
export const candy: ParticleShape = (ctx, size, color) => {
  const r = size * 0.7;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-r * 0.7, 0);
  ctx.lineTo(-r * 1.6, -r * 0.6);
  ctx.lineTo(-r * 1.6, r * 0.6);
  ctx.closePath();
  ctx.moveTo(r * 0.7, 0);
  ctx.lineTo(r * 1.6, -r * 0.6);
  ctx.lineTo(r * 1.6, r * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = r * 0.25;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.45, 0.3, 2.2);
  ctx.stroke();
};

/** A little pumpkin; ignores the burst colors. */
export const pumpkin: ParticleShape = (ctx, size) => {
  const r = size * 0.9;
  ctx.fillStyle = '#ff8c1a';
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, 0, r * 0.6, r * 0.8, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.35, 0, r * 0.6, r * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffa53d';
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.5, r * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3f8f2a';
  ctx.fillRect(-r * 0.12, -r * 1.15, r * 0.24, r * 0.4);
};
