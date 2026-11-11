// ===================== GUARDIANES DEL JARDÍN: COMANDANTES DE CUERPO ENTERO =====================
// Cuerpo completo chibi-heroico armado con las capas del retrato (cabeza, busto y objeto) más piernas propias.
// Estados: idle, ready, cast, cheer, hurt, intro. Solo dibujo: usa el tiempo visual, nunca sr().
const CMDR={},LONG_CLOTH={robe:1,gown:1,shawl:1};
function cmdLegs(c,A,C){const K=A.cloth||{c:C.col,c2:cshift(C.col,-.5),col:'v'},boot='#5a3a1a';
 if(LONG_CLOTH[K.col]){for(const sd of [-1,1])VOL(c,cc=>{cc.beginPath();cc.moveTo(sd*13-9,0);cc.bezierCurveTo(sd*13-10,-8,sd*13+8,-9,sd*13+10,0);cc.closePath()},boot,{bb:[sd*13-10,-9,sd*13+10,0],spec:[sd*13-3,-6,3,1.4,0]});
  const sk=cc=>{cc.beginPath();cc.moveTo(-16,-34);cc.quadraticCurveTo(0,-38,16,-34);cc.bezierCurveTo(20,-22,25,-10,27,-4);for(let i=0;i<6;i++){const xx=27-i*9;cc.quadraticCurveTo(xx-4.5,-1+(i%2?3:-1),xx-9,-4+(i%2?0:1))}cc.bezierCurveTo(-25,-10,-20,-22,-16,-34);cc.closePath()};
  VOL(c,sk,K.c,{bb:[-27,-38,27,-1],light:cshift(K.c,.4),dark:K.c2,spec:[-8,-28,3,6,.3]});
  if(K.trim){c.beginPath();c.moveTo(-26,-5);for(let i=0;i<6;i++){const xx=-26+i*8.8;c.quadraticCurveTo(xx+4.4,-1,xx+8.8,-5)}c.strokeStyle=K.trim;c.lineWidth=3;c.stroke();c.beginPath();c.moveTo(0,-36);c.lineTo(0,-6);c.lineWidth=2.4;c.stroke()}}
 else{for(const sd of [-1,1]){const lx=sd*9;VOL(c,cc=>{RRp(cc,lx-6,-34,12,26,5)},K.col==='overalls'?K.c:K.c2,{bb:[lx-6,-34,lx+6,-8],rim:3});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(lx-10,0);cc.bezierCurveTo(lx-12,-11,lx-4,-15,lx+2,-14);cc.bezierCurveTo(lx+11,-13,lx+13,-5,lx+12,0);cc.closePath()},boot,{bb:[lx-12,-15,lx+13,0],spec:[lx-3,-10,3,1.4,0]})}
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-17,-38);cc.lineTo(17,-38);cc.lineTo(19,-24);cc.quadraticCurveTo(0,-19,-19,-24);cc.closePath()},K.col==='apron'?'#a8a8b8':K.c,{bb:[-19,-38,19,-20],light:cshift(K.c,.4),dark:K.c2});
  if(K.trim){c.beginPath();c.moveTo(-18,-25);c.quadraticCurveTo(0,-20,18,-25);c.strokeStyle=K.trim;c.lineWidth=2.6;c.stroke()}}}
function cmdrParts(k){if(CMDR[k])return CMDR[k];const A=AV[k]||{},C=CMDS[k];return CMDR[k]={Ls:hpLayers(k),H:HPORT[k],A,C,legs:rigPart(c=>cmdLegs(c,A,C),1)}}
// Dibuja al comandante con los pies en (x,y). sc ≈ 1 → 134 px de alto. t = null: pose quieta.
function drawCommander(c,k,x,y,sc,t,state,actP,face){if(!CMDS[k]||!HPORT[k])return;const P=cmdrParts(k),Ls=P.Ls,H=P.H,C=P.C,p=clamp(actP||0,0,1),still=t==null,T=still?0:t;face=face||1;state=state||'idle';
 let ix=0,iy=0,rot=0,sx=1,sy=1,pr=0,hr=0,aura=0,flash=0,red=0;
 const br=still?0:Math.sin(T*2.2),lag=still?0:Math.sin(T*2.2-.9);sy*=1+br*.02;sx*=1-br*.01;
 switch(state){
  case 'ready':aura=.55+.3*Math.sin(T*5);pr=-.3;iy-=Math.abs(Math.sin(T*3))*1.5;break;
  case 'cast':if(p<.22){const f=p/.22;sy*=1-.1*f;sx*=1+.07*f;pr=.35*f}else if(p<.45){const f=(p-.22)/.23;iy-=16*Math.sin(f*Math.PI/2);sx*=.94;sy*=1.1;pr=-1.25;aura=1.4;flash=1-f*.5}
   else{const f=(p-.45)/.55,w=Math.sin(f*Math.PI*2)*(1-f);iy-=16*(1-f);sy*=1+.07*w;sx*=1-.04*w;pr=-1.25*(1-f);aura=1.2*(1-f)}break;
  case 'cheer':iy-=Math.abs(Math.sin(T*9))*9;pr=-.9+Math.sin(T*12)*.3;rot=Math.sin(T*9)*.05;aura=.45;break;
  case 'hurt':{const f=1-p;rot=-.16*f;ix=-6*f+Math.sin(T*60)*3*f;sy*=1-.06*f;hr=.18*f;red=f;break}
  case 'intro':{const q=Math.min(1,p/.7),e=1-Math.pow(1-q,3);ix=-(1-e)*150;iy=-Math.sin(q*Math.PI)*34;if(p>.7){const f=(p-.7)/.3,w=Math.sin(f*Math.PI)*(1-f);sy*=1-.14*w;sx*=1+.12*w}break}}
 c.save();c.translate(x,y);c.scale(face*sc,sc);E(c,ix*.5,0,28,7);c.fillStyle='rgba(0,0,0,.32)';c.fill();
 if(aura>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(1,aura*.55);const R2=78;c.drawImage(glowSprite(C.col),-R2,-72-R2,R2*2,R2*2);c.restore()}
 c.translate(ix,iy);c.rotate(rot);c.scale(sx,sy);const dens=Math.abs(sc)*DPR*1.1*Math.max(sx,sy);
 rp(c,P.legs,dens);
 c.save();c.translate(0,-28);c.scale(.31,.38);c.translate(-120,-272);c.drawImage(mip(Ls.body,PW,PH,dens*.38),0,0,PW,PH);c.restore();
 const ax=(H.pv[0]-120)*.45,ay=-28+(H.pv[1]-272)*.38,prop=()=>{c.save();c.translate(ax,ay);c.rotate(pr+lag*.03);c.scale(.5,.5);c.translate(-H.pv[0],-H.pv[1]);c.drawImage(mip(Ls.prop,PW,PH,dens*.5),0,0,PW,PH);c.restore()};
 if(H.pv[0]<150)prop();
 c.save();c.translate(0,-62+lag*.9);c.rotate(hr+lag*.015);c.scale(.62,.62);c.translate(-H.hp[0],-H.hp[1]);c.drawImage(mip(Ls.head,PW,PH,dens*.62),0,0,PW,PH);c.restore();
 if(H.pv[0]>=150)prop();
 if(flash>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=flash;const R3=40;c.drawImage(glowSprite('#ffffff'),ax-R3,ay-50-R3,R3*2,R3*2);c.drawImage(glowSprite(C.col),ax-R3*1.6,ay-50-R3*1.6,R3*3.2,R3*3.2);c.restore()}
 if(red>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=red*.7;c.drawImage(glowSprite('#ff3a2a'),-60,-130,120,130);c.restore()}
 c.restore()}
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
const INTRO_T=2;
const introP=g=>clamp(1-(g.introT||0)/INTRO_T,0,1);
// Precarga, repartida en la intro, las 3 etapas de cada planta del mazo (una pieza nueva por cuadro como mucho),
// así la primera fusión a fase II o IV no traba el combate.
function introWarm(g){const b=g.boards[0];if(!b||!b.deck)return;if(b.cmd)cmdrParts(b.cmd);
 for(const st of [1,2,3])for(const k of b.deck){const key=k+'|'+st+'|'+((b.skin&&b.skin[k])||'');if(RIG[key]&&RIG[key].ex.atk)continue;const R=rigParts(k,st,b.skin&&b.skin[k]);for(const e of ['idle','blink','ant','atk'])rigExpr(R,e);return}}
function drawIntro(c,g,t){const P=introP(g),me=g.boards[0];introWarm(g);
 c.save();c.globalAlpha=.45*(1-Math.max(0,(P-.8)/.2));c.fillStyle='#000';c.fillRect(0,0,W,H);c.restore();
 // el comandante entra con su frase
 if(me.cmd&&P>.2&&P<.92){const C=CMDS[me.cmd],a=Math.min(1,(P-.2)/.08)*Math.min(1,(.92-P)/.08),q=T(C.q||''),bx=g.duel?250:600,by=g.duel?120:218;
  c.save();c.globalAlpha=a;c.font='bold 15px "Segoe UI",system-ui,sans-serif';const w=Math.min(420,c.measureText(q).width+36);rr(c,bx-w/2,by-22,w,40,14,'rgba(255,250,235,.95)',OL,2.5);
  c.beginPath();c.moveTo(bx+w/2-40,by+17);c.lineTo(bx+w/2-10,by+40);c.lineTo(bx+w/2-58,by+17);c.closePath();c.fillStyle='rgba(255,250,235,.95)';c.fill();txt(c,q,bx,by-2,15,'#2a1a06');txt(c,C.n,bx,by-34,12,C.col,'center','#000');c.restore()}
 // las plantas del mazo brotan en el tablero y vuelan a sus cartas
 const ct=controls(),cards=ct.cards;if(P>.25){cards.forEach((cd,i)=>{if(i>7)return;const s0=.25+i*.05,grow=clamp((P-s0)/.15,0,1);if(grow<=0)return;const fl=clamp((P-.62-i*.03)/.2,0,1);if(fl>=1)return;
  const [sx,sy]=slotXY(me,Math.min(me.slots.length-1,5+(i%5))),e=fl*fl*(3-2*fl),x=sx+(cd.x+cd.w/2-sx)*e,y=sy-6+(cd.y+cd.h*.36-sy+6)*e-Math.sin(e*Math.PI)*70,sc=(.9*me.cs/96)*(1-.45*e)*(grow<1?Math.sin(grow*Math.PI*.5)*1.1:1);
  if(grow<1){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=1-grow;c.drawImage(glowSprite('#c8ff8a'),sx-30,sy-10,60,40);c.restore()}
  drawUnit(c,cd.k,x,y,sc,t,1,0,me.skin[cd.k],0,1,{seed:i,cheer:fl>0})})}
 if(P>.78){const q=clamp((P-.78)/.12,0,1),s=q<1?.6+.5*Math.sin(q*Math.PI*.5)*1.05:1,a=P>.96?(1-P)/.04:1;c.save();c.globalAlpha=a;c.translate(W/2,H*.42);c.scale(s,s);txt(c,'¡A DEFENDER!',0,0,54,'#ffe14a','center','#5a2a00');c.restore()}
 txt(c,'Toca para saltar',W/2,H-10,11,'rgba(255,255,255,.75)')}
function skipIntro(){if(G&&G.introT>0){G.introT=0;return true}return false}
