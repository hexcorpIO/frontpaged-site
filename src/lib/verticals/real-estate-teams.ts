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
          "1 optimized neighborhood or listing page",
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
          "2 optimized neighborhood or listing pages",
          "Fair-housing review on every page",
          "8 Google Business posts",
          "2 old-page refreshes / month",
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
          "3 optimized neighborhood or listing pages",
          "Agent authority profiles",
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
      q: "How do you write neighborhood content without violating fair housing rules?",
      a: "We describe neighborhoods using objective, verifiable facts — walkability, transit access, price trends, permitted commercial use — sourced with attribution, and never language that signals or implies who a neighborhood is or isn't for.",
    },
    {
      q: "Can you write about school districts?",
      a: "We link to a neutral, independent, attributed source for school data rather than characterizing schools ourselves. HUD guidance treats subjective school or safety framing as a steering risk, so we don't write it, even when a client asks for it.",
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
      "Real estate advertising is governed by the Fair Housing Act, which prohibits discriminatory statements and steering regardless of intent. We write to HUD's advertising guidance and route final copy through your team for approval before it publishes.",
    weWillNot: [
      "Describe a neighborhood in terms that signal a protected class (race, color, religion, sex, national origin, familial status, or disability)",
      "Use language that steers buyers or sellers toward or away from a particular area",
      "Publish claims about schools or \"safety\" that function as proxies for a protected characteristic",
      "Use stock photography or model selection intended to signal who a listing or neighborhood is 'for'",
    ],
    requiredDisclaimers: ["Equal Housing Opportunity."],
    sources: [
      { label: "HUD FHEO — Guidance on Application of the Fair Housing Act to the Advertising of Housing, Credit, and Other Real Estate-Related Transactions through Digital Platforms", url: "https://archives.hud.gov/news/2024/FHEO_Guidance_on_Advertising_through_Digital_Platforms.pdf" },
      { label: "HUD — Dear Colleague Letter on Neighborhood Crime Data and School Quality", url: "https://www.hud.gov/sites/default/files/hudclips/documents/AS-Trainor's-DCL-on-Neighborhood-Crime-Data-and-School-Quality.pdf" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
