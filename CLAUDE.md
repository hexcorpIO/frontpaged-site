@AGENTS.md

# Frontpaged.io

Marketing website for **Frontpaged**, an agency selling **SEO + Generative Engine
Optimization (GEO)** content services to **high-ticket local businesses** across eight
industries, nationwide and remote.

## Read this first: what is actually live

**frontpaged.io has served from WordPress since 2026-08-13.** The Next.js app in `src/`
still builds, still passes every check, and is **not what visitors see**. It is the
content and data source:

| Lives in git | Reaches the live site how |
|---|---|
| `wp/themes/frontpaged/`, `wp/plugins/frontpaged-core/` | Synced by `.github/workflows/deploy-wordpress.yml` on every push to `main` that touches them |
| `content/blog/*.md`, `content/industries/*.md`, `content/pages/*.md`, `src/lib/verticals/*.ts`, `src/lib/site.ts` | **Manually.** Run the WordPress workflow from the Actions tab with "Also re-import content" ticked. The import matches on slug and overwrites admin edits |
| `src/app/**` (Next.js routes and components) | Not deployed. Keep it in step so the export has a working source, and because `pnpm verify` is the only automated SEO gate |

`.github/workflows/deploy.yml` (the static deploy and its daily cron) is **disabled on
purpose**. Re-enabling it lays `index.html` files over WordPress and silently takes URLs
off it. See [docs/wordpress/cutover.md](docs/wordpress/cutover.md) for the full account.

A change that must reach visitors goes in PHP. If it is a site-wide fact (phone, tagline,
pricing), change `src/lib` *and* re-import, so the Next.js checks and the live site agree.
Verify against `https://frontpaged.io`, not the local `out/` build.

## Meta-goal (most important)

The company sells SEO/GEO, so **this site must itself be a showcase of excellent SEO/GEO**:

- Clean, **semantic HTML** (proper landmarks, headings, one `<h1>` per page)
- **Fast**: the WordPress theme ships one stylesheet and a few KB of JavaScript; keep it so
- Full **meta tags**, **Open Graph**, and **JSON-LD schema** (Organization, Person,
  Service, Offer, FAQ, BlogPosting)
- **Answer-first copy**: lead with the answer, then support it (how AI engines extract and cite)

Treat every page as a portfolio piece. If it wouldn't impress an SEO-savvy prospect, fix it.

## Brand

- **Name:** Frontpaged · **Domain:** frontpaged.io
- **Tagline:** "Be the first name AI recommends." (per-industry hero taglines override it)
- **Logo:** an "F" in a rounded **teal** square next to the wordmark; ".io" rendered in teal
- **Colors:** navy + teal + cream. Teal is `#277878` (moved from `#2e8b8b` for WCAG AA)
- **Tone:** confident, clear, premium-but-approachable. No jargon walls
- **Founder:** Benton Purvis, the Person entity on every byline. Also builds
  [hexcorp.io](https://hexcorp.io/) and [tageasy.io](https://www.tageasy.io/), linked from
  the footer and About page

## Contact

- **Email:** hello@frontpaged.io · **Phone:** (615) 905-1857 · Nashville, TN

## Industries and pricing

Eight verticals, each a record in `src/lib/verticals/<slug>.ts`: med-spas, plastic-surgery,
dermatology, wellness, concierge-medicine, personal-injury-law, estate-law, real-estate-teams.
Each record carries its own three-tier pricing band, FAQs, compliance profile and citation
sources. **Pricing differs by industry**; there is no single price table.

- Founding rate = list price × 0.75, floored to $5 (`src/lib/verticals/pricing.ts`)
- Annual prepay = ten months' fee
- Enterprise is sales-led, from a per-industry floor; never a self-serve card
- One-time **AI Visibility Audit at $500**, credited toward month one

The pricing cards, the per-page `Offer` schema, `llms.txt` and the WordPress import all read
from the same records, so prices cannot drift between the page and its markup.

**Founding-client programme.** `founding.enabled` in `src/lib/site.ts` (mirrored by the
WordPress setting) gates the banner, the struck-through prices and the schema discount
everywhere in one edit. Five slots per industry.

**Guarantee.** Up to ten agreed target questions; if none returns a Frontpaged-produced page
or a mention of the client in ChatGPT, Perplexity or Google AI Overviews within 90 days,
month four is free. **Never promise rankings.**

## Leads and tracking

- Both forms post to the plugin's `admin-post.php` handler, which stores the lead as a
  private `fp_lead` post **first**, then emails via Formspree (fallback `wp_mail`), then
  redirects to `/contact/thank-you/`. No nonce by design; honeypot, origin check and
  per-IP rate limit instead
- GTM container `GTM-NBL9BS2M`. The site emits a structured dataLayer; the container is
  configured in the GTM UI, not here. See [docs/analytics/gtm-setup.md](docs/analytics/gtm-setup.md)
- Campaign attribution (`fp_click` cookie) is **on**, described at `/privacy/`. Keep the
  policy and the code in step

## Content

- Posts are markdown in `content/blog/` with a `date`; the importer schedules future dates.
  **If a date is changed in the WordPress admin, change the frontmatter too**: the import
  overwrites, and a post whose source date is in the future gets un-published
- The content gate (`pnpm check:content`) and duplication gate run on every verify.
  Don't let a house template form across posts

## Conventions

- Components in **PascalCase**; **one section per component**
- **Tailwind utility classes only**; the theme CSS is built with `pnpm wp:css` and committed
- **Mobile-first** responsive
- Commit messages explain *why*, including what went wrong. Read the recent log for the voice

## Verification

```
export PATH="$HOME/.local/node/bin:$PATH"   # pnpm is not on PATH in non-interactive shells
pnpm verify        # tests, content + duplication gates, build, SEO + link + tracking checks
php -l <file>      # every PHP file; the deploy workflow does this too
pnpm wp:export     # regenerates wp/migration/data from src/lib and content/ (needs out/ built)
```

## Reference

- [docs/wordpress/cutover.md](docs/wordpress/cutover.md): how WordPress went live and how to deploy
- [docs/analytics/gtm-setup.md](docs/analytics/gtm-setup.md): every dataLayer key and what GTM still needs
- [docs/baseline/](docs/baseline/): our own AI-visibility "before" record, re-run quarterly
- [audit/README.md](audit/README.md): `pnpm visibility`, the prospect audit CLI (needs `PPLX_KEY`)
- [reference/site-guide.html](reference/site-guide.html): the original single-file design mockup
