/**
 * Marinero — FLOW-style header.
 * Transparent + linen text over hero. Turns white on scroll or hover.
 */
(function () {
  const header = document.getElementById('header-component');
  if (!header) return;

  // ── Scroll detection ──────────────────────────────────────
  function onScroll() {
    header.classList.toggle('marinero-header--scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Hover detection ───────────────────────────────────────
  header.addEventListener('mouseenter', () => {
    header.classList.add('marinero-header--hovered');
  });

  header.addEventListener('mouseleave', () => {
    header.classList.remove('marinero-header--hovered');
  });
})();
