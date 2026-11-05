import type { Vertical } from "./types";

// Tiers copied from concierge-medicine, the existing band with a $6,500
// Domination tier. Medical regime, like every other patient-facing vertical.
export const cosmeticDentistry: Vertical = {
  slug: "cosmetic-dentistry",
  name: "Cosmetic & Implant Dentistry",
  nameSingular: "cosmetic dental practice",
  clientNoun: "practice",
  audienceNoun: "patients",
  heroTagline: "Be the dentist AI recommends.",
  metaTitle: "Cosmetic & Implant Dentistry SEO & AI Search",
  metaDescription:
    "SEO and Generative Engine Optimization for cosmetic and implant dental practices — treatment, cost, and credential content built to be cited by AI.",
  quickAnswer:
    "Cosmetic and implant dentistry SEO is the work of ranking a practice for the searches patients run before a major treatment decision — \"dental implants cost near me,\" \"veneers vs crowns,\" \"best cosmetic dentist in Nashville\" — and getting named when someone asks an AI assistant who to see. An implant or full-smile case is a considered, high-value decision, so the content has to explain options, costs, and credentials honestly before a patient books a consultation.",
  serviceType: "SEO & Generative Engine Optimization for cosmetic and implant dental practices",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 2500,
        for: "Single-dentist practices building their first treatment-led visibility.",
        features: [
          "5 GEO/SEO articles / month",
          "2 optimized treatment pages",
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
        for: "Established practices competing for implant and cosmetic cases.",
        features: [
          "8 GEO/SEO articles / month",
          "3 optimized treatment pages",
          "FAQ + schema markup",
          "Treatment-comparison & cost content",
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
        for: "Multi-dentist practices or groups contesting a full metro.",
        features: [
          "12 GEO/SEO articles / month",
          "5 optimized treatment pages",
          "FAQ + schema markup",
          "Dentist authority profiles",
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
      q: "What do patients ask AI before choosing a cosmetic or implant dentist?",
      a: "Questions like \"how much do dental implants cost,\" \"veneers vs crowns,\" \"am I a candidate for All-on-4,\" and \"best cosmetic dentist near me.\" We build pages that answer them honestly and in plain language, so the practice is the source an assistant quotes.",
    },
    {
      q: "Can you describe our dentists as implant or cosmetic specialists?",
      a: "Only in the terms your state dental board allows. Neither cosmetic nor implant dentistry is among the dental specialties recognized through the ADA's process, and many states restrict specialist claims. We state training, credentials, and case experience precisely instead.",
    },
    {
      q: "Will you publish implant and veneer pricing?",
      a: "We recommend honest ranges with what is included — consultation, imaging, surgery, restoration — and what moves a case within the range. Patients compare practices on cost, and a clear range is both more useful and more citable than a page that avoids the topic.",
    },
    {
      q: "How do you handle before-and-after smile photos?",
      a: "With documented patient consent for each use, accurate labeling of the treatment shown, and no retouching beyond consistent cropping and lighting. We strip image metadata before publishing so nothing identifying travels with the file.",
    },
    {
      q: "Will you work with another cosmetic dentist in my market?",
      a: "No. One practice per market. Implant and cosmetic cases are high-value and locally contested, and shared content coverage would work against both practices.",
    },
    {
      q: "How is cosmetic dentistry SEO different from general dental marketing?",
      a: "General dental marketing competes on convenience, insurance acceptance, and checkups. Cosmetic and implant work is elective, expensive, and researched for weeks, so the content is built around treatment comparisons, cost transparency, candidacy, and the dentist's own credentials.",
    },
  ],
  knowsAbout: [
    { name: "Cosmetic dentistry", sameAs: "https://en.wikipedia.org/wiki/Cosmetic_dentistry" },
    { name: "Dental implant", sameAs: "https://en.wikipedia.org/wiki/Dental_implant" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "American Academy of Cosmetic Dentistry (AACD)", url: "https://aacd.com/" },
    { label: "American Dental Association — Find-a-Dentist", url: "https://findadentist.ada.org/" },
  ],
  postTags: ["cosmetic-dentistry", "GEO", "SEO", "E-E-A-T", "Trust"],
  glossaryTerms: ["generative-engine-optimization", "e-e-a-t", "ymyl", "ai-citation"],
  compliance: {
    regime: "medical",
    summary:
      "Dental advertising sits under the FTC Act's prohibition on deceptive advertising, your state dental board's advertising and specialty-claim rules, and the ADA Code of Ethics. Any claim about a product or device is limited to what FDA actually authorized for it. We write to those limits and route final copy through the treating dentist for approval before it publishes.",
    weWillNot: [
      "Promise a cosmetic result, implant longevity, or a pain-free procedure",
      "Describe a dentist as a specialist in terms your state dental board prohibits",
      "Publish a patient photo or testimonial without documented consent",
      "Claim a device or material does something outside the indications FDA cleared or approved it for",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: ["Individual results vary. Content is not medical or dental advice."],
    sources: [
      { label: "15 U.S.C. § 45 — FTC Act, unfair or deceptive acts or practices", url: "https://www.law.cornell.edu/uscode/text/15/45" },
      { label: "ADA Principles of Ethics & Code of Professional Conduct", url: "https://www.ada.org/about/principles/code-of-ethics" },
      { label: "FDA — Is It Really \"FDA Approved\"?", url: "https://www.fda.gov/consumers/consumer-updates/it-really-fda-approved" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
