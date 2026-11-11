import type { Metadata } from "next";
import { publicCampaigns, totalPublicViews } from "@/content/campaigns";
import { CampaignCard } from "@/components/campaign-card";
import { Cta } from "@/components/cta";
import { formatCompact } from "@/lib/estimator";

export const metadata: Metadata = {
  title: "Clipping Campaign Case Studies",
  description:
    "Clipping campaign results from NovaEyes: views, CPM, clip counts and business outcomes across music, combat sports and creator campaigns.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudies() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Case studies</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          {formatCompact(totalPublicViews)} views across {publicCampaigns.length} published campaigns. Every figure comes from
          the campaign dashboard.
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
        {publicCampaigns.map((c) => (
          <CampaignCard key={c.slug} campaign={c} />
        ))}
      </section>
      <Cta />
    </>
  );
}
