import { site, priceRange, founding, auditOffer } from "@/lib/site";
import { foundingPrice } from "@/lib/verticals/pricing";
import type { Vertical } from "@/lib/verticals/types";

// Structured data for the home page: a ProfessionalService (a LocalBusiness subtype)
// describing the agency, its nationwide service area, plans, and expertise — plus a WebSite
// node and an FAQPage. Rendered server-side so Google and AI engines can parse the
// business, where it operates, what it offers, and the Q&A directly.
//
// `vertical` supplies the tiers, enterprise floor, and FAQs shown on the homepage
// today (med spas). This mirrors the per-industry hub pages, which build the same
// Offer/FAQPage shape from `vertical.pricing` / `vertical.faqs` so the visible copy
// and the schema can never disagree.
export default function JsonLd({ vertical }: { vertical: Vertical }) {
  const lastTier = vertical.pricing.tiers[vertical.pricing.tiers.length - 1];

  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: site.name,
      url: site.url,
      email: site.email,
      telephone: "+1-615-905-1857",
      slogan: site.tagline,
      description: site.description,
      logo: `${site.url}/icon.svg`,
      image: `${site.url}/opengraph-image`,
      priceRange,
      sameAs: [site.linkedin, site.instagram],
      serviceType: vertical.serviceType,
      // Entity-linked rather than plain strings. A bare "Search engine optimization"
      // is a text label an engine has to resolve; a Thing with a Wikipedia sameAs
      // is an unambiguous reference to a known entity in the knowledge graph, which
      // is what lets a model connect this business to the topic with confidence.
      knowsAbout: [
        {
          "@type": "Thing",
          name: "Search engine optimization",
          sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization",
        },
        {
          "@type": "Thing",
          name: "Generative engine optimization",
          sameAs: "https://en.wikipedia.org/wiki/Generative_engine_optimization",
        },
        {
          "@type": "Thing",
          name: "Local search",
          sameAs: "https://en.wikipedia.org/wiki/Local_search_(Internet)",
        },
        {
          "@type": "Thing",
          name: "Medical spa",
          sameAs: "https://en.wikipedia.org/wiki/Medical_spa",
        },
        {
          "@type": "Thing",
          name: "Content marketing",
          sameAs: "https://en.wikipedia.org/wiki/Content_marketing",
        },
        {
          "@type": "Thing",
          name: "Large language model",
          sameAs: "https://en.wikipedia.org/wiki/Large_language_model",
        },
      ],
      // Remote, nationwide service-area business.
      areaServed: { "@type": "Country", name: "United States" },
      makesOffer: [
        // Schema must state the price a buyer actually pays today, so while the
        // founding programme is live these carry the founding rate.
        ...vertical.pricing.tiers.map((t) => {
          const price = founding.enabled ? foundingPrice(t.price) : t.price;
          return {
            "@type": "Offer",
            name: `${t.name} plan`,
            description: founding.enabled ? `${t.for} Founding client rate.` : t.for,
            price,
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price,
              priceCurrency: "USD",
              unitText: "MONTH",
            },
            category: t.features.join("; "),
            availability: "https://schema.org/InStock",
          };
        }),
        {
          "@type": "Offer",
          name: auditOffer.name,
          description: `${auditOffer.for} ${auditOffer.credit}`,
          price: auditOffer.price,
          priceCurrency: "USD",
          category: auditOffer.features.join("; "),
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          name: "Enterprise plan",
          description: `Multi-location ${vertical.name.toLowerCase()}, groups, and organizations scaling across markets.`,
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            minPrice: vertical.pricing.enterpriseFrom,
            priceCurrency: "USD",
            unitText: "MONTH",
          },
          category: `Everything in ${lastTier.name} — across every location`,
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
      mainEntity: vertical.faqs.map((f) => ({
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
