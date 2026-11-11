// Brotes Rebeldes · Dibujo de la partida: escenarios, insectos 3/4, efectos y duelo local.
"use strict";
// ============ LAYOUT ============
function controls(){const b=G.boards[0];
 if(G.duel)return{sum:{x:150,y:418,w:180,h:64},dew:{x:18,y:426,w:120,h:48},cards:b.deck.map((k,i)=>({k,x:18+i*86,y:494,w:80,h:96})),cmd:b.cmd?{x:340,y:418,w:96,h:64}:null};
 const many=b.deck.length>5;
 return{sum:{x:640,y:504,w:250,h:84},dew:{x:640,y:458,w:250,h:38},cards:b.deck.map((k,i)=>({k,x:many?60+i*71:70+i*104,y:500,w:many?66:96,h:92})),cmd:b.cmd?{x:812,y:262,w:142,h:182}:null}}
function drawCmd(c,b,r,t,key){key=key||'Q';const C=CMDS[b.cmd],ready=b.cmdCd<=0,big=r.h>100;
 rr(c,r.x,r.y,r.w,r.h,14,ready?'rgba(58,42,8,.85)':'rgba(0,0,0,.65)',ready?C.col:'#3a5a48',ready?3+Math.sin(t*6):2);
 const x0=r.x+r.w/2,y0=r.y+(big?50:r.h/2),rad=big?34:25;circ(c,x0,y0,rad,ready?'#1d3326':'#111');
 c.drawImage(bustSprite(b.cmd),x0-rad,y0-rad,rad*2,rad*2);
 if(!ready){const f=clamp(b.cmdCd/ccd(C,b.cmdLv||1),0,1);c.beginPath();c.moveTo(x0,y0);c.arc(x0,y0,rad,-Math.PI/2,-Math.PI/2+f*Math.PI*2);c.closePath();c.fillStyle='rgba(0,0,0,.62)';c.fill();txt(c,Math.ceil(b.cmdCd),x0,y0,big?22:18,'#fff','center','#000')}
 if(big){txt(c,C.an+(b.cmdLv>1?` · Nv ${b.cmdLv}`:''),x0,r.y+100,15,'#ffe9a8');txt(c,ready?'¡LISTA! (Q)':'Recargando…',x0,r.y+124,13,ready?C.col:'#9ab')}
 else txt(c,key,r.x+r.w-(key.length>1?16:11),r.y+12,12,ready?C.col:'#789')}
const BTN_PAUSE={x:904,y:10,w:46,h:40},BTN_SPEED={x:852,y:10,w:46,h:40};
const inR=(x,y,r)=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;

// ============ RENDER ============
// ===================== ESCENARIOS, INSECTOS Y COMBATE (solo visual) =====================
// Nada de esto usa el generador de la partida (sr): las repeticiones y la simulación no cambian.
let SHAKE=0,SHK_T=0,HCRIT=0,DOT=0;
function addShake(v){if(!(typeof save!=='undefined'&&save.opts.noFlash))SHAKE=Math.max(SHAKE,v)}
// Brillo radial reutilizable (se calcula una vez por color y luego solo se copia).
const GLW={};
function glowSprite(col){col=col||'#ffffff';if(GLW[col])return GLW[col];const cv2=document.createElement('canvas');cv2.width=cv2.height=64;const g=cv2.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);
 gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.75)');gr.addColorStop(.6,'rgba(255,255,255,.22)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);
 g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,64,64);return GLW[col]=cv2}

// ---------- Biomas ----------
const BIOMES=['Huerto Real','Bosque Nocturno Místico','Tierras Volcánicas'];
const BIO=[
 {bg:['#7cc35a','#5fa242','#447f30'],cellA:'#7cbc50',cellB:'#6aa846',soil:'#5a3a20',path:['#6a5a44','#544636'],edge:'#5a3a1c',vort:'255,200,120',vcol:'#ff9a3a'},
 {bg:['#2c3c5c','#222e4a','#121a2e'],cellA:'#3e5c58',cellB:'#33504c',soil:'#1e1a2a',path:['#4c4458','#3a3446'],edge:'#1a1424',vort:'210,140,255',vcol:'#b06aff'},
 {bg:['#4a2a22','#2a1814','#140a08'],cellA:'#6a5a50',cellB:'#5a4c44',soil:'#2a1a14',path:['#3a3230','#2a2422'],edge:'#140c0a',vort:'255,120,40',vcol:'#ff5a1a'}];
function biomeOf(g){const o=(typeof save!=='undefined'&&save.opts.bio)|0;if(o>0)return o-1;if(!g||!g.o)return 0;if(g.mode==='campaign')return (g.o.ch||0)%3;if(g.mode==='tutorial')return 0;return (g.o.seed>>>0)%3}
const BGC={};
function biomeBgCanvas(bio){if(BGC[bio])return BGC[bio];const cv2=document.createElement('canvas');cv2.width=W*DPR;cv2.height=H*DPR;const c=cv2.getContext('2d');c.scale(DPR,DPR);c.lineCap='round';c.lineJoin='round';const B=BIO[bio],r=n=>pHash(n*1.37+bio*311);
 c.fillStyle=LG(c,0,0,0,H,B.bg);c.fillRect(0,0,W,H);
 if(bio===0){for(let i=0;i<70;i++){E(c,r(i)*W,r(i+100)*H,30+r(i+200)*60,14+r(i+300)*26);c.fillStyle=i%2?'rgba(255,255,200,.06)':'rgba(20,60,10,.08)';c.fill()}
  for(const [col,from] of [['rgba(40,100,25,.45)',0],['rgba(170,230,110,.38)',1]]){c.beginPath();for(let i=from;i<3400;i+=2){const x=r(i+400)*W,y=r(i+4000)*H,l=4+r(i+8000)*6,a=-Math.PI/2+(r(i+9000)-.5)*.9;c.moveTo(x,y);c.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l)}c.strokeStyle=col;c.lineWidth=1.2;c.stroke()}
  for(let i=0;i<60;i++){const x=r(i+12000)*W,y=r(i+13000)*H,col=['#ffffff','#ffd23f','#ff8ab0','#b88aff'][i%4];for(let j=0;j<5;j++){const a=j/5*Math.PI*2;circ(c,x+Math.cos(a)*2.6,y+Math.sin(a)*2.6,2,col)}circ(c,x,y,1.5,'#ffb020')}
  for(let i=0;i<26;i++){const x=r(i+14000)*W,y=r(i+15000)*H,s=4+r(i+16000)*7;E(c,x+1,y+2,s*1.1,s*.7);c.fillStyle='rgba(0,0,0,.2)';c.fill();VOL(c,cc=>{E(cc,x,y,s*1.1,s*.75)},'#a8a49a',{bb:[x-s,y-s,x+s,y+s],light:'#eceae0',dark:'#5a584e',rim:1.4,lw:.8})}}
 else if(bio===1){for(let i=0;i<50;i++){E(c,r(i)*W,r(i+100)*H,40+r(i+200)*70,18+r(i+300)*30);c.fillStyle=i%2?'rgba(120,90,180,.07)':'rgba(0,0,10,.15)';c.fill()}
  for(let i=0;i<14;i++){const x=r(i+500)*W,y=r(i+600)*H,rx=26+r(i+700)*40,ry=rx*.42;E(c,x,y,rx,ry);c.fillStyle=RG(c,x,y,rx,['rgba(120,200,220,.55)','rgba(40,80,110,.6)','rgba(20,30,50,.5)'],x-rx*.3,y-ry*.4);c.fill();c.strokeStyle='rgba(10,20,30,.6)';c.lineWidth=2;c.stroke();
   for(let j=0;j<2;j++){c.beginPath();c.ellipse(x-rx*.2,y-ry*.2,rx*(.3+j*.2),ry*(.3+j*.2),0,Math.PI*1.1,Math.PI*1.6);c.strokeStyle='rgba(220,250,255,.35)';c.lineWidth=1.2;c.stroke()}}
  c.beginPath();for(let i=0;i<90;i++){const x=r(i+800)*W,y=r(i+900)*H,h=10+r(i+1000)*22;c.moveTo(x,y);c.quadraticCurveTo(x+3,y-h*.6,x+(r(i+1100)-.5)*6,y-h)}c.strokeStyle='rgba(60,90,60,.7)';c.lineWidth=1.6;c.stroke();
  for(let i=0;i<90;i+=5){const x=r(i+800)*W,y=r(i+900)*H,h=10+r(i+1000)*22;E(c,x+(r(i+1100)-.5)*6,y-h,1.8,4);c.fillStyle='#4a3020';c.fill()}
  for(let i=0;i<22;i++){const x=r(i+1200)*W,y=r(i+1300)*H,s=3+r(i+1400)*4,col=['#5ae0ff','#c06aff','#7aff9a'][i%3];c.fillStyle='#d8d0e8';c.fillRect(x-.8,y,1.6,s*1.2);E(c,x,y,s,s*.6);c.fillStyle=col;c.fill();c.globalCompositeOperation='lighter';c.globalAlpha=.5;c.drawImage(glowSprite(col),x-s*4,y-s*4,s*8,s*8);c.globalAlpha=1;c.globalCompositeOperation='source-over'}}
 else{for(let i=0;i<190;i++){const x=r(i+2000)*W,y=r(i+2100)*H,s2=14+r(i+2200)*26;c.beginPath();for(let j=0;j<6;j++){const a=j/6*Math.PI*2+r(i+j)*.5,q=s2*(.75+r(i*7+j)*.4);c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q*.7)}c.closePath();c.fillStyle=cshift('#3a2c28',(r(i+2300)-.5)*.3);c.fill();c.strokeStyle='rgba(10,4,2,.6)';c.lineWidth=1.2;c.stroke()}
  c.save();c.globalCompositeOperation='lighter';for(let i=0;i<26;i++){const x=r(i+2400)*W,y=r(i+2500)*H;pZig(c,x,y,x+(r(i+2600)-.5)*140,y+(r(i+2700)-.5)*90,i*13,16,6);c.strokeStyle='rgba(255,90,20,.55)';c.lineWidth=2.4;c.stroke();c.strokeStyle='rgba(255,210,120,.6)';c.lineWidth=.8;c.stroke()}
  for(let i=0;i<30;i++){const x=r(i+2800)*W,y=r(i+2900)*H;c.globalAlpha=.5;c.drawImage(glowSprite('#ff6a1a'),x-10,y-10,20,20)}c.restore();c.globalAlpha=1;for(let i=0;i<40;i++)circ(c,r(i+3000)*W,r(i+3100)*H,1+r(i+3200)*1.6,'rgba(200,190,180,.25)')}
 const vg=c.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=vg;c.fillRect(0,0,W,H);
 return BGC[bio]=cv2}
function drawBiomeBg(c,g,t){const bio=biomeOf(g);c.drawImage(biomeBgCanvas(bio),0,0,W,H);
 if(bio===1){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<12;i++){const x=((pHash(i)*W+Math.sin(t*.4+i)*40+t*6*(i%2?1:-1))%W+W)%W,y=pHash(i+50)*H+Math.cos(t*.5+i*2)*20;c.globalAlpha=.35+.35*Math.sin(t*3+i*1.7);c.drawImage(glowSprite('#c8ff7a'),x-7,y-7,14,14)}c.restore()}
 else if(bio===2){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<16;i++){const p=(t*.08+pHash(i+70))%1,x=((pHash(i+80)*W+Math.sin(t*.9+i)*30)%W+W)%W,y=H*(1-p);c.globalAlpha=Math.sin(p*Math.PI)*.8;c.drawImage(glowSprite('#ff7a2a'),x-5,y-5,10,10)}c.restore()}
 else{for(let i=0;i<3;i++){const x=((pHash(i+90)*W+t*18*(i%2?1:-1))%W+W)%W,y=pHash(i+95)*H+Math.sin(t*1.3+i)*24,f=Math.abs(Math.cos(t*16+i));c.save();c.translate(x,y);for(const s of [-1,1]){c.save();c.scale(s*(.3+.7*f),1);E(c,5,-2,5,4);c.fillStyle=['#ffd23f','#ff9ac0','#9ad8ff'][i];c.fill();c.restore()}c.fillStyle='#3a2a1a';c.fillRect(-.8,-4,1.6,7);c.restore()}}}

// ---------- Tablero detallado (capa fija cacheada + detalles animados) ----------
// Pedestal de tierra/piedra con grosor bajo los pies de cada planta.
function pedestal(c,x,y,sc,bio){const rx=26*sc,ry=8*sc,T=5*sc,col=[['#8a6a4a','#5a4028'],['#4a4a62','#2a2a3a'],['#4a3a34','#2a1e1a']][bio];
 E(c,x+3*sc,y+T+3*sc,rx*1.05,ry*1.1);c.fillStyle='rgba(0,0,0,.35)';c.fill();
 c.beginPath();c.ellipse(x,y+T,rx,ry,0,0,Math.PI);c.lineTo(x-rx,y);c.ellipse(x,y,rx,ry,0,Math.PI,0,true);c.closePath();c.fillStyle=col[1];c.fill();
 E(c,x,y,rx,ry);c.fillStyle=col[0];c.fill();E(c,x-rx*.25,y-ry*.3,rx*.5,ry*.35);c.fillStyle='rgba(255,255,255,.15)';c.fill();E(c,x,y,rx,ry);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.stroke()}
let NOSH=0;
function bPath(c,b){c.beginPath();b.pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]))}
const BRDC={};
function boardLayer(b,bio){const key=[b.bx,b.by,b.cs,bio].join();if(BRDC[key])return BRDC[key];const {bx,by,cs,w,h,m}=b,X0=bx-m-cs*.75,Y0=by-m-cs*.9,X1=bx+w+m+cs*.75,Y1=by+h+cs*.95;
 const cv2=document.createElement('canvas');cv2.width=Math.ceil((X1-X0)*DPR);cv2.height=Math.ceil((Y1-Y0)*DPR);const c=cv2.getContext('2d');c.scale(DPR,DPR);c.translate(-X0,-Y0);c.lineJoin='round';c.lineCap='round';
 const glows=[];drawBoardStatic(c,b,bio,glows);return BRDC[key]={cv:cv2,x:X0,y:Y0,w:X1-X0,h:Y1-Y0,glows}}
function drawBoardStatic(c,b,bio,glows){const {bx,by,cs,w,h,m}=b,sc=cs/96,B=BIO[bio],pw=cs*.62,r=n=>pHash(n*1.71+bio*97+bx*.011);
 const line=(off,step,wig)=>{c.beginPath();let first=true;for(let d=0;d<=b.L+.1;d+=step||6){const [x,y,a]=posAt(b,Math.min(d,b.L)),o=off+(wig?Math.sin(d*.07+off)*wig:0),X=x+Math.sin(a)*o,Y=y-Math.cos(a)*o;first?c.moveTo(X,Y):c.lineTo(X,Y);first=false}};
 const along=(step,fn)=>{let i=0;for(let d=step*.5;d<b.L;d+=step){const [x,y,a]=posAt(b,d);fn(x,y,a,d,i++)}};
 // --- carril de los insectos ---
 bPath(c,b);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=pw+18*sc;c.stroke();
 bPath(c,b);c.strokeStyle=B.edge;c.lineWidth=pw+6*sc;c.stroke();
 bPath(c,b);c.strokeStyle=B.path[0];c.lineWidth=pw;c.stroke();
 bPath(c,b);c.strokeStyle=B.path[1];c.globalAlpha=.45;c.lineWidth=pw*.5;c.stroke();c.globalAlpha=1;
 if(bio===0){along(11*sc,(x,y,a,d,i)=>{for(let j=0;j<3;j++){const o=(j-1)*pw*.3+(r(i*3+j)-.5)*4*sc,X=x+Math.sin(a)*o+Math.cos(a)*(r(i*5+j)-.5)*3*sc,Y=y-Math.cos(a)*o+Math.sin(a)*(r(i*5+j)-.5)*3*sc,rx=(5+r(i*7+j)*2.5)*sc;E(c,X+1*sc,Y+1.5*sc,rx,rx*.75);c.fillStyle='rgba(30,20,10,.5)';c.fill();E(c,X,Y,rx,rx*.75);c.fillStyle=['#b8ac98','#a89c88','#c8bca8','#9a8e7a'][(i+j)%4];c.fill();E(c,X-rx*.3,Y-rx*.3,rx*.45,rx*.28);c.fillStyle='rgba(255,255,255,.35)';c.fill()}})}
 else if(bio===1){along(14*sc,(x,y,a,d,i)=>{const o=(r(i)-.5)*pw*.7;E(c,x+Math.sin(a)*o,y-Math.cos(a)*o,(5+r(i+40)*9)*sc,(3+r(i+80)*4)*sc,a);c.fillStyle='rgba(10,5,20,.3)';c.fill()});
  along(70*sc,(x,y,a,d,i)=>{const o=(r(i+500)-.5)*pw*.4,X=x+Math.sin(a)*o,Y=y-Math.cos(a)*o,rx=(9+r(i+510)*6)*sc;E(c,X,Y,rx,rx*.5,a);c.fillStyle=RG(c,X,Y,rx,['rgba(150,220,240,.7)','rgba(50,90,130,.7)','rgba(20,30,50,.6)'],X-rx*.3,Y-rx*.2);c.fill();c.beginPath();c.ellipse(X-rx*.2,Y-rx*.15,rx*.5,rx*.22,a,Math.PI*1.1,Math.PI*1.7);c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1;c.stroke()})}
 else{along(28*sc,(x,y,a,d,i)=>{c.save();c.translate(x,y);c.rotate(a);rr(c,-12*sc,-pw*.43,24*sc,pw*.86,4*sc,cshift('#4a3c36',(r(i)-.5)*.25),'rgba(10,4,2,.7)',1.2);c.restore()});
  c.save();c.globalCompositeOperation='lighter';along(46*sc,(x,y,a,d,i)=>{const o=(r(i+77)-.5)*pw*.5,X=x+Math.sin(a)*o,Y=y-Math.cos(a)*o;pZig(c,X-6*sc,Y-4*sc,X+7*sc,Y+5*sc,i*7,5*sc,4);c.strokeStyle='rgba(255,100,20,.7)';c.lineWidth=1.6*sc;c.stroke()});c.restore()}
 // --- bordes del carril ---
 for(const sd of [-1,1]){const off=sd*(pw/2+3*sc);
  if(bio===0)along(15*sc,(x,y,a,d,i)=>{const X=x+Math.sin(a)*off,Y=y-Math.cos(a)*off,s=(3.2+r(i*2+sd+700)*3)*sc;VOL(c,cc=>{E(cc,X,Y,s*1.15,s*.8,a)},['#a8a49a','#b8b0a0','#949088'][i%3],{bb:[X-s,Y-s,X+s,Y+s],light:'#f0eee4',dark:'#4a483e',rim:1,lw:.7})});
  else if(bio===1){line(off,6,2.4*sc);c.strokeStyle='#120a08';c.lineWidth=6*sc;c.stroke();c.strokeStyle='#4a3424';c.lineWidth=3.6*sc;c.stroke();line(off-.8*sc,6,2.4*sc);c.strokeStyle='rgba(200,160,120,.25)';c.lineWidth=1*sc;c.stroke()}
  else along(15*sc,(x,y,a,d,i)=>{const X=x+Math.sin(a)*off,Y=y-Math.cos(a)*off,s2=(3+r(i*2+sd+800)*3)*sc;VOL(c,cc=>{E(cc,X,Y,s2*1.15,s2*.8,a)},'#3a302c',{bb:[X-s2,Y-s2,X+s2,Y+s2],light:'#7a6a60',dark:'#0a0604',rim:1,lw:.7})})}
 // --- muros con altura por fuera del carril: cara superior iluminada, cara frontal sombreada y postes que sobresalen ---
 const out=pw/2+13*sc,WH=11*sc,ww=9*sc,WC=[['#8a5a30','#d8a060'],['#3e3e56','#7a7a9a'],['#3a2e2a','#6e5c52']][bio];
 c.save();c.translate(2*sc,5*sc);line(out,8);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=ww+6*sc;c.stroke();c.restore();
 c.lineCap='butt';for(let k=0;k<=WH;k+=1.5*sc){c.save();c.translate(0,-k);line(out,8);c.strokeStyle=cshift(WC[0],-.5+.35*k/WH);c.lineWidth=ww;c.stroke();c.restore()}
 c.save();c.translate(0,-WH);line(out,8);c.strokeStyle=WC[1];c.lineWidth=ww;c.stroke();line(out,8);c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=ww*.3;c.stroke();if(bio===0){line(out+ww*.25,8);c.strokeStyle='rgba(90,50,20,.35)';c.lineWidth=1;c.stroke()}c.restore();c.lineCap='round';
 along(42*sc,(x,y,a,d,i)=>{const X=x+Math.sin(a)*out,Y=y-Math.cos(a)*out,pw2=11*sc,ph2=WH+12*sc;
  rr(c,X-pw2/2,Y-ph2,pw2,ph2,3*sc,LG(c,X-pw2/2,0,X+pw2/2,0,[cshift(WC[0],-.2),WC[0],cshift(WC[0],-.55)]),'#120804',1.2);
  E(c,X,Y-ph2,pw2/2,pw2*.3);c.fillStyle=WC[1];c.fill();c.strokeStyle='#120804';c.lineWidth=1;c.stroke();
  if(bio===0){E(c,X,Y-ph2,pw2*.28,pw2*.16);c.strokeStyle='rgba(90,50,20,.6)';c.stroke()}
  else if(bio===1){const col=['#5ae0ff','#c06aff','#7aff9a'][i%3];E(c,X,Y-ph2-2*sc,4*sc,2.6*sc);c.fillStyle=col;c.fill();glows.push([X,Y-ph2-2*sc,16*sc,col])}
  else{E(c,X,Y-ph2,pw2*.25,pw2*.14);c.fillStyle='#ffb040';c.fill();glows.push([X,Y-ph2,12*sc,'#ff6a1a'])}});
 if(bio===1)along(22*sc,(x,y,a,d,i)=>{if(r(i+400)<.5)return;const X=x+Math.sin(a)*(out+ww*.6),Y=y-Math.cos(a)*(out+ww*.6)-WH;c.beginPath();c.moveTo(X,Y);c.quadraticCurveTo(X+3*sc,Y+6*sc,X+(r(i)-.5)*6*sc,Y+12*sc);c.strokeStyle='rgba(90,160,90,.7)';c.lineWidth=1.4*sc;c.stroke()});
 // --- cantero (marco del tablero) ---
 const fx0=bx-12*sc,fy0=by-12*sc,fw=w+24*sc,fh=h+24*sc;
 {const T=16*sc,sh=c.createLinearGradient(0,fy0+fh,0,fy0+fh+T+28*sc);sh.addColorStop(0,'rgba(0,0,0,.55)');sh.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sh;c.fillRect(fx0-8*sc,fy0+fh,fw+16*sc,T+28*sc);
  const fc=[['#6a4424','#3a2410'],['#2a2234','#120c1a'],['#3a2a24','#140c0a']][bio];rr(c,fx0,fy0+T,fw,fh,12*sc,LG(c,0,fy0+fh-4*sc,0,fy0+fh+T,fc),'#140a04',2);
  c.save();RRp(c,fx0,fy0+T,fw,fh,12*sc);c.clip();for(let i=0;i<3;i++){c.beginPath();for(let x=fx0;x<=fx0+fw;x+=6)c.lineTo(x,fy0+fh+3*sc+i*4.5*sc+Math.sin(x*.07+i*2)*1.4*sc);c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=1.2;c.stroke()}
  for(let i=0;i<Math.floor(fw/(16*sc));i++){E(c,fx0+8*sc+i*16*sc+r(i+900)*6,fy0+fh+5*sc+r(i+901)*8*sc,(2+r(i+902)*2.5)*sc,(1.5+r(i+903)*1.5)*sc);c.fillStyle=bio===2?'rgba(255,110,30,.55)':'rgba(170,160,140,.55)';c.fill()}c.restore()}
 rr(c,fx0+3*sc,fy0+5*sc,fw,fh,14*sc,'rgba(0,0,0,.35)');
 if(bio===0){rr(c,fx0,fy0,fw,fh,12*sc,LG(c,0,fy0,0,fy0+fh,['#b07a40','#8a5a2a','#6a4220']),'#2a1608',2.5);
  c.save();RRp(c,fx0,fy0,fw,fh,12*sc);c.clip();for(let i=0;i<14;i++){const yy=fy0+(i<7?2+i*1.4:fh-12*sc+(i-7)*1.4)*1;c.beginPath();for(let x=fx0;x<=fx0+fw;x+=8){c.lineTo(x,yy+Math.sin(x*.05+i)*1.4)}c.strokeStyle='rgba(60,30,10,.25)';c.lineWidth=.8;c.stroke()}c.restore();
  for(const [x,y] of [[fx0+7*sc,fy0+6*sc],[fx0+fw-7*sc,fy0+6*sc],[fx0+7*sc,fy0+fh-6*sc],[fx0+fw-7*sc,fy0+fh-6*sc],[fx0+fw/2,fy0+6*sc],[fx0+fw/2,fy0+fh-6*sc]])VOL(c,cc=>{E(cc,x,y,2*sc,2*sc)},'#8a8a94',{bb:[x-2*sc,y-2*sc,x+2*sc,y+2*sc],rim:.8,lw:.6})}
 else if(bio===1){rr(c,fx0,fy0,fw,fh,14*sc,LG(c,0,fy0,0,fy0+fh,['#3a3046','#2a2234','#1a1424']),'#08060c',2.5);
  for(let k=0;k<2;k++){c.beginPath();const per=2*(fw+fh);for(let s=0;s<=per;s+=5){let x,y;if(s<fw){x=fx0+s;y=fy0}else if(s<fw+fh){x=fx0+fw;y=fy0+s-fw}else if(s<2*fw+fh){x=fx0+fw-(s-fw-fh);y=fy0+fh}else{x=fx0;y=fy0+fh-(s-2*fw-fh)}const o=Math.sin(s*.09+k*2)*3*sc;s?c.lineTo(x+o,y+o):c.moveTo(x+o,y+o)}c.closePath();c.strokeStyle='#120a08';c.lineWidth=5.5*sc;c.stroke();c.strokeStyle=k?'#5a4030':'#4a3424';c.lineWidth=3.2*sc;c.stroke()}
  for(const [x,y] of [[fx0,fy0],[fx0+fw,fy0],[fx0,fy0+fh],[fx0+fw,fy0+fh]]){for(let j=0;j<3;j++){const xx=x+(j-1)*5*sc,yy=y-j%2*4*sc,s=(3+j)*sc,col=['#5ae0ff','#c06aff','#7aff9a'][j];c.fillStyle='#e0d8f0';c.fillRect(xx-.8*sc,yy,1.6*sc,s*1.3);E(c,xx,yy,s,s*.6);c.fillStyle=col;c.fill();glows.push([xx,yy,s*5,col])}}}
 else{rr(c,fx0,fy0,fw,fh,10*sc,'#4a403a','#140c0a',2.5);const bw=26*sc;
  for(const [x0,y0,len,horiz] of [[fx0,fy0,fw,1],[fx0,fy0+fh-10*sc,fw,1],[fx0,fy0,fh,0],[fx0+fw-10*sc,fy0,fh,0]])for(let s=0;s<len-2;s+=bw){const L2=Math.min(bw-2*sc,len-s-2*sc);const x=horiz?x0+s+1*sc:x0+1*sc,y=horiz?y0+1*sc:y0+s+1*sc,ww=horiz?L2:8*sc,hh=horiz?8*sc:L2;rr(c,x,y,ww,hh,2*sc,cshift('#5e524a',(r(s+x0)-.5)*.2),'rgba(40,36,30,.6)',1)}}
 // --- casillas: tablero de ajedrez orgánico con bisel interior ---
 rr(c,bx-3*sc,by-3*sc,w+6*sc,h+6*sc,8*sc,B.soil);
 for(let i=0;i<COLS*ROWS;i++){const [x,y]=slotXY(b,i),row=Math.floor(i/COLS),x0=x-cs/2+3.5*sc,y0=y-cs/2+3.5*sc,s=cs-7*sc,rad=11*sc,base=cshift((i+row)%2?B.cellA:B.cellB,(r(i+40)-.5)*.08);
  RRp(c,x0,y0,s,s,rad);c.fillStyle=LG(c,0,y0,0,y0+s,[cshift(base,.07),base,cshift(base,-.08)]);c.fill();
  c.save();RRp(c,x0,y0,s,s,rad);c.clip();
  if(bio===0){c.beginPath();for(let j=0;j<34;j++){const gx=x0+r(i*50+j)*s,gy=y0+r(i*50+j+25)*s;c.moveTo(gx,gy);c.lineTo(gx+(r(i+j)-.5)*3*sc,gy-(3+r(i*3+j)*4)*sc)}c.strokeStyle='rgba(30,80,20,.35)';c.lineWidth=1.1*sc;c.stroke()}
  else if(bio===1){for(let j=0;j<10;j++){circ(c,x0+r(i*30+j)*s,y0+r(i*30+j+9)*s,(.8+r(j+i)*1.4)*sc,'rgba(140,220,180,.18)')}}
  else{c.beginPath();c.moveTo(x0+s*.1,y0+s*(.3+r(i)*.3));c.lineTo(x0+s*.4,y0+s*.5);c.lineTo(x0+s*.55,y0+s*(.7+r(i+5)*.2));c.strokeStyle='rgba(90,60,40,.3)';c.lineWidth=1;c.stroke()}
  c.lineWidth=8*sc;c.strokeStyle=LG(c,x0,y0,x0+s,y0+s,['rgba(255,255,255,.24)','rgba(0,0,0,0)','rgba(0,0,0,.32)']);RRp(c,x0,y0,s,s,rad);c.stroke();c.fillStyle=cshift(base,-.4);c.fillRect(x0,y0+s-6*sc,s,6*sc);c.fillStyle='rgba(255,255,255,.2)';c.fillRect(x0,y0+s-6*sc,s,1.2*sc);c.restore();
  RRp(c,x0,y0,s,s,rad);c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=1.3*sc;c.stroke();
  // detalle decorativo en una esquina (no estorba a las plantas)
  if(r(i+700)<.45){const cx2=x0+(r(i+710)<.5?9*sc:s-9*sc),cy2=y0+s-9*sc;
   if(bio===0){for(let j=0;j<5;j++){const a=j/5*Math.PI*2;circ(c,cx2+Math.cos(a)*2.2*sc,cy2+Math.sin(a)*2.2*sc,1.7*sc,['#ffffff','#ffd23f','#ff9ac0'][i%3])}circ(c,cx2,cy2,1.2*sc,'#ffb020')}
   else if(bio===1){circ(c,cx2,cy2,2*sc,'#7aff9a');glows.push([cx2,cy2,9*sc,'#7aff9a'])}
   else{circ(c,cx2,cy2,1.8*sc,'#ff7a2a');glows.push([cx2,cy2,8*sc,'#ff6a1a'])}}}
 // --- madriguera de entrada (abajo a la izquierda) y casita de destino (abajo a la derecha) ---
 const [sx,sy]=b.pts[0],hx=sx,hy=sy+cs*.06,rx=cs*.34,ry=cs*.2;
 if(bio===0){VOL(c,cc=>{E(cc,hx,hy+2*sc,rx*1.45,ry*1.5)},'#8a5a30',{bb:[hx-rx*1.45,hy-ry*1.5,hx+rx*1.45,hy+ry*1.5],light:'#c8945a',dark:'#3a200a'});for(let j=0;j<8;j++){const a=j/8*Math.PI*2;E(c,hx+Math.cos(a)*rx*1.25,hy+Math.sin(a)*ry*1.3,2.4*sc,1.8*sc);c.fillStyle='#6a4428';c.fill()}}
 else if(bio===1){for(let j=0;j<7;j++){const a=j/7*Math.PI*2;c.beginPath();c.moveTo(hx+Math.cos(a)*rx*.9,hy+Math.sin(a)*ry*.9);c.quadraticCurveTo(hx+Math.cos(a+.3)*rx*1.5,hy+Math.sin(a+.3)*ry*1.6,hx+Math.cos(a+.5)*rx*1.8,hy+Math.sin(a+.5)*ry*1.9);c.strokeStyle='#120a08';c.lineWidth=5*sc;c.stroke();c.strokeStyle='#4a3424';c.lineWidth=3*sc;c.stroke()}}
 else{VOL(c,cc=>{E(cc,hx,hy,rx*1.35,ry*1.45)},'#4a3a32',{bb:[hx-rx*1.35,hy-ry*1.45,hx+rx*1.35,hy+ry*1.45],light:'#8a6a58',dark:'#140a06'});for(let j=1;j<4;j++){c.beginPath();c.ellipse(hx,hy,rx*(1+j*.1),ry*(1+j*.12),0,0,7);c.strokeStyle='rgba(50,25,8,.35)';c.lineWidth=1;c.stroke()}}
 E(c,hx,hy,rx,ry);c.fillStyle=RG(c,hx,hy,rx,['#000000','#0a0604',bio===1?'#2a1a3a':bio===2?'#7a2a04':'#2a1608'],hx,hy);c.fill();
 const [ex,ey]=b.pts[3],hs=cs*.24,col=['#c84a3a','#5a4a8a','#c8702a'][bio];
 c.save();c.translate(ex,ey+cs*.02);rr(c,-hs*1.05,-hs*.2,hs*2.1,hs*1.25,3*sc,'rgba(0,0,0,.3)');VOL(c,cc=>{RRp(cc,-hs,-hs*.35,hs*2,hs*1.3,3*sc)},'#e8d8b8',{bb:[-hs,-hs*.35,hs,hs*.95],light:'#ffffff',dark:'#8a7a5a'});
 VOL(c,cc=>{cc.beginPath();cc.moveTo(-hs*1.25,-hs*.3);cc.lineTo(0,-hs*1.3);cc.lineTo(hs*1.25,-hs*.3);cc.closePath()},col,{bb:[-hs*1.25,-hs*1.3,hs*1.25,-hs*.3],light:cshift(col,.4),dark:cshift(col,-.5)});
 VOL(c,cc=>{RRp(cc,-hs*.35,hs*.1,hs*.7,hs*.85,hs*.3)},'#6a4220',{bb:[-hs*.35,hs*.1,hs*.35,hs*.95],dark:'#2a1608'});
 c.beginPath();c.moveTo(0,-hs*.85);c.bezierCurveTo(-hs*.32,-hs*1.05,-hs*.3,-hs*.55,0,-hs*.42);c.bezierCurveTo(hs*.3,-hs*.55,hs*.32,-hs*1.05,0,-hs*.85);c.fillStyle='#ff4a5a';c.fill();c.restore()}
// Detalles animados del tablero: vórtice de la madriguera y brillos del bioma.
function boardLive(c,b,bio,t,Ly){const sc=b.cs/96,B=BIO[bio],[sx,sy]=b.pts[0],hx=sx,hy=sy+b.cs*.06,rx=b.cs*.34,ry=b.cs*.2;
 c.save();c.translate(hx,hy);c.scale(1,ry/rx);c.globalCompositeOperation='lighter';
 c.globalAlpha=.55+.2*Math.sin(t*3);c.drawImage(glowSprite(B.vcol),-rx*1.3,-rx*1.3,rx*2.6,rx*2.6);c.globalAlpha=1;
 for(let i=0;i<3;i++){c.save();c.rotate(t*(1.8+i*.8)*(i%2?-1:1));c.beginPath();c.arc(0,0,rx*(.82-i*.22),0,Math.PI*1.25);c.strokeStyle=`rgba(${B.vort},${.6-i*.13})`;c.lineWidth=(4.2-i)*sc;c.stroke();c.beginPath();c.arc(0,0,rx*(.82-i*.22),Math.PI*1.5,Math.PI*1.8);c.stroke();c.restore()}
 for(let i=0;i<9;i++){const p=(t*.55+i/9)%1,a=i*2.4+t*2.2+p*4,rr2=rx*(.15+p*1.05);c.globalAlpha=1-p;circ(c,Math.cos(a)*rr2,Math.sin(a)*rr2-p*rx*.5,(2.6-p*1.6)*sc,`rgb(${B.vort})`)}
 c.restore();
 if(Ly&&Ly.glows.length){c.save();c.globalCompositeOperation='lighter';Ly.glows.forEach(([x,y,r2,col],i)=>{c.globalAlpha=.35+.25*Math.sin(t*2+i*1.3);c.drawImage(glowSprite(col),x-r2,y-r2,r2*2,r2*2)});c.restore()}}

// Versión reducida de una imagen grande para el tamaño al que se ve (evita reducirla en cada cuadro).
const MIP=new WeakMap();
function mip(img,cw,ch,dens){dens=Math.max(.5,Math.ceil(dens*4)/4);let m=MIP.get(img);if(!m){m={};MIP.set(img,m)}if(m[dens])return m[dens];const w=Math.max(1,Math.round(cw*dens)),h=Math.max(1,Math.round(ch*dens));if(w>=img.width*.8)return m[dens]=img;
 let src=img,sw=img.width,sh=img.height;while(sw/2>w){const c2=document.createElement('canvas');c2.width=Math.round(sw/2);c2.height=Math.round(sh/2);c2.getContext('2d').drawImage(src,0,0,c2.width,c2.height);src=c2;sw=c2.width;sh=c2.height}
 const c3=document.createElement('canvas');c3.width=w;c3.height=h;const q=c3.getContext('2d');q.imageSmoothingQuality='high';q.drawImage(src,0,0,w,h);return m[dens]=c3}
// ===================== INSECTOS EN VISTA 3/4 (los 12 tipos) =====================
// Mirando a la derecha, suelo en y=0. Patas del lado lejano detrás del cuerpo (más altas y oscuras), las cercanas delante.
// Cada tipo se dibuja una vez en una tira de 12 cuadros (caminata, mandíbulas, alas) con contorno; en partida solo se copia un cuadro.
function b3Leg(c,hips,hy,len,p,near,col){const fy0=near?2.5:-4;c.beginPath();hips.forEach((hx,i)=>{const q=p+i*Math.PI+(near?0:Math.PI),sw=Math.sin(q)*len*.35,lift=Math.max(0,Math.cos(q))*len*.22,sp=i-(hips.length-1)/2,kx=hx+sp*len*.5+sw*.4,ky=hy-len*.32-(near?0:2),fx=hx+sp*len*.85+sw,fy=fy0-lift;c.moveTo(hx,hy+(near?1.5:-1.5));c.lineTo(kx,ky);c.lineTo(fx,fy)});
 c.strokeStyle='#120804';c.lineWidth=near?4:3.2;c.stroke();c.strokeStyle=near?col:cshift(col,-.35);c.lineWidth=near?2.2:1.7;c.stroke()}
function b3LegFly(c,hips,hy,len,p,near,col){c.beginPath();hips.forEach((hx,i)=>{const sp=i-(hips.length-1)/2,sw=Math.sin(p+i*1.3)*2.5,kx=hx+sp*len*.35+sw,ky=hy+len*.35,fx=hx+sp*len*.6+sw*1.4,fy=hy+len*(near?.95:.82);c.moveTo(hx,hy);c.lineTo(kx,ky);c.lineTo(fx,fy)});
 c.strokeStyle='#120804';c.lineWidth=near?2.6:2.2;c.stroke();c.strokeStyle=near?col:cshift(col,-.35);c.lineWidth=near?1.2:1;c.stroke()}
// Caparazón abombado: degradado radial descentrado hacia arriba-izquierda + brillo especular.
function b3Dome(c,x,y,rx,ry,col,rot){VOL(c,cc=>{E(cc,x,y,rx,ry,rot||0)},col,{bb:[x-rx,y-ry,x+rx,y+ry],light:cshift(col,.55),dark:cshift(col,-.6),spec:[x-rx*.3,y-ry*.5,rx*.32,ry*.18,(rot||0)-.3]})}
// Ojos compuestos: el cercano grande y el lejano más chico detrás; facetas, doble brillo y ceja de enojo.
function b3Eyes(c,x,y,r,col,angry){for(const [ex,ey,er] of [[x-r*1.1,y-r*.25,r*.72],[x,y,r]]){c.save();E(c,ex,ey,er,er*.9);c.fillStyle=RG(c,ex,ey,er,[cshift(col,.5),col,cshift(col,-.7)],ex-er*.3,ey-er*.4);c.fill();c.strokeStyle='#120804';c.lineWidth=1;c.stroke();c.clip();
  for(let i=0;i<4;i++)for(let j=0;j<3;j++){E(c,ex-er*.8+i*er*.5+(j%2)*er*.25,ey-er*.6+j*er*.5,er*.12,er*.12);c.fillStyle='rgba(255,255,255,.18)';c.fill()}c.restore();
  E(c,ex-er*.35,ey-er*.4,er*.28,er*.2);c.fillStyle='#fff';c.fill();E(c,ex+er*.3,ey+er*.3,er*.1,er*.1);c.fill();
  if(angry){c.beginPath();c.moveTo(ex-er*1.1,ey-er*1.15);c.lineTo(ex+er*1.1,ey-er*.6);c.lineTo(ex+er*1.1,ey-er*.95);c.lineTo(ex-er,ey-er*1.45);c.closePath();c.fillStyle='#120804';c.fill()}}}
function b3Mand(c,x,y,sz,open,col){for(const [s,far] of [[-1,1],[1,0]]){c.save();c.translate(x-(far?2:0),y+(far?-1.5:1));c.rotate(s*(.15+open));c.beginPath();c.moveTo(-2,0);c.quadraticCurveTo(sz*.6,s*sz*.5,sz,-s*sz*.1);c.quadraticCurveTo(sz*.5,s*sz*.12,-2,s*2.2);c.closePath();c.fillStyle=far?cshift(col,-.35):col;c.fill();c.strokeStyle='#120804';c.lineWidth=1.1;c.stroke();c.restore()}}
function b3Ant(c,x,y,pts,col,club,far){c.beginPath();c.moveTo(x,y);for(const [px,py] of pts)c.lineTo(px,py);c.strokeStyle='#120804';c.lineWidth=far?2.4:3;c.stroke();const cc=far?cshift(col,-.35):col;c.strokeStyle=cc;c.lineWidth=far?1.1:1.5;c.stroke();if(club){const [px,py]=pts[pts.length-1];circ(c,px,py,far?1.6:2.2,cc)}}
function b3Wing(c,x,y,len,w,rot,col){c.save();c.translate(x,y);c.rotate(rot);E(c,len*.5,0,len*.5,w);c.fillStyle=col;c.fill();c.strokeStyle='rgba(40,60,90,.6)';c.lineWidth=1;c.stroke();c.beginPath();c.moveTo(0,0);c.lineTo(len,0);c.moveTo(len*.3,0);c.lineTo(len*.7,w*.7);c.moveTo(len*.3,0);c.lineTo(len*.7,-w*.6);c.strokeStyle='rgba(40,60,90,.3)';c.stroke();c.restore()}
function b3Crown(c,x,y){VOL(c,cc=>{cc.beginPath();cc.moveTo(x,y);cc.lineTo(x+1,y-8);cc.lineTo(x+4,y-3);cc.lineTo(x+7,y-10);cc.lineTo(x+10,y-3);cc.lineTo(x+13,y-7);cc.lineTo(x+12,y);cc.closePath()},'#ffd23f',{bb:[x,y-10,x+13,y],light:'#fffbe0',dark:'#8a5a00',lw:.8,rim:1})}
const B3={
 // Hormiga soldado
 hormiga:{sp:14,sh:1.05,draw(c,p){const ml=(Math.sin(p)+1)*.2,wb=Math.sin(p)*.06;
  b3Leg(c,[-4,1,6],-13,13,p,0,'#5a1608');b3Ant(c,13,-28,[[15,-37],[23,-41+Math.sin(p)*1.5]],'#5a1608',1,1);
  c.save();c.translate(-8,-14);c.rotate(wb);c.translate(8,14);b3Dome(c,-20,-16,12.5,10,'#c8401c',-.25);c.save();E(c,-20,-16,12.5,10,-.25);c.clip();for(const dx of [-4,4]){c.beginPath();c.ellipse(-20+dx,-16,3,11,-.25,0,7);c.strokeStyle='rgba(60,10,0,.35)';c.lineWidth=1.3;c.stroke()}c.restore();
  c.beginPath();c.moveTo(-31,-12);c.lineTo(-38,-8);c.lineTo(-30,-9);c.closePath();c.fillStyle='#2a0804';c.fill();c.restore();
  b3Dome(c,-6,-14,4.5,4,'#a8341a');b3Dome(c,2,-17,8,6.5,'#b8381a',-.15);b3Dome(c,16,-21,11,10,'#c03a1a');b3Eyes(c,21,-24,4.2,'#3a0606',1);b3Mand(c,25,-15,9,ml,'#5a1206');
  b3Ant(c,19,-29,[[23,-38],[31,-42+Math.sin(p+1)*1.5]],'#8a2e12',1,0);b3Leg(c,[-4,1,6],-13,13,p,1,'#8a2e12')}},
 // Cría: larva espinosa que avanza ondulando
 cria:{sp:8,sh:1.1,draw(c,p){const ml=(Math.sin(p*2)+1)*.15;
  for(let i=0;i<5;i++){const x=-30+i*9,h=Math.max(0,Math.sin(p-(4-i)*.9))*4,r=7+i*.35;c.fillStyle='#2a4a0a';c.fillRect(x-3,-3,2.2,3.5);c.fillRect(x+1.5,-3,2.2,3.5);
   b3Dome(c,x,-9-h,r,r*.92,'#8ad03a');E(c,x,-4-h,r*.8,r*.3);c.fillStyle='rgba(255,250,200,.3)';c.fill();
   for(const [dx,a,l] of [[-3.5,-2.15,6],[0,-1.6,8],[3.5,-1.05,6]]){const bx=x+dx,by=-9-h-r*.75,tx=bx+Math.cos(a)*l,ty=by+Math.sin(a)*l;c.beginPath();c.moveTo(bx-1.8,by+1);c.lineTo(tx,ty);c.lineTo(bx+1.8,by+1);c.closePath();c.fillStyle='#ffd23f';c.fill();c.strokeStyle='#5a3a00';c.lineWidth=.8;c.stroke();circ(c,tx,ty,1,'#e02a1a')}
   circ(c,x,-9-h,1.8,'#e85a2a')}
  const hb=Math.sin(p)*1.2;b3Dome(c,16,-12-hb,10,9,'#6ab82a');b3Eyes(c,21,-14-hb,3.3,'#c81a0a',1);b3Mand(c,24,-7-hb,5.5,ml,'#2a3a08');
  for(const s of [0,1])b3Ant(c,12+s*5,-20-hb,[[13+s*6,-27-hb],[16+s*7,-30-hb+Math.sin(p*2+s)]],'#2a4a0a',0,s===0)}},
 // Mosquito: abdomen lleno de sangre, aguijón que pica, alas que zumban
 mosquito:{sp:10,sh:.8,draw(c,p){const f=Math.sin(p*5);
  b3Wing(c,-4,-31,28,6,-2.2+f*.55,'rgba(190,210,235,.38)');b3LegFly(c,[-6,-2,2],-22,26,p,0,'#2a2a34');
  b3Dome(c,-20,-25,15,5.8,'#5a5a6a',-.3);c.save();E(c,-20,-25,15,5.8,-.3);c.clip();E(c,-21,-23,11,3.2,-.3);c.fillStyle='rgba(230,30,40,.6)';c.fill();for(let i=0;i<4;i++){c.beginPath();c.moveTo(-30+i*6,-31+i*1.6);c.lineTo(-31+i*6,-19+i*1.6);c.strokeStyle='rgba(20,20,30,.5)';c.lineWidth=1.3;c.stroke()}c.restore();
  b3Dome(c,-2,-27,8,7.5,'#4a4a58');b3Dome(c,9,-27,6.5,6,'#3a3a48');b3Eyes(c,12,-28,4.3,'#d01a1a',1);
  const jab=Math.pow(Math.max(0,Math.sin(p)),4)*5;c.beginPath();c.moveTo(14,-24);c.lineTo(30+jab,-17+jab*.2);c.strokeStyle='#120804';c.lineWidth=2.6;c.stroke();c.strokeStyle='#5a5a66';c.lineWidth=1.2;c.stroke();
  for(const s of [1,0])b3Ant(c,8+s*3,-32,[[12+s*3,-39],[18+s*4,-41+Math.sin(p*2+s)]],'#2a2a34',0,!s);
  b3Wing(c,-4,-31,28,6.5,-2.0-f*.55,'rgba(230,245,255,.5)');b3LegFly(c,[-6,-2,2],-22,26,p,1,'#4a4a56')}},
 // Mariquita acorazada: caparazón abombado con borde de metal remachado
 mariquita:{sp:11,sh:1.15,draw(c,p){const ml=(Math.sin(p*2)+1)*.16,sh=Math.sin(p)*.03;
  b3Leg(c,[-16,-8,0],-6,10,p,0,'#141418');b3Dome(c,17,-11,8.5,7.5,'#2a2a30');E(c,15,-7.5,3,2.2);c.fillStyle='#f4f0e8';c.fill();b3Eyes(c,21,-13,3.3,'#c81a0a',1);b3Mand(c,25,-8,6.5,ml,'#3a3a44');
  for(const s of [1,0])b3Ant(c,15+s*3,-18,[[18+s*4,-25+Math.sin(p*2+s)]],'#141418',1,!s);
  c.save();c.translate(-7,-6);c.rotate(sh);c.translate(7,6);const dome=cc=>{cc.beginPath();cc.moveTo(-29,-6);cc.bezierCurveTo(-31,-32,13,-37,15,-7);cc.quadraticCurveTo(-7,-1,-29,-6);cc.closePath()};
  VOL(c,dome,'#d82a1a',{bb:[-31,-34,15,-1],light:'#ffa08a',dark:'#5a0804',spec:[-15,-25,9,3.6,-.3]});
  c.save();dome(c);c.clip();for(const [x,y,r] of [[-18,-21,4.4],[-5,-26,3.8],[-21,-11,3.6],[5,-16,4],[-8,-13,3.2],[-29,-18,3]]){E(c,x,y,r,r*.8);c.fillStyle='#1a0a0a';c.fill();E(c,x-1,y-1.2,r*.35,r*.2);c.fillStyle='rgba(255,255,255,.35)';c.fill()}c.beginPath();c.moveTo(-9,-33);c.quadraticCurveTo(-4,-18,-7,-2);c.strokeStyle='rgba(40,0,0,.55)';c.lineWidth=1.4;c.stroke();c.restore();
  c.beginPath();c.moveTo(-29,-6);c.quadraticCurveTo(-7,-1,15,-7);c.strokeStyle='#22140c';c.lineWidth=4.8;c.stroke();c.strokeStyle=LG(c,-29,0,15,0,['#8a90a0','#eef0f8','#8a90a0']);c.lineWidth=3;c.stroke();for(let i=0;i<5;i++)circ(c,-24+i*9,-4.6-Math.sin(i/4*Math.PI)*1.2,1,'#5a5a6a');c.restore();
  b3Leg(c,[-16,-8,0],-6,10,p,1,'#2a2a34')}},
 // Escarabajo: élitros de bronce con brillo metálico y grandes mandíbulas
 escarabajo:{sp:9,sh:1.3,draw(c,p){const ml=(Math.sin(p*2)+1)*.2;b3Leg(c,[-14,-5,4],-8,13,p,0,'#2a1a08');
  const el=cc=>{cc.beginPath();cc.moveTo(-32,-9);cc.bezierCurveTo(-34,-34,6,-38,8,-12);cc.lineTo(8,-7);cc.quadraticCurveTo(-12,-2,-32,-9);cc.closePath()};
  VOL(c,el,'#6a4a1a',{bb:[-34,-36,8,-2],light:'#e8c070',dark:'#1e1206',spec:[-18,-27,10,3,-.25]});
  c.save();el(c);c.clip();c.beginPath();c.moveTo(-12,-35);c.quadraticCurveTo(-8,-20,-12,-3);c.strokeStyle='rgba(20,10,0,.6)';c.lineWidth=1.6;c.stroke();for(let i=0;i<4;i++){c.beginPath();c.ellipse(-12,-18,6+i*6,16+i*3,0,Math.PI*.6,Math.PI*1.4);c.strokeStyle='rgba(255,220,140,.14)';c.lineWidth=1;c.stroke()}c.restore();
  b3Dome(c,12,-15,9,8,'#5a3a14');b3Dome(c,22,-13,6.5,6,'#4a3010');b3Eyes(c,24,-15,2.8,'#ff8a1a',1);b3Mand(c,27,-10,11,ml,'#3a2208');
  for(const s of [1,0])b3Ant(c,21+s*2,-19,[[26+s*3,-24],[30+s*4,-24+Math.sin(p*2+s)]],'#2a1a08',1,!s);b3Leg(c,[-14,-5,4],-8,13,p,1,'#4a3010')}},
 // Cucaracha: caparazón plano y brillante, antenas larguísimas, patas con espinas
 cucaracha:{sp:16,sh:1.25,draw(c,p){b3Leg(c,[-12,-4,4],-8,15,p,0,'#3a1e08');
  for(const s of [1,0])b3Ant(c,22+s*2,-14,[[34+s*3,-24],[46+s*2,-20+Math.sin(p*2+s)*3],[52,-12+Math.sin(p+s)*2]],'#4a2a10',0,!s);
  const sh=cc=>{cc.beginPath();cc.ellipse(-8,-12,26,9.5,-.06,0,Math.PI*2)};VOL(c,sh,'#7a4218',{bb:[-34,-22,18,-2],light:'#e8a060',dark:'#1e0c02',spec:[-14,-18,12,2.6,-.1]});
  c.save();sh(c);c.clip();c.beginPath();c.moveTo(-34,-12);c.lineTo(18,-12);c.strokeStyle='rgba(30,12,0,.5)';c.lineWidth=1.2;c.stroke();c.fillStyle='rgba(255,230,180,.15)';c.fillRect(-30,-21,40,4);c.restore();
  b3Dome(c,17,-12,8,6.5,'#a8642a');E(c,17,-12,5,3.5);c.fillStyle='rgba(40,20,0,.35)';c.fill();b3Dome(c,24,-10,5.5,5,'#5a3010');b3Eyes(c,26,-12,2.6,'#2a1006',1);b3Mand(c,28,-7,5,(Math.sin(p*2)+1)*.15,'#3a1e08');
  b3Leg(c,[-12,-4,4],-8,15,p,1,'#6a3a14')}},
 // JEFE · Escarabajo Rinoceronte: caparazón violeta abombado y cuerno enorme
 rinoceronte:{sp:7,sh:1.4,draw(c,p){const ml=(Math.sin(p*2)+1)*.12;b3Leg(c,[-16,-6,4],-8,14,p,0,'#140a1a');
  const el=cc=>{cc.beginPath();cc.moveTo(-34,-9);cc.bezierCurveTo(-36,-38,4,-42,8,-12);cc.lineTo(8,-7);cc.quadraticCurveTo(-13,-1,-34,-9);cc.closePath()};
  VOL(c,el,'#3a1a4a',{bb:[-36,-40,8,-1],light:'#b07ad8',dark:'#0a0412',spec:[-20,-30,11,3.4,-.25]});c.save();el(c);c.clip();c.beginPath();c.moveTo(-13,-40);c.quadraticCurveTo(-9,-22,-13,-2);c.strokeStyle='rgba(10,0,20,.6)';c.lineWidth=1.8;c.stroke();c.restore();
  b3Dome(c,13,-17,11,10,'#2a1236');VOL(c,cc=>{cc.beginPath();cc.moveTo(8,-24);cc.quadraticCurveTo(16,-40,26,-42);cc.quadraticCurveTo(20,-34,18,-22);cc.closePath()},'#4a2a5a',{bb:[8,-42,26,-22],light:'#c8a0e8',dark:'#100618',lw:1});
  b3Dome(c,25,-12,7.5,7,'#22102e');b3Eyes(c,27,-14,3,'#ff3a1a',1);
  VOL(c,cc=>{cc.beginPath();cc.moveTo(28,-10);cc.bezierCurveTo(42,-14,48,-30,40,-46);cc.bezierCurveTo(44,-30,36,-18,30,-16);cc.closePath()},'#e8d8b0',{bb:[28,-46,48,-10],light:'#ffffff',dark:'#7a6a40',lw:1,rim:2});
  b3Mand(c,31,-7,6,ml,'#22102e');b3Leg(c,[-16,-6,4],-8,14,p,1,'#3a1a4a')}},
 // JEFE · Reina Avispa: abdomen a rayas con aguijón, corona y cuatro alas
 avispa:{sp:8,sh:1,draw(c,p){const f=Math.sin(p*5);b3Wing(c,-2,-34,30,7,-2.25+f*.5,'rgba(200,215,240,.38)');b3Wing(c,0,-33,22,5,-1.8+f*.5,'rgba(200,215,240,.32)');b3LegFly(c,[-4,0,4],-24,22,p,0,'#2a1a08');
  const ab=cc=>{cc.beginPath();cc.ellipse(-22,-22,16,10,-.35,0,Math.PI*2)};VOL(c,ab,'#ffc81a',{bb:[-38,-32,-6,-12],light:'#fff4a0',dark:'#8a5a00',spec:[-25,-28,6,2.4,-.35]});
  c.save();ab(c);c.clip();for(let i=0;i<3;i++){c.beginPath();c.ellipse(-30+i*8,-22,2.6,12,-.35,0,7);c.fillStyle='#1a1008';c.fill()}c.restore();
  c.beginPath();c.moveTo(-36,-15);c.lineTo(-45,-9);c.lineTo(-35,-12);c.closePath();c.fillStyle='#1a1008';c.fill();
  b3Dome(c,-3,-25,7.5,7,'#2a1a08');c.save();E(c,-3,-25,7.5,7);c.clip();c.fillStyle='rgba(255,200,30,.6)';c.fillRect(-8,-22,10,3);c.restore();
  b3Dome(c,10,-26,7,6.5,'#ffc81a');b3Eyes(c,13,-27,3.8,'#3a1a00',1);b3Mand(c,16,-21,6,(Math.sin(p*2)+1)*.18,'#2a1a08');b3Crown(c,4,-31);
  for(const s of [1,0])b3Ant(c,9+s*3,-31,[[12+s*3,-38],[18+s*3,-40+Math.sin(p*2+s)]],'#2a1a08',1,!s);
  b3Wing(c,-2,-34,30,7.5,-2.0-f*.5,'rgba(230,240,255,.5)');b3LegFly(c,[-4,0,4],-24,22,p,1,'#4a3010')}},
 // JEFE · Mantis Segadora: tórax erguido, cabeza triangular y guadañas que se balancean
 mantis:{sp:6,sh:1.2,draw(c,p){const sw=Math.sin(p)*.15;b3Leg(c,[-10,-4],-14,16,p,0,'#2a6a1a');
  const ab=cc=>{cc.beginPath();cc.moveTo(-6,-16);cc.bezierCurveTo(-24,-26,-42,-20,-44,-12);cc.bezierCurveTo(-36,-8,-18,-8,-6,-12);cc.closePath()};VOL(c,ab,'#5ab83a',{bb:[-44,-26,-6,-8],light:'#c8ff9a',dark:'#1e4a0e',spec:[-28,-20,7,2,-.1]});
  c.save();ab(c);c.clip();for(let i=0;i<4;i++){c.beginPath();c.moveTo(-8,-13);c.lineTo(-42+i*4,-14-i*2.5);c.strokeStyle='rgba(20,60,10,.35)';c.lineWidth=1;c.stroke()}c.restore();
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-8,-12);cc.quadraticCurveTo(2,-24,10,-38);cc.lineTo(15,-36);cc.quadraticCurveTo(6,-20,0,-10);cc.closePath()},'#4aa82a',{bb:[-8,-38,15,-10],light:'#b8f08a',dark:'#1a4a0a',lw:1});
  VOL(c,cc=>{cc.beginPath();cc.moveTo(4,-44);cc.lineTo(24,-42);cc.lineTo(16,-30);cc.closePath()},'#6ac84a',{bb:[4,-44,24,-30],light:'#d8ffa0',dark:'#1e4a0e',lw:1});b3Eyes(c,9,-42,3.6,'#ff3a1a',1);
  for(const s of [1,0])b3Ant(c,11+s*3,-44,[[16+s*3,-54],[24+s*3,-58+Math.sin(p*2+s)]],'#2a6a1a',0,!s);
  for(const s of [0,1]){c.save();c.translate(10,-32);c.rotate(-.4+sw*(s?1:-1));VOL(c,cc=>{cc.beginPath();cc.moveTo(0,0);cc.lineTo(16,6);cc.lineTo(14,10);cc.lineTo(-1,4);cc.closePath()},s?'#6ac84a':'#3a8a1a',{bb:[-1,0,16,10],lw:.9});
   VOL(c,cc=>{cc.beginPath();cc.moveTo(14,6);cc.quadraticCurveTo(26,-4,30,-18);cc.quadraticCurveTo(24,-6,16,10);cc.closePath()},s?'#d8ffb0':'#8ac06a',{bb:[14,-18,30,10],light:'#ffffff',dark:'#3a6a1a',lw:.9,rim:1.2});
   for(let i=0;i<3;i++){c.beginPath();c.moveTo(18+i*3.5,3-i*5);c.lineTo(15+i*3.5,1-i*5);c.strokeStyle='#1a3a08';c.lineWidth=1;c.stroke()}c.restore()}
  b3Leg(c,[-10,-4],-14,16,p,1,'#4aa82a')}},
 // JEFE · Ciempiés Acorazado: nueve placas que ondulan, cada una con su par de patas, y forcípulas
 ciempies:{sp:9,sh:1.5,draw(c,p){const n=9;for(let i=0;i<n;i++){const x=-40+i*8.2,y=-9+Math.sin(p-i*.7)*2,lp=p+i*1.2;
   for(const near of [0,1]){c.beginPath();c.moveTo(x,y+2);c.lineTo(x+Math.sin(lp+near*Math.PI)*3,near?3:-3);c.strokeStyle='#120804';c.lineWidth=near?3:2.4;c.stroke();c.strokeStyle=near?'#c87a2a':'#8a4a14';c.lineWidth=near?1.6:1.2;c.stroke()}
   b3Dome(c,x,y-1,6.5,6,i%2?'#7a3a1a':'#8a4a20');c.beginPath();c.moveTo(x-5,y-4);c.lineTo(x+5,y-4);c.strokeStyle='rgba(255,200,140,.25)';c.lineWidth=1;c.stroke()}
  const hx=36,hy=-10+Math.sin(p-n*.7)*2;b3Dome(c,hx,hy,7.5,6.5,'#5a2a10');b3Eyes(c,hx+3,hy-2,2.6,'#ff3a1a',1);b3Mand(c,hx+6,hy+3,7,(Math.sin(p*2)+1)*.2,'#e8c080');
  for(const s of [1,0])b3Ant(c,hx+1+s*2,hy-5,[[hx+8+s*2,hy-16],[hx+16,hy-20+Math.sin(p*2+s)*2]],'#5a2a10',0,!s)}},
 // JEFE · Polilla Sombra: cuerpo peludo, alas grandes con ojos falsos y antenas plumosas
 polilla:{sp:6,sh:1.2,draw(c,p){const f=Math.sin(p*3);
  const wing=near=>{c.save();c.translate(-4,-30);c.rotate((near?-1.7:-2.1)+f*(near?.45:.35));const col=near?'#8a7ab0':'#5a4a80';VOL(c,cc=>{cc.beginPath();cc.moveTo(0,0);cc.bezierCurveTo(10,-14,38,-16,40,-2);cc.bezierCurveTo(36,10,14,12,0,0);cc.closePath()},col,{bb:[0,-16,40,12],light:cshift(col,.5),dark:cshift(col,-.6),lw:1});
   E(c,24,-3,6,5);c.fillStyle='#f0e0a0';c.fill();E(c,24,-3,3.2,2.8);c.fillStyle='#1a1028';c.fill();E(c,23,-4,1,.8);c.fillStyle='#fff';c.fill();c.restore()};
  wing(0);b3LegFly(c,[-4,0,4],-22,18,p,0,'#3a2a4a');
  b3Dome(c,-16,-24,13,8,'#6a5a7a',-.25);c.save();E(c,-16,-24,13,8,-.25);c.clip();for(let i=0;i<4;i++){c.beginPath();c.ellipse(-24+i*6,-24,2,9,-.25,0,7);c.strokeStyle='rgba(30,20,40,.4)';c.lineWidth=1.2;c.stroke()}c.restore();
  pCloudVol(c,[[-1,-28,7],[4,-30,6],[1,-24,6]],'#b8a8c8','#ffffff','#5a4a6a');b3Dome(c,10,-27,6,5.5,'#5a4a6a');b3Eyes(c,13,-28,3.4,'#ffd23f',1);
  for(const s of [1,0]){c.save();c.translate(10+s*2,-32);c.rotate(-1.1+s*.25);c.beginPath();c.moveTo(0,0);c.lineTo(16,0);for(let i=1;i<7;i++){c.moveTo(i*2.2,0);c.lineTo(i*2.2+2,-3);c.moveTo(i*2.2,0);c.lineTo(i*2.2+2,3)}c.strokeStyle=s?'#c8b8d8':'#8a7aa0';c.lineWidth=1.2;c.stroke();c.restore()}
  wing(1);b3LegFly(c,[-4,0,4],-22,18,p,1,'#5a4a6a')}},
 // JEFE · Termita Reina: abdomen enorme y pálido que late, cabecita con corona
 termita:{sp:5,sh:1.4,draw(c,p){const pul=Math.sin(p)*.6;b3Leg(c,[8,13,18],-8,11,p,0,'#5a3a14');
  const ab=cc=>{cc.beginPath();cc.ellipse(-16,-15,24+pul,14+pul*.6,-.05,0,Math.PI*2)};VOL(c,ab,'#f0dcc0',{bb:[-41,-30,9,0],light:'#ffffff',dark:'#9a7a58',spec:[-24,-23,9,3.4,-.1]});
  c.save();ab(c);c.clip();for(let i=0;i<6;i++){c.beginPath();c.ellipse(-36+i*8,-15,2.4,16,0,0,7);c.fillStyle='rgba(150,100,50,.35)';c.fill()}c.restore();
  b3Dome(c,12,-13,7,6,'#a8742a');b3Dome(c,22,-14,7.5,7,'#8a5a1a');b3Eyes(c,25,-16,2.8,'#2a1006',1);b3Mand(c,28,-11,8,(Math.sin(p*2)+1)*.2,'#4a2a08');b3Crown(c,16,-19);
  for(const s of [1,0])b3Ant(c,21+s*3,-20,[[25+s*3,-30],[31+s*3,-33+Math.sin(p*2+s)]],'#5a3a14',0,!s);b3Leg(c,[8,13,18],-8,11,p,1,'#8a5a1a')}}};
const B3F={},B3S={};
function b3Strip(k,tv,dens){dens=Math.max(1,Math.ceil(dens*2)/2);const key=k+tv+dens;if(B3F[key])return B3F[key];
 if(tv!=='n'){const base=b3Strip(k,'n',dens),cv2=document.createElement('canvas');cv2.width=base.cv.width;cv2.height=base.cv.height;const q=cv2.getContext('2d');if(tv==='h'){q.drawImage(base.cv,0,0);q.globalCompositeOperation='source-in';q.fillStyle='#ffffff';q.fillRect(0,0,cv2.width,cv2.height)}else{q.filter=TINTF[tv];q.drawImage(base.cv,0,0)}return B3F[key]={cv:cv2,cw:base.cw,ch:base.ch,N:base.N}}
 const D=B3[k],N=12,cw=Math.ceil(110*dens),ch=Math.ceil(90*dens),cv2=document.createElement('canvas');cv2.width=cw*N;cv2.height=ch;const c=cv2.getContext('2d');c.lineJoin='round';c.lineCap='round';
 for(let f=0;f<N;f++){const ph=f/N*Math.PI*2;c.save();c.beginPath();c.rect(f*cw,0,cw,ch);c.clip();c.translate(f*cw,0);c.scale(cw/110,ch/90);c.translate(55,70);D.draw(c,ph);c.restore()}
 return B3F[key]={cv:avOutline(cv2,1.6*dens),cw,ch,N}}
function b3Snap(k){if(B3S[k])return B3S[k];const st=b3Strip(k,'n',2),cv2=document.createElement('canvas');cv2.width=st.cw;cv2.height=st.ch;cv2.getContext('2d').drawImage(st.cv,0,0,st.cw,st.ch,0,0,st.cw,st.ch);return B3S[k]={img:cv2,cw:110,ch:90,ox:55,oy:70}}
function drawBug3(c,k,x,y,s,t,ang,b){const D=B3[k],S=s*.78;let face=1;const cx2=Math.cos(ang||0);if(b){if(Math.abs(cx2)>.3)b.face=cx2<0?-1:1;face=b.face||1}else face=cx2<0?-1:1;
 const tv=b&&b.hit>0?'h':b&&b.slowT>0?'s':b&&b.pT>0?'p':'n',ph=t*D.sp;
 c.save();c.translate(x,y+9*s);if(!NOSH){E(c,0,0,15*s*D.sh,4.5*s);c.fillStyle='rgba(0,0,0,.3)';c.fill()}
 c.scale(S*face,S);if(!BUGS[k].fly)c.translate(0,-Math.abs(Math.sin(ph))*1.6);
 const st=b3Strip(k,tv,S*DPR*1.1),fi=Math.floor((((ph/(Math.PI*2))%1)+1)%1*st.N);c.drawImage(st.cv,fi*st.cw,0,st.cw,st.ch,-55,-70,110,90);c.restore()}
// ===================== ENEMIGOS NUEVOS, SEMIJEFES Y JEFES (partidas v:7) =====================
// Arte en vista 3/4 (mismas piezas que el resto) + personalidad: cada insecto dice sus frases en globitos.
function b3Spider(c,p,body,legCol,len,near){for(let i=0;i<4;i++){const hx=-6+i*5,q=p+i*1.7+(near?Math.PI:0),sw=Math.sin(q)*4,up=Math.max(0,Math.cos(q))*3,sp=i-1.5,kx=hx+sp*len*.45+sw*.4,ky=-body-len*.55-(near?0:3),fx=hx+sp*len*.95+sw,fy=(near?2.5:-4)-up;
 c.beginPath();c.moveTo(hx,-body+(near?2:-2));c.lineTo(kx,ky);c.lineTo(fx,fy);c.strokeStyle='#100604';c.lineWidth=near?4.6:3.8;c.stroke();c.strokeStyle=near?legCol:cshift(legCol,-.35);c.lineWidth=near?2.6:2;c.stroke()}}
Object.assign(B3,{
 // Pulgón Glotón: diminuto, redondo y siempre comiendo
 pulgon:{sp:15,sh:.8,draw(c,p){b3Leg(c,[-8,-3,2],-5,7,p,0,'#2a5a14');b3Dome(c,-5,-9,10,7.5,'#8ad04a');E(c,-7,-12,4,2.4);c.fillStyle='rgba(255,255,255,.35)';c.fill();
  b3Dome(c,8,-10,5.5,5,'#6ab83a');b3Eyes(c,10,-11,2.6,'#1a3a08',0);leafHQ(c,13,-7,8,.4+Math.sin(p*2)*.25,'#4a9a2a','#1a4a0a');b3Ant(c,7,-14,[[9,-20],[13,-22+Math.sin(p)]],'#2a5a14',1,0);b3Leg(c,[-8,-3,2],-5,7,p,1,'#3a7a1a')}},
 // Grillo Saltarín: patas traseras enormes, alas de músico y antenas larguísimas
 grillo:{sp:12,sh:1,draw(c,p){const cr=Math.max(0,Math.sin(p))*2;b3Leg(c,[2,6],-10,10,p,0,'#3a2a10');
  c.beginPath();c.moveTo(-6,-12);c.lineTo(-18,-26+cr);c.lineTo(-27,0);c.strokeStyle='#120804';c.lineWidth=5;c.stroke();c.strokeStyle='#3a2a10';c.lineWidth=3;c.stroke();
  b3Dome(c,-10,-12,16,7.5,'#6a5a2a',-.1);VOL(c,cc=>{cc.beginPath();cc.ellipse(-12,-17,14,5,-.12,0,7)},'#8a7440',{bb:[-26,-22,2,-12],light:'#d8c890',dark:'#3a2a10',lw:.8});
  c.beginPath();for(let i=0;i<4;i++){c.moveTo(-24+i*6,-17);c.lineTo(-20+i*6,-20)}c.strokeStyle='rgba(40,25,5,.5)';c.lineWidth=1;c.stroke();
  b3Ant(c,13,-22,[[24,-36],[38,-41+Math.sin(p*2)*2]],'#3a2a10',0,1);b3Dome(c,6,-15,7,7,'#5a4a22');b3Dome(c,14,-16,7,7.5,'#4a3a18');b3Eyes(c,17,-18,3,'#1a1008',0);b3Mand(c,21,-13,5,(Math.sin(p*2)+1)*.15,'#2a1a08');
  b3Ant(c,16,-22,[[28,-34],[42,-37+Math.sin(p*2+1)*2]],'#5a4a22',0,0);
  c.beginPath();c.moveTo(-4,-10);c.lineTo(-16,-24+cr);c.lineTo(-22,2);c.strokeStyle='#120804';c.lineWidth=6.5;c.stroke();c.strokeStyle='#7a6a32';c.lineWidth=4;c.stroke();
  for(let i=0;i<3;i++){c.beginPath();c.moveTo(-17-i*1.5,-18+i*6);c.lineTo(-14-i*1.5,-19+i*6);c.strokeStyle='#120804';c.lineWidth=1.2;c.stroke()}b3Leg(c,[2,6],-10,10,p,1,'#5a4a22')}},
 // Caracol Blindado: concha espiral con placas de hierro remachadas; dormilón
 caracol:{sp:5,sh:1.25,draw(c,p){const st=Math.sin(p)*1.5;
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-28,0);cc.quadraticCurveTo(-30,-10,-14,-10);cc.lineTo(16+st,-10);cc.quadraticCurveTo(26+st,-12,26+st,-2);cc.lineTo(26+st,0);cc.closePath()},'#9aa880',{bb:[-30,-12,27,0],light:'#e0e8c8',dark:'#4a5a3a',lw:1});
  b3Dome(c,-6,-22,17,16,'#a86a3a');c.beginPath();for(let a=0;a<13;a+=.25){const r=1+a*1.15;c.lineTo(-6+Math.cos(a)*r,-22+Math.sin(a)*r)}c.strokeStyle='rgba(60,25,5,.6)';c.lineWidth=1.6;c.stroke();
  c.beginPath();c.arc(-6,-22,16,Math.PI*1.05,Math.PI*1.95);c.strokeStyle='#22140c';c.lineWidth=5;c.stroke();c.strokeStyle='#c8ccd8';c.lineWidth=3;c.stroke();for(let i=0;i<5;i++){const a=Math.PI*(1.1+i*.2);circ(c,-6+Math.cos(a)*16,-22+Math.sin(a)*16,1.2,'#5a5a6a')}
  for(const s of [0,1]){const ex=24+st+s*5,ey=-24+Math.sin(p+s)*1.5;c.beginPath();c.moveTo(19+st,-9);c.quadraticCurveTo(21+st+s*4,-17,ex,ey);c.strokeStyle='#120804';c.lineWidth=3.4;c.stroke();c.strokeStyle='#8a9a70';c.lineWidth=2;c.stroke();
   E(c,ex,ey,2.8,2.8);c.fillStyle='#fff';c.fill();c.strokeStyle='#120804';c.lineWidth=.8;c.stroke();E(c,ex+.6,ey+.6,1.2,1.2);c.fillStyle='#000';c.fill();c.beginPath();c.moveTo(ex-3,ey-.5);c.lineTo(ex+3,ey-.5);c.strokeStyle='#5a6a48';c.lineWidth=1.6;c.stroke()}
  c.beginPath();c.moveTo(22+st,-5);c.quadraticCurveTo(25+st,-3,27+st,-5);c.strokeStyle='#3a4a2a';c.lineWidth=1;c.stroke()}},
 // Luciérnaga Animadora: cola que brilla y alas rápidas; anima a sus compañeros
 luciernaga:{sp:10,sh:.8,draw(c,p){const f=Math.sin(p*5);b3Wing(c,-2,-30,22,6,-2.1+f*.5,'rgba(200,220,240,.38)');b3LegFly(c,[-4,0,4],-20,14,p,0,'#2a2a1a');
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.8+.2*Math.sin(p);c.drawImage(glowSprite('#ffe94a'),-36,-38,36,36);c.restore();b3Dome(c,-16,-21,11,7,'#fff27a',-.25);
  c.save();E(c,-16,-21,11,7,-.25);c.clip();for(const dx of [-2,4]){c.fillStyle='rgba(120,90,0,.35)';c.fillRect(-16+dx,-30,2,18)}c.restore();
  b3Dome(c,-2,-24,7,6.5,'#3a3a2a');b3Dome(c,8,-24,6,5.5,'#c8402a');b3Eyes(c,11,-25,3,'#1a1a10',0);
  c.beginPath();c.moveTo(9,-20);c.quadraticCurveTo(12,-17,15,-20);c.strokeStyle='#120804';c.lineWidth=1.2;c.stroke();
  for(const s of [1,0])b3Ant(c,7+s*3,-29,[[10+s*3,-36],[16+s*3,-38+Math.sin(p*2+s)]],'#3a3a2a',1,!s);b3Wing(c,-2,-30,22,6.5,-1.9-f*.5,'rgba(230,245,255,.5)');b3LegFly(c,[-4,0,4],-20,14,p,1,'#4a4a2a')}},
 // Chinche Apestosa: escudo pentagonal y nubes verdes de mal olor; presumida
 chinche:{sp:11,sh:1.1,draw(c,p){b3Leg(c,[-10,-3,4],-7,10,p,0,'#2a3010');
  const sh=cc=>{cc.beginPath();cc.moveTo(-24,-8);cc.lineTo(-18,-24);cc.lineTo(6,-26);cc.lineTo(14,-12);cc.lineTo(2,-4);cc.lineTo(-14,-3);cc.closePath()};VOL(c,sh,'#6a8a2a',{bb:[-24,-26,14,-3],light:'#c8e070',dark:'#2a3a08',spec:[-10,-20,8,2.6,-.1]});
  c.save();sh(c);c.clip();c.beginPath();c.moveTo(-6,-26);c.lineTo(-4,-3);c.strokeStyle='rgba(30,40,5,.5)';c.lineWidth=1.4;c.stroke();for(let i=0;i<10;i++){circ(c,-20+i*3.6,-14+Math.sin(i*2)*5,.8,'rgba(30,40,5,.4)')}c.restore();
  b3Dome(c,17,-11,6.5,5.5,'#5a7a22');b3Eyes(c,19,-13,2.6,'#ff6a1a',1);c.beginPath();c.moveTo(18,-8);c.quadraticCurveTo(21,-6,24,-9);c.strokeStyle='#120804';c.lineWidth=1.2;c.stroke();
  for(const s of [1,0])b3Ant(c,16+s*2,-16,[[22+s*3,-24],[28+s*3,-24+Math.sin(p*2+s)]],'#2a3010',0,!s);
  c.save();c.globalAlpha=.5+.2*Math.sin(p*2);for(let i=0;i<3;i++)pCloud(c,[[-30-i*5,-18-i*7+Math.sin(p+i)*2,3+i]]),c.fillStyle='#9ad04a',c.fill();c.restore();b3Leg(c,[-10,-3,4],-7,10,p,1,'#4a5a1a')}},
 // Oruga Tragona: rayas de colores, boca enorme y una hoja a medio comer
 oruga:{sp:7,sh:1.2,draw(c,p){for(let i=0;i<6;i++){const x=-34+i*9,h=Math.max(0,Math.sin(p-(5-i)*.8))*4,r=7.5+i*.2;c.fillStyle='#1a1a1a';c.fillRect(x-3,-3,2.4,3.5);c.fillRect(x+1.5,-3,2.4,3.5);
   b3Dome(c,x,-9-h,r,r*.9,['#ffd23f','#2a2a2a','#5ac8ff'][i%3]);c.beginPath();c.moveTo(x-r*.7,-9-h);c.lineTo(x+r*.7,-9-h);c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1.4;c.stroke()}
  const hb=Math.sin(p*2)*1.5;leafHQ(c,26,-6,14,-.3,'#5ab83a','#1e4a14');b3Dome(c,18,-13-hb,10,9.5,'#2a2a2a');b3Eyes(c,22,-16-hb,3,'#ffd23f',0);
  const mo=(Math.sin(p*3)+1)*2;c.beginPath();c.ellipse(24,-8-hb,4.5,1.5+mo,0,0,7);c.fillStyle='#5a1414';c.fill();c.strokeStyle='#120804';c.lineWidth=1;c.stroke();
  for(const s of [0,1])b3Ant(c,14+s*5,-22-hb,[[13+s*6,-30-hb],[11+s*7,-32-hb+Math.sin(p+s)]],'#1a1a1a',1,s===0)}},
 // SEMIJEFE · Tarántula Tejedora: peluda, ocho patas y racimo de ojos rojos
 tarantula:{sp:7,sh:1.5,draw(c,p){b3Spider(c,p,10,'#6a3a1a',18,0);b3Dome(c,-14,-16,16,12,'#7a4a24',-.1);c.save();E(c,-14,-16,16,12,-.1);c.clip();c.strokeStyle='rgba(255,210,150,.35)';c.lineWidth=1;for(let i=0;i<30;i++){const a=i*2.4,r=4+(i%5)*2.4;c.beginPath();c.moveTo(-14+Math.cos(a)*r,-16+Math.sin(a)*r);c.lineTo(-14+Math.cos(a)*(r+3),-16+Math.sin(a)*(r+3));c.stroke()}c.restore();
  b3Dome(c,8,-14,10,8.5,'#5a3018');for(const [x,y,r] of [[13,-17,2.2],[9,-18.5,1.8],[16,-15,1.6],[11,-14,1.3],[6,-16,1.3]]){E(c,x,y,r,r);c.fillStyle=RG(c,x,y,r,['#ffb0a0','#e01a1a','#3a0000'],x-.5,y-.5);c.fill()}
  c.beginPath();c.moveTo(4,-21);c.lineTo(18,-19);c.strokeStyle='#120804';c.lineWidth=2;c.stroke();for(const s of [-1,1]){c.beginPath();c.moveTo(16,-9);c.quadraticCurveTo(20,-6+s*1,18,-1);c.strokeStyle='#120804';c.lineWidth=3;c.stroke();c.strokeStyle='#c8c0b0';c.lineWidth=1.6;c.stroke()}b3Spider(c,p,10,'#8a5028',18,1)}},
 // SEMIJEFE · Abejorro Guardián: peludo, con casco de bellota y escudo de cera
 abejorro:{sp:8,sh:1.1,draw(c,p){const f=Math.sin(p*5);b3Wing(c,-2,-34,26,7,-2.2+f*.5,'rgba(200,215,240,.4)');b3LegFly(c,[-6,-1,4],-22,16,p,0,'#1a1408');
  pCloudVol(c,[[-14,-24,12],[-4,-28,11],[-20,-18,9],[-8,-18,10]],'#ffcf2a','#fff4a0','#8a5a00');c.save();pCloud(c,[[-14,-24,12],[-4,-28,11],[-20,-18,9],[-8,-18,10]]);c.clip();c.fillStyle='rgba(30,20,0,.85)';c.fillRect(-20,-40,6,40);c.fillRect(-8,-40,5,40);c.restore();
  b3Dome(c,10,-26,8,7.5,'#2a2010');VOL(c,cc=>{cc.beginPath();cc.ellipse(10,-30,9,5,0,Math.PI,0);cc.closePath()},'#a87440',{bb:[1,-35,19,-30],light:'#e8c090',dark:'#3a2008',lw:.8});b3Eyes(c,14,-26,3,'#1a1008',1);
  VOL(c,cc=>{cc.beginPath();cc.moveTo(18,-22);cc.lineTo(28,-22);cc.quadraticCurveTo(28,-10,23,-6);cc.quadraticCurveTo(18,-10,18,-22);cc.closePath()},'#ffd23f',{bb:[18,-22,28,-6],light:'#fffbe0',dark:'#a86a08',lw:1});
  c.beginPath();for(let i=0;i<3;i++){const y=-19+i*4;c.moveTo(20,y);c.lineTo(26,y)}c.strokeStyle='rgba(140,90,0,.6)';c.lineWidth=.8;c.stroke();
  b3Wing(c,-2,-34,26,7.5,-2.0-f*.5,'rgba(230,240,255,.5)');b3LegFly(c,[-6,-1,4],-22,16,p,1,'#3a2a10')}},
 // SEMIJEFE · Escorpión Rojo: cola curvada con aguijón y pinzas enormes
 escorpion:{sp:8,sh:1.3,draw(c,p){b3Spider(c,p,6,'#7a1a10',12,0);const tw=Math.sin(p)*.12;
  for(let i=0;i<5;i++){const a=-.3-i*.55+tw*i,r=14,x=-18+Math.cos(a+Math.PI)*r*(i*.28),y=-10-i*6.5;b3Dome(c,-20-i*1.5+i*i*1.2,y,5.5-i*.3,5-i*.3,'#c8301a')}
  VOL(c,cc=>{cc.beginPath();cc.moveTo(-4,-40);cc.quadraticCurveTo(6,-46,8,-36);cc.quadraticCurveTo(2,-40,-2,-36);cc.closePath()},'#2a0a04',{bb:[-4,-46,8,-36],light:'#8a5a50',dark:'#000',lw:.8});
  b3Dome(c,-2,-10,16,7,'#b8281a');c.save();E(c,-2,-10,16,7);c.clip();for(let i=0;i<4;i++){c.beginPath();c.moveTo(-14+i*7,-17);c.lineTo(-14+i*7,-3);c.strokeStyle='rgba(60,0,0,.4)';c.lineWidth=1.2;c.stroke()}c.restore();
  b3Eyes(c,12,-13,2.6,'#1a0000',1);
  for(const [s,near] of [[-1,0],[1,1]]){const o=(Math.sin(p*2+s)+1)*.12;c.save();c.translate(12,-8+s*2);c.rotate(-.2+s*.15);VOL(c,cc=>{cc.beginPath();cc.moveTo(0,-2);cc.lineTo(12,-3);cc.lineTo(12,3);cc.lineTo(0,2);cc.closePath()},near?'#c8301a':'#8a1a10',{bb:[0,-3,12,3],lw:.8});
   c.translate(12,0);for(const q of [-1,1]){c.save();c.rotate(q*(.2+o));VOL(c,cc=>{cc.beginPath();cc.moveTo(0,0);cc.quadraticCurveTo(8,q*-6,14,q*-1);cc.quadraticCurveTo(7,q*-1,0,q*2);cc.closePath()},near?'#e04a2a':'#9a2a18',{bb:[0,-6,14,6],light:'#ff9a7a',dark:'#4a0a04',lw:.8});c.restore()}c.restore()}
  b3Spider(c,p,6,'#a8281a',12,1)}},
 // SEMIJEFE · Langosta Gigante: patas de salto, alas de guerra y pintura de batalla
 langosta:{sp:9,sh:1.3,draw(c,p){const cr=Math.max(0,Math.sin(p))*2;b3Leg(c,[4,9],-12,12,p,0,'#2a3a10');
  c.beginPath();c.moveTo(-6,-14);c.lineTo(-22,-32+cr);c.lineTo(-32,0);c.strokeStyle='#120804';c.lineWidth=6;c.stroke();c.strokeStyle='#3a4a14';c.lineWidth=3.6;c.stroke();
  b3Dome(c,-12,-14,20,8.5,'#6a8a2a',-.08);VOL(c,cc=>{cc.beginPath();cc.ellipse(-14,-21,18,6,-.1,0,7)},'#8aa83a',{bb:[-32,-27,4,-15],light:'#d8f08a',dark:'#2a3a08',lw:.8});
  c.save();c.beginPath();c.ellipse(-14,-21,18,6,-.1,0,7);c.clip();for(let i=0;i<6;i++){circ(c,-28+i*6,-21+Math.sin(i)*2,1.5,'rgba(60,40,0,.5)')}c.restore();
  b3Dome(c,8,-17,8,8,'#5a7a22');b3Dome(c,17,-17,8,8.5,'#4a6a1a');c.beginPath();c.moveTo(13,-21);c.lineTo(22,-19);c.moveTo(13,-15);c.lineTo(22,-14);c.strokeStyle='#e83a2a';c.lineWidth=1.8;c.stroke();
  b3Eyes(c,20,-19,3.2,'#ffd23f',1);b3Mand(c,24,-13,6,(Math.sin(p*2)+1)*.18,'#2a3a08');for(const s of [1,0])b3Ant(c,16+s*2,-24,[[22+s*3,-36],[30+s*3,-40+Math.sin(p*2+s)*2]],'#2a3a10',0,!s);
  c.beginPath();c.moveTo(-4,-12);c.lineTo(-20,-30+cr);c.lineTo(-27,2);c.strokeStyle='#120804';c.lineWidth=7;c.stroke();c.strokeStyle='#8aa83a';c.lineWidth=4.4;c.stroke();b3Leg(c,[4,9],-12,12,p,1,'#4a6a1a')}},
 // JEFE · Rey Hormiga: capa real, corona, abdomen dorado a rayas y mandíbulas enormes
 reyhormiga:{sp:9,sh:1.3,draw(c,p){const ml=(Math.sin(p)+1)*.2;b3Leg(c,[-4,1,6],-13,13,p,0,'#3a1004');
  VOL(c,cc=>{cc.beginPath();cc.moveTo(0,-22);cc.quadraticCurveTo(-24,-34,-38,-6);cc.quadraticCurveTo(-24,-10,-6,-12);cc.closePath()},'#a01a3a',{bb:[-38,-34,0,-6],light:'#ff6a8a',dark:'#3a0010',lw:1});
  c.beginPath();c.moveTo(-38,-6);c.quadraticCurveTo(-24,-10,-6,-12);c.strokeStyle='#ffd23f';c.lineWidth=2;c.stroke();
  b3Dome(c,-20,-17,13,10.5,'#8a2a10',-.25);c.save();E(c,-20,-17,13,10.5,-.25);c.clip();for(const dx of [-5,1,7]){c.fillStyle='rgba(255,200,40,.55)';c.fillRect(-20+dx,-30,2.4,28)}c.restore();
  b3Dome(c,-6,-14,4.5,4,'#7a2010');b3Dome(c,2,-18,8.5,6.8,'#8a2a10',-.15);b3Dome(c,16,-22,11.5,10.5,'#9a3010');b3Eyes(c,21,-25,4.2,'#ffcf2a',1);b3Crown(c,10,-31);
  b3Mand(c,25,-16,12,ml,'#d8a040');b3Ant(c,19,-30,[[23,-40],[31,-44+Math.sin(p)*1.5]],'#5a1a08',1,0);b3Leg(c,[-4,1,6],-13,13,p,1,'#6a2008')}},
 // JEFE · Viuda Reina: abdomen negro brillante con reloj de arena rojo, patas larguísimas y velo
 viuda:{sp:6,sh:1.5,draw(c,p){b3Spider(c,p,12,'#1a1a22',22,0);b3Dome(c,-14,-20,17,14,'#1a1a24',-.1);
  c.beginPath();c.moveTo(-18,-28);c.lineTo(-10,-28);c.lineTo(-14,-21);c.lineTo(-10,-14);c.lineTo(-18,-14);c.lineTo(-14,-21);c.closePath();c.fillStyle='#e01a2a';c.fill();
  b3Dome(c,8,-15,10,8.5,'#22222c');for(const [x,y,r] of [[13,-18,2.4],[9,-19.5,1.9],[16,-16,1.7],[6,-17,1.4],[11,-15,1.3]]){E(c,x,y,r,r);c.fillStyle=RG(c,x,y,r,['#ffb0c0','#ff1a4a','#3a0010'],x-.5,y-.5);c.fill()}
  b3Crown(c,2,-22);c.save();c.globalAlpha=.4;c.beginPath();c.moveTo(4,-22);c.quadraticCurveTo(-4,-12,2,-6);c.lineTo(10,-8);c.quadraticCurveTo(12,-16,16,-22);c.closePath();c.fillStyle='#e8e0f0';c.fill();c.restore();
  for(const s of [-1,1]){c.beginPath();c.moveTo(16,-10);c.quadraticCurveTo(20,-7+s,18,-2);c.strokeStyle='#120804';c.lineWidth=3;c.stroke();c.strokeStyle='#c8c0d8';c.lineWidth=1.6;c.stroke()}b3Spider(c,p,12,'#2a2a36',22,1)}},
 // JEFE · Gusano Abismal: anillos acorazados que emergen del suelo y boca circular llena de dientes
 gusano:{sp:5,sh:1.6,draw(c,p){for(let i=0;i<7;i++){const a=i/6,x=-38+i*9.5,y=-4-Math.sin(a*Math.PI)*22+Math.sin(p-i*.6)*2,r=9.5-Math.abs(i-3)*.4;b3Dome(c,x,y,r,r*.95,i%2?'#c87a8a':'#b86a7a');c.beginPath();c.arc(x,y,r*.85,Math.PI*1.15,Math.PI*1.85);c.strokeStyle='rgba(90,40,50,.5)';c.lineWidth=1.6;c.stroke()}
  E(c,-38,0,12,4);c.fillStyle='#4a3020';c.fill();
  const hx=30,hy=-14+Math.sin(p)*2,op=(Math.sin(p*2)+1)*.15;b3Dome(c,hx,hy,12,12,'#a85a6a');E(c,hx+6,hy,6,8+op*10);c.fillStyle='#3a0a14';c.fill();c.strokeStyle='#120804';c.lineWidth=1.4;c.stroke();
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,ex=hx+6+Math.cos(a)*5.5,ey=hy+Math.sin(a)*(7+op*9);c.beginPath();c.moveTo(ex,ey);c.lineTo(hx+6+Math.cos(a)*3,hy+Math.sin(a)*(4+op*5));c.strokeStyle='#f4f0e8';c.lineWidth=1.8;c.stroke()}
  for(const [x,y] of [[hx-4,hy-8],[hx-8,hy-5]]){E(c,x,y,2,2);c.fillStyle='#ffd23f';c.fill();E(c,x,y,1,1.5);c.fillStyle='#000';c.fill()}}}});
B3.pulgon.p='Glotón: siempre está comiendo';B3.grillo.p='Músico saltarín';B3.caracol.p='Dormilón acorazado';B3.luciernaga.p='Porrista: anima a sus compañeros';B3.chinche.p='Presumida y apestosa';B3.oruga.p='Hambrienta sin fin';
B3.tarantula.p='Tejedora paciente';B3.abejorro.p='Guardián leal de la fila';B3.escorpion.p='Rencoroso y certero';B3.langosta.p='Capitana de los pulgones';B3.reyhormiga.p='Soberano de la colonia';B3.viuda.p='Elegante y mortal';B3.gusano.p='Rugido del subsuelo';
// Frases de todos los insectos (personalidad en globitos durante la partida).
const PERS={hormiga:['¡A marchar!','¡Uno, dos!'],cria:['¡Buaaa!','¿Mamá?'],mosquito:['¡Jiji!','¡Bzzz!'],mariquita:['¡Coraza lista!','Ni cosquillas'],escarabajo:['¡Más fuerte!','Grrr…'],cucaracha:['¡No me pisas!','¡Corre!'],
 rinoceronte:['¡A EMBESTIR!','¡Nadie me para!'],avispa:['¡Mis súbditos!','¡Zumbad!'],mantis:['Snip, snip…','Paciencia…'],ciempies:['¡Cien pasos!','¡Rodando!'],polilla:['Duerman…','La luz…'],termita:['¡Más madera!','Curen a la reina'],
 pulgon:['¡Ñam!','¿Eso se come?'],grillo:['♪ Cri-cri ♪','¡Hop!'],caracol:['Zzz…','Sin prisa…'],luciernaga:['¡Vamos, vamos!','¡Brillen!'],chinche:['¡Puaj!','Huele a victoria'],oruga:['¡Ñom ñom!','Más hojitas'],
 tarantula:['Teje, teje…','Ocho trampas'],abejorro:['¡Escudos arriba!','¡Protejan la fila!'],escorpion:['¡Picotazo!','Ven aquí…'],langosta:['¡Al ataque!','¡Gran salto!'],
 reyhormiga:['¡Por la colonia!','¡A LA CARGA!'],viuda:['Bienvenidos a mi red','Shhh…'],gusano:['Grrrooo…','¡Del subsuelo!']};
function bugTalk(c,i,x,y,s2){const L=PERS[i.k];if(!L||LOWFX)return;const per=i.def.boss||i.def.elite?7:12,seed=(i.max*.37)%per,ph=(i.t+seed)%per;if(ph>1.6)return;
 const s=L[Math.floor((i.t+seed)/per)%L.length],a=Math.min(1,ph*5,(1.6-ph)*5);c.save();c.globalAlpha=a;c.font='bold 11px "Segoe UI",system-ui,sans-serif';const w=c.measureText(s).width+12,bx=x-w/2,by=y-(i.def.boss?66:i.def.elite?52:36)*s2/1.25;
 rr(c,bx,by-18,w,18,8,i.def.boss?'#fff0d0':'#ffffff','#2a1a0a',1.5);c.beginPath();c.moveTo(x-4,by);c.lineTo(x,by+6);c.lineTo(x+4,by);c.closePath();c.fillStyle=i.def.boss?'#fff0d0':'#ffffff';c.fill();
 txt(c,s,x,by-9,11,'#2a1a0a');c.restore()}
// Habilidades nuevas (solo insectos marcados con x:1, que solo aparecen en partidas v:7).
function bugAbil(b,ins,dt,sc){const D=ins.def,[x,y]=posAt(b,ins.d);
 if(D.regen&&ins.hp<ins.max)ins.hp=Math.min(ins.max,ins.hp+ins.max*D.regen*dt);
 if(D.jump&&!(ins.frz>0)){if(ins.jT===undefined)ins.jT=D.jump.t;ins.jT-=dt;if(ins.jT<=0){ins.jT=D.jump.t;ins.d+=b.L*D.jump.f;ins.hop=.35;for(let q=0;q<5;q++)b.fx.push({type:'spark',x,y,vx:rand(-60,60),vy:rand(-80,-20),life:.4,col:'#c8b080'})}}
 if(ins.hop>0)ins.hop-=dt;
 if(D.web){if(ins.wT===undefined)ins.wT=D.web.t;ins.wT-=dt;if(V10()&&!ins.tel&&ins.wT<=1.2)telPick(b,ins,D.web.n,'wT');if(ins.wT<=0){ins.wT=D.web.t;const occ=b.slots.map((s,i)=>s?i:-1).filter(i=>i>=0),v10=V10(),T10=v10?telTake(b,ins):null;
  for(let n=0;v10?n<T10.length:n<D.web.n&&occ.length;n++){const i=v10?T10[n]:occ.splice(Math.floor(sr()*occ.length),1)[0];b.slots[i].stun=Math.max(b.slots[i].stun||0,D.web.d);b.slots[i].web=D.web.d;const [sx,sy]=slotXY(b,i);b.fx.push({type:'bolt',x,y:y-10*sc,x2:sx,y2:sy-20*sc,life:.3,col:'#e8e8f0'})}}}
 if(D.guard){if(ins.gT===undefined)ins.gT=3;ins.gT-=dt;if(ins.gT<=0){ins.gT=7;for(const o of b.insects)if(!o.dead&&Math.abs(o.d-ins.d)<90*sc)o.sh=Math.max(o.sh||0,o.max*.25);b.fx.push({type:'ring',x,y,r:90*sc,life:.5,max:.5,col:'#ffd23f'})}}
 if(D.sting){if(ins.sT===undefined)ins.sT=4;ins.sT-=dt;if(V10()&&!ins.tel&&ins.sT<=1.2){const s=nearSlot(b,x,y);ins.tel=s>=0?[s]:[];ins.telK='sT'}if(ins.sT<=0){ins.sT=6;let best=-1,bd=1e9;if(V10()){const T10=telTake(b,ins);best=T10.length?T10[0]:-1}else b.slots.forEach((u,i)=>{if(!u)return;const [sx,sy]=slotXY(b,i),dd=Math.hypot(sx-x,sy-y);if(dd<bd){bd=dd;best=i}});
  if(best>=0){b.slots[best].slowT=4;const [sx,sy]=slotXY(b,best);b.fx.push({type:'bolt',x,y,x2:sx,y2:sy,life:.25,col:'#ff5a5a'});b.fx.push({type:'txt',x:sx,y:sy-30*sc,s:'-50 %',life:1,col:'#ff8a8a'})}}}
 if(D.call){if(ins.cT===undefined)ins.cT=D.call.t*.6;ins.cT-=dt;if(ins.cT<=0){ins.cT=D.call.t;for(let n=0;n<D.call.n;n++)spawnBug(b,D.call.k,G.hpm*.6,Math.max(0,ins.d-10-n*12));b.fx.push({type:'txt',x,y:y-40*sc,s:'¡Refuerzos!',life:1,col:'#ffcf4a'})}}
 if(D.burrow){if(ins.bT===undefined)ins.bT=5;if(ins.bur>0){ins.bur-=dt;if(ins.bur<=0){ins.bT=8;for(let q=0;q<8;q++)b.fx.push({type:'spark',x,y,vx:rand(-90,90),vy:rand(-140,-40),life:.5,col:'#8a6a4a'})}}else{ins.bT-=dt;if(ins.bT<=0)ins.bur=2.5}}}
// Velocidad extra: enterrado (×1,6), hormigas con el Rey vivo (×1,25) y cerca de una Luciérnaga (×1,25). Para los insectos de siempre vale 1.
function bugSpd(b,ins,HS,RL,sc){let m=1;if(ins.bur>0)m*=1.6;if(RL&&ins.k==='hormiga')m*=1.25;if(HS.length&&!ins.def.haste)for(const h of HS)if(h!==ins&&Math.abs(h.d-ins.d)<70*sc){m*=1.25;break}return m}
// La Chinche Apestosa al morir duerme a la planta más cercana 1,5 s.
function stinkFx(b,x,y){let best=-1,bd=1e9;b.slots.forEach((u,i)=>{if(!u)return;const [sx,sy]=slotXY(b,i),d=Math.hypot(sx-x,sy-y);if(d<bd){bd=d;best=i}});if(best>=0)b.slots[best].stun=Math.max(b.slots[best].stun||0,1.5);
 for(let q=0;q<8;q++)b.fx.push({type:'pt',kind:'spore',x,y:y-8,vx:rand(-50,50),vy:rand(-60,-10),g:-20,life:.9,max:.9,col:'#9ad04a',rot:0,vr:0,sz:1.4})}
// Dibujo del Gusano enterrado: montículo de tierra que avanza.
function burrowFx(c,x,y,s,t){c.save();E(c,x,y+4*s,18*s,6*s);c.fillStyle='rgba(0,0,0,.3)';c.fill();VOL(c,cc=>{E(cc,x,y,16*s,7*s)},'#7a5a3a',{bb:[x-16*s,y-7*s,x+16*s,y+7*s],light:'#c8a070',dark:'#2a1a0a'});
 for(let i=0;i<4;i++){const ph=(t*2+i/4)%1;c.globalAlpha=1-ph;circ(c,x+(i-1.5)*8*s,y-6*s-ph*10*s,2.2*s,'#8a6a4a')}c.restore()}

function persLine(k){const p=(B3[k]&&B3[k].p)||BUG_P[k]||'',q=PERS[k]?PERS[k][0]:'';return p||q?`<i><span>${p}</span>${q?(p?' · ':'')+'<span>“'+q+'”</span>':''}</i><br>`:''}
function deathImg(k){return b3Snap(k)}

// ---------- Impactos, partículas, números de daño y muertes ----------
const PKIND={flame:'ember',phoenix:'ember',sun:'ember',lob:'ember',flake:'shard',fang:'shard',drop:'drop',bubble:'drop',spore:'spore',puff:'spore',petal:'leaf',vine:'leaf',seed:'leaf',thorn:'leaf',spark:'spark',star:'spark',coin:'spark',needle:'spark',arrow:'spark'};
function burst(b,x,y,k,n){const U=UT[k]||{},kind=PKIND[U.pv]||'magic',col=U.shot||'#ffffff';if(b.fx.length>420)return;n=LOWFX?3:n;
 for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=60+Math.random()*130,f={type:'pt',kind,x,y,vx:Math.cos(a)*v*.8,vy:kind==='ember'||kind==='spore'?Math.sin(a)*v-30:-(80+Math.random()*170),gy:y+(4+Math.random()*8)*b.cs/96,life:.45+Math.random()*.35,col,rot:Math.random()*6,vr:(Math.random()-.5)*14,sz:.7+Math.random()*.7};
  f.max=f.life;f.g=kind==='ember'?-120:kind==='spore'?-60:kind==='leaf'?300:520;if(kind==='ember'||kind==='spore')delete f.gy;b.fx.push(f)}
 b.fx.push({type:'hitfl',x,y,life:.12,max:.12,col});if(audible(b))sfx('hit',k)}
function dmgNum(b,ins,a){if(DOT){ins.acc=(ins.acc||0)+a;if(ins.acc<Math.max(8,ins.max*.04))return;a=ins.acc;ins.acc=0}if(a<.5||(b.fx.length>420&&!HCRIT))return;
 if(!DOT&&(HCRIT||a>ins.max*.3)&&audible(b))addShake(1.6);if(HCRIT&&!DOT&&audible(b))sfx('crit');const [x,y]=posAt(b,ins.d),sc=b.cs/96;b.fx.push({type:'dmg',x:x+(Math.random()-.5)*14*sc,y:y-26*sc*(ins.def.boss?1.6:1),vx:(Math.random()-.5)*70,vy:-175,g:430,life:.8,max:.8,s:Math.round(a)+(HCRIT?'!':''),cr:HCRIT,dot:DOT})}
function deathFx(b,ins,x,y){const sc=b.cs/96,s2=(ins.def.boss?1.6:ins.def.s||1)*sc*1.25;
 b.fx.push({type:'die',k:ins.k,x,y,s:s2,face:ins.face||1,vx:(Math.random()-.5)*60,vy:-170,g:520,rot:0,vr:(ins.face||1)*(6+Math.random()*4),life:.5,max:.5});
 for(let i=0;i<(LOWFX?3:6);i++){const a=Math.random()*Math.PI*2;b.fx.push({type:'smoke',x:x+Math.cos(a)*8*s2,y:y-10*s2+Math.sin(a)*5*s2,vx:Math.cos(a)*30,vy:-25,g:0,r:(7+Math.random()*6)*s2,life:.75,max:.75,dl:.22})}
 if((ins.def.boss||(ins.def.s||1)>=1.25)&&audible(b))addShake(ins.def.boss?4:2.5);if(audible(b)&&(ins.def.boss||ins.def.elite))sfx(ins.def.boss?'bossdie':'elitedie')}
function drawFx2(c,f,a,sc){switch(f.type){
 case 'pt':{const s=f.sz*sc;c.globalAlpha=a;switch(f.kind){
  case 'ember':c.globalCompositeOperation='lighter';c.drawImage(glowSprite(f.col),f.x-9*s,f.y-9*s,18*s,18*s);circ(c,f.x,f.y,1.6*s,'#fff8d0');c.globalCompositeOperation='source-over';break;
  case 'shard':c.save();c.translate(f.x,f.y);c.rotate(f.rot);c.beginPath();c.moveTo(0,-5*s);c.lineTo(2.4*s,0);c.lineTo(0,5*s);c.lineTo(-2.4*s,0);c.closePath();c.fillStyle=f.col;c.fill();c.strokeStyle='#fff';c.lineWidth=.8;c.stroke();c.restore();break;
  case 'drop':c.save();c.translate(f.x,f.y);c.rotate(Math.atan2(f.vy,f.vx));E(c,0,0,4.5*s,2.2*s);c.fillStyle=f.col;c.fill();E(c,1*s,-.6*s,1.4*s,.8*s);c.fillStyle='rgba(255,255,255,.8)';c.fill();c.restore();break;
  case 'spore':c.globalAlpha=a*.75;circ(c,f.x,f.y,(2+3*(1-a))*s,f.col);break;
  case 'leaf':c.save();c.translate(f.x,f.y);c.rotate(f.rot);E(c,0,0,4.6*s,2.2*s);c.fillStyle=f.col;c.fill();c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=.8;c.stroke();c.restore();break;
  case 'spark':{c.globalCompositeOperation='lighter';const v=Math.hypot(f.vx,f.vy)||1;c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.x-f.vx/v*7*s,f.y-f.vy/v*7*s);c.strokeStyle=f.col;c.lineWidth=2.2*s;c.stroke();c.strokeStyle='#fff';c.lineWidth=.9*s;c.stroke();c.globalCompositeOperation='source-over';break}
  default:c.globalCompositeOperation='lighter';c.save();c.translate(f.x,f.y);c.rotate(f.rot);c.fillStyle=f.col;c.fillRect(-4*s,-.8*s,8*s,1.6*s);c.fillRect(-.8*s,-4*s,1.6*s,8*s);c.restore();c.globalCompositeOperation='source-over'}
  c.globalAlpha=1;break}
 case 'hitfl':{const r=(26-14*a)*sc;c.globalCompositeOperation='lighter';c.globalAlpha=a;c.drawImage(glowSprite(f.col),f.x-r,f.y-r,r*2,r*2);c.drawImage(glowSprite('#ffffff'),f.x-r*.45,f.y-r*.45,r*.9,r*.9);c.globalCompositeOperation='source-over';c.globalAlpha=1;break}
 case 'dmg':{const pr=1-a,sz=(f.cr?24:14)*Math.max(.8,sc)*(pr<.15?1+(.15-pr)*4:1);c.globalAlpha=pr>.55?1-(pr-.55)/.45:1;txt(c,f.s,f.x,f.y,Math.round(sz),f.cr?'#ffd23f':f.dot?'#b8ff6a':'#ffffff','center',f.cr?'#7a1a00':'#000000');c.globalAlpha=1;break}
 case 'die':{const im=deathImg(f.k),S=f.s*.78*(.55+.45*a);c.save();c.translate(f.x,f.y);c.rotate(f.rot);c.scale(S*f.face,S);c.globalAlpha=a;c.drawImage(im.img,-im.ox,-im.oy,im.cw,im.ch);c.restore();c.globalAlpha=1;break}
 case 'smoke':{const e=f.max-f.life;if(e>=f.dl){const q=(e-f.dl)/(f.max-f.dl);c.globalAlpha=(1-q)*.55;circ(c,f.x,f.y,f.r*(.5+q),'#e0dcd2');c.globalAlpha=1}break}}}

// ---------- Proyectiles: estela, aura y núcleo brillante ----------
function drawShot(c,b,s,sc,t){const col=(UT[s.k]||{}).shot||'#ffffff',z=1+s.rank*.08;let p=1;
 if(s.tg&&!s.tg.dead){const [tx,ty]=posAt(b,s.tg.d),dd=Math.hypot(tx-s.x,ty-s.y);if(s.d0===undefined||dd>s.d0)s.d0=Math.max(dd,1);p=clamp(1-dd/s.d0,0,1)}
 const arc=Math.min(70*sc,(s.d0||0)*.28),zz=(30*(1-p)+12*p)*sc+arc*Math.sin(Math.PI*p),X=s.x,Y=s.y-zz;
 c.save();c.globalAlpha=.32;E(c,s.x,s.y+4*sc,7*sc*z*(1-.35*Math.min(1,zz/(70*sc))),2.6*sc*z);c.fillStyle='#000';c.fill();c.restore();
 if(!s.tr)s.tr=[];const tr=s.tr;if(tr.length<2||tr[tr.length-2]!==X||tr[tr.length-1]!==Y){tr.push(X,Y);if(tr.length>16)tr.splice(0,2)}
 c.save();c.globalCompositeOperation='lighter';c.lineCap='round';
 for(let i=2;i<tr.length;i+=2){const f=i/tr.length;c.globalAlpha=f*.6;c.strokeStyle=col;c.lineWidth=(1.5+6*f)*sc*z;c.beginPath();c.moveTo(tr[i-2],tr[i-1]);c.lineTo(tr[i],tr[i+1]);c.stroke()}
 const r=17*sc*z;c.globalAlpha=.75;c.drawImage(glowSprite(col),X-r,Y-r,r*2,r*2);c.restore();
 const oy=s.y;s.y=Y;try{drawShot0(c,b,s,sc,t)}finally{s.y=oy}
 c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.85;const r2=6*sc*z;c.drawImage(glowSprite('#ffffff'),X-r2,Y-r2,r2*2,r2*2);c.restore()}
// Destello en la punta del arma al disparar.
const TIP={spear:[0,-86],staff:[0,-72],wand:[0,-38],gauntlet:[8,-6],can:[32,-18],flask:[0,-20],cannon:[30,0],mortar:[21,-13],sling:[0,-20],fan:[0,-26],book:[7,-2],bow:[30,0],daggers:[0,-26],scythe:[-38,-50],lantern:[0,20],trumpet:[30,16],whip:[40,-10]};
// Aviso (v:10): retícula que se cierra sobre las casillas que el jefe va a atacar.
const TEL_COL={cutT:'#ff3a3a',dustT:'#c08aff',wT:'#f0f0ff',sT:'#ff7a3a'};
function drawTelegraphs(c,b,t){const sc=b.cs/96,cs=b.cs;for(const ins of b.insects){if(ins.dead||!ins.tel||!ins.tel.length)continue;const rem=ins[ins.telK];if(!(rem<=1.25))continue;const f=1-clamp(rem/1.2,0,1),col=TEL_COL[ins.telK]||'#ff3a3a',[ix,iy]=posAt(b,ins.d);
 for(const i of ins.tel){const [x,y]=slotXY(b,i);c.save();c.globalAlpha=.25+.2*f;c.strokeStyle=col;c.lineWidth=2*sc;c.setLineDash([5*sc,6*sc]);c.beginPath();c.moveTo(ix,iy-10*sc);c.lineTo(x,y-4*sc);c.stroke();c.setLineDash([]);
  c.globalAlpha=.6+.35*Math.sin(t*16);c.lineWidth=3*sc;const R=cs*(.62-.2*f);c.beginPath();c.arc(x,y-4*sc,R,0,7);c.stroke();for(let q=0;q<4;q++){const a=q*Math.PI/2+f*2;c.beginPath();c.moveTo(x+Math.cos(a)*R*.7,y-4*sc+Math.sin(a)*R*.7);c.lineTo(x+Math.cos(a)*R*1.12,y-4*sc+Math.sin(a)*R*1.12);c.stroke()}
  c.globalAlpha=.9;c.lineWidth=4*sc;c.beginPath();c.arc(x,y-4*sc,cs*.3,-Math.PI/2,-Math.PI/2+f*Math.PI*2);c.stroke();c.restore();txt(c,'!',x,y-cs*.36,Math.round(22*sc),col,'center','#000')}}}
// Compostera (v:10): arrastra una planta aquí (o elígela y pulsa X) para podarla y recuperar rocío.
function compostR(){return G.duel?{x:446,y:422,w:64,h:60}:{x:12,y:404,w:70,h:70}}
function drawCompost(c,g,t){const r=compostR(),me=g.boards[0],dr=g.drag&&g.drag.moved&&!(g.drag.p)?g.drag:null,u=dr?me.slots[dr.from]:me.sel>=0?me.slots[me.sel]:null,hot=dr&&inR(dr.x,dr.y,r);
 const x=r.x+r.w/2,y=r.y+r.h/2+2;rr(c,r.x,r.y,r.w,r.h,12,hot?'rgba(90,70,20,.95)':'rgba(30,22,12,.82)',hot?'#ffe14a':u?'#c8e07a':'#6a5a3a',hot?3:2);
 VOL(c,cc=>{RRp(cc,x-17,y-8,34,22,5)},'#8a5a2a',{bb:[x-17,y-8,x+17,y+14],light:'#c08a4a',dark:'#4a2a10',lw:1.6});for(const dx of [-9,0,9]){c.beginPath();c.moveTo(x+dx,y-6);c.lineTo(x+dx,y+12);c.strokeStyle='rgba(40,20,5,.5)';c.lineWidth=1.4;c.stroke()}
 leafHQ(c,x-6,y-8,12,-2.2,'#9ae06a','#2f7a1f');leafHQ(c,x+4,y-8,11,-1,'#7ac04a','#2f7a1f');c.save();c.translate(x+15,y-12);c.rotate(.5+(hot?Math.sin(t*12)*.2:0));RRp(c,-2,-14,4,16,2);P(c,'#a87a4a',1.2);c.beginPath();c.moveTo(-7,2);c.lineTo(7,2);c.lineTo(5,12);c.quadraticCurveTo(0,16,-5,12);c.closePath();P(c,'#c8ccd8',1.2);c.restore();
 if(u){const g2=Math.round(.3*me.cost*u.rank);txt(c,'♻ +'+g2+' 💧',x,r.y-9,12,'#c8e07a','center','#000')}else txt(c,'Podar (X)',x,r.y+r.h-7,10,'#cfe')}
function muzzle(c,W2,a,col){const tp=TIP[W2.t];if(!tp||a<=.35)return;let [x,y]=tp;if(W2.t==='cannon'&&W2.long)x=44;x*=1.25;y*=1.25;const q=(a-.35)/.65,r=10+14*q;
 c.save();c.globalCompositeOperation='lighter';c.globalAlpha=q;c.drawImage(glowSprite(col||'#ffffff'),x-r*1.6,y-r*1.6,r*3.2,r*3.2);c.drawImage(glowSprite('#ffffff'),x-r*.6,y-r*.6,r*1.2,r*1.2);
 c.translate(x,y);c.rotate(a*2);c.fillStyle='#ffffff';for(let i=0;i<4;i++){c.rotate(Math.PI/2);c.beginPath();c.moveTo(0,-1.6);c.lineTo(r*1.3,0);c.lineTo(0,1.6);c.closePath();c.fill()}c.restore()}
function drawBoard(c,b,t){const {bx,by,cs,w,h,m}=b,sc=cs/96;
 c.lineJoin='round';c.lineCap='round';const bio=biomeOf(G),Ly=boardLayer(b,bio);c.drawImage(Ly.cv,Ly.x,Ly.y,Ly.w,Ly.h);boardLive(c,b,bio,t,Ly);
 if(b.sel>=0){const [x,y]=slotXY(b,b.sel);rr(c,x-cs/2+4*sc,y-cs/2+4*sc,cs-8*sc,cs-8*sc,10*sc,null,'#ffe14a',4)}
 const dr=!b.isAI&&G.drag&&G.boards[G.drag.p||0]===b?G.drag:null,src=dr?dr.from:b.sel;
 if(src>=0&&b.slots[src])for(let i=0;i<b.slots.length;i++)if(canMerge(b,src,i)){const [x,y]=slotXY(b,i);c.globalAlpha=.5+.3*Math.sin(t*8);rr(c,x-cs/2+4*sc,y-cs/2+4*sc,cs-8*sc,cs-8*sc,10*sc,null,'#7fff6a',4);c.globalAlpha=1}
 if(src>=0&&b.slots[src]&&dr&&dr.moved&&PHV())for(let i=0;i<b.slots.length;i++)if(i!==src&&!canMerge(b,src,i)){const [x,y]=slotXY(b,i);c.setLineDash([6,5]);rr(c,x-cs/2+6*sc,y-cs/2+6*sc,cs-12*sc,cs-12*sc,10*sc,null,b.slots[i]?'rgba(120,200,255,.75)':'rgba(255,255,255,.6)',2);c.setLineDash([])}
 if(V10()&&G.mode!=='auto'){const BL=blessOf(b),B=BLESS[BL.bio];for(const i of BL.t){const [x,y]=slotXY(b,i);c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.16+.08*Math.sin(t*2.4+i);rr(c,x-cs/2+5*sc,y-cs/2+5*sc,cs-10*sc,cs-10*sc,10*sc,B.col);c.restore();
  c.save();c.globalAlpha=.75;rr(c,x-cs/2+5*sc,y-cs/2+5*sc,cs-10*sc,cs-10*sc,10*sc,null,B.col,2*sc);c.restore();txt(c,B.ic,x-cs/2+15*sc,y-cs/2+15*sc,Math.round(13*sc),'#fff')}}
 const tgF=firstBug(b),tgS=strongBug(b),ENT=[],HB=[],CV=cmdVis(b,t);
 for(let i=0;i<b.slots.length;i++){const u=b.slots[i];if(!u||(dr&&dr.moved&&dr.from===i))continue;const [x,cy]=slotXY(b,i),fy=cy+cs*.3,y=fy-33.1*sc;
  ENT.push({y:fy,f:()=>{pedestal(c,x,fy,sc,bio);const tg=UT[u.k].tgt==='strong'?tgS:tgF,ST={seed:i,ant:0,stun:u.stun>0,morph:morphOf(b,i,u,t),cheer:CV.cheer&&!(u.af>0)};if(tg){const [tx,ty]=posAt(b,tg.d),dx=tx-x;if(Math.abs(dx)>10*sc)u.fc=dx<0?-1:1;ST.lx=dx;ST.ly=ty-(y-50*sc);if(u.cd<.18&&!(u.stun>0))ST.ant=1-Math.max(0,u.cd)/.18}drawUnit(c,u.k,x,y,.92*sc,t+i,u.rank,u.pop>0&&!(u.af>0)?u.pop:0,b.skin[u.k],u.af,u.fc||1,ST);if(u.slowT>0){c.save();for(let q=0;q<3;q++){const ph=(t*1.5+q/3)%1;c.globalAlpha=1-ph;circ(c,x-10*sc+q*10*sc,cy-30*sc+ph*22*sc,2.6*sc,'#c86aff')}c.restore();c.globalAlpha=1}if(u.web>0&&u.stun>0){u.web-=1/60;c.save();c.strokeStyle='rgba(240,240,250,.8)';c.lineWidth=1.2;for(let q=0;q<6;q++){const ag=q/6*Math.PI*2;c.beginPath();c.moveTo(x,cy-6*sc);c.lineTo(x+Math.cos(ag)*34*sc,cy-6*sc+Math.sin(ag)*34*sc);c.stroke()}for(const r2 of [12,22,32]){c.beginPath();c.arc(x,cy-6*sc,r2*sc,0,7);c.stroke()}c.restore()}
   if(u.stun>0){c.globalAlpha=.55;for(let q=0;q<4;q++)circ(c,x+Math.sin(t*3+q*1.7)*14*sc,cy-20*sc+Math.cos(t*2+q)*10*sc,7*sc,'#9a80c8');c.globalAlpha=1;txt(c,'💤',x+16*sc,cy-34*sc,Math.round(14*sc),'#fff')}}})}
 const ins=b.insects;LOWFX=ins.length>32;
 for(const i of ins){let [x,y,a]=posAt(b,i.d);if(i.kb>0){x-=Math.cos(a)*i.kb*6*sc;y-=Math.sin(a)*i.kb*6*sc}const s2=(i.def.boss?1.6:i.def.s||1)*sc*1.25,fly=i.def.fly?Math.sin(i.t*6)*3-16*sc:0;
  ENT.push({y,f:()=>{if(i.bur>0){burrowFx(c,x,y,s2/1.25,t);return}const jy=i.hop>0?-Math.sin((1-i.hop/.35)*Math.PI)*22*sc:0;if(fly){E(c,x,y+9*s2,12*s2,3.4*s2);c.fillStyle='rgba(0,0,0,.25)';c.fill();NOSH=1}drawBug(c,i.k,x,y+fly+jy,s2,i.t,a,i);NOSH=0;if(i.sh>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.3+.1*Math.sin(t*6);circ(c,x,y+fly-12*s2,20*s2,'#ffd23f');c.restore();c.globalAlpha=1}
   if(i.curl>0){c.strokeStyle='#ffd0a0';c.lineWidth=3;c.globalAlpha=.6+.3*Math.sin(t*12);c.beginPath();c.arc(x,y-6*s2,22*s2,0,7);c.stroke();c.globalAlpha=1}if(i.frz>0){c.globalAlpha=.45;circ(c,x,y+fly-8*s2,18*s2,'#bfeaff');c.globalAlpha=1}}});
  if((i.hp<i.max||i.def.boss||i.def.elite)&&!(i.bur>0))HB.push(()=>hpBar(c,x,y+fly-(i.def.boss?40:i.def.elite?32:24)*sc,(i.def.boss?70:i.def.elite?54:36)*sc,i.hp/i.max,i.def.boss?'#ff5a5a':i.def.elite?'#ff9a3a':'#ffd23f'));HB.push(()=>{if(!(i.bur>0))bugTalk(c,i,x,y+fly,s2)})}
 ENT.sort((p,q)=>p.y-q.y);for(const e of ENT)e.f();for(const h of HB)h();
 if(V10())drawTelegraphs(c,b,t);
 LOWFX=false;
 for(const s of b.shots)drawShot(c,b,s,sc,t);
 for(const f of b.fx){const a=clamp(f.life/(f.max||.5),0,1);if(f.type==='pt'||f.type==='dmg'||f.type==='die'||f.type==='smoke'||f.type==='hitfl'){drawFx2(c,f,a,sc);continue}
  if(f.type==='spark')circ(c,f.x,f.y,3*sc,f.col);
  else if(f.type==='pop'){c.globalAlpha=clamp(f.life/.15,0,1);circ(c,f.x,f.y,14*sc*(1-f.life/.15)+4,f.col);c.globalAlpha=1}
  else if(f.type==='boom'){c.globalAlpha=a*.85;circ(c,f.x,f.y,f.r*(1.1-a*.4),f.col||'#ff8a2a');c.globalAlpha=a;circ(c,f.x,f.y,f.r*.5,f.col?'#fff8d0':'#ffd84a');c.globalAlpha=1}
  else if(f.type==='ring'){c.globalAlpha=a;c.strokeStyle=f.col||'#fff';c.lineWidth=4*a+1;c.beginPath();c.arc(f.x,f.y,Math.max(1,f.r*(1.15-a*.6)),0,7);c.stroke();c.globalAlpha=a*.25;circ(c,f.x,f.y,f.r*(1.1-a*.5),f.col||'#fff');c.globalAlpha=1}
  else if(f.type==='beam'){c.globalAlpha=a;c.lineCap='round';c.strokeStyle=f.col||'#fff';c.lineWidth=(f.w||4)*2.2*a+1;c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.x2,f.y2);c.stroke();c.strokeStyle='#fff';c.lineWidth=(f.w||4)*.6;c.stroke();circ(c,f.x2,f.y2,8*a+2,f.col||'#fff');c.globalAlpha=1}
  else if(f.type==='bolt'){c.strokeStyle=f.col||'#fff27a';c.lineWidth=3;c.beginPath();c.moveTo(f.x,f.y);c.lineTo((f.x+f.x2)/2+rand(-8,8),(f.y+f.y2)/2+rand(-8,8));c.lineTo(f.x2,f.y2);c.stroke()}
  else if(f.type==='txt'){c.globalAlpha=clamp(f.life*2,0,1);txt(c,f.s,f.x,f.y,Math.round((f.big?30:15)*Math.max(.8,sc)),f.col,'center','#0008');c.globalAlpha=1}
  else if(f.type==='slash'){c.strokeStyle='#fff';c.lineWidth=5;c.beginPath();c.moveTo(f.x-30*sc,f.y-30*sc);c.lineTo(f.x+30*sc,f.y+30*sc);c.stroke()}
  else if(f.type==='flash'&&!save.opts.noFlash){c.fillStyle=`rgba(255,40,40,${f.life*.5})`;c.fillRect(bx-m-30,by-m-30,w+2*m+60,h+2*m+60)}}
}
function hearts(c,x,y,n,s){for(let i=0;i<3;i++){c.save();c.translate(x+i*26*s,y);c.scale(s,s);c.beginPath();c.moveTo(0,8);c.bezierCurveTo(-16,-4,-9,-15,0,-6);c.bezierCurveTo(9,-15,16,-4,0,8);c.fillStyle=i<n?'#ff4a5a':'#4a2a2a';c.fill();c.restore()}}
function wrapTxt(c,s,x,y,maxW,size,col,lh){s=T(String(s));c.font=`bold ${size}px "Segoe UI",system-ui,sans-serif`;const words=s.split(' ');let line='',yy=y;
 I18N_RAW=true;try{for(const w of words){const tst=line?line+' '+w:w;if(c.measureText(tst).width>maxW&&line){txt(c,line,x,yy,size,col,'left');line=w;yy+=lh||size*1.3}else line=tst}if(line)txt(c,line,x,yy,size,col,'left')}finally{I18N_RAW=false}}
const SBX={place:{x:8,y:96,w:168,h:92},rank:{x:8,y:196,w:168,h:40},rm:{x:8,y:244,w:168,h:40},wave:{x:8,y:292,w:168,h:40},dew:{x:8,y:340,w:168,h:40}};
const SBX_BUGS=Object.keys(BUGS);
const sbxBugRect=i=>({x:814+(i%3)*46,y:64+Math.floor(i/3)*48,w:44,h:45});
function drawSbx(c,g,t){const S=g.sbx,me=g.boards[0],btn=(r,f,s,col)=>{rr(c,r.x,r.y,r.w,r.h,12,f,s||'#173f85',2);if(col)txt(c,col,r.x+r.w/2,r.y+r.h/2,14,'#fff')};
 btn(SBX.place,S.rm?'rgba(10,20,14,.85)':'rgba(58,42,8,.9)',S.rm?'#3a5a48':'#ffcf4a');drawUnit(c,S.k,SBX.place.x+36,SBX.place.y+42,.55,t,S.r,0,me.skin[S.k]);
 txt(c,'Colocar:',SBX.place.x+70,SBX.place.y+22,13,'#ffe9a8','left');wrapTxt(c,UT[S.k].n,SBX.place.x+70,SBX.place.y+42,92,13,'#fff',16);txt(c,'toca para cambiar',SBX.place.x+70,SBX.place.y+78,10,'#9ab','left');
 btn(SBX.rank,'#2d6fd6',null,PHV()?`Fase al colocar: ${ROMAN[S.r]||S.r} ▸`:`Nivel al colocar: ${S.r} ▸`);btn(SBX.rm,S.rm?'#d6382d':'#4a5a70',S.rm?'#7a1a12':null,S.rm?'🗑 Quitando plantas':'🗑 Modo quitar');
 btn(SBX.wave,'#3fa04a','#1d5a24',g.o.autoWaves?'▶ Adelantar oleada':'▶ Siguiente oleada');btn(SBX.dew,'#2d6fd6',null,'💧 +500 rocío');
 txt(c,g.o.infLives?'❤ Vidas infinitas':'',SBX.dew.x+8,SBX.dew.y+56,12,'#ff9aa8','left');
 rr(c,810,58,144,Math.ceil(SBX_BUGS.length/3)*48+10,12,'rgba(10,20,14,.85)','#3a5a48',2);
 SBX_BUGS.forEach((k,i)=>{const r=sbxBugRect(i),B=BUGS[k];rr(c,r.x,r.y,r.w,r.h,10,B.boss?'rgba(90,30,30,.85)':'rgba(30,50,40,.9)',B.boss?'#ff8a6a':'#5a7a68',1.5);
  drawBug(c,k,r.x+r.w/2,r.y+r.h-16,B.boss?.42:B.elite?.5:.62,t,0,null);txt(c,TX(shortN(B.n).slice(0,8)),r.x+r.w/2,r.y+r.h-5,8,'#e8f0d8')});
 txt(c,'Invocar',882,52,12,'#ffe9a8')}
function sbxDown(x,y){const S=G.sbx,me=G.boards[0];
 if(inR(x,y,SBX.place)){S.rm=false;S.k=ALL[(ALL.indexOf(S.k)+1)%ALL.length];return true}
 if(inR(x,y,SBX.rank)){S.r=S.r%(PHV()?PH_MAX:7)+1;return true}
 if(inR(x,y,SBX.rm)){S.rm=!S.rm;return true}
 if(inR(x,y,SBX.wave)){doAct({a:'wave'});return true}
 if(inR(x,y,SBX.dew)){doAct({a:'dew'});return true}
 for(let i=0;i<SBX_BUGS.length;i++)if(inR(x,y,sbxBugRect(i))){doAct({a:'spawn',k:SBX_BUGS[i]});return true}
 const i=slotAt(me,x,y);if(i>=0){if(S.rm){if(me.slots[i])doAct({a:'rm',i});return true}if(!me.slots[i]&&me.sel<0){doAct({a:'place',i,k:S.k,r:S.r});return true}}
 return false}
// ===== Duelo local de 2 personas =====
function controlsP2(){const b=G.boards[1];return{sum:{x:650,y:418,w:180,h:64},dew:{x:518,y:426,w:120,h:48},cards:b.deck.map((k,i)=>({k,x:518+i*86,y:494,w:80,h:96})),cmd:b.cmd?{x:840,y:418,w:96,h:64}:null}}
function drawCtl(c,b,ct,t){const sm=ct.sum,free=b.slots.some(s=>!s),can=b.dew>=b.cost&&free;
 rr(c,sm.x,sm.y,sm.w,sm.h,16,can?'#3fa04a':'#4a5a50',can?'#1d5a24':'#2a3a30',4);txt(c,free?'PLANTAR':'TABLERO LLENO',sm.x+sm.w/2,sm.y+sm.h*.32,18,'#fff','center','#0006');
 drop(c,sm.x+sm.w/2-24,sm.y+sm.h*.7,.8);txt(c,b.cost,sm.x+sm.w/2+10,sm.y+sm.h*.7,18,'#fff','center','#0006');
 const dw=ct.dew;rr(c,dw.x,dw.y,dw.w,dw.h,14,'#000a');drop(c,dw.x+24,dw.y+dw.h/2,1);txt(c,Math.floor(b.dew),dw.x+dw.w/2+14,dw.y+dw.h/2,24,'#bfeaff');
 for(const cd of ct.cards){const l=b.power[cd.k]||1,cost=powerCost(b,cd.k),ok=l<5&&b.dew>=cost;rr(c,cd.x,cd.y,cd.w,cd.h,12,'#e8dcc0','#6a4a22',3);drawUnit(c,cd.k,cd.x+cd.w/2,cd.y+cd.h*.36,.5,t,0,0,b.skin[cd.k]);
  txt(c,'Nv '+l,cd.x+cd.w-6,cd.y+12,12,'#6a3a10','right');rr(c,cd.x+5,cd.y+cd.h-26,cd.w-10,21,8,l>=5?'#8a8a8a':ok?'#2d6fd6':'#7a8aa0');txt(c,l>=5?'MÁX':'⬆ '+cost,cd.x+cd.w/2,cd.y+cd.h-15,13,'#fff')}}
const VS_KEYS=[['W A S D','E','F','1-5'],['Flechas','Shift der.','Enter','6-0']];
function drawVersus(c,g,t){const c2=controlsP2();drawCtl(c,g.boards[1],c2,t);if(c2.cmd)drawCmd(c,g.boards[1],c2.cmd,t,'Ctrl');
 [0,1].forEach(p=>{const b=g.boards[p],[x,y]=slotXY(b,g.cur[p]),cs=b.cs,col=p?'#4fd8ff':'#ffe14a';c.setLineDash([6,4]);rr(c,x-cs/2+1,y-cs/2+1,cs-2,cs-2,10,null,col,3);c.setLineDash([]);
  const K=VS_KEYS[p],bx=p?518:18;txt(c,`Mover: ${K[0]} · Plantar: ${K[1]} · Elegir/fusionar: ${K[2]} · Potenciar: ${K[3]}`,bx+(p?212:212),408,10,col)})}
function vsMove(p,dx,dy){const i=G.cur[p];G.cur[p]=clamp(Math.floor(i/COLS)+dy,0,ROWS-1)*COLS+clamp(i%COLS+dx,0,COLS-1)}
function vsSelect(p){const b=G.boards[p],i=G.cur[p];if(b.sel>=0&&b.sel!==i){doAct({a:'m',i:b.sel,j:i,p});b.sel=-1}else b.sel=b.slots[i]&&b.sel!==i?i:-1}
function vsKey(e){const c=e.code,mv={KeyW:[0,0,-1],KeyS:[0,0,1],KeyA:[0,-1,0],KeyD:[0,1,0],ArrowUp:[1,0,-1],ArrowDown:[1,0,1],ArrowLeft:[1,-1,0],ArrowRight:[1,1,0]}[c];
 if(mv){e.preventDefault();vsMove(mv[0],mv[1],mv[2]);return true}
 if(c==='KeyQ'){doAct({a:'c',p:0});return true}if((c==='ControlRight'||c==='NumpadAdd')&&G.boards[1].cmd){e.preventDefault();doAct({a:'c',p:1});return true}
 if(c==='KeyE'){doAct({a:'s',p:0});return true}if(c==='ShiftRight'||c==='ControlRight'||c==='Numpad0'){e.preventDefault();doAct({a:'s',p:1});return true}
 if(c==='KeyF'){vsSelect(0);return true}if(c==='Enter'||c==='NumpadEnter'){e.preventDefault();vsSelect(1);return true}
 const d=/^Digit(\d)$/.exec(c);if(d){const n=+d[1],p=n>=1&&n<=5?0:1,idx=p?(n===0?4:n-6):n-1,b=G.boards[p];if(b.deck[idx])doAct({a:'p',k:b.deck[idx],p});return true}
 return false}
function vsDown(x,y,e){const p=x>=500?1:0,b=G.boards[p],ct=p?controlsP2():controls();
 if(inR(x,y,ct.sum)){doAct({a:'s',p});b.sel=-1;return}
 if(ct.cmd&&inR(x,y,ct.cmd)){doAct({a:'c',p});return}
 if(!p&&V10()&&inR(x,y,compostR())){if(b.sel>=0){doAct({a:'sellU',i:b.sel});b.sel=-1}return}
 for(const cd of ct.cards)if(inR(x,y,cd)){doAct({a:'p',k:cd.k,p});return}
 const i=slotAt(b,x,y);if(i<0){b.sel=-1;return}G.cur[p]=i;
 if(b.sel>=0&&b.sel!==i&&doAct({a:'m',i:b.sel,j:i,p})){b.sel=-1;return}
 if(b.slots[i]){G.drag={from:i,x,y,sx:x,sy:y,moved:false,p};try{cv.setPointerCapture(e.pointerId)}catch(_){}}else b.sel=-1}
function drawTopBtns(c,g){rr(c,BTN_PAUSE.x,BTN_PAUSE.y,BTN_PAUSE.w,BTN_PAUSE.h,10,'#e8dcc0','#6a4a22',2);c.fillStyle='#333';c.fillRect(BTN_PAUSE.x+15,BTN_PAUSE.y+11,6,18);c.fillRect(BTN_PAUSE.x+25,BTN_PAUSE.y+11,6,18);
 rr(c,BTN_SPEED.x,BTN_SPEED.y,BTN_SPEED.w,BTN_SPEED.h,10,g.speed>1?'#ffcf4a':'#e8dcc0','#6a4a22',2);txt(c,'x'+g.speed,BTN_SPEED.x+23,BTN_SPEED.y+20,16,'#333')}
function drawBanner(c,g){if(!g.banner)return;const a=clamp(g.banner.t,0,1);c.globalAlpha=a;rr(c,W/2-330,232,660,g.banner.sub?96:64,18,'rgba(10,20,14,.85)','#ffcf4a',2);txt(c,g.banner.s,W/2,262,32,'#ffcf4a','center','#5a2a00');
 if(g.banner.sub){const sb=T(g.banner.sub);txt(c,sb.length>84?TX(sb.slice(0,82)+'…'):sb,W/2,302,14,'#e8f0d8')}c.globalAlpha=1}
function drawAuto(c,g,t){const A=g.auto,me=A.me,b=me.board,shop=A.phase==='shop',op=autoOpp(me);if(V10()&&b.syn)drawSynHud(c,b);
 drawBoard(c,b,t);drawKbCursor(c,g);
 txt(c,`Ronda ${A.round}`,480,24,24,'#fff','center','#000');
 txt(c,shop?'Tienda: compra, fusiona dos iguales y colócalas':A.phase==='fight'?(op?`¡Combate! Rival: ${op.name}`:'¡Combate contra un fantasma!'):'Resultado de la ronda',480,50,14,'#cfe','center','#000');
 txt(c,'Auto-batalla'+(g.replay?' · 🎬 REPETICIÓN':''),20,24,14,'#ffe9a8','left','#000');
 rr(c,8,96,168,196,14,'rgba(10,20,14,.88)','#3a5a48',2);
 txt(c,`💰 ${me.gold}`,20,122,24,'#ffe680','left');txt(c,`❤ ${Math.max(0,me.hp)} / ${AUTO_HP}`,20,156,18,'#ff8a9a','left');
 txt(c,`Plantas ${autoCount(me)}/${autoLimit(A.round)}`,20,186,15,'#e8f0d8','left');txt(c,`Racha: ${me.streak}`,20,212,15,'#e8f0d8','left');
 if(!shop){txt(c,`Escaparon: ${999-b.lives}`,20,240,15,'#ffb0a0','left');txt(c,`Eliminados: ${b.kills-me.k0}`,20,264,15,'#bfeaff','left')}
 else wrapTxt(c,'Interés: +1 💰 por cada 10 que guardes (máx. 3)',20,240,146,12,'#9ab',16);
 if(shop){const z=AUTO_UI.sell,su=g.drag?b.slots[g.drag.from]:b.sel>=0?b.slots[b.sel]:null;rr(c,z.x,z.y,z.w,z.h,14,su?'rgba(120,40,30,.85)':'rgba(10,20,14,.7)',su?'#ff8a6a':'#3a5a48',2);
  txt(c,'💸 Vender',z.x+z.w/2,z.y+38,18,'#ffd0c0');txt(c,su?`+${autoSellV(su.rank)} 💰`:'Arrastra aquí',z.x+z.w/2,z.y+74,14,'#e8f0d8')}
 const parts=A.parts.slice().sort((x,y)=>(y.alive-x.alive)||(y.hp-x.hp)||(x.place-y.place));
 rr(c,812,64,140,8*44+10,14,'rgba(10,20,14,.88)','#3a5a48',2);
 parts.forEach((p,k)=>{const y=72+k*44;if(p===me||(p===op&&!shop))rr(c,816,y-2,132,42,8,p===me?'rgba(255,207,74,.2)':'rgba(255,110,90,.22)');
  txt(c,(p===me?'★ ':'')+p.name.slice(0,10),822,y+10,13,p.alive?(p===me?'#ffe14a':'#e8f0d8'):'#678','left');
  if(p.alive){rr(c,822,y+22,120,8,4,'#000b');rr(c,822,y+22,120*clamp(p.hp/AUTO_HP,0,1),8,4,p.hp>15?'#7fd04f':p.hp>7?'#ffcf4a':'#ff5a5a');txt(c,`${p.hp}`,946,y+10,12,'#fff','right')}
  else txt(c,`${p.place}.º`,946,y+10,12,'#789','right')});
 if(shop){autoOffersRect().forEach((r,i)=>{const k=me.offers[i];if(!k){rr(c,r.x,r.y,r.w,r.h,12,'rgba(0,0,0,.35)','#3a5a48',2);txt(c,'Comprada',r.x+r.w/2,r.y+r.h/2,12,'#789');return}
   const pr=autoPrice(k),ok=me.gold>=pr&&autoCount(me)<autoLimit(A.round);rr(c,r.x,r.y,r.w,r.h,12,'#e8dcc0',ok?'#6a4a22':'#8a8a8a',3);drawUnit(c,k,r.x+r.w/2,r.y+r.h*.34,.5,t,0,0,b.skin[k]);
   txt(c,shortN(UT[k].n),r.x+r.w/2,r.y+r.h-34,11,'#4a2a10');rr(c,r.x+5,r.y+r.h-25,r.w-10,20,8,ok?'#2d6fd6':'#7a8aa0');txt(c,`💰 ${pr}`,r.x+r.w/2,r.y+r.h-15,13,'#fff');if(pr>AUTO_COST){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.35+.15*Math.sin(t*4);rr(c,r.x+2,r.y+2,r.w-4,r.h-4,11,null,TIERS[tierOf(k)].col,3);c.restore()}});
  const R=AUTO_UI.reroll,okR=me.gold>=AUTO_RR;rr(c,R.x,R.y,R.w,R.h,12,okR?'#2d6fd6':'#4a5a70','#173f85',2);txt(c,`🔄 Cambiar tienda (${AUTO_RR} 💰)`,R.x+R.w/2,R.y+R.h/2,15,'#fff');
  const Gb=AUTO_UI.go;rr(c,Gb.x,Gb.y,Gb.w,Gb.h,16,'#f29a1c','#8a4a0c',4);txt(c,'¡LISTO! ⚔️',Gb.x+Gb.w/2,Gb.y+Gb.h/2,24,'#3a1a00')}
 else{rr(c,70,500,560,84,14,'rgba(10,20,14,.85)','#3a5a48',2);
  if(op)txt(c,`${op.name.slice(0,10)}: escaparon ${999-op.board.lives} · eliminados ${op.board.kills-op.k0}`,350,526,15,'#ffb0a0');
  txt(c,`Tú: escaparon ${999-b.lives} · eliminados ${b.kills-me.k0}`,350,556,15,'#bfeaff')}
 drawTopBtns(c,g);
 if(g.drag&&g.drag.moved){const u=b.slots[g.drag.from];if(u)drawUnit(c,u.k,g.drag.x,g.drag.y,.95,t,u.rank,0,b.skin[u.k])}
 drawBanner(c,g)}
function autoDown(x,y,e){const A=G.auto,b=A.me.board;if(A.phase!=='shop')return;
 const of=autoOffersRect();for(let i=0;i<5;i++)if(inR(x,y,of[i])){doAct({a:'buy',i});return}
 if(inR(x,y,AUTO_UI.reroll)){doAct({a:'rr'});return}
 if(inR(x,y,AUTO_UI.go)){doAct({a:'go'});return}
 if(inR(x,y,AUTO_UI.sell)){if(b.sel>=0){doAct({a:'sell',i:b.sel});b.sel=-1}return}
 const i=slotAt(b,x,y);if(i<0){b.sel=-1;return}
 if(b.sel>=0&&b.sel!==i){if(canMerge(b,b.sel,i))doAct({a:'m',i:b.sel,j:i});else if(!b.slots[i])doAct({a:'mv',i:b.sel,j:i});b.sel=-1;return}
 if(b.slots[i]){G.drag={from:i,x,y,sx:x,sy:y,moved:false};try{cv.setPointerCapture(e.pointerId)}catch(_){}}else b.sel=-1}
// Panel de sinergias (partidas v:9, solo en el diseño de un tablero): activas en verde y las que están a un personaje de activarse.
function drawSynHud(c,b){const SY=b.syn;if(!SY)return;const deck=roleCounts(b.deck),rows=[];
 for(const r in deck){if(!SYN[r]||deck[r]<2)continue;const have=SY.n[r]||0,t=synTier(have);rows.push({r,have,max:Math.min(3,deck[r]),t})}
 if(!rows.length)return;rows.sort((a,b2)=>b2.t-a.t||b2.have-a.have);let y=96;rr(c,10,y-14,166,16+rows.length*34,10,'rgba(10,20,14,.62)','#b8862a55',1.5);
 txt(c,'Sinergias',20,y,13,'#ffcf4a','left','#000');y+=18;
 for(const o of rows){const R=ROLES[o.r]||{n:o.r,ic:''},on=o.t>0;txt(c,`${R.ic} ${SYN_N[o.r]||R.n} ${o.have}/${o.max}`,20,y,12,on?'#9bff7a':'#b8c8b8','left','#000');
  txt(c,on?synText(o.r,o.t):`Falta ${2-o.have} para activar`,20,y+14,10,on?'#e8ffd8':'#8a9a8a','left','#000');y+=34}}
// Ficha de la planta elegida (al tocarla): daño por golpe, golpes por segundo, DPS, críticos, sinergia y su especial.
const PH_NAME=['','Brote','Bronce','Plata','Oro','Leyenda'];
function fmtN(v){const d=LANG==='es'?',':'.';return v>=1000?(v/1000).toFixed(1).replace('.',d)+' k':v>=100?Math.round(v).toString():(Math.round(v*10)/10).toString().replace('.',d)}
function drawUnitInfo(c,b){if(G.drag&&G.drag.moved)return;const i=b.sel,u=i>=0&&b.slots[i];if(!u||!u.ui)return;const U=UT[u.k],R=ROLES[U.r]||{n:'',ic:''},I=u.ui;
 const ph=PHV(),crit=ph&&u.rank>=4?(u.rank>=5?{p:20,m:2.5}:{p:10,m:2}):null,dps=I.dm*I.rate*(crit?1+crit.p/100*(crit.m-1):1);
 const sr2=SYN_N[synRole(U.r)]||R.n,st=b.syn&&b.syn.t[synRole(U.r)],gen=U.gen||(u.k==='rocio'?3:0);
 const lines=[[`${U.n}`,15,'#ffe680'],[`${ph?'Fase '+u.rank+' · '+PH_NAME[Math.min(u.rank,5)]:'Nivel '+u.rank} · ${R.ic} ${R.n}`,12,'#cfe0c8'],
  [`Daño ${fmtN(I.dm)} · ${fmtN(I.rate)} golpes/s`,13,'#fff'],[`DPS ≈ ${fmtN(dps)}${crit?` · crítico ${crit.p} % (x${LANG==='es'?String(crit.m).replace('.',','):crit.m})`:''}`,13,'#9bff7a']];
 if(I.bD>0)lines.push([`Vecinas: +${Math.round(I.bD*100)} % de daño`,11,'#c8a0ff']);
 if(st)lines.push([`Sinergia ${sr2}: ${synText(synRole(U.r),st)}`,11,'#9bff7a']);if(gen)lines.push([`Produce rocío cada 6 s`,11,'#9fe0ff']);if(I.stun)lines.push(['Aturdida',11,'#ff9a8a']);
 const w=236,h=24+lines.length*17+44,[sx,sy]=slotXY(b,i),x=clamp(sx<480?sx+b.cs*.6:sx-b.cs*.6-w,6,W-w-6),y=clamp(sy-h/2,70,H-h-110);
 rr(c,x,y,w,h,12,'rgba(14,24,16,.94)','#ffcf4a',2);let yy=y+16;for(const [s,z,col] of lines){txt(c,s,x+12,yy,z,col,'left');yy+=17}
 wrapTxt(c,U.d||'',x+12,yy+4,w-24,11,'#e8f0d8',14)}
function waveText(nw){if(nw.boss)return`Próxima oleada: ¡JEFE! ${BUGS[nw.boss].n}`;if(nw.list){const s=nw.list.map(([k,n])=>`${BUGS[k]?T(BUGS[k].n):k} ×${n}`).join(', ');return TX(T('Próxima oleada:')+' '+(s.length>70?s.slice(0,68)+'…':s))}
 return`Próxima oleada: ${nw.n} insectos${nw.elite?` · semijefe ${BUGS[nw.elite].n}`:''}${nw.neu.length?` · nuevo: ${nw.neu.map(k=>BUGS[k].n).join(', ')}`:''}`}
function draw(){const now=performance.now()/1000,dt=Math.min(.1,now-(SHK_T||now));SHK_T=now;const sh=SHAKE>0;if(sh){SHAKE=Math.max(0,SHAKE-dt*14);cx.save();cx.translate((Math.random()-.5)*2*SHAKE,(Math.random()-.5)*2*SHAKE)}try{draw0()}finally{if(sh)cx.restore()}}
function draw0(){const c=cx,g=G,t=g.t;drawBiomeBg(c,g,t);if(g.mode==='auto')return drawAuto(c,g,t);const me=g.boards[0],duel=g.duel;
 for(const b of g.boards)drawBoard(c,b,t);drawKbCursor(c,g);if(!duel&&g.mode!=='auto')drawSynHud(c,g.boards[0]);if(!g.replay&&g.mode!=='versus'&&g.mode!=='auto')drawUnitInfo(c,g.boards[0]);
 if(duel){const nm=((g.mode==='versus'?g.o.names[0]:g.replay?g.replay.name:save.name)||'TÚ').slice(0,12);txt(c,nm,30,24,18,'#ffe14a','left','#000');hearts(c,30+c.measureText(nm).width+22,24,me.lives,1);
  const ai=g.boards[1],al=g.mode==='versus'?g.o.names[1].slice(0,12):`${g.mode==='mirror'?'👥 '+(g.o.mirror.name||'Reflejo').slice(0,12):`IA (nv ${g.tier+1})`}${ai.cmd?' '+CMDS[ai.cmd].ic:''}`;txt(c,al,560,24,18,g.mode==='versus'?'#4fd8ff':'#ff9a8a','left','#000');hearts(c,560+c.measureText(al).width+22,24,ai.lives,1);
  if(g.mode!=='versus'){rr(c,790,416,150,40,12,'#0008');drop(c,812,436,.8);txt(c,Math.floor(ai.dew),870,436,16,'#9fe0ff')}
  const s=Math.max(0,180-Math.floor(g.t));txt(c,g.fury?`FRENESÍ x${g.fury}`:`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`,480,24,22,g.fury?'#ff6a4a':'#fff','center','#000');
  txt(c,`Oleada ${g.wave}`,480,52,16,'#cfe','center','#000');const nw=nextWaveInfo();if(nw&&(nw.boss||nw.elite))txt(c,nw.boss?`Próxima: ¡JEFE! ${BUGS[nw.boss].n}`:`Próxima: semijefe ${BUGS[nw.elite].n}`,480,72,12,nw.boss?'#ff9a8a':'#ffc070','center','#000')}
 else{hearts(c,30,28,me.lives,1.2);txt(c,g.target?`Oleada ${g.wave}/${g.target}`:`Oleada ${g.wave}`,480,24,24,'#fff','center','#000');
  if(!(g.target&&g.wave>=g.target)&&!(g.tut<3)&&!(g.mode==='sandbox'&&!g.o.autoWaves)){txt(c,`Siguiente en ${Math.max(0,Math.ceil(g.waveT))} s`,480,50,14,'#cfe','center','#000');
   const nw=nextWaveInfo();if(nw)txt(c,waveText(nw),480,68,12,nw.boss?'#ff9a8a':nw.elite?'#ffc070':'#e8f0d8','center','#000')}
  const lbl=g.mode==='campaign'?`${CHAPTERS[g.o.ch||0].n} · Nivel ${g.lvl+1}`:g.mode==='event'?`Evento · ${(EVENTS.find(e=>e.id===g.o.event)||{n:''}).n}`:{survival:`Supervivencia · Récord ${save.bestSurv}`,daily:'Desafío diario',tutorial:'Tutorial',sandbox:'Jardín libre',custom:`Oleadas propias · ${g.o.setName||''}`}[g.mode]||'';txt(c,lbl,20,58,14,'#ffe9a8','left','#000');
  if(g.tut!==undefined&&(g.tut<3||g.wave<2)&&!g.replay){rr(c,8,96,168,250,14,'rgba(10,20,14,.9)','#7fff6a',2);txt(c,`Paso ${Math.min(4,g.tut+1)} de 4`,20,116,15,'#7fff6a','left');wrapTxt(c,TUT[g.tut],20,142,146,14,'#e8f0d8',19)}}
 if(g.replay){txt(c,'🎬 REPETICIÓN',480,duel?78:76,16,'#ffcf4a','center','#000')}
 const ct=controls(),sm=ct.sum,free=me.slots.some(s=>!s),can=me.dew>=me.cost&&free;
 rr(c,sm.x,sm.y,sm.w,sm.h,16,can?'#3fa04a':'#4a5a50',can?'#1d5a24':'#2a3a30',4);
 txt(c,free?'PLANTAR':'TABLERO LLENO',sm.x+sm.w/2,sm.y+sm.h*.32,duel?18:22,'#fff','center','#0006');
 drop(c,sm.x+sm.w/2-24,sm.y+sm.h*.7,.8);txt(c,me.cost,sm.x+sm.w/2+10,sm.y+sm.h*.7,duel?18:20,'#fff','center','#0006');
 const dw=ct.dew;rr(c,dw.x,dw.y,dw.w,dw.h,14,'#000a');drop(c,dw.x+24,dw.y+dw.h/2,1);txt(c,Math.floor(me.dew),dw.x+dw.w/2+14,dw.y+dw.h/2,24,'#bfeaff');
 const iP=g.introT>0?introP(g):1;ct.cards.forEach((cd,ci)=>{const l=me.power[cd.k]||1,cost=powerCost(me,cd.k),ok=l<5&&me.dew>=cost;
  rr(c,cd.x,cd.y,cd.w,cd.h,12,'#e8dcc0','#6a4a22',3);if(iP>=.82+ci*.03)drawUnit(c,cd.k,cd.x+cd.w/2,cd.y+cd.h*.36,.5,t,0,0,me.skin[cd.k]);
  txt(c,'Nv '+l,cd.x+cd.w-6,cd.y+12,12,'#6a3a10','right');
  rr(c,cd.x+5,cd.y+cd.h-26,cd.w-10,21,8,l>=5?'#8a8a8a':ok?'#2d6fd6':'#7a8aa0');txt(c,l>=5?'MÁX':'⬆ '+cost,cd.x+cd.w/2,cd.y+cd.h-15,13,'#fff')});
 rr(c,BTN_PAUSE.x,BTN_PAUSE.y,BTN_PAUSE.w,BTN_PAUSE.h,10,'#e8dcc0','#6a4a22',2);c.fillStyle='#333';c.fillRect(BTN_PAUSE.x+15,BTN_PAUSE.y+11,6,18);c.fillRect(BTN_PAUSE.x+25,BTN_PAUSE.y+11,6,18);
 if(!duel||g.replay){rr(c,BTN_SPEED.x,BTN_SPEED.y,BTN_SPEED.w,BTN_SPEED.h,10,g.speed>1?'#ffcf4a':'#e8dcc0','#6a4a22',2);txt(c,'x'+g.speed,BTN_SPEED.x+23,BTN_SPEED.y+20,16,'#333')}
 if(ct.cmd&&g.mode!=='sandbox'){if(duel)drawCmd(c,me,ct.cmd,t);else drawCmdTower(c,me,ct.cmd,t)}
 if(V10()&&!g.replay)drawCompost(c,g,t);
 if(duel)drawCmdDuel(c,g,t);
 if(g.mode==='sandbox')drawSbx(c,g,t);
 if(g.mode==='versus')drawVersus(c,g,t);
 if(g.drag&&g.drag.moved){const db=g.boards[g.drag.p||0],u=db.slots[g.drag.from];if(u)drawUnit(c,u.k,g.drag.x,g.drag.y,.95*db.cs/96,t,u.rank,0,db.skin[u.k])}
 drawCmdCut(c,g,t);
 if(g.banner&&!(g.introT>0)){const a=clamp(g.banner.t,0,1);c.globalAlpha=a;rr(c,W/2-330,232,660,g.banner.sub?96:64,18,'rgba(10,20,14,.85)','#ffcf4a',2);txt(c,g.banner.s,W/2,262,32,'#ffcf4a','center','#5a2a00');
  if(g.banner.sub){const sb=T(g.banner.sub);txt(c,sb.length>84?TX(sb.slice(0,82)+'…'):sb,W/2,302,14,'#e8f0d8')}c.globalAlpha=1}
 if(g.introT>0)drawIntro(c,g,t)}

