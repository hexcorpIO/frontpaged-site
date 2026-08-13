# GTM setup for frontpaged.io

Container `GTM-NBL9BS2M`. The site pushes a structured dataLayer; this is what to
build in the GTM UI to read it.

Nothing here is configured in the repo on purpose. A static export has to be
rebuilt and redeployed for any code change, and measurement changes far more
often than the site does — so the code emits data and GTM decides what to do
with it.

## Consent Mode

Not implemented. The default and grant scripts were removed, so the site
declares no consent state and GTM operates unrestricted, as it does on any site
with no consent framework.

One consequence, because it is easy to miss: `RESPECT_CONSENT` in
`AttributionCapture.tsx` is still `true` and reads consent from the dataLayer.
With no consent command ever pushed, it never permits storage — so **no
`fp_click` cookie is written and no `gclid` or `utm_*` reaches the booking
record.** See "Consent gate" below.

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

Fired from one place only:

- **Contact form.** Fired on `/contact/thank-you/`, not on the button. Formspree
  only redirects there on success, so this counts submissions that landed rather
  than attempts — which would include validation failures and honeypot catches.
  Params: `lead_source: "contact_form"`.
The scorecard's email share is **not** a `generate_lead` — see below.

### AI readiness check (the quiz)

All categorical. **No individual Yes/Partly/No answer is ever pushed**, and the
email address is never pushed — if it is ever needed for Enhanced Conversions it
gets hashed server-side in sGTM.

| Event | `check.*` params | Fires |
|---|---|---|
| `check_start` | `industry` | On the first answer selected, once. |
| `check_progress` | `questions_answered`, `industry` | On reaching question 5 of 10, once. |
| `check_complete` | `score_bucket`, `questions_answered`, `industry` | On "See my results". |
| `check_email_share` | `score_bucket`, `questions_answered`, `industry` | On a successful plan-request submit. |
| `result_cta_click` | `check.score_bucket`, `cta_location: "results"` | On the results-block CTA. |
| `form_error` | `form_name` | A failing endpoint otherwise looks like nobody trying. |

`check` is a nested object. In GTM use dot notation on the Data Layer Variable —
`check.score_bucket` — because GA4 cannot take a nested object as an event
parameter.

#### Score buckets

The brief proposed 70/40 and then said to match the real grading. The real
grading is four bands at **80/55/30**, so the buckets are:

| Percent | Band shown on screen | `score_bucket` |
|---|---|---|
| ≥ 80 | Well positioned | `strong` |
| ≥ 55 | Partly ready | `some-gaps` |
| ≥ 30 | Significant gaps | `at-risk` |
| < 30 | Not yet legible | `at-risk` |

The bottom two bands share a bucket — "significant gaps" and "not yet legible"
are the same sales conversation. The bucket is a **property of each band** in
`src/lib/scorecard.ts`, not a second set of thresholds beside them, so a report
can never describe a different grade than the visitor was shown. Tests assert
that across the entire score range.

#### `check_start` counts answers, not clicks

Questions are answerable in any order and answers can be changed. Counting from
the question index would re-fire `check_start` every time someone revised
question one, and miss the halfway mark for anyone who answered out of order.
Both fire on the transition into a count, once each.

#### `check_email_share` is not `generate_lead`

Sharing an email to receive a plan is a softer signal than the contact form,
where someone describes their problem and asks for a reply. Marking both as the
same key event would inflate the number the business is managed on. `generate_lead`
stays the contact form only.

### `consultation_booked` — a Calendly booking

| Key | Value |
|---|---|
| `scheduler` | `calendly` |
| `industry` | vertical slug or `none` |

Fired from a `message` listener that checks `e.origin` contains `calendly.com`
before trusting anything — any page can postMessage into this window, and
without the check a third-party frame could fabricate a booking. Registered once
per document, not once per widget: two schedulers can appear on one page and a
single booking must not push twice.

This is the most valuable event on the site. Mark it a key event in GA4.

## Click attribution

`utm_*` and the ad click id are captured from the landing URL into an `fp_click`
cookie, then rebuilt onto the Calendly URL so they land in the booking record
and the webhook — which is how an ad click reaches the CRM.

| Slot | Carries |
|---|---|
| `utm_source`, `utm_medium`, `utm_campaign` | passed through untouched |
| `utm_content` | `gclid:<value>` — Calendly has no field of its own for it |
| `utm_term` | the industry slug |

`utm_term` and `utm_content` are therefore **repurposed**: whatever was on the
landing URL in those two slots is overwritten. The other three are left alone.

Whichever of `gclid` / `wbraid` / `gbraid` is present is used, in that order —
Google sets a different one per surface (Search, iOS web-to-app, iOS app-to-web).

**Last touch, but only on a real click.** A visit carrying no parameters leaves
the stored value alone, so an ad click followed by a direct return visit does
not erase the gclid before the person books. This mirrors Google's own `_gcl_aw`.

### The cookie was never being written

The snippet this came from reads `fp_click`; nothing had ever written one. As
supplied it returned `{}` on every visit and no attribution reached Calendly —
silently, because an empty object is also what a legitimate direct visit
produces. `src/lib/attribution.ts` and `AttributionCapture.tsx` are the missing
half.

### Consent gate — attribution is currently inert

`RESPECT_CONSENT` in `AttributionCapture.tsx` is `true`, and it permits storage
only after a `consent` command grants `ad_storage`. Since the consent scripts
were removed, no such command is ever pushed, so **the cookie is never written**
and `gclid` / `utm_*` never reach Calendly. `utm_term=<industry>` still arrives,
because it is derived at render time rather than read from storage.

It was left off rather than flipped as a side effect of removing the consent
scripts: storing advertising identifiers expands what the site collects, and
that should be chosen on purpose — ideally alongside a privacy policy, which
this site still does not have.

**To turn attribution on: set `RESPECT_CONSENT` to `false`.** One line.

### Cal.com

Not implemented. The site uses Calendly in two places and Cal.com nowhere, so
the 7B variant would have been dead code.

## What to build in GTM

**1. Variables.** One Data Layer Variable per key above — Variables → New →
Data Layer Variable, name it exactly as the key. Fifteen of them. Version 2,
leave the default value empty.

**2. Triggers.** Custom Event triggers matching each event name: `click`,
`generate_lead`, `scorecard_answer`, `scorecard_complete`, `form_error`,
`page_context_change`, `check_start`, `check_progress`,
`check_complete`, `check_email_share`, `result_cta_click`, `consultation_booked`.

Do **not** use GTM's built-in "All Elements" click trigger with CSS selector
conditions. Those break on a Tailwind class change; `data-track-id` cannot.

**3. Tags.** A GA4 Configuration tag with your Measurement ID, then GA4 Event
tags per trigger, passing the matching variables as event parameters.

**4. Register custom dimensions in GA4.** Admin → Custom definitions. Parameters
not registered there are collected and then not shown in any report, which looks
exactly like the tracking being broken. Register at minimum `click_id`,
`click_type`, `page_type`, `industry`, `page_slug`, `lead_source`, `score_bucket`.
`content_group` is native to GA4 and needs no registration.

**5. Mark `generate_lead` and `consultation_booked` as key events** in GA4
Admin → Events.

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
- A privacy policy. The site now has GTM, a form, and no `/privacy/` page.
