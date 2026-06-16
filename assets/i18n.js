/* Lightweight client-side i18n for the portfolio.
   - English lives in the HTML (data-en cached on load) = SEO canonical + no-JS fallback.
   - French / Simplified Chinese come from assets/i18n/{fr,zh}.json keyed by data-i18n.
   - Auto-detects the device language; if it's none of the three, prompts a picker.
   - Persists the choice (localStorage) and injects a floating language switcher. */
(function () {
  var SUPPORTED = ['en', 'fr', 'zh'];
  var NAMES = { en: 'English', fr: 'Français', zh: '中文' };
  var dicts = { en: {} };
  var current = 'en';

  function detect() {
    var saved = localStorage.getItem('site-lang');
    if (saved && SUPPORTED.indexOf(saved) >= 0) return saved;
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q && SUPPORTED.indexOf(q) >= 0) return q;
    } catch (e) {}
    var navs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < navs.length; i++) {
      var c = (navs[i] || '').toLowerCase();
      if (c.indexOf('fr') === 0) return 'fr';
      if (c.indexOf('zh') === 0) return 'zh';
      if (c.indexOf('en') === 0) return 'en';
    }
    return null; // none of the three -> prompt
  }

  function cacheEnglish() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].getAttribute('data-en') === null) els[i].setAttribute('data-en', els[i].innerHTML);
    }
  }

  function applyDict(lang) {
    var d = dicts[lang] || {};
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], k = el.getAttribute('data-i18n');
      if (lang === 'en') { var en = el.getAttribute('data-en'); if (en !== null) el.innerHTML = en; }
      else if (d[k] != null) el.innerHTML = d[k];
      else { var en2 = el.getAttribute('data-en'); if (en2 !== null) el.innerHTML = en2; }
    }
    document.documentElement.lang = (lang === 'zh' ? 'zh-Hans' : lang);
    var cur = document.getElementById('lang-current');
    if (cur) cur.textContent = NAMES[lang];
    current = lang;
  }

  function load(lang, cb) {
    if (lang === 'en' || dicts[lang]) { cb(); return; }
    fetch('assets/i18n/' + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (j) { dicts[lang] = j; cb(); })
      .catch(function () { dicts[lang] = {}; cb(); });
  }

  function setLang(lang, persist) {
    if (SUPPORTED.indexOf(lang) < 0) lang = 'en';
    if (persist !== false) localStorage.setItem('site-lang', lang);
    load(lang, function () { applyDict(lang); });
  }

  function buildSwitcher() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9998;';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Change language');
    btn.style.cssText = 'display:inline-flex;align-items:center;gap:7px;background:#4648d4;color:#fff;border:none;border-radius:999px;padding:9px 15px;font:600 14px/1 "Plus Jakarta Sans",system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px -8px rgba(70,72,212,.6);';
    btn.innerHTML = '<span style="font-size:15px">🌐</span><span id="lang-current">' + NAMES[current] + '</span><span style="font-size:10px;opacity:.8">▾</span>';
    var menu = document.createElement('div');
    menu.style.cssText = 'position:absolute;left:0;bottom:50px;background:#fff;border:1px solid rgba(15,23,42,.12);border-radius:12px;box-shadow:0 18px 40px -12px rgba(2,8,40,.35);overflow:hidden;min-width:150px;display:none;';
    SUPPORTED.forEach(function (l) {
      var it = document.createElement('button');
      it.type = 'button'; it.textContent = NAMES[l];
      it.style.cssText = 'display:block;width:100%;text-align:left;padding:11px 16px;background:none;border:none;font:600 14px/1.2 "Plus Jakarta Sans",system-ui,sans-serif;color:#0b1220;cursor:pointer;';
      it.onmouseover = function () { it.style.background = '#f4f6fb'; };
      it.onmouseout = function () { it.style.background = 'none'; };
      it.onclick = function (e) { e.stopPropagation(); setLang(l); menu.style.display = 'none'; };
      menu.appendChild(it);
    });
    btn.onclick = function (e) { e.stopPropagation(); menu.style.display = (menu.style.display === 'none' ? 'block' : 'none'); };
    document.addEventListener('click', function () { menu.style.display = 'none'; });
    wrap.appendChild(menu); wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  function showPicker() {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(11,18,32,.55);display:flex;align-items:center;justify-content:center;padding:20px;';
    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:20px;padding:30px;max-width:380px;width:100%;text-align:center;box-shadow:0 30px 70px -20px rgba(2,8,40,.5);font-family:"Plus Jakarta Sans",system-ui,sans-serif;';
    card.innerHTML = '<div style="font-size:32px;margin-bottom:8px">🌐</div>'
      + '<div style="font-weight:800;font-size:19px;color:#0b1220;margin-bottom:4px">Choose your language</div>'
      + '<div style="font-size:13px;color:#5b6472;margin-bottom:20px">Choisissez votre langue · 选择语言</div>';
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
    SUPPORTED.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = NAMES[l];
      b.style.cssText = 'padding:13px;border-radius:12px;border:1px solid rgba(15,23,42,.14);background:#fff;font:600 15px/1 "Plus Jakarta Sans",system-ui,sans-serif;color:#0b1220;cursor:pointer;';
      b.onmouseover = function () { b.style.background = '#4648d4'; b.style.color = '#fff'; b.style.borderColor = '#4648d4'; };
      b.onmouseout = function () { b.style.background = '#fff'; b.style.color = '#0b1220'; b.style.borderColor = 'rgba(15,23,42,.14)'; };
      b.onclick = function () { setLang(l); if (ov.parentNode) document.body.removeChild(ov); };
      row.appendChild(b);
    });
    card.appendChild(row); ov.appendChild(card); document.body.appendChild(ov);
  }

  function init() {
    cacheEnglish();
    buildSwitcher();
    var chosen = detect();
    if (chosen === null) { applyDict('en'); showPicker(); }
    else { setLang(chosen, false); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
