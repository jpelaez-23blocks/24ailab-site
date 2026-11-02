(function(){
[].slice.call(document.querySelectorAll('.day')).forEach(function(cv){var key=cv.getAttribute('data-k'),g;
 function draw(t){g=g||SIG.fit(cv);var c=g.c,W=g.W,H=g.H,n=officeNow(key),base=H*.55,amp=H*.36;c.clearRect(0,0,W,H);
  c.globalAlpha=.08;c.strokeStyle=SIG.FG;c.lineWidth=1;c.beginPath();c.moveTo(0,base);c.lineTo(W,base);c.stroke();
  for(var k=0;k<2;k++){c.globalAlpha=k?.55:.9;c.strokeStyle=k?SIG.FG:SIG.AC;c.lineWidth=1.1;c.beginPath();
   for(var i=0;i<=200;i++){var u=i/200,x=W*u,y=base+amp*(-Math.cos(2*Math.PI*u)*.85+.08*Math.sin(u*(6+k*1.7)*Math.PI+t*(2+k*.6)+k));i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
  var sx=W*n.frac,sy=base+amp*(-Math.cos(2*Math.PI*n.frac)*.85);c.globalAlpha=1;c.fillStyle=SIG.AC;c.beginPath();c.arc(sx,sy,4.5,0,7);c.fill();
  c.strokeStyle=SIG.AC;c.globalAlpha=.35;c.beginPath();c.arc(sx,sy,9,0,7);c.stroke();
  c.globalAlpha=.6;c.fillStyle=SIG.FG;c.font='500 10.5px "IBM Plex Mono",monospace';c.textAlign='left';c.fillText('00:00',0,H-2);c.textAlign='center';c.fillText('12:00',W/2,H-2);c.textAlign='right';c.fillText('24:00',W,H-2);c.globalAlpha=1;}
 addEventListener('resize',function(){g=null;});SIG.loop(cv,draw,.35);});
})();
