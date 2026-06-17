import { site, tiers, enterprise, faqs } from "@/lib/site";

// Structured data for the home page: a ProfessionalService (a LocalBusiness subtype)
// describing the agency, its nationwide service area, plans, and expertise — plus a WebSite
// node and an FAQPage. Rendered server-side so Google and AI engines can parse the
// business, where it operates, what it offers, and the Q&A directly.
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
      logo: `${site.url}/icon.svg`,
      image: `${site.url}/opengraph-image`,
      priceRange: site.priceRange,
      sameAs: [site.linkedin],
      serviceType:
        "SEO & Generative Engine Optimization (GEO) content for medical spas",
      knowsAbout: [
        "Search engine optimization",
        "Generative engine optimization",
        "Local SEO",
        "Google Business Profile optimization",
        "Medical spa marketing",
        "AI search visibility",
      ],
      // Remote, nationwide service-area business.
      areaServed: { "@type": "Country", name: "United States" },
      makesOffer: [
        ...tiers.map((t) => ({
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
        {
          "@type": "Offer",
          name: `${enterprise.name} plan`,
          description: enterprise.for,
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            minPrice: enterprise.priceFrom,
            priceCurrency: "USD",
            unitText: "MONTH",
          },
          category: enterprise.features.join("; "),
          availability: "https://schema.org/InStock",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": `${site.url}/#business` },
      inLanguage: "en-US",
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
