import { useEffect, useRef } from 'preact/hooks';
import { runCanvas } from '../../components/canvas.ts';
import styles from '../../components/Layers.module.css';

interface Sleigh {
  x: number;
  baseY: number;
  vx: number;
  size: number;
  t: number;
}

interface Glitter {
  x: number;
  y: number;
  life: number;
}

const INK = '#0c1626';
/** Where each reindeer runs, in front of the sleigh (local units, facing right). */
const REINDEER_X = [62, 104, 146];

function drawReindeer(ctx: CanvasRenderingContext2D, x: number, gallop: number, lead: boolean) {
  ctx.save();
  ctx.translate(x, Math.sin(gallop) * 1.5);
  ctx.fillStyle = INK;
  ctx.strokeStyle = INK;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // neck and head
  ctx.beginPath();
  ctx.moveTo(8, -3);
  ctx.lineTo(14, -12);
  ctx.lineTo(21, -12);
  ctx.lineTo(22, -9);
  ctx.lineTo(16, -7);
  ctx.lineTo(12, 1);
  ctx.closePath();
  ctx.fill();
  // antlers
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(15, -12);
  ctx.lineTo(12, -21);
  ctx.moveTo(13, -17);
  ctx.lineTo(9, -19);
  ctx.moveTo(16, -12);
  ctx.lineTo(19, -20);
  ctx.moveTo(18, -16);
  ctx.lineTo(22, -18);
  ctx.stroke();
  // legs, front and back pairs swinging opposite ways
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [hip, phase] of [[-9, 0], [-6, Math.PI], [7, Math.PI], [10, 0]]) {
    const a = Math.sin(gallop + phase) * 0.6;
    ctx.moveTo(hip, 3);
    ctx.lineTo(hip + Math.sin(a) * 10, 3 + Math.cos(a) * 10);
  }
  ctx.stroke();

  if (lead) {
    ctx.fillStyle = '#ff3b3b';
    ctx.shadowColor = '#ff3b3b';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(22.5, -10, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSleigh(ctx: CanvasRenderingContext2D, s: Sleigh, y: number) {
  const gallop = s.t * 0.3;
  ctx.save();
  ctx.translate(s.x, y);
  ctx.scale(s.vx > 0 ? s.size : -s.size, s.size);
  ctx.rotate(Math.sin(s.t * 0.04) * 0.04);
  ctx.fillStyle = INK;
  ctx.strokeStyle = INK;

  // reins from the sleigh to every reindeer
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(22, -4);
  for (const x of REINDEER_X) ctx.lineTo(x + 10, -3);
  ctx.stroke();
  REINDEER_X.forEach((x, i) => drawReindeer(ctx, x, gallop + i * 0.9, i === REINDEER_X.length - 1));

  // Santa and his sack
  ctx.beginPath();
  ctx.arc(-26, -14, 9, 0, Math.PI * 2);
  ctx.arc(-10, -8, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-6, -20, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-11, -23);
  ctx.lineTo(-1, -24);
  ctx.lineTo(4, -33);
  ctx.closePath();
  ctx.fill();

  // sleigh body and curly runner
  ctx.beginPath();
  ctx.moveTo(-36, -12);
  ctx.quadraticCurveTo(-34, 6, -20, 8);
  ctx.lineTo(14, 8);
  ctx.quadraticCurveTo(24, 6, 24, -4);
  ctx.lineTo(16, -4);
  ctx.quadraticCurveTo(12, 2, 4, 2);
  ctx.lineTo(-22, 2);
  ctx.quadraticCurveTo(-28, 0, -28, -12);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-34, 14);
  ctx.lineTo(18, 14);
  ctx.quadraticCurveTo(30, 14, 30, 6);
  ctx.moveTo(-20, 8);
  ctx.lineTo(-20, 14);
  ctx.moveTo(6, 8);
  ctx.lineTo(6, 14);
  ctx.stroke();
  ctx.restore();
}

/** Santa's sleigh flies across the screen from time to time, above the board. */
export function SleighCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sleighs: Sleigh[] = [];
    const glitter: Glitter[] = [];
    let next = performance.now() + 6000;

    return runCanvas(
      ref.current!,
      () => {},
      (ctx, w, h, dt, now) => {
        ctx.clearRect(0, 0, w, h);
        if (now > next) {
          const fromLeft = Math.random() < 0.5;
          const size = 1.1 + Math.random() * 0.5;
          sleighs.push({
            // start fully off screen: the reindeer run up to ~170 units ahead of the sleigh
            x: fromLeft ? -180 * size : w + 180 * size,
            baseY: h * (0.08 + Math.random() * 0.22),
            vx: (2.2 + Math.random() * 0.8) * (fromLeft ? 1 : -1),
            size,
            t: 0,
          });
          next = now + 18000 + Math.random() * 14000;
        }

        for (let i = glitter.length - 1; i >= 0; i--) {
          const g = glitter[i];
          g.life -= dt;
          if (g.life <= 0) {
            glitter.splice(i, 1);
            continue;
          }
          g.y += 0.3 * dt;
          ctx.globalAlpha = g.life / 50;
          ctx.fillStyle = '#ffe27a';
          ctx.beginPath();
          ctx.arc(g.x, g.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        for (let i = sleighs.length - 1; i >= 0; i--) {
          const s = sleighs[i];
          s.t += dt;
          s.x += s.vx * dt;
          const y = s.baseY + Math.sin(s.t * 0.04) * 10;
          // a trail of glitter from the back of the sleigh
          if (Math.random() < 0.6 * dt) {
            const back = s.vx > 0 ? -36 : 36;
            glitter.push({ x: s.x + back * s.size + (Math.random() - 0.5) * 10, y: y + 10 * s.size, life: 50 });
          }
          drawSleigh(ctx, s, y);
          if (s.x < -300 || s.x > w + 300) sleighs.splice(i, 1);
        }
      },
    );
  }, []);

  return <canvas ref={ref} class={styles.foreground} aria-hidden='true' />;
}
