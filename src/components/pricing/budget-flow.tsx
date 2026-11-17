import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand";
import { siInstagram, siTiktok, siX, siYoutubeshorts } from "simple-icons";

// Pricing header: where the money goes. Your budget splits into the view pool, which flows to
// clippers and out to the platforms, and the management fee, which pays NovaEyes to run it.
// Same drawing language as the homepage diagrams (ne-* classes). Motion stops with reduced motion.

const PLATFORMS = [siTiktok, siInstagram, siYoutubeshorts, siX];
const CLIPPER_Y = [30, 66, 102, 138];
const toPool = "M112,150 C150,150 152,84 190,84";
const toFee = "M112,174 C150,174 152,236 190,236";
const toClipper = (y: number) => `M306,84 C330,84 330,${y} 350,${y}`;
const toPlatform = (y: number) => `M378,${y} L404,${y}`;
const toNovaEyes = "M306,236 L350,236";

export function BudgetFlow() {
  return (
    <figure className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-[30rem] max-w-full -translate-x-1/2 lg:max-w-[130%] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--glow)/0.16),transparent)]"
      />
      <svg viewBox="0 0 450 290" className="relative h-auto w-full overflow-visible" role="img" aria-labelledby="budget-flow-title">
        <title id="budget-flow-title">
          Your budget splits into a view pool, paid to clippers per verified view on TikTok, Reels, Shorts and X, and a management fee
          paid to NovaEyes for running the campaign.
        </title>

        {/* flows */}
        <path d={toPool} className="ne-flow ne-flow-on" strokeWidth="2" />
        <path d={toFee} className="ne-flow ne-flow-on ne-dash" />
        {CLIPPER_Y.map((y) => (
          <path key={`c${y}`} d={toClipper(y)} className="ne-flow ne-flow-on" />
        ))}
        {CLIPPER_Y.map((y) => (
          <path key={`p${y}`} d={toPlatform(y)} className="ne-flow" />
        ))}
        <path d={toNovaEyes} className="ne-flow ne-flow-on ne-dash" />

        <g className="wn-motion">
          {[0, 0.6, 1.2].map((b) => (
            <circle key={`a${b}`} r="2.8" className="ne-pkt">
              <animateMotion dur="1.8s" begin={`-${b}s`} repeatCount="indefinite" path={toPool} />
            </circle>
          ))}
          <circle r="2.2" className="ne-pkt" opacity="0.7">
            <animateMotion dur="2.4s" repeatCount="indefinite" path={toFee} />
          </circle>
          {CLIPPER_Y.map((y, i) => (
            <circle key={`b${y}`} r="2.1" className="ne-pkt">
              <animateMotion dur="1.6s" begin={`-${(i * 0.37).toFixed(2)}s`} repeatCount="indefinite" path={toClipper(y)} />
            </circle>
          ))}
          {CLIPPER_Y.map((y, i) => (
            <circle key={`d${y}`} r="1.9" className="ne-pkt">
              <animateMotion dur="0.9s" begin={`-${(i * 0.21).toFixed(2)}s`} repeatCount="indefinite" path={toPlatform(y)} />
            </circle>
          ))}
        </g>

        {/* your budget */}
        <rect x="8" y="132" width="104" height="60" rx="18" className="ne-node ne-hub" />
        <text x="60" y="168" textAnchor="middle" className="pr-svg-big">
          $3,000+
        </text>
        <text x="60" y="214" textAnchor="middle" className="pr-svg-cap">
          Your budget
        </text>

        {/* view pool */}
        <rect x="190" y="64" width="116" height="40" rx="12" fill="url(#pr-pool)" stroke="rgb(var(--glow) / 0.9)" />
        <defs>
          <linearGradient id="pr-pool" x1="0" x2="1">
            <stop offset="0" stopColor="#1e3a8a" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <text x="248" y="89" textAnchor="middle" className="pr-svg-label">
          View pool
        </text>

        {/* management fee */}
        <rect x="190" y="216" width="116" height="40" rx="12" className="ne-node" stroke="rgb(var(--glow) / 0.7)" strokeDasharray="4 3" />
        <text x="248" y="241" textAnchor="middle" className="pr-svg-label">
          Management fee
        </text>

        {/* clippers and platforms */}
        {CLIPPER_Y.map((y, i) => (
          <g key={`n${y}`} transform={`translate(364,${y})`}>
            <circle r="17" fill="none" stroke="rgb(var(--glow) / 0.3)" className="ne-live" style={{ animationDelay: `${i * 0.3}s` }} />
            <circle r="13" className="ne-node ne-node-on" />
            <circle cy="-3" r="3" fill="var(--fg)" />
            <path d="M-5.6,6.6 a5.6,4.6 0 0 1 11.2,0" fill="var(--fg)" />
          </g>
        ))}
        {CLIPPER_Y.map((y, i) => (
          <g key={`pl${y}`} transform={`translate(404,${y - 14})`}>
            <rect width="28" height="28" rx="8" className="ne-node ne-node-on" />
            <svg x="7" y="7" width="14" height="14" viewBox="0 0 24 24">
              <path d={PLATFORMS[i].path} fill="var(--fg)" />
            </svg>
          </g>
        ))}
        <text x="384" y="178" textAnchor="middle" className="pr-svg-cap">
          Per verified view
        </text>

        {/* NovaEyes */}
        <rect x="350" y="212" width="82" height="48" rx="14" className="ne-node ne-hub" />
        <svg x="372" y="230" width="38" height="13" viewBox={MARK_VIEWBOX}>
          <path fillRule="evenodd" d={MARK_PATH} fill="var(--fg)" />
        </svg>
        <text x="391" y="280" textAnchor="middle" className="pr-svg-cap">
          Runs the campaign
        </text>
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted">
        The view pool pays clippers. The fee pays for running the campaign.
      </figcaption>
    </figure>
  );
}
