// three.js hero: a handmade rug that unrolls across the hero, then tilts gently with the mouse.
// Loaded only on larger screens, after first paint, and only when motion is allowed (see RugHero.astro).
import {
  BufferAttribute,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  ShadowMaterial,
  WebGLRenderer,
} from 'three';
import { drawRug } from './rug-pattern';

export interface RugOptions {
  /** Starting amount unrolled (0–1). The desktop poster image shows this same state. */
  startT?: number;
  /** Render one still frame at this state and stop (used to make the poster images). */
  still?: number;
  duration?: number;
  /** Hold the first frame this long (ms) while the canvas fades in over the poster */
  delay?: number;
  onReady?: () => void;
  /** Don't auto-unroll; drive the unroll yourself with setT() (e.g. from scroll position) */
  manual?: boolean;
}

const SEGMENTS = 260;
const THICKNESS = 0.0075; // how thick each layer of the roll is
const CORE = 0.045; // radius of the innermost turn

export const CAMERA = { fov: 26, pos: [0.0, 5.0, 3.2] as const, target: [0.04, 0, 0.08] as const };

export function mountRug(stage: HTMLElement, opts: RugOptions = {}) {
  const { startT = 0.07, duration = 1200, delay = 0 } = opts;
  const still = opts.still;

  // --- Renderer -----------------------------------------------------------
  const canvas = document.createElement('canvas');
  canvas.className = 'rug-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
    preserveDrawingBuffer: still !== undefined,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(CAMERA.fov, 1, 0.1, 40);
  camera.position.set(...CAMERA.pos);
  camera.lookAt(...CAMERA.target);

  scene.add(new HemisphereLight(0xffffff, 0xd9cdb6, 1.55));
  const sun = new DirectionalLight(new Color('#fff6e8'), 1.35);
  sun.position.set(-2.2, 4.5, 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -2.4;
  sun.shadow.camera.right = 2.4;
  sun.shadow.camera.top = 2;
  sun.shadow.camera.bottom = -2;
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0008;
  scene.add(sun);

  // --- Rug ------------------------------------------------------------------
  const texCanvas = document.createElement('canvas');
  const tex = drawRug(texCanvas);
  const texture = new CanvasTexture(texCanvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const L = 3.2; // length, including fringe
  const W = (L * tex.height) / tex.width;
  const geometry = new PlaneGeometry(L, W, SEGMENTS, 1);
  geometry.rotateX(-Math.PI / 2); // lie flat: x = length, z = width
  const pos = geometry.attributes.position as BufferAttribute;
  const baseX = Float32Array.from({ length: pos.count }, (_, i) => pos.getX(i) + L / 2); // 0..L along the rug

  const material = new MeshStandardMaterial({
    map: texture,
    side: DoubleSide,
    roughness: 0.94,
    metalness: 0,
    alphaTest: 0.35,
  });
  const rug = new Mesh(geometry, material);
  rug.castShadow = true;
  rug.receiveShadow = true;

  const floor = new Mesh(new PlaneGeometry(9, 7), new ShadowMaterial({ opacity: 0.16 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.002;
  floor.receiveShadow = true;

  const group = new Group();
  group.add(rug, floor);
  group.rotation.y = -0.1;
  scene.add(group);

  /** Wrap the part of the rug beyond the unroll point into a spiral roll. */
  function shape(t: number) {
    const p = t * L;
    const remaining = L - p;
    const R0 = Math.sqrt(CORE * CORE + (remaining * THICKNESS) / Math.PI);
    for (let i = 0; i < pos.count; i++) {
      const sx = baseX[i];
      let x: number, y: number;
      if (sx <= p) {
        x = sx;
        y = 0;
      } else {
        const s = sx - p;
        const R = Math.sqrt(Math.max(CORE * CORE, R0 * R0 - (s * THICKNESS) / Math.PI));
        const theta = ((2 * Math.PI) / THICKNESS) * (R0 - R) || s / R0;
        x = p + R * Math.sin(theta);
        y = R0 - R * Math.cos(theta);
      }
      pos.setX(i, x - L / 2);
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }

  // --- Sizing -------------------------------------------------------------
  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  stage.appendChild(canvas);
  resize();

  if (still !== undefined) {
    shape(still);
    renderer.render(scene, camera);
    return { canvas, dispose, setT: (_v: number) => {} };
  }

  // --- Animation ------------------------------------------------------------
  let t = startT;
  let start = 0;
  let raf = 0;
  let visible = true;
  let unrolled = false;
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  const ease = (k: number) => 1 - Math.pow(1 - k, 3.2);
  shape(t);
  if (opts.manual) unrolled = true;

  function frame(now: number) {
    raf = 0;
    if (!unrolled) {
      if (!start) start = now + delay;
      const k = Math.max(0, Math.min(1, (now - start) / duration));
      t = startT + (1 - startT) * ease(k);
      shape(t);
      if (k >= 1) unrolled = true;
    }
    tilt.x += (tilt.tx - tilt.x) * 0.12;
    tilt.y += (tilt.ty - tilt.y) * 0.12;
    group.rotation.x = tilt.x;
    group.rotation.z = tilt.y * 0.5;
    group.rotation.y = -0.1 + tilt.y;
    renderer.render(scene, camera);
    const settling = Math.abs(tilt.tx - tilt.x) > 0.001 || Math.abs(tilt.ty - tilt.y) > 0.001;
    if (visible && !document.hidden && (!unrolled || settling)) raf = requestAnimationFrame(frame);
  }
  const kick = () => {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };

  // Gentle tilt toward the pointer (desktop, fine pointers only)
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    tilt.ty = Math.max(-1, Math.min(1, nx)) * 0.06;
    tilt.tx = Math.max(-1, Math.min(1, ny)) * 0.045;
    kick();
  };
  const onLeave = () => {
    tilt.tx = 0;
    tilt.ty = 0;
    kick();
  };
  const hero = stage.closest('section') ?? stage;
  if (finePointer) {
    hero.addEventListener('pointermove', onMove as EventListener, { passive: true });
    hero.addEventListener('pointerleave', onLeave);
  }

  // Pause when the hero is off-screen or the tab is hidden
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
  });
  io.observe(stage);
  const onVisibility = () => !document.hidden && kick();
  document.addEventListener('visibilitychange', onVisibility);
  const ro = new ResizeObserver(() => {
    resize();
    kick();
  });
  ro.observe(stage);

  // First frame, then reveal the canvas over the poster
  renderer.render(scene, camera);
  opts.onReady?.();
  kick();

  function dispose() {
    if (raf) cancelAnimationFrame(raf);
    hero.removeEventListener('pointermove', onMove as EventListener);
    hero.removeEventListener('pointerleave', onLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    io?.disconnect();
    ro?.disconnect();
    geometry.dispose();
    material.dispose();
    texture.dispose();
    floor.geometry.dispose();
    (floor.material as ShadowMaterial).dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  /** Set how far the rug is unrolled (0–1) and redraw. */
  function setT(v: number) {
    t = Math.max(0, Math.min(1, v));
    shape(t);
    if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
  }

  return { canvas, dispose, setT };
}
