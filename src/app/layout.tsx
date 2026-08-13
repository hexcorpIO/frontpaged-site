import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import AttributionCapture from "@/components/AttributionCapture";
import ClickTracking from "@/components/ClickTracking";
import PageContextUpdates, { PageContextScript } from "@/components/PageContext";
import ConsentDefaults, { ConsentGrant } from "@/components/ConsentDefaults";
import GoogleTagManager, {
  GoogleTagManagerNoScript,
} from "@/components/GoogleTagManager";
import { site } from "@/lib/site";
import { getPublishedVerticals } from "@/lib/verticals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const title = "Frontpaged — Be the first name AI recommends";

// Google has ignored the keywords meta tag since 2009, and no other major
// engine weights it either — but it costs nothing to keep accurate, and it is
// generated from the same vertical registry as everything else on this
// industry-neutral homepage rather than hand-listed, so it can't go stale the
// way the old med-spa-only list did once the site started serving eight
// industries.
const keywords = [
  "SEO agency",
  "Generative Engine Optimization",
  "GEO content",
  "AI search visibility",
  "ChatGPT SEO",
  "Google AI Overviews",
  ...getPublishedVerticals().map((v) => `${v.nameSingular} SEO`),
];

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s · Frontpaged",
  },
  description: site.description,
  keywords,
  applicationName: site.name,
  alternates: {
    canonical: "/",
    // Advertises the feed in <head> sitewide so readers and aggregators can
    // discover it without being told where to look.
    types: { "application/rss+xml": `${site.url}/rss.xml` },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      {/* Consent Mode defaults must be set before the GTM container runs. A
          synchronous head script is the only placement that guarantees it —
          check-tracking.mjs asserts both the presence and the ordering against
          the built HTML so a refactor cannot quietly invert them. */}
      <head>
        <ConsentDefaults />
        {/* Defined after the defaults so gtag() is already declared when this is
            read. Nothing calls it yet — there is no Accept control on the site,
            so consent remains denied until a banner exists to invoke it. */}
        <ConsentGrant />
        {/* After consent, before the container: the first page_view then carries
            page_type and industry. PageContextUpdates re-pushes on client-side
            navigation, which this script cannot see. */}
        <PageContextScript />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <GoogleTagManagerNoScript />
        <noscript>
          {/* Without JS the scroll-reveal observer never runs — keep content visible. */}
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
        <AttributionCapture />
        <ClickTracking />
        <PageContextUpdates />
        <GoogleTagManager />
      </body>
    </html>
  );
}
