import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import ContactBand from "@/components/ContactBand";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Pricing />
        <Faq />
        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
