"use client";

import { useEffect, useRef } from "react";
import { buildSchedulerUrl, readCookie } from "@/lib/attribution";
import { pushToDataLayer } from "./ClickTracking";

// Inline Calendly scheduler, with attribution carried into the booking record.
//
// The URL is built on the client because it depends on the fp_click cookie and
// on window.__fp_industry, neither of which exists at export time — so the
// widget is mounted imperatively rather than declared with a data-url that
// would be baked into the static HTML and wrong for every visitor.
//
// The brief supplied a `setTimeout(init, 200)` loop polling for window.Calendly.
// This waits on the script's own load event instead: deterministic, no wasted
// wake-ups, and no window where the widget silently fails because the script
// took longer than the poller expected.

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: { url: string; parentElement: HTMLElement }): void;
    };
  }
}

// Two schedulers can appear on one page (a section band plus a page's own
// embed). The postMessage listener is global, so it is registered once per
// document rather than once per widget — otherwise a single booking would push
// consultation_booked twice and double-count the most valuable event on the site.
let listenerRegistered = false;

function registerBookingListener() {
  if (listenerRegistered || typeof window === "undefined") return;
  listenerRegistered = true;

  window.addEventListener("message", (e: MessageEvent) => {
    // Origin check first. Any page can postMessage into this window, so without
    // it a third-party frame could fabricate a booking.
    if (String(e.origin).indexOf("calendly.com") === -1) return;
    const data = e.data as { event?: string } | null;
    if (data?.event !== "calendly.event_scheduled") return;

    pushToDataLayer({
      event: "consultation_booked",
      scheduler: "calendly",
      industry: window.__fp_industry || "none",
    });
  });
}

export default function CalendlyInline({ url }: { url: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerBookingListener();

    const element = container.current;
    if (!element) return;

    const schedulerUrl = buildSchedulerUrl(
      url,
      readCookie(document.cookie),
      window.__fp_industry || "none",
    );

    let cancelled = false;
    const mount = () => {
      if (cancelled || !window.Calendly) return;
      // Clear first: React's development strict mode runs effects twice, and
      // Calendly would happily mount a second iframe into the same element.
      element.replaceChildren();
      window.Calendly.initInlineWidget({ url: schedulerUrl, parentElement: element });
    };

    if (window.Calendly) {
      mount();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", mount, { once: true });
      } else {
        const script = document.createElement("script");
        script.src = WIDGET_SRC;
        script.async = true;
        script.addEventListener("load", mount, { once: true });
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Reserved at the widget's own height so the page does not shift when it mounts.
  return <div ref={container} className="w-full" style={{ minWidth: "320px", height: "700px" }} />;
}
