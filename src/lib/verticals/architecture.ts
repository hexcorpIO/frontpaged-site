import type { Vertical } from "./types";

// Priced on its own band rather than copied from an existing vertical: no
// current Domination tier sits at $5,000. Tier shape follows the 4/6/10-article
// ladder of the nearest band, dermatology.
export const architecture: Vertical = {
  slug: "architecture",
  name: "Architecture",
  nameSingular: "architecture firm",
  clientNoun: "firm",
  audienceNoun: "clients",
  heroTagline: "Be the firm AI puts on the shortlist.",
  metaTitle: "Architecture Firm SEO & AI Search Visibility",
  metaDescription:
    "SEO and Generative Engine Optimization for residential and commercial architecture firms — portfolio and process content built to be cited by AI.",
  quickAnswer:
    "Architecture SEO is the work of ranking a firm for the searches clients run when a project is still an idea — \"residential architect near me,\" \"do I need an architect for an addition,\" \"how do architects charge\" — and getting the firm named when someone asks an AI assistant who designs this kind of building in their city. A single commission can occupy a firm for a year or more, so being on the shortlist early matters more than volume.",
  serviceType: "SEO & Generative Engine Optimization for architecture firms",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 1900,
        for: "Small studios and sole practitioners getting found for their core work.",
        features: [
          "4 GEO/SEO articles / month",
          "2 optimized service or project-type pages",
          "FAQ + schema markup",
          "6 Google Business posts",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 3100,
        featured: true,
        for: "Established firms building a reputation in a project type or region.",
        features: [
          "6 GEO/SEO articles / month",
          "3 optimized service or project-type pages",
          "FAQ + schema markup",
          "8 Google Business posts",
          "2 old-page refreshes / month",
          "Monthly visibility report",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 5000,
        for: "Multi-principal firms competing across project types or markets.",
        features: [
          "10 GEO/SEO articles / month",
          "4 optimized service or project-type pages",
          "FAQ + schema markup",
          "Portfolio project write-ups & schema",
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
      q: "What do prospective clients ask AI before hiring an architect?",
      a: "Questions like \"do I need an architect or a designer for a home addition,\" \"how do architects charge for a custom home,\" \"what happens in schematic design,\" and \"best residential architect in Franklin TN.\" We build pages that answer those plainly, so the firm is the source an assistant cites when it explains them.",
    },
    {
      q: "Can a portfolio site rank, or does it need written content?",
      a: "It needs words. Image-led portfolios are beautiful and close to invisible to search engines and AI assistants, which read text. We add concise project write-ups and process pages alongside the imagery, without turning the site into a blog that fights the design.",
    },
    {
      q: "How do you handle fee questions when every project is scoped differently?",
      a: "We explain how the firm charges — percentage of construction cost, fixed fee, or hourly — and what drives the number, without publishing a quote. Clients who understand the fee structure before the first meeting are better prepared and easier to convert.",
    },
    {
      q: "Can you write about the firm's work without overstating credentials?",
      a: "Yes. The title \"architect\" is regulated by state licensing boards, so we name licensed architects precisely, separate them from designers on staff, and only mention affiliations such as AIA membership or NCARB certification where they are actually held.",
    },
    {
      q: "Will you work with another architecture firm in my area?",
      a: "No. One firm per market and project type. Two firms courting the same commissions with content from the same team would weaken both.",
    },
    {
      q: "How long before an architecture firm sees results?",
      a: "Local and project-type searches usually move first, often within a few months. Being named by AI assistants for broader questions takes longer, because it depends on third-party sources such as directories and press agreeing with what the firm's own site says.",
    },
  ],
  knowsAbout: [
    { name: "Architect", sameAs: "https://en.wikipedia.org/wiki/Architect" },
    { name: "Architecture firm", sameAs: "https://en.wikipedia.org/wiki/Architecture_firm" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "American Institute of Architects (AIA)", url: "https://www.aia.org/" },
    { label: "Houzz", url: "https://www.houzz.com/" },
    { label: "NCARB", url: "https://www.ncarb.org/" },
  ],
  postTags: ["architecture", "GEO", "SEO", "Content", "Trust"],
  glossaryTerms: ["generative-engine-optimization", "entity", "topical-authority", "local-citation"],
  compliance: {
    regime: "design",
    summary:
      "Use of the title \"architect\" is restricted by state licensing law to people who hold a license, and the FTC Act's prohibition on deceptive advertising covers everything else the firm says about its work. We write to those limits, credit project roles accurately, and route every page through a licensed principal for approval before it publishes.",
    weWillNot: [
      "Call anyone an architect who is not licensed in the relevant state",
      "Present a collaborator's or previous employer's project as solely the firm's own",
      "Publish a client's name, address, or home photographs without documented consent",
      "Claim an award, certification, or membership the firm does not hold",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: ["Project scope, fees, and timelines vary. Content is general information, not a proposal."],
    sources: [
      { label: "NCARB — architect licensing", url: "https://www.ncarb.org/get-licensed" },
      { label: "15 U.S.C. § 45 — FTC Act, unfair or deceptive acts or practices", url: "https://www.law.cornell.edu/uscode/text/15/45" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
