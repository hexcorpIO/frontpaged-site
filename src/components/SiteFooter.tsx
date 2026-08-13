import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";
import { slugify } from "@/lib/tracking";
import { getPublishedVerticals } from "@/lib/verticals";
import { getIndustryBody } from "@/lib/industries";
import { getPublishedAddOnServices } from "@/lib/services";

const services = [
  { href: "/services/generative-engine-optimization/", label: "Generative Engine Optimization" },
  { href: "/services/google-business-profile/", label: "Google Business Profile" },
  ...getPublishedAddOnServices().map((s) => ({
    href: `/services/${s.slug}/`,
    label: s.name,
  })),
  { href: "/services/", label: "All services" },
];

// Registry-driven, same fallback as the header nav: link straight to a vertical's
// hub where one has been written, otherwise to the /industries/ index rather than
// a /industries/<slug>/ URL the static export hasn't generated yet.
const industries = getPublishedVerticals().map((v) => ({
  href: getIndustryBody(v.slug) !== null ? `/industries/${v.slug}/` : "/industries/",
  label: v.name,
}));

const company = [
  { href: "/ai-readiness-check/", label: "Free AI readiness check" },
  { href: "/about/", label: "About" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
  { href: "/glossary/", label: "Glossary" },
  { href: "/contact/", label: "Contact" },
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
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              data-track-id={`footer-${slugify(title)}-${slugify(l.label)}`}
              className="text-warm-grey hover:text-teal-dark"
            >
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="max-w-xs sm:col-span-2 lg:col-span-2">
            <Logo className="text-[18px]" />
            <p className="mt-3 leading-[1.6]">
              SEO &amp; Generative Engine Optimization content for high-ticket local businesses —
              done for you, nationwide.
            </p>
            <div className="mt-4 flex flex-col gap-1.5">
              <a
                href={site.phoneHref}
                data-track-id="footer-phone"
                className="font-medium text-navy hover:text-teal-dark"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                data-track-id="footer-email"
                className="hover:text-teal-dark"
              >
                {site.email}
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-track-id="footer-social-linkedin"
                data-track-type="social"
                className="font-medium hover:text-teal-dark"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <Column title="Industries" links={industries} />
          <Column title="Services" links={services} />
          <Column title="Company" links={company} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-warm-line pt-6 text-[13px]">
          <span>SEO &amp; Generative Engine Optimization — serving high-ticket local businesses nationwide.</span>
          <span>© 2026 {site.name}. All rights reserved.</span>
        </div>
      </Container>
    </footer>
  );
}
