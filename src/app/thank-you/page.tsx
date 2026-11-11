import type { Metadata } from "next";
import Link from "next/link";

// Cal redirects here after a booking (same path as the live site).
export const metadata: Metadata = {
  title: "Thank You",
  description: "Thanks for booking a call with NovaEyes. We will be in touch shortly.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: true },
};

export default function ThankYou() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-32 pb-32 text-center sm:px-6">
      <h1 className="text-5xl font-semibold tracking-tight">You are booked.</h1>
      <p className="mt-6 text-lg text-muted">
        A calendar invite is on its way. Bring the content you want to push, and we will come with a view estimate and a
        campaign outline.
      </p>
      <Link href="/case-studies" className="mt-10 inline-block rounded-full border border-line px-6 py-3 text-sm hover:border-muted/50">
        See what we have delivered
      </Link>
    </section>
  );
}
