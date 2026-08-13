// Click attribution: capturing where a visitor came from, and carrying it into
// the booking record.
//
// The brief that asked for this reads a cookie called `fp_click`. Nothing on
// this site has ever written one, so as supplied the reader returned `{}` on
// every visit and no utm or gclid reached Calendly — silently, because an empty
// object is exactly what a direct visit legitimately produces. This module is
// the missing half.
//
// Everything here is pure and string-in/string-out so it can be tested without a
// browser; the cookie and URL side-effects live in AttributionCapture.

/** Parameters worth carrying. Anything else on the URL is ignored. */
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/**
 * Ad-click identifiers. Google sets exactly one of these depending on the
 * surface: gclid for Search, wbraid for iOS web-to-app, gbraid for iOS app-to-web.
 */
export const CLICK_ID_KEYS = ["gclid", "wbraid", "gbraid"] as const;

export type Attribution = Partial<
  Record<(typeof UTM_KEYS)[number] | (typeof CLICK_ID_KEYS)[number], string>
>;

export const COOKIE_NAME = "fp_click";

/** 90 days. Longer than a typical consideration window for this kind of purchase. */
export const COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

/** Values are truncated before storage — a cookie is not a place for a novel. */
const MAX_VALUE_LENGTH = 200;

/**
 * Pull attribution parameters out of a query string.
 *
 * Returns an empty object for a direct visit, which is a real answer rather than
 * a failure — the caller must not treat it as "no cookie yet".
 */
export function parseAttribution(search: string): Attribution {
  const params = new URLSearchParams(search);
  const out: Attribution = {};
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, MAX_VALUE_LENGTH);
  }
  return out;
}

/** Whether a visit carries anything worth recording. */
export const hasAttribution = (a: Attribution): boolean => Object.keys(a).length > 0;

/**
 * Read the stored attribution out of a raw document.cookie string.
 *
 * Tolerant by design: a truncated or hand-edited cookie yields `{}` rather than
 * throwing, because an exception here would break the scheduler on the page
 * where a booking is about to happen.
 */
export function readCookie(cookieString: string, name = COOKIE_NAME): Attribution {
  const match = cookieString.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  if (!match) return {};
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(match[1]));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Attribution = {};
    for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string" && value) out[key] = value.slice(0, MAX_VALUE_LENGTH);
    }
    return out;
  } catch {
    return {};
  }
}

/** Serialise for storage. */
export const serializeCookie = (a: Attribution): string =>
  encodeURIComponent(JSON.stringify(a));

/**
 * Merge a new visit over what is already stored.
 *
 * Last touch wins, but only when the new visit actually carries parameters —
 * otherwise an ad click followed by a direct return visit would erase the gclid
 * before the person books. This mirrors how Google's own _gcl_aw behaves, and
 * it is the right default for paid attribution: the most recent ad click is the
 * one that should get credit.
 */
export function mergeAttribution(stored: Attribution, incoming: Attribution): Attribution {
  return hasAttribution(incoming) ? incoming : stored;
}

/**
 * Build the scheduler URL.
 *
 * Calendly records utm_* against the booking and passes them to webhooks, so
 * these are what carry the ad click into the CRM. Three shaping decisions, all
 * from the brief:
 *
 *  - the ad click id rides in utm_content as `gclid:<value>`, because Calendly
 *    has no field of its own for it;
 *  - the industry rides in utm_term;
 *  - whichever of gclid/wbraid/gbraid is present is used, in that order.
 *
 * Any utm_term or utm_content genuinely present on the landing URL is therefore
 * overwritten. That is a real trade — those two slots are being repurposed — and
 * it is why utm_source, utm_medium and utm_campaign are left strictly alone.
 */
export function buildSchedulerUrl(
  baseUrl: string,
  attribution: Attribution,
  industry: string,
): string {
  const params = new URLSearchParams();

  if (attribution.utm_source) params.set("utm_source", attribution.utm_source);
  if (attribution.utm_medium) params.set("utm_medium", attribution.utm_medium);
  if (attribution.utm_campaign) params.set("utm_campaign", attribution.utm_campaign);

  const clickId = attribution.gclid || attribution.wbraid || attribution.gbraid;
  if (clickId) params.set("utm_content", `gclid:${clickId}`);

  params.set("utm_term", industry || "none");

  // Preserve any query already on the configured URL rather than discarding it.
  const [base, existingQuery] = baseUrl.split("?");
  if (existingQuery) {
    for (const [k, v] of new URLSearchParams(existingQuery)) {
      if (!params.has(k)) params.set(k, v);
    }
  }

  return `${base}?${params.toString()}`;
}
