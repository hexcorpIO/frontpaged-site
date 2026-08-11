import type { Vertical } from "./types";

export const estateLaw: Vertical = {
  slug: "estate-law",
  name: "Estate & Elder Law",
  nameSingular: "estate law firm",
  clientNoun: "firm",
  audienceNoun: "families",
  heroTagline: "Be the first answer families see.",
  metaTitle: "Estate & Elder Law Firm SEO & AI Search",
  metaDescription:
    "SEO and Generative Engine Optimization for estate and elder law firms — probate and guardianship pages written to your bar rules and cited by AI.",
  quickAnswer:
    "Estate and elder law SEO is the work of ranking a firm for the searches families run at difficult moments — probate, guardianship, Medicaid planning — and getting the firm named when someone asks an AI assistant which attorney handles a parent's estate. The searches are emotionally loaded and long-considered rather than urgent, and every published claim is governed by state bar advertising rules the same way personal injury content is.",
  serviceType: "SEO & Generative Engine Optimization for estate and elder law firms",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 3000,
        for: "Solo and small firms entering probate and estate planning search.",
        features: [
          "5 GEO/SEO articles / month",
          "2 practice-area pages",
          "FAQ + schema markup",
          "6 Google Business posts",
          "Bar-rule review on every page",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 5000,
        featured: true,
        for: "Established firms covering estate planning, probate, and elder law together.",
        features: [
          "8 GEO/SEO articles / month",
          "4 practice-area + county probate-court pages",
          "Guardianship & Medicaid-planning content, bar-compliant",
          "8 Google Business posts",
          "3 old-page refreshes / month",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 8000,
        for: "Multi-attorney firms contesting an entire state.",
        features: [
          "14 GEO/SEO articles / month",
          "8 practice-area + county probate-court pages",
          "County-level probate-venue targeting",
          "Attorney authority profiles",
          "12 Google Business posts",
          "5 old-page refreshes / month",
          "Weekly strategy access",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 12000,
  },
  faqs: [
    {
      q: "Do you write about probate and Medicaid planning without giving legal advice?",
      a: "We write to the ABA Model Rule 7.1 framework and to your state's variations, describing how a process generally works rather than what a specific family should do. Final copy always goes to your firm for approval before it publishes.",
    },
    {
      q: "Can you build pages for each county's probate court?",
      a: "From the Authority plan up, yes. Probate procedure varies by county in most states, and that variation is exactly what families search for and what AI engines quote when someone asks about filing in a specific jurisdiction.",
    },
    {
      q: "How do you handle content about guardianship and conservatorship?",
      a: "The same way we handle any sensitive family-law topic — accurate general process information, no outcome predictions, and language reviewed for your state's specific terminology and procedure.",
    },
    {
      q: "Does estate planning content differ from elder law content?",
      a: "Yes. Estate planning content targets people planning ahead — wills, trusts, powers of attorney. Elder law content targets families already in crisis — Medicaid, guardianship, long-term care. We write and structure the two paths separately because the searcher's state of mind is different.",
    },
    {
      q: "Which directories matter most for an estate law firm's AI visibility?",
      a: "NAELA membership and your state bar listing carry particular weight in this category, alongside the general legal directories. We align your profiles with your site so engines see one consistent entity.",
    },
    {
      q: "Will you take a competing estate or elder law firm in my market?",
      a: "No. One firm per practice area per market, for the same reason we hold that line everywhere: the content has to name the counties and case types you actually handle.",
    },
  ],
  knowsAbout: [
    { name: "Estate planning", sameAs: "https://en.wikipedia.org/wiki/Estate_planning" },
    { name: "Elder law (United States)", sameAs: "https://en.wikipedia.org/wiki/Elder_law_(United_States)" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "National Academy of Elder Law Attorneys (NAELA)", url: "https://www.naela.org/" },
    { label: "American Bar Association — state & local bar associations", url: "https://www.americanbar.org/groups/bar_services/resources/state_local_bar_associations/" },
    { label: "Avvo", url: "https://www.avvo.com/" },
  ],
  postTags: ["estate-law", "elder-law", "GEO", "SEO", "Local SEO"],
  glossaryTerms: ["generative-engine-optimization", "e-e-a-t", "entity", "local-citation"],
  compliance: {
    regime: "legal",
    summary:
      "Attorney advertising is governed by your state bar, built on the ABA Model Rules 7.1–7.3 prohibition on false or misleading communications. We write to your jurisdiction's requirements and route every page through your firm for approval before it publishes.",
    weWillNot: [
      "Predict or imply the outcome of a probate, guardianship, or Medicaid-planning matter",
      "Suggest that a specific estate plan avoids estate tax or eliminates probate without stating that outcomes depend on the family's individual facts",
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
