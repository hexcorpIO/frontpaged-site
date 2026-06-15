import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";

const links = [
  { href: "#problem", label: "Why it matters" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur-md">
      <Container>
        <nav className="flex h-[66px] items-center justify-between" aria-label="Primary">
          <a href="#top" className="text-[22px]">
            <Logo />
            <span className="sr-only">{site.name} home</span>
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[15px] font-medium text-ink hover:text-teal-dark"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-lg bg-teal px-[18px] py-2.5 text-[15px] font-semibold text-white transition hover:bg-teal-dark"
            >
              Free visibility check
            </a>
          </div>
        </nav>
      </Container>
    </header>
  );
}
