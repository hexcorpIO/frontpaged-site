# Deploy: Coolify on the Hostinger VPS

This app is a **dynamic** Next.js server (not a static export). It runs on the
Hostinger VPS via Coolify, which builds from the GitHub repo and serves the
Node server behind a reverse proxy with automatic SSL.

## 1. Install Coolify on the VPS
- hPanel -> VPS -> your server -> **Choose what to install** -> **Application** -> **Coolify**
  (or pick **Plain OS = Ubuntu 22.04** and run Coolify's installer:
  `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`).
- Open Coolify at `http://<VPS_IP>:8000` and create the admin account.

## 2. Connect the repo
- Coolify -> **Projects -> New** -> **Public Repository** (or install the GitHub App for
  private repos) -> URL `https://github.com/hexcorpIO/frontpaged-site`, branch `main`.
- Build pack: **Nixpacks** (auto-detects Next.js). It runs `pnpm install`, `pnpm build`,
  then `pnpm start`. Exposed port: **3000**.

## 3. Set environment variables (Coolify -> app -> Environment Variables)
- `SMTP_HOST=smtp.hostinger.com`
- `SMTP_PORT=465`
- `SMTP_USER=hello@frontpaged.io`
- `SMTP_PASS=<the hello@frontpaged.io mailbox password>`
- `LEAD_TO=hello@frontpaged.io`
- `LEAD_FROM=hello@frontpaged.io`

## 4. First deploy on a temporary domain
- Set the app's domain to the Coolify-provided URL or a subdomain `app.frontpaged.io`
  (add an A record `app` -> `<VPS_IP>` in Hostinger DNS).
- Click **Deploy**. Wait for build -> running.

## 5. End-to-end test (do this BEFORE cutover)
- Open the temp URL and submit the form from each entry point:
  - Home (`/`) free-check -> submit -> confirm the "Thanks" UI and that an email arrives
    at hello@frontpaged.io with Plan = "Free visibility check".
  - `/?plan=authority#contact` -> submit -> email shows Plan = "Authority".
- Confirm the email is not spam-filed (sending from the domain's own mailbox should pass
  SPF/DKIM). If deliverability is poor, switch the transport to Resend (see the spec's
  "Risks" section).

## 6. Cut over the apex domain
- In Coolify, set the app domain to `https://frontpaged.io` (and `www`). Enable SSL
  (Let's Encrypt) — Coolify provisions the certificate automatically.
- In Hostinger DNS, point the apex **A record** `@` -> `<VPS_IP>` (and `www`).
- After DNS propagates, verify `https://frontpaged.io` serves the app over HTTPS and the
  form still emails you.
- Enable **auto-deploy**: Coolify gives a webhook URL -> add it to the GitHub repo under
  Settings -> Webhooks (push event). Now every push to `main` redeploys.
- Decommission the old static site once the cutover is confirmed.

## Local development
- `pnpm install`
- copy `.env.example` to `.env` and fill `SMTP_PASS` (and adjust others if needed)
- `pnpm dev` -> http://localhost:3000
- `pnpm test` runs the unit tests; `pnpm build` then `pnpm start` runs a production server locally.
