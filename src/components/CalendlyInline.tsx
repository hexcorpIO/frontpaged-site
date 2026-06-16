"use client";

import { useEffect } from "react";

// Inline Calendly scheduler. Works on the static export: the widget script is
// loaded client-side and auto-initializes any `.calendly-inline-widget` element.
export default function CalendlyInline({ url }: { url: string }) {
  useEffect(() => {
    const src = "https://assets.calendly.com/assets/external/widget.js";
    // Avoid loading the script twice (e.g. React StrictMode in dev).
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget w-full"
      data-url={url}
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
