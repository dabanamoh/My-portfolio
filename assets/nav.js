/* Mobile toggle for the consistent ocean header. Self-contained. */
(function () {
  var t = document.querySelector('.oh-toggle');
  var n = document.getElementById('oh-nav');
  if (!t || !n) return;
  t.addEventListener('click', function () {
    var open = !n.classList.contains('open');
    n.classList.toggle('open', open);
    t.setAttribute('aria-expanded', String(open));
    t.textContent = open ? 'Close' : 'Menu';
  });
  n.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      n.classList.remove('open');
      t.setAttribute('aria-expanded', 'false');
      t.textContent = 'Menu';
    });
  });
})();
