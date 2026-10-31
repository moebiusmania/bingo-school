import { useEffect, useRef } from 'preact/hooks';
import { runCanvas } from '../../components/canvas.ts';
import styles from '../../components/Layers.module.css';

interface Plane {
  x: number;
  baseY: number;
  vx: number;
  size: number;
  t: number;
}

function drawPlane(ctx: CanvasRenderingContext2D, p: Plane, y: number) {
  ctx.save();
  ctx.translate(p.x, y);
  ctx.scale(p.vx > 0 ? p.size : -p.size, p.size);
  ctx.rotate(Math.cos(p.t * 0.03) * 0.18);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(34, 0);
  ctx.lineTo(-26, -16);
  ctx.lineTo(-14, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c8d6e0';
  ctx.beginPath();
  ctx.moveTo(34, 0);
  ctx.lineTo(-14, 0);
  ctx.lineTo(-20, 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** A paper plane glides across the screen from time to time, above the board. */
export function PaperPlaneCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const planes: Plane[] = [];
    let next = performance.now() + 6000;

    return runCanvas(
      ref.current!,
      () => {},
      (ctx, w, h, dt, now) => {
        ctx.clearRect(0, 0, w, h);
        if (now > next) {
          const fromLeft = Math.random() < 0.5;
          const size = 0.9 + Math.random() * 0.5;
          planes.push({
            x: fromLeft ? -60 : w + 60,
            baseY: h * (0.08 + Math.random() * 0.25),
            vx: (2.4 + Math.random()) * (fromLeft ? 1 : -1),
            size,
            t: 0,
          });
          next = now + 18000 + Math.random() * 14000;
        }

        for (let i = planes.length - 1; i >= 0; i--) {
          const p = planes[i];
          p.t += dt;
          p.x += p.vx * dt;
          drawPlane(ctx, p, p.baseY + Math.sin(p.t * 0.03) * 34);
          if (p.x < -100 || p.x > w + 100) planes.splice(i, 1);
        }
      },
    );
  }, []);

  return <canvas ref={ref} class={styles.foreground} aria-hidden='true' />;
}
