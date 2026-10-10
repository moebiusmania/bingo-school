import { useEffect, useRef } from 'preact/hooks';
import { onBurst, type ParticleShape } from '../fx/fx.ts';
import { runCanvas } from './canvas.ts';
import styles from './Layers.module.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  shape: ParticleShape;
  life: number;
  maxLife: number;
}

const DEFAULT_COLORS = ['#ff9a1f', '#ffcc33', '#b46bff', '#7dff6b', '#ff5fa2', '#fff4d6'];
const DEFAULT_SHAPES: ParticleShape[] = ['star', 'candy', 'dot', 'pumpkin'];

function drawStar(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.45 : r;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
}

function drawCandy(ctx: CanvasRenderingContext2D, r: number, color: string) {
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
}

function drawPumpkin(ctx: CanvasRenderingContext2D, r: number) {
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
}

/** Top-most canvas that renders particle bursts fired through fx.ts. */
export function FxCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const particles: Particle[] = [];

    const off = onBurst((x, y, o) => {
      const colors = o.colors ?? DEFAULT_COLORS;
      const shapes = o.shapes ?? DEFAULT_SHAPES;
      const power = o.power ?? 10;
      const size = o.size ?? 8;
      for (let i = 0; i < (o.count ?? 40); i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = power * (0.3 + Math.random() * 0.7);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - power * 0.35,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          size: size * (0.6 + Math.random() * 0.8),
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          life: 0,
          maxLife: 60 + Math.random() * 50,
        });
      }
    });

    const stop = runCanvas(
      ref.current!,
      () => {},
      (ctx, w, h, dt) => {
        ctx.clearRect(0, 0, w, h);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life += dt;
          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }
          p.vy += 0.28 * dt;
          p.vx *= 0.985 ** dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vr * dt;

          ctx.save();
          ctx.globalAlpha = Math.min(1, (1 - p.life / p.maxLife) * 1.6);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          switch (p.shape) {
            case 'star':
              drawStar(ctx, p.size);
              break;
            case 'candy':
              drawCandy(ctx, p.size * 0.7, p.color);
              break;
            case 'pumpkin':
              drawPumpkin(ctx, p.size * 0.9);
              break;
            default:
              ctx.beginPath();
              ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
              ctx.fill();
          }
          ctx.restore();
        }
      },
    );

    return () => {
      off();
      stop();
    };
  }, []);

  return <canvas ref={ref} class={styles.fx} aria-hidden='true' />;
}
