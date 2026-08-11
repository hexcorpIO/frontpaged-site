import { site, priceRange, auditOffer } from "@/lib/site";
import { getPublishedVerticals } from "@/lib/verticals";
import { bandRange } from "@/lib/verticals/pricing";
import type { Faq } from "@/lib/verticals/types";

// Structured data for the home page: a ProfessionalService (a LocalBusiness subtype)
// describing the agency, its nationwide service area, plans, and expertise — plus a WebSite
// node and an FAQPage. Rendered server-side so Google and AI engines can parse the
// business, where it operates, what it offers, and the Q&A directly.
//
// The homepage is category-neutral (it links out to /industries/ and /pricing/ for
// per-industry specifics), so this schema must be neutral too: `makesOffer` describes
// the sitewide price range rather than one vertical's three tiers, `serviceType` names
// no single industry, and `faqs` is the same neutral top-5 rendered by <Faq /> on this
// page — not any vertical's FAQ set. Per-vertical Service/Offer/FAQPage schema lives on
// each hub page instead (src/app/industries/[slug]/page.tsx), built from that vertical's
// own `pricing`/`faqs`, so the two can never disagree with each other.
//
// Cheapest founding rate to dearest list price across every published vertical — the
// same numbers `priceRange` (src/lib/site.ts) formats into "$1,125–$14,000/mo", kept
// here as raw numbers for the AggregateOffer's lowPrice/highPrice. Every band has
// exactly three tiers (enforced by tests/verticals.test.mjs), so offerCount is a
// structural constant, not a price — safe to derive without a stored field.
const publishedVerticals = getPublishedVerticals();
const ranges = publishedVerticals.map((v) => bandRange(v.pricing));
const lowPrice = Math.min(...ranges.map((r) => r.min));
const highPrice = Math.max(...ranges.map((r) => r.max));
const offerCount = publishedVerticals.length * 3;

export default function JsonLd({ faqs }: { faqs: Faq[] }) {
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
      serviceType: "SEO & Generative Engine Optimization content for high-ticket local service businesses",
      // Entity-linked rather than plain strings. A bare "Search engine optimization"
      // is a text label an engine has to resolve; a Thing with a Wikipedia sameAs
      // is an unambiguous reference to a known entity in the knowledge graph, which
      // is what lets a model connect this business to the topic with confidence.
      // Deliberately no single-vertical entity here (e.g. "Medical spa") — the
      // business now serves eight industries, and knowsAbout on this node must not
      // imply it specializes in only one of them.
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
        // One aggregate offer spanning every published vertical's band, rather
        // than one vertical's three Offer nodes — matches the visible homepage,
        // which shows a range and a link to /pricing/, not a fixed tier list.
        // lowPrice/highPrice already reflect founding rates the way bandRange()
        // computes them, so this can't disagree with the visible priceRange text.
        {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice,
          highPrice,
          offerCount,
          url: `${site.url}/pricing/`,
          description: `Monthly SEO & GEO retainers across ${publishedVerticals.length} industries — exact plans and pricing depend on your industry.`,
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          name: auditOffer.name,
          description: `${auditOffer.for} ${auditOffer.credit}`,
          price: auditOffer.price,
          priceCurrency: "USD",
          category: auditOffer.features.join("; "),
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
