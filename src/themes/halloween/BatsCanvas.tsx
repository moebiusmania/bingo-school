import { useEffect, useRef } from 'preact/hooks';
import { runCanvas } from '../../components/canvas.ts';
import styles from '../../components/Layers.module.css';

interface Bat {
  x: number;
  baseY: number;
  vx: number;
  amp: number;
  size: number;
  t: number;
  flapSpeed: number;
}

function drawBat(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, flap: number) {
  const wing = Math.sin(flap); // -1 (down) .. 1 (up)
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.fillStyle = '#120818';
  ctx.strokeStyle = 'rgba(180, 120, 255, 0.35)';
  ctx.lineWidth = 1;

  for (const side of [-1, 1]) {
    const tip = -12 * wing;
    ctx.beginPath();
    ctx.moveTo(side * 3, -3);
    ctx.quadraticCurveTo(side * 12, tip - 8, side * 26, tip - 2);
    ctx.quadraticCurveTo(side * 22, tip * 0.5 + 4, side * 18, tip * 0.45 + 2);
    ctx.quadraticCurveTo(side * 14, tip * 0.3 + 7, side * 10, tip * 0.2 + 3);
    ctx.quadraticCurveTo(side * 6, 7, side * 3, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.ellipse(0, 0, 4.5, 7, 0, 0, Math.PI * 2);
  ctx.moveTo(-4, -4);
  ctx.lineTo(-3, -11);
  ctx.lineTo(-1, -6);
  ctx.lineTo(1, -6);
  ctx.lineTo(3, -11);
  ctx.lineTo(4, -4);
  ctx.fill();

  ctx.fillStyle = '#ffdd55';
  ctx.beginPath();
  ctx.arc(-1.7, -3, 1, 0, Math.PI * 2);
  ctx.arc(1.7, -3, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Bats flutter across the screen from time to time, above the board. */
export function BatsCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const bats: Bat[] = [];
    let nextFlock = performance.now() + 2500;

    const spawnFlock = (w: number, h: number) => {
      const fromLeft = Math.random() < 0.5;
      const count = 1 + Math.floor(Math.random() * 4);
      const baseY = h * (0.1 + Math.random() * 0.7);
      for (let i = 0; i < count; i++) {
        const speed = 2.4 + Math.random() * 2;
        bats.push({
          x: fromLeft ? -40 - i * 70 : w + 40 + i * 70,
          baseY: baseY + (Math.random() - 0.5) * 120,
          vx: fromLeft ? speed : -speed,
          amp: 15 + Math.random() * 45,
          size: 20 + Math.random() * 26,
          t: Math.random() * 10,
          flapSpeed: 0.35 + Math.random() * 0.15,
        });
      }
    };

    return runCanvas(
      ref.current!,
      () => {},
      (ctx, w, h, dt, now) => {
        ctx.clearRect(0, 0, w, h);
        if (now > nextFlock) {
          spawnFlock(w, h);
          nextFlock = now + 7000 + Math.random() * 9000;
        }
        for (let i = bats.length - 1; i >= 0; i--) {
          const b = bats[i];
          b.t += dt;
          b.x += b.vx * dt;
          const y = b.baseY + Math.sin(b.t * 0.05) * b.amp;
          drawBat(ctx, b.x, y, b.size, b.t * b.flapSpeed);
          if (b.x < -200 || b.x > w + 200) bats.splice(i, 1);
        }
      },
    );
  }, []);

  return <canvas ref={ref} class={styles.foreground} aria-hidden='true' />;
}
