import { useEffect, useRef } from 'preact/hooks';
import { runCanvas } from './canvas.ts';
import styles from './Layers.module.css';

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

interface Fog {
  x: number;
  y: number;
  r: number;
  vx: number;
  alpha: number;
}

/** Background: twinkling stars, a glowing moon and drifting fog. */
export function SkyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stars: Star[] = [];
    let fogs: Fog[] = [];

    return runCanvas(
      ref.current!,
      (w, h) => {
        stars = Array.from({ length: Math.round((w * h) / 7000) }, () => ({
          x: Math.random() * w,
          y: Math.random() * h * 0.85,
          r: Math.random() * 1.4 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0008 + Math.random() * 0.003,
        }));
        fogs = Array.from({ length: 10 }, () => ({
          x: Math.random() * w,
          y: h * (0.7 + Math.random() * 0.35),
          r: 180 + Math.random() * 260,
          vx: (0.15 + Math.random() * 0.4) * (Math.random() < 0.5 ? -1 : 1),
          alpha: 0.05 + Math.random() * 0.06,
        }));
      },
      (ctx, w, h, dt, now) => {
        ctx.clearRect(0, 0, w, h);

        for (const s of stars) {
          const a = 0.35 + 0.65 * Math.abs(Math.sin(s.phase + now * s.speed));
          ctx.globalAlpha = a;
          ctx.fillStyle = '#fff8e0';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Moon, top right behind the control panel
        const mx = w - Math.min(w * 0.11, 210);
        const my = h * 0.17;
        const mr = Math.min(h * 0.1, 110);
        const pulse = 1 + Math.sin(now * 0.001) * 0.04;
        const glow = ctx.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 3.2 * pulse);
        glow.addColorStop(0, 'rgba(255, 236, 170, 0.35)');
        glow.addColorStop(1, 'rgba(255, 236, 170, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8);
        const body = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
        body.addColorStop(0, '#fffbe6');
        body.addColorStop(1, '#f2d98a');
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(190, 160, 90, 0.35)';
        for (const [dx, dy, r] of [[-0.3, -0.2, 0.18], [0.25, 0.15, 0.24], [-0.1, 0.4, 0.12], [0.35, -0.35, 0.1]]) {
          ctx.beginPath();
          ctx.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2);
          ctx.fill();
        }

        for (const f of fogs) {
          f.x += f.vx * dt;
          if (f.x < -f.r) f.x = w + f.r;
          if (f.x > w + f.r) f.x = -f.r;
          const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
          g.addColorStop(0, `rgba(190, 170, 230, ${f.alpha})`);
          g.addColorStop(1, 'rgba(190, 170, 230, 0)');
          ctx.fillStyle = g;
          ctx.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
        }
      },
    );
  }, []);

  return <canvas ref={ref} class={styles.sky} aria-hidden='true' />;
}
