/* Gentle scroll parallax on large images (matches the new design).
   Progressive enhancement, disabled for reduced motion. Layout never depends on it. */
(function () {
  if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var imgs = [];
  function collect() {
    imgs = [].slice.call(document.querySelectorAll('main img, section img, figure img')).filter(function (im) {
      return im.offsetHeight >= 280 && !im.closest('header, footer, nav, .oceanhead, #md-chat-panel, #md-chat-btn');
    });
    imgs.forEach(function (im) { im.style.willChange = 'transform'; });
  }
  var ticking = false;
  function run() {
    ticking = false;
    var vh = window.innerHeight;
    imgs.forEach(function (im) {
      var r = im.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) return;
      var centre = r.top + r.height / 2;
      var off = (vh / 2 - centre) * 0.045;
      off = Math.max(-18, Math.min(18, off));
      im.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(run); } }
  window.addEventListener('load', function () { collect(); run(); });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { collect(); run(); });
})();
