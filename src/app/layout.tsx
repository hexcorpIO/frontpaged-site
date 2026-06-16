import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

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

const title = "Frontpaged — Be the first answer patients see";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s · Frontpaged",
  },
  description: site.description,
  keywords: [
    "med spa SEO",
    "med spa SEO Dallas",
    "medical spa marketing Dallas Fort Worth",
    "Generative Engine Optimization",
    "GEO content",
    "AI search visibility",
    "ChatGPT SEO",
    "Google AI Overviews",
    "med spa marketing agency Dallas",
  ],
  applicationName: site.name,
  alternates: { canonical: "/" },
  // Local geo signals for the Dallas–Fort Worth service area.
  other: {
    "geo.region": "US-TX",
    "geo.placename": "Dallas–Fort Worth",
    "geo.position": "32.7767;-96.7970",
    ICBM: "32.7767, -96.7970",
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
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
