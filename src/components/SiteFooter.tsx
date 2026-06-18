import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";

const services = [
  { href: "/services/med-spa-seo", label: "Med Spa SEO" },
  { href: "/services/generative-engine-optimization", label: "Generative Engine Optimization" },
  { href: "/services/google-business-profile", label: "Google Business Profile" },
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
          <div className="max-w-xs lg:col-span-2">
            <Logo className="text-[18px]" />
            <p className="mt-3 leading-[1.6]">
              SEO &amp; Generative Engine Optimization content for medical spas — done for you,
              nationwide.
            </p>
            <div className="mt-4 flex flex-col gap-1.5">
              <a href={site.phoneHref} className="font-medium text-navy hover:text-teal-dark">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="hover:text-teal-dark">
                {site.email}
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-teal-dark"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <Column title="Services" links={services} />
          <Column title="Company" links={company} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-warm-line pt-6 text-[13px]">
          <span>Med spa SEO &amp; Generative Engine Optimization — serving medical spas nationwide.</span>
          <span>© 2026 {site.name}. All rights reserved.</span>
        </div>
      </Container>
    </footer>
  );
}
