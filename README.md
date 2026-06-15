# frontpaged-site

A [Next.js](https://nextjs.org) 16 + [Tailwind CSS](https://tailwindcss.com) site,
configured as a **static export** for hosting on **Hostinger**.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Build

```bash
pnpm build      # outputs static site to ./out
pnpm preview    # build, then serve ./out locally to test the real output
```

The site is configured with `output: "export"` in [`next.config.ts`](next.config.ts),
so `pnpm build` produces a fully static `out/` folder (HTML/CSS/JS) — no Node.js
server is required at runtime.

> **Static-only constraints:** no SSR, Server Actions, dynamic API routes, cookies,
> redirects/rewrites/headers, or default `next/image` optimization. See
> `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` for the full list.

## Deploy to Hostinger

The `out/` folder is everything that goes into your site's `public_html`.
An [`.htaccess`](public/.htaccess) (404 page, compression, cache headers) is
included in the export automatically.

### Option A — File Manager (simplest)

```bash
pnpm package    # builds and creates frontpaged-site.zip
```

1. hPanel → **Files → File Manager** → open `public_html`.
2. Upload `frontpaged-site.zip`, then **Extract** it there.
3. Delete the zip. (Make sure the extracted files land directly in
   `public_html`, not in a nested `out/` subfolder.)

### Option B — FTP / SFTP

Upload the **contents** of `out/` (including the hidden `.htaccess`) into
`public_html` with FileZilla or any FTP client, using the FTP credentials from
hPanel → **Files → FTP Accounts**.

### Redeploying

Re-run `pnpm build` (or `pnpm package`) and re-upload — overwrite the old files.
