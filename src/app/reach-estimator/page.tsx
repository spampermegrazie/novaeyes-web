import type { Metadata } from "next";
import { ReachEstimator } from "@/components/reach-estimator";

export const metadata: Metadata = {
  title: "Clipping Reach Estimator: Views for Your Budget",
  description:
    "Estimate how many short-form views a clipping campaign delivers for your budget, or what budget you need for a view target. Based on past NovaEyes campaigns.",
  alternates: { canonical: "/reach-estimator" },
};

export default function ReachEstimatorPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 pb-24 sm:px-6">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Estimate your reach</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Start from your budget or from the views you want. Pick your niche and get a range based on past campaigns.
      </p>
      <div className="mt-12">
        <ReachEstimator />
      </div>
    </section>
  );
}
