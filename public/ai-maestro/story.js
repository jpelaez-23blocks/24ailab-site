/* AI Maestro story: sets the active beat on #stage from the caption in view. */
(function () {
  var st = document.getElementById('stage'); if (!st) return;
  var steps = [].slice.call(document.querySelectorAll('.story .step'));
  function set(el) {
    var b = +el.dataset.b, s = +el.dataset.s, c = ['b' + b, 's' + s];
    for (var i = 1; i <= b; i++) c.push('ge' + i);
    var sg = b > 5 ? 3 : (b === 5 ? s : 0); for (var j = 1; j <= sg; j++) c.push('sg' + j);
    st.className = 'stage on ' + c.join(' ');
    steps.forEach(function (x) { x.classList.toggle('cur', x === el); });
  }
  set(steps[0]);
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) set(e.target); }); }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(function (x) { io.observe(x); });
})();
