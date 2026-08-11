import type { Vertical } from "./types";

export const realEstateTeams: Vertical = {
  slug: "real-estate-teams",
  name: "Real Estate Teams",
  nameSingular: "real estate team",
  clientNoun: "team",
  audienceNoun: "sellers",
  heroTagline: "Be the first team sellers are pointed to.",
  metaTitle: "Real Estate Team SEO & AI Search Visibility",
  metaDescription:
    "SEO and Generative Engine Optimization for real estate teams — neighborhood and listing content built to rank and get cited by AI, fair-housing safe.",
  quickAnswer:
    "Real estate team SEO is the work of ranking a team for the searches sellers and buyers run in a specific market — neighborhood guides, 'sell my house in [city]', agent comparisons — and getting the team named when someone asks an AI assistant which agent to list with locally. Every neighborhood and school-adjacent page is written under Fair Housing Act advertising rules, which most general real estate content ignores.",
  serviceType: "SEO & Generative Engine Optimization for real estate teams",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 1500,
        for: "Newer or single-market teams getting found locally.",
        features: [
          "4 GEO/SEO articles / month",
          "1 neighborhood-guide or listing page",
          "Fair-housing review on every page",
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
        for: "Established teams ready to own their market.",
        features: [
          "6 GEO/SEO articles / month",
          "2 neighborhood-guide or listing pages",
          "Fair-housing review on every page",
          "FAQ + schema markup",
          "Listing-cycle content for active inventory",
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
        for: "Multi-agent teams covering several submarkets.",
        features: [
          "10 GEO/SEO articles / month",
          "3 neighborhood-guide or listing pages",
          "Fair-housing review on every page",
          "FAQ + schema markup",
          "Listing-cycle content for active inventory",
          "Portal-syndication strategy across Zillow, Realtor.com & your MLS feed",
          "Agent authority profiles",
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
      q: "How do you write neighborhood content without violating fair housing rules?",
      a: "We describe neighborhoods using objective, verifiable facts — walkability, transit access, price trends, permitted commercial use — sourced with attribution, and never language that signals or implies who a neighborhood is or isn't for.",
    },
    {
      q: "Can you write about school districts?",
      a: "We can include objective, sourced facts — test-score data or ratings from a named, attributed source — but as a matter of our own editorial policy we don't write subjective characterizations like 'top-rated schools' or 'safe area.' What the Fair Housing Act does or doesn't require here has shifted with successive HUD guidance, so we hold a conservative line rather than chase the current interpretation.",
    },
    {
      q: "Do you write listing pages or only evergreen content?",
      a: "Both. Evergreen neighborhood and process pages carry the SEO weight over time; individual listing pages get lighter optimization for their active window and are built to be replaced quickly as inventory turns.",
    },
    {
      q: "How do you handle content for a team with agents licensed in different states?",
      a: "Each state's advertising and MLS rules get applied to that agent's pages specifically. We don't run one national template across agents who are subject to different local requirements.",
    },
    {
      q: "Will you work with a competing team in my market?",
      a: "No. One team per submarket, so the content can target the specific neighborhoods and listing types you actually work without splitting coverage with a competitor.",
    },
    {
      q: "How does MLS syndication affect what you optimize?",
      a: "Syndicated listing data on Zillow and Realtor.com is largely out of your control, which is why our content strategy focuses on the pages you do control — team and agent pages, neighborhood guides, and process content — rather than trying to out-optimize the portals.",
    },
  ],
  knowsAbout: [
    { name: "Real estate", sameAs: "https://en.wikipedia.org/wiki/Real_estate" },
    { name: "Fair Housing Act", sameAs: "https://en.wikipedia.org/wiki/Fair_Housing_Act" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "Zillow", url: "https://www.zillow.com/" },
    { label: "Realtor.com", url: "https://www.realtor.com/" },
    { label: "NAR — MLS & Online Listings", url: "https://www.nar.realtor/mls-online-listings" },
  ],
  postTags: ["real-estate", "GEO", "SEO", "Local SEO", "Schema"],
  glossaryTerms: ["generative-engine-optimization", "local-citation", "entity", "schema-markup"],
  compliance: {
    regime: "real-estate",
    summary:
      "Real estate advertising is governed by the Fair Housing Act. 42 U.S.C. § 3604(c) makes it unlawful to publish a notice, statement, or advertisement about the sale or rental of a dwelling that indicates a preference or limitation based on a protected class; courts applying that provision have read it as turning on how an ordinary reader would perceive the statement rather than on the writer's intent. Steering is reached separately: 24 C.F.R. § 100.70(a) makes it unlawful to restrict, based on a protected class (race, color, religion, sex, handicap, familial status, or national origin), a person's housing choices \"by word or conduct\" in a way that discourages or obstructs choices in a community or neighborhood — so what a page says about an area, not only how it says it, is in scope. Guidance on exactly where that second line falls has shifted across administrations, so beyond what the law itself requires we hold ourselves to additional editorial restraints as a matter of Frontpaged policy — not because a specific HUD document mandates them — and we route final copy through your team for approval before it publishes.",
    weWillNot: [
      "Describe a neighborhood in terms that indicate a preference or limitation based on a protected class (race, color, religion, sex, handicap, familial status, or national origin) — what 42 U.S.C. § 3604(c) reaches in a housing advertisement, and what 24 C.F.R. § 100.70(a) reaches where the words restrict a buyer's choices",
      "As our own editorial policy, use language that steers buyers or sellers toward or away from a particular area based on anything but the client's stated criteria",
      "As our own editorial policy, publish subjective claims about schools or \"safety\" — we'll cite objective, attributed data, but we don't characterize a school or neighborhood as good, bad, or safe",
      "Use stock photography or model selection intended to signal who a listing or neighborhood is 'for'",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: ["Equal Housing Opportunity."],
    sources: [
      { label: "42 U.S.C. § 3604(c) — Fair Housing Act, discriminatory notices and advertisements", url: "https://www.law.cornell.edu/uscode/text/42/3604" },
      { label: "24 C.F.R. § 100.75 — Discriminatory advertisements, notices, and statements", url: "https://www.law.cornell.edu/cfr/text/24/100.75" },
      { label: "24 C.F.R. § 100.70(a) — Other prohibited sale and rental conduct (steering)", url: "https://www.law.cornell.edu/cfr/text/24/100.70" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
