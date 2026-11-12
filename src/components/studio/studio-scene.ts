// The NovaEyes distribution studio, rendered live with three.js.
// An isometric diorama of the clipping workflow: clippers around a conveyor of clips,
// a review gate, floating screens, and a pile of NovaEyes coins. Everything that should
// feel alive is animated; everything else is merged into a few draw calls.
// The canvas is transparent, so the diorama sits directly on the page.
// It runs in a Web Worker on an OffscreenCanvas where the browser allows it (studio.worker.ts),
// and on the main thread otherwise, so nothing in here may touch the DOM except through
// makeCanvas.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { SavePass } from "three/addons/postprocessing/SavePass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";
import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand-paths";
import { markOutline } from "./mark-outline";

export const STUDIO_KEYS = ["brief", "source", "clippers", "posting", "review", "views", "payout", "control"] as const;
export type StudioPoint = { x: number; y: number; on: boolean };
export type StudioOptions = {
  width: number;
  height: number;
  dpr: number;
  /** Where the station numbers sit, in CSS pixels. Called only when they move. */
  onPoints: (points: StudioPoint[]) => void;
  /** The scene is built, compiled and has drawn its first frame. */
  onReady: () => void;
  reduceMotion: boolean;
  lowPower: boolean;
};
export type StudioHandle = {
  focus: (index: number | null, layout: "desktop" | "mobile") => void;
  setRunning: (on: boolean) => void;
  resize: (width: number, height: number, dpr: number) => void;
  dispose: () => void;
};

const BLUE = 0x3b82f6;
const COL = { slate: 0x1b1e27, slateEdge: 0x252935, graphite: 0x2c303c, lightWarm: 0xc6cbd5 };
const VIEW_H = 17.4;
const SIDE = -1;

type Mat = THREE.MeshStandardMaterialParameters;
// Main thread canvases and worker OffscreenCanvases share every 2D call used here.
type Ctx = CanvasRenderingContext2D;
type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;

// Canvas textures are CPU-backed (willReadFrequently): uploading a GPU-backed 2D canvas into
// WebGL costs a readback stall, every time a live screen redraws.
function makeCanvas(w: number, h: number): AnyCanvas {
  if (typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }
  return new OffscreenCanvas(w, h);
}
const ctx2d = (c: AnyCanvas) => c.getContext("2d", { willReadFrequently: true }) as unknown as Ctx;

// requestAnimationFrame exists in dedicated workers in current browsers; fall back to a timer.
const hasRaf = typeof requestAnimationFrame === "function";
const nextFrame = (cb: (now: number) => void): number => (hasRaf ? requestAnimationFrame(cb) : (setTimeout(() => cb(performance.now()), 16) as unknown as number));
const cancelFrame = (id: number) => (hasRaf ? cancelAnimationFrame(id) : clearTimeout(id));

export function createStudio(canvas: AnyCanvas, opts: StudioOptions): StudioHandle {
  const { reduceMotion, lowPower } = opts;

  /* ---------------------------------------------------------------- renderer */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  let dpr = opts.dpr;
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // the lights never move: bake the shadow map once
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.35;

  let W = Math.max(1, opts.width);
  let H = Math.max(1, opts.height);
  renderer.setSize(W, H, false);

  /* ---------------------------------------------------------------- camera rig */
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 300);
  const setFrustum = () => {
    const a = W / H;
    camera.left = (-VIEW_H * a) / 2;
    camera.right = (VIEW_H * a) / 2;
    camera.top = VIEW_H / 2;
    camera.bottom = -VIEW_H / 2;
    camera.updateProjectionMatrix();
  };
  setFrustum();
  camera.position.set(27 * SIDE, 24.5, 35);
  camera.lookAt(-0.3 * SIDE, -0.6, 0.4);
  camera.translateY(1.5);
  camera.updateMatrixWorld();
  const basePos = camera.position.clone();
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const camYaw = Math.atan2(camera.position.x, camera.position.z);

  /* ---------------------------------------------------------------- lights */
  scene.add(new THREE.HemisphereLight(0xbfcbe6, 0x0b0c10, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.55);
  key.position.set(10 * SIDE, 22, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(lowPower ? 1024 : 2048, lowPower ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12, near: 1, far: 60 });
  key.shadow.bias = -0.0004;
  key.shadow.radius = 5;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6ea2ff, 1.4);
  rim.position.set(-14 * SIDE, 10, -16);
  scene.add(rim);
  const fill = new THREE.PointLight(BLUE, 30, 30, 1.6);
  fill.position.set(3, 7.5, -2.5);
  scene.add(fill);
  const down = new THREE.SpotLight(0xdfe8ff, 80, 40, 0.62, 0.9, 1.6);
  down.position.set(0, 13, 0.5);
  down.target.position.set(0, 0, 0.3);
  scene.add(down, down.target);

  /* ---------------------------------------------------------------- helpers */
  const mcache = new Map<string, THREE.MeshStandardMaterial>();
  const mat = (color: number, o: Mat = {}) => {
    const k = `${color}|${JSON.stringify(o)}`;
    let m = mcache.get(k);
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.08, ...o });
      mcache.set(k, m);
    }
    return m;
  };
  const glow = (i = 2.2) => mat(BLUE, { emissive: BLUE, emissiveIntensity: i, roughness: 0.4, metalness: 0 });
  const glowOwn = (i = 2.2) => new THREE.MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: i, roughness: 0.4 });
  const live = <T extends THREE.Object3D>(o: T) => {
    o.userData.live = true;
    return o;
  };
  function add<T extends THREE.Object3D>(o: T, x: number, y: number, z: number, parent: THREE.Object3D = scene): T {
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  }
  const rbox = (w: number, h: number, d: number, r: number, m: THREE.Material) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), m);
  const box = (w: number, h: number, d: number, m: THREE.Material) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  const cyl = (rt: number, rb: number, h: number, m: THREE.Material, seg = 24) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  const cap = (r: number, l: number, m: THREE.Material) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 5, 12), m);
  const noShadow = <T extends THREE.Object3D>(o: T) => {
    o.castShadow = false;
    return o;
  };

  /* ---------------------------------------------------------------- canvas textures */
  function canvasTex(w: number, h: number, draw?: (g: Ctx, w: number, h: number) => void) {
    const c = makeCanvas(w, h);
    const g = ctx2d(c);
    if (draw) draw(g, w, h);
    const t = new THREE.CanvasTexture(c as HTMLCanvasElement);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    return t;
  }
  const ctxOf = (t: THREE.Texture) => ctx2d(t.image as AnyCanvas);
  const rr = (g: Ctx, x: number, y: number, w: number, h: number, r: number) => {
    g.beginPath();
    w = Math.max(0, w);
    if (g.roundRect) {
      g.roundRect(x, y, w, h, r);
      return;
    }
    const k = Math.min(r, w / 2, h / 2);
    g.moveTo(x + k, y);
    g.arcTo(x + w, y, x + w, y + h, k);
    g.arcTo(x + w, y + h, x, y + h, k);
    g.arcTo(x, y + h, x, y, k);
    g.arcTo(x, y, x + w, y, k);
    g.closePath();
  };
  const rand = (seed: number) => {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  };
  const screenMat = (t: THREE.Texture, i = 0.95) => new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: i, roughness: 0.3 });
  const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const frac = (x: number) => x - Math.floor(x);

  const clipCanvasCache = new Map<number, AnyCanvas>();
  function clipCanvas(seed: number) {
    const hit = clipCanvasCache.get(seed);
    if (hit) return hit;
    const r = rand(seed * 97 + 13);
    const hue = [215, 225, 205, 235, 195][seed % 5];
    const c = makeCanvas(256, 448);
    const g = ctx2d(c);
    const w = 256, h = 448;
    const grd = g.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, `hsl(${hue} 45% ${18 + r() * 10}%)`);
    grd.addColorStop(1, `hsl(${hue + 20} 50% ${6 + r() * 6}%)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    g.fillStyle = `hsla(${hue} 30% 80% / 0.18)`;
    g.beginPath();
    g.arc(w * (0.4 + r() * 0.2), h * 0.42, w * 0.16, 0, Math.PI * 2);
    g.fill();
    rr(g, w * 0.24, h * 0.52, w * 0.52, h * 0.5, 60);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.85)";
    g.beginPath();
    g.moveTo(w * 0.44, h * 0.44);
    g.lineTo(w * 0.44, h * 0.56);
    g.lineTo(w * 0.58, h * 0.5);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.25)";
    rr(g, w * 0.1, h * 0.86, w * 0.8, 8, 4);
    g.fill();
    g.fillStyle = "#3b82f6";
    rr(g, w * 0.1, h * 0.86, w * 0.8 * (0.3 + r() * 0.6), 8, 4);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.6)";
    rr(g, w * 0.1, h * 0.06, w * 0.34, 12, 6);
    g.fill();
    clipCanvasCache.set(seed, c);
    return c;
  }
  const clipTex = (seed: number) => canvasTex(256, 448, (g) => g.drawImage(clipCanvas(seed), 0, 0));

  // An editing app: preview, side panels, timeline tracks. The playhead is a live mesh.
  function editorTex(seed: number) {
    const r = rand(seed * 31 + 7);
    return canvasTex(512, 320, (g, w) => {
      g.fillStyle = "#0f1118";
      g.fillRect(0, 0, w, 320);
      g.fillStyle = "#171a23";
      g.fillRect(0, 0, w, 26);
      g.drawImage(clipCanvas(seed), w / 2 - 62, 36, 124, 186);
      g.fillStyle = "#1b1f2a";
      g.fillRect(12, 40, 120, 180);
      g.fillRect(w - 132, 40, 120, 180);
      for (let i = 0; i < 6; i++) {
        g.fillStyle = "rgba(255,255,255,0.12)";
        rr(g, 22, 54 + i * 26, 70 + r() * 30, 8, 4);
        g.fill();
      }
      for (let t = 0; t < 3; t++) {
        let x = 14;
        while (x < w - 20) {
          const len = 30 + r() * 90;
          g.fillStyle = t === 0 ? "rgba(59,130,246,0.85)" : t === 1 ? "rgba(140,160,200,0.55)" : "rgba(255,255,255,0.18)";
          rr(g, x, 236 + t * 24, Math.min(len, w - 20 - x), 16, 4);
          g.fill();
          x += len + 6;
        }
      }
    });
  }
  function radialTex(a = 0.55) {
    return canvasTex(128, 128, (g, w, h) => {
      const grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      grd.addColorStop(0, `rgba(59,130,246,${a})`);
      grd.addColorStop(1, "rgba(59,130,246,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, w, h);
    });
  }
  const additive = (t: THREE.Texture, opacity = 1) =>
    new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
  function floorGlow(x: number, z: number, sx: number, sz: number, a = 0.55) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), additive(radialTex(a)));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.012, z);
    scene.add(m);
    return m;
  }

  // Live canvases: redrawn on their own clock, a few times a second. Each redraw is a texture
  // upload, so the clocks are offset and at most one canvas redraws per frame.
  type LiveCanvas = { tex: THREE.CanvasTexture; g: Ctx; every: number; next: number; draw: (g: Ctx, t: number) => void };
  const liveCanvases: LiveCanvas[] = [];
  const liveCanvas = (w: number, h: number, fps: number, draw: (g: Ctx, t: number) => void) => {
    const tex = canvasTex(w, h);
    const g = ctxOf(tex);
    draw(g, 0);
    const every = 1 / (lowPower ? fps * 0.6 : fps);
    liveCanvases.push({ tex, g, every, next: every * (0.25 + 0.19 * liveCanvases.length), draw });
    return tex;
  };

  /* ---------------------------------------------------------------- platform */
  const PW = 22.8, PD = 11.9, PZ = -0.6;
  noShadow(add(rbox(PW, 0.7, PD, 0.22, mat(COL.slate, { roughness: 0.8 })), 0, -0.35, PZ));
  noShadow(add(rbox(PW + 0.4, 0.18, PD + 0.4, 0.08, mat(COL.slateEdge, { roughness: 0.55, metalness: 0.4 })), 0, -0.78, PZ));
  noShadow(add(box(PW - 0.8, 0.03, 0.03, glow(1.1)), 0, -0.62, PZ + PD / 2 + 0.22));
  noShadow(add(box(0.03, 0.03, PD - 0.8, glow(1.1)), (PW / 2 + 0.22) * SIDE, -0.62, PZ));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(cyl(0.12, 0.12, 0.04, mat(0x5b6170, { metalness: 0.7 })), sx * (PW / 2 - 0.55), 0.02, PZ + sz * (PD / 2 - 0.55));
  {
    const tex = canvasTex(128, 128, (g, w, h) => {
      g.strokeStyle = "rgba(150,175,230,0.2)";
      g.lineWidth = 1;
      g.strokeRect(0, 0, w, h);
      g.fillStyle = "rgba(150,185,255,0.35)";
      g.fillRect(0, 0, 3, 3);
    });
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set((PW - 0.8) / 0.95, (PD - 0.8) / 0.95);
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(PW - 0.8, PD - 0.8), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    grid.rotation.x = -Math.PI / 2;
    grid.position.set(0, 0.006, PZ);
    scene.add(grid);
  }

  /* ---------------------------------------------------------------- people */
  const SKIN = 0xd3d8e1;
  const TOPS = [0x33405f, 0xd7dce5, 0x3b82f6, 0x6f7f9e, 0x232a3d, 0xaab6cc, 0x4a5876];
  type Worker = { head: THREE.Group; hands: THREE.Group; phase: number };
  const workers: Worker[] = [];
  let personN = 0;

  function head(g: THREE.Object3D, y: number, z: number, phones: boolean) {
    const skin = mat(SKIN, { roughness: 0.7 });
    add(cyl(0.085, 0.095, 0.14, skin, 14), 0, y - 0.24, z, g);
    add(new THREE.Mesh(new THREE.SphereGeometry(0.215, 24, 18), skin), 0, y, z, g);
    if (!phones) return;
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.022, 8, 24, Math.PI), mat(0x0f1117, { roughness: 0.4 }));
    band.position.set(0, y + 0.02, z);
    g.add(band);
    for (const sx of [-1, 1]) {
      const cup = cyl(0.075, 0.075, 0.06, mat(0x0f1117, { roughness: 0.4 }), 16);
      cup.rotation.z = Math.PI / 2;
      add(cup, sx * 0.235, y - 0.01, z, g);
      const led = cyl(0.04, 0.04, 0.012, glow(1.6), 12);
      led.rotation.z = Math.PI / 2;
      noShadow(add(led, sx * 0.27, y - 0.01, z, g));
    }
  }
  function chair(g: THREE.Object3D) {
    const m = mat(0x1a1d27, { roughness: 0.6 });
    const metal = mat(0x7d8595, { metalness: 0.7, roughness: 0.35 });
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      add(box(0.3, 0.035, 0.05, metal), Math.sin(a) * 0.15, 0.05, Math.cos(a) * 0.15, g).rotation.y = a - Math.PI / 2;
    }
    add(cyl(0.035, 0.035, 0.5, metal, 10), 0, 0.33, 0, g);
    add(rbox(0.66, 0.1, 0.62, 0.05, m), 0, 0.64, 0, g);
    add(rbox(0.6, 0.72, 0.09, 0.045, m), 0, 1.16, 0.34, g).rotation.x = 0.1;
    add(rbox(0.07, 0.3, 0.05, 0.02, metal), 0, 0.78, 0.33, g);
  }
  function figure(x: number, z: number, rotY: number, parent: THREE.Object3D = scene) {
    const seed = personN++;
    const g = new THREE.Group();
    const top = mat(TOPS[seed % TOPS.length], { roughness: 0.8 });
    const pants = mat(0x161922, { roughness: 0.85 });
    const skin = mat(SKIN, { roughness: 0.7 });
    chair(g);
    add(cap(0.235, 0.46, top), 0, 1.26, 0.04, g).rotation.x = -0.1;
    add(rbox(0.5, 0.2, 0.34, 0.09, pants), 0, 0.78, 0.02, g);
    for (const sx of [-0.14, 0.14]) {
      add(cap(0.1, 0.38, pants), sx, 0.78, -0.26, g).rotation.x = Math.PI / 2;
      add(cap(0.085, 0.36, pants), sx, 0.42, -0.5, g);
      add(rbox(0.15, 0.09, 0.27, 0.04, mat(0xe6e9ef, { roughness: 0.6 })), sx, 0.05, -0.56, g);
    }
    // forearms and hands pivot at the elbows, so they can type
    const hands = live(new THREE.Group());
    hands.position.set(0, 1.16, -0.15);
    for (const sx of [-1, 1]) {
      add(cap(0.078, 0.26, top), sx * 0.3, 1.33, -0.07, g).rotation.set(0.55, 0, sx * 0.1);
      noShadow(add(cap(0.066, 0.26, top), sx * 0.27, -0.02, -0.18, hands)).rotation.set(1.42, 0, -sx * 0.12);
      noShadow(add(new THREE.Mesh(new THREE.SphereGeometry(0.066, 12, 10), skin), sx * 0.24, -0.06, -0.38, hands));
    }
    g.add(hands);
    const neck = live(new THREE.Group());
    neck.position.set(0, 1.72, -0.03);
    head(neck, 0.21, 0, seed % 2 === 0);
    neck.traverse((o) => (o.castShadow = false));
    g.add(neck);
    workers.push({ head: neck, hands, phase: seed * 1.37 });
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    parent.add(g);
    return g;
  }

  /* ---------------------------------------------------------------- the clip counter */
  const SX = 5;
  const BELT_R = 1.75;
  function stadiumShape(Ro: number, Ri?: number) {
    const s = new THREE.Shape();
    s.moveTo(-SX, -Ro);
    s.lineTo(SX, -Ro);
    s.absarc(SX, 0, Ro, -Math.PI / 2, Math.PI / 2, false);
    s.lineTo(-SX, Ro);
    s.absarc(-SX, 0, Ro, Math.PI / 2, (3 * Math.PI) / 2, false);
    if (Ri) {
      const h = new THREE.Path();
      h.moveTo(-SX, -Ri);
      h.lineTo(SX, -Ri);
      h.absarc(SX, 0, Ri, -Math.PI / 2, Math.PI / 2, false);
      h.lineTo(-SX, Ri);
      h.absarc(-SX, 0, Ri, Math.PI / 2, (3 * Math.PI) / 2, false);
      s.holes.push(h);
    }
    return s;
  }
  function ringSlab(Ro: number, Ri: number | undefined, y0: number, h: number, m: THREE.Material, bevel = 0) {
    const geo = new THREE.ExtrudeGeometry(stadiumShape(Ro, Ri), { depth: h, curveSegments: 40, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2 });
    geo.rotateX(-Math.PI / 2);
    return add(new THREE.Mesh(geo, m), 0, y0, 0);
  }
  function stadiumAt(R: number, u: number): [number, number] {
    const L = 4 * SX + 2 * Math.PI * R;
    let d = frac(u) * L;
    if (d < 2 * SX) return [-SX + d, -R];
    d -= 2 * SX;
    if (d < Math.PI * R) {
      const a = -Math.PI / 2 + d / R;
      return [SX + R * Math.cos(a), R * Math.sin(a)];
    }
    d -= Math.PI * R;
    if (d < 2 * SX) return [SX - d, R];
    d -= 2 * SX;
    const a = Math.PI / 2 + d / R;
    return [-SX + R * Math.cos(a), R * Math.sin(a)];
  }
  const stadiumCurve = (R: number, y: number) =>
    new THREE.CatmullRomCurve3(
      Array.from({ length: 200 }, (_, i) => {
        const [x, z] = stadiumAt(R, i / 200);
        return new THREE.Vector3(x, y, z);
      }),
      true,
      "catmullrom",
      0.5,
    );
  const tube = (R: number, y: number, r: number, m: THREE.Material) => noShadow(add(new THREE.Mesh(new THREE.TubeGeometry(stadiumCurve(R, y), 360, r, 6, true), m), 0, 0, 0));

  ringSlab(2.6, 1.4, 0, 0.9, mat(COL.graphite, { roughness: 0.7 }));
  ringSlab(2.68, 1.32, 0.92, 0.04, mat(COL.lightWarm, { roughness: 0.55 }), 0.02);
  noShadow(ringSlab(2.02, 1.48, 0.98, 0.03, mat(0x0f1117, { roughness: 0.45 })));
  for (const R of [1.47, 2.03]) tube(R, 1.02, 0.013, glow(1.8));
  tube(2.6, 0.5, 0.012, glow(0.9));
  tube(4.35, 0.012, 0.014, glow(0.8));
  const rail = stadiumCurve(BELT_R, 1.01);

  // laptops, with a live playhead running across the timeline
  const playheads: { lid: THREE.Object3D; phase: number; speed: number }[] = [];
  const shell = mat(0x9aa1ae, { metalness: 0.5, roughness: 0.35 });
  const playheadM = new THREE.MeshBasicMaterial({ color: 0xffffff });
  function laptop(seed: number) {
    const g = new THREE.Group();
    add(rbox(0.62, 0.03, 0.42, 0.012, shell), 0, 0.015, 0, g);
    const lid = new THREE.Group();
    add(rbox(0.62, 0.4, 0.02, 0.012, shell), 0, 0.2, 0, lid);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.35), screenMat(editorTex(seed)));
    s.position.set(0, 0.2, 0.012);
    lid.add(s);
    playheads.push({ lid, phase: seed * 0.37, speed: 0.12 + (seed % 4) * 0.03 });
    lid.position.set(0, 0.03, -0.2);
    lid.rotation.x = -0.25;
    g.add(lid);
    return g;
  }
  const playheadMesh = live(new THREE.InstancedMesh(new THREE.PlaneGeometry(0.005, 0.095), playheadM, 12));
  scene.add(playheadMesh);
  const seats: [number, number, number, number][] = [];
  for (const x of [-3.6, -1.2, 1.2, 3.6]) seats.push([x, 0, 0, -1], [x, 0, 0, 1]);
  for (const a of [(3 * Math.PI) / 4, (5 * Math.PI) / 4]) seats.push([-SX, 0, Math.cos(a), Math.sin(a)]);
  const seatLaptops: THREE.Object3D[] = [];
  seats.forEach(([px, pz, nx, nz], i) => {
    const rot = Math.atan2(nx, nz);
    figure(px + nx * 3.3, pz + nz * 3.3, rot);
    const l = laptop(i + 1);
    seatLaptops.push(l);
    l.position.set(px + nx * 2.33, 0.98, pz + nz * 2.33);
    l.rotation.y = rot;
    l.traverse((o) => (o.castShadow = true));
    scene.add(l);
  });

  /* ---------------------------------------------------------------- raised decks */
  function deck(cx: number, cz: number, w: number, d: number, h: number, stairs: { axis: "x" | "z"; side: 1 | -1; at: number }) {
    const g = new THREE.Group();
    add(rbox(w, 0.22, d, 0.05, mat(COL.slateEdge, { roughness: 0.6 })), 0, h, 0, g);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(cyl(0.1, 0.12, h, mat(0x3a4050, { metalness: 0.5, roughness: 0.4 }), 14), sx * (w / 2 - 0.25), h / 2, sz * (d / 2 - 0.25), g);
    const glassM = new THREE.MeshStandardMaterial({ color: 0x8fb4ff, transparent: true, opacity: 0.16, roughness: 0.1, side: THREE.DoubleSide, depthWrite: false });
    const sides = ([["x", 1], ["x", -1], ["z", 1], ["z", -1]] as const).filter(([a, s]) => !(a === stairs.axis && s === stairs.side));
    for (const [a, s] of sides) {
      const len = a === "x" ? d : w;
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(len - 0.1, 0.62), glassM);
      pane.position.set(a === "x" ? (s * w) / 2 - s * 0.04 : 0, h + 0.42, a === "z" ? (s * d) / 2 - s * 0.04 : 0);
      if (a === "x") pane.rotation.y = Math.PI / 2;
      g.add(pane);
      noShadow(add(box(a === "x" ? 0.03 : len - 0.1, 0.03, a === "x" ? len - 0.1 : 0.03, glow(2)), pane.position.x, h + 0.74, pane.position.z, g));
    }
    const n = 6, sd = 0.27;
    for (let i = 1; i <= n; i++) {
      const hh = (i * h) / n;
      const off = (stairs.axis === "z" ? d : w) / 2 + (n - i + 0.5) * sd;
      const step = add(rbox(stairs.axis === "z" ? 1.0 : sd, hh, stairs.axis === "z" ? sd : 1.0, 0.02, mat(COL.slateEdge, { roughness: 0.6 })), 0, hh / 2, 0, g);
      if (stairs.axis === "z") step.position.set(stairs.at, hh / 2, stairs.side * off);
      else step.position.set(stairs.side * off, hh / 2, stairs.at);
    }
    noShadow(add(box(stairs.axis === "z" ? w - 0.2 : 0.03, 0.03, stairs.axis === "z" ? 0.03 : d - 0.2, glow(1.6)), 0, h - 0.11, 0, g));
    g.position.set(cx, 0, cz);
    scene.add(g);
    floorGlow(cx, cz, w + 1.6, d + 1.6, 0.2);
    return g;
  }
  const DECK_H = 1.9;

  /* ---------------------------------------------------------------- 2. source deck: long video in, crops and cuts marked */
  {
    const r = rand(5);
    const fx = 40, fy = 30, fw = 688, fh = ((fw * 9) / 16) * 0.78;
    const ty = fy + fh + 30;
    const cuts: [number, number][] = [];
    let x = fx + 10;
    while (x < fx + fw - 40) {
      const len = 30 + r() * 70;
      cuts.push([x, len]);
      x += len + 30 + r() * 60;
    }
    const base = makeCanvas(768, 512);
    {
      const g = ctx2d(base);
      g.fillStyle = "#0e1017";
      g.fillRect(0, 0, 768, 512);
      const grd = g.createLinearGradient(fx, fy, fx + fw, fy + fh);
      grd.addColorStop(0, "hsl(220 40% 24%)");
      grd.addColorStop(1, "hsl(230 45% 9%)");
      g.fillStyle = grd;
      rr(g, fx, fy, fw, fh, 10);
      g.fill();
      g.fillStyle = "rgba(200,212,235,0.2)";
      for (const cx of [0.3, 0.7]) {
        g.beginPath();
        g.arc(fx + fw * cx, fy + fh * 0.42, fh * 0.13, 0, Math.PI * 2);
        g.fill();
        rr(g, fx + fw * cx - fh * 0.2, fy + fh * 0.58, fh * 0.4, fh * 0.42, 30);
        g.fill();
      }
      g.fillStyle = "rgba(255,255,255,0.12)";
      rr(g, fx, ty, fw, 34, 6);
      g.fill();
      g.fillStyle = "rgba(255,255,255,0.18)";
      for (let i = 0; i < 3; i++) {
        rr(g, fx, ty + 50 + i * 22, fw * (0.4 + r() * 0.5), 10, 5);
        g.fill();
      }
    }
    const tex = liveCanvas(768, 512, 10, (g, t) => {
      g.drawImage(base, 0, 0);
      const p = frac(t / 9);
      const px = fx + p * fw;
      // the 9:16 crops, as marching dashes
      g.strokeStyle = "#3b82f6";
      g.lineWidth = 4;
      g.setLineDash([12, 8]);
      g.lineDashOffset = -t * 40;
      const cw = (fh * 9) / 16;
      const crop = p < 0.5 ? 0.3 : 0.7;
      for (const cx of [0.3, 0.7]) {
        g.globalAlpha = cx === crop ? 1 : 0.35;
        g.strokeRect(fx + fw * cx - cw / 2, fy + 4, cw, fh - 8);
      }
      g.globalAlpha = 1;
      g.setLineDash([]);
      // cuts appear as the playhead passes them
      for (const [cx, len] of cuts) {
        const on = px > cx;
        g.fillStyle = on ? "#3b82f6" : "rgba(59,130,246,0.25)";
        rr(g, cx, ty + 5, on ? Math.min(len, px - cx) : len, 24, 4);
        g.fill();
      }
      g.fillStyle = "#ffffff";
      g.fillRect(px - 1.5, ty - 8, 3, 50);
    });
    const d = deck(-10.0, -0.5, 2.7, 3.6, DECK_H, { axis: "z", side: 1, at: -0.7 });
    const g = new THREE.Group();
    add(rbox(3.0, 0.95, 1.2, 0.06, mat(COL.lightWarm)), 0, 0.48, 0, g);
    const top = new THREE.Group();
    add(rbox(2.9, 0.08, 1.7, 0.04, mat(0x15171e, { roughness: 0.35 })), 0, 0, 0, top);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(2.76, 1.58), screenMat(tex, 0.9));
    face.rotation.x = -Math.PI / 2;
    face.position.y = 0.045;
    top.add(face);
    top.position.set(0, 1.2, -0.05);
    top.rotation.x = 0.55;
    g.add(top);
    noShadow(add(box(2.9, 0.03, 0.03, glow(2.2)), 0, 0.96, 0.61, g));
    figure(0, 1.05, 0, g);
    g.position.set(0.35, DECK_H + 0.11, 0);
    g.rotation.y = -Math.PI / 2;
    d.add(g);
  }

  /* ---------------------------------------------------------------- 8. control deck */
  {
    const r = rand(77);
    const panels: [number, number, number, number][] = [
      [20, 20, 300, 130],
      [340, 20, 300, 130],
      [660, 20, 344, 130],
      [20, 170, 480, 130],
      [520, 170, 484, 130],
    ];
    const widths = panels.map(() => [60 + r() * 50, 120 + r() * 60]);
    const tex = liveCanvas(1024, 320, 5, (g, t) => {
      g.fillStyle = "#0e1017";
      g.fillRect(0, 0, 1024, 320);
      panels.forEach(([x, y, pw, ph], i) => {
        g.fillStyle = "#161924";
        rr(g, x, y, pw, ph, 10);
        g.fill();
        g.fillStyle = "rgba(255,255,255,0.7)";
        rr(g, x + 16, y + 16, widths[i][0], 10, 5);
        g.fill();
        if (i < 3) {
          g.fillStyle = i === 0 ? "#3b82f6" : "rgba(255,255,255,0.85)";
          rr(g, x + 16, y + 44, widths[i][1] * (0.9 + 0.1 * Math.sin(t * 0.8 + i * 2)), 34, 8);
          g.fill();
          g.fillStyle = "rgba(255,255,255,0.25)";
          rr(g, x + 16, y + 94, pw - 32, 6, 3);
          g.fill();
          g.fillStyle = i === 0 ? "#7fb0ff" : "#3b82f6";
          rr(g, x + 16, y + 94, (pw - 32) * (0.35 + 0.55 * frac(t / 7 + i * 0.3)), 6, 3);
          g.fill();
        } else {
          // live sparklines, scrolling left
          g.strokeStyle = i === 3 ? "#3b82f6" : "rgba(160,180,220,0.7)";
          g.lineWidth = 4;
          g.beginPath();
          for (let k = 0; k <= 26; k++) {
            const s = k + t * 2.2 + i * 40;
            const v = 0.5 + 0.25 * Math.sin(s * 0.45) + 0.15 * Math.sin(s * 1.3 + i) + 0.1 * Math.sin(s * 0.13);
            const xx = x + 16 + k * ((pw - 32) / 26);
            const yy = y + ph - 16 - v * (ph - 50);
            if (k) g.lineTo(xx, yy);
            else g.moveTo(xx, yy);
          }
          g.stroke();
        }
      });
    });
    const d = deck(9.75, 3.45, 3.2, 3.4, DECK_H, { axis: "x", side: -1, at: 1.0 });
    const g = new THREE.Group();
    add(rbox(3.1, 0.1, 1.2, 0.04, mat(COL.lightWarm)), 0, 1.05, 0, g);
    for (const sx of [-1.4, 1.4]) add(box(0.1, 1.0, 1.0, mat(COL.graphite)), sx, 0.5, 0, g);
    const arc = 0.9;
    const scr = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 1.05, 48, 1, true, Math.PI - arc / 2, arc), new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.95, side: THREE.DoubleSide, roughness: 0.3 }));
    scr.position.set(0, 2.0, 2.15);
    g.add(scr);
    const back = new THREE.Mesh(new THREE.CylinderGeometry(2.66, 2.66, 1.15, 48, 1, true, Math.PI - arc / 2 - 0.02, arc + 0.04), mat(COL.graphite, { side: THREE.DoubleSide }));
    back.position.copy(scr.position);
    back.castShadow = true;
    g.add(back);
    add(cyl(0.07, 0.07, 0.9, mat(COL.graphite), 10), 0, 1.4, -0.42, g);
    figure(-0.85, 1.15, 0.08, g);
    figure(0.85, 1.15, -0.08, g);
    g.position.set(-0.05, DECK_H + 0.11, -0.4);
    g.rotation.y = 0.22;
    d.add(g);
  }

  /* ---------------------------------------------------------------- floating screens */
  type Floater = { g: THREE.Group; y: number; phase: number; halo?: THREE.MeshBasicMaterial };
  const floaters: Floater[] = [];
  function floatingFrame(g: THREE.Group, TW: number, TH: number, a = 0.32) {
    for (const s of [-1, 1]) {
      noShadow(add(box(TW, 0.035, 0.035, glow(2.6)), 0, (s * TH) / 2, 0.02, g));
      noShadow(add(box(0.035, TH, 0.035, glow(2.6)), (s * TW) / 2, 0, 0.02, g));
    }
    const hm = additive(radialTex(a));
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(TW + 2.6, TH + 2.2), hm);
    halo.position.z = -0.2;
    g.add(halo);
    return hm;
  }

  // 6. analytics: KPI tiles, a chart that draws itself, a platform split
  {
    const S = 0.75; // drawn at 1840x640 coordinates, stored at 75%
    const r = rand(91);
    const kpiW = [0, 1, 2].map(() => 190 + r() * 90);
    const tex = liveCanvas(1380, 480, 10, (g, t) => {
      g.setTransform(S, 0, 0, S, 0, 0);
      const w = 1840;
      g.fillStyle = "#0a0c13";
      g.fillRect(0, 0, w, 640);
      g.fillStyle = "#11141f";
      g.fillRect(0, 0, w, 56);
      g.fillStyle = "#3b82f6";
      rr(g, 28, 18, 150, 20, 10);
      g.fill();
      // live dot in the header
      g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4);
      g.beginPath();
      g.arc(200, 28, 8, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
      g.fillStyle = "rgba(255,255,255,0.22)";
      for (let i = 0; i < 4; i++) {
        rr(g, w - 140 - i * 140, 20, 110, 16, 8);
        g.fill();
      }
      for (let i = 0; i < 3; i++) {
        const y = 76 + i * 186;
        g.fillStyle = "#131726";
        rr(g, 28, y, 380, 168, 16);
        g.fill();
        g.fillStyle = "rgba(255,255,255,0.4)";
        rr(g, 52, y + 26, 120, 14, 7);
        g.fill();
        g.fillStyle = i === 0 ? "#3b82f6" : "rgba(255,255,255,0.9)";
        rr(g, 52, y + 60, kpiW[i] * (0.92 + 0.08 * frac(t / 3 + i * 0.37)), 50, 12);
        g.fill();
        g.strokeStyle = i === 0 ? "rgba(255,255,255,0.7)" : "#3b82f6";
        g.lineWidth = 4;
        g.beginPath();
        for (let k = 0; k <= 15; k++) {
          const s = k + t * 1.6 + i * 9;
          const v = 0.5 + 0.3 * Math.sin(s * 0.6) + 0.2 * Math.sin(s * 1.7);
          const xx = 52 + k * 22;
          const yy = y + 156 - v * 30;
          if (k) g.lineTo(xx, yy);
          else g.moveTo(xx, yy);
        }
        g.stroke();
      }
      // the growth chart draws itself, holds, then starts again
      const cx = 436, cy = 76, cw = 960, ch = 540;
      g.fillStyle = "#0f1220";
      rr(g, cx, cy, cw, ch, 16);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,0.06)";
      g.lineWidth = 2;
      for (let i = 1; i < 6; i++) {
        g.beginPath();
        g.moveTo(cx + 24, cy + (ch * i) / 6);
        g.lineTo(cx + cw - 24, cy + (ch * i) / 6);
        g.stroke();
      }
      const cyc = t % 9;
      const reveal = smooth(0, 6, cyc);
      const fade = 1 - smooth(8.2, 9, cyc);
      const rr2 = rand(1 + Math.floor(t / 9) * 7);
      const pts: [number, number][] = [];
      for (let i = 0; i <= 40; i++) {
        const k = i / 40;
        const v = Math.pow(k, 1.9) * 0.82 + 0.06 + (rr2() - 0.5) * 0.05;
        pts.push([cx + 30 + k * (cw - 60), cy + ch - 30 - v * (ch - 80)]);
      }
      const n = Math.max(1, Math.floor(reveal * 40));
      g.globalAlpha = fade;
      const fillG = g.createLinearGradient(0, cy, 0, cy + ch);
      fillG.addColorStop(0, "rgba(59,130,246,0.55)");
      fillG.addColorStop(1, "rgba(59,130,246,0)");
      g.fillStyle = fillG;
      g.beginPath();
      g.moveTo(pts[0][0], cy + ch - 20);
      for (let i = 0; i <= n; i++) g.lineTo(pts[i][0], pts[i][1]);
      g.lineTo(pts[n][0], cy + ch - 20);
      g.fill();
      g.strokeStyle = "#7fb0ff";
      g.lineWidth = 6;
      g.beginPath();
      g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= n; i++) g.lineTo(pts[i][0], pts[i][1]);
      g.stroke();
      const [lx, ly] = pts[n];
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(lx, ly, 10 + 3 * Math.sin(t * 6), 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
      // platform split
      const dx = 1620, dy = 250, R = 118;
      const segs: [number, string][] = [
        [0.41, "#3b82f6"],
        [0.27, "#7aa7f7"],
        [0.2, "#c5d4f0"],
        [0.12, "rgba(255,255,255,0.25)"],
      ];
      let a0 = -Math.PI / 2 + t * 0.25;
      g.lineWidth = 34;
      for (const [p, c] of segs) {
        g.strokeStyle = c;
        g.beginPath();
        g.arc(dx, dy, R, a0 + 0.03, a0 + p * Math.PI * 2 - 0.03);
        g.stroke();
        a0 += p * Math.PI * 2;
      }
      for (let i = 0; i < 4; i++) {
        g.fillStyle = "rgba(255,255,255,0.12)";
        rr(g, 1440, 430 + i * 44, 360, 18, 9);
        g.fill();
        g.fillStyle = segs[i][1];
        rr(g, 1440, 430 + i * 44, 360 * segs[i][0] * 2.2 * (0.94 + 0.06 * Math.sin(t * 0.9 + i * 1.7)), 18, 9);
        g.fill();
      }
      g.setTransform(1, 0, 0, 1, 0, 0);
    });
    const g = live(new THREE.Group());
    const TW = 8.6, TH = 3.1;
    add(rbox(TW, TH, 0.14, 0.08, mat(0x14161d, { roughness: 0.35, metalness: 0.3 })), 0, 0, -0.02, g);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(TW - 0.24, TH - 0.24), screenMat(tex, 1.0));
    scr.position.z = 0.06;
    g.add(scr);
    const halo = floatingFrame(g, TW, TH, 0.35);
    g.position.set(-0.7, 3.85, -5.75);
    g.traverse((o) => (o.castShadow = false));
    scene.add(g);
    floaters.push({ g, y: 3.85, phase: 0, halo });
    floorGlow(-0.7, -5.3, 10, 2.4, 0.3);
  }

  // 1. the brief: a goal, then the rules typed out line by line
  {
    const r = rand(23);
    const lineW = [0, 1, 2, 3].map(() => 200 + r() * 180);
    const base = makeCanvas(900, 640);
    {
      const g = ctx2d(base);
      g.fillStyle = "#0a0c13";
      g.fillRect(0, 0, 900, 640);
      g.fillStyle = "#11141f";
      g.fillRect(0, 0, 900, 56);
      g.fillStyle = "#3b82f6";
      rr(g, 28, 18, 120, 20, 10);
      g.fill();
      g.fillStyle = "#131726";
      rr(g, 28, 80, 844, 150, 16);
      g.fill();
      g.fillStyle = "rgba(255,255,255,0.4)";
      rr(g, 52, 104, 110, 14, 7);
      g.fill();
      for (let i = 0; i < 3; i++) {
        const x = 28 + i * 284;
        const grd = g.createLinearGradient(x, 488, x + 270, 620);
        grd.addColorStop(0, "hsl(220 40% 26%)");
        grd.addColorStop(1, "hsl(230 45% 10%)");
        g.fillStyle = grd;
        rr(g, x, 488, 268, 128, 12);
        g.fill();
        g.fillStyle = "rgba(255,255,255,0.8)";
        g.beginPath();
        g.moveTo(x + 124, 532);
        g.lineTo(x + 124, 572);
        g.lineTo(x + 152, 552);
        g.fill();
      }
    }
    const CYCLE = 10;
    const tex = liveCanvas(900, 640, 12, (g, t) => {
      g.drawImage(base, 0, 0);
      const c = t % CYCLE;
      const out = 1 - smooth(9.2, 10, c);
      g.globalAlpha = out;
      let cursor: [number, number] | null = null;
      // the goal
      const gw = 330 * smooth(0.2, 1.4, c);
      g.fillStyle = "rgba(255,255,255,0.92)";
      rr(g, 52, 138, gw, 50, 12);
      g.fill();
      if (c < 1.4) cursor = [52 + gw + 8, 138];
      const pill = smooth(1.4, 1.8, c);
      if (pill > 0) {
        g.fillStyle = "#3b82f6";
        rr(g, 400, 138 + (1 - pill) * 10, 150, 50, 12);
        g.fill();
      }
      // the rules, one line after another
      for (let i = 0; i < 4; i++) {
        const s = 2 + i * 1.5;
        const y = 262 + i * 54;
        const on = smooth(s, s + 0.25, c);
        if (on <= 0) continue;
        g.fillStyle = "#3b82f6";
        rr(g, 40 + (1 - on) * 15, y + (1 - on) * 15, 30 * on, 30 * on, 8);
        g.fill();
        if (on > 0.9) {
          g.strokeStyle = "#fff";
          g.lineWidth = 4;
          g.beginPath();
          g.moveTo(47, y + 15);
          g.lineTo(53, y + 22);
          g.lineTo(64, y + 8);
          g.stroke();
        }
        const lw = lineW[i] * smooth(s + 0.2, s + 1.3, c);
        g.fillStyle = "rgba(255,255,255,0.32)";
        rr(g, 88, y + 8, lw, 14, 7);
        g.fill();
        if (c >= s && c < s + 1.5) cursor = [88 + lw + 8, y + 2];
      }
      if (!cursor && c < 9.2) cursor = [88 + lineW[3] + 8, 262 + 3 * 54 + 2];
      if (cursor && Math.sin(t * 9) > -0.2) {
        g.fillStyle = "#ffffff";
        g.fillRect(cursor[0], cursor[1], 4, cursor[1] === 138 ? 50 : 26);
      }
      g.globalAlpha = 1;
    });
    const g = live(new THREE.Group());
    const TW = 3.8, TH = 2.7;
    add(rbox(TW, TH, 0.12, 0.08, mat(0x14161d, { roughness: 0.35, metalness: 0.3 })), 0, 0, -0.02, g);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(TW - 0.2, TH - 0.2), screenMat(tex, 1.0));
    scr.position.z = 0.06;
    g.add(scr);
    const halo = floatingFrame(g, TW, TH);
    g.position.set(-7.75, 3.85, -5.75);
    g.traverse((o) => (o.castShadow = false));
    scene.add(g);
    floaters.push({ g, y: 3.85, phase: 1.7, halo });
    floorGlow(-7.75, -5.35, 4.5, 1.8, 0.26);
  }

  // 4. posting: one clip, fanned out to four platforms; the feeds swipe to the next clip together
  const phoneTexs: THREE.CanvasTexture[] = [];
  const phoneTops: THREE.Object3D[] = [];
  {
    const feed = makeCanvas(256, 448 * 4);
    {
      const g = ctx2d(feed);
      for (let k = 0; k < 4; k++) {
        const y0 = k * 448;
        g.drawImage(clipCanvas(64 + k), 0, y0, 256, 448);
        g.fillStyle = "rgba(110,150,255,0.28)";
        g.fillRect(0, y0, 256, 448);
        for (let i = 0; i < 3; i++) {
          g.fillStyle = i === 0 ? "#3b82f6" : "rgba(255,255,255,0.85)";
          g.beginPath();
          g.arc(256 - 34, y0 + 224 + i * 52, 15, 0, Math.PI * 2);
          g.fill();
        }
        g.fillStyle = "rgba(255,255,255,0.75)";
        rr(g, 18, y0 + 448 - 92, 140, 12, 6);
        g.fill();
        g.fillStyle = "rgba(255,255,255,0.45)";
        rr(g, 18, y0 + 448 - 70, 100, 10, 5);
        g.fill();
      }
    }
    const feedTex = new THREE.CanvasTexture(feed as HTMLCanvasElement);
    feedTex.colorSpace = THREE.SRGBColorSpace;
    feedTex.anisotropy = maxAniso;
    feedTex.wrapT = THREE.RepeatWrapping;
    feedTex.repeat.set(1, 0.25);
    const icons = [siTiktok.path, siInstagram.path, siYoutubeshorts.path, siX.path];
    const badgeTex = (path: string) =>
      canvasTex(192, 192, (g, w, h) => {
        g.fillStyle = "#10131c";
        rr(g, 6, 6, w - 12, h - 12, 42);
        g.fill();
        g.strokeStyle = "#3b82f6";
        g.lineWidth = 6;
        rr(g, 6, 6, w - 12, h - 12, 42);
        g.stroke();
        g.save();
        g.translate(44, 44);
        g.scale(104 / 24, 104 / 24);
        g.fillStyle = "#ffffff";
        g.fill(new Path2D(path));
        g.restore();
      });
    const pivot = live(new THREE.Group());
    const edgeM = new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.45, depthWrite: false });
    icons.forEach((path, i) => {
      const arm = new THREE.Group();
      arm.rotation.z = -(i - 1.5) * 0.3;
      arm.position.z = i * 0.07;
      const ph = new THREE.Group();
      add(rbox(0.86, 1.56, 0.07, 0.12, mat(0x111318, { roughness: 0.3, metalness: 0.3 })), 0, 0, 0, ph);
      const tex = feedTex.clone();
      phoneTexs.push(tex);
      const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.77, 1.42), screenMat(tex));
      sc.position.z = 0.04;
      ph.add(sc);
      const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 1.64), edgeM);
      edge.position.z = -0.045;
      ph.add(edge);
      const bt = badgeTex(path);
      const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.44), new THREE.MeshStandardMaterial({ map: bt, emissive: 0xffffff, emissiveMap: bt, emissiveIntensity: 0.9, transparent: true }));
      badge.position.set(0, 1.1, 0.03);
      ph.add(badge);
      const topPt = new THREE.Object3D();
      topPt.position.set(0, 0.55, 0.1);
      ph.add(topPt);
      phoneTops.push(topPt);
      ph.position.y = 1.2;
      arm.add(ph);
      pivot.add(arm);
    });
    pivot.position.set(7.1, 1.05, -3.9);
    pivot.rotation.y = -0.55;
    pivot.scale.setScalar(1.3);
    pivot.traverse((o) => (o.castShadow = false));
    scene.add(pivot);
    const hm = additive(radialTex(0.3));
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 4.4), hm);
    halo.position.set(7.25, 2.9, -4.15);
    halo.rotation.y = -0.55;
    halo.scale.setScalar(1.25);
    scene.add(halo);
    floaters.push({ g: pivot, y: 1.05, phase: 3.1, halo: hm });
    floorGlow(6.9, -3.5, 4.6, 2.0, 0.24);
  }
  // reactions rising off the phones
  const heartTex = canvasTex(64, 64, (g) => {
    g.fillStyle = "#7fb0ff";
    g.beginPath();
    g.moveTo(32, 54);
    g.bezierCurveTo(4, 34, 6, 10, 22, 10);
    g.bezierCurveTo(28, 10, 32, 16, 32, 20);
    g.bezierCurveTo(32, 16, 36, 10, 42, 10);
    g.bezierCurveTo(58, 10, 60, 34, 32, 54);
    g.fill();
  });
  const heartMesh = live(new THREE.InstancedMesh(new THREE.PlaneGeometry(0.22, 0.22), additive(heartTex), 8));
  heartMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(8 * 3), 3);
  scene.add(heartMesh);
  const hearts = Array.from({ length: 8 }, (_, i) => ({ phase: i / 8, from: new THREE.Vector3(), phone: i % 4 }));

  /* ---------------------------------------------------------------- shared mark geometry */
  const markShapes = [new THREE.Shape(markOutline().map(([x, y]) => new THREE.Vector2(x, y)))];
  const markVW = Number(MARK_VIEWBOX.split(" ")[2]);
  function markGeo(width: number, depth = 90) {
    const geo = new THREE.ExtrudeGeometry(markShapes, { depth, bevelEnabled: true, bevelThickness: 14, bevelSize: 8, bevelSegments: 2, curveSegments: 8 });
    geo.center();
    const sc = width / markVW;
    geo.scale(sc, -sc, -sc);
    return geo;
  }

  /* ---------------------------------------------------------------- 5. review gate */
  const GATE_X = SX + BELT_R;
  const gateRings: THREE.MeshStandardMaterial[] = [];
  const scanM = new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false });
  let markMesh: THREE.Mesh;
  let gateHalo: THREE.MeshBasicMaterial;
  {
    const g = new THREE.Group();
    const frameM = mat(COL.lightWarm, { roughness: 0.5 });
    add(rbox(0.36, 2.5, 0.5, 0.06, frameM), -1.15, 1.25, 0, g);
    add(rbox(0.36, 2.5, 0.5, 0.06, frameM), 1.15, 1.25, 0, g);
    add(rbox(2.7, 0.4, 0.56, 0.08, frameM), 0, 2.6, 0, g);
    const arch = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(Array.from({ length: 41 }, (_, i) => new THREE.Vector3(Math.cos((i / 40) * Math.PI) * 0.62, Math.sin((i / 40) * Math.PI) * 1.0, 0))),
      64,
      0.03,
      8,
      false,
    );
    for (const z of [-0.27, 0.27]) {
      const m = glowOwn(3);
      gateRings.push(m);
      const ring = live(new THREE.Mesh(arch, m));
      ring.position.set(0, 1.0, z);
      g.add(ring);
    }
    const scan = live(new THREE.Mesh(new THREE.PlaneGeometry(1.94, 1.36), scanM));
    scan.position.set(0, 1.72, 0);
    g.add(scan);
    g.position.set(GATE_X, 0, 0);
    scene.add(g);
    markMesh = live(new THREE.Mesh(markGeo(1.9), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xe4ecff, emissiveIntensity: 1.0, roughness: 0.3 })));
    markMesh.position.set(GATE_X, 3.5, 0);
    markMesh.lookAt(camera.position.x, 3.5, camera.position.z);
    scene.add(markMesh);
    gateHalo = additive(radialTex(0.5));
    const halo = live(new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), gateHalo));
    halo.position.set(GATE_X, 3.5, 0);
    halo.lookAt(camera.position);
    halo.translateZ(-0.25);
    scene.add(halo);
  }

  /* ---------------------------------------------------------------- reviewer with a tablet */
  let reviewerHead: THREE.Group;
  let reviewerBody: THREE.Group;
  const reviewerTablet = new THREE.Object3D();
  let tabletState = "";
  const verifyTex = canvasTex(512, 360);
  const drawVerify = (n: number, fail = false, seed = 7) => {
    const g = ctxOf(verifyTex);
    g.fillStyle = "#0d1018";
    g.fillRect(0, 0, 512, 360);
    g.drawImage(clipCanvas(seed), 22, 22, 120, 210);
    for (let i = 0; i < 5; i++) {
      const y = 30 + i * 44;
      const on = i < n;
      const bad = fail && i === 3 && on;
      g.fillStyle = bad ? "#ef4444" : on ? "#3b82f6" : "rgba(255,255,255,0.12)";
      g.beginPath();
      g.arc(178, y + 12, 12, 0, Math.PI * 2);
      g.fill();
      if (bad) {
        g.strokeStyle = "#fff";
        g.lineWidth = 3.5;
        g.beginPath();
        g.moveTo(173, y + 7);
        g.lineTo(183, y + 17);
        g.moveTo(183, y + 7);
        g.lineTo(173, y + 17);
        g.stroke();
      } else if (on) {
        g.strokeStyle = "#fff";
        g.lineWidth = 3.5;
        g.beginPath();
        g.moveTo(172, y + 12);
        g.lineTo(177, y + 17);
        g.lineTo(185, y + 7);
        g.stroke();
      }
      g.fillStyle = on ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.14)";
      rr(g, 200, y + 6, 120 + ((i * 53) % 150), 12, 6);
      g.fill();
    }
    const done = fail ? n >= 4 : n >= 5;
    g.fillStyle = done ? (fail ? "#ef4444" : "#3b82f6") : "rgba(59,130,246,0.25)";
    rr(g, 22, 262, 468, 70, 14);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.9)";
    rr(g, 46, 288, done ? 160 : 60, 18, 9);
    g.fill();
    verifyTex.needsUpdate = true;
  };
  drawVerify(0);
  {
    const g = new THREE.Group();
    const top = mat(0xd7dce5, { roughness: 0.8 });
    const pants = mat(0x161922, { roughness: 0.85 });
    const skin = mat(SKIN, { roughness: 0.7 });
    for (const sx of [-0.13, 0.13]) {
      add(cap(0.095, 0.74, pants), sx, 0.52, 0, g);
      add(rbox(0.15, 0.09, 0.28, 0.04, mat(0xe6e9ef, { roughness: 0.6 })), sx, 0.05, -0.05, g);
    }
    // the upper body sways a little as he works
    reviewerBody = live(new THREE.Group());
    reviewerBody.position.set(0, 1.0, 0);
    add(cap(0.235, 0.52, top), 0, 0.38, 0, reviewerBody);
    for (const sx of [-1, 1]) {
      add(cap(0.078, 0.28, top), sx * 0.3, 0.5, -0.02, reviewerBody).rotation.set(0.25, 0, sx * 0.12);
      add(cap(0.066, 0.26, top), sx * 0.25, 0.3, -0.2, reviewerBody).rotation.set(1.3, 0, -sx * 0.3);
      add(new THREE.Mesh(new THREE.SphereGeometry(0.066, 12, 10), skin), sx * 0.19, 0.3, -0.38, reviewerBody);
    }
    reviewerHead = live(new THREE.Group());
    reviewerHead.position.set(0, 0.9, -0.03);
    head(reviewerHead, 0.2, 0, false);
    reviewerBody.add(reviewerHead);
    const tab = new THREE.Group();
    add(rbox(0.56, 0.03, 0.4, 0.03, shell), 0, 0, 0, tab);
    const ts = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), screenMat(verifyTex));
    ts.rotation.x = -Math.PI / 2;
    ts.position.y = 0.017;
    tab.add(ts);
    tab.position.set(0, 0.36, -0.42);
    tab.rotation.x = 0.75;
    tab.add(reviewerTablet);
    reviewerBody.add(tab);
    reviewerBody.traverse((o) => (o.castShadow = false));
    g.add(reviewerBody);
    g.position.set(7.65, 0, 1.65);
    g.rotation.y = 0.49;
    scene.add(g);
  }

  /* ---------------------------------------------------------------- 7. the coin pile */
  const coinR = 0.41, coinT = 0.09;
  const coinGeo = (() => {
    const r = coinR, t = coinT, b = 0.018;
    const prof = [
      [0, 0],
      [r - b, 0],
      [r - b * 0.3, b * 0.3],
      [r, b],
      [r, t - b],
      [r - b * 0.3, t - b * 0.3],
      [r - b, t],
      [0, t],
    ].map(([x, y]) => new THREE.Vector2(x, y - t / 2));
    return new THREE.LatheGeometry(prof, 26);
  })();
  const coinM = mat(0xaeb6c3, { metalness: 0.35, roughness: 0.55 });
  const markTex = canvasTex(512, 176, (g, w, h) => {
    const sc = (w * 0.94) / markVW;
    g.translate(w * 0.03, (h - 660 * sc) / 2);
    g.scale(sc, sc);
    g.fillStyle = "#3b82f6";
    g.fill(new Path2D(MARK_PATH));
  });
  const coinMarkM = new THREE.MeshStandardMaterial({ map: markTex, emissive: BLUE, emissiveMap: markTex, emissiveIntensity: 0.85, roughness: 0.35, alphaTest: 0.4 });
  const coinMarkGeo = new THREE.PlaneGeometry(coinR * 1.3, (coinR * 1.3 * 176) / 512).rotateX(-Math.PI / 2);
  const stackTops: THREE.Vector3[] = [];
  {
    const bedGeo = new THREE.ExtrudeGeometry(stadiumShape(1.39), { depth: 0.5, curveSegments: 40, bevelEnabled: false });
    bedGeo.rotateX(-Math.PI / 2);
    add(new THREE.Mesh(bedGeo, mat(0x10131b, { roughness: 0.6 })), 0, 0, 0);
    tube(1.37, 0.51, 0.012, glow(1.6));
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(13.6, 2.9), additive(radialTex(0.1)));
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.512;
    scene.add(pool);

    const BED = 0.5;
    const rnd = rand(777);
    // the hole is a stadium of radius 1.36; keep clear of the gate post on the right end
    const inside = (x: number, z: number, m: number) => x <= 4.75 && (Math.abs(x) <= SX ? Math.abs(z) <= 1.36 - m : Math.hypot(Math.abs(x) - SX, z) <= 1.36 - m);
    const mats: { m: THREE.Matrix4; top: boolean }[] = [];
    const P = new THREE.Vector3(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(1, 1, 1);
    for (let gx = -6.0; gx <= 6.0; gx += 0.94) {
      for (const gz of [-0.85, 0, 0.85]) {
        const x = gx + (rnd() - 0.5) * 0.06 + (gz === 0 ? 0.47 : 0);
        const z = gz + (rnd() - 0.5) * 0.05;
        if (!inside(x, z, coinR + 0.03)) continue;
        const roll = rnd();
        if (roll < 0.16) {
          // a small loose pile instead of a stack: flat, slightly offset, never inside each other
          const n = 1 + Math.floor(rnd() * 3);
          for (let k = 0; k < n; k++) {
            P.set(x + (rnd() - 0.5) * 0.16, BED + coinT / 2 + k * (coinT + 0.004), z + (rnd() - 0.5) * 0.12);
            E.set((rnd() - 0.5) * 0.08, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.08);
            mats.push({ m: new THREE.Matrix4().compose(P, Q.setFromEuler(E), S), top: true });
          }
          continue;
        }
        const r2 = rnd();
        const h = r2 < 0.35 ? 1 + Math.floor(rnd() * 4) : r2 < 0.75 ? 5 + Math.floor(rnd() * 5) : 10 + Math.floor(rnd() * 6);
        const yaw0 = rnd() * Math.PI * 2;
        let lean = 0;
        for (let k = 0; k < h; k++) {
          lean += (rnd() - 0.5) * 0.008;
          P.set(x + lean, BED + coinT / 2 + k * coinT, z);
          E.set((rnd() - 0.5) * 0.02, yaw0 + rnd() * 0.6, (rnd() - 0.5) * 0.02);
          mats.push({ m: new THREE.Matrix4().compose(P, Q.setFromEuler(E), S), top: k === h - 1 });
        }
        stackTops.push(new THREE.Vector3(x + lean, BED + h * coinT, z));
      }
    }
    const bodies = new THREE.InstancedMesh(coinGeo, coinM, mats.length);
    const tops = mats.filter((c) => c.top);
    const marks = new THREE.InstancedMesh(coinMarkGeo, coinMarkM, tops.length);
    const off = new THREE.Matrix4().makeTranslation(0, coinT / 2 + 0.003, 0);
    const col = new THREE.Color();
    mats.forEach(({ m }, i) => {
      bodies.setMatrixAt(i, m);
      const v = 0.86 + rnd() * 0.14;
      bodies.setColorAt(i, col.setRGB(v, v, v));
    });
    tops.forEach(({ m }, i) => marks.setMatrixAt(i, m.clone().multiply(off)));
    bodies.castShadow = bodies.receiveShadow = true;
    marks.receiveShadow = true;
    scene.add(bodies, marks);
  }
  // coins paid out: each clip that clears the gate sends a coin onto the pile
  type Flyer = { g: THREE.Group; start: number; from: THREE.Vector3; to: THREE.Vector3; ring: THREE.Mesh; ringM: THREE.MeshBasicMaterial };
  const flyers: Flyer[] = Array.from({ length: 6 }, () => {
    const g = live(new THREE.Group());
    const body = new THREE.Mesh(coinGeo, coinM);
    body.rotation.x = Math.PI / 2;
    g.add(body);
    for (const s of [-1, 1]) {
      const m = new THREE.Mesh(coinMarkGeo, coinMarkM);
      m.rotation.x = s > 0 ? Math.PI / 2 : -Math.PI / 2;
      m.position.z = s * (coinT / 2 + 0.003);
      g.add(m);
    }
    g.visible = false;
    g.scale.setScalar(0.7);
    scene.add(g);
    const ringM = new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = live(new THREE.Mesh(new THREE.RingGeometry(0.3, 0.36, 40), ringM));
    ring.visible = false;
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);
    return { g, start: -99, from: new THREE.Vector3(), to: new THREE.Vector3(), ring, ringM };
  });
  let flyerN = 0;
  let gateFlash = 0;
  let failFlash = 0;
  const reach: number[] = [];

  /* ---------------------------------------------------------------- clips on the belt, and view packets */
  const GATE_U = (() => {
    let best = 0, bd = Infinity;
    for (let i = 0; i < 1000; i++) {
      const q = rail.getPointAt(i / 1000);
      const d = (q.x - GATE_X) ** 2 + q.z ** 2;
      if (d < bd) {
        bd = d;
        best = i / 1000;
      }
    }
    return best;
  })();
  const SPEED = 0.05;
  const cardM = mat(0xf2f3f6);
  const cardGeo = new RoundedBoxGeometry(0.46, 0.8, 0.05, 3, 0.05);
  const cardBodies = live(new THREE.InstancedMesh(cardGeo, cardM, 12));
  scene.add(cardBodies);
  const faceGeo = new THREE.PlaneGeometry(0.4, 0.72);
  faceGeo.translate(0, 0, 0.03);
  const clipTexs = Array.from({ length: 18 }, (_, i) => clipTex(i + 100));
  type Card = { face: THREE.Mesh; fm: THREE.MeshStandardMaterial; offset: number; lastU: number; tex: number; out: number; back: number; seat: number; from: THREE.Vector3 };
  const clipCards: Card[] = Array.from({ length: 12 }, (_, i) => {
    const fm = screenMat(clipTexs[i], 0.6);
    const face = live(new THREE.Mesh(faceGeo, fm));
    scene.add(face);
    return { face, fm, offset: i / 12, lastU: -1, tex: i, out: -99, back: -99, seat: 0, from: new THREE.Vector3() };
  });
  // about one clip in four does not pass review
  const rejected = (ci: number, lap: number) => frac(Math.sin(ci * 12.9898 + lap * 78.233) * 43758.5453) < 0.26;
  const RED = new THREE.Color(0xef4444);
  const BLUE_C = new THREE.Color(BLUE);
  // where each clipper's laptop meets the belt
  const nearestU = (p: THREE.Vector3) => {
    let best = 0, bd = Infinity;
    for (let i = 0; i < 600; i++) {
      const q = rail.getPointAt(i / 600);
      const d = (q.x - p.x) ** 2 + (q.z - p.z) ** 2;
      if (d < bd) {
        bd = d;
        best = i / 600;
      }
    }
    return best;
  };
  const seatU = seatLaptops.map((l) => nearestU(l.getWorldPosition(new THREE.Vector3())));
  const viewDir = new THREE.Vector3(camera.position.x, 0, camera.position.z).normalize();
  const packetGeo = new THREE.SphereGeometry(0.055, 10, 8);
  const packetM = glow(5);
  const packetMesh = live(new THREE.InstancedMesh(packetGeo, packetM, 24));
  scene.add(packetMesh);
  const packets = Array.from({ length: 24 }, (_, i) => (i / 24 + 0.02) % 1);

  /* ---------------------------------------------------------------- merge meshes into as few draw calls as possible */
  const bake = (meshes: THREE.Mesh[], space: THREE.Matrix4 | null) => {
    const inv = space ? space.clone().invert() : null;
    // Everything stays indexed (unindexed parts get a trivial index), so shared vertices are
    // shaded once instead of once per triangle.
    const geos = meshes.map((m) => {
      const geo = m.geometry.clone();
      if (!geo.index) {
        const n = geo.attributes.position.count;
        const idx = new Uint32Array(n);
        for (let i = 0; i < n; i++) idx[i] = i;
        geo.setIndex(new THREE.BufferAttribute(idx, 1));
      }
      geo.applyMatrix4(inv ? inv.clone().multiply(m.matrixWorld) : m.matrixWorld);
      for (const name of Object.keys(geo.attributes)) if (name !== "position" && name !== "normal" && name !== "uv") geo.deleteAttribute(name);
      if (!geo.attributes.uv) geo.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
      geo.clearGroups();
      return geo;
    });
    const merged = mergeGeometries(geos, false);
    geos.forEach((g) => g.dispose());
    return merged;
  };
  // Inside each animated group, merge the parts that share a material. Nested animated groups stay separate.
  function mergeLive() {
    scene.updateMatrixWorld(true);
    const roots: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (o.userData.live && !(o as THREE.InstancedMesh).isInstancedMesh && !(o as THREE.Mesh).isMesh) roots.push(o);
    });
    for (const root of roots) {
      const buckets = new Map<string, THREE.Mesh[]>();
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh || (m as THREE.InstancedMesh).isInstancedMesh || Array.isArray(m.material) || m.userData.live) return;
        for (let p = m.parent; p && p !== root; p = p.parent) if (p.userData.live) return;
        const k = m.material.uuid;
        buckets.set(k, [...(buckets.get(k) ?? []), m]);
      });
      for (const meshes of buckets.values()) {
        if (meshes.length < 2) continue;
        const merged = bake(meshes, root.matrixWorld);
        if (!merged) continue;
        const mesh = new THREE.Mesh(merged, meshes[0].material);
        mesh.castShadow = false;
        mesh.receiveShadow = meshes.some((m) => m.receiveShadow);
        root.add(mesh);
        for (const m of meshes) m.removeFromParent();
      }
    }
  }

  /* ---------------------------------------------------------------- merge everything static */
  function mergeStatic() {
    scene.updateMatrixWorld(true);
    type Bucket = { mat: THREE.Material; meshes: THREE.Mesh[]; cast: boolean; recv: boolean };
    const buckets = new Map<string, Bucket>();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || (m as THREE.InstancedMesh).isInstancedMesh || Array.isArray(m.material)) return;
      for (let p: THREE.Object3D | null = m; p; p = p.parent) if (p.userData.live) return;
      const k = `${m.material.uuid}|${m.castShadow}|${m.receiveShadow}`;
      const b = buckets.get(k) ?? { mat: m.material, meshes: [], cast: m.castShadow, recv: m.receiveShadow };
      b.meshes.push(m);
      buckets.set(k, b);
    });
    for (const b of buckets.values()) {
      if (b.meshes.length < 2) continue;
      const merged = bake(b.meshes, null);
      if (!merged) continue;
      const mesh = new THREE.Mesh(merged, b.mat);
      mesh.castShadow = b.cast;
      mesh.receiveShadow = b.recv;
      scene.add(mesh);
      for (const m of b.meshes) m.removeFromParent();
    }
  }
  mergeStatic();
  mergeLive();
  renderer.shadowMap.needsUpdate = true;

  /* ---------------------------------------------------------------- post-processing, keeping the background transparent */
  // 4x MSAA at low pixel ratios, 2x once the pixel ratio already smooths edges.
  const rt = new THREE.WebGLRenderTarget(W * dpr, H * dpr, { type: THREE.HalfFloatType, samples: renderer.capabilities.isWebGL2 ? (dpr > 1.3 ? 2 : 4) : 0 });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(dpr);
  composer.setSize(W, H);
  const renderPass = new RenderPass(scene, camera);
  renderPass.clearAlpha = 0;
  composer.addPass(renderPass);
  const save = new SavePass(new THREE.WebGLRenderTarget(W * dpr, H * dpr)); // only its alpha is read: 8 bits are plenty
  composer.addPass(save);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.42, 0.55, 0.9);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  // Bloom writes alpha 1 everywhere. Restore the real coverage, and let glow add its own.
  const alphaPass = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, tSaved: { value: null } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform sampler2D tDiffuse; uniform sampler2D tSaved; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); float a = max(texture2D(tSaved, vUv).a, max(c.r, max(c.g, c.b))); gl_FragColor = vec4(min(c.rgb, vec3(a)), clamp(a, 0.0, 1.0)); }",
  });
  alphaPass.uniforms.tSaved.value = save.renderTarget.texture; // set after construction: uniform cloning drops render target textures
  composer.addPass(alphaPass);

  /* ---------------------------------------------------------------- camera focus */
  const ANCHORS: THREE.Vector3[] = [
    new THREE.Vector3(-7.75, 3.85, -5.75),
    new THREE.Vector3(-9.7, DECK_H + 1.6, -0.5),
    new THREE.Vector3(1.2, 2.45, 3.3),
    new THREE.Vector3(7.1, 2.6, -3.9),
    new THREE.Vector3(GATE_X, 2.9, 0),
    new THREE.Vector3(-0.7, 3.85, -5.75),
    new THREE.Vector3(-0.6, 1.6, 0.3),
    new THREE.Vector3(9.75, DECK_H + 1.8, 3.45),
  ];
  // what the camera looks at when zoomed into each station (a little wider than the dot)
  const FOCUS: THREE.Vector3[] = [
    new THREE.Vector3(-7.75, 3.4, -5.4),
    new THREE.Vector3(-9.8, 2.6, -0.3),
    new THREE.Vector3(1.2, 1.4, 2.6),
    new THREE.Vector3(7.0, 2.4, -3.6),
    new THREE.Vector3(7.0, 1.8, 0.8),
    new THREE.Vector3(-0.7, 3.6, -5.6),
    new THREE.Vector3(-0.4, 1.0, 0),
    new THREE.Vector3(9.6, 2.9, 3.4),
  ];
  const ZOOM = { desktop: [2.3, 2.4, 2.0, 2.2, 2.4, 1.75, 2.0, 2.3], mobile: [2.5, 2.6, 2.3, 2.5, 2.7, 2.0, 2.3, 2.6] };
  const cam = { u: 0, v: 0, z: 0, vu: 0, vv: 0, vz: 0, tu: 0, tv: 0, tz: 0 };
  const toPlane = (p: THREE.Vector3) => {
    const d = p.clone().sub(basePos);
    return [d.dot(right), d.dot(up)] as const;
  };
  function focus(i: number | null, layout: "desktop" | "mobile") {
    if (i === null) {
      cam.tu = cam.tv = cam.tz = 0;
      return;
    }
    const Z = ZOOM[layout][i];
    const [au, av] = toPlane(FOCUS[i]);
    const hw = (VIEW_H * (W / H)) / 2 / Z;
    const fx = layout === "desktop" ? 0.36 : 0.5;
    cam.tu = au - (2 * fx - 1) * hw;
    cam.tv = av;
    cam.tz = Math.log(Z);
  }
  // Critically damped spring, solved exactly, so the glide takes the same time at any frame rate
  // (a slow device drops frames instead of slowing the camera down).
  function stepCamera(frameDt: number) {
    const w = reduceMotion ? 12 : 3.6;
    const dt = Math.min(frameDt, 0.25);
    const e = Math.exp(-w * dt);
    for (const k of ["u", "v", "z"] as const) {
      const vk = `v${k}` as "vu" | "vv" | "vz";
      const tk = `t${k}` as "tu" | "tv" | "tz";
      const d = cam[k] - cam[tk];
      const c = cam[vk] + w * d;
      cam[k] = cam[tk] + (d + c * dt) * e;
      cam[vk] = (cam[vk] - w * c * dt) * e;
    }
    camera.position.copy(basePos).addScaledVector(right, cam.u).addScaledVector(up, cam.v);
    camera.zoom = Math.exp(cam.z);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    return Math.abs(cam.tu - cam.u) + Math.abs(cam.tv - cam.v) + Math.abs(cam.tz - cam.z) + Math.abs(cam.vu) + Math.abs(cam.vv) + Math.abs(cam.vz) > 1e-3;
  }

  /* ---------------------------------------------------------------- animation */
  const tmp = new THREE.Vector3();
  const M4 = new THREE.Matrix4();
  const S4 = new THREE.Vector3();
  const C4 = new THREE.Color();
  function animate(t: number, dt: number) {
    // clips and packets
    let nextCard: Card | null = null;
    let nextGap = Infinity;
    clipCards.forEach((c, ci) => {
      const u = frac(c.offset + t * SPEED);
      const lap = Math.floor(c.offset + t * SPEED);
      const p = rail.getPointAt(u);
      const tan = rail.getTangentAt(u);
      let yaw = Math.atan2(tan.x, tan.z) + Math.PI / 2;
      if (Math.sin(yaw) * viewDir.x + Math.cos(yaw) * viewDir.z < 0) yaw += Math.PI; // face the viewer
      c.face.position.set(p.x, p.y + 0.44, p.z);
      c.face.rotation.set(0, yaw, 0);
      let scale = 1;
      const onBelt = t < c.out || t >= c.back;
      if (!onBelt) {
        const leave = (t - c.out) / 0.9;
        const enter = 1 - (c.back - t) / 0.8;
        if (leave < 1) {
          // rejected: tinted red, the reviewer pulls it off the belt into his tablet
          reviewerTablet.getWorldPosition(tmp);
          const k = smooth(0, 1, leave);
          c.face.position.lerpVectors(c.from, tmp, k);
          c.face.position.y += Math.sin(k * Math.PI) * 0.45;
          const turn = Math.atan2(Math.sin(camYaw - yaw), Math.cos(camYaw - yaw));
          c.face.rotation.set(0, yaw + turn * k, k * 0.25);
          scale = 1 - 0.7 * k - 0.3 * smooth(0.75, 1, leave);
          c.fm.emissive.copy(RED);
        } else if (enter >= 0) {
          // a clipper hands a new version from their laptop back onto the belt
          if (c.fm.emissive.equals(RED)) {
            c.tex = (c.tex + 12) % clipTexs.length;
            c.fm.map = c.fm.emissiveMap = clipTexs[c.tex];
            c.fm.emissive.setRGB(1, 1, 1);
          }
          seatLaptops[c.seat].getWorldPosition(tmp);
          tmp.y += 0.35;
          const k = smooth(0, 1, enter);
          c.face.position.lerpVectors(tmp, c.face.position, k);
          c.face.position.y += Math.sin(k * Math.PI) * 0.5;
          scale = 0.35 + 0.65 * k;
          reach[c.seat] = Math.max(reach[c.seat] ?? 0, Math.sin(Math.min(1, enter * 1.4) * Math.PI));
        } else scale = 0;
      } else if (c.fm.emissive.equals(RED)) c.fm.emissive.setRGB(1, 1, 1);
      c.face.scale.setScalar(Math.max(0.0001, scale));
      c.face.visible = scale > 0.001;
      cardBodies.setMatrixAt(ci, c.face.matrix.compose(c.face.position, c.face.quaternion, S4.setScalar(Math.max(0.0001, scale))));
      if (onBelt) {
        const gap = frac(GATE_U - u);
        if (gap < nextGap) {
          nextGap = gap;
          nextCard = c;
        }
      }
      if (onBelt && c.lastU >= 0 && c.lastU < GATE_U && u >= GATE_U) {
        if (rejected(ci, lap)) {
          // fails review: red flash, no payout, off the belt
          failFlash = 1;
          c.out = t;
          c.from.copy(c.face.position);
          // back on the belt a few seconds later, from whichever clipper it reaches first after that
          const wait = 1.6 + Math.random() * 9;
          let best = Infinity;
          seatU.forEach((su, j) => {
            const k = Math.ceil((t + wait) * SPEED + c.offset - su);
            const when = (su + k - c.offset) / SPEED;
            if (when < best) {
              best = when;
              c.seat = j;
            }
          });
          c.back = best;
        } else {
          // passes: flash, then pay out a coin
          gateFlash = 1;
          const f = flyers[flyerN++ % flyers.length];
          f.start = t + 0.15;
          f.from.set(GATE_X - 0.7, 1.85, (Math.random() - 0.5) * 0.3);
          const pool = stackTops.filter((s) => s.x > -1.5);
          f.to.copy(pool[Math.floor(Math.random() * pool.length)]).add(tmp.set(0, coinT / 2, 0));
        }
      }
      c.lastU = u;
    });
    cardBodies.instanceMatrix.needsUpdate = true;
    // the reviewer's tablet runs through the checks for the clip that is coming up
    {
      const nc = nextCard as Card | null;
      if (nc) {
        const ci = clipCards.indexOf(nc);
        const fail = rejected(ci, Math.floor(nc.offset + t * SPEED));
        const n = Math.max(0, Math.min(5, Math.floor((1 - nextGap * 12) * 6)));
        const state = `${ci}|${n}|${fail}`;
        if (state !== tabletState) {
          tabletState = state;
          drawVerify(n, fail, 100 + nc.tex);
        }
      }
    }
    packets.forEach((off, i) => {
      const q = rail.getPointAt(frac(off + t * SPEED));
      packetMesh.setMatrixAt(i, M4.makeTranslation(q.x, q.y + 0.06, q.z));
    });
    packetMesh.instanceMatrix.needsUpdate = true;
    // gate: blue when a clip passes, red when it fails
    gateFlash = Math.max(0, gateFlash - dt * 1.6);
    failFlash = Math.max(0, failFlash - dt * 1.2);
    const flash = Math.max(gateFlash, failFlash);
    const redness = failFlash > 0 ? failFlash / (failFlash + gateFlash + 1e-6) : 0;
    scanM.opacity = 0.08 + 0.3 * flash;
    scanM.color.copy(BLUE_C).lerp(RED, redness);
    for (const m of gateRings) {
      m.emissiveIntensity = 2.4 + 3 * flash;
      m.emissive.copy(BLUE_C).lerp(RED, redness);
      m.color.copy(m.emissive);
    }
    markMesh.position.y = 3.5 + 0.06 * Math.sin(t * 1.1);
    gateHalo.opacity = 0.85 + 0.15 * Math.sin(t * 1.1) + 0.4 * gateFlash;
    // coins in flight
    for (const f of flyers) {
      const k = (t - f.start) / 0.95;
      if (k < 0 || k > 1.6) {
        f.g.visible = false;
        f.ring.visible = false;
        continue;
      }
      if (k <= 1) {
        f.g.visible = true;
        f.g.position.lerpVectors(f.from, f.to, k);
        f.g.position.y += Math.sin(k * Math.PI) * 1.3;
        f.g.rotation.set(k * Math.PI * 3, camYaw, 0);
        f.g.scale.setScalar(0.7 * (1 - smooth(0.85, 1, k) * 0.9));
      } else {
        f.g.visible = false;
        f.ring.visible = true;
        const s = (k - 1) / 0.6;
        f.ring.position.copy(f.to).add(tmp.set(0, 0.02, 0));
        f.ring.scale.setScalar(1 + s * 1.6);
        f.ringM.opacity = 0.8 * (1 - s);
      }
    }
    // clippers at work: typing in bursts, glancing around, reaching when they put a clip back
    workers.forEach((w, i) => {
      const r = reach[i] ?? 0;
      const burst = smooth(0.1, 0.6, 0.5 + 0.5 * Math.sin(t * 0.55 + w.phase)) * (1 - r);
      w.hands.rotation.x = burst * 0.06 * (0.5 + 0.5 * Math.sin(t * 17 + w.phase)) + r * 0.55;
      w.hands.rotation.z = burst * 0.035 * Math.sin(t * 11 + w.phase);
      const glance = smooth(0.75, 0.95, Math.sin(t * 0.21 + w.phase * 2.3)) * (1 - r);
      w.head.rotation.y = glance * 0.45 * Math.sin(w.phase * 5) + 0.04 * Math.sin(t * 0.7 + w.phase);
      w.head.rotation.x = 0.04 * Math.sin(t * 1.3 + w.phase) + burst * 0.05 - r * 0.12;
      reach[i] = 0;
    });
    // the reviewer reads the tablet, looks up at the gate, checks off the clip
    {
      const c = t % 5;
      const lookUp = smooth(2.4, 2.8, c) * (1 - smooth(3.9, 4.3, c));
      reviewerHead.rotation.x = 0.38 * (1 - lookUp) - 0.06 * lookUp;
      reviewerHead.rotation.y = lookUp * (0.25 * Math.sin((c - 2.4) * 2.2));
      reviewerBody.rotation.y = 0.04 * Math.sin(t * 0.6);
    }
    // playheads on the laptops
    playheads.forEach((p, i) => {
      M4.makeTranslation(-0.25 + 0.5 * frac(t * p.speed + p.phase), 0.2 - 0.122, 0.014);
      playheadMesh.setMatrixAt(i, M4.premultiply(p.lid.matrixWorld));
    });
    playheadMesh.count = playheads.length;
    playheadMesh.instanceMatrix.needsUpdate = true;
    // floating screens bob, halos breathe
    for (const f of floaters) {
      f.g.position.y = f.y + 0.05 * Math.sin(t * 0.8 + f.phase);
      if (f.halo) f.halo.opacity = 0.85 + 0.15 * Math.sin(t * 0.9 + f.phase);
    }
    // feeds swipe to the next clip together, a beat apart
    phoneTexs.forEach((tex, i) => {
      const c = t / 3.2 - i * 0.04;
      const step = Math.floor(c);
      const e = smooth(0.82, 1, frac(c));
      tex.offset.y = -0.25 * (step + e);
    });
    // reactions
    hearts.forEach((h, i) => {
      const k = frac(t / 2.4 + h.phase);
      if (k < 0.02) h.phone = Math.floor(Math.random() * 4);
      phoneTops[h.phone].getWorldPosition(h.from);
      tmp.copy(h.from).addScaledVector(up, 0.2 + k * 1.1).addScaledVector(right, Math.sin(k * 6 + h.phase * 9) * 0.12);
      M4.compose(tmp, camera.quaternion, S4.setScalar(0.6 + k * 0.6));
      heartMesh.setMatrixAt(i, M4);
      heartMesh.setColorAt(i, C4.setScalar(smooth(0, 0.15, k) * (1 - smooth(0.6, 1, k))));
    });
    heartMesh.instanceMatrix.needsUpdate = true;
    if (heartMesh.instanceColor) heartMesh.instanceColor.needsUpdate = true;
    // canvases: the most overdue one redraws, the rest wait a frame
    let due: LiveCanvas | null = null;
    for (const lc of liveCanvases) if (t >= lc.next && (!due || lc.next < due.next)) due = lc;
    if (due) {
      due.next += due.every;
      if (due.next < t) due.next = t + due.every; // after a pause, pick up the rhythm again
      due.draw(due.g, t);
      due.tex.needsUpdate = true;
    }
  }

  /* ---------------------------------------------------------------- loop */
  // Station numbers: projected every frame, handed out only when one actually moved.
  const pts: StudioPoint[] = ANCHORS.map(() => ({ x: 0, y: 0, on: true }));
  let ptsDirty = true;
  const report = () => {
    let moved = ptsDirty;
    for (let i = 0; i < ANCHORS.length; i++) {
      tmp.copy(ANCHORS[i]).project(camera);
      const x = ((tmp.x + 1) / 2) * W;
      const y = ((1 - tmp.y) / 2) * H;
      const on = tmp.x > -1.02 && tmp.x < 1.02 && tmp.y > -1.02 && tmp.y < 1.02;
      const p = pts[i];
      if (Math.abs(p.x - x) > 0.2 || Math.abs(p.y - y) > 0.2 || p.on !== on) {
        p.x = x;
        p.y = y;
        p.on = on;
        moved = true;
      }
    }
    ptsDirty = false;
    if (moved) opts.onPoints(pts.map((p) => ({ ...p })));
  };
  let raf = 0;
  let running = false;
  let disposed = false;
  let ready = false;
  let last = 0;
  let clock = reduceMotion ? 3.3 : 0;
  let still = false;
  // Frame pacing: on 120Hz+ screens draw every other refresh, which is still 60fps.
  let skip = 1;
  let tick = 0;
  const probe: number[] = [];
  // Adaptive quality: if the frame rate stays low, draw fewer pixels.
  const minDpr = 1;
  let dprCap = Infinity;
  let slowFrames = 0;
  let sampled = 0;
  let warmup = 0;
  const draw = (dt: number, realDt: number) => {
    const moving = stepCamera(realDt);
    if (reduceMotion && still && !moving) return;
    animate(clock, dt);
    composer.render();
    report();
    still = reduceMotion && !moving;
  };
  const frame = (now: number) => {
    raf = nextFrame(frame);
    if (probe.length < 24 && last) {
      probe.push(now - last);
      if (probe.length === 24) {
        const sorted = probe.slice(4).sort((a, b) => a - b);
        skip = sorted[10] < 10.5 ? 2 : 1; // median refresh interval
      }
    }
    if (++tick % skip !== 0) return;
    const realDt = last ? (now - last) / 1000 : 0.016;
    const dt = Math.min(0.05, realDt);
    last = now;
    if (!reduceMotion) clock += dt;
    draw(dt, realDt);
    // a slow first second is shader and texture warm-up, not the steady state
    if (warmup < 45) {
      warmup++;
      return;
    }
    sampled++;
    if (dt > 0.026) slowFrames++;
    if (sampled >= 60) {
      if (slowFrames > 36 && dpr > minDpr) {
        dpr = dprCap = Math.max(minDpr, Math.round((dpr - 0.25) * 4) / 4);
        applySize();
        warmup = 30;
      }
      sampled = 0;
      slowFrames = 0;
    }
  };
  function setRunning(on: boolean) {
    if (disposed || on === running) return;
    running = on;
    if (!ready) return; // starts once the warm-up below is done
    if (on) {
      last = 0;
      tick = 0;
      warmup = 0;
      still = false;
      raf = nextFrame(frame);
    } else cancelFrame(raf);
  }
  function applySize() {
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    composer.setPixelRatio(dpr);
    composer.setSize(W, H);
    save.setSize(W * dpr, H * dpr);
    setFrustum();
    still = false;
    ptsDirty = true;
  }
  function resize(width: number, height: number, ratio: number) {
    W = Math.max(1, width);
    H = Math.max(1, height);
    dpr = Math.min(ratio, dprCap); // never back above a ratio the adaptive step dropped to
    applySize();
    if (ready && !running) {
      // the canvas was cleared by the resize: redraw once so it is not blank when it comes back
      composer.render();
      report();
    }
  }
  function dispose() {
    disposed = true;
    running = false;
    cancelFrame(raf);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.geometry.dispose();
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mm of mats) {
        for (const v of Object.values(mm)) if (v instanceof THREE.Texture) v.dispose();
        mm.dispose();
      }
    });
    envRT.dispose();
    pmrem.dispose();
    composer.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  /* ---------------------------------------------------------------- warm-up */
  // Compile every shader before the first frame (in parallel where the browser supports it),
  // with the composer's target bound so the variants match what gets drawn. Hidden parts are
  // shown for the compile so they do not stall the loop the first time they appear. Then draw
  // one frame, which uploads every texture and bakes the shadow map, and only then go live.
  (async () => {
    const hidden: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    renderer.setRenderTarget(rt);
    try {
      // parallel compile where the GPU driver offers it, a plain compile otherwise
      if (renderer.extensions.has("KHR_parallel_shader_compile")) await renderer.compileAsync(scene, camera);
      else renderer.compile(scene, camera);
    } catch {
      // compile on first draw instead
    }
    renderer.setRenderTarget(null);
    for (const o of hidden) o.visible = false;
    if (disposed) return;
    stepCamera(0);
    animate(clock, 0);
    composer.render();
    report();
    ready = true;
    opts.onReady();
    if (running) {
      running = false;
      setRunning(true);
    }
  })();

  return {
    focus: (i, layout) => {
      focus(i, layout);
      still = false;
      if (ready && !running) {
        // jump straight there while paused, so it is in place when it comes back on screen
        cam.u = cam.tu;
        cam.v = cam.tv;
        cam.z = cam.tz;
        cam.vu = cam.vv = cam.vz = 0;
      }
    },
    setRunning,
    resize,
    dispose,
  };
}
