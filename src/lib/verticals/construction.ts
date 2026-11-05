import type { Vertical } from "./types";

// Priced on its own band rather than copied from an existing vertical: no
// current Domination tier sits at $6,000. Tier shape follows the 5/8/12-article
// ladder of the $6,500-$7,000 bands.
export const construction: Vertical = {
  slug: "construction",
  name: "Construction",
  nameSingular: "construction company",
  clientNoun: "company",
  audienceNoun: "homeowners",
  heroTagline: "Be the builder AI recommends.",
  metaTitle: "Custom Builder & Remodeler SEO & AI Search",
  metaDescription:
    "SEO and Generative Engine Optimization for custom home builders and remodelers — project pages and licensing facts written to be cited by AI.",
  quickAnswer:
    "Construction SEO is the work of ranking a builder or remodeler for the searches homeowners run months before they call — \"best custom home builder in Nashville,\" \"how much does a kitchen remodel cost,\" \"is this contractor licensed\" — and getting named when someone asks an AI assistant who to trust with a project. One signed client is a project measured in months and often six figures, so the content has to earn trust before price ever comes up.",
  serviceType: "SEO & Generative Engine Optimization for custom home builders and remodelers",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 2250,
        for: "Single-crew builders and remodelers getting found in one market.",
        features: [
          "5 GEO/SEO articles / month",
          "2 optimized service pages",
          "FAQ + schema markup",
          "6 Google Business posts",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 3750,
        featured: true,
        for: "Established companies competing for custom builds and major remodels.",
        features: [
          "8 GEO/SEO articles / month",
          "3 optimized service pages",
          "FAQ + schema markup",
          "Completed-project write-ups & schema",
          "10 Google Business posts",
          "3 old-page refreshes / month",
          "Monthly visibility report",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 6000,
        for: "Multi-crew or multi-county builders contesting a full metro.",
        features: [
          "12 GEO/SEO articles / month",
          "5 optimized service pages",
          "FAQ + schema markup",
          "Cost & timeline guides for your market",
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
      q: "What do homeowners actually ask AI before hiring a builder?",
      a: "Questions like \"best custom home builder in Nashville,\" \"how long does a home addition take,\" \"what should a remodel contract include,\" and \"is this contractor licensed and insured.\" We build pages that answer each one directly, so your company is the source an assistant quotes when it explains the answer.",
    },
    {
      q: "Can you publish cost information without locking us into a price?",
      a: "Yes. We write cost guides as honest ranges with the factors that move a project within them — size, finishes, site conditions, permitting — never as quotes. Homeowners arrive better qualified, and a range with reasons is far more citable than a page that refuses to discuss money.",
    },
    {
      q: "Do you write about our completed projects?",
      a: "At the Authority tier and above, yes — project write-ups built from what you actually did: scope, timeline, the problem solved, and photos you have rights to. We never invent a project, a result, or a client quote, and nothing publishes without your sign-off.",
    },
    {
      q: "Does our contractor license number need to appear in the content?",
      a: "In many states, yes — several require a license number on advertising. We confirm your state's rule during onboarding and state your license and insurance plainly, because verifiable licensing is also one of the strongest trust signals a homeowner checks before calling.",
    },
    {
      q: "Will you work with another builder in my market?",
      a: "No. One construction company per service area and project type. Two builders competing for the same custom-home searches with content from the same team would undercut both.",
    },
    {
      q: "How is construction SEO different from a home-services marketing plan?",
      a: "Home-services marketing chases urgent, small-ticket jobs. Builders and remodelers sell considered, high-value projects with long research cycles, so the content is built around planning-stage questions, cost and timeline honesty, and proof of past work rather than same-day availability.",
    },
  ],
  knowsAbout: [
    { name: "General contractor", sameAs: "https://en.wikipedia.org/wiki/General_contractor" },
    { name: "Custom home", sameAs: "https://en.wikipedia.org/wiki/Custom_home" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "Houzz", url: "https://www.houzz.com/" },
    { label: "Better Business Bureau", url: "https://www.bbb.org/" },
    { label: "National Association of Home Builders (NAHB)", url: "https://www.nahb.org/" },
  ],
  postTags: ["construction", "GEO", "SEO", "Local SEO", "Trust"],
  glossaryTerms: ["generative-engine-optimization", "map-pack", "nap-consistency", "local-citation"],
  compliance: {
    regime: "construction",
    summary:
      "Contractor advertising sits under the FTC Act's prohibition on deceptive advertising, the FTC's rule against fake and incentivized-but-undisclosed reviews, and state contractor licensing law — several states require a license number on any advertisement. We write to those limits, state licensing and insurance only as you hold them, and route every page through you for approval before it publishes.",
    weWillNot: [
      "Quote a fixed price or completion date as a promise",
      "Describe a project, client, or result that did not happen as written",
      "Publish a homeowner's photo, address, or testimonial without documented consent",
      "Claim a license, bond, insurance level, or certification you do not hold",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: ["Project costs and timelines vary. Estimates are not quotes."],
    sources: [
      { label: "15 U.S.C. § 45 — FTC Act, unfair or deceptive acts or practices", url: "https://www.law.cornell.edu/uscode/text/15/45" },
      { label: "16 CFR Part 465 — Use of Consumer Reviews and Testimonials", url: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465" },
      { label: "California CSLB — an example of state contractor licensing rules", url: "https://www.cslb.ca.gov/Consumers/Hire_A_Contractor/" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
