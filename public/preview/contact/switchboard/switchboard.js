(function(){
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
 addEventListener('resize',function(){g=null;});SIG.loop(cv,draw,.35);});
})();
