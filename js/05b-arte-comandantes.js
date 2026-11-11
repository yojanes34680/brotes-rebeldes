// ===================== GUARDIANES DEL JARDÍN: COMANDANTES DE CUERPO ENTERO =====================
// Cuerpo completo chibi-heroico armado con las capas del retrato (cabeza, busto y objeto) más piernas propias.
// Estados: idle, ready, cast, cheer, hurt, intro. Solo dibujo: usa el tiempo visual, nunca sr().
// Cada comandante es un guardián botánico (no humano) armado con el mismo rig vivo de las plantas:
// cabeza con ojos que parpadean y miran, expresiones, brazo y arma articulados, y una espalda propia.
const W2_=(t,hx,hy,o)=>Object.assign({t,hx,hy},o||{});
const GUARD={
 lluvia:{arm:'#9ad0f0',b:{t:'robe',col:'#4a8ad8',dk:'#1a3a7a',l:'#8ac0f8',trim:'#bfeaff',leaf:'#7ab04a',leafDk:'#2a5a1a'},h:{t:'puff',r:22,face:['#f4f8ff','#dde6f4','#a8b4cc'],skin:'#e8eef8',iris:'#3a8ad8',mood:'calm',mouth:'smirk',blush:1},bk:{t:'cloud',c:'#e8eef8'},w:W2_('staff',26,-50,{gem:'#7ad8ff',wood:1}),idle:'float',atk:'raise',fx:'drip'},
 poda:{arm:'#8a6a3a',b:{t:'bulky',col:'#7a5a2a',dk:'#3a2a10',l:'#a8803a',leaf:'#6ab04a',leafDk:'#2a5a1a',boot:'#4a3020'},h:{t:'trunk',r:24,c:['#c8a070','#8a6a3a','#4a3018'],lc:'#6ac04a',ld:'#2a6a1a',skin:'#b89060',iris:'#9aff6a',mood:'fierce',mouth:'grin'},hat:{t:'band',c:'#c84a2a'},w:W2_('shears',27,-46),idle:'breathe',atk:'lunge',fx:'leaves'},
 semillero:{arm:'#c08a4a',b:{t:'bulky',col:'#6a8a3a',dk:'#2a4a14',l:'#9ab85a',leaf:'#9ab85a',leafDk:'#2a4a14',boot:'#5a3a1a'},h:{t:'acorn',r:24,c:['#e8b070','#b07030','#5a3010'],cap:['#8a6a3a','#5a3a1a'],skin:'#d09a5a',iris:'#3a2a10',mood:'happy',mouth:'open',blush:1},bk:{t:'pack',c:'#a87a4a'},w:W2_('can',25,-40),idle:'hop',atk:'raise',fx:'leaves'},
 espantap:{arm:'#e0b050',b:{t:'slim',col:'#5a6aa8',dk:'#2a3468',l:'#8a9ad8',trim:'#e0b050',leaf:'#e0c060',leafDk:'#8a6a1a'},h:{t:'pumpkin',r:24,c:['#ffd090','#e09030','#9a4a08'],skin:'#e09030',iris:'#ffe14a',mood:'sly',mouth:'grin',glow:'#ffb02a'},hat:{t:'wizard',c:'#8a6a3a',c2:'#4a3018'},w:W2_('scythe',27,-48,{c1:'#7a5a2a'}),idle:'sway',atk:'lunge',fx:'leaves',fxc:'#e0c060'},
 escarcha:{arm:'#c8e8ff',b:{t:'robe',col:'#a8d8ff',dk:'#3a78b8',l:'#e8f6ff',trim:'#ffffff',leaf:'#e0f4ff',leafDk:'#6aa8d8'},h:{t:'crystal',r:22,c:['#ffffff','#c8ecff','#5aa0e0'],skin:'#e8f6ff',iris:'#3a9ad8',mood:'calm',mouth:'smirk',blush:1},hat:{t:'tiara',c:'#ffffff',g:'#9ae8ff'},bk:{t:'petalwings',c:'#d8f4ff'},w:W2_('wand',29,-46,{gem:'#e8fbff',crystal:1}),idle:'float',atk:'raise',fx:'frost'},
 polen:{arm:'#ffd23f',b:{t:'armor',col:'#ffc020',dk:'#7a5a08',l:'#ffe680',m1:'#3a3a3a',m2:'#0a0a0a',gem:'#ffd23f'},h:{t:'flower',r:18,n:12,pl:20,pw:7,ps:'round',pc:'#ffffff',pd:'#d8d8c8',c:['#ffe680','#ffc020','#a8700a'],face:['#fff8e0','#ffe8b0','#e8c070'],skin:'#ffe8b0',iris:'#3a2a10',mood:'fierce',mouth:'grin'},hat:{t:'goggles',c:'#5a3a1a',g:'#ffd23f'},bk:{t:'petalwings',c:'#f0f8ff'},w:W2_('spear',27,-50),idle:'hop',atk:'lunge',fx:'coins'},
 herrera:{arm:'#c8a080',b:{t:'bulky',col:'#6a4a3a',dk:'#2a1a10',l:'#8a6a5a',boot:'#3a2a1a',leaf:'#7ab04a',leafDk:'#2a5a1a'},h:{t:'mush',r:24,c:['#d89060','#a85a2a','#4a2008'],f:['#fff0d8','#f0d8b0','#c8a880'],dot:'#ffe8c0',skin:'#f0d8b0',iris:'#ff6a2a',mood:'fierce',mouth:'effort'},bk:{t:'pack',c:'#5a5a68'},w:W2_('hammer',28,-44,{c1:'#ff8a4a'}),idle:'breathe',atk:'stomp',fx:'smoke'},
 brujo:{arm:'#a88a60',b:{t:'robe',col:'#3a2a4a',dk:'#1a0e24',l:'#5a4a6a',trim:'#c8ff4a',leaf:'#5a8a3a',leafDk:'#1a3a10'},h:{t:'mandra',r:23,c:['#d8c0a0','#a88a60','#5a4028'],lc:'#7ab83a',ld:'#2a5a14',skin:'#c8a880',iris:'#c8ff4a',mood:'sly',mouth:'smirk',glow:'#c8ff4a'},bk:{t:'cape',c:'#3a2a4a',c2:'#0e0614'},w:W2_('staff',26,-50,{gem:'#c8ff4a',wood:1}),idle:'sway',atk:'raise',fx:'spores',fxc:'#c8ff4a'},
 general:{arm:'#5aa83a',b:{t:'armor',col:'#2a6a3a',dk:'#0e3a1a',l:'#4a8a5a',m1:'#ffe680',m2:'#a8700a',gem:'#ff3a2a'},h:{t:'flower',r:21,n:18,pl:22,pw:6,ps:'point',pc:'#ffd23f',pd:'#e08a10',ring2:'#ffb020',c:['#6a4a2a','#4a2a10','#2a1608'],face:['#ffe8b8','#f0c888','#c89858'],skin:'#ffe6b8',iris:'#2a6a3a',mood:'fierce',mouth:'grin'},hat:{t:'helmet',c:'#d8b040',c2:'#7a5a10'},bk:{t:'mantle',c:'#c83a2a',c2:'#5a0e08'},w:W2_('spear',27,-52),idle:'breathe',atk:'lunge',fx:'sun'},
 alquimista:{arm:'#8ab0e0',b:{t:'robe',col:'#2a4a8a',dk:'#0e1a44',l:'#4a6aa8',trim:'#ffd23f'},h:{t:'aloe',r:20,c:['#d8f0ff','#8ac0e8','#3a6a9a'],lc:'#6aa8d8',ld:'#1a4a7a',skin:'#c8e4f8',iris:'#2a5ad8',mood:'calm',mouth:'smirk'},hat:{t:'goggles',c:'#6a4a2a',g:'#5ac8ff'},bk:{t:'pack',c:'#8a6a3a'},w:W2_('flask',27,-48,{c1:'#5ac8ff'}),idle:'bob',atk:'raise',fx:'bubbles'},
 tormenta:{arm:'#8a7ab8',b:{t:'robe',col:'#3a3a6a',dk:'#141432',l:'#5a5a9a',trim:'#fff27a'},h:{t:'thistle',r:21,c:['#c8d8f0','#7a8ab8','#3a4a7a'],fl:'#a04ae0',skin:'#b8c4e0',iris:'#fff27a',mood:'cold',mouth:'line',glow:'#fff27a'},bk:{t:'cape',c:'#4a4a8a',c2:'#141432'},w:W2_('staff',26,-52,{gem:'#fff27a',bolt:1}),idle:'float',atk:'flash',fx:'spark'},
 guardian:{arm:'#7a6a3a',b:{t:'bulky',col:'#5a6a3a',dk:'#24300e',l:'#7a8a5a',leaf:'#8ad06a',leafDk:'#2a5a1a',boot:'#3a3018'},h:{t:'leafy',r:23,c:['#c8d8a0','#7a9a5a','#3a4a1a'],lc:'#9ad07a',ld:'#3a6a2a',fern:1,skin:'#a8b880',iris:'#7af0ff',mood:'calm',mouth:'line',glow:'#7af0ff'},bk:{t:'mantle',c:'#4a7a3a',c2:'#14300e'},w:W2_('staff',27,-52,{gem:'#7af0ff',wood:1}),idle:'breathe',atk:'stomp',fx:'leaves'},
 reina:{arm:'#7ad08a',b:{t:'robe',col:'#7ad08a',dk:'#2a7a4a',l:'#b0f0c0',trim:'#ffe680',leaf:'#ffb0d0',leafDk:'#c0507a'},h:{t:'flower',r:19,n:7,pl:26,pw:13,ps:'heart',pc:'#ffc0dc',pd:'#e8609a',ring2:'#ffe0ec',c:['#fff8c0','#ffd86a','#e0a040'],face:['#fffafc','#ffe8f0','#f0c0d0'],skin:'#fff0f4',iris:'#2a8a4a',mood:'happy',mouth:'open',blush:1},hat:{t:'crown',c:'#ffd23f'},bk:{t:'petalwings',c:'#ffe0f0'},w:W2_('wand',26,-50,{gem:'#ffb0d0',star:1}),idle:'float',atk:'twirl',fx:'petals'},
 dragon:{arm:'#4ab84a',b:{t:'bulky',col:'#2a8a3a',dk:'#0e4a14',l:'#5ac05a',leaf:'#8ae05a',leafDk:'#1a5a1a',boot:'#1a4a14'},h:{t:'jaw',r:32,c:['#9ae07a','#3aa84a','#145a1a'],in:['#d0ffa0','#4ad84a','#0a4a0a'],skin:'#5ac060',iris:'#ffe14a',mood:'fierce',spot:'#d0ff6a'},hat:{t:'horns',c:'#e8e0a0'},bk:{t:'dragon',c:'#2a8a3a',c2:'#0e4a14',w:'#8ae05a',f:'#ffe14a'},w:W2_('none',30,-40),idle:'breathe',atk:'lunge',fx:'spores',fxc:'#9aff6a'},
 cronos:{arm:'#a89a78',b:{t:'armor',col:'#8a7a5a',dk:'#3a3020',l:'#b8a880',m1:'#ffe680',m2:'#a8700a',gem:'#ffd23f'},h:{t:'bonsai',r:21,c:['#e0d4b0','#a89a78','#5a5038'],lc:'#7ab04a',ld:'#2a5a1a',skin:'#d0c4a0',iris:'#ffd23f',mood:'cold',mouth:'line',glow:'#ffd23f'},bk:{t:'sundial',g:'#ffd23f'},w:W2_('staff',26,-52,{gem:'#ffd23f',sun:1}),idle:'breathe',atk:'flash',fx:'stars'},
 oraculo:{arm:'#b89ae8',b:{t:'robe',col:'#4a2a6a',dk:'#1a0a2a',l:'#6a4a8a',trim:'#ff9aff',leaf:'#c8a0ff',leafDk:'#4a2a8a'},h:{t:'flower',r:19,n:6,pl:27,pw:12,ps:'point',pc:'#3a1a6a',pd:'#140828',ring2:'#ff9aff',c:['#ffffff','#e0c8ff','#8a6ad8'],face:['#f8f0ff','#e0d0f8','#a890d0'],skin:'#ece0fc',iris:'#ff6aff',mood:'calm',mouth:'line',glow:'#ff6aff'},hat:{t:'halo',c:'#ff9aff'},bk:{t:'mantle',c:'#4a2a6a',c2:'#0a0414',stars:1},w:W2_('lantern',26,-44,{c1:'#8a5ad8',gem:'#ff9aff'}),idle:'float',atk:'flash',fx:'glow',fxc:'#ff9aff'}};
const CMDR={};
function cmdrParts(k){if(CMDR[k])return CMDR[k];const key='cmd_'+k;if(!LOOK[key])LOOK[key]=Object.assign({cmd:1},GUARD[k]);
 const P=rigParts(key,2,null);for(const e of ['idle','blink','ant','atk','cel','stun'])rigExpr(P,e);return CMDR[k]=P}
// Dibuja al guardián con los pies en (x,y). sc ≈ 1 → unos 135 px de alto. t = null: pose quieta.
function drawCommander(c,k,x,y,sc,t,state,actP,face){if(!CMDS[k]||!GUARD[k])return;const P=cmdrParts(k),L=P.L,C=CMDS[k],p=clamp(actP||0,0,1),still=t==null,T=still?0:t;face=face||1;state=state||'idle';
 const seed=k.length*7+k.charCodeAt(0);let ix=0,iy=0,rot=0,sx=1,sy=1,wa=0,hr=0,aura=0,flash=0,red=0,ex='idle',a=0;
 const br=still?0:Math.sin(T*2.2),lag=still?0:Math.sin(T*2.2-.9);sy*=1+br*.025;sx*=1-br*.012;if(!still&&L.idle==='float')iy=-6+Math.sin(T*2)*3;
 switch(state){
  case 'ready':aura=.55+.3*Math.sin(T*5);wa=-.3;iy-=Math.abs(Math.sin(T*3))*1.5;break;
  case 'cast':if(p<.22){const f=p/.22;sy*=1-.1*f;sx*=1+.07*f;wa=.35*f;ex='ant'}else if(p<.45){const f=(p-.22)/.23;iy-=18*Math.sin(f*Math.PI/2);sx*=.94;sy*=1.1;wa=-1.3;aura=1.4;flash=1-f*.5;ex='atk';a=1-f}
   else{const f=(p-.45)/.55,w=Math.sin(f*Math.PI*2)*(1-f);iy-=18*(1-f);sy*=1+.07*w;sx*=1-.04*w;wa=-1.3*(1-f);aura=1.2*(1-f);ex=f<.5?'atk':'cel'}break;
  case 'cheer':iy-=Math.abs(Math.sin(T*9))*9;wa=-1+Math.sin(T*12)*.35;rot=Math.sin(T*9)*.05;aura=.45;ex='cel';break;
  case 'hurt':{const f=1-p;rot=-.16*f;ix=-6*f+Math.sin(T*60)*3*f;sy*=1-.06*f;hr=.18*f;red=f;ex='stun';break}
  case 'intro':{const q=Math.min(1,p/.7);iy-=(1-q*q)*230;rot=(1-q)*.3;if(p>.7){const f=(p-.7)/.3,w=Math.sin(f*Math.PI)*(1-f);sy*=1-.18*w;sx*=1+.14*w;ex='cel';wa=-1.1*Math.sin(f*Math.PI)}else ex='ant';break}}
 if(ex==='idle'&&!still){const B=3.2+pHash(seed)*1.3,bp=(T+pHash(seed+1)*B)%B;if(bp<.13)ex='blink'}
 const S=sc*1.18,ph=T+seed;c.save();c.translate(x,y);c.scale(face*S,S);E(c,ix*.5,0,28,7);c.fillStyle='rgba(0,0,0,.32)';c.fill();
 if(aura>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(1,aura*.55);const R2=80;c.drawImage(glowSprite(C.col),-R2,-74-R2,R2*2,R2*2);c.restore()}
 c.translate(ix,iy);c.rotate(rot);c.scale(sx,sy);const dens=Math.abs(S)*DPR*1.15*Math.max(sx,sy);
 if(L.fx==='glow'&&!still){c.globalAlpha=.22+.1*Math.sin(T*2.5);circ(c,0,-66,56,L.fxc||'#fff');c.globalAlpha=1}
 if(P.back){c.save();c.translate(0,-55);c.rotate(-lag*.015);c.translate(0,55);rp(c,P.back,dens);c.restore()}
 c.save();c.translate(-14,-46);c.rotate(lag*.03-wa*.2);c.translate(14,46);rp(c,P.armB,dens);c.restore();
 rp(c,P.legs,dens);c.save();c.translate(0,-8);c.scale(1+br*.012,1);c.translate(0,8);rp(c,P.torso,dens);c.restore();
 const hd=dens*HEAD_S;c.save();c.translate(RT3,NECK_Y+lag*.35);c.rotate(hr+lag*.012);c.scale(HEAD_S,HEAD_S);c.translate(-RT3,-NECK_Y);rp(c,P.head,hd);
 if(ex==='idle'||ex==='ant'||ex==='atk'){const G2=P.G,lx=still?.6:.6+Math.sin(ph*.7)*.3;for(const e of P.eyes){const ixx=e.x+e.rx*(.06+.24*lx),iyy=G2.ey+e.ry*.12,s2=e.ir/P.irMax,r=P.iris.rad*s2;c.save();E(c,e.x,G2.ey,e.rx,e.ry);c.clip();c.drawImage(P.iris.img,ixx-r,iyy-r,r*2,r*2);c.restore()}}
 rp(c,rigExpr(P,ex),hd);rp(c,P.top,hd);c.restore();
 const W=L.w,hx=W.hx+lag*.35,hyy=W.hy+lag-(wa<0?-wa*8:0);if(W.t!=='none'){c.save();c.translate(hx,hyy);c.rotate((W.a||0)+wa+lag*.015);drawWeapon(c,W,T,a);c.restore()}
 armHQ(c,13,-46,hx,hyy,L.arm,L.b.t==='bulky'?8.5:6.5);
 if(!still&&!LOWFX)chFx(c,L,T,a);
 if(flash>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=flash;const R3=40,fy=hyy-40;c.drawImage(glowSprite('#ffffff'),hx-R3,fy-R3,R3*2,R3*2);c.drawImage(glowSprite(C.col),hx-R3*1.6,fy-R3*1.6,R3*3.2,R3*3.2);c.restore()}
 if(red>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=red*.7;c.drawImage(glowSprite('#ff3a2a'),-60,-130,120,130);c.restore()}
 c.restore()}
// Insignia redonda (botón del duelo, anillo de recarga, lista de comandantes): el guardián de medio cuerpo.
const BUST2={};
function bustSprite(k){if(BUST2[k])return BUST2[k];const cv=document.createElement('canvas');cv.width=cv.height=200;const c=cv.getContext('2d'),C=CMDS[k],T2=TIERS[C.t];
 c.beginPath();c.arc(100,100,96,0,7);c.fillStyle=RG(c,100,100,96,[cshift(C.col,.35),cshift(C.col,-.2),cshift(C.col,-.65)],100,70);c.fill();
 c.save();c.beginPath();c.arc(100,100,92,0,7);c.clip();drawCommander(c,k,100,262,1.5,null,'idle',0,1);c.restore();
 c.beginPath();c.arc(100,100,94,0,7);c.strokeStyle=T2.col;c.lineWidth=8;c.stroke();c.strokeStyle=OL;c.lineWidth=2;c.stroke();return BUST2[k]=cv}
// Pedestal de piedra con césped y franja del color de su rareza (y = superficie donde pisa).
function cmdPedestal(c,x,y,sc,k,t,tall){const C=CMDS[k],T=TIERS[C.t],h=tall?62:26,w=44;c.save();c.translate(x,y);c.scale(sc,sc);c.lineJoin='round';
 E(c,0,h+4,w+8,12);c.fillStyle='rgba(0,0,0,.3)';c.fill();
 c.beginPath();c.moveTo(-w,0);c.lineTo(-w+5,h);c.ellipse(0,h,w-5,11,0,Math.PI,0,true);c.lineTo(w,0);c.closePath();c.fillStyle=LG(c,-w,0,w,0,['#6a6a5c','#a8a894','#5a5a4c','#3a3a30']);c.fill();c.strokeStyle=OL;c.lineWidth=2.4;c.stroke();
 if(tall){c.strokeStyle='rgba(30,25,15,.45)';c.lineWidth=1.2;for(let r=1;r<4;r++){const yy=r*h/4;c.beginPath();c.ellipse(0,yy,w-1.5+r*.6,11,0,.15,Math.PI-.15);c.stroke();for(let j=-2;j<=2;j++){const xx=j*16+(r%2)*8;c.beginPath();c.moveTo(xx,yy+10.5-Math.abs(xx)/8);c.lineTo(xx,yy+h/4+9-Math.abs(xx)/8);c.stroke()}}}
 c.beginPath();c.ellipse(0,h*.55,w-2,11,0,.1,Math.PI-.1);c.strokeStyle=OL;c.lineWidth=7;c.stroke();c.strokeStyle=T.col;c.lineWidth=4.5;c.stroke();
 E(c,0,0,w,13);c.fillStyle=RG(c,0,0,w,['#9ae06a','#5aa83a','#2f6a1f'],-10,-6);c.fill();c.strokeStyle=OL;c.lineWidth=2.4;c.stroke();
 for(let i=0;i<9;i++){const a=i/9*Math.PI,xx=Math.cos(a)*(w-3),yy=Math.sin(a)*11;c.beginPath();c.moveTo(xx-3,yy);c.lineTo(xx+(i%2?1:-1),yy+6);c.lineTo(xx+3,yy);c.closePath();c.fillStyle='#4a9a32';c.fill()}
 c.restore()}
// ---------- en partida: estado visual del comandante (detectado al dibujar, sin tocar la simulación) ----------
const CMDV=new WeakMap();
function cmdVis(b,t){let bossN=0;for(const i of b.insects)if(i.def.boss&&!i.dead)bossN++;let v=CMDV.get(b);
 if(!v||t<v.t-.5){v={t,lives:b.lives,bossN,cd:b.cmdCd||0,cast0:-9,hurt0:-9,cheer0:-9};CMDV.set(b,v)}
 if(b.cmd&&(b.cmdCd||0)>v.cd+1&&v.cd<=.05)v.cast0=t;if(b.lives<v.lives)v.hurt0=t;if(bossN<v.bossN&&b.lives>=v.lives)v.cheer0=t;
 v.lives=b.lives;v.bossN=bossN;v.cd=b.cmdCd||0;v.t=t;
 const ca=t-v.cast0,hu=t-v.hurt0,ch=t-v.cheer0;v.cheer=ch>=0&&ch<1.6;v.cut=ca>=0&&ca<.7?ca/.7:0;
 if(ca>=0&&ca<.9){v.state='cast';v.p=ca/.9}else if(hu>=0&&hu<.8){v.state='hurt';v.p=hu/.8}else if(v.cheer){v.state='cheer';v.p=ch/1.6}else{v.state=b.cmd&&b.cmdCd<=0?'ready':'idle';v.p=0}
 return v}
// Puesto de mando (un jugador): torre 2.5D con el comandante, anillo de recarga y aviso (Q). r = zona táctil.
function drawCmdTower(c,b,r,t){const k=b.cmd,C=CMDS[k],V=cmdVis(b,t),ready=b.cmdCd<=0,x0=r.x+r.w/2,top=r.y+r.h-74,iP=G.introT>0?introP(G):1;
 cmdPedestal(c,x0,top,.95,k,t,1);
 if(iP>=.02)drawCommander(c,k,x0,top+2,.6,t,iP<.45?'intro':V.state,iP<.45?iP/.45:V.p,-1);
 const cx=x0,cy=top+38,rad=17;circ(c,cx,cy,rad+3,OL);circ(c,cx,cy,rad,ready?'#1d3326':'#111');c.save();c.beginPath();c.arc(cx,cy,rad-1,0,7);c.clip();c.drawImage(bustSprite(k),cx-rad,cy-rad,rad*2,rad*2);c.restore();
 if(!ready){const f=clamp(b.cmdCd/ccd(C,b.cmdLv||1),0,1);c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,rad,-Math.PI/2,-Math.PI/2+f*Math.PI*2);c.closePath();c.fillStyle='rgba(0,0,0,.62)';c.fill();txt(c,Math.ceil(b.cmdCd),cx,cy,15,'#fff','center','#000')}
 else{c.save();c.beginPath();c.arc(cx,cy,rad+2,0,7);c.strokeStyle=C.col;c.lineWidth=2.5+Math.sin(t*6);c.stroke();c.restore()}
 rr(c,r.x+8,r.y+r.h-18,r.w-16,18,8,ready?'rgba(58,42,8,.9)':'rgba(0,0,0,.6)',ready?C.col:'#3a5a48',1.5);txt(c,ready?'¡LISTA! (Q)':C.an,x0,r.y+r.h-9,11,ready?'#ffe9a8':'#9ab')}
// Duelos: pedestales espejados en el centro, cada comandante mira a su tablero.
function drawCmdDuel(c,g,t){const iP=g.introT>0?introP(g):1;g.boards.forEach((b,i)=>{if(!b.cmd)return;const V=cmdVis(b,t),x=i?505:455,y=332;cmdPedestal(c,x,y,.5,b.cmd,t);
 if(iP>=.02)drawCommander(c,b.cmd,x,y+1,.42,t,iP<.45?'intro':V.state,iP<.45?iP/.45:V.p,i?1:-1)})}
// Corte de 0,7 s al usar la habilidad (no bloquea): franja con el comandante, nombre de la habilidad y efecto propio.
function drawCmdCut(c,g,t){g.boards.forEach((b,bi)=>{if(!b.cmd)return;const V=cmdVis(b,t);if(!V.cut)return;const C=CMDS[b.cmd],f=V.cut,ein=Math.min(1,f/.18),out=f>.82?(1-f)/.18:1,y0=bi?150:96,dir=bi?-1:1;
 c.save();c.globalAlpha=out;const sl=(1-Math.pow(1-ein,3))*W*dir;c.translate(sl-W*dir,0);
 c.beginPath();c.moveTo(0,y0+8);c.lineTo(W,y0-6);c.lineTo(W,y0+70);c.lineTo(0,y0+84);c.closePath();c.fillStyle='rgba(10,14,10,.82)';c.fill();
 c.beginPath();c.moveTo(0,y0+8);c.lineTo(W,y0-6);c.strokeStyle=C.col;c.lineWidth=4;c.stroke();c.beginPath();c.moveTo(0,y0+84);c.lineTo(W,y0+70);c.stroke();
 const fx=bi?W-170:170;drawCommander(c,b.cmd,fx,y0+96,.62,t,'cast',Math.min(.6,f*1.2),bi?-1:1);
 txt(c,C.an+'!',bi?W-310:310,y0+36,30,'#ffffff','center',OL);txt(c,C.n,bi?W-310:310,y0+62,13,C.col,'center','#000');c.restore();
 // efecto propio: estela de su icono y su color desde el puesto hasta el centro del tablero
 const mx=b.bx+b.w/2,my=b.by+b.h/2,sx=g.duel?(bi?505:455):883,sy=g.duel?300:330;c.save();c.globalCompositeOperation='lighter';
 for(let i=0;i<8;i++){const q=clamp(f*1.6-i*.06,0,1);if(q<=0||q>=1)continue;const a=i/8*Math.PI*2+t,px=sx+(mx-sx)*q+Math.cos(a)*30*q,py=sy+(my-sy)*q-Math.sin(q*Math.PI)*60+Math.sin(a)*20*q;c.globalAlpha=(1-q)*.9;c.drawImage(glowSprite(C.col),px-14,py-14,28,28)}
 if(f>.4){const q=(f-.4)/.6;c.globalAlpha=(1-q)*.6;c.beginPath();c.arc(mx,my,30+q*b.w*.6,0,7);c.strokeStyle=C.col;c.lineWidth=8*(1-q)+1;c.stroke()}c.restore();
 if(!LOWFX&&f>.25&&f<.9)for(let i=0;i<5;i++){const q=(f-.25)/.65,px=mx+Math.cos(i*1.26)*q*b.w*.45,py=my+Math.sin(i*1.26)*q*b.h*.45;c.globalAlpha=1-q;txt(c,C.ic,px,py,18,'#fff');c.globalAlpha=1}})}
// ---------- intro de batalla (2 s): no corre el reloj de oleadas ni se usa sr() ----------
const INTRO_T=1.8;
const introP=g=>clamp(1-(g.introT||0)/INTRO_T,0,1);
// Precarga, repartida en la intro, las 3 etapas de cada planta del mazo (una pieza nueva por cuadro como mucho),
// así la primera fusión a fase II o IV no traba el combate.
function introWarm(g){const b=g.boards[0];if(!b||!b.deck)return;if(b.cmd)cmdrParts(b.cmd);
 for(const st of [1,2,3])for(const k of b.deck){const key=k+'|'+st+'|'+((b.skin&&b.skin[k])||'');if(RIG[key]&&RIG[key].ex.atk)continue;const R=rigParts(k,st,b.skin&&b.skin[k]);for(const e of ['idle','blink','ant','atk'])rigExpr(R,e);return}}
function drawIntro(c,g,t){const P=introP(g),me=g.boards[0];introWarm(g);
 c.save();c.globalAlpha=.45*(1-Math.max(0,(P-.82)/.18));c.fillStyle='#000';c.fillRect(0,0,W,H);c.restore();
 // 0–0,8 s: el comandante cae desde arriba a su torreón y dice su frase
 if(me.cmd&&P>.12&&P<.62){const C=CMDS[me.cmd],a=Math.min(1,(P-.12)/.06)*Math.min(1,(.62-P)/.06),q=T(C.q||''),bx=g.duel?250:600,by=g.duel?120:218;
  c.save();c.globalAlpha=a;c.font='bold 15px "Segoe UI",system-ui,sans-serif';const w=Math.min(420,c.measureText(q).width+36);rr(c,bx-w/2,by-22,w,40,14,'rgba(255,250,235,.95)',OL,2.5);
  c.beginPath();c.moveTo(bx+w/2-40,by+17);c.lineTo(bx+w/2-10,by+40);c.lineTo(bx+w/2-58,by+17);c.closePath();c.fillStyle='rgba(255,250,235,.95)';c.fill();txt(c,q,bx,by-2,15,'#2a1a06');txt(c,C.n,bx,by-34,12,C.col,'center','#000');c.restore()}
 // 0,8–1,8 s: las plantas del mazo brotan en fila, saludan juntas atacando y vuelan a sus cartas
 const ct=controls(),cards=ct.cards;if(P>.4){cards.forEach((cd,i)=>{if(i>7)return;const s0=.42+i*.025,grow=clamp((P-s0)/.1,0,1);if(grow<=0)return;const fl=clamp((P-.72-i*.02)/.15,0,1);if(fl>=1)return;
  const [sx,sy]=slotXY(me,Math.min(me.slots.length-1,5+(i%5))),e=fl*fl*(3-2*fl),x=sx+(cd.x+cd.w/2-sx)*e,y=sy-6+(cd.y+cd.h*.36-sy+6)*e-Math.sin(e*Math.PI)*70,sc=(.9*me.cs/96)*(1-.45*e)*(grow<1?Math.sin(grow*Math.PI*.5)*1.1:1);
  if(grow<1){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=1-grow;c.drawImage(glowSprite('#c8ff8a'),sx-30,sy-10,60,40);c.restore()}
  if(fl>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.6*(1-fl);for(let q=1;q<4;q++){const e2=Math.max(0,e-q*.06),x2=sx+(cd.x+cd.w/2-sx)*e2,y2=sy-6+(cd.y+cd.h*.36-sy+6)*e2-Math.sin(e2*Math.PI)*70;c.drawImage(glowSprite(UT[cd.k].shot),x2-14,y2-30,28,28)}c.restore()}
  const sal=P>.6&&P<.72?(P-.6)/.12:0;drawUnit(c,cd.k,x,y,sc,t,1,0,me.skin[cd.k],sal?.3*(1-sal):0,1,{seed:i,cheer:fl>0||(P>.55&&!sal),lx:1,ly:0})})}
 if(P>.8){const q=clamp((P-.8)/.1,0,1),s=q<1?.6+.5*Math.sin(q*Math.PI*.5)*1.05:1,a=P>.96?(1-P)/.04:1;c.save();c.globalAlpha=a;c.translate(W/2,H*.42);c.scale(s,s);txt(c,'¡A DEFENDER!',0,0,54,'#ffe14a','center','#5a2a00');c.restore()}
 txt(c,'Toca para saltar',W/2,H-10,11,'rgba(255,255,255,.75)')}
function skipIntro(){if(G&&G.introT>0){G.introT=0;return true}return false}
