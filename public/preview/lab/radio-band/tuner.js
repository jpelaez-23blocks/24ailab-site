(function(){
var dock=document.querySelector('.tdock');if(!dock)return;
var band=dock.querySelector('.band'),cv=dock.querySelector('.bcv'),icv=dock.querySelector('.icv'),isl=dock.querySelector('.island'),ilbl=dock.querySelector('.ilbl'),ihint=dock.querySelector('.ihint'),
 stns=[].slice.call(dock.querySelectorAll('.stn')),nowp=document.getElementById('nowp'),npe=nowp.querySelector('.npe'),live=document.getElementById('tu-live');
var NAMES=['Email','Call','Social','Walk in'],IDS=['ch-email','ch-call','ch-social','ch-walk'],POS=[.14,.38,.62,.86],FREQ=[3,4.5,6,7.5];
var sel=-1,needle=.5,from=.5,to=.5,tA=-9,L=0,drag=false,timer=0,kb=false,g,gi,loop,iloop;
addEventListener('keydown',function(){kb=true;},true);addEventListener('pointerdown',function(){kb=false;},true);
function ease(x){x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
function draw(t){g=g||SIG.fit(cv);var c=g.c,W=g.W,H=g.H,i,k,now=performance.now()/1000;c.clearRect(0,0,W,H);
 if(!drag)needle=SIG.RM?to:from+(to-from)*ease((now-tA)/.45);
 var prox=0;POS.forEach(function(p){prox=Math.max(prox,1-Math.abs(needle-p)/.07);});
 var tL=sel>=0&&!drag&&Math.abs(needle-to)<.002?1:Math.max(0,prox)*.45;L=SIG.RM?tL:L+(tL-L)*.07;
 /* frequency scale */
 c.strokeStyle='#c9d6e6';c.fillStyle='#8da3be';c.font='500 10px "IBM Plex Mono",monospace';c.textAlign='center';
 for(i=0;i<=100;i++){var x=W*(.04+.92*i/100),tall=i%10==0,mid=i%5==0;c.globalAlpha=tall?.7:mid?.4:.22;c.lineWidth=1;c.beginPath();c.moveTo(x,14);c.lineTo(x,14+(tall?16:mid?10:6));c.stroke();
  if(tall){c.globalAlpha=.75;c.fillText(String(88+i/5),x,44);}}
 c.globalAlpha=.6;c.textAlign='right';c.fillText('MHz',W*.985,60);c.textAlign='center';
 /* station marks */
 POS.forEach(function(p,j){var x=W*p;c.globalAlpha=j==sel&&L>.9?1:.5;c.fillStyle=j==sel&&L>.9?'#5aa0ff':'#8da3be';c.beginPath();c.arc(x,H-12,3,0,7);c.fill();});
 /* splash signals settle into one clean wave on lock */
 var cy=H*.6,amp=H*.2,F=FREQ[sel<0?0:sel];
 for(k=0;k<5;k++){var a=k==0?1:Math.max(0,1-L*1.15);if(a<=0)continue;c.globalAlpha=(k%2?.5:.85)*a;c.strokeStyle=k%2?'#8fb8ef':'#5aa0ff';c.lineWidth=k==0?1.2+L*.8:1.1;c.beginPath();
  for(i=0;i<=240;i++){var u=i/240,e=Math.sin(Math.PI*u),y=cy+amp*e*((1-L)*SIG.y(u,t,k)+L*Math.sin(u*F*Math.PI+t*2)*.7);i?c.lineTo(W*u,y):c.moveTo(W*u,y);}c.stroke();}
 /* needle */
 var nx=W*needle;c.globalAlpha=.25;c.strokeStyle='#fff';c.lineWidth=6;c.beginPath();c.moveTo(nx,10);c.lineTo(nx,H-22);c.stroke();
 c.globalAlpha=1;c.lineWidth=1.6;c.beginPath();c.moveTo(nx,10);c.lineTo(nx,H-22);c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(nx,10,4,0,7);c.fill();
 c.globalAlpha=1;if(L>.02&&L<.99&&!SIG.RM)loop&&loop.kick();}
function idraw(t){gi=gi||SIG.fit(icv);var c=gi.c,W=gi.W,H=gi.H,F=FREQ[Math.max(sel,0)];c.clearRect(0,0,W,H);c.strokeStyle='#5aa0ff';c.lineWidth=1.2;c.beginPath();
 for(var i=0;i<=64;i++){var u=i/64,y=H/2+H*.34*Math.sin(Math.PI*u)*Math.sin(u*F*Math.PI*.5+t*2);i?c.lineTo(W*u,y):c.moveTo(W*u,y);}c.stroke();}
function hdr(){var h=document.querySelector('header.site'),p=h&&getComputedStyle(h).position;document.documentElement.style.setProperty('--sbtop',(p=='sticky'||p=='fixed'?h.offsetHeight:0)+'px');}
function setOpen(open){dock.classList.toggle('col',!open);isl.setAttribute('aria-expanded',open);ihint.textContent=open?'Hide the tuner':'Show the tuner';
 var inDial=dock.querySelector('.sbdial').contains(document.activeElement);if(!open&&inDial){if(kb)isl.focus();else document.activeElement.blur();}
 if(open)loop.kick();gi=null;iloop.kick();}
function aria(){band.setAttribute('aria-valuenow',Math.max(sel,0)+1);band.setAttribute('aria-valuetext',sel<0?'Not tuned':'0'+(sel+1)+' '+NAMES[sel]);}
function tune(j){clearTimeout(timer);var same=j===sel;from=needle;to=POS[j];tA=performance.now()/1000;sel=j;aria();
 stns.forEach(function(s,i){s.setAttribute('aria-current',i==j);});
 IDS.forEach(function(id,i){document.getElementById(id).hidden=i!=j;});npe.hidden=true;nowp.classList.add('on');
 ilbl.textContent='0'+(j+1)+' '+NAMES[j];isl.hidden=false;hdr();
 if(!same)live.textContent='Tuned to '+NAMES[j]+'. Details are below.';
 loop.kick();timer=setTimeout(function(){setOpen(false);},SIG.RM?600:1300);}
function nearest(x){var b=0;POS.forEach(function(p,i){if(Math.abs(p-x)<Math.abs(POS[b]-x))b=i;});return b;}
function at(e){var r=band.getBoundingClientRect();return Math.max(.04,Math.min(.96,(e.clientX-r.left)/r.width));}
band.addEventListener('pointerdown',function(e){if(e.button)return;drag=true;clearTimeout(timer);band.setPointerCapture(e.pointerId);needle=at(e);loop.kick();});
band.addEventListener('pointermove',function(e){if(!drag)return;needle=at(e);var n=nearest(needle);band.setAttribute('aria-valuetext','Near '+NAMES[n]);loop.kick();});
function up(){if(!drag)return;drag=false;tune(nearest(needle));}
band.addEventListener('pointerup',up);band.addEventListener('pointercancel',up);
band.addEventListener('keydown',function(e){var k=e.key,j=sel<0?nearest(needle):sel;
 if(k=='ArrowRight'||k=='ArrowUp')j=sel<0?j:Math.min(3,j+1);else if(k=='ArrowLeft'||k=='ArrowDown')j=sel<0?j:Math.max(0,j-1);else if(k=='Home')j=0;else if(k=='End')j=3;else if(k=='Enter'||k==' ')j=j;else return;
 e.preventDefault();tune(j);});
stns.forEach(function(s,i){s.addEventListener('click',function(){tune(i);});});
isl.addEventListener('click',function(){clearTimeout(timer);var open=isl.getAttribute('aria-expanded')!=='true';setOpen(open);if(open&&kb)band.focus();});
addEventListener('resize',function(){g=null;gi=null;hdr();});
loop=SIG.loop(cv,draw,.35);iloop=SIG.loop(icv,idraw,.35);
})();
