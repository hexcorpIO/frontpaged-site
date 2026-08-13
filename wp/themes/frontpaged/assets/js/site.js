// Theme behaviour. Deliberately tiny.
//
// Navigation, dropdowns and the mobile menu are CSS-only (:hover, :focus-within
// and <details>), because a menu that needs JavaScript is a menu a crawler
// cannot open. This file only holds the scroll reveal, which is decoration and
// is skipped entirely for anyone who has asked for reduced motion.
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  targets.forEach(function (el) { observer.observe(el); });
})();
