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

/* dial header: pick a channel, its card moves up, the dial settles then folds into an island */
var dock=document.querySelector('.sbdock'),cv=dock.querySelector('.tcv'),icv=dock.querySelector('.icv'),isl=dock.querySelector('.island'),ilbl=dock.querySelector('.ilbl'),ihint=dock.querySelector('.ihint'),
 btns=[].slice.call(dock.querySelectorAll('[role=radio]')),tiles=document.querySelector('.tiles'),live=document.getElementById('sb-live');
var NAMES=['01 Email','02 Call','03 Social','04 Walk in'],IDS=['ch-email','ch-call','ch-social','ch-walk'];
var POS=[.14,.38,.62,.86],FREQ=[3,4.5,6,7.5],sel=-1,needle=.5,from=.5,tA=-9,g,gi,loop,iloop,timer=0;
function ease(x){x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
function draw(t){g=g||SIG.fit(cv);var c=g.c,W=g.W,H=g.H,i,k;c.clearRect(0,0,W,H);
 var now=performance.now()/1000,p=SIG.RM?1:ease((now-tA)/.45),tgt=sel<0?.5:POS[sel];needle=from+(tgt-from)*p;
 var L=sel<0?0:(SIG.RM?1:ease(Math.min(1,(now-tA)/.9)))*.85,F=FREQ[Math.max(sel,0)];
 c.globalAlpha=.06;c.strokeStyle=SIG.FG;c.lineWidth=1;for(i=0;i<=40;i++){var x=W*i/40,tall=i%5==0;c.beginPath();c.moveTo(x,H-(tall?18:10));c.lineTo(x,H);c.stroke();}
 var cy=H*.46,oh=H*.7;
 for(k=0;k<5;k++){c.globalAlpha=(k%2?.55:.9)*.8;c.strokeStyle=k%2?SIG.FG:SIG.AC;c.lineWidth=1.1;c.beginPath();
  for(i=0;i<=220;i++){var u=i/220,amp=oh*.28*Math.sin(Math.PI*u),y=cy+amp*((1-L)*SIG.y(u,t,k)+L*Math.sin(u*F*Math.PI+t*2)*.6);i?c.lineTo(W*u,y):c.moveTo(W*u,y);}c.stroke();}
 if(sel>=0){c.globalAlpha=1;c.strokeStyle=SIG.AC;c.lineWidth=1.2;c.beginPath();c.moveTo(needle*W,6);c.lineTo(needle*W,H-4);c.stroke();c.fillStyle=SIG.AC;c.beginPath();c.arc(needle*W,6,3,0,7);c.fill();}
 c.font='500 10.5px "IBM Plex Mono",monospace';c.textAlign='center';NAMES.forEach(function(s,j){c.globalAlpha=j==sel?1:.45;c.fillStyle=j==sel?SIG.AC:SIG.FG;c.fillText(s.toUpperCase(),POS[j]*W,H-24);});c.globalAlpha=1;}
function idraw(t){gi=gi||SIG.fit(icv);var c=gi.c,W=gi.W,H=gi.H,F=FREQ[Math.max(sel,0)];c.clearRect(0,0,W,H);
 for(var k=0;k<2;k++){c.globalAlpha=k?.6:1;c.strokeStyle=k?'#8fb8ef':'#5aa0ff';c.lineWidth=1.1;c.beginPath();
  for(var i=0;i<=64;i++){var u=i/64,y=H/2+H*.34*Math.sin(Math.PI*u)*Math.sin(u*F*Math.PI*.5+t*2+k*.9);i?c.lineTo(W*u,y):c.moveTo(W*u,y);}c.stroke();}c.globalAlpha=1;}
function hdr(){var h=document.querySelector('header.site');if(h)document.documentElement.style.setProperty('--sbtop',(getComputedStyle(h).position=='sticky'||getComputedStyle(h).position=='fixed'?h.offsetHeight:0)+'px');}
function setOpen(open,focusIsl){dock.classList.toggle('col',!open);isl.setAttribute('aria-expanded',open);ihint.textContent=open?'Hide the channel dial':'Show the channel dial';
 if(!open&&dock.querySelector('.sbdial').contains(document.activeElement)||focusIsl)isl.focus();
 if(open)loop&&loop.kick();gi=null;iloop&&iloop.kick();}
function moveTile(j){var el=document.getElementById(IDS[j]),all=[].slice.call(tiles.children),first=all.map(function(x){return x.getBoundingClientRect();});
 all.forEach(function(x){x.classList.toggle('on',x===el);});tiles.insertBefore(el,tiles.firstChild);
 if(SIG.RM||!el.animate)return;
 all.forEach(function(x,i){var r=x.getBoundingClientRect(),dx=first[i].left-r.left,dy=first[i].top-r.top;if(dx||dy)x.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'none'}],{duration:520,easing:'cubic-bezier(.2,.7,.2,1)'});});
 [].slice.call(tiles.querySelectorAll('.tsig')).forEach(function(c){c.dispatchEvent(new Event('refit'));});}
function pick(j,focus){if(j===sel)return;from=needle;sel=j;tA=performance.now()/1000;
 btns.forEach(function(b,i){b.setAttribute('aria-checked',i==j);b.tabIndex=i==j?0:-1;});
 if(focus)btns[j].focus();
 ilbl.textContent=NAMES[j];isl.hidden=false;moveTile(j);addEventListener('resize',hdr);hdr();
 live.textContent=NAMES[j].slice(3)+' selected. Its card is now first.';
 loop&&loop.kick();clearTimeout(timer);
 timer=setTimeout(function(){setOpen(false);},SIG.RM?600:1100);}
btns.forEach(function(b,i){b.addEventListener('click',function(){pick(i);});
 b.addEventListener('keydown',function(e){var d=e.key=='ArrowRight'||e.key=='ArrowDown'?1:e.key=='ArrowLeft'||e.key=='ArrowUp'?-1:0;if(d){e.preventDefault();pick(((sel<0?0:sel)+d+4)%4,true);}});});
isl.addEventListener('click',function(){clearTimeout(timer);var open=isl.getAttribute('aria-expanded')!=='true';setOpen(open);if(open&&btns[sel])btns[sel].focus();});
addEventListener('resize',function(){g=null;gi=null;});
loop=SIG.loop(cv,draw,.35);iloop=SIG.loop(icv,idraw,.35);
})();
