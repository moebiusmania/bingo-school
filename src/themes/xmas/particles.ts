import type { ParticleShape } from '../../fx/fx.ts';

/** A six-armed snowflake, drawn in the burst color. */
export const snowflake: ParticleShape = (ctx, size, color) => {
  const r = size * 0.9;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.16);
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const [cx, cy] = [Math.cos(a), Math.sin(a)];
    ctx.moveTo(0, 0);
    ctx.lineTo(cx * r, cy * r);
    // a little V on each arm
    const bx = cx * r * 0.55;
    const by = cy * r * 0.55;
    for (const side of [-1, 1]) {
      const b = a + side * 0.7;
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(b) * r * 0.3, by + Math.sin(b) * r * 0.3);
    }
  }
  ctx.stroke();
};

/** A tiny bauble in the burst color, with a gold cap and a shine. */
export const bauble: ParticleShape = (ctx, size, color) => {
  const r = size * 0.6;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd84a';
  ctx.fillRect(-r * 0.35, -r * 1.25, r * 0.7, r * 0.4);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.35, r * 0.25, 0, Math.PI * 2);
  ctx.fill();
};
