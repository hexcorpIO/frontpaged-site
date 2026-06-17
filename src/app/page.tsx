import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import AiEnginesStrip from "@/components/AiEnginesStrip";
import Problem from "@/components/Problem";
import StatsBand from "@/components/StatsBand";
import HowItWorks from "@/components/HowItWorks";
import ReportMockup from "@/components/ReportMockup";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import ContactBand from "@/components/ContactBand";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <AiEnginesStrip />
        <Reveal>
          <Problem />
        </Reveal>
        <StatsBand />
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <ReportMockup />
        </Reveal>
        <Reveal>
          <Pricing />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
