// Original, procedurally generated oriental rug pattern, drawn knot by knot.
// Nothing here is copied from an existing rug: it is a medallion-and-spandrel
// layout built from simple diamond math on a knot grid, in the brand palette.

export const RUG = {
  cols: 180, // knots along the length
  rows: 116, // knots across the width
  cell: 8, // pixels per knot in the texture
  fringe: 40, // pixels of fringe on each short end
};

const C = {
  indigo: [34, 58, 93],
  indigoDeep: [23, 36, 60],
  madder: [142, 47, 40],
  madderDeep: [112, 34, 30],
  saffron: [201, 150, 58],
  wool: [236, 229, 214],
  ivory: [246, 241, 230],
  green: [76, 96, 78],
} as const;
type RGB = readonly [number, number, number];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Color of one knot. x = along the length, y = across the width. */
function knot(x: number, y: number, W: number, H: number, abrash: number[]): RGB {
  const d = Math.min(x, y, W - 1 - x, H - 1 - y); // distance to the nearest edge, in knots

  // --- Borders, from the outside in
  if (d === 0) return C.indigoDeep;
  if (d <= 2) return (x + y) % 4 === 0 ? C.madder : C.saffron; // outer guard
  if (d === 3) return C.wool;
  if (d >= 4 && d <= 17) {
    // Corner squares get their own rosette so the border turns cleanly
    const inCornerX = x <= 17 || x >= W - 18;
    const inCornerY = y <= 17 || y >= H - 18;
    if (inCornerX && inCornerY) {
      const ccx = x <= 17 ? 10.5 : W - 11.5;
      const ccy = y <= 17 ? 10.5 : H - 11.5;
      const r = Math.abs(x - ccx) + Math.abs(y - ccy);
      if (r <= 1) return C.ivory;
      if (r <= 3) return C.saffron;
      if (r <= 5) return C.indigo;
      if (r <= 6) return C.saffron;
      return C.madder;
    }
    // Main border: madder ground with a running chain of stepped diamonds
    const along = d === y || d === H - 1 - y ? x : y; // position along this side
    const across = d - 4; // 0..13 inside the band
    const period = 14;
    const pos = ((along - 4) % period + period) % period;
    const md = Math.abs(pos - 6.5) + Math.abs(across - 6.5);
    if (md <= 2) return (pos + across) % 2 ? C.ivory : C.saffron;
    if (md <= 4) return C.indigo;
    if (md <= 5) return C.saffron;
    if (across === 0 || across === 13) return C.madderDeep;
    // little ivory sprigs between the diamonds
    if (Math.abs(pos - 13.5) + Math.abs(across - 6.5) <= 1.5 || Math.abs(pos + 0.5) + Math.abs(across - 6.5) <= 1.5)
      return C.ivory;
    return C.madder;
  }
  if (d === 18) return C.wool;
  if (d <= 20) return (x + y) % 3 === 0 ? C.saffron : C.indigoDeep; // inner guard
  if (d === 21) return C.madder;

  // --- Field
  const cx = (W - 1) / 2;
  const cy = (H - 1) / 2;
  const fx0 = 22,
    fy0 = 22,
    fx1 = W - 23,
    fy1 = H - 23;

  // Central medallion: a stepped lozenge with pendants
  const a = W * 0.2,
    b = H * 0.27;
  const m = Math.abs(x - cx) / a + Math.abs(y - cy) / b;
  const pend = Math.min(
    Math.abs(Math.abs(x - cx) - a * 1.17) / 5 + Math.abs(y - cy) / 5,
    Math.abs(x - cx) / 5 + Math.abs(Math.abs(y - cy) - b * 1.12) / 4,
  );
  if (pend <= 1) return pend <= 0.45 ? C.saffron : C.madder;
  if (m <= 1) {
    if (m > 0.92) return C.saffron;
    if (m > 0.86) return C.ivory;
    if (m > 0.58) {
      // madder ring with a lattice of small indigo knots
      return (x + y) % 6 === 0 && (x - y) % 6 === 0 ? C.indigoDeep : C.madder;
    }
    if (m > 0.53) return C.saffron;
    if (m > 0.3) {
      const r = Math.abs(x - cx) + Math.abs(y - cy);
      return r % 4 === 0 ? C.green : C.indigoDeep;
    }
    if (m > 0.24) return C.ivory;
    if (m > 0.12) return C.madder;
    return C.saffron;
  }

  // Corner spandrels: quarter medallions in each corner of the field
  for (const [ex, ey] of [
    [fx0, fy0],
    [fx1, fy0],
    [fx0, fy1],
    [fx1, fy1],
  ]) {
    const mc = Math.abs(x - ex) / (W * 0.12) + Math.abs(y - ey) / (H * 0.2);
    if (mc <= 1) {
      if (mc > 0.9) return C.saffron;
      if (mc > 0.8) return C.madderDeep;
      return (x + y) % 6 === 0 && (x - y) % 6 === 0 ? C.ivory : C.madder;
    }
  }

  // Scattered eight-point stars across the open field
  const sx = 14,
    sy = 12;
  const row = Math.floor((y - fy0) / sy);
  const ox = row % 2 ? sx / 2 : 0;
  const lx = ((x - fx0 + ox) % sx + sx) % sx - sx / 2;
  const ly = ((y - fy0) % sy) - sy / 2;
  const star = Math.abs(lx) + Math.abs(ly) <= 2 || ((lx === 0 || ly === 0) && Math.abs(lx + ly) <= 3);
  const scx = x - lx,
    scy = y - ly;
  const centerClear =
    Math.abs(scx - cx) / a + Math.abs(scy - cy) / b > 1.3 &&
    scx - fx0 >= 4 && fx1 - scx >= 4 && scy - fy0 >= 3 && fy1 - scy >= 3 &&
    [[fx0, fy0], [fx1, fy0], [fx0, fy1], [fx1, fy1]].every(
      ([ex, ey]) => Math.abs(scx - ex) / (W * 0.12) + Math.abs(scy - ey) / (H * 0.2) > 1.25,
    ) &&
    Math.abs(Math.abs(scx - cx) - a * 1.17) + Math.abs(scy - cy) > 9;
  if (star && centerClear && Math.abs(lx) <= 3) return (Math.abs(lx) + Math.abs(ly)) % 2 ? C.saffron : C.ivory;

  // Indigo ground with abrash: natural dye-lot banding of a handmade rug
  const k = abrash[x];
  return [C.indigo[0] * k, C.indigo[1] * k, C.indigo[2] * k];
}

export interface RugTexture {
  width: number;
  height: number;
  /** Fraction of the texture width taken by each fringe */
  fringeU: number;
}

/** Draws the rug onto a canvas (fringe on the two short ends, transparent around it). */
export function drawRug(canvas: HTMLCanvasElement | OffscreenCanvas, seed = 1987): RugTexture {
  const { cols: W, rows: H, cell, fringe } = RUG;
  const width = W * cell + fringe * 2;
  const height = H * cell;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const rand = mulberry32(seed);

  // Abrash: slow, irregular lightness bands along the length
  const abrash: number[] = [];
  let v = 1;
  for (let x = 0; x < W; x++) {
    if (rand() < 0.07) v = 0.9 + rand() * 0.16;
    abrash.push(v);
  }

  ctx.clearRect(0, 0, width, height);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = knot(x, y, W, H, abrash);
      const j = 0.95 + rand() * 0.09; // each knot's wool takes dye slightly differently
      ctx.fillStyle = `rgb(${Math.min(255, c[0] * j) | 0},${Math.min(255, c[1] * j) | 0},${Math.min(255, c[2] * j) | 0})`;
      ctx.fillRect(fringe + x * cell, y * cell, cell, cell);
    }
  }

  // Pile texture: a soft knot grid and a light sheen
  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  for (let x = 0; x <= W; x++) ctx.fillRect(fringe + x * cell, 0, 1, height);
  for (let y = 0; y <= H; y++) ctx.fillRect(fringe, y * cell + cell - 1, W * cell, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let y = 0; y < H; y++) ctx.fillRect(fringe, y * cell, W * cell, 2);

  // Fringe: bundles of wool warps, knotted at the rug's edge
  for (const side of [0, 1]) {
    for (let y = 2; y < height - 2; y += 3) {
      const len = fringe * (0.78 + rand() * 0.22);
      const wave = (rand() - 0.5) * 6;
      const x0 = side ? fringe + W * cell : fringe;
      const dir = side ? 1 : -1;
      ctx.strokeStyle = `rgba(${236 - rand() * 18},${229 - rand() * 18},${210 - rand() * 18},1)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.quadraticCurveTo(x0 + dir * len * 0.5, y + wave * 0.5, x0 + dir * len, y + wave);
      ctx.stroke();
    }
    // the knotted heading along the edge
    ctx.fillStyle = 'rgba(214, 203, 182, 1)';
    const hx = side ? fringe + W * cell : fringe - 5;
    ctx.fillRect(hx, 0, 5, height);
  }

  return { width, height, fringeU: fringe / width };
}
