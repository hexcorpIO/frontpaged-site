import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import type { PostMeta } from "@/lib/blog";

// The hub's link out to its own blog cluster.
//
// /industries/med-spas/ is the 301 target for the deleted /services/med-spa-seo/,
// which linked to individual posts. Without this section the redirect target passed
// less internal equity than the page it replaced, and the med-spa post cluster had
// no link from the hub that owns its topic. Post selection is scoped to the
// vertical (see getPostsForVertical in src/lib/blog.ts) so no hub ever links to
// another industry's content.
export default function RelatedPosts({
  posts,
  heading,
  name,
}: {
  posts: PostMeta[];
  heading: string;
  /** Lowercase vertical name, for the copy shown before this cluster exists. */
  name: string;
}) {
  // A vertical whose library hasn't been written yet still links to /blog/ from
  // its <main> rather than emitting nothing — without this, seven of eight hubs
  // pass no equity at all to the blog — but it links to the index and says why,
  // instead of pointing a probate firm at a post about Botox.
  if (posts.length === 0) {
    return (
      <section
        aria-labelledby="related-heading"
        className="border-t border-warm-line py-14 sm:py-16"
      >
        <h2
          id="related-heading"
          className="font-serif text-[28px] font-semibold leading-[1.15] tracking-tight text-navy sm:text-[34px]"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-[760px] text-[16px] leading-[1.7] text-warm-grey">
          Our {name} library is still being written. In the meantime, the{" "}
          <Link
            href="/blog/"
            data-track-id="related-empty-blog-index"
            className="font-semibold text-teal-dark hover:text-teal"
          >
            Frontpaged blog
          </Link>{" "}
          covers how AI engines decide who to cite, how answer-first pages get extracted, and
          what schema markup actually does — mechanics that hold across every industry we
          serve, even where the worked examples come from one of them.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-warm-line py-14 sm:py-16"
    >
      <h2
        id="related-heading"
        className="font-serif text-[28px] font-semibold leading-[1.15] tracking-tight text-navy sm:text-[34px]"
      >
        {heading}
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}/`}
              data-track-id={`related-post-${p.slug}`}
              data-track-type="card"
              className="block h-full rounded-xl border border-warm-line bg-cream p-5 transition duration-200 hover:border-teal"
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-teal-dark">
                {formatDate(p.date)} · {p.readingTime} min read
              </p>
              <h3 className="mt-2 font-serif text-[18px] font-semibold leading-snug text-navy">
                {p.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-warm-grey">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[15px] text-warm-grey">
        More in the{" "}
        <Link
          href="/blog/"
          data-track-id="related-more-blog-index"
          className="font-semibold text-teal-dark hover:text-teal"
        >
          Frontpaged blog
        </Link>
        .
      </p>
    </section>
  );
}
