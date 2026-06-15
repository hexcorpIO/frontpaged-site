import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-10 text-sm text-grey">
      <Container className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Logo className="text-[18px]" /> — {site.tagline}
        </div>
        <div className="flex items-center gap-4">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-grey hover:text-teal-dark"
          >
            LinkedIn
          </a>
          <span>
            © 2026 {site.name}. Serving medical spas in {site.areaServed}.
          </span>
        </div>
      </Container>
    </footer>
  );
}
