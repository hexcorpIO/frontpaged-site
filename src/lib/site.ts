// Single source of truth for brand facts and repeated copy.
// Consumed by section components AND the JSON-LD schema so the two never drift.

export const site = {
  name: "Frontpaged",
  domain: "frontpaged.io",
  url: "https://frontpaged.io",
  tagline: "Be the first answer patients see.",
  email: "hello@frontpaged.io",
  phone: "(615) 905-1857",
  phoneHref: "tel:+16159051857",
  linkedin: "https://www.linkedin.com/company/frontpaged-io/",
  instagram: "https://www.instagram.com/frontpaged_io/",
  calendly: "https://calendly.com/benton-frontpaged/30min",
  areaServed: "the United States",
  priceRange: "$1,500–$4,000/mo",
  description:
    "Frontpaged helps medical spas get found first on Google and cited by AI search " +
    "(ChatGPT, Perplexity, Google AI Overviews). Done-for-you SEO + GEO content that " +
    "ranks and books consultations — for medical spas nationwide.",
} as const;

// Founding-client program: the first `slots` clients get a locked rate in exchange
// for documented results and case-study rights. Flip `enabled` to false once the
// slots are gone — the pricing cards, the pricing page, and the Offer schema all
// read from here, so one edit retires the whole offer everywhere.
export const founding = {
  enabled: true,
  slots: 5,
  headline: "Founding client rate — first 5 clinics",
  terms:
    "25% off any plan, locked for 12 months, in exchange for documented before-and-after results and permission to write it up as a case study.",
} as const;

// Deliberately not a rankings promise — no honest agency can make one. This is
// scoped to something we control and can verify.
export const guarantee =
  "If you're not cited by at least one AI engine for a target question within 90 days, month four is free.";

// Paid entry product. The full fee is credited toward the first month, so starting
// a plan makes the audit free in hindsight.
export const auditOffer = {
  name: "AI Visibility Audit",
  price: 500,
  for: "A one-time deep audit. See exactly where you stand before committing to anything.",
  features: [
    "Your clinic tested across ChatGPT, Perplexity & Google",
    "The competitors being cited instead of you",
    "Page-by-page gap analysis of your site",
    "A prioritized 90-day plan",
  ],
  credit: "Credited in full toward month one if you start within 30 days.",
  cta: "Start with the audit",
} as const;

export type Tier = {
  name: string;
  price: number; // USD per month
  foundingPrice: number; // locked rate for the first `founding.slots` clients
  annualPrice: number; // prepaid year — ten months' fee for twelve months of work
  featured?: boolean;
  for: string;
  features: string[];
  cta: string;
};

export const tiers: Tier[] = [
  {
    name: "Visibility",
    price: 1500,
    foundingPrice: 1125,
    annualPrice: 15000,
    for: "Newer or single-location clinics getting found.",
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
    foundingPrice: 2060,
    annualPrice: 27500,
    featured: true,
    for: "Established clinics ready to own their market.",
    features: [
      "6 GEO/SEO articles / month",
      "2 optimized service pages",
      "FAQ + schema markup",
      "8 Google Business posts",
      "2 old-page refreshes / month",
      "30-min monthly strategy call",
    ],
    cta: "Choose Authority",
  },
  {
    name: "Domination",
    price: 4000,
    foundingPrice: 3000,
    annualPrice: 40000,
    for: "Multi-service or multi-location practices.",
    features: [
      "10 GEO/SEO articles / month",
      "3 optimized service pages",
      "Neighborhood-level targeting",
      "12 Google Business posts",
      "4 old-page refreshes / month",
      "60-min monthly strategy call",
    ],
    cta: "Choose Domination",
  },
];

// Custom, sales-led tier for multi-location groups / DSOs (shown as a separate band).
export const enterprise = {
  name: "Enterprise",
  priceFrom: 8000,
  for: "Multi-location groups, DSOs, and practices scaling across markets.",
  features: [
    "Everything in Domination — across every location",
    "Per-location service pages & neighborhood targeting",
    "A dedicated strategist + quarterly growth roadmap",
    "Consolidated, per-location reporting",
    "Priority content turnaround",
  ],
  cta: "Book a strategy call",
} as const;

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: 'What exactly is "AI-search visibility"?',
    a: "It's whether your clinic shows up when patients ask AI tools (ChatGPT, Perplexity, Google's AI Overviews) for recommendations. We structure your content so those engines recognize and cite you — alongside ranking you on traditional Google.",
  },
  {
    q: "How is this different from regular SEO?",
    a: "It includes SEO, but adds Generative Engine Optimization (GEO): formatting content so AI can extract and quote it, building FAQ schema, and tracking AI citations. Most SEO providers aren't doing this yet — it's where the gap (and opportunity) is.",
  },
  {
    q: "How fast will I see results?",
    a: "SEO and GEO compound. Expect first movement in 60–90 days and growing momentum after that. That's why we focus on consistent monthly content rather than one-off projects.",
  },
  {
    q: "Do I have to write or post anything?",
    a: "No. It's fully done-for-you. You approve a simple monthly plan; we produce, optimize, and (if you'd like) publish everything for you.",
  },
  {
    q: "Is the content medically responsible?",
    a: "Yes. Everything is written to reflect your providers' expertise and is reviewed for accuracy. We never make medical guarantees or claims that create liability.",
  },
];

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
