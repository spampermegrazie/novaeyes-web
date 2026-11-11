import { facts } from "@/content/facts";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: facts.name,
  url: facts.url,
  description: facts.oneLiner,
  foundingDate: String(facts.foundingYear),
  founder: { "@type": "Person", name: facts.founder },
  address: { "@type": "PostalAddress", addressLocality: "Ferrara", addressCountry: "IT" },
  ...(facts.sameAs.length ? { sameAs: facts.sameAs } : {}),
};

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${facts.url}${item.path}`,
    })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${facts.url}${path}`,
    provider: { "@type": "Organization", name: facts.name, url: facts.url },
    areaServed: "Worldwide",
  };
}
