import SiteHeaderNav, { type NavLink } from "./SiteHeaderNav";
import { getPublishedVerticals } from "@/lib/verticals";
import { getIndustryBody } from "@/lib/industries";

// Server wrapper: resolving which verticals have a real hub page requires
// getIndustryBody() (node:fs), which can only run in a Server Component. The
// mobile menu's open/close state needs a Client Component, so the actual nav
// markup lives in SiteHeaderNav ("use client") and this file just computes the
// two registry-driven link lists and hands them down as props.
const services: NavLink[] = [
  { href: "/services/generative-engine-optimization/", label: "Generative Engine Optimization" },
  { href: "/services/google-business-profile/", label: "Google Business Profile" },
];

export default function SiteHeader() {
  // Published vertical with a written hub body -> link straight to it.
  // Published vertical without one yet (Task 10) -> link to the index instead
  // of a /industries/<slug>/ URL that doesn't exist in the static export.
  const industries: NavLink[] = [
    ...getPublishedVerticals().map((v) => ({
      href: getIndustryBody(v.slug) !== null ? `/industries/${v.slug}/` : "/industries/",
      label: v.name,
    })),
    { href: "/industries/", label: "All industries" },
  ];

  return <SiteHeaderNav industries={industries} services={services} />;
}
