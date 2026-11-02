/* Signal Log: oscilloscope timeline of what the lab shipped (solid pulses) and tried (faint blips). Data: signal-log.json */
(function(){
var host=document.getElementById('slog');if(!host)return;
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
fetch('/preview/home/signal-log.json').then(function(r){return r.json()}).then(function(d){
 var E=d.entries.slice().sort(function(a,b){return new Date(a.t)-new Date(b.t)}),n=E.length,W=1000,H=150,Y=96,pad=24,step=(W-2*pad)/(n-1);
 var pts=[],path='M0 '+Y;
 E.forEach(function(e,i){var x=pad+i*step,s=e.kind==='shipped';e.x=x;
  if(s)path+=' L'+(x-7)+' '+Y+' L'+(x-3)+' '+(Y+10)+' L'+x+' '+(Y-62)+' L'+(x+3)+' '+(Y+14)+' L'+(x+7)+' '+Y;
  else path+=' L'+(x-5)+' '+Y+' Q'+x+' '+(Y-16)+' '+(x+5)+' '+Y;});
 path+=' L'+W+' '+Y;
 var days={};E.forEach(function(e,i){var k=e.t.slice(0,10);if(!(k in days))days[k]=e.x});
 var svg='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true">';
 for(var g=0;g<=10;g++)svg+='<line class="grid" x1="'+g*100+'" x2="'+g*100+'" y1="10" y2="'+(H-14)+'"/>';
 svg+='<line class="grid" x1="0" x2="'+W+'" y1="'+Y+'" y2="'+Y+'"/>';
 svg+='<path class="trace" pathLength="1" d="'+path+'"/>';
 E.forEach(function(e,i){svg+='<circle class="pt '+e.kind+'" data-i="'+i+'" cx="'+e.x+'" cy="'+(e.kind==='shipped'?Y-62:Y-8)+'" r="'+(e.kind==='shipped'?3.2:2.2)+'"/>'});
 svg+='</svg>';
 var dl=Object.keys(days).map(function(k){var dt=new Date(k+'T12:00:00');return '<span style="left:'+(days[k]/W*100)+'%">'+dt.toLocaleDateString('en-US',{month:'short',day:'numeric'}).toUpperCase()+'</span>'}).join('');
 var list=E.slice().reverse().map(function(e){var i=E.indexOf(e);return '<li class="'+e.kind+'" data-i="'+i+'"><time>'+new Date(e.t).toLocaleDateString('en-US',{month:'short',day:'numeric'})+'</time><b>'+e.project+'</b><span>'+e.title+'</span><em>'+(e.kind==='shipped'?'shipped':'tried')+'</em></li>'}).join('');
 host.innerHTML='<div class="scope">'+svg+'<div class="days">'+dl+'</div></div><ol class="log">'+list+'</ol>';
 var sc=host.querySelector('.scope');
 if(RM)sc.classList.add('on');else if('IntersectionObserver' in window){var io=new IntersectionObserver(function(x){if(x[0].isIntersecting){sc.classList.add('on');io.disconnect()}},{threshold:.4});io.observe(sc)}else sc.classList.add('on');
 function hi(i,on){host.querySelectorAll('[data-i="'+i+'"]').forEach(function(el){el.classList.toggle('hl',on)})}
 host.querySelectorAll('.log li').forEach(function(li){var i=li.dataset.i;li.addEventListener('mouseenter',function(){hi(i,true)});li.addEventListener('mouseleave',function(){hi(i,false)})});
 var c=host.querySelector('.count');
 var s=E.filter(function(e){return e.kind==='shipped'}).length;document.getElementById('slog-count').textContent=s+' shipped · '+(n-s)+' tried';
}).catch(function(){host.innerHTML='<p class="muted">Signal log unavailable.</p>'});
})();
