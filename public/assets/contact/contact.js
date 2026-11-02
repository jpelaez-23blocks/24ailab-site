/* Contact previews: shared helpers. 2xAI Lab.
   PLACEHOLDER DATA: every value in CONTACT below is made up for the preview. Swap with real values later. */
window.CONTACT = {
  /* What is public on /contact. false = card shows "Coming soon" and none of its details reach the page. */
  live: { email: true, call: false, social: false, walkin: false, addresses: false },
  email: 'hello@24ailab.com',                       // real
  phoneUS: { label: '+1 (303) 555-0124', tel: '+13035550124' },   // PLACEHOLDER (555 test range)
  phoneSG: { label: '+65 6555 0100', tel: '+6565550100' },        // PLACEHOLDER
  socials: [                                                       // PLACEHOLDER handles
    { name: 'X', handle: '@24ailab', url: 'https://x.com/24ailab' },
    { name: 'Instagram', handle: '@24ailab', url: 'https://instagram.com/24ailab' },
    { name: 'LinkedIn', handle: '24ailab', url: 'https://www.linkedin.com/company/24ailab' },
    { name: 'GitHub', handle: '24ailab', url: 'https://github.com/24ailab' }
  ],
  offices: {                                                       // PLACEHOLDER addresses + hours
    colorado:  { addr: ['1234 Pearl Street, Suite 200', 'Boulder, CO 80302'], tz: 'America/Denver',  lat: 40.0150, lon: -105.2705, open: 9, close: 18, unit: 'fahrenheit', alt: '5,328' },
    colombia:  { remote: true, tz: 'America/Bogota', lat: 6.2442, lon: -75.5812, unit: 'celsius' },
    singapore: { addr: ['10 Example Road, #08-01', 'Singapore 018989'], tz: 'Asia/Singapore', lat: 1.2834,  lon: 103.8607,  open: 9, close: 18, unit: 'celsius' }
  }
};
(function(){
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
window.SIG = { RM: RM, AC: '#1a6fd6', FG: '#1d2a3a',
  /* the splash oscilloscope trace (preview/splash/splash.js), k = trace index 0..4 */
  y: function(u, t, k){ return Math.sin(u*(6+k*1.7)*Math.PI+t*(2+k*.6)+k)*.6 + Math.sin(u*(13+k*2.3)*Math.PI-t*3+k*2)*.25*Math.cos(t+k); },
  fit: function(cv){ var D=Math.min(devicePixelRatio||1,2), r=cv.getBoundingClientRect(), c=cv.getContext('2d');
    cv.width=Math.max(1,r.width*D); cv.height=Math.max(1,r.height*D); c.setTransform(D,0,0,D,0,0); c.lineCap='round'; c.lineJoin='round'; return {c:c,W:r.width,H:r.height}; },
  /* run draw(t) on rAF while visible; static single frame under reduced motion */
  loop: function(cv, draw, speed){ var raf=0, vis=true, t0=null, tp=0, s=speed||0.35;
    function f(ts){ if(t0===null)t0=ts-tp*1000; tp=(ts-t0)/1000; draw(tp*s); raf=(vis&&!document.hidden)?requestAnimationFrame(f):0; }
    function go(){ if(!raf&&!RM&&vis&&!document.hidden){ t0=null; raf=requestAnimationFrame(f);} }
    draw(1.3);
    addEventListener('resize', function(){ draw(RM?1.3:tp*s); });
    if(RM) return { kick: function(){ draw(1.3); } };
    if('IntersectionObserver' in window) new IntersectionObserver(function(e){ vis=e[0].isIntersecting; go(); }).observe(cv);
    document.addEventListener('visibilitychange', go); go();
    return { kick: function(){ go(); if(!raf) draw(tp*s); } };
  }
};
/* copy email buttons */
document.addEventListener('click', function(e){
  var b = e.target.closest('[data-copy]'); if(!b) return;
  var v = b.getAttribute('data-copy'), live = document.getElementById('copy-live');
  function done(){ var o=b.textContent; b.textContent='Copied'; if(live) live.textContent='Email address copied'; setTimeout(function(){ b.textContent=o; },2000); }
  if(navigator.clipboard) navigator.clipboard.writeText(v).then(done, function(){});
});
/* office local time, open status, weather */
function parts(tz){ var p={}; new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',minute:'2-digit',hour12:false,weekday:'short'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value;}); return p; }
window.officeNow = function(key){ var o=CONTACT.offices[key], p=parts(o.tz), h=+p.hour%24, m=+p.minute, wd=p.weekday;
  var openNow = !o.remote && wd!=='Sat' && wd!=='Sun' && h>=o.open && h<o.close;
  return { h:h, m:m, wd:wd, openNow:openNow, frac:(h*60+m)/1440,
    time: new Intl.DateTimeFormat('en-US',{timeZone:o.tz,hour:'numeric',minute:'2-digit'}).format(new Date()) }; };
function tick(){ document.querySelectorAll('[data-office]').forEach(function(el){ var k=el.getAttribute('data-office'), n=officeNow(k);
  var t=el.querySelector('.otime'); if(t && t.textContent!==n.time){ t.textContent=n.time; }
  var s=el.querySelector('.ostat'); if(s) s.textContent = CONTACT.offices[k].remote ? 'Remote team\nReachable by email' : n.openNow ? 'In the office now' : 'Out of office.\nBack at '+CONTACT.offices[k].open+':00 local';
  el.classList.toggle('isopen', n.openNow); });
  document.dispatchEvent(new Event('officetick')); }
tick(); setInterval(tick, 30000);
var WMO={0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Cloudy',45:'Fog',48:'Fog',51:'Drizzle',53:'Drizzle',55:'Drizzle',61:'Rain',63:'Rain',65:'Heavy rain',71:'Snow',73:'Snow',75:'Heavy snow',80:'Showers',81:'Showers',82:'Showers',95:'Storm'};
document.querySelectorAll('[data-office] .owx').forEach(function(w){
  var k=w.closest('[data-office]').getAttribute('data-office'), o=CONTACT.offices[k], key='wx-'+k;
  function show(d){ if(!d||d.t==null){ w.hidden=true; return; } var lab=Math.round(d.t)+(o.unit==='celsius'?'°C':'°F')+' · '+(WMO[d.c]||'Weather'); w.textContent=lab; w.hidden=false; (window.WX=window.WX||{})[k]={label:lab.toUpperCase()}; document.dispatchEvent(new Event('wx')); }
  try{ var c=JSON.parse(sessionStorage.getItem(key)||'null'); if(c&&Date.now()-c.at<9e5){ show(c); return; } }catch(e){}
  var ctl = window.AbortController ? new AbortController() : null; if(ctl) setTimeout(function(){ ctl.abort(); }, 5000);
  fetch('https://api.open-meteo.com/v1/forecast?latitude='+o.lat+'&longitude='+o.lon+'&current=temperature_2m,weather_code&temperature_unit='+o.unit+'&timezone=auto', ctl?{signal:ctl.signal}:{})
   .then(function(r){ return r.ok?r.json():null; })
   .then(function(j){ if(!j||!j.current){ w.hidden=true; return; } var d={t:j.current.temperature_2m,c:j.current.weather_code,at:Date.now()}; try{sessionStorage.setItem(key,JSON.stringify(d));}catch(e){} show(d); })
   .catch(function(){ w.hidden=true; });
});
})();

/* Render channel and address details only for channels switched on in CONTACT.live */
(function(){
var L=CONTACT.live||{}, d=document;
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function on(card){ if(!card)return; card.classList.remove('off'); card.removeAttribute('aria-disabled'); var s=card.querySelector('.soon'); if(s)s.remove();
  var id=card.id.replace('ch-',''), b=d.querySelector('[data-ch="'+id+'"]'); if(b){b.removeAttribute('data-soon');b.removeAttribute('aria-label');var c=b.querySelector('.schip');if(c)c.remove();}
  card.querySelectorAll('[data-href]').forEach(function(a){a.href=a.getAttribute('data-href');a.removeAttribute('aria-disabled');a.removeAttribute('tabindex');}); }
function slot(n,html){var e=d.querySelector('[data-slot="'+n+'"]'); if(e)e.innerHTML=html;}
function run(){
 if(L.call){ slot('call',[CONTACT.phoneUS,CONTACT.phoneSG].map(function(p){return '<p class="big"><a href="tel:'+esc(p.tel)+'">'+esc(p.label)+'</a></p>';}).join('')); on(d.getElementById('ch-call')); }
 if(L.social){ slot('social','<ul class="soc">'+CONTACT.socials.map(function(x){return '<li><a href="'+esc(x.url)+'" rel="noopener">'+esc(x.name)+' <span>'+esc(x.handle)+'</span></a></li>';}).join('')+'</ul>'); on(d.getElementById('ch-social')); }
 if(L.walkin) on(d.getElementById('ch-walk'));
 if(L.addresses) d.querySelectorAll('[data-office]').forEach(function(o){var a=CONTACT.offices[o.getAttribute('data-office')].addr, e=o.querySelector('[data-slot="addr"]'); if(!a||!e)return;
   var q='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(a.join(' '));
   e.innerHTML='<address>'+a.map(esc).join('<br>')+'</address><div class="row"><a class="cbtn" href="'+esc(q)+'" rel="noopener">Get directions</a></div>';});
 d.querySelectorAll('.chan.off a[aria-disabled]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();});});
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',run);else run();
})();
