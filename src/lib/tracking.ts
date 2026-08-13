// Click-tracking vocabulary, shared by the runtime listener and its tests.
//
// The design goal is that nothing on the site is ever silently untracked. Rather
// than requiring every clickable element to carry a hand-written identifier —
// which works until someone adds a link and forgets — the listener derives a
// usable identifier for anything it finds, and explicit `data-track-id`
// attributes exist only to pin a STABLE name onto the handful of elements whose
// numbers we actually report on.
//
// The practical difference: rename the hero button's label and an auto-derived
// ID would change with it, splitting the metric in GA4. The dozen elements that
// matter commercially carry an explicit ID for exactly that reason. Everything
// else is derived and still shows up.

/** Everything pushed for a click. Keys are snake_case to match GA4 conventions. */
export type ClickPayload = {
  event: "click";
  click_id: string;
  click_type: ClickType;
  click_text: string;
  click_url: string;
  click_section: string;
  click_region: Region;
  click_destination: Destination;
  // No page_type here: PageContext owns that key at page scope. See the note in
  // ClickTracking — two writers with different vocabularies on one GA4
  // dimension is worse than one coarse writer.
  page_slug: string;
};

export type ClickType =
  | "cta" // a deliberate conversion action
  | "nav" // header / dropdown / mobile menu
  | "footer"
  | "breadcrumb"
  | "card" // industry, service, blog teaser
  | "toc" // in-page table of contents
  | "inline" // a link inside prose
  | "social"
  | "citation" // outbound source link on an industry page
  | "control" // a button that changes UI state rather than navigating
  | "link"; // anything unclassified

export type Destination = "internal" | "external" | "anchor" | "mailto" | "tel";

export type Region = "header" | "main" | "footer" | "unknown";

export type PageType =
  | "home"
  | "industry"
  | "industry-index"
  | "service"
  | "service-index"
  | "blog-post"
  | "blog-index"
  | "blog-industry"
  | "pricing"
  | "contact"
  | "thank-you"
  | "scorecard"
  | "about"
  | "author"
  | "faq"
  | "glossary"
  | "other";

/**
 * Lowercase, hyphenated, ASCII-only, capped at 48 characters.
 *
 * The cap matters: GA4 event parameter values are truncated at 100 bytes, and an
 * auto-derived ID is a section name plus link text. Long prose links would
 * otherwise collide after truncation and silently merge into one metric.
 */
export function slugify(input: string, maxLength = 48): string {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining accents left by NFKD
    .replace(/[‘’']/g, "") // don't turn "don't" into "don-t"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length <= maxLength) return slug;
  // Cut on a word boundary where one is available, so truncation stays legible.
  const cut = slug.slice(0, maxLength);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > maxLength / 2 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}

/**
 * Where a click sends the visitor. Read from the raw href attribute rather than
 * a resolved URL so that same-page anchors stay distinguishable from links to
 * another page — `element.href` would report both as absolute URLs.
 */
export function classifyDestination(rawHref: string, origin: string): Destination {
  const href = rawHref.trim();
  if (!href) return "internal";
  if (href.startsWith("mailto:")) return "mailto";
  if (href.startsWith("tel:")) return "tel";
  if (href.startsWith("#")) return "anchor";

  // Must precede the single-slash check below: "//cdn.example.com" is a
  // protocol-relative URL pointing off-site, not a root-relative path.
  if (href.startsWith("//")) return "external";
  if (href.startsWith("/")) return "internal";

  if (/^https?:\/\//i.test(href)) {
    if (!origin || !href.startsWith(origin)) return "external";
    // Same-origin absolute. The remainder still carries a path, so an in-page
    // link reads as "/#section" rather than "#section" — a fragment with
    // nothing but a root path in front of it is an anchor.
    const rest = href.slice(origin.length);
    return /^\/?#/.test(rest) ? "anchor" : "internal";
  }

  return "internal";
}

/**
 * Page identity from the URL path alone.
 *
 * Deriving this from the pathname rather than threading a prop through every
 * page component means a new route is categorised the moment it exists, and the
 * category can never disagree with the URL a visitor is actually on. The URL
 * taxonomy is stable and enforced by the link checker, so it is a safe source.
 */
export function pageContext(pathname: string): { pageType: PageType; pageSlug: string } {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) return { pageType: "home", pageSlug: "home" };

  const [first, second, third] = parts;
  const slug = parts[parts.length - 1];

  switch (first) {
    case "industries":
      return second
        ? { pageType: "industry", pageSlug: second }
        : { pageType: "industry-index", pageSlug: "industries" };
    case "services":
      return second
        ? { pageType: "service", pageSlug: second }
        : { pageType: "service-index", pageSlug: "services" };
    case "blog":
      if (!second) return { pageType: "blog-index", pageSlug: "blog" };
      // /blog/industry/<slug>/ is a filtered index, not a post.
      if (second === "industry") {
        return third
          ? { pageType: "blog-industry", pageSlug: third }
          : { pageType: "blog-index", pageSlug: "blog" };
      }
      return { pageType: "blog-post", pageSlug: second };
    case "contact":
      return second === "thank-you"
        ? { pageType: "thank-you", pageSlug: "thank-you" }
        : { pageType: "contact", pageSlug: "contact" };
    case "ai-readiness-check":
      return { pageType: "scorecard", pageSlug: "ai-readiness-check" };
    case "pricing":
      return { pageType: "pricing", pageSlug: "pricing" };
    case "about":
      return { pageType: "about", pageSlug: "about" };
    case "author":
      return { pageType: "author", pageSlug: second ?? "author" };
    case "faq":
      return { pageType: "faq", pageSlug: "faq" };
    case "glossary":
      return { pageType: "glossary", pageSlug: "glossary" };
    default:
      return { pageType: "other", pageSlug: slug };
  }
}

/**
 * Collapse visible link text to a single tidy line.
 *
 * Buttons on this site wrap icons and screen-reader-only spans, so the raw
 * textContent arrives with newlines and runs of spaces in it. Truncation is
 * generous — the text is for reading a report, not for grouping.
 */
export function normalizeText(raw: string, maxLength = 80): string {
  const text = raw.replace(/\s+/g, " ").trim();
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

/**
 * The identifier a click is reported under.
 *
 * Explicit wins; otherwise compose section and text so the ID reads as a
 * location rather than a hash. Falling back to the destination covers
 * icon-only links (social icons have no text), and the final literal covers
 * the genuinely anonymous case so no click is ever pushed without an ID.
 */
export function deriveClickId(parts: {
  explicit?: string | null;
  section?: string | null;
  text?: string | null;
  href?: string | null;
}): string {
  const explicit = parts.explicit?.trim();
  if (explicit) return explicit;

  const section = slugify(parts.section ?? "", 24);
  const label = slugify(parts.text ?? "", 40) || slugify(parts.href ?? "", 40);
  const composed = [section, label].filter(Boolean).join("-");

  return slugify(composed, 64) || "unidentified";
}
