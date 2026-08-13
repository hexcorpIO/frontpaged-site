"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Page-scoped dataLayer context: page_type, industry, content_group,
// tier_context.
//
// Two things shape this beyond the original snippet.
//
// FIRST — the site navigates client-side. Twenty-six components link with
// next/link, so most page changes never reload the document and a head script
// runs exactly once, at entry. Left as a plain IIFE, a visitor landing on
// /industries/med-spas/ and clicking through to /pricing/ would still be
// reported as industry=med-spas, page_type=industry for the rest of the
// session. So the classifier is exposed as window.__fpPageContext() and called
// again on every route change.
//
// SECOND — one writer per key. Both halves call the SAME function rather than
// reimplementing the rules, because a second copy of this logic in TypeScript
// would drift from the head script the first time either changed, and the
// symptom would be a dimension that is right on entry and wrong afterwards.
//
// The classifier stays a raw string, not a bundled module, because it has to
// run in <head> before the GTM container — before any bundle has loaded.

const PAGE_CONTEXT = `(function () {
  window.dataLayer = window.dataLayer || [];
  var INDUSTRIES = {
    'med-spas':'med-spas','plastic-surgery':'plastic-surgery','dermatology':'dermatology',
    'wellness':'wellness','concierge-medicine':'concierge-medicine',
    'personal-injury-law':'personal-injury-law','estate-law':'estate-law',
    'real-estate-teams':'real-estate-teams'
  };
  window.__fpPageContext = function (path) {
    path = path || location.pathname;
    function seg(prefix){ var m = path.match(new RegExp('/'+prefix+'/([^/]+)')); return m ? m[1] : null; }
    var industry = seg('industries');
    var pageType =
      path === '/' ? 'home' :
      industry ? 'industry' :
      seg('services') ? 'service' :
      path.indexOf('/industries') === 0 ? 'industry-index' :
      path.indexOf('/services') === 0 ? 'service-index' :
      path.indexOf('/pricing') === 0 ? 'pricing' :
      path.indexOf('/ai-readiness-check') === 0 ? 'check' :
      path.indexOf('/contact') === 0 ? 'contact' :
      path.indexOf('/blog') === 0 ? 'blog' :
      path.indexOf('/faq') === 0 ? 'faq' :
      path.indexOf('/about') === 0 ? 'about' : 'other';
    window.__fp_industry = (industry && INDUSTRIES[industry]) ? INDUSTRIES[industry] : 'none';
    return {
      page_type: pageType,
      industry: window.__fp_industry,
      content_group: pageType.charAt(0).toUpperCase() + pageType.slice(1),
      tier_context: 'none'
    };
  };
  dataLayer.push(window.__fpPageContext());
})();`;

/** The head half. Runs before the container so the first page_view has context. */
export function PageContextScript() {
  return <script dangerouslySetInnerHTML={{ __html: PAGE_CONTEXT }} />;
}

declare global {
  interface Window {
    __fpPageContext?: (path?: string) => Record<string, unknown>;
    __fp_industry?: string;
  }
}

/**
 * The client half. Re-pushes on every route change.
 *
 * Skips the first run: the head script has already pushed for the entry page,
 * and pushing again would double-count it.
 */
export default function PageContextUpdates() {
  const pathname = usePathname();
  const isEntryPage = useRef(true);

  useEffect(() => {
    if (isEntryPage.current) {
      isEntryPage.current = false;
      return;
    }
    if (typeof window.__fpPageContext !== "function") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_context_change",
      ...window.__fpPageContext(pathname),
    });
  }, [pathname]);

  return null;
}
