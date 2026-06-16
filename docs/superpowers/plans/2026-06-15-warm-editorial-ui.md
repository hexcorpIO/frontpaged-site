# Warm Editorial UI Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing Frontpaged.io pages into a warm, premium, editorial aesthetic (serif display type, warm palette, editorial spacing, refined depth) with no content/structure changes and no emoji.

**Architecture:** Pure presentation pass. Add a serif display font (Fraunces) via `next/font`, introduce warm color + serif tokens in Tailwind v4 `@theme`, then update component classNames section-by-section. Site stays a static export.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, Tailwind CSS v4, `@tailwindcss/typography`, `next/font/google` (Fraunces + Geist).

**Spec:** `docs/superpowers/specs/2026-06-15-warm-editorial-ui-design.md`

**Verification model (no unit tests):** every task ends by running `pnpm build` (must compile, all routes still prerender) and `pnpm lint` (0 errors). The final task does a full visual screenshot review + emoji sweep. There is no test runner on this branch — do not add one.

---

## Shared design vocabulary (reference for all tasks)

**Color tokens** (added in Task 1, usable as Tailwind utilities `bg-cream`, `text-warm-grey`, `border-warm-line`, `text-gold`, plus existing `navy`/`teal`/`teal-dark`/`ink`/`grey`/`soft`):
- `cream #faf7f1` — dominant light background
- `sand #f1ebe1` — deeper warm panel
- `warm-line #e7ded1` — hairline warm border
- `warm-grey #6b6256` — warm body text
- `gold #c08a3e` — sparing accent (rules, small marks, numerals)

**Type:**
- Headings: `font-serif` (Fraunces). Body/UI/buttons/eyebrows: default sans (Geist).
- Eyebrow class: `text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark`
- Section title class: `font-serif text-[32px] sm:text-[40px] font-semibold tracking-tight text-navy leading-[1.1]`
- Body copy: `text-[17px] leading-[1.7] text-warm-grey` (on light) / `text-[#cdd6e2]` (on navy)

**Card class (light sections):**
`rounded-2xl border border-warm-line bg-white p-7 shadow-[0_8px_30px_rgba(21,38,63,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(21,38,63,0.10)]`

**Primary button:** `bg-teal text-white hover:bg-teal-dark` · **Ghost:** `border border-warm-line bg-transparent text-navy hover:border-teal hover:bg-soft` · both: `rounded-full px-7 py-3.5 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal` (note: buttons move to **pill** `rounded-full` for the editorial feel).

**Section padding:** `py-20 sm:py-28` (more generous than current `py-[72px]`).

**Section rhythm:** Hero = cream gradient; Problem = cream; HowItWorks = white; Pricing = sand; FAQ = white; Contact = navy; Footer = navy or cream. (Specified per task.)

---

## Task 1: Foundation — fonts, color tokens, base styles, prose

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Load Fraunces in `layout.tsx`**

Add Fraunces alongside Geist. Update the imports and font setup:
```tsx
import { Geist, Fraunces } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
```
Then add `fraunces.variable` to the `<html>` className (keep existing classes):
```tsx
<html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
```

- [ ] **Step 2: Add warm tokens + serif mapping + base styles in `globals.css`**

Replace the current `globals.css` body of tokens with this (keep the `@import "tailwindcss";` and `@plugin "@tailwindcss/typography";` lines at top):
```css
@theme {
  --color-navy: #15263f;
  --color-teal: #2e8b8b;
  --color-teal-dark: #246e6e;
  --color-ink: #1d2733;
  --color-grey: #5b6672;
  --color-soft: #eef5f5;
  --color-line: #e3e9ee;
  --color-amber: #fff4e6;
  --color-coral: #e8794b;
  /* warm editorial palette */
  --color-cream: #faf7f1;
  --color-sand: #f1ebe1;
  --color-warm-line: #e7ded1;
  --color-warm-grey: #6b6256;
  --color-gold: #c08a3e;
}

@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-serif: var(--font-fraunces);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-cream);
  color: var(--color-ink);
}

/* Editorial: display headings use the serif by default. */
h1, h2, h3 {
  font-family: var(--font-fraunces), Georgia, "Times New Roman", serif;
}
```

- [ ] **Step 3: Build to verify fonts/tokens load**

Run: `pnpm build`
Expected: compiles; no errors. (Fraunces fetched at build like Geist.)

- [ ] **Step 4: Commit**
```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "style: add Fraunces serif + warm editorial color tokens"
```

---

## Task 2: Atoms — SectionHeading + Button

**Files:**
- Modify: `src/components/SectionHeading.tsx`
- Modify: `src/components/Button.tsx`

- [ ] **Step 1: Refine `SectionHeading.tsx`**

Update the eyebrow + title classes (keep the component's props/structure):
- Eyebrow `<p>` class → `mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark`
- Title `<h2>` class → `max-w-2xl font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-navy sm:text-[40px]`
- Sub `<p>` class → `mt-4 max-w-2xl text-[17px] leading-[1.7] text-warm-grey`

- [ ] **Step 2: Refine `Button.tsx` to pill + warm/focus styles**

Update the style constants:
```tsx
const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition " +
  "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal";

const variants = {
  solid: "bg-teal text-white hover:bg-teal-dark",
  ghost: "border border-warm-line bg-transparent text-navy hover:border-teal hover:bg-soft",
};

const sizes = {
  md: "px-7 py-3 text-[15px]",
  lg: "px-9 py-4 text-[17px]",
};
```
(Keep the component's props and `<a>` element unchanged.)

- [ ] **Step 3: Build + lint**

Run: `pnpm build && pnpm lint`
Expected: compiles; 0 lint errors.

- [ ] **Step 4: Commit**
```bash
git add src/components/SectionHeading.tsx src/components/Button.tsx
git commit -m "style: refine section heading (serif) and pill buttons"
```

---

## Task 3: Header + Footer

**Files:**
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`

- [ ] **Step 1: Header**

In `SiteHeader.tsx`:
- Header bar background → warm translucent: change `bg-white/90` to `bg-cream/85`.
- Keep `border-b border-line` → change to `border-warm-line`.
- Nav links class → keep, but change hover to `hover:text-teal-dark` (already) and color `text-navy/80`.
- The "Free visibility check" link → make it a pill: `rounded-full bg-teal px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-teal-dark`.
- Leave the `Logo` component as-is (it has the SVG mark already).

- [ ] **Step 2: Footer**

In `SiteFooter.tsx`:
- Border top → `border-warm-line`.
- Background → keep cream (inherits body) or set `bg-cream`.
- Text → `text-warm-grey`.
- LinkedIn link hover → `hover:text-teal-dark`.

- [ ] **Step 3: Build + lint**

Run: `pnpm build && pnpm lint`
Expected: compiles; 0 errors.

- [ ] **Step 4: Commit**
```bash
git add src/components/SiteHeader.tsx src/components/SiteFooter.tsx
git commit -m "style: warm header/footer treatment"
```

---

## Task 4: Hero (incl. AI-test card, no emoji)

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Restyle the hero shell + headline**

- Section background → warm gradient: `bg-gradient-to-b from-cream to-white` (replace the current `from-[#f7fbfb] to-white`); padding → `pt-24 pb-24 sm:pt-28`.
- Eyebrow → `text-[12px] font-semibold uppercase tracking-[0.18em] text-teal-dark`.
- `h1` → `font-serif` with refined scale: `max-w-3xl font-serif text-[40px] font-semibold leading-[1.08] tracking-tight text-navy sm:text-[56px]`. Keep the teal `first answer` span (use `text-teal`); consider italic Fraunces for that span: add `italic` to the highlighted span for editorial flair.
- Lead paragraph → `mt-6 max-w-2xl text-[19px] leading-[1.7] text-warm-grey`.
- CTA row unchanged structurally (uses `Button`). Note: the cta-note text → `text-sm text-warm-grey`.

- [ ] **Step 2: Restyle the AI-test card — remove 🔎 and ⚠️**

In `AiTestCard`:
- Card shell → `mt-14 max-w-[680px] overflow-hidden rounded-2xl border border-warm-line bg-white shadow-[0_18px_50px_rgba(21,38,63,0.10)]`.
- Title bar (`figcaption`): remove the `🔎` emoji. Replace with a small teal dot + label:
```tsx
<figcaption className="flex items-center gap-2.5 bg-navy px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#cfe3e3]">
  <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-teal" />
  The AI test
  <span aria-hidden="true" className="font-normal normal-case tracking-normal text-[#9fb6cc]">· what your patients see</span>
</figcaption>
```
- The "miss" callout: remove the `⚠️` emoji. Replace with a thin coral left rule + a small uppercase label:
```tsx
<p className="mt-3 border-l-2 border-coral bg-amber px-4 py-3 text-[#7a5a16]">
  <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-coral">Not mentioned</span>
  Your clinic isn&rsquo;t in the answer. That whole high-intent audience never sees you. We fix exactly that.
</p>
```
- Body text classes → use `text-warm-grey` for the prompt line.

- [ ] **Step 3: Build + lint, confirm no emoji remain in Hero**

Run: `pnpm build && pnpm lint`
Then: `grep -nP "[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]" src/components/Hero.tsx || echo "no emoji"`
Expected: compiles; 0 lint errors; "no emoji".

- [ ] **Step 4: Commit**
```bash
git add src/components/Hero.tsx
git commit -m "style: editorial hero + emoji-free AI-test card"
```

---

## Task 5: Problem section — numbered serif cards (replace 🤖📍💸)

**Files:**
- Modify: `src/components/Problem.tsx`

- [ ] **Step 1: Replace emoji icons with serif numerals + restyle cards**

- Section: `border-t border-warm-line bg-cream py-20 sm:py-28` (replace current).
- In the `cards` array, remove the `icon` emoji fields (no longer used).
- Card render: replace the emoji icon `<div>` with a numbered serif treatment + hairline rule:
```tsx
<article key={c.title} className="rounded-2xl border border-warm-line bg-white p-8 shadow-[0_8px_30px_rgba(21,38,63,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(21,38,63,0.10)]">
  <div className="mb-5 flex items-baseline gap-3">
    <span className="font-serif text-4xl font-semibold text-teal">{String(i + 1).padStart(2, "0")}</span>
    <span className="h-px flex-1 bg-warm-line" />
  </div>
  <h3 className="font-serif text-[21px] font-semibold text-navy">{c.title}</h3>
  <p className="mt-2.5 text-[15.5px] leading-[1.65] text-warm-grey">{c.body}</p>
</article>
```
(Use the array index `i` from `.map((c, i) => ...)`.)
- Keep the `SectionHeading` usage.

- [ ] **Step 2: Build + lint + emoji check**

Run: `pnpm build && pnpm lint`
Then: `grep -nP "[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]" src/components/Problem.tsx || echo "no emoji"`
Expected: compiles; 0 errors; "no emoji".

- [ ] **Step 3: Commit**
```bash
git add src/components/Problem.tsx
git commit -m "style: numbered serif problem cards (no emoji)"
```

---

## Task 6: How-it-works — refined numbered steps

**Files:**
- Modify: `src/components/HowItWorks.tsx`

- [ ] **Step 1: Restyle**

- Section: `border-t border-warm-line bg-white py-20 sm:py-28`.
- Replace the filled navy circle number with an editorial serif numeral + hairline:
```tsx
<li key={s.title}>
  <div className="mb-4 flex items-center gap-3">
    <span className="font-serif text-3xl font-semibold text-gold">{i + 1}</span>
    <span className="h-px flex-1 bg-warm-line" />
  </div>
  <h3 className="font-serif text-[18px] font-semibold text-navy">{s.title}</h3>
  <p className="mt-2 text-[15px] leading-[1.6] text-warm-grey">{s.body}</p>
</li>
```
- Keep the ordered list semantics (`<ol>`).

- [ ] **Step 2: Build + lint + emoji check**

Run: `pnpm build && pnpm lint`
Then: `grep -nP "[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]" src/components/HowItWorks.tsx || echo "no emoji"`
Expected: compiles; 0 errors; "no emoji".

- [ ] **Step 3: Commit**
```bash
git add src/components/HowItWorks.tsx
git commit -m "style: editorial numbered how-it-works steps"
```

---

## Task 7: Pricing — serif tiers, warm cards

**Files:**
- Modify: `src/components/Pricing.tsx`

- [ ] **Step 1: Restyle**

- Section: `border-t border-warm-line bg-sand py-20 sm:py-28` (replace `bg-soft`).
- Tier card base → `relative flex flex-col rounded-2xl bg-white p-8 transition duration-200`; non-featured add `border border-warm-line shadow-[0_8px_30px_rgba(21,38,63,0.05)]`; featured add `border-2 border-teal shadow-[0_18px_50px_rgba(46,139,139,0.16)]`.
- "Most popular" badge → `rounded-full bg-teal px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white` (keep absolute positioning).
- Tier name `<h3>` → `font-serif text-[22px] font-semibold text-navy`.
- Price → `font-serif text-[40px] font-semibold text-navy` (the `/mo` span → `font-sans text-base font-medium text-warm-grey`).
- `for` line → `text-[14px] text-warm-grey`.
- Feature `<li>` → keep the check; change border to `border-warm-line`, text `text-ink`, and the `before:` check stays `text-teal`.
- CTA uses `Button` (now pill) — unchanged structurally.

- [ ] **Step 2: Build + lint + emoji check**

Run: `pnpm build && pnpm lint`
Then: `grep -nP "[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]" src/components/Pricing.tsx || echo "no emoji"`
Expected: compiles; 0 errors; "no emoji" (the ✓ is a CSS `content` glyph, not an emoji — acceptable; if grep flags it, leave it).

- [ ] **Step 3: Commit**
```bash
git add src/components/Pricing.tsx
git commit -m "style: warm editorial pricing cards"
```

---

## Task 8: FAQ — refined accordion

**Files:**
- Modify: `src/components/Faq.tsx`

- [ ] **Step 1: Restyle**

- Section: `border-t border-warm-line bg-white py-20 sm:py-28`.
- `details` → `group mb-3 overflow-hidden rounded-xl border border-warm-line bg-cream`.
- `summary` → keep layout; font `font-serif text-[18px] font-semibold text-navy`; the +/− markers stay teal.
- Answer `<p>` → `px-5 pb-5 text-[15.5px] leading-[1.7] text-warm-grey`.

- [ ] **Step 2: Build + lint**

Run: `pnpm build && pnpm lint`
Expected: compiles; 0 errors.

- [ ] **Step 3: Commit**
```bash
git add src/components/Faq.tsx
git commit -m "style: refined FAQ accordion"
```

---

## Task 9: Contact band — serif heading (keep Calendly, no emoji)

**Files:**
- Modify: `src/components/ContactBand.tsx`

- [ ] **Step 1: Restyle**

- Keep the navy section, the Calendly embed (`CalendlyInline`), and the email fallback exactly.
- Section padding → `py-20 sm:py-28`; border-top → `border-warm-line`.
- `h2` → `font-serif text-[34px] font-semibold tracking-tight sm:text-[40px]`.
- Sub paragraph → `mt-4 text-[18px] leading-[1.7] text-[#cdd6e2]`.
- The white card around Calendly → keep, soften: `rounded-2xl bg-white p-3 shadow-[0_24px_60px_rgba(0,0,0,0.30)]`.
- Email fallback line → `text-[15px] text-[#9fb6cc]`.

- [ ] **Step 2: Build + lint**

Run: `pnpm build && pnpm lint`
Expected: compiles; 0 errors.

- [ ] **Step 3: Commit**
```bash
git add src/components/ContactBand.tsx
git commit -m "style: editorial contact band"
```

---

## Task 10: Blog — index + post (serif, warm, emoji-free)

**Files:**
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Blog index (`blog/page.tsx`)**

- Hero band → `bg-gradient-to-b from-cream to-white py-16 sm:py-20`; eyebrow refined; `h1` → `font-serif text-[40px] font-semibold tracking-tight text-navy sm:text-5xl`; intro → `text-[18px] leading-[1.7] text-warm-grey`.
- Listing section → `border-t border-warm-line py-16`.
- Post cards → use the shared card class (warm border + soft shadow + hover lift); title `font-serif text-[21px] font-semibold text-navy`; description `text-warm-grey`; tags pill `bg-soft text-teal-dark`; date/reading-time `text-warm-grey`.
- Bottom CTA band stays navy; heading `font-serif`; button → pill teal with `hover:bg-white hover:text-navy`.

- [ ] **Step 2: Blog post (`blog/[slug]/page.tsx`)**

- Container stays `!max-w-3xl`.
- Title `h1` → `font-serif text-[40px] font-semibold leading-[1.12] tracking-tight text-navy`.
- Meta line → `text-warm-grey`.
- Quick-answer box → `rounded-2xl border-l-4 border-teal bg-soft p-6`; label `text-teal-dark`; body `text-[17px] text-ink`.
- Prose wrapper → `prose prose-lg mt-8 max-w-none prose-headings:font-serif prose-headings:text-navy prose-headings:font-semibold prose-a:text-teal-dark prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-li:marker:text-teal prose-p:text-warm-grey prose-p:leading-[1.8]`.
- FAQ accordion → match Task 8 (warm borders, serif summaries).
- Bottom CTA card → navy, `font-serif` heading, pill button.

- [ ] **Step 3: Build + lint + emoji sweep on blog files**

Run: `pnpm build && pnpm lint`
Then: `grep -rnP "[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]" src/app/blog || echo "no emoji"`
Expected: compiles; 0 errors; "no emoji".

- [ ] **Step 4: Commit**
```bash
git add src/app/blog
git commit -m "style: warm editorial blog index + post"
```

---

## Task 11: Final QA — emoji sweep, build, lint, visual review

**Files:** none (verification + screenshots)

- [ ] **Step 1: Full emoji sweep across the UI (components + app, excluding content + JSON-LD)**

Run:
```bash
grep -rnP "[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]" src/ || echo "NO EMOJI IN UI"
```
Expected: "NO EMOJI IN UI". (If the opengraph-image or any file shows one, remove it. Note: `content/blog/*.md` article bodies are NOT in scope — leave those.)

- [ ] **Step 2: Production build + lint**

Run: `pnpm build && pnpm lint`
Expected: all routes prerender (`/`, `/blog`, 10 posts, robots, sitemap, og); 0 lint errors.

- [ ] **Step 3: Visual screenshot review**

Start the production server and capture screenshots to eyeball the result:
```bash
pnpm build && pnpm start &
# wait for server, then capture home + a blog post (use any available screenshot method, e.g. a headless browser, or open in browser)
```
If no screenshot tooling is available, render the home page and one blog post in a browser at `http://localhost:3000/` and `http://localhost:3000/blog/med-spa-seo-2026-guide/` and confirm: serif headings, cream/warm backgrounds, refined cards, pill buttons, no emoji, readable contrast. Stop the server when done.

- [ ] **Step 4: Accessibility spot-check**

Confirm: each page has exactly one `<h1>`; text on cream and on navy passes AA (navy `#15263f` on cream `#faf7f1` and teal-dark on cream are fine; verify gold is used only for large/decorative numerals, never small body text on cream).

- [ ] **Step 5: Final commit (if any QA fixes were made)**
```bash
git add -A
git commit -m "style: warm editorial UI QA fixes"
```

---

## Self-review notes

- **Spec coverage:** Typography/serif (T1, T2, all components); warm palette + tokens (T1, applied T3–T10); depth/spacing/cards/buttons (T2 atoms + every component); emoji removal (T4, T5, T6, T9, T10, swept T11); blog parity (T10); accessibility + static-export safety (T11, guardrails honored — only new dep is the font).
- **Out of scope confirmed absent:** no new sections, no motion, no copy changes, no backend.
- **Consistency:** token names (`cream/sand/warm-line/warm-grey/gold`) defined in T1 and reused verbatim everywhere; `font-serif` utility from T1 used in all heading tasks; shared card/button vocabulary applied consistently.
- **No placeholders:** concrete classes/snippets given per task; emoji-sweep uses an explicit grep.
