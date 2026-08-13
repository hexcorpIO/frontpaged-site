"use client";

import { useEffect } from "react";
import {
  COOKIE_MAX_AGE_SECONDS,
  COOKIE_NAME,
  mergeAttribution,
  parseAttribution,
  readCookie,
  serializeCookie,
  hasAttribution,
} from "@/lib/attribution";

// Writes the fp_click cookie the scheduler reads.
//
// ─────────────────────────────────────────────────────────────────────────────
// CONSENT
//
// This is the one genuinely contested thing in the attribution work, so it is a
// single constant rather than a decision buried in a branch.
//
// The site sets Consent Mode defaults of ad_storage: 'denied' and
// analytics_storage: 'denied', and has no banner, so nothing is ever granted.
// Storing a gclid in a first-party cookie is advertising storage by any
// reasonable reading — it is precisely what Google's own tags are prevented
// from doing while ad_storage is denied. Writing our own cookie to achieve what
// the consent signal forbids would work around a control the site just adopted.
//
// So the default respects it, and the cost is explicit: **until a consent
// banner exists, no ad click id is ever stored, and gclid never reaches the
// booking record.** utm_source/medium/campaign are treated the same way, since
// analytics_storage is denied too.
//
// Set this to false to capture regardless of consent. That is a legitimate
// business decision — it is not a technical mistake — but it should be made
// deliberately and with a privacy policy in place, not inherited by accident.
const RESPECT_CONSENT = true;

/**
 * Whether storage is currently permitted.
 *
 * Reads the consent state out of the dataLayer rather than a Google API,
 * because gtag's own consent state is not publicly readable. It walks the
 * pushed 'consent' commands in order, so a later 'update' beats the 'default'.
 */
function storageAllowed(): boolean {
  if (!RESPECT_CONSENT) return true;
  if (typeof window === "undefined") return false;

  let allowed = false;
  for (const entry of window.dataLayer ?? []) {
    // Consent commands arrive as the arguments object gtag() pushes:
    // ['consent', 'default' | 'update', {...}]
    const args = entry as unknown as { [index: number]: unknown; length?: number };
    if (args?.length !== 3 || args[0] !== "consent") continue;
    const state = args[2] as Record<string, string> | undefined;
    if (state?.ad_storage) allowed = state.ad_storage === "granted";
  }
  return allowed;
}

export default function AttributionCapture() {
  useEffect(() => {
    const incoming = parseAttribution(window.location.search);
    const stored = readCookie(document.cookie);
    const merged = mergeAttribution(stored, incoming);

    if (!hasAttribution(merged)) return;

    // Nothing new to persist — the stored value is already what we would write.
    if (!hasAttribution(incoming)) return;

    if (!storageAllowed()) return;

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `${COOKIE_NAME}=${serializeCookie(merged)}` +
      `; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  }, []);

  return null;
}
