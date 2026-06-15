import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import ContactBand from "@/components/ContactBand";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { isPlan, type Plan } from "@/lib/leadSchema";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const initialPlan: Plan = isPlan(plan) ? plan : "free-check";

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
        <ContactBand initialPlan={initialPlan} />
      </main>
      <SiteFooter />
    </>
  );
}
