import type { Metadata } from "next";
import { facts } from "@/content/facts";
import { Cta } from "@/components/cta";
import { CONTAINER, PageHeader, SECTION, SectionHead } from "@/components/page-kit";

// Kept out of search until every competitor row is checked against that
// agency's own site. A list that only names us is exactly the self-promotion
// this page is meant to beat.
export const metadata: Metadata = {
  title: "Best Clipping Agencies in 2026, Compared",
  description:
    "How to compare clipping agencies on view verification, CPM transparency, case studies and minimum budget, with a side-by-side table.",
  alternates: { canonical: "/best-clipping-agencies" },
  robots: { index: false, follow: true },
};

const criteria = [
  { name: "View verification", body: "How views are counted per clip, and whether you can check them yourself during the campaign." },
  { name: "CPM transparency", body: "Whether the agency shows what 1,000 views cost before you commit, with real past numbers." },
  { name: "Case studies", body: "Named campaigns with views, CPM and outcomes, not just logos." },
  { name: "Minimum budget", body: "What it takes to start, and whether smaller tests are possible." },
  { name: "Model", body: "Managed campaigns with briefs and quality review, or an open bounty board you run yourself." },
];

type Row = { name: string; model: string; minimum: string; network: string; proof: string; verifiedOn: string };

// TODO: add competitors only after checking each claim on their own site; record the date in verifiedOn.
const rows: Row[] = [
  {
    name: facts.name,
    model: "Managed, pay per verified view",
    minimum: facts.minimumBudgetLabel,
    network: `${facts.clippersLabel} clippers`,
    proof: "Named case studies with views and CPM",
    verifiedOn: "2026-11-11",
  },
];

export default function BestClippingAgencies() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Compare agencies" }]}
        title="How to compare clipping agencies."
        lead={
          <p>
            Most rankings of clipping agencies are written by an agency that ranks itself first. This one shows its criteria, so you can check
            every row yourself.
          </p>
        }
      />
      <section className={`${SECTION} grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20`}>
        <div className="min-w-0">
          <SectionHead title="What to compare" />
        </div>
        <dl className="min-w-0 divide-y divide-line border-y border-line">
          {criteria.map((c) => (
            <div key={c.name} className="grid gap-2 py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8">
              <dt className="font-display font-semibold">{c.name}</dt>
              <dd className="leading-relaxed text-muted">{c.body}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className={`rv ${CONTAINER} pb-16`}>
        <SectionHead title="Side by side" />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line">
              <tr className="font-label text-[9px] tracking-[0.14em] text-muted uppercase">
                <th className="py-3 pr-5 font-normal">Agency</th>
                <th className="px-5 py-3 font-normal">Model</th>
                <th className="px-5 py-3 font-normal">Minimum</th>
                <th className="px-5 py-3 font-normal">Network</th>
                <th className="px-5 py-3 font-normal">Proof</th>
                <th className="py-3 pl-5 font-normal">Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className="py-4 pr-5 font-display font-semibold">{r.name}</td>
                  <td className="px-5 py-4 text-fg/85">{r.model}</td>
                  <td className="px-5 py-4 font-display font-semibold tabular-nums">{r.minimum}</td>
                  <td className="px-5 py-4 text-fg/85">{r.network}</td>
                  <td className="px-5 py-4 text-fg/85">{r.proof}</td>
                  <td className="py-4 pl-5 font-display font-semibold text-muted tabular-nums">{r.verifiedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Cta />
    </>
  );
}
