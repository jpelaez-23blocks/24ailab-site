/* How-we-work signals: same interlocked oscilloscope traces as the splash opening (preview/splash/splash.js), light theme, ambient. */
(function(){
var cv=document.querySelector('.how .sig');if(!cv)return;
var ctx=cv.getContext('2d'),W,H,D,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,AC='#1a6fd6',FG='#1d2a3a',vis=true,raf=0,t0=null,tp=0;
function size(){D=Math.min(devicePixelRatio||1,2);var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*D;cv.height=H*D;ctx.setTransform(D,0,0,D,0,0);}
function draw(t){ctx.clearRect(0,0,W,H);ctx.lineCap='round';ctx.lineJoin='round';
 var ow=W,oh=H*0.75,ox=(W-ow)/2,oy=(H-oh)/2,cy=H/2;
 ctx.globalAlpha=0.05;ctx.strokeStyle=FG;ctx.lineWidth=1;
 for(var g=0;g<=10;g++){ctx.beginPath();ctx.moveTo(ox+ow*g/10,oy);ctx.lineTo(ox+ow*g/10,oy+oh);ctx.stroke();}
 for(g=0;g<=8;g++){ctx.beginPath();ctx.moveTo(ox,oy+oh*g/8);ctx.lineTo(ox+ow,oy+oh*g/8);ctx.stroke();}
 for(var k=0;k<5;k++){ctx.globalAlpha=(k%2?0.55:0.9)*0.75;ctx.strokeStyle=k%2?FG:AC;ctx.lineWidth=1.1;ctx.beginPath();
  var n=220;for(var i=0;i<=n;i++){var u=i/n,x=ox+ow*u,amp=oh*0.28*Math.sin(Math.PI*u);
   var y=cy+amp*(Math.sin(u*(6+k*1.7)*Math.PI+t*(2+k*.6)+k)*.6+Math.sin(u*(13+k*2.3)*Math.PI-t*3+k*2)*.25*Math.cos(t+k));
   i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
 ctx.globalAlpha=1;}
function frame(ts){if(t0===null)t0=ts-tp*1000;tp=(ts-t0)/1000;draw(tp*0.35);raf=vis&&!document.hidden?requestAnimationFrame(frame):0;}
function go(){if(!raf&&!RM&&vis&&!document.hidden){t0=null;raf=requestAnimationFrame(frame);}}
size();draw(1.3);
addEventListener('resize',function(){size();draw(RM?1.3:tp*0.35);});
if(RM)return;
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;go();}).observe(cv);
document.addEventListener('visibilitychange',go);go();
})();
