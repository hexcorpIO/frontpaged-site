import { ImageResponse } from "next/og";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { getVertical } from "@/lib/verticals";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Frontpaged article";

// Required for `output: export` — prerendered as a static PNG per post at build.
export const dynamic = "force-static";

// Per-post social cards.
//
// Every one of 49 posts previously shared the site-wide OG image, so a link to a
// personal-injury article and a link to a Botox article produced an identical
// preview. The title is the single most useful thing a share can carry, and
// generating these costs nothing at runtime because they bake at build time.

const NAVY = "#15263f";
const TEAL = "#2e8b8b";
const MARK_TEAL = "#33a1a1";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

// Long headlines need to shrink or they overflow the card. Three coarse steps
// rather than a formula — the goal is "never clipped", not typographic finesse.
function titleSize(len: number): number {
  if (len > 95) return 44;
  if (len > 60) return 52;
  return 62;
}

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Frontpaged";
  const vertical = post ? getVertical(post.vertical) : undefined;
  const kicker = vertical ? vertical.name : "Frontpaged";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${NAVY} 0%, #1d3556 100%)`,
          padding: "68px 76px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Same mark geometry as the site-wide card, at a smaller scale. */}
          <div
            style={{
              position: "relative",
              display: "flex",
              width: 52,
              height: 52,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1b2f4d 0%, #13233c 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ position: "absolute", left: 17, top: 15, width: 6, height: 22.5, borderRadius: 2, background: "#ffffff" }} />
            <div style={{ position: "absolute", left: 17, top: 15, width: 20, height: 6, borderRadius: 2, background: MARK_TEAL }} />
            <div style={{ position: "absolute", left: 17, top: 26, width: 16, height: 6, borderRadius: 2, background: "#ffffff" }} />
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800 }}>
            <span>Frontpaged</span>
            <span style={{ color: TEAL }}>.io</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: TEAL,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: titleSize(title.length),
              fontWeight: 800,
              lineHeight: 1.12,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
