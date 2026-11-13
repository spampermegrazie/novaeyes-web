import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocation, locations } from "@/content/locations";
import { LocationPage } from "@/components/location-page";

// Location pages: /clipping-agency/united-states, /clipping-agency/germany, ...
// Unknown slugs fall through to notFound() below. /clipping-agency itself redirects to /solutions.
export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata(props: PageProps<"/clipping-agency/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const l = getLocation(slug);
  if (!l) return {};
  return {
    title: l.title,
    description: l.description,
    alternates: { canonical: `/clipping-agency/${l.slug}` },
  };
}

export default async function Page(props: PageProps<"/clipping-agency/[slug]">) {
  const { slug } = await props.params;
  const l = getLocation(slug);
  if (!l) notFound();
  return <LocationPage location={l} />;
}
