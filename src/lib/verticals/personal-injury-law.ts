import type { Vertical } from "./types";

export const personalInjuryLaw: Vertical = {
  slug: "personal-injury-law",
  name: "Personal Injury Law",
  nameSingular: "personal injury firm",
  clientNoun: "firm",
  audienceNoun: "clients",
  heroTagline: "Be the first firm injured clients are told about.",
  metaTitle: "Personal Injury Law Firm SEO & AI Search",
  metaDescription:
    "SEO and Generative Engine Optimization for personal injury firms — practice-area and venue pages written to your state bar rules and cited by AI.",
  quickAnswer:
    "Personal injury SEO is the work of ranking a firm for the searches injured people actually run — accident type, injury, and venue — and getting the firm named when someone asks an AI assistant which lawyer to call. It differs from most local SEO in two ways: the searches are high-intent and fiercely contested, and every published claim is governed by state bar advertising rules.",
  serviceType: "SEO & Generative Engine Optimization for personal injury law firms",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 5000,
        for: "Single-attorney and boutique firms entering a contested market.",
        features: [
          "8 GEO/SEO articles / month",
          "3 practice-area pages",
          "FAQ + schema markup",
          "8 Google Business posts",
          "Bar-rule review on every page",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 8500,
        featured: true,
        for: "Established firms competing across a metro.",
        features: [
          "12 GEO/SEO articles / month",
          "6 practice-area + venue pages",
          "Case-result content, bar-compliant",
          "8 Google Business posts",
          "Review generation within bar rules",
          "4 old-page refreshes / month",
          "60-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 14000,
        for: "Multi-office firms contesting an entire state.",
        features: [
          "20 GEO/SEO articles / month",
          "12 practice-area + venue pages",
          "County-level venue targeting",
          "Attorney authority profiles",
          "16 Google Business posts",
          "8 old-page refreshes / month",
          "Weekly strategy access",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 20000,
  },
  faqs: [
    {
      q: "Do you understand attorney advertising rules?",
      a: "We write to the ABA Model Rules 7.1–7.3 framework and to your state's variations, including past-result disclaimers and restrictions on specialization claims. Final copy always goes to your firm for approval — we support your compliance, we do not certify it.",
    },
    {
      q: "Can you publish case results?",
      a: "In most states, yes, with the disclaimer your jurisdiction requires and without implying a comparable outcome. Some states impose extra conditions, so we confirm the rule for your bar before the first result goes live.",
    },
    {
      q: "How competitive is personal injury search really?",
      a: "It is among the most contested categories in local search, which is why the plans carry far more content volume than our other verticals. Expect a longer runway than a less contested market.",
    },
    {
      q: "Do you build venue pages for each county?",
      a: "From the Authority plan up, yes. Venue and practice-area pages are the backbone of PI search, and they are also what AI engines quote when someone asks about filing in a specific jurisdiction.",
    },
    {
      q: "Which directories affect whether AI recommends my firm?",
      a: "Avvo, Justia, Super Lawyers, and Martindale-Hubbell are the sources these engines lean on most in legal queries. We align your profiles with your site so the engines see one consistent entity.",
    },
    {
      q: "Will you take a competing firm in my market?",
      a: "No. One firm per practice area per market, for the same reason we hold that line everywhere: the content has to name the venues and case types you actually contest.",
    },
  ],
  knowsAbout: [
    { name: "Personal injury", sameAs: "https://en.wikipedia.org/wiki/Personal_injury" },
    { name: "Legal advertising", sameAs: "https://en.wikipedia.org/wiki/Legal_advertising" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "Avvo", url: "https://www.avvo.com/" },
    { label: "Justia", url: "https://www.justia.com/" },
    { label: "Super Lawyers", url: "https://www.superlawyers.com/" },
    { label: "Martindale-Hubbell", url: "https://www.martindale.com/" },
  ],
  postTags: ["legal", "GEO", "SEO", "Local SEO"],
  glossaryTerms: ["generative-engine-optimization", "ai-overview", "map-pack", "entity"],
  compliance: {
    regime: "legal",
    summary:
      "Attorney advertising is governed by your state bar, built on the ABA Model Rules 7.1–7.3 prohibition on false or misleading communications. We write to your jurisdiction's requirements and route every page through your firm for approval before it publishes.",
    weWillNot: [
      "Promise, predict, or imply a case outcome",
      "Publish a past result without your jurisdiction's required disclaimer",
      "Describe an attorney as a specialist or expert where the bar restricts it",
      "Write client testimonials in a form your state prohibits",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: [
      "Attorney advertising. Prior results do not guarantee a similar outcome.",
    ],
    sources: [
      { label: "ABA Model Rule 7.1 — Communications Concerning a Lawyer's Services", url: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_1_communication_concerning_a_lawyer_s_services/" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
