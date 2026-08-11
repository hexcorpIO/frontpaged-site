// Shape of a vertical. Data only — prose lives in content/industries/<slug>.md.
//
// The core invariant: `pricing` is read by BOTH the pricing cards and the Offer
// schema on the same page, so the two can never disagree. That guarantee is the
// reason hub pages are data-driven rather than eight hand-written files.

export type Faq = { q: string; a: string };

/** A citation. Every statistic and every compliance claim carries one. */
export type SourceRef = { label: string; url: string };

/** A schema.org Thing with a Wikipedia sameAs, for `knowsAbout` entity linking. */
export type EntityRef = { name: string; sameAs: string };

export type Tier = {
  name: string;
  /** Monthly list price in USD. Founding and annual rates are derived, never stored. */
  price: number;
  featured?: boolean;
  for: string;
  features: string[];
  cta: string;
};

export type PricingBand = {
  /** Exactly three tiers, cheapest first. Exactly one carries `featured: true`. */
  tiers: Tier[];
  /** Floor of the sales-led Enterprise band for this vertical. */
  enterpriseFrom: number;
};

export type ComplianceRegime = "medical" | "legal" | "real-estate";

export type ComplianceProfile = {
  regime: ComplianceRegime;
  /** Rendered as a trust section on the hub. Never promises compliance. */
  summary: string;
  /** Claims we refuse to write for a client in this vertical. */
  weWillNot: string[];
  /** Rendered verbatim in the hub page footer. */
  requiredDisclaimers: string[];
  /** Primary sources for the rules above. Required — no uncited claims. */
  sources: SourceRef[];
};

export type Vertical = {
  slug: string;
  /** Plural. Nav and headings. */
  name: string;
  /** Singular, lowercase. Inline prose. */
  nameSingular: string;
  /** What we call the client: clinic | practice | firm | team. */
  clientNoun: string;
  /** What the client calls their customer: patients | members | clients | families | sellers. */
  audienceNoun: string;
  /** Overrides site.tagline in this hero only. */
  heroTagline: string;
  /** <=60 chars including any suffix. */
  metaTitle: string;
  /** 70-155 chars. */
  metaDescription: string;
  /** Answer-first block. The extraction target for AI engines. 45-90 words. */
  quickAnswer: string;
  pricing: PricingBand;
  /** >=6, and no question may repeat across verticals. */
  faqs: Faq[];
  knowsAbout: EntityRef[];
  serviceType: string;
  /** Third-party sources AI engines pull from in THIS category. >=2. */
  citationSources: SourceRef[];
  /** Blog tags surfaced on this hub. */
  postTags: string[];
  glossaryTerms: string[];
  compliance: ComplianceProfile;
  foundingSlotsRemaining: number;
  /** False hides the vertical from nav, sitemap, the index, and llms.txt. */
  published: boolean;
};
