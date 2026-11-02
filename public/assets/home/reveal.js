/* Scroll reveal (preview): fade + 12px rise, once, staggered via --i. No-JS and reduced motion: everything visible. */
(function(){
var D=document.documentElement,els=[].slice.call(document.querySelectorAll('[data-reveal]'));
function all(){els.forEach(function(e){e.classList.add('in');});}
if(!D.classList.contains('js-reveal'))return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)){all();return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px',threshold:0.15});
els.forEach(function(e){io.observe(e);});
setTimeout(function(){els.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight){e.classList.add('in');}});},2500);
})();
