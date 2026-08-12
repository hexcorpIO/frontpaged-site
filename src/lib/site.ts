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
  // Third-party form endpoint. A static export has no server, so the browser POSTs
  // straight to the provider and they email us the submission — no JavaScript and
  // no backend involved.
  //
  // TO ACTIVATE: create a form at formspree.io (or basin/splitforms — the markup is
  // identical) and paste its endpoint URL here. Until this is filled in, the form
  // renders as a mailto fallback rather than a broken POST, so it is safe to deploy
  // empty. Configure the provider to redirect to https://frontpaged.io/contact/thank-you/
  // on success so the visitor stays on our site and the conversion is trackable.
  formEndpoint: "https://formspree.io/f/mppadnvo",
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
// A vague guarantee reads as an escape hatch, which is worse than no guarantee.
// "Target question" is therefore defined rather than left to interpretation: the
// list is agreed in writing in month one, capped at ten, and fixed for the term.
// Both sides can check the outcome, which is the only kind of promise worth making.
export const guarantee =
  "We agree up to ten target questions with you in writing in month one — the actual " +
  "questions your buyers ask. If none of them returns a Frontpaged-produced page or a " +
  "mention of your business in ChatGPT, Perplexity, or Google AI Overviews within 90 " +
  "days of the first publish, month four is free.";

/** One-line form for cards and schema, where the full clause doesn't fit. */
export const guaranteeShort =
  "Cited for one of your ten agreed target questions within 90 days, or month four is free.";

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
  name: "Benton Purvis",
  role: "Founder",
  /** Two or three sentences, first person. Background, why this business, what you did before. */
  // Breadth then depth, in that order and deliberately.
  //
  // The site sells specialization — one client per market, industry-specific
  // everything — so a bio that only listed five industries would read as
  // generalist and undercut the product. Leading with the disciplines, naming the
  // sectors as range, then landing on 67 healthcare practices makes the breadth
  // support the depth instead of competing with it.
  bio:
    "I've spent most of my career in digital marketing — analytics and tag " +
    "management, paid acquisition, marketing automation, and search — across " +
    "fintech, banking, professional sports, ecommerce, real estate, and " +
    "healthcare. Before " +
    "Frontpaged I directed SEO and AEO, ran paid media, and built the marketing " +
    "technology behind 67 healthcare practices, which is where I kept seeing the " +
    "same pattern: businesses paying for content that read well and never got " +
    "found, with the measurement underneath it too broken to prove it either way. " +
    "I started this to do the version where the content is built to be cited and " +
    "the tracking actually tells you what worked.",
  /**
   * Real, verifiable certifications only — never skills restated as credentials.
   * These render visibly on the About page AND as `hasCredential` on the Person
   * node, so anything listed here is a machine-readable claim.
   *
   * Both are Google Skillshop certifications and require annual renewal. A lapsed
   * certification left published is a live inaccuracy on the entity that anchors
   * authorship across every post — diarise the renewal.
   */
  credentials: ["Google Analytics Certified", "Google Ads Certified"] as string[],
  /** Issuer for the `hasCredential` nodes. Both credentials above come from Google. */
  credentialIssuer: "Google",
  // Personal profile, not the company page. This is the Person node's `sameAs`,
  // which is what lets a search engine or an AI assistant tie the byline on 49
  // posts to a real, verifiable individual rather than to a name string. The
  // company page lives on `site.linkedin` and feeds the Organization node — the
  // two are separate entities and both should be declared.
  linkedin: "https://www.linkedin.com/in/benton-purvis/",
} as const;

// Stable identifier for the founder's Person node in the schema graph. The About
// page declares the node at this @id; anything elsewhere that needs to reference
// the same person (blog bylines) points here rather than re-deriving the string,
// so the two can't drift out of sync.
export const founderId = `${site.url}/about#founder`;

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

// Shared Open Graph image, single source of truth for every page's openGraph.images.
//
// Why every page needs this explicitly: Next.js only auto-attaches a route
// segment's file-convention opengraph-image (src/app/opengraph-image.tsx) when
// that segment's own `metadata` export does NOT declare its own `openGraph` key.
// Metadata is merged shallowly per segment (see the Next.js docs on metadata
// merging) — a page.tsx that sets `openGraph` for its own title/description
// wholesale replaces the parent's resolved openGraph object, images included.
// The homepage only gets the auto image "for free" because page.tsx and
// opengraph-image.tsx are literally colocated in the same app/ segment; every
// other route loses it the moment it sets its own openGraph object. Pointing
// every page's openGraph.images at this one constant (rather than 12 separate,
// possibly-drifting references) fixes that systematically. Twitter cards
// inherit the same image automatically when a page doesn't set twitter.images.
export const ogImage = {
  url: `${site.url}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Frontpaged — Be the first name AI recommends",
} as const;
