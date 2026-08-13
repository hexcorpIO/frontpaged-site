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
// CONSENT — READ THIS BEFORE WONDERING WHY THE COOKIE IS EMPTY
//
// The site no longer declares any Consent Mode state: the default and grant
// scripts were removed. Nothing pushes a 'consent' command, so the walk below
// finds none and storage stays disallowed.
//
// The effect is that **no fp_click cookie is ever written**, and therefore no
// gclid, wbraid, gbraid or utm_* reaches the Calendly booking record. The
// industry still does, because utm_term is derived at render time rather than
// read from storage.
//
// This is left switched off deliberately rather than flipped as a side effect
// of removing the consent scripts. Starting to store advertising identifiers is
// an expansion of what the site collects, and it should be a decision someone
// makes on purpose — ideally alongside a privacy policy, which this site still
// does not have.
//
// To capture: set RESPECT_CONSENT to false. One line, and attribution starts
// working on the next deploy.
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
