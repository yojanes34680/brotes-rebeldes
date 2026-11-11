// ===================== RIG ARTICULADO DE PERSONAJES =====================
// Cada personaje se arma con piezas pre-dibujadas (en caché) que se mueven por separado:
// cresta, espalda, brazo trasero, piernas, torso, cabeza, iris, expresión y tocado.
// Tres etapas morfológicas: I = Fase 1 (brote), II = Fases 2–3, III = Fases 4–5.
// Todo lo animado usa el tiempo visual y pHash: NUNCA sr() ni G.rng (la simulación no cambia).
const RIG={},RIG_R=2.4,RCW=300,RCH=300,ROX=150,ROY=250,RT3=2.5,NECK_Y=-57,HEAD_S=1.15;
const charStage=r=>r>=4?3:r>=2?2:r===1?1:2;// rango 0 (cartas, menús) = diseño completo de etapa II
const RIG_NOST={};
// Etapa I: brote compacto con arma de madera. II: guerrero (+20 % de tamaño, hombreras de corteza, capa corta).
// III: despertar legendario (alas de energía vivas, arma grande con núcleo que late, ojos que brillan, corola doble).
const STG_S=[1,.9,1,1.1];
function stageLook(k,st){const L=JSON.parse(JSON.stringify(LOOK[k])),U=UT[k]||{},H=L.h;if(L.cmd){L.w.sc=1;return L}L.w.sc=st===1?.82:st===2?1:1.22;
 if(st===1){if(L.bk&&!['quiver','pack','hood'].includes(L.bk.t))delete L.bk;if(L.hat&&['crown','halo','tiara'].includes(L.hat.t))delete L.hat;if(!L.hat)L.sprout=1;
  if(H.t==='flower'){H.n=Math.max(4,Math.round(H.n*.75));delete H.ring2;H.pl*=.9}if(L.w.t!=='none'){L.w.c1='#9a6a3a';L.w.c2='#5a3a1a';L.w.wood=1}}
 else{L.collar=1;if(st===2){if(L.b.t!=='armor')L.paul='bark';if(!L.bk)L.bk={t:'cape',c:cshift(L.b.col,-.12),c2:L.b.dk}}
  else{L.paul=L.b.t!=='armor';L.wings=U.shot||'#ffe680';if(H.t==='flower'&&!H.ring2)H.ring2=cshift(H.pc,.28);if(!H.glow)H.glow=U.shot}}
 return L}
function rigCanvas(){const A=document.createElement('canvas');A.width=RCW*RIG_R;A.height=RCH*RIG_R;const c=A.getContext('2d');c.scale(RIG_R,RIG_R);c.translate(ROX,ROY);c.lineJoin='round';c.lineCap='round';return [A,c]}
// Recorta la pieza a su caja (con contorno opcional) y aplica el filtro del aspecto.
function rigCrop(A,ol,filter){const R=RIG_R,Q=8,sw=Math.ceil(A.width/Q),sh=Math.ceil(A.height/Q);
 // caja aproximada con una copia pequeña (rápido), luego se recorta y se contornea solo esa zona
 const sm=document.createElement('canvas');sm.width=sw;sm.height=sh;const q=sm.getContext('2d',{willReadFrequently:true});q.drawImage(A,0,0,sw,sh);const d=q.getImageData(0,0,sw,sh).data;
 let x0=sw,y0=sh,x1=-1,y1=-1;for(let y=0;y<sh;y++)for(let x=0;x<sw;x++)if(d[(y*sw+x)*4+3]>0){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
 if(x1<0)return null;const pad=ol?Math.ceil(3*R):2;let X0=Math.max(0,(x0-1)*Q),Y0=Math.max(0,(y0-1)*Q),X1=Math.min(A.width,(x1+2)*Q),Y1=Math.min(A.height,(y1+2)*Q);
 const cw=X1-X0+pad*2,ch=Y1-Y0+pad*2,cv=document.createElement('canvas');cv.width=cw;cv.height=ch;const g=cv.getContext('2d');
 if(ol){const sil=document.createElement('canvas');sil.width=cw;sil.height=ch;const s=sil.getContext('2d');s.drawImage(A,pad-X0,pad-Y0);s.globalCompositeOperation='source-in';s.fillStyle='#170b04';s.fillRect(0,0,cw,ch);
  const th=2.5*R;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.drawImage(sil,Math.cos(a)*th,Math.sin(a)*th)}}
 g.drawImage(A,pad-X0,pad-Y0);
 if(filter){const f=document.createElement('canvas');f.width=cw;f.height=ch;const h=f.getContext('2d');h.filter=filter;h.drawImage(cv,0,0);return {img:f,x:(X0-pad)/R-ROX,y:(Y0-pad)/R-ROY,w:cw/R,h:ch/R}}
 return {img:cv,x:(X0-pad)/R-ROX,y:(Y0-pad)/R-ROY,w:cw/R,h:ch/R}}
function rigPart(draw,ol,filter){const [A,c]=rigCanvas();let res;PSTY=1;try{res=draw(c,A)}finally{PSTY=0}const p=rigCrop(A,ol,filter);if(p)p.res=res;return p||{res,none:1}}
function rp(c,p,dens){if(p&&!p.none)c.drawImage(mip(p.img,p.w,p.h,dens),p.x,p.y,p.w,p.h)}
// --- piezas nuevas de la evolución ---
// Ala de energía (una; se dibuja dos veces, en espejo, y aletea en vivo).
function rigWing(c,col){c.save();c.translate(6,-52);for(const [a,l,w,j] of [[-.6,60,14,.3],[-.18,52,11,-.2],[.24,40,9,.3]]){c.save();c.rotate(a);petal(c,l,w,'point',cshift(col,.4),cshift(col,-.3),j);c.restore()}
 c.globalCompositeOperation='lighter';c.globalAlpha=.5;for(const a of [-.6,-.18,.24]){c.beginPath();c.moveTo(4,0);c.lineTo(Math.cos(a)*44,Math.sin(a)*44);c.strokeStyle='#ffffff';c.lineWidth=1.6;c.stroke()}c.restore()}
function rigCollar(c,L){const col=L.b.leaf||'#7fd04a',dk=L.b.leafDk||'#2f7a1f';for(const a of [.3,2.85,.85,2.3,1.35,1.8])leafHQ(c,RT3,-57,13,a,col,dk)}
function rigPaul(c,L){const B=L.b,w=B.t==='bulky'?1.22:B.t==='slim'?.86:1,bark=L.paul==='bark',col=bark?'#9a7240':B.l||L.arm,dk=bark?'#3a2610':B.dk;
 for(const sd of [-1,1]){const px=sd*17*w+(sd>0?2:0);if(!bark)for(const [a,l] of [[-.55,18],[-.1,16],[.35,12]])leafHQ(c,px,-55,l,sd>0?a:Math.PI-a,B.leaf||'#7fd04a',B.leafDk||'#2f7a1f');
  VOL(c,cc=>{E(cc,px,-54,bark?10:9,bark?7.5:7)},col,{bb:[px-10,-61.5,px+10,-46.5],light:bark?'#d8b080':'#ffffff',dark:dk,spec:[px-3,-57,2.5,1.4,0]});
  if(bark){c.strokeStyle='rgba(40,25,10,.6)';c.lineWidth=1.3;for(const dy of [-2.5,2]){c.beginPath();c.moveTo(px-7,-54+dy);c.quadraticCurveTo(px,-56+dy,px+7,-54+dy);c.stroke()}for(const dx of [-5,5]){E(c,px+dx,-50,1.3,1.3);P(c,'#c8ccd8',.8)}}
  else{E(c,px,-54,2.4,2.4);P(c,'#ffd23f',1)}}}
function rigSprout(c,I){const y=I.top+3;c.beginPath();c.moveTo(0,y);c.quadraticCurveTo(2,y-6,0,y-10);c.strokeStyle='#2f6a1a';c.lineWidth=2.6;c.stroke();leafHQ(c,0,y-9,12,-2.5,'#9ae86a','#2f7a1f');leafHQ(c,0,y-9,12,-.65,'#9ae86a','#2f7a1f')}
// --- ojos y expresiones ---
function eyeGeo(H,I){if(RIGF&&RIGF.jaw)return RIGF;const fr=I.fr,fy=I.fy;return {ex:2.5,ey:fy-fr*.08,sp:fr*.4,rx:fr*.27,ry:fr*.31,mx:4,my:fy+fr*.52,mw:fr*.3}}
function eyesOf(G){return [-1,1].map(sd=>{const k=sd<0?.88:1;return {sd,x:G.ex+sd*G.sp*(sd<0?.94:1),rx:G.rx*k,ry:G.ry,ir:Math.min(G.rx*k,G.ry)*.74}})}
function eyeWhites(c,G){for(const e of eyesOf(G)){E(c,e.x,G.ey,e.rx,e.ry);c.fillStyle=RG(c,e.x,G.ey,e.ry*1.1,['#ffffff','#f2f4fa','#c4cadc'],e.x-e.rx*.3,G.ey-e.ry*.45);c.fill()}}
function irisSprite(H,ir,filter){const R=RIG_R*1.5,rad=ir*1.7,n=Math.ceil(rad*2*R),cv=document.createElement('canvas');cv.width=cv.height=n;const c=cv.getContext('2d');c.scale(R,R);c.translate(rad,rad);
 if(filter)c.filter=filter;const iris=H.iris;
 if(H.glow){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.55;E(c,0,0,ir*1.5,ir*1.5);c.fillStyle=RG(c,0,0,ir*1.5,[H.glow,'rgba(0,0,0,0)'],0,0);c.fill();c.restore()}
 E(c,0,0,ir,ir*1.05);c.fillStyle=RG(c,0,0,ir,[cshift(iris,.6),iris,cshift(iris,-.55)],0,-ir*.55);c.fill();E(c,0,0,ir,ir*1.05);c.strokeStyle=cshift(iris,-.72);c.lineWidth=1.1;c.stroke();
 E(c,ir*.05,ir*.1,ir*.46,ir*.54);c.fillStyle='#0b0a12';c.fill();
 E(c,ir*.42,-ir*.45,ir*.33,ir*.28);c.fillStyle='#ffffff';c.fill();E(c,-ir*.36,ir*.4,ir*.15,ir*.13);c.fillStyle='rgba(255,255,255,.85)';c.fill();
 return {img:cv,rad}}
const EXPR={idle:0,ant:1,atk:1,cel:1,stun:1,blink:1};
function lidsBrows(c,G,mood,skin){const y=G.ey;
 for(const e of eyesOf(G)){const sd=e.sd,ex=e.x,erx=e.rx,ry=e.ry;
  c.save();E(c,ex,y,erx,ry);c.clip();c.fillStyle='rgba(30,20,40,.24)';c.fillRect(ex-erx,y-ry,erx*2,ry*.42);
  if(mood==='angry'||mood==='fierce'||mood==='sly'||mood==='cold'){const inner=ex-sd*(erx+3),outer=ex+sd*(erx+3);
   let li=.05,lo=.7;if(mood==='fierce'){li=-.08;lo=.85}else if(mood==='sly'){li=sd>0?.55:.12;lo=sd>0?.78:.42}else if(mood==='cold'){li=.3;lo=.28}
   c.beginPath();c.moveTo(outer,y-ry-3);c.lineTo(inner,y-ry-3);c.lineTo(inner,y-ry*li);c.lineTo(outer,y-ry*lo);c.closePath();c.fillStyle=skin;c.fill();
   c.beginPath();c.moveTo(inner,y-ry*li);c.lineTo(outer,y-ry*lo);c.strokeStyle=OL;c.lineWidth=2.2;c.stroke()}
  if(mood==='happy'){E(c,ex,y+ry*1.3,erx*1.5,ry*.8);c.fillStyle=skin;c.fill()}
  c.restore();E(c,ex,y,erx,ry);c.strokeStyle=OL;c.lineWidth=2.3;c.stroke();brow(c,ex,y,erx,ry,sd,mood)}}
function brow(c,ex,y,erx,ry,sd,mood){const by=y-ry*1.32,inX=ex-sd*erx*.8,outX=ex+sd*erx*1.15;let yi,yo,arc=ry*.1;
 if(mood==='angry'||mood==='fierce'){yi=by+ry*.48;yo=by-ry*.28;arc=0}else if(mood==='sly'){yi=sd>0?by+ry*.15:by-ry*.38;yo=sd>0?by+ry*.05:by-ry*.1}
 else if(mood==='happy'){yi=by;yo=by;arc=ry*.4}else if(mood==='cold'){yi=by+ry*.22;yo=by+ry*.04;arc=0}else if(mood==='worry'){yi=by-ry*.35;yo=by+ry*.2;arc=0}else{yi=by+ry*.1;yo=by-ry*.14}
 c.beginPath();c.moveTo(inX,yi+1.8);c.quadraticCurveTo((inX+outX)/2,(yi+yo)/2-arc,outX,yo-.4);c.quadraticCurveTo((inX+outX)/2,(yi+yo)/2-arc-3.8,inX,yi-2.2);c.closePath();c.fillStyle=OL;c.fill()}
function closedEyes(c,G,skin,kind,mood){for(const e of eyesOf(G)){const x=e.x,y=G.ey,rx=e.rx,ry=e.ry;E(c,x,y,rx+1.4,ry+1.4);c.fillStyle=skin;c.fill();c.beginPath();
  if(kind==='cel'){c.moveTo(x-rx*.95,y+ry*.35);c.quadraticCurveTo(x,y-ry*.85,x+rx*.95,y+ry*.35);c.lineWidth=3.2}
  else if(kind==='stun'){for(let i=0;i<=24;i++){const a=i/24*Math.PI*4,r=rx*.85*i/24;i?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r*.95):c.moveTo(x,y)}c.lineWidth=1.9}
  else{c.moveTo(x-rx,y+ry*.05);c.quadraticCurveTo(x,y+ry*.6,x+rx,y+ry*.05);c.lineWidth=2.6}
  c.strokeStyle=OL;c.stroke();if(kind!=='stun')brow(c,x,y,rx,ry,e.sd,kind==='cel'?'happy':mood)}}
function exprLayer(c,L,G,ex){const H=L.h,skin=H.skin||'#cfe8b0';
 let mood=H.mood,mouth=H.mouth||'line',mw=G.mw,open=1;
 if(ex==='ant'){mood='fierce';mouth='effort'}else if(ex==='atk'){mood='angry';mouth=H.mouth==='fangs'?'fangs':'open';mw*=1.25}
 else if(ex==='cel'){open=0;mouth='open';mw*=1.15}else if(ex==='stun'){open=0;mouth='wavy'}else if(ex==='blink')open=0;
 if(open)lidsBrows(c,G,mood,skin);else closedEyes(c,G,skin,ex,mood);
 if(G.jaw)return;
 if(H.blush||ex==='cel')blush(c,G.ex,G.my-G.mw*.4,G.sp*1.5);
 if(mouth==='wavy'){c.beginPath();for(let i=0;i<=8;i++){const xx=G.mx-mw+i*mw/4,yy=G.my+(i%2?2:-1);i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.strokeStyle=OL;c.lineWidth=2.4;c.stroke()}
 else mouthHQ(c,G.mx,G.my,mouth,mw)}
// --- construcción de las piezas de un personaje (por etapa y aspecto) ---
function rigParts(k,st,skin){const key=k+'|'+st+'|'+(skin||'');if(RIG[key])return RIG[key];
 const L=stageLook(k,st),U=UT[k],hy=L.h.y||-80,bulky=L.b.t==='bulky',S=skin&&SKINS[skin],F=S?S.f:null,R=RIG_R;L.k=k;
 const P={L,st,F,ex:{}};
 P.wing=L.wings?rigPart(c=>rigWing(c,L.wings),1,F):null;
 P.back=L.bk?rigPart((c,A)=>{if(['cape','mantle','flamewings'].includes(L.bk.t))chBack(c,L.bk,hy);else litLayer(A,R,g=>chBack(g,L.bk,hy),ROX,ROY+hy+20,45,.8)},1,F):null;
 P.armB=rigPart(c=>{armHQ(c,-14,-46,-25,-30,cshift(L.arm,-.15),bulky?8.5:6.5)},1,F);
 P.legs=rigPart(c=>chBody(c,L.b,'legs'),1,F);
 P.torso=rigPart(c=>{chBody(c,L.b,'torso');if(L.paul)rigPaul(c,L);if(L.collar)rigCollar(c,L);AO(c,RT3,-56,21,8,.6)},1,F);
 let G;P.head=rigPart((c,A)=>litLayer(A,R,g=>{g.translate(RT3,0);RIGF=1;let I;try{I=chHead(g,L.h,hy);G=eyeGeo(L.h,I)}finally{RIGF=0}eyeWhites(g,G);return I},ROX+RT3,ROY+hy-(L.h.r||22)*.3,(L.h.r||22)*1.5*(L.h.big?1.3:1),NEWH[L.h.t]?.45:1),1,F);
 const I=P.head.res;P.I=I;P.G=G;P.eyes=eyesOf(G).map(e=>Object.assign(e,{x:e.x+RT3}));
 P.top=rigPart(c=>{c.translate(RT3,0);if(L.hat)chHat(c,L.hat,I);if(L.sprout)rigSprout(c,I);
  if(S&&S.crown){c.save();c.translate(-RT3,I.top+2);c.rotate(-.12);c.beginPath();c.moveTo(-13,0);c.lineTo(-15,-14);c.lineTo(-7,-6);c.lineTo(0,-17);c.lineTo(7,-6);c.lineTo(15,-14);c.lineTo(13,0);c.closePath();
   P_(c,LG(c,0,-17,0,0,['#fff6b0','#ffd23f','#c88a10']),2.2);for(const [x,col] of [[-8,'#ff4a6a'],[0,'#4fb3ff'],[8,'#7fff6a']]){E(c,x,-3.5,2.2,2.2);P_(c,col,1.2)}c.restore()}},1,F);
 const irMax=Math.max(...P.eyes.map(e=>e.ir));P.iris=irisSprite(L.h,irMax,F);P.irMax=irMax;
 P.topY=NECK_Y+((I.top-(S&&S.crown?17:0))-NECK_Y)*HEAD_S;
 return RIG[key]=P}
const P_=(c,f,lw)=>P(c,f,lw);
function rigExpr(P,ex){return P.ex[ex]||(P.ex[ex]=rigPart(c=>{c.translate(RT3,0);exprLayer(c,P.L,P.G,ex)},0,P.F))}
// Precalienta las piezas (por ejemplo las del mazo al empezar una partida) para no trabar el primer cuadro.
function rigWarm(keys,skins,stages){for(const k of keys)for(const st of stages||[1]){const P=rigParts(k,st,skins&&skins[k]);rigExpr(P,'idle');rigExpr(P,'blink')}}
// --- dibujo ---
const QUIRK={tirador:'aim',franco:'aim',rafaga:'spin',area:'stretch',control:'look',cadena:'buzz',productor:'hop',apoyo:'hop',veneno:'chuckle',debil:'chuckle',ejecutor:'menace'};
function drawChar(c,k,x,y,s,t,rank,pop,skin,af,face,st){if(UNIT_IMG[k]&&artPng())return drawCharPng(c,k,x,y,s,t,rank,pop,skin,af,face);
 st=st||RIG_NOST;face=face||1;const U=UT[k],stg=charStage(rank|0),P=rigParts(k,stg,skin),L=P.L,p=pop||0,a=clamp((af||0)/.3,0,1),S=s*.82*PH_SZ[Math.min(rank|0,5)]*STG_S[stg],tier=U.t||'cobre';
 const seed=st.seed!=null?st.seed:Math.round(x*.37+y*.11),ph=t+seed*.71,still=st===RIG_NOST&&!t,ant=st.ant||0,mo=st.morph||0;
 let ix=0,iy=0,rot=0,sx=1,sy=1,wa=0,hr=0,lx=.75,ly=0,ex='idle',armSw=0;
 if(!still)switch(L.idle){case 'sway':rot=Math.sin(ph*2)*.05;break;case 'breathe':sy=1+Math.sin(ph*2.4)*.03;sx=1-Math.sin(ph*2.4)*.015;break;case 'hop':iy=-Math.abs(Math.sin(ph*3))*5;break;case 'float':iy=-7+Math.sin(ph*2)*3.5;break;default:iy=Math.sin(ph*3.2)*1.8}
 const br=still?0:Math.sin(ph*2.6);sx*=1-br*.02;sy*=1+br*.032;const lag=still?0:Math.sin(ph*2.6-.9)*1.7;
 // mirada: hacia el objetivo, o vistazos breves cuando no hay
 if(st.lx!=null){const d=Math.hypot(st.lx,st.ly)||1;lx=st.lx/d*face;ly=st.ly/d;hr=clamp(ly*.12,-.1,.12)}else if(!still){const sk=Math.floor(ph/1.9);lx=.75-pHash(sk*3.7+seed)*.9;ly=(pHash(sk*1.3+seed*2)-.5)*.5}
 // manía de su rol cada ~5 s
 const busy=a>0||ant>0||st.stun||mo>0||st.cheer;
 if(!still&&!busy){const Q=4.6+pHash(seed*3.1+k.length)*1.4,qp=(ph+pHash(seed+.5)*Q)%Q;if(qp<.9){const f=qp/.9,env=Math.sin(f*Math.PI);
  switch(QUIRK[U.r]){case 'aim':wa-=.5*env;hr-=.06*env;lx=1;ly=0;if(env>.4)ex='ant';break;case 'spin':wa+=f*Math.PI*2;iy-=4*env;break;
   case 'stretch':sy*=1+.09*env;sx*=1-.05*env;armSw=-.8*env;if(env>.5)ex='blink';break;case 'look':lx=Math.cos(f*Math.PI*3);hr=Math.sin(f*Math.PI*3)*.08;break;
   case 'buzz':ix+=Math.sin(ph*55)*1.3*env;iy+=Math.cos(ph*47)*1*env;break;case 'hop':iy-=Math.abs(Math.sin(f*Math.PI*2))*7;ex='cel';break;
   case 'chuckle':rot+=Math.sin(ph*28)*.035*env;ex='cel';break;case 'menace':ix+=4*env;sy*=1+.04*env;ex='atk';break}}}
 // parpadeo propio (2,8–4,5 s según la casilla)
 if(!still&&ex==='idle'){const B=2.8+1.7*pHash(seed+7.3),bp=(ph+pHash(seed+3.1)*B)%B;if(bp<.13)ex='blink'}
 // ataque en tres tiempos: anticipación (según el enfriamiento) → estirón → recuperación
 if(ant>0&&a<=0){sx*=1+.05*ant;sy*=1-.07*ant;ix-=3*ant;rot-=.05*ant;wa-=.35*ant;ex='ant'}
 if(a>0){const q=1-a,e=q<.25?1-q*1.2:Math.max(0,.7-(q-.25)*1.6),fo=q>.25?Math.sin((q-.25)/.75*Math.PI*2)*(1-(q-.25)/.75):0;
  sx*=1-.08*e+.05*fo;sy*=1+.1*e-.06*fo;rot+=.04*e-.03*fo;if(q<.6)ex='atk';
  switch(L.atk){case 'recoil':ix-=11*e-3*fo;wa=-.25*e;break;case 'lunge':ix+=10*e-3*fo;iy-=2*e;wa=.4*e;break;case 'raise':wa=-1.1*e;iy-=3*e;break;case 'twirl':rot+=Math.sin(e*Math.PI)*.35;break;case 'stomp':sy*=1-.2*e;sx*=1+.14*e;break;case 'flash':wa=-.4*e;break;default:ix+=6*e}}
 if(st.stun){ex='stun';rot+=Math.sin(ph*4)*.06;hr+=Math.sin(ph*3)*.08}
 if(st.cheer){ex='cel';iy-=Math.abs(Math.sin(ph*9))*6;armSw=-1}
 // metamorfosis (0,55 s): capullo de luz → onda → rebote heroico
 let mS=1,cov=0;if(mo>0){if(mo<.35){const f=mo/.35;mS=1-.25*f;cov=f}else{const f=(mo-.35)/.65;mS=1+.32*Math.sin(f*Math.PI)*(1-f*.6);cov=Math.max(0,1-f*3);ex='cel'}}
 if(mo>0&&mo<.95){const f=Math.sin(mo/.95*Math.PI);iy-=15*f;rot+=Math.sin(mo*Math.PI*3)*.1*f}// se eleva 15 px girando
 c.save();c.translate(x,y+36*s);c.scale(face,1);E(c,0,0,24*s*(L.idle==='float'?.72:1),6*s);c.fillStyle='rgba(0,0,0,.3)';c.fill();
 c.scale(S,S);tierBack(c,tier,t);phaseBack(c,rank,t,U.shot,P.topY);c.translate(ix,iy);c.rotate(rot);c.scale(sx*(1+p*.18)*mS,sy*(1-p*.1)*mS*(mo>.35&&mo<.6?1.08:1));
 if(L.atk==='flash'&&a>0){c.globalAlpha=a*.55;circ(c,0,-70,62,U.shot);c.globalAlpha=1}
 if(L.fx==='glow'){c.globalAlpha=.22+.1*Math.sin(t*2.5)+a*.3;circ(c,0,-66,56,L.fxc||'#fff');c.globalAlpha=1}
 const dens=S*DPR*Math.max(sx,sy)*(1+p*.18)*mS*1.15;
 if(P.wing){const fl=still?0:Math.sin(ph*3.2)*.09+a*.12;if(!still){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.28+.14*Math.sin(ph*2.2);const R2=64;c.drawImage(glowSprite(U.shot),-R2,-72-R2,R2*2,R2*2);c.restore()}
  for(const sd of [1,-1]){c.save();c.scale(sd,1);c.translate(6,-52);c.rotate(-fl);c.translate(-6,52);rp(c,P.wing,dens);c.restore()}}
 if(P.back){c.save();c.translate(0,-55);c.rotate(-lag*.012);c.translate(0,55);rp(c,P.back,dens);c.restore()}
 c.save();c.translate(-14,-46);c.rotate(armSw*.6+lag*.03-wa*.15);c.translate(14,46);rp(c,P.armB,dens);c.restore();
 rp(c,P.legs,dens);
 c.save();c.translate(0,-8);c.scale(1+br*.012,1);c.translate(0,8);rp(c,P.torso,dens);c.restore();
 // cabeza: pivota en el cuello, sigue al objetivo y queda un poco por detrás del cuerpo (inercia)
 const hd=dens*HEAD_S;c.save();c.translate(RT3,NECK_Y+lag*.35);c.rotate(hr+lag*.012);c.scale(HEAD_S,HEAD_S);c.translate(-RT3,-NECK_Y);
 rp(c,P.head,hd);
 if(ex==='idle'||ex==='ant'||ex==='atk'){const G=P.G;for(const e of P.eyes){const ixx=e.x+e.rx*(.06+.24*lx),iyy=G.ey+e.ry*(.1+.24*ly),sc=e.ir/P.irMax,r=P.iris.rad*sc;
  c.save();E(c,e.x,G.ey,e.rx,e.ry);c.clip();c.drawImage(P.iris.img,ixx-r,iyy-r,r*2,r*2);c.restore()}}
 rp(c,rigExpr(P,ex),hd);rp(c,P.top,hd);c.restore();
 const W=L.w,hx=W.hx+lag*.35,hyy=W.hy+lag;if(W.t!=='none'){c.save();c.translate(hx,hyy);c.rotate((W.a||0)+wa+lag*.015);if(W.sc!==1)c.scale(W.sc,W.sc);drawWeapon(c,W,t,a);muzzle(c,W,a,U.shot);if(stg===3&&!still&&TIP[W.t]){const [tx,ty]=TIP[W.t],R2=13+3*Math.sin(t*5+seed);c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.6+.3*Math.sin(t*5+seed);c.drawImage(glowSprite(U.shot),tx*1.25-R2,ty*1.25-R2,R2*2,R2*2);c.restore()}c.restore()}
 armHQ(c,13,-46,hx,hyy,L.arm,L.b.t==='bulky'?8.5:6.5);
 if(!(LOWFX&&!still))chFx(c,L,t,a);
 if(cov>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=cov;const R2=70;c.drawImage(glowSprite(U.shot||'#fff'),-R2,-60-R2,R2*2,R2*2);c.drawImage(glowSprite('#ffffff'),-R2*.6,-60-R2*.6,R2*1.2,R2*1.2);c.restore();
  if(mo<.35){c.save();c.globalAlpha=.85*cov;for(let i=0;i<6;i++){c.save();c.translate(RT3,-50);c.rotate(i/6*Math.PI*2+mo*6);petal(c,40*(1-.4*cov),12,'round','#fffbe0',PH_COL[Math.min(rank|0,5)]||'#ffd23f',.3);c.restore()}c.restore()}}
 tierFront(c,tier,t);phaseFront(c,rank,t,U.shot,P.topY);c.restore();
 if(mo>.3&&mo<1){const f=(mo-.3)/.7;c.save();c.globalAlpha=(1-f)*.9;c.strokeStyle=PH_COL[Math.min(rank|0,5)]||'#fff';c.lineWidth=(6-4*f)*s;E(c,x,y+30*s,(18+70*f)*s,(6+22*f)*s);c.stroke();
  c.strokeStyle='#ffffff';c.lineWidth=2*s;E(c,x,y+30*s,(12+60*f)*s,(4+18*f)*s);c.stroke();c.restore()}
 if(typeof save!=='undefined'&&save.opts.cb)shapeMark(c,k,x-24*s,y+22*s,12*s);
 if(rank)phaseBadge(c,x-27*s*face,y-8*s,s,rank)}
// Metamorfosis al fusionar o subir de fase: se detecta en el dibujo (sin tocar la simulación).
const MORPH=new WeakMap();
function morphOf(b,i,u,t){let m=MORPH.get(b);if(!m){m=[];MORPH.set(b,m)}const o=m[i];
 if(!o||t<o.t-.5){m[i]={u,r:u.rank,t0:-9,t};return 0}
 if((o.u!==u&&u.rank>=2&&u.pop>=.3)||(o.u===u&&u.rank>o.r)){o.t0=t;if(!b.isAI&&audible(b))sfx('morph',u.rank)}
 o.u=u;o.r=u.rank;o.t=t;const f=(t-o.t0)/.6;return f>0&&f<1?f:0}
