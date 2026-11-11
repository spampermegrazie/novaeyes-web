import { estimate, formatCompact, formatRange, formatUsd, type EstimateInput } from "@/lib/estimator";

// Lead capture for the reach estimator.
// Storage: a `leads` table in the existing Supabase / Lovable Cloud database,
// written through the REST API with the service role key (server only).
// Email: Resend. Both are configured through Vercel environment variables.

type Body = {
  email?: string;
  company?: string;
  newsletter?: boolean;
  website?: string; // honeypot
  source?: string;
  input?: EstimateInput;
  attribution?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field. Pretend success so they learn nothing.
  if (body.website) return Response.json({ ok: true });

  const email = body.email?.trim().toLowerCase() ?? "";
  const company = body.company?.trim() ?? "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (!company || company.length > 200) {
    return Response.json({ error: "Enter your company or artist name." }, { status: 400 });
  }

  let result;
  try {
    if (!body.input) throw new Error("missing input");
    result = estimate(body.input);
  } catch {
    return Response.json({ error: "Invalid estimate input." }, { status: 400 });
  }

  const lead = {
    email,
    company,
    newsletter_consent: body.newsletter === true,
    source: body.source ?? "reach-estimator",
    stage: "estimate_requested",
    estimate_input: body.input,
    estimate_result: {
      views: result.views,
      budget_usd: result.budgetUsd,
      cpm_usd: result.cpmUsd,
      clips: result.clips,
      niche: result.niche.id,
    },
    attribution: body.attribution ?? {},
  };

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[leads] storage not configured, lead not saved:", lead);
      return Response.json({ ok: true, stored: false });
    }
    // In production a lead must never be silently dropped.
    return Response.json({ error: "We could not save your request. Email us instead." }, { status: 503 });
  }

  const insert = await fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
  });

  if (!insert.ok) {
    console.error("[leads] insert failed", insert.status, await insert.text());
    return Response.json({ error: "We could not save your request. Email us instead." }, { status: 502 });
  }

  // The estimate email answers the lead's own request, so it goes out now.
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM_EMAIL;
  if (resendKey && from) {
    const headline =
      result.mode === "budget"
        ? `${formatRange(result.views, formatCompact)} estimated views for ${formatUsd(result.budgetUsd.low)}`
        : `${formatRange(result.budgetUsd, formatUsd)} estimated budget for ${formatCompact(result.views.low)} views`;
    const bookUrl = `https://nova-eyes.com/book`;
    const text = [
      `Here is your NovaEyes reach estimate for ${company}.`,
      "",
      headline,
      `Niche: ${result.niche.label}`,
      `CPM range: ${formatRange(result.cpmUsd, formatUsd)}`,
      `Estimated clips: ${formatRange(result.clips, (n) => n.toLocaleString("en-US"))}`,
      "",
      "Based on ranges from past campaigns, not a guarantee.",
      "",
      `Want the exact plan? Book a 15-minute reach audit: ${bookUrl}`,
    ].join("\n");

    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: email, subject: "Your NovaEyes reach estimate", text }),
    });
    if (!sent.ok) console.error("[leads] estimate email failed", sent.status, await sent.text());
  }

  return Response.json({ ok: true, stored: true });
}
