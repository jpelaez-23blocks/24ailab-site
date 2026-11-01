/* Project card renderer + hint animations. Renders window.LAB_PROJECTS into [data-pcards].
   Hints are inline SVG animated with CSS only; they run only while the card is in view
   (IntersectionObserver adds .live) and never under prefers-reduced-motion (see cards.css). */
(function () {
  var host = document.querySelector('[data-pcards]'); if (!host || !window.LAB_PROJECTS) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // ---- hint registry: key -> function(project) returning SVG markup (viewBox 0 0 320 140) ----
  var HINTS = window.LAB_HINTS = window.LAB_HINTS || {};
  HINTS['default'] = HINTS['default'] || function () {
    return '<svg viewBox="0 0 320 140" aria-hidden="true" focusable="false"><g class="h-def">' +
      '<circle cx="160" cy="70" r="14" class="core"/><circle cx="160" cy="70" r="14" class="wave w1"/><circle cx="160" cy="70" r="14" class="wave w2"/><circle cx="160" cy="70" r="14" class="wave w3"/></g></svg>';
  };
  HINTS.fm = HINTS.fm || function () {
    var i, s = '<svg viewBox="0 0 320 140" aria-hidden="true" focusable="false">';
    // act 1: dial sweeping through static
    s += '<g class="a1"><rect x="70" y="38" width="180" height="64" rx="10" class="dial"/>';
    for (i = 0; i <= 16; i++) s += '<line x1="' + (84 + i * 9.5) + '" x2="' + (84 + i * 9.5) + '" y1="50" y2="' + (i % 4 ? 57 : 61) + '" class="tick"/>';
    s += '<g class="static">';
    for (i = 0; i < 26; i++) s += '<rect x="' + (82 + (i * 37) % 156) + '" y="' + (68 + (i * 13) % 24) + '" width="3" height="3" class="sn s' + (i % 3) + '"/>';
    s += '</g><line x1="0" x2="0" y1="46" y2="96" class="needle"/></g>';
    // act 2: visualizer bars
    s += '<g class="a2">';
    for (i = 0; i < 12; i++) s += '<rect x="' + (100 + i * 10) + '" y="40" width="7" height="60" class="bar b' + (i % 4) + '" style="animation-delay:' + (-(i * 0.13) % 0.6).toFixed(2) + 's"/>';
    s += '</g>';
    // act 3: globe with pins
    s += '<g class="a3"><circle cx="160" cy="70" r="46" class="globe"/><ellipse cx="160" cy="70" rx="20" ry="46" class="mer"/><ellipse cx="160" cy="70" rx="38" ry="46" class="mer"/><line x1="114" x2="206" y1="70" y2="70" class="mer"/><ellipse cx="160" cy="70" rx="46" ry="16" class="mer"/>' +
      '<circle cx="146" cy="52" r="4.5" class="pin p1"/><circle cx="178" cy="62" r="4.5" class="pin p2"/><circle cx="152" cy="92" r="4.5" class="pin p3"/></g>';
    return s + '</svg>';
  };

  function gallery(p) {
    if (!p.gallery || !p.gallery.length) return '';
    return '<details class="pc-more"><summary>Screenshots</summary><div class="gallery" aria-label="' + esc(p.name) + ' screenshots">' + p.gallery.map(function (g) {
      return '<figure class="shot ' + esc(g.kind || 'desktop') + '"><a href="' + esc(g.src) + '.webp" data-lb><picture><source srcset="' + esc(g.src) + '.webp" type="image/webp"><img src="' + esc(g.src) + '.png" width="' + g.w + '" height="' + g.h + '" loading="lazy" decoding="async" alt="' + esc(g.alt) + '"></picture></a><figcaption>' + esc(g.cap) + '</figcaption></figure>';
    }).join('') + '</div></details>';
  }

  host.innerHTML = window.LAB_PROJECTS.map(function (p) {
    var hint = (HINTS[p.hint] || HINTS['default'])(p);
    var meta = [p.era].concat(p.tags || []).filter(Boolean).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    return '<article class="pcard pc" id="project-' + esc(p.id) + '" style="--pc:' + esc(p.accent || '#1a6fd6') + '" aria-labelledby="pc-' + esc(p.id) + '">' +
      '<div class="pc-hint hint-' + esc(p.hint || 'default') + '">' + hint + '</div>' +
      '<div class="pc-body"><ul class="pc-meta" aria-label="Era and tags">' + meta + '</ul>' +
      '<h2 id="pc-' + esc(p.id) + '">' + esc(p.name) + '</h2><p class="pc-pitch">' + esc(p.pitch) + '</p>' +
      (p.why ? '<p><strong>Why.</strong> ' + esc(p.why) + '</p>' : '') + (p.how ? '<p><strong>How.</strong> ' + esc(p.how) + '</p>' : '') +
      '<div class="pc-cta"><a class="btn pri" href="' + esc(p.url) + '">' + esc(p.cta || ('Open ' + p.name)) + ' <span aria-hidden="true">↗</span></a>' +
      (p.story ? '<a class="btn" href="' + esc(p.story) + '">Project story <span class="sr">of ' + esc(p.name) + '</span></a>' : '') + '</div>' +
      gallery(p) + '</div></article>';
  }).join('');

  // run hint animations only while visible (or hovered/focused, via CSS)
  var cards = host.querySelectorAll('.pc');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('live', e.isIntersecting); }); }, { threshold: 0.35 });
    cards.forEach(function (c) { io.observe(c); });
  } else cards.forEach(function (c) { c.classList.add('live'); });
})();
