@AGENTS.md

# Frontpaged.io

Marketing website for **Frontpaged**, an agency selling **SEO + Generative Engine
Optimization (GEO)** content services to **medical spas in the Dallas–Fort Worth area**.

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

| Tier | Price | Note |
|------|-------|------|
| Visibility | $1,500/mo | Newer / single-location clinics |
| **Authority** | **$2,750/mo** | **Most popular** |
| Domination | $4,000/mo | Multi-service / single competitive market |
| Enterprise | Custom, from $8,000/mo | Multi-location groups / DSOs (sales-led band, not a self-serve card) |

## Conventions

- Components in **PascalCase**; **one section per component**.
- **Tailwind utility classes only** — no separate CSS unless truly necessary.
- **Mobile-first** responsive.

## Reference

- [reference/site-guide.html](reference/site-guide.html) — full single-file design mockup of the
  landing page (hero, problem, how-it-works, pricing, FAQ, contact). Source of truth for layout
  and copy; not part of the build.
