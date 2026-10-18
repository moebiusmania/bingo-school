import { theme } from '@theme';
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

/** Top-most canvas that renders particle bursts fired through fx.ts. */
export function FxCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const particles: Particle[] = [];

    const off = onBurst((x, y, o) => {
      const colors = o.colors ?? theme.particles.colors;
      const shapes = o.shapes ?? theme.particles.shapes;
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
          p.shape(ctx, p.size, p.color);
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
