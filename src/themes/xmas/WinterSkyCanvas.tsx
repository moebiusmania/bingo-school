import { useEffect, useRef } from 'preact/hooks';
import { runCanvas } from '../../components/canvas.ts';
import styles from '../../components/Layers.module.css';

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

interface Flake {
  x: number;
  y: number;
  r: number;
  phase: number;
  sway: number;
}

interface Pine {
  x: number;
  size: number;
}

/** A gentle hill line across the bottom of the screen. */
function hill(w: number, h: number, base: number, waves: [number, number, number][]): [number, number][] {
  const pts: [number, number][] = [];
  for (let x = 0; x <= w + 20; x += 20) {
    let y = h * base;
    for (const [freq, amp, shift] of waves) y += Math.sin((x / w) * Math.PI * freq + shift) * h * amp;
    pts.push([x, y]);
  }
  return pts;
}

function fillHill(ctx: CanvasRenderingContext2D, pts: [number, number][], h: number, fill: string) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (const [x, y] of pts) ctx.lineTo(x, y);
  ctx.lineTo(pts[pts.length - 1][0], h);
  ctx.closePath();
  ctx.fill();
}

/** Background: twinkling stars, a frosty moon, falling snow and snowy hills with pines. */
export function WinterSkyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stars: Star[] = [];
    let flakes: Flake[] = [];
    let farHill: [number, number][] = [];
    let nearHill: [number, number][] = [];
    let pines: Pine[] = [];

    return runCanvas(
      ref.current!,
      (w, h) => {
        stars = Array.from({ length: Math.round((w * h) / 9000) }, () => ({
          x: Math.random() * w,
          y: Math.random() * h * 0.7,
          r: Math.random() * 1.3 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0008 + Math.random() * 0.003,
        }));
        flakes = Array.from({ length: Math.round((w * h) / 6000) }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2,
          sway: 0.3 + Math.random() * 0.8,
        }));
        farHill = hill(w, h, 0.86, [[2.2, 0.03, 1], [5, 0.012, 0]]);
        nearHill = hill(w, h, 0.93, [[1.6, 0.035, 2.5], [4, 0.01, 1]]);
        pines = Array.from({ length: Math.round(w / 90) }, () => ({
          x: Math.random() * w,
          size: 14 + Math.random() * 26,
        }));
      },
      (ctx, w, h, dt, now) => {
        ctx.clearRect(0, 0, w, h);

        for (const s of stars) {
          ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.phase + now * s.speed));
          ctx.fillStyle = '#eaf4ff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Moon, top right behind the control panel
        const mx = w - Math.min(w * 0.11, 210);
        const my = h * 0.17;
        const mr = Math.min(h * 0.09, 100);
        const pulse = 1 + Math.sin(now * 0.001) * 0.04;
        const glow = ctx.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 3.2 * pulse);
        glow.addColorStop(0, 'rgba(200, 225, 255, 0.32)');
        glow.addColorStop(1, 'rgba(200, 225, 255, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8);
        const body = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
        body.addColorStop(0, '#ffffff');
        body.addColorStop(1, '#d6e4fa');
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(150, 175, 215, 0.3)';
        for (const [dx, dy, r] of [[-0.3, -0.2, 0.18], [0.25, 0.15, 0.24], [-0.1, 0.4, 0.12], [0.35, -0.35, 0.1]]) {
          ctx.beginPath();
          ctx.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2);
          ctx.fill();
        }

        fillHill(ctx, farHill, h, 'rgba(190, 212, 245, 0.2)');
        ctx.fillStyle = 'rgba(14, 32, 48, 0.75)';
        for (const p of pines) {
          const i = Math.min(farHill.length - 1, Math.round(p.x / 20));
          const y = farHill[i][1] + 4;
          ctx.beginPath();
          ctx.moveTo(p.x, y - p.size * 1.6);
          ctx.lineTo(p.x - p.size * 0.5, y);
          ctx.lineTo(p.x + p.size * 0.5, y);
          ctx.closePath();
          ctx.fill();
        }

        // bigger flakes fall faster, for a little depth
        ctx.fillStyle = '#ffffff';
        for (const f of flakes) {
          f.y += (0.2 + f.r * 0.25) * dt;
          f.x += Math.sin(f.phase + now * 0.001 * f.sway) * 0.35 * dt;
          if (f.y > h + 5) {
            f.y = -5;
            f.x = Math.random() * w;
          }
          ctx.globalAlpha = 0.45 + f.r / 6;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        fillHill(ctx, nearHill, h, 'rgba(220, 234, 255, 0.32)');
      },
    );
  }, []);

  return <canvas ref={ref} class={styles.background} aria-hidden='true' />;
}
