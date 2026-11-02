/* 2xAI Lab splash intro (preview). Canvas only, no deps. */
(function(){
var q=location.search, force=/[?&]replay/.test(q);
try{ if(!force && sessionStorage.getItem('splash24')) return; sessionStorage.setItem('splash24','1'); }catch(e){}
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var BG='#0f1724',FG='#f7f9fc',AC='#5aa2ff';
var wrap=document.createElement('div'); wrap.id='splash'; wrap.setAttribute('aria-hidden','true');
wrap.style.cssText='position:fixed;inset:0;z-index:9999;background:'+BG+';transition:opacity .5s ease';
var cv=document.createElement('canvas'); cv.style.cssText='position:absolute;inset:0;width:100%;height:100%';
var sk=document.createElement('button'); sk.type='button'; sk.textContent='Skip'; sk.tabIndex=-1;
sk.style.cssText='position:absolute;right:20px;bottom:max(20px,env(safe-area-inset-bottom));background:none;border:1px solid #ffffff33;color:#f7f9fcb3;font:500 13px Inter,system-ui,sans-serif;padding:7px 14px;border-radius:999px;cursor:pointer;letter-spacing:.3px';
wrap.appendChild(cv); wrap.appendChild(sk); document.body.appendChild(wrap);
var ctx=cv.getContext('2d'),W,H,D;
function size(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;ctx.setTransform(D,0,0,D,0,0);} size(); addEventListener('resize',size);
// logo geometry (same units as header SVG; Lab offset 69.51 lg / 43.11 sm)
function circ(cx,cy,r,from){var p=[];for(var i=0;i<=40;i++){var a=from+i/40*Math.PI*2;p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return p;}
function lab(o){return[[[o,22],[o,46],[o+8.5,46]],circ(o+19.2,39.8,6.2,-Math.PI/2),[[o+25.4,33.1],[o+25.4,46]],[[o+30.9,22],[o+30.9,46]],circ(o+37.1,39.8,6.2,Math.PI)];}
var MARK=[[[0,22],[0,46]],[[8,16],[8,46]],[[17,28],[32,46],'a'],[[29,28.5],[20.5,38.5],'a']];
var AI=[circ(44.7,39.8,6.2,-Math.PI/2),[[50.9,33.1],[50.9,46]],[[56.4,33.1],[56.4,46]]];
function cols(s){return s.map(function(p){var a=p[p.length-1]==='a';return{p:a?p.slice(0,-1):p,c:a?AC:FG};});}
var hdr=document.querySelector('header.site .logo.lg'), hs=document.querySelector('header.site .logo.sm');
var small=hs&&getComputedStyle(hs).display!=='none'; var hl=small?hs:hdr;
var STR=cols(MARK.concat(small?[]:AI).concat(lab(small?43.11:69.51)));
var VB={x:-1.11,y:13.89,w:small?78.70+2.98:108.0,h:33.22}; // approx; replaced by header viewBox below
if(hl){var v=hl.getAttribute('viewBox').split(' ').map(Number);VB={x:v[0],y:v[1],w:v[2],h:v[3]};}
function len(p){var L=0;for(var i=1;i<p.length;i++)L+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return L;}
function part(p,f){var T=len(p)*f,o=[p[0]];for(var i=1;i<p.length;i++){var s=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);if(T>=s){o.push(p[i]);T-=s;}else{var k=T/s;o.push([p[i-1][0]+(p[i][0]-p[i-1][0])*k,p[i-1][1]+(p[i][1]-p[i-1][1])*k]);break;}}return o;}
function poly(p){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(var i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.stroke();}
var ease=function(x){x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}, cl=function(x){return Math.max(0,Math.min(1,x));};
// timeline (s)
var T=RM?{osc:0,glob:0,col:0,draw:0,drawEnd:1.0,glide:1.2,end:1.8}:{osc:0,glob:1.2,col:3.0,draw:3.25,drawEnd:4.3,glide:4.45,end:5.2};
var GRID=[];
// globe
var SG=[1.35,103.8],CO=[39.5,-105.8];
function proj(lat,lon,R,cx,cy,l0,p0){var r=Math.PI/180,la=lat*r,lo=(lon-l0)*r,ph=p0*r;var x=Math.cos(la)*Math.sin(lo),y=Math.cos(ph)*Math.sin(la)-Math.sin(ph)*Math.cos(la)*Math.cos(lo),z=Math.sin(ph)*Math.sin(la)+Math.cos(ph)*Math.cos(la)*Math.cos(lo);return[cx+R*x,cy-R*y,z];}
function slerp(a,b,f){var r=Math.PI/180;function v(p){return[Math.cos(p[0]*r)*Math.cos(p[1]*r),Math.cos(p[0]*r)*Math.sin(p[1]*r),Math.sin(p[0]*r)];}var A=v(a),B=v(b),d=Math.acos(A[0]*B[0]+A[1]*B[1]+A[2]*B[2]),s=Math.sin(d);var k1=Math.sin((1-f)*d)/s,k2=Math.sin(f*d)/s;var x=k1*A[0]+k2*B[0],y=k1*A[1]+k2*B[1],z=k1*A[2]+k2*B[2];return[Math.asin(z)/r,Math.atan2(y,x)/r];}
function hx(c){return[1,3,5].map(function(i){return parseInt(c.substr(i,2),16);});}
function mix(c,f){var a=hx(c),b=hx(c===AC?'#1a6fd6':'#1d2a3a');return'rgb('+a.map(function(v,i){return Math.round(v+(b[i]-v)*f);}).join(',')+')';}
var t0=null,done=false,raf;
function frame(ts){ if(done)return; if(t0===null)t0=ts; var t=(ts-t0)/1000; ctx.clearRect(0,0,W,H);
 var cx=W/2,cy=H/2,M=Math.min(W,H);
 ctx.lineCap='round';ctx.lineJoin='round';
 // --- oscilloscope ---
 if(!RM && t<T.glob+0.6){ var ow=W*0.86,oh=H*0.75,ox=cx-ow/2,oy=cy-oh/2,a=1-cl((t-T.glob)/0.6);
  ctx.globalAlpha=0.07*a;ctx.strokeStyle=FG;ctx.lineWidth=1;
  for(var g=0;g<=10;g++){ctx.beginPath();ctx.moveTo(ox+ow*g/10,oy);ctx.lineTo(ox+ow*g/10,oy+oh);ctx.stroke();}
  for(g=0;g<=8;g++){ctx.beginPath();ctx.moveTo(ox,oy+oh*g/8);ctx.lineTo(ox+ow,oy+oh*g/8);ctx.stroke();}
  var rev=ease(t/0.9), shrink=cl((t-T.glob)/0.6);
  for(var k=0;k<5;k++){ ctx.globalAlpha=(k%2?0.55:0.9)*a; ctx.strokeStyle=k%2?FG:AC; ctx.lineWidth=1.1; ctx.beginPath();
   var n=220; for(var i=0;i<=n*rev;i++){var u=i/n,x=ox+ow*u;var amp=oh*0.28*(1-shrink*.8)*Math.sin(Math.PI*u);
    var y=cy+amp*(Math.sin(u*(6+k*1.7)*Math.PI+t*(2+k*.6)+k)*.6+Math.sin(u*(13+k*2.3)*Math.PI-t*3+k*2)*.25*Math.cos(t+k));
    x=x+(cx-x)*shrink*shrink; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.stroke(); }
 }
 // --- globe ---
 if(!RM && t>=T.glob && t<T.col+0.5){ var ga=cl((t-T.glob)/0.4), coll=ease((t-T.col)/0.45), R=M*0.34*(0.25+0.75*ease((t-T.glob)/0.5))*(1-coll);
  var l0=-158-ease((t-T.glob)/1.8)*44,p0=24; ctx.globalAlpha=ga*(1-coll);
  ctx.strokeStyle=FG;ctx.lineWidth=1;ctx.globalAlpha=0.18*ga*(1-coll);ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  ctx.fillStyle=FG; for(var la=-75;la<=75;la+=15)for(var lo=0;lo<360;lo+=6){var P=proj(la,lo,R,cx,cy,l0,p0);if(P[2]>0){ctx.globalAlpha=(0.18+0.55*P[2])*ga*(1-coll);ctx.fillRect(P[0]-.7,P[1]-.7,1.4,1.4);}}
  for(lo=0;lo<360;lo+=30)for(la=-80;la<=80;la+=4){P=proj(la,lo,R,cx,cy,l0,p0);if(P[2]>0){ctx.globalAlpha=(0.08+0.3*P[2])*ga*(1-coll);ctx.fillRect(P[0]-.5,P[1]-.5,1,1);}}
  // signals: three threads travel CO->SG over the Pacific and loop on
  var st=t-T.glob-0.1;
  for(k=0;k<3;k++){ var f=(st/1.15)-k*0.12; if(f<=0)continue; ctx.strokeStyle=k==1?FG:AC; ctx.lineWidth=1.2; ctx.beginPath(); var first=1;
   for(var s=Math.max(0,f-0.45);s<=Math.min(f,1.6);s+=0.01){ var ll=s<=1?slerp(CO,SG,s):slerp(SG,[CO[0]-20+k*12,CO[1]+40],s-1); P=proj(ll[0]+k*1.5*Math.sin(s*9),ll[1],R*(1.04+0.02*k),cx,cy,l0,p0);
    ctx.globalAlpha=(P[2]>0?0.9:0.15)*ga*(1-coll)*cl((s-(f-0.45))/0.45); if(first){ctx.moveTo(P[0],P[1]);first=0;}else ctx.lineTo(P[0],P[1]); } ctx.stroke(); }
  // markers
  [[CO,'Colorado',0.0],[SG,'Singapore',1.0]].forEach(function(m){ P=proj(m[0][0],m[0][1],R,cx,cy,l0,p0); var appear=cl((st/1.15-m[2]*0.95)*4); if(P[2]<=0||appear<=0)return;
   var A=appear*(1-coll)*Math.min(1,0.35+P[2]*3); ctx.globalAlpha=A; ctx.fillStyle=AC; ctx.beginPath();ctx.arc(P[0],P[1],3.6,0,7);ctx.fill();
   var pr=(t*1.4+m[2]*.5)%1; ctx.globalAlpha=A*(1-pr)*.7; ctx.strokeStyle=AC; ctx.lineWidth=1; ctx.beginPath();ctx.arc(P[0],P[1],3+pr*14,0,7);ctx.stroke();
   ctx.globalAlpha=A; ctx.font='500 '+(M<500?12:14)+'px Inter,system-ui,sans-serif'; ctx.fillStyle=FG; var right=P[0]<cx; ctx.textAlign=right?'left':'right'; ctx.textBaseline='middle';
   ctx.fillText(m[1],P[0]+(right?10:-10),P[1]-12); });
 }
 // --- logo ---
 var target=hl?hl.getBoundingClientRect():{left:24,top:20,width:120,height:32};
 var bigH=Math.min(M*0.16,W*0.62/VB.w*VB.h), sc0=bigH/VB.h, bx=cx-VB.w*sc0/2, by=cy-bigH/2;
 var gl=ease((t-T.glide)/(T.end-T.glide-0.2)), sc=sc0+(target.height/VB.h-sc0)*gl, lx=bx+(target.left-bx)*gl, ly=by+(target.top-by)*gl;
 if(t>=T.col+0.15 || RM){ var N=STR.length, dt=(T.drawEnd-T.draw)/N;
  // threads from the collapsed point to each stroke start
  if(!RM){ for(k=0;k<N;k++){ var s0=T.col+0.15+k*0.02, f2=cl((t-s0)/0.35), fade=1-cl((t-(T.draw+k*dt))/0.25); if(f2<=0||fade<=0)continue; var p0s=STR[k].p[0];
    var ex=lx+(p0s[0]-VB.x)*sc, ey=ly+(p0s[1]-VB.y)*sc; ctx.strokeStyle=STR[k].c; ctx.lineWidth=1; ctx.globalAlpha=0.6*fade;
    ctx.beginPath();ctx.moveTo(cx,cy);var e2=ease(f2);ctx.quadraticCurveTo(cx+(k-N/2)*12,cy-40+(k%3)*30,cx+(ex-cx)*e2,cy+(ey-cy)*e2);ctx.stroke(); } }
  ctx.globalAlpha=1; ctx.lineWidth=2.22*sc;
  for(k=0;k<N;k++){ var f3=cl((t-(T.draw+k*dt))/Math.max(dt*1.8,0.12)); if(f3<=0)continue; var pp=part(STR[k].p,ease(f3)).map(function(p){return[lx+(p[0]-VB.x)*sc,ly+(p[1]-VB.y)*sc];});
   ctx.strokeStyle=mix(STR[k].c,gl); poly(pp); }
  if(!small){ var dshow=t>T.drawEnd; var bl=t-T.drawEnd, on=dshow&&!(bl>0.1&&bl<0.2)&&!(bl>0.3&&bl<0.4); if(on){ctx.fillStyle=mix(AC,gl);ctx.beginPath();ctx.arc(lx+(56.4-VB.x)*sc,ly+(27.6-VB.y)*sc,1.77*sc,0,7);ctx.fill();} }
 }
 // reveal page under glide
 if(t>=T.glide){ wrap.style.background='rgba(15,23,36,'+(1-gl)+')'; }
 if(t>=T.end){ finish(); return; }
 raf=requestAnimationFrame(frame);
}
function finish(){ if(done)return; done=true; cancelAnimationFrame(raf); wrap.style.opacity='0'; setTimeout(function(){wrap.remove();},520); removeEventListener('keydown',finish); }
sk.addEventListener('click',finish); wrap.addEventListener('pointerdown',finish); addEventListener('keydown',finish);
window.__splashSkip=finish;
requestAnimationFrame(frame);
})();
