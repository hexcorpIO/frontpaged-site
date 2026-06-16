import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";

const services = [
  { href: "/services/med-spa-seo", label: "Med Spa SEO" },
  { href: "/services/generative-engine-optimization", label: "Generative Engine Optimization" },
  { href: "/services/google-business-profile", label: "Google Business Profile" },
];

const locations = [
  { href: "/med-spa-seo-dallas", label: "Dallas" },
  { href: "/med-spa-seo-plano", label: "Plano" },
  { href: "/med-spa-seo-fort-worth", label: "Fort Worth" },
  { href: "/med-spa-seo-frisco", label: "Frisco" },
];

const company = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Book a call" },
];

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-navy">
        {title}
      </p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-warm-grey hover:text-teal-dark">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-warm-line bg-cream py-14 text-sm text-warm-grey">
      <Container className="flex flex-col gap-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Logo className="text-[18px]" />
            <p className="mt-3 leading-[1.6]">
              SEO &amp; Generative Engine Optimization content for medical spas across the
              Dallas–Fort Worth metroplex.
            </p>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-medium hover:text-teal-dark"
            >
              LinkedIn
            </a>
          </div>
          <Column title="Services" links={services} />
          <Column title="Service areas" links={locations} />
          <Column title="Company" links={company} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-warm-line pt-6 text-[13px]">
          <span>
            <Link href="/med-spa-seo-dallas" className="hover:text-teal-dark">
              Med spa SEO across Dallas–Fort Worth
            </Link>{" "}
            — {site.serviceCities.slice(0, 6).join(", ")} &amp; more
          </span>
          <span>
            © 2026 {site.name}. Serving medical spas in {site.areaServed}.
          </span>
        </div>
      </Container>
    </footer>
  );
}
