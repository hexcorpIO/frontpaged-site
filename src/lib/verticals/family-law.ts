import type { Vertical } from "./types";

// Tiers copied from plastic-surgery, the existing band with a $7,000
// Domination tier; features adapted to a law firm.
export const familyLaw: Vertical = {
  slug: "family-law",
  name: "Family & Divorce Law",
  nameSingular: "family law firm",
  clientNoun: "firm",
  audienceNoun: "clients",
  heroTagline: "Be the firm AI names first.",
  metaTitle: "Family & Divorce Law Firm SEO & AI Search",
  metaDescription:
    "SEO and Generative Engine Optimization for family and divorce law firms — custody, divorce, and support content written to your bar rules.",
  quickAnswer:
    "Family law SEO is the work of ranking a firm for the searches people run while a marriage or custody arrangement is coming apart — \"top divorce attorney near me,\" \"how is child custody decided in Tennessee,\" \"do I need a lawyer for an uncontested divorce\" — and getting named when someone asks an AI assistant who to call. One retained client is a matter that can run for months, and every published claim is governed by state bar advertising rules.",
  serviceType: "SEO & Generative Engine Optimization for family and divorce law firms",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 2500,
        for: "Solo and small firms building initial divorce and custody visibility.",
        features: [
          "5 GEO/SEO articles / month",
          "2 practice-area pages",
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
        for: "Established firms competing across divorce, custody, and support.",
        features: [
          "8 GEO/SEO articles / month",
          "3 practice-area pages",
          "FAQ + schema markup",
          "Certification & credential content, written to your bar's rules",
          "10 Google Business posts",
          "3 old-page refreshes / month",
          "Monthly visibility report",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 7000,
        for: "Multi-attorney or multi-office firms contesting a full metro.",
        features: [
          "12 GEO/SEO articles / month",
          "5 practice-area pages",
          "FAQ + schema markup",
          "County-court process content",
          "14 Google Business posts",
          "6 old-page refreshes / month",
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
      q: "What do people ask AI before hiring a divorce lawyer?",
      a: "Questions like \"how much does a divorce cost in Tennessee,\" \"how is custody decided,\" \"do I need a lawyer for an uncontested divorce,\" and \"top divorce attorney near me.\" We build pages that answer each one honestly for your state, so the firm is the source an assistant cites.",
    },
    {
      q: "How do you write about custody without predicting outcomes?",
      a: "By explaining how courts in your state approach the decision — the factors considered, the process, the timeline — rather than what a reader should expect. That is both the compliant approach and the one AI assistants are willing to quote.",
    },
    {
      q: "Can our content mention board certification in family law?",
      a: "Yes, where an attorney holds it and the certifying body is state-approved or ABA-accredited and named on the page, per ABA Model Rule 7.2(c) and your state's version. We keep certification, fellowships, and memberships as separate, accurately labeled facts.",
    },
    {
      q: "Do you write content for people who are only considering divorce?",
      a: "Yes, carefully. Early-stage readers want to understand the process, costs, and their options before committing to anything. Content that serves them without pressure reaches people long before they compare firms.",
    },
    {
      q: "Will you work with another family law firm in my market?",
      a: "No. One firm per practice area per market. Two firms chasing the same divorce and custody searches with the same content team would undercut both.",
    },
    {
      q: "How is family law SEO different from personal injury SEO?",
      a: "Personal injury intake is often urgent and contingency-based. Family law clients pay hourly or by retainer, research for longer, and care intensely about discretion and tone, so the content leads with process, cost, and calm explanation rather than urgency.",
    },
  ],
  knowsAbout: [
    { name: "Family law", sameAs: "https://en.wikipedia.org/wiki/Family_law" },
    { name: "Divorce", sameAs: "https://en.wikipedia.org/wiki/Divorce" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "Avvo", url: "https://www.avvo.com/" },
    { label: "Martindale-Hubbell", url: "https://www.martindale.com/" },
    { label: "American Academy of Matrimonial Lawyers (AAML)", url: "https://www.aaml.org/" },
  ],
  postTags: ["family-law", "GEO", "SEO", "Trust", "Local SEO"],
  glossaryTerms: ["generative-engine-optimization", "e-e-a-t", "ymyl", "local-citation"],
  compliance: {
    regime: "legal",
    summary:
      "Attorney advertising is governed by your state bar, built on the ABA Model Rules 7.1–7.3 prohibition on false or misleading communications and on solicitation — rules that carry real weight in family law, where readers are often in acute distress. We write to your jurisdiction's requirements and route every page through your firm for approval before it publishes.",
    weWillNot: [
      "Predict or imply the outcome of a divorce, custody, or support matter",
      "Describe a client's case or family in a way that could identify them",
      "State or imply that an attorney is a certified specialist unless the certifying organization is state-approved or ABA-accredited and is named on the page, per ABA Model Rule 7.2(c) and your state's version of it",
      "Write client testimonials in a form your state prohibits",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: [
      "Attorney advertising. Prior results do not guarantee a similar outcome.",
    ],
    sources: [
      { label: "ABA Model Rule 7.1 — Communications Concerning a Lawyer's Services", url: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_1_communication_concerning_a_lawyer_s_services/" },
      { label: "ABA Model Rule 7.2(c) — certification as a specialist", url: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_2_advertising/" },
      { label: "ABA Model Rule 7.3 — Solicitation of Clients", url: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_3_solicitation_of_clients/" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
