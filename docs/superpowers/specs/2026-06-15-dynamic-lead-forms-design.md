# Design: Dynamic Frontpaged with lead/intake forms

**Date:** 2026-06-15
**Status:** Approved (pending spec review)

## Summary

Convert the Frontpaged.io marketing site from a static export into a dynamic
Next.js application so it can handle **lead/intake forms**. Visitors submit a
"free visibility check" form (from the hero/header/contact CTAs) or a
**plan-signup** form (from the Pricing cards, with the chosen tier preselected).
Each submission is validated server-side and **emailed to `hello@frontpaged.io`**.

No accounts, no payments, no database in this scope. The app is deployed on the
user's **Hostinger VPS** via **Coolify** (self-hosted PaaS), with Git-based
auto-deploy and Let's Encrypt SSL.

## Goals

- Working lead-capture forms that reliably deliver submissions to the owner's inbox.
- Preserve the existing site exactly — components, copy, styling, SEO/metadata,
  OG image, JSON-LD all unchanged.
- A real Node backend the project can grow into later (DB, Stripe, accounts) without
  re-platforming.
- Low ongoing operational burden (managed-ish via Coolify, not hand-rolled nginx/pm2).

## Non-goals (explicitly out of scope)

- User accounts / authentication.
- Online payments / Stripe / subscriptions.
- Storing leads in a database or an admin dashboard (email-only for now).
- Auto-reply email to the lead (may be added later; not in v1).
- CRM / spreadsheet integrations.

## Decisions (from brainstorming)

| Question | Decision |
|----------|----------|
| What does "sign up for a plan" do? | Lead/intake form (no payment, no account) |
| Where do leads go? | Email to `hello@frontpaged.io` (single recipient) |
| Architecture | Dynamic Next.js on the user's Hostinger **VPS** |
| VPS provisioning | Fresh VPS → install a self-hosted PaaS (**Coolify**; Dokploy as fallback) |
| Email transport | Nodemailer → Hostinger SMTP (existing `hello@frontpaged.io` mailbox) |
| Auto-reply to lead | No (v1) |

## Architecture

### 1. Static → dynamic conversion

- Remove `output: "export"` from `next.config.ts`. The app builds with `next build`
  and runs with `next start` (long-lived Node server).
- Remove static-export-only workarounds:
  - `export const dynamic = "force-static"` from `robots.ts`, `sitemap.ts`,
    `opengraph-image.tsx` (no longer required; these render fine on a server).
  - `public/.htaccess` (LiteSpeed/Apache static-host config; irrelevant behind
    Coolify's proxy + the Next server).
  - `package.json` `preview`/`package` zip scripts.
  - `.github/workflows/deploy.yml` (the GitHub Action that publishes the `deploy`
    branch) and the `deploy` branch itself — Coolify builds from `main`.
  - `frontpaged-site.zip` / `out/` artifacts and their `.gitignore` lines become moot
    (harmless to leave the ignore lines).
- Keep `turbopack.root` pin in `next.config.ts`.
- `images.unoptimized` can revert to default; the site currently uses no
  `next/image` raster sources (logo is CSS), so this is cosmetic. Leave as-is unless
  it causes a build issue.

### 2. Forms

A single reusable **`LeadForm`** Client Component, rendered in two entry points:

- **Free visibility check** — opened by the header CTA, hero CTAs, and the contact
  band. No preselected plan ("Not sure / free check").
- **Plan signup** — opened by each Pricing card button, with `plan` preset to
  Visibility / Authority / Domination.

Fields:

| Field | Required | Notes |
|-------|----------|-------|
| Name | yes | |
| Clinic name | yes | |
| Email | yes | format-validated |
| Plan | yes | hidden/preset or a select; defaults to "Free visibility check" |
| Message | no | freeform |
| `company_website` (honeypot) | n/a | hidden; if filled → silently drop as spam |

Presentation: the form lives in the existing contact section. Pricing/hero/header
CTAs route to it (anchor + a preselected plan via state or query). Exact UX of "open
the form with a plan preselected" (single contact-section form whose plan field
updates, vs. a small modal) is an implementation detail to settle in the plan;
**default: one form in the contact section, plan set via a query param / client state
when a pricing CTA is clicked.**

Client states: idle → submitting (disabled + spinner) → success (confirmation
message, form reset) or error (inline message, allow retry). Built with a Server
Action + `useActionState`/`useFormStatus`.

### 3. Server Action + email

- A Server Action (e.g. `submitLead`) receives the form data, re-validates with
  **zod** server-side (never trust the client), checks the honeypot, and on success
  sends an email via **Nodemailer** using Hostinger SMTP.
- SMTP config (env vars / Coolify secrets):
  - `SMTP_HOST=smtp.hostinger.com`
  - `SMTP_PORT=465` (SSL) — `587` STARTTLS fallback
  - `SMTP_USER=hello@frontpaged.io`
  - `SMTP_PASS=<mailbox password>` (secret)
  - `LEAD_TO=hello@frontpaged.io` (recipient)
  - `LEAD_FROM=hello@frontpaged.io` (envelope from — same domain to pass SPF/DKIM)
- Email contents: subject like `New lead: <plan> — <clinic>`; body lists all fields
  plus a timestamp. `replyTo` set to the lead's email so the owner can reply directly.
- Failure handling: if SMTP send throws, the action returns an error state; the form
  shows "Something went wrong — email us directly at hello@frontpaged.io" so a lead is
  never silently lost. Errors are logged server-side. **No silent failures.**
- Basic abuse protection: honeypot (v1). Rate limiting / Cloudflare Turnstile noted as
  a future enhancement, not v1.

### 4. Deployment (Hostinger VPS + Coolify)

1. On the fresh VPS, install **Coolify** (Hostinger VPS "Application" template, or its
   install script). Dokploy is an acceptable equivalent if preferred.
2. In Coolify: create an application from the **GitHub repo**
   (`hexcorpIO/frontpaged-site`), branch `main`. Coolify auto-detects Next.js
   (Nixpacks) and runs build + start. A Dockerfile can be added later if more control
   is needed; not required for v1.
3. Set env vars/secrets (SMTP_*) in Coolify.
4. Enable auto-deploy (GitHub webhook) → push to `main` rebuilds & redeploys.
5. **Domain cutover (zero downtime):**
   - First validate on a Coolify temporary domain or an `app.frontpaged.io`
     subdomain; submit a real test lead and confirm the email arrives.
   - Then repoint `frontpaged.io` **A record** to the VPS IP. Coolify provisions
     Let's Encrypt SSL. The existing static site keeps serving until DNS flips.
   - Decommission the old static deployment after cutover is confirmed.

### 5. Cleanup & docs

- Retire static-deploy artifacts (Action, `deploy` branch, `.htaccess`, zip scripts).
- Update `CLAUDE.md`: document the dynamic architecture, the forms/Server Action/email
  flow, required env vars, and the Coolify/VPS deploy + DNS cutover.

## Components / units

| Unit | Responsibility | Depends on |
|------|----------------|------------|
| `LeadForm` (client) | Render form, manage submit/success/error UI, honeypot | Server Action |
| `submitLead` (server action) | Validate (zod), spam-check, send email, return result | `lib/mailer`, zod |
| `lib/mailer` | Nodemailer transport from env config; `sendLeadEmail()` | nodemailer, env |
| `lib/leadSchema` | zod schema + shared TS types for a lead | zod |
| Pricing/Hero/Header CTAs | Route to the form with optional preselected plan | `LeadForm` location |

## Data flow

Visitor clicks CTA → form (plan maybe preselected) → submit → Server Action →
zod validate + honeypot check → Nodemailer sends to `hello@frontpaged.io` via
Hostinger SMTP → success/error returned → UI confirmation. Owner replies from inbox
(`replyTo` = lead's email).

## Testing

- **Schema/unit:** zod `leadSchema` accepts valid leads, rejects missing/invalid
  fields; honeypot logic drops when filled.
- **Mailer:** `sendLeadEmail` builds correct recipient/subject/replyTo/body; SMTP
  transport mocked.
- **Server action:** valid input → calls mailer + returns success; invalid → returns
  field errors without sending; mailer throw → returns error state (no silent fail).
- **Manual E2E:** on the deployed Coolify app, submit a real lead from each entry
  point (free check + each plan) and confirm the email arrives with correct plan.

## Risks / open items

- **Hostinger SMTP deliverability:** sending from `hello@frontpaged.io` should pass
  SPF/DKIM if the domain's mail DNS is intact; verify the test email isn't spam-filed.
  Resend is the fallback transport if SMTP proves unreliable.
- **Coolify availability on the VPS template list:** if Coolify isn't offered,
  use Dokploy or install Coolify via its script on a Plain Ubuntu image.
- **DNS cutover:** moving the A record affects the live domain; mitigated by testing on
  a temp/subdomain first and flipping only after the email path is confirmed.
- **Mailbox password as a secret:** stored only in Coolify env, never committed.
