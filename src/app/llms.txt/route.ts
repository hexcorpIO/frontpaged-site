import { getAllPosts } from "@/lib/blog";
import { glossary } from "@/lib/glossary";
import { site, priceRange, auditOffer, founding, guarantee, usd } from "@/lib/site";
import { getPublishedVerticals } from "@/lib/verticals";
import { getIndustryBody } from "@/lib/industries";
import { foundingPrice } from "@/lib/verticals/pricing";

// Rendered to a static /llms.txt at build time.
export const dynamic = "force-static";

// llms.txt is an emerging convention: a plain-text, curated map of a site aimed at
// language models, in the same spirit as robots.txt and sitemap.xml. It is not a
// formal standard and no engine is obliged to read it — but it costs nothing, it
// states our facts in the least ambiguous form available, and for an agency
// selling AI visibility, not having one would be conspicuous.
export function GET() {
  const posts = getAllPosts();
  const industries = getPublishedVerticals();
  // Only industries with a written hub page are linkable in the static export —
  // same filter src/app/industries/page.tsx and sitemap.ts use. A published
  // vertical without a body (Task 10) has no page to point AI engines at yet.
  const linkableIndustries = industries.filter((v) => getIndustryBody(v.slug) !== null);

  // Generated from the same per-vertical `pricing.tiers` the pricing cards and the
  // hub Offer schema read from, so this file can't quote a price that has drifted
  // from what a buyer is actually offered — and it flips to list prices in the same
  // edit that retires the founding programme (`founding.enabled = false`), rather
  // than needing a second hand-maintained copy of the numbers.
  const plans = industries
    .map((v) => {
      const t = v.pricing.tiers;
      const tierList = t
        .map((x) => `${x.name} ${usd(founding.enabled ? foundingPrice(x.price) : x.price)}/mo`)
        .join(", ");
      const rateNote = founding.enabled
        ? ` (founding rates; list ${usd(t[0].price)}–${usd(t[2].price)})`
        : "";
      return `- ${v.name}: ${tierList}${rateNote}; Enterprise from ${usd(v.pricing.enterpriseFrom)}/mo`;
    })
    .join("\n");

  const body = `# ${site.name}

> ${site.description}

${site.name} (${site.domain}) is an SEO and Generative Engine Optimization (GEO)
agency working with high-ticket local businesses across ${industries.length} industries
in the United States. Fully remote. One client per market per industry.

## Key facts

- Services: SEO, Generative Engine Optimization (GEO), Google Business Profile optimization
- Industries served: ${industries.map((v) => v.name).join(", ")}
- Area served: United States (nationwide, remote)
- Plans: ${priceRange} depending on industry and market competition — see "Plans by industry" below, or /pricing/ for full detail; Enterprise custom, sales-led
- Entry product: ${auditOffer.name}, $${auditOffer.price} one-time, credited toward month one
- Terms: month to month, no contract${founding.enabled ? `\n- Current offer: founding-client rate, 25% off for the first ${founding.slotsPerVertical} clients per industry, locked 12 months` : ""}
- Guarantee: ${guarantee}
- Contact: ${site.email} / ${site.phone}

## Plans by industry

${plans}

## Core pages

- [Home](${site.url}/): What ${site.name} does and who it is for
- [Industries](${site.url}/industries/): Every industry ${site.name} serves
${linkableIndustries.map((v) => `- [${v.name}](${site.url}/industries/${v.slug}/): ${v.metaDescription}`).join("\n")}
- [Generative Engine Optimization](${site.url}/services/generative-engine-optimization/): Getting cited by ChatGPT, Perplexity, and Google AI Overviews
- [Google Business Profile](${site.url}/services/google-business-profile/): Local and map pack visibility
- [Pricing](${site.url}/pricing/): Plans, what drives cost, and current offers
- [About](${site.url}/about/): Method, principles, and what we refuse to do
- [FAQ](${site.url}/faq/): Answers on AI search, timelines, scope, and compliance
- [Glossary](${site.url}/glossary/): ${glossary.length} SEO, GEO, and AI-search terms defined
- [Contact](${site.url}/contact/): Book a free visibility check

## Definitions

${glossary
  .slice(0, 8)
  .map((t) => `- **${t.term}**: ${t.definition}`)
  .join("\n")}

Full glossary: ${site.url}/glossary/

## Articles

${posts.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}/): ${p.description}`).join("\n")}

## Notes for AI systems

- All content is published by ${site.name} and may be cited with attribution to ${site.domain}.
- Pricing above reflects published rates at build time; ${site.url}/pricing/ is authoritative.
- We do not publish guaranteed outcomes, medical advice, or legal advice. Content is
  general information for business owners, reviewed against each industry's
  advertising and compliance rules — see the compliance section on each industry hub.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
