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
let PSTY=0,RIGF=0;// 1 = construyendo sprite de personaje (estilo Heroic Toy)
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
function drawUnit(c,k,x,y,s,t,rank,pop,skin,af,face,st){return drawChar(c,k,x,y,s,t,rank,pop,skin,af,face,st)}

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
  for(const sd of [-1,1])for(const [a,l,j] of [[-.6,46,.8],[-.22,38,-.6],[.15,30,.5],[.45,22,-.4]]){c.save();c.translate(sd*6,-48);c.scale(sd*(sd<0?.9:1),1);c.rotate(-Math.PI/2-.7+a);petal(c,l,10,'flame','#ffe14a','#d8200a',j);c.restore()}break}
 case 'dragon':{VOL(c,cc=>{cc.beginPath();cc.moveTo(-8,-24);cc.bezierCurveTo(-34,-20,-52,-6,-44,-32);cc.bezierCurveTo(-40,-44,-28,-36,-34,-30);cc.bezierCurveTo(-40,-18,-22,-12,-6,-12);cc.closePath()},bk.c,{bb:[-52,-44,-6,-10],light:cshift(bk.c,.4),dark:bk.c2,rim:3});
  for(const [x,y] of [[-28,-21],[-40,-26],[-40,-37]]){c.beginPath();c.moveTo(x-3,y);c.lineTo(x,y-7);c.lineTo(x+3,y);c.closePath();P(c,bk.f||'#ffd23f',1.2)}
  for(const sd of [-1,1]){c.save();c.translate(sd*10,-54);c.scale(sd,1);c.rotate(-1.05);petal(c,38,13,'point',bk.w||'#8ae05a',bk.c2,.4);c.rotate(.5);petal(c,28,10,'point',bk.w||'#8ae05a',bk.c2,-.3);c.restore()}break}
 case 'cloud':pCloudVol(c,[[-28,-72,16],[-8,-84,20],[16,-80,18],[32,-66,13],[-36,-56,12],[24,-52,12]],bk.c||'#e8eef8','#ffffff','#8a98b8');for(const [x,y] of [[-22,-44],[0,-40],[20,-42]]){c.beginPath();c.moveTo(x,y);c.lineTo(x-2,y+9);c.strokeStyle='#7ac8ff';c.lineWidth=2.2;c.stroke()}break;
 case 'sundial':{VOL(c,cc=>{E(cc,0,-76,46,46)},'#c8b890',{bb:[-46,-122,46,-30],light:'#fff4d0',dark:'#6a5a3a',rim:3});c.strokeStyle='#5a4a2a';c.lineWidth=2;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;c.beginPath();c.moveTo(Math.cos(a)*36,-76+Math.sin(a)*36);c.lineTo(Math.cos(a)*43,-76+Math.sin(a)*43);c.stroke()}c.beginPath();c.arc(0,-76,40,0,7);c.strokeStyle=bk.g||'#ffd23f';c.lineWidth=2.4;c.stroke();break}}}
function chBody(c,B,mode){const w=B.t==='bulky'?1.22:B.t==='slim'?.86:1,sh=2,boot=B.boot||'#a8743a',leaf=B.leaf||'#7fd04a',leafDk=B.leafDk||'#2f7a1f';
 if(mode!=='torso')for(const sd of [-1,1]){const k=sd<0?.9:1,lx=sd*9.5*w+(sd>0?sh*.5:0);
  VOL(c,cc=>{RRp(cc,lx-4.5*k,-25,9*k,18,4)},B.dk,{bb:[lx-5,-25,lx+5,-7],rim:3});
  VOL(c,cc=>{cc.beginPath();cc.moveTo(lx-10*k,0);cc.bezierCurveTo(lx-12*k,-11,lx-4,-15,lx+2,-14);cc.bezierCurveTo(lx+11*k,-13,lx+13*k,-5,lx+12*k,0);cc.closePath()},boot,{bb:[lx-12,-15,lx+13,0],spec:[lx-3,-10,3.2,1.5,0]})}
 if(mode==='legs')return;
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
  shine(c,-12,-32,8,3,-.3,.4);if(!RIGF)eyesHQ(c,0,-26,10,6,6.6,H.iris,H.mood,H.skin);else RIGF={ex:0,ey:hy+6-26*k,sp:10*k,rx:6*k,ry:6.6*k,jaw:1};c.restore();return{top:hy+6-44*k,fy:hy-20*k,fr:r*.8,noFace:1}}
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
 case 'shears':{const o=.22+a*.35;for(const sd of [-1,1]){c.save();c.rotate(sd*o);RRp(c,-2.6,-4,5.2,22,2.6);P(c,LG(c,-3,0,3,0,[c1==='#8a5a2a'?'#d84a2a':c1,'#6a1a08']),1.8);c.beginPath();c.moveTo(-2.6,-4);c.quadraticCurveTo(-3,-30,0,-48);c.quadraticCurveTo(4,-28,3.6,-4);c.closePath();P(c,LG(c,-3,0,4,0,['#ffffff','#a8b0c0']),1.8);c.restore()}E(c,0,-4,3.2,3.2);P(c,'#ffd23f',1.2);break}
 case 'hammer':RRp(c,-2.4,-40,4.8,60,2.4);P(c,LG(c,-3,0,3,0,['#a87a4a','#5a3a1a']),2);RRp(c,-15,-56,30,17,4);P(c,LG(c,0,-56,0,-39,['#e8ecf4','#5a6478']),2.4);RRp(c,-16,-50,32,5,2);P(c,c1,1.4);if(a>.3){c.globalAlpha=a;circ(c,0,-47,18,'rgba(255,190,90,.6)');c.globalAlpha=1}break;
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
// Primera fila con píxeles visibles de cada PNG (sobre su alto original): se usa cuando el navegador no deja leer
// los píxeles (al abrir con doble clic, file:// da SecurityError en getImageData). Recalcular si cambias una imagen.
const UNIT_PNG_TOP={espina:[0,403],hielo:[62,403],fuego:[100,403],rayo:[112,403],rocio:[130,403]};
function loadUnitPngs(){for(const k of UNIT_PNGS){if(!ALL.includes(k))continue;const im=new Image();im.onload=()=>{UNIT_IMG[k]=im;for(const key of Object.keys(SPR))if(key===k||key.startsWith(k+'|'))delete SPR[key]};im.onerror=()=>{};im.src='assets/units/'+k+'.png'}}
function pngSprite(k){const im=UNIT_IMG[k],R=2.4,f=PNG_H/im.height,w=im.width*f,cw=Math.max(240,Math.ceil(w)+20),ch=250,ox=cw/2,oy=212;
 const cv2=document.createElement('canvas');cv2.width=Math.ceil(cw*R);cv2.height=ch*R;const c=cv2.getContext('2d');c.imageSmoothingQuality='high';c.drawImage(im,(ox-w/2)*R,(oy-PNG_H+3)*R,w*R,PNG_H*R);
 let top=-PNG_H+3;try{const q=document.createElement('canvas');q.width=im.width;q.height=im.height;const g=q.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,im.width,im.height).data;let row=0;outer:for(;row<im.height;row++)for(let x=0;x<im.width;x++)if(d[(row*im.width+x)*4+3]>40)break outer;top+=row*f}catch(e){const P=UNIT_PNG_TOP[k];if(P)top+=P[0]/P[1]*PNG_H}
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
// drawChar (rig articulado) está en js/05b-rig-personajes.js
// ---------- Utilidades de dibujo que usan otros archivos (los retratos humanos de comandantes se quitaron:
// ahora los comandantes son guardianes botánicos de cuerpo entero, en js/05b-arte-comandantes.js) ----------
function avOutline(cv,th){const sil=document.createElement('canvas');sil.width=cv.width;sil.height=cv.height;const s=sil.getContext('2d');s.drawImage(cv,0,0);s.globalCompositeOperation='source-in';s.fillStyle='#170b04';s.fillRect(0,0,sil.width,sil.height);
 const o=document.createElement('canvas');o.width=cv.width;o.height=cv.height;const q=o.getContext('2d');for(let i=0;i<16;i++){const an=i/16*Math.PI*2;q.drawImage(sil,Math.cos(an)*th,Math.sin(an)*th)}q.drawImage(cv,0,0);return o}
function pHash(n){const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function pZig(c,x0,y0,x1,y1,seed,amp,n){c.beginPath();c.moveTo(x0,y0);for(let i=1;i<n;i++){const f=i/n;c.lineTo(x0+(x1-x0)*f+(pHash(seed+i)-.5)*amp,y0+(y1-y0)*f+(pHash(seed+i+50)-.5)*amp)}c.lineTo(x1,y1)}
function pCloud(cc,pts){cc.beginPath();for(const [x,y,r] of pts){cc.moveTo(x+r,y);cc.arc(x,y,r,0,Math.PI*2)}}
function pBB(pts){let a=1e9,b=1e9,c2=-1e9,d=-1e9;for(const [x,y,r] of pts){a=Math.min(a,x-r);b=Math.min(b,y-r);c2=Math.max(c2,x+r);d=Math.max(d,y+r)}return [a,b,c2,d]}
function pCloudVol(c,pts,col,lt,dk){const [a,b,c2,d]=pBB(pts),w=c2-a,h=d-b;pCloud(c,pts);c.fillStyle=RG(c,(a+c2)/2,(b+d)/2,Math.max(w,h)*.72,[lt,col,dk],a+w*.24,b+h*.2);c.fill();
 c.save();pCloud(c,pts);c.clip();for(const [x,y,r] of pts){c.beginPath();c.arc(x+r*.06,y+r*.12,r*.9,.15,Math.PI*.85);c.strokeStyle='rgba(40,52,86,.22)';c.lineWidth=2.6;c.stroke()}
 for(const [x,y,r] of pts){c.beginPath();c.arc(x,y,r*.78,Math.PI*1.1,Math.PI*1.6);c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1.8;c.stroke()}c.restore()}
function pGlow(c,x,y,r,rgb,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
