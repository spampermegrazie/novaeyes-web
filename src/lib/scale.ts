// Slider scales made of segments, each with its own step and its own share of the track.
// Budget: $1k steps up to $10k, $2.5k steps up to $20k, $5k steps after that.
// Views follow the same idea. The smaller amounts get more room on the track, so
// the range most buyers use is easy to hit.

export type Segment = { from: number; to: number; step: number; weight: number };
export type Scale = { segments: Segment[]; min: number; max: number };

function makeScale(segments: Segment[]): Scale {
  return { segments, min: segments[0].from, max: segments[segments.length - 1].to };
}

export const BUDGET_SCALE = makeScale([
  { from: 3_000, to: 10_000, step: 1_000, weight: 0.35 },
  { from: 10_000, to: 20_000, step: 2_500, weight: 0.2 },
  { from: 20_000, to: 250_000, step: 5_000, weight: 0.45 },
]);

export const VIEWS_SCALE = makeScale([
  { from: 1_000_000, to: 10_000_000, step: 1_000_000, weight: 0.3 },
  { from: 10_000_000, to: 20_000_000, step: 2_500_000, weight: 0.15 },
  { from: 20_000_000, to: 100_000_000, step: 5_000_000, weight: 0.3 },
  { from: 100_000_000, to: 500_000_000, step: 25_000_000, weight: 0.25 },
]);

const total = (s: Scale) => s.segments.reduce((sum, seg) => sum + seg.weight, 0);

// Track position (0 to 1) to the nearest step value.
export function valueAt(scale: Scale, pos: number): number {
  const p = Math.min(1, Math.max(0, pos)) * total(scale);
  let start = 0;
  for (const seg of scale.segments) {
    if (p <= start + seg.weight || seg === scale.segments[scale.segments.length - 1]) {
      const local = seg.weight ? (p - start) / seg.weight : 0;
      const raw = seg.from + local * (seg.to - seg.from);
      return Math.min(seg.to, Math.max(seg.from, seg.from + Math.round((raw - seg.from) / seg.step) * seg.step));
    }
    start += seg.weight;
  }
  return scale.max;
}

// Any value (also typed ones between steps) to its track position.
export function positionOf(scale: Scale, value: number): number {
  const v = Math.min(scale.max, Math.max(scale.min, value));
  let start = 0;
  for (const seg of scale.segments) {
    if (v <= seg.to) return (start + ((v - seg.from) / (seg.to - seg.from)) * seg.weight) / total(scale);
    start += seg.weight;
  }
  return 1;
}

// The next or previous step from a value, for arrow keys.
export function stepFrom(scale: Scale, value: number, dir: 1 | -1): number {
  const all: number[] = [];
  for (const seg of scale.segments) for (let v = seg.from; v <= seg.to; v += seg.step) if (!all.includes(v)) all.push(v);
  if (dir === 1) return all.find((v) => v > value) ?? scale.max;
  return [...all].reverse().find((v) => v < value) ?? scale.min;
}

// Reads what people type: 15000, 15,000, $15k, 2.5m, 25M views.
export function parseAmount(text: string): number | null {
  const t = text.toLowerCase().replace(/[$,\s]|views?/g, "");
  const m = t.match(/^(\d+(?:\.\d+)?)([km])?$/);
  if (!m) return null;
  const n = parseFloat(m[1]) * (m[2] === "k" ? 1_000 : m[2] === "m" ? 1_000_000 : 1);
  return Number.isFinite(n) ? Math.round(n) : null;
}
