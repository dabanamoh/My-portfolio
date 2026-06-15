/* =========================================================================
   Tiny bit of interactivity: mobile menu + Work-page filtering.
   No frameworks, nothing to install.
   ========================================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* --- Mobile menu open/close --- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () { menu.classList.toggle('hidden'); });
    // close the menu after tapping a link
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.add('hidden'); });
    });
  }

  /* --- Work-page category filter --- */
  var chips = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-category]');
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        cards.forEach(function (card) {
          var cats = (card.getAttribute('data-category') || '').split(' ');
          var show = (want === 'all') || cats.indexOf(want) !== -1;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* --- Footer year --- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* --- Reading progress bar (case study pages) --- */
  var bar = document.querySelector('[data-progress]');
  if (bar) {
    var update = function () {
      var el = document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      bar.style.width = (max > 0 ? (el.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
});
