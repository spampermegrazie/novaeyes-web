import type { Metadata } from "next";
import { publicCampaigns, totalPublicViews } from "@/content/campaigns";
import { CampaignCard } from "@/components/campaign-card";
import { Cta } from "@/components/cta";
import { CONTAINER, PageHeader } from "@/components/page-kit";
import { breadcrumbJsonLd, JsonLd } from "@/components/json-ld";
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
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Case studies", path: "/case-studies" }])} />
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Case studies" }]}
        title="Case studies."
        muted={`${formatCompact(totalPublicViews)} views across ${publicCampaigns.length} published campaigns.`}
        lead={<p>Every figure comes from the campaign dashboard.</p>}
      />
      <section className={`${CONTAINER} pb-24`}>
        <ul className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {publicCampaigns.map((c, i) => (
            <li key={c.slug} className="min-w-0">
              <CampaignCard campaign={c} first={i === 0} />
            </li>
          ))}
        </ul>
      </section>
      <Cta />
    </>
  );
}
