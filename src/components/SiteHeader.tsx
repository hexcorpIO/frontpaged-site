"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";

type NavLink = { href: string; label: string };

const services: NavLink[] = [
  { href: "/services/med-spa-seo", label: "Med Spa SEO" },
  { href: "/services/generative-engine-optimization", label: "Generative Engine Optimization" },
  { href: "/services/google-business-profile", label: "Google Business Profile" },
];

const locations: NavLink[] = [
  { href: "/med-spa-seo-dallas", label: "Dallas" },
  { href: "/med-spa-seo-plano", label: "Plano" },
  { href: "/med-spa-seo-fort-worth", label: "Fort Worth" },
  { href: "/med-spa-seo-frisco", label: "Frisco" },
];

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="mt-0.5">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Desktop dropdown — opens on hover and on keyboard focus (CSS only, no JS).
function Dropdown({ label, items }: { label: string; items: NavLink[] }) {
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 text-[15px] font-medium text-navy/80 hover:text-teal-dark">
        {label}
        <Chevron />
      </button>
      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="min-w-[240px] rounded-xl border border-warm-line bg-white p-2 shadow-[0_16px_44px_rgba(21,38,63,0.12)]">
          {items.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className="block rounded-lg px-3 py-2 text-[15px] text-navy hover:bg-soft hover:text-teal-dark"
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-warm-line bg-cream/85 backdrop-blur-md">
      <Container>
        <nav className="flex h-[66px] items-center justify-between" aria-label="Primary">
          <Link href="/" className="text-[22px]" onClick={close}>
            <Logo />
            <span className="sr-only">{site.name} home</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-7 lg:flex">
            <Dropdown label="Services" items={services} />
            <Dropdown label="Locations" items={locations} />
            <Link href="/pricing" className="text-[15px] font-medium text-navy/80 hover:text-teal-dark">
              Pricing
            </Link>
            <Link href="/blog" className="text-[15px] font-medium text-navy/80 hover:text-teal-dark">
              Blog
            </Link>
            <Link
              href="/#contact"
              className="rounded-full bg-teal px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-teal-dark"
            >
              Free visibility check
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-soft lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </Container>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-warm-line bg-cream lg:hidden">
          <Container className="flex flex-col gap-5 py-5">
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
                Services
              </p>
              <ul className="space-y-1.5">
                {services.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} onClick={close} className="text-[15px] text-navy hover:text-teal-dark">
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
                Locations
              </p>
              <ul className="space-y-1.5">
                {locations.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href} onClick={close} className="text-[15px] text-navy hover:text-teal-dark">
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/pricing" onClick={close} className="text-[15px] font-medium text-navy hover:text-teal-dark">
                Pricing
              </Link>
              <Link href="/blog" onClick={close} className="text-[15px] font-medium text-navy hover:text-teal-dark">
                Blog
              </Link>
            </div>
            <Link
              href="/#contact"
              onClick={close}
              className="inline-flex w-full items-center justify-center rounded-full bg-teal px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-teal-dark"
            >
              Free visibility check
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
