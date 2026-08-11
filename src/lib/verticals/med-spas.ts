import type { Vertical } from "./types";

export const medSpas: Vertical = {
  slug: "med-spas",
  name: "Med Spas",
  nameSingular: "med spa",
  clientNoun: "clinic",
  audienceNoun: "patients",
  heroTagline: "Be the first answer patients see.",
  metaTitle: "Med Spa SEO & AI Search Visibility",
  metaDescription:
    "Done-for-you SEO and Generative Engine Optimization for medical spas — content engineered to rank on Google and get cited by ChatGPT and AI Overviews.",
  quickAnswer:
    "Med spa SEO is the work of getting a clinic to appear when patients search for treatments like Botox, filler, or body contouring — and, increasingly, when they ask an AI assistant for a recommendation. It combines optimized service pages, treatment FAQs, schema markup, and Google Business Profile management, because AI engines and the local map pack draw on different signals and a clinic needs both.",
  serviceType: "SEO & Generative Engine Optimization for medical spas",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 1500,
        for: "Newer or single-location clinics getting found.",
        features: [
          "4 GEO/SEO articles / month",
          "1 optimized service page",
          "FAQ + schema markup",
          "4 Google Business posts",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 2750,
        featured: true,
        for: "Established clinics ready to own their market.",
        features: [
          "6 GEO/SEO articles / month",
          "2 optimized service pages",
          "FAQ + schema markup",
          "8 Google Business posts",
          "2 old-page refreshes / month",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 4000,
        for: "Multi-service or multi-location practices.",
        features: [
          "10 GEO/SEO articles / month",
          "3 optimized service pages",
          "Neighborhood-level targeting",
          "12 Google Business posts",
          "4 old-page refreshes / month",
          "60-min monthly strategy call",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 8000,
  },
  faqs: [
    {
      q: "How long until my med spa shows up in AI answers?",
      a: "Expect first movement in 60–90 days. AI engines re-crawl and re-rank on their own schedule, and citations tend to follow traditional ranking gains rather than lead them.",
    },
    {
      q: "Do you write about injectables and lasers accurately?",
      a: "Yes. Treatment content is written to reflect your providers' protocols and reviewed against manufacturer indications. We never claim outcomes a device or drug is not indicated for.",
    },
    {
      q: "Can you work with my existing website?",
      a: "Yes. We publish into whatever platform you already use, or hand you finished pages to publish yourself if you prefer to keep control of the CMS.",
    },
    {
      q: "How do you handle before-and-after photos?",
      a: "We advise on alt text, structured data, and page placement so the images support the page's ranking, and on the consent and disclosure practices that keep them compliant. We do not shoot or retouch them.",
    },
    {
      q: "Will you work with a competing med spa in my city?",
      a: "No. One clinic per market. That exclusivity is the reason the content can target the specific treatments and neighborhoods you compete in.",
    },
    {
      q: "What happens if I want to pause?",
      a: "Plans are month to month with no contract. Everything produced is yours and stays on your site if you stop.",
    },
  ],
  knowsAbout: [
    { name: "Medical spa", sameAs: "https://en.wikipedia.org/wiki/Medical_spa" },
    { name: "Botulinum toxin", sameAs: "https://en.wikipedia.org/wiki/Botulinum_toxin" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "RealSelf", url: "https://www.realself.com/" },
    { label: "Google Business Profile", url: "https://www.google.com/business/" },
    { label: "Yelp", url: "https://www.yelp.com/" },
  ],
  postTags: ["med-spa", "GEO", "SEO", "Local SEO", "Schema", "E-E-A-T", "Trust"],
  glossaryTerms: ["generative-engine-optimization", "ai-overviews", "map-pack", "schema-markup"],
  compliance: {
    regime: "medical",
    summary:
      "Aesthetic marketing sits under FTC truth-in-advertising rules, and device and drug claims are further constrained by their FDA-cleared indications. We write to those limits and route final copy through your medical director.",
    weWillNot: [
      "Promise a specific clinical outcome or a number of units",
      "Claim a device or drug does something outside its cleared indications",
      "Publish a patient photo or testimonial without your documented consent",
      "Describe a provider as board-certified in a specialty they do not hold",
    ],
    requiredDisclaimers: ["Individual results vary. Content is not medical advice."],
    sources: [
      { label: "FTC — Health Products Compliance Guidance", url: "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
