import type { Vertical } from "./types";

export const plasticSurgery: Vertical = {
  slug: "plastic-surgery",
  name: "Plastic Surgery",
  nameSingular: "plastic surgery practice",
  clientNoun: "practice",
  audienceNoun: "patients",
  heroTagline: "Be the surgeon AI names first.",
  metaTitle: "Plastic Surgery SEO & AI Search Visibility",
  metaDescription:
    "Done-for-you SEO and Generative Engine Optimization for plastic surgery practices — procedure and credential content built to rank and get cited by AI.",
  quickAnswer:
    "Plastic surgery SEO is the work of ranking a practice for the procedures patients actually search — rhinoplasty, breast augmentation, tummy tuck — and getting the surgeon named when someone asks an AI assistant who to consult. It leans harder on credentials than most medical categories, because board certification is the single fact patients and AI engines both use to separate a qualified surgeon from an unqualified one.",
  serviceType: "SEO & Generative Engine Optimization for plastic surgery practices",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 2500,
        for: "Single-surgeon practices building initial procedure visibility.",
        features: [
          "5 GEO/SEO articles / month",
          "2 optimized procedure pages",
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
        for: "Established practices competing across procedures and neighborhoods.",
        features: [
          "8 GEO/SEO articles / month",
          "3 optimized procedure pages",
          "Board-certification & credential content",
          "10 Google Business posts",
          "3 old-page refreshes / month",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 7000,
        for: "Multi-surgeon or multi-location practices contesting a full metro.",
        features: [
          "12 GEO/SEO articles / month",
          "5 optimized procedure pages",
          "Before-and-after content strategy & schema",
          "14 Google Business posts",
          "6 old-page refreshes / month",
          "60-min monthly strategy call",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 10000,
  },
  faqs: [
    {
      q: "How do you handle board-certification claims?",
      a: "We state the specific board a surgeon holds — American Board of Plastic Surgery or otherwise — and never let 'board-certified' stand alone when the board isn't ABPS. Patients and AI engines both treat that distinction as the deciding credential.",
    },
    {
      q: "Can you build a page for every procedure we offer?",
      a: "Yes, phased by search volume and margin. We prioritize the procedures that drive consult volume first, then expand into secondary and combination procedures as budget allows.",
    },
    {
      q: "Do you write for both cosmetic and reconstructive patients?",
      a: "Yes. The two audiences search differently — cosmetic patients research aesthetics and cost, reconstructive patients research insurance coverage and recovery — and we write separate content paths for each.",
    },
    {
      q: "How do you use before-and-after content without overpromising results?",
      a: "We write case-specific context around each image — technique, timeline, the qualifier that results vary by anatomy — rather than generic outcome claims, and we never publish an image without your documented consent.",
    },
    {
      q: "Will you work with a competing surgeon in my metro?",
      a: "No. One practice per metro, which is what lets the content name the specific procedures and neighborhoods you compete for without diluting either surgeon's coverage.",
    },
    {
      q: "How is this different from a general med spa SEO plan?",
      a: "Surgical content carries a higher evidentiary bar — outcomes, credentials, and informed-consent language all get more scrutiny from both readers and AI engines than injectable or laser content does, so the plans carry more page and credential work per dollar.",
    },
  ],
  knowsAbout: [
    { name: "Plastic surgery", sameAs: "https://en.wikipedia.org/wiki/Plastic_surgery" },
    { name: "Board certification", sameAs: "https://en.wikipedia.org/wiki/Board_certification" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "RealSelf", url: "https://www.realself.com/" },
    { label: "American Society of Plastic Surgeons", url: "https://www.plasticsurgery.org/" },
    { label: "American Board of Plastic Surgery", url: "https://www.abplasticsurgery.org/" },
  ],
  postTags: ["plastic-surgery", "GEO", "SEO", "Local SEO", "Schema", "E-E-A-T", "Trust"],
  glossaryTerms: ["generative-engine-optimization", "e-e-a-t", "ymyl", "schema-markup"],
  compliance: {
    regime: "medical",
    summary:
      "Aesthetic and reconstructive marketing sits under FTC truth-in-advertising rules, and device claims are further constrained by their FDA-cleared indications. We write to those limits and route final copy through your medical director.",
    weWillNot: [
      "Promise a specific clinical outcome or a number of units",
      "Claim a device or drug does something outside its cleared indications",
      "Publish a patient photo or testimonial without your documented consent",
      "Describe a surgeon as board-certified without stating the certifying board, or imply ABPS certification when the board is a non-ABPS one",
    ],
    requiredDisclaimers: ["Individual results vary. Content is not medical advice."],
    sources: [
      { label: "FTC — Health Products Compliance Guidance", url: "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
