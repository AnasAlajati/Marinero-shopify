/**
 * Marinero — Transparent header that turns white on scroll OR hover.
 * Matches the FLOW-style: overlaid on hero, reveals white on interaction.
 */
(function () {
  const sentinel = document.getElementById('marinero-scroll-sentinel');
  const header   = document.getElementById('header-component');

  if (!header) return;

  let isPastHero = false;

  // ── Scroll detection ──────────────────────────────────────
  if (sentinel) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isPastHero = !entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
  }

  // ── Hover detection ───────────────────────────────────────
  header.addEventListener('mouseenter', () => {
    header.classList.add('marinero-header--hovered');
  });

  header.addEventListener('mouseleave', () => {
    header.classList.remove('marinero-header--hovered');
  });

  function update() {
    header.classList.toggle('marinero-header--scrolled', isPastHero);
  }
})();
