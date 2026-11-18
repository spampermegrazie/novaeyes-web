import Link from "next/link";
import { cpmText, type Campaign } from "@/content/campaigns";
import { Rule } from "./page-kit";

// A case study in the grid: open, under a hairline, no box. The big number does the work.
export function CampaignCard({ campaign, first = false }: { campaign: Campaign; first?: boolean }) {
  return (
    <Link href={`/case-studies/${campaign.slug}`} className="group flex h-full flex-col">
      <Rule on={first} />
      <p className="mt-6 font-label text-[9px] tracking-[0.14em] text-muted uppercase">{campaign.category}</p>
      <p className="mt-2 font-display text-lg font-semibold transition-colors group-hover:text-accent">{campaign.client}</p>
      <p className="mt-5 font-display text-5xl font-bold tracking-tight tabular-nums">{campaign.viewsLabel}</p>
      <p className="mt-1 font-label text-[9px] tracking-[0.14em] text-muted uppercase">Verified views</p>
      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        {cpmText(campaign) && (
          <div>
            <dt className="text-muted">CPM</dt>
            <dd className="font-display font-semibold tabular-nums">{cpmText(campaign)}</dd>
          </div>
        )}
        {campaign.clips !== undefined && (
          <div>
            <dt className="text-muted">Clips</dt>
            <dd className="font-display font-semibold tabular-nums">{campaign.clips.toLocaleString("en-US")}</dd>
          </div>
        )}
        {campaign.timeframe && (
          <div>
            <dt className="text-muted">Timeframe</dt>
            <dd className="font-display font-semibold tabular-nums">{campaign.timeframe}</dd>
          </div>
        )}
      </dl>
      {campaign.outcomes[0] && <p className="mt-5 text-sm leading-relaxed text-fg/80">{campaign.outcomes[0]}</p>}
      <span className="mt-auto pt-6 font-display text-sm font-semibold text-accent transition-colors group-hover:text-fg">Read the case study →</span>
    </Link>
  );
}
