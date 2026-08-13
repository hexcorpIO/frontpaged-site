/**
 * Client-side tracking, ported from the Next.js components.
 *
 * Plain ES5-compatible JS with no build step, because it has to run before any
 * bundler exists in this stack and because a tracking script that depends on a
 * toolchain is a tracking script that eventually silently stops shipping.
 *
 * What is deliberately NOT here: page_type. That is emitted server-side in
 * <head>, where WordPress already knows what it rendered. Two writers on one
 * GA4 dimension produce reports that disagree with themselves.
 */
(function () {
  "use strict";

  var CLICKABLE = "a[href], button, [data-track-id]";

  function push(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  /* ------------------------------------------------------------------
   * Identifier derivation — ported from src/lib/tracking.ts
   * ---------------------------------------------------------------- */

  function slugify(input, maxLength) {
    maxLength = maxLength || 48;
    var slug = String(input || "")
      .toLowerCase()
      .replace(/['‘’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (slug.length <= maxLength) return slug;
    var cut = slug.slice(0, maxLength);
    var lastDash = cut.lastIndexOf("-");
    return (lastDash > maxLength / 2 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
  }

  function normalizeText(raw, maxLength) {
    maxLength = maxLength || 80;
    var text = String(raw || "").replace(/\s+/g, " ").trim();
    return text.length <= maxLength ? text : text.slice(0, maxLength - 1).replace(/\s+$/, "") + "…";
  }

  function classifyDestination(rawHref, origin) {
    var href = String(rawHref || "").trim();
    if (!href) return "internal";
    if (href.indexOf("mailto:") === 0) return "mailto";
    if (href.indexOf("tel:") === 0) return "tel";
    if (href.charAt(0) === "#") return "anchor";
    if (href.indexOf("//") === 0) return "external";
    if (href.charAt(0) === "/") return "internal";
    if (/^https?:\/\//i.test(href)) {
      if (!origin || href.indexOf(origin) !== 0) return "external";
      return /^\/?#/.test(href.slice(origin.length)) ? "anchor" : "internal";
    }
    return "internal";
  }

  /**
   * Nearest meaningful name for where a click happened. Prefers an explicit
   * data-track-section, then a section id, then its labelling heading, then the
   * landmark — so names read as locations rather than as hashes, with nobody
   * maintaining a list.
   */
  function findSection(el) {
    var declared = el.closest("[data-track-section]");
    if (declared && declared.getAttribute("data-track-section")) {
      return declared.getAttribute("data-track-section");
    }
    var section = el.closest("section[id], section[aria-labelledby]");
    if (section) {
      if (section.id) return section.id;
      var labelledBy = section.getAttribute("aria-labelledby");
      var heading = labelledBy ? document.getElementById(labelledBy) : null;
      if (heading && heading.textContent) return normalizeText(heading.textContent, 40);
    }
    if (el.closest("header")) return "header";
    if (el.closest("footer")) return "footer";
    if (el.closest("main")) return "main";
    return "page";
  }

  function findRegion(el) {
    if (el.closest("header")) return "header";
    if (el.closest("footer")) return "footer";
    if (el.closest("main")) return "main";
    return "unknown";
  }

  function inferType(el, destination) {
    var declared = el.closest("[data-track-type]");
    if (declared) return declared.getAttribute("data-track-type");
    if (destination === "mailto" || destination === "tel") return "cta";
    if (el.closest("nav[aria-label='Breadcrumb']")) return "breadcrumb";
    if (el.closest("footer")) return "footer";
    if (el.closest("nav")) return "nav";
    if (el.tagName === "BUTTON") return "control";
    if (destination === "anchor") return "inline";
    return "link";
  }

  function deriveClickId(explicit, section, text, href) {
    if (explicit && explicit.trim()) return explicit.trim();
    var label = slugify(text, 40) || slugify(href, 40);
    var composed = [slugify(section, 24), label].filter(Boolean).join("-");
    return slugify(composed, 64) || "unidentified";
  }

  /* ------------------------------------------------------------------
   * Delegated click listener
   * ---------------------------------------------------------------- */

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      if (!target || !target.closest) return;

      var el = target.closest(CLICKABLE);
      if (!el || el.closest("[data-track-ignore]")) return;

      // WordPress admin bar and editor chrome are not the site.
      if (el.closest("#wpadminbar, .block-editor, #adminmenumain")) return;

      var rawHref = el.getAttribute("href") || "";
      var destination = classifyDestination(rawHref, window.location.origin);
      var section = findSection(el);
      var text = normalizeText(
        (el.textContent && el.textContent.trim()) || el.getAttribute("aria-label") || ""
      );

      push({
        event: "click",
        click_id: deriveClickId(el.getAttribute("data-track-id"), section, text, rawHref),
        click_type: inferType(el, destination),
        click_text: text,
        click_url: rawHref,
        click_section: section,
        click_region: findRegion(el),
        click_destination: destination,
        page_slug: (window.location.pathname.replace(/\/+$/, "").split("/").pop() || "home")
      });
    },
    true // capture, so a handler calling stopPropagation cannot hide the click
  );

  /* ------------------------------------------------------------------
   * Attribution — reads the fp_click cookie the container declares
   * ---------------------------------------------------------------- */

  function readAttribution() {
    try {
      var match = document.cookie.match(/(?:^|;\s*)fp_click=([^;]*)/);
      if (!match) return {};
      var parsed = JSON.parse(decodeURIComponent(match[1]));
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * The capture half is gated off.
   *
   * The site declares no Consent Mode state, and storing a gclid is advertising
   * storage. This was left switched off on the Next.js build as a deliberate
   * decision rather than an oversight, and the same decision carries across.
   * Set captureAttribution true in the plugin settings to enable it — ideally
   * alongside a privacy policy, which the site still does not have.
   */
  (function captureAttribution() {
    var config = window.fpcConfig || {};
    if (!config.captureAttribution) return;

    var params = new URLSearchParams(window.location.search);
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "wbraid", "gbraid"];
    var incoming = {};
    keys.forEach(function (k) {
      var v = params.get(k);
      if (v) incoming[k] = v.slice(0, 200);
    });

    if (Object.keys(incoming).length === 0) return; // direct visit: keep what is stored

    document.cookie =
      "fp_click=" + encodeURIComponent(JSON.stringify(incoming)) +
      "; Max-Age=" + 90 * 24 * 60 * 60 + "; Path=/; SameSite=Lax" +
      (window.location.protocol === "https:" ? "; Secure" : "");
  })();

  /**
   * Build the scheduler URL.
   *
   * utm_source/medium/campaign pass through untouched; the ad click id rides in
   * utm_content because Calendly has no field of its own for it, and the
   * industry rides in utm_term. Those two slots are therefore repurposed.
   */
  window.fpBuildSchedulerUrl = function (baseUrl) {
    var c = readAttribution();
    var p = new URLSearchParams();
    if (c.utm_source) p.set("utm_source", c.utm_source);
    if (c.utm_medium) p.set("utm_medium", c.utm_medium);
    if (c.utm_campaign) p.set("utm_campaign", c.utm_campaign);
    var clickId = c.gclid || c.wbraid || c.gbraid;
    if (clickId) p.set("utm_content", "gclid:" + clickId);
    p.set("utm_term", window.__fp_industry || "none");

    var parts = String(baseUrl).split("?");
    if (parts[1]) {
      new URLSearchParams(parts[1]).forEach(function (v, k) {
        if (!p.has(k)) p.set(k, v);
      });
    }
    return parts[0] + "?" + p.toString();
  };

  /* ------------------------------------------------------------------
   * Calendly
   * ---------------------------------------------------------------- */

  // Registered once for the document: two schedulers can appear on one page and
  // a single booking must not be counted twice.
  window.addEventListener("message", function (e) {
    if (String(e.origin).indexOf("calendly.com") === -1) return;
    if (!e.data || e.data.event !== "calendly.event_scheduled") return;
    push({
      event: "consultation_booked",
      scheduler: "calendly",
      industry: window.__fp_industry || "none"
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    var holders = document.querySelectorAll("[data-calendly-url]");
    if (!holders.length) return;

    function mountAll() {
      if (!window.Calendly) return;
      Array.prototype.forEach.call(holders, function (el) {
        el.replaceChildren();
        window.Calendly.initInlineWidget({
          url: window.fpBuildSchedulerUrl(el.getAttribute("data-calendly-url")),
          parentElement: el
        });
      });
    }

    if (window.Calendly) {
      mountAll();
      return;
    }
    // Waits on the script's load event rather than polling — deterministic, and
    // with no window where the widget silently fails because loading was slow.
    var script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.addEventListener("load", mountAll, { once: true });
    document.body.appendChild(script);
  });
})();
