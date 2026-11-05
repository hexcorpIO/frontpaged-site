import type { Vertical } from "./types";

// Tiers copied from med-spas, the existing band with a $4,000 Domination tier.
export const interiorDesign: Vertical = {
  slug: "interior-design",
  name: "Interior Design",
  nameSingular: "interior design studio",
  clientNoun: "studio",
  audienceNoun: "clients",
  heroTagline: "Be the designer AI recommends.",
  metaTitle: "Interior Design Studio SEO & AI Search",
  metaDescription:
    "SEO and Generative Engine Optimization for interior design studios — process, pricing, and portfolio content written to be found and cited by AI.",
  quickAnswer:
    "Interior design SEO is the work of ranking a studio for the searches clients run before they reach out — \"interior designer near me,\" \"how much does a full-service interior designer cost,\" \"what's the difference between an interior designer and a decorator\" — and getting the studio named when someone asks an AI assistant who to hire. A full-home project is a long, high-trust engagement, so content has to explain the process and fees before a client will book a call.",
  serviceType: "SEO & Generative Engine Optimization for interior design studios",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 1500,
        for: "Newer or solo studios getting found in their market.",
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
        for: "Established studios ready to own their market.",
        features: [
          "6 GEO/SEO articles / month",
          "2 optimized service pages",
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
        price: 4000,
        for: "Multi-designer or multi-market studios.",
        features: [
          "10 GEO/SEO articles / month",
          "3 optimized service pages",
          "FAQ + schema markup",
          "Neighborhood-level targeting",
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
      q: "What do clients ask AI before hiring an interior designer?",
      a: "Questions like \"how much does a full-service interior designer cost,\" \"interior designer vs decorator,\" \"how long does it take to furnish a whole house,\" and \"best interior designer in Brentwood.\" We build pages that answer each one directly, so the studio is the source an assistant cites.",
    },
    {
      q: "Can you explain our fees without publishing a price list?",
      a: "Yes. We explain how the studio charges — flat design fee, hourly, percentage of project, or product markup — and what moves the total, without quoting a number. Clients who understand the model before the discovery call are far more likely to proceed.",
    },
    {
      q: "Our work is visual. Why does the site need more writing?",
      a: "Because search engines and AI assistants read text, not mood boards. A portfolio of images with no words around it is nearly invisible to them. We add short project write-ups and process pages that sit alongside the imagery rather than burying it.",
    },
    {
      q: "Some states regulate the title \"interior designer.\" How do you handle that?",
      a: "We use titles exactly as your state permits. Where a state restricts terms like \"registered\" or \"licensed interior designer,\" we only use them for staff who hold that status, and we state certifications such as NCIDQ only where they are actually held.",
    },
    {
      q: "Will you work with a competing design studio in my area?",
      a: "No. One studio per market. Design clients choose largely on style and trust, and two studios sharing a content team would end up sounding alike.",
    },
    {
      q: "Do you write about client homes?",
      a: "Only with documented consent, and only what the client has agreed to share. We leave out addresses and identifying details by default, because many design clients value privacy as much as the result.",
    },
  ],
  knowsAbout: [
    { name: "Interior design", sameAs: "https://en.wikipedia.org/wiki/Interior_design" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "Houzz", url: "https://www.houzz.com/" },
    { label: "American Society of Interior Designers (ASID)", url: "https://www.asid.org/" },
  ],
  postTags: ["interior-design", "GEO", "SEO", "Content", "Local SEO"],
  glossaryTerms: ["generative-engine-optimization", "google-business-profile", "search-intent", "local-citation"],
  compliance: {
    regime: "design",
    summary:
      "A number of states regulate interior design titles such as \"registered\" or \"licensed interior designer,\" and the FTC Act's prohibition on deceptive advertising covers what the studio says about its work, its pricing, and its reviews. We write to those limits and route every page through the studio for approval before it publishes.",
    weWillNot: [
      "Use a regulated title for anyone who does not hold it in your state",
      "Present another designer's or a vendor's work as the studio's own",
      "Publish a client's home, name, or testimonial without documented consent",
      "Promise a fixed budget or completion date",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: ["Project scope, fees, and timelines vary. Content is general information, not a proposal."],
    sources: [
      { label: "15 U.S.C. § 45 — FTC Act, unfair or deceptive acts or practices", url: "https://www.law.cornell.edu/uscode/text/15/45" },
      { label: "16 CFR Part 465 — Use of Consumer Reviews and Testimonials", url: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
