// Shared site behavior: logo inlining, scroll-driven UI, mobile nav, scroll reveal.
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Inline SVG logos (so currentColor can recolor them) ----------
  const LOGO_CACHE = new Map();
  document.querySelectorAll("[data-logo]").forEach((el) => {
    const src = el.dataset.logo;
    if (LOGO_CACHE.has(src)) { el.innerHTML = LOGO_CACHE.get(src); return; }
    fetch(src)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => { LOGO_CACHE.set(src, text); el.innerHTML = text; })
      .catch(() => { /* aria-label on the container provides the accessible name */ });
  });

  // ---------- Mobile nav toggle (with ESC + body lock) ----------
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-header__nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-locked", open);
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => { if (e.target.tagName === "A") setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 880) setOpen(false); });
  }

  // ---------- Scroll reveal (IntersectionObserver) ----------
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -80px 0px" });
      reveals.forEach((el) => io.observe(el));
    }
  }

  // ---------- Unified scroll handler (header tint, FAB visibility, parallax) ----------
  // One rAF-throttled listener; only writes when state actually changes.
  const header = document.querySelector(".site-header");
  const fab = document.querySelector(".fab");
  const heroIllu = (!prefersReducedMotion) ? document.querySelector(".hero__illustration") : null;

  if (header || fab || heroIllu) {
    let last = { scrolled: null, fabShown: null, parallaxY: null };
    let ticking = false;
    const run = () => {
      const y = window.scrollY;
      if (header) {
        const scrolled = y > 60;
        if (scrolled !== last.scrolled) { header.classList.toggle("scrolled", scrolled); last.scrolled = scrolled; }
      }
      if (fab) {
        const shown = y > 280;
        if (shown !== last.fabShown) { fab.classList.toggle("is-visible", shown); last.fabShown = shown; }
      }
      if (heroIllu) {
        const py = Math.min(y, 800) * 0.18;
        if (py !== last.parallaxY) { heroIllu.style.transform = `translateY(${py}px)`; last.parallaxY = py; }
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    run(); // initial state
  }

  // ---------- Footer year auto-update ----------
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
