"use client";

import { useEffect, useRef } from "react";
import { pushToDataLayer } from "./ClickTracking";

// Fires one dataLayer event when the page it sits on renders.
//
// This exists for conversions that complete by navigation rather than by a
// click. The contact form is a plain HTML POST to Formspree, which redirects
// back to /contact/thank-you/ — so by the time the submission has actually
// succeeded, the page that held the button is long gone. Pushing the event from
// the click would count attempts, including the ones that failed validation or
// were dropped as spam; pushing it from the destination counts submissions that
// really landed.

export default function TrackEvent({
  event,
  params,
}: {
  event: string;
  params?: Record<string, unknown>;
}) {
  // React runs effects twice in development's strict mode, and a conversion
  // counted twice is worse than one counted late.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    pushToDataLayer({ event, ...params });
  }, [event, params]);

  return null;
}
