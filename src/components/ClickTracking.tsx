"use client";

import { useEffect } from "react";
import {
  classifyDestination,
  deriveClickId,
  normalizeText,
  pageContext,
  type ClickPayload,
  type ClickType,
  type Region,
} from "@/lib/tracking";

// One delegated click listener for the whole site.
//
// The alternative — an onClick handler on every link — was rejected for three
// reasons. It would turn a few dozen server components into client components,
// shipping their markup to the browser twice. It would need editing every time
// a link is added, so coverage would decay. And it cannot see clicks inside
// markdown-rendered blog bodies at all, which is where most of the site's links
// live: 56 posts of prose, none of it written in JSX.
//
// This listener sees all of them, because it listens at the document and walks
// up from whatever was actually clicked.
//
// GTM setup this expects: one Custom Event trigger on `click`, with Data Layer
// Variables for the `click_*` and `page_*` keys. No CSS-selector triggers, which
// are the usual reason GTM configs rot — a Tailwind class change would break
// those, and cannot break these.

/** Elements worth reporting. `[data-track-id]` lets a non-anchor opt in. */
const CLICKABLE = "a[href], button, [data-track-id]";

/** Sections we can name from a landmark when no nearer label exists. */
const REGIONS: { selector: string; region: Region }[] = [
  { selector: "header", region: "header" },
  { selector: "footer", region: "footer" },
  { selector: "main", region: "main" },
];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * The nearest meaningful name for where the click happened.
 *
 * Preference order is deliberate: an explicit `data-track-section` beats the
 * markup, then a section's `id` (this site gives its landmark sections real ids
 * like `how-ai-decides`), then its `aria-labelledby` heading text, then the
 * landmark. That yields readable names — `pricing-cards`, `how-ai-decides` —
 * without anyone maintaining a list.
 */
function findSection(el: Element): string {
  const declared = el.closest<HTMLElement>("[data-track-section]");
  if (declared?.dataset.trackSection) return declared.dataset.trackSection;

  const section = el.closest<HTMLElement>("section[id], section[aria-labelledby]");
  if (section) {
    if (section.id) return section.id;
    const labelledBy = section.getAttribute("aria-labelledby");
    const heading = labelledBy ? document.getElementById(labelledBy) : null;
    if (heading?.textContent) return normalizeText(heading.textContent, 40);
  }

  for (const { selector, region } of REGIONS) {
    if (el.closest(selector)) return region;
  }
  return "page";
}

function findRegion(el: Element): Region {
  for (const { selector, region } of REGIONS) {
    if (el.closest(selector)) return region;
  }
  return "unknown";
}

/**
 * Classify a click when the element hasn't declared what it is.
 *
 * Structural position is a better signal than styling here: a link inside
 * `<nav>` is navigation whatever it looks like, and a Tailwind restyle can't
 * change that. Only the genuinely ambiguous cases fall through to "link".
 */
function inferType(el: HTMLElement, destination: string): ClickType {
  const declared = el.closest<HTMLElement>("[data-track-type]")?.dataset.trackType;
  if (declared) return declared as ClickType;

  if (destination === "mailto" || destination === "tel") return "cta";
  if (el.closest("nav[aria-label='Breadcrumb']")) return "breadcrumb";
  if (el.closest("footer")) return "footer";
  if (el.closest("nav")) return "nav";
  if (el.tagName === "BUTTON") return "control";
  // Externality is already reported in its own field, so it isn't duplicated as
  // a type here — an outbound citation and an outbound social link are
  // different things and both are labelled explicitly where they're rendered.
  if (destination === "anchor") return "inline";
  return "link";
}

export function pushToDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export default function ClickTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const el = target.closest<HTMLElement>(CLICKABLE);
      if (!el) return;

      // Explicit opt-out, for anything we deliberately don't want counted.
      if (el.closest("[data-track-ignore]")) return;

      const rawHref = el.getAttribute("href") ?? "";
      const destination = classifyDestination(rawHref, window.location.origin);
      const section = findSection(el);

      // aria-label carries the meaning for icon-only links (the social icons in
      // the header have no text node at all).
      const text = normalizeText(
        el.textContent?.trim() || el.getAttribute("aria-label") || "",
      );

      // page_type is deliberately NOT set here. PageContext owns it, at page
      // scope, and two writers with different vocabularies on one key is how a
      // GA4 dimension ends up disagreeing with itself — click events saying
      // "scorecard" while the page_view on the same page says "check".
      // page_slug has no other writer and adds the granularity the page-scoped
      // classifier drops (which post, which service).
      const { pageSlug } = pageContext(window.location.pathname);

      const payload: ClickPayload = {
        event: "click",
        click_id: deriveClickId({
          explicit: el.dataset.trackId,
          section,
          text,
          href: rawHref,
        }),
        click_type: inferType(el, destination),
        click_text: text,
        click_url: rawHref,
        click_section: section,
        click_region: findRegion(el),
        click_destination: destination,
        page_slug: pageSlug,
      };

      pushToDataLayer(payload);
    }

    // Capture phase, so the event is recorded even where a handler further down
    // calls stopPropagation — the mobile menu's links close the menu on click.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
