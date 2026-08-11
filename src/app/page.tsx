import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import TopBanner from "@/components/TopBanner";
import Hero from "@/components/Hero";
import AiEnginesStrip from "@/components/AiEnginesStrip";
import Problem from "@/components/Problem";
import IndustryGrid from "@/components/IndustryGrid";
import StatsBand from "@/components/StatsBand";
import HowItWorks from "@/components/HowItWorks";
import ReportMockup from "@/components/ReportMockup";
import PricingSummary from "@/components/PricingSummary";
import Faq from "@/components/Faq";
import ContactBand from "@/components/ContactBand";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { priceRange, founding, auditOffer, usd, ogImage } from "@/lib/site";
import { getPublishedVerticals } from "@/lib/verticals";
import type { Faq as FaqItem } from "@/lib/verticals/types";

// Next's title template (root layout: "%s · Frontpaged") only applies to titles
// set by nested route segments, not to page.tsx colocated with the layout that
// defines it — so, like the root layout's own default title, the brand name has
// to be written into this string directly rather than left for the template.
const title = "Frontpaged — Be the first name AI recommends";
const description =
  "Done-for-you SEO & Generative Engine Optimization content for 8 high-ticket local " +
  "industries, engineered to rank on Google and get cited by AI.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

function industryList(): string {
  const names = getPublishedVerticals().map((v) => v.name);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

// Neutral, sitewide FAQ — five business-mechanism questions no vertical asks
// (every vertical's FAQ set is compliance/practice-specific; see
// src/lib/verticals/*.ts). tests/verticals.test.mjs enforces that no question
// repeats across verticals, and duplicating a vertical's FAQ text here would be
// the exact doorway-page problem this repositioning is designed to avoid.
const homeFaqs: FaqItem[] = [
  {
    q: "Which industries does Frontpaged work with?",
    a: `We work with ${industryList()}. Each gets its own pricing, FAQs, and citation sources — a patient searching for a med spa and a family searching for an estate attorney trust completely different sources.`,
  },
  {
    q: "What's included in the AI Visibility Audit?",
    a: `A one-time, ${usd(auditOffer.price)} deep audit: your business tested across ChatGPT, Perplexity, and Google, the competitors currently being cited instead of you, a page-by-page gap analysis of your site, and a prioritized 90-day plan. ${auditOffer.credit}`,
  },
  {
    q: "Why does pricing vary so much by industry?",
    a: `Because the market does. A personal injury case is worth many times a single med spa visit, so a law firm's plan involves more pages, deeper compliance review, and more sources to build citations from than a med spa's does. Plans run ${priceRange} — see the industries above for your actual rate.`,
  },
  {
    q: "Is there a long-term contract?",
    a: "No. Every plan is month-to-month. Pause or cancel anytime, and everything we've published stays live on your site.",
  },
  {
    q: "What happens once the founding-client slots for my industry are gone?",
    a: founding.enabled
      ? `While the founding program is live, the first ${founding.slotsPerVertical} clients in each industry lock in a 25% discount for 12 months. Once those slots fill for your industry, new clients start at list price — clients who got in early keep their locked rate.`
      : "The founding-client program has closed. New clients now start at list price for their industry.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd faqs={homeFaqs} />
      <TopBanner />
      <SiteHeader />
      <main>
        <Hero />
        <AiEnginesStrip />
        <Reveal>
          <Problem />
        </Reveal>
        <Reveal>
          <IndustryGrid />
        </Reveal>
        <StatsBand />
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <ReportMockup />
        </Reveal>
        <Reveal>
          <PricingSummary />
        </Reveal>
        <Reveal>
          <Faq faqs={homeFaqs} />
        </Reveal>
        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
