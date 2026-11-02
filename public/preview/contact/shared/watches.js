/* Office wristwatches (preview). Original designs: no real brands, logos or trademarked layouts.
   lux   = Singapore, a gold dress watch with a sunburst dial, applied indices, dauphine hands, smooth sweep seconds.
   sport = Colorado, a rugged GPS sports watch with 5 buttons, a MIP-style screen, ticking seconds.
   Steps on the sport watch are decorative (they follow the time of day), not real data.
   Reduced motion: no seconds hand or seconds marker; the time just updates. */
(function(){
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,NS='http://www.w3.org/2000/svg';
window.WX=window.WX||{};
function offset(tz){var d=new Date(),p={};new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(d).forEach(function(x){p[x.type]=+x.value||x.value;});
 return Date.UTC(p.year,p.month-1,p.day,p.hour%24,p.minute,p.second)-(d.getTime()-d.getMilliseconds());}
function f(n){return n.toFixed(2);}
function pol(r,a){a=(a-90)*Math.PI/180;return [100+r*Math.cos(a),140+r*Math.sin(a)];}
function rot(el,deg){el.setAttribute('transform','rotate('+f(deg)+' 100 140)');}

function lux(p){var s='',i,a,q;
 s+='<defs>'+
 '<linearGradient id="'+p+'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf0c8"/><stop offset=".22" stop-color="#d8b25c"/><stop offset=".45" stop-color="#fff6d6"/><stop offset=".62" stop-color="#b48a35"/><stop offset=".85" stop-color="#e8cd85"/><stop offset="1" stop-color="#8f6a22"/></linearGradient>'+
 '<linearGradient id="'+p+'g2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3cf"/><stop offset=".5" stop-color="#c79d45"/><stop offset="1" stop-color="#f1dc9b"/></linearGradient>'+
 '<radialGradient id="'+p+'d" cx=".42" cy=".38" r=".75"><stop offset="0" stop-color="#2f5b95"/><stop offset=".55" stop-color="#173560"/><stop offset="1" stop-color="#0a1a33"/></radialGradient>'+
 '<linearGradient id="'+p+'sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".06"/></linearGradient>'+
 '<linearGradient id="'+p+'st" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a170d"/><stop offset=".2" stop-color="#4a2b18"/><stop offset=".5" stop-color="#5a3520"/><stop offset=".8" stop-color="#4a2b18"/><stop offset="1" stop-color="#24140b"/></linearGradient>'+
 '<filter id="'+p+'ds" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy=".8" stdDeviation=".6" flood-color="#000" flood-opacity=".55"/></filter>'+
 '<filter id="'+p+'cs" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1d2a3a" flood-opacity=".28"/></filter>'+
 '<clipPath id="'+p+'dc"><circle cx="100" cy="140" r="64"/></clipPath>'+
 '</defs>';
 s+='<g class="strap">';
 /* leather strap with stitching */
 s+='<path d="M70 0 H130 L127 70 H73 Z" fill="url(#'+p+'st)"/><path d="M73 210 H127 L130 280 H70 Z" fill="url(#'+p+'st)"/>';
 s+='<path d="M76 0 L78 66 M124 0 L122 66 M78 214 L76 280 M122 214 L124 280" stroke="#e6cf9f" stroke-opacity=".55" stroke-width=".8" stroke-dasharray="3 2.4" fill="none"/>';
 s+='<path d="M70 0 H130 M73 70 H127" stroke="#000" stroke-opacity=".15"/>';
 s+='</g>';
 /* lugs + case */
 s+='<g filter="url(#'+p+'cs)"><path d="M68 92 L74 58 Q76 54 82 56 L88 74 Z M132 92 L126 58 Q124 54 118 56 L112 74 Z M68 188 L74 222 Q76 226 82 224 L88 206 Z M132 188 L126 222 Q124 226 118 224 L112 206 Z" fill="url(#'+p+'g)"/>';
 /* crown */
 s+='<rect x="174" y="132" width="11" height="16" rx="2.5" fill="url(#'+p+'g2)"/><rect x="171" y="135" width="4" height="10" fill="#9c7428"/>';
 for(i=0;i<6;i++)s+='<line x1="'+(176+i*1.6)+'" y1="133" x2="'+(176+i*1.6)+'" y2="147" stroke="#7a5717" stroke-opacity=".55" stroke-width=".5"/>';
 s+='<circle cx="100" cy="140" r="77" fill="url(#'+p+'g)"/></g>';
 s+='<circle cx="100" cy="140" r="77" fill="none" stroke="#6e5016" stroke-opacity=".5" stroke-width=".6"/>';
 s+='<circle cx="100" cy="140" r="72" fill="url(#'+p+'g2)"/><circle cx="100" cy="140" r="69.5" fill="url(#'+p+'g)"/><circle cx="100" cy="140" r="67.5" fill="#5e430f"/><path d="M36 118 A68 68 0 0 1 120 75" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/>';
 /* dial: sunburst + guilloche centre */
 s+='<g clip-path="url(#'+p+'dc)"><circle cx="100" cy="140" r="64" fill="url(#'+p+'d)"/><g stroke="#fff" stroke-width=".35">';
 for(i=0;i<180;i++){a=i*2;q=pol(64,a);s+='<line x1="100" y1="140" x2="'+f(q[0])+'" y2="'+f(q[1])+'" stroke-opacity="'+(i%2?.035:.075)+'"/>';}
 s+='</g><g fill="none" stroke="#fff" stroke-opacity=".05" stroke-width=".35">';
 for(i=0;i<24;i++){q=pol(6,i*15);s+='<circle cx="'+f(q[0])+'" cy="'+f(q[1])+'" r="16"/>';}
 s+='</g><circle cx="100" cy="140" r="64" fill="url(#'+p+'sh)"/></g>';
 /* minute track */
 s+='<g stroke="#e9d39a" stroke-opacity=".75">';
 for(i=0;i<60;i++){var o=pol(62,i*6),n=pol(i%5?59.5:58,i*6);s+='<line x1="'+f(o[0])+'" y1="'+f(o[1])+'" x2="'+f(n[0])+'" y2="'+f(n[1])+'" stroke-width="'+(i%5?.45:.9)+'"/>';}
 s+='</g><circle cx="100" cy="140" r="62.6" fill="none" stroke="#e9d39a" stroke-opacity=".5" stroke-width=".4"/>';
 /* applied indices */
 s+='<g filter="url(#'+p+'ds)">';
 for(i=0;i<12;i++){var dbl=i===0,w=dbl?2.4:3,len=i%3?10:13;
  [dbl?-2.6:0,dbl?2.6:null].forEach(function(dx){if(dx===null)return;
   s+='<g transform="rotate('+(i*30)+' 100 140)"><rect x="'+f(100+dx-w/2)+'" y="'+(140-56)+'" width="'+w+'" height="'+len+'" rx=".6" fill="url(#'+p+'g)"/><rect x="'+f(100+dx-w/2)+'" y="'+(140-56)+'" width="'+f(w/2)+'" height="'+len+'" fill="#fff" fill-opacity=".35"/></g>';});}
 s+='</g>';
 s+='<text x="100" y="117" text-anchor="middle" font-family="Outfit,system-ui,sans-serif" font-size="5.6" letter-spacing="1.6" fill="#f3e2b0" fill-opacity=".9">SINGAPORE</text>';
 s+='<text x="100" y="170" text-anchor="middle" font-family="Outfit,system-ui,sans-serif" font-size="3.9" letter-spacing="1.4" fill="#f3e2b0" fill-opacity=".65">AUTOMATIC</text>';
 /* dauphine hands */
 function hand(cls,L,w){return '<g class="'+cls+'" filter="url(#'+p+'ds)"><polygon points="100,'+(140-L)+' '+(100+w)+',138 100,'+(140+8)+'" fill="#b38a37"/><polygon points="100,'+(140-L)+' '+(100-w)+',138 100,'+(140+8)+'" fill="#fbebbb"/></g>';}
 s+=hand('hh',34,3.6)+hand('mh',52,3);
 s+='<g class="sh" filter="url(#'+p+'ds)"><line x1="100" y1="156" x2="100" y2="80" stroke="#f0d88f" stroke-width=".8"/><circle cx="100" cy="153" r="2.4" fill="#e3c574"/></g>';
 s+='<circle cx="100" cy="140" r="3" fill="url(#'+p+'g)"/><circle cx="100" cy="140" r="1" fill="#7a5717"/>';
 /* crystal reflection */
 s+='<path d="M48 112 A58 58 0 0 1 132 86 A70 70 0 0 0 48 112Z" fill="#fff" fill-opacity=".18"/><circle cx="100" cy="140" r="67.5" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>';
 return s;}

function sport(p,place){var s='',i,a,q;
 s+='<defs>'+
 '<linearGradient id="'+p+'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a939e"/><stop offset=".35" stop-color="#3c434c"/><stop offset=".6" stop-color="#5d6672"/><stop offset="1" stop-color="#1c2026"/></linearGradient>'+
 '<linearGradient id="'+p+'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa3ad"/><stop offset=".5" stop-color="#4b525b"/><stop offset="1" stop-color="#2a2f35"/></linearGradient>'+
 '<radialGradient id="'+p+'m" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#e3e6dc"/><stop offset=".7" stop-color="#c9cdc0"/><stop offset="1" stop-color="#aeb3a5"/></radialGradient>'+
 '<linearGradient id="'+p+'s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#16191d"/><stop offset=".25" stop-color="#2d333a"/><stop offset=".5" stop-color="#363d45"/><stop offset=".75" stop-color="#2d333a"/><stop offset="1" stop-color="#14171a"/></linearGradient>'+
 '<filter id="'+p+'cs" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1d2a3a" flood-opacity=".3"/></filter>'+
 '</defs>';
 s+='<g class="strap">';
 /* silicone strap with grooves and holes */
 s+='<path d="M64 0 H136 L132 72 H68 Z" fill="url(#'+p+'s)"/><path d="M68 208 H132 L136 280 H64 Z" fill="url(#'+p+'s)"/>';
 for(i=0;i<5;i++)s+='<path d="M'+(69+i*.4)+' '+(14+i*11)+' H'+(131-i*.4)+'" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><path d="M'+(69+i*.4)+' '+(15.4+i*11)+' H'+(131-i*.4)+'" stroke="#fff" stroke-opacity=".06"/>';
 for(i=0;i<4;i++)s+='<ellipse cx="100" cy="'+(232+i*13)+'" rx="3.2" ry="2.4" fill="#0b0d0f"/><ellipse cx="100" cy="'+(231.3+i*13)+'" rx="3.2" ry="1.4" fill="#fff" fill-opacity=".05"/>';
 s+='</g>';
 /* buttons: 3 left, 2 right */
 s+='<g filter="url(#'+p+'cs)">';
 [[-60,0],[-90,0],[-120,0],[60,1],[120,0]].forEach(function(b){var ang=b[0];
  s+='<g transform="rotate('+ang+' 100 140)"><rect x="94" y="49" width="12" height="9" rx="2" fill="url(#'+p+'k)"/>'+(b[1]?'<rect x="94" y="49" width="12" height="2.2" rx="1" fill="#1a6fd6"/>':'')+'<line x1="96" y1="53.5" x2="104" y2="53.5" stroke="#000" stroke-opacity=".35" stroke-width=".6"/></g>';});
 s+='<circle cx="100" cy="140" r="84" fill="url(#'+p+'b)"/></g>';
 s+='<circle cx="100" cy="140" r="84" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".8"/><circle cx="100" cy="140" r="82.6" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".7"/>';
 /* bezel: engraved ticks, labels, screws */
 s+='<circle cx="100" cy="140" r="76" fill="#262b31"/>';
 for(i=0;i<60;i++){var o=pol(76,i*6),n=pol(i%5?73.5:71.5,i*6);s+='<line x1="'+f(o[0])+'" y1="'+f(o[1])+'" x2="'+f(n[0])+'" y2="'+f(n[1])+'" stroke="#cfd5dc" stroke-opacity="'+(i%5?.35:.8)+'" stroke-width="'+(i%5?.5:1)+'"/>';}
 [[0,'N'],[90,'E'],[180,'S'],[270,'W']].forEach(function(t){q=pol(66.5,t[0]);s+='<text x="'+f(q[0])+'" y="'+f(q[1]+2.2)+'" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-weight="500" font-size="6.2" fill="'+(t[1]=='N'?'#ff6a3d':'#cfd5dc')+'">'+t[1]+'</text>';});
 [45,135,225,315].forEach(function(d){q=pol(80,d);s+='<circle cx="'+f(q[0])+'" cy="'+f(q[1])+'" r="2.1" fill="#9aa3ad"/><line x1="'+f(q[0]-1.3)+'" y1="'+f(q[1])+'" x2="'+f(q[0]+1.3)+'" y2="'+f(q[1])+'" stroke="#2a2f35" stroke-width=".6" transform="rotate('+(d+20)+' '+f(q[0])+' '+f(q[1])+')"/>';});
 /* MIP screen */
 s+='<circle cx="100" cy="140" r="61" fill="#111"/><circle cx="100" cy="140" r="59" fill="url(#'+p+'m)"/>';
 s+='<path class="arc" d="" fill="none" stroke="#1a6fd6" stroke-width="3.2" stroke-linecap="round"/>';
 s+='<circle class="sd" r="2" fill="#1d2a3a"/>';
 s+='<text class="wx" x="100" y="106" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-weight="500" font-size="7" fill="#1d2a3a"></text>';
 s+='<text class="dt" x="100" y="121" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-weight="500" font-size="6.6" letter-spacing=".8" fill="#1d2a3a" fill-opacity=".75"></text>';
 s+='<text class="tm" x="100" y="152" text-anchor="middle" font-family="Outfit,system-ui,sans-serif" font-weight="700" font-size="32" letter-spacing="-.5" fill="#0f1418"></text>';
 s+='<line x1="70" y1="160" x2="130" y2="160" stroke="#1d2a3a" stroke-opacity=".3" stroke-width=".6"/>';
 s+='<text class="stp" x="82" y="172" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-weight="500" font-size="6.4" fill="#1d2a3a"></text>';
 s+='<text x="82" y="179" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="4.2" fill="#1d2a3a" fill-opacity=".6">STEPS</text>';
 s+='<text x="118" y="172" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-weight="500" font-size="6.4" fill="#1d2a3a">'+(place.alt||'')+'</text>';
 s+='<text x="118" y="179" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="4.2" fill="#1d2a3a" fill-opacity=".6">ALT FT</text>';
 s+='<path d="M100 186 l-3 5 h6z" fill="#1d2a3a" fill-opacity=".55"/>';
 /* glass glare */
 s+='<path d="M50 120 A52 52 0 0 1 128 88 A60 60 0 0 0 50 120Z" fill="#fff" fill-opacity=".22"/>';
 return s;}

var W=[].slice.call(document.querySelectorAll('.watch[data-watch]')),DAYS=['SUN','MON','TUE','WED','THU','FRI','SAT'];
W.forEach(function(el,ix){var key=el.closest('[data-office]').getAttribute('data-office'),o=CONTACT.offices[key],kind=el.getAttribute('data-watch'),p='w'+ix+kind;
 var svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 200 280');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
 svg.innerHTML=kind=='lux'?lux(p):sport(p,{alt:o.alt});el.appendChild(svg);
 var mode=el.getAttribute('data-strap')||'full',sg=svg.querySelector('.strap');
 if(mode=='none'){sg.remove();svg.setAttribute('viewBox','4 44 192 192');}
 else if(mode=='stub'){svg.setAttribute('viewBox','0 24 200 232');var m=document.createElementNS(NS,'mask');m.id=p+'fm';m.setAttribute('maskUnits','userSpaceOnUse');
  m.innerHTML='<linearGradient id="'+p+'fg" x1="0" y1="24" x2="0" y2="256" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".2" stop-color="#fff" stop-opacity=".9"/><stop offset=".8" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><rect x="0" y="0" width="200" height="280" fill="url(#'+p+'fg)"/>';
  svg.querySelector('defs').appendChild(m);sg.setAttribute('mask','url(#'+p+'fm)');}
 var off=offset(o.tz),offAt=Date.now(),last=-1,vis=true,raf=0;
 var hh=svg.querySelector('.hh'),mh=svg.querySelector('.mh'),sh=svg.querySelector('.sh'),tm=svg.querySelector('.tm'),dt=svg.querySelector('.dt'),wx=svg.querySelector('.wx'),stp=svg.querySelector('.stp'),arc=svg.querySelector('.arc'),sd=svg.querySelector('.sd');
 if(RM){if(sh)sh.style.display='none';if(sd)sd.style.display='none';}
 function render(){if(Date.now()-offAt>6e4){off=offset(o.tz);offAt=Date.now();}
  var d=new Date(Date.now()+off),H=d.getUTCHours(),M=d.getUTCMinutes(),S=d.getUTCSeconds()+d.getUTCMilliseconds()/1000;
  if(kind=='lux'){rot(hh,(H%12+M/60)*30);rot(mh,(M+S/60)*6);if(!RM)rot(sh,S*6);return;}
  var si=Math.floor(S);if(si===last)return;last=si;
  tm.textContent=(H%12||12)+':'+(M<10?'0':'')+M;dt.textContent=DAYS[d.getUTCDay()]+' '+d.getUTCDate()+(H<12?' · AM':' · PM');
  var w=WX[key];wx.textContent=w?w.label:'';
  var steps=Math.max(0,Math.round((Math.min(H+M/60,21)-6.5)*720));stp.textContent=steps.toLocaleString('en-US');
  var fr=Math.min(1,steps/10000),a0=pol(55,0),a1=pol(55,Math.max(1,fr*359));arc.setAttribute('d','M'+f(a0[0])+' '+f(a0[1])+' A55 55 0 '+(fr>.5?1:0)+' 1 '+f(a1[0])+' '+f(a1[1]));
  if(!RM){var q=pol(55,si*6);sd.setAttribute('cx',f(q[0]));sd.setAttribute('cy',f(q[1]));}}
 function fr(){render();raf=vis&&!document.hidden?requestAnimationFrame(fr):0;}
 function go(){if(!raf&&vis&&!document.hidden)raf=requestAnimationFrame(fr);}
 render();
 if(RM){setInterval(render,1e4);document.addEventListener('wx',render);return;}
 if(kind=='sport'){setInterval(function(){if(vis&&!document.hidden)render();},250);document.addEventListener('wx',render);return;}
 if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;go();}).observe(el);
 document.addEventListener('visibilitychange',go);go();});
})();
