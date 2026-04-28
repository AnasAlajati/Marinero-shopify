/**
 * Marinero — Transparent-to-solid header on scroll.
 * Watches a sentinel element at the bottom of the hero section.
 * Adds/removes `.marinero-header--scrolled` on the header component.
 */
(function () {
  const sentinel = document.getElementById('marinero-scroll-sentinel');
  const header   = document.getElementById('header-component');

  if (!sentinel || !header) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('marinero-header--scrolled', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '0px 0px 0px 0px' }
  );

  observer.observe(sentinel);
})();
