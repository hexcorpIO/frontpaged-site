@AGENTS.md

# Frontpaged.io

Marketing website for **Frontpaged**, an agency selling **SEO + Generative Engine
Optimization (GEO)** content services to **medical spas nationwide** (remote, U.S.-wide).

## Meta-goal (most important)

The company sells SEO/GEO, so **this site must itself be a showcase of excellent SEO/GEO**:

- Clean, **semantic HTML** (proper landmarks, headings, one `<h1>` per page)
- **Fast** (static export — see [AGENTS.md](AGENTS.md) and [next.config.ts](next.config.ts))
- Full **meta tags**, **Open Graph**, and **JSON-LD schema** (Organization, Service, FAQ)
- **Answer-first copy** — lead with the answer, then support it (how AI engines extract & cite)

Treat every page as a portfolio piece. If it wouldn't impress an SEO-savvy prospect, fix it.

## Brand

- **Name:** Frontpaged · **Domain:** frontpaged.io
- **Tagline:** "Be the first answer patients see."
- **Logo:** an "F" in a rounded **teal** square next to the wordmark; ".io" rendered in teal.
- **Colors:** as configured in Tailwind (navy + teal palette).
- **Tone:** confident, clear, premium-but-approachable. No jargon walls.

## Contact

- **Email:** hello@frontpaged.io

## Service tiers

| Tier | List | Founding (first 5) | Annual prepay | Note |
|------|------|--------------------|---------------|------|
| Visibility | $1,500/mo | $1,125/mo | $15,000/yr | Newer / single-location clinics |
| **Authority** | **$2,750/mo** | **$2,060/mo** | **$27,500/yr** | **Most popular** |
| Domination | $4,000/mo | $3,000/mo | $40,000/yr | Multi-service / single competitive market |
| Enterprise | Custom, from $8,000/mo | — | — | Multi-location groups / DSOs (sales-led band, not a self-serve card) |

Plus a one-time **AI Visibility Audit at $500**, credited in full toward month one.

All of the above lives in [src/lib/site.ts](src/lib/site.ts) and is consumed by the pricing
cards *and* the JSON-LD, so the two can't drift.

**Founding-client programme.** While `founding.enabled` is `true`, the cards and the `Offer`
schema both advertise the founding rate (schema must state the price a buyer actually pays).
Setting `founding.enabled = false` retires the banner, the struck-through prices, and the
schema discount everywhere in one edit — do that once the 5 slots are filled.

**Guarantee.** Cited by at least one AI engine for a target question within 90 days, or month
four is free. Never promise rankings.

## Conventions

- Components in **PascalCase**; **one section per component**.
- **Tailwind utility classes only** — no separate CSS unless truly necessary.
- **Mobile-first** responsive.

## Reference

- [reference/site-guide.html](reference/site-guide.html) — full single-file design mockup of the
  landing page (hero, problem, how-it-works, pricing, FAQ, contact). Source of truth for layout
  and copy; not part of the build.
