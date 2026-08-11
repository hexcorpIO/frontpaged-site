import type { Vertical } from "./types";

export const conciergeMedicine: Vertical = {
  slug: "concierge-medicine",
  name: "Concierge Medicine",
  nameSingular: "concierge practice",
  clientNoun: "practice",
  audienceNoun: "members",
  heroTagline: "Be the practice AI recommends.",
  metaTitle: "Concierge Medicine SEO & AI Search Visibility",
  metaDescription:
    "Done-for-you SEO and Generative Engine Optimization for concierge medicine practices — membership-focused content built to rank and get cited by AI.",
  quickAnswer:
    "Concierge medicine SEO is the work of ranking a practice for the searches prospective members actually run — membership fees, same-day access, executive physicals — and getting named when someone asks an AI assistant whether concierge care is worth the cost in their city. The content has to sell a membership model, not a single visit, which is a different funnel than any other medical vertical we serve.",
  serviceType: "SEO & Generative Engine Optimization for concierge medicine practices",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 2500,
        for: "Newer concierge practices building their first membership funnel.",
        features: [
          "5 GEO/SEO articles / month",
          "2 optimized membership pages",
          "FAQ + schema markup",
          "6 Google Business posts",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 4500,
        featured: true,
        for: "Established practices filling their remaining member panel.",
        features: [
          "8 GEO/SEO articles / month",
          "3 optimized membership pages",
          "FAQ + schema markup",
          "Referring-physician & executive-health content",
          "10 Google Business posts",
          "3 old-page refreshes / month",
          "Monthly visibility report",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 6500,
        for: "Multi-physician practices at or near panel capacity.",
        features: [
          "12 GEO/SEO articles / month",
          "5 optimized membership pages",
          "FAQ + schema markup",
          "Physician authority profiles",
          "14 Google Business posts",
          "5 old-page refreshes / month",
          "Monthly visibility report",
          "60-min monthly strategy call",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 10000,
  },
  faqs: [
    {
      q: "Do you understand how to write for a membership model instead of a single visit?",
      a: "Yes. Concierge content has to justify a recurring fee against a specific set of benefits — same-day access, longer visits, direct physician contact — rather than convert a one-time booking, and the pages are structured around that comparison.",
    },
    {
      q: "Can you write content aimed at referring physicians as well as prospective members?",
      a: "Yes, at the Authority tier and above. A meaningful share of concierge enrollment comes through physician referrals, so we build pages that speak to that audience specifically, separate from consumer-facing membership pages.",
    },
    {
      q: "How do you handle content once our panel is full?",
      a: "We shift the plan toward retention and referral content, and toward positioning for a waitlist or a second physician, rather than continuing to spend budget on acquisition pages you no longer need.",
    },
    {
      q: "Do you write about what's included in a membership versus what still requires insurance?",
      a: "Yes, explicitly. It's the single most common point of confusion for prospective members, and being precise about it is also what AI engines look for when answering a cost-comparison question.",
    },
    {
      q: "Will you work with a competing concierge practice in my market?",
      a: "No. One practice per market. Concierge panels are capacity-limited already, and shared content coverage would work against both practices.",
    },
    {
      q: "How is concierge SEO different from a wellness clinic plan?",
      a: "Wellness content sells a protocol; concierge content sells ongoing access to a physician. The keyword universe, the comparison content, and the objections a page has to answer are all different, which is why the plans aren't interchangeable.",
    },
  ],
  knowsAbout: [
    { name: "Concierge medicine", sameAs: "https://en.wikipedia.org/wiki/Concierge_medicine" },
    { name: "Direct primary care", sameAs: "https://en.wikipedia.org/wiki/Direct_primary_care" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "Castle Connolly", url: "https://www.castleconnolly.com/" },
    { label: "MDVIP — concierge medicine network", url: "https://www.mdvip.com/" },
  ],
  postTags: ["concierge-medicine", "GEO", "SEO", "E-E-A-T", "Trust"],
  glossaryTerms: ["generative-engine-optimization", "e-e-a-t", "entity", "ai-citation"],
  compliance: {
    regime: "medical",
    summary:
      "Concierge marketing sits under the FTC Act's prohibition on deceptive advertising, which reaches an advertised membership as squarely as it reaches a product. Any clinical claim about what membership includes is further limited to what FDA actually authorized for the product involved — cleared for a 510(k) device, approved for a PMA device, drug, or biologic — plus your specialty's advertising norms. We write to those limits and route final copy through your medical director.",
    weWillNot: [
      "Promise a specific health outcome from membership",
      "Claim a device, drug, or diagnostic offered as a member benefit does something outside the indications FDA cleared or approved it for",
      "Publish a member photo or testimonial without documented consent",
      "Describe a physician as board-certified in a specialty they do not hold",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: ["Individual results vary. Content is not medical advice."],
    sources: [
      { label: "15 U.S.C. § 45 — FTC Act, unfair or deceptive acts or practices", url: "https://www.law.cornell.edu/uscode/text/15/45" },
      { label: "FTC — Advertising FAQ's: A Guide for Small Business", url: "https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business" },
      { label: "FTC — Health Products Compliance Guidance", url: "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance" },
      { label: "FDA — Is It Really \"FDA Approved\"?", url: "https://www.fda.gov/consumers/consumer-updates/it-really-fda-approved" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
