/* ========================================================================
   RISTL.DESIGNBUERO — site.js
   Sprachumschalter DE/EN, ohne externe Abhängigkeiten, DSGVO-sicher.
   Übersetzbare Elemente tragen ein data-de="…"; der englische Text bleibt
   der sichtbare Standard im HTML (und wird als data-en gecacht).
   ======================================================================== */
(function () {
  var KEY = 'ristl-lang';
  var els = [].slice.call(document.querySelectorAll('[data-de]'));

  // Englischen Ausgangstext einmalig sichern
  els.forEach(function (el) {
    if (!el.hasAttribute('data-en')) {
      el.setAttribute('data-en', el.innerHTML.trim());
    }
  });

  var toggles = [].slice.call(document.querySelectorAll('[data-lang-toggle]'));

  function apply(lang) {
    if (lang !== 'de' && lang !== 'en') lang = 'en';
    document.documentElement.lang = lang;
    els.forEach(function (el) {
      var v = el.getAttribute('data-' + lang);
      if (v != null) el.innerHTML = v;
    });
    toggles.forEach(function (b) {
      // Button zeigt die jeweils ANDERE Sprache an
      b.textContent = lang === 'de' ? 'EN' : 'DE';
      b.setAttribute('aria-label', lang === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln');
    });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved !== 'de' && saved !== 'en') {
    saved = (navigator.language || '').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  }

  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      apply(document.documentElement.lang === 'de' ? 'en' : 'de');
    });
  });

  apply(saved);
})();
