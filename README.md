# frontpaged-site

Source for [frontpaged.io](https://frontpaged.io): an SEO and Generative Engine
Optimization agency for high-ticket local businesses.

**The live site is WordPress.** This repository holds three things:

| Directory | What it is |
|---|---|
| `wp/themes/frontpaged/`, `wp/plugins/frontpaged-core/` | The classic theme and the plugin that together render the live site. Deployed by GitHub Actions on push |
| `content/`, `src/lib/` | The content and brand data: posts, industry hubs, the privacy policy, pricing bands, FAQs, glossary. Exported to JSON and imported into WordPress by hand |
| `src/app/`, `scripts/`, `tests/` | The original Next.js static site, kept as the authoring environment. Its build is the SEO test bench: `pnpm verify` renders every page and checks titles, descriptions, schema, links and tracking |

[CLAUDE.md](CLAUDE.md) explains how the pieces relate and what not to do.
[docs/wordpress/cutover.md](docs/wordpress/cutover.md) is the operating manual.

## Development

```bash
export PATH="$HOME/.local/node/bin:$PATH"
pnpm install
pnpm dev            # Next.js authoring environment at http://localhost:3000
pnpm verify         # the full gate; run before every commit
pnpm wp:css:watch   # rebuild the theme stylesheet while editing PHP templates
```

A local WordPress for theme work is in `wp/docker/docker-compose.yml`.

## Deploying

**Theme and plugin** deploy automatically: any push to `main` that touches `wp/themes/**`
or `wp/plugins/**` runs `.github/workflows/deploy-wordpress.yml`, which builds the CSS,
lints the PHP, rsyncs the two directories over SSH to Hostinger and smoke-tests four live
URLs.

**Content** does not. When `content/` or `src/lib/` changes, run the same workflow from
the Actions tab with **"Also re-import content"** ticked. The importer matches on slug and
updates in place, so it is safe to re-run and will overwrite edits made in the admin.
Check `content/blog/*.md` dates against the live site before doing so; see the cutover doc.

The static deploy in `.github/workflows/deploy.yml` is disabled and must stay that way
while WordPress serves `public_html`.

## Audit CLI

`pnpm visibility` runs the AI-visibility prompt battery for a prospect through the
Perplexity API and writes a scored report. See [audit/README.md](audit/README.md).
