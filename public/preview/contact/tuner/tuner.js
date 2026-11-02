(function(){
var cv=document.querySelector('.tcv'),btns=[].slice.call(document.querySelectorAll('.tbtns [role=radio]'));if(!cv)return;
var POS=[.14,.38,.62,.86],FREQ=[3,4.5,6,7.5],sel=0,needle=POS[0],lock=1,from=POS[0],tA=0,L0=1;
function ease(x){x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
var g,loop;
function draw(t){g=g||SIG.fit(cv);var c=g.c,W=g.W,H=g.H;c.clearRect(0,0,W,H);
 var now=performance.now()/1000,p=SIG.RM?1:ease((now-tA)/.45);needle=from+(POS[sel]-from)*p;
 var L=SIG.RM?1:Math.min(1,(now-tA)/.9);L=ease(L)*0.85;
 c.globalAlpha=.06;c.strokeStyle=SIG.FG;c.lineWidth=1;for(var i=0;i<=40;i++){var x=W*i/40,tall=i%5==0;c.beginPath();c.moveTo(x,H-(tall?18:10));c.lineTo(x,H);c.stroke();}
 var cy=H*.46,oh=H*.7;
 for(var k=0;k<5;k++){c.globalAlpha=(k%2?.55:.9)*.8;c.strokeStyle=k%2?SIG.FG:SIG.AC;c.lineWidth=1.1;c.beginPath();
  for(i=0;i<=220;i++){var u=i/220,x=W*u,amp=oh*.28*Math.sin(Math.PI*u),clean=Math.sin(u*FREQ[sel]*Math.PI+t*2)*.6;
   var y=cy+amp*((1-L)*SIG.y(u,t,k)+L*clean+(1-L)*0);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
 c.globalAlpha=1;c.strokeStyle=SIG.AC;c.lineWidth=1.2;c.beginPath();c.moveTo(needle*W,6);c.lineTo(needle*W,H-4);c.stroke();
 c.fillStyle=SIG.AC;c.beginPath();c.arc(needle*W,6,3,0,7);c.fill();
 c.font='500 10.5px "IBM Plex Mono",monospace';c.textAlign='center';['01 EMAIL','02 CALL','03 SOCIAL','04 WALK IN'].forEach(function(s,j){c.globalAlpha=j==sel?1:.45;c.fillStyle=j==sel?SIG.AC:SIG.FG;c.fillText(s,POS[j]*W,H-24);});c.globalAlpha=1;}
function pick(j,focus){if(j===sel&&tA)return;from=needle;sel=j;tA=performance.now()/1000;
 btns.forEach(function(b,i){b.setAttribute('aria-checked',i==j);b.tabIndex=i==j?0:-1;});
 document.querySelectorAll('.chan').forEach(function(a,i){a.classList.toggle('on',i==j);});
 if(focus)btns[j].focus();loop&&loop.kick();}
btns.forEach(function(b,i){b.addEventListener('click',function(){pick(i);});
 b.addEventListener('keydown',function(e){var d=e.key=='ArrowRight'||e.key=='ArrowDown'?1:e.key=='ArrowLeft'||e.key=='ArrowUp'?-1:0;if(d){e.preventDefault();pick((sel+d+4)%4,true);}});});
addEventListener('resize',function(){g=null;});
tA=performance.now()/1000-2;loop=SIG.loop(cv,draw,.35);
})();
