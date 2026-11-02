(function(){
/* per-tile signals */
[].slice.call(document.querySelectorAll('.tsig')).forEach(function(cv){var kind=cv.getAttribute('data-sig'),g;
 function draw(t){g=g||SIG.fit(cv);var c=g.c,W=g.W,H=g.H,cy=H/2;c.clearRect(0,0,W,H);
  function trace(k,a){c.globalAlpha=(k%2?.55:.9)*a;c.strokeStyle=k%2?SIG.FG:SIG.AC;c.lineWidth=1.1;c.beginPath();
   for(var i=0;i<=160;i++){var u=i/160,x=W*u,y=cy+H*.36*Math.sin(Math.PI*u)*SIG.y(u,t,k);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
  if(kind=='email'){trace(0,1);}
  else if(kind=='call'){trace(0,1);trace(1,1);}
  else if(kind=='social'){for(var k=0;k<2;k++){c.globalAlpha=k?.55:.9;c.strokeStyle=k?SIG.FG:SIG.AC;c.lineWidth=1.1;c.beginPath();
    for(var i=0;i<=300;i++){var a=i/300*Math.PI*2,x=W/2+Math.min(W*.42,H*1.6)*Math.sin(3*a+t*.8+k*.6),y=cy+H*.38*Math.sin(2*a+k*.3);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}}
  else{for(k=0;k<5;k++)trace(k,.85);}
  c.globalAlpha=1;}
 addEventListener('resize',function(){g=null;});cv.addEventListener('refit',function(){g=null;});SIG.loop(cv,draw,.35);});


/* patch cable from the selected jack to the operator pill */
var sec=document.querySelector('.swb'),isl=sec.querySelector('.sbisl'),ilbl=isl.querySelector('.ilbl'),icv=isl.querySelector('.icv'),svg=sec.querySelector('.cable'),path=svg.querySelector('.cbl'),e1=svg.querySelector('.pe1'),e2=svg.querySelector('.pe2'),
 tiles=[].slice.call(sec.querySelectorAll('.jt')),NAMES=['01 Email','02 Call','03 Social','04 Walk in'],FREQ=[3,4.5,6,7.5],sel=-1,gi,iloop,raf=0;
svg.classList.add('off');
function route(){raf=0;if(sel<0)return;var R=sec.getBoundingClientRect(),I=isl.getBoundingClientRect(),S=tiles[sel].querySelector('.sock').getBoundingClientRect();
 var x1=I.left+I.width/2-R.left,y1=I.bottom-R.top-3,x2=S.left+S.width/2-R.left,y2=S.top+S.height/2-R.top,dy=y2-y1,sx=x1>x2?36:-36;
 path.setAttribute('d','M'+x1+' '+y1+' C'+x1+' '+(y1+dy*.55)+' '+(x2+sx)+' '+(y2-dy*.45)+' '+x2+' '+y2);
 e1.setAttribute('cx',x1);e1.setAttribute('cy',y1);e2.setAttribute('cx',x2);e2.setAttribute('cy',y2);}
function req(){if(!raf)raf=requestAnimationFrame(route);}
function idraw(t){gi=gi||SIG.fit(icv);var c=gi.c,W=gi.W,H=gi.H,F=FREQ[Math.max(sel,0)],L=sel<0?0:1;c.clearRect(0,0,W,H);
 for(var k=0;k<2;k++){c.globalAlpha=k?.6:1;c.strokeStyle=k?'#8fb8ef':'#5aa0ff';c.lineWidth=1.1;c.beginPath();
  for(var i=0;i<=64;i++){var u=i/64,y=H/2+H*.34*Math.sin(Math.PI*u)*((1-L)*SIG.y(u,t,k)+L*Math.sin(u*F*Math.PI*.5+t*2+k*.9));i?c.lineTo(W*u,y):c.moveTo(W*u,y);}c.stroke();}c.globalAlpha=1;}
function connect(j){var was=sel;sel=j===sel?-1:j;
 tiles.forEach(function(t,i){var on=i===sel;t.classList.toggle('on',on);t.querySelector('.jh').setAttribute('aria-expanded',on);t.querySelector('.jd').hidden=!on;});
 isl.classList.toggle('on',sel>=0);ilbl.textContent=sel<0?'No line connected':'Connected · '+NAMES[sel];
 [].slice.call(sec.querySelectorAll('.tsig')).forEach(function(c){c.dispatchEvent(new Event('refit'));});
 gi=null;iloop.kick();svg.classList.toggle('off',sel<0);if(sel<0)return;route();
 if(!SIG.RM&&path.animate){var len=path.getTotalLength();path.style.strokeDasharray=len;
  var a=path.animate([{strokeDashoffset:len},{strokeDashoffset:0}],{duration:700,easing:'cubic-bezier(.2,.7,.2,1)'});a.onfinish=function(){path.style.strokeDasharray='';};
  e1.animate([{opacity:0},{opacity:1}],{duration:300,delay:500,fill:'backwards'});}}
tiles.forEach(function(t,i){t.querySelector('.jh').addEventListener('click',function(){connect(i);});});
addEventListener('scroll',req,{passive:true});addEventListener('resize',function(){gi=null;req();});
if('ResizeObserver' in window)new ResizeObserver(req).observe(sec);
function hdr(){var h=document.querySelector('header.site'),p=h&&getComputedStyle(h).position;document.documentElement.style.setProperty('--sbtop',(p=='sticky'||p=='fixed'?h.offsetHeight:0)+'px');}hdr();
iloop=SIG.loop(icv,idraw,.35);
})();
