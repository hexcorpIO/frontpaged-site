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

// The grant half of Consent Mode: a global an Accept control can call to move
// the four denied signals to granted.
//
// Defined in <head> alongside the defaults so it exists before any markup that
// might reference it, and so the two halves of the consent contract are read
// together rather than discovered separately.
//
// TWO THINGS THIS DOES NOT DO, both deliberate — see docs/analytics/gtm-setup.md:
//
// 1. Nothing calls it. There is no cookie banner on this site, so today this is
//    a function waiting for a caller and consent stays denied for every visitor.
// 2. It does not persist the choice. Consent Mode state lives in memory for the
//    life of the page, so a visitor who accepts is denied again on their next
//    navigation. A banner has to store the decision and re-issue the update on
//    load, ahead of the container, or accepting achieves nothing beyond the
//    current page.
//
// Both are the banner's job. This is the hook it will call.
const CONSENT_GRANT = `function fpConsentGrant(){
  gtag('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  });
  dataLayer.push({event: 'fp_consent_granted'});
}`;

export function ConsentGrant() {
  return <script dangerouslySetInnerHTML={{ __html: CONSENT_GRANT }} />;
}
