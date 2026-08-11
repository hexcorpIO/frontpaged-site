// Single source of truth for brand facts and repeated copy.
// Consumed by section components AND the JSON-LD schema so the two never drift.
//
// Pricing itself (tiers, enterprise floors, FAQs) now lives per-industry in
// src/lib/verticals/*.ts — this file only carries facts that are true of the
// business regardless of which of the eight verticals a page is about.

import { getPublishedVerticals } from "./verticals";
import { sitePriceRange } from "./verticals/pricing";

export const site = {
  name: "Frontpaged",
  domain: "frontpaged.io",
  url: "https://frontpaged.io",
  tagline: "Be the first name AI recommends.",
  email: "hello@frontpaged.io",
  phone: "(615) 905-1857",
  phoneHref: "tel:+16159051857",
  linkedin: "https://www.linkedin.com/company/frontpaged-io/",
  instagram: "https://www.instagram.com/frontpaged_io/",
  calendly: "https://calendly.com/benton-frontpaged/30min",
  areaServed: "the United States",
  description:
    "Frontpaged gets high-ticket local businesses found on Google and cited by " +
    "AI search (ChatGPT, Perplexity, Google AI Overviews). Done-for-you SEO + GEO " +
    "content for medical, legal, and premium service practices nationwide.",
} as const;

// Sitewide priceRange for the Organization schema, spanning the
// cheapest founding rate to the dearest list price across every published vertical.
// Computed rather than hand-copied so it can never drift from the per-vertical Offer
// schema the way the old hardcoded "$1,500–$4,000/mo" string did (that string quoted
// list prices while makesOffer quoted founding rates — the same document contradicting
// itself). See src/lib/verticals/pricing.ts for the formula.
export const priceRange = sitePriceRange(getPublishedVerticals());

// Founding-client program: the first `slotsPerVertical` clients of EACH industry get a
// locked rate in exchange for documented results and case-study rights. Flip `enabled`
// to false once the slots are gone — the pricing cards, the pricing page, and the Offer
// schema all read from here, so one edit retires the whole offer everywhere. Neutral
// wording on purpose: "clients," not "clinics" — the business now serves law firms and
// real estate teams too, not only medical practices.
export const founding = {
  enabled: true,
  slotsPerVertical: 5,
  headline: "Founding client rate",
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
    "Your business tested across ChatGPT, Perplexity & Google",
    "The competitors being cited instead of you",
    "Page-by-page gap analysis of your site",
    "A prioritized 90-day plan",
  ],
  credit: "Credited in full toward month one if you start within 30 days.",
  cta: "Start with the audit",
} as const;

// Named authorship is the largest remaining E-E-A-T gap on this site. Content
// attributed to a company reads weaker than content attributed to a person, and
// AI engines weight author attribution heavily on health-adjacent topics — which
// is precisely the argument our own E-E-A-T article makes.
//
// Fill `name` in and it flows automatically to the About page bio, the Person
// node in the schema graph, and the blog bylines. Left blank, all three fall
// back to organization-level attribution and nothing renders half-finished.
export const founder = {
  name: "",
  role: "Founder",
  /** Two or three sentences, first person. Background, why med spas, what you did before. */
  bio: "",
  /** e.g. ["10 years in search marketing", "Google Analytics certified"] */
  credentials: [] as string[],
  linkedin: "",
} as const;

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
