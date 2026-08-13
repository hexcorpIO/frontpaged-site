// Export every piece of content from the Next.js registries to JSON, for the
// WordPress importer to consume.
//
// Deliberately mechanical. The alternative — retyping eight verticals, six
// services, thirty-three glossary terms and ten scorecard questions into the
// WordPress admin — is where migrations quietly lose fidelity: a dropped FAQ, a
// price typed as 2063 instead of 2060, a compliance source silently omitted.
// Nothing here is transcribed by hand, so nothing can be transcribed wrongly.
//
// Run from the repo root:  node wp/migration/export.mjs

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToBlocks } from "./blocks.mjs";

import { getPublishedVerticals } from "../../src/lib/verticals/index.ts";
import { getPublishedAddOnServices } from "../../src/lib/services.ts";
import { glossary } from "../../src/lib/glossary.ts";
import { questions, factors } from "../../src/lib/scorecard.ts";
import { site, founding, founder, auditOffer, guarantee } from "../../src/lib/site.ts";

const OUT = path.join(process.cwd(), "wp/migration/data");
fs.mkdirSync(OUT, { recursive: true });

const write = (name, data) => {
  const file = path.join(OUT, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  const count = Array.isArray(data) ? data.length : Object.keys(data).length;
  console.log(`  ${String(count).padStart(3)}  ${name}.json`);
};

/* ── Industries ──────────────────────────────────────────────────────── */

const verticals = getPublishedVerticals().map((v) => ({
  slug: v.slug,
  title: v.name,
  name_singular: v.nameSingular ?? "",
  audience_noun: v.audienceNoun ?? "",
  client_noun: v.clientNoun ?? "",
  hero_tagline: v.heroTagline ?? "",
  meta_title: v.metaTitle ?? "",
  meta_description: v.metaDescription ?? "",
  quick_answer: v.quickAnswer ?? "",
  enterprise_from: v.pricing?.enterpriseFrom ?? null,
  pricing_tiers: (v.pricing?.tiers ?? []).map((t) => ({
    name: t.name,
    price: t.price,
    for: t.for ?? "",
    cta: t.cta ?? "Get started",
    featured: t.featured ? 1 : 0,
    features: t.features ?? [],
  })),
  faqs: (v.faqs ?? []).map((f) => ({ question: f.q ?? f.question, answer: f.a ?? f.answer })),
  citation_sources: (v.citationSources ?? []).map((s) => ({ label: s.label, url: s.url })),
  knows_about: v.knowsAbout ?? [],
  compliance: v.compliance
    ? {
        regime: v.compliance.regime ?? "",
        note: v.compliance.summary ?? "",
        we_will_not: v.compliance.weWillNot ?? [],
        required_disclaimers: v.compliance.requiredDisclaimers ?? [],
        sources: (v.compliance.sources ?? []).map((s) => ({ label: s.label, url: s.url })),
      }
    : null,
}));

write("industries", verticals);

/* ── Services ────────────────────────────────────────────────────────── */



// Two core services are hardcoded routes in the Next.js app rather than entries
// in the add-on registry, so they are absent from getPublishedAddOnServices()
// and the first export silently dropped them — caught by the URL parity check,
// which is exactly what that check is for. Their copy is read back out of the
// built HTML so nothing is retyped.
const coreServices = ["generative-engine-optimization", "google-business-profile"].map((slug) => {
  const html = fs.readFileSync(path.join(process.cwd(), "out/services", slug, "index.html"), "utf8");
  const pick = (re) => (html.match(re)?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").trim();
  return {
    slug,
    // The <h1> on these pages wraps nested spans, so a naive text grab
    // truncates at the first tag. og:title is a single clean string.
    title: pick(/<meta property="og:title" content="([^"]*)"/).replace(/\s*·\s*Frontpaged$/, "") || slug,
    meta_title: pick(/<title>([^<]+)</),
    meta_description: pick(/<meta name="description" content="([^"]*)"/),
    quick_answer: "",
    lead: "",
    what_it_is: "",
    deliverables: [],
    not_for: "",
    reasons: [],
    faqs: [],
    sales_led: 1,
    core: 1,
  };
});

write("services", [
  ...coreServices,
  ...getPublishedAddOnServices().map((s) => ({
    slug: s.slug,
    title: s.name,
    meta_title: s.metaTitle ?? "",
    meta_description: s.metaDescription ?? "",
    quick_answer: s.quickAnswer ?? "",
    lead: s.tagline ?? "",
    what_it_is: s.whatItIs ?? "",
    deliverables: s.whatWeDo ?? [],
    not_for: s.notFor ?? "",
    reasons: (s.whyYouNeedIt ?? []).map((r) => ({ heading: r.heading, body: r.body })),
    faqs: (s.faqs ?? []).map((f) => ({ question: f.q ?? f.question, answer: f.a ?? f.answer })),
    sales_led: 1,
  })),
]);

/* ── Glossary ────────────────────────────────────────────────────────── */

write(
  "glossary",
  glossary.map((g) => ({
    slug: g.slug,
    title: g.term,
    definition: g.definition,
    also_known_as: g.also ?? "",
    context: g.context ?? "",
    category: g.category ?? "",
  }))
);

/* ── Scorecard ───────────────────────────────────────────────────────── */

write("scorecard", { questions, factors });

/* ── Brand settings ──────────────────────────────────────────────────── */

write("settings", {
  brand_name: site.name,
  tagline: site.tagline,
  description: site.description,
  email: site.email,
  phone: site.phone,
  phone_href: site.phoneHref,
  linkedin: site.linkedin,
  instagram: site.instagram,
  calendly: site.calendly,
  form_endpoint: site.formEndpoint,
  gtm_id: site.gtmId,
  founding_enabled: founding.enabled ? 1 : 0,
  founding_slots: founding.slotsPerVertical,
  founding_headline: founding.headline,
  founding_terms: founding.terms,
  founder_name: founder.name,
  founder_role: founder.role,
  founder_bio: founder.bio,
  founder_linkedin: founder.linkedin,
  credentials: founder.credentials ?? [],
  credential_issuer: founder.credentialIssuer,
  guarantee,
  audit_offer: auditOffer,
});

/* ── Blog posts ──────────────────────────────────────────────────────── */
//
// The body stays as markdown. The importer converts it to Gutenberg blocks —
// a paragraph of markdown pasted into a classic-editor field would render, but
// it would be one opaque HTML blob that nobody can edit in the block editor,
// which defeats the point of moving to WordPress at all.

const BLOG = path.join(process.cwd(), "content/blog");

write(
  "posts",
  fs
    .readdirSync(BLOG)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(BLOG, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title ?? "",
        date: data.date ?? "",
        updated: data.updated ?? "",
        meta_title: data.metaTitle ?? "",
        meta_description: data.description ?? "",
        quick_answer: data.quickAnswer ?? "",
        industry: data.vertical ?? data.industry ?? "",
        faqs: (data.faqs ?? []).map((f) => ({ question: f.q ?? f.question, answer: f.a ?? f.answer })),
        blocks: markdownToBlocks(content),
      };
    })
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
);

console.log("\nExported to wp/migration/data/");
