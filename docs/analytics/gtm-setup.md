# GTM setup for frontpaged.io

Container `GTM-NBL9BS2M`. The site pushes a structured dataLayer; this is what to
build in the GTM UI to read it.

Nothing here is configured in the repo on purpose. A static export has to be
rebuilt and redeployed for any code change, and measurement changes far more
often than the site does — so the code emits data and GTM decides what to do
with it.

## Consent Mode v2

A synchronous inline script in `<head>` sets the default state before the
container loads ([`src/components/ConsentDefaults.tsx`](../../src/components/ConsentDefaults.tsx)):

| Signal | Default |
|---|---|
| `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` | `denied` |
| `functionality_storage`, `security_storage` | `granted` |
| `wait_for_update` | `500` ms |

`next/script` with `strategy="beforeInteractive"` is **not** used here. For an
inline script it emits a `self.__next_s.push(...)` queue entry rather than a real
script tag, so execution depends on Next draining that queue. A synchronous head
script cannot lose the race to the container at all.

**Denied does not mean off.** GA4 switches to cookieless pings: no client
identifier is stored, so sessions are modelled rather than stitched and a
returning visitor reads as new. Reports populate with estimates rather than
counts.

### The grant half

`fpConsentGrant()` is defined in `<head>` after the defaults. Calling it moves
the four denied signals to `granted` and pushes `fp_consent_granted`.

```html
<button onclick="fpConsentGrant()">Accept</button>
```

**Nothing calls it yet.** There is no Accept control on the site, so every
visitor stays denied and GA4 stays cookieless. The function is the hook a banner
will use, not a banner.

**It also does not persist the choice.** Consent Mode state lives in memory for
the life of the page. A visitor who accepts is denied again on their next
navigation, so acceptance achieves nothing beyond the current page. A working
banner needs three things, and the site currently has one:

1. ✅ A grant function.
2. ❌ Storage of the decision — a cookie or `localStorage` entry written on accept.
3. ❌ A read of that store on every page load that re-issues the update **before
   the container**, in the same head script as the defaults. Without this, step 2
   is decoration.

In GTM, tick **"Enable consent overview"** under Admin → Container Settings so
tags declare which signals they require — otherwise a tag can ignore the signal
entirely.

## Page-scoped context

Set in `<head>` before the container ([`src/components/PageContext.tsx`](../../src/components/PageContext.tsx)),
so the first `page_view` already carries it.

| Key | Values |
|---|---|
| `page_type` | `home`, `industry`, `industry-index`, `service`, `service-index`, `pricing`, `check`, `contact`, `blog`, `faq`, `about`, `other` |
| `industry` | one of the eight vertical slugs, or `none` |
| `content_group` | `page_type` title-cased — GA4 reads this natively |
| `tier_context` | always `none` today; a placeholder |

**It re-pushes on client-side navigation.** Twenty-six components link with
`next/link`, so most page changes never reload the document. A head script alone
runs once, at entry — someone landing on `/industries/med-spas/` and clicking to
`/pricing/` would stay tagged `industry=med-spas` for the whole session. The
classifier is exposed as `window.__fpPageContext()` and called again on every
route change, pushing `page_context_change`.

Both halves call the same function rather than reimplementing the rules, so
they cannot drift. In GTM, fire the GA4 page_view on `page_context_change` as
well as on container load, or SPA navigations go uncounted.

`page_type` has exactly **one** writer. Click events deliberately do not set it —
two vocabularies on one GA4 dimension produces reports that disagree with
themselves. Clicks carry `page_slug` instead, which nothing else writes and
which keeps the granularity this coarser classifier drops (which post, which
service).

## What the site emits

### `click` — every clickable element, everywhere

One delegated listener ([`src/components/ClickTracking.tsx`](../../src/components/ClickTracking.tsx))
catches clicks at the document and walks up to the nearest link or button. That
includes links inside blog post bodies, which are rendered from markdown and
have no JSX to attach a handler to.

| Key | Example | Notes |
|---|---|---|
| `click_id` | `hero-primary-visibility-check` | Stable name. Explicit where it matters, otherwise derived from section + text. |
| `click_type` | `cta` | `cta`, `nav`, `footer`, `breadcrumb`, `card`, `toc`, `inline`, `social`, `citation`, `control`, `link` |
| `click_text` | `Get your free visibility check` | Visible label, or `aria-label` for icon-only links. |
| `click_url` | `/contact/` | The raw href, not the resolved URL. |
| `click_section` | `how-ai-decides` | Nearest section id or heading. |
| `click_region` | `main` | `header`, `main`, `footer`. |
| `click_destination` | `internal` | `internal`, `external`, `anchor`, `mailto`, `tel` |
| `page_slug` | `personal-injury-law` | The vertical, service or post slug. `page_type` is **not** set here — see above. |

### `generate_lead` — a real inquiry

Fired twice over, from two different places, because the two forms succeed
differently:

- **Contact form.** Fired on `/contact/thank-you/`, not on the button. Formspree
  only redirects there on success, so this counts submissions that landed rather
  than attempts — which would include validation failures and honeypot catches.
  Params: `lead_source: "contact_form"`.
- **Scorecard plan request.** Fired on a successful `fetch`, with
  `lead_source: "scorecard_plan_request"`, `scorecard_score`, `scorecard_band`.

### Scorecard events

| Event | Params | Why |
|---|---|---|
| `scorecard_answer` | `scorecard_question` (1–10), `scorecard_total_questions` | The drop-off curve. Question number only — **not** the answer given. |
| `scorecard_complete` | `scorecard_score`, `scorecard_max`, `scorecard_band`, `scorecard_answered`, `scorecard_partial` | Score distribution, and how many bail before finishing. |
| `form_error` | `form_name` | A failing endpoint otherwise looks identical to nobody trying. |

We deliberately don't record which weaknesses a business admitted to. Question
number tells us where the tool loses people, which is the actionable fact;
per-answer data attached to an email address would be a different and much less
defensible thing to collect.

## What to build in GTM

**1. Variables.** One Data Layer Variable per key above — Variables → New →
Data Layer Variable, name it exactly as the key. Fifteen of them. Version 2,
leave the default value empty.

**2. Triggers.** Custom Event triggers matching each event name: `click`,
`generate_lead`, `scorecard_answer`, `scorecard_complete`, `form_error`,
`page_context_change`, `fp_consent_granted`.

Do **not** use GTM's built-in "All Elements" click trigger with CSS selector
conditions. Those break on a Tailwind class change; `data-track-id` cannot.

**3. Tags.** A GA4 Configuration tag with your Measurement ID, then GA4 Event
tags per trigger, passing the matching variables as event parameters.

**4. Register custom dimensions in GA4.** Admin → Custom definitions. Parameters
not registered there are collected and then not shown in any report, which looks
exactly like the tracking being broken. Register at minimum `click_id`,
`click_type`, `page_type`, `industry`, `page_slug`, `lead_source`, `scorecard_band`.
`content_group` is native to GA4 and needs no registration.

**5. Mark `generate_lead` as a key event** in GA4 Admin → Events.

## Adding a new link later

Nothing is required. The listener finds it and derives an id from its section
and text.

Add an explicit `data-track-id` only when the number is one you'll report on —
a derived id changes the day someone rewrites the button copy, which splits the
metric in GA4 without anything visibly breaking.

```tsx
<Link href="/pricing/" data-track-id="my-stable-name" data-track-type="cta">
```

`data-track-ignore` on an ancestor excludes a subtree.

## What is enforced

[`scripts/check-tracking.mjs`](../../scripts/check-tracking.mjs), wired into
`pnpm verify`, fails the build on: malformed or empty ids, ids containing
`undefined`, the same id twice on one page, a missing sitewide or
route-required id, duplicated `<main>`/`<header>`/`<footer>` landmarks, and a
Consent Mode default that is missing from `<head>` or ordered after the
container, and a missing or mis-ordered `fpConsentGrant`.

That last rule exists because `/blog/industry/<slug>/` shipped with two of each
— the page rendered its own shell inside a layout that already supplied one.
It doubled every nav and footer link in those pages' link graphs and went
unnoticed until the tracking work counted the ids.

## Still to do

- Create the GA4 property and put its Measurement ID in the configuration tag.
  Until that exists the container delivers nothing.
- Verify in GTM Preview mode. The pure logic has unit tests and the emitted HTML
  is gated, but the listener's behaviour in a real browser has not been observed.
- Search Console verification, which is where query data comes from.
- A consent banner, if consent is ever to be granted. See "The grant half".
- A privacy policy. The site now has GTM, a form, and no `/privacy/` page.
