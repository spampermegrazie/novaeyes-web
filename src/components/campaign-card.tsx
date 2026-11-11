import Link from "next/link";
import type { Campaign } from "@/content/campaigns";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link
      href={`/case-studies/${campaign.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-bg-raised p-6 transition-colors hover:border-muted/40"
    >
      <p className="text-sm text-muted">{campaign.client}</p>
      <p className="mt-3 font-display text-4xl font-bold tracking-tight">{campaign.viewsLabel}</p>
      <p className="text-sm text-muted">views</p>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        {campaign.cpmUsd !== undefined && (
          <div>
            <dt className="text-muted">CPM</dt>
            <dd className="font-display font-semibold tabular-nums">${campaign.cpmUsd.toFixed(2)}</dd>
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
      {campaign.outcomes[0] && <p className="mt-6 text-sm leading-relaxed">{campaign.outcomes[0]}</p>}
      <span className="mt-auto pt-6 text-sm text-accent opacity-80 group-hover:opacity-100">Read the case study</span>
    </Link>
  );
}
