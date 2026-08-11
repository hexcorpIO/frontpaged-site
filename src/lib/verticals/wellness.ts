import type { Vertical } from "./types";

export const wellness: Vertical = {
  slug: "wellness",
  name: "Wellness & Longevity",
  nameSingular: "wellness clinic",
  clientNoun: "clinic",
  audienceNoun: "patients",
  heroTagline: "Be the clinic AI sends them to.",
  metaTitle: "Wellness & Longevity Clinic SEO & AI Search",
  metaDescription:
    "Done-for-you SEO and Generative Engine Optimization for wellness and longevity clinics — content engineered to rank and get cited by AI.",
  quickAnswer:
    "Wellness clinic SEO is the work of getting a longevity, hormone, or IV therapy clinic to appear when patients search for a specific protocol — and when they ask an AI assistant whether that protocol is worth trying. The category is younger and less standardized than most medical fields, which makes clear, well-sourced content the main way a clinic separates itself from unregulated competitors online.",
  serviceType: "SEO & Generative Engine Optimization for wellness and longevity clinics",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 1500,
        for: "Newer or single-location clinics getting found.",
        features: [
          "4 GEO/SEO articles / month",
          "1 optimized protocol page (hormone, IV, or longevity)",
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
          "2 optimized protocol pages",
          "FAQ + schema markup",
          "Evidence-sourced claim review for hormone, IV & longevity content",
          "8 Google Business posts",
          "2 old-page refreshes / month",
          "Monthly visibility report",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 4000,
        for: "Multi-service or multi-location clinics.",
        features: [
          "10 GEO/SEO articles / month",
          "3 optimized protocol pages",
          "FAQ + schema markup",
          "Evidence-sourced claim review for hormone, IV & longevity content",
          "Consult-funnel content across every protocol line",
          "Practitioner authority profiles",
          "12 Google Business posts",
          "4 old-page refreshes / month",
          "Monthly visibility report",
          "60-min monthly strategy call",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 8000,
  },
  faqs: [
    {
      q: "Do you write about hormone and IV therapies accurately?",
      a: "Yes, and conservatively. Claims are limited to what FDA cleared or approved the specific product for, or published clinical evidence where no such authorization exists, with the gaps stated plainly rather than implied away.",
    },
    {
      q: "How do you handle claims about longevity outcomes?",
      a: "We avoid promising a lifespan or biological-age result from any single protocol, since the evidence base for most longevity interventions is still developing. Content frames benefits as what current research supports, not guarantees.",
    },
    {
      q: "Can you cover fertility-adjacent services like peptide or hormone optimization?",
      a: "Yes, written to the same standard as our other YMYL medical content — no outcome promises, no claims beyond what the specific protocol is indicated for, and review by your clinical staff before anything publishes.",
    },
    {
      q: "This category has a lot of unregulated competitors online. How does that affect the content?",
      a: "It's an advantage if you use it: sourced, hedged, physician-reviewed content stands out sharply against the overstated claims common in this space, and both search engines and AI systems reward that contrast.",
    },
    {
      q: "Will you work with a competing wellness clinic in my market?",
      a: "No. One clinic per market, for the same reason we hold that line everywhere — the content needs to target the specific protocols and neighborhoods you compete in without splitting coverage.",
    },
    {
      q: "What happens if a protocol we offer loses its evidence base or gets pulled?",
      a: "We update or remove the affected page as part of your plan's refresh allocation. Outdated protocol claims are a liability we treat as urgent, not routine maintenance.",
    },
  ],
  knowsAbout: [
    { name: "Wellness (alternative medicine)", sameAs: "https://en.wikipedia.org/wiki/Wellness_(alternative_medicine)" },
    { name: "Longevity", sameAs: "https://en.wikipedia.org/wiki/Longevity" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "Zocdoc", url: "https://www.zocdoc.com/" },
    { label: "Center for Connected Health Policy — state telehealth policy", url: "https://www.cchpca.org/" },
  ],
  postTags: ["wellness", "longevity", "GEO", "SEO", "Local SEO", "Trust"],
  glossaryTerms: ["generative-engine-optimization", "ymyl", "e-e-a-t", "ai-citation"],
  compliance: {
    regime: "medical",
    summary:
      "Wellness and longevity marketing sits under the FTC Act's prohibition on deceptive advertising, which reaches an advertised protocol as squarely as it reaches a product. Device and drug claims are further limited to what FDA actually authorized — 510(k) devices are cleared, PMA devices, drugs, and biologics are approved. Dietary supplements are a different case entirely: under DSHEA, FDA does not approve supplements before they are marketed, so a supplement has no FDA-authorized indication to point at and every claim made for one has to rest on scientific substantiation the clinic itself holds. We write to those limits and route final copy through your medical director.",
    weWillNot: [
      "Promise a specific clinical outcome, lifespan extension, or biological-age result",
      "Claim a device or drug does something outside the indications FDA cleared or approved it for, or blur which of the two a product actually holds",
      "Describe a dietary supplement as FDA-approved or FDA-cleared — FDA does not approve supplements before marketing — or make a claim for one that your own substantiation does not support",
      "Publish a patient photo or testimonial without your documented consent",
      "Present a hormone, IV, or fertility-adjacent protocol as more evidence-backed than the current clinical literature supports",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: ["Individual results vary. Content is not medical advice."],
    sources: [
      { label: "15 U.S.C. § 45 — FTC Act, unfair or deceptive acts or practices", url: "https://www.law.cornell.edu/uscode/text/15/45" },
      { label: "FTC — Advertising FAQ's: A Guide for Small Business", url: "https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business" },
      { label: "FTC — Health Products Compliance Guidance", url: "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance" },
      { label: "FDA — Is It Really \"FDA Approved\"?", url: "https://www.fda.gov/consumers/consumer-updates/it-really-fda-approved" },
      { label: "FDA — Questions and Answers on Dietary Supplements", url: "https://www.fda.gov/food/information-consumers-using-dietary-supplements/questions-and-answers-dietary-supplements" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
