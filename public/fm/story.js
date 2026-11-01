// FM story page: one scroll timeline, six scenes. No dependencies; Three.js is lazy-loaded for the globe only.
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) document.documentElement.classList.add('rm');
  var cl = function (x, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return x < a ? a : x > b ? b : x; };
  var seg = function (p, a, b) { return cl((p - a) / (b - a)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var eio = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var eout = function (t) { return 1 - Math.pow(1 - t, 3); };
  var back = function (t) { var c = 1.3, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  var root = document.documentElement, body = document.body;
  var box = $('#box'), radio = $('#radio'), wa = $('#wa'), win = $('#wa .win'), desk = $('#desk'), ipod = $('#ipod'), ring = $('#ring');
  var canvas = $('#globe'), pinsEl = $('#pins'), ugly = $('#ugly'), fin = $('#fin'), hint = $('#hint');
  var caps = [].slice.call(document.querySelectorAll('.cap'));
  var DATA = { stations: 62118, list: [], pts: [] };

  /* ---------- static drawing ---------- */
  var F0 = 5.9, F1 = 10.2, LOCK = 9.58, OTHER = [6.07, 7.33, 8.42];
  var fx = function (f) { return 12 + (f - F0) / (F1 - F0) * 238; };
  (function scale() {
    var s = '';
    for (var f = 6; f <= 10.2; f += 0.1) { var x = fx(f), maj = Math.abs(f - Math.round(f)) < .01;
      s += '<line x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="30" y2="' + (maj ? 46 : 38) + '" stroke="#2a1d0c" stroke-width="' + (maj ? 1.4 : .7) + '"/>';
      if (maj) s += '<text x="' + x.toFixed(1) + '" y="60" font-size="11" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" fill="#2a1d0c">' + Math.round(f) + '</text>'; }
    [[6.05, '49m'], [7.3, '41m'], [9.6, '31m']].forEach(function (b) { var x = fx(b[1] === '49m' ? 6.05 : b[0]);
      s += '<rect x="' + (x - 14) + '" y="14" width="28" height="11" rx="2" fill="#2a1d0c"/><text x="' + x + '" y="23" font-size="8.5" text-anchor="middle" font-family="-apple-system,Segoe UI,sans-serif" font-weight="700" fill="#f6dca0">' + b[1] + '</text>'; });
    for (var k = 0; k <= 48; k++) { var xx = 12 + k * 238 / 48; s += '<line x1="' + xx + '" x2="' + xx + '" y1="74" y2="' + (k % 4 ? 78 : 84) + '" stroke="#2a1d0c" stroke-width=".6" opacity=".6"/>'; }
    s += '<text x="12" y="98" font-size="8" font-family="-apple-system,Segoe UI,sans-serif" font-weight="700" letter-spacing="2" fill="#2a1d0c" opacity=".7">SW  MHz</text><text x="250" y="98" font-size="8" text-anchor="end" font-family="ui-monospace,Menlo,monospace" fill="#2a1d0c" opacity=".7">530 · 1600 kHz</text>';
    $('#scale').innerHTML = s;
  })();
  var needle = $('#needle'), freqEl = $('#freq'), led = $('#led'), tune = $('#tune'), sig = [].slice.call(document.querySelectorAll('#radio .sig i')), ant = $('#radio .ant');

  // grille dots -> visualizer segments (12 x 12)
  var dotsEl = $('#dots'), DOTS = [];
  for (var c = 0; c < 12; c++) for (var r = 0; r < 12; r++) {
    var d = document.createElement('i'); dotsEl.appendChild(d);
    var lvl = 11 - r; // 0 = bottom segment
    DOTS.push({ el: d, c: c, lvl: lvl, x0: 64 + c * 19.2, y0: 186 + r * 22.4, x1: 126 + c * 15, y1: 280 - lvl * 6.8,
      col: lvl < 6 ? '#00e05a' : lvl < 9 ? '#e8d93d' : '#ff4b2b', dim: lvl < 6 ? '#0d3a1d' : lvl < 9 ? '#3a3712' : '#3d160f' });
  }
  // EQ sliders (10 bands, like FM's EQ)
  var eqEl = $('#wa .eq'), EQ = [], labs = ['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'];
  labs.forEach(function (l, i) { var s = document.createElement('div'); s.className = 'sl'; s.style.left = (52 + i * 34) + 'px';
    s.innerHTML = '<b></b><em>' + l + '</em>'; eqEl.appendChild(s); EQ.push(s.firstChild); });
  var mq = $('#mq'), tm = $('#tm'), seek = $('#seek');

  // pocket player
  var parts = {}; ['shell', 'batt', 'pcb', 'scr', 'wheel', 'ctr'].forEach(function (k) { parts[k] = $('#ipod .' + k); });
  var menu = $('#menu'), np = $('#np'), npn = $('#npn'), npc = $('#npc'), sbt = $('#sbt'), thumb = $('#thumb'), pbi = $('#pbi');
  var MI = [], ROWS = [], PINS = [];

  /* ---------- layout ---------- */
  var S = 1, BR = { x: 0, y: 0, w: 640, h: 640 }, vw = 0, vh = 0, portrait = false;
  function size() {
    vw = innerWidth; vh = innerHeight; portrait = vw / vh <= 1;
    var px = portrait ? Math.min(vw * 0.98, vh * 0.54) : Math.min(vh * 0.92, vw * 0.54, 780);
    S = px / 640; root.style.setProperty('--s', S);
    box.style.transform = 'none';
    var r = box.getBoundingClientRect(); BR = { x: r.left, y: r.top, w: r.width, h: r.height };
    canvas.style.left = BR.x + 'px'; canvas.style.top = BR.y + 'px'; canvas.style.width = BR.w + 'px'; canvas.style.height = BR.h + 'px';
    if (G) G.resize(BR.w, BR.h);
    ROWS.forEach(function (o) { o.el.style.transform = 'none'; });
    ugly.style.opacity = 1;
    ROWS.forEach(function (o) { var rr = o.el.getBoundingClientRect(); o.ox = rr.left + rr.width / 2; o.oy = rr.top + rr.height / 2; });
    last = -1;
  }

  /* ---------- data ---------- */
  function fill() {
    $('#nst').textContent = DATA.stations.toLocaleString('en-US');
    var L = DATA.list;
    menu.innerHTML = L.map(function (s) { return '<li><span>' + esc(s.n) + '</span></li>'; }).join('');
    MI = [].slice.call(menu.children);
    $('#rows').innerHTML = L.map(function (s) {
      return '<tr class="r"><td><a href="https://fm.24ailab.com" tabindex="-1">' + esc(s.n) + '</a></td><td>' + s.c + '</td><td class="s">' + s.k + ' ' + s.b + 'k</td></tr>';
    }).join('');
    ROWS = [].slice.call(document.querySelectorAll('#rows tr')).map(function (el, i) { return { el: el, s: L[i] }; });
    pinsEl.innerHTML = ''; PINS = L.map(function (s) { var e = document.createElement('div'); e.className = 'pin'; e.textContent = s.n; pinsEl.appendChild(e); return e; });
    size();
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  fetch('/fm/stations.json').then(function (r) { return r.json(); }).then(function (j) { DATA = j; fill(); }).catch(function () { fill(); });

  /* ---------- globe (lazy) ---------- */
  var G = null, gLoading = false, gFailed = false;
  function loadGlobe() {
    if (gLoading) return; gLoading = true;
    try { var t = document.createElement('canvas'); if (!(t.getContext('webgl2') || t.getContext('webgl'))) throw 0; } catch (e) { gFailed = true; return; }
    import('/fm/globe-story.js').then(function (m) {
      var go = function () { G = m.createGlobe(canvas, DATA.pts || []); G.resize(BR.w, BR.h); last = -1; };
      if (DATA.pts && DATA.pts.length) go(); else setTimeout(go, 800);
    }).catch(function () { gFailed = true; });
  }
  // orthographic fallback for pins if WebGL is unavailable
  function orth(lat, lng, lngC, latC) {
    var D = Math.PI / 180, x = Math.cos(lat * D) * Math.sin((lng - lngC) * D), y = Math.sin(lat * D), z = Math.cos(lat * D) * Math.cos((lng - lngC) * D);
    var y2 = y * Math.cos(latC * D) - z * Math.sin(latC * D), z2 = y * Math.sin(latC * D) + z * Math.cos(latC * D);
    var R = BR.w * 250 / 640; return [BR.w / 2 + x * R, BR.h / 2 - y2 * R, z2];
  }

  /* ---------- audio: everything synthesized (static, whistle, an original lo-fi loop) ---------- */
  var A = null, soundOn = false, btn = $('#snd');
  function audio() {
    if (A) return A;
    var C = new (window.AudioContext || window.webkitAudioContext)();
    var master = C.createGain(); master.gain.value = 0; master.connect(C.destination);
    var nb = C.createBuffer(1, C.sampleRate * 2, C.sampleRate), ch = nb.getChannelData(0);
    for (var i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (Math.random() < .0008 ? 3 : 1);
    var noise = C.createBufferSource(); noise.buffer = nb; noise.loop = true;
    var nbp = C.createBiquadFilter(); nbp.type = 'bandpass'; nbp.frequency.value = 1700; nbp.Q.value = .45;
    var nG = C.createGain(); nG.gain.value = 0; noise.connect(nbp).connect(nG).connect(master); noise.start();
    var wh = C.createOscillator(); wh.type = 'sine'; var wG = C.createGain(); wG.gain.value = 0; wh.connect(wG).connect(master); wh.start();
    var mus = C.createGain(), hp = C.createBiquadFilter(), lp = C.createBiquadFilter(), mG = C.createGain(), an = C.createAnalyser();
    hp.type = 'highpass'; lp.type = 'lowpass'; hp.frequency.value = 400; lp.frequency.value = 2600; mG.gain.value = 0; an.fftSize = 256; an.smoothingTimeConstant = .7;
    mus.connect(hp).connect(lp).connect(mG).connect(an).connect(master);
    var hb = C.createBuffer(1, C.sampleRate * .05, C.sampleRate), hc = hb.getChannelData(0); for (i = 0; i < hc.length; i++) hc[i] = (Math.random() * 2 - 1) * (1 - i / hc.length);
    var BPM = 92, st = 60 / BPM / 4, step = 0, next = C.currentTime + .1;
    var mtof = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
    var CH = [[45, 52, 55, 59, 60], [41, 48, 52, 57, 60], [48, 55, 59, 64, 67], [43, 50, 52, 59, 62]];
    function note(t, m, dur, type, g, dest) { var o = C.createOscillator(), e = C.createGain(); o.type = type; o.frequency.value = mtof(m);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + Math.min(.02, dur / 4)); e.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(e).connect(dest || mus); o.start(t); o.stop(t + dur + .05); }
    function sched() {
      while (next < C.currentTime + .25) {
        var bar = Math.floor(step / 16) % 4, s = step % 16, chd = CH[bar];
        if (s === 0) { chd.forEach(function (m) { note(next, m + 12, st * 16, 'triangle', .035); }); note(next, chd[0] - 12, st * 6, 'sine', .22); }
        if (s === 8) note(next, chd[0] - 12, st * 5, 'sine', .16);
        if ([0, 3, 6, 8, 10, 13].indexOf(s) >= 0) note(next, chd[(s * 7 + bar) % 5] + 24, st * 2.2, 'sine', .06);
        if (s % 4 === 2) { var h = C.createBufferSource(), hg = C.createGain(); h.buffer = hb; hg.gain.value = .05; h.connect(hg).connect(mus); h.start(next); }
        if (s === 0 || s === 8) { var k = C.createOscillator(), kg = C.createGain(); k.frequency.setValueAtTime(110, next); k.frequency.exponentialRampToValueAtTime(40, next + .12);
          kg.gain.setValueAtTime(.35, next); kg.gain.exponentialRampToValueAtTime(.001, next + .18); k.connect(kg).connect(mus); k.start(next); k.stop(next + .2); }
        next += st; step++;
      }
    }
    setInterval(sched, 60);
    A = { C: C, master: master, nG: nG, nbp: nbp, wh: wh, wG: wG, hp: hp, lp: lp, mG: mG, an: an, buf: new Uint8Array(an.frequencyBinCount) };
    return A;
  }
  function setSound(on) {
    soundOn = on; var a = audio(); if (a.C.state !== 'running') a.C.resume();
    a.master.gain.setTargetAtTime(on ? .8 : 0, a.C.currentTime, .15);
    btn.setAttribute('aria-pressed', on); btn.querySelector('.lbl').textContent = on ? 'Sound on' : 'Sound off';
    $('#try').textContent = on ? 'Sound is on' : 'Turn on the sound';
  }
  btn.addEventListener('click', function () { setSound(!soundOn); });
  $('#try').addEventListener('click', function () { setSound(true); });
  function aset(param, v, tc) { param.setTargetAtTime(v, A.C.currentTime, tc || .08); }

  /* ---------- scroll ---------- */
  var KEYS = [.13, .30, .50, .62, .78, .905, .975];
  function target() { var max = document.documentElement.scrollHeight - vh; var r = max > 0 ? cl(scrollY / max) : 0;
    return RM ? KEYS[Math.min(KEYS.length - 1, Math.floor(r * KEYS.length))] : r; }
  var P = target(), last = -1, t0 = performance.now(), prevT = t0;

  function frame(now) {
    var dt = Math.min(.05, (now - prevT) / 1000); prevT = now; var T = (now - t0) / 1000;
    var tp = target(); P = RM ? tp : (Math.abs(tp - P) < 1e-4 ? tp : P + (tp - P) * Math.min(1, dt * 7));
    var p = P;
    if (!G && !gFailed && p > .4) loadGlobe();

    /* 1. radio */
    var t1 = seg(p, .015, .125), f = lerp(F0, LOCK, eio(t1)) + (p < .015 ? .025 * Math.sin(T * .9) : 0);
    var near = Math.min.apply(null, [LOCK].concat(OTHER).map(function (o) { return Math.abs(f - o); }));
    var lockMain = cl(1 - Math.abs(f - LOCK) / .06), lockAny = cl(1 - near / .07);
    needle.style.transform = 'translateX(' + (fx(f) - 1).toFixed(2) + 'px)';
    freqEl.textContent = f.toFixed(3);
    tune.style.transform = 'rotate(' + (t1 * 900) + 'deg)';
    var bars = Math.round(lockAny * 6 * (lockMain > .9 ? 1 : .8 + .2 * Math.random()));
    for (var i = 0; i < 6; i++) sig[i].style.opacity = i < bars ? 1 : .15;
    led.className = lockMain > .9 ? 'on' : '';
    var rx = seg(p, .165, .235), rv = eio(rx);
    radio.style.transform = 'translateY(' + (rv * 90) + 'px) scale(' + (1 - rv * .1) + ')';
    radio.style.opacity = 1 - seg(p, .18, .235);
    radio.style.visibility = p > .24 ? 'hidden' : 'visible';
    ant.style.transform = 'rotate(14deg) scaleY(' + (1 - eio(seg(p, .15, .185)) * .82) + ')';

    /* 2. desktop + player */
    var dk = seg(p, .185, .245) * (1 - seg(p, .37, .44));
    desk.style.opacity = dk; desk.style.transform = 'scale(' + (1.04 - .04 * eout(seg(p, .185, .26))) + ')';
    body.classList.toggle('dark', dk > .5);
    var wo = eout(seg(p, .215, .265));
    win.style.opacity = wo; win.style.transform = 'translateY(' + ((1 - wo) * 14) + 'px)';
    // levels: analyser when sound is on, otherwise a believable procedural dance
    var lv = [];
    if (A && soundOn && A.C.state === 'running') { A.an.getByteFrequencyData(A.buf);
      for (c = 0; c < 12; c++) { var lo = Math.floor(Math.pow(2, c * 5.4 / 12) ), hi = Math.max(lo + 1, Math.floor(Math.pow(2, (c + 1) * 5.4 / 12))), sum = 0;
        for (var b = lo; b < hi && b < A.buf.length; b++) sum = Math.max(sum, A.buf[b]); lv.push(sum / 255 * 13); } }
    else { var beat = Math.pow(1 - ((T * 92 / 60) % 1), 3);
      for (c = 0; c < 12; c++) lv.push(cl(4 + 3.2 * Math.sin(T * 2.3 + c * .9) + 2.4 * Math.sin(T * 5.1 + c * 2.1) + beat * (9 - c * .55), 0, 12)); }
    for (i = 0; i < DOTS.length; i++) {
      var o = DOTS[i], m = eio(seg(p, .17 + o.c * .004 + (11 - o.lvl) * .0015, .25 + o.c * .004 + (11 - o.lvl) * .0015));
      var x = lerp(o.x0, o.x1, m), y = lerp(o.y0, o.y1, m) + (1 - m) * rv * 0;
      var w = lerp(11, 12, m), h = lerp(11, 4.6, m);
      o.el.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)';
      o.el.style.width = w + 'px'; o.el.style.height = h.toFixed(2) + 'px'; o.el.style.borderRadius = m > .5 ? '1px' : '50%';
      if (m > .55) { o.el.style.background = o.lvl < lv[o.c] ? o.col : o.dim; o.el.style.boxShadow = o.lvl < lv[o.c] && o.lvl > lv[o.c] - 1 ? '0 0 6px ' + o.col : 'none'; }
      else { o.el.style.background = ''; o.el.style.boxShadow = ''; }
    }
    mq.style.transform = 'translateX(' + (-((T * 28) % 330)) + 'px)';
    var secs = 84 + Math.floor(T); tm.textContent = ('0' + Math.floor(secs / 60)).slice(-2) + ':' + ('0' + secs % 60).slice(-2);
    seek.style.left = (((T * 3) % 360)) + 'px';
    for (i = 0; i < 10; i++) EQ[i].style.top = (22 - 16 * Math.sin(i / 9 * Math.PI) * .8 + 2 * Math.sin(T + i)) + 'px';
    // player shrinks into the pocket player's screen
    var k = eio(seg(p, .36, .45));
    wa.style.transform = 'translate(' + (130 * k) + 'px,' + (-30 * k) + 'px) scale(' + lerp(1, 160 / 420, k) + ',' + lerp(1, 120 / 260, k) + ')';
    wa.style.opacity = 1 - seg(p, .445, .47);
    wa.style.visibility = p > .475 ? 'hidden' : 'visible';

    /* 3. pocket player assembles */
    function part(el, a, b, from, ease, fadeOut) {
      var t = seg(p, a, b), e = (ease || eio)(t), q = 1 - e;
      el.style.transform = 'translate(' + (from[0] * q) + 'px,' + (from[1] * q) + 'px) rotate(' + (from[2] * q) + 'deg) scale(' + lerp(from[3], 1, e) + ')';
      var op = seg(p, a, a + (b - a) * .3); if (fadeOut) op *= 1 - seg(p, fadeOut[0], fadeOut[1]); el.style.opacity = op;
    }
    part(parts.shell, .34, .42, [-200, 80, -14, .82], eout);
    part(parts.batt, .345, .415, [-210, 160, -18, .9], eout, [.405, .43]);
    part(parts.pcb, .35, .42, [200, -150, 16, .9], eout, [.41, .435]);
    part(parts.scr, .385, .45, [0, -230, 0, 1.15], eout);
    part(parts.wheel, .4, .46, [220, 140, 160, .7], back);
    part(parts.ctr, .41, .47, [260, 220, 0, .4], back);
    var out = eio(seg(p, .68, .73));
    ipod.style.transform = 'translateY(' + (out * 40) + 'px) scale(' + (1 - out * .06) + ')';
    ipod.style.opacity = 1 - out;
    ipod.style.visibility = p > .735 || p < .335 ? 'hidden' : 'visible';

    /* 4. the wheel */
    var dd = seg(p, .52, .645), ang = eio(dd) * 540;
    thumb.style.opacity = seg(p, .515, .53) * (1 - seg(p, .655, .67));
    thumb.style.transform = 'rotate(' + ang + 'deg)';
    var inMenu = p > .515 && p < .655 ? 1 : 0, nL = MI.length || 1;
    var sel = Math.min(nL - 1, Math.round(eio(dd) * 7));
    menu.style.opacity = inMenu; np.style.opacity = 1 - inMenu; sbt.textContent = inMenu ? 'Stations' : 'Now Playing';
    for (i = 0; i < MI.length; i++) MI[i].className = i === sel ? 'sel' : '';
    menu.style.transform = 'translateY(' + (-Math.max(0, sel - 5) * 16.5) + 'px)';
    var clk = seg(p, .645, .665); parts.ctr.style.transform += ' scale(' + (1 - .1 * Math.sin(clk * Math.PI)) + ')';
    if (p > .655 && DATA.list[7]) { npn.textContent = DATA.list[7].n; npc.textContent = DATA.list[7].c + ' · ' + DATA.list[7].k + ' ' + DATA.list[7].b + ' kbps'; }
    else { npn.textContent = 'Shortwave Night'; npc.textContent = '9.58 MHz · 31 m band'; }
    pbi.style.width = (20 + (T * 2) % 70) + '%';

    /* 5. the wheel becomes the planet */
    var gr = eio(seg(p, .68, .755)), cx = 320, cy = lerp(392, 320, gr), R = lerp(80, 250, gr);
    ring.style.left = (cx - R) + 'px'; ring.style.top = (cy - R) + 'px'; ring.style.width = ring.style.height = (2 * R) + 'px';
    var ringOp = p < .68 ? 0 : 1 - (G ? seg(p, .75, .775) : 0);
    ring.style.opacity = ringOp;
    ring.style.background = gr < .02 ? '#e9ecf0' : '#e8f2fc';
    var go = seg(p, .735, .765);
    // final composition: the globe slides to center
    var fz = eio(seg(p, .89, .96));
    var sx = portrait ? 0 : (vw / 2 - (BR.x + BR.w / 2)) * fz, sy = (portrait ? -vh * .2 : -vh * .12) * fz, ss = 1 - (portrait ? .1 : .12) * fz;
    var tf = 'translate(' + sx + 'px,' + sy + 'px) scale(' + ss + ')';
    box.style.transform = tf; canvas.style.transform = tf;
    var lngC = lerp(-95, 5, eio(seg(p, .68, .9))) + (p > .9 ? (T % 360) * 2 * fz : 0), latC = 28;
    if (G) { canvas.style.opacity = go; if (go > 0) G.render(lngC, latC, seg(p, .82, .9) * .9); }
    // ugly list rows fly and land as pins
    ugly.style.opacity = seg(p, .75, .78) * (1 - seg(p, .875, .895));
    ugly.style.visibility = p < .74 || p > .9 ? 'hidden' : 'visible';
    var gcx = BR.x + BR.w / 2, gcy = BR.y + BR.h / 2;
    for (i = 0; i < ROWS.length; i++) {
      var s = ROWS[i].s, fl = eio(seg(p, .79 + i * .006, .83 + i * .006));
      var pr = G ? G.project(s.lat, s.lng) : orth(s.lat, s.lng, lngC, latC);
      var X = gcx + (pr[0] - BR.w / 2) * ss + sx, Y = gcy + (pr[1] - BR.h / 2) * ss + sy;
      ROWS[i].el.style.transform = fl > 0 ? 'translate(' + ((X - ROWS[i].ox) * fl) + 'px,' + ((Y - ROWS[i].oy) * fl - Math.sin(fl * Math.PI) * 60) + 'px) scale(' + lerp(1, .12, fl) + ')' : 'none';
      ROWS[i].el.style.opacity = 1 - seg(fl, .8, 1);
      var po = seg(fl, .85, 1) * cl((pr[2] - .05) * 6) * (1 - seg(p, .93, .97) * (portrait ? 1 : .0));
      PINS[i].style.opacity = po; PINS[i].style.transform = 'translate(' + X.toFixed(1) + 'px,' + Y.toFixed(1) + 'px) translate(-50%,-50%) scale(' + lerp(.6, 1, eout(seg(fl, .85, 1))) + ')';
    }

    /* captions + final */
    caps.forEach(function (el, j) {
      var a = +el.dataset.a, b2 = +el.dataset.b, inn = a === 0 ? 1 : eout(seg(p, a, a + .025)), ou = 1 - seg(p, b2 - .02, b2), op = Math.min(inn, ou);
      el.style.opacity = op; el.style.setProperty('--y', ((1 - inn) * 26 - (1 - ou) * 18) + 'px'); el.style.visibility = op > 0 ? 'visible' : 'hidden';
      var bt = el.querySelector('.try'); if (bt) bt.style.pointerEvents = op > .5 ? 'auto' : 'none';
    });
    var fo = eout(seg(p, .91, .965)); fin.style.opacity = fo; fin.classList.toggle('on', fo > .5); fin.style.transform = 'translateY(' + ((1 - fo) * 30) + 'px)';
    hint.style.opacity = 1 - seg(p, .005, .03);

    /* sound follows the era */
    if (A && soundOn) {
      var radioEra = 1 - seg(p, .16, .24), q = .75 + .25 * Math.sin(T * 1.3);
      aset(A.nG.gain, radioEra * (.06 + .34 * (1 - lockAny)) + seg(p, .74, .82) * (1 - seg(p, .86, .9)) * .05);
      aset(A.mG.gain, lerp(1, radioEra ? lockMain * q : 1, radioEra) * (1 - .35 * seg(p, .9, 1)));
      aset(A.hp.frequency, lerp(30, lerp(90, 420, radioEra), 1 - seg(p, .36, .46)), .2);
      aset(A.lp.frequency, p < .17 ? 2600 : p < .36 ? 9500 : 19000, .25);
      var dw = Math.min.apply(null, [LOCK].concat(OTHER).map(function (o) { return Math.abs(f - o); }));
      aset(A.wh.frequency, 300 + dw * 9000); aset(A.wG.gain, radioEra * (dw > .004 && dw < .12 ? .03 : 0));
    }
    requestAnimationFrame(frame);
  }

  addEventListener('resize', size);
  size();
  requestAnimationFrame(frame);
  if ('requestIdleCallback' in window) requestIdleCallback(function () { setTimeout(loadGlobe, 2500); }); else setTimeout(loadGlobe, 3500);
  window.__fm = { get p() { return P; } };
})();
