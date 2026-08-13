# WordPress cutover — COMPLETE (2026-08-13)

frontpaged.io is live on WordPress. 51 of 51 URLs are served by the theme,
Lighthouse reads 100 / 100 / 96 / 100 on the homepage, LCP 0.5s, 615 KiB.

## How the cutover actually happened, and the mistake in it

It was not executed as the ordered plan below. `wp rewrite flush --hard`
rewrote `.htaccess` — `--hard` writes the file, plain `flush` does not — and
Hostinger's DirectoryIndex prefers `index.php`, so the homepage switched to
WordPress the moment that ran. That was unintended.

Two things broke for roughly fifteen minutes and were then fixed:

- **The redirects vanished.** WordPress's generated `.htaccess` replaced the
  static one, taking the www→apex rule and the `/med-spa-seo-*` and
  `/services/med-spa-seo/` 301s with it. Those URLs returned 404 until
  `wp/htaccess/.htaccess` was installed.
- **The site served a mix.** Only the homepage moved. WordPress routes to
  `index.php` solely when no matching FILE exists, so every inner URL kept
  serving the stale `index.html` left by the last static deploy — with the old
  med-spa-era `<h1>` on it. A URL check reported "51 resolve" while testing the
  static leftovers rather than WordPress at all.

The lesson worth keeping: **`--hard` on `wp rewrite flush` is a live-site
change, not a cache operation.**

The static export was tarred to `~/static-site-backup-*.tar.gz` on the server
before removal, and remains regenerable from the `deploy` branch.

## Original runbook

The build is complete and verified locally. This is what remains, in order.
Nothing here has been done — production is still serving the static export.

## Where it stands

| | Static export | WordPress |
|---|---|---|
| Performance | 93–100 | **100** on all five sampled pages |
| Accessibility | 96 | **100** |
| Best practices | 77–100 | **100** |
| SEO | 100 | **100** |
| LCP (homepage) | 1.8 s | **0.5 s** |
| Page weight | 3,703 KiB | **614 KiB** |

WordPress is faster, which was not the expected result. The static export ships
the full Next.js runtime and hydrates React on every page; this theme ships one
stylesheet, ~1KB of JavaScript for the scroll reveal, and nothing else. Both
were measured on the same machine and the same Chrome, served locally, so the
comparison isolates the two codebases rather than two hosts.

That advantage is contingent on the server. Hostinger with LiteSpeed Cache
serving a full-page cache should hold it. An uncached PHP install will not.

**Verify after cutover, not before**, because these numbers were taken against
Docker on a laptop: re-run Lighthouse against the live domain once DNS moves.

## One deliberate visual change

`--color-teal` moved from `#2e8b8b` to `#277878`.

The original fails WCAG AA in both directions it is used — 3.79:1 as text on
cream, 4.05:1 behind white button text, against a 4.5 requirement. It is the
accent on every CTA, eyebrow label and the wordmark, so the failure was on every
page. This is pre-existing and not caused by the migration; the live site has
it today.

`#277878` clears 4.5 both ways (4.86 and 5.19) and still reads as the same
teal. Timestamp text also moved from `text-warm-grey/80` (3.64:1) to the full
`text-warm-grey` (5.60:1).

Revert either in `wp/themes/frontpaged/assets/css/input.css` to restore the
previous appearance and the previous failure.

## Deploying from GitHub

The static workflow force-pushes the whole of `out/` over `public_html`,
because the repository produces every byte the server serves. **WordPress
cannot be deployed that way.** The repo produces two directories of code;
WordPress core, `wp-config.php`, `wp-content/uploads` and the database live on
the server and are not in git. Mirroring the repo over `public_html` would
delete the uploads folder, the database credentials and every admin-installed
plugin.

`.github/workflows/deploy-wordpress.yml` syncs exactly two directories and
touches nothing else:

```
wp/themes/frontpaged/        ->  wp-content/themes/frontpaged/
wp/plugins/frontpaged-core/  ->  wp-content/plugins/frontpaged-core/
```

It builds the Tailwind CSS, runs `php -l` over every PHP file, checks the theme
has its required files, deploys, then smoke-tests four live URLs and fails if
any is not a 200.

**Disconnect the existing Hostinger Git deployment first.** It currently owns
`public_html` and checks out the `deploy` branch there. Left connected, it will
fight the WordPress install — at best reverting files, at worst wiping it.

### Setting up SSH deploy

A dedicated deploy keypair has been generated at `wp/secrets/hostinger_deploy`
(gitignored — this repository is public, and the private half must never be
committed).

**1. Authorise the public key on Hostinger.**
hPanel → Advanced → SSH Access → Manage SSH keys → Add key. Paste:

```
wp/secrets/hostinger_deploy.pub
```

Note the **host, username and port** shown on that page — Hostinger uses port
`65002`, not 22.

**2. Add the GitHub secrets.** `HOSTINGER_SSH_KEY` and `HOSTINGER_SSH_PORT` are
already set. For the rest, run:

```
./wp/setup-deploy.sh <ssh-host> <ssh-user>
```

It connects, reports the server's PHP version and whether WP-CLI is present,
locates `wp-content` by testing the real candidate paths rather than assuming
one, checks `themes/` is writable, and only then writes the secrets. Nothing is
stored that has not been proven.

That order matters: rsync creates missing directories without complaining, so a
wrong `wp-content` path produces a deploy that reports success and puts the
theme somewhere WordPress never looks — a failure invisible until someone asks
why the site looks unchanged.

To set them by hand instead — Settings → Secrets and variables → Actions:

| Secret | Where to find it | Example |
|---|---|---|
| `HOSTINGER_SSH_HOST` | hPanel → SSH Access | `123.45.67.89` |
| `HOSTINGER_SSH_USER` | hPanel → SSH Access | `u123456789` |
| `HOSTINGER_SSH_PORT` | hPanel → SSH Access | `65002` |
| `HOSTINGER_SSH_KEY` | `pbcopy < wp/secrets/hostinger_deploy` | the whole private key including BEGIN/END lines |
| `HOSTINGER_WP_CONTENT` | absolute path on the server | `/home/u123456789/domains/frontpaged.io/public_html/wp-content` |

**3. Confirm the path before the first deploy.** rsync will happily create a
wrong directory and report success:

```
ssh -p 65002 -i wp/secrets/hostinger_deploy u123456789@HOST \
  'ls -d ~/domains/frontpaged.io/public_html/wp-content/themes'
```

**4. Optionally set `WP_SMOKE_URL`** (a repository *variable*, not a secret) to
a staging URL while testing. It defaults to `https://frontpaged.io`, which still
serves the static export until DNS moves — the smoke test reports that as a
warning rather than a false pass.

### Re-importing content

Content is not deployed by git. Run the workflow manually from the Actions tab
with **"Also re-import content"** ticked, which exports from `src/lib` and
`content/blog`, rsyncs the data, and runs the importer over SSH.

Do this only when the source content changed. It matches on slug and updates in
place, so it will overwrite edits made in the WordPress admin.

### What still is not deployed by git

Content. The theme and plugin are code; the 56 posts and 8 industries live in
the database. Run the importer once after the first deploy, and again only when
`src/lib/*` or `content/blog/*` changes:

```
pnpm wp:export
wp eval-file wp-content/migration/import.php
```

## Before you switch DNS

1. **There is no PHP to "fix".** Hostinger runs LiteSpeed with PHP already —
   the site simply never invokes it, because it is serving `.html` files. What
   is missing is a database and a WordPress install. In hPanel:
   - **Advanced → PHP Configuration**: set PHP to **8.1 or newer** (the plugin
     declares `Requires PHP: 8.1` and uses `match` and enums).
     Raise `memory_limit` to 256M while you are there.
   - **Databases → MySQL**: create a database and a user, and note both.
   - **Website → Auto Installer**: install WordPress into `public_html`.
   - **Disconnect the Git deployment** under Advanced → GIT first, or it will
     overwrite the install.
2. **Install WordPress**, then copy `wp/themes/frontpaged` and
   `wp/plugins/frontpaged-core` into `wp-content/`.
3. **Install ACF Pro** and activate the licence against `frontpaged.io`. It
   currently reports `inactive` because activation binds to a domain; that
   governs updates only, not functionality. Expiry 2027-08-13.
4. **Set permalinks to `/blog/%postname%/`.** Every custom rewrite assumes this,
   and the author archive fix depends on `/blog/` being the permalink front.
5. **Import the content:**
   ```
   pnpm wp:export                     # regenerates wp/migration/data
   wp eval-file wp-content/migration/import.php
   ```
   The import is idempotent — matched by slug, updated in place — so it can be
   rehearsed and re-run.
6. **Set the author's `user_nicename` to `benton-purvis`.** The Person entity
   that 56 bylines reference lives at `/author/benton-purvis/`.
7. **Run the URL parity check against the staging host:**
   ```
   WP_BASE=https://your-staging-host pnpm wp:urls
   ```
   It must report 51 of 51. Anything less is a ranked page about to 404.
8. **Read the debug log.** PHP notices never appear in the response body when
   `WP_DEBUG_DISPLAY` is off, so grepping the HTML proves nothing — a sweep
   reported zero errors across 53 routes while a warning fired on every one of
   them. Read `wp-content/debug.log` directly.

## Switching

9. Point DNS at the PHP host.
10. **Re-run Lighthouse against the live domain.** If performance drops sharply,
    the cache is not serving — enable LiteSpeed Cache full-page caching before
    anything else.
11. **Resubmit the sitemap** in Search Console. `/sitemap.xml` and `/rss.xml`
    keep their existing URLs (served in place, not redirected, because a
    redirected sitemap reports as an error and a redirected feed may not be
    re-followed).
12. **Watch GA4 for 48 hours.** Every dataLayer key the container reads is
    preserved, so a step change means something is wrong, not that traffic moved.

## Rollback

The static export is untouched in `out/` and on the `deploy` branch. Rolling
back is a DNS change, and no WordPress content is lost by doing it.

## Known gaps

- **The founder photo and the six baseline screenshots** are still missing.
  They were missing before this migration too.
- **No `/privacy/` page.** The site runs GTM and a third-party form without one.
- **Attribution capture is off.** `RESPECT_CONSENT` in `AttributionCapture.tsx`
  gates the `fp_click` cookie, and no consent state is declared, so `gclid`
  never reaches the booking record. The container declares an `fp_click`
  variable that will read empty until this is decided.
- **Visual diff not performed.** Layouts were ported from the components rather
  than compared screenshot by screenshot. Worth a pass on a staging host.
