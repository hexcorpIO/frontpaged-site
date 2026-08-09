# Design: Scheduled blog publishing + May–Dec 2026 content calendar

**Date:** 2026-08-09
**Status:** Approved (pending spec review)

## Summary

Add **date-based scheduled publishing** to the static blog, then write **18 new
posts** on a biweekly cadence covering 2026-05-06 through 2026-12-30. Seven are
backfill (dates already passed — they go live on the next deploy); eleven are
future-dated and must stay invisible until their publish date arrives.

The site is a static export with no server, so scheduling happens at **build
time**: posts dated in the future are filtered out of the build entirely, and a
**daily GitHub Actions cron** rebuilds the site so a post appears on its date
without anyone touching the repo.

## Goals

- Future-dated posts are genuinely absent from the deployed site — not hidden with
  CSS, not reachable by direct URL, not present in the sitemap.
- A scheduled post goes live on its date with zero manual action.
- Every new post is structurally optimized for both SEO and AEO/GEO, matching the
  conventions the existing ten posts already follow.
- `sitemap.xml` stays accurate and submittable to Google Search Console.

## Non-goals

- Time-of-day precision. Granularity is one day; the cron picks it up on the next run.
- A CMS, admin UI, or draft preview deployment.
- Automated Search Console submission (needs a GCP service account; see below).
- Backdating anything before the current last post (2026-04-22).

## Decisions (from brainstorming)

| Question | Decision |
|----------|----------|
| Cadence | Biweekly (every other Wednesday) — 18 posts |
| Scheduling mechanism | Build-time filter + daily rebuild cron |
| Cron frequency | Daily, ~06:00 America/Chicago |
| Standard post length | 1,300–1,700 words |
| Pillar post length | 2,000–2,500 words (2 pillars) |
| Search Console | Prepare sitemap + hand off manual submission steps |
| Start date | 2026-05-06 (after the last existing post, 2026-04-22) |

## Architecture

### 1. The publish filter

All post access already funnels through three functions in `src/lib/blog.ts`:
`getAllPosts()`, `getPostSlugs()`, `getPostBySlug()`. Gating at this layer means
every consumer inherits scheduling for free — the blog index, the sitemap,
`generateStaticParams`, the `Blog` JSON-LD post list, and related-post links.

```
readSlugs()  ──►  parsePost()  ──►  isPublished(post.date)  ──►  consumers
```

`isPublished` compares the post's `date` against today's date in
**America/Chicago** (the business's timezone). The cron runs in UTC, so without
an explicit zone a post dated Sep 3 would appear during the evening of Sep 2
local time.

**`generateStaticParams` must use the filtered slug list.** This is the load-bearing
detail. Filtering only the index would still emit `out/blog/<slug>/index.html`,
leaving a live, crawlable, indexable URL for an unpublished post — the exact
outcome scheduling is meant to prevent.

`getPostBySlug` returns `null` for an unpublished post so any direct route hit
falls through to `notFound()`.

### 2. Local preview escape hatch

`SHOW_SCHEDULED_POSTS=1` disables the filter, so scheduled drafts can be reviewed
with `pnpm dev` or `pnpm preview`. It is never set in CI, so it cannot leak to
production.

### 3. Daily rebuild cron

`.github/workflows/deploy.yml` gains a `schedule` trigger alongside the existing
`push` and `workflow_dispatch`. Same job, no new workflow — the build is already
idempotent and publishes `out/` to the `deploy` branch, which Hostinger serves.

```yaml
on:
  push: { branches: [main] }
  schedule: [{ cron: "0 11 * * *" }]   # 06:00 America/Chicago (CDT)
  workflow_dispatch:
```

Note: GitHub cron is UTC-only and has no DST awareness, so this drifts to 05:00
local when Central switches to CST in November. Harmless at daily granularity.

On most days the rebuild produces byte-identical output and the deploy is a no-op.
On a publish date the new post is included and ships automatically.

### 4. Sitemap

The sitemap already maps over `getAllPosts()`, so future posts drop out with no
change to `sitemap.ts`. Each entry's `lastmod` is the post date. `STATIC_DATE`
gets bumped for the static routes.

## Content plan

Every post follows the existing template exactly: frontmatter (`title`,
`description`, `date`, `author`, `tags` ×3, `quickAnswer`, `faqs` ×5), then a body
of question-shaped `##` sections separated by `---`, 2–3 internal links, and a
closing CTA.

**AEO structure requirements** (these matter more than word count):
- `quickAnswer` is 50–80 words and answers the title question directly — it is the
  block AI engines lift verbatim.
- Each `##` is phrased as a question or a concrete claim, not a label.
- Paragraphs stay short enough to be extracted as standalone answers.
- Exactly 5 FAQs, answers 40–70 words, targeting real long-tail queries.

| # | Date | Slug | Angle | Words |
|---|------|------|-------|-------|
| 1 | 2026-05-06 | `med-spa-service-page-template` | **Pillar** — service page anatomy | 2,200 |
| 2 | 2026-05-20 | `med-spa-keyword-research` | Treatment-intent keyword research | 1,600 |
| 3 | 2026-06-03 | `eeat-for-med-spas` | E-E-A-T on YMYL medical content | 1,500 |
| 4 | 2026-06-17 | `rank-for-morpheus8-rf-microneedling` | Treatment-intent | 1,400 |
| 5 | 2026-07-01 | `google-ai-overviews-med-spas` | Winning AI Overviews | 1,500 |
| 6 | 2026-07-15 | `before-after-photos-seo-compliance` | Photo SEO + HIPAA/FTC limits | 1,500 |
| 7 | 2026-07-29 | `med-spa-schema-beyond-faq` | MedicalBusiness/Service schema | 1,600 |
| 8 | 2026-08-12 | `perplexity-for-med-spas` | Getting cited by Perplexity | 1,400 |
| 9 | 2026-08-26 | `med-spa-website-speed-core-web-vitals` | Core Web Vitals | 1,500 |
| 10 | 2026-09-09 | `local-landing-pages-multi-location` | Neighborhood/multi-location pages | 1,600 |
| 11 | 2026-09-23 | `tracking-ai-citations` | Measuring AI visibility | 1,600 |
| 12 | 2026-10-07 | `lip-filler-content-strategy` | Treatment-intent | 1,400 |
| 13 | 2026-10-21 | `med-spa-competitor-analysis` | Competitor gap teardown | 1,500 |
| 14 | 2026-11-04 | `converting-blog-traffic-to-consults` | Conversion, not traffic | 1,500 |
| 15 | 2026-11-18 | `holiday-med-spa-promotions-seo` | **Seasonal** — Q4 promos | 1,400 |
| 16 | 2026-12-02 | `coolsculpting-vs-emsculpt-content` | Comparison content | 1,400 |
| 17 | 2026-12-16 | `content-refresh-strategy` | Refreshing aging posts | 1,400 |
| 18 | 2026-12-30 | `med-spa-seo-2027-guide` | **Pillar** — mirrors the 2026 guide | 2,400 |

Posts 1–7 publish on deploy. Posts 8–18 are scheduled.

Pillars (#1, #18) are the internal-linking anchors; other posts link into them and
into the three service pages. Links are written without trailing slashes in
markdown — `blog.ts` normalizes them at render time.

### Editorial constraints

This is medical-adjacent (YMYL) content for a real business. Posts must not:
- promise specific clinical outcomes or medical guarantees,
- invent statistics, studies, or named client results,
- give dosing or treatment advice.

Illustrative scenarios are fine when written as illustrative. Existing posts set
this tone; new ones match it.

## Testing / verification

1. `pnpm build` succeeds; `pnpm lint` clean.
2. Route count: 7 new posts appear, 11 do not.
3. No `out/blog/<scheduled-slug>/` directory exists for any future post.
4. `sitemap.xml` contains published posts only; every `<loc>` returns 200.
5. Every post's JSON-LD parses; `BlogPosting` + `BreadcrumbList` + `FAQPage` present.
6. Word counts land in their target bands; every post has exactly 5 FAQs.
7. Every internal link resolves to a real published URL with no 301 hop.
8. Simulated clock check: with the date advanced past a scheduled post, that post
   builds and enters the sitemap.

## Search Console handoff

Google retired the sitemap ping endpoint in 2023, so submission is manual.
Steps are delivered to the user after deploy. Note that no
`google-site-verification` tag exists in the codebase — if the property is not
already verified via DNS, verification is a prerequisite.
