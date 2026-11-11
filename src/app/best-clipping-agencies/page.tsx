import type { Metadata } from "next";
import { facts } from "@/content/facts";
import { Cta } from "@/components/cta";

// Kept out of search until every competitor row is checked against that
// agency's own site. A list that only names us is exactly the self-promotion
// this page is meant to beat.
export const metadata: Metadata = {
  title: "Best Clipping Agencies in 2026: How to Compare Them",
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
      <section className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6">
        <h1 className="text-5xl font-bold tracking-tight">How to compare clipping agencies</h1>
        <p className="mt-6 text-lg text-muted">
          Most rankings of clipping agencies are written by an agency that ranks itself first. This one shows its criteria, so
          you can check every row yourself.
        </p>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">What to compare</h2>
        <dl className="mt-6 space-y-4">
          {criteria.map((c) => (
            <div key={c.name} className="rounded-2xl border border-line p-5">
              <dt className="font-display font-semibold">{c.name}</dt>
              <dd className="mt-1 text-muted">{c.body}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Side by side</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-5 py-3 font-normal">Agency</th>
                <th className="px-5 py-3 font-normal">Model</th>
                <th className="px-5 py-3 font-normal">Minimum</th>
                <th className="px-5 py-3 font-normal">Network</th>
                <th className="px-5 py-3 font-normal">Proof</th>
                <th className="px-5 py-3 font-normal">Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3">{r.model}</td>
                  <td className="px-5 py-3 font-display font-semibold tabular-nums">{r.minimum}</td>
                  <td className="px-5 py-3">{r.network}</td>
                  <td className="px-5 py-3">{r.proof}</td>
                  <td className="px-5 py-3 font-display font-semibold tabular-nums text-muted">{r.verifiedOn}</td>
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
