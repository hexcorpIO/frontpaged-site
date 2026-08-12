import Link from "next/link";
import Container from "./Container";

// Visible breadcrumbs.
//
// The BreadcrumbList schema already shipped on hubs, posts, and service pages,
// but nothing rendered — and Google's structured-data guidance is that markup
// should describe content a visitor can actually see. Beyond compliance, a site
// that is now 43 pages across two directories needs orientation: a reader landing
// on a post from a search result has no idea what section they are in.
//
// The last crumb is the current page and is deliberately not a link.

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({
  crumbs,
  className = "",
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <Container>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 py-4 text-[13.5px] text-warm-grey">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                {c.href && !isLast ? (
                  <Link
                    href={c.href}
                    className="hover:text-teal hover:underline underline-offset-2"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-navy" : undefined} aria-current={isLast ? "page" : undefined}>
                    {c.label}
                  </span>
                )}
                {!isLast && (
                  <span aria-hidden="true" className="text-line">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
