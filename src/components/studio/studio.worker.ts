// Runs the studio scene off the main thread: the page hands over its canvas as an
// OffscreenCanvas, and building, compiling, texture uploads and every frame happen here,
// so scrolling and the rest of the page never wait on the 3D scene.
import { createStudio, type StudioHandle } from "./studio-scene";

export type StudioWorkerIn =
  | { type: "init"; canvas: OffscreenCanvas; width: number; height: number; dpr: number; reduceMotion: boolean; lowPower: boolean }
  | { type: "focus"; index: number | null; layout: "desktop" | "mobile" }
  | { type: "run"; on: boolean }
  | { type: "resize"; width: number; height: number; dpr: number };

export type StudioWorkerOut =
  | { type: "caps"; webgl: boolean }
  | { type: "ready" }
  | { type: "points"; points: { x: number; y: number; on: boolean }[] }
  | { type: "error"; message: string };

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<StudioWorkerIn>) => void) | null;
  postMessage: (m: StudioWorkerOut) => void;
};

let studio: StudioHandle | null = null;
// Messages that arrive before init has built the scene are replayed after it.
const pending: StudioWorkerIn[] = [];

scope.onmessage = (e) => {
  const m = e.data;
  if (m.type === "init") {
    try {
      studio = createStudio(m.canvas, {
        width: m.width,
        height: m.height,
        dpr: m.dpr,
        reduceMotion: m.reduceMotion,
        lowPower: m.lowPower,
        onReady: () => scope.postMessage({ type: "ready" }),
        onPoints: (points) => scope.postMessage({ type: "points", points }),
      });
    } catch (err) {
      scope.postMessage({ type: "error", message: err instanceof Error ? err.message : String(err) });
      return;
    }
    for (const p of pending.splice(0)) apply(p);
    return;
  }
  if (!studio) pending.push(m);
  else apply(m);
};

function apply(m: StudioWorkerIn) {
  if (!studio) return;
  if (m.type === "focus") studio.focus(m.index, m.layout);
  else if (m.type === "run") studio.setRunning(m.on);
  else if (m.type === "resize") studio.resize(m.width, m.height, m.dpr);
}

// Tell the page whether WebGL works on an OffscreenCanvas here, before it hands over its canvas
// (Safari before 17 has OffscreenCanvas but no WebGL on it). This also says the code has loaded.
{
  let webgl = false;
  try {
    const c = new OffscreenCanvas(1, 1);
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  scope.postMessage({ type: "caps", webgl });
}
