# Design: Warm Editorial UI Polish

**Date:** 2026-06-15
**Status:** Approved (pending spec review)

## Summary

Raise the perceived professionalism of the Frontpaged.io site by restyling the
existing pages into a **warm, premium, editorial** aesthetic — serif display
headings, a warmer palette, editorial spacing, and refined depth on components.
Pure visual/typographic polish: **no new content sections, no motion**, and the
existing copy/structure stays intact.

## Goals

- Replace the current "clean default Tailwind" feel with an intentional, premium
  editorial look appropriate for a med-spa clientele.
- Establish a real typographic system (serif display + sans body, refined scale).
- Warm the palette and increase spacing/depth so the site reads as designed, not templated.
- Apply consistently across the marketing page, the blog index, and blog posts.

## Non-goals

- No new sections (testimonials, stats, logo rows) — trust/social proof not in scope.
- No scroll animations / motion.
- No content rewrites, no routing/architecture changes, no new dependencies beyond a font.
- No backend changes (site remains a static export).

## Decisions (from brainstorming)

| Question | Decision |
|----------|----------|
| Focus area | Visual depth & typography |
| Aesthetic | Warm premium / editorial |
| Serif display font | **Fraunces** (via `next/font/google`), paired with existing Geist sans for body/UI |
| Emoji | **Replace** with elegant typographic treatment (serif numerals / thin line accents) — Option A |

## Design system

### Typography
- **Display/headings:** Fraunces (loaded with `next/font/google`, variable, `display: "swap"`),
  exposed as `--font-serif`. Applied to `h1`, section `h2`, post titles, pricing tier names,
  and large numerals. Slightly tight leading, optical sizing where available.
- **Body/UI:** keep Geist sans (`--font-sans`) for paragraphs, labels, buttons, nav, eyebrows.
- **Scale (approx, responsive):** hero h1 ~clamp 40→60px; section h2 ~32→40px; body 17–18px
  with line-height ~1.7; eyebrows 12–13px uppercase, letter-spaced, smaller than now.
- Readable measure: prose/body capped (~65–70ch) where it runs long.

### Color (warm)
Add warm tokens in `globals.css` `@theme` (keep existing navy/teal):
- `--color-cream: #faf7f1` (warm page/section background)
- `--color-sand: #f1ebe1` (slightly deeper warm panel / borders base)
- `--color-warm-line: #e7ded1` (hairline warm border)
- `--color-warm-grey: #6b6256` (warm body text on cream)
- `--color-gold: #c08a3e` (sparing warm accent)
- Keep `--color-navy`, `--color-teal`, `--color-teal-dark`, `--color-ink`.
Usage: cream as the dominant light background; white cards on cream; navy retained for the
contact band + footer; teal as primary accent, gold used sparingly (rules, small marks).
Section rhythm alternates cream / white / navy.

### Depth, spacing, components
- **Spacing:** increase section padding (editorial breathing room), consistent vertical rhythm.
- **Cards** (problem, pricing, FAQ, blog): hairline warm borders + soft, low, warm-tinted
  shadows (replace flat/hard boxes); refined hover (slight lift + border warm/teal).
- **Buttons** (`Button.tsx`): refined padding/weight, warm/teal fills, clear focus-visible ring,
  subtle hover; keep sans.
- **Eyebrows/kickers** (`SectionHeading.tsx`): smaller, letter-spaced, teal or gold.
- **Numbered treatments:** Problem cards and How-it-works steps use large **Fraunces numerals**
  (01–03 / 01–04) with a thin rule instead of emoji.
- **AI-test card (Hero):** replace the 🔎 with a small refined label (e.g., a teal dot + "THE AI
  TEST" in letter-spaced sans); replace the ⚠️ in the miss callout with a thin warm rule + label.
- **Contact / blog success "🎉":** replace with a refined serif headline (no emoji).
- **Blog prose:** serif h2/h3, warm rules, refined blockquote, comfortable measure.

## Files affected (restyle only — classNames + tokens)

- `src/app/layout.tsx` — load Fraunces, add `--font-serif` to `<html>`.
- `src/app/globals.css` — warm color tokens; map `--font-serif`; base background → cream;
  default heading font → serif; refine Tailwind Typography `prose` to warm/serif.
- `src/components/SectionHeading.tsx` — serif title, refined eyebrow.
- `src/components/Button.tsx` — refined styles + focus ring.
- `src/components/Hero.tsx` — serif h1, warm bg, restyled AI-test card (no emoji).
- `src/components/Problem.tsx` — numbered serif cards (replace 🤖📍💸), warm card depth.
- `src/components/HowItWorks.tsx` — refined numbered steps.
- `src/components/Pricing.tsx` — serif tier names/prices, warm cards, refined "popular" badge.
- `src/components/Faq.tsx` — refined accordion (warm borders, serif optional).
- `src/components/ContactBand.tsx` — serif heading; keep Calendly embed; refine framing.
- `src/components/SiteHeader.tsx` / `SiteFooter.tsx` — refined nav/footer styling.
- `src/app/blog/page.tsx` / `src/app/blog/[slug]/page.tsx` — serif headings, warm cards/prose,
  replace any emoji.

## Constraints / guardrails

- Keep all existing copy and section order; this is visual only.
- Maintain accessibility: color contrast on cream/navy must pass WCAG AA; keep focus states,
  semantic headings, single h1 per page.
- Keep it static-export safe; only new dependency is the Fraunces font via `next/font`.
- Don't regress SEO: metadata, JSON-LD, sitemap, canonical unchanged.

## Success criteria

- Side-by-side, the site reads as an intentionally designed, premium editorial brand.
- No emoji remain in the UI.
- Build, lint pass; all routes still prerender; Lighthouse/contrast not regressed.

## Risks

- **Font weight/perf:** load only needed Fraunces axes/weights; `display: swap` to avoid FOIT.
- **Contrast on cream + gold:** verify AA; gold used only for non-text or large/decorative.
- **Scope creep:** resist adding sections/motion; this is restyle-only.
