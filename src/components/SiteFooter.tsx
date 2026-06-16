import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-warm-line bg-cream py-10 text-sm text-warm-grey">
      <Container className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Logo className="text-[18px]" /> — {site.tagline}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="font-medium hover:text-teal-dark">
              Blog
            </Link>
            <Link href="/med-spa-seo-dallas" className="font-medium hover:text-teal-dark">
              Dallas–Fort Worth
            </Link>
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-warm-line pt-4 text-[13px]">
          <span>
            <Link href="/med-spa-seo-dallas" className="hover:text-teal-dark">
              Med spa SEO across Dallas–Fort Worth
            </Link>{" "}
            — {site.serviceCities.slice(0, 6).join(", ")} &amp; more
          </span>
          <span>© 2026 {site.name}. Serving medical spas in {site.areaServed}.</span>
        </div>
      </Container>
    </footer>
  );
}
