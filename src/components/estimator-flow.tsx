import { MARK_PATH, MARK_VIEWBOX } from "./brand";
import { formatCompact, formatUsd } from "@/lib/estimator";
import { BUDGET_SCALE, VIEWS_SCALE, positionOf } from "@/lib/scale";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";

// The reach estimator's side panel: the whole campaign as one vertical flow. Budget at the top,
// NovaEyes in the middle, then clippers, then the platforms, and views at the bottom. It fills in
// as you go: the number you picked lights its end, more budget (or more views) wakes more
// clippers and sends more, faster packets, the niche shows beside the hub, and the estimate
// lights the other end. Packets run from what you picked to what you get: down from a budget,
// up from a view target. Built from the same pieces as the homepage engine diagrams (ne-* in
// globals.css).

type Mode = "budget" | "views";

const W = 440;
const CX = W / 2;
const TOP = { x: 100, y: 16, w: 240, h: 60 };
const BOTTOM = { x: 100, y: 484, w: 240, h: 60 };
const HUB = { x: 176, y: 140, w: 88, h: 72 };
const CLIPPER_Y = 300;
const CLIPPERS = [52, 136, 220, 304, 388];
const PLATFORM_Y = 392;
const PLATFORMS = [
  { x: 94, name: "TikTok", path: siTiktok.path },
  { x: 178, name: "Instagram Reels", path: siInstagram.path },
  { x: 262, name: "YouTube Shorts", path: siYoutubeshorts.path },
  { x: 346, name: "X", path: siX.path },
];
// which platforms each clipper posts to
const LINKS: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [2, 1],
  [2, 2],
  [3, 2],
  [3, 3],
  [4, 3],
];
// clippers wake from the middle outward as the amount grows
const WAKE_ORDER = [2, 1, 3, 0, 4];

const fan = (x: number) => `M${CX},${HUB.y + HUB.h} C${CX},252 ${x},248 ${x},${CLIPPER_Y - 15}`;
const link = (xc: number, xp: number) => `M${xc},${CLIPPER_Y + 15} C${xc},345 ${xp},345 ${xp},${PLATFORM_Y - 17}`;
const merge = (xp: number) => `M${xp},${PLATFORM_Y + 17} C${xp},450 ${CX},446 ${CX},${BOTTOM.y}`;
const feed = `M${CX},${TOP.y + TOP.h} L${CX},${HUB.y}`;

type Props = {
  mode: Mode | null;
  value: number;
  nicheLabel: string | null;
  /** the estimate, once it is unlocked */
  result: string | null;
  /** the niche is picked but the estimate is still behind the email step */
  locked: boolean;
  reduced: boolean;
};

export function EstimatorFlow({ mode, value, nicheLabel, result, locked, reduced }: Props) {
  const known = mode !== null;
  const scale = mode === "views" ? VIEWS_SCALE : BUDGET_SCALE;
  const level = known ? positionOf(scale, value) : 0; // 0..1
  const awake = new Set(known ? WAKE_ORDER.slice(0, 1 + Math.round(level * 4)) : []);
  const live = (c: number) => awake.has(c);
  const platformLive = (p: number) => LINKS.some(([c, pp]) => pp === p && live(c));
  const pending = locked ? "Locked" : "• • •";
  const budgetText = mode === "budget" ? formatUsd(value) : mode === "views" ? (result ?? pending) : "• • •";
  const viewsText = mode === "views" ? `${formatCompact(value)}` : mode === "budget" ? (result ?? pending) : "• • •";

  // every live wire, drawn top to bottom; packets run down from a budget, up from a view target
  const wires: string[] = [];
  if (known) {
    wires.push(feed);
    for (const c of awake) wires.push(fan(CLIPPERS[c]));
    for (const [c, p] of LINKS) if (live(c)) wires.push(link(CLIPPERS[c], PLATFORMS[p].x));
    PLATFORMS.forEach((p, i) => platformLive(i) && wires.push(merge(p.x)));
  }
  const perWire = 1 + Math.round(level * 2);
  const dur = 1.7 - level * 0.6;
  const keyPoints = mode === "views" ? "1;0" : "0;1";

  const label =
    mode === null
      ? "Your campaign: pick a starting point to see it flow"
      : `Your campaign: budget ${budgetText}, niche ${nicheLabel ?? "not set"}, views ${viewsText}`;

  return (
    <svg viewBox={`0 0 ${W} 560`} className="h-auto w-full overflow-visible" role="img" aria-label={label}>
      {/* all wires, dim until they carry something */}
      <path d={feed} className={`ne-flow ${known ? "ne-flow-on" : ""}`} />
      {CLIPPERS.map((x, c) => (
        <path key={`f${c}`} d={fan(x)} className={`ne-flow ${live(c) ? "ne-flow-on" : ""}`} />
      ))}
      {LINKS.map(([c, p]) => (
        <path key={`l${c}${p}`} d={link(CLIPPERS[c], PLATFORMS[p].x)} className={`ne-flow ${live(c) ? "ne-flow-on" : ""}`} />
      ))}
      {PLATFORMS.map((p, i) => (
        <path key={`m${i}`} d={merge(p.x)} className={`ne-flow ${platformLive(i) ? "ne-flow-on" : ""}`} />
      ))}
      <path d={`M150,176 L${HUB.x},176`} className={`ne-flow ne-dash ${known ? "ne-flow-on" : ""}`} />
      <path d={`M${HUB.x + HUB.w},176 L290,176`} className={`ne-flow ne-dash ${nicheLabel ? "ne-flow-on" : ""}`} />

      {/* packets */}
      {!reduced &&
        wires.flatMap((d, w) =>
          Array.from({ length: perWire }, (_, i) => (
            <circle key={`${mode}-${w}-${i}-${perWire}`} r="2.4" className="ne-pkt">
              <animateMotion
                dur={`${dur}s`}
                begin={`-${(((i / perWire + w * 0.37) % 1) * dur).toFixed(2)}s`}
                repeatCount="indefinite"
                path={d}
                keyPoints={keyPoints}
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
          )),
        )}

      {/* budget */}
      <EndNode box={TOP} caption="Budget" text={budgetText} on={mode === "budget" || (mode === "views" && !!result)} badge={mode === null ? null : mode === "budget" ? "Your number" : "Estimate"} />

      {/* the hub, with what you started from and the niche on either side */}
      <g>
        <rect x={HUB.x - 5} y={HUB.y - 5} width={HUB.w + 10} height={HUB.h + 10} rx="20" fill="none" stroke="rgb(59 130 246 / .45)" className="ne-ring" />
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="16" className="ne-node ne-hub" />
        <svg x={HUB.x + 17} y={HUB.y + 26.8} width="54" height="18.4" viewBox={MARK_VIEWBOX}>
          <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
        </svg>
      </g>
      <Chip x={0} caption="Starting from" text={mode === null ? "Not set" : mode === "budget" ? "A budget" : "A view target"} on={known} />
      <Chip x={290} caption="Niche" text={nicheLabel ?? "Not set"} on={!!nicheLabel} />

      {/* clippers */}
      {CLIPPERS.map((x, c) => (
        <g key={`c${c}`} transform={`translate(${x},${CLIPPER_Y})`} opacity={live(c) ? 1 : 0.45}>
          <circle r="15" className={`ne-node ${live(c) ? "ne-node-on" : ""}`} />
          {live(c) && !reduced && <circle r="19" fill="none" stroke="rgb(59 130 246 / .35)" className="ne-live" style={{ animationDelay: `${c * 0.3}s` }} />}
          <circle cy="-3.5" r="3.4" fill={live(c) ? "var(--fg)" : "var(--muted)"} />
          <path d="M-6.5,7.5 a6.5,5.5 0 0 1 13,0" fill={live(c) ? "var(--fg)" : "var(--muted)"} />
        </g>
      ))}

      {/* platforms */}
      {PLATFORMS.map((p, i) => (
        <g key={p.name} transform={`translate(${p.x - 17},${PLATFORM_Y - 17})`} opacity={platformLive(i) ? 1 : 0.45}>
          <rect width="34" height="34" rx="9" className={`ne-node ${platformLive(i) ? "ne-node-on" : ""}`} />
          <svg x="9" y="9" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d={p.path} fill={platformLive(i) ? "var(--fg)" : "var(--muted)"} />
          </svg>
        </g>
      ))}

      {/* views */}
      <EndNode box={BOTTOM} caption="Views" text={viewsText} on={mode === "views" || (mode === "budget" && !!result)} badge={mode === null ? null : mode === "views" ? "Your number" : "Estimate"} />
    </svg>
  );
}

function EndNode({ box, caption, text, on, badge }: { box: typeof TOP; caption: string; text: string; on: boolean; badge: string | null }) {
  return (
    <g transform={`translate(${box.x},${box.y})`}>
      <rect
        width={box.w}
        height={box.h}
        rx="12"
        className={`ne-node ${on ? "ne-node-on" : ""}`}
        style={on ? { filter: "drop-shadow(0 0 14px rgb(59 130 246 / 0.25))" } : undefined}
      />
      <text x="16" y="22" className="ne-caption">
        {caption}
      </text>
      {badge && (
        <text x={box.w - 16} y="22" textAnchor="end" className="ne-caption" style={{ fill: "var(--accent)" }}>
          {badge}
        </text>
      )}
      <text x="16" y="46" className={`ne-label ${on ? "" : "ne-label-dim"}`} style={{ fontSize: 17 }}>
        {text}
      </text>
    </g>
  );
}

function Chip({ x, caption, text, on }: { x: number; caption: string; text: string; on: boolean }) {
  return (
    <g transform={`translate(${x},156)`}>
      <rect width="150" height="40" rx="10" className={`ne-node ${on ? "ne-node-on" : ""}`} />
      <text x="12" y="16" className="ne-caption">
        {caption}
      </text>
      <text x="12" y="31" className={`ne-label ${on ? "" : "ne-label-dim"}`} style={{ fontSize: text.length > 18 ? 9.5 : 11 }}>
        {text}
      </text>
    </g>
  );
}
