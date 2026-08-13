// Google Consent Mode v2 defaults.
//
// A plain inline <script> in <head>, deliberately — not next/script.
//
// This must execute before the GTM container, or tags fire once in an unknown
// consent state before any default is applied, which is the exact failure
// Consent Mode exists to prevent. `strategy="beforeInteractive"` looked like the
// idiomatic choice and is not: for an inline script it emits a
// `self.__next_s.push(...)` queue entry rather than a real script tag, so
// execution depends on Next's own loader draining that queue. It happens to run
// before the container today. A synchronous head script cannot lose the race at
// all, because the parser runs it before it has read the rest of the document.
//
// What denying analytics_storage actually does: GA4 is not silenced, it switches
// to cookieless pings. No client identifier is stored, so sessions are modelled
// rather than stitched and a returning visitor reads as a new one. Reports still
// populate; they are estimates rather than counts.
//
// Nothing on this site calls gtag('consent', 'update', ...), so these defaults
// are also the permanent state. That is a position — cookieless by default —
// rather than an oversight. Granting storage requires a consent banner or CMP
// that issues the update call.
const CONSENT_DEFAULTS = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});`;

export default function ConsentDefaults() {
  return <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }} />;
}
