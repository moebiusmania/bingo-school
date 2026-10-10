/** Sizes a canvas to the viewport (HiDPI aware) and runs a frame loop. */
export function runCanvas(
  canvas: HTMLCanvasElement,
  onResize: (w: number, h: number) => void,
  onFrame: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, now: number) => void,
): () => void {
  const ctx = canvas.getContext('2d')!;
  let w = 0;
  let h = 0;
  const resize = () => {
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    onResize(w, h);
  };
  resize();
  addEventListener('resize', resize);

  let raf = 0;
  let last = performance.now();
  const loop = (now: number) => {
    // dt normalised to 60fps frames, clamped so a background tab doesn't explode physics
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    onFrame(ctx, w, h, dt, now);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
  };
}
