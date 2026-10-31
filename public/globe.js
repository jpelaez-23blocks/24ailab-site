// Team globe: same globe.gl look as fm.24ailab.com/globe.html
(function () {
  var el = document.getElementById('globe');
  var fb = function () { el.classList.add('noglobe'); };
  try { var c = document.createElement('canvas'); if (!(c.getContext('webgl2') || c.getContext('webgl'))) return fb(); } catch (e) { return fb(); }
  var PINS = [
    { name: 'Colorado', lat: 39.0, lng: -105.5 },
    { name: 'Colombia', lat: 4.6, lng: -74.1 },
    { name: 'Singapore', lat: 1.35, lng: 103.82 }
  ];
  function pin(d) { var e = document.createElement('div'); e.className = 'tpin'; e.textContent = d.name; return e; }
  function start() {
    if (!window.Globe) return fb();
    try {
      var w = Globe()(el).width(el.clientWidth).height(el.clientHeight)
        .backgroundColor('rgba(0,0,0,0)').showAtmosphere(true).atmosphereColor('#9cc9ff').atmosphereAltitude(0.18)
        .hexPolygonResolution(3).hexPolygonMargin(0.25).hexPolygonUseDots(false).hexPolygonColor(function () { return '#a9bdd3'; })
        .htmlElementsData(PINS).htmlLat('lat').htmlLng('lng').htmlAltitude(0.01).htmlElement(pin);
      var m = w.globeMaterial(); m.color.set('#e8f2fc'); if ('shininess' in m) m.shininess = 4;
      w.pointOfView({ lat: 15, lng: -60, altitude: 2.3 });
      var ctl = w.controls(); ctl.enableDamping = true; ctl.minDistance = 160; ctl.maxDistance = 600;
      ctl.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches; ctl.autoRotateSpeed = 0.5;
      fetch('/countries.geojson').then(function (r) { return r.json(); }).then(function (g) { w.hexPolygonsData(g.features); }).catch(function () {});
      addEventListener('resize', function () { w.width(el.clientWidth).height(el.clientHeight); });
    } catch (e) { fb(); }
  }
  var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/globe.gl@2'; s.async = true;
  s.onload = start; s.onerror = fb; document.head.appendChild(s);
})();
