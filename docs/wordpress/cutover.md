# WordPress cutover runbook

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

### Secrets to add (Settings → Secrets and variables → Actions)

SSH (Business plans and above, faster):

| Secret | Example |
|---|---|
| `HOSTINGER_SSH_HOST` | `123.45.67.89` |
| `HOSTINGER_SSH_USER` | `u123456789` |
| `HOSTINGER_SSH_PORT` | `65002` |
| `HOSTINGER_SSH_KEY` | contents of a private key whose public half is in hPanel → SSH Access |
| `HOSTINGER_WP_CONTENT` | `/home/u123456789/domains/frontpaged.io/public_html/wp-content` |

Then add a repository **variable** `HOSTINGER_TRANSPORT` = `ssh`.

FTP (any plan) — leave `HOSTINGER_TRANSPORT` unset and add:

| Secret | Example |
|---|---|
| `HOSTINGER_FTP_HOST` | `ftp.frontpaged.io` |
| `HOSTINGER_FTP_USER` | from hPanel → Files → FTP Accounts |
| `HOSTINGER_FTP_PASSWORD` | |
| `HOSTINGER_WP_CONTENT` | `/public_html/wp-content` (FTP paths are relative to the FTP root) |

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
