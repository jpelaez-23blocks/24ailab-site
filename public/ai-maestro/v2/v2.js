/* AI Maestro v2: one scroll timeline, N full-screen scenes (modelled on FM's "Turn the dial"). */
(function () {
  var R = document.documentElement; if (!R.classList.contains('v2a')) return;
  var track = document.getElementById('track'), pin = document.getElementById('pin'), bar = document.getElementById('bar'), hint = document.getElementById('hint');
  var sc = [].slice.call(document.querySelectorAll('.v2 .scene')), N = sc.length;
  var parts = sc.map(function (s) { return { s: s, t: s.querySelector('.txt'), v: s.querySelector('.vis'), on: s.dataset.on, pre: s.dataset.pre, st: '' }; });
  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var top0 = 0, span = 1, vh = 0, hh = 64, raf = 0;
  function size() {
    var h = document.querySelector('header.site'); hh = h ? h.getBoundingClientRect().height : 64;
    R.style.setProperty('--hh', hh + 'px'); R.style.setProperty('--n', N);
    vh = pin.getBoundingClientRect().height;
    top0 = track.getBoundingClientRect().top + scrollY - hh; span = Math.max(1, track.offsetHeight - vh);
    draw();
  }
  function draw() {
    raf = 0;
    var p = cl((scrollY - top0) / span), f = p * (N - 1), cur = Math.round(f);
    if (bar) bar.style.width = (p * 100) + '%';
    if (hint) hint.style.opacity = f < .25 ? 1 : 0;
    parts.forEach(function (o, i) {
      var d = f - i, a = Math.abs(d);
      // hold each scene still around its centre, then move title + visual together
      var m = a < .18 ? 0 : (a - .18) / .82; m = cl(m) * (d < 0 ? -1 : 1);
      var op = cl(1 - (a - .14) / .34);
      o.s.style.opacity = op; o.s.style.visibility = op > 0.01 ? 'visible' : 'hidden';
      o.t.style.transform = 'translate3d(0,' + (-m * 18) + 'vh,0)';
      o.v.style.transform = 'translate3d(0,' + (-m * 11) + 'vh,0) scale(' + (1 - Math.abs(m) * .06) + ')';
      var want = i <= cur ? o.on : o.pre;
      if (o.st !== want) { o.st = want; o.v.className = 'vis ' + want; }
    });
  }
  function q() { if (!raf) raf = requestAnimationFrame(draw); }
  parts.forEach(function (o) { o.v.className = 'vis ' + o.pre; o.st = o.pre; });
  addEventListener('scroll', q, { passive: true });
  addEventListener('resize', size); addEventListener('orientationchange', function () { setTimeout(size, 200); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
  addEventListener('load', size);
  requestAnimationFrame(function () { requestAnimationFrame(size); });
})();
