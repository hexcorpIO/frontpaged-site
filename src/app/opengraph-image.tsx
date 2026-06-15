import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "Frontpaged — Be the first answer patients see";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#15263f";
const TEAL = "#2e8b8b";

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
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: TEAL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              transform: "rotate(-4deg)",
            }}
          >
            F
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
