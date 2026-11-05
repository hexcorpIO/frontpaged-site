import type { Vertical } from "./types";

// Tiers copied from estate-law, the existing band with an $8,000 Domination
// tier; "bar-rule review" becomes compliance review. No performance claims or
// testimonials anywhere in this record, by instruction.
export const wealthManagement: Vertical = {
  slug: "wealth-management",
  name: "Wealth Management",
  nameSingular: "wealth management firm",
  clientNoun: "firm",
  audienceNoun: "clients",
  heroTagline: "Be the adviser AI names.",
  metaTitle: "Wealth Management & RIA SEO & AI Search",
  metaDescription:
    "SEO and Generative Engine Optimization for wealth management firms and RIAs — planning content reviewed against the SEC Marketing Rule and FINRA.",
  quickAnswer:
    "Wealth management SEO is the work of ranking a firm for the searches investors run before they move their money — \"fee-only financial advisor in Franklin TN,\" \"what does a fiduciary mean,\" \"how do advisers charge\" — and getting the firm named when someone asks an AI assistant who to trust. A single household relationship can last decades. Every piece of content is reviewed against the SEC Marketing Rule and FINRA rules before it publishes.",
  serviceType: "SEO & Generative Engine Optimization for wealth management firms",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 3000,
        for: "Solo advisers and small firms entering local planning search.",
        features: [
          "5 GEO/SEO articles / month",
          "2 service pages",
          "FAQ + schema markup",
          "6 Google Business posts",
          "Compliance review on every page",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 5000,
        featured: true,
        for: "Established firms covering planning, investment management, and tax together.",
        features: [
          "8 GEO/SEO articles / month",
          "4 service + client-situation pages",
          "FAQ + schema markup",
          "Retirement, tax, and life-event planning content",
          "8 Google Business posts",
          "Compliance review on every page",
          "3 old-page refreshes / month",
          "Monthly visibility report",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 8000,
        for: "Multi-adviser firms contesting an entire region.",
        features: [
          "14 GEO/SEO articles / month",
          "8 service + client-situation pages",
          "FAQ + schema markup",
          "Retirement, tax, and life-event planning content",
          "Local market and community targeting",
          "Adviser authority profiles",
          "12 Google Business posts",
          "Compliance review on every page",
          "5 old-page refreshes / month",
          "Monthly visibility report",
          "Weekly strategy access",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 12000,
  },
  faqs: [
    {
      q: "What do investors ask AI before choosing a financial adviser?",
      a: "Questions like \"fee-only financial advisor in Franklin TN,\" \"what's the difference between a fiduciary and a broker,\" \"how much does a financial advisor cost,\" and \"when should I hire a wealth manager.\" We build pages that answer them plainly, so the firm is the source an assistant cites.",
    },
    {
      q: "How do you keep content compliant with the SEC Marketing Rule and FINRA?",
      a: "Every page is reviewed against the SEC Marketing Rule and, for firms with registered representatives, FINRA Rule 2210 before it publishes, then routed through your chief compliance officer for approval. We keep records of what was published and when, so your books-and-records obligations are easier to meet.",
    },
    {
      q: "Will the content include performance figures or client testimonials?",
      a: "No. We do not publish performance claims, hypothetical returns, or testimonials in the content we write. The firm is built up through educational, planning-focused material and verifiable credentials instead, which is also what AI assistants prefer to cite.",
    },
    {
      q: "How do you describe credentials such as CFP or CFA?",
      a: "Exactly as the credentialing body permits, only for the individuals who hold them, and with links to public verification where available. We also make sure the firm's registration is described accurately and matches its record on the SEC's adviser search.",
    },
    {
      q: "Will you work with another wealth management firm in my market?",
      a: "No. One firm per market and client focus. Planning content depends on the firm's own philosophy and fee model, and two competing firms cannot share a voice.",
    },
    {
      q: "Why do public regulatory records matter for AI visibility?",
      a: "Because assistants and investors both check them. Search engines and AI systems treat the SEC's adviser search and FINRA BrokerCheck as authoritative, and a firm whose website agrees with those records on names, registrations, and locations is easier to trust and to cite.",
    },
  ],
  knowsAbout: [
    { name: "Wealth management", sameAs: "https://en.wikipedia.org/wiki/Wealth_management" },
    { name: "Registered investment adviser", sameAs: "https://en.wikipedia.org/wiki/Registered_investment_adviser" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "SEC Investment Adviser Public Disclosure", url: "https://adviserinfo.sec.gov/" },
    { label: "FINRA BrokerCheck", url: "https://brokercheck.finra.org/" },
    { label: "CFP Board — verify a CFP professional", url: "https://www.cfp.net/verify-a-cfp-professional" },
    { label: "NAPFA — fee-only advisers", url: "https://www.napfa.org/" },
  ],
  postTags: ["wealth-management", "GEO", "SEO", "Trust", "E-E-A-T"],
  glossaryTerms: ["generative-engine-optimization", "e-e-a-t", "ymyl", "entity"],
  compliance: {
    regime: "financial",
    summary:
      "Adviser marketing is governed by the SEC Marketing Rule (Rule 206(4)-1 under the Advisers Act) and, for firms with registered representatives, FINRA Rule 2210, along with any state securities rules that apply. All content is reviewed for compliance with the SEC Marketing Rule and FINRA before publishing, and routed through your chief compliance officer for approval.",
    weWillNot: [
      "Publish performance figures, hypothetical returns, or predictions of investment results",
      "Publish client testimonials or endorsements",
      "Describe the firm as a fiduciary, fee-only, or independent unless that is accurate for every client relationship described",
      "Use a professional designation for anyone who does not hold it",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: [
      "Content is for informational purposes only and is not investment, tax, or legal advice. Investing involves risk, including possible loss of principal.",
    ],
    sources: [
      { label: "17 CFR § 275.206(4)-1 — SEC Marketing Rule", url: "https://www.ecfr.gov/current/title-17/chapter-II/part-275/section-275.206(4)-1" },
      { label: "FINRA Rule 2210 — Communications with the Public", url: "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2210" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
