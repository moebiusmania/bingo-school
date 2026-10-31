import { useEffect, useRef } from 'preact/hooks';
import { runCanvas } from '../../components/canvas.ts';
import styles from '../../components/Layers.module.css';

interface Ball {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  color: string;
  label: string;
}

const COLORS = ['#ff5c93', '#ffd84a', '#4fd8c4', '#a98bff', '#7fd0ff'];

/** Background: faint numbered bingo balls drifting slowly upwards. */
export function BallsCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let balls: Ball[] = [];

    return runCanvas(
      ref.current!,
      (w, h) => {
        balls = Array.from({ length: Math.round((w * h) / 60000) }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 16 + Math.random() * 30,
          speed: 0.12 + Math.random() * 0.25,
          phase: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          label: String(1 + Math.floor(Math.random() * 99)),
        }));
      },
      (ctx, w, h, dt, now) => {
        ctx.clearRect(0, 0, w, h);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const b of balls) {
          b.y -= b.speed * dt;
          if (b.y < -b.r) {
            b.y = h + b.r;
            b.x = Math.random() * w;
          }
          const x = b.x + Math.sin(b.phase + now * 0.0005) * 14;

          ctx.globalAlpha = 0.16;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x, b.y, b.r * 0.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = '#0f2b36';
          ctx.font = `600 ${b.r * 0.6}px Fredoka, sans-serif`;
          ctx.fillText(b.label, x, b.y);
        }
        ctx.globalAlpha = 1;
      },
    );
  }, []);

  return <canvas ref={ref} class={styles.background} aria-hidden='true' />;
}
