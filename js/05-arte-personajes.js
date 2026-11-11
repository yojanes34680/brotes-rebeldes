// Brotes Rebeldes · Dibujo de personajes, sprites PNG, avatares y retratos de comandantes.
"use strict";
// ============ DRAW HELPERS ============
function circ(c,x,y,r,f){c.beginPath();c.arc(x,y,Math.max(0,r),0,7);c.fillStyle=f;c.fill()}
function ell(c,x,y,rx,ry,f,rot){c.beginPath();c.ellipse(x,y,Math.max(0,rx),Math.max(0,ry),rot||0,0,7);c.fillStyle=f;c.fill()}
function rr(c,x,y,w,h,r,f,s,lw){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);if(f){c.fillStyle=f;c.fill()}if(s){c.strokeStyle=s;c.lineWidth=lw||2;c.stroke()}}
let TS=1;// tamaño de texto (accesibilidad): agranda los textos chicos del canvas
// Modo daltonismo: cada planta lleva además una forma propia (no solo un color).
const SHAPE={espina:'tri',hielo:'hex',fuego:'circ',rayo:'bolt',rocio:'dia',veneno:'plus',trampa:'sq',sol:'star'};
const SHAPE_N={tri:'triángulo',hex:'hexágono',circ:'círculo',bolt:'rayo',dia:'rombo',plus:'cruz',sq:'cuadrado',star:'estrella'};
const ROLE_SHAPE={tirador:'tri',rafaga:'tri',franco:'tri',area:'circ',control:'hex',veneno:'plus',cadena:'bolt',apoyo:'star',productor:'dia',ejecutor:'sq',debil:'plus'};
function shapeMark(c,k,x,y,r){const sh=SHAPE[k]||ROLE_SHAPE[UT[k]&&UT[k].r];if(!sh)return;c.save();c.translate(x,y);c.beginPath();
 if(sh==='tri'){c.moveTo(0,-r);c.lineTo(r*.95,r*.75);c.lineTo(-r*.95,r*.75);c.closePath()}
 else if(sh==='hex'){for(let i=0;i<6;i++){const a=i*Math.PI/3;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath()}
 else if(sh==='circ')c.arc(0,0,r*.85,0,7);
 else if(sh==='bolt'){c.moveTo(r*.35,-r);c.lineTo(-r*.6,r*.12);c.lineTo(0,r*.12);c.lineTo(-r*.35,r);c.lineTo(r*.6,-r*.12);c.lineTo(0,-r*.12);c.closePath()}
 else if(sh==='dia'){c.moveTo(0,-r);c.lineTo(r*.75,0);c.lineTo(0,r);c.lineTo(-r*.75,0);c.closePath()}
 else if(sh==='plus'){const w=r*.36;c.moveTo(-w,-r);c.lineTo(w,-r);c.lineTo(w,-w);c.lineTo(r,-w);c.lineTo(r,w);c.lineTo(w,w);c.lineTo(w,r);c.lineTo(-w,r);c.lineTo(-w,w);c.lineTo(-r,w);c.lineTo(-r,-w);c.lineTo(-w,-w);c.closePath()}
 else if(sh==='sq')c.rect(-r*.75,-r*.75,r*1.5,r*1.5);
 else{for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r;c.lineTo(Math.cos(a)*q,Math.sin(a)*q)}c.closePath()}
 c.lineJoin='round';c.strokeStyle='#111';c.lineWidth=Math.max(1.6,r*.32);c.stroke();c.fillStyle='#fff';c.fill();c.restore()}
// Texto en el lienzo con iconos propios: los emojis más usados (💧 💰 💎 🏆 ⭐ ❤ 🔒 🎬 💤 🔄 ⚔ 💸 👑) se dibujan con
// vectores del juego, así se ven iguales en Windows, Mac, Android e iPhone. El resto del texto se escribe normal.
function txt0(c,s,x,y,size,col,align,stroke){c.font=`bold ${size}px "Segoe UI",system-ui,sans-serif`;c.textAlign=align||'center';c.textBaseline='middle';if(stroke){c.lineWidth=4;c.strokeStyle=stroke;c.lineJoin='round';c.strokeText(s,x,y)}c.fillStyle=col||'#fff';c.fillText(s,x,y)}
const ICON_OF={'💧':'drop','💰':'coin','💎':'gem','🏆':'trophy','⭐':'star','❤️':'heart','❤':'heart','♥':'heart','🔒':'lock','🎬':'film','💤':'zzz','🔄':'cycle','⚔️':'swords','⚔':'swords','💸':'sell','👑':'crown'};
const ICON_RE=/(❤️|⚔️|💧|💰|💎|🏆|⭐|❤|♥|🔒|🎬|💤|🔄|⚔|💸|👑)/u;
function txt(c,s,x,y,size,col,align,stroke){if(TS!==1&&size<18)size=Math.round(size*TS);s=T(String(s));
 if(!ICON_RE.test(s))return txt0(c,s,x,y,size,col,align,stroke);
 const parts=s.split(ICON_RE).filter(p=>p!=='');c.font=`bold ${size}px "Segoe UI",system-ui,sans-serif`;
 const isz=size*1.05,ws=parts.map(p=>ICON_OF[p]?isz:c.measureText(p).width),tot=ws.reduce((a,b)=>a+b,0);
 let px=align==='left'?x:align==='right'?x-tot:x-tot/2;
 parts.forEach((p,i)=>{if(ICON_OF[p])drawIcon(c,ICON_OF[p],px+ws[i]/2,y,isz,stroke);else txt0(c,p,px,y,size,col,'left',stroke);px+=ws[i]})}
// Iconos dibujados (centro x,y; tamaño ~ alto de la letra). Contorno oscuro para que se lean sobre cualquier fondo.
function drawIcon(c,name,x,y,sz,stroke){const r=sz/2;c.save();c.translate(x,y);c.lineJoin='round';c.lineCap='round';const ol=stroke||'#2a1a0c',lw=Math.max(1.2,sz*.09);
 const fillStroke=(f)=>{c.fillStyle=f;c.fill();c.strokeStyle=ol;c.lineWidth=lw;c.stroke()};
 switch(name){
 case 'drop':c.restore();drop(c,x,y+r*.08,sz/32);return;
 case 'coin':{c.beginPath();c.arc(0,0,r*.92,0,7);const g=c.createRadialGradient(-r*.3,-r*.35,r*.1,0,0,r);g.addColorStop(0,'#fff6b0');g.addColorStop(.5,'#ffd23f');g.addColorStop(1,'#c88a10');fillStroke(g);
  c.beginPath();c.arc(0,0,r*.6,0,7);c.strokeStyle='#b07a10';c.lineWidth=lw*.8;c.stroke();c.beginPath();c.moveTo(0,-r*.32);c.quadraticCurveTo(r*.36,0,0,r*.32);c.quadraticCurveTo(-r*.36,0,0,-r*.32);c.fillStyle='#b07a10';c.fill();break}
 case 'gem':{c.beginPath();c.moveTo(-r*.85,-r*.25);c.lineTo(-r*.45,-r*.75);c.lineTo(r*.45,-r*.75);c.lineTo(r*.85,-r*.25);c.lineTo(0,r*.9);c.closePath();const g=c.createLinearGradient(-r,-r,r,r);g.addColorStop(0,'#bff4ff');g.addColorStop(.5,'#3ac8ff');g.addColorStop(1,'#7a3aff');fillStroke(g);
  c.beginPath();c.moveTo(-r*.85,-r*.25);c.lineTo(r*.85,-r*.25);c.moveTo(-r*.2,-r*.75);c.lineTo(0,r*.9);c.lineTo(r*.2,-r*.75);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=lw*.6;c.stroke();break}
 case 'trophy':{c.beginPath();c.moveTo(-r*.6,-r*.8);c.lineTo(r*.6,-r*.8);c.quadraticCurveTo(r*.62,r*.15,0,r*.25);c.quadraticCurveTo(-r*.62,r*.15,-r*.6,-r*.8);fillStroke('#ffcf3a');
  c.beginPath();c.arc(-r*.62,-r*.45,r*.28,Math.PI*.5,Math.PI*1.5);c.arc(r*.62,-r*.45,r*.28,-Math.PI*.5,Math.PI*.5);c.strokeStyle=ol;c.lineWidth=lw;c.stroke();
  c.beginPath();c.rect(-r*.12,r*.22,r*.24,r*.35);c.rect(-r*.45,r*.55,r*.9,r*.3);fillStroke('#e0a020');break}
 case 'star':c.restore();star(c,x,y,r*1.05,'#ffd23f');return;
 case 'heart':{c.beginPath();c.moveTo(0,r*.85);c.bezierCurveTo(-r*1.25,-r*.05,-r*.6,-r*1.05,0,-r*.35);c.bezierCurveTo(r*.6,-r*1.05,r*1.25,-r*.05,0,r*.85);const g=c.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#ff8a9a');g.addColorStop(1,'#d81e3a');fillStroke(g);
  c.beginPath();c.ellipse(-r*.38,-r*.38,r*.16,r*.1,-.6,0,7);c.fillStyle='rgba(255,255,255,.7)';c.fill();break}
 case 'lock':{c.beginPath();c.arc(0,-r*.25,r*.42,Math.PI,0);c.strokeStyle=ol;c.lineWidth=lw*2.4;c.stroke();c.strokeStyle='#c8ccd8';c.lineWidth=lw*1.2;c.stroke();
  c.beginPath();c.roundRect?c.roundRect(-r*.7,-r*.2,r*1.4,r*1.05,r*.18):c.rect(-r*.7,-r*.2,r*1.4,r*1.05);fillStroke('#ffcf3a');c.beginPath();c.arc(0,r*.25,r*.14,0,7);c.fillStyle='#5a3a10';c.fill();break}
 case 'film':{c.beginPath();c.rect(-r*.85,-r*.3,r*1.7,r*1.05);fillStroke('#2a2a34');c.save();c.translate(0,-r*.32);c.rotate(-.25);c.beginPath();c.rect(-r*.85,-r*.32,r*1.7,r*.32);fillStroke('#2a2a34');
  c.fillStyle='#fff';for(let i=0;i<3;i++){c.beginPath();c.moveTo(-r*.7+i*r*.55,-r*.32);c.lineTo(-r*.45+i*r*.55,-r*.32);c.lineTo(-r*.6+i*r*.55,0);c.lineTo(-r*.85+i*r*.55,0);c.fill()}c.restore();break}
 case 'zzz':c.restore();txt0(c,'z',x-r*.35,y+r*.25,Math.round(sz*.6),'#e0e8ff','center',ol);txt0(c,'Z',x+r*.3,y-r*.25,Math.round(sz*.8),'#e0e8ff','center',ol);return;
 case 'cycle':{c.lineWidth=lw*1.6;for(const s of [0,1]){c.save();c.rotate(s*Math.PI);c.beginPath();c.arc(0,0,r*.62,Math.PI*1.1,Math.PI*1.9);c.strokeStyle=ol;c.lineWidth=lw*2.6;c.stroke();c.strokeStyle='#7ae0ff';c.lineWidth=lw*1.3;c.stroke();
  const ax=Math.cos(Math.PI*1.9)*r*.62,ay=Math.sin(Math.PI*1.9)*r*.62;c.beginPath();c.moveTo(ax+r*.28,ay-r*.05);c.lineTo(ax-r*.05,ay-r*.3);c.lineTo(ax-r*.02,ay+r*.22);c.closePath();fillStroke('#7ae0ff');c.restore()}break}
 case 'swords':{const fs2=(f)=>{c.fillStyle=f;c.fill();c.strokeStyle=ol;c.lineWidth=lw*.55;c.stroke()};for(const s of [-1,1]){c.save();c.scale(s,1);c.rotate(-.78);c.beginPath();c.moveTo(-r*.13,r*.35);c.lineTo(-r*.13,-r*.8);c.lineTo(0,-r*1.0);c.lineTo(r*.13,-r*.8);c.lineTo(r*.13,r*.35);c.closePath();fs2('#f4f8ff');c.beginPath();c.rect(-r*.38,r*.32,r*.76,r*.16);fs2('#ffcf3a');c.beginPath();c.rect(-r*.09,r*.47,r*.18,r*.38);fs2('#9a5a24');c.restore()}break}
 case 'sell':{c.restore();drawIcon(c,'coin',x-r*.15,y+r*.12,sz*.82,stroke);c.save();c.translate(x+r*.5,y-r*.35);c.beginPath();c.moveTo(0,-r*.45);c.lineTo(r*.32,0);c.lineTo(r*.12,0);c.lineTo(r*.12,r*.4);c.lineTo(-r*.12,r*.4);c.lineTo(-r*.12,0);c.lineTo(-r*.32,0);c.closePath();c.fillStyle='#7aff6a';c.fill();c.strokeStyle=ol;c.lineWidth=lw*.8;c.stroke();c.restore();return}
 case 'crown':{c.beginPath();c.moveTo(-r*.85,r*.55);c.lineTo(-r*.95,-r*.5);c.lineTo(-r*.45,-r*.05);c.lineTo(0,-r*.75);c.lineTo(r*.45,-r*.05);c.lineTo(r*.95,-r*.5);c.lineTo(r*.85,r*.55);c.closePath();const g=c.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#fff6b0');g.addColorStop(.5,'#ffd23f');g.addColorStop(1,'#c88a10');fillStroke(g);
  for(const [gx,col] of [[-r*.45,'#ff4a6a'],[0,'#4fb3ff'],[r*.45,'#7fff6a']]){c.beginPath();c.arc(gx,r*.25,r*.13,0,7);c.fillStyle=col;c.fill()}break}
 }
 c.restore()}
function eyes(c,x,y,sp,r,angry){circ(c,x-sp,y,r,'#fff');circ(c,x+sp,y,r,'#fff');circ(c,x-sp+r*.2,y+r*.15,r*.55,'#1a1a1a');circ(c,x+sp+r*.2,y+r*.15,r*.55,'#1a1a1a');
 if(angry){c.strokeStyle='#1a1a1a';c.lineWidth=2;c.beginPath();c.moveTo(x-sp-r,y-r-1);c.lineTo(x-sp+r,y-r+3);c.moveTo(x+sp+r,y-r-1);c.lineTo(x+sp-r,y-r+3);c.stroke()}}
function leaf(c,x,y,len,ang,f){c.save();c.translate(x,y);c.rotate(ang);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(len*.5,-len*.4,len,0);c.quadraticCurveTo(len*.5,len*.4,0,0);c.fillStyle=f;c.fill();c.restore()}
function star(c,x,y,r,f){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r2=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*r2,y+Math.sin(a)*r2)}c.closePath();c.fillStyle=f;c.fill();c.strokeStyle='#0006';c.lineWidth=1;c.stroke()}
function drop(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(0,-14);c.bezierCurveTo(8,-4,11,2,10,6);c.arc(0,6,10,0,Math.PI);c.bezierCurveTo(-11,2,-8,-4,0,-14);c.fillStyle='#5cc8ff';c.fill();c.strokeStyle='#fff';c.lineWidth=2;c.stroke();ell(c,-3,1,2.5,4.5,'rgba(255,255,255,.75)');c.restore()}

// ===== Utilidades de dibujo de personajes (contorno, degradados, ojos y bocas) =====
const OL='#22140c';
let PSTY=0;// 1 = construyendo sprite de personaje (estilo Heroic Toy)
function P(c,fill,lw){c.fillStyle=fill;c.fill();if(PSTY){c.lineWidth=(lw||3)*.55;c.strokeStyle=typeof fill==='string'&&fill[0]==='#'?cshift(fill,-.62):'rgba(40,22,10,.8)'}else{c.lineWidth=lw||3;c.strokeStyle=OL}c.lineJoin='round';c.stroke()}
function LG(c,x0,y0,x1,y1,st){const g=c.createLinearGradient(x0,y0,x1,y1);st.forEach((s,i)=>g.addColorStop(i/(st.length-1),s));return g}
function RG(c,x,y,r,st,fx,fy){const g=c.createRadialGradient(fx===undefined?x-r*.35:fx,fy===undefined?y-r*.4:fy,r*.08,x,y,r);st.forEach((s,i)=>g.addColorStop(i/(st.length-1),s));return g}
function E(c,x,y,rx,ry,rot){c.beginPath();c.ellipse(x,y,rx,ry,rot||0,0,Math.PI*2)}
function RRp(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h)}
function shine(c,x,y,rx,ry,rot,a){E(c,x,y,rx,ry,rot);c.fillStyle=`rgba(255,255,255,${a||.45})`;c.fill()}
function armHQ(c,sx,sy,hx,hy,col,w){w=w||6.5;c.lineCap='round';const mx=(sx+hx)/2+(hx>sx?4:-4),my=(sy+hy)/2+7;
 c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(mx,my,hx,hy);c.strokeStyle=OL;c.lineWidth=w+5;c.stroke();c.strokeStyle=col;c.lineWidth=w;c.stroke();
 E(c,hx,hy,w*.9,w*.9);P(c,col,2.5);shine(c,hx-1.5,hy-2,2,1.5,0,.5)}
function leafHQ(c,x,y,len,ang,col,dk){c.save();c.translate(x,y);c.rotate(ang);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(len*.5,-len*.42,len,0);c.quadraticCurveTo(len*.5,len*.42,0,0);
 P(c,LG(c,0,-len*.4,0,len*.4,[col,dk]),2.2);c.beginPath();c.moveTo(1,0);c.lineTo(len*.8,0);c.strokeStyle=dk;c.lineWidth=1.3;c.stroke();c.restore()}
function eyesHQ(c,x,y,sp,rx,ry,iris,mood,skin,glow){
 for(const sd of [-1,1]){const k=sd<0?.88:1,ex=x+sd*sp*(sd<0?.94:1),erx=rx*k;
  E(c,ex,y,erx,ry);c.fillStyle=RG(c,ex,y,ry*1.1,['#ffffff','#f2f4fa','#c4cadc'],ex-erx*.3,y-ry*.45);c.fill();
  c.save();E(c,ex,y,erx,ry);c.clip();
  const ix=ex+erx*.18,iy=y+ry*.1,ir=Math.min(erx,ry)*.74;
  if(glow){c.shadowColor=glow;c.shadowBlur=9}
  E(c,ix,iy,ir,ir*1.05);c.fillStyle=RG(c,ix,iy,ir,[cshift(iris,.6),iris,cshift(iris,-.55)],ix,iy-ir*.55);c.fill();c.shadowBlur=0;
  E(c,ix,iy,ir,ir*1.05);c.strokeStyle=cshift(iris,-.72);c.lineWidth=1.1;c.stroke();
  E(c,ix+ir*.05,iy+ir*.1,ir*.46,ir*.54);c.fillStyle='#0b0a12';c.fill();
  c.fillStyle='rgba(30,20,40,.24)';c.fillRect(ex-erx,y-ry,erx*2,ry*.42);
  if(mood==='angry'||mood==='fierce'||mood==='sly'||mood==='cold'){const inner=ex-sd*(erx+3),outer=ex+sd*(erx+3);
   let li=.05,lo=.7;if(mood==='fierce'){li=-.08;lo=.85}else if(mood==='sly'){li=sd>0?.55:.12;lo=sd>0?.78:.42}else if(mood==='cold'){li=.3;lo=.28}
   c.beginPath();c.moveTo(outer,y-ry-3);c.lineTo(inner,y-ry-3);c.lineTo(inner,y-ry*li);c.lineTo(outer,y-ry*lo);c.closePath();c.fillStyle=skin;c.fill();
   c.beginPath();c.moveTo(inner,y-ry*li);c.lineTo(outer,y-ry*lo);c.strokeStyle=OL;c.lineWidth=2.2;c.stroke()}
  if(mood==='happy'){E(c,ex,y+ry*1.3,erx*1.5,ry*.8);c.fillStyle=skin;c.fill()}
  c.restore();
  E(c,ex,y,erx,ry);c.strokeStyle=OL;c.lineWidth=2.3;c.stroke();
  if(glow){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.55;E(c,ix,iy,ir*1.5,ir*1.5);c.fillStyle=RG(c,ix,iy,ir*1.5,[glow,'rgba(0,0,0,0)'],ix,iy);c.fill();c.restore()}
  E(c,ix+ir*.42,iy-ir*.45,ir*.33,ir*.28);c.fillStyle='#ffffff';c.fill();E(c,ix-ir*.36,iy+ir*.4,ir*.15,ir*.13);c.fillStyle='rgba(255,255,255,.85)';c.fill();
  // ceja: cuña gruesa y angular
  const by=y-ry*1.32,inX=ex-sd*erx*.8,outX=ex+sd*erx*1.15;let yi,yo,arc=ry*.1;
  if(mood==='angry'||mood==='fierce'){yi=by+ry*.48;yo=by-ry*.28;arc=0}else if(mood==='sly'){yi=sd>0?by+ry*.15:by-ry*.38;yo=sd>0?by+ry*.05:by-ry*.1}
  else if(mood==='happy'){yi=by;yo=by;arc=ry*.4}else if(mood==='cold'){yi=by+ry*.22;yo=by+ry*.04;arc=0}else{yi=by+ry*.1;yo=by-ry*.14}
  c.beginPath();c.moveTo(inX,yi+1.8);c.quadraticCurveTo((inX+outX)/2,(yi+yo)/2-arc,outX,yo-.4);c.quadraticCurveTo((inX+outX)/2,(yi+yo)/2-arc-3.8,inX,yi-2.2);c.closePath();c.fillStyle=OL;c.fill()}}
function blush(c,x,y,sp){for(const sd of [-1,1]){E(c,x+sd*sp,y,4.5,2.6);c.fillStyle='rgba(255,110,110,.38)';c.fill()}}
function mouthHQ(c,x,y,type,w){w=w||7;c.lineCap='round';c.lineJoin='round';
 const inner=build=>{build();c.fillStyle=RG(c,x,y+w*.3,w,['#c8303a','#6a0c14','#2a0408'],x,y);c.fill();c.save();build();c.clip();E(c,x,y+w*.8,w*.6,w*.32);c.fillStyle='#ff7a8a';c.fill();c.restore();build();c.strokeStyle=OL;c.lineWidth=2.2;c.stroke()};
 const tooth=(tx,ty,dir,len)=>{c.beginPath();c.moveTo(tx-1.8,ty);c.lineTo(tx,ty+dir*len);c.lineTo(tx+1.8,ty);c.closePath();c.fillStyle='#ffffff';c.fill();c.strokeStyle='rgba(60,30,30,.55)';c.lineWidth=.8;c.stroke()};
 if(type==='grin'){inner(()=>{c.beginPath();c.moveTo(x-w,y-1.5);c.quadraticCurveTo(x,y+w*.95,x+w*1.05,y-2.6);c.quadraticCurveTo(x,y+1.5,x-w,y-1.5)});
  c.beginPath();c.moveTo(x-w*.92,y-.6);c.quadraticCurveTo(x,y+2,x+w*.98,y-1.8);c.lineTo(x+w*.9,y+1.2);c.quadraticCurveTo(x,y+4.2,x-w*.85,y+1.6);c.closePath();c.fillStyle='#ffffff';c.fill();tooth(x-w*.58,y+.4,1,3.6);tooth(x+w*.62,y-.2,1,3.6)}
 else if(type==='open'){inner(()=>{c.beginPath();c.moveTo(x-w,y-1);c.quadraticCurveTo(x,y+w*1.35,x+w,y-1);c.quadraticCurveTo(x,y+1.5,x-w,y-1)});tooth(x-w*.45,y+.2,1,2.6);tooth(x+w*.45,y+.2,1,2.6)}
 else if(type==='smirk'){c.beginPath();c.moveTo(x-w*.85,y+1.5);c.quadraticCurveTo(x+w*.1,y+3.8,x+w,y-3);c.strokeStyle=OL;c.lineWidth=2.6;c.stroke();tooth(x+w*.52,y-.3,1,3)}
 else if(type==='fangs'){inner(()=>{c.beginPath();c.moveTo(x-w,y-1);c.quadraticCurveTo(x,y+w*.85,x+w,y-1);c.quadraticCurveTo(x,y+2.4,x-w,y-1)});tooth(x-w*.55,y,1,w*.62);tooth(x+w*.55,y,1,w*.62);tooth(x-w*.2,y+w*.56,-1,2.2);tooth(x+w*.2,y+w*.56,-1,2.2)}
 else if(type==='effort'){inner(()=>{RRp(c,x-w,y-2.8,w*2,5.6,2.6)});c.fillStyle='#ffffff';c.fillRect(x-w+1.3,y-1.7,w*2-2.6,3.4);c.strokeStyle='rgba(80,40,40,.6)';c.lineWidth=.8;for(let i=1;i<5;i++){c.beginPath();c.moveTo(x-w+i*w*.4,y-1.7);c.lineTo(x-w+i*w*.4,y+1.7);c.stroke()}}
 else{c.beginPath();c.moveTo(x-w*.75,y+.8);c.quadraticCurveTo(x,y+w*.3,x+w*.75,y-.8);c.strokeStyle=OL;c.lineWidth=2.6;c.stroke();c.beginPath();c.moveTo(x+w*.7,y-1.2);c.lineTo(x+w*.95,y-2.8);c.lineWidth=1.8;c.stroke()}}
const SPR={};
// Aspectos: variante de color del sprite base (filtro de canvas) y, para «Real», una corona dibujada encima.
function skinSprite(k,skin){const key=k+'|'+skin;if(SPR[key])return SPR[key];const base=heroSprite(k),S=SKINS[skin],R=2.4;
 const cv2=document.createElement('canvas');cv2.width=base.img.width;cv2.height=base.img.height;const c=cv2.getContext('2d');
 c.filter=S.f;c.drawImage(base.img,0,0);c.filter='none';
 if(S.crown){c.save();c.scale(R,R);c.translate(base.ox,base.oy+base.top+2);c.rotate(-.12);c.beginPath();c.moveTo(-13,0);c.lineTo(-15,-14);c.lineTo(-7,-6);c.lineTo(0,-17);c.lineTo(7,-6);c.lineTo(15,-14);c.lineTo(13,0);c.closePath();
  P(c,LG(c,0,-17,0,0,['#fff6b0','#ffd23f','#c88a10']),2.2);for(const [x,col] of [[-8,'#ff4a6a'],[0,'#4fb3ff'],[8,'#7fff6a']]){E(c,x,-3.5,2.2,2.2);P(c,col,1.2)}c.restore()}
 SPR[key]={img:cv2,cw:base.cw,ch:base.ch,ox:base.ox,oy:base.oy};return SPR[key]}
// Sprite de un personaje (con su aspecto, si tiene). Todos los personajes usan el arte v2 (LOOK).
function heroSprite(k,skin){if(skin&&SKINS[skin])return skinSprite(k,skin);return charSprite(k)}
function drawUnit(c,k,x,y,s,t,rank,pop,skin,af,face){return drawChar(c,k,x,y,s,t,rank,pop,skin,af,face)}

// ===================== ESTILO «JUGUETE HEROICO» (arte v2) =====================
// Aclara (a>0) u oscurece (a<0) un color #rrggbb.
function cshift(hex,a){if(typeof hex!=='string'||hex[0]!=='#')return hex;let h=hex.slice(1);if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h.slice(0,6),16);let r=n>>16&255,g=n>>8&255,b=n&255;
 if(a>0){r+=(255-r)*a;g+=(255-g)*a;b+=(255-b)*a}else{r*=1+a;g*=1+a;b*=1+a}return '#'+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('')}
// Relleno volumétrico en 4 pasos sobre la forma que construye build(c):
// (B) degradado radial descentrado arriba-izquierda, (C) luz de recorte arriba-izquierda + sombra interna abajo-derecha + brillo especular,
// (D) contorno interno fino y coloreado. o.ol añade además un contorno exterior oscuro (piezas en vivo, como las armas).
function VOL(c,build,col,o){o=o||{};const [x0,y0,x1,y1]=o.bb,w=x1-x0,h=y1-y0,cx=(x0+x1)/2,cy=(y0+y1)/2,rad=Math.max(w,h)*.72;c.lineJoin='round';
 if(o.ol){build(c);c.lineWidth=o.ol;c.strokeStyle=OL;c.stroke()}
 build(c);c.fillStyle=RG(c,cx,cy,rad,[o.light||cshift(col,.5),col,o.dark||cshift(col,-.5)],cx-w*.28,cy-h*.32);c.fill();
 c.save();build(c);c.clip();
 c.lineWidth=o.rim||4.5;c.strokeStyle=LG(c,x0,y0,cx+w*.08,cy+h*.08,['rgba(255,255,255,.95)','rgba(255,255,255,0)']);c.stroke();
 c.lineWidth=7;c.strokeStyle=LG(c,x1,y1,cx,cy,['rgba(25,10,0,.4)','rgba(25,10,0,0)']);c.stroke();c.restore();
 if(o.spec){c.save();c.globalAlpha=o.specA||.82;E(c,o.spec[0],o.spec[1],o.spec[2],o.spec[3],o.spec[4]===undefined?-.5:o.spec[4]);c.fillStyle='#ffffff';c.fill();c.restore()}
 build(c);c.lineWidth=o.lw||1.6;c.strokeStyle=o.line||cshift(col,-.62);c.stroke()}
// Paso A: sombra de oclusión ambiental (uniones cabeza-cuerpo, debajo de sombreros y coronas).
function AO(c,x,y,rx,ry,a){c.save();E(c,x,y,rx,ry);c.fillStyle=RG(c,x,y,Math.max(rx,ry),[`rgba(25,10,0,${a||.45})`,'rgba(25,10,0,0)'],x,y);c.fill();c.restore()}
// Ojos con volumen, iris con anillo, doble brillo especular, párpados y CEJAS angulares según la actitud. glow = resplandor mágico.
// Bocas con actitud: grin (sonrisa desafiante con colmillos), open (grito), smirk, fangs (gruñido), effort (dientes apretados), line (decidida).
// Pétalo orgánico: punta curvada (j), luz de recorte por la vena y contorno fino coloreado.
// Torso heroico trapezoidal (pecho ancho, cintura marcada), piernas robustas y botas con volumen; hombreras que rompen la silueta.
// Cara en vista 3/4: desplazada hacia donde mira; sombra bajo la boca; resplandor mágico opcional (H.glow).
// Armas 25 % más grandes. Guantelete y bastón con el render volumétrico nuevo; el resto conserva su dibujo, escalado.
// Rendimiento: cada arma se dibuja una vez por tamaño y nivel de ataque (5 pasos) y luego solo se copia.
const WPC=new WeakMap();
function drawWeapon(c,W,t,a){const m=c.getTransform(),dens=Math.max(.5,Math.ceil(Math.hypot(m.a,m.b)*2)/2),ai=Math.round(clamp(a||0,0,1)*4);let mp=WPC.get(W);if(!mp){mp={};WPC.set(W,mp)}const key=dens+'|'+ai;let im=mp[key];
 if(!im){const X0=-80,Y0=-150,WW=200,HH=250,cv2=document.createElement('canvas');cv2.width=Math.ceil(WW*dens);cv2.height=Math.ceil(HH*dens);const q=cv2.getContext('2d');q.scale(dens,dens);q.translate(-X0,-Y0);q.lineJoin='round';q.lineCap='round';drawWeaponV(q,W,1.2,ai/4);im=mp[key]={cv:cv2,X0,Y0,WW,HH}}
 c.drawImage(im.cv,im.X0,im.Y0,im.WW,im.HH)}
function drawWeaponV(c,W,t,a){c.save();c.scale(1.25,1.25);c.lineJoin='round';c.lineCap='round';
 if(W.t==='gauntlet'){AO(c,0,5,12,5,.35);
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-9,6);cc.quadraticCurveTo(-12.5,-4,-6,-10);cc.lineTo(7,-11);cc.quadraticCurveTo(13,-4,10,6);cc.quadraticCurveTo(0,10,-9,6);cc.closePath()},W.c1||'#4a4a6a',{bb:[-12.5,-11,13,10],light:'#c8d0f0',dark:'#14142a',spec:[-4,-6,3,1.6],ol:3.2});
  for(let i=-1;i<=1;i++)VOL(c,cc=>{RRp(cc,i*5.2-2.4,-16,4.8,7.5,2)},'#c8ccd8',{bb:[i*5.2-2.4,-16,i*5.2+2.4,-8.5],light:'#ffffff',dark:'#5a6070',lw:1,spec:[i*5.2-.8,-14,1,1.6,0],ol:2.6});
  c.save();c.globalCompositeOperation='lighter';E(c,1,-2,5+a*3,5+a*3);c.fillStyle=RG(c,1,-2,8,['#ffffff','#28e8ff','rgba(40,232,255,0)'],1,-2);c.fill();
  if(a>0){c.globalAlpha=a;E(c,4,-6,20,20);c.fillStyle=RG(c,4,-6,20,['rgba(255,255,220,.95)','rgba(120,230,255,.45)','rgba(120,230,255,0)'],4,-6);c.fill()}c.restore()}
 else if(W.t==='staff'){const wood=W.wood,gem=W.gem||'#ffffff';
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-2.7,30);cc.bezierCurveTo(-3.6,0,-1.6,-30,-3.2,-62);cc.lineTo(3.2,-62);cc.bezierCurveTo(1.8,-30,3.6,0,2.7,30);cc.closePath()},wood?'#8a5a2a':'#c8d0e0',{bb:[-3.6,-62,3.6,30],light:wood?'#e0b07a':'#ffffff',dark:wood?'#3a2008':'#5a6478',rim:2.4,lw:1.1,ol:3});
  if(wood)for(const [y,sd] of [[-24,1],[4,-1]]){c.beginPath();c.moveTo(sd*2,y);c.quadraticCurveTo(sd*7,y-4,sd*9,y-10);c.strokeStyle='#5a3a1a';c.lineWidth=2.2;c.stroke();leafHQ(c,sd*9,y-10,8,sd>0?-.6:-2.5,'#7ad04a','#2a6a1a')}
  const gy=-72,pul=.5+.25*Math.sin(t*4)+a*.5;
  for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*2.4,gy+12);c.bezierCurveTo(sd*12.5,gy+6,sd*11.5,gy-7,sd*4,gy-14);c.strokeStyle=OL;c.lineWidth=4.6;c.stroke();c.strokeStyle=wood?'#c09050':'#f0c040';c.lineWidth=2.4;c.stroke()}
  c.save();c.globalCompositeOperation='lighter';const gr=16+a*11;E(c,0,gy,gr,gr);c.fillStyle=RG(c,0,gy,gr,[`rgba(255,255,255,${Math.min(1,pul)})`,gem+'aa',gem+'00'],0,gy);c.fill();c.restore();
  if(W.sun){for(let i=0;i<8;i++){c.save();c.translate(0,gy);c.rotate(i*Math.PI/4+t);c.beginPath();c.moveTo(7,-2.5);c.lineTo(14,0);c.lineTo(7,2.5);c.closePath();P(c,'#ffd23f',1.2);c.restore()}}
  else if(W.bolt){c.beginPath();c.moveTo(-4,gy-13);c.lineTo(3,gy-2);c.lineTo(-2,gy);c.lineTo(5,gy+12);c.lineTo(-3,gy+1);c.lineTo(2,gy-1);c.closePath();P(c,'#fff27a',1.4)}
  VOL(c,cc=>{E(cc,0,gy,7.6,7.6)},gem,{bb:[-7.6,gy-7.6,7.6,gy+7.6],light:'#ffffff',dark:cshift(gem,-.62),spec:[-2.4,gy-2.8,2.5,1.6],ol:3})}
 else drawWeapon0(c,W,t,a);
 c.restore()}
// Efectos con mezcla aditiva para que fuego, chispas y magia brillen de verdad.
const FX_LIT={flame:1,frost:1,spark:1,sun:1,glow:1,stars:1,coins:1};
function chFx(c,L,t,a){if(FX_LIT[L.fx]){c.save();c.globalCompositeOperation='lighter';chFx0(c,L,t,a);c.restore()}else chFx0(c,L,t,a)}
// Sprite fijo: capas + vista 3/4 (cabeza y cara desplazadas hacia donde mira, hombro trasero más chico) + oclusión + contorno exterior grueso.
// ===================== ARTE DE PERSONAJES v2 =====================
// Capas fijas en caché (espalda, brazo izquierdo, cuerpo, cabeza, cara, sombrero) + capas en vivo
// (arma, brazo derecho, efectos, aura de rareza) con animación de espera y de ataque propias de cada personaje.
const W_=(t,hx,hy,o)=>Object.assign({t,hx,hy},o||{});
const LOOK={
 espina:{arm:'#5aa83a',b:{t:'tunic',col:'#4f9e34',dk:'#2a6a1c',l:'#7fcf52'},h:{t:'round',r:25,c:['#b8f08a','#6cc040','#2f7a1f'],veins:1,spikes:1,skin:'#78c94a',iris:'#ffb020',mood:'angry',mouth:'effort'},hat:{t:'band',c:'#d04a3a'},bk:{t:'quiver',c:'#8a5a2a'},w:W_('spear',27,-50,{a:.12}),idle:'bob',atk:'lunge'},
 hielo:{arm:'#8fd8f2',b:{t:'robe',col:'#5ab0e0',dk:'#24608e',l:'#bfeaff',trim:'#ffffff',leaf:'#dff6ff',leafDk:'#5aa0c8'},h:{t:'flower',r:21,n:7,pl:22,pw:7,ps:'point',pc:'#ffffff',pd:'#3a9ad8',c:['#ffffff','#dff4ff','#9cc8e8'],skin:'#e6f6ff',iris:'#3a8ad8',mood:'calm',glow:'#3a8ad8',mouth:'line',blush:1},hat:{t:'tiara',c:'#e8f4ff',g:'#7ad8ff'},bk:{t:'cape',c:'#bfe8ff',c2:'#5aa0d0'},w:W_('staff',26,-48,{gem:'#bff4ff'}),idle:'float',atk:'raise',fx:'frost'},
 fuego:{arm:'#ff6a3a',b:{t:'tunic',col:'#d8321e',dk:'#7a120a',l:'#ff7a4a',leaf:'#6ac04a',leafDk:'#2a6a1c'},h:{t:'pod',r:24,c:['#ff9a6a','#ff3a1a','#a8100a'],skin:'#ff4a26',iris:'#ffd23f',mood:'fierce',glow:'#ffd23f',mouth:'fangs'},hat:{t:'band',c:'#ffd23f'},w:W_('gauntlet',28,-52,{c1:'#5a3a2a'}),idle:'jitter',atk:'recoil',fx:'flame'},
 rayo:{arm:'#f0d040',b:{t:'armor',col:'#e8c020',dk:'#8a6a08',l:'#fff07a',leaf:'#c8e04a',leafDk:'#6a7a10',m1:'#a8a8b8',m2:'#3a3a44'},h:{t:'leafy',r:22,c:['#fff9b0','#ffe04a','#c89a10'],lc:'#c8e04a',ld:'#6a7a10',skin:'#ffe86a',iris:'#28c8ff',mood:'angry',glow:'#28c8ff',mouth:'effort'},hat:{t:'goggles',c:'#3a3a44',g:'#2ab0d8'},bk:{t:'pack',c:'#4a4a58'},w:W_('gauntlet',29,-56,{c1:'#3a3a48'}),idle:'jitter',atk:'flash',fx:'spark'},
 rocio:{arm:'#6cc8ff',b:{t:'tunic',col:'#3a9ae0',dk:'#1a4a8a',l:'#8fd8ff'},h:{t:'bud',r:24,c:['#e8fbff','#7ad4ff','#1e88d0'],skin:'#5cc0f8',iris:'#1a5ab8',mood:'happy',mouth:'open',blush:1},hat:{t:'leafcap',c:'#7fd04a',c2:'#2f7a1f'},w:W_('can',25,-40),idle:'hop',atk:'raise',fx:'drip'},
 veneno:{arm:'#f0e2c4',b:{t:'robe',col:'#f2ead8',dk:'#a8987a',l:'#ffffff',trim:'#8a4ab8',leaf:'#b07ad8',leafDk:'#5a2a80'},h:{t:'mush',r:21,c:['#d8a0ff','#9a4ad8','#4a1a7a'],f:['#fffaf0','#f0e0c4','#c8b090'],dot:'#c8f05a',skin:'#f2e4c8',iris:'#8ad81a',mood:'sly',mouth:'smirk'},w:W_('flask',27,-48,{c1:'#c8f05a'}),idle:'sway',atk:'recoil',fx:'spores'},
 trampa:{arm:'#3f9a4a',b:{t:'bulky',col:'#2f8a3a',dk:'#164a1c',l:'#5ac060',leaf:'#5ac060',leafDk:'#164a1c'},h:{t:'jaw',r:30,c:['#8ae07a','#3f9a4a','#164a1c'],in:['#ff7a7a','#c01a2a','#5a0a10'],skin:'#5ab450',iris:'#ff3a3a',mood:'angry'},w:W_('none',30,-40),idle:'breathe',atk:'stomp',fx:'drool'},
 sol:{arm:'#ffc040',b:{t:'robe',col:'#f0a020',dk:'#8a4a08',l:'#ffe080',trim:'#ffffff'},h:{t:'flower',r:20,n:14,pl:19,pw:6,ps:'round',pc:'#ffd23f',pd:'#e07a10',ring2:'#ffb020',c:['#a86a2a','#7a4214','#4a2408'],face:['#fff4d8','#ffe0a8','#f0b878'],skin:'#ffe6b8',iris:'#e08a10',mood:'happy',glow:'#e08a10',mouth:'open',blush:1},hat:{t:'halo',c:'#fff0a0'},w:W_('staff',27,-52,{gem:'#ffe680',sun:1}),idle:'sway',atk:'flash',fx:'sun'},
 bellota:{arm:'#b07a40',b:{t:'bulky',col:'#8a5a2a',dk:'#4a2a10',l:'#c08a4a',leaf:'#7fb04a',leafDk:'#3a6a1a',boot:'#5a3a1a'},h:{t:'acorn',r:23,c:['#e0a060','#a8682a','#5a3010'],cap:['#8a6a3a','#5a3a1a'],skin:'#c88a4a',iris:'#3a2a10',mood:'fierce',mouth:'grin'},bk:{t:'pack',c:'#6a4a2a'},w:W_('cannon',24,-38,{c1:'#7a5a3a',c2:'#3a2a1a'}),idle:'jitter',atk:'recoil',fx:'smoke'},
 trebol:{arm:'#5ac050',b:{t:'slim',col:'#3aa04a',dk:'#1a5a24',l:'#7ae07a',trim:'#ffe14a'},h:{t:'flower',r:17,n:4,pl:24,pw:15,ps:'heart',pc:'#6ad05a',pd:'#2a7a2a',c:['#e8ffd8','#c8f0b0','#90c880'],face:['#f0ffe8','#c8f0b0','#90c880'],skin:'#c8f0b0',iris:'#2a8a3a',mood:'happy',mouth:'grin',blush:1},hat:{t:'tophat',c:'#2a6a2a',c2:'#ffe14a'},w:W_('wand',26,-50,{gem:'#ffe14a',coin:1}),idle:'hop',atk:'raise',fx:'coins'},
 cactus:{arm:'#5aa83a',b:{t:'armor',col:'#4a8a3a',dk:'#24501a',l:'#7ac05a',m1:'#e8d8b0',m2:'#a88a50'},h:{t:'cactus',r:22,c:['#9ae07a','#4a9a32','#2a5a1a'],fl:'#ff7ab0',skin:'#7ac05a',iris:'#ffcf2a',mood:'angry',mouth:'fangs'},hat:{t:'helmet',c:'#d8b070',c2:'#7a5a2a'},bk:{t:'quiver',c:'#a87a3a'},w:W_('bow',28,-46,{c1:'#8a5a2a'}),idle:'breathe',atk:'recoil'},
 nenufar:{arm:'#5ad0c0',b:{t:'robe',col:'#3ab8a8',dk:'#1a6a64',l:'#8ae8e0',trim:'#ffffff'},h:{t:'flower',r:19,n:8,pl:20,pw:9,ps:'point',pc:'#ffd0e8',pd:'#e06aa8',c:['#fff8c0','#ffe06a','#e0a020'],face:['#f0fffc','#d0f4f0','#90c8c0'],skin:'#e0fff8',iris:'#2a9ad8',mood:'happy',mouth:'open',blush:1},hat:{t:'leafcap',c:'#4ab83a',c2:'#1a6a1a'},w:W_('wand',26,-48,{gem:'#bff4ff',bubble:1}),idle:'float',atk:'raise',fx:'bubbles'},
 calabaza:{arm:'#3a8a2a',b:{t:'bulky',col:'#3a6a2a',dk:'#1a3a10',l:'#5a8a3a',boot:'#5a3a1a'},h:{t:'pumpkin',r:26,c:['#ffc070','#f08a1a','#a84a08'],skin:'#f08a1a',iris:'#ffe14a',mood:'fierce',mouth:'fangs'},hat:{t:'helmet',c:'#7a7a88',c2:'#2a2a34'},w:W_('mortar',24,-40,{c1:'#5a5a68',c2:'#2a2a34'}),idle:'breathe',atk:'stomp',fx:'smoke'},
 diente:{arm:'#b8e08a',b:{t:'slim',col:'#9ad06a',dk:'#4a7a2a',l:'#d8f0b0',leaf:'#c8f0a0',leafDk:'#5a8a3a'},h:{t:'puff',r:21,face:['#fffbe0','#f0e8b0','#c8b870'],skin:'#f8f0c0',iris:'#5aa0e0',mood:'calm',mouth:'open',blush:1},w:W_('fan',27,-48,{c1:'#e8f4ff',c2:'#7ab0d8'}),idle:'float',atk:'twirl',fx:'puffs'},
 lavanda:{arm:'#b8a0e8',b:{t:'robe',col:'#9a7ad8',dk:'#4a2a8a',l:'#d8c8ff',trim:'#fff0a0',leaf:'#8ac07a',leafDk:'#3a6a2a'},h:{t:'lavender',r:21,c:['#f4eeff','#e0d4ff','#a898d0'],fl:'#9a6ae0',skin:'#ece4ff',iris:'#7a4ad8',mood:'calm',glow:'#7a4ad8',mouth:'line',blush:1},hat:{t:'flowerpin',c:'#c8a0ff'},w:W_('book',26,-42,{c1:'#6a3aa8',gem:'#e0c8ff'}),idle:'sway',atk:'raise',fx:'glow',fxc:'#c8a0ff'},
 pimiento:{arm:'#5ab83a',b:{t:'tunic',col:'#c83a2a',dk:'#6a1a10',l:'#ff6a4a'},h:{t:'pod',r:23,c:['#b8f07a','#4ab83a','#1e6a14'],skin:'#6ac04a',iris:'#ff3a2a',mood:'fierce',glow:'#ff3a2a',mouth:'grin'},hat:{t:'band',c:'#ffd23f'},w:W_('daggers',28,-46,{c1:'#e8ecf4'}),idle:'jitter',atk:'lunge',fx:'flame'},
 helecho:{arm:'#4a9a4a',b:{t:'slim',col:'#2f7a3a',dk:'#123a1a',l:'#5ab060'},h:{t:'leafy',r:21,c:['#c8f0a0','#6ac050','#2a6a1a'],lc:'#4ab83a',ld:'#1a5a1a',fern:1,skin:'#8ad070',iris:'#e8e020',mood:'fierce',mouth:'grin'},bk:{t:'hood',c:'#1e4a24',c2:'#0e2a14'},w:W_('bow',28,-46,{c1:'#5a8a3a'}),idle:'breathe',atk:'recoil'},
 abrojo:{arm:'#b88a4a',b:{t:'armor',col:'#8a6a3a',dk:'#4a3010',l:'#c09a5a',m1:'#b8b8c0',m2:'#5a5a64'},h:{t:'burr',r:22,c:['#e8c080','#a87a30','#5a3a10'],skin:'#d0a060',iris:'#ff6a2a',mood:'sly',mouth:'fangs'},hat:{t:'goggles',c:'#4a3a2a',g:'#ffb04a'},w:W_('sling',28,-48,{c1:'#7a5a2a'}),idle:'bob',atk:'recoil'},
 menta:{arm:'#9ae8d0',b:{t:'tunic',col:'#5ad0b0',dk:'#1a7a64',l:'#b0ffe8',trim:'#ffffff'},h:{t:'leafy',r:22,c:['#efffff','#a8f0d8','#4ab898'],lc:'#7ae0c0',ld:'#2a8a6a',skin:'#c8fff0',iris:'#3ab8d8',mood:'calm',glow:'#3ab8d8',mouth:'smirk'},hat:{t:'tiara',c:'#e8fbff',g:'#5ae0ff'},bk:{t:'cape',c:'#d8fbff',c2:'#7ad0e0'},w:W_('staff',26,-48,{gem:'#c8fff8'}),idle:'float',atk:'raise',fx:'frost'},
 zarza:{arm:'#7a4a8a',b:{t:'robe',col:'#5a2a6a',dk:'#2a0a34',l:'#8a5a9a',trim:'#c8f05a',leaf:'#4a8a3a',leafDk:'#1a4a1a'},h:{t:'berry',r:21,c:['#c890f0','#6a2a9a','#2a0a3a'],skin:'#a870c8',iris:'#ff4a8a',mood:'sly',mouth:'smirk'},hat:{t:'horns',c:'#3a5a2a'},w:W_('scythe',27,-48,{c1:'#5a3a2a',c2:'#d8d8e8'}),idle:'sway',atk:'lunge',fx:'spores',fxc:'#d8a8ff'},
 orquidea:{arm:'#f0a0d8',b:{t:'robe',col:'#d84aa8',dk:'#6a1a5a',l:'#ff9ad8',trim:'#ffe14a',leaf:'#7ad06a',leafDk:'#2a6a1a'},h:{t:'flower',r:18,n:5,pl:28,pw:14,ps:'round',pc:'#fff0fa',pd:'#e870c0',c:['#ffffff','#ffe0f4','#e8a0d0'],face:['#fff8fc','#ffe0f4','#e8a0d0'],skin:'#fff0fa',iris:'#a02ad8',mood:'sly',mouth:'smirk',blush:1},hat:{t:'wizard',c:'#a03ad8',c2:'#4a0a7a'},bk:{t:'cape',c:'#a03ad8',c2:'#4a0a7a'},w:W_('staff',26,-50,{gem:'#ff8ad8'}),idle:'float',atk:'raise',fx:'petals',fxc:'#ffb8e8'},
 bambu:{arm:'#8ac04a',b:{t:'slim',col:'#2a3a2a',dk:'#0e160e',l:'#4a5a4a',trim:'#c8f08a',leaves:false,boot:'#2a2a2a'},h:{t:'bamboo',r:20,c:['#d8f8a0','#8ac04a','#3a7a1a'],skin:'#a8d870',iris:'#ffe14a',mood:'fierce',mouth:'effort'},hat:{t:'band',c:'#1a1a1a'},w:W_('daggers',28,-46,{c1:'#d8e8f0'}),idle:'jitter',atk:'lunge'},
 loto:{arm:'#ffd8c0',b:{t:'robe',col:'#f8f0e0',dk:'#b8a080',l:'#ffffff',trim:'#ffcf4a',leaf:'#7ad06a',leafDk:'#2a6a1a'},h:{t:'flower',r:18,n:10,pl:22,pw:9,ps:'point',pc:'#ffd0e0',pd:'#e870a0',ring2:'#ffe0ea',c:['#fff8c0','#ffe06a','#e0a020'],face:['#fffaf4','#ffe8e0','#e8c0b0'],skin:'#fff4f0',iris:'#e08a2a',mood:'cold',glow:'#e08a2a',mouth:'line',blush:1},hat:{t:'halo',c:'#ffe680'},bk:{t:'mantle',c:'#ffe8a0',c2:'#c8902a'},w:W_('lantern',26,-44,{c1:'#c8902a',gem:'#ffe680'}),idle:'float',atk:'flash',fx:'glow',fxc:'#ffe680'},
 baobab:{arm:'#8a6a4a',b:{t:'bulky',col:'#8a6a4a',dk:'#4a3420',l:'#b08a60',leaf:'#7ab04a',leafDk:'#3a6a1a',boot:'#4a3420'},h:{t:'trunk',r:25,c:['#d0a880','#8a6a4a','#4a3420'],lc:'#6ab84a',ld:'#2a6a1a',skin:'#c09a70',iris:'#7aff6a',mood:'fierce',mouth:'grin'},w:W_('mortar',24,-40,{c1:'#7a5a3a',c2:'#3a2a1a',big:1}),idle:'breathe',atk:'stomp',fx:'leaves'},
 venus:{arm:'#4ab84a',b:{t:'bulky',col:'#3a9a3a',dk:'#164a1c',l:'#6ad06a',leaf:'#6ad06a',leafDk:'#164a1c'},h:{t:'jaw',r:32,c:['#a8f08a','#4ab84a','#1a5a1a'],in:['#ffb07a','#e0402a','#6a0a10'],skin:'#6ac060',iris:'#ffe14a',mood:'angry',spot:'#ff6a6a'},hat:{t:'crown',c:'#ffd23f'},w:W_('none',30,-40),idle:'breathe',atk:'lunge',fx:'drool'},
 cerezo:{arm:'#8a5a3a',b:{t:'robe',col:'#ffb0c8',dk:'#c0507a',l:'#ffe0ea',trim:'#ffffff',leaf:'#ffd0e0',leafDk:'#d06a90'},h:{t:'flower',r:18,n:5,pl:24,pw:12,ps:'heart',pc:'#ffe0ec',pd:'#ff8ab0',c:['#fff8c0','#ffd86a','#e08a40'],face:['#fffafc','#ffe4ee','#f0b8c8'],skin:'#fff0f4',iris:'#d84a7a',mood:'happy',mouth:'open',blush:1},hat:{t:'flowerpin',c:'#ffffff'},bk:{t:'petalwings',c:'#ffd0e4'},w:W_('fan',27,-48,{c1:'#ffe0ec',c2:'#d84a7a'}),idle:'sway',atk:'twirl',fx:'petals',fxc:'#ffc8dc'},
 cardo:{arm:'#7a8ad8',b:{t:'armor',col:'#5a5ad8',dk:'#22226a',l:'#8a8aff',m1:'#c8d0e8',m2:'#5a6a8a',gem:'#28e8ff'},h:{t:'thistle',r:21,c:['#a8e08a','#5a9a3a','#2a5a1a'],fl:'#a04ae0',skin:'#8ac070',iris:'#28e8ff',mood:'fierce',mouth:'effort',glow:'#28e8ff'},hat:{t:'goggles',c:'#2a2a3a',g:'#28e8ff'},w:W_('gauntlet',29,-54,{c1:'#3a3a6a'}),idle:'jitter',atk:'flash',fx:'spark'},
 aloe:{arm:'#7ad0a0',b:{t:'robe',col:'#4aa88a',dk:'#1a5a44',l:'#8ae0c0',trim:'#ffe14a'},h:{t:'aloe',r:19,c:['#d8ffe8','#8ae0b0','#3a9a6a'],lc:'#6ac090',ld:'#2a7a4a',skin:'#c8f8e0',iris:'#2a8a6a',mood:'calm',mouth:'smirk'},hat:{t:'goggles',c:'#6a4a2a',g:'#8ae8b0'},bk:{t:'pack',c:'#8a6a3a'},w:W_('flask',27,-48,{c1:'#8ae8b0'}),idle:'bob',atk:'raise',fx:'drip',fxc:'#8ae8b0'},
 girasol:{arm:'#ffc040',b:{t:'armor',col:'#e88a1a',dk:'#7a3a08',l:'#ffb84a',m1:'#e8ecf4',m2:'#7a8898',gem:'#ff3a2a'},h:{t:'flower',r:21,n:16,pl:21,pw:6,ps:'point',pc:'#ffe14a',pd:'#e08a10',ring2:'#ffc02a',c:['#6a4a2a','#4a2a10','#2a1608'],face:['#ffe8b8','#f0c888','#c89858'],skin:'#ffe6b8',iris:'#ff3a2a',mood:'fierce',glow:'#ff3a2a',mouth:'grin'},hat:{t:'goggles',c:'#2a2a3a',g:'#ff6a2a'},w:W_('cannon',24,-40,{c1:'#e8ecf4',c2:'#5a6878',laser:1}),idle:'sway',atk:'recoil',fx:'sun'},
 mandragora:{arm:'#d8b888',b:{t:'slim',col:'#c8a878',dk:'#7a5a38',l:'#ead0a8',leaf:'#6ac04a',leafDk:'#2a6a1a'},h:{t:'mandra',r:23,c:['#f0d8b0','#c8a070','#7a5a30'],lc:'#5ab83a',ld:'#1e5a14',skin:'#e0c090',iris:'#ff4a2a',mood:'angry',mouth:'open'},w:W_('trumpet',26,-48,{c1:'#ffd0a0',c2:'#c86a3a'}),idle:'jitter',atk:'stomp',fx:'notes'},
 roble:{arm:'#8a6a3a',b:{t:'armor',col:'#7a5a2a',dk:'#3a2a10',l:'#a87a3a',m1:'#ffe680',m2:'#a8700a',gem:'#7aff6a'},h:{t:'trunk',r:25,c:['#c8a070','#7a5a30','#3a2a10'],lc:'#7ad04a',ld:'#2a6a1a',big:1,skin:'#b89060',iris:'#7aff6a',mood:'cold',mouth:'line',glow:'#7aff6a'},hat:{t:'crown',c:'#ffd23f'},bk:{t:'mantle',c:'#3a8a3a',c2:'#14401a'},w:W_('staff',27,-52,{gem:'#7aff6a',wood:1}),idle:'breathe',atk:'stomp',fx:'leaves',fxc:'#ffe680'},
 fenix:{arm:'#ff8a3a',b:{t:'robe',col:'#d8301a',dk:'#6a0a04',l:'#ff8a3a',trim:'#ffd23f',leaf:'#ffb02a',leafDk:'#c8400a'},h:{t:'flower',r:19,n:9,pl:28,pw:10,ps:'flame',pc:'#ffd23f',pd:'#ff3a1a',c:['#fff8c0','#ffb02a','#c8400a'],face:['#fff4d8','#ffd8a0','#f0a060'],skin:'#ffe0b0',iris:'#ff6a1a',mood:'fierce',mouth:'grin',fire:1,curl:.8,glow:'#ffb02a'},hat:{t:'crown',c:'#ffd23f'},bk:{t:'flamewings'},w:W_('staff',26,-50,{gem:'#ff6a1a'}),idle:'float',atk:'raise',fx:'flame'},
 cristal:{arm:'#c8e8ff',b:{t:'robe',col:'#a8d8ff',dk:'#3a78b8',l:'#e8f6ff',trim:'#ffffff',leaf:'#e0f4ff',leafDk:'#6aa8d8'},h:{t:'crystal',r:23,c:['#ffffff','#c8ecff','#5aa0e0'],skin:'#e8f6ff',iris:'#3a6ad8',mood:'cold',glow:'#3a6ad8',mouth:'line'},hat:{t:'tiara',c:'#ffffff',g:'#9ae8ff'},bk:{t:'petalwings',c:'#d8f4ff'},w:W_('wand',31,-46,{gem:'#e8fbff',crystal:1,a:.25}),idle:'float',atk:'raise',fx:'frost'},
 trueno:{arm:'#7a8aa8',b:{t:'armor',col:'#3a4a6a',dk:'#141c2e',l:'#5a6a8a',m1:'#ffe680',m2:'#a8700a',gem:'#28e8ff'},h:{t:'bonsai',r:21,c:['#c8d8c0','#7a9a7a','#3a5a3a'],lc:'#4a8a5a',ld:'#1a4a2a',skin:'#a8c0a0',iris:'#28e8ff',mood:'fierce',glow:'#28e8ff',mouth:'effort'},bk:{t:'cape',c:'#4a5a8a',c2:'#1a2244'},w:W_('staff',26,-52,{gem:'#28e8ff',bolt:1}),idle:'float',atk:'flash',fx:'spark'},
 eclipse:{arm:'#5a4a6a',b:{t:'armor',col:'#2a2238',dk:'#0e0a16',l:'#4a3a5a',m1:'#ffd23f',m2:'#8a5a08',gem:'#c86aff'},h:{t:'flower',r:21,n:16,pl:22,pw:6,ps:'point',pc:'#3a2a4a',pd:'#100818',ring2:'#ffd23f',c:['#ffe680','#d8a020','#7a4a08'],face:['#f0e0ff','#c8b0e0','#8a70a8'],skin:'#d8c8f0',iris:'#ff2a6a',mood:'cold',glow:'#ff2a6a',mouth:'line'},hat:{t:'halo',c:'#c86aff',dark:1},bk:{t:'cape',c:'#2a1a3a',c2:'#0a0412'},w:W_('cannon',24,-40,{c1:'#3a2a4a',c2:'#ffd23f',laser:1,long:1}),idle:'breathe',atk:'recoil',fx:'glow',fxc:'#c86aff'},
 hongo:{arm:'#f0e2c4',b:{t:'robe',col:'#b8202a',dk:'#5a080e',l:'#e8504a',trim:'#ffd23f',leaf:'#ffd23f',leafDk:'#a8700a'},h:{t:'mush',r:25,c:['#ff7a6a','#d8201a','#6a0808'],f:['#fffaf0','#f4e4c8','#c8b090'],dot:'#ffffff',skin:'#f4e4c8',iris:'#c8f05a',mood:'sly',mouth:'grin'},hat:{t:'crown',c:'#ffd23f',small:1},bk:{t:'mantle',c:'#8a1a2a',c2:'#3a0610'},w:W_('staff',27,-50,{gem:'#c8f05a'}),idle:'sway',atk:'stomp',fx:'spores',fxc:'#ffb0a0'},
 hiedra:{arm:'#3a8a3a',b:{t:'bulky',col:'#2a6a2a',dk:'#0e3010',l:'#4a9a4a',leaf:'#5ac050',leafDk:'#1a5a1a'},h:{t:'leafy',r:24,c:['#a8e08a','#4a9a3a','#1a4a14'],lc:'#3aa83a',ld:'#0e4a0e',ivy:1,skin:'#7ac060',iris:'#ffe14a',mood:'fierce',mouth:'fangs'},hat:{t:'horns',c:'#4a8a2a'},w:W_('whip',28,-44,{c1:'#3aa83a'}),idle:'breathe',atk:'lunge',fx:'vines'},
 nectar:{arm:'#ffd060',b:{t:'robe',col:'#f0b020',dk:'#8a5a08',l:'#ffe080',trim:'#ffffff'},h:{t:'flower',r:18,n:6,pl:23,pw:12,ps:'round',pc:'#ffe680',pd:'#e0a010',c:['#fff8c0','#ffc02a','#a8700a'],face:['#fffaf0','#fff0c0','#e8c880'],skin:'#fff2c0',iris:'#e08a10',mood:'happy',mouth:'open',blush:1,drip:1},hat:{t:'crown',c:'#ffd23f',small:1},bk:{t:'petalwings',c:'#fff4c0'},w:W_('can',25,-40,{honey:1}),idle:'float',atk:'raise',fx:'coins'},
 carnivora:{arm:'#6a3a8a',b:{t:'bulky',col:'#4a2a6a',dk:'#1a0a2a',l:'#7a4a9a',leaf:'#6ad06a',leafDk:'#164a1c'},h:{t:'jaw',r:34,c:['#c890f0','#7a3ab8','#2a0a4a'],in:['#ffb0d0','#e02a6a','#5a0a2a'],skin:'#9a6ac8',iris:'#ff2a2a',mood:'fierce',spot:'#c8f05a'},hat:{t:'crown',c:'#ffd23f'},w:W_('none',30,-40),idle:'breathe',atk:'lunge',fx:'drool',fxc:'#e0a0ff'},
 estrella:{arm:'#a8b8ff',b:{t:'robe',col:'#2a2a6a',dk:'#0e0e2a',l:'#4a4a9a',trim:'#fff2a0',leaf:'#a8b8ff',leafDk:'#3a3a8a'},h:{t:'flower',r:18,n:5,pl:26,pw:11,ps:'point',pc:'#fff8d0',pd:'#ffd23f',ring2:'#c8d8ff',c:['#ffffff','#e8ecff','#a8b0e0'],face:['#ffffff','#eef0ff','#b8c0e8'],skin:'#f0f4ff',iris:'#6a4aff',mood:'happy',glow:'#6a4aff',mouth:'open',blush:1},hat:{t:'wizard',c:'#3a3a8a',c2:'#14143a'},bk:{t:'mantle',c:'#2a2a6a',c2:'#08081e',stars:1},w:W_('wand',26,-50,{gem:'#fff2a0',star:1}),idle:'float',atk:'twirl',fx:'stars'}};
function petal(c,len,wid,style,col,dk,j){j=j||0;const cu=j*wid*.9,build=()=>{c.beginPath();
  if(style==='point'){c.moveTo(0,-wid);c.bezierCurveTo(len*.45,-wid*1.25,len*.8,-wid*.5+cu,len,cu);c.bezierCurveTo(len*.8,wid*.5+cu,len*.45,wid*1.25,0,wid)}
  else if(style==='flame'){c.moveTo(0,-wid);c.bezierCurveTo(len*.45,-wid*1.7,len*.72,-wid*.3+cu,len*1.02,cu*1.6);c.bezierCurveTo(len*.8,wid*.2+cu,len*.64,wid*.55,len*.52,wid*.3);c.bezierCurveTo(len*.42,wid*1.05,len*.25,wid*1.2,0,wid)}
  else if(style==='heart'){c.moveTo(0,0);c.bezierCurveTo(len*.3,-wid*1.6,len*1.1,-wid*1.2,len*.85,cu*.3);c.bezierCurveTo(len*1.1,wid*1.2,len*.3,wid*1.6,0,0)}
  else{c.moveTo(0,-wid*.8);c.bezierCurveTo(len*.5,-wid*1.45,len*1.05,-wid*.75+cu,len,cu);c.bezierCurveTo(len*1.05,wid*.75+cu,len*.5,wid*1.45,0,wid*.8)}
  c.closePath()};
 build();c.fillStyle=LG(c,0,0,len,0,[dk,col,cshift(col,.35)]);c.fill();
 c.save();build();c.clip();c.beginPath();c.moveTo(len*.12,-wid*.5);c.quadraticCurveTo(len*.6,-wid*.7,len*.95,cu*.7);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=2.2;c.stroke();
 c.beginPath();c.moveTo(len*.1,wid*.6);c.quadraticCurveTo(len*.6,wid*.75,len*.95,cu);c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=2.6;c.stroke();c.restore();
 build();c.lineWidth=1.5;c.strokeStyle=cshift(dk,-.45);c.stroke()}
function chBack(c,bk,hy){switch(bk.t){
 case 'cape':case 'mantle':{const w2=bk.t==='mantle'?33:27,yb=bk.t==='mantle'?-2:-8,build=cc=>{cc.beginPath();cc.moveTo(-15,-57);cc.bezierCurveTo(-w2-8,-40,-w2-2,-20,-w2,yb);for(let i=0;i<=6;i++){const xx=-w2+i*w2/3;cc.quadraticCurveTo(xx-w2/6,yb+(i%2?6:-1),xx,yb+(i%2?0:4))}cc.bezierCurveTo(w2+2,-20,w2+8,-40,17,-57);cc.closePath()};
  VOL(c,build,bk.c,{bb:[-w2,-57,w2,yb+5],light:cshift(bk.c,.35),dark:bk.c2,rim:3});
  if(bk.t==='mantle'){c.save();build(c);c.clip();for(const xx of [-18,-6,8,20]){c.beginPath();c.moveTo(xx*.6,-52);c.quadraticCurveTo(xx,-28,xx*1.1,yb);c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=2.4;c.stroke()}c.restore()}
  if(bk.stars)for(const [sx,sy] of [[-20,-30],[16,-20],[-8,-14],[22,-40]])star(c,sx,sy,2.6,'#fff2a0');break}
 case 'quiver':{c.save();c.translate(-15,-52);c.rotate(-.45);VOL(c,cc=>{RRp(cc,-5,-16,10,32,4)},bk.c,{bb:[-5,-16,5,16],rim:2.5});for(const dx of [-2.5,0,2.5]){c.beginPath();c.moveTo(dx,-16);c.lineTo(dx,-26);c.strokeStyle='#ddd';c.lineWidth=1.4;c.stroke();c.beginPath();c.moveTo(dx-2,-26);c.lineTo(dx,-31);c.lineTo(dx+2,-26);c.closePath();P(c,'#ff6a5a',1)}c.restore();break}
 case 'pack':{VOL(c,cc=>{RRp(cc,-31,-57,18,28,6)},bk.c,{bb:[-31,-57,-13,-29],rim:3});VOL(c,cc=>{RRp(cc,-29,-53,14,8,3)},'#ffd23f',{bb:[-29,-53,-15,-45],lw:1.2});break}
 case 'hood':{VOL(c,cc=>{E(cc,0,hy-2,30,32)},bk.c,{bb:[-30,hy-34,30,hy+30],dark:bk.c2});break}
 case 'petalwings':{c.globalAlpha=.88;for(const [a,l,j] of [[-2.55,36,.5],[-2.15,30,-.4],[-.6,36,-.5],[-1,30,.4]]){c.save();c.translate(0,-48);c.rotate(a);petal(c,l,10,'round',bk.c,'#ffffff',j);c.restore()}c.globalAlpha=1;break}
 case 'flamewings':{c.save();c.globalCompositeOperation='lighter';E(c,0,-52,50,42);c.fillStyle=RG(c,0,-52,50,['rgba(255,170,40,.55)','rgba(255,80,20,0)'],0,-52);c.fill();c.restore();
  for(const sd of [-1,1])for(const [a,l,j] of [[-.6,46,.8],[-.22,38,-.6],[.15,30,.5],[.45,22,-.4]]){c.save();c.translate(sd*6,-48);c.scale(sd*(sd<0?.9:1),1);c.rotate(-Math.PI/2-.7+a);petal(c,l,10,'flame','#ffe14a','#d8200a',j);c.restore()}break}}}
function chBody(c,B){const w=B.t==='bulky'?1.22:B.t==='slim'?.86:1,sh=2,boot=B.boot||'#a8743a',leaf=B.leaf||'#7fd04a',leafDk=B.leafDk||'#2f7a1f';
 for(const sd of [-1,1]){const k=sd<0?.9:1,lx=sd*9.5*w+(sd>0?sh*.5:0);
  VOL(c,cc=>{RRp(cc,lx-4.5*k,-25,9*k,18,4)},B.dk,{bb:[lx-5,-25,lx+5,-7],rim:3});
  VOL(c,cc=>{cc.beginPath();cc.moveTo(lx-10*k,0);cc.bezierCurveTo(lx-12*k,-11,lx-4,-15,lx+2,-14);cc.bezierCurveTo(lx+11*k,-13,lx+13*k,-5,lx+12*k,0);cc.closePath()},boot,{bb:[lx-12,-15,lx+13,0],spec:[lx-3,-10,3.2,1.5,0]})}
 if(B.t==='robe'){
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-15,-55);cc.quadraticCurveTo(sh,-61,16+sh,-55);cc.bezierCurveTo(23+sh,-40,26,-22,29,-7);for(let i=0;i<6;i++){const xx=29-i*9.66;cc.quadraticCurveTo(xx-4.8,-2+(i%2?3:-1),xx-9.66,-6+(i%2?0:1))}cc.bezierCurveTo(-26,-22,-22,-40,-15,-55);cc.closePath()},B.col,{bb:[-29,-61,29,-3],light:B.l,dark:B.dk,spec:[-9,-46,3.4,8,.3]});
  if(B.trim){c.beginPath();c.moveTo(sh,-58);c.quadraticCurveTo(sh+1.5,-30,sh*.5,-6);c.strokeStyle=B.trim;c.lineWidth=3.2;c.stroke()}}
 else{
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-16*w,-55);cc.quadraticCurveTo(sh,-61,17*w+sh,-56);cc.bezierCurveTo(22*w+sh,-48,19*w+sh,-38,14*w+sh,-31);cc.quadraticCurveTo(11*w,-24,14*w,-16);cc.quadraticCurveTo(0,-11,-14*w,-16);cc.quadraticCurveTo(-11*w,-24,-13*w,-31);cc.bezierCurveTo(-18*w,-38,-20*w,-48,-16*w,-55);cc.closePath()},B.col,{bb:[-20*w,-61,22*w,-11],light:B.l,dark:B.dk,spec:[-7*w,-48,3.4,7,.3]});
  if(B.trim){c.beginPath();c.moveTo(sh,-58);c.lineTo(sh*.6,-16);c.strokeStyle=B.trim;c.lineWidth=3;c.stroke()}}
 VOL(c,cc=>{cc.beginPath();cc.moveTo(-17*w,-31);cc.quadraticCurveTo(sh,-27,18*w+sh,-31);cc.lineTo(17*w+sh,-24);cc.quadraticCurveTo(sh,-20,-16*w,-24);cc.closePath()},'#6a4222',{bb:[-17*w,-31,18*w,-21],rim:2.5});
 VOL(c,cc=>{RRp(cc,sh-5.5,-32,11,10,2.5)},'#f0b020',{bb:[sh-5.5,-32,sh+5.5,-22],spec:[sh-2,-29,2,1.2,0],lw:1.2});
 if(B.t==='armor'){const m1=B.m1||'#d8dce8',m2=B.m2||'#6a7488';
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-11+sh,-55);cc.lineTo(12+sh,-55);cc.lineTo(13+sh,-41);cc.quadraticCurveTo(sh+1,-32,-11+sh,-41);cc.closePath()},cshift(m1,-.12),{bb:[-11+sh,-55,13+sh,-33],light:'#ffffff',dark:m2,spec:[-5+sh,-51,3,1.6,0]});
  c.beginPath();c.moveTo(sh+1,-54);c.lineTo(sh+1,-37);c.strokeStyle=cshift(m2,-.3);c.lineWidth=1.2;c.stroke();
  if(B.gem){AO(c,sh+1,-43,6,5,.4);VOL(c,cc=>{E(cc,sh+1,-44,4.2,4.2)},B.gem,{bb:[sh-3.2,-48.2,sh+5.2,-39.8],light:'#ffffff',spec:[sh-.6,-45.6,1.5,1,0],lw:1.2});c.save();c.globalCompositeOperation='lighter';E(c,sh+1,-44,9,9);c.fillStyle=RG(c,sh+1,-44,9,[B.gem+'99',B.gem+'00'],sh+1,-44);c.fill();c.restore()}
  for(const sd of [-1,1]){const k=sd<0?.86:1,px=sd*(18*w)+(sd>0?sh:0);
   VOL(c,cc=>{cc.beginPath();cc.moveTo(px-sd*7*k,-59);cc.bezierCurveTo(px+sd*6*k,-63,px+sd*14*k,-56,px+sd*12*k,-46);cc.quadraticCurveTo(px+sd*3,-42,px-sd*7*k,-47);cc.closePath()},cshift(m1,-.08),{bb:[px-11,-63,px+13,-42],light:'#ffffff',dark:m2,spec:[px+sd*2-2,-58,3,1.3,0]});
   for(const rv of [0,1]){E(c,px+sd*(2+rv*5)*k,-50+rv,1.3,1.3);c.fillStyle=cshift(m2,-.35);c.fill()}}}
 else if(B.leaves!==false){leafHQ(c,-13*w,-53,15,-2.5,leaf,leafDk);leafHQ(c,13*w+sh,-53,17,-.64,leaf,leafDk)}}
function chHead(c,H,hy){const r=H.r||22,G3=H.c;
 switch(H.t){
 case 'round':{E(c,0,hy,r,r*1.1);P(c,RG(c,0,hy,r*1.2,G3),3.2);
  if(H.veins){c.save();E(c,0,hy,r,r*1.1);c.clip();c.strokeStyle='rgba(20,60,10,.32)';c.lineWidth=2;for(const xx of [-.62,-.22,.22,.62]){c.beginPath();c.moveTo(xx*r,hy-r*1.3);c.quadraticCurveTo(xx*r*1.3,hy,xx*r,hy+r*1.3);c.stroke()}c.restore()}
  if(H.spikes)for(let i=0;i<9;i++){const a=-Math.PI+.3+i*(Math.PI-.6)/8,px=Math.cos(a)*r,py=hy+Math.sin(a)*r*1.1;c.beginPath();c.moveTo(px-2.6,py);c.lineTo(px+Math.cos(a)*10,py+Math.sin(a)*10);c.lineTo(px+2.6,py+1);c.closePath();P(c,'#fffbe0',1.4)}
  shine(c,-r*.4,hy-r*.62,r*.26,r*.16,-.5,.4);return{top:hy-r*1.1-(H.spikes?9:0),fy:hy,fr:r}}
 case 'bud':c.beginPath();c.moveTo(0,hy-r*1.95);c.bezierCurveTo(r*.7,hy-r*1.1,r*1.05,hy-r*.45,r,hy);c.arc(0,hy,r,0,Math.PI);c.bezierCurveTo(-r*1.05,hy-r*.45,-r*.7,hy-r*1.1,0,hy-r*1.95);P(c,RG(c,-4,hy-6,r*1.4,G3,-10,hy-18),3.2);shine(c,-r*.45,hy-r*.75,r*.18,r*.45,.35,.7);return{top:hy-r*1.95,fy:hy,fr:r};
 case 'flower':{const R0=r*.9;
  if(H.fire){c.save();c.globalCompositeOperation='lighter';E(c,0,hy,r*2.4,r*2.4);c.fillStyle=RG(c,0,hy,r*2.4,['rgba(255,200,70,.6)','rgba(255,90,20,.28)','rgba(255,40,0,0)'],0,hy);c.fill();c.restore()}
  for(let ring=0;ring<(H.ring2?2:1);ring++)for(let i=0;i<H.n;i++){const jt=((i*37+ring*11)%7-3)/3,a=i/H.n*Math.PI*2-Math.PI/2+ring*Math.PI/H.n+jt*.05;c.save();c.translate(Math.cos(a)*R0*.85,hy+Math.sin(a)*R0*.85);c.rotate(a);petal(c,H.pl*(ring?.78:1)*(1+jt*.07),H.pw*(ring?.85:1),H.ps,ring?H.ring2:H.pc,H.pd,jt*(H.curl||.5));c.restore()}
  if(H.fire)for(let i=0;i<H.n;i++){const a=i/H.n*Math.PI*2-Math.PI/2+Math.PI/H.n;c.save();c.translate(Math.cos(a)*R0*.7,hy+Math.sin(a)*R0*.7);c.rotate(a);petal(c,H.pl*.55,H.pw*.6,'flame','#fff6b0','#ff8a1a',((i*13)%5-2)/2);c.restore()}
  VOL(c,cc=>{E(cc,0,hy,r,r)},G3[1],{bb:[-r,hy-r,r,hy+r],light:G3[0],dark:G3[2]});
  if(H.face){AO(c,0,hy+2,r*.88,r*.88,.35);VOL(c,cc=>{E(cc,0,hy+1,r*.8,r*.8)},H.face[1],{bb:[-r*.8,hy-r*.79,r*.8,hy+r*.81],light:H.face[0],dark:H.face[2],spec:[-r*.36,hy-r*.42,r*.15,r*.09]})}
  if(H.drip)for(const [dx,dl] of [[-r*.6,8],[r*.5,11]]){c.beginPath();c.moveTo(dx-3,hy+r*.75);c.quadraticCurveTo(dx,hy+r*.75+dl*2,dx+3,hy+r*.75);P(c,'#ffc02a',1.4)}
  return{top:hy-R0*.85-H.pl,fy:hy,fr:H.face?r*.8:r}}
 case 'mush':E(c,0,hy+6,r*.8,r*.88);P(c,RG(c,0,hy+6,r*.9,H.f),3);
  c.beginPath();c.moveTo(-r*1.6,hy-4);c.bezierCurveTo(-r*1.6,hy-r*2.2,r*1.6,hy-r*2.2,r*1.6,hy-4);c.quadraticCurveTo(0,hy+r*.3,-r*1.6,hy-4);P(c,RG(c,-r*.3,hy-r*1.2,r*1.8,G3,-r*.6,hy-r*1.6),3.2);
  for(const [sx,sy,s2] of [[-.9,-.55,.22],[-.2,-1.12,.28],[.62,-.8,.22],[1.1,-.32,.15],[-1.25,-.2,.13]]){E(c,sx*r,hy+sy*r,s2*r,s2*r*.8);P(c,H.dot,1.6)}
  shine(c,-r*.6,hy-r*1.25,r*.38,r*.12,-.4,.45);return{top:hy-r*1.65,fy:hy+7,fr:r*.82};
 case 'cactus':{E(c,0,hy,r*.9,r*1.18);P(c,RG(c,0,hy,r*1.2,G3),3.2);c.save();E(c,0,hy,r*.9,r*1.18);c.clip();c.strokeStyle='rgba(20,60,10,.35)';c.lineWidth=2.2;for(const xx of [-.62,.62]){c.beginPath();c.moveTo(xx*r,hy-r*1.3);c.quadraticCurveTo(xx*r*1.2,hy,xx*r,hy+r*1.3);c.stroke()}c.restore();
  c.strokeStyle='#fffbe0';c.lineWidth=1.4;for(let i=0;i<16;i++){const a=i/16*Math.PI*2,px=Math.cos(a)*r*.9,py=hy+Math.sin(a)*r*1.18;c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(a)*6,py+Math.sin(a)*6);c.stroke()}
  for(let i=0;i<5;i++){c.save();c.translate(0,hy-r*1.18);c.rotate(i/5*Math.PI*2);petal(c,9,4,'round',H.fl,'#c0407a');c.restore()}E(c,0,hy-r*1.18,3,3);P(c,'#ffe14a',1.2);return{top:hy-r*1.18-9,fy:hy+2,fr:r*.86}}
 case 'pumpkin':for(const [dx,w] of [[-.62,.62],[.62,.62],[0,.7]]){E(c,dx*r,hy,w*r,r*.9);P(c,RG(c,dx*r,hy,r,G3,dx*r-6,hy-10),2.8)}
  RRp(c,-3,hy-r*.9-10,6,12,2);P(c,'#4a7a2a',2);c.beginPath();c.moveTo(3,hy-r*.9-4);c.bezierCurveTo(14,hy-r*.9-14,18,hy-r*.9,10,hy-r*.9+2);c.strokeStyle='#4a8a2a';c.lineWidth=2;c.stroke();return{top:hy-r*.9-10,fy:hy+2,fr:r*.85};
 case 'pod':{const k=r/24;c.beginPath();c.moveTo(-18*k,hy+14*k);c.bezierCurveTo(-26*k,hy-20*k,-8*k,hy-38*k,6*k,hy-40*k);c.bezierCurveTo(24*k,hy-28*k,26*k,hy-4*k,18*k,hy+18*k);c.quadraticCurveTo(0,hy+28*k,-18*k,hy+14*k);P(c,RG(c,-2*k,hy-10*k,34*k,G3,-10*k,hy-24*k),3.2);
  shine(c,-11*k,hy-16*k,3.6,12,.25,.55);c.beginPath();for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI/3+.2,q=i%2?7:14;c.lineTo(4*k+Math.cos(a)*q*1.3,hy-38*k+Math.sin(a)*q*.55)}c.closePath();P(c,LG(c,0,hy-46*k,0,hy-30*k,['#9be06a','#3c8a2a']),2.4);
  c.beginPath();c.moveTo(4*k,hy-42*k);c.quadraticCurveTo(8*k,hy-52*k,16*k,hy-52*k);c.strokeStyle=OL;c.lineWidth=6;c.stroke();c.strokeStyle='#4a9a32';c.lineWidth=3.5;c.stroke();return{top:hy-52*k,fy:hy-4*k,fr:r*.85}}
 case 'leafy':if(H.fern){for(let i=0;i<7;i++)leafHQ(c,0,hy-r*.6,r*1.25,-2.6+i*.36,H.lc,H.ld)}else if(H.ivy){for(const [x0,a,l] of [[-12,-2.5,24],[13,-.7,24],[-4,-1.9,28],[6,-1.25,28],[0,-1.57,32]])leafHQ(c,x0,hy-r*.7,l,a,H.lc,H.ld)}else{for(const [a,l] of [[-2.3,24],[-.85,24],[-1.57,30]])leafHQ(c,0,hy-r*.75,l,a,H.lc,H.ld)}
  E(c,0,hy,r,r*1.05);P(c,RG(c,0,hy,r*1.15,G3),3.2);shine(c,-r*.4,hy-r*.55,r*.24,r*.14,-.5,.45);return{top:hy-r-26,fy:hy,fr:r};
 case 'crystal':{const pts=[[0,-1.3],[.55,-.95],[.92,-.42],[1,.08],[.72,.72],[.18,1.05],[-.4,.95],[-.82,.6],[-1,.02],[-.78,-.62],[-.35,-1.08]],cx0=r*.08,cy0=hy-r*.12;
  pts.forEach((p,i)=>{const q=pts[(i+1)%pts.length],lum=Math.cos(Math.atan2((p[1]+q[1])/2,(p[0]+q[0])/2)+2.4)*.5;c.beginPath();c.moveTo(cx0,cy0);c.lineTo(p[0]*r,hy+p[1]*r);c.lineTo(q[0]*r,hy+q[1]*r);c.closePath();c.fillStyle=cshift(G3[1],lum*.8);c.fill();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=.9;c.stroke()});
  c.beginPath();pts.forEach(([px,py],i)=>i?c.lineTo(px*r,hy+py*r):c.moveTo(px*r,hy+py*r));c.closePath();c.strokeStyle=cshift(G3[2],-.4);c.lineWidth=1.6;c.stroke();
  VOL(c,cc=>{E(cc,0,hy+3,r*.64,r*.6)},'#eef8ff',{bb:[-r*.64,hy-r*.57,r*.64,hy+r*.63],spec:[-r*.25,hy-r*.25,r*.12,r*.07]});
  for(const [sx,sy] of [[-.5,-.8],[.55,-.55]])star(c,sx*r,hy+sy*r,3,'#ffffff');return{top:hy-r*1.3,fy:hy+3,fr:r*.66}}
 case 'jaw':{const k=r/30;c.save();c.translate(0,hy+6);c.scale(k,k);
  c.beginPath();c.moveTo(-30,0);c.quadraticCurveTo(0,26,30,0);c.quadraticCurveTo(0,8,-30,0);P(c,LG(c,0,0,0,18,[G3[1],G3[2]]),3);
  c.beginPath();c.moveTo(-28,-2);c.quadraticCurveTo(0,12,28,-2);c.quadraticCurveTo(0,-24,-28,-2);P(c,RG(c,0,-4,26,H.in,0,0),2.4);
  for(let i=-4;i<=4;i++){const x=i*6,yb=-2+(16-Math.abs(i)*3.2)*.9;c.beginPath();c.moveTo(x-2.8,yb-2);c.lineTo(x,yb-9);c.lineTo(x+2.8,yb-2);c.closePath();P(c,'#ffffff',1.3)}
  c.beginPath();c.moveTo(-32,-6);c.bezierCurveTo(-30,-44,30,-44,32,-6);c.quadraticCurveTo(0,-18,-32,-6);P(c,RG(c,-4,-24,36,G3,-12,-36),3.2);
  for(let i=-4;i<=4;i++){const x=i*6.5,yt=-8-(4-Math.abs(i))*1.44;c.beginPath();c.moveTo(x-2.8,yt);c.lineTo(x,yt+9);c.lineTo(x+2.8,yt);c.closePath();P(c,'#ffffff',1.3)}
  for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*28,-12);c.lineTo(sd*38,-16);c.lineTo(sd*30,-8);P(c,'#ffe0a0',1.4)}
  if(H.spot)for(const [sx,sy] of [[-16,-30],[10,-34],[20,-22]]){E(c,sx,sy,3,2.4);c.fillStyle=H.spot;c.fill()}
  shine(c,-12,-32,8,3,-.3,.4);eyesHQ(c,0,-26,10,6,6.6,H.iris,H.mood,H.skin);c.restore();return{top:hy+6-44*k,fy:hy-20*k,fr:r*.8,noFace:1}}
 case 'acorn':E(c,0,hy+5,r*.92,r*1.02);P(c,RG(c,0,hy+5,r*1.05,G3),3);shine(c,-r*.45,hy+2,r*.16,r*.32,.2,.4);
  c.beginPath();c.moveTo(-r*1.08,hy-r*.3);c.bezierCurveTo(-r*1.1,hy-r*1.35,r*1.1,hy-r*1.35,r*1.08,hy-r*.3);c.quadraticCurveTo(0,hy-r*.12,-r*1.08,hy-r*.3);P(c,LG(c,0,hy-r*1.2,0,hy-r*.2,H.cap),3);
  c.save();c.clip();c.strokeStyle='rgba(30,15,5,.45)';c.lineWidth=1.3;for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(i*5-12,hy-r*1.3);c.lineTo(i*5+12,hy-r*.1);c.moveTo(i*5+12,hy-r*1.3);c.lineTo(i*5-12,hy-r*.1);c.stroke()}c.restore();
  RRp(c,-2.5,hy-r*1.28-7,5,9,2);P(c,'#5a3a1a',1.6);return{top:hy-r*1.28-7,fy:hy+7,fr:r*.84};
 case 'puff':c.lineCap='round';for(let i=0;i<26;i++){const a=i/26*Math.PI*2,l=r*1.45+(i%3)*3;c.beginPath();c.moveTo(Math.cos(a)*r*.5,hy+Math.sin(a)*r*.5);c.lineTo(Math.cos(a)*l,hy+Math.sin(a)*l);c.strokeStyle='rgba(120,120,110,.55)';c.lineWidth=1.2;c.stroke();E(c,Math.cos(a)*l,hy+Math.sin(a)*l,3.4,3.4);c.fillStyle='rgba(255,255,250,.95)';c.fill()}
  E(c,0,hy,r*1.25,r*1.25);c.fillStyle='rgba(255,255,255,.3)';c.fill();E(c,0,hy,r*.7,r*.7);P(c,RG(c,0,hy,r*.72,H.face),2.4);return{top:hy-r*1.55,fy:hy,fr:r*.7};
 case 'lavender':c.beginPath();c.moveTo(0,hy-r*.9);c.lineTo(0,hy-r*1.05-44);c.strokeStyle='#4a7a3a';c.lineWidth=2;c.stroke();
  for(let i=0;i<9;i++){const yy=hy-r*1.05-i*5,w2=r*.55*(1-i/11);for(const sd of [-1,0,1]){E(c,sd*w2*.6,yy,3.6,3.2);P(c,(i+sd)%2?H.fl:'#c8a8ff',1)}}
  E(c,0,hy,r*.88,r*1.02);P(c,RG(c,0,hy,r*1.05,G3),3);return{top:hy-r*1.05-46,fy:hy,fr:r*.86};
 case 'burr':c.lineCap='round';for(let i=0;i<22;i++){const a=i/22*Math.PI*2,x1=Math.cos(a)*r*.9,y1=hy+Math.sin(a)*r*.9,x2=Math.cos(a)*r*1.42,y2=hy+Math.sin(a)*r*1.42;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.lineTo(x2+Math.cos(a+1.6)*4,y2+Math.sin(a+1.6)*4);c.lineWidth=3;c.strokeStyle=OL;c.stroke();c.lineWidth=1.5;c.strokeStyle=G3[0];c.stroke()}
  E(c,0,hy,r,r);P(c,RG(c,0,hy,r*1.05,G3),3.2);return{top:hy-r*1.45,fy:hy+1,fr:r*.9};
 case 'berry':{for(const [a,l] of [[-2.2,14],[-.9,14],[-1.57,16]])leafHQ(c,0,hy-r*.95,l,a,'#5ab83a','#1e5a14');E(c,0,hy,r*1.02,r*1.05);P(c,G3[2],3);
  const pts=[[0,hy]];for(let ring=1;ring<3;ring++)for(let i=0;i<ring*6;i++){const a=i/(ring*6)*Math.PI*2+ring*.4;pts.push([Math.cos(a)*r*.36*ring,hy+Math.sin(a)*r*.38*ring])}
  pts.sort((p,q)=>p[1]-q[1]).forEach(([px,py])=>{E(c,px,py,r*.3,r*.3);c.fillStyle=RG(c,px,py,r*.3,G3,px-2,py-3);c.fill();E(c,px-r*.08,py-r*.1,r*.07,r*.06);c.fillStyle='rgba(255,255,255,.7)';c.fill()});
  return{top:hy-r-14,fy:hy+2,fr:r*.9}}
 case 'bamboo':for(const [x0,a] of [[-6,-2],[6,-1.1]])leafHQ(c,x0,hy-r*1.15,18,a,'#7ac03a','#2a6a1a');RRp(c,-r*.82,hy-r*1.2,r*1.64,r*2.2,r*.45);P(c,LG(c,-r,0,r,0,[G3[2],G3[0],G3[1],G3[2]]),3);
  for(const yy of [hy-r*.66,hy+r*.66]){c.beginPath();c.moveTo(-r*.82,yy);c.quadraticCurveTo(0,yy+4,r*.82,yy);c.strokeStyle='rgba(30,70,10,.55)';c.lineWidth=2.4;c.stroke()}shine(c,-r*.5,hy-r*.2,r*.1,r*.55,0,.35);return{top:hy-r*1.2-14,fy:hy,fr:r*.8};
 case 'trunk':{const big=H.big?1.3:1;
  for(const [cx2,cy2,cr] of [[-r*.95,-r*1.45,r*.6],[r*.95,-r*1.38,r*.58],[-r*.55,-r*1.8,r*.46],[r*.6,-r*1.82,r*.44],[0,-r*1.95,r*.66],[-r*.45,-r*1.12,r*.5],[r*.5,-r*1.08,r*.5]]){const X=cx2*big,Y=hy+cy2,RR=cr*big;
   VOL(c,cc=>{const n=8,P=(an,q)=>[X+Math.cos(an)*RR*q,Y+Math.sin(an)*RR*q*.88];cc.beginPath();cc.moveTo(...P(0,.8));for(let i=0;i<n;i++){const a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2,qq=1.22+((i*5+Math.round(X))%3)*.05;cc.bezierCurveTo(...P(a0+.12,qq),...P(a1-.12,qq),...P(a1,.8))}cc.closePath()},H.lc,{bb:[X-RR,Y-RR,X+RR,Y+RR],dark:H.ld,spec:[X-RR*.35,Y-RR*.42,RR*.22,RR*.12]});
   for(let i=0;i<3;i++){const a=i*2.1+cx2*.05-1.2;leafHQ(c,X+Math.cos(a)*RR*.75,Y+Math.sin(a)*RR*.62,RR*.55,a,cshift(H.lc,.2),H.ld)}}
  const bark=cc=>{cc.beginPath();cc.moveTo(-r*1.02,hy-r*.9);cc.bezierCurveTo(-r*1.1,hy-r*1.18,r*1.05,hy-r*1.22,r*1.02,hy-r*.88);cc.bezierCurveTo(r*1.13,hy,r*1.1,hy+r*.6,r*.92,hy+r*.95);cc.quadraticCurveTo(0,hy+r*1.1,-r*.95,hy+r*.95);cc.bezierCurveTo(-r*1.13,hy+r*.5,-r*1.1,hy,-r*1.02,hy-r*.9);cc.closePath()};
  VOL(c,bark,G3[1],{bb:[-r*1.1,hy-r*1.2,r*1.1,hy+r*1.05],light:G3[0],dark:G3[2],spec:[-r*.6,hy-r*.65,r*.12,r*.32,.2]});
  c.save();bark(c);c.clip();c.lineCap='round';
  for(const [xx,ph] of [[-.88,0],[-.7,1],[.7,2],[.9,3]]){c.beginPath();c.moveTo(xx*r,hy-r*.95);c.bezierCurveTo(xx*r+3*Math.sin(ph+1),hy-r*.3,xx*r-3,hy+r*.3,xx*r*.95,hy+r*1);c.strokeStyle=cshift(G3[2],-.25);c.lineWidth=1.8;c.stroke();
   c.beginPath();c.moveTo(xx*r+1.4,hy-r*.9);c.bezierCurveTo(xx*r+4.4,hy-r*.3,xx*r-1.6,hy+r*.3,xx*r*.95+1.4,hy+r*.95);c.strokeStyle='rgba(255,230,190,.3)';c.lineWidth=.9;c.stroke()}
  for(const [y0,x0,x1] of [[hy-r*.95,-.6,.6],[hy+r*.92,-.55,.5]]){c.beginPath();c.moveTo(x0*r,y0);c.quadraticCurveTo(0,y0+(y0<hy?3:-3),x1*r,y0);c.strokeStyle=cshift(G3[2],-.2);c.lineWidth=1.4;c.stroke()}
  c.restore();
  AO(c,-r*.66,hy+r*.6,r*.17,r*.13,.6);E(c,-r*.66,hy+r*.6,r*.1,r*.07);c.fillStyle=cshift(G3[2],-.55);c.fill();
  for(const [mx,my] of [[r*.72,hy-r*.8],[-r*.88,hy-r*.55],[r*.9,hy+r*.35]])for(let i=0;i<5;i++){E(c,mx+Math.cos(i*1.3)*3.4,my+Math.sin(i*1.3)*2.2,2.4,1.9);c.fillStyle=['#8ad05a','#5aa83a','#a8e070'][i%3];c.fill()}
  for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*r*.5,hy+r*.95);c.quadraticCurveTo(sd*r*.68,hy+r*1.12,sd*r*.82,hy+r*1.25);c.strokeStyle=OL;c.lineWidth=4.4;c.stroke();c.strokeStyle=G3[2];c.lineWidth=2.6;c.stroke()}
  return{top:hy-r*1.95-r*.66*big,fy:hy+2,fr:r*.85}}
 case 'thistle':{c.lineCap='round';
  for(let i=0;i<19;i++){const a=-Math.PI*.5+(i-9)*.12+Math.sin(i*2.7)*.05,l=r*(.95+((i*29)%7)/14),bend=Math.sin(i*1.9)*6,y0=hy-r*.8,x1=Math.cos(a)*l,y1=y0+Math.sin(a)*l*1.1;
   c.beginPath();c.moveTo(0,y0);c.quadraticCurveTo(x1*.5+bend,(y0+y1)/2,x1,y1);c.strokeStyle=OL;c.lineWidth=4.4;c.stroke();c.strokeStyle=LG(c,0,y0,x1,y1,[cshift(H.fl,-.35),H.fl,cshift(H.fl,.6)]);c.lineWidth=2.7;c.stroke()}
  c.save();c.globalCompositeOperation='lighter';E(c,0,hy-r*1.45,r*.9,r*.6);c.fillStyle=RG(c,0,hy-r*1.45,r*.9,['rgba(190,120,255,.45)','rgba(190,120,255,0)'],0,hy-r*1.45);c.fill();c.restore();
  VOL(c,cc=>{E(cc,0,hy+2,r*.93,r*.97)},G3[1],{bb:[-r*.93,hy-r*.95,r*.93,hy+r],light:G3[0],dark:G3[2],spec:[-r*.42,hy-r*.45,r*.18,r*.1]});
  for(let row=0;row<4;row++)for(let i=0;i<6;i++){const bx=(i-2.5)*r*.3+(row%2)*r*.13,by=hy-r*.62+row*r*.36;if(Math.hypot(bx/(r*.8),(by-hy)/(r*.85))>1)continue;if(Math.abs(bx)<r*.62&&by>hy-r*.38&&by<hy+r*.6)continue;
   c.beginPath();c.moveTo(bx-r*.14,by+r*.11);c.quadraticCurveTo(bx,by-r*.17,bx+r*.14,by+r*.11);c.quadraticCurveTo(bx,by+r*.02,bx-r*.14,by+r*.11);c.fillStyle='rgba(20,70,15,.35)';c.fill()}
  for(let i=0;i<15;i++){const sd=i%2?1:-1,a=Math.PI*.1+((i*7)%15)/15*Math.PI*.8,len=4+((i*17)%5)*1.7,px=sd*Math.cos(a)*r*.92,py=hy+2+Math.sin(a)*r*.96-r*.25,aa=sd>0?a-.6:Math.PI-a+.6;
   c.beginPath();c.moveTo(px-1.3,py);c.lineTo(px+Math.cos(aa)*len,py+Math.sin(aa)*len);c.lineTo(px+1.3,py+1);c.closePath();c.fillStyle='#f6fae4';c.fill();c.strokeStyle='rgba(60,70,30,.6)';c.lineWidth=.8;c.stroke()}
  return{top:hy-r*2.05,fy:hy+2,fr:r*.88}}
 case 'aloe':for(let i=0;i<7;i++){c.save();c.translate(0,hy+2);c.rotate(-Math.PI/2+(i-3)*.42);petal(c,r*1.9,r*.32,'point',H.lc,H.ld);c.restore()}
  E(c,0,hy,r*.85,r*.85);P(c,RG(c,0,hy,r*.9,G3),3);return{top:hy-r*1.9,fy:hy,fr:r*.82};
 case 'mandra':for(const [a,l] of [[-2.1,22],[-1.05,22],[-1.57,28]])leafHQ(c,0,hy-r*1.05,l,a,H.lc,H.ld);
  c.beginPath();c.moveTo(0,hy-r*1.1);c.bezierCurveTo(r*1.25,hy-r*1.1,r*1.15,hy+r*.6,0,hy+r*1.05);c.bezierCurveTo(-r*1.15,hy+r*.6,-r*1.25,hy-r*1.1,0,hy-r*1.1);P(c,RG(c,0,hy-4,r*1.2,G3),3.2);
  c.strokeStyle='rgba(90,60,30,.55)';c.lineWidth=1.3;for(const [x0,y0,x1,y1] of [[-r*.75,hy-r*.25,-r*1,hy-r*.1],[r*.78,hy+r*.1,r*1.02,hy+r*.25],[-r*.4,hy+r*.8,-r*.6,hy+r*.98]]){c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke()}
  return{top:hy-r*1.05-28,fy:hy-2,fr:r*.9};
 case 'bonsai':c.beginPath();c.moveTo(-2,hy-r*.9);c.bezierCurveTo(-10,hy-r*1.3,8,hy-r*1.5,2,hy-r*1.9);c.strokeStyle=OL;c.lineWidth=6;c.stroke();c.strokeStyle='#6a4a2a';c.lineWidth=3.6;c.stroke();
  for(const [x0,y0,cr] of [[-12,-1.85,9],[10,-2.05,10],[0,-2.3,9],[-2,-1.65,7]]){E(c,x0,hy+y0*r,cr*1.25,cr*.8);P(c,RG(c,x0,hy+y0*r,cr*1.2,[H.lc,H.ld]),2)}
  E(c,0,hy,r,r*1.02);P(c,RG(c,0,hy,r*1.1,G3),3.2);return{top:hy-r*2.3-8,fy:hy,fr:r}}
 E(c,0,hy,r,r);P(c,RG(c,0,hy,r,G3||['#fff','#ccc','#888']),3);return{top:hy-r,fy:hy,fr:r}}
function chFace(c,H,I){if(I.noFace)return;const fr=I.fr,fy=I.fy,sh=2.5;
 AO(c,sh,fy+fr*.66,fr*.62,fr*.18,.16);
 eyesHQ(c,sh,fy-fr*.08,fr*.4,fr*.27,fr*.31,H.iris,H.mood,H.skin,H.glow);
 if(H.blush)blush(c,sh,fy+fr*.38,fr*.6);
 mouthHQ(c,sh+1.5,fy+fr*.52,H.mouth||'line',fr*.3)}
function chHat(c,h,I){const top=I.top,fr=I.fr,fy=I.fy;
 switch(h.t){
 case 'band':{const y0=fy-fr*.62;for(const [dx,dy] of [[11,7],[15,1]]){c.beginPath();c.moveTo(-fr*.95,y0);c.lineTo(-fr*.95-dx,y0+dy);c.lineTo(-fr*.95-dx+4,y0+dy+4);c.closePath();P(c,h.c,1.6)}RRp(c,-fr*1.02,y0-4,fr*2.04,8,3);P(c,h.c,2);break}
 case 'tiara':{const y0=fy-fr*.92;c.beginPath();c.moveTo(-fr*.62,y0+4);c.lineTo(-fr*.36,y0-3);c.lineTo(-fr*.16,y0+2);c.lineTo(0,y0-9);c.lineTo(fr*.16,y0+2);c.lineTo(fr*.36,y0-3);c.lineTo(fr*.62,y0+4);c.quadraticCurveTo(0,y0,-fr*.62,y0+4);P(c,LG(c,0,y0-9,0,y0+4,[h.c,'#9ab0c8']),1.8);E(c,0,y0-2,2.6,2.6);P(c,h.g,1.2);break}
 case 'goggles':{const y0=fy-fr*.6;AO(c,0,y0+fr*.16,fr*.95,fr*.14,.35);
  VOL(c,cc=>{RRp(cc,-fr*1.05,y0-3.2,fr*2.1,6.4,3)},h.c,{bb:[-fr*1.05,y0-3.2,fr*1.05,y0+3.2],rim:2,lw:1.2});
  for(const sd of [-1,1]){const gx=sd*fr*.4+(sd>0?1:0),k=sd<0?.9:1;
   VOL(c,cc=>{E(cc,gx,y0,fr*.3*k,fr*.27)},'#7a7a88',{bb:[gx-fr*.3,y0-fr*.27,gx+fr*.3,y0+fr*.27],light:'#eceef4',dark:'#2a2a34',lw:1.4});
   E(c,gx,y0,fr*.21*k,fr*.19);c.fillStyle=RG(c,gx,y0,fr*.21,['#ffffff',h.g,cshift(h.g,-.6)],gx-fr*.07,y0-fr*.07);c.fill();
   c.beginPath();c.moveTo(gx-fr*.13,y0-fr*.02);c.lineTo(gx-fr*.03,y0-fr*.15);c.lineTo(gx+fr*.04,y0-fr*.11);c.lineTo(gx-fr*.08,y0+fr*.02);c.closePath();c.fillStyle='rgba(255,255,255,.92)';c.fill();E(c,gx+fr*.1,y0+fr*.08,1.3,1);c.fill()}break}
 case 'leafcap':{c.save();c.translate(-fr*.12,fy-fr*.9);c.rotate(-.18);c.beginPath();c.ellipse(0,0,fr*1.1,fr*.42,0,Math.PI,0);c.quadraticCurveTo(0,fr*.12,-fr*1.1,0);P(c,LG(c,0,-fr*.4,0,fr*.1,[h.c,h.c2]),2.4);c.beginPath();c.moveTo(-fr*.9,-2);c.quadraticCurveTo(0,-fr*.32,fr*.95,-2);c.strokeStyle=h.c2;c.lineWidth=1.4;c.stroke();RRp(c,-2,-fr*.5,4,7,2);P(c,h.c2,1.4);c.restore();break}
 case 'halo':{const y0=top-8;E(c,0,y0,fr*.85,fr*.22);c.strokeStyle=OL;c.lineWidth=5.5;c.stroke();c.strokeStyle=h.c;c.lineWidth=3;c.stroke();if(h.dark){E(c,0,y0,fr*.6,fr*.14);c.strokeStyle='rgba(20,0,30,.7)';c.lineWidth=2;c.stroke()}break}
 case 'tophat':{const y0=fy-fr*.82;RRp(c,-fr*.6,y0-30,fr*1.2,30,3);P(c,LG(c,-fr,0,fr,0,[h.c,'#0e2a0e']),2.4);E(c,0,y0,fr*1.08,6);P(c,h.c,2.2);RRp(c,-fr*.6,y0-9,fr*1.2,6,1);P(c,h.c2,1.4);
  for(let i=0;i<4;i++){c.save();c.translate(fr*.3,y0-6);c.rotate(i*Math.PI/2);petal(c,6,3.4,'heart','#6ad05a','#2a7a2a');c.restore()}break}
 case 'helmet':{const cy=fy-fr*.25;c.beginPath();c.arc(0,cy,fr*1.12,Math.PI*1.1,Math.PI*1.9);c.closePath();P(c,LG(c,0,cy-fr*1.12,0,cy,[h.c,h.c2]),2.6);RRp(c,-fr*.98,cy-fr*.42,fr*1.96,5,2);P(c,h.c2,1.6);shine(c,-fr*.38,cy-fr*.85,fr*.24,fr*.08,-.3,.6);break}
 case 'wizard':{const y0=fy-fr*.8;c.beginPath();c.moveTo(-fr*1.05,y0);c.quadraticCurveTo(-fr*.25,y0-36,fr*.55,y0-58);c.quadraticCurveTo(fr*.2,y0-24,fr*1.05,y0);c.closePath();P(c,LG(c,-fr,y0-50,fr,y0,[h.c,h.c2]),2.6);E(c,0,y0,fr*1.35,6);P(c,h.c2,2.2);RRp(c,-fr*.95,y0-8,fr*1.9,5,2);P(c,'#ffd23f',1.2);
  for(const [sx,sy] of [[-.3,-20],[.25,-34],[-.05,-12]])star(c,sx*fr,y0+sy,3.4,'#fff2a0');break}
 case 'crown':{const y0=fy-fr*.86,w2=fr*(h.small?.55:.82),hh=h.small?9:15;AO(c,0,y0+2,w2*1.12,5.5,.55);
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-w2,y0+1);cc.lineTo(-w2*1.1,y0-hh);cc.quadraticCurveTo(-w2*.75,y0-hh*.5,-w2/2,y0-hh*.62);cc.lineTo(0,y0-hh*1.28);cc.lineTo(w2/2,y0-hh*.62);cc.quadraticCurveTo(w2*.75,y0-hh*.5,w2*1.1,y0-hh);cc.lineTo(w2,y0+1);cc.quadraticCurveTo(0,y0+4.5,-w2,y0+1);cc.closePath()},h.c,{bb:[-w2*1.1,y0-hh*1.28,w2*1.1,y0+4.5],light:'#fffbe0',dark:'#a0580a',spec:[-w2*.5,y0-hh*.45,2.2,4.2,.2],lw:1.3});
  for(const [px,py] of [[-w2*1.1,y0-hh],[0,y0-hh*1.28],[w2*1.1,y0-hh]]){E(c,px,py-1.6,2.4,2.4);c.fillStyle=RG(c,px,py-1.6,2.4,['#ffffff','#ffe680']);c.fill()}
  for(const [gx,col] of [[-w2*.5,'#ff3a5a'],[0,'#3ad8ff'],[w2*.5,'#7aff6a']])VOL(c,cc=>{E(cc,gx,y0-4,2.9,2.9)},col,{bb:[gx-2.9,y0-6.9,gx+2.9,y0-1.1],light:'#ffffff',spec:[gx-1,y0-5,1,.7,0],lw:1});break}
 case 'flowerpin':{c.save();c.translate(fr*.78,fy-fr*.72);for(let i=0;i<5;i++){c.save();c.rotate(i/5*Math.PI*2);petal(c,8,4,'round',h.c,'#c86aa8');c.restore()}E(c,0,0,3,3);P(c,'#ffe14a',1.2);c.restore();break}
 case 'horns':for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*fr*.55,fy-fr*.75);c.quadraticCurveTo(sd*fr*1.25,fy-fr*1.1,sd*fr*1.05,fy-fr*1.75);c.quadraticCurveTo(sd*fr*.95,fy-fr*1.15,sd*fr*.3,fy-fr*.85);c.closePath();P(c,LG(c,0,fy-fr*1.7,0,fy-fr*.7,['#e8f0c0',h.c]),2.2)}break}}
function drawWeapon0(c,W,t,a){const c1=W.c1||'#8a5a2a',c2=W.c2||'#4a2a10';c.lineCap='round';
 switch(W.t){
 case 'spear':RRp(c,-2.6,-62,5.2,92,2.6);P(c,LG(c,-3,0,3,0,['#c08a50','#7a4a1c']),2.2);c.beginPath();c.moveTo(0,-86);c.quadraticCurveTo(9,-72,3,-60);c.lineTo(-3,-60);c.quadraticCurveTo(-9,-72,0,-86);P(c,LG(c,-8,0,8,0,['#ffffff','#b8c8d8','#6a7a8a']),2.4);RRp(c,-5,-62,10,5,2);P(c,'#e0a020',1.8);break;
 case 'staff':{RRp(c,-2.4,-66,4.8,96,2.4);P(c,LG(c,-3,0,3,0,W.wood?['#a87a4a','#5a3a1a']:['#f0f4ff','#8a98b8']),2.2);const gy=-72;
  c.globalAlpha=Math.min(1,.3+.2*Math.sin(t*4)+a*.6);circ(c,0,gy,13+a*9,W.gem);c.globalAlpha=1;
  if(W.sun){for(let i=0;i<8;i++){c.save();c.translate(0,gy);c.rotate(i*Math.PI/4+t);c.beginPath();c.moveTo(6,-2.5);c.lineTo(13,0);c.lineTo(6,2.5);c.closePath();P(c,'#ffd23f',1.2);c.restore()}}
  else if(W.bolt){c.beginPath();c.moveTo(-4,gy-12);c.lineTo(3,gy-2);c.lineTo(-2,gy);c.lineTo(5,gy+11);c.lineTo(-3,gy+1);c.lineTo(2,gy-1);c.closePath();P(c,'#fff27a',1.4)}
  else for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*2,gy+8);c.quadraticCurveTo(sd*10,gy,sd*4,gy-10);c.strokeStyle=OL;c.lineWidth=3.4;c.stroke();c.strokeStyle='#e0b040';c.lineWidth=1.8;c.stroke()}
  E(c,0,gy,6.5,6.5);P(c,RG(c,0,gy,7,['#ffffff',W.gem,'#3a3a5a'],-2,gy-2),2);break}
 case 'wand':RRp(c,-1.8,-30,3.6,40,1.8);P(c,'#6a4a2a',1.6);
  if(W.star)star(c,0,-36,8+a*3,W.gem);else if(W.crystal){c.beginPath();c.moveTo(0,-48);c.lineTo(5,-35);c.lineTo(0,-28);c.lineTo(-5,-35);c.closePath();P(c,LG(c,-5,-48,5,-28,['#ffffff',W.gem,'#7ab0e0']),1.6)}
  else if(W.coin){E(c,0,-35,7,7);P(c,RG(c,0,-35,7,['#fff8c0','#ffd23f','#a8700a']),1.8)}else if(W.bubble){E(c,0,-38,8,8);c.strokeStyle='#ffffff';c.lineWidth=2;c.stroke();E(c,-2,-40,2,1.4);c.fillStyle='#fff';c.fill()}else{E(c,0,-35,5,5);P(c,W.gem,1.6)}
  c.globalAlpha=.3+a*.5;circ(c,0,-36,10+a*7,W.gem||'#fff');c.globalAlpha=1;break;
 case 'gauntlet':E(c,0,0,10,9);P(c,LG(c,0,-9,0,9,['#a8a8b8',c1]),2.4);for(let i=-1;i<=1;i++){RRp(c,i*4.5-2,-12,4,6,1.5);P(c,'#b8b8c8',1.2)}if(a>0){c.globalAlpha=a;circ(c,4,-4,15,'#fff27a');c.globalAlpha=1}break;
 case 'can':{const hc=W.honey;RRp(c,-4,-12,22,18,5);P(c,LG(c,0,-12,0,6,hc?['#ffe680','#c8900a']:['#7ae08a','#2a8a3a']),2.4);c.beginPath();c.moveTo(16,-6);c.lineTo(30,-18-a*6);c.lineTo(32,-15-a*6);c.lineTo(18,0);c.closePath();P(c,hc?'#d8a020':'#3aa04a',2);c.beginPath();c.arc(7,-14,7,Math.PI,0);c.strokeStyle=OL;c.lineWidth=5;c.stroke();c.strokeStyle=hc?'#d8a020':'#3aa04a';c.lineWidth=2.5;c.stroke();break}
 case 'flask':c.beginPath();c.moveTo(-3,-16);c.lineTo(-3,-8);c.arc(0,0,10,-Math.PI/2-.3,Math.PI*1.5+.3);c.lineTo(3,-16);c.closePath();P(c,'rgba(220,255,240,.55)',2.4);c.save();c.beginPath();c.arc(0,0,9,0,Math.PI*2);c.clip();c.fillStyle=LG(c,0,-2,0,10,['#ffffff',c1]);c.fillRect(-10,-2+Math.sin(t*3)*1.5,20,14);c.restore();RRp(c,-4.5,-21,9,6,2);P(c,'#9a6a3a',1.8);break;
 case 'cannon':{const L2=W.long?46:30;RRp(c,-8,-8,L2,15,6);P(c,LG(c,0,-8,0,7,[c1,c2]),2.4);for(const bx of [2,L2-14]){RRp(c,bx,-9,5,17,2);P(c,c2,1.4)}E(c,L2-8,-.5,4,6);c.fillStyle='#1a1a1a';c.fill();
  if(W.laser){E(c,L2-8,-.5,3,3);c.fillStyle=`rgba(255,80,60,${.5+.5*Math.sin(t*9)})`;c.fill()}
  if(a>.4){c.globalAlpha=(a-.4)/.6;circ(c,L2-4,-.5,10,'#fff3a0');circ(c,L2-4,-.5,5,'#ffffff');c.globalAlpha=1}break}
 case 'mortar':{c.save();c.rotate(-.55);const s2=W.big?1.25:1;c.scale(s2,s2);RRp(c,-8,-12,28,22,7);P(c,LG(c,0,-12,0,10,[c1,c2]),2.6);E(c,20,-1,5,9);P(c,'#1a1a1a',1.6);RRp(c,4,-13,4,24,2);P(c,'#ffd23f',1.2);if(a>.4){c.globalAlpha=(a-.4)/.6;circ(c,25,-1,12,'#ffd8a0');c.globalAlpha=1}c.restore();break}
 case 'sling':c.beginPath();c.moveTo(0,8);c.lineTo(0,-6);c.lineTo(-8,-20);c.moveTo(0,-6);c.lineTo(8,-20);c.strokeStyle=OL;c.lineWidth=5.4;c.stroke();c.strokeStyle=c1;c.lineWidth=3.2;c.stroke();c.beginPath();c.moveTo(-8,-20);c.quadraticCurveTo(-2-6*(1-a),-12+a*8,8,-20);c.strokeStyle='#c84a3a';c.lineWidth=1.8;c.stroke();break;
 case 'fan':{c.save();c.rotate(-.4-a*.9);for(let i=0;i<7;i++){c.save();c.rotate(-.9+i*.3);c.beginPath();c.moveTo(0,0);c.lineTo(-4,-26);c.lineTo(4,-26);c.closePath();P(c,i%2?c1:'#ffffff',1.2);c.restore()}c.beginPath();c.arc(0,0,26,-Math.PI/2-1.05,-Math.PI/2+1.05);c.strokeStyle=c2;c.lineWidth=2;c.stroke();c.restore();break}
 case 'book':c.save();c.rotate(.15);RRp(c,-14,-10,13,18,2);P(c,LG(c,-14,0,0,0,['#fff8e0','#e0d0a8']),1.8);RRp(c,1,-10,13,18,2);P(c,LG(c,0,0,14,0,['#e0d0a8','#fff8e0']),1.8);RRp(c,-15,7,30,3,1);P(c,c1,1.2);c.globalAlpha=.4+.3*Math.sin(t*3)+a*.3;circ(c,7,-2,5+a*5,W.gem);c.globalAlpha=1;c.restore();break;
 case 'bow':{c.beginPath();c.moveTo(0,-34);c.quadraticCurveTo(16,0,0,34);c.strokeStyle=OL;c.lineWidth=5;c.stroke();c.strokeStyle=c1;c.lineWidth=3;c.stroke();const px=-6*(1-a);c.beginPath();c.moveTo(0,-34);c.lineTo(px,0);c.lineTo(0,34);c.strokeStyle='#f0f0f0';c.lineWidth=1.2;c.stroke();
  if(a<.5){c.beginPath();c.moveTo(px,0);c.lineTo(px+26,0);c.strokeStyle='#d8c8a0';c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(px+26,-3);c.lineTo(px+32,0);c.lineTo(px+26,3);c.closePath();P(c,'#c8d0d8',1)}break}
 case 'daggers':for(const ang of [-.5,.35]){c.save();c.rotate(ang+a*.6);RRp(c,-2,-4,4,8,1.5);P(c,'#5a3a1a',1.2);RRp(c,-4,-6,8,3,1);P(c,'#e0b040',1);c.beginPath();c.moveTo(-2.5,-6);c.lineTo(0,-26);c.lineTo(2.5,-6);c.closePath();P(c,LG(c,-3,0,3,0,['#ffffff',c1,'#8a98a8']),1.4);c.restore()}break;
 case 'scythe':RRp(c,-2,-60,4,86,2);P(c,LG(c,-2,0,2,0,[c1,'#2a1a10']),2);c.beginPath();c.moveTo(0,-60);c.quadraticCurveTo(-30,-68,-38,-48);c.quadraticCurveTo(-24,-58,0,-52);c.closePath();P(c,LG(c,-38,-60,0,-52,['#ffffff',c2,'#6a6a78']),2);break;
 case 'lantern':c.beginPath();c.moveTo(0,0);c.lineTo(0,10);c.strokeStyle=OL;c.lineWidth=2;c.stroke();RRp(c,-8,10,16,20,5);P(c,LG(c,0,10,0,30,[c1,'#5a3a10']),2);RRp(c,-5,13,10,14,3);P(c,RG(c,0,20,8,['#ffffff',W.gem]),1);c.globalAlpha=.22+.1*Math.sin(t*5)+a*.4;circ(c,0,20,18+a*9,W.gem);c.globalAlpha=1;break;
 case 'trumpet':c.save();c.rotate(.5);RRp(c,-2,-4,24,7,3);P(c,c2,1.6);c.beginPath();c.moveTo(20,-5);c.quadraticCurveTo(28,-14-a*4,34,-16-a*6);c.lineTo(34,18+a*6);c.quadraticCurveTo(28,14+a*4,20,6);c.closePath();P(c,LG(c,20,0,34,0,[c1,c2]),2);c.restore();break;
 case 'whip':{c.beginPath();c.moveTo(0,0);let px=0,py=0;for(let i=1;i<=8;i++){px=i*5;py=Math.sin(t*5+i*.8)*4*(i/8)-i*3*(1-a)+a*i*2;c.lineTo(px,py)}c.strokeStyle=OL;c.lineWidth=5;c.stroke();c.strokeStyle=c1;c.lineWidth=3;c.stroke();leafHQ(c,px,py,10,-.4,c1,'#0e4a0e');break}}}
// Proyectil propio de cada personaje (pv)
function drawShot0(c,b,s,sc,t){const U=UT[s.k],col=U.shot,pv=U.pv||'orb',z=(1+s.rank*.08)*sc;let ang=0;if(s.tg&&!s.tg.dead){const [tx,ty]=posAt(b,s.tg.d);ang=Math.atan2(ty-s.y,tx-s.x)}
 c.save();c.translate(s.x,s.y);c.scale(z,z);c.lineCap='round';
 switch(pv){
 case 'needle':case 'arrow':{c.rotate(ang);const L2=pv==='arrow'?22:14;c.strokeStyle=OL;c.lineWidth=3.4;c.beginPath();c.moveTo(-L2,0);c.lineTo(4,0);c.stroke();c.strokeStyle=col;c.lineWidth=1.8;c.stroke();c.beginPath();c.moveTo(4,-3.5);c.lineTo(10,0);c.lineTo(4,3.5);c.closePath();P(c,'#ffffff',1.2);
  if(pv==='arrow'){c.beginPath();c.moveTo(-L2,0);c.lineTo(-L2-5,-4);c.moveTo(-L2,0);c.lineTo(-L2-5,4);c.strokeStyle='#ff6a5a';c.lineWidth=2;c.stroke()}break}
 case 'seed':c.rotate(ang+t*20);E(c,0,0,5,3.6);P(c,LG(c,-5,0,5,0,['#c08a4a','#6a3a10']),1.4);break;
 case 'flame':case 'phoenix':{const big=pv==='phoenix'?1.6:1;c.rotate(ang);for(let i=3;i>=0;i--){c.globalAlpha=.3+.2*(3-i);E(c,-i*5*big,0,(7-i)*big,(5-i*.8)*big);c.fillStyle=i?'#ff6a1a':'#fff3a0';c.fill()}c.globalAlpha=1;circ(c,0,0,3.4*big,'#ffffff');
  if(pv==='phoenix')for(const sd of [-1,1]){c.beginPath();c.moveTo(-2,0);c.quadraticCurveTo(-8,sd*14,-16,sd*10);c.strokeStyle='rgba(255,200,60,.85)';c.lineWidth=2.2;c.stroke()}break}
 case 'flake':c.rotate(t*6);for(const [w,cl] of [[3.6,OL],[2,col]]){c.strokeStyle=cl;c.lineWidth=w;for(let i=0;i<3;i++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(-7,0);c.lineTo(7,0);c.stroke()}}circ(c,0,0,2.4,'#fff');break;
 case 'spark':c.strokeStyle=col;c.lineWidth=2.4;c.beginPath();c.moveTo(-6,-5);c.lineTo(1,-1);c.lineTo(-2,1);c.lineTo(6,5);c.stroke();circ(c,0,0,3.4,'#ffffff');break;
 case 'drop':c.rotate(ang+Math.PI/2);c.beginPath();c.moveTo(0,-8);c.bezierCurveTo(5,-2,6,2,5,4);c.arc(0,4,5,0,Math.PI);c.bezierCurveTo(-6,2,-5,-2,0,-8);P(c,col,1.4);E(c,-1.5,2,1.4,2.4);c.fillStyle='rgba(255,255,255,.8)';c.fill();break;
 case 'spore':for(let i=0;i<4;i++){const a=t*4+i*1.6;circ(c,Math.cos(a)*3.5,Math.sin(a)*3.5,3.2,col)}circ(c,0,0,2.6,'#ffffff');break;
 case 'fang':c.rotate(ang);c.beginPath();c.moveTo(-6,-4);c.lineTo(8,0);c.lineTo(-6,4);c.closePath();P(c,'#ffffff',1.4);c.beginPath();c.moveTo(-6,-4);c.lineTo(-6,4);c.strokeStyle=col;c.lineWidth=3;c.stroke();break;
 case 'sun':c.rotate(t*4);star(c,0,0,7,col);circ(c,0,0,3,'#ffffff');break;
 case 'coin':E(c,0,0,5.5,Math.max(1,5.5*Math.abs(Math.cos(t*12))));P(c,RG(c,0,0,6,['#fff8c0','#ffd23f','#a8700a']),1.2);break;
 case 'bubble':E(c,0,0,7,7);c.fillStyle='rgba(200,240,255,.25)';c.fill();c.strokeStyle=col;c.lineWidth=1.8;c.stroke();E(c,-2.5,-2.5,2,1.4);c.fillStyle='#fff';c.fill();break;
 case 'lob':c.rotate(t*8);E(c,0,0,8.5,8.5);P(c,RG(c,0,0,9,['#ffffff',col,'#5a3010'],-3,-3),2);c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=1.4;c.beginPath();c.moveTo(-8,0);c.lineTo(8,0);c.stroke();break;
 case 'puff':c.globalAlpha=.9;for(let i=0;i<5;i++){const a=i/5*Math.PI*2+t*3;circ(c,Math.cos(a)*4,Math.sin(a)*4,3.4,'#ffffff')}c.globalAlpha=1;break;
 case 'petal':c.rotate(t*10);E(c,0,0,7,3.6);P(c,col,1.2);E(c,0,0,3.6,7);P(c,col,1.2);circ(c,0,0,2,'#fff6a0');break;
 case 'thorn':c.rotate(ang);c.beginPath();c.moveTo(-7,-3);c.lineTo(8,0);c.lineTo(-7,3);c.closePath();P(c,col,1.4);break;
 case 'vine':c.rotate(ang);c.beginPath();c.moveTo(-14,0);for(let i=1;i<=4;i++)c.lineTo(-14+i*5,Math.sin(t*20+i)*3);c.strokeStyle=OL;c.lineWidth=4.4;c.stroke();c.strokeStyle=col;c.lineWidth=2.4;c.stroke();leaf(c,6,0,7,0,'#9ae07a');break;
 case 'star':for(let i=1;i<=3;i++){c.globalAlpha=.3;star(c,-Math.cos(ang)*i*6,-Math.sin(ang)*i*6,6-i*1.2,col)}c.globalAlpha=1;c.rotate(t*6);star(c,0,0,8,col);break;
 default:circ(c,0,0,5+s.rank*.6,col);circ(c,0,0,2.5,'#fff')}
 c.restore()}
function chFx0(c,L,t,a){const W=L.w||{},hx=W.hx||26,hy=W.hy||-48,y0=L.h.y||-80,col=L.fxc;
 switch(L.fx){
 case 'flame':{const f=Math.sin(t*16)*1.5;E(c,hx,hy-8,11+f+a*5,11+f+a*5);c.fillStyle=RG(c,hx,hy-8,14,['rgba(255,240,150,.95)','rgba(255,140,30,.8)','rgba(255,60,0,0)'],hx,hy-8);c.fill();for(let i=0;i<3;i++){const ph=(t*1.4+i/3)%1;E(c,hx+Math.sin(t*5+i)*4,hy-14-ph*16,3*(1-ph)+1,4.5*(1-ph)+1);c.fillStyle=`rgba(255,${150+ph*80|0},40,${.9-ph*.8})`;c.fill()}break}
 case 'frost':{c.save();c.translate(hx,hy-72);c.rotate(t*1.5);c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1.6;for(let i=0;i<3;i++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(-8,0);c.lineTo(8,0);c.stroke()}c.restore();for(let i=0;i<3;i++){const ph=(t*.6+i/3)%1;circ(c,Math.sin(i*2.1+t)*26,y0+30-ph*50,1.8,`rgba(220,245,255,${1-ph})`)}break}
 case 'spark':{c.strokeStyle='rgba(255,250,150,.95)';c.lineWidth=2;c.beginPath();let x=hx,y=hy-6;c.moveTo(x,y);for(let i=0;i<4;i++){x+=(Math.random()-.5)*12;y-=5;c.lineTo(x,y)}c.stroke();if(a>0){c.globalAlpha=a;circ(c,hx,hy,16,'rgba(150,230,255,.7)');c.globalAlpha=1}break}
 case 'drip':{const ph=(t*.8)%1;E(c,hx+30,hy-12+ph*18,1.8,2.6);c.fillStyle=col?`rgba(140,230,170,${1-ph})`:`rgba(120,210,255,${1-ph})`;c.fill();break}
 case 'spores':for(let i=0;i<4;i++){const ph=(t*.7+i/4)%1;c.globalAlpha=1-ph;E(c,Math.sin(t*2+i*1.7)*26,y0-22-ph*30,2.6*(1-ph*.5),2.6*(1-ph*.5));c.fillStyle=col||'rgba(200,255,90,.9)';c.fill()}c.globalAlpha=1;break;
 case 'sun':c.save();c.translate(0,y0);c.rotate(t*.6);for(let i=0;i<10;i++){c.rotate(Math.PI/5);c.fillStyle='rgba(255,230,120,.25)';c.fillRect(32,-2,12+Math.sin(t*4+i)*4,4)}c.restore();break;
 case 'smoke':for(let i=0;i<3;i++){const ph=(t*1.1+i/3)%1;circ(c,hx+30+ph*8,hy-6-ph*18,3+ph*5,`rgba(210,210,210,${.5-ph*.5})`)}break;
 case 'coins':for(let i=0;i<3;i++){const ph=(t*.6+i/3)%1;c.globalAlpha=1-ph;E(c,Math.sin(i*2.4)*26,y0-16-ph*34,3.4,Math.max(.4,3.4*Math.abs(Math.cos(t*4+i))));c.fillStyle='#ffd23f';c.fill()}c.globalAlpha=1;break;
 case 'bubbles':for(let i=0;i<4;i++){const ph=(t*.5+i/4)%1;c.globalAlpha=1-ph;E(c,hx+Math.sin(t*2+i)*10,hy-40-ph*40,2.5+ph*3,2.5+ph*3);c.strokeStyle='#ffffff';c.lineWidth=1.2;c.stroke()}c.globalAlpha=1;break;
 case 'puffs':c.strokeStyle='#ffffff';c.lineWidth=1;for(let i=0;i<4;i++){const ph=(t*.35+i/4)%1,px=-34+ph*72,py=y0-12-Math.sin(ph*Math.PI)*30-i*4;c.globalAlpha=(1-ph)*.9;for(let j=0;j<5;j++){const aa=j/5*Math.PI*2;c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(aa)*4,py+Math.sin(aa)*4);c.stroke()}}c.globalAlpha=1;break;
 case 'glow':break;// se dibuja detrás del personaje (drawChar)
 case 'petals':for(let i=0;i<4;i++){const ph=(t*.4+i/4)%1;c.save();c.translate(-34+ph*68+Math.sin(t+i)*6,y0-30+ph*60);c.rotate(t*3+i);c.globalAlpha=1-ph*.6;E(c,0,0,4,2.2);c.fillStyle=col||'#ffc8dc';c.fill();c.restore()}c.globalAlpha=1;break;
 case 'leaves':for(let i=0;i<3;i++){const ph=(t*.35+i/3)%1;c.save();c.translate(-26+i*24+Math.sin(t*2+i)*6,y0-36+ph*70);c.rotate(t*2+i);c.globalAlpha=1-ph;leaf(c,0,0,8,0,col||'#7ad04a');c.restore()}c.globalAlpha=1;break;
 case 'notes':for(let i=0;i<2;i++){const ph=(t*.8+i/2)%1;c.globalAlpha=1-ph;txt(c,i?'♫':'♪',24+ph*14,y0-22-ph*26,14,'#fff','center',OL)}c.globalAlpha=1;break;
 case 'stars':for(let i=0;i<4;i++){const ang=t*.9+i*1.57;star(c,Math.cos(ang)*36,y0-10+Math.sin(ang)*22,3+Math.sin(t*5+i)*1.2,'#fff2a0')}break;
 case 'vines':c.strokeStyle='#3aa83a';c.lineWidth=2.4;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*16,0);for(let i=1;i<6;i++)c.lineTo(sd*(16+i*4)+Math.sin(t*3+i)*2,-i*5);c.stroke()}break;
 case 'drool':{const ph=(t*.7)%1;E(c,14,y0+22+ph*16,2,3+ph*2);c.fillStyle=col?`rgba(230,180,255,${.9-ph*.9})`:`rgba(200,240,255,${.9-ph*.9})`;c.fill();break}}}
function tierBack(c,tier,t){if(tier==='plata'){E(c,0,0,27,7.5);c.fillStyle='rgba(220,235,255,.22)';c.fill()}
 else if(tier==='oro'){E(c,0,0,31,8.5);c.fillStyle=`rgba(255,210,60,${.25+.1*Math.sin(t*3)})`;c.fill();E(c,0,0,31,8.5);c.strokeStyle='rgba(255,230,120,.7)';c.lineWidth=1.5;c.stroke()}
 else if(tier==='leyenda'){E(c,0,0,34,10);c.fillStyle='rgba(200,110,255,.28)';c.fill();c.save();c.scale(1,.28);c.rotate(t*.8);c.strokeStyle='rgba(225,160,255,.85)';c.lineWidth=3;c.setLineDash([8,6]);c.beginPath();c.arc(0,0,36,0,7);c.stroke();c.setLineDash([]);c.restore()}}
function tierFront(c,tier,t){if(tier==='oro'){for(let i=0;i<3;i++){const a=t*1.6+i*2.1;star(c,Math.cos(a)*32,-62+Math.sin(a)*42,2.8+Math.sin(t*6+i),'#fff3a0')}}
 else if(tier==='leyenda'){for(let i=0;i<6;i++){const ph=(t*.45+i/6)%1;c.globalAlpha=1-ph;circ(c,Math.sin(i*2.3+t)*28,-ph*130,2.6,i%2?'#e8b0ff':'#ffe8a0')}c.globalAlpha=1}}
// Pasada de volumen para piezas dibujadas con el estilo anterior: degradado de luz arriba-izquierda,
// luz de recorte en el borde superior-izquierdo y sombra interna en el inferior-derecho (sobre la silueta de la capa).
function litLayer(A,R,draw,cx,cy,rr,k){const L=document.createElement('canvas');L.width=A.width;L.height=A.height;const g=L.getContext('2d');g.setTransform(A.getContext('2d').getTransform());g.lineJoin='round';g.lineCap='round';
 const res=draw(g);g.setTransform(1,0,0,1,0,0);const X=cx*R,Y=cy*R,RR=rr*R,d=2.2*R;k=k||1;
 g.globalCompositeOperation='source-atop';g.fillStyle=RG(g,X,Y,RR*1.55,['rgba(255,250,235,'+(.2*k)+')','rgba(255,250,235,0)','rgba(30,12,0,'+(.3*k)+')'],X-RR*.4,Y-RR*.5);g.fillRect(0,0,L.width,L.height);
 for(const [sx,col,al] of [[1,'#fffbe8',.6*k],[-1,'#1e0c00',.32*k]]){const m=document.createElement('canvas');m.width=L.width;m.height=L.height;const q=m.getContext('2d');q.drawImage(L,0,0);q.globalCompositeOperation='destination-out';q.drawImage(L,sx*d,sx*d*1.15);q.globalCompositeOperation='source-in';q.fillStyle=col;q.fillRect(0,0,m.width,m.height);g.globalAlpha=al;g.drawImage(m,0,0);g.globalAlpha=1}
 g.globalCompositeOperation='source-over';const c=A.getContext('2d');c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(L,0,0);c.restore();return res}
const NEWH={flower:1,crystal:1,trunk:1,thistle:1};
// ===================== SPRITES PNG (sistema híbrido) =====================
// Si existe assets/units/{id}.png se usa esa imagen; si no, el dibujo procedural de siempre.
// Las PNG: fondo transparente y los pies en el borde inferior. Se escalan por altura (PNG_H), así que conviene
// que todas tengan la misma altura total para que salgan a la misma escala.
const UNIT_IMG={},PNG_H=175;
// Opciones → Estilo de personajes: 0 = dibujo del juego para todos (estilo uniforme), 1 = usar las ilustraciones PNG donde existan.
const artPng=()=>typeof save!=='undefined'&&save.opts.art===1;
function setArt(i){save.opts.art=i;for(const key of Object.keys(SPR))if(UNIT_PNGS.some(k=>key===k||key.startsWith(k+'|')))delete SPR[key]}
// Personajes que tienen imagen en assets/units/. Al agregar un PNG nuevo, añade aquí su id (así no se piden archivos que no existen).
const UNIT_PNGS=['espina','hielo','fuego','rayo','rocio'];
function loadUnitPngs(){for(const k of UNIT_PNGS){if(!ALL.includes(k))continue;const im=new Image();im.onload=()=>{UNIT_IMG[k]=im;for(const key of Object.keys(SPR))if(key===k||key.startsWith(k+'|'))delete SPR[key]};im.onerror=()=>{};im.src='assets/units/'+k+'.png'}}
function pngSprite(k){const im=UNIT_IMG[k],R=2.4,f=PNG_H/im.height,w=im.width*f,cw=Math.max(240,Math.ceil(w)+20),ch=250,ox=cw/2,oy=212;
 const cv2=document.createElement('canvas');cv2.width=Math.ceil(cw*R);cv2.height=ch*R;const c=cv2.getContext('2d');c.imageSmoothingQuality='high';c.drawImage(im,(ox-w/2)*R,(oy-PNG_H+3)*R,w*R,PNG_H*R);
 let top=-PNG_H+3;try{const q=document.createElement('canvas');q.width=im.width;q.height=im.height;const g=q.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,im.width,im.height).data;let row=0;outer:for(;row<im.height;row++)for(let x=0;x<im.width;x++)if(d[(row*im.width+x)*4+3]>40)break outer;top+=row*f}catch(e){}
 return {img:cv2,cw,ch,ox,oy,top,png:1}}
// Silueta blanca del sprite (para el destello), calculada una vez.
const PWH=new WeakMap();
function pngWhite(sp){let w=PWH.get(sp.img);if(!w){w=document.createElement('canvas');w.width=sp.img.width;w.height=sp.img.height;const q=w.getContext('2d');q.drawImage(sp.img,0,0);q.globalCompositeOperation='source-in';q.fillStyle='#ffffff';q.fillRect(0,0,w.width,w.height);PWH.set(sp.img,w)}return w}
// Animación viva del PNG: respiración elástica anclada en los pies, anticipación + inclinación + retroceso al atacar,
// destello blanco al disparar, partículas del elemento encima (chFx) y sombra proyectada en el suelo.
// Aspecto por fase. Detrás: anillo en el suelo (2+), aura del elemento (3+), rayos que giran (4+), alas de luz (5).
// Delante: laureles de bronce (2), diadema de plata con gema (3), corona de oro (4), corona legendaria con aureola (5) y destellos que orbitan (3+).
function phaseBack(c,r,t,col,top){r=Math.min(r|0,5);if(r<2)return;top=top||-150;const h=-top,cy=top*.5,pc=PH_COL[r];
 c.save();E(c,0,0,30,8);c.strokeStyle=pc;c.globalAlpha=.75;c.lineWidth=2.4;c.stroke();if(r>=3){c.globalCompositeOperation='lighter';c.globalAlpha=.35+.15*Math.sin(t*3);E(c,0,0,34,9);c.fillStyle=pc;c.fill()}c.restore();
 if(r>=3){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.32+.12*Math.sin(t*2.2);const R2=h*.62;c.drawImage(glowSprite(col||pc),-R2,cy-R2,R2*2,R2*2);c.restore()}
 if(r>=4){c.save();c.globalCompositeOperation='lighter';c.translate(0,cy);c.rotate(t*.5);for(let i=0;i<10;i++){c.rotate(Math.PI/5);c.beginPath();c.moveTo(0,0);c.lineTo(-7,-h*.85);c.lineTo(7,-h*.85);c.closePath();c.fillStyle=r>=5?'rgba(220,150,255,.12)':'rgba(255,220,120,.12)';c.fill()}c.restore()}
 if(r>=5){const f=Math.sin(t*2.4)*.12;c.save();c.globalCompositeOperation='lighter';for(const sd of [-1,1]){c.save();c.translate(sd*10,cy-h*.05);c.scale(sd,1);c.rotate(-.35+f);
  c.beginPath();c.moveTo(0,0);c.bezierCurveTo(30,-h*.35,h*.55,-h*.42,h*.62,-h*.12);c.bezierCurveTo(h*.45,-h*.08,h*.5,h*.06,h*.4,h*.12);c.bezierCurveTo(h*.3,h*.05,h*.25,h*.22,h*.12,h*.2);c.closePath();
  c.fillStyle=LG(c,0,0,h*.6,0,['rgba(255,240,180,.55)','rgba(210,140,255,.35)','rgba(210,140,255,0)']);c.fill();c.strokeStyle='rgba(255,240,200,.6)';c.lineWidth=1.2;c.stroke();c.restore()}c.restore()}}
function crownAt(c,y,s,cols,gem){c.save();c.translate(0,y);c.scale(s,s);c.beginPath();c.moveTo(-13,0);c.lineTo(-15,-14);c.lineTo(-7,-6);c.lineTo(0,-17);c.lineTo(7,-6);c.lineTo(15,-14);c.lineTo(13,0);c.closePath();
 c.fillStyle=LG(c,0,-17,0,0,cols);c.fill();c.strokeStyle='#2a1a06';c.lineWidth=1.6;c.stroke();if(gem){E(c,0,-4,2.8,2.8);c.fillStyle=gem;c.fill();c.strokeStyle='#2a1a06';c.lineWidth=1;c.stroke();E(c,-.8,-4.8,.9,.7);c.fillStyle='#fff';c.fill()}c.restore()}
function phaseFront(c,r,t,col,top){r=Math.min(r|0,5);if(r<2)return;top=top||-150;const h=-top,y=top+2;
 if(r===2){for(const sd of [-1,1])for(let i=0;i<3;i++){c.save();c.translate(sd*(8+i*5),y+4+i*3);c.rotate(sd*(.9+i*.25));E(c,0,-4,2.6,5);c.fillStyle=i%2?'#e0a050':'#b8742a';c.fill();c.strokeStyle='#4a2a08';c.lineWidth=.8;c.stroke();c.restore()}}
 else if(r===3){c.save();c.beginPath();c.ellipse(0,y+4,14,4,0,Math.PI*1.05,Math.PI*1.95);c.strokeStyle='#2a2a34';c.lineWidth=4.5;c.stroke();c.strokeStyle='#e8eef8';c.lineWidth=2.6;c.stroke();c.restore();E(c,0,y-1,3.2,3.2);c.fillStyle='#5ad8ff';c.fill();c.strokeStyle='#2a2a34';c.lineWidth=1;c.stroke()}
 else if(r===4)crownAt(c,y+5,1,['#fff6b0','#ffd23f','#c88a10'],'#ff4a6a');
 else{crownAt(c,y+5,1.15,['#ffffff','#e8b0ff','#8a3ad8'],'#ffd23f');c.save();c.globalCompositeOperation='lighter';c.beginPath();c.ellipse(0,y-16+Math.sin(t*2)*2,16,4.5,0,0,7);c.strokeStyle='rgba(255,230,140,.9)';c.lineWidth=2.4;c.stroke();c.restore()}
 if(r>=3){const n=r===3?2:r===4?4:6;c.save();c.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const a=t*1.8+i/n*Math.PI*2,x=Math.cos(a)*30,yy=-h*.45+Math.sin(a)*h*.28;c.globalAlpha=.7;c.drawImage(glowSprite(r>=5?'#e8a0ff':col||'#fff3a0'),x-5,yy-5,10,10)}c.restore()}}
// Insignia de fase: escudo del color de la fase con el número en romano.
function phaseBadge(c,x,y,s,r){c.save();c.translate(x,y);c.scale(s,s);const col=r<=5?PH_COL[r]:RANKCOL[r]||'#fff';c.beginPath();c.moveTo(0,-13);c.lineTo(11,-9);c.lineTo(10,4);c.quadraticCurveTo(6,11,0,14);c.quadraticCurveTo(-6,11,-10,4);c.lineTo(-11,-9);c.closePath();
 c.fillStyle=LG(c,0,-13,0,14,[cshift(col,.45),col,cshift(col,-.45)]);c.fill();c.strokeStyle='#2a1a06';c.lineWidth=2;c.stroke();txt(c,ROMAN[r]||r,0,1,r>=4?10:11,'#ffffff','center','#2a1a06');c.restore()}
function drawCharPng(c,k,x,y,s,t,rank,pop,skin,af,face){const L=LOOK[k]||{},U=UT[k],sp=heroSprite(k,skin),p=pop||0,a=clamp((af||0)/.3,0,1),S=s*.82*PH_SZ[Math.min(rank|0,5)],ph=t+x*.013,tier=U.t||'cobre';
 const br=Math.sin(ph*2.6);let sx=1-br*.025,sy=1+br*.035,rot=Math.sin(ph*1.3)*.015,ix=0;
 if(a>0){const q=Math.sin(a*Math.PI);sx*=1+.08*q;sy*=1-.09*q;rot-=.12*q;ix-=10*a*a}
 c.save();c.translate(x,y+36*s);c.scale(face||1,1);E(c,5*s,1.5*s,30*s*(1-br*.04),7.5*s);c.fillStyle='rgba(0,0,0,.33)';c.fill();
 c.scale(S,S);tierBack(c,tier,t);phaseBack(c,rank,t,U.shot,sp.top);c.translate(ix,0);c.rotate(rot);c.scale(sx*(1+p*.18),sy*(1-p*.1));
 if(L.fx==='glow'){c.globalAlpha=.2+.1*Math.sin(t*2.5)+a*.3;circ(c,0,-70,60,L.fxc||'#fff');c.globalAlpha=1}
 const dens=S*DPR*Math.max(sx,sy)*(1+p*.18)*1.1;c.drawImage(mip(sp.img,sp.cw,sp.ch,dens),-sp.ox,-sp.oy,sp.cw,sp.ch);
 if(a>.55){c.globalAlpha=(a-.55)/.45*.7;c.drawImage(mip(pngWhite(sp),sp.cw,sp.ch,dens),-sp.ox,-sp.oy,sp.cw,sp.ch);c.globalAlpha=1}
 if(LOOK[k])chFx(c,L,t,a);tierFront(c,tier,t);phaseFront(c,rank,t,U.shot,sp.top);c.restore();
 if(typeof save!=='undefined'&&save.opts.cb)shapeMark(c,k,x-24*s,y+22*s,12*s);
 if(rank)phaseBadge(c,x+25*s*(face||1),y-38*s,s,rank);}
function charSprite(k){if(SPR[k])return SPR[k];if(UNIT_IMG[k]&&artPng())return SPR[k]=pngSprite(k);const L=LOOK[k],R=2.4,cw=240,ch=250,ox=120,oy=212,T3=2.5;
 const A=document.createElement('canvas');A.width=cw*R;A.height=ch*R;const c=A.getContext('2d');c.scale(R,R);c.translate(ox,oy);c.lineJoin='round';c.lineCap='round';
 const hy=L.h.y||-80,bulky=L.b.t==='bulky';
 let I;PSTY=1;try{
 if(L.bk){if(['cape','mantle','flamewings'].includes(L.bk.t))chBack(c,L.bk,hy);else litLayer(A,R,g=>chBack(g,L.bk,hy),ox,oy+hy+20,45,.8)}
 c.save();c.translate(-14,-46);c.scale(.9,.92);c.translate(14,46);armHQ(c,-14,-46,-25,-30,cshift(L.arm,-.15),bulky?8.5:6.5);c.restore();
 chBody(c,L.b);
 AO(c,T3,-56,21,8,.6);
 I=litLayer(A,R,g=>{g.translate(T3,0);const I=chHead(g,L.h,hy);chFace(g,L.h,I);if(L.hat)chHat(g,L.hat,I);return I},ox+T3,oy+hy-(L.h.r||22)*.3,(L.h.r||22)*1.5*(L.h.big?1.3:1),NEWH[L.h.t]?.45:1);
 }finally{PSTY=0}
 const sil=document.createElement('canvas');sil.width=A.width;sil.height=A.height;const s=sil.getContext('2d');s.drawImage(A,0,0);s.globalCompositeOperation='source-in';s.fillStyle='#170b04';s.fillRect(0,0,sil.width,sil.height);
 const out=document.createElement('canvas');out.width=A.width;out.height=A.height;const o=out.getContext('2d'),th=2.7*R;
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2;o.drawImage(sil,Math.cos(a)*th,Math.sin(a)*th)}
 o.drawImage(A,0,0);
 SPR[k]={img:out,cw,ch,ox,oy,top:I.top};return SPR[k]}
function drawChar(c,k,x,y,s,t,rank,pop,skin,af,face){if(UNIT_IMG[k]&&artPng())return drawCharPng(c,k,x,y,s,t,rank,pop,skin,af,face);const L=LOOK[k],U=UT[k],sp=heroSprite(k,skin),p=pop||0,a=clamp((af||0)/.3,0,1),S=s*.82*PH_SZ[Math.min(rank|0,5)],ph=t+x*.013,tier=U.t||'cobre';
 let ix=0,iy=0,rot=0,sx=1,sy=1,wa=0;
 switch(L.idle){case 'sway':rot=Math.sin(ph*2)*.05;break;case 'breathe':sy=1+Math.sin(ph*2.4)*.03;sx=1-Math.sin(ph*2.4)*.015;break;case 'hop':iy=-Math.abs(Math.sin(ph*3))*5;break;case 'float':iy=-7+Math.sin(ph*2)*3.5;break;case 'jitter':ix=Math.sin(ph*23)*.7;iy=Math.sin(ph*31)*.6;break;default:iy=Math.sin(ph*3.2)*1.8}
 const br=Math.sin(ph*2.6);sx*=1-br*.02;sy*=1+br*.032;const lag=Math.sin(ph*2.6-.9)*1.7;
 if(a>0){const q=Math.sin(a*Math.PI);sx*=1+.08*q;sy*=1-.09*q}switch(L.atk){case 'recoil':ix-=11*a;wa=-.25*a;break;case 'lunge':ix+=9*a;iy-=2*a;wa=.4*a;break;case 'raise':wa=-1.1*a;iy-=3*a;break;case 'twirl':rot+=Math.sin(a*Math.PI)*.35;break;case 'stomp':sy*=1-.16*a;sx*=1+.12*a;break;case 'flash':wa=-.4*a;break}
 c.save();c.translate(x,y+36*s);c.scale(face||1,1);E(c,0,0,24*s*(L.idle==='float'?.72:1),6*s);c.fillStyle='rgba(0,0,0,.3)';c.fill();
 c.scale(S,S);tierBack(c,tier,t);phaseBack(c,rank,t,U.shot,sp.top);c.translate(ix,iy);c.rotate(rot);c.scale(sx*(1+p*.18),sy*(1-p*.1));
 if(L.atk==='flash'&&a>0){c.globalAlpha=a*.55;circ(c,0,-70,62,U.shot);c.globalAlpha=1}
 if(L.fx==='glow'){c.globalAlpha=.22+.1*Math.sin(t*2.5)+a*.3;circ(c,0,-66,56,L.fxc||'#fff');c.globalAlpha=1}
 c.drawImage(mip(sp.img,sp.cw,sp.ch,S*DPR*Math.max(sx,sy)*(1+p*.18)*1.15),-sp.ox,-sp.oy,sp.cw,sp.ch);
 const W=L.w,hx=W.hx+lag*.35,hyy=W.hy+lag;if(W.t!=='none'){c.save();c.translate(hx,hyy);c.rotate((W.a||0)+wa+lag*.015);drawWeapon(c,W,t,a);muzzle(c,W,a,U.shot);c.restore()}
 armHQ(c,13,-46,hx,hyy,L.arm,L.b.t==='bulky'?8.5:6.5);chFx(c,L,t,a);tierFront(c,tier,t);phaseFront(c,rank,t,U.shot,sp.top);c.restore();
 if(typeof save!=='undefined'&&save.opts.cb)shapeMark(c,k,x-24*s,y+22*s,12*s);
 if(rank)phaseBadge(c,x+25*s*(face||1),y-38*s,s,rank);}
// ===================== AVATARES DE COMANDANTES =====================
// Retrato en un círculo de 200×200 (diseño propio): fondo de rareza, espalda, ropa, cabeza, cara, barba, gafas, pelo, sombrero, objeto y detalles.
const AV={
 lluvia:{skin:'#f2c8a8',age:1,hair:{s:'bun',c:'#eef2fa',c2:'#a8b8d0'},eyes:{iris:'#5a8ad8',mood:'happy'},mouth:'open',blush:1,glasses:'round',cloth:{c:'#6a9ad8',c2:'#3a5a98',col:'shawl',trim:'#f4e8d0'},prop:'umbrella',pc:'#5cc8ff',extra:'raincloud'},
 poda:{skin:'#e0a878',hair:{s:'short',c:'#7a4a2a'},beard:{s:'full',c:'#8a5a2a'},eyes:{iris:'#3a7a2a',mood:'calm'},mouth:'grin',hat:{t:'cap',c:'#4a8a3a',c2:'#2a5a1a'},cloth:{c:'#5a7a3a',c2:'#2a4a1a',col:'overalls',trim:'#c8a060'},prop:'shears',pc:'#c8d0d8'},
 semillero:{skin:'#d89870',age:1,hair:{s:'short',c:'#e8e0d0'},beard:{s:'mustache',c:'#f4ecdc'},eyes:{iris:'#6a4a2a',mood:'happy'},mouth:'grin',blush:1,hat:{t:'straw',c:'#e8c870',c2:'#a8803a'},cloth:{c:'#c86a3a',c2:'#7a3a1a',col:'v',trim:'#f0d8a0'},prop:'seedbag',pc:'#a87a4a'},
 espantap:{head:'burlap',skin:'#d8b880',eyes:{iris:'#ff8a1a',mood:'sly'},mouth:'stitch',hat:{t:'pointy',c:'#6a4a2a',c2:'#3a2a10'},cloth:{c:'#4a6aa8',c2:'#2a3a6a',col:'patch',trim:'#c8a050'},extra:'straw',prop:'crow',pc:'#2a2a34'},
 escarcha:{skin:'#e8f4ff',hair:{s:'long',c:'#e0f4ff',c2:'#7ab8e0'},eyes:{iris:'#3a8ad8',mood:'calm'},mouth:'line',blush:1,hat:{t:'tiara',c:'#ffffff',c2:'#7ad8ff'},cloth:{c:'#9ad0f0',c2:'#4a8ab8',col:'gown',trim:'#ffffff'},extra:'icewings',prop:'wand',pc:'#bff4ff'},
 polen:{skin:'#f0c090',hair:{s:'bob',c:'#3a2a1a',c2:'#1a1008'},eyes:{iris:'#e08a10',mood:'happy'},mouth:'grin',blush:1,hat:{t:'pilot',c:'#c88a3a',c2:'#5a3a1a'},glasses:'forehead',gc:'#ffd23f',cloth:{c:'#ffd23f',c2:'#b88a10',col:'stripes',trim:'#2a1a0a'},extra:'antenna',prop:'pollen',pc:'#ffe14a'},
 herrera:{skin:'#c88a60',hair:{s:'moss',c:'#5a9a3a',c2:'#2a5a1a'},eyes:{iris:'#3a8a3a',mood:'fierce'},mouth:'smirk',hat:{t:'bandana',c:'#c83a2a'},cloth:{c:'#7a5a3a',c2:'#3a2a10',col:'apron',trim:'#a8a8b8'},prop:'hammer',pc:'#9a9aa8',extra:'sparks'},
 brujo:{skin:'#a8c088',age:1,hair:{s:'none'},beard:{s:'roots',c:'#6a4a2a'},eyes:{iris:'#c8ff4a',mood:'sly',glow:1},mouth:'line',hat:{t:'hood',c:'#3a2a4a',c2:'#1a0e24'},cloth:{c:'#3a2a4a',c2:'#1a0e24',col:'robe',trim:'#c8ff4a'},prop:'orb',pc:'#c8ff4a'},
 general:{skin:'#f0c090',hair:{s:'short',c:'#5a3a1a'},beard:{s:'bigmustache',c:'#6a4a2a'},eyes:{iris:'#2a5ad8',mood:'fierce'},mouth:'line',hat:{t:'sunhelm',c:'#ffd23f',c2:'#e08a10'},cloth:{c:'#2a5a3a',c2:'#123a20',col:'uniform',trim:'#ffd23f'},extra:'medals',prop:'saber',pc:'#e8ecf4'},
 alquimista:{skin:'#e8b890',hair:{s:'spiky',c:'#3a6ad8',c2:'#1a3a8a'},eyes:{iris:'#28c8ff',mood:'sly'},mouth:'smirk',glasses:'forehead',gc:'#4ae0ff',cloth:{c:'#5a3a8a',c2:'#2a1a4a',col:'coat',trim:'#ffd23f'},prop:'flask',pc:'#4ae0ff'},
 tormenta:{skin:'#c8d0e8',hair:{s:'storm',c:'#5a6a8a',c2:'#2a3048'},eyes:{iris:'#28e8ff',mood:'fierce',glow:1},mouth:'smirk',cloth:{c:'#3a4a7a',c2:'#141c38',col:'gown',trim:'#fff27a'},extra:'lightning',prop:'orb',pc:'#28e8ff'},
 guardian:{skin:'#c8a080',age:1,hair:{s:'willow',c:'#8ad06a',c2:'#3a7a2a'},beard:{s:'long',c:'#f0f0e8'},eyes:{iris:'#7aff6a',mood:'calm'},mouth:'line',cloth:{c:'#5a7a4a',c2:'#2a4a1a',col:'robe',trim:'#c8e0a0'},prop:'staff',pc:'#7aff6a'},
 reina:{skin:'#f8d8c0',hair:{s:'longflow',c:'#ff9ac0',c2:'#c84a80'},eyes:{iris:'#2aa84a',mood:'happy'},mouth:'open',blush:1,hat:{t:'flowercrown',c:'#ffd0e0',c2:'#7ad04a'},cloth:{c:'#7ad08a',c2:'#2a7a4a',col:'gown',trim:'#ffe680'},extra:'petals',prop:'scepter',pc:'#ff8ab0'},
 dragon:{head:'dragon',skin:'#5ab84a',skin2:'#2a6a2a',eyes:{iris:'#ffd23f',mood:'fierce'},cloth:{c:'#2a6a2a',c2:'#0e3a10',col:'scales',trim:'#ffd23f'},extra:'smoke'},
 cronos:{skin:'#e0b890',age:1,hair:{s:'none'},beard:{s:'long',c:'#ffe680'},eyes:{iris:'#ffd23f',mood:'calm',glow:1},mouth:'line',hat:{t:'sundial',c:'#ffd23f',c2:'#a8700a'},cloth:{c:'#8a5a1a',c2:'#3a2408',col:'robe',trim:'#ffd23f'},prop:'hourglass',pc:'#ffe680'},
 oraculo:{skin:'#b8a8e0',hair:{s:'long',c:'#2a1a4a',c2:'#5a3a8a'},eyes:{iris:'#ff6aff',mood:'calm',glow:1},mouth:'line',hat:{t:'leafmask',c:'#4a9a4a',c2:'#1a4a1a'},cloth:{c:'#4a2a6a',c2:'#1a0a2a',col:'robe',trim:'#ff9aff'},extra:'thirdeye',prop:'orb',pc:'#ff6aff'}};
const BUST={};
function avBack(c,A){const h=A.hair||{};
 if(A.extra==='icewings')for(const sd of [-1,1])for(const [a,l] of [[-.5,70],[.1,55]]){c.save();c.translate(100+sd*24,130);c.scale(sd,1);c.rotate(-Math.PI+.35+a);c.globalAlpha=.8;petal(c,l,18,'point','#e8fbff','#7ac8f0');c.globalAlpha=1;c.restore()}
 if(h.s==='long'||h.s==='longflow'){c.beginPath();c.moveTo(56,80);c.bezierCurveTo(40,120,44,170,62,186);c.lineTo(138,186);c.bezierCurveTo(156,170,160,120,144,80);c.closePath();P(c,LG(c,0,60,0,190,[h.c,h.c2]),3);
  if(h.s==='longflow')for(const sd of [-1,1]){c.beginPath();c.moveTo(100+sd*44,100);c.bezierCurveTo(100+sd*70,130,100+sd*48,160,100+sd*66,190);c.strokeStyle=h.c2;c.lineWidth=3;c.stroke()}}
 if(h.s==='willow')for(let i=0;i<14;i++){const x0=60+i*6,sw=Math.sin(i*1.7)*6;c.beginPath();c.moveTo(x0,62);c.quadraticCurveTo(x0-18+sw,120,x0-24+i*.5+sw,178);c.strokeStyle=i%2?h.c:h.c2;c.lineWidth=5;c.stroke()}
 if(h.s==='storm')for(const [x,y,r] of [[58,74,24],[142,74,24],[100,46,30],[70,50,22],[130,50,22],[48,104,18],[152,104,18]]){E(c,x,y,r,r*.85);P(c,RG(c,x,y-4,r,[h.c,h.c2]),2.6)}
 if(A.hat&&A.hat.t==='hood'){c.beginPath();c.moveTo(48,190);c.bezierCurveTo(40,110,58,42,100,40);c.bezierCurveTo(142,42,160,110,152,190);c.closePath();P(c,LG(c,0,40,0,190,[A.hat.c,A.hat.c2]),3)}
 if(A.hat&&A.hat.t==='sundial'){c.save();c.translate(100,84);E(c,0,0,66,66);P(c,RG(c,0,0,66,['#fff6c0',A.hat.c,A.hat.c2]),3);c.strokeStyle='rgba(90,50,0,.6)';c.lineWidth=2;for(let i=0;i<12;i++){c.save();c.rotate(i*Math.PI/6);c.beginPath();c.moveTo(0,-56);c.lineTo(0,-64);c.stroke();c.restore()}
  c.font='bold 9px Georgia,serif';c.fillStyle='rgba(90,50,0,.75)';c.textAlign='center';c.textBaseline='middle';['XII','III','VI','IX'].forEach((s,i)=>{const a=-Math.PI/2+i*Math.PI/2;c.fillText(s,Math.cos(a)*50,Math.sin(a)*50)});c.restore()}}
function avCloth(c,A){const C=A.cloth;c.beginPath();c.moveTo(4,204);c.quadraticCurveTo(14,152,64,142);c.lineTo(136,142);c.quadraticCurveTo(186,152,196,204);c.closePath();P(c,LG(c,0,140,0,204,[C.c,C.c2]),3);
 switch(C.col){
 case 'shawl':c.beginPath();c.moveTo(54,146);c.quadraticCurveTo(100,196,146,146);c.quadraticCurveTo(100,172,54,146);P(c,C.trim,2.4);for(let i=0;i<5;i++){c.beginPath();c.moveTo(70+i*15,156+Math.abs(2-i)*-3);c.lineTo(72+i*15,168);c.strokeStyle='rgba(160,120,80,.5)';c.lineWidth=1.4;c.stroke()}break;
 case 'overalls':for(const sd of [-1,1]){RRp(c,100+sd*26-5,142,10,62,3);P(c,C.trim,2)}RRp(c,72,170,56,34,6);P(c,LG(c,0,170,0,204,['#6a8ad0','#3a5a98']),2.4);E(c,74,172,3,3);P(c,'#ffd23f',1);E(c,126,172,3,3);P(c,'#ffd23f',1);break;
 case 'v':c.beginPath();c.moveTo(82,142);c.lineTo(100,172);c.lineTo(118,142);P(c,'#f8e8d0',2);break;
 case 'patch':for(const [x,y,w2,h2,col] of [[40,170,18,16,'#c84a3a'],[140,162,16,18,'#e8c870'],[96,180,14,12,'#5a9a3a']]){RRp(c,x,y,w2,h2,2);P(c,col,1.6);c.setLineDash([3,2]);c.strokeStyle='#fff';c.lineWidth=1;c.strokeRect(x+2,y+2,w2-4,h2-4);c.setLineDash([])}break;
 case 'gown':c.beginPath();c.moveTo(66,142);c.quadraticCurveTo(100,170,134,142);c.strokeStyle=C.trim;c.lineWidth=4;c.stroke();E(c,100,160,6,6);P(c,RG(c,100,160,6,['#ffffff',C.trim,C.c2]),1.6);break;
 case 'stripes':c.save();c.beginPath();c.moveTo(4,204);c.quadraticCurveTo(14,152,64,142);c.lineTo(136,142);c.quadraticCurveTo(186,152,196,204);c.closePath();c.clip();c.fillStyle=C.trim;for(const y of [158,182])c.fillRect(0,y,200,11);c.restore();break;
 case 'apron':RRp(c,70,150,60,54,8);P(c,LG(c,0,150,0,204,['#c8a878','#7a5a38']),2.4);for(const sd of [-1,1]){c.beginPath();c.moveTo(100+sd*28,152);c.lineTo(100+sd*40,142);c.strokeStyle='#5a3a1a';c.lineWidth=4;c.stroke()}RRp(c,88,168,24,14,3);P(c,'#a87a4a',1.6);break;
 case 'robe':c.beginPath();c.moveTo(70,142);c.lineTo(100,180);c.lineTo(130,142);c.strokeStyle=C.trim;c.lineWidth=4;c.stroke();for(const sd of [-1,1]){c.beginPath();c.moveTo(100+sd*30,142);c.quadraticCurveTo(100+sd*44,130,100+sd*40,120);c.strokeStyle=C.c2;c.lineWidth=6;c.stroke()}break;
 case 'uniform':for(const sd of [-1,1]){RRp(c,100+sd*58-14,144,28,10,4);P(c,C.trim,2);for(let i=0;i<4;i++){c.beginPath();c.moveTo(100+sd*(46+i*4),154);c.lineTo(100+sd*(46+i*4),162);c.strokeStyle=C.trim;c.lineWidth=1.4;c.stroke()}}for(let i=0;i<3;i++){E(c,100,158+i*14,3,3);P(c,C.trim,1)}break;
 case 'coat':for(const sd of [-1,1]){c.beginPath();c.moveTo(100+sd*8,146);c.lineTo(100+sd*28,144);c.lineTo(100+sd*16,190);c.closePath();P(c,C.c2,2)}c.beginPath();c.moveTo(92,146);c.lineTo(100,170);c.lineTo(108,146);P(c,'#f0f0f0',1.6);RRp(c,96,146,8,6,2);P(c,C.trim,1.2);break;
 case 'scales':c.save();c.beginPath();c.moveTo(4,204);c.quadraticCurveTo(14,152,64,142);c.lineTo(136,142);c.quadraticCurveTo(186,152,196,204);c.closePath();c.clip();for(let y=148;y<210;y+=10)for(let x=(y/10%2)*8;x<210;x+=16){c.beginPath();c.arc(x,y,8,0,Math.PI);c.strokeStyle='rgba(255,220,80,.35)';c.lineWidth=1.6;c.stroke()}c.restore();break}
 if(A.extra==='medals')for(const [x,col] of [[64,'#ff3a3a'],[78,'#3ad8ff'],[92,'#ffd23f']]){RRp(c,x-3,150,6,9,1);P(c,col,1);star(c,x,164,5,'#ffd23f')}}
function avHead(c,A){const s=A.skin;
 if(A.head==='dragon'){c.save();for(const sd of [-1,1]){c.beginPath();c.moveTo(100+sd*20,52);c.quadraticCurveTo(100+sd*44,20,100+sd*38,6);c.quadraticCurveTo(100+sd*36,30,100+sd*10,56);c.closePath();P(c,LG(c,0,6,0,56,['#fff6c0','#c8a040']),2.4)}
  for(const sd of [-1,1])for(let i=0;i<4;i++){c.save();c.translate(100+sd*40,74+i*16);c.rotate(sd>0?-.3:Math.PI+.3);petal(c,22,8,'point','#8ae070','#2a6a1a');c.restore()}
  c.beginPath();c.moveTo(60,92);c.bezierCurveTo(56,44,144,44,140,92);c.bezierCurveTo(146,120,132,140,100,144);c.bezierCurveTo(68,140,54,120,60,92);P(c,RG(c,96,80,56,['#a8f08a',s,A.skin2]),3.2);
  RRp(c,74,108,52,30,14);P(c,LG(c,0,108,0,138,['#c8f0a8','#5ab84a']),2.6);for(const sd of [-1,1]){E(c,100+sd*10,116,3.4,2.4);c.fillStyle='#1a3a10';c.fill()}
  c.beginPath();c.moveTo(80,134);c.quadraticCurveTo(100,142,120,134);c.strokeStyle=OL;c.lineWidth=2.4;c.stroke();for(const sd of [-1,1]){c.beginPath();c.moveTo(100+sd*14,135);c.lineTo(100+sd*12,144);c.lineTo(100+sd*9,136);c.closePath();P(c,'#ffffff',1.2)}
  for(let i=0;i<5;i++){E(c,84+i*8,62,3,2);c.fillStyle='rgba(20,60,10,.35)';c.fill()}c.restore();return{ey:88,es:20}}
 if(A.head==='burlap'){c.beginPath();c.moveTo(62,60);c.quadraticCurveTo(100,46,138,60);c.quadraticCurveTo(146,100,136,132);c.quadraticCurveTo(100,146,64,132);c.quadraticCurveTo(54,100,62,60);P(c,LG(c,0,50,0,140,['#ead2a0',s,'#a8884a']),3.2);
  c.strokeStyle='rgba(120,90,40,.35)';c.lineWidth=1;for(let i=0;i<9;i++){c.beginPath();c.moveTo(62,62+i*9);c.lineTo(138,60+i*9);c.stroke();c.beginPath();c.moveTo(66+i*9,54);c.lineTo(64+i*9,138);c.stroke()}
  c.beginPath();c.moveTo(60,128);c.quadraticCurveTo(100,142,140,128);c.strokeStyle='#7a5a2a';c.lineWidth=4;c.stroke();for(let i=0;i<7;i++){c.beginPath();c.moveTo(66+i*11,128+Math.sin(i)*2);c.lineTo(62+i*11,140);c.strokeStyle='#e8c870';c.lineWidth=2;c.stroke()}return{ey:92,es:16}}
 for(const sd of [-1,1]){E(c,100+sd*36,98,7,10);P(c,s,2.4)}
 E(c,100,94,36,42);P(c,RG(c,94,84,46,['#ffffff',s,A.age?'#b8886a':'#d89a78'],88,70),3.2);
 if(A.blush)blush(c,100,110,24);
 if(A.age){c.strokeStyle='rgba(120,70,40,.4)';c.lineWidth=1.2;for(const sd of [-1,1]){c.beginPath();c.moveTo(100+sd*27,88);c.lineTo(100+sd*31,86);c.moveTo(100+sd*27,92);c.lineTo(100+sd*31,93);c.stroke()}c.beginPath();c.moveTo(86,70);c.quadraticCurveTo(100,67,114,70);c.stroke()}
 return{ey:90,es:15}}
function avFace(c,A,F){const E2=A.eyes,ey=F.ey;
 if(E2.glow){c.globalAlpha=.5;for(const sd of [-1,1])circ(c,100+sd*F.es,ey,13,E2.iris);c.globalAlpha=1}
 if(A.hat&&A.hat.t==='leafmask'){c.beginPath();c.moveTo(56,ey-4);c.bezierCurveTo(70,ey-22,130,ey-22,144,ey-4);c.bezierCurveTo(130,ey+14,70,ey+14,56,ey-4);P(c,LG(c,0,ey-20,0,ey+14,[A.hat.c,A.hat.c2]),2.4);
  for(const sd of [-1,1]){c.save();c.translate(100+sd*44,ey-6);c.rotate(sd>0?-.5:Math.PI+.5);petal(c,20,7,'point',A.hat.c,A.hat.c2);c.restore()}}
 eyesHQ(c,100,ey,F.es,9,10,E2.iris,E2.mood,A.head==='dragon'?A.skin:A.skin);
 if(A.head==='dragon')return;
 c.beginPath();c.arc(100,ey+15,3.4,.25,Math.PI-.25);c.strokeStyle='rgba(90,40,20,.55)';c.lineWidth=2;c.stroke();
 if(A.mouth==='stitch'){c.beginPath();c.moveTo(82,ey+28);c.quadraticCurveTo(100,ey+36,118,ey+28);c.strokeStyle='#3a2a10';c.lineWidth=2.4;c.stroke();for(let i=0;i<6;i++){c.beginPath();c.moveTo(85+i*6,ey+27);c.lineTo(87+i*6,ey+35);c.stroke()}}
 else mouthHQ(c,100,ey+27,A.mouth||'line',10)}
function avBeard(c,A,F){const B=A.beard;if(!B)return;const y=F.ey;c.fillStyle=B.c;
 switch(B.s){
 case 'full':c.beginPath();c.moveTo(64,y+6);c.quadraticCurveTo(64,y+52,100,y+56);c.quadraticCurveTo(136,y+52,136,y+6);c.quadraticCurveTo(128,y+30,116,y+34);c.quadraticCurveTo(100,y+24,84,y+34);c.quadraticCurveTo(72,y+30,64,y+6);P(c,LG(c,0,y,0,y+56,[B.c,'#4a2a10']),2.6);break;
 case 'mustache':for(const sd of [-1,1]){c.beginPath();c.moveTo(100,y+20);c.quadraticCurveTo(100+sd*14,y+16,100+sd*22,y+26);c.quadraticCurveTo(100+sd*12,y+26,100,y+24);P(c,B.c,2)}break;
 case 'bigmustache':for(const sd of [-1,1]){c.beginPath();c.moveTo(100,y+19);c.bezierCurveTo(100+sd*16,y+12,100+sd*30,y+20,100+sd*36,y+10);c.bezierCurveTo(100+sd*32,y+28,100+sd*14,y+28,100,y+24);P(c,B.c,2.2)}break;
 case 'long':c.beginPath();c.moveTo(70,y+14);c.quadraticCurveTo(66,y+70,100,y+100);c.quadraticCurveTo(134,y+70,130,y+14);c.quadraticCurveTo(116,y+34,100,y+30);c.quadraticCurveTo(84,y+34,70,y+14);P(c,LG(c,0,y,0,y+100,['#ffffff',B.c]),2.6);
  c.strokeStyle='rgba(0,0,0,.12)';c.lineWidth=1.2;for(const xx of [88,100,112]){c.beginPath();c.moveTo(xx,y+36);c.lineTo(xx+(xx-100)*.3,y+90);c.stroke()}
  for(const sd of [-1,1]){c.beginPath();c.moveTo(100,y+20);c.quadraticCurveTo(100+sd*16,y+16,100+sd*24,y+28);c.quadraticCurveTo(100+sd*12,y+26,100,y+24);P(c,B.c,2)}break;
 case 'roots':for(let i=0;i<9;i++){const x=72+i*7;c.beginPath();c.moveTo(x,y+22);c.bezierCurveTo(x+Math.sin(i)*6,y+44,x-Math.sin(i*2)*8,y+62,x+Math.sin(i*3)*4,y+70+i%3*6);c.strokeStyle=OL;c.lineWidth=5;c.stroke();c.strokeStyle=B.c;c.lineWidth=3;c.stroke()}break}}
function avHair(c,A){const h=A.hair;if(!h)return;
 switch(h.s){
 case 'bun':for(const [x,y,r] of [[70,64,15],[86,54,16],[104,50,16],[120,56,15],[132,68,13],[100,30,15]]){E(c,x,y,r,r*.9);P(c,RG(c,x-3,y-4,r,['#ffffff',h.c,h.c2]),2.4)}break;
 case 'short':c.beginPath();c.moveTo(64,92);c.bezierCurveTo(56,44,144,44,136,92);c.lineTo(130,72);c.lineTo(120,80);c.lineTo(110,68);c.lineTo(98,78);c.lineTo(86,68);c.lineTo(76,80);c.lineTo(68,72);c.closePath();P(c,LG(c,0,50,0,90,[h.c,h.c2||'#2a1a0a']),2.6);break;
 case 'bob':c.beginPath();c.moveTo(60,118);c.bezierCurveTo(48,40,152,40,140,118);c.lineTo(132,118);c.bezierCurveTo(134,86,124,76,100,74);c.bezierCurveTo(76,76,66,86,68,118);c.closePath();P(c,LG(c,0,50,0,118,[h.c,h.c2]),2.6);break;
 case 'long':case 'longflow':c.beginPath();c.moveTo(62,104);c.bezierCurveTo(52,44,148,44,138,104);c.bezierCurveTo(130,74,116,64,100,70);c.bezierCurveTo(84,64,70,74,62,104);P(c,LG(c,0,50,0,104,[h.c,h.c2]),2.6);break;
 case 'spiky':for(let i=0;i<7;i++){const a=-Math.PI+.3+i*(Math.PI-.6)/6;c.beginPath();c.moveTo(100+Math.cos(a)*30,92+Math.sin(a)*34);c.lineTo(100+Math.cos(a)*56,86+Math.sin(a)*58);c.lineTo(100+Math.cos(a+.25)*32,92+Math.sin(a+.25)*36);c.closePath();P(c,LG(c,0,30,0,80,[h.c,h.c2]),2.2)}
  c.beginPath();c.moveTo(64,86);c.bezierCurveTo(60,50,140,50,136,86);c.quadraticCurveTo(100,70,64,86);P(c,h.c,2.4);break;
 case 'moss':for(const [x,y,r] of [[70,70,14],[86,58,15],[104,54,16],[122,60,15],[134,74,12]]){E(c,x,y,r,r*.85);P(c,RG(c,x,y,r,[h.c,h.c2]),2.2)}for(const [x,y] of [[80,46],[118,46]])leafHQ(c,x,y,12,-1.2,'#8ae06a','#2a6a1a');break;
 case 'storm':for(const [x,y,r] of [[76,62,18],[100,54,20],[124,62,18]]){E(c,x,y,r,r*.8);P(c,RG(c,x,y-4,r,[h.c,h.c2]),2.4)}break;
 case 'willow':for(let i=0;i<9;i++){const x0=66+i*8.5;c.beginPath();c.moveTo(x0,58);c.quadraticCurveTo(x0+4,74,x0-2+Math.sin(i)*3,92);c.strokeStyle=i%2?h.c:h.c2;c.lineWidth=5;c.lineCap='round';c.stroke()}
  c.beginPath();c.moveTo(64,74);c.bezierCurveTo(60,46,140,46,136,74);c.quadraticCurveTo(100,62,64,74);P(c,h.c,2.4);break;
 case 'none':shine(c,88,62,10,5,-.3,.35);break}}
function avHat(c,A){const H=A.hat;if(!H)return;
 switch(H.t){
 case 'cap':c.beginPath();c.moveTo(62,76);c.bezierCurveTo(60,36,140,36,138,76);c.closePath();P(c,LG(c,0,40,0,76,[H.c,H.c2]),2.6);c.beginPath();c.moveTo(110,74);c.quadraticCurveTo(150,70,160,82);c.quadraticCurveTo(140,84,110,80);c.closePath();P(c,H.c2,2.2);E(c,100,40,5,3);P(c,H.c2,1.4);break;
 case 'straw':E(c,100,64,72,16);P(c,LG(c,0,48,0,80,['#f8e0a0',H.c,H.c2]),2.6);c.beginPath();c.moveTo(66,64);c.bezierCurveTo(66,24,134,24,134,64);c.closePath();P(c,LG(c,0,28,0,64,['#f8e0a0',H.c]),2.6);RRp(c,66,52,68,9,2);P(c,'#c83a2a',1.6);
  c.strokeStyle='rgba(140,100,40,.45)';c.lineWidth=1;for(let i=0;i<10;i++){c.beginPath();c.moveTo(40+i*12,62);c.lineTo(46+i*12,72);c.stroke()}break;
 case 'pointy':c.beginPath();c.moveTo(48,66);c.quadraticCurveTo(100,56,152,66);c.quadraticCurveTo(100,78,48,66);P(c,H.c,2.4);c.beginPath();c.moveTo(70,64);c.quadraticCurveTo(84,30,118,6);c.quadraticCurveTo(116,36,130,64);c.closePath();P(c,LG(c,0,6,0,64,[H.c,H.c2]),2.6);
  RRp(c,96,40,14,12,2);P(c,'#c84a3a',1.4);for(const [x,a] of [[56,2.6],[146,.5],[76,2.2]]){c.beginPath();c.moveTo(x,66);c.lineTo(x+Math.cos(a)*14,66+Math.sin(a)*14);c.strokeStyle='#e8c870';c.lineWidth=2;c.stroke()}break;
 case 'tiara':c.beginPath();c.moveTo(70,62);c.lineTo(80,50);c.lineTo(88,58);c.lineTo(100,38);c.lineTo(112,58);c.lineTo(120,50);c.lineTo(130,62);c.quadraticCurveTo(100,56,70,62);P(c,LG(c,0,38,0,62,[H.c,'#9ab8d8']),2);for(const [x,y] of [[100,48],[80,54],[120,54]]){E(c,x,y,3,3);P(c,H.c2,1.2)}break;
 case 'pilot':c.beginPath();c.moveTo(60,96);c.bezierCurveTo(54,36,146,36,140,96);c.lineTo(130,96);c.bezierCurveTo(130,66,118,58,100,58);c.bezierCurveTo(82,58,70,66,70,96);c.closePath();P(c,LG(c,0,40,0,96,[H.c,H.c2]),2.6);
  for(const sd of [-1,1]){RRp(c,100+sd*36-6,92,12,26,5);P(c,H.c2,2)}break;
 case 'bandana':RRp(c,62,60,76,14,6);P(c,H.c,2.2);for(let i=0;i<6;i++){E(c,72+i*11,67,2,2);c.fillStyle='#ffffff';c.fill()}c.beginPath();c.moveTo(136,66);c.lineTo(152,58);c.lineTo(150,72);c.closePath();P(c,H.c,1.8);break;
 case 'hood':c.beginPath();c.moveTo(56,110);c.bezierCurveTo(54,52,146,52,144,110);c.bezierCurveTo(140,74,124,62,100,62);c.bezierCurveTo(76,62,60,74,56,110);P(c,LG(c,0,40,0,110,[H.c,H.c2]),2.6);break;
 case 'sunhelm':for(let i=0;i<11;i++){const a=-Math.PI+.15+i*(Math.PI-.3)/10;c.save();c.translate(100+Math.cos(a)*34,72+Math.sin(a)*30);c.rotate(a);petal(c,20,6,'point',H.c,H.c2);c.restore()}
  c.beginPath();c.moveTo(62,80);c.bezierCurveTo(60,40,140,40,138,80);c.closePath();P(c,LG(c,0,42,0,80,['#8a6a3a','#4a2a10']),2.6);RRp(c,60,74,80,9,3);P(c,H.c,2);star(c,100,58,8,'#fff3a0');break;
 case 'flowercrown':for(let i=0;i<7;i++){const x=64+i*12,y=62-Math.sin(i/6*Math.PI)*8;leafHQ(c,x,y+4,10,i%2?-.4:-2.6,H.c2,'#2a6a1a');c.save();c.translate(x,y);for(let p2=0;p2<5;p2++){c.save();c.rotate(p2/5*Math.PI*2);petal(c,7,3.6,'round',i%2?H.c:'#ffffff','#e870a0');c.restore()}E(c,0,0,2.4,2.4);P(c,'#ffe14a',1);c.restore()}break}}
function avProp(c,A){const pc=A.pc;
 switch(A.prop){
 case 'umbrella':c.save();c.translate(162,150);c.rotate(-.35);RRp(c,-2,-6,4,52,2);P(c,'#7a5a3a',1.6);c.beginPath();c.moveTo(0,-8);c.quadraticCurveTo(-26,-14,-24,-46);c.quadraticCurveTo(0,-60,24,-46);c.quadraticCurveTo(26,-14,0,-8);P(c,LG(c,-24,0,24,0,[pc,'#2a7ab8']),2.4);c.restore();break;
 case 'shears':c.save();c.translate(160,160);for(const r of [-.25,.25]){c.save();c.rotate(r-.6);c.beginPath();c.moveTo(0,0);c.lineTo(4,-44);c.lineTo(-3,-44);c.closePath();P(c,LG(c,-3,0,4,0,['#ffffff',pc]),1.6);E(c,0,10,6,8);c.strokeStyle='#c83a2a';c.lineWidth=4;c.stroke();c.restore()}c.restore();break;
 case 'seedbag':c.save();c.translate(160,170);c.beginPath();c.moveTo(-18,-6);c.quadraticCurveTo(-24,30,0,32);c.quadraticCurveTo(24,30,18,-6);c.closePath();P(c,LG(c,0,-6,0,32,['#c8a070',pc]),2.4);RRp(c,-14,-12,28,8,3);P(c,'#7a5a2a',1.6);for(const [x,y] of [[-6,-16],[3,-18],[10,-15]]){E(c,x,y,3,2.2);P(c,'#e8c870',1)}c.restore();break;
 case 'crow':c.save();c.translate(156,140);E(c,0,0,16,11);P(c,LG(c,0,-10,0,10,['#4a4a58',pc]),2.4);E(c,12,-8,8,7);P(c,pc,2);c.beginPath();c.moveTo(18,-8);c.lineTo(28,-5);c.lineTo(18,-4);c.closePath();P(c,'#ffb02a',1.2);E(c,14,-10,2,2);c.fillStyle='#fff';c.fill();c.restore();break;
 case 'wand':c.save();c.translate(160,172);c.rotate(-.4);RRp(c,-2,-40,4,44,2);P(c,'#e8f4ff',1.4);star(c,0,-46,10,pc);c.restore();break;
 case 'pollen':c.save();c.translate(160,166);E(c,0,0,15,15);P(c,RG(c,0,0,15,['#ffffff',pc,'#c88a10']),2.4);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;E(c,Math.cos(a)*15,Math.sin(a)*15,2.6,2.6);c.fillStyle='#ffd23f';c.fill()}c.restore();break;
 case 'hammer':c.save();c.translate(160,176);c.rotate(-.5);RRp(c,-3,-44,6,52,3);P(c,'#7a5a3a',1.6);RRp(c,-16,-58,32,18,4);P(c,LG(c,0,-58,0,-40,['#d8d8e0',pc]),2.4);c.restore();break;
 case 'orb':c.save();c.translate(160,166);c.globalAlpha=.35;circ(c,0,0,24,pc);c.globalAlpha=1;E(c,0,0,15,15);P(c,RG(c,-4,-4,16,['#ffffff',pc,'#1a1a3a'],-5,-6),2.2);c.restore();break;
 case 'saber':c.save();c.translate(166,190);c.rotate(-.5);c.beginPath();c.moveTo(-2,0);c.quadraticCurveTo(6,-40,-2,-80);c.lineTo(4,-80);c.quadraticCurveTo(12,-40,4,0);c.closePath();P(c,LG(c,-2,0,6,0,['#ffffff',pc]),1.6);RRp(c,-10,-2,20,6,2);P(c,'#ffd23f',1.4);c.restore();break;
 case 'flask':c.save();c.translate(160,168);c.beginPath();c.moveTo(-5,-22);c.lineTo(-5,-10);c.lineTo(-16,12);c.quadraticCurveTo(0,20,16,12);c.lineTo(5,-10);c.lineTo(5,-22);c.closePath();P(c,'rgba(220,250,255,.6)',2.2);c.save();c.clip();c.fillStyle=LG(c,0,0,0,16,['#ffffff',pc]);c.fillRect(-20,0,40,20);c.restore();RRp(c,-6,-26,12,6,2);P(c,'#9a6a3a',1.4);c.restore();break;
 case 'staff':c.save();c.translate(166,200);c.rotate(-.12);RRp(c,-3,-110,6,112,3);P(c,LG(c,-3,0,3,0,['#a87a4a','#5a3a1a']),1.8);c.globalAlpha=.4;circ(c,0,-116,14,pc);c.globalAlpha=1;E(c,0,-116,7,7);P(c,RG(c,0,-116,7,['#ffffff',pc]),1.6);c.restore();break;
 case 'scepter':c.save();c.translate(164,200);c.rotate(-.15);RRp(c,-2.6,-90,5.2,92,2.6);P(c,LG(c,-3,0,3,0,['#fff6b0','#c88a10']),1.6);for(let i=0;i<6;i++){c.save();c.translate(0,-96);c.rotate(i/6*Math.PI*2);petal(c,12,5,'round',pc,'#c84a80');c.restore()}E(c,0,-96,4,4);P(c,'#ffe14a',1);c.restore();break;
 case 'hourglass':c.save();c.translate(160,166);RRp(c,-14,-26,28,5,2);P(c,'#a8700a',1.4);RRp(c,-14,21,28,5,2);P(c,'#a8700a',1.4);c.beginPath();c.moveTo(-11,-21);c.lineTo(11,-21);c.lineTo(2,0);c.lineTo(11,21);c.lineTo(-11,21);c.lineTo(-2,0);c.closePath();P(c,'rgba(230,245,255,.6)',1.8);
  c.beginPath();c.moveTo(-8,-18);c.lineTo(8,-18);c.lineTo(0,-4);c.closePath();c.fillStyle=pc;c.fill();c.beginPath();c.moveTo(-9,19);c.lineTo(9,19);c.lineTo(0,10);c.closePath();c.fill();c.restore();break}}
function avExtra(c,A){switch(A.extra){
 case 'raincloud':for(const [x,y,r] of [[28,40,12],[42,34,15],[56,40,12]]){E(c,x,y,r,r*.8);P(c,'#e8f0fa',2)}for(let i=0;i<4;i++){c.beginPath();c.moveTo(32+i*8,52);c.lineTo(29+i*8,62);c.strokeStyle='#5cc8ff';c.lineWidth=2.4;c.stroke()}break;
 case 'straw':for(const [x,y,a] of [[60,132,2.4],[66,136,2.1],[140,132,.7],[134,136,1]]){c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*16,y+Math.sin(a)*16);c.strokeStyle='#e8c870';c.lineWidth=2.4;c.stroke()}break;
 case 'antenna':for(const sd of [-1,1]){c.beginPath();c.moveTo(100+sd*12,48);c.quadraticCurveTo(100+sd*20,20,100+sd*30,14);c.strokeStyle=OL;c.lineWidth=3.6;c.stroke();c.strokeStyle='#3a2a1a';c.lineWidth=2;c.stroke();E(c,100+sd*30,14,5,5);P(c,'#ffd23f',1.6)}break;
 case 'lightning':for(const [x,y] of [[52,52],[146,48]]){c.beginPath();c.moveTo(x,y);c.lineTo(x+8,y+12);c.lineTo(x+2,y+13);c.lineTo(x+10,y+28);c.lineTo(x-2,y+14);c.lineTo(x+4,y+13);c.closePath();P(c,'#fff27a',1.4)}break;
 case 'petals':for(const [x,y,r] of [[34,54,.4],[166,70,1.2],[40,120,2],[170,128,.8]]){c.save();c.translate(x,y);c.rotate(r);petal(c,10,5,'round','#ffd0e4','#ff8ab0');c.restore()}break;
 case 'smoke':for(const [x,y,r] of [[84,104,6],[116,104,6],[78,94,8],[122,94,8]]){c.globalAlpha=.4;circ(c,x+(x<100?-6:6),y-12,r,'#dfe8d0');c.globalAlpha=1}break;
 case 'thirdeye':E(c,100,64,7,9);P(c,'#ffffff',2);E(c,100,65,4,6);P(c,RG(c,100,65,5,['#ffffff','#ff6aff','#3a0a3a']),1.2);c.globalAlpha=.35;circ(c,100,64,14,'#ff6aff');c.globalAlpha=1;break;
 case 'sparks':for(const [x,y] of [[150,120],[170,140],[146,146]])star(c,x,y,4,'#ffd23f');break}}
function avGlasses(c,A,F){if(!A.glasses)return;const ey=F.ey;
 if(A.glasses==='round'){for(const sd of [-1,1]){E(c,100+sd*15,ey,12,11);c.strokeStyle='#5a3a1a';c.lineWidth=2.4;c.stroke();E(c,100+sd*15-3,ey-3,3,2);c.fillStyle='rgba(255,255,255,.5)';c.fill()}c.beginPath();c.moveTo(97,ey-2);c.lineTo(103,ey-2);c.stroke()}
 else{const y=ey-24;RRp(c,62,y-4,76,8,4);P(c,'#3a2a1a',1.6);for(const sd of [-1,1]){E(c,100+sd*15,y,12,10);P(c,'#5a5a64',2.2);E(c,100+sd*15,y,8,7);P(c,RG(c,100+sd*15,y,8,['#ffffff',A.gc||'#7ad8ff','#0a3a5a']),1.2)}}}
// Avatar de comandante en capas (estilo Heroic Toy): fondo, cuerpo, cabeza, objeto y efectos flotantes.
// Cada capa lleva la pasada de volumen y su propio contorno grueso; drawAvatar las anima por separado.
const AVL={};
function avOutline(cv,th){const sil=document.createElement('canvas');sil.width=cv.width;sil.height=cv.height;const s=sil.getContext('2d');s.drawImage(cv,0,0);s.globalCompositeOperation='source-in';s.fillStyle='#170b04';s.fillRect(0,0,sil.width,sil.height);
 const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const q=o.getContext('2d');for(let i=0;i<16;i++){const an=i/16*Math.PI*2;q.drawImage(sil,Math.cos(an)*th,Math.sin(an)*th)}q.drawImage(cv,0,0);return o}
function avLayer(draw,cx,cy,rr,k){const cv=document.createElement('canvas');cv.width=cv.height=400;const c=cv.getContext('2d');c.scale(2,2);c.lineJoin='round';c.lineCap='round';
 let res;PSTY=1;try{res=litLayer(cv,2,draw,cx,cy,rr,k)}finally{PSTY=0}return{cv:avOutline(cv,2.4*2),res}}
const AV_FLOAT={raincloud:1,lightning:1,petals:1,smoke:1,sparks:1},AV_HEADX={antenna:1,thirdeye:1};
function bustLayers(k){if(AVL[k])return AVL[k];const A=AV[k],T=TIERS[CMDS[k].t];
 const bg=document.createElement('canvas');bg.width=bg.height=400;{const c=bg.getContext('2d');c.scale(2,2);c.beginPath();c.arc(100,100,96,0,7);c.clip();c.fillStyle=RG(c,100,86,120,['#ffffff',T.col,T.c2],100,50);c.fillRect(0,0,200,200);
  E(c,100,206,80,24);c.fillStyle='rgba(20,8,0,.35)';c.fill()}
 const body=avLayer(c=>{avBack(c,A);avCloth(c,A);if(A.head!=='dragon'){RRp(c,86,124,28,24,8);P(c,A.skin,2.4)}AO(c,100,138,22,8,.5);if(A.extra==='straw')avExtra(c,A)},100,170,60,.8).cv;
 const hd=avLayer(c=>{const F=avHead(c,A);avBeard(c,A,F);avFace(c,A,F);avGlasses(c,A,F);avHair(c,A);avHat(c,A);if(AV_HEADX[A.extra])avExtra(c,A);return F},100,82,52,1);
 const prop=A.prop?avLayer(c=>avProp(c,A),160,150,40,1).cv:null;
 let fx=null;if(AV_FLOAT[A.extra]){fx=document.createElement('canvas');fx.width=fx.height=400;const c=fx.getContext('2d');c.scale(2,2);c.lineJoin='round';PSTY=1;try{avExtra(c,A)}finally{PSTY=0}}
 return AVL[k]={bg,body,head:hd.cv,prop,fx,ey:(hd.res&&hd.res.ey)||80}}
// Dibuja las capas con animación: respiración elástica del cuerpo, cabeza con retraso e inclinación,
// objeto en la mano con más retraso (superposición) y efectos flotando; ph=null = pose quieta.
function avCompose(c,k,ph){const Ls=bustLayers(k),A=AV[k];c.save();c.beginPath();c.arc(100,100,96,0,7);c.clip();c.drawImage(Ls.bg,0,0,200,200);
 const br=ph==null?0:Math.sin(ph*2.2),lag=ph==null?0:Math.sin(ph*2.2-.9),lag2=ph==null?0:Math.sin(ph*2.2-1.5),tilt=ph==null?0:Math.sin(ph*.9)*.035;
 if(ph!=null){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.1;c.translate(100,86);c.rotate(ph*.15);c.fillStyle='#ffffff';for(let i=0;i<12;i++){c.rotate(Math.PI/6);c.beginPath();c.moveTo(0,0);c.lineTo(-12,-150);c.lineTo(12,-150);c.closePath();c.fill()}c.restore()}
 else{c.save();c.globalAlpha=.14;c.fillStyle='#ffffff';for(let i=0;i<12;i++){c.save();c.translate(100,86);c.rotate(i*Math.PI/6);c.beginPath();c.moveTo(0,0);c.lineTo(-12,-150);c.lineTo(12,-150);c.closePath();c.fill();c.restore()}c.restore()}
 c.save();c.translate(100,200);c.scale(1-br*.015,1+br*.026);c.translate(-100,-200);c.drawImage(Ls.body,0,0,200,200);c.restore();
 c.save();c.translate(100,132-br*1.9+lag*1.2);c.rotate(tilt);c.translate(-100,-132);c.drawImage(Ls.head,0,0,200,200);c.restore();
 if(Ls.prop){c.save();c.translate(158,180-br*1.4+lag2*2.2);c.rotate(lag2*.04);c.translate(-158,-180);c.drawImage(Ls.prop,0,0,200,200);c.restore();
  if(ph!=null&&/orb|wand|staff|scepter|pollen|hourglass/.test(A.prop)){c.save();c.globalCompositeOperation='lighter';const pg={orb:[160,166],wand:[142,130],staff:[152,85],scepter:[150,105],pollen:[160,166],hourglass:[160,166]}[A.prop];
   c.globalAlpha=.3+.15*Math.sin(ph*3);circ(c,pg[0],pg[1]-br*1.4+lag2*2.2,20,A.pc||'#ffe14a');c.restore()}}
 if(Ls.fx){c.save();c.translate(0,ph==null?0:Math.sin(ph*1.6)*2.5);c.drawImage(Ls.fx,0,0,200,200);c.restore()}
 c.restore()}
// ===================== RETRATOS ÉPICOS DE COMANDANTE =====================
// Espacio lógico de 240x280 con el marco centrado en (120,150). La figura se recorta con el círculo SOLO por debajo del centro:
// lo que queda por encima (pelo, capucha, pétalos) y el objeto de la mano salen del marco (efecto 3D). Capas cacheadas:
// fondo temático, marco ornamentado, cuerpo, cabeza, objeto y sombra; los efectos se dibujan en vivo con mezcla aditiva.
const PCX=120,PCY=150,PRO=96,PRI=82,PW=240,PH=280,PS=2,HPC={};
function pCanvas(){const cv=document.createElement('canvas');cv.width=PW*PS;cv.height=PH*PS;const c=cv.getContext('2d');c.scale(PS,PS);c.lineJoin='round';c.lineCap='round';return [cv,c]}
function pLayer(draw,cx,cy,rr,k){const [cv]=pCanvas();PSTY=1;try{litLayer(cv,PS,draw,cx,cy,rr,k)}finally{PSTY=0}return avOutline(cv,2.6*PS)}
function pRaw(draw){const [cv,c]=pCanvas();PSTY=1;try{draw(c)}finally{PSTY=0}return cv}
function pMask(c){c.beginPath();c.arc(PCX,PCY,PRI+.5,0,Math.PI*2);c.rect(-80,-80,PW+160,PCY+80);c.clip()}
function pHash(n){const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function pZig(c,x0,y0,x1,y1,seed,amp,n){c.beginPath();c.moveTo(x0,y0);for(let i=1;i<n;i++){const f=i/n;c.lineTo(x0+(x1-x0)*f+(pHash(seed+i)-.5)*amp,y0+(y1-y0)*f+(pHash(seed+i+50)-.5)*amp)}c.lineTo(x1,y1)}
function pBolt(c,x,y,s,col){c.beginPath();c.moveTo(x-s*.2,y-s);c.lineTo(x+s*.45,y-s*.1);c.lineTo(x+s*.05,y);c.lineTo(x+s*.35,y+s);c.lineTo(x-s*.45,y+s*.05);c.lineTo(x-s*.05,y-s*.05);c.closePath();P(c,col,1.6)}
function pCloud(cc,pts){cc.beginPath();for(const [x,y,r] of pts){cc.moveTo(x+r,y);cc.arc(x,y,r,0,Math.PI*2)}}
// Nube con volumen: relleno único de la unión (sin líneas internas) + sombra inferior y brillo superior en cada bulto.
function pCloudVol(c,pts,col,lt,dk){const [a,b,c2,d]=pBB(pts),w=c2-a,h=d-b;pCloud(c,pts);c.fillStyle=RG(c,(a+c2)/2,(b+d)/2,Math.max(w,h)*.72,[lt,col,dk],a+w*.24,b+h*.2);c.fill();
 c.save();pCloud(c,pts);c.clip();for(const [x,y,r] of pts){c.beginPath();c.arc(x+r*.06,y+r*.12,r*.9,.15,Math.PI*.85);c.strokeStyle='rgba(40,52,86,.22)';c.lineWidth=2.6;c.stroke()}
 for(const [x,y,r] of pts){c.beginPath();c.arc(x,y,r*.78,Math.PI*1.1,Math.PI*1.6);c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1.8;c.stroke()}c.restore()}
function pBB(pts){let a=1e9,b=1e9,c2=-1e9,d=-1e9;for(const [x,y,r] of pts){a=Math.min(a,x-r);b=Math.min(b,y-r);c2=Math.max(c2,x+r);d=Math.max(d,y+r)}return [a,b,c2,d]}
function pGlow(c,x,y,r,rgb,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
// Torso en 3/4: el hombro delantero (izquierda) es más grande que el trasero.
function pTorso(cc,sh){sh=sh||0;cc.beginPath();cc.moveTo(14,272);cc.bezierCurveTo(16,220,36,190,76,182+sh);cc.quadraticCurveTo(114,172,152,180);cc.bezierCurveTo(184,188,200,220,204,272);cc.closePath()}
// Ojo almendrado con iris anillado, doble brillo especular, sombra del párpado y párpado inclinado (lidA/lidB = altura en cada extremo).
function pEye(c,x,y,rx,ry,iris,lidA,lidB,skin){const sh=cc=>{cc.beginPath();cc.moveTo(x-rx,y+ry*.1);cc.bezierCurveTo(x-rx*.6,y-ry*1.3,x+rx*.6,y-ry*1.3,x+rx,y-ry*.1);cc.bezierCurveTo(x+rx*.5,y+ry*1.1,x-rx*.5,y+ry*1.1,x-rx,y+ry*.1);cc.closePath()};
 c.save();sh(c);c.fillStyle='#fffaf0';c.fill();c.clip();
 const ix=x+rx*.14,iy=y+ry*.08,ir=ry*.92;E(c,ix,iy,ir,ir);c.fillStyle=RG(c,ix,iy,ir,['#ffffff',iris,cshift(iris,-.65)],ix,iy+ir*.45);c.fill();
 E(c,ix,iy,ir*.46,ir*.46);c.fillStyle='#080404';c.fill();
 E(c,ix-ir*.38,iy-ir*.38,ir*.3,ir*.24);c.fillStyle='#fff';c.fill();E(c,ix+ir*.36,iy+ir*.34,ir*.13,ir*.13);c.fill();
 E(c,x,y-ry*1.2,rx*1.4,ry*.9);c.fillStyle='rgba(60,20,0,.2)';c.fill();
 c.beginPath();c.moveTo(x-rx-3,y-ry*3);c.lineTo(x+rx+3,y-ry*3);c.lineTo(x+rx+3,y-ry*lidB);c.lineTo(x-rx-3,y-ry*lidA);c.closePath();c.fillStyle=cshift(skin,-.06);c.fill();c.restore();
 sh(c);c.strokeStyle=cshift(skin,-.6);c.lineWidth=1.1;c.stroke();
 c.beginPath();c.moveTo(x-rx-1,y-ry*Math.min(lidA,.95)+.5);c.lineTo(x+rx+1,y-ry*Math.min(lidB,.95)+.5);c.strokeStyle='#22100a';c.lineWidth=2.2;c.stroke()}

// ---------- Fondos temáticos (dentro del círculo, con viñeta y profundidad) ----------
function pBg(c,kind){c.save();c.beginPath();c.arc(PCX,PCY,PRI+1,0,7);c.clip();
 switch(kind){
 case 'storm':{c.fillStyle=LG(c,0,PCY-PRI,0,PCY+PRI,['#34508a','#1a2c58','#0a1228']);c.fillRect(0,0,PW,PH);
  pGlow(c,110,96,120,'150,200,255',.45);
  for(let i=0;i<9;i++){const x=30+pHash(i)*180,y=70+pHash(i+20)*60,r=18+pHash(i+40)*22;E(c,x,y+6,r*1.3,r*.7);c.fillStyle='rgba(8,14,34,.55)';c.fill();E(c,x-4,y,r*1.1,r*.5);c.fillStyle='rgba(110,140,200,.22)';c.fill()}
  c.save();c.globalCompositeOperation='lighter';for(const [x,y,s] of [[46,80,1],[194,104,2],[66,150,3]]){pZig(c,x,y,x+(pHash(s)-.5)*30,y+60,s*10,14,6);c.strokeStyle='rgba(170,220,255,.5)';c.lineWidth=1.6;c.stroke();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=.6;c.stroke()}c.restore();
  c.strokeStyle='rgba(200,225,255,.13)';c.lineWidth=1;for(let i=0;i<40;i++){const x=pHash(i+70)*260-10,y=pHash(i+90)*260+30;c.beginPath();c.moveTo(x,y);c.lineTo(x-5,y+14);c.stroke()}break}
 case 'forest':{c.fillStyle=LG(c,0,PCY-PRI,0,PCY+PRI,['#2a6a54','#123a2c','#061810']);c.fillRect(0,0,PW,PH);
  pGlow(c,120,118,95,'140,255,200',.32);
  for(const [x,w,d] of [[44,16,.5],[70,10,.35],[168,12,.4],[196,20,.6],[100,7,.25],[146,8,.28]]){c.beginPath();c.moveTo(x-w/2,PH);c.bezierCurveTo(x-w/2+4,180,x-w/2-3,120,x-w*.3,40);c.lineTo(x+w*.3,40);c.bezierCurveTo(x+w/2+3,120,x+w/2-4,180,x+w/2,PH);c.closePath();c.fillStyle=`rgba(4,16,10,${d+.2})`;c.fill()}
  for(let i=0;i<6;i++){const x=34+i*36;c.beginPath();c.moveTo(x,60);c.quadraticCurveTo(x+8,90,x-2,110+pHash(i)*30);c.strokeStyle='rgba(20,60,30,.6)';c.lineWidth=2;c.stroke()}
  E(c,120,226,110,26);c.fillStyle='rgba(150,240,210,.16)';c.fill();
  for(let i=0;i<22;i++)circ(c,40+pHash(i+3)*160,70+pHash(i+8)*160,.8+pHash(i+5)*1.4,`rgba(160,255,220,${.3+pHash(i)*.5})`);break}
 case 'battle':{c.fillStyle=LG(c,0,PCY-PRI,0,PCY+PRI,['#ffe9a8','#f6b85a','#b8682a']);c.fillRect(0,0,PW,PH);
  pGlow(c,178,92,80,'255,250,220',.95);
  c.save();c.translate(178,92);for(let i=0;i<14;i++){c.rotate(Math.PI/7);c.beginPath();c.moveTo(0,0);c.lineTo(-7,-170);c.lineTo(7,-170);c.closePath();c.fillStyle='rgba(255,250,220,.15)';c.fill()}c.restore();
  c.beginPath();c.moveTo(0,200);c.quadraticCurveTo(60,176,120,196);c.quadraticCurveTo(180,212,240,186);c.lineTo(240,PH);c.lineTo(0,PH);c.closePath();c.fillStyle='rgba(120,80,30,.55)';c.fill();
  c.beginPath();c.moveTo(0,224);c.quadraticCurveTo(90,204,240,230);c.lineTo(240,PH);c.lineTo(0,PH);c.closePath();c.fillStyle='rgba(70,50,20,.65)';c.fill();
  for(const [x,y,h] of [[40,196,34],[200,192,30],[66,190,22]]){c.beginPath();c.moveTo(x,y);c.lineTo(x,y-h);c.strokeStyle='rgba(60,30,10,.7)';c.lineWidth=1.6;c.stroke();c.beginPath();c.moveTo(x,y-h);c.quadraticCurveTo(x+8,y-h+2,x+14,y-h+5);c.lineTo(x,y-h+10);c.closePath();c.fillStyle='rgba(200,60,40,.7)';c.fill()}
  for(let i=0;i<6;i++)circ(c,30+pHash(i+60)*180,170+pHash(i+66)*20,8+pHash(i)*10,'rgba(255,240,220,.18)');break}
 default:if(BGS[kind])BGS[kind](c)}
 const g=c.createRadialGradient(PCX,PCY-10,PRI*.45,PCX,PCY,PRI+2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.55)');c.fillStyle=g;c.fillRect(0,0,PW,PH);c.restore()}

// ---------- Marcos ornamentados y desgastados ----------
function pFrame(c,kind){const ring=cc=>{cc.beginPath();cc.arc(PCX,PCY,PRO,0,Math.PI*2);cc.moveTo(PCX+PRI,PCY);cc.arc(PCX,PCY,PRI,0,Math.PI*2,true)},BB=[PCX-PRO,PCY-PRO,PCX+PRO,PCY+PRO],MR=(PRO+PRI)/2;
 switch(kind){
 case 'metal':{VOL(c,ring,'#8a98b0',{bb:BB,light:'#eef4ff',dark:'#3a4458',spec:[PCX-55,PCY-70,16,5,-.7]});
  c.beginPath();c.arc(PCX,PCY,PRI+3,0,7);c.strokeStyle='rgba(20,26,40,.7)';c.lineWidth=2;c.stroke();c.beginPath();c.arc(PCX,PCY,PRO-3,0,7);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.2;c.stroke();
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2+.13,x=PCX+Math.cos(a)*MR,y=PCY+Math.sin(a)*MR;VOL(c,cc=>{E(cc,x,y,3.2,3.2)},'#b8c4d8',{bb:[x-3.2,y-3.2,x+3.2,y+3.2],rim:1.2,lw:.8})}
  for(let i=0;i<9;i++){const a=pHash(i)*7,r0=PRI+3+pHash(i+9)*9;c.beginPath();c.arc(PCX,PCY,r0,a,a+.12+pHash(i+3)*.2);c.strokeStyle=i%2?'rgba(255,255,255,.45)':'rgba(20,24,36,.45)';c.lineWidth=.9;c.stroke()}
  for(const sd of [-1,1]){const x=PCX+sd*(PRO+1),y=PCY+18;VOL(c,cc=>{cc.beginPath();for(let i=0;i<6;i++){const a=i/6*Math.PI*2;cc.lineTo(x+Math.cos(a)*9,y+Math.sin(a)*9)}cc.closePath()},'#7a88a0',{bb:[x-9,y-9,x+9,y+9],dark:'#2a3040'});VOL(c,cc=>{E(cc,x,y,4.5,4.5)},'#5cc8ff',{bb:[x-4.5,y-4.5,x+4.5,y+4.5],light:'#ffffff',dark:'#1a4a8a',rim:1.4,lw:1})}
  break}
 case 'roots':{VOL(c,ring,'#4a3420',{bb:BB,light:'#8a6a44',dark:'#1e140a'});
  for(let s=0;s<3;s++){c.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,r0=MR+Math.sin(a*6+s*2.1)*5.5,x=PCX+Math.cos(a)*r0,y=PCY+Math.sin(a)*r0;i?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle='#1a0e06';c.lineWidth=6.5;c.stroke();c.strokeStyle=['#7a5a34','#6a4a2a','#8a6a3a'][s];c.lineWidth=4;c.stroke();c.strokeStyle='rgba(255,230,180,.25)';c.lineWidth=1.2;c.stroke()}
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2+.2;leafHQ(c,PCX+Math.cos(a)*(PRO+1),PCY+Math.sin(a)*(PRO+1),10+pHash(i)*6,a+(pHash(i+4)-.5),i%2?'#5a9a3a':'#7ab84a','#1e4a14')}
  for(const [a0,l,cv] of [[2.0,34,1],[1.75,26,-1],[1.32,32,1],[1.05,24,-1],[2.45,22,-1],[.7,20,1]]){const x0=PCX+Math.cos(a0)*PRO,y0=PCY+Math.sin(a0)*PRO,dx=Math.cos(a0),dy=Math.sin(a0);
   c.beginPath();c.moveTo(x0,y0);c.bezierCurveTo(x0+dx*l*.5,y0+dy*l*.5,x0+dx*l+cv*10,y0+dy*l*.6,x0+dx*l*.8+cv*14,y0+dy*l);c.strokeStyle='#1a0e06';c.lineWidth=6;c.stroke();c.strokeStyle='#6a4a2a';c.lineWidth=3.6;c.stroke()}
  for(const [a0,r] of [[1.9,6],[1.45,7.5],[1.2,5],[2.6,4.5]]){const x=PCX+Math.cos(a0)*(PRO+4),y=PCY+Math.sin(a0)*(PRO+4);RRp(c,x-1.6,y-2,3.2,8,1.4);P(c,'#f0eaf8',1);
   VOL(c,cc=>{cc.beginPath();cc.ellipse(x,y-2,r,r*.7,0,Math.PI,0);cc.closePath()},'#b07aff',{bb:[x-r,y-2-r*.7,x+r,y-2],light:'#f0e0ff',dark:'#4a1a8a',rim:1.4,lw:.8});for(const [ox,oy] of [[-.4,-.4],[.3,-.5]]){E(c,x+ox*r,y-2+oy*r,1.1,.8);c.fillStyle='#fff';c.fill()}}
  break}
 case 'gold':{for(let i=0;i<24;i++){const a=i/24*Math.PI*2,l=i%2?8:13;c.save();c.translate(PCX,PCY);c.rotate(a);c.beginPath();c.moveTo(PRO-2,-5);c.lineTo(PRO+l,0);c.lineTo(PRO-2,5);c.closePath();P(c,i%2?'#e8a020':'#ffd23f',1.4);c.restore()}
  VOL(c,ring,'#e8b030',{bb:BB,light:'#fff6c0',dark:'#7a4a08',spec:[PCX-52,PCY-72,18,5,-.6]});
  c.beginPath();c.arc(PCX,PCY,PRI+3.5,0,7);c.strokeStyle='rgba(120,70,0,.7)';c.lineWidth=1.6;c.stroke();c.beginPath();c.arc(PCX,PCY,PRO-3,0,7);c.strokeStyle='rgba(255,250,210,.6)';c.lineWidth=1.2;c.stroke();
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2;c.save();c.translate(PCX+Math.cos(a)*MR,PCY+Math.sin(a)*MR);c.rotate(a);E(c,0,0,4.5,2.2);c.strokeStyle='rgba(140,80,0,.55)';c.lineWidth=1;c.stroke();c.restore()}
  for(let i=0;i<7;i++){const a=pHash(i+200)*7;c.beginPath();c.arc(PCX,PCY,PRI+4+pHash(i+210)*8,a,a+.15);c.strokeStyle='rgba(90,50,0,.45)';c.lineWidth=1.4;c.stroke()}
  for(const a of [Math.PI*.25,Math.PI*.75,Math.PI*1.25,Math.PI*1.75]){const x=PCX+Math.cos(a)*MR,y=PCY+Math.sin(a)*MR;VOL(c,cc=>{E(cc,x,y,5.5,5.5)},'#e83a2a',{bb:[x-5.5,y-5.5,x+5.5,y+5.5],light:'#ffd0c0',dark:'#6a0a0a',rim:1.6,lw:1})}
  break}
 default:if(FRS[kind])FRS[kind](c,ring,BB,MR)}}

// ---------- Comandantes de prueba ----------
const HPORT={
 // ABUELA NIMBO: pelo de nube tormentosa, gafas de aviadora, sonrisa de veterana con un diente de menos, bastón nudoso y su propia nubecita.
 lluvia:{bg:'storm',frame:'metal',shine:'rgba(190,230,255,.5)',hp:[118,162],pv:[183,192],
  body(c){VOL(c,cc=>{cc.beginPath();cc.moveTo(58,190);cc.quadraticCurveTo(70,150,118,148);cc.quadraticCurveTo(170,150,182,190);cc.closePath()},'#3a5ca8',{bb:[58,148,182,190],dark:'#16285a'});
   VOL(c,cc=>pTorso(cc,-4),'#4a78d0',{bb:[14,172,204,272],light:'#9ac0ff',dark:'#18285e',spec:[56,200,18,7,-.4]});
   for(const [x0,x1] of [[50,40],[78,74],[160,168],[186,196]]){c.beginPath();c.moveTo(x0,200);c.quadraticCurveTo((x0+x1)/2+4,236,x1,272);c.strokeStyle='rgba(16,26,70,.45)';c.lineWidth=2;c.stroke()}
   VOL(c,cc=>{cc.beginPath();cc.moveTo(100,176);cc.lineTo(134,176);cc.lineTo(128,272);cc.lineTo(104,272);cc.closePath()},'#e4ecfa',{bb:[100,176,134,272],dark:'#8a9ac0'});
   pBolt(c,58,222,15,'#ffe14a');pBolt(c,178,236,11,'#ffe14a');
   c.beginPath();c.moveTo(150,180);c.quadraticCurveTo(110,220,58,262);c.strokeStyle='#22140c';c.lineWidth=11;c.stroke();c.strokeStyle=LG(c,58,180,150,262,['#b07a40','#6a3e1a']);c.lineWidth=7.5;c.stroke();
   VOL(c,cc=>{RRp(cc,104,150,26,28,9)},'#f0c098',{bb:[104,150,130,178],dark:'#b07450'});AO(c,117,174,18,6,.6)},
  head(c){const sk='#f6caa4';
   const hair=[[78,112,24],[158,108,24],[66,86,22],[170,80,20],[92,62,28],[140,56,30],[116,36,26],[66,58,17],[168,50,17],[62,126,15],[174,128,14],[118,70,30],[100,22,14],[146,26,15]];
   pCloudVol(c,hair,'#dfe6f4','#ffffff','#6a7898');
   c.save();pCloud(c,hair);c.clip();c.fillStyle=LG(c,0,40,0,140,['rgba(60,74,110,0)','rgba(60,74,110,.35)']);c.fillRect(30,0,180,150);c.restore();
   c.translate(118,150);c.scale(1.16,1.16);c.translate(-118,-150);
   VOL(c,cc=>{E(cc,90,132,6,9,-.2)},sk,{bb:[84,123,96,141],dark:'#c07850',rim:2});
   const face=cc=>{cc.beginPath();cc.moveTo(92,112);cc.bezierCurveTo(94,92,140,88,146,108);cc.bezierCurveTo(150,124,148,146,136,158);cc.quadraticCurveTo(124,168,112,164);cc.bezierCurveTo(98,158,90,138,92,112);cc.closePath()};
   VOL(c,face,sk,{bb:[90,92,150,166],light:'#ffe8d0',dark:'#c27a52',spec:[106,108,7,4,-.3],lw:1.3});AO(c,118,100,30,9,.55);
   const fr=[[98,98,11],[114,94,12],[132,96,11],[146,102,9]];pCloudVol(c,fr,'#e8eef8','#ffffff','#8a98b8');
   c.strokeStyle=cshift(sk,-.4);c.lineWidth=.9;for(const [x,y,w] of [[104,112,10],[124,111,12]]){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+w/2,y-2,x+w,y);c.stroke()}
   for(const [x,y,s] of [[97,128,-1],[146,126,1]])for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(x,y+i*2.5);c.lineTo(x+s*5,y+i*3.5);c.stroke()}
   for(const [x,y,w,a] of [[105,116,15,.15],[133,114,12,-.22]]){c.save();c.translate(x,y);c.rotate(a);for(let i=0;i<5;i++){c.beginPath();c.moveTo(-w/2+i*w/5,2);c.quadraticCurveTo(-w/2+i*w/5+2,-3,-w/2+i*w/5+5,-1);c.strokeStyle='#22140c';c.lineWidth=3.4;c.stroke();c.strokeStyle='#f4f6fb';c.lineWidth=2;c.stroke()}c.restore()}
   pEye(c,106,126,7.5,5,'#3a8ad8',.62,.38,sk);pEye(c,133,125,6.4,4.5,'#3a8ad8',.42,.7,sk);
   VOL(c,cc=>{E(cc,123,136,6.5,5.5)},sk,{bb:[116,130,130,142],light:'#ffe0c8',dark:'#c27a52',rim:2,lw:1,spec:[121,134,2,1.4]});
   for(const [x,y] of [[104,141],[140,139]]){E(c,x,y,7,4.5);c.fillStyle='rgba(240,110,110,.32)';c.fill()}
   const mo=cc=>{cc.beginPath();cc.moveTo(108,147);cc.quadraticCurveTo(124,151,142,144);cc.quadraticCurveTo(128,162,110,151);cc.closePath()};
   mo(c);c.fillStyle='#5a1414';c.fill();c.save();mo(c);c.clip();c.fillStyle='#fffaf0';c.fillRect(106,145,40,5);c.fillStyle='#5a1414';c.fillRect(126,145,3.2,5);E(c,124,158,9,5);c.fillStyle='#e85a6a';c.fill();c.restore();
   mo(c);c.strokeStyle='#3a1008';c.lineWidth=1.4;c.stroke();
   c.strokeStyle=cshift(sk,-.38);c.lineWidth=1.1;c.beginPath();c.moveTo(105,140);c.quadraticCurveTo(102,147,107,152);c.stroke();c.beginPath();c.moveTo(144,137);c.quadraticCurveTo(148,144,144,149);c.stroke();
   c.beginPath();c.moveTo(70,92);c.quadraticCurveTo(118,74,166,86);c.strokeStyle='#22140c';c.lineWidth=8;c.stroke();c.strokeStyle='#7a4a24';c.lineWidth=5;c.stroke();
   for(const [x,y,r] of [[104,82,12],[136,80,11]]){AO(c,x+1,y+6,r+3,5,.4);VOL(c,cc=>{E(cc,x,y,r,r*.9)},'#d8a040',{bb:[x-r,y-r,x+r,y+r],light:'#fff0b0',dark:'#7a4a10',lw:1.2});
    E(c,x,y,r*.7,r*.62);c.fillStyle=LG(c,x-r,y-r,x+r,y+r,['#d8f4ff','#5ab8e8','#1a4a7a']);c.fill();c.strokeStyle='#4a2a08';c.lineWidth=1.2;c.stroke();
    E(c,x-r*.25,y-r*.25,r*.28,r*.16,-.6);c.fillStyle='rgba(255,255,255,.9)';c.fill();E(c,x+r*.28,y+r*.22,r*.08,r*.08);c.fill()}
   c.beginPath();c.moveTo(115,82);c.lineTo(126,81);c.strokeStyle='#7a4a10';c.lineWidth=3;c.stroke()},
  prop(c){// brazo: de la manga del hombro a la mano del bastón
   VOL(c,cc=>{cc.beginPath();cc.moveTo(146,186);cc.quadraticCurveTo(166,184,176,198);cc.lineTo(196,204);cc.lineTo(194,216);cc.quadraticCurveTo(168,226,146,214);cc.closePath()},'#4a78d0',{bb:[146,184,196,226],light:'#9ac0ff',dark:'#18285e'});
   const pts=[[188,272],[184,240],[188,214],[182,186],[186,160],[180,130],[184,110]];
   const path=()=>{c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length-1;i++)c.quadraticCurveTo(pts[i][0],pts[i][1],(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2);c.lineTo(...pts[pts.length-1])};
   path();c.strokeStyle='#22140c';c.lineWidth=11;c.stroke();path();c.strokeStyle=LG(c,178,0,192,0,['#a87444','#6a3e1a','#3a200a']);c.lineWidth=7.4;c.stroke();
   c.save();c.translate(-1.8,0);path();c.strokeStyle='rgba(255,220,170,.4)';c.lineWidth=1.6;c.stroke();c.restore();
   c.beginPath();c.moveTo(184,112);c.bezierCurveTo(186,88,164,84,164,100);c.quadraticCurveTo(166,108,175,104);c.strokeStyle='#22140c';c.lineWidth=10;c.stroke();c.strokeStyle='#8a5a2a';c.lineWidth=6.4;c.stroke();
   for(const [x,y] of [[186,226],[183,168]]){E(c,x,y,4,3);c.fillStyle='#3a200a';c.fill()}
   VOL(c,cc=>{RRp(cc,172,182,22,20,8)},'#f2c49c',{bb:[172,182,194,202],dark:'#b8764e',spec:[178,187,4,2]});
   for(let i=0;i<3;i++){c.beginPath();c.moveTo(174,188+i*5);c.lineTo(181,188+i*5);c.strokeStyle='rgba(120,60,30,.6)';c.lineWidth=1;c.stroke()}
   VOL(c,cc=>{RRp(cc,168,198,28,14,6)},'#4a78d0',{bb:[168,198,196,212],dark:'#18285e'});
   const cl=[[196,58,12],[212,52,14],[226,60,11],[206,64,11],[220,66,10]];pCloudVol(c,cl,'#aab6d0','#ffffff','#4a5878')},
  bgfx(c,t){const fl=Math.max(0,Math.sin(t*.9+1))**30;if(fl>.02){c.fillStyle=`rgba(200,230,255,${fl*.45})`;c.fillRect(0,0,PW,PH)}},
  fxProp(c,t){const f=Math.floor(t*14);c.save();c.globalCompositeOperation='lighter';
   for(let i=0;i<3;i++){const a=pHash(f+i*7)*Math.PI*2,l=10+pHash(f+i*3)*14;pZig(c,170,96,170+Math.cos(a)*l,96+Math.sin(a)*l,f*3+i,6,4);c.strokeStyle='rgba(120,200,255,.85)';c.lineWidth=2.2;c.stroke();c.strokeStyle='#ffffff';c.lineWidth=.8;c.stroke()}
   pGlow(c,170,96,20,'180,230,255',.6+.2*Math.sin(t*9));
   const fl=Math.max(0,Math.sin(t*2.3))**12;if(fl>.05){pZig(c,212,70,200,106,Math.floor(t*2.3/6.283)*9,10,5);c.strokeStyle=`rgba(255,250,170,${fl})`;c.lineWidth=2.6;c.stroke();c.strokeStyle=`rgba(255,255,255,${fl})`;c.lineWidth=1;c.stroke();pGlow(c,212,62,26,'255,250,190',fl*.6)}
   c.restore();for(let i=0;i<5;i++){const ph=(t*1.3+i/5)%1;E(c,200+i*5,72+ph*40,1,2.6);c.fillStyle=`rgba(150,210,255,${.8-ph*.8})`;c.fill()}}},

 // BRUJO RAÍZ: capucha de hojas, rostro en penumbra con ojos brillantes, barba de raíces retorcidas con hongos bioluminiscentes y báculo trenzado.
 brujo:{bg:'forest',frame:'roots',shine:'rgba(150,255,170,.3)',hp:[120,166],pv:[188,160],
  body(c){VOL(c,cc=>pTorso(cc,0),'#3e5a28',{bb:[14,172,204,272],light:'#86a858',dark:'#142008',spec:[60,198,14,6,-.4]});
   for(let row=0;row<4;row++)for(let i=0;i<9;i++){const x=24+i*22+(row%2)*11,y=190+row*18;if(x<30||x>196||Math.abs(x-118)<24)continue;leafHQ(c,x,y,16,Math.PI/2+(pHash(row*9+i)-.5)*.6,['#4a7a2a','#5a8a34','#3a6a22'][(row+i)%3],'#14280a')}
   VOL(c,cc=>{cc.beginPath();cc.moveTo(96,176);cc.lineTo(142,176);cc.lineTo(136,272);cc.lineTo(100,272);cc.closePath()},'#4a3220',{bb:[96,176,142,272],light:'#7a5a3a',dark:'#1e120a'})},
  head(c){const sk='#6a4a2e';
   // capucha asimétrica: la punta cae hacia la derecha
   const hood=cc=>{cc.beginPath();cc.moveTo(58,196);cc.bezierCurveTo(52,140,64,96,94,70);cc.bezierCurveTo(112,50,136,40,162,22);cc.bezierCurveTo(158,42,158,56,160,72);cc.bezierCurveTo(182,104,188,150,182,196);cc.quadraticCurveTo(120,176,58,196);cc.closePath()};
   VOL(c,hood,'#4e6a2c',{bb:[52,22,188,196],light:'#9ac060',dark:'#16240a',lw:1.2});
   // escamas de hojas superpuestas en toda la capucha
   c.save();hood(c);c.clip();for(let y=28,row=0;y<200;y+=12,row++)for(let x=46+(row%2)*7;x<196;x+=14){const sh=y/200;leafHQ(c,x,y,15,Math.PI/2+(pHash(x*3+y)-.5)*.7,cshift(['#5a8a34','#6a9a3a','#4a7a2a'][(row+Math.round(x/14))%3],-.25+(1-sh)*.25-(x-120)/400),'#16300a')}
   c.fillStyle=LG(c,52,0,188,0,['rgba(200,255,150,.12)','rgba(0,0,0,0)','rgba(10,20,0,.35)']);c.fillRect(40,10,160,200);c.restore();
   for(const [x,y,a] of [[60,184,3.2],[56,156,3.3],[58,126,3.5],[68,100,3.7],[84,80,3.9],[102,64,4.2],[124,48,4.4],[146,32,4.7],[162,22,5.2],[160,52,.2],[164,78,5.7],[176,104,5.9],[184,132,6],[186,160,6.15],[184,188,6.25]])leafHQ(c,x,y,15,a,['#5a8a34','#7aa848','#4a7a2a'][Math.round(x)%3],'#16300a');
   c.beginPath();c.moveTo(80,176);c.bezierCurveTo(76,120,96,84,120,80);c.bezierCurveTo(146,82,166,118,162,176);c.closePath();c.fillStyle=RG(c,120,128,56,['#2a3418','#0e1408','#050803'],120,150);c.fill();
   const face=cc=>{cc.beginPath();cc.moveTo(96,118);cc.bezierCurveTo(98,98,142,96,146,118);cc.bezierCurveTo(148,138,140,152,120,156);cc.bezierCurveTo(102,152,94,138,96,118);cc.closePath()};
   VOL(c,face,sk,{bb:[94,98,148,158],light:'#9a7048',dark:'#2a1808',rim:2.5,lw:1});AO(c,120,104,34,16,.95);
   c.strokeStyle='rgba(30,16,6,.6)';c.lineWidth=1;for(const [x,y] of [[104,110],[137,108],[108,140],[134,138]]){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+3,y+5,x+1,y+10);c.stroke()}
   for(const [x,y,w,a] of [[107,124,9,.18],[134,122,8,-.2]]){c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(-w,0);c.quadraticCurveTo(0,-w*.75,w,0);c.quadraticCurveTo(0,w*.45,-w,0);c.closePath();c.fillStyle=RG(c,0,0,w,['#ffffff','#e8ff8a','#7ad83a'],0,0);c.fill();c.strokeStyle='#1a2a08';c.lineWidth=1.2;c.stroke();c.restore()}
   for(const [x,y,s] of [[107,114,1],[134,112,-1]]){c.beginPath();c.moveTo(x-10*s,y-4);c.quadraticCurveTo(x,y+2,x+10*s,y+1);c.strokeStyle='#22140c';c.lineWidth=4.4;c.stroke();c.strokeStyle='#6a4a2a';c.lineWidth=2.4;c.stroke()}
   VOL(c,cc=>{cc.beginPath();cc.moveTo(118,124);cc.quadraticCurveTo(126,134,128,144);cc.quadraticCurveTo(122,148,116,144);cc.closePath()},sk,{bb:[114,124,130,148],light:'#a07a50',dark:'#2a1808',rim:1.6,lw:1});
   for(let i=0;i<15;i++){const x0=100+i*3,y0=146+Math.abs(i-7)*.6,len=50+pHash(i)*40,sw=(pHash(i+30)-.5)*30;
    c.beginPath();c.moveTo(x0,y0);c.bezierCurveTo(x0+sw,y0+len*.35,x0-sw*1.2,y0+len*.7,x0+sw*.5+(i-7)*2.5,y0+len);c.strokeStyle='#1a0e06';c.lineWidth=5;c.stroke();c.strokeStyle=['#7a5634','#6a4628','#8a6640'][i%3];c.lineWidth=3;c.stroke();c.strokeStyle='rgba(255,220,170,.25)';c.lineWidth=.8;c.stroke()}
   for(const s of [-1,1]){c.beginPath();c.moveTo(121,148);c.bezierCurveTo(121+s*10,146,121+s*18,152,121+s*20,160);c.strokeStyle='#1a0e06';c.lineWidth=5.6;c.stroke();c.strokeStyle='#8a6640';c.lineWidth=3.4;c.stroke()}
   for(const [x,y,r] of this.mush){RRp(c,x-1.2,y,2.4,r*1.1,1);c.fillStyle='#e8f8ff';c.fill();VOL(c,cc=>{cc.beginPath();cc.ellipse(x,y,r,r*.7,0,Math.PI,0);cc.closePath()},'#4ae0ff',{bb:[x-r,y-r*.7,x+r,y],light:'#eaffff',dark:'#0a6a9a',rim:1.4,lw:.8});E(c,x-r*.3,y-r*.35,r*.2,r*.15);c.fillStyle='#fff';c.fill()}},
  mush:[[104,184,5],[132,196,6],[116,214,4.5],[96,206,4],[140,170,4]],
  prop(c){for(let s=0;s<2;s++){c.beginPath();for(let i=0;i<=40;i++){const f=i/40,y=272-f*236,x=190-f*8+Math.sin(f*14+s*Math.PI)*4.5;i?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle='#1a0e06';c.lineWidth=7.5;c.stroke();c.strokeStyle=s?'#7a5634':'#5a3a20';c.lineWidth=4.6;c.stroke();c.strokeStyle='rgba(255,220,170,.3)';c.lineWidth=1.2;c.stroke()}
   for(const s of [-1,1,0]){c.beginPath();c.moveTo(182,40);c.bezierCurveTo(182+s*14,30,182+s*12,12,182+s*4,6);c.strokeStyle='#1a0e06';c.lineWidth=5.4;c.stroke();c.strokeStyle='#6a4628';c.lineWidth=3;c.stroke()}
   const cx=182,cy=22,pts=[[cx,cy-16],[cx+8,cy-4],[cx+5,cy+12],[cx-5,cy+12],[cx-8,cy-4]];
   VOL(c,cc=>{cc.beginPath();pts.forEach((p,i)=>i?cc.lineTo(...p):cc.moveTo(...p));cc.closePath()},'#3aff6a',{bb:[cx-8,cy-16,cx+8,cy+12],light:'#eaffea',dark:'#0a6a2a',lw:1.2});
   c.beginPath();c.moveTo(cx,cy-16);c.lineTo(cx,cy+12);c.moveTo(cx-8,cy-4);c.lineTo(cx,cy+2);c.lineTo(cx+8,cy-4);c.strokeStyle='rgba(220,255,220,.6)';c.lineWidth=.8;c.stroke();
   VOL(c,cc=>{RRp(cc,176,150,24,20,8)},'#6a4a2e',{bb:[176,150,200,170],light:'#a07a50',dark:'#2a1808'});
   for(let i=0;i<3;i++){c.beginPath();c.moveTo(178,156+i*5);c.lineTo(186,156+i*5);c.strokeStyle='rgba(20,10,4,.6)';c.lineWidth=1;c.stroke()}
   VOL(c,cc=>{RRp(cc,170,166,32,14,6)},'#3e5a28',{bb:[170,166,202,180],dark:'#142008'})},
  bgfx(c,t){for(let i=0;i<2;i++){const x=((t*8+i*130)%300)-30;E(c,x,200-i*40,70,10);c.fillStyle='rgba(170,255,220,.08)';c.fill()}},
  fxHead(c,t){c.save();c.globalCompositeOperation='lighter';for(const [x,y] of [[107,124],[134,122]])pGlow(c,x,y,16,'210,255,120',.55+.2*Math.sin(t*3));
   for(const [x,y] of this.mush)pGlow(c,x,y-2,12,'90,230,255',.4+.2*Math.sin(t*2+x));c.restore()},
  fxProp(c,t){c.save();c.globalCompositeOperation='lighter';pGlow(c,182,22,32,'120,255,140',.5+.25*Math.sin(t*2.2));c.restore()},
  fx(c,t){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<16;i++){const ph=(t*.22+pHash(i))%1,x=36+pHash(i+5)*176+Math.sin(t*1.3+i)*8,y=262-ph*230;c.globalAlpha=Math.sin(ph*Math.PI);circ(c,x,y,1.2+pHash(i+9)*1.6,i%3?'#7affd8':'#c8ff6a')}c.restore()}},

 // GENERAL GIRASOL: mandíbula cuadrada, cejas heroicas con cicatriz, casco rústico, gola de pétalos asimétricos y machete.
 general:{bg:'battle',frame:'gold',shine:'rgba(255,250,200,.55)',hp:[120,166],pv:[130,238],
  body(c){VOL(c,cc=>pTorso(cc,2),'#4e7a2c',{bb:[14,172,204,272],light:'#9ac85a',dark:'#1a3008',spec:[62,200,16,6,-.4]});
   c.save();pTorso(c,2);c.clip();for(let i=0;i<16;i++){E(c,20+pHash(i)*180,180+pHash(i+16)*90,8+pHash(i+32)*8,5+pHash(i+48)*4,pHash(i+64)*3);c.fillStyle=i%2?'rgba(30,50,12,.4)':'rgba(140,120,50,.35)';c.fill()}c.restore();
   VOL(c,cc=>{RRp(cc,106,152,26,28,9)},'#e0a46e',{bb:[106,152,132,180],dark:'#9a5a2a'});AO(c,119,174,18,6,.6);
   for(const s of [-1,1])VOL(c,cc=>{cc.beginPath();cc.moveTo(119,178);cc.lineTo(119+s*28,174);cc.lineTo(119+s*16,198);cc.closePath()},'#3e6a22',{bb:[91,174,147,198],dark:'#14280a',lw:1});
   for(const [x,y,n,sc,bA] of [[50,192,6,1.15,2.75],[188,194,5,.9,.4]])for(let i=0;i<n;i++)leafHQ(c,x,y,22*sc,bA+(i-(n-1)/2)*.32,['#5a9a2a','#7ab83a','#4a8a22'][i%3],'#1a3a08');
   c.beginPath();c.moveTo(160,180);c.quadraticCurveTo(120,220,70,272);c.strokeStyle='#22140c';c.lineWidth=11;c.stroke();c.strokeStyle=LG(c,70,180,160,272,['#a8743a','#5a3414']);c.lineWidth=7.5;c.stroke();
   VOL(c,cc=>{RRp(cc,104,216,16,14,3)},'#ffd23f',{bb:[104,216,120,230],light:'#fff6c0',dark:'#8a5a0a',lw:1});c.fillStyle='#5a3414';c.fillRect(108,220,8,6);
   for(let i=0;i<3;i++){c.fillStyle=i%2?'#ffffff':'#d83a2a';c.fillRect(138+i*4,196,4,16)}c.strokeStyle='#3a1408';c.lineWidth=1;c.strokeRect(138,196,12,16);
   VOL(c,cc=>{E(cc,144,220,8.5,8.5)},'#ffd23f',{bb:[135,211,153,229],light:'#fffbe0',dark:'#8a5a0a',lw:1.2,spec:[141,216,2.5,1.5]});star(c,144,220,4.5,'#e8a020')},
  head(c){const sk='#e8b07a';c.translate(118,150);c.scale(1.14,1.14);c.translate(-118,-150);
   for(const [ring,col,lt,dk,n,base,len] of [[0,'#f0a020','#ffd070','#a85a08',20,42,54],[1,'#ffd23f','#fff6b0','#d88a10',18,38,44]])for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2+ring*.17,L=len*(.75+pHash(i+ring*40)*.55),w=9+pHash(i+ring*40+7)*4,cu=(pHash(i+ring*40+13)-.5)*14;
    c.save();c.translate(118+Math.cos(a)*base*.55,116+Math.sin(a)*base*.55);c.rotate(a+Math.PI/2);
    VOL(c,cc=>{cc.beginPath();cc.moveTo(-w*.5,0);cc.bezierCurveTo(-w*.9,-L*.45,cu-w*.4,-L*.85,cu,-L);cc.bezierCurveTo(cu+w*.4,-L*.85,w*.9,-L*.45,w*.5,0);cc.closePath()},col,{bb:[-w,-L,w,0],light:lt,dark:dk,lw:1,rim:2.4});
    c.beginPath();c.moveTo(0,-2);c.quadraticCurveTo(cu*.5,-L*.5,cu*.9,-L*.85);c.strokeStyle='rgba(160,80,0,.35)';c.lineWidth=.9;c.stroke();c.restore()}
   VOL(c,cc=>{E(cc,118,118,42,44)},'#6a3a10',{bb:[76,74,160,162],light:'#a86a28',dark:'#2a1404',lw:1});
   for(let i=0;i<70;i++){const a=i*2.4,r=8+Math.sqrt(i)*4.2;if(r>40)continue;E(c,118+Math.cos(a)*r,118+Math.sin(a)*r,1.6,1.6);c.fillStyle='rgba(30,14,2,.5)';c.fill()}
   VOL(c,cc=>{E(cc,92,130,6,9,-.2)},sk,{bb:[86,121,98,139],dark:'#a8683a',rim:2});
   const face=cc=>{cc.beginPath();cc.moveTo(94,108);cc.bezierCurveTo(96,94,142,92,146,108);cc.lineTo(147,134);cc.quadraticCurveTo(146,152,134,160);cc.lineTo(110,161);cc.quadraticCurveTo(96,154,95,136);cc.closePath()};
   VOL(c,face,sk,{bb:[94,94,147,161],light:'#ffd8a8',dark:'#9a5a2a',spec:[106,114,6,3.5,-.3],lw:1.3});
   for(let i=0;i<11;i++){const f=i/10,x=97+f*48,y=142+Math.sin(f*Math.PI)*18;leafHQ(c,x,y,9,Math.PI/2+(f-.5)*1.6,i%2?'#5a8a2a':'#7aa83a','#1e3a0a')}
   const helm=cc=>{cc.beginPath();cc.moveTo(84,112);cc.bezierCurveTo(82,72,154,68,156,110);cc.closePath()};
   VOL(c,helm,'#5e7a34',{bb:[82,70,156,112],light:'#a8c070',dark:'#1e2a0a',spec:[104,84,10,5,-.4]});
   c.save();helm(c);c.clip();for(let i=0;i<7;i++){E(c,90+pHash(i+80)*60,80+pHash(i+90)*28,7,4,pHash(i)*3);c.fillStyle=i%2?'rgba(40,50,14,.45)':'rgba(150,130,60,.4)';c.fill()}c.restore();
   VOL(c,cc=>{cc.beginPath();cc.moveTo(78,110);cc.quadraticCurveTo(120,100,162,108);cc.lineTo(160,116);cc.quadraticCurveTo(120,108,80,118);cc.closePath()},'#4a6428',{bb:[78,100,162,118],dark:'#16200a',lw:1});
   AO(c,120,121,30,7,.7);leafHQ(c,142,82,16,-.9,'#7ab83a','#1e4a0a');leafHQ(c,98,80,13,-2.3,'#5a9a2a','#1e4a0a');
   for(const [x,y,w,a] of [[107,122,15,.24],[134,120,13,-.32]]){c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(-w/2,1);c.lineTo(w/2,-2.6);c.lineTo(w/2,2);c.lineTo(-w/2,4);c.closePath();c.fillStyle='#4a2a10';c.fill();c.strokeStyle='#22140c';c.lineWidth=1;c.stroke();c.restore()}
   c.beginPath();c.moveTo(131,114);c.lineTo(138,130);c.strokeStyle='rgba(255,225,205,.85)';c.lineWidth=1.4;c.stroke();
   pEye(c,107,130,7,4.6,'#6a4a10',.35,.72,sk);pEye(c,134,129,6.2,4.2,'#6a4a10',.72,.3,sk);
   c.beginPath();c.moveTo(121,127);c.lineTo(126,141);c.quadraticCurveTo(122,145,117,142);c.strokeStyle=cshift(sk,-.45);c.lineWidth=1.6;c.stroke();
   c.beginPath();c.moveTo(110,151);c.quadraticCurveTo(122,154,136,147);c.lineTo(139,144);c.strokeStyle='#3a1408';c.lineWidth=2.4;c.stroke();
   c.beginPath();c.moveTo(122,156);c.lineTo(122,160);c.strokeStyle=cshift(sk,-.4);c.lineWidth=1.2;c.stroke();
   c.beginPath();c.moveTo(146,114);c.quadraticCurveTo(150,140,138,158);c.strokeStyle='#22140c';c.lineWidth=4.2;c.stroke();c.strokeStyle='#8a5a2a';c.lineWidth=2.4;c.stroke()},
  prop(c){const blade=cc=>{cc.beginPath();cc.moveTo(112,236);cc.quadraticCurveTo(60,214,4,206);cc.quadraticCurveTo(14,222,30,226);cc.quadraticCurveTo(70,240,112,246);cc.closePath()};
   VOL(c,blade,'#c8d4e0',{bb:[4,206,112,246],light:'#ffffff',dark:'#4a5664',spec:[44,219,16,2.2,.18],lw:1.2});
   c.beginPath();c.moveTo(108,239);c.quadraticCurveTo(60,222,10,209);c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=1.2;c.stroke();
   VOL(c,cc=>{RRp(cc,108,226,8,28,3)},'#ffd23f',{bb:[108,226,116,254],light:'#fff6c0',dark:'#8a5a0a',lw:1});
   VOL(c,cc=>{RRp(cc,114,234,30,12,5)},'#6a3e1a',{bb:[114,234,144,246],light:'#a86a3a',dark:'#2a1404',lw:1});
   VOL(c,cc=>{RRp(cc,118,226,24,24,9)},'#8a5a2a',{bb:[118,226,142,250],light:'#c8945a',dark:'#3a200a',spec:[124,231,4,2]});
   for(let i=0;i<3;i++){c.beginPath();c.moveTo(120,232+i*5);c.lineTo(128,232+i*5);c.strokeStyle='rgba(30,14,4,.6)';c.lineWidth=1;c.stroke()}},
  bgfx(c,t){c.save();c.globalCompositeOperation='lighter';c.translate(178,92);c.rotate(t*.12);for(let i=0;i<7;i++){c.rotate(Math.PI*2/7);c.beginPath();c.moveTo(0,0);c.lineTo(-9,-170);c.lineTo(9,-170);c.closePath();c.fillStyle='rgba(255,240,190,.07)';c.fill()}c.restore()},
  fxProp(c,t){const ph=(t*.45)%1;if(ph<.35){const f=ph/.35;c.save();c.globalCompositeOperation='lighter';pGlow(c,112+(6-112)*f,240+(208-240)*f,13,'255,255,240',.95);c.restore()}},
  fx(c,t){for(let i=0;i<6;i++){const ph=(t*.16+pHash(i))%1,x=-10+ph*260,y=40+pHash(i+3)*190+Math.sin(t*2+i)*10;c.save();c.translate(x,y);c.rotate(t*2.5+i);c.globalAlpha=Math.sin(ph*Math.PI);leafHQ(c,0,0,10+pHash(i+7)*5,0,i%2?'#7ab83a':'#c8d040','#2a4a0a');c.restore()}
   c.save();c.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const ph=(t*.3+pHash(i+20))%1;c.globalAlpha=Math.sin(ph*Math.PI)*.8;star(c,30+pHash(i+30)*180,180-ph*120,1.6+pHash(i)*1.4,'#fff3a0')}c.restore()}}};

function hpLayers(k){if(HPC[k])return HPC[k];const H=HPORT[k];
 const bg=pRaw(c=>pBg(c,H.bg)),fr=avOutline(pRaw(c=>pFrame(c,H.frame)),2.4*PS);
 const body=pLayer(c=>H.body(c),120,215,70,.6),head=pLayer(c=>H.head.call(H,c),120,110,70,.55),prop=pLayer(c=>H.prop(c),H.pv[0],H.pv[1]-40,60,.55);
 const shadow=document.createElement('canvas');shadow.width=head.width;shadow.height=head.height;const q=shadow.getContext('2d');q.drawImage(head,0,0);q.globalCompositeOperation='source-in';q.fillStyle='#0a0602';q.fillRect(0,0,shadow.width,shadow.height);
 return HPC[k]={bg,fr,body,head,prop,shadow}}
// t = null: pose quieta (retratos pequeños). Animación: respiración elástica, cabeza con retraso e inclinación, objeto con más retraso,
// luz que recorre el marco, sombra de la figura proyectada sobre el marco y efectos propios con mezcla aditiva.
function hpCompose(c,k,t){const H=HPORT[k],Ls=hpLayers(k),still=t==null,T=still?0:t;
 const br=still?0:Math.sin(T*2.2),lag=still?0:Math.sin(T*2.2-.9),lag2=still?0:Math.sin(T*2.2-1.5),tilt=still?0:Math.sin(T*.9)*.03,dw=im=>c.drawImage(im,0,0,PW,PH);
 const g=c.createRadialGradient(PCX,PCY+6,PRO-6,PCX,PCY+6,PRO+14);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(PCX,PCY+6,PRO+14,0,7);c.fill();
 dw(Ls.bg);if(!still&&H.bgfx){c.save();c.beginPath();c.arc(PCX,PCY,PRI+1,0,7);c.clip();H.bgfx.call(H,c,T);c.restore()}
 dw(Ls.fr);if(!still){c.save();c.globalCompositeOperation='lighter';c.beginPath();c.arc(PCX,PCY,(PRO+PRI)/2,T*.7,T*.7+.6);c.strokeStyle=H.shine;c.lineWidth=6;c.stroke();c.restore()}
 const headT=()=>{c.translate(H.hp[0],H.hp[1]-br*1.9+lag*1.3);c.rotate(tilt);c.translate(-H.hp[0],-H.hp[1])},propT=()=>{c.translate(H.pv[0],H.pv[1]-br*1.4+lag2*2.4);c.rotate(lag2*.035);c.translate(-H.pv[0],-H.pv[1])};
 c.save();pMask(c);
 c.save();c.globalAlpha=.35;c.translate(5,7);headT();dw(Ls.shadow);c.restore();
 c.save();c.translate(120,272);c.scale(1-br*.015,1+br*.026);c.translate(-120,-272);dw(Ls.body);c.restore();
 c.save();headT();dw(Ls.head);if(!still&&H.fxHead)H.fxHead.call(H,c,T);c.restore();
 c.restore();
 c.save();propT();dw(Ls.prop);if(!still&&H.fxProp)H.fxProp.call(H,c,T);c.restore();
 if(!still&&H.fx)H.fx.call(H,c,T)}

// ---------- Piezas reutilizables para los retratos ----------
function pFaceShape(cc,sh){cc.beginPath();switch(sh){
 case 'square':cc.moveTo(94,108);cc.bezierCurveTo(96,94,142,92,146,108);cc.lineTo(147,134);cc.quadraticCurveTo(146,152,134,160);cc.lineTo(110,161);cc.quadraticCurveTo(96,154,95,136);break;
 case 'round':cc.moveTo(92,120);cc.bezierCurveTo(92,92,148,90,148,120);cc.bezierCurveTo(148,150,134,164,120,164);cc.bezierCurveTo(104,164,92,150,92,120);break;
 case 'heart':cc.moveTo(93,112);cc.bezierCurveTo(95,92,143,90,147,110);cc.bezierCurveTo(149,132,136,152,121,164);cc.bezierCurveTo(106,154,92,134,93,112);break;
 case 'long':cc.moveTo(96,108);cc.bezierCurveTo(98,88,142,86,144,106);cc.bezierCurveTo(146,130,142,160,122,170);cc.bezierCurveTo(102,162,96,134,96,108);break;
 default:cc.moveTo(92,112);cc.bezierCurveTo(94,92,140,88,146,108);cc.bezierCurveTo(150,124,148,146,136,158);cc.quadraticCurveTo(124,168,112,164);cc.bezierCurveTo(98,158,90,138,92,112)}cc.closePath()}
function pFace(c,o){const sk=o.sk,dk=o.dk||cshift(sk,-.4);
 if(o.ear!==false)VOL(c,cc=>{E(cc,91,131,6,9,-.2)},sk,{bb:[85,122,97,140],dark:dk,rim:2});
 VOL(c,cc=>pFaceShape(cc,o.shape),sk,{bb:[90,90,150,168],light:o.lt||cshift(sk,.4),dark:dk,spec:[106,110,7,4,-.3],lw:1.3});
 if(o.age){c.strokeStyle=cshift(sk,-.4);c.lineWidth=.9;for(const [x,y,w] of [[104,111,10],[124,110,12]]){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+w/2,y-2,x+w,y);c.stroke()}for(const [x,y,s] of [[97,128,-1],[146,126,1]])for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(x,y+i*2.5);c.lineTo(x+s*5,y+i*3.5);c.stroke()}}
 if(o.blush)for(const [x,y] of [[104,141],[140,139]]){E(c,x,y,7,4.5);c.fillStyle='rgba(240,110,120,.32)';c.fill()}
 if(o.freckles)for(let i=0;i<8;i++){E(c,(i<4?99:135)+(i%4)*3.2,136+((i*7)%3),.9,.9);c.fillStyle=cshift(sk,-.45);c.fill()}}
function pEyes(c,o){const sk=o.sk;if(o.glow){for(const [x,y,w,a] of [[107,126,8.5,.15],[134,124,7.5,-.18]]){c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(-w,0);c.quadraticCurveTo(0,-w*.8,w,0);c.quadraticCurveTo(0,w*.5,-w,0);c.closePath();c.fillStyle=RG(c,0,0,w,['#ffffff',o.iris,cshift(o.iris,-.4)],0,0);c.fill();c.strokeStyle='#1a0a1a';c.lineWidth=1.2;c.stroke();c.restore()}return}
 const L=o.l||[.5,.5],R=o.r||[.5,.5];pEye(c,106,126,7.4,5,o.iris,L[0],L[1],sk);pEye(c,133,125,6.4,4.5,o.iris,R[0],R[1],sk)}
function pBrows(c,o){const col=o.c||'#3a2410',st=o.st||'angled',aL=o.a?o.a[0]:.2,aR=o.a?o.a[1]:-.25;
 for(const [x,y,w,a] of [[106,115,15,aL],[133,113,12.5,aR]]){c.save();c.translate(x,y);c.rotate(a);
  if(st==='bushy'){for(let i=0;i<5;i++){c.beginPath();c.moveTo(-w/2+i*w/5,2);c.quadraticCurveTo(-w/2+i*w/5+2,-3,-w/2+i*w/5+5,-1);c.strokeStyle='#22140c';c.lineWidth=3.4;c.stroke();c.strokeStyle=col;c.lineWidth=2;c.stroke()}}
  else{const th=st==='thin'?1.6:st==='thick'?3.4:2.6;c.beginPath();c.moveTo(-w/2,th*.6);c.quadraticCurveTo(0,-th*1.4,w/2,-th*.4);c.lineTo(w/2,th*.5);c.quadraticCurveTo(0,-th*.2,-w/2,th*1.6);c.closePath();c.fillStyle=col;c.fill();c.strokeStyle='#22140c';c.lineWidth=.9;c.stroke()}
  c.restore()}}
function pNose(c,sk,t){if(t==='strong'){c.beginPath();c.moveTo(121,127);c.lineTo(126,141);c.quadraticCurveTo(122,145,117,142);c.strokeStyle=cshift(sk,-.45);c.lineWidth=1.6;c.stroke();return}
 const r=t==='big'?6.5:4.2;VOL(c,cc=>{E(cc,123,137,r,r*.85)},sk,{bb:[123-r,137-r,123+r,137+r],light:cshift(sk,.35),dark:cshift(sk,-.4),rim:1.6,lw:.9,spec:[121.5,135.5,r*.3,r*.2]})}
function pMouth(c,t){const D='#5a1414',ol='#3a1008';
 switch(t){
 case 'grin':{const mo=cc=>{cc.beginPath();cc.moveTo(108,146);cc.quadraticCurveTo(124,151,141,144);cc.quadraticCurveTo(128,161,110,150);cc.closePath()};mo(c);c.fillStyle=D;c.fill();c.save();mo(c);c.clip();c.fillStyle='#fffaf0';c.fillRect(106,144,40,5);E(c,124,158,9,5);c.fillStyle='#e85a6a';c.fill();c.restore();mo(c);c.strokeStyle=ol;c.lineWidth=1.4;c.stroke();break}
 case 'open':{E(c,123,150,8,6.5);c.fillStyle=D;c.fill();c.save();E(c,123,150,8,6.5);c.clip();c.fillStyle='#fffaf0';c.fillRect(114,143,18,3.4);E(c,123,156,6,4);c.fillStyle='#e85a6a';c.fill();c.restore();E(c,123,150,8,6.5);c.strokeStyle=ol;c.lineWidth=1.4;c.stroke();break}
 case 'smirk':c.beginPath();c.moveTo(112,150);c.quadraticCurveTo(124,152,136,145);c.lineTo(139,142);c.strokeStyle=ol;c.lineWidth=2.4;c.stroke();break;
 case 'smile':c.beginPath();c.moveTo(112,147);c.quadraticCurveTo(124,156,136,146);c.strokeStyle=ol;c.lineWidth=2.4;c.stroke();break;
 default:c.beginPath();c.moveTo(114,149);c.quadraticCurveTo(124,150,134,148);c.strokeStyle=ol;c.lineWidth=2.2;c.stroke()}}
// Mechón con volumen: curva bezier [x0,y0,c1x,c1y,c2x,c2y,x1,y1] que se afina hacia la punta.
function pStrand(c,pts,w,col,lt,dk){const [x0,y0,a,b,d,e,x1,y1]=pts,nx=(y1-y0),ny=-(x1-x0),L=Math.hypot(nx,ny)||1,ox=nx/L*w,oy=ny/L*w;
 VOL(c,cc=>{cc.beginPath();cc.moveTo(x0-ox,y0-oy);cc.bezierCurveTo(a-ox*.8,b-oy*.8,d-ox*.4,e-oy*.4,x1,y1);cc.bezierCurveTo(d+ox*.4,e+oy*.4,a+ox*.8,b+oy*.8,x0+ox,y0+oy);cc.closePath()},col,{bb:[Math.min(x0,x1,a,d)-w,Math.min(y0,y1,b,e)-w,Math.max(x0,x1,a,d)+w,Math.max(y0,y1,b,e)+w],light:lt,dark:dk,lw:1,rim:2.5})}
// Masa de pelo largo detrás de la cabeza (da volumen a las melenas antes de los mechones)
function pHairBack(c,col,lt,dk,len,w){w=w||60;VOL(c,cc=>{cc.beginPath();cc.moveTo(120,76);cc.bezierCurveTo(120-w,74,120-w-14,150,120-w+4,len);cc.quadraticCurveTo(120-w*.5,len+14,120-w*.3,len-10);cc.quadraticCurveTo(120,len-30,120+w*.3,len-10);cc.quadraticCurveTo(120+w*.5,len+14,120+w-4,len);cc.bezierCurveTo(120+w+14,150,120+w,74,120,76);cc.closePath()},col,{bb:[120-w-14,74,120+w+14,len+14],light:lt,dark:dk,spec:[120-w*.5,110,6,20,.2],lw:1.2})}
function pHand(c,x,y,sk,w,h){w=w||22;h=h||20;VOL(c,cc=>{RRp(cc,x,y,w,h,8)},sk,{bb:[x,y,x+w,y+h],dark:cshift(sk,-.42),spec:[x+6,y+5,4,2]});for(let i=0;i<3;i++){c.beginPath();c.moveTo(x+2,y+6+i*5);c.lineTo(x+9,y+6+i*5);c.strokeStyle=cshift(sk,-.5);c.lineWidth=1;c.stroke()}}
function pArm(c,col,toX,toY){VOL(c,cc=>{cc.beginPath();cc.moveTo(146,186);cc.quadraticCurveTo(toX-12,toY-14,toX-6,toY-4);cc.lineTo(toX+12,toY);cc.lineTo(toX+10,toY+12);cc.quadraticCurveTo(toX-20,toY+18,146,214);cc.closePath()},col,{bb:[146,toY-14,toX+12,toY+18],light:cshift(col,.4),dark:cshift(col,-.55)})}
function pBodyStd(c,col,o){o=o||{};VOL(c,cc=>pTorso(cc,o.sh||0),col,{bb:[14,172,204,272],light:o.lt||cshift(col,.45),dark:o.dk||cshift(col,-.6),spec:[58,200,16,6,-.4]});
 if(o.neck){VOL(c,cc=>{RRp(cc,106,150,26,28,9)},o.neck,{bb:[106,150,132,178],dark:cshift(o.neck,-.4)});AO(c,119,174,18,6,.6)}}
function pGoggles(c,y,band,rim,lens,r){c.beginPath();c.moveTo(88,y+6);c.quadraticCurveTo(120,y-4,152,y+4);c.strokeStyle='#22140c';c.lineWidth=6;c.stroke();c.strokeStyle=band;c.lineWidth=3.6;c.stroke();
 for(const [x,yy,rr] of [[106,y,r],[134,y-2,r*.95]]){VOL(c,cc=>{E(cc,x,yy,rr,rr*.9)},rim,{bb:[x-rr,yy-rr,x+rr,yy+rr],light:'#ffffff',dark:cshift(rim,-.6),lw:1});E(c,x,yy,rr*.68,rr*.6);c.fillStyle=LG(c,x-rr,yy-rr,x+rr,yy+rr,[cshift(lens,.7),lens,cshift(lens,-.6)]);c.fill();c.strokeStyle='#2a1a0a';c.lineWidth=1;c.stroke();E(c,x-rr*.25,yy-rr*.25,rr*.26,rr*.15,-.6);c.fillStyle='rgba(255,255,255,.9)';c.fill()}}
function pMustache(c,col,lt,dk,w){for(const s of [-1,1])VOL(c,cc=>{cc.beginPath();cc.moveTo(123,142);cc.bezierCurveTo(123+s*10,136,123+s*w*.85,140,123+s*w,150);cc.quadraticCurveTo(123+s*14,150,123,147);cc.closePath()},col,{bb:[123-w,136,123+w,150],light:lt,dark:dk,lw:1,rim:1.5})}
function pLongBeard(c,col,lt,dk,len){const bd=cc=>{cc.beginPath();cc.moveTo(97,138);cc.quadraticCurveTo(94,170,110,198);cc.quadraticCurveTo(118,len,124,len+4);cc.quadraticCurveTo(132,len-12,140,196);cc.quadraticCurveTo(150,170,146,136);cc.quadraticCurveTo(134,150,121,148);cc.quadraticCurveTo(106,150,97,138);cc.closePath()};
 VOL(c,bd,col,{bb:[94,136,150,len+4],light:lt,dark:dk,spec:[108,166,4,12,.1],lw:1.2});c.save();bd(c);c.clip();for(let i=0;i<10;i++){c.beginPath();c.moveTo(100+i*4.8,150);c.quadraticCurveTo(105+i*3.4,190,121+(i-5)*1.3,len);c.strokeStyle=cshift(dk,0)+'66';c.lineWidth=1;c.stroke()}c.restore()}
function pSnow(c,x,y,r,col){c.strokeStyle=col;c.lineWidth=1;for(let j=0;j<3;j++){c.save();c.translate(x,y);c.rotate(j*Math.PI/3);c.beginPath();c.moveTo(-r,0);c.lineTo(r,0);c.stroke();c.restore()}}

// ---------- Fondos temáticos adicionales ----------
function bgSky(c,cols){c.fillStyle=LG(c,0,PCY-PRI,0,PCY+PRI,cols);c.fillRect(0,0,PW,PH)}
function bgHill(c,y,amp,col,seed){c.beginPath();c.moveTo(0,PH);for(let x=0;x<=240;x+=8)c.lineTo(x,y+Math.sin(x*.035+seed)*amp+Math.sin(x*.09+seed*2)*amp*.3);c.lineTo(240,PH);c.closePath();c.fillStyle=col;c.fill()}
const BGS={
 garden(c){bgSky(c,['#bfe8ff','#9ad08a','#3a6a2a']);pGlow(c,56,74,70,'255,250,210',.8);bgHill(c,180,8,'rgba(60,120,50,.6)',1);for(let i=0;i<9;i++)circ(c,10+i*28,186+Math.sin(i)*6,16,'rgba(40,96,40,.75)');
  for(let x=0;x<240;x+=12){c.beginPath();c.moveTo(x,214);c.lineTo(x+3,206);c.lineTo(x+6,214);c.lineTo(x+6,236);c.lineTo(x,236);c.closePath();c.fillStyle='rgba(240,230,210,.55)';c.fill()}c.fillStyle='rgba(240,230,210,.55)';c.fillRect(0,220,240,3);bgHill(c,236,4,'rgba(50,100,40,.85)',3)},
 field(c){bgSky(c,['#ffd89a','#f0904a','#6a2a20']);pGlow(c,120,178,90,'255,230,150',.9);circ(c,120,178,20,'rgba(255,240,190,.9)');bgHill(c,186,3,'rgba(110,60,30,.85)',2);for(let i=-8;i<=8;i++){c.beginPath();c.moveTo(120+i*4,190);c.lineTo(120+i*40,280);c.strokeStyle='rgba(60,30,10,.4)';c.lineWidth=2;c.stroke()}},
 night(c){bgSky(c,['#2a2a62','#181840','#08081a']);for(let i=0;i<30;i++)circ(c,pHash(i+100)*240,40+pHash(i+130)*120,.6+pHash(i)*.9,'rgba(255,255,230,.8)');pGlow(c,170,86,50,'255,250,210',.5);circ(c,170,86,20,'#f4f0d8');circ(c,177,82,17,'rgba(24,24,64,.3)');
  for(let i=0;i<14;i++){const x=i*18+pHash(i)*8,h=50+pHash(i+5)*40;c.beginPath();c.moveTo(x,PH);c.lineTo(x+1,PH-h-60);c.strokeStyle='rgba(10,10,20,.85)';c.lineWidth=2.4;c.stroke();for(let j=0;j<3;j++){const s=j%2?1:-1;c.beginPath();c.moveTo(x+1,PH-60-h*j/3);c.quadraticCurveTo(x+10*s,PH-70-h*j/3,x+14*s,PH-60-h*j/3);c.stroke()}}},
 winter(c){bgSky(c,['#1a2a6a','#3a6aa8','#cfe8ff']);c.save();c.globalCompositeOperation='lighter';for(let i=0;i<3;i++){c.beginPath();c.moveTo(20,90+i*12);c.bezierCurveTo(80,50+i*14,150,120+i*8,230,70+i*10);c.strokeStyle=['rgba(80,255,180,.25)','rgba(80,200,255,.22)','rgba(180,120,255,.18)'][i];c.lineWidth=14;c.stroke()}c.restore();
  for(let i=0;i<24;i++)circ(c,pHash(i+140)*240,50+pHash(i+170)*90,.5+pHash(i)*.8,'#fff');bgHill(c,200,10,'#e8f4ff',1);bgHill(c,222,6,'#bcd8f0',2)},
 sky(c){bgSky(c,['#5ab0ff','#a8dcff','#fff4c8']);pGlow(c,60,70,70,'255,255,230',.7);for(const [x,y,s] of [[40,110,1],[160,80,1.3],[180,150,.9],[24,170,.8]]){pCloud(c,[[x,y,10*s],[x+12*s,y-5*s,12*s],[x+26*s,y,9*s],[x+12*s,y+3*s,10*s]]);c.fillStyle='rgba(255,255,255,.85)';c.fill()}
  bgHill(c,228,6,'rgba(90,160,60,.85)',4);for(let i=0;i<26;i++)circ(c,pHash(i+180)*240,232+pHash(i+200)*40,2.6,['#ffd23f','#ff8ab0','#ffffff'][i%3])},
 forge(c){bgSky(c,['#2a120a','#5a220a','#140804']);pGlow(c,120,230,120,'255,120,30',.6);pGlow(c,40,200,40,'255,160,60',.5);for(const [x,y,w,h] of [[24,60,4,40],[40,64,4,30],[200,58,4,44],[214,62,3,34]]){c.fillStyle='rgba(10,4,2,.8)';c.fillRect(x,y,w,h);c.fillRect(x-4,y+h,w+8,6)}
  c.beginPath();c.moveTo(150,236);c.lineTo(214,236);c.lineTo(206,246);c.lineTo(196,248);c.lineTo(196,270);c.lineTo(168,270);c.lineTo(168,248);c.lineTo(150,244);c.closePath();c.fillStyle='rgba(10,6,4,.85)';c.fill()},
 lab(c){bgSky(c,['#3a2a6a','#24184a','#0e0820']);for(const y of [86,140,194]){c.fillStyle='rgba(20,10,30,.8)';c.fillRect(0,y,240,4);for(let i=0;i<7;i++){const x=12+i*34+pHash(y+i)*10,h=12+pHash(y+i+3)*12,col=['120,255,200','255,120,220','120,200,255','255,220,90'][i%4];c.fillStyle=`rgba(${col},.55)`;RRp(c,x,y-h,9,h,3);c.fill();pGlow(c,x+4,y-h/2,12,col,.3)}}},
 tempest(c){bgSky(c,['#3a2a62','#1a1440','#08061a']);for(let i=0;i<10;i++){const x=pHash(i+220)*240,y=60+pHash(i+240)*80,r=20+pHash(i)*24;E(c,x,y,r*1.4,r*.6);c.fillStyle='rgba(6,4,20,.5)';c.fill();E(c,x-6,y-6,r,r*.35);c.fillStyle='rgba(140,120,220,.18)';c.fill()}
  c.save();c.globalCompositeOperation='lighter';for(const [x,y,s] of [[40,70,4],[200,90,5],[176,160,6]]){pZig(c,x,y,x+(pHash(s)-.5)*30,y+80,s*10,18,7);c.strokeStyle='rgba(200,160,255,.55)';c.lineWidth=2;c.stroke()}c.restore()},
 river(c){bgSky(c,['#d8f4ff','#8ac8a8','#2a5a4a']);bgHill(c,170,6,'rgba(70,120,70,.7)',1);c.fillStyle=LG(c,0,190,0,280,['#7ac8e0','#2a6a8a']);c.fillRect(0,192,240,90);for(let i=0;i<14;i++){const y=198+i*6,x=pHash(i+260)*200;c.beginPath();c.moveTo(x,y);c.lineTo(x+20+pHash(i)*20,y);c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=1;c.stroke()}
  for(const x of [20,214])for(let i=0;i<9;i++){c.beginPath();c.moveTo(x+(i-4)*4,40);c.quadraticCurveTo(x+(i-4)*7,110,x+(i-4)*6,180+pHash(i)*20);c.strokeStyle='rgba(40,90,40,.6)';c.lineWidth=2;c.stroke()}},
 meadow(c){bgSky(c,['#ffe4f2','#d8f4c8','#7ac06a']);pGlow(c,120,90,100,'255,255,240',.6);for(const [x,y,r] of [[30,120,28],[210,110,30],[60,96,18],[186,80,20]]){c.fillStyle='rgba(90,60,40,.5)';c.fillRect(x-2,y,4,90);pCloud(c,[[x,y,r],[x-r*.7,y+6,r*.7],[x+r*.7,y+6,r*.7]]);c.fillStyle='rgba(255,170,210,.8)';c.fill()}
  bgHill(c,218,6,'rgba(110,190,90,.9)',5);for(let i=0;i<30;i++)circ(c,pHash(i+280)*240,224+pHash(i+300)*50,2.2,['#ffffff','#ff8ab0','#ffd23f','#b88aff'][i%4])},
 volcano(c){bgSky(c,['#ffb05a','#c83a1a','#2a0a0a']);pGlow(c,150,150,70,'255,200,80',.6);c.beginPath();c.moveTo(60,PH);c.lineTo(126,150);c.lineTo(170,150);c.lineTo(240,PH);c.closePath();c.fillStyle='rgba(40,10,6,.85)';c.fill();
  c.beginPath();c.moveTo(140,150);c.quadraticCurveTo(144,190,130,230);c.strokeStyle='rgba(255,140,40,.8)';c.lineWidth=3;c.stroke();for(let i=0;i<5;i++)circ(c,130+pHash(i+320)*40,120-i*14,10+i*4,'rgba(60,30,30,.35)');bgHill(c,240,8,'rgba(20,6,4,.9)',2)},
 cosmos(c){bgSky(c,['#14143e','#3a2266','#c8803a']);for(let i=0;i<40;i++)circ(c,pHash(i+340)*240,50+pHash(i+380)*140,.5+pHash(i),'rgba(255,250,220,.9)');pGlow(c,120,210,110,'255,200,100',.6);for(const r of [70,52]){c.beginPath();c.arc(120,150,r,0,7);c.strokeStyle='rgba(255,220,140,.25)';c.lineWidth=1;c.stroke()}},
 mystic(c){bgSky(c,['#3a1a62','#1e0c40','#0a0418']);pGlow(c,120,120,90,'220,120,255',.3);for(const [x,w] of [[30,18],[66,10],[178,12],[212,20]]){c.fillStyle='rgba(6,2,14,.75)';c.fillRect(x-w/2,30,w,250)}
  for(let i=0;i<8;i++){const x=20+pHash(i+400)*200,y=236+pHash(i+410)*30,r=3+pHash(i)*4;c.fillStyle='#e8e0f0';c.fillRect(x-1,y,2,6);E(c,x,y,r,r*.6);c.fillStyle='rgba(255,120,240,.85)';c.fill();pGlow(c,x,y,12,'255,120,240',.35)}}};

// ---------- Marcos adicionales (según el tipo del comandante) ----------
function frBase(c,ring,BB,col,lt,dk){VOL(c,ring,col,{bb:BB,light:lt,dark:dk,spec:[PCX-52,PCY-72,16,5,-.6]});c.beginPath();c.arc(PCX,PCY,PRI+3,0,7);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1.6;c.stroke();c.beginPath();c.arc(PCX,PCY,PRO-3,0,7);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.1;c.stroke()}
function frAt(a,r){return [PCX+Math.cos(a)*r,PCY+Math.sin(a)*r]}
const FRS={
 wood(c,ring,BB,MR){frBase(c,ring,BB,'#a8743a','#e8b878','#4a2a0e');for(let i=0;i<6;i++){c.beginPath();c.arc(PCX,PCY,PRI+3+i*2,i*1.1,i*1.1+1.6);c.strokeStyle='rgba(70,36,10,.35)';c.lineWidth=.8;c.stroke()}
  for(let i=0;i<8;i++){const [x,y]=frAt(i/8*Math.PI*2+.2,MR);VOL(c,cc=>{E(cc,x,y,2.6,2.6)},'#9aa0aa',{bb:[x-2.6,y-2.6,x+2.6,y+2.6],rim:1,lw:.7})}},
 wicker(c,ring,BB,MR){frBase(c,ring,BB,'#d8b060','#fff0b0','#7a5420');for(let i=0;i<48;i++){const a=i/48*Math.PI*2;c.save();c.translate(...frAt(a,MR));c.rotate(a+(i%2?.6:-.6));RRp(c,-5,-2,10,4,2);c.fillStyle=i%2?'#e8c070':'#c8963e';c.fill();c.strokeStyle='rgba(90,60,20,.6)';c.lineWidth=.7;c.stroke();c.restore()}},
 planks(c,ring,BB,MR){const n=10;for(let i=0;i<n;i++){if(i===3)continue;const a0=i/n*Math.PI*2+.05,a1=a0+Math.PI*2/n-.08,ro=PRO+(pHash(i)-.5)*4;VOL(c,cc=>{cc.beginPath();cc.arc(PCX,PCY,ro,a0,a1);cc.arc(PCX,PCY,PRI,a1,a0,true);cc.closePath()},['#8a6a4a','#7a5a3a','#9a7a52'][i%3],{bb:BB,light:'#c8a878',dark:'#3a2410',rim:2,lw:1});const [x,y]=frAt((a0+a1)/2,MR);E(c,x,y,1.8,1.8);c.fillStyle='#5a5a62';c.fill()}
  c.save();c.translate(...frAt(3.5/n*Math.PI*2,MR));c.rotate(3.5/n*Math.PI*2+1.9);VOL(c,cc=>{RRp(cc,-20,-6,40,12,2)},'#7a5a3a',{bb:[-20,-6,20,6],dark:'#3a2410',lw:1});c.restore()},
 ice(c,ring,BB,MR){for(let i=0;i<14;i++){const a=i/14*Math.PI*2+.1,l=10+pHash(i)*14;c.save();c.translate(...frAt(a,PRO-2));c.rotate(a);VOL(c,cc=>{cc.beginPath();cc.moveTo(0,-5);cc.lineTo(l,0);cc.lineTo(0,5);cc.closePath()},'#bfe8ff',{bb:[0,-5,l,5],light:'#ffffff',dark:'#4a8ac8',rim:1.4,lw:.8});c.restore()}
  frBase(c,ring,BB,'#a8dcff','#ffffff','#3a78b8');c.save();ring(c);c.clip();for(let i=0;i<10;i++){const [x,y]=frAt(pHash(i+300)*7,MR);c.beginPath();c.moveTo(x-6,y-4);c.lineTo(x+5,y+3);c.moveTo(x-2,y+5);c.lineTo(x+3,y-5);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=.8;c.stroke()}c.restore()},
 honey(c,ring,BB,MR){frBase(c,ring,BB,'#f0a828','#ffe9a0','#8a4a08');c.save();ring(c);c.clip();for(let i=0;i<30;i++)for(const rr of [PRI+4,PRO-4]){const [x,y]=frAt(i/30*Math.PI*2+(rr>MR?.1:0),rr);c.beginPath();for(let j=0;j<6;j++){const b=j/6*Math.PI*2;c.lineTo(x+Math.cos(b)*4.6,y+Math.sin(b)*4.6)}c.closePath();c.fillStyle=i%3?'rgba(255,230,140,.35)':'rgba(140,70,0,.3)';c.fill();c.strokeStyle='rgba(120,60,0,.55)';c.lineWidth=.8;c.stroke()}c.restore();
  for(const a of [1.2,1.9,2.4]){const [x,y]=frAt(a,PRO-1);VOL(c,cc=>{cc.beginPath();cc.moveTo(x-4,y);cc.quadraticCurveTo(x-4,y+10,x,y+13);cc.quadraticCurveTo(x+4,y+10,x+4,y);cc.closePath()},'#ffb020',{bb:[x-4,y,x+4,y+13],light:'#fff0a0',dark:'#a85a00',rim:1.2,lw:.8})}},
 iron(c,ring,BB,MR){frBase(c,ring,BB,'#4a4a52','#9a9aa8','#16161c');for(let i=0;i<10;i++){const [x,y]=frAt(i/10*Math.PI*2,MR);VOL(c,cc=>{E(cc,x,y,3.2,3.2)},'#6a6a74',{bb:[x-3,y-3,x+3,y+3],rim:1,lw:.7})}
  c.save();c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const a=pHash(i+400)*7;pZig(c,...frAt(a,PRI+3),...frAt(a+.12,PRO-3),i*5,4,4);c.strokeStyle='rgba(255,120,30,.8)';c.lineWidth=1.4;c.stroke()}c.restore()},
 brass(c,ring,BB,MR){for(let i=0;i<30;i++){c.save();c.translate(PCX,PCY);c.rotate(i/30*Math.PI*2);RRp(c,PRO-3,-3.5,8,7,1.5);P(c,'#c89a3a',1.2);c.restore()}
  frBase(c,ring,BB,'#d8a848','#fff0b0','#6a4a10');c.strokeStyle='rgba(90,50,0,.6)';c.lineWidth=1.1;for(let i=0;i<8;i++){const [x,y]=frAt(i/8*Math.PI*2+.39,MR);c.beginPath();if(i%3===0){c.moveTo(x,y-4);c.lineTo(x+4,y+3);c.lineTo(x-4,y+3);c.closePath()}else if(i%3===1){c.arc(x,y,3.6,0,7);c.moveTo(x-4,y);c.lineTo(x+4,y)}else{c.arc(x,y,3.4,0,7);c.moveTo(x,y-3.4);c.lineTo(x,y+5)}c.stroke()}
  for(const a of [0,Math.PI]){const [x,y]=frAt(a,PRO+2);VOL(c,cc=>{E(cc,x,y,7,7)},'#4ae0ff',{bb:[x-7,y-7,x+7,y+7],light:'#ffffff',dark:'#0a5a8a',rim:1.6,lw:1})}},
 stormgold(c,ring,BB,MR){frBase(c,ring,BB,'#2a3458','#6a7ab0','#0a0e20');for(let i=0;i<6;i++){const a=i/6*Math.PI*2+.26;c.save();c.translate(...frAt(a,MR));c.rotate(a+Math.PI/2);pBolt(c,0,0,6,'#ffd23f');c.restore()}
  for(const r of [PRO-1.5,PRI+1.5]){c.beginPath();c.arc(PCX,PCY,r,0,7);c.strokeStyle='#ffd23f';c.lineWidth=1.6;c.stroke()}},
 branch(c,ring,BB,MR){frBase(c,ring,BB,'#7a5a3a','#b8946a','#2a1a0a');for(let i=0;i<10;i++){c.beginPath();c.arc(PCX,PCY,PRI+4+(i%4)*2.6,i*.7,i*.7+.9);c.strokeStyle='rgba(40,20,6,.4)';c.lineWidth=.9;c.stroke()}
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2;if(Math.sin(a)<-.3)continue;const [x,y]=frAt(a,PRO-1),l=14+pHash(i)*16,dx=Math.cos(a)*7;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+dx*.7,y+l*.5,x+dx,y+l);c.strokeStyle='#4a6a2a';c.lineWidth=1;c.stroke();for(let j=1;j<=3;j++)leafHQ(c,x+dx*j/3,y+l*j/3,7,Math.PI/2+(j%2?.5:-.5),'#8ad06a','#2a5a1a')}},
 blossom(c,ring,BB,MR){frBase(c,ring,BB,'#f0c850','#fff6c8','#9a6a10');c.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,[x,y]=frAt(a,MR+Math.sin(a*9)*5);i?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle='#1e4a14';c.lineWidth=3.6;c.stroke();c.strokeStyle='#5aa83a';c.lineWidth=2;c.stroke();
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2+.55;leafHQ(c,...frAt(a,MR),8,a+1.4,'#7ad04a','#1e4a14')}
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2+.2,[x,y]=frAt(a,MR+Math.sin(a*9)*5);for(let j=0;j<5;j++){const b=j/5*Math.PI*2+a;VOL(c,cc=>{E(cc,x+Math.cos(b)*4.5,y+Math.sin(b)*4.5,4,3,b)},i%2?'#ff9ac0':'#fff0f6',{bb:[x-8,y-8,x+8,y+8],light:'#ffffff',dark:'#c84a80',rim:1,lw:.6})}circ(c,x,y,2.4,'#ffd23f')}},
 jade(c,ring,BB,MR){frBase(c,ring,BB,'#2a9a6a','#9affc8','#0a3a24');c.save();ring(c);c.clip();for(let i=0;i<40;i++){const [x,y]=frAt(i/40*Math.PI*2+(i%2)*.08,(i%2)?PRI+5:PRO-5);c.beginPath();c.arc(x,y,4.5,0,Math.PI);c.strokeStyle='rgba(10,50,30,.5)';c.lineWidth=1;c.stroke()}c.restore();
  for(const a of [Math.PI*.2,Math.PI*.8,Math.PI*1.2,Math.PI*1.8]){c.save();c.translate(...frAt(a,PRO));c.rotate(a+Math.PI/2);for(const s of [-1,0,1])VOL(c,cc=>{cc.beginPath();cc.moveTo(s*6-3,-2);cc.quadraticCurveTo(s*8,-14,s*6+1,-18);cc.quadraticCurveTo(s*6+2,-10,s*6+3,-2);cc.closePath()},'#2a2a30',{bb:[s*6-4,-18,s*6+4,-2],light:'#8a8a98',dark:'#0a0a0e',rim:1.2,lw:.8});c.restore()}},
 clock(c,ring,BB,MR){frBase(c,ring,BB,'#e8b838','#fff6c8','#7a4a08');const R2=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];c.font='bold 7px Georgia,serif';c.textAlign='center';c.textBaseline='middle';
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2-Math.PI/2,[x,y]=frAt(a,MR);c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.fillStyle='#5a3008';c.fillText(R2[i],0,0);c.restore()}
  for(let i=0;i<60;i++){if(i%5===0)continue;const a=i/60*Math.PI*2,[x0,y0]=frAt(a,PRO-2),[x1,y1]=frAt(a,PRO-5);c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.strokeStyle='rgba(90,50,0,.6)';c.lineWidth=.8;c.stroke()}},
 amethyst(c,ring,BB,MR){for(let i=0;i<12;i++){const a=i/12*Math.PI*2+.26,l=10+pHash(i+500)*12;c.save();c.translate(...frAt(a,PRO-3));c.rotate(a);VOL(c,cc=>{cc.beginPath();cc.moveTo(0,-5);cc.lineTo(l*.7,-4);cc.lineTo(l,0);cc.lineTo(l*.7,4);cc.lineTo(0,5);cc.closePath()},'#b07aff',{bb:[0,-5,l,5],light:'#f4e0ff',dark:'#4a1a8a',rim:1.2,lw:.8});c.restore()}
  frBase(c,ring,BB,'#7a4ac8','#e0c8ff','#2a0a5a');c.strokeStyle='rgba(255,200,255,.7)';c.lineWidth=.9;for(let i=0;i<10;i++){const [x,y]=frAt(i/10*Math.PI*2,MR);c.beginPath();c.moveTo(x-3,y-3);c.lineTo(x+3,y+3);c.moveTo(x,y-4);c.lineTo(x,y+4);if(i%2){c.moveTo(x-3,y+3);c.lineTo(x+3,y-3)}c.stroke()}}};

// ---------- Los otros 13 comandantes ----------
Object.assign(HPORT,{
 // PODADOR BREZO: jardinero robusto de barba tupida, gorra con ramita y tijeras de podar en alto.
 poda:{bg:'garden',frame:'wood',shine:'rgba(255,240,200,.45)',hp:[120,166],pv:[186,196],
  body(c){pBodyStd(c,'#c84a3a',{neck:'#e0a878'});c.save();pTorso(c,0);c.clip();c.fillStyle='rgba(90,10,10,.25)';for(let x=14;x<210;x+=14)c.fillRect(x,170,5,110);for(let y=176;y<280;y+=14)c.fillRect(10,y,200,5);c.restore();
   VOL(c,cc=>{RRp(cc,84,200,72,80,10)},'#4a7a3a',{bb:[84,200,156,280],light:'#8ac06a',dark:'#1a3a10',spec:[96,210,8,4]});
   for(const s of [-1,1]){c.beginPath();c.moveTo(120+s*30,204);c.lineTo(120+s*40,176);c.strokeStyle='#22140c';c.lineWidth=8;c.stroke();c.strokeStyle='#4a7a3a';c.lineWidth=5;c.stroke();VOL(c,cc=>{E(cc,120+s*30,206,4,4)},'#ffd23f',{bb:[116+s*30,202,124+s*30,210],lw:.8,rim:1})}
   RRp(c,108,226,24,16,3);c.fillStyle='rgba(20,40,10,.35)';c.fill()},
  head(c){const sk='#e0a878';pFace(c,{sk,shape:'square'});
   for(const [x,y] of [[92,112],[146,110]])VOL(c,cc=>{E(cc,x,y,7,10)},'#7a4a2a',{bb:[x-7,y-10,x+7,y+10],dark:'#3a1a0a',lw:1});
   const bd=cc=>{cc.beginPath();cc.moveTo(94,128);cc.quadraticCurveTo(96,150,106,166);cc.quadraticCurveTo(122,184,138,166);cc.quadraticCurveTo(148,150,147,126);cc.quadraticCurveTo(146,150,134,154);cc.quadraticCurveTo(122,160,108,154);cc.quadraticCurveTo(98,148,94,128);cc.closePath()};
   VOL(c,bd,'#8a5a2a',{bb:[94,126,148,180],light:'#c08a50',dark:'#3a1e08',lw:1.2});c.save();bd(c);c.clip();for(let i=0;i<14;i++){const x=96+i*3.6;c.beginPath();c.moveTo(x,140);c.quadraticCurveTo(x+2,160,x+(i-7)*.6,178);c.strokeStyle='rgba(50,24,6,.4)';c.lineWidth=1;c.stroke()}c.restore();
   pBrows(c,{c:'#6a3a1a',st:'thick',a:[.12,-.18]});pEyes(c,{sk,iris:'#3a7a2a',l:[.5,.55],r:[.55,.5]});pNose(c,sk,'big');pMouth(c,'grin');pMustache(c,'#8a5a2a','#c08a50','#3a1e08',20);
   VOL(c,cc=>{cc.beginPath();cc.moveTo(88,112);cc.bezierCurveTo(86,74,152,70,154,110);cc.closePath()},'#4a8a3a',{bb:[86,72,154,112],light:'#9ad07a',dark:'#1a3a10',spec:[104,84,10,5,-.4]});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(124,104);cc.quadraticCurveTo(160,100,178,112);cc.quadraticCurveTo(160,116,128,114);cc.closePath()},'#2a5a1a',{bb:[124,100,178,116],dark:'#0e2a08',lw:1});
   AO(c,120,118,30,6,.6);VOL(c,cc=>{E(cc,120,74,5,3)},'#2a5a1a',{bb:[115,71,125,77],lw:.8,rim:1});
   c.beginPath();c.moveTo(108,80);c.quadraticCurveTo(100,62,104,46);c.strokeStyle='#22140c';c.lineWidth=3.4;c.stroke();c.strokeStyle='#6a4a2a';c.lineWidth=1.8;c.stroke();leafHQ(c,104,50,14,-2,'#7ad04a','#1e4a14');leafHQ(c,102,62,12,-.6,'#5ab83a','#1e4a14');
   VOL(c,cc=>{E(cc,106,44,4,4)},'#c84a8a',{bb:[102,40,110,48],light:'#ffc0e0',dark:'#6a1a3a',lw:.8,rim:1})},
  prop(c){pArm(c,'#c84a3a',178,200);
   for(const a of [-.05,.22]){c.save();c.translate(190,196);c.rotate(a);VOL(c,cc=>{cc.beginPath();cc.moveTo(-3,-6);cc.quadraticCurveTo(-8,-70,8,-140);cc.quadraticCurveTo(10,-70,4,-6);cc.closePath()},'#c8d0d8',{bb:[-8,-140,10,-6],light:'#ffffff',dark:'#4a5664',lw:1,spec:[2,-90,1.4,14,0]});c.restore()}
   VOL(c,cc=>{E(cc,192,190,5,5)},'#8a8a94',{bb:[187,185,197,195],lw:.8});
   for(const a of [2.7,3.2]){c.save();c.translate(190,206);c.rotate(a-Math.PI);RRp(c,-4,0,8,26,4);P(c,'#c83a2a',1.6);c.restore()}
   pHand(c,178,192,'#e0a878')},
  fxProp(c,t){const ph=(t*.5)%1;if(ph<.3){c.save();c.globalCompositeOperation='lighter';const f=ph/.3;pGlow(c,190+8*f,186-120*f,10,'255,255,240',.9);c.restore()}},
  fx(c,t){for(let i=0;i<7;i++){const ph=(t*.2+pHash(i+600))%1;c.save();c.translate(196-ph*60+Math.sin(t*2+i)*12,40+ph*230);c.rotate(t*3+i);c.globalAlpha=Math.sin(ph*Math.PI);leafHQ(c,0,0,8,0,i%2?'#7ad04a':'#4a9a2a','#1e4a14');c.restore()}c.globalAlpha=1}},

 // TÍO SEMILLERO: abuelo bonachón con sombrero de paja de ala enorme, bigote blanco y bolsa de semillas.
 semillero:{bg:'field',frame:'wicker',shine:'rgba(255,240,190,.5)',hp:[120,166],pv:[184,206],
  body(c){pBodyStd(c,'#d8703a',{neck:'#d89870'});c.save();pTorso(c,0);c.clip();for(let y=180;y<280;y+=10){c.beginPath();c.moveTo(10,y);c.lineTo(210,y+4);c.strokeStyle='rgba(120,40,10,.18)';c.lineWidth=1;c.stroke()}c.restore();
   for(const s of [-1,1]){c.beginPath();c.moveTo(120+s*22,272);c.lineTo(120+s*34,178);c.strokeStyle='#22140c';c.lineWidth=8;c.stroke();c.strokeStyle='#6a3a1a';c.lineWidth=5;c.stroke()}
   VOL(c,cc=>{cc.beginPath();cc.moveTo(100,174);cc.quadraticCurveTo(120,186,140,174);cc.lineTo(128,200);cc.lineTo(120,190);cc.lineTo(112,200);cc.closePath()},'#d83a2a',{bb:[100,174,140,200],light:'#ff8a7a',dark:'#6a0a0a',lw:1})},
  head(c){const sk='#d89870';pFace(c,{sk,shape:'round',age:1,blush:1});
   for(const [x,y] of [[93,124],[147,122]])pCloudVol(c,[[x,y,6],[x,y+8,5]],'#f0ece0','#ffffff','#a8a090');
   pBrows(c,{c:'#f4ecdc',st:'bushy',a:[.18,-.2]});pEyes(c,{sk,iris:'#6a4a2a',l:[.68,.42],r:[.45,.72]});pNose(c,sk,'big');pMouth(c,'grin');pMustache(c,'#f4ecdc','#ffffff','#a8a090',26);
   const brim=cc=>{E(cc,120,104,88,20,-.04)};VOL(c,brim,'#e8c870',{bb:[32,84,208,124],light:'#fff4c0',dark:'#8a6020',spec:[80,96,22,4,-.05]});
   c.save();brim(c);c.clip();for(let i=0;i<26;i++){c.beginPath();c.ellipse(120,104,20+i*3.4,4+i*.62,-.04,0,7);c.strokeStyle='rgba(140,100,30,.25)';c.lineWidth=.8;c.stroke()}c.restore();AO(c,120,114,34,8,.65);
   const crown=cc=>{cc.beginPath();cc.moveTo(86,104);cc.bezierCurveTo(84,62,156,58,154,102);cc.quadraticCurveTo(120,110,86,104);cc.closePath()};VOL(c,crown,'#e8c870',{bb:[84,60,156,108],light:'#fff4c0',dark:'#8a6020',spec:[102,76,8,5,-.4]});
   c.save();crown(c);c.clip();for(let i=0;i<10;i++){c.beginPath();c.moveTo(80,64+i*5);c.lineTo(160,64+i*5);c.strokeStyle='rgba(140,100,30,.25)';c.lineWidth=.8;c.stroke()}c.restore();
   VOL(c,cc=>{cc.beginPath();cc.moveTo(86,96);cc.quadraticCurveTo(120,104,154,94);cc.lineTo(154,102);cc.quadraticCurveTo(120,110,86,104);cc.closePath()},'#c83a2a',{bb:[86,94,154,110],dark:'#5a0a0a',lw:1});
   c.beginPath();c.moveTo(140,96);c.quadraticCurveTo(146,80,142,66);c.strokeStyle='#22140c';c.lineWidth=3;c.stroke();c.strokeStyle='#5ab83a';c.lineWidth=1.6;c.stroke();leafHQ(c,142,70,12,-1.9,'#7ad04a','#1e4a14');leafHQ(c,143,78,10,-.5,'#5ab83a','#1e4a14')},
  prop(c){pArm(c,'#d8703a',176,204);
   const bag=cc=>{cc.beginPath();cc.moveTo(170,206);cc.quadraticCurveTo(160,250,186,256);cc.quadraticCurveTo(214,254,206,206);cc.quadraticCurveTo(188,198,170,206);cc.closePath()};
   VOL(c,bag,'#c8a070',{bb:[160,198,214,256],light:'#f0d8a8',dark:'#6a4a20',spec:[176,222,5,8,.2]});c.save();bag(c);c.clip();for(let i=0;i<8;i++){c.beginPath();c.moveTo(160,206+i*7);c.lineTo(214,212+i*7);c.strokeStyle='rgba(100,70,30,.25)';c.lineWidth=.8;c.stroke()}c.restore();
   c.beginPath();c.moveTo(172,212);c.quadraticCurveTo(188,218,204,210);c.strokeStyle='#22140c';c.lineWidth=3.4;c.stroke();c.strokeStyle='#8a5a2a';c.lineWidth=1.8;c.stroke();
   for(const [x,y] of [[182,204],[190,200],[198,205],[186,196]]){E(c,x,y,3,2.2);P(c,'#e8c870',1)}pHand(c,176,198,'#d89870',18,16)},
  fx(c,t){for(let i=0;i<6;i++){const ph=(t*.35+pHash(i+620))%1;c.globalAlpha=Math.sin(ph*Math.PI);E(c,180+Math.sin(i*2)*24+Math.sin(t*3+i)*4,196-ph*60,2.4,1.8);c.fillStyle='#e8c870';c.fill();c.globalAlpha=1}
   for(let i=0;i<3;i++){const ph=(t*.25+i/3)%1,s=Math.sin(ph*Math.PI);if(s<.05)continue;const [x,y]=frAt([1.95,1.62,1.25][i],PRO-2);c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(2,-8,0,-14);c.strokeStyle='#3a8a2a';c.lineWidth=2;c.stroke();leafHQ(c,0,-12,8,-2.4,'#7ad04a','#1e4a14');leafHQ(c,0,-12,8,-.7,'#7ad04a','#1e4a14');c.restore()}}},

 // ESPANTAPÁJAROS PAJA: cabeza de arpillera cosida, ojos que arden, sombrero puntiagudo roto y su cuervo en el hombro.
 espantap:{bg:'night',frame:'planks',shine:'rgba(255,180,90,.35)',hp:[120,166],pv:[190,176],
  body(c){pBodyStd(c,'#4a6aa8',{dk:'#1a2a5a'});
   for(const [x,y,w,h,col] of [[44,212,22,18,'#c8a050'],[150,230,18,16,'#a84a3a'],[96,250,16,14,'#6a8a3a']]){VOL(c,cc=>{RRp(cc,x,y,w,h,2)},col,{bb:[x,y,x+w,y+h],lw:1});c.setLineDash([2,2]);c.strokeStyle='#f0e0c0';c.lineWidth=.9;c.strokeRect(x+2,y+2,w-4,h-4);c.setLineDash([])}
   for(let i=0;i<9;i++){c.beginPath();c.moveTo(104+i*4,170);c.lineTo(100+i*5+(pHash(i)-.5)*10,192+pHash(i+3)*8);c.strokeStyle='#22140c';c.lineWidth=3;c.stroke();c.strokeStyle='#e8c870';c.lineWidth=1.8;c.stroke()}
   c.beginPath();c.moveTo(100,176);c.quadraticCurveTo(120,184,140,176);c.strokeStyle='#22140c';c.lineWidth=4;c.stroke();c.strokeStyle='#c8a060';c.lineWidth=2.2;c.stroke()},
  head(c){const sk='#d8b880';const face=cc=>{cc.beginPath();cc.moveTo(90,118);cc.bezierCurveTo(88,88,152,86,150,118);cc.bezierCurveTo(152,150,138,170,120,170);cc.bezierCurveTo(100,170,88,150,90,118);cc.closePath()};
   VOL(c,face,sk,{bb:[88,88,152,170],light:'#f4e0b0',dark:'#7a5a2a',spec:[104,108,7,4,-.3],lw:1.3});
   c.save();face(c);c.clip();for(let i=0;i<22;i++){c.beginPath();c.moveTo(86,90+i*4);c.lineTo(156,92+i*4);c.moveTo(88+i*3.2,86);c.lineTo(88+i*3.2,172);c.strokeStyle='rgba(110,80,30,.18)';c.lineWidth=.7;c.stroke()}c.restore();
   c.setLineDash([3,2.4]);c.beginPath();c.moveTo(110,92);c.quadraticCurveTo(104,130,108,168);c.strokeStyle='rgba(60,40,10,.6)';c.lineWidth=1;c.stroke();c.setLineDash([]);
   for(const [x,y,r] of [[106,124,7],[134,122,6]]){c.beginPath();c.moveTo(x-r,y+r*.3);c.lineTo(x,y-r);c.lineTo(x+r,y+r*.4);c.quadraticCurveTo(x,y+r*.9,x-r,y+r*.3);c.closePath();c.fillStyle='#1a0a02';c.fill();E(c,x,y+1,r*.45,r*.4);c.fillStyle=RG(c,x,y+1,r*.5,['#ffffff','#ffb02a','#ff6a00'],x,y);c.fill()}
   VOL(c,cc=>{E(cc,121,138,5,5)},'#a84a3a',{bb:[116,133,126,143],light:'#ff9a8a',dark:'#4a0a0a',rim:1.4,lw:.9});for(const [ox,oy] of [[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]]){E(c,121+ox,138+oy,.7,.7);c.fillStyle='#2a0a0a';c.fill()}
   c.beginPath();c.moveTo(104,152);c.quadraticCurveTo(122,160,142,148);c.strokeStyle='#2a1406';c.lineWidth=1.8;c.stroke();for(let i=0;i<7;i++){const f=i/6,x=104+38*f,y=152+Math.sin(f*Math.PI)*5-f*4;c.beginPath();c.moveTo(x-2,y-3.4);c.lineTo(x+2,y+3.4);c.stroke()}
   VOL(c,cc=>{E(cc,118,98,52,11,-.12)},'#6a4a2a',{bb:[66,86,170,110],light:'#a8805a',dark:'#2a1a08',lw:1.2});AO(c,120,108,30,7,.6);
   const hat=cc=>{cc.beginPath();cc.moveTo(86,98);cc.bezierCurveTo(92,70,104,48,118,36);cc.bezierCurveTo(132,24,150,22,170,30);cc.bezierCurveTo(152,36,140,44,138,58);cc.bezierCurveTo(144,72,150,86,152,94);cc.quadraticCurveTo(120,104,86,98);cc.closePath()};
   VOL(c,hat,'#6a4a2a',{bb:[86,22,170,104],light:'#a8805a',dark:'#2a1a08',spec:[104,70,5,12,.3]});
   VOL(c,cc=>{RRp(cc,104,66,18,14,2)},'#8a3a2a',{bb:[104,66,122,80],lw:1});c.setLineDash([2,2]);c.strokeStyle='#e8d0a0';c.lineWidth=.8;c.strokeRect(106,68,14,10);c.setLineDash([]);E(c,134,82,4,3);c.fillStyle='#120a04';c.fill();
   for(let i=0;i<6;i++){c.beginPath();c.moveTo(80+i*4,102);c.lineTo(74+i*3,114+pHash(i+40)*6);c.moveTo(156-i*4,98);c.lineTo(162-i*3,110+pHash(i+50)*6);c.strokeStyle='#e8c870';c.lineWidth=1.6;c.stroke()}},
  prop(c){const by=cc=>{cc.beginPath();cc.moveTo(166,180);cc.bezierCurveTo(166,160,186,150,200,156);cc.bezierCurveTo(212,160,214,176,206,186);cc.lineTo(222,200);cc.lineTo(200,194);cc.quadraticCurveTo(180,196,166,180);cc.closePath()};
   VOL(c,by,'#2a2a38',{bb:[166,150,222,200],light:'#6a6a88',dark:'#08080e',spec:[184,162,6,3,-.3]});for(let i=0;i<3;i++){c.beginPath();c.moveTo(178+i*6,170);c.quadraticCurveTo(190+i*6,180,200+i*5,192);c.strokeStyle='rgba(120,120,160,.35)';c.lineWidth=1;c.stroke()}
   VOL(c,cc=>{E(cc,192,148,11,10)},'#2a2a38',{bb:[181,138,203,158],light:'#6a6a88',dark:'#08080e'});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(200,146);cc.lineTo(216,150);cc.lineTo(200,153);cc.closePath()},'#ffb02a',{bb:[200,146,216,153],light:'#fff0a0',dark:'#8a4a00',lw:.9,rim:1});
   E(c,195,145,2.6,2.6);c.fillStyle='#ffd23f';c.fill();E(c,195.5,145,1.2,1.2);c.fillStyle='#000';c.fill();
   for(const x of [176,186]){c.beginPath();c.moveTo(x,192);c.lineTo(x-2,198);c.moveTo(x,192);c.lineTo(x+2,198);c.strokeStyle='#e0a020';c.lineWidth=1.4;c.stroke()}},
  fxHead(c,t){c.save();c.globalCompositeOperation='lighter';const f=.45+.25*Math.sin(t*5)+.15*Math.sin(t*13);for(const [x,y] of [[106,125],[134,123]])pGlow(c,x,y,14,'255,150,40',f);c.restore()},
  fx(c,t){for(let i=0;i<5;i++){const ph=(t*.18+pHash(i+640))%1;c.save();c.translate(40+pHash(i+650)*160+Math.sin(t+i)*14,260-ph*230);c.rotate(t*2+i);c.globalAlpha=Math.sin(ph*Math.PI);c.beginPath();c.moveTo(-5,0);c.lineTo(5,0);c.strokeStyle='#e8c870';c.lineWidth=1.6;c.stroke();c.restore()}c.globalAlpha=1}},

 // HADA ESCARCHA: alas de hielo, melena helada, tiara de cristales y varita de copo de nieve.
 escarcha:{bg:'winter',frame:'ice',shine:'rgba(200,240,255,.6)',hp:[120,166],pv:[180,196],
  body(c){pHairBack(c,'#d8f0ff','#ffffff','#6aa8d8',214,56);for(const s of [-1,1])for(let i=0;i<3;i++)pStrand(c,[120+s*(16+i*6),100,120+s*(40+i*8),130,120+s*(30+i*10),170,120+s*(34+i*12),206-i*10],7,'#d8f0ff','#ffffff','#6aa8d8');
   for(const s of [-1,1])for(const [a,l,w] of [[-.5,74,24],[.1,56,17]]){c.save();c.translate(120+s*24,170);c.scale(s,1);c.rotate(-a-.9);VOL(c,cc=>{cc.beginPath();cc.moveTo(0,0);cc.bezierCurveTo(w,-l*.3,w*.8,-l*.8,0,-l);cc.bezierCurveTo(-w*.4,-l*.7,-w*.3,-l*.3,0,0);cc.closePath()},'#bfeaff',{bb:[-w,-l,w,0],light:'#ffffff',dark:'#5a9ad8',rim:2,lw:1});c.beginPath();c.moveTo(0,-4);c.quadraticCurveTo(w*.4,-l*.5,0,-l*.92);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1;c.stroke();c.restore()}
   pBodyStd(c,'#9ad0f0',{lt:'#ffffff',dk:'#3a78b0',neck:'#e8f4ff'});
   for(let i=0;i<7;i++){const x=96+i*8;VOL(c,cc=>{cc.beginPath();cc.moveTo(x-4,178);cc.lineTo(x,166-(i%2)*5);cc.lineTo(x+4,178);cc.closePath()},'#dff4ff',{bb:[x-4,161,x+4,178],light:'#ffffff',dark:'#6aa8d8',lw:.8,rim:1})}
   c.save();c.translate(120,222);for(let i=0;i<6;i++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(0,0);c.lineTo(0,-12);c.moveTo(0,-7);c.lineTo(-3,-10);c.moveTo(0,-7);c.lineTo(3,-10);c.strokeStyle='#ffffff';c.lineWidth=1.6;c.stroke()}c.restore()},
  head(c){const sk='#eaf6ff';pFace(c,{sk,shape:'heart',blush:1,dk:'#8ab0d0'});
   for(const [x0,x1,cx] of [[98,92,90],[110,100,104],[124,120,128],[140,150,146]])pStrand(c,[x0+8,92,cx,104,x1,112,x1,120],5,'#e4f6ff','#ffffff','#7ab8e0');
   pBrows(c,{c:'#a8d8f8',st:'thin',a:[.05,-.08]});pEyes(c,{sk,iris:'#3a8ad8',l:[.3,.4],r:[.4,.3]});for(const [x,y] of [[100,124],[140,122]]){c.beginPath();c.moveTo(x,y-3);c.lineTo(x+(x<120?-4:4),y-6);c.strokeStyle='#22100a';c.lineWidth=1.2;c.stroke()}
   pNose(c,sk,'small');pMouth(c,'smile');
   for(const [x,h,w] of [[96,18,6],[108,28,7],[120,46,9],[132,28,7],[144,18,6]])VOL(c,cc=>{cc.beginPath();cc.moveTo(x-w,100);cc.lineTo(x-w*.4,100-h*.7);cc.lineTo(x,100-h);cc.lineTo(x+w*.4,100-h*.7);cc.lineTo(x+w,100);cc.closePath()},'#bfeaff',{bb:[x-w,100-h,x+w,100],light:'#ffffff',dark:'#3a7ac8',lw:.9,rim:1.4});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(88,104);cc.quadraticCurveTo(120,92,152,104);cc.lineTo(152,100);cc.quadraticCurveTo(120,88,88,100);cc.closePath()},'#e8f8ff',{bb:[88,88,152,104],lw:.8});
   VOL(c,cc=>{E(cc,120,96,4.5,4.5)},'#5ad8ff',{bb:[115,91,125,101],light:'#ffffff',dark:'#0a5aa8',lw:.8,rim:1})},
  prop(c){pArm(c,'#9ad0f0',172,200);c.save();c.translate(184,204);c.rotate(-.25);RRp(c,-2,-80,4,84,2);P(c,LG(c,-2,0,2,0,['#ffffff','#9ad0f0']),1.4);c.translate(0,-88);
   for(let i=0;i<6;i++){c.rotate(Math.PI/3);VOL(c,cc=>{cc.beginPath();cc.moveTo(-2.5,0);cc.lineTo(0,-14);cc.lineTo(2.5,0);cc.closePath()},'#dff6ff',{bb:[-2.5,-14,2.5,0],light:'#fff',dark:'#5aa0d8',lw:.7,rim:1})}circ(c,0,0,3.4,'#ffffff');c.restore();pHand(c,174,196,'#eaf6ff',18,16)},
  fxProp(c,t){c.save();c.globalCompositeOperation='lighter';pGlow(c,162,119,26,'180,240,255',.45+.2*Math.sin(t*3));c.restore()},
  fx(c,t){for(let i=0;i<14;i++){const ph=(t*.12+pHash(i+660))%1;c.save();c.globalAlpha=Math.sin(ph*Math.PI);pSnow(c,20+pHash(i+670)*200+Math.sin(t+i)*10,20+ph*250,2+pHash(i)*2.4,'#ffffff');c.restore()}}},

 // CAPITANA POLEN: aviadora con gorro de cuero, gafas, antenas, bufanda al viento y una bola de polen.
 polen:{bg:'sky',frame:'honey',shine:'rgba(255,230,150,.55)',hp:[120,166],pv:[178,200],
  body(c){for(const s of [-1,1]){c.save();c.translate(120+s*30,178);c.scale(s,1);c.rotate(-.5);E(c,26,-26,30,14,-.5);c.fillStyle='rgba(230,250,255,.55)';c.fill();c.strokeStyle='rgba(60,90,120,.6)';c.lineWidth=1.2;c.stroke();c.beginPath();c.moveTo(4,-4);c.quadraticCurveTo(26,-24,52,-38);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.8;c.stroke();c.restore()}
   pBodyStd(c,'#ffd23f',{dk:'#9a6a08',neck:'#f0c090'});c.save();pTorso(c,0);c.clip();c.fillStyle='#2a1a0a';for(let y=196;y<280;y+=22)c.fillRect(0,y,240,10);c.restore();
   pCloudVol(c,[[86,180,12],[102,174,12],[120,172,12],[138,174,12],[154,180,12]],'#f0e0c8','#ffffff','#a88a60');
   VOL(c,cc=>{cc.beginPath();cc.moveTo(140,178);cc.bezierCurveTo(170,170,196,186,226,170);cc.lineTo(232,184);cc.bezierCurveTo(204,198,176,190,150,192);cc.closePath()},'#e83a2a',{bb:[140,166,232,198],light:'#ff9a8a',dark:'#6a0a0a',lw:1});
   VOL(c,cc=>{E(cc,74,214,9,9)},'#ffd23f',{bb:[65,205,83,223],light:'#fffbe0',dark:'#8a5a0a',lw:1});c.save();c.translate(74,214);for(let j=0;j<6;j++){c.rotate(Math.PI/3);E(c,0,-4,2.4,4);c.fillStyle='rgba(140,80,0,.6)';c.fill()}c.restore()},
  head(c){const sk='#f0c090';for(const s of [-1,1])pCloudVol(c,[[120+s*28,124,12],[120+s*30,140,10],[120+s*26,152,8]],'#3a2a1a','#7a5a3a','#120a04');
   pFace(c,{sk,shape:'round',blush:1,freckles:1,ear:false});
   pBrows(c,{c:'#3a2410',st:'thin',a:[.1,-.25]});pEyes(c,{sk,iris:'#e08a10',l:[.7,.42],r:[.4,.62]});pNose(c,sk,'small');pMouth(c,'grin');
   VOL(c,cc=>{cc.beginPath();cc.moveTo(88,118);cc.bezierCurveTo(84,74,156,70,152,116);cc.quadraticCurveTo(120,100,88,118);cc.closePath()},'#c88a3a',{bb:[84,72,156,118],light:'#f0c080',dark:'#5a3a1a',spec:[106,86,10,5,-.4]});
   for(const s of [-1,1])VOL(c,cc=>{cc.beginPath();cc.moveTo(120+s*32,110);cc.quadraticCurveTo(120+s*38,132,120+s*30,148);cc.quadraticCurveTo(120+s*24,140,120+s*26,112);cc.closePath()},'#b87a2a',{bb:[86,108,154,148],dark:'#4a2a0a',lw:1});
   c.setLineDash([2,2]);c.beginPath();c.moveTo(120,76);c.lineTo(120,104);c.strokeStyle='rgba(90,50,10,.6)';c.lineWidth=1;c.stroke();c.setLineDash([]);AO(c,120,116,30,6,.5);
   pGoggles(c,98,'#5a3a1a','#a8a8b8','#ffd23f',10);
   for(const s of [-1,1]){c.beginPath();c.moveTo(120+s*12,80);c.bezierCurveTo(120+s*16,56,120+s*30,42,120+s*40,36);c.strokeStyle='#22140c';c.lineWidth=3.6;c.stroke();c.strokeStyle='#3a2a1a';c.lineWidth=2;c.stroke();VOL(c,cc=>{E(cc,120+s*40,34,5.5,5.5)},'#ffd23f',{bb:[114+s*40,28,126+s*40,40],light:'#fffbe0',dark:'#a86a08',lw:.9,rim:1.4})}},
  prop(c){pArm(c,'#ffd23f',172,202);VOL(c,cc=>{E(cc,186,186,15,15)},'#ffe14a',{bb:[171,171,201,201],light:'#ffffff',dark:'#c88a10',spec:[181,180,4,3]});
   for(let i=0;i<12;i++){const a=i/12*Math.PI*2;E(c,186+Math.cos(a)*15,186+Math.sin(a)*15,2.4,2.4);c.fillStyle='#ffd23f';c.fill();c.strokeStyle='rgba(140,90,0,.6)';c.lineWidth=.7;c.stroke()}pHand(c,174,196,'#f0c090',20,16)},
  fxProp(c,t){c.save();c.globalCompositeOperation='lighter';pGlow(c,186,186,28,'255,230,90',.5+.2*Math.sin(t*3));c.restore()},
  fx(c,t){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const ph=(t*.25+pHash(i+680))%1,a=pHash(i+690)*7+t*.5,r=10+ph*70;c.globalAlpha=Math.sin(ph*Math.PI);circ(c,186+Math.cos(a)*r,186+Math.sin(a)*r-ph*30,1.4+pHash(i)*1.4,'#ffe680')}c.restore();
   const a=t*1.6,x=120+Math.cos(a)*100,y=110+Math.sin(a)*40;c.save();c.translate(x,y);c.scale(Math.sin(a)>0?-1:1,1);E(c,1,-5,4,3,-.3);c.fillStyle='rgba(255,255,255,.8)';c.fill();E(c,0,0,5,3.6);c.fillStyle='#ffd23f';c.fill();c.strokeStyle='#22140c';c.lineWidth=1;c.stroke();c.fillStyle='#22140c';c.fillRect(-1,-3.4,1.6,6.8);c.restore()}},

 // HERRERA MUSGO: herrera de pelo de musgo, pañuelo rojo, delantal de cuero y martillo al rojo vivo en alto.
 herrera:{bg:'forge',frame:'iron',shine:'rgba(255,150,60,.45)',hp:[120,166],pv:[184,196],
  body(c){pBodyStd(c,'#c88a60',{dk:'#6a3a1a',neck:'#c88a60'});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(70,190);cc.quadraticCurveTo(120,176,170,190);cc.lineTo(176,272);cc.lineTo(64,272);cc.closePath()},'#5a6a4a',{bb:[64,176,176,272],light:'#8a9a7a',dark:'#1e2a14'});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(84,206);cc.quadraticCurveTo(120,198,156,206);cc.lineTo(162,272);cc.lineTo(78,272);cc.closePath()},'#7a5a3a',{bb:[78,198,162,272],light:'#b88a5a',dark:'#2a1a08',spec:[96,214,8,4]});
   for(const s of [-1,1]){c.beginPath();c.moveTo(120+s*36,206);c.lineTo(120+s*30,178);c.strokeStyle='#22140c';c.lineWidth=5;c.stroke();c.strokeStyle='#5a3a1a';c.lineWidth=3;c.stroke()}
   VOL(c,cc=>{RRp(cc,100,226,40,20,4)},'#6a4a2a',{bb:[100,226,140,246],dark:'#2a1a08',lw:1});c.beginPath();c.moveTo(110,230);c.lineTo(110,244);c.moveTo(118,230);c.lineTo(118,244);c.strokeStyle='#9aa0aa';c.lineWidth=2;c.stroke();
   E(c,52,200,10,6);c.fillStyle='rgba(30,20,10,.3)';c.fill()},
  head(c){const sk='#c88a60';pCloudVol(c,[[92,118,12],[148,116,12],[94,134,9],[148,132,9],[104,96,14],[136,94,14],[120,88,14]],'#5a9a3a','#9ad06a','#1e4a14');
   pFace(c,{sk,shape:'square'});E(c,138,140,6,3,-.3);c.fillStyle='rgba(40,24,10,.3)';c.fill();
   pBrows(c,{c:'#2a5a1a',st:'thick',a:[.28,-.34]});pEyes(c,{sk,iris:'#3a8a3a',l:[.32,.72],r:[.72,.32]});pNose(c,sk,'strong');pMouth(c,'smirk');
   c.beginPath();c.moveTo(127,113);c.lineTo(131,104);c.strokeStyle='rgba(255,220,200,.8)';c.lineWidth=1.2;c.stroke();
   VOL(c,cc=>{cc.beginPath();cc.moveTo(88,110);cc.bezierCurveTo(88,80,152,76,152,108);cc.quadraticCurveTo(120,98,88,110);cc.closePath()},'#c83a2a',{bb:[88,78,152,110],light:'#ff8a7a',dark:'#5a0a0a',spec:[106,88,8,4,-.4]});
   for(let i=0;i<5;i++){E(c,98+i*12,92+Math.sin(i)*3,1.8,1.8);c.fillStyle='#fff';c.fill()}
   for(const [a,l] of [[-.4,22],[.3,18]]){c.save();c.translate(150,100);c.rotate(a);VOL(c,cc=>{cc.beginPath();cc.moveTo(0,-4);cc.quadraticCurveTo(l*.6,-8,l,-2);cc.quadraticCurveTo(l*.6,4,0,4);cc.closePath()},'#c83a2a',{bb:[0,-8,l,4],dark:'#5a0a0a',lw:1});c.restore()}
   AO(c,120,112,30,6,.6);pCloudVol(c,[[96,104,6],[144,102,6]],'#5a9a3a','#9ad06a','#1e4a14')},
  prop(c){VOL(c,cc=>{cc.beginPath();cc.moveTo(146,190);cc.quadraticCurveTo(176,176,184,196);cc.lineTo(196,192);cc.lineTo(200,206);cc.quadraticCurveTo(172,226,146,214);cc.closePath()},'#c88a60',{bb:[146,176,200,226],light:'#f0b888',dark:'#6a3a1a',spec:[164,188,8,4,-.3]});
   c.save();c.translate(190,196);c.rotate(.18);RRp(c,-3.5,-150,7,156,3.5);P(c,LG(c,-4,0,4,0,['#a87444','#5a3414']),1.6);
   VOL(c,cc=>{RRp(cc,-22,-168,44,26,5)},'#6a6a78',{bb:[-22,-168,22,-142],light:'#d8d8e8',dark:'#1e1e28',spec:[-12,-162,10,3,0]});
   for(const x of [-24,16])VOL(c,cc=>{RRp(cc,x,-170,8,30,3)},'#4a4a58',{bb:[x,-170,x+8,-140],lw:1});c.restore();pHand(c,180,186,'#c88a60',20,20)},
  fxProp(c,t){c.save();c.translate(190,196);c.rotate(.18);c.globalCompositeOperation='lighter';pGlow(c,0,-155,30,'255,120,40',.35+.15*Math.sin(t*4));c.restore()},
  fx(c,t){c.save();c.globalCompositeOperation='lighter';const f=(t*.6)%1;for(let i=0;i<16;i++){const a=pHash(i+700)*Math.PI*1.4-Math.PI*1.2,v=40+pHash(i+710)*70,x=218+Math.cos(a)*v*f,y=43+Math.sin(a)*v*f+f*f*60;c.globalAlpha=1-f;c.beginPath();c.moveTo(x,y);c.lineTo(x-Math.cos(a)*5,y-Math.sin(a)*5);c.strokeStyle=i%2?'#ffd060':'#ff8a20';c.lineWidth=1.8;c.stroke()}c.restore()}},

 // ALQUIMISTA ZAFIRO: pelo azul en púas, gafas de laboratorio, abrigo con galones y un matraz burbujeante.
 alquimista:{bg:'lab',frame:'brass',shine:'rgba(120,230,255,.45)',hp:[120,166],pv:[180,192],
  body(c){pBodyStd(c,'#5a3a8a',{dk:'#1e1038',neck:'#e8b890'});
   for(const s of [-1,1])VOL(c,cc=>{cc.beginPath();cc.moveTo(120+s*6,176);cc.lineTo(120+s*34,160);cc.lineTo(120+s*40,192);cc.lineTo(120+s*14,206);cc.closePath()},'#4a2a7a',{bb:[80,160,160,206],light:'#9a7ad8',dark:'#1a0a30',lw:1});
   c.beginPath();c.moveTo(120,180);c.lineTo(120,272);c.strokeStyle='#ffd23f';c.lineWidth=2.4;c.stroke();for(let i=0;i<4;i++)VOL(c,cc=>{E(cc,128,196+i*18,3.4,3.4)},'#ffd23f',{bb:[124,192+i*18,132,200+i*18],lw:.8,rim:1});
   for(let i=0;i<4;i++){const x=40+i*14;VOL(c,cc=>{RRp(cc,x,232,9,16,3)},['#4ae0ff','#ff6ac8','#7aff6a','#ffd23f'][i],{bb:[x,232,x+9,248],light:'#ffffff',dark:'#2a2a4a',lw:.8,rim:1.2})}},
  head(c){const sk='#e8b890';
   for(const [x,y,a,l] of [[86,118,-2.4,26],[88,98,-2.1,32],[98,82,-1.9,40],[112,74,-1.65,48],[128,74,-1.4,52],[142,80,-1.15,44],[152,96,-.9,36],[154,116,-.6,26]]){const tx=x+Math.cos(a)*l,ty=y+Math.sin(a)*l,nx=-Math.sin(a)*9,ny=Math.cos(a)*9;
    VOL(c,cc=>{cc.beginPath();cc.moveTo(x-nx,y-ny);cc.quadraticCurveTo((x+tx)/2-nx*.3,(y+ty)/2-ny*.3,tx,ty);cc.quadraticCurveTo((x+tx)/2+nx*.6,(y+ty)/2+ny*.6,x+nx,y+ny);cc.closePath()},'#3a6ad8',{bb:[Math.min(x,tx)-9,Math.min(y,ty)-9,Math.max(x,tx)+9,Math.max(y,ty)+9],light:'#9ac0ff',dark:'#0e2a7a',lw:1,rim:2})}
   pCloudVol(c,[[100,102,16],[120,96,18],[140,100,16]],'#3a6ad8','#9ac0ff','#0e2a7a');pFace(c,{sk,shape:'heart'});
   for(const [x0,x1] of [[100,96],[114,112],[132,138]])pStrand(c,[x0,96,x0-2,106,x1,110,x1,118],4,'#3a6ad8','#9ac0ff','#0e2a7a');
   pBrows(c,{c:'#1a3a8a',st:'angled',a:[.05,-.4]});pEyes(c,{sk,iris:'#28c8ff',l:[.6,.3],r:[.3,.55]});pNose(c,sk,'small');pMouth(c,'smirk');pGoggles(c,94,'#4a2a6a','#d8a848','#4ae0ff',10)},
  prop(c){pArm(c,'#5a3a8a',172,196);const fl=cc=>{cc.beginPath();cc.moveTo(182,150);cc.lineTo(182,162);cc.bezierCurveTo(164,168,164,196,186,198);cc.bezierCurveTo(208,196,208,168,190,162);cc.lineTo(190,150);cc.closePath()};
   c.save();fl(c);c.fillStyle='rgba(220,250,255,.35)';c.fill();c.clip();c.fillStyle=LG(c,0,170,0,198,['#9affff','#28c8ff','#0a4a8a']);c.fillRect(160,172,50,30);c.restore();
   fl(c);c.strokeStyle='#e0f8ff';c.lineWidth=1.6;c.stroke();E(c,177,178,3,6,-.4);c.fillStyle='rgba(255,255,255,.8)';c.fill();VOL(c,cc=>{RRp(cc,180,144,12,8,2)},'#8a5a2a',{bb:[180,144,192,152],lw:.8,rim:1});pHand(c,174,188,'#e8b890',18,16)},
  fxProp(c,t){c.save();c.globalCompositeOperation='lighter';pGlow(c,186,182,30,'80,220,255',.45+.2*Math.sin(t*3));for(let i=0;i<6;i++){const ph=(t*.6+i/6)%1;c.globalAlpha=1-ph;E(c,186+Math.sin(t*3+i*2)*6,142-ph*60,2+ph*3,2+ph*3);c.strokeStyle='#9affff';c.lineWidth=1;c.stroke()}c.restore()},
  fx(c,t){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const ph=(t*.3+pHash(i+720))%1;c.globalAlpha=Math.sin(ph*Math.PI)*.8;star(c,30+pHash(i+730)*180,200-ph*150,1.6+pHash(i)*1.6,i%2?'#9affff':'#ff9aff')}c.restore()}},

 // SEÑORA TORMENTA: melena de nubes negras con rayos dentro, ojos eléctricos y un orbe de relámpagos.
 tormenta:{bg:'tempest',frame:'stormgold',shine:'rgba(255,240,140,.5)',hp:[120,166],pv:[184,176],
  body(c){pBodyStd(c,'#3a4a7a',{dk:'#0e1430',neck:'#c8d0e8'});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(92,180);cc.lineTo(80,154);cc.lineTo(104,168);cc.lineTo(120,150);cc.lineTo(136,168);cc.lineTo(160,154);cc.lineTo(148,180);cc.closePath()},'#2a3458',{bb:[80,150,160,180],light:'#6a7ab0',dark:'#0a0e20',lw:1});
   c.beginPath();c.moveTo(60,196);c.quadraticCurveTo(120,214,180,196);c.strokeStyle='#ffd23f';c.lineWidth=2.4;c.stroke();pBolt(c,120,232,16,'#ffd23f');pBolt(c,70,240,9,'#fff27a');pBolt(c,170,244,9,'#fff27a')},
  head(c){const sk='#c8d0e8',hair=[[84,122,18],[156,118,18],[78,96,20],[160,90,20],[90,66,22],[150,60,22],[110,46,24],[134,40,22],[120,70,26],[70,140,12],[168,138,12],[98,26,14],[150,24,13],[124,16,14]];
   pCloudVol(c,hair,'#4a5a7a','#8a9ac0','#141a30');c.save();pCloud(c,hair);c.clip();c.globalCompositeOperation='lighter';for(const [x,y,s] of [[100,40,1],[146,60,2]]){pZig(c,x,y,x+10,y+40,s*7,10,5);c.strokeStyle='rgba(150,230,255,.6)';c.lineWidth=1.6;c.stroke()}c.restore();
   pFace(c,{sk,shape:'long',dk:'#6a7898',ear:false});
   pStrand(c,[104,92,96,104,94,120,92,140],5,'#4a5a7a','#8a9ac0','#141a30');pStrand(c,[138,92,146,104,148,122,150,140],5,'#4a5a7a','#8a9ac0','#141a30');
   pBrows(c,{c:'#1a2238',st:'angled',a:[.32,-.36]});pEyes(c,{sk,iris:'#28e8ff',glow:1});pNose(c,sk,'small');pMouth(c,'smirk');
   VOL(c,cc=>{cc.beginPath();cc.moveTo(94,106);cc.quadraticCurveTo(120,94,148,104);cc.lineTo(146,110);cc.quadraticCurveTo(120,100,96,112);cc.closePath()},'#ffd23f',{bb:[94,94,148,112],light:'#fffbe0',dark:'#8a5a0a',lw:.9});pBolt(c,121,96,8,'#fff27a')},
  prop(c){VOL(c,cc=>{cc.beginPath();cc.moveTo(146,190);cc.quadraticCurveTo(170,184,178,170);cc.lineTo(192,174);cc.quadraticCurveTo(184,200,150,214);cc.closePath()},'#3a4a7a',{bb:[146,170,192,214],light:'#7a8ac0',dark:'#0e1430'});
   pHand(c,174,164,'#c8d0e8',20,16);VOL(c,cc=>{E(cc,186,146,16,16)},'#28a8e8',{bb:[170,130,202,162],light:'#e0ffff',dark:'#0a2a6a',spec:[180,139,5,3]})},
  fxProp(c,t){const f=Math.floor(t*16);c.save();c.globalCompositeOperation='lighter';pGlow(c,186,146,34,'90,220,255',.5+.2*Math.sin(t*6));c.save();E(c,186,146,15,15);c.clip();for(let i=0;i<3;i++){pZig(c,186,146,186+(pHash(f+i)-.5)*30,146+(pHash(f+i+9)-.5)*30,f+i,6,4);c.strokeStyle='#ffffff';c.lineWidth=1.2;c.stroke()}c.restore();
   if(Math.sin(t*1.7)>.6){pZig(c,180,134,150,64,f*3,16,7);c.strokeStyle='rgba(160,230,255,.85)';c.lineWidth=2.4;c.stroke();c.strokeStyle='#ffffff';c.lineWidth=.9;c.stroke()}c.restore()},
  fxHead(c,t){c.save();c.globalCompositeOperation='lighter';for(const [x,y] of [[107,126],[134,124]])pGlow(c,x,y,13,'90,230,255',.5+.2*Math.sin(t*4));c.restore()},
  bgfx(c,t){const fl=Math.max(0,Math.sin(t*1.1))**24;if(fl>.02){c.fillStyle=`rgba(210,190,255,${fl*.5})`;c.fillRect(0,0,PW,PH)}}},

 // GUARDIÁN SAUCE: anciano de cabellera de sauce colgante, barba blanca larga y báculo con gema viva.
 guardian:{bg:'river',frame:'branch',shine:'rgba(200,255,170,.4)',hp:[120,166],pv:[184,190],
  body(c){pBodyStd(c,'#5a7a4a',{dk:'#1e3a10'});for(let i=0;i<10;i++)leafHQ(c,24+i*20,266-Math.abs(i-4.5)*3,12,-Math.PI/2+(pHash(i)-.5)*.6,'#8ad06a','#2a5a1a');
   c.beginPath();c.moveTo(70,186);c.quadraticCurveTo(120,210,170,186);c.strokeStyle='#c8e0a0';c.lineWidth=3;c.stroke()},
  head(c){const sk='#c8a080';
   for(let i=0;i<16;i++){const x0=82+i*5.2,s=x0<120?-1:1,len=70+pHash(i+740)*60,ex=s*(14+pHash(i)*16);c.beginPath();c.moveTo(x0,84);c.bezierCurveTo(x0+s*14,110,x0+s*20,150,x0+ex,84+len);c.strokeStyle='#22140c';c.lineWidth=3.6;c.stroke();c.strokeStyle=['#6ab84a','#8ad06a','#4a9a3a'][i%3];c.lineWidth=2.2;c.stroke();
    for(let j=1;j<6;j++){const f=j/6;leafHQ(c,x0+ex*f*f+s*f*8,84+len*f,7,Math.PI/2+s*.6+(j%2?.5:-.3),j%2?'#8ad06a':'#5aa83a','#1e4a14')}}
   pFace(c,{sk,shape:'long',age:1,ear:false});
   for(let i=0;i<11;i++){const a=-Math.PI*.95+i*Math.PI*.09;leafHQ(c,120+Math.cos(a)*22,100+Math.sin(a)*14,20+((i*7)%4)*5,a,i%2?'#9ad870':'#6ab84a','#1e4a14')}
   pCloudVol(c,[[100,94,10],[120,88,12],[140,92,10]],'#7ac05a','#c0f0a0','#1e4a14');
   pBrows(c,{c:'#f0f0e8',st:'bushy',a:[.14,-.14]});pEyes(c,{sk,iris:'#5ad84a',l:[.62,.62],r:[.62,.62]});pNose(c,sk,'big');
   pLongBeard(c,'#eeeee6','#ffffff','#9a9a90',232);pMustache(c,'#f4f4ec','#ffffff','#9a9a90',22)},
  prop(c){pArm(c,'#5a7a4a',176,194);c.save();c.translate(188,206);c.rotate(-.08);const sp=()=>{c.beginPath();c.moveTo(0,64);c.bezierCurveTo(4,20,-4,-40,2,-150)};sp();c.strokeStyle='#22140c';c.lineWidth=9;c.stroke();sp();c.strokeStyle=LG(c,-4,0,4,0,['#b08a5a','#5a3a1a']);c.lineWidth=5.6;c.stroke();
   for(const s of [-1,1]){c.beginPath();c.moveTo(2,-140);c.bezierCurveTo(s*16,-150,s*14,-172,s*4,-176);c.strokeStyle='#22140c';c.lineWidth=5;c.stroke();c.strokeStyle='#8a6a3a';c.lineWidth=2.8;c.stroke()}
   VOL(c,cc=>{E(cc,2,-160,10,10)},'#7aff6a',{bb:[-8,-170,12,-150],light:'#eaffea',dark:'#1a7a2a',spec:[-1,-164,3,2]});leafHQ(c,4,-130,12,-.4,'#8ad06a','#1e4a14');c.restore();pHand(c,176,188,'#c8a080')},
  fxProp(c,t){c.save();c.globalCompositeOperation='lighter';pGlow(c,177,47,30,'130,255,120',.45+.2*Math.sin(t*2.4));c.restore()},
  fx(c,t){for(let i=0;i<6;i++){const ph=(t*.13+pHash(i+760))%1;c.save();c.translate(30+pHash(i+770)*180+Math.sin(t*1.5+i)*16,20+ph*250);c.rotate(Math.sin(t*2+i)*.8+1.5);c.globalAlpha=Math.sin(ph*Math.PI);leafHQ(c,0,0,10,0,'#9ad870','#2a5a1a');c.restore()}
   c.save();c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const a=t*.5+i;circ(c,120+Math.cos(a*1.3+i)*90,150+Math.sin(a+i*2)*70,1.6,`rgba(220,255,150,${.4+.4*Math.sin(t*3+i)})`)}c.restore()}},

 // REINA PRIMAVERA: melena rosa ondulada, corona de grandes flores y cetro florido.
 reina:{bg:'meadow',frame:'blossom',shine:'rgba(255,220,240,.55)',hp:[120,166],pv:[182,196],
  body(c){pHairBack(c,'#ff9ac0','#ffe0f0','#a83a70',226,62);for(const s of [-1,1])for(let i=0;i<3;i++)pStrand(c,[120+s*(26+i*10),100,120+s*(52+i*8),130,120+s*(36+i*12),178,120+s*(46+i*10),226-i*10],10,'#ff9ac0','#ffe0f0','#a83a70');
   pBodyStd(c,'#7ad08a',{lt:'#d0ffd8',dk:'#1e6a3a',neck:'#f8d8c0'});
   c.save();pTorso(c,0);c.clip();for(let i=0;i<14;i++){const x=20+pHash(i+780)*180,y=196+pHash(i+790)*76;for(let j=0;j<5;j++){E(c,x+Math.cos(j*1.26)*3,y+Math.sin(j*1.26)*3,2.2,1.6,j*1.26);c.fillStyle='rgba(255,255,255,.55)';c.fill()}}c.restore();
   for(let i=0;i<9;i++){const a=Math.PI*(.05+i*.11);c.save();c.translate(120+Math.cos(a)*30,170+Math.sin(a)*12);c.rotate(a+Math.PI/2);VOL(c,cc=>{E(cc,0,6,6,9)},'#ffb0d0',{bb:[-6,-3,6,15],light:'#ffffff',dark:'#c84a80',lw:.8,rim:1.4});c.restore()}
   c.beginPath();c.moveTo(102,176);c.quadraticCurveTo(120,192,138,176);c.strokeStyle='#ffd23f';c.lineWidth=2.2;c.stroke();VOL(c,cc=>{E(cc,120,192,5,6)},'#ff6aa8',{bb:[115,186,125,198],light:'#ffffff',dark:'#8a0a4a',lw:.8,rim:1})},
  head(c){const sk='#f8d8c0';pCloudVol(c,[[96,100,16],[120,92,18],[144,98,16]],'#ff9ac0','#ffe0f0','#a83a70');pFace(c,{sk,shape:'heart',blush:1,ear:false});
   pStrand(c,[112,94,100,104,96,116,94,128],6,'#ff9ac0','#ffe0f0','#a83a70');pStrand(c,[130,94,144,104,148,116,148,126],5,'#ff9ac0','#ffe0f0','#a83a70');
   pBrows(c,{c:'#c84a80',st:'thin',a:[.05,-.08]});pEyes(c,{sk,iris:'#2aa84a',l:[.95,.78],r:[.78,.95]});
   for(const [x,y,s] of [[100,123,-1],[140,121,1]]){c.beginPath();c.moveTo(x,y);c.lineTo(x+s*4,y-4);c.moveTo(x+s,y+2);c.lineTo(x+s*5,y);c.strokeStyle='#22100a';c.lineWidth=1.1;c.stroke()}
   pNose(c,sk,'small');pMouth(c,'smile');
   for(const [x,y,r,col] of [[92,94,10,'#ffd0e0'],[106,82,12,'#fff4a0'],[120,70,15,'#ff8ab0'],[134,82,12,'#ffffff'],[148,94,10,'#c8a0ff']]){for(let j=0;j<6;j++){const b=j/6*Math.PI*2;c.save();c.translate(x+Math.cos(b)*r*.55,y+Math.sin(b)*r*.55);c.rotate(b+Math.PI/2);VOL(c,cc=>{E(cc,0,0,r*.42,r*.6)},col,{bb:[-r*.42,-r*.6,r*.42,r*.6],light:'#ffffff',dark:cshift(col,-.45),lw:.7,rim:1.4});c.restore()}
    VOL(c,cc=>{E(cc,x,y,r*.3,r*.3)},'#ffd23f',{bb:[x-r*.3,y-r*.3,x+r*.3,y+r*.3],light:'#fffbe0',dark:'#a86a08',lw:.7,rim:1})}
   for(const [x,y,a] of [[84,102,-2.6],[156,100,-.5],[112,74,-2],[129,74,-1.2]])leafHQ(c,x,y,12,a,'#7ad04a','#1e4a14')},
  prop(c){pArm(c,'#7ad08a',174,200);c.save();c.translate(186,206);c.rotate(-.12);RRp(c,-2.6,-110,5.2,114,2.6);P(c,LG(c,-3,0,3,0,['#fff6b0','#c88a10']),1.4);c.translate(0,-118);
   for(let i=0;i<7;i++){c.save();c.rotate(i/7*Math.PI*2);VOL(c,cc=>{E(cc,0,-10,6,10)},'#ff8ab0',{bb:[-6,-20,6,0],light:'#ffffff',dark:'#a8306a',lw:.8,rim:1.6});c.restore()}VOL(c,cc=>{E(cc,0,0,6,6)},'#ffd23f',{bb:[-6,-6,6,6],light:'#fffbe0',dark:'#a86a08',lw:.8});c.restore();pHand(c,176,194,'#f8d8c0',18,16)},
  fxProp(c,t){c.save();c.globalCompositeOperation='lighter';pGlow(c,172,89,34,'255,160,210',.45+.2*Math.sin(t*2.4));c.restore()},
  fx(c,t){for(let i=0;i<10;i++){const ph=(t*.14+pHash(i+800))%1;c.save();c.translate(20+pHash(i+810)*200+Math.sin(t*1.4+i)*18,10+ph*260);c.rotate(t*2+i);c.globalAlpha=Math.sin(ph*Math.PI);E(c,0,0,4.5,2.6);c.fillStyle=i%2?'#ffb0d0':'#ffffff';c.fill();c.strokeStyle='rgba(168,48,106,.6)';c.lineWidth=.7;c.stroke();c.restore()}
   c.save();c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const ph=(t*.3+pHash(i+820))%1;c.globalAlpha=Math.sin(ph*Math.PI);star(c,40+pHash(i+830)*160,190-ph*150,2,'#fff6c0')}c.restore()}},

 // VERDRAGÓN: dragón de hojas con cuernos curvos, ojos de reptil, colmillos, alas y garra en alto.
 dragon:{bg:'volcano',frame:'jade',shine:'rgba(180,255,200,.45)',hp:[120,170],pv:[190,176],
  body(c){for(const s of [-1,1]){c.save();c.translate(120+s*30,186);c.scale(s,1);VOL(c,cc=>{cc.beginPath();cc.moveTo(0,0);cc.lineTo(30,-70);cc.lineTo(70,-96);cc.quadraticCurveTo(66,-60,84,-40);cc.quadraticCurveTo(60,-40,62,-14);cc.quadraticCurveTo(40,-20,30,0);cc.closePath()},'#3a8a3a',{bb:[0,-96,84,0],light:'#8ad06a',dark:'#0e3a10',lw:1});
    c.beginPath();for(const [x,y] of [[70,-96],[84,-40],[62,-14]]){c.moveTo(4,-4);c.lineTo(x,y)}c.strokeStyle='rgba(14,58,16,.6)';c.lineWidth=1.6;c.stroke();c.restore()}
   pBodyStd(c,'#2a6a2a',{lt:'#6ac05a',dk:'#0a2a0a'});c.save();pTorso(c,0);c.clip();for(let r=0;r<8;r++)for(let i=0;i<14;i++){c.beginPath();c.arc(14+i*16+(r%2)*8,184+r*12,7,0,Math.PI);c.strokeStyle='rgba(10,40,10,.45)';c.lineWidth=1.2;c.stroke()}c.restore();
   for(let i=0;i<5;i++)VOL(c,cc=>{RRp(cc,100-i,186+i*17,40+i*2,14,6)},'#e8d070',{bb:[96,186+i*17,144,200+i*17],light:'#fffbe0',dark:'#8a6a10',lw:1,rim:1.6});
   VOL(c,cc=>{RRp(cc,104,148,32,36,12)},'#4a9a3a',{bb:[104,148,136,184],dark:'#0e3a10'})},
  head(c){const g='#5ab84a',g2='#2a6a2a';
   for(const s of [-1,1])VOL(c,cc=>{cc.beginPath();cc.moveTo(120+s*16,92);cc.bezierCurveTo(120+s*22,60,120+s*44,40,120+s*58,30);cc.bezierCurveTo(120+s*40,50,120+s*32,72,120+s*28,98);cc.closePath()},'#e8d8a8',{bb:[60,30,180,98],light:'#ffffff',dark:'#7a6a3a',lw:1.2,rim:2});
   for(const s of [-1,1])leafHQ(c,120+s*30,110,28,s>0?-.35:Math.PI+.35,'#7ad04a','#1e4a14');
   const hd=cc=>{cc.beginPath();cc.moveTo(88,118);cc.bezierCurveTo(86,84,154,82,152,118);cc.bezierCurveTo(152,132,150,140,146,146);cc.lineTo(148,164);cc.quadraticCurveTo(120,180,92,164);cc.lineTo(94,146);cc.bezierCurveTo(90,140,88,132,88,118);cc.closePath()};
   VOL(c,hd,g,{bb:[86,84,154,176],light:'#b8f08a',dark:g2,spec:[104,100,9,5,-.3],lw:1.3});
   c.save();hd(c);c.clip();for(let r=0;r<5;r++)for(let i=0;i<7;i++){c.beginPath();c.arc(90+i*10+(r%2)*5,88+r*8,5,0,Math.PI);c.strokeStyle='rgba(20,70,20,.35)';c.lineWidth=1;c.stroke()}c.restore();
   for(let i=0;i<5;i++)leafHQ(c,104+i*8,86-Math.sin(i/4*Math.PI)*4,14+Math.sin(i/4*Math.PI)*6,-Math.PI/2+(i-2)*.25,'#9ad870','#1e4a14');
   VOL(c,cc=>{RRp(cc,100,140,42,26,12)},'#7ad06a',{bb:[100,140,142,166],light:'#d0ffb0',dark:g2,spec:[110,145,6,3],lw:1.2});
   for(const x of [111,131]){E(c,x,148,3,2);c.fillStyle='#0a2a0a';c.fill()}
   c.beginPath();c.moveTo(102,158);c.quadraticCurveTo(121,166,140,158);c.strokeStyle='#0a2a0a';c.lineWidth=2;c.stroke();for(const x of [108,134]){c.beginPath();c.moveTo(x-3,159);c.lineTo(x,168);c.lineTo(x+3,160);c.closePath();c.fillStyle='#fff';c.fill();c.strokeStyle='#0a2a0a';c.lineWidth=.8;c.stroke()}
   for(const [x,y,s] of [[106,122,1],[134,121,-1]]){c.save();c.beginPath();c.moveTo(x-9,y+2);c.quadraticCurveTo(x,y-9,x+9,y+1);c.quadraticCurveTo(x,y+7,x-9,y+2);c.closePath();c.fillStyle=RG(c,x,y,9,['#ffffff','#ffd23f','#c86a08'],x,y);c.fill();c.strokeStyle='#0a2a0a';c.lineWidth=1.4;c.stroke();c.clip();E(c,x,y-.5,1.8,6);c.fillStyle='#120a00';c.fill();E(c,x-3,y-3,1.8,1.2);c.fillStyle='#fff';c.fill();c.restore();
    c.beginPath();c.moveTo(x-11*s,y-10);c.lineTo(x+8*s,y-5);c.lineTo(x-10*s,y-6);c.closePath();c.fillStyle=g2;c.fill();c.strokeStyle='#0a2a0a';c.lineWidth=1;c.stroke()}},
  prop(c){VOL(c,cc=>{cc.beginPath();cc.moveTo(150,196);cc.quadraticCurveTo(180,186,186,166);cc.lineTo(204,170);cc.quadraticCurveTo(196,206,156,218);cc.closePath()},'#3a8a3a',{bb:[150,166,204,218],light:'#8ad06a',dark:'#0e3a10'});
   VOL(c,cc=>{E(cc,194,160,14,12)},'#5ab84a',{bb:[180,148,208,172],light:'#b8f08a',dark:'#1e5a1a'});
   for(const [x,y,a] of [[184,150,-2.2],[194,147,-1.7],[205,151,-1.2]])VOL(c,cc=>{cc.beginPath();cc.moveTo(x-3,y+2);cc.quadraticCurveTo(x+Math.cos(a)*8-2,y+Math.sin(a)*8,x+Math.cos(a)*14,y+Math.sin(a)*14);cc.quadraticCurveTo(x+Math.cos(a)*6+2,y+Math.sin(a)*6,x+3,y+2);cc.closePath()},'#f0e8d0',{bb:[x-14,y-14,x+14,y+2],light:'#fff',dark:'#8a7a5a',lw:.8,rim:1})},
  fxHead(c,t){c.save();c.globalCompositeOperation='lighter';for(const [x,y] of [[106,122],[134,121]])pGlow(c,x,y,14,'255,210,60',.45+.2*Math.sin(t*3));c.restore();
   for(let i=0;i<6;i++){const ph=(t*.5+i/6)%1,s=i%2?1:-1;c.globalAlpha=(1-ph)*.6;circ(c,121+s*10+s*ph*14,146-ph*30,2+ph*6,'#9a9a90');c.globalAlpha=1}},
  fx(c,t){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const ph=(t*.2+pHash(i+840))%1;c.globalAlpha=Math.sin(ph*Math.PI);circ(c,20+pHash(i+850)*200+Math.sin(t+i)*10,270-ph*260,1+pHash(i)*1.6,i%2?'#ffb040':'#ff6a20')}c.restore()}},

 // GUARDIÁN DEL RELOJ SOLAR: calvo de barba dorada, disco de reloj solar a su espalda y reloj de arena que corre.
 cronos:{bg:'cosmos',frame:'clock',shine:'rgba(255,230,150,.55)',hp:[120,166],pv:[182,200],
  body(c){pBodyStd(c,'#8a5a1a',{lt:'#d8a050',dk:'#2a1604',neck:'#e0b890'});for(const s of [-1,1]){c.beginPath();c.moveTo(120+s*16,176);c.quadraticCurveTo(120+s*30,220,120+s*24,272);c.strokeStyle='#ffd23f';c.lineWidth=3.6;c.stroke()}
   c.save();pTorso(c,0);c.clip();for(let i=0;i<5;i++){c.beginPath();c.arc(120,320,60+i*18,Math.PI*1.2,Math.PI*1.8);c.strokeStyle='rgba(255,210,90,.18)';c.lineWidth=2;c.stroke()}c.restore()},
  head(c){const sk='#e0b890';VOL(c,cc=>{E(cc,120,96,58,58)},'#ffd23f',{bb:[62,38,178,154],light:'#fffbe0',dark:'#a8700a',spec:[96,62,18,6,-.5]});
   E(c,120,96,48,48);c.strokeStyle='rgba(120,70,0,.6)';c.lineWidth=1.4;c.stroke();
   for(let i=0;i<12;i++){const a=i/12*Math.PI*2;c.beginPath();c.moveTo(120+Math.cos(a)*44,96+Math.sin(a)*44);c.lineTo(120+Math.cos(a)*54,96+Math.sin(a)*54);c.strokeStyle='rgba(110,60,0,.7)';c.lineWidth=i%3?1:2.2;c.stroke()}
   for(let i=0;i<16;i++){const a=i/16*Math.PI*2;c.save();c.translate(120+Math.cos(a)*58,96+Math.sin(a)*58);c.rotate(a);c.beginPath();c.moveTo(0,-4);c.lineTo(9,0);c.lineTo(0,4);c.closePath();P(c,'#ffb020',1.2);c.restore()}
   VOL(c,cc=>{cc.beginPath();cc.moveTo(116,96);cc.lineTo(120,36);cc.lineTo(124,96);cc.closePath()},'#c88a10',{bb:[116,36,124,96],light:'#fff0a0',dark:'#6a3a00',lw:.8});
   pFace(c,{sk,shape:'oval',age:1});E(c,110,100,8,4,-.3);c.fillStyle='rgba(255,255,255,.45)';c.fill();
   pBrows(c,{c:'#ffe680',st:'bushy',a:[.1,-.1]});pEyes(c,{sk,iris:'#ffd23f',glow:1});pNose(c,sk,'big');
   pLongBeard(c,'#ffe680','#fffbe0','#a8800a',228);pMustache(c,'#fff0a0','#ffffff','#a8800a',22);
   for(const s of [-1,1])VOL(c,cc=>{E(cc,120+s*29,132,3.6,3.6)},'#ffd23f',{bb:[116+s*29,128,124+s*29,136],lw:.8,rim:1})},
  prop(c){pArm(c,'#8a5a1a',174,200);const x=188,y=176;for(const yy of [y-30,y+24])VOL(c,cc=>{RRp(cc,x-16,yy,32,6,2)},'#a8700a',{bb:[x-16,yy,x+16,yy+6],light:'#ffe080',dark:'#4a2a00',lw:.9});
   for(const s of [-1,1]){c.beginPath();c.moveTo(x+s*13,y-24);c.lineTo(x+s*13,y+24);c.strokeStyle='#22140c';c.lineWidth=4;c.stroke();c.strokeStyle='#c88a10';c.lineWidth=2.4;c.stroke()}
   c.beginPath();c.moveTo(x-10,y-24);c.lineTo(x+10,y-24);c.lineTo(x+2,y);c.lineTo(x+10,y+24);c.lineTo(x-10,y+24);c.lineTo(x-2,y);c.closePath();c.fillStyle='rgba(230,245,255,.4)';c.fill();c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1.1;c.stroke();pHand(c,172,200,'#e0b890',20,16)},
  fxProp(c,t){const x=188,y=176,f=(t*.12)%1;c.fillStyle='#ffe680';c.beginPath();c.moveTo(x-8*(1-f),y-22+20*f);c.lineTo(x+8*(1-f),y-22+20*f);c.lineTo(x,y-1);c.closePath();c.fill();c.beginPath();c.moveTo(x-8,y+22);c.lineTo(x+8,y+22);c.lineTo(x,y+22-16*f);c.closePath();c.fill();
   c.beginPath();c.moveTo(x,y);c.lineTo(x,y+22);c.strokeStyle='#ffe680';c.lineWidth=.9;c.stroke();c.save();c.globalCompositeOperation='lighter';pGlow(c,x,y,26,'255,220,120',.3);c.restore()},
  fxHead(c,t){c.save();c.globalCompositeOperation='lighter';for(const [x,y] of [[107,126],[134,124]])pGlow(c,x,y,14,'255,220,90',.5+.2*Math.sin(t*2));c.restore()},
  bgfx(c,t){c.save();c.translate(PCX,PCY);c.globalCompositeOperation='lighter';for(const [sp,l,w] of [[.25,70,2.4],[.05,52,3.4]]){c.save();c.rotate(t*sp);c.beginPath();c.moveTo(0,0);c.lineTo(0,-l);c.strokeStyle='rgba(255,220,140,.35)';c.lineWidth=w;c.stroke();c.restore()}c.restore()},
  fx(c,t){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<10;i++){const a=t*.3+i/10*Math.PI*2,r=102+Math.sin(t+i)*6;c.globalAlpha=.5+.4*Math.sin(t*2+i);circ(c,120+Math.cos(a)*r,150+Math.sin(a)*r,1.6,'#ffe680')}c.restore()}},

 // ORÁCULO DEL BOSQUE: máscara de hojas sobre ojos brillantes, tercer ojo, melena oscura y orbe flotante entre runas.
 oraculo:{bg:'mystic',frame:'amethyst',shine:'rgba(255,170,255,.5)',hp:[120,166],pv:[184,190],
  body(c){pHairBack(c,'#2a1a4a','#6a4a9a','#08040e',222,58);for(const s of [-1,1])for(let i=0;i<3;i++)pStrand(c,[120+s*(12+i*8),94,120+s*(40+i*8),128,120+s*(28+i*10),176,120+s*(36+i*10),218-i*12],8,'#2a1a4a','#6a4a9a','#08040e');
   pBodyStd(c,'#4a2a6a',{lt:'#9a6ac8',dk:'#120420'});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(60,192);cc.quadraticCurveTo(70,150,120,148);cc.quadraticCurveTo(170,150,180,192);cc.quadraticCurveTo(120,176,60,192);cc.closePath()},'#3a1a5a',{bb:[60,148,180,192],dark:'#120420'});
   for(const s of [-1,1]){c.beginPath();c.moveTo(120+s*14,178);c.quadraticCurveTo(120+s*22,226,120+s*18,272);c.strokeStyle='#ff9aff';c.lineWidth=2.4;c.stroke()}
   c.strokeStyle='rgba(255,170,255,.7)';c.lineWidth=1.2;for(const [x,y] of [[60,226],[176,232],[88,256]]){c.beginPath();c.moveTo(x,y-6);c.lineTo(x,y+6);c.moveTo(x-4,y-2);c.lineTo(x+4,y+2);c.moveTo(x+7,y);c.arc(x,y,7,0,7);c.stroke()}},
  head(c){const sk='#b8a8e0';pCloudVol(c,[[98,100,16],[120,94,17],[142,100,16]],'#2a1a4a','#6a4a9a','#08040e');pFace(c,{sk,shape:'heart',dk:'#5a4a8a',ear:false});
   pMouth(c,'line');E(c,123,150,6,1.6);c.fillStyle='rgba(120,40,120,.4)';c.fill();pNose(c,sk,'small');
   const mk=cc=>{cc.beginPath();cc.moveTo(86,124);cc.bezierCurveTo(92,108,110,110,120,116);cc.bezierCurveTo(132,108,152,104,160,118);cc.bezierCurveTo(152,134,134,138,121,132);cc.bezierCurveTo(108,140,92,138,86,124);cc.closePath()};
   VOL(c,mk,'#4a9a4a',{bb:[86,104,160,140],light:'#9ad87a',dark:'#103a10',spec:[100,116,6,2.4,-.2],lw:1.2});c.save();mk(c);c.clip();for(let i=0;i<8;i++){c.beginPath();c.moveTo(120,124);c.lineTo(86+i*10,i%2?104:142);c.strokeStyle='rgba(16,58,16,.4)';c.lineWidth=.9;c.stroke()}c.restore();
   leafHQ(c,158,116,16,-.5,'#5aa84a','#103a10');leafHQ(c,88,122,14,3.4,'#5aa84a','#103a10');
   for(const [x,y,w] of [[106,124,7.5],[136,121,7]]){c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x,y-w*.7,x+w,y);c.quadraticCurveTo(x,y+w*.5,x-w,y);c.closePath();c.fillStyle=RG(c,x,y,w,['#ffffff','#ff6aff','#8a0a8a'],x,y);c.fill();c.strokeStyle='#20061e';c.lineWidth=1;c.stroke()}
   VOL(c,cc=>{E(cc,121,100,6,8)},'#ffffff',{bb:[115,92,127,108],light:'#ffffff',dark:'#c8a0e0',lw:1,rim:1});E(c,121,100,3.6,5.4);c.fillStyle=RG(c,121,100,5,['#ffffff','#ff6aff','#5a0a5a'],121,99);c.fill();E(c,121,100,1.4,3);c.fillStyle='#1a041a';c.fill();
   c.beginPath();c.moveTo(94,96);c.quadraticCurveTo(121,84,148,96);c.strokeStyle='#22140c';c.lineWidth=4;c.stroke();c.strokeStyle='#ffd23f';c.lineWidth=2.2;c.stroke();
   for(const [x,y] of [[100,92],[142,92]])VOL(c,cc=>{cc.beginPath();cc.moveTo(x,y-7);cc.lineTo(x+4,y);cc.lineTo(x,y+5);cc.lineTo(x-4,y);cc.closePath()},'#ff6aff',{bb:[x-4,y-7,x+4,y+5],light:'#fff',dark:'#6a0a6a',lw:.8,rim:1})},
  prop(c){pArm(c,'#4a2a6a',172,200);pHand(c,174,196,'#b8a8e0',20,14)},
  fxProp(c,t){const y=162+Math.sin(t*1.8)*5;c.save();c.globalCompositeOperation='lighter';pGlow(c,186,y,34,'255,110,255',.5+.2*Math.sin(t*3));c.restore();
   VOL(c,cc=>{E(cc,186,y,14,14)},'#ff6aff',{bb:[172,y-14,200,y+14],light:'#ffffff',dark:'#4a0a5a',spec:[181,y-6,4,3],ol:4});
   c.save();E(c,186,y,13,13);c.clip();c.globalCompositeOperation='lighter';for(let i=0;i<3;i++){c.beginPath();c.arc(186+Math.cos(t*2+i*2)*5,y+Math.sin(t*2+i*2)*5,6,0,7);c.strokeStyle='rgba(255,220,255,.45)';c.lineWidth=1;c.stroke()}c.restore()},
  fxHead(c,t){c.save();c.globalCompositeOperation='lighter';pGlow(c,121,100,16,'255,120,255',.4+.3*Math.sin(t*2.2));for(const [x,y] of [[106,124],[136,121]])pGlow(c,x,y,12,'255,120,255',.4);c.restore()},
  fx(c,t){c.save();c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,180,255,.75)';c.lineWidth=1.2;for(let i=0;i<6;i++){const a=t*.4+i/6*Math.PI*2;c.save();c.translate(120+Math.cos(a)*104,150+Math.sin(a)*94);c.rotate(a);c.beginPath();
   if(i%3===0){c.moveTo(0,-5);c.lineTo(0,5);c.moveTo(-4,-2);c.lineTo(4,2)}else if(i%3===1){c.moveTo(-4,4);c.lineTo(0,-5);c.lineTo(4,4);c.moveTo(-2,1);c.lineTo(2,1)}else{c.moveTo(4,0);c.arc(0,0,4,0,7);c.moveTo(0,-4);c.lineTo(0,4)}c.stroke();c.restore()}c.restore()}}});
function bustSprite(k){if(BUST[k])return BUST[k];
 if(HPORT[k]){const cv2=document.createElement('canvas');cv2.width=cv2.height=400;const c=cv2.getContext('2d');c.scale(2,2);const sc=80/PRO;c.translate(100-PCX*sc,112-PCY*sc);c.scale(sc,sc);hpCompose(c,k,null);return BUST[k]=cv2}
const T=TIERS[CMDS[k].t],cv2=document.createElement('canvas');cv2.width=cv2.height=400;const c=cv2.getContext('2d');c.scale(2,2);c.lineJoin='round';
 avCompose(c,k,null);c.beginPath();c.arc(100,100,96,0,7);c.lineWidth=7;c.strokeStyle=OL;c.stroke();c.lineWidth=4;c.strokeStyle=T.col;c.stroke();
 return BUST[k]=cv2}
// Avatar animado: capas con respiración y superposición + brillo y partículas según rareza (mezcla aditiva)
function drawAvatar(c,k,x,y,r,t,dim){const T=CMDS[k].t,TC=TIERS[T];c.save();
 if(T==='leyenda'||T==='oro'){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.32+.14*Math.sin(t*2);circ(c,x,y,r*1.12,TC.col);c.restore()}
 if(HPORT[k]&&!dim&&r>=40){const sc=r*1.06/PRO;c.save();c.translate(x-PCX*sc,y-PCY*sc);c.scale(sc,sc);hpCompose(c,k,t);c.restore()}
 else if(dim||r<40)c.drawImage(bustSprite(k),x-r,y-r,r*2,r*2);
 else{c.save();c.translate(x-r,y-r);c.scale(r/100,r/100);avCompose(c,k,t);c.beginPath();c.arc(100,100,96,0,7);c.lineWidth=7;c.strokeStyle=OL;c.stroke();c.lineWidth=4;c.strokeStyle=TC.col;c.stroke();c.restore()}
 c.save();c.globalCompositeOperation='lighter';
 if(T==='leyenda'){c.strokeStyle='rgba(255,200,255,.75)';c.lineWidth=Math.max(1.5,r*.04);c.setLineDash([r*.18,r*.12]);c.lineDashOffset=-t*r*.4;c.beginPath();c.arc(x,y,r*1.06,0,7);c.stroke();c.setLineDash([]);
  for(let i=0;i<5;i++){const ph=(t*.4+i/5)%1,a=i*1.25+t*.3;c.globalAlpha=1-ph;circ(c,x+Math.cos(a)*r*(.8+ph*.4),y+Math.sin(a)*r*(.8+ph*.4),r*.04,'#ffe8ff')}c.globalAlpha=1}
 else if(T==='oro')for(let i=0;i<3;i++){const a=t*1.2+i*2.1;star(c,x+Math.cos(a)*r*1.02,y+Math.sin(a)*r*1.02,r*.07,'#fff3a0')}
 c.restore();
 if(dim){c.globalAlpha=.7;circ(c,x,y,r,'#0a120e');c.globalAlpha=1;txt(c,'🔒',x,y,Math.round(r*.6),'#fff')}c.restore()}
