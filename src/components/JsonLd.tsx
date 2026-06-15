import { site, tiers, faqs } from "@/lib/site";

// Structured data: a ProfessionalService describing the agency (with its plans as
// offers) plus an FAQPage. Rendered server-side into a <script type="application/ld+json">
// so Google and AI engines can parse the business, services, and Q&A directly.
export default function JsonLd() {
  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: site.name,
      url: site.url,
      email: site.email,
      slogan: site.tagline,
      description: site.description,
      areaServed: { "@type": "City", name: site.areaServed },
      serviceType: "SEO & Generative Engine Optimization (GEO) content for medical spas",
      makesOffer: tiers.map((t) => ({
        "@type": "Offer",
        name: `${t.name} plan`,
        description: t.for,
        price: t.price,
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: t.price,
          priceCurrency: "USD",
          unitText: "MONTH",
        },
        category: t.features.join("; "),
        availability: "https://schema.org/InStock",
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const json = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      // Schema is built from trusted local constants, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
