"use client";

import Cal from "@calcom/embed-react";
import { useMemo, useSyncExternalStore } from "react";
import { getAttribution } from "@/lib/attribution";

// Cal event link, e.g. "novaeyes/reach-audit". Set in Vercel env.
const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "";

type Prefill = {
  email?: string;
  company?: string;
  niche?: string;
  budget?: string;
  estimate?: string;
};

/*
  Booking questions to create in the Cal event (Advanced tab), with these identifiers:
    how-found      Dropdown, required: Google, ChatGPT or another AI tool, X, Instagram or TikTok,
                   LinkedIn, Referral, Podcast or press, Other
    promote        Short text, required
    budget         Dropdown, required: Under $3k, $3-10k, $10-25k, $25k+
    company        Short text, hidden, prefilled
    landing-page   Short text, hidden, prefilled
    estimate       Short text, hidden, prefilled
  utm_source, utm_medium, utm_campaign, utm_term and utm_content are captured by Cal automatically.
*/
const noopSubscribe = () => () => {};

export function BookCall({ prefill = {} }: { prefill?: Prefill }) {
  // Attribution lives in browser storage, so the embed config is built on the client only.
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const config = useMemo(() => {
    if (!isClient) return null;
    const attr = getAttribution();
    const c: Record<string, string> = { theme: "dark", layout: "month_view" };
    if (prefill.email) c.email = prefill.email;
    if (prefill.company) c.company = prefill.company;
    if (prefill.estimate) c.estimate = prefill.estimate;
    if (attr.landing_page) c["landing-page"] = attr.landing_page;
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const) {
      if (attr[k]) c[k] = attr[k] as string;
    }
    return c;
  }, [isClient, prefill.email, prefill.company, prefill.estimate]);

  if (!CAL_LINK) {
    return (
      <p className="rounded-2xl border border-line p-6 text-sm text-muted">
        Booking is not configured. Set NEXT_PUBLIC_CAL_LINK.
      </p>
    );
  }

  if (!config) return <div className="h-[640px] rounded-2xl border border-line" aria-busy="true" />;

  return (
    <Cal
      calLink={CAL_LINK}
      config={config}
      style={{ width: "100%", minHeight: 640, overflow: "auto" }}
    />
  );
}
