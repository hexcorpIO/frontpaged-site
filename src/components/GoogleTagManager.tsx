import Script from "next/script";
import { site } from "@/lib/site";

// Google Tag Manager, installed sitewide from the root layout.
//
// This is the container only — no tags are defined here. GA4, conversion
// tracking and anything else are configured in the GTM UI, which is the point:
// a static export has to be rebuilt and redeployed for any code change, and
// measurement changes far more often than the site does.
//
// Two deliberate choices:
//
// 1. `afterInteractive` rather than `beforeInteractive`. GTM is not required to
//    render anything, and this site's whole argument is that it is fast — a
//    render-blocking third-party script in <head> would cost LCP for no
//    measurement benefit. Page views still fire; they fire a few hundred
//    milliseconds later.
//
// 2. Suppressed outside production. Local `pnpm dev` sessions and any
//    non-production build stay out of the container, so the numbers describe
//    visitors rather than our own work. Note that `output: "export"` bakes this
//    in at build time — the deployed HTML either contains the snippet or does
//    not; there is no runtime check shipped to the browser.
export default function GoogleTagManager() {
  if (!site.gtmId || process.env.NODE_ENV !== "production") return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${site.gtmId}');`}
    </Script>
  );
}

// The no-JavaScript half of the standard GTM install, which belongs immediately
// after the opening <body> tag rather than alongside the script above.
//
// It does very little on its own — tags that need JavaScript (GA4 included)
// cannot fire here, so this records a bare page view for visitors running with
// scripting disabled. It is included because it is half of the install Google
// documents, and because this site is a portfolio piece for a company that
// sells tracking: a partial GTM install is the kind of thing the audience for
// this site checks.
export function GoogleTagManagerNoScript() {
  if (!site.gtmId || process.env.NODE_ENV !== "production") return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
