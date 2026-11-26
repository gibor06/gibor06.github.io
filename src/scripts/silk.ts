/** Projected silk surface. No WebGL dependency; pause when offscreen or hidden. */
export function initSilk() {
  const canvas = document.querySelector<HTMLCanvasElement>('.silk-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const ctx = context;
  const element = canvas;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 699px)');
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let width = 0, height = 0, frame = 0, time = 0, last = 0;
  let visible = true;

  function resize() {
    const rect = element.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, narrow.matches ? 1.5 : 2);
    element.width = Math.round(width * dpr);
    element.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (motion.matches) draw(0);
  }

  function draw(t: number) {
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width * .29, height * .30);
    const yaw = -.22 + Math.sin(t * .16) * .22 + pointer.x * .16;
    const pitch = -.32 + Math.cos(t * .13) * .1 + pointer.y * .12;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const strands = narrow.matches ? 40 : 64;
    const samples = narrow.matches ? 110 : 155;
    const layers: { points: number[][]; depth: number; v: number }[] = [];

    for (let j = 0; j < strands; j++) {
      const v = j / (strands - 1);
      const band = (v - .5) * 1.12;
      const points: number[][] = [];
      let depth = 0;
      for (let k = 0; k <= samples; k++) {
        const u = k / samples * Math.PI * 2;
        // A wide twisted ribbon, deformed by slow travelling waves.
        const twist = u * 1.5 + t * .22;
        const wave = Math.sin(u * 3 - t * .48) * .085;
        const radius = 1.01 + band * Math.cos(twist) + wave;
        const x = radius * Math.cos(u);
        const y = radius * Math.sin(u) * .88;
        const z = band * Math.sin(twist) + Math.sin(u * 2 + t * .3) * .28;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const perspective = 3.8 / (3.8 - z2);
        points.push([width / 2 + x1 * scale * perspective, height * .48 + y1 * scale * perspective]);
        depth += z2;
      }
      layers.push({ points, depth: depth / (samples + 1), v });
    }

    layers.sort((a, b) => a.depth - b.depth);
    for (const layer of layers) {
      const edge = Math.pow(Math.abs(layer.v - .5) * 2, 3);
      const light = Math.max(0, Math.min(1, .55 + layer.depth * .7));
      const alpha = .18 + light * .4 + edge * .22;
      const gradient = ctx.createLinearGradient(width * .15, height * .1, width * .8, height * .85);
      gradient.addColorStop(0, `rgba(211,229,255,${alpha})`);
      gradient.addColorStop(.35, `rgba(153,194,255,${alpha})`);
      gradient.addColorStop(.65, `rgba(94,126,208,${alpha * .7})`);
      gradient.addColorStop(1, `rgba(196,174,248,${alpha})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = edge > .9 ? 1.15 : .65;
      ctx.beginPath();
      layer.points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke();
    }
  }

  function tick(stamp: number) {
    frame = 0;
    if (!visible || document.hidden || motion.matches) { last = 0; return; }
    // Use real elapsed time; clamp the first frame after a visibility change.
    if (last) time += Math.min((stamp - last) / 1000, .05);
    last = stamp;
    pointer.x += (pointer.targetX - pointer.x) * .035;
    pointer.y += (pointer.targetY - pointer.y) * .035;
    draw(time);
    frame = requestAnimationFrame(tick);
  }
  function resume() {
    if (motion.matches) { cancelAnimationFrame(frame); frame = 0; draw(time); }
    else if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(element);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) { cancelAnimationFrame(frame); frame = 0; last = 0; }
    else resume();
  });
  intersection.observe(element);
  document.addEventListener('visibilitychange', resume);
  motion.addEventListener('change', resume);
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    element.addEventListener('pointermove', event => {
      const rect = element.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.targetY = (event.clientY - rect.top) / rect.height * 2 - 1;
    });
    element.addEventListener('pointerleave', () => { pointer.targetX = 0; pointer.targetY = 0; });
  }
  resize();
  draw(0);
  resume();
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  });
  window.addEventListener('pageshow', resume);
}
