import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "Frontpaged — Be the first answer patients see";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Required for `output: export` — prerender this image as a static file at build time.
export const dynamic = "force-static";

const NAVY = "#15263f";
const TEAL = "#2e8b8b";
// Logo mark accent (matches app/icon.svg + Logo.tsx).
const MARK_TEAL = "#33a1a1";

// Generated at build time and emitted as a static PNG in the export.
export default function OpengraphImage() {
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
          padding: "72px 80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Logo mark: F-as-search-result, reconstructed from the icon SVG geometry. */}
          <div
            style={{
              position: "relative",
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 9,
              background: "linear-gradient(135deg, #1b2f4d 0%, #13233c 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ position: "absolute", left: 21, top: 19, width: 7.25, height: 27.75, borderRadius: 2, background: "#ffffff" }} />
            <div style={{ position: "absolute", left: 21, top: 19, width: 24.5, height: 7.25, borderRadius: 2, background: MARK_TEAL }} />
            <div style={{ position: "absolute", left: 21, top: 32, width: 19.5, height: 7.25, borderRadius: 2, background: "#ffffff" }} />
            <div style={{ position: "absolute", left: 21, top: 49, width: 15, height: 1.75, borderRadius: 1, background: "#ffffff", opacity: 0.18 }} />
            <div style={{ position: "absolute", left: 38, top: 49, width: 5, height: 1.75, borderRadius: 1, background: MARK_TEAL, opacity: 0.45 }} />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>
            <span>Frontpaged</span>
            <span style={{ color: TEAL }}>.io</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0 18px",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            <span>Be the</span>
            <span style={{ color: TEAL }}>first answer</span>
            <span>patients see.</span>
          </div>
          <div style={{ fontSize: 30, color: "#bccbdd", maxWidth: 860 }}>
            {`SEO + Generative Engine Optimization content for medical spas in ${site.areaServed}.`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
