// URL parity between the static export and the WordPress build.
//
// This is the gate that decides whether cutover is safe. Every URL the live
// site publishes must return 200 from WordPress — a 404 on any of them is a
// ranked page thrown away, and the 301 that would have to follow is a
// permanent tax on that page's authority.
//
// Compares against out/, which is the actual deployed artefact rather than a
// list anybody maintains by hand.
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
const BASE = process.env.WP_BASE ?? "http://localhost:8080";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : e.name === "index.html" ? [full] : [];
  });
}

// /404/ and /_not-found/ are Next.js build artefacts, not URLs the site
// publishes — nothing links to them and no crawler has them indexed. WordPress
// serves its own 404 for unknown paths, which is the correct behaviour.
const ARTEFACTS = new Set(["/404/", "/_not-found/"]);

const routes = walk(OUT)
  .map((f) => "/" + path.relative(OUT, f).replace(/index\.html$/, "").replace(/\\/g, "/"))
  .filter((r) => !ARTEFACTS.has(r))
  .sort();

const results = await Promise.all(
  routes.map(async (route) => {
    try {
      const res = await fetch(BASE + route, { redirect: "manual" });
      return { route, status: res.status, location: res.headers.get("location") };
    } catch (e) {
      return { route, status: 0, error: String(e) };
    }
  })
);

const ok = results.filter((r) => r.status === 200);
const missing = results.filter((r) => r.status !== 200);

console.log(`\n${routes.length} live URLs checked against ${BASE}`);
console.log(`  ${ok.length} resolve`);
console.log(`  ${missing.length} do not\n`);

for (const m of missing) {
  console.log(`  ${String(m.status).padEnd(4)} ${m.route}${m.location ? ` -> ${m.location}` : ""}`);
}

// PHP notices never appear in the response body — WP_DEBUG_DISPLAY is off, so
// they go only to debug.log. Grepping the HTML for "Warning:" reported a clean
// sweep while page-glossary.php was emitting one on every request. Reading the
// log is the only check that actually sees them.
console.log("Now check the log for notices this sweep cannot see:");
console.log("  docker compose -f wp/docker/docker-compose.yml exec -T wordpress cat /var/www/html/wp-content/debug.log\n");

process.exit(missing.length ? 1 : 0);
