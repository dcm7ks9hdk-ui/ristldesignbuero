/* ========================================================================
   RISTL.DESIGNBUERO — site.js
   Ohne externe Abhängigkeiten, DSGVO-sicher.
   1) Sprachumschalter DE/EN
   2) Einordnung im Werk-Register: Fach oben, Jahreszahl darunter
   3) Sichtfenster, das der angesteuerten Zeile folgt
   ======================================================================== */

/* ---- 2) Einordnung umbrechen -------------------------------------------
   Das Studio schreibt "<Fach> · <Jahr>" in eine Zeile. Hier wird daraus:
   Fach (an Kommata umgebrochen), Jahreszahl allein in der letzten Zeile,
   ohne Trennzeichen und ohne Semesterangabe. Mehrfach aufrufbar.
   ------------------------------------------------------------------------ */
function formatIndexMeta() {
  var metas = document.querySelectorAll('.project-card .caption > .mono');

  for (var i = 0; i < metas.length; i++) {
    var el = metas[i];
    var txt = el.textContent.replace(/\s+/g, ' ').trim();

    var sep = txt.lastIndexOf('·');
    if (sep === -1) continue; // bereits umgebrochen

    var subject = txt.slice(0, sep).trim();
    var tail = txt.slice(sep + 1).trim();
    var found = tail.match(/\d{4}/);
    var year = found ? found[0] : tail;

    el.textContent = '';

    var parts = subject.split(',');
    for (var p = 0; p < parts.length; p++) {
      var part = parts[p].trim();
      if (!part) continue;
      var last = p === parts.length - 1;
      el.appendChild(document.createTextNode(last ? part : part + ','));
      if (!last) el.appendChild(document.createElement('br'));
    }

    var y = document.createElement('span');
    y.className = 'meta-year';
    y.textContent = year;
    el.appendChild(y);
  }
}

/* ---- 1) Sprachumschalter ------------------------------------------------
   Übersetzbare Elemente tragen ein data-de="…"; der englische Text bleibt
   der sichtbare Standard im HTML (und wird als data-en gecacht).
   ------------------------------------------------------------------------ */
(function () {
  var KEY = 'ristl-lang';
  var els = [].slice.call(document.querySelectorAll('[data-de]'));

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
      b.textContent = lang === 'de' ? 'EN' : 'DE';
      b.setAttribute('aria-label', lang === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln');
    });
    formatIndexMeta(); // nach dem Sprachwechsel erneut umbrechen
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

// Falls keine übersetzbaren Elemente vorhanden sind, trotzdem umbrechen
formatIndexMeta();

/* ---- 3) Sichtfenster ----------------------------------------------------
   Die Bilder stammen aus den Karten, die das Studio schreibt. Neue Projekte
   erscheinen dadurch automatisch. Ruhezustand: leer.
   ------------------------------------------------------------------------ */
(function () {
  var layout = document.querySelector('.index-layout');
  if (!layout) return;

  var cards = [].slice.call(layout.querySelectorAll('.project-card'));
  if (!cards.length) return;

  var panel = document.createElement('div');
  panel.className = 'index-preview';
  panel.setAttribute('aria-hidden', 'true');

  var frame = document.createElement('div');
  frame.className = 'index-preview-frame';
  panel.appendChild(frame);

  var shots = [];

  cards.forEach(function (card, i) {
    var src = card.querySelector('.thumb img');
    if (!src) { shots.push(null); return; }

    var shot = document.createElement('img');
    shot.src = src.getAttribute('src');
    shot.alt = '';
    shot.loading = 'lazy';
    frame.appendChild(shot);
    shots.push(shot);

    function show() {
      shots.forEach(function (s, k) { if (s) s.classList.toggle('on', k === i); });
      frame.classList.add('on');
    }
    card.addEventListener('mouseenter', show);
    card.addEventListener('focus', show);
  });

  function clear() {
    shots.forEach(function (s) { if (s) s.classList.remove('on'); });
    frame.classList.remove('on');
  }

  var list = layout.querySelector('.projects');
  list.addEventListener('mouseleave', clear);
  list.addEventListener('focusout', function (e) {
    if (!list.contains(e.relatedTarget)) clear();
  });

  layout.appendChild(panel);
})();
