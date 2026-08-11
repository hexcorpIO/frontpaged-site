import type { Vertical } from "./types";

export const dermatology: Vertical = {
  slug: "dermatology",
  name: "Dermatology",
  nameSingular: "dermatology practice",
  clientNoun: "practice",
  audienceNoun: "patients",
  heroTagline: "Be the dermatologist patients are pointed to.",
  metaTitle: "Dermatology SEO & AI Search Visibility",
  metaDescription:
    "Done-for-you SEO and Generative Engine Optimization for dermatology practices — condition and cosmetic pages built to rank on Google and get cited by AI.",
  quickAnswer:
    "Dermatology SEO is the work of ranking a practice for two very different searches at once — medical queries like 'is this mole dangerous' and cosmetic queries like 'best acne scar treatment' — and getting recommended when a patient asks an AI assistant either kind of question. It requires condition-specific pages, insurance clarity, and cosmetic-service pages built and governed under different content standards.",
  serviceType: "SEO & Generative Engine Optimization for dermatology practices",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 2000,
        for: "Newer or single-location practices getting found for core conditions.",
        features: [
          "4 GEO/SEO articles / month",
          "2 optimized condition or service pages",
          "FAQ + schema markup",
          "6 Google Business posts",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 3500,
        featured: true,
        for: "Established practices covering medical and cosmetic dermatology.",
        features: [
          "6 GEO/SEO articles / month",
          "3 optimized condition or service pages",
          "FAQ + schema markup",
          "8 Google Business posts",
          "2 old-page refreshes / month",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 5500,
        for: "Multi-provider or multi-location practices.",
        features: [
          "10 GEO/SEO articles / month",
          "4 optimized condition or service pages",
          "Insurance-vs-cosmetic content split & schema",
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
      q: "Do you write differently for medical and cosmetic dermatology?",
      a: "Yes. Medical content is written to explain a condition and when to seek care, without diagnosing; cosmetic content is written to convert on a specific treatment. AI engines and search treat the two intents differently, and the pages need to reflect that.",
    },
    {
      q: "Can you write about skin cancer and biopsy content responsibly?",
      a: "Yes, with the same YMYL discipline we apply to any high-stakes medical topic — no diagnostic claims, clear guidance to seek an in-person evaluation, and review by your clinical staff before anything publishes.",
    },
    {
      q: "How do you handle content about insurance-covered vs. self-pay services?",
      a: "We write the distinction explicitly on the page, because it's one of the most common sources of patient confusion and one of the clearest signals AI engines look for when answering a coverage question.",
    },
    {
      q: "Do you cover both adult and pediatric dermatology?",
      a: "We can, if your practice sees both. Pediatric content is written and reviewed more conservatively given the audience, consistent with our general approach to YMYL topics.",
    },
    {
      q: "Will you work with a competing dermatology practice in my area?",
      a: "No. One practice per market, so the content can target the specific conditions and treatments you actually offer without splitting coverage with a competitor.",
    },
    {
      q: "How do you keep condition pages accurate over time?",
      a: "Guidance on skin conditions and treatments updates periodically. Refreshed plans include scheduled reviews so pages don't quietly go stale on claims or terminology.",
    },
  ],
  knowsAbout: [
    { name: "Dermatology", sameAs: "https://en.wikipedia.org/wiki/Dermatology" },
    { name: "Skin condition", sameAs: "https://en.wikipedia.org/wiki/Skin_condition" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "American Academy of Dermatology — Find a Dermatologist", url: "https://find-a-derm.aad.org/" },
    { label: "Healthgrades", url: "https://www.healthgrades.com/" },
  ],
  postTags: ["dermatology", "GEO", "SEO", "Local SEO", "Schema", "E-E-A-T"],
  glossaryTerms: ["generative-engine-optimization", "ymyl", "e-e-a-t", "content-refresh"],
  compliance: {
    regime: "medical",
    summary:
      "Dermatology marketing spans both YMYL medical content and FTC-governed cosmetic advertising, plus device and drug claims limited to their FDA-cleared indications. We write to those limits and route final copy through your medical director.",
    weWillNot: [
      "State or imply a diagnosis from a description or photo of a skin condition",
      "Claim a device or drug does something outside its cleared indications",
      "Publish a patient photo or testimonial without your documented consent",
      "Describe a provider as board-certified in a specialty they do not hold",
    ],
    requiredDisclaimers: ["Individual results vary. Content is not medical advice."],
    sources: [
      { label: "FTC — Health Products Compliance Guidance", url: "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
