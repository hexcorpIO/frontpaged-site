import Container from "./Container";
import Logo from "./Logo";
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-10 text-sm text-grey">
      <Container className="flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Logo className="text-[18px]" /> — {site.tagline}
        </div>
        <div>
          © 2026 {site.name}. Serving medical spas in {site.areaServed}.
        </div>
      </Container>
    </footer>
  );
}
