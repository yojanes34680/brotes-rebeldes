// Brotes Rebeldes · Escena del inicio, manejo de errores y bucle principal. Arranca el juego.
"use strict";
// ============ MENU BG & LOOP ============
// Fondo del inicio: tu jardín (las plantas de tu mazo, con tus aspectos) sobre un claro, con insectos rondando.
// ===================== INICIO: escena de bosque de fantasía =====================
// Fondo fijo cacheado (cielo, montañas, ruinas, gran árbol, montículo, helechos) + detalles vivos
// (luciérnagas, hojas, brillo de la copa) + presentación de 2 personajes: uno básico y uno premium.
let MENU_BG=null;
function menuBgCanvas(){if(MENU_BG)return MENU_BG;const cv2=document.createElement('canvas');cv2.width=W*DPR;cv2.height=H*DPR;const c=cv2.getContext('2d');c.scale(DPR,DPR);c.lineCap='round';c.lineJoin='round';const r=n=>pHash(n*1.93+77);
 // cielo de atardecer y sol
 c.fillStyle=LG(c,0,0,0,H,['#f8d898','#eab070','#a8c098','#3e6e4a']);c.fillRect(0,0,W,H);pGlow(c,560,200,280,'255,244,200',.95);
 // montañas en capas y niebla
 const mtn=(base,amp,col,seed,n)=>{c.beginPath();c.moveTo(0,H);c.lineTo(0,base);const st=W/n;for(let i=0;i<=n;i++){const x=i*st,h=amp*(.5+r(seed+i)*.5);c.lineTo(x+st*.45,base-h);c.lineTo(x+st,base-h*.25-r(seed+i+40)*amp*.2)}c.lineTo(W,H);c.closePath();c.fillStyle=col;c.fill()};
 mtn(250,160,'rgba(160,165,175,.6)',1,5);mtn(272,120,'rgba(120,140,130,.65)',9,7);
 c.fillStyle=LG(c,0,215,0,330,['rgba(255,240,210,0)','rgba(255,240,210,.45)','rgba(255,240,210,0)']);c.fillRect(0,215,W,115);
 // bosque lejano
 for(let i=0;i<46;i++){const x=r(i+10)*W,h=50+r(i+50)*70,y=300+r(i+90)*24;c.beginPath();c.moveTo(x,y-h);c.lineTo(x-h*.28,y);c.lineTo(x+h*.28,y);c.closePath();c.fillStyle=`rgba(38,${78+(r(i)*34|0)},58,${.55+r(i+3)*.3})`;c.fill()}
 // ruinas a la izquierda: dos columnas, arco roto y musgo colgando
 for(const [x,h] of [[150,120],[222,96]]){VOL(c,cc=>{RRp(cc,x-15,312-h,30,h,3)},'#8a8a80',{bb:[x-15,312-h,x+15,312],light:'#d8d4c4',dark:'#3a3a34',spec:[x-8,312-h+14,4,18,0]});
  for(let y=312-h+18;y<312;y+=18){c.beginPath();c.moveTo(x-15,y);c.lineTo(x+15,y);c.strokeStyle='rgba(40,40,30,.35)';c.lineWidth=1;c.stroke()}
  for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-12+i*6,312-h);c.quadraticCurveTo(x-10+i*6,312-h+12,x-12+i*6+(r(i+x)-.5)*6,312-h+16+r(i+x+5)*26);c.strokeStyle='#3a7a2a';c.lineWidth=2.2;c.stroke()}}
 VOL(c,cc=>{cc.beginPath();cc.moveTo(130,196);cc.lineTo(206,188);cc.lineTo(214,204);cc.lineTo(132,210);cc.closePath()},'#9a968a',{bb:[130,188,214,210],light:'#e0dccc',dark:'#3a3a34',lw:1});
 // gran árbol a la derecha con raíces y copa de hojas brillantes
 const trunk=cc=>{cc.beginPath();cc.moveTo(742,600);cc.bezierCurveTo(780,470,770,300,796,150);cc.lineTo(858,150);cc.bezierCurveTo(870,300,880,470,930,600);cc.closePath()};
 VOL(c,trunk,'#5a4030',{bb:[742,150,930,600],light:'#9a7a58',dark:'#1e140c',spec:[790,300,8,60,.05]});
 c.save();trunk(c);c.clip();for(let i=0;i<9;i++){c.beginPath();c.moveTo(770+i*18,600);c.bezierCurveTo(780+i*14,450,790+i*9,300,800+i*6,150);c.strokeStyle='rgba(30,18,8,.35)';c.lineWidth=1.6;c.stroke()}c.restore();
 for(const [a,b2,d] of [[742,600,680],[930,600,980],[800,560,720]]){c.beginPath();c.moveTo(a,b2-20);c.quadraticCurveTo((a+d)/2,b2-50,d,b2);c.strokeStyle='#2a1a0e';c.lineWidth=14;c.stroke();c.strokeStyle='#6a4a32';c.lineWidth=9;c.stroke()}
 const can=[];for(let i=0;i<26;i++)can.push([700+r(i+300)*280,40+r(i+340)*180,28+r(i+380)*36]);
 pCloud(c,can.map(([x,y,s])=>[x+4,y+8,s]));c.fillStyle='rgba(10,30,14,.55)';c.fill();
 for(const [x,y,s] of can){E(c,x,y,s,s*.85);c.fillStyle=RG(c,x,y,s,['#7ac860','#3a7a34','#1a3a1a'],x-s*.3,y-s*.4);c.fill()}
 for(let i=0;i<60;i++){const x=700+r(i+400)*280,y=30+r(i+460)*200;c.globalCompositeOperation='lighter';c.globalAlpha=.55;c.drawImage(glowSprite('#7affea'),x-8,y-8,16,16);c.globalAlpha=1;c.globalCompositeOperation='source-over';E(c,x,y,3,2,r(i)*3);c.fillStyle='#bfffee';c.fill()}
 // hojas que cuelgan en las esquinas superiores (enmarcan la escena)
 for(let i=0;i<14;i++){leafHQ(c,r(i+500)*170-10,r(i+520)*90-10,40+r(i+540)*30,1+r(i+560)*1.4,['#2a6a2a','#3a8a34','#1e5a20'][i%3],'#0e2a0e')}
 // suelo y montículo central (tocón cubierto de pasto) donde está el elenco
 c.beginPath();c.moveTo(0,312);c.quadraticCurveTo(W/2,286,W,312);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fillStyle=LG(c,0,320,0,H,['#5e9a40','#3a6e2a','#1a3418']);c.fill();
 c.beginPath();for(let i=0;i<1600;i++){const x=r(i+600)*W,y=330+r(i+2600)*270,l=4+r(i+4600)*6;c.moveTo(x,y);c.lineTo(x+(r(i)-.5)*3,y-l)}c.strokeStyle='rgba(20,60,15,.35)';c.lineWidth=1.2;c.stroke();
 const mx=480,my=304;c.beginPath();c.ellipse(mx,my+34,226,46,0,0,Math.PI);c.lineTo(mx-226,my);c.ellipse(mx,my,226,44,0,Math.PI,0,true);c.closePath();c.fillStyle=LG(c,0,my,0,my+80,['#6a4a2a','#3a2414']);c.fill();
 for(let i=0;i<9;i++){const x=mx-200+i*50;c.beginPath();c.moveTo(x,my+30);c.quadraticCurveTo(x+12,my+60,x+(r(i)-.5)*30,my+84);c.strokeStyle='#2a1a0c';c.lineWidth=6;c.stroke();c.strokeStyle='#6a4a30';c.lineWidth=3.5;c.stroke()}
 E(c,mx,my,226,44);c.fillStyle=RG(c,mx,my,226,['#9ad070','#5aa040','#3a7a2a'],mx-60,my-30);c.fill();
 c.beginPath();for(let i=0;i<260;i++){const a=r(i+700)*Math.PI*2,q=Math.sqrt(r(i+760)),x=mx+Math.cos(a)*226*q,y=my+Math.sin(a)*44*q;c.moveTo(x,y);c.lineTo(x+(r(i)-.5)*3,y-4-r(i+800)*5)}c.strokeStyle='rgba(30,80,20,.45)';c.lineWidth=1.2;c.stroke();
 for(let i=0;i<14;i++){const a=r(i+900)*Math.PI*2,q=.4+r(i+930)*.55,x=mx+Math.cos(a)*226*q,y=my+Math.sin(a)*44*q;for(let j=0;j<5;j++){const b2=j/5*Math.PI*2;circ(c,x+Math.cos(b2)*2.4,y+Math.sin(b2)*1.6,1.8,['#ffffff','#ffd23f','#ff9ac0'][i%3])}}
 // helechos en primer plano a los costados
 for(const [x0,dir] of [[30,1],[930,-1]])for(let i=0;i<7;i++)leafHQ(c,x0+dir*i*10,600-r(i+990)*40,70+r(i+1000)*40,dir>0?-1.1-i*.15:-2.0+i*.15,['#2a6a2a','#3a8a34','#1e5a20'][i%3],'#0e2a0e');
 const vg=c.createRadialGradient(W/2,H*.45,H*.35,W/2,H*.5,H*.9);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,10,0,.45)');c.fillStyle=vg;c.fillRect(0,0,W,H);
 return MENU_BG=cv2}
// El elenco del inicio: un personaje básico (cobre, de tu mazo) y uno premium (legendario tuyo o, si no tienes, el primero de la colección).
function menuPair(){const d=typeof save!=='undefined'?save.deck:ORDER;const kb=d.find(k=>tierOf(k)==='cobre')||d[0]||'espina';
 const own=typeof save!=='undefined'?save.unlocked.find(k=>tierOf(k)==='leyenda'):null;return [kb,own||ALL.find(k=>tierOf(k)==='leyenda')||'fenix',!own]}
function menuTag(c,x,y,label,name,prem){c.save();c.font='bold 12px "Segoe UI",system-ui,sans-serif';const w=Math.max(c.measureText(name).width+28,96);
 rr(c,x-w/2,y,w,34,9,prem?LG(c,0,y,0,y+34,['#7a4ab0','#3a1a5a']):LG(c,0,y,0,y+34,['#8a6438','#4a3218']),prem?'#ffd23f':'#d8b070',2.5);
 txt(c,label,x,y+10,10,prem?'#ffe680':'#ffe9c0');txt(c,name,x,y+24,13,'#ffffff');c.restore()}
// Presentación en bucle de 9 s: un insecto se acerca, el básico le dispara dos veces, el premium lo remata con su especial
// (crítico y estallido), el insecto cae envuelto en humo y los dos festejan saltando.
function drawMenu(t){const c=cx;c.drawImage(menuBgCanvas(),0,0,W,H);
 c.save();c.globalCompositeOperation='lighter';
 for(let i=0;i<6;i++){const x=720+pHash(i+30)*240,y=60+pHash(i+40)*160;c.globalAlpha=.25+.25*Math.sin(t*1.6+i*1.7);c.drawImage(glowSprite('#7affea'),x-30,y-30,60,60)}
 for(let i=0;i<26;i++){const x=((pHash(i)*W+Math.sin(t*.35+i)*50+t*8*(i%2?1:-1))%W+W)%W,y=150+pHash(i+50)*360+Math.cos(t*.5+i*2)*18;c.globalAlpha=.35+.4*Math.sin(t*2.6+i*1.3);c.drawImage(glowSprite('#ffe98a'),x-6,y-6,12,12)}
 c.restore();c.globalAlpha=1;
 for(let i=0;i<5;i++){const p=(t*.05+pHash(i+70))%1,x=((pHash(i+80)*W+Math.sin(t*.8+i)*60+p*90)%W+W)%W;c.save();c.translate(x,p*H);c.rotate(t*1.4+i);leafHQ(c,0,0,10,0,i%2?'#7ac850':'#e8a03a','#2a3a08');c.restore()}
 // insectos de adorno en el primer plano
 const bw=Math.sin(t*.25);drawBug(c,'escarabajo',150+bw*40,512,1.25,t,bw>0?0:Math.PI,null);drawBug(c,'mariquita',830-bw*35,505,1.15,t*1.1,bw>0?Math.PI:0,null);
 const [kb,kp,demo]=menuPair(),T=t%9,s=1.15,bx=388,px=578,fy=300;
 // insecto objetivo
 const alive=T<4.95,ix=900-Math.min(T,3.3)*52,iy=318;
 const hitAt=[2.75,3.85,4.95],hitT=Math.min(...hitAt.map(h=>T>=h?T-h:9));
 if(T<4.95)drawBug(c,'hormiga',ix,iy,1.35,t,Math.PI,{hit:hitT<.09?1:0,face:-1});
 else if(T<5.6){const q=(T-4.95)/.65,im=deathImg('hormiga');c.save();c.translate(ix+q*20,iy-40*Math.sin(q*Math.PI)-q*10);c.rotate(q*7);c.globalAlpha=1-q;const S2=1.35*.78;c.scale(-S2,S2);c.drawImage(im.img,-im.ox,-im.oy,im.cw,im.ch);c.restore();c.globalAlpha=1;
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;c.globalAlpha=(1-q)*.55;circ(c,ix+Math.cos(a)*18*q*1.6,iy-14+Math.sin(a)*10*q,8+q*10,'#e8e4dc')}c.globalAlpha=1}
 // aura del premium (rayos que giran, anillo en el suelo y chispas que suben)
 c.save();c.globalCompositeOperation='lighter';c.translate(px,fy-70);c.rotate(t*.3);for(let i=0;i<10;i++){c.rotate(Math.PI/5);c.beginPath();c.moveTo(0,0);c.lineTo(-10,-110);c.lineTo(10,-110);c.closePath();c.fillStyle='rgba(255,220,120,.07)';c.fill()}c.restore();
 c.save();c.globalCompositeOperation='lighter';E(c,px,fy,46,12);c.strokeStyle=`rgba(255,210,90,${.5+.3*Math.sin(t*3)})`;c.lineWidth=3;c.stroke();
 for(let i=0;i<8;i++){const p=(t*.5+i/8)%1;c.globalAlpha=1-p;c.drawImage(glowSprite(i%2?'#ffd23f':'#e8a0ff'),px-40+pHash(i+5)*80-4,fy-p*150-4,8,8)}c.restore();c.globalAlpha=1;
 // acciones: disparos, especial y festejo
 const att=(t0,dur)=>T>=t0&&T<t0+dur?.3*(1-(T-t0)/dur):0,hop=T>=6&&T<6.9?Math.abs(Math.sin((T-6)*Math.PI*2.2))*16:0,hop2=T>=6.15&&T<7.05?Math.abs(Math.sin((T-6.15)*Math.PI*2.2))*18:0;
 drawUnit(c,kb,bx,fy-36*s-hop,s,t,0,0,null,Math.max(att(2.2,.3),att(3.3,.3)));
 drawUnit(c,kp,px,fy-36*s-hop2,s*1.04,t+1,0,0,null,att(4.4,.35));
 const shot=(t0,t1,x0,y0,col,big)=>{if(T<t0||T>t1)return;const p=(T-t0)/(t1-t0),x=x0+(ix-x0)*p,y=y0+(iy-22-y0)*p-Math.sin(p*Math.PI)*(big?70:45);c.save();c.globalCompositeOperation='lighter';
  for(let k=1;k<6;k++){const q=Math.max(0,p-k*.04),xx=x0+(ix-x0)*q,yy=y0+(iy-22-y0)*q-Math.sin(q*Math.PI)*(big?70:45);c.globalAlpha=.5-k*.08;c.drawImage(glowSprite(col),xx-8,yy-8,16,16)}
  c.globalAlpha=1;const R2=big?26:16;c.drawImage(glowSprite(col),x-R2,y-R2,R2*2,R2*2);c.drawImage(glowSprite('#ffffff'),x-R2*.35,y-R2*.35,R2*.7,R2*.7);c.restore()};
 const cb=(UT[kb]||{}).shot||'#d8f0a0',cp=(UT[kp]||{}).shot||'#ffb040';
 shot(2.3,2.75,bx+30,fy-80,cb);shot(3.4,3.85,bx+30,fy-80,cb);shot(4.5,4.95,px+30,fy-95,cp,1);
 // impactos y números de daño
 for(const [h,n,cr] of [[2.75,'12',0],[3.85,'12',0],[4.95,'48!',1]]){const e=T-h;if(e<0||e>.8)continue;const q=e/.8;
  if(e<.25){c.save();c.globalCompositeOperation='lighter';const R3=(cr?60:30)*(1-e/.25*.4);c.globalAlpha=1-e/.25;c.drawImage(glowSprite(cr?cp:cb),ix-R3,iy-22-R3,R3*2,R3*2);if(cr){c.strokeStyle='#fff3a0';c.lineWidth=4*(1-e/.25);c.beginPath();c.arc(ix,iy-22,70*e/.25+10,0,7);c.stroke()}c.restore();c.globalAlpha=1}
  c.globalAlpha=q>.6?1-(q-.6)/.4:1;txt(c,n,ix+(cr?0:-8),iy-52-q*40+q*q*18,cr?30:18,cr?'#ffd23f':'#ffffff','center',cr?'#7a1a00':'#000000');c.globalAlpha=1}
 if(T>=6&&T<7.2)for(let i=0;i<10;i++){const p=(T-6)/1.2,a=i/10*Math.PI*2;c.globalAlpha=1-p;star(c,(bx+px)/2+Math.cos(a)*120*p,fy-120-Math.sin(a)*60*p,4,i%2?'#fff3a0':'#ffb0e0')}c.globalAlpha=1;
 // carteles: BÁSICO y PREMIUM
 menuTag(c,bx-122,fy-96,'BÁSICO',(UT[kb]||{}).n||kb,0);menuTag(c,px+128,fy-96,demo?'PREMIUM 👑 · se consigue':'PREMIUM 👑',(UT[kp]||{}).n||kp,1)}
// Errores: si algo falla durante la partida se detiene y se muestra un cartel en vez de congelar la pantalla.
let CRASH=null;
function errText(e){return String(e&&(e.stack||e.message)||e).slice(0,1500)}
function reportCrash(err){if(CRASH)return;console.error(err);CRASH={msg:errText(err),when:new Date().toISOString(),scene};
 if(G)G.paused=true;persist();document.getElementById('crashMsg').textContent=CRASH.msg;document.getElementById('crash').classList.remove('hidden')}
function crashMenu(){document.getElementById('crash').classList.add('hidden');CRASH=null;G=null;toMenu()}
function crashCopy(){if(!CRASH)return;const t=`Brotes Rebeldes · ${CRASH.when} · pantalla: ${CRASH.scene}\n${CRASH.msg}`;
 const done=()=>notify('Detalles copiados. Pégalos al reportar el error.');
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,()=>fallbackCopy(t,done));else fallbackCopy(t,done)}
function fallbackCopy(t,done){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){}a.remove()}
// Errores fuera del bucle (botones, menús): no detienen el juego, solo avisan.
addEventListener('error',e=>{console.error(e.error||e.message);notify('⚠ Algo falló: '+(e.message||'error desconocido'),'err',7000)});
addEventListener('unhandledrejection',e=>{console.error(e.reason);notify('⚠ Algo falló: '+((e.reason&&e.reason.message)||e.reason||'error desconocido'),'err',7000)});
let last=performance.now();
// Paso fijo de 1/60 s: el resultado no depende de los FPS, así las repeticiones son exactas.
function loop(now){const dt=Math.min(.1,(now-last)/1000);last=now;
 try{if(scene==='game'&&G&&!CRASH){if(!G.paused&&!G.over){acc+=dt*G.speed;let n=0;while(acc>=STEP&&n<24&&!G.over){step();acc-=STEP;n++}if(n>=24)acc=0}draw()}else drawMenu(now/1000);if(cardK&&!document.getElementById('card').classList.contains('hidden'))drawCardPortrait(now/1000);animCards(now/1000);if(cmdK&&!document.getElementById('cmdcard').classList.contains('hidden'))drawCmdPortrait(now/1000)}catch(err){reportCrash(err)}
 requestAnimationFrame(loop)}
applyA11y();loadUnitPngs();
{let msg=checkSeason();const pn=checkPassSeason();if(pn)msg=(msg?msg+'<br><br>':'')+`Terminó la temporada del pase: te entregamos automáticamente ${pn} premio${pn>1?'s':''} sin reclamar.`;if(!save.name)show('name');else if(msg)showResult('Nueva temporada',msg,null,false,true);else show('menu');if(LOAD_NOTE)setTimeout(()=>notify(LOAD_NOTE,'err',14000),300)}
requestAnimationFrame(loop);
// App instalable: el service worker guarda los archivos para jugar sin conexión (solo funciona servido por http o https).
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(e=>console.warn('service worker',e)));
