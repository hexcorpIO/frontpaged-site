# frontpaged-site

A [Next.js](https://nextjs.org) 16 + [Tailwind CSS](https://tailwindcss.com) marketing
site for **Frontpaged.io** — an agency providing SEO + Generative Engine Optimization
(GEO) content for medical spas in Dallas–Fort Worth.

It is a **dynamic** Next.js app (App Router + Server Actions): the "free visibility check"
and plan-signup CTAs open a lead form that emails submissions to hello@frontpaged.io.

## Development

```bash
pnpm install
cp .env.example .env   # then fill in SMTP_PASS
pnpm dev               # http://localhost:3000
```

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — run the production server (after build)
- `pnpm test` — run unit tests (Vitest)
- `pnpm lint` — run ESLint

## Lead form

`LeadForm` (client) submits to the `submitLead` server action, which validates with zod,
drops honeypot spam, and sends an email via Nodemailer + Hostinger SMTP. Required env vars
are documented in [.env.example](.env.example).

## Deployment

Deployed on a Hostinger VPS via Coolify with Git-based auto-deploy. See
[docs/deploy-coolify.md](docs/deploy-coolify.md).
