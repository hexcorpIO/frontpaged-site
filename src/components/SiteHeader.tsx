import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";

// Absolute hrefs (with leading "/") so the nav works from any page, including /blog.
const links = [
  { href: "/#problem", label: "Why it matters" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-warm-line bg-cream/85 backdrop-blur-md">
      <Container>
        <nav className="flex h-[66px] items-center justify-between" aria-label="Primary">
          <Link href="/" className="text-[22px]">
            <Logo />
            <span className="sr-only">{site.name} home</span>
          </Link>
          <div className="hidden items-center gap-7 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[15px] font-medium text-navy/80 hover:text-teal-dark"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="rounded-full bg-teal px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-teal-dark"
            >
              Free visibility check
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
