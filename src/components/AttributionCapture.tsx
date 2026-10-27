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
// Capture is ON. The site declares no Consent Mode state and shows no cookie
// banner; the privacy policy at /privacy/ names this cookie, what it holds
// (campaign parameters and ad click ids only), and its 90-day lifetime. That
// page is the thing that made switching this on a decision rather than an
// accident — it was deliberately left off until the policy existed.
//
// RESPECT_CONSENT exists for the day a consent framework is added: set it to
// true and the cookie is written only after a 'consent' command granting
// ad_storage has been pushed to the dataLayer.
const RESPECT_CONSENT = false;

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
