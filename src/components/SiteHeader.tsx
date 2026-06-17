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

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

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
            <Link href="/pricing" className="text-[15px] font-medium text-navy/80 hover:text-teal-dark">
              Pricing
            </Link>
            <Link href="/blog" className="text-[15px] font-medium text-navy/80 hover:text-teal-dark">
              Blog
            </Link>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Frontpaged on LinkedIn"
              className="text-navy/70 transition hover:text-teal-dark"
            >
              <LinkedInIcon />
            </a>
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
            <div className="flex flex-col gap-1.5">
              <Link href="/pricing" onClick={close} className="text-[15px] font-medium text-navy hover:text-teal-dark">
                Pricing
              </Link>
              <Link href="/blog" onClick={close} className="text-[15px] font-medium text-navy hover:text-teal-dark">
                Blog
              </Link>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[15px] font-medium text-navy hover:text-teal-dark"
              >
                <LinkedInIcon className="h-[18px] w-[18px]" /> LinkedIn
              </a>
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
