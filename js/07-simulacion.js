// Brotes Rebeldes · Simulación: tablero, fusión, combate, oleadas, modos, Auto-batalla y Taller.
"use strict";
// ============ BOARD ============
const COLS=5,ROWS=3;
function makeBoard(bx,by,cs,deck,isAI,lvlFn,dew){
 const m=cs*.58,w=COLS*cs,h=ROWS*cs;
 const pts=[[bx-m,by+h+cs*.15],[bx-m,by-m],[bx+w+m,by-m],[bx+w+m,by+h+cs*.15]];
 const segs=[];let L=0;for(let i=0;i<3;i++){const l=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);segs.push(l);L+=l}
 return{bx,by,cs,w,h,m,pts,segs,L,slots:Array(COLS*ROWS).fill(null),insects:[],shots:[],fx:[],queue:[],dew:dew||100,cost:10,lives:3,power:{},deck,isAI,lvl:lvlFn,kills:0,aiT:1,sel:-1,cmd:null,cmdCd:0,kk:{},pl:{},mr:{},gear:{},rel:[],skin:{},shield:0,slowRel:1}}
function posAt(b,d){let i=0;d=clamp(d,0,b.L);while(i<2&&d>b.segs[i]){d-=b.segs[i];i++}const p=b.pts[i],q=b.pts[i+1],f=d/b.segs[i];return[p[0]+(q[0]-p[0])*f,p[1]+(q[1]-p[1])*f,Math.atan2(q[1]-p[1],q[0]-p[0])]}
function slotXY(b,i){return[b.bx+(i%COLS)*b.cs+b.cs/2,b.by+Math.floor(i/COLS)*b.cs+b.cs/2]}
function slotAt(b,x,y){const c=Math.floor((x-b.bx)/b.cs),r=Math.floor((y-b.by)/b.cs);return c>=0&&c<COLS&&r>=0&&r<ROWS?r*COLS+c:-1}
function unitDmg(b,u){return UT[u.k].dmg*u.rank*(1+.12*(u.rank-1))*(1+.1*(b.lvl(u.k)-1))*(1+.25*((b.power[u.k]||1)-1))*(b.cmd==='poda'&&(u.k==='espina'||u.k==='trampa')?1.15:1)*(1+.12*gc(b,u.k,'fuerza'))*(b.rel.includes('petalo')?1.05:1)*(b.upD||1)*(PHV()?PH_D[Math.min(u.rank,5)]:1)}
function summon(b){const free=b.slots.map((s,i)=>s?-1:i).filter(i=>i>=0),cs=b.cmd==='reina'?Math.max(5,b.cost-5):b.cost;if(!free.length||b.dew<cs)return false;
 const i=spick(free);b.dew-=cs;b.cost+=b.cmd==='polen'?8:10;const k=spick(b.deck);b.slots[i]={k,rank:1,cd:.2+sr()*.6,gen:6,pop:.3};b.pl[k]=(b.pl[k]||0)+1;if(audible(b))sfx('plant');return true}
// ===================== EVOLUCIÓN POR FASES (partidas v:6, fuera de la Auto-batalla) =====================
// Fusionar dos unidades iguales de la misma fase da la MISMA unidad en la fase siguiente (máximo fase 5).
// Cada fase es más grande, cambia de aspecto y mejora: daño, cadencia, críticos (fase 4-5) y aura de velocidad (fase 5).
// Las repeticiones anteriores (v:5 o menos) siguen con las reglas viejas: fusión a unidad al azar y nivel máximo 7.
const PHV=()=>!!G&&!!G.o&&(G.o.v|0)>=6&&G.mode!=='auto';
// v:8 = reequilibrio (IA del duelo más gradual, comandantes y Lavanda). Las repeticiones v:7 o anteriores usan las reglas viejas.
const V8=()=>!!G&&!!G.o&&(G.o.v|0)>=8;
// v:9 = sinergias por rol.
const V9=()=>!!G&&!!G.o&&(G.o.v|0)>=9;
// Sinergias activas de un tablero: t[rol] = nivel 0–2; all = cadencia extra global (Apoyo); gen = rocío extra (Productor).
function synergyOf(b){const n=roleCounts(b.slots.map(s=>s&&s.k)),t={};let all=0,gen=0;
 for(const r in n){const v=synTier(n[r]);if(!v||!SYN[r])continue;t[r]=v;if(SYN[r].all)all=SYN[r].all[v-1];if(SYN[r].gen)gen=SYN[r].gen[v-1]}return{t,all,gen,n}}
const PH_MAX=5,PH_D=[1,1,1.15,1.35,1.6,2],PH_S=[1,1,1,1.1,1.2,1.3],PH_SZ=[1,1,1.06,1.12,1.18,1.25];
const PH_COL=['#bbbbbb','#8fd14f','#d08a40','#d8e0f0','#ffd23f','#c86aff'],PH_N=['','Brote','Bronce','Plata','Oro','Leyenda'],ROMAN=['','I','II','III','IV','V','VI','VII'];
function canMerge(b,i,j){const a=b.slots[i],o=b.slots[j];return i!==j&&!!a&&!!o&&a.k===o.k&&a.rank===o.rank&&a.rank<(PHV()?PH_MAX:7)}
// Mover a una casilla vacía, intercambiar con otra, o fusionar si se puede.
function placeAct(b,i,j,p){const A=x=>doAct(p?Object.assign(x,{p}):x);if(canMerge(b,i,j))return A({a:'m',i,j});if(!PHV()||i===j||!b.slots[i])return false;return A(b.slots[j]?{a:'sw',i,j}:{a:'mv',i,j})}
function merge(b,i,j){if(!canMerge(b,i,j))return false;const r=b.slots[j].rank+1;b.slots[i]=null;b.slots[j]={k:G&&(G.mode==='auto'||PHV())?b.slots[j].k:spick(b.deck),rank:r,cd:.3,gen:6,pop:.4};if(!b.isAI&&r>(b.maxR||1))b.maxR=r;if(audible(b))sfx('merge',r);const nk=b.slots[j].k;if(r>(b.mr[nk]||0))b.mr[nk]=r;
 const [x,y]=slotXY(b,j);for(let n=0;n<10;n++)b.fx.push({type:'spark',x,y,vx:rand(-120,120),vy:rand(-160,40),life:.5,col:RANKCOL[r]});return true}
function powerCost(b,k){return 100*(b.power[k]||1)}
function powerUp(b,k){const l=b.power[k]||1;if(l>=5||b.dew<powerCost(b,k))return false;b.dew-=powerCost(b,k);b.power[k]=l+1;if(audible(b))sfx('power');return true}

function spawnBug(b,k,hpm,d){const B=BUGS[k];const ins={k,def:B,d:d||0,hp:B.hp*hpm,max:B.hp*hpm,t:rand(0,9),slowT:0,pT:0,pDps:0,hit:0,sumT:6,cutT:8,dead:false,
 armor:(B.armor||0)+((G&&G.o&&G.o.armorAdd)||0),curlT:9,curl:0,dustT:8,healT:7};b.insects.push(ins);return ins}
function firstBug(b){let best=null;for(const i of b.insects)if(!i.dead&&!(i.bur>0)&&(!best||i.d>best.d))best=i;return best}
function strongBug(b){let best=null;for(const i of b.insects)if(!i.dead&&!(i.bur>0)&&(!best||i.hp>best.hp))best=i;return best}
function hurt(b,ins,a,pierce){if(ins.dead||ins.curl>0||ins.bur>0)return;if(ins.markT>0)a*=1+ins.mark;if(b.cmd==='espantap'&&ins.def.fly)a*=1.15;else if(b.cmd==='tormenta'&&ins.slowT>0)a*=1.1;if(!pierce&&ins.armor)a=Math.max(a*.25,a-ins.armor);if(ins.sh>0){const ab=Math.min(ins.sh,a);ins.sh-=ab;a-=ab}ins.hp-=a;if(!DOT)ins.hit=.08;dmgNum(b,ins,a);if(ins.hp<=0)kill(b,ins)}
function kill(b,ins){if(ins.dead)return;ins.dead=true;b.kills++;if(audible(b))sfx('kill');b.kk[ins.k]=(b.kk[ins.k]||0)+1;if(b.cmd==='brujo')b.dew+=1;const rw=Math.round(ins.def.rw*1.4*(1+.1*(G.wave-1)));b.dew+=rw;
 const [x,y]=posAt(b,ins.d);deathFx(b,ins,x,y);if(ins.def.stink)stinkFx(b,x,y);b.fx.push({type:'txt',x,y:y-10,s:'+'+rw,life:.8,col:'#9fe0ff'});
 for(let n=0;n<7;n++)b.fx.push({type:'spark',x,y,vx:rand(-90,90),vy:rand(-120,30),life:.45,col:ins.def.boss?'#ffcf4a':'#cfa'});
 if(ins.def.split)for(let n=0;n<2;n++)spawnBug(b,'cria',ins.max/BUGS.cucaracha.hp*.9,Math.max(0,ins.d-8-n*14))}

function updBoard(b,dt){
 const sc=b.cs/96;if(b.cmdCd>0)b.cmdCd-=dt*(b.rel.includes('brujula')?1.15:1);
 for(let i=b.queue.length-1;i>=0;i--)if(G.t>=b.queue[i].at){const q=b.queue[i];spawnBug(b,q.k,q.hpm);b.queue.splice(i,1)}
 const HS=b.insects.filter(o=>o.def.haste&&!o.dead),RL=b.insects.some(o=>o.def.rally&&!o.dead);
 for(const ins of b.insects){if(ins.dead)continue;ins.t+=dt;if(ins.hit>0)ins.hit-=dt;if(ins.kb>0)ins.kb-=dt*7;
  if(ins.pT>0){ins.pT-=dt;DOT=1;hurt(b,ins,ins.pDps*dt,true);DOT=0;if(ins.dead)continue}
  let sl=1;if(ins.slowT>0){ins.slowT-=dt;sl=ins.def.boss?.8:.55}if(ins.markT>0)ins.markT-=dt;
  if(ins.frz>0)ins.frz-=dt;else if(!(ins.curl>0))ins.d+=b.L/ins.def.t*dt*sl*G.spd*b.slowRel*(b.cmd==='guardian'&&ins.def.boss?.9:1)*bugSpd(b,ins,HS,RL,sc);if(ins.def.x)bugAbil(b,ins,dt,sc);
  if(ins.def.curl){if(ins.curl>0)ins.curl-=dt;else{ins.curlT-=dt;if(ins.curlT<=0){ins.curlT=9;ins.curl=2}}}
  if(ins.def.dust){ins.dustT-=dt;if(ins.dustT<=0){ins.dustT=8;const occ=b.slots.map((s,i)=>s?i:-1).filter(i=>i>=0);
   for(let n=0;n<3&&occ.length;n++){const j=Math.floor(sr()*occ.length),i=occ.splice(j,1)[0];b.slots[i].stun=3;const [x,y]=slotXY(b,i);for(let q=0;q<6;q++)b.fx.push({type:'spark',x,y:y-10,vx:rand(-60,60),vy:rand(-90,-20),life:.6,col:'#b8a0e0'})}}}
  if(ins.def.heal){ins.healT-=dt;if(ins.healT<=0){ins.healT=7;for(const o of b.insects){if(o.dead)continue;o.hp=Math.min(o.max,o.hp+o.max*(o.def.boss?.06:.12))}
   const [x,y]=posAt(b,ins.d);b.fx.push({type:'txt',x,y:y-40,s:'+ ♥',life:1,col:'#7fff6a',big:1})}}
  if(ins.def.summon){ins.sumT-=dt;if(ins.sumT<=0){ins.sumT=7;for(let n=0;n<3;n++)spawnBug(b,'mosquito',G.hpm*.6,Math.max(0,ins.d-10-n*12))}}
  if(ins.def.cut){ins.cutT-=dt;if(ins.cutT<=0){ins.cutT=8;const occ=b.slots.map((s,i)=>s?i:-1).filter(i=>i>=0);if(occ.length){const i=spick(occ);const [x,y]=slotXY(b,i);
   b.fx.push({type:'slash',x,y,life:.4});if(b.slots[i].rank>1)b.slots[i].rank--;else b.slots[i]=null}}}
  if(ins.d>=b.L){ins.dead=true;if(b.shield){b.shield=0;const e=b.pts[3];b.fx.push({type:'txt',x:e[0],y:e[1]-30,s:'🌳 ¡Bloqueado!',life:1.4,col:'#e0b070'})}else{b.lives-=ins.def.boss?3:ins.def.elite?2:1;if(audible(b)){sfx('leak');addShake(3)}b.fx.push({type:'flash',life:.4})}}}
 b.insects=b.insects.filter(i=>!i.dead);
 // Auras globales de personajes nuevos (Loto: cadencia, Roble: daño). Con los clásicos valen 0 y no cambian nada.
 let gS=0,gD=0;for(const s of b.slots)if(s){const U=UT[s.k];if(U.gspd)gS+=U.gspd*s.rank;if(U.gdmg)gD+=U.gdmg*s.rank}
 const SY=V9()?synergyOf(b):null;b.syn=SY;
 const CMc=b.cmd&&CMDS[b.cmd];let cS=CMc&&CMc.gS||0,cD=CMc&&CMc.gD||0;if(b.bSpdT>0){b.bSpdT-=dt;cS+=b.bSpd}if(b.bDmgT>0){b.bDmgT-=dt;cD+=b.bDmg}if(b.critT>0)b.critT-=dt;
 for(let i=0;i<b.slots.length;i++){const u=b.slots[i];if(!u)continue;if(u.pop>0)u.pop-=dt;if(u.af>0)u.af-=dt;if(u.stun>0){u.stun-=dt;continue}
  let spd=1,bD=0;const col=i%COLS,row=Math.floor(i/COLS);for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){const c2=col+dc,r2=row+dr;if(c2<0||c2>=COLS||r2<0||r2>=ROWS)continue;const n=b.slots[r2*COLS+c2];if(n&&n.rank>=5&&PHV())spd+=.08;if(n&&n.k==='sol')spd+=.08*n.rank;else if(n&&UT[n.k].bspd)spd+=UT[n.k].bspd*n.rank;if(n&&UT[n.k].bdmg)bD+=(n.k==='lavanda'&&V8()?LAV8:UT[n.k].bdmg)*n.rank}
  if(gS||cS)spd*=(1+gS)*(1+cS);if(SY){const r=synRole(UT[u.k].r),t=SY.t[r];if(t&&SYN[r].spd)spd*=1+SYN[r].spd[t-1];if(SY.all)spd*=1+SY.all}if(u.slowT>0){u.slowT-=dt;spd*=.5}
  if(i===b.sel&&!b.isAI){const U=UT[u.k];let dm=bD||gD||cD?unitDmg(b,u)*(1+bD+gD)*(1+cD):unitDmg(b,u);if(SY){const r=synRole(U.r),t=SY.t[r];if(t&&SYN[r].dmg)dm*=1+SYN[r].dmg[t-1]}
   const iv=U.int/(1+.08*(u.rank-1))/(1+.1*gc(b,u.k,'veloz'))/(PHV()?PH_S[Math.min(u.rank,5)]:1);u.ui={dm,rate:spd/iv,bD,stun:u.stun>0}}
  if(u.k==='rocio'){u.gen-=dt;if(u.gen<=0){u.gen=6;const g=Math.round(3*u.rank*(b.cmd==='lluvia'?1.5:1)*(b.cmd==='alquimista'?1.3:1)*(SY?1+SY.gen:1));b.dew+=g;const [x,y]=slotXY(b,i);b.fx.push({type:'txt',x,y:y-30*sc,s:'+'+g,life:.9,col:'#9fe0ff'})}}
  else if(UT[u.k].gen){u.gen-=dt;if(u.gen<=0){u.gen=6;const g=Math.round(UT[u.k].gen*u.rank*(b.cmd==='lluvia'?1.5:1)*(b.cmd==='alquimista'?1.3:1)*(SY?1+SY.gen:1));b.dew+=g;const [x,y]=slotXY(b,i);b.fx.push({type:'txt',x,y:y-30*sc,s:'+'+g,life:.9,col:'#ffe680'})}}
  u.cd-=dt*spd;if(u.cd<=0){const U=UT[u.k],tg=U.tgt==='strong'?strongBug(b):firstBug(b);if(tg){u.cd=U.int/(1+.08*(u.rank-1))/(1+.1*gc(b,u.k,'veloz'))/(PHV()?PH_S[Math.min(u.rank,5)]:1);const [x,y]=slotXY(b,i);
   let dm=bD||gD||cD?unitDmg(b,u)*(1+bD+gD)*(1+cD):unitDmg(b,u);if(SY){const r=synRole(U.r),t=SY.t[r];if(t&&SYN[r].dmg)dm*=1+SYN[r].dmg[t-1]}if(b.critT>0&&sr()<(V8()?.35:.25)+.02*((b.cmdLv||1)-1)){dm*=3;b._cr=1;b.fx.push({type:'txt',x,y:y-38*sc,s:'¡CRÍTICO!',life:.6,col:'#ff9aff'})}else if(PHV()&&u.rank>=4&&sr()<(u.rank>=5?.2:.1)){dm*=u.rank>=5?2.5:2;b._cr=1}
   if(U.m)fireNew(b,u,tg,x,y-20*sc,dm,sc);else b.shots.push({x,y:y-20*sc,tg,k:u.k,rank:u.rank,dmg:dm,bb:1+.15*gc(b,u.k,'certero'),cr:b._cr|0});
   b._cr=0;if(audible(b))sfx('shot',u.k);u.pop=.12;u.af=.3}else u.cd=0}}
 for(const s of b.shots){if(s.tg.dead){s.tg=firstBug(b);if(!s.tg){s.dead=true;continue}}
  const [tx,ty]=posAt(b,s.tg.d),dx=tx-s.x,dy=ty-s.y,dist=Math.hypot(dx,dy),v=(s.v||900)*sc*dt;
  if(dist<=v+4){s.dead=true;applyShot(b,s,tx,ty)}else{s.x+=dx/dist*v;s.y+=dy/dist*v}}
 b.shots=b.shots.filter(s=>!s.dead);
 for(const f of b.fx){f.life-=dt;if(f.vx!==undefined){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=(f.g===undefined?300:f.g)*dt;if(f.vr)f.rot+=f.vr*dt;if(f.gy!==undefined&&f.y>f.gy&&f.vy>0){f.y=f.gy;f.vy*=-.45;f.vx*=.6;if(f.vr)f.vr*=.6}}if(f.type==='txt')f.y-=30*dt}
 b.fx=b.fx.filter(f=>f.life>0);
}
function applyShot(b,s,x,y){const t=s.tg,sc=b.cs/96;HCRIT=s.cr|0;t.kb=1;if(t.def.boss&&s.bb>1)s.dmg*=s.bb;
 switch(s.k){
 case 'hielo':hurt(b,t,s.dmg);t.slowT=Math.max(t.slowT,(1.6+.35*s.rank)*(b.cmd==='escarcha'?1.3:1));break;
 case 'fuego':{const r=(45+5*s.rank)*sc;for(const o of b.insects){if(o.dead)continue;const [ox,oy]=posAt(b,o.d);const d=Math.hypot(ox-x,oy-y);if(o===t)hurt(b,o,s.dmg);else if(d<r)hurt(b,o,s.dmg*.6)}b.fx.push({type:'boom',x,y,r,life:.3,max:.3});break}
 case 'rayo':{const hitL=[t];hurt(b,t,s.dmg);let cur=t,dm=s.dmg;const n=1+Math.ceil(s.rank/2);
  for(let j=0;j<n;j++){let best=null,bd=110*sc;const [cx2,cy2]=posAt(b,cur.d);for(const o of b.insects){if(o.dead||hitL.includes(o))continue;const [ox,oy]=posAt(b,o.d);const d=Math.hypot(ox-cx2,oy-cy2);if(d<bd){bd=d;best=o}}
   if(!best)break;dm*=.75;const [bx2,by2]=posAt(b,best.d);b.fx.push({type:'bolt',x:cx2,y:cy2,x2:bx2,y2:by2,life:.15});hitL.push(best);hurt(b,best,dm);cur=best}break}
 case 'veneno':hurt(b,t,s.dmg);t.pDps=Math.max(t.pDps,s.dmg*1.6);t.pT=3;break;
 case 'trampa':if(!t.def.boss&&sr()<.025*s.rank){b.fx.push({type:'txt',x,y:y-12,s:'¡ÑAM!',life:.8,col:'#ff8080'});kill(b,t)}else hurt(b,t,s.dmg);break;
 default:if(s.m)applyNew(b,s,t,x,y,sc);else hurt(b,t,s.dmg)}
 burst(b,x,y,s.k,5+Math.floor(Math.random()*4));HCRIT=0}
// ===== Mecánicas de los personajes nuevos =====
function fireNew(b,u,tg,x,y,dmg,sc){const U=UT[u.k],P=U.p||{},base={x,y,k:u.k,rank:u.rank,dmg,bb:1+.15*gc(b,u.k,'certero'),m:U.m,v:U.sp||900,cr:b._cr|0};
 if(U.m==='multi'||U.m==='stars'){const al=b.insects.filter(o=>!o.dead);let ts;
  if(U.m==='multi')ts=al.sort((a,c)=>c.d-a.d).slice(0,P.n);else{ts=[];for(let j=0;j<P.n&&al.length;j++)ts.push(al[Math.floor(sr()*al.length)])}
  ts.forEach((t2,j)=>b.shots.push(Object.assign({},base,{tg:t2,x:x+(j-(ts.length-1)/2)*7})));return}
 if(U.instant){const [tx,ty]=posAt(b,tg.d);b.fx.push({type:U.pv==='ring'?'ring':'beam',x,y,x2:tx,y2:ty,r:U.pv==='ring'?260*sc:0,life:.22,max:.22,col:U.shot,w:U.pv==='bolt'?3:5});
  const s=Object.assign({},base,{tg});if(tg.def.boss&&s.bb>1)s.dmg*=s.bb;HCRIT=base.cr;tg.kb=1;applyNew(b,s,tg,tx,ty,sc);burst(b,tx,ty,u.k,5);HCRIT=0;return}
 b.shots.push(Object.assign({},base,{tg}))}
function applyNew(b,s,t,x,y,sc){const P=UT[s.k].p||{},R=s.rank;
 const near=(r)=>b.insects.filter(o=>{if(o.dead)return false;const [ox,oy]=posAt(b,o.d);return Math.hypot(ox-x,oy-y)<r});
 switch(s.m){
 case 'luck':hurt(b,t,s.dmg);if(t.dead){const g=P.v*R;b.dew+=g;b.fx.push({type:'txt',x,y:y-16,s:'+'+g,life:.8,col:'#ffe14a'})}break;
 case 'pierce':{const o2=b.insects.filter(o=>!o.dead&&o!==t&&o.d<t.d).sort((a,c)=>c.d-a.d).slice(0,P.n);hurt(b,t,s.dmg);for(const o of o2)hurt(b,o,s.dmg*.7);break}
 case 'aoe':{const r=(P.r+4*R)*sc;for(const o of near(r)){hurt(b,o,o===t?s.dmg:s.dmg*(P.f||.6));if(o.dead)continue;if(P.stun)o.frz=Math.max(o.frz||0,o.def.boss?P.stun*.4:P.stun);if(P.burn){o.pDps=Math.max(o.pDps,s.dmg*P.burn);o.pT=Math.max(o.pT,3)}}
  if(!near(r).length&&!t.dead)hurt(b,t,s.dmg);b.fx.push({type:'boom',x,y,r,life:.35,max:.35,col:UT[s.k].shot});break}
 case 'slowaoe':{const r=(P.r+4*R)*sc;for(const o of near(r)){hurt(b,o,s.dmg);if(!o.dead)o.slowT=Math.max(o.slowT,P.t+.2*R)}b.fx.push({type:'ring',x,y,r,life:.4,max:.4,col:'#bff4ff'});break}
 case 'knock':hurt(b,t,s.dmg);if(!t.dead&&!t.def.boss)t.d=Math.max(0,t.d-(P.dist+4*R)*sc);break;
 case 'mark':hurt(b,t,s.dmg);if(!t.dead){t.markT=P.t;t.mark=P.v+.03*R}break;
 case 'freeze':hurt(b,t,s.dmg);if(!t.dead){t.slowT=Math.max(t.slowT,1);if(sr()<P.c+.03*R)t.frz=Math.max(t.frz||0,t.def.boss?P.t*.4:P.t)}break;
 case 'poisonaoe':{const r=(P.r+5*R)*sc;for(const o of near(r)){hurt(b,o,s.dmg,true);if(!o.dead){o.pDps=Math.max(o.pDps,s.dmg*P.k);o.pT=Math.max(o.pT,3.5)}}b.fx.push({type:'ring',x,y,r,life:.45,max:.45,col:UT[s.k].shot});break}
 case 'chain':{const hit=[t];hurt(b,t,s.dmg);if(P.slow&&!t.dead)t.slowT=Math.max(t.slowT,P.slow);let cur=t,dm=s.dmg;const n=P.n+Math.ceil(R/2);
  for(let j=0;j<n;j++){let best=null,bd=120*sc;const [cx2,cy2]=posAt(b,cur.d);for(const o of b.insects){if(o.dead||hit.includes(o))continue;const [ox,oy]=posAt(b,o.d);const d=Math.hypot(ox-cx2,oy-cy2);if(d<bd){bd=d;best=o}}
   if(!best)break;dm*=.8;const [bx2,by2]=posAt(b,best.d);b.fx.push({type:'bolt',x:cx2,y:cy2,x2:bx2,y2:by2,life:.18,col:UT[s.k].shot});hit.push(best);hurt(b,best,dm);if(P.slow&&!best.dead)best.slowT=Math.max(best.slowT,P.slow);cur=best}break}
 case 'exec':if(!t.def.boss&&t.hp<=t.max*P.th+s.dmg*.5){b.fx.push({type:'txt',x,y:y-12,s:'¡ÑAM!',life:.8,col:'#ff8080',big:1});kill(b,t)}else hurt(b,t,s.dmg+(t.def.boss&&P.boss?t.max*P.boss:0));break;
 case 'snipe':hurt(b,t,t.def.boss?s.dmg*(P.bb||1):s.dmg);break;
 case 'shout':for(const o of b.insects){if(o.dead)continue;hurt(b,o,s.dmg);if(!o.dead)o.slowT=Math.max(o.slowT,P.t)}break;
 case 'freezeaoe':{const r=(P.r+4*R)*sc;for(const o of near(r)){hurt(b,o,s.dmg);if(!o.dead)o.frz=Math.max(o.frz||0,o.def.boss?P.t*.35:P.t)}b.fx.push({type:'ring',x,y,r,life:.5,max:.5,col:'#e8fbff'});break}
 case 'root':{const r=P.r*sc;for(const o of near(r)){hurt(b,o,o===t?s.dmg:s.dmg*.5);if(!o.dead)o.frz=Math.max(o.frz||0,o.def.boss?P.t*.3:P.t)}b.fx.push({type:'ring',x,y,r,life:.5,max:.5,col:'#6ad04a'});break}
 default:hurt(b,t,s.dmg)}}

// Habilidad activa del comandante (jugador o IA)
function useCmd(b){if(!b.cmd||b.cmdCd>0)return false;const C=CMDS[b.cmd],L=b.cmdLv||1,pw=cpw(L),sc=b.cs/96,mx=b.bx+b.w/2,my=b.by+b.h/2;
 const rankUp=(n,col)=>{let did=0;for(let k=0;k<n;k++){let lo=8;b.slots.forEach(s=>{if(s&&s.rank<lo)lo=s.rank});if(lo>=7)break;
  const c=b.slots.map((s,i)=>s&&s.rank===lo?i:-1).filter(i=>i>=0),i=spick(c),u=b.slots[i];u.rank++;u.pop=.5;did++;if(!b.isAI&&u.rank>(b.maxR||1))b.maxR=u.rank;if(u.rank>(b.mr[u.k]||0))b.mr[u.k]=u.rank;
  const [x,y]=slotXY(b,i);for(let n2=0;n2<12;n2++)b.fx.push({type:'spark',x,y,vx:rand(-120,120),vy:rand(-160,40),life:.6,col})}return did};
 switch(b.cmd){
 case 'lluvia':{const v8=V8(),g=Math.round((v8?50+10*G.wave:40+8*G.wave)*pw);b.dew+=g;for(const i of b.insects)i.slowT=Math.max(i.slowT,(v8?4:3)+.2*(L-1));b.fx.push({type:'txt',x:mx,y:my+34*sc,s:'+'+g,life:1.3,col:'#9fe0ff',big:1});
  for(let n=0;n<18;n++)b.fx.push({type:'spark',x:b.bx+Math.random()*b.w,y:b.by-20,vx:0,vy:rand(150,260),life:.7,col:'#7ad4ff'});break}
 case 'poda':for(const i of b.insects.slice())if(!i.dead)hurt(b,i,i.max*(i.def.boss?.1:.3)*pw,true);for(let n=0;n<5;n++)b.fx.push({type:'slash',x:b.bx+b.w*(n+.5)/5,y:my,life:.45});break;
 case 'escarcha':for(const i of b.insects)i.frz=(i.def.boss?2:4)+.25*(L-1);break;
 case 'polen':if(!rankUp(1+(L>=5)+(L>=10),'#ffd23f'))return false;break;
 case 'semillero':{let n=0;for(let k=0;k<2+(L>=5)+(L>=10);k++){const free=b.slots.map((s,i)=>s?-1:i).filter(i=>i>=0);if(!free.length)break;const i=spick(free),kk=spick(b.deck);b.slots[i]={k:kk,rank:1,cd:.3,gen:6,pop:.5};b.pl[kk]=(b.pl[kk]||0)+1;n++;
  const [x,y]=slotXY(b,i);for(let q=0;q<10;q++)b.fx.push({type:'spark',x,y,vx:rand(-100,100),vy:rand(-150,20),life:.6,col:'#c8a060'})}if(!n)return false;break}
 case 'espantap':{const v8=V8(),push=v8?220:60;for(const i of b.insects)if(!i.dead&&(!i.def.boss||v8)){i.d=Math.max(0,i.d-push*pw*sc*(i.def.boss?.35:1));if(v8)i.slowT=Math.max(i.slowT,2)}break}
 case 'herrera':b.bDmg=.4*pw;b.bDmgT=8;break;
 case 'brujo':for(const i of b.insects){i.markT=6+.3*(L-1);i.mark=.3*pw}break;
 case 'general':b.bSpd=1+.05*(L-1);b.bSpdT=6;break;
 case 'alquimista':{let n=0;for(const i of b.insects.slice())if(!i.dead&&!i.def.boss){hurt(b,i,i.max*.25*pw,true);n++}b.dew+=2*n;b.fx.push({type:'txt',x:mx,y:my+34*sc,s:'+'+2*n,life:1.3,col:'#4ae0ff',big:1});break}
 case 'tormenta':{const n=12+(L-1);for(let k=0;k<n;k++){const al=b.insects.filter(o=>!o.dead);if(!al.length)break;const o=al[Math.floor(sr()*al.length)],[x,y]=posAt(b,o.d);
  hurt(b,o,o.max*(o.def.boss?.04:.15)*pw,true);b.fx.push({type:'bolt',x:x+rand(-20,20),y:y-160,x2:x,y2:y,life:.3,col:'#bff8ff'})}break}
 case 'guardian':if(b.lives<3)b.lives++;else if(V8())b.shield=1;for(const i of b.insects)i.frz=Math.max(i.frz||0,((V8()?3:1.5)+.15*(L-1))*(i.def.boss?(V8()?.75:.5):1));b.fx.push({type:'ring',x:mx,y:my,r:260*sc,life:.6,max:.6,col:'#7aff6a'});break;
 case 'reina':{const n=b.slots.filter(Boolean).length;if(!rankUp((V8()?Math.ceil(n/2):n)*(L>=8?2:1),'#ff9ac0'))return false;break}
 case 'dragon':for(const i of b.insects.slice())if(!i.dead){hurt(b,i,i.max*(i.def.boss?.15*pw:Math.min(.95,.6*pw)),true);if(!i.dead){i.pDps=Math.max(i.pDps,i.max*.04);i.pT=Math.max(i.pT,3)}}
  for(let n=0;n<24;n++)b.fx.push({type:'spark',x:b.bx+Math.random()*b.w,y:b.by+Math.random()*b.h,vx:rand(-60,60),vy:rand(-120,-20),life:.7,col:n%2?'#7aff4a':'#ffd23f'});break;
 case 'cronos':for(const i of b.insects)i.frz=Math.max(i.frz||0,i.def.boss?2.5+.15*(L-1):5+.3*(L-1));b.fx.push({type:'ring',x:mx,y:my,r:300*sc,life:.8,max:.8,col:'#ffe680'});break;
 case 'oraculo':b.critT=(V8()?12:10)+.5*(L-1);break}
 b.cmdCd=ccd(V8()?C:{cd:CD_V7[b.cmd]||C.cd},L)*(b.upC||1);b.fx.push({type:'txt',x:mx,y:my,s:'¡'+C.an.toUpperCase()+'!',life:1.3,col:C.col,big:1});if(audible(b))sfx('cmd');return true}

// AI player logic
function aiAct(b){
 if(b.cmd&&b.cmdCd<=0&&b.insects.length>=6&&useCmd(b))return;
 if(b.dew>=b.cost&&b.slots.some(s=>!s)){summon(b);return}
 let best=null;for(let i=0;i<b.slots.length;i++)for(let j=0;j<b.slots.length;j++)if(canMerge(b,i,j)){const r=b.slots[i].rank;if(!best||r<best[2])best=[i,j,r]}
 if(best&&(b.slots.every(s=>s)||sr()<(b.mergeP||.5))){merge(b,best[0],best[1]);return}
 const counts={};b.slots.forEach(s=>{if(s)counts[s.k]=(counts[s.k]||0)+s.rank});
 const k=Object.keys(counts).sort((a,c)=>counts[c]-counts[a])[0];
 if(k&&b.dew>=powerCost(b,k)&&b.dew>b.cost*(b.powerMul||1.5))powerUp(b,k)}
// Kit del jugador (equipo, reliquias, aspectos) aplicado a un tablero.
function applyKit(b,gear,rel,skin){b.gear=gear||{};b.rel=rel||[];b.skin=skin||{};if(b.rel.includes('semilla'))b.dew+=30;if(b.rel.includes('corteza'))b.shield=1;if(b.rel.includes('caracol'))b.slowRel=.95}
// Perfil de estilo para el Rival espejo, sacado de las acciones grabadas en una repetición.
function mirrorProfile(r){const n={s:0,m:0,p:0,c:0};for(const a of r.acts)n[a.a]=(n[a.a]||0)+1;const last=r.acts.length?r.acts[r.acts.length-1].f:3600,min=Math.max(.5,last/3600);
 const apm=(n.s+n.m+n.p+n.c)/min,o=r.o;
 return{name:r.name||'Jardín',date:r.date,deck:o.deck.slice(),cmd:o.cmd||null,cmdLv:o.cmdLv||1,gear:o.gear||{},rel:o.rel||[],skin:o.skin||{},lv:o.lv||{},
  skill:Math.round(clamp(.35+apm/50,.35,1.05)*100)/100,mergeP:Math.round(clamp(n.m/Math.max(1,n.s+n.m)*1.6,.2,.95)*100)/100,
  powerMul:n.p===0?3:n.p/Math.max(1,n.s+n.m+n.p)>.12?1.15:1.6,useCmd:n.c>0,stats:n}}

// ============ GAME ============
let G=null,scene='menu',current=null,nextFn=null,lastRep=null,acc=0;
// "o" describe la partida completa y es serializable: con o + la lista de acciones se reproduce exactamente.
function newGame(o){
 o.seed=o.seed>>>0;SR=mulberry(o.seed);const lv=o.lv||{},L=k=>lv[k]||1;
 G={mode:o.mode,o,duel:o.mode==='duel'||o.mode==='ladder'||o.mode==='mirror'||o.mode==='versus',lvl:o.lvl||0,target:o.target||0,t:0,f:0,wave:0,waveT:6,spd:o.spd||1,hpBase:o.hpBase||1,hpm:1,fury:0,over:false,paused:false,speed:o.speed||1,
  interval:o.interval||22,rng:SR,drag:null,banner:null,boards:[],acts:[],replay:null,ai:0};
 if(o.mode==='auto')autoInit(o);
 else if(o.mode==='versus'){G.tier=0;G.cur=[7,7];G.boards.push(makeBoard(70,160,64,o.deck,false,()=>1,100));G.boards.push(makeBoard(570,160,64,o.deck2||o.deck,false,()=>1,100))}
 else if(o.mode==='mirror'){const m=o.mirror;G.tier=0;G.boards.push(makeBoard(70,160,64,o.deck,false,L,100));
  const ai=makeBoard(570,160,64,m.deck,true,k=>m.lv[k]||1,100);ai.aiSkill=m.skill;ai.mergeP=m.mergeP;ai.powerMul=m.powerMul;applyKit(ai,m.gear,m.rel,m.skin);
  if(m.useCmd&&m.cmd&&CMDS[m.cmd]){ai.cmd=m.cmd;ai.cmdLv=m.cmdLv||1;ai.cmdCd=15;cmdStart(ai)}G.boards.push(ai)}
 else if(G.duel){const tier=o.tier||0;G.tier=tier;
  G.boards.push(makeBoard(70,160,64,o.deck,false,L,100));
  const pool=(o.v>=4?aiPool(tier,o.v>=8):ORDER).slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(sr()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const v8=o.v>=8,aiLv=v8?AI8.lv(tier):1+tier;const ai=makeBoard(570,160,64,pool.slice(0,5),true,()=>aiLv,100);ai.aiSkill=v8?AI8.skill(tier):.35+tier*.07;G.boards.push(ai);
  if(o.v>=5){ai.cmd=spick(aiCmdPool(tier,v8));ai.cmdLv=v8?AI8.cmdLv(tier):1+Math.floor(tier*.8);ai.cmdCd=15;cmdStart(ai)}else if(o.v>=2){ai.cmd=spick(CMD_OLD);ai.cmdCd=15}}
 else{G.boards.push(makeBoard(240,148,96,o.deck,false,L,o.dew||100));if(o.up){const B=G.boards[0],u=o.up;B.dew+=15*(u.dew||0);B.cost=Math.max(5,B.cost-(u.cost||0));B.upD=1+.03*(u.dmg||0);B.upC=1-.04*(u.cmd||0)}};
 if(o.cmd&&CMDS[o.cmd]){const me=G.boards[0];me.cmd=o.cmd;me.cmdLv=o.cmdLv||1;me.cmdCd=15;if(o.v>=5)cmdStart(me)}
 applyKit(G.boards[0],o.gear,o.rel,o.skin);if(o.lives)G.boards[0].lives=o.lives;
 if(o.mode==='tutorial')G.tut=0;
 scene='game';acc=0;AU.mode='game';hideAll()}
// v:2 = partidas con comandante; v:3 = rotación de 6 jefes. Las repeticiones antiguas se siguen reproduciendo igual.
function baseOpts(mode,extra){const UP=upSnap(mode);return Object.assign({v:9,...(UP?{up:UP}:{}),cmdLv:save.cmd?save.cmdLv[save.cmd]||1:1,mode,seed:newSeed(),deck:save.deck.slice(),lv:Object.assign({},save.lv),speed:save.opts.spd,cmd:save.cmd&&cmdOn(save.cmd)?save.cmd:null,
 gear:featOn('gear')?Object.fromEntries(save.deck.filter(k=>save.eq[k]).map(k=>[k,save.eq[k].filter(Boolean)])):{},rel:featOn('relics')?save.relEq.slice():[],skin:Object.assign({},save.skin)},extra)}
function banner(s,sub,t){G.banner={s,sub,t:t||2.6}}
// ============ AUTO-BATALLA (fase 5) ============
// 8 jardines (tú + 7 IA). Ronda = tienda (compras, fusionas, vendes) + combate automático: todos defienden la misma oleada
// a la vez; por parejas gana quien deja escapar menos insectos. El perdedor pierde vida. Gana el último en pie.
const AUTO_NAMES=['Brezo','Malva','Tomillo','Salvia','Junco','Retama','Lirio','Romero','Acacia','Ortiga'];
const AUTO_HP=30,AUTO_COST=3,AUTO_RR=2,AUTO_UI={reroll:{x:640,y:458,w:250,h:38},go:{x:640,y:504,w:250,h:84},sell:{x:8,y:300,w:168,h:120}};
const autoLimit=r=>Math.min(12,2+r);
const autoSellV=r=>2*Math.pow(2,r-1);
const autoOffersRect=()=>[0,1,2,3,4].map(i=>({x:70+i*104,y:500,w:96,h:92}));
// ============ TALLER (fase 6): jardín libre, oleadas propias y duelo local ============
const SBX_DEW=[100,1000,99999],SBX_HP=[.5,1,2,5];
function startSandbox(){current=startSandbox;const s=save.sbx;G=null;
 newGame(baseOpts('sandbox',{deck:save.deck.slice(),dew:SBX_DEW[s.dew],infLives:!!s.inf,autoWaves:!!s.auto,hpBase:SBX_HP[s.hp],speed:1}));
 G.sbx={k:'espina',r:1,rm:false};banner('🌼 Jardín libre','Coloca plantas gratis, invoca insectos y prueba combinaciones. Sin premios.',3)}
function startCustom(set){current=()=>startCustom(set);const W=set.waves.filter(w=>w.length);if(!W.length){uiAlert('Este conjunto no tiene oleadas con insectos.');return}
 newGame(baseOpts('custom',{waves:JSON.parse(JSON.stringify(W)),target:W.length,hpBase:set.hp||1,setName:set.name}));banner(`📝 ${set.name}`,`Tus oleadas: sobrevive ${W.length}`,2.6)}
function startVersus(){current=startVersus;const n2=(document.getElementById('p2Name').value.trim()||'Jugador 2').slice(0,16);save.p2name=n2;persist();
 newGame(baseOpts('versus',{lv:{},cmd:null,gear:{},rel:[],speed:1,names:[save.name||'Jugador 1',n2]}));
 banner('👫 DUELO LOCAL',`${save.name||'Jugador 1'} (WASD) contra ${n2} (flechas)`,3)}
function startAuto(){current=startAuto;newGame(baseOpts('auto',{cmd:null,gear:{},rel:[],speed:1,pname:save.name||'Tú'}))}
function autoInit(o){const A=G.auto={round:0,phase:'shop',parts:[],resT:0,ft:0,maxT:0,pairs:[],last:null};const names=AUTO_NAMES.slice();
 for(let i=names.length-1;i>0;i--){const j=Math.floor(sr()*(i+1));[names[i],names[j]]=[names[j],names[i]]}
 for(let i=0;i<8;i++){const b=makeBoard(240+2000*i,148,96,ORDER.slice(),i>0,()=>1,0);b.lives=999;
  A.parts.push({i,name:i?names[i-1]:(o.pname||'Tú'),hp:AUTO_HP,gold:0,streak:0,alive:true,place:0,board:b,offers:[],pref:i?[spick(AP()),spick(AP())]:[],skill:i?.8+sr()*.2:1,leak:0,rk:0,k0:0});G.boards.push(b)}
 A.me=A.parts[0];autoRound()}
const autoCount=p=>p.board.slots.filter(Boolean).length;
function autoOffers(){return[0,1,2,3,4].map(()=>spick(AP()))}
// Desde v:4 la Auto-batalla usa los 20 personajes cobre y plata; las repeticiones antiguas, los 8 clásicos.
const AP=()=>G.o.v>=4?CP:ORDER;
function autoRound(){const A=G.auto;A.round++;G.wave=A.round;
 for(const p of A.parts){if(!p.alive)continue;p.gold+=5+(A.round===1?3:0)+Math.min(3,Math.floor(p.gold/10))+(p.streak>=2?1:0);p.offers=autoOffers()}
 A.phase='shop';banner(`Ronda ${A.round}`,`Compra plantas (${AUTO_COST} 💰), fusiona dos iguales y pulsa ¡LISTO! · Máximo ${autoLimit(A.round)} plantas`,3)}
function autoBuy(p,i){const k=p.offers[i],b=p.board;if(!k||p.gold<AUTO_COST||autoCount(p)>=autoLimit(G.auto.round))return false;const s=b.slots.findIndex(x=>!x);if(s<0)return false;
 p.gold-=AUTO_COST;p.offers[i]=null;b.slots[s]={k,rank:1,cd:.2+sr()*.6,gen:6,pop:.4};b.pl[k]=(b.pl[k]||0)+1;if(audible(b))sfx('plant');return true}
function autoReroll(p){if(p.gold<AUTO_RR)return false;p.gold-=AUTO_RR;p.offers=autoOffers();return true}
function autoSell(p,i){const u=p.board.slots[i];if(!u)return false;p.gold+=autoSellV(u.rank);p.board.slots[i]=null;if(p.board.sel===i)p.board.sel=-1;return true}
function autoMergeAny(b){for(let i=0;i<b.slots.length;i++)for(let j=0;j<b.slots.length;j++)if(canMerge(b,i,j))return merge(b,i,j);return false}
function aiShop(p){let rr=0;const lim=autoLimit(G.auto.round);
 for(let guard=0;guard<40;guard++){if(autoMergeAny(p.board))continue;
  const owned=new Set(p.board.slots.filter(Boolean).map(u=>u.k)),room=autoCount(p)<lim;
  let i=p.offers.findIndex(k=>k&&(owned.has(k)||p.pref.includes(k)));
  if(room&&p.gold>=AUTO_COST&&i>=0){autoBuy(p,i);continue}
  if(p.gold>=AUTO_COST+AUTO_RR&&rr<2){autoReroll(p);rr++;continue}
  i=p.offers.findIndex(k=>k);if(room&&p.gold>=AUTO_COST&&i>=0&&sr()<p.skill){autoBuy(p,i);continue}
  if(room&&p.gold>=AUTO_COST+AUTO_RR&&sr()<p.skill){autoReroll(p);continue}
  break}}
function autoWave(r){const bl=BOSSES6,pool=['hormiga','mosquito'];if(r>=2)pool.push('mariquita');if(r>=3)pool.push('cucaracha');if(r>=5)pool.push('escarabajo');
 const list=[];if(r%4===0)list.push({k:bl[(r/4-1)%bl.length],delay:0});const n=Math.min(30,6+r*2);
 for(let i=0;i<n;i++)list.push({k:pool[Math.floor(sr()*pool.length)],delay:(list.length?1.5:0)+i*.8});return list}
function autoFight(){const A=G.auto;for(const p of A.parts)if(p.alive&&p!==A.me)aiShop(p);
 const al=A.parts.filter(p=>p.alive);for(let i=al.length-1;i>0;i--){const j=Math.floor(sr()*(i+1));[al[i],al[j]]=[al[j],al[i]]}
 A.pairs=[];for(let i=0;i<al.length;i+=2)A.pairs.push([al[i],al[i+1]||null]);
 G.hpm=Math.pow(1.16,A.round-1);const list=autoWave(A.round);
 for(const p of A.parts){const b=p.board;b.insects=[];b.shots=[];b.queue=[];b.lives=999;b.sel=-1;if(!p.alive)continue;p.k0=b.kills;
  for(const e of list)b.queue.push({at:G.t+1.5+e.delay,k:e.k,hpm:G.hpm})}
 A.ft=G.t;A.maxT=list[list.length-1].delay+40;A.phase='fight';G.drag=null;
 const op=autoOpp(A.me);banner(`Ronda ${A.round}: ¡combate!`,op?`Tu rival: ${op.name} (${op.hp} ❤)`:'Este turno te enfrentas a un fantasma',2.4);return true}
function autoOpp(p){const pr=G.auto.pairs.find(x=>x.includes(p));return pr?(pr[0]===p?pr[1]:pr[0]):null}
function autoResolve(){const A=G.auto;
 for(const p of A.parts){if(!p.alive)continue;const b=p.board;p.leak=(999-b.lives)+b.insects.filter(i=>!i.dead).length+b.queue.length;p.rk=b.kills-p.k0}
 const res={};
 for(const [a,b0] of A.pairs){let b=b0,ghost=false;if(!b){const others=A.parts.filter(p=>p.alive&&p!==a);if(!others.length)continue;b=spick(others);ghost=true}
  let w;if(a.leak!==b.leak)w=a.leak<b.leak?a:b;else if(a.rk!==b.rk)w=a.rk>b.rk?a:b;else w=sr()<.5?a:b;const l=w===a?b:a;
  const dmg=1+Math.ceil(A.round/2)+Math.floor(autoCount(w)/2);
  if(!(ghost&&l===b)){l.hp-=dmg;l.streak=0;res[l.i]={won:false,vs:w.name,dmg}}
  if(!(ghost&&w===b)){w.streak++;res[w.i]={won:true,vs:l.name}}}
 const dead=A.parts.filter(p=>p.alive&&p.hp<=0).sort((x,y)=>y.hp-x.hp);for(const p of dead)p.alive=false;
 const left=A.parts.filter(p=>p.alive).length;dead.forEach((p,k)=>p.place=left+1+k);if(left===1)A.parts.find(p=>p.alive).place=1;
 for(const p of A.parts){p.board.insects=[];p.board.shots=[];p.board.queue=[]}
 const r=res[0];A.last=r;A.phase='result';A.resT=3.5;if(r)sfx(r.won?'wave':'leak');
 if(!A.me.alive)banner('¡Eliminado!',`Terminaste en el puesto ${A.me.place}.º de 8`,3.5);
 else if(left===1)banner('¡CAMPEÓN!','¡Tu jardín es el último en pie!',3.5);
 else if(r)banner(r.won?'¡Ronda ganada!':`Ronda perdida: −${r.dmg} ❤`,`${r.won?'Venciste a':'Te venció'} ${r.vs} · Escaparon ${A.me.leak} insectos · Quedan ${left} jardines`,3.2)}
function autoUpdate(dt){const g=G,A=g.auto;g.t+=dt;if(g.banner){g.banner.t-=dt;if(g.banner.t<=0)g.banner=null}
 if(A.phase==='fight'){for(const p of A.parts)if(p.alive)updBoard(p.board,dt);
  if(A.parts.every(p=>!p.alive||(!p.board.queue.length&&!p.board.insects.length))||g.t-A.ft>A.maxT)autoResolve()}
 else if(A.phase==='result'){updBoard(A.me.board,dt);A.resT-=dt;if(A.resT<=0){if(!A.me.alive||A.parts.filter(p=>p.alive).length<=1)return endGame(A.me.place===1);autoRound()}}
 else updBoard(A.me.board,dt)}
function autoAct(a){const A=G.auto,p=A.me;if(A.phase!=='shop')return false;
 if(a.a==='buy')return autoBuy(p,a.i);if(a.a==='rr')return autoReroll(p);if(a.a==='sell')return autoSell(p,a.i);if(a.a==='m')return merge(p.board,a.i,a.j);
 if(a.a==='mv'){const s=p.board.slots;if(!s[a.i]||s[a.j])return false;s[a.j]=s[a.i];s[a.i]=null;return true}
 if(a.a==='go')return autoFight();return false}
function startEvent(){current=startEvent;const e=curEvent();newGame(baseOpts('event',Object.assign({target:15,event:e.id},e.o)));
 banner(`${e.ic} ${e.n}`,`${e.d} · Sobrevive 15 oleadas`,3.5)}
function mirrorPool(){return replays.filter(r=>r&&r.o&&!['tutorial','auto','versus','sandbox'].includes(r.o.mode)&&Array.isArray(r.acts)&&r.acts.length>=8&&Array.isArray(r.o.deck))}
function startMirror(r){const pool=mirrorPool();if(!pool.length){uiAlert('Primero juega alguna partida (que no sea el tutorial): el Rival espejo aprende de tus repeticiones.');return}
 r=r||pick(pool);current=()=>startMirror(r);const m=mirrorProfile(r);newGame(baseOpts('mirror',{mirror:m,speed:1}));
 banner('👥 RIVAL ESPEJO',`Tu reflejo del ${m.date}: mazo ${m.deck.map(k=>UT[k].n).join(', ')}`,3.5)}
function startDuel(){current=startDuel;const d=dif();newGame(baseOpts('duel',{tier:d.ai,speed:1}));banner('¡DUELO AMISTOSO!',`Contra la IA (${d.n}, nivel ${d.ai+1}) · No cuenta para la Escalera`)}
function startLadder(){current=startLadder;const tier=Math.min(9,Math.floor(save.trophies/80));newGame(baseOpts('ladder',{tier,speed:1}));
 banner('¡ESCALERA!',`División ${DIVS[divOf(save.trophies)][1]} · ${save.trophies} 🏆 · IA nivel ${tier+1}`)}
function startCampaign(ch,i){if(i===undefined){i=ch;ch=0}current=()=>startCampaign(ch,i);const C=CHAPTERS[ch],L=C.lv[i];
 newGame(baseOpts('campaign',{ch,lvl:i,target:L.w,hpBase:((CAMP_HP[ch]||[])[i]||C.hp*(1+i*.05))*dif().hp,bosses:C.bosses}));banner(`${C.ic} ${C.n} · Nivel ${i+1}`,`${L.n} · Sobrevive ${L.w} oleadas · ${dif().n}`)}
function startSurvival(seed){current=()=>startSurvival(seed);newGame(baseOpts('survival',Object.assign({hpBase:dif().hp},seed!==undefined?{seed}:{})));
 banner('Supervivencia',`¿Cuántas oleadas aguantas? Récord: ${save.bestSurv} · ${dif().n}`)}
function dayKey(){const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`}
function startDaily(){current=startDaily;let seed=0;for(const ch of dayKey())seed=seed*31+ch.charCodeAt(0)|0;const rng=mulberry(seed);
 const keys=Object.keys(MODS),mods=[];while(mods.length<2){const k=keys[Math.floor(rng()*keys.length)];if(!mods.includes(k))mods.push(k)}
 let deck=save.deck.slice();if(mods.includes('sorpresa'))deck=ORDER.slice().sort(()=>rng()-.5).slice(0,5);
 newGame(baseOpts('daily',{seed,target:12,deck,spd:mods.includes('rapidos')?1.3:1,hpBase:mods.includes('blindados')?1.4:1,dew:mods.includes('rico')?300:100,interval:mods.includes('frenesi')?16:22}));
 banner('Desafío diario','Sobrevive 12 oleadas · '+mods.map(k=>MODS[k]).join(' · '),4)}
const TUT=['Pulsa PLANTAR (o la barra espaciadora) dos veces para poner dos plantas.','Arrastra una planta sobre otra igual para fusionarlas: sube a la fase 2. También puedes arrastrarla a otra casilla para moverla.','Toca la carta de abajo (⬆) para potenciar ese tipo de planta. Te regalamos 💧100.','¡Bien! Ahora defiende 5 oleadas. La 5.ª trae un jefe: sigue plantando y fusionando.'];
function startTutorial(){current=startTutorial;newGame(baseOpts('tutorial',{deck:['espina'],lv:{},dew:200,target:5,hpBase:.7,speed:1,cmd:null,gear:{},rel:[]}));G.tut=0;banner('Tutorial','Aprende lo básico en 4 pasos',2.2)}
function startReplay(r){current=()=>startReplay(r);newGame(JSON.parse(JSON.stringify(r.o)));G.replay=r;G.speed=1;banner('🎬 Repetición',`${modeLabel(r.o)} · ${r.date}`,2)}
function modeLabel(o){if(o.mode==='campaign')return `Campaña · ${CHAPTERS[o.ch||0].n} ${(o.lvl||0)+1}`;if(o.mode==='event'){const e=EVENTS.find(x=>x.id===o.event);return `Evento · ${e?e.n:''}`}
 if(o.mode==='mirror'&&o.mirror)return `Rival espejo · ${o.mirror.name}`;return MODE_N[o.mode]||o.mode}
// Acciones del jugador: se aplican y, si funcionan, se graban con el número de paso para la repetición.
function applyAct(a){if(G.mode==='auto')return autoAct(a);const me=G.boards[a.p||0];
 if(G.mode==='sandbox'){
  if(a.a==='place'){if(me.slots[a.i]||!UT[a.k])return false;me.slots[a.i]={k:a.k,rank:clamp(a.r|0,1,7),cd:.3,gen:6,pop:.4};return true}
  if(a.a==='rm'){if(!me.slots[a.i])return false;me.slots[a.i]=null;return true}
  if(a.a==='spawn'){if(!BUGS[a.k])return false;spawnBug(me,a.k,G.hpBase*Math.pow(1.12,Math.max(0,G.wave-1)));return true}
  if(a.a==='wave'){nextWave();return true}
  if(a.a==='dew'){me.dew+=500;return true}}if(a.a==='mv'&&PHV()){const S=me.slots;if(a.i===a.j||!S[a.i]||S[a.j])return false;S[a.j]=S[a.i];S[a.i]=null;return true}
 if(a.a==='sw'&&PHV()){const S=me.slots;if(a.i===a.j||!S[a.i]||!S[a.j]||canMerge(me,a.i,a.j))return false;const tmp=S[a.i];S[a.i]=S[a.j];S[a.j]=tmp;return true}
 if(a.a==='s')return summon(me);if(a.a==='m')return merge(me,a.i,a.j);if(a.a==='p')return powerUp(me,a.k);if(a.a==='c')return useCmd(me);return false}
function doAct(a){if(!G||G.replay||G.over||G.paused)return false;const ok=applyAct(a);if(ok)G.acts.push(Object.assign({f:G.f},a));return ok}
const STEP=1/60;
function step(){if(G.replay){const A=G.replay.acts;while(G.ai<A.length&&A[G.ai].f<=G.f){applyAct(A[G.ai]);G.ai++}}update(STEP);G.f++}

// Composición de las oleadas: qué insectos pueden salir en la oleada w (orden fijo, lo usa el azar de genWave).
function waveCfg(){return{be:G.o.bossEvery||5,bl:G.o.bosses||(G.o.v>=7?BOSSES9:G.o.v>=3?BOSSES6:BOSSES),cm:G.o.countMul||1}}
function wavePool(w){const pool=['hormiga'];if(w>=2)pool.push('mosquito');if(w>=3)pool.push('mariquita');if(w>=6)pool.push('cucaracha');if(w>=7)pool.push('escarabajo');
 if(G.o.v>=7){if(w>=2)pool.push('pulgon');if(w>=4)pool.push('grillo');if(w>=5)pool.push('caracol');if(w>=8)pool.push('luciernaga');if(w>=9)pool.push('chinche');if(w>=11)pool.push('oruga')}return pool}
const eliteOf=w=>G.o.v>=7&&w>=3&&w%5===3?ELITES[Math.floor(w/5)%ELITES.length]:null;
// Vista previa de la próxima oleada para la interfaz. No consume el azar de la partida, así no cambia el resultado.
function nextWaveInfo(){const g=G;if(!g||g.mode==='auto')return null;const w=g.wave+1;if(g.target&&w>g.target)return null;
 if(g.o.waves){const gs=g.o.waves[w-1]||[];return gs.length?{w,list:gs.map(x=>[x.k,x.n])}:null}
 const {be,bl,cm}=waveCfg();if(w%be===0)return{w,boss:bl[(w/be-1)%bl.length]};
 const pool=wavePool(w),prev=w>1?wavePool(w-1):[];return{w,n:Math.floor((7+w*.9)*cm),neu:w>1?pool.filter(k=>!prev.includes(k)):[],elite:eliteOf(w)}}
function genWave(w){const R=G.rng;
 if(G.o.waves){const L=[];let d=0;for(const gr of(G.o.waves[w-1]||[]))for(let n=0;n<gr.n;n++){L.push({k:gr.k,delay:d});d+=BUGS[gr.k].boss?2.5:.8}return L}
 const {be,bl,cm}=waveCfg();
 if(w%be===0){const k=bl[(w/be-1)%bl.length];return[{k,delay:0},...[0,1,2,3].map(i=>({k:'hormiga',delay:2+i}))]}
 const pool=wavePool(w);
 const n=Math.floor((7+w*.9)*cm),L=[...Array(n)].map((_,i)=>({k:pool[Math.floor(R()*pool.length)],delay:i*.85/Math.sqrt(cm)}));
 const el=eliteOf(w);if(el){L.forEach(e=>e.delay+=1.5);L.unshift({k:el,delay:0})}return L}
function nextWave(){G.wave++;const w=G.wave;
 if(G.duel&&G.t>=180){G.fury++;if(G.fury===1)banner('¡FRENESÍ!','Los insectos se hacen más fuertes en cada oleada')}
 G.hpm=Math.pow(1.12,w-1)*G.hpBase*Math.pow(1.6,G.fury);
 const list=genWave(w);
 const bossE=list.find(e=>BUGS[e.k].boss);
 const eliE=list.find(e=>BUGS[e.k].elite);if(bossE){banner(`Oleada ${w}: ¡JEFE!`,BUGS[bossE.k].n,2.2);sfx('boss')}else if(eliE){banner(`Oleada ${w}: ¡Semijefe!`,BUGS[eliE.k].n,2);sfx('elite')}else if(w>1)sfx('wave');
 for(const b of G.boards){list.forEach(e=>b.queue.push({at:G.t+e.delay,k:e.k,hpm:G.hpm}));if(w>1)b.dew+=(20+w*5)*(b.rel.includes('gota')?1.15:1);if(b.cmd==='oraculo')b.dew+=15}
 G.waveT=bossE?G.interval+12:G.interval}
function update(dt){const g=G;if(g.over)return;if(g.mode==='auto')return autoUpdate(dt);g.t+=dt;if(g.banner){g.banner.t-=dt;if(g.banner.t<=0)g.banner=null}
 const solo=!g.duel;
 if(g.tut!==undefined&&g.tut<3){const me=g.boards[0];
  if(g.tut===0&&me.slots.filter(s=>s).length>=2)g.tut=1;
  else if(g.tut===1&&me.slots.some(s=>s&&s.rank>=2)){g.tut=2;me.dew+=100}
  else if(g.tut===2&&(me.power.espina||1)>=2)g.tut=3}
 if(!(g.target&&g.wave>=g.target)&&!(g.tut<3)&&!(g.mode==='sandbox'&&!g.o.autoWaves)){g.waveT-=dt;const clear=g.boards.every(b=>!b.insects.length&&!b.queue.length);if(clear&&g.wave>0&&g.waveT>2.5)g.waveT=2.5;if(g.waveT<=0)nextWave()}
 for(const b of g.boards){updBoard(b,dt);
  if(b.isAI){b.aiT-=dt;if(b.aiT<=0){b.aiT=(.3+sr()*.6)/b.aiSkill*.5;aiAct(b)}}}
 const me=g.boards[0];if(g.mode==='sandbox'&&g.o.infLives)me.lives=3;
 if(me.lives<=0)return endGame(false);
 if(g.duel&&g.boards[1].lives<=0)return endGame(true);
 if(solo&&g.target&&g.wave>=g.target&&!me.insects.length&&!me.queue.length)endGame(true)}
function endGame(won){const c0=save.coins,was=G&&G.over;endGame0(won);const l=upLv('oro'),gained=save.coins-c0;if(!was&&l&&gained>0&&!(G&&G.replay)){const x=Math.floor(gained*.06*l);if(x){save.coins+=x;persist();const el=document.getElementById('resText');if(el)el.insertAdjacentHTML('beforeend',`<br>💰 +${x} por la Bolsa de semillas.`);document.querySelectorAll('.coinv').forEach(e=>e.textContent=save.coins)}}}
function endGame0(won){const g=G;if(g.over)return;g.over=true;let title,text='',next=null;const me=g.boards[0];sfx(won?'win':'lose');
 if(g.replay){lastRep=g.replay;setTimeout(()=>showResult(won?'Fin de la repetición · Victoria':'Fin de la repetición · Derrota',`Oleada ${g.wave} · Insectos eliminados: ${me.kills}<br><span style="font-size:14px;opacity:.75">Semilla: ${g.o.seed}</span>`,null,false),900);return}
 // Modos del Taller: sin monedas, experiencia ni cofres (para que no sirvan para «farmear»).
 if(g.mode==='sandbox'||g.mode==='custom'||g.mode==='versus'){let keep=g.mode!=='sandbox';
  if(g.mode==='sandbox'){title='Fin del jardín libre';text=`Llegaste a la oleada ${g.wave} · Insectos eliminados: ${me.kills}`}
  else if(g.mode==='custom'){title=won?'¡Superaste tus oleadas!':'Los insectos ganaron';text=`${esc(g.o.setName||'')} · Oleada ${g.wave} de ${g.target} · Insectos eliminados: ${me.kills}`}
  else{const w=won?0:1,N=g.o.names;title=`¡Gana ${N[w]}!`;text=`${esc(N[0])}: ${me.kills} insectos · ${esc(N[1])}: ${g.boards[1].kills} insectos · Oleada ${g.wave}`}
  const st=save.stats;st.played[g.mode]=(st.played[g.mode]||0)+1;if(won)st.won[g.mode]=(st.won[g.mode]||0)+1;
  text+=`<div style="font-size:13px;opacity:.7;margin-top:6px">Modo del Taller: sin premios · Semilla: ${g.o.seed}</div>`;
  if(keep){lastRep={id:Date.now(),date:new Date().toLocaleString('es'),name:save.name,o:g.o,acts:g.acts,won,wave:g.wave,kills:me.kills};replays.unshift(lastRep);replays.splice(20);persistReplays()}
  persist();setTimeout(()=>showResult(title,text,null,keep),900);return}
 const c0=save.coins,t0=save.trophies,L0=plLevel(),P0=passLevel(),unl=[];let bonus=0;
 if(g.mode==='ladder'){const d0=divOf(save.trophies);
  if(won){save.trophies+=30;save.coins+=60;title='¡Victoria!'}else{save.trophies=Math.max(0,save.trophies-15);save.coins+=10;title='Derrota'}
  save.bestTrophies=Math.max(save.bestTrophies,save.trophies);const d1=divOf(save.trophies);
  text=`Oleada alcanzada: ${g.wave} · Insectos eliminados: ${me.kills}<br>División ${DIVS[d1][1]} · ${save.trophies} 🏆`;
  if(d1>d0)unl.push(`⬆ ¡Subiste a la división <b>${DIVS[d1][1]}</b>!`);else if(d1<d0)text+=`<br>⬇ Bajaste a ${DIVS[d1][1]}.`}
 else if(g.mode==='auto'){const A=g.auto,pl=A.me.place||1;save.coins+=[150,90,70,50,30,20,15,10][pl-1];
  title=pl===1?'¡Campeón de la Auto-batalla!':`¡${pl}.º puesto!`;text=`Aguantaste ${A.round} ronda${A.round>1?'s':''} · Insectos eliminados: ${me.kills}`;
  if(pl<=4)unl.push(pl===1?'🏅 ¡Tu jardín fue el último en pie!':'🏅 ¡Quedaste entre los 4 mejores!')}
 else if(g.mode==='mirror'){if(won){save.coins+=40;title='¡Venciste a tu reflejo!'}else{save.coins+=10;title='Tu reflejo ganó'}
  text=`Reflejo del ${esc(g.o.mirror.date)} · Oleada ${g.wave} · Insectos eliminados: ${me.kills}`}
 else if(g.mode==='event'){const e=EVENTS.find(x=>x.id===g.o.event)||curEvent(),wk=weekIdx();text=`${e.ic} ${e.n} · Oleada ${g.wave} de 15`;
  if(won){title='¡Evento superado!';if(save.eventWeek!==wk){save.eventWeek=wk;save.coins+=200;save.gems=(save.gems||0)+40;text+='<br>💎 +40 gemas premium.';bonus=1}else{save.coins+=30;save.gems=(save.gems||0)+5;text+='<br>Ya cobraste el premio grande de esta semana. 💎 +5 gemas.'}}else title='Derrota'}
 else if(g.mode==='duel'){if(won){save.coins+=20;title='¡Victoria!'}else{save.coins+=5;title='Derrota'}
  text=`Oleada alcanzada: ${g.wave} · Insectos eliminados: ${me.kills}`}
 else if(g.mode==='tutorial'){if(won){title='¡Tutorial completado!';if(!save.tut){save.tut=1;save.coins+=50}text='Ya sabes plantar, fusionar y potenciar.'}
  else{title='Casi…';text='Los insectos ganaron esta vez. Prueba otra vez: fusiona pronto.'}}
 else if(g.mode==='campaign'){const ch=g.o.ch||0,C=CHAPTERS[ch];
  if(won){const first=g.lvl>=clr(ch);title=g.lvl===9?`¡Capítulo «${C.n}» completado!`:'¡Nivel superado!';text=`${C.ic} ${C.n} · Nivel ${g.lvl+1}: ${C.lv[g.lvl].n}`;
   if(first&&g.lvl===9&&CHAPTERS[ch+1])unl.push(`${CHAPTERS[ch+1].ic} ¡Nuevo capítulo: <b>${CHAPTERS[ch+1].n}</b>!`);
   if(first){setClr(ch,g.lvl+1);save.coins+=100*(ch+1);bonus=1;const un=C.lv[g.lvl].un;if(un&&!save.unlocked.includes(un)){save.unlocked.push(un);unl.push(`🌱 ¡Nueva planta: <b>${UT[un].n}</b>! ${UT[un].d} Añádela a tu mazo en «Mazo y mejoras».`)}}
   else save.coins+=25*(ch+1);if(g.lvl<9)next=()=>startCampaign(ch,g.lvl+1);else if(CHAPTERS[ch+1])next=()=>startCampaign(ch+1,0)}
  else{title='Derrota';text=`Llegaste a la oleada ${g.wave} de ${g.target}.<br>Consejo: fusiona pronto y potencia tu planta más numerosa.`}}
 else if(g.mode==='survival'){const w=Math.max(0,g.wave-1);title='Fin de la partida';save.coins+=w*8;text=`Oleadas superadas: ${w}`;if(w>save.bestSurv){save.bestSurv=w;unl.push('🏅 ¡Nuevo récord de Supervivencia!')}else text+=` · Récord: ${save.bestSurv}`}
 else if(g.mode==='daily'){if(won){title='¡Desafío superado!';if(save.daily!==dayKey()){save.daily=dayKey();save.coins+=150;save.gems=(save.gems||0)+5;text+='<br>💎 +5 gemas premium.';bonus=1}else text='Ya cobraste la recompensa de hoy. ¡Vuelve mañana!'}else{title='Derrota';text=`Llegaste a la oleada ${g.wave} de 12.`}}
 const st=save.stats;st.played[g.mode]=(st.played[g.mode]||0)+1;if(won)st.won[g.mode]=(st.won[g.mode]||0)+1;st.kills+=me.kills;st.bestRank=Math.max(st.bestRank,me.maxR||1);
 for(const k in me.kk)st.kk[k]=(st.kk[k]||0)+me.kk[k];for(const k in me.pl)st.pl[k]=(st.pl[k]||0)+me.pl[k];for(const k in me.mr)st.mr[k]=Math.max(st.mr[k]||0,me.mr[k]);
 for(const q of questOnEnd(g,won,me))unl.push(q);
 // Experiencia y desbloqueos
 const xp=g.mode==='tutorial'?(won?60:15):10+g.wave*4+(won?25:0);save.xp+=xp;const L1=plLevel();
 if(L1>L0){unl.unshift(`⭐ ¡Subiste al <b>nivel ${L1}</b>!`);
  for(const f in FEATS)if(FEATS[f].lv>L0&&FEATS[f].lv<=L1)unl.push(`🔓 Nueva función: <b>${FEATS[f].n}</b>. ${FEATS[f].d||''}`);
  if(featOn('cmd',L1)&&!featOn('cmd',L0)&&!save.cmds.includes('lluvia'))save.cmds.push('lluvia');
  for(const k in CMDS)if(cmdOn(k,L1)&&!cmdOn(k,L0))unl.push(`${CMDS[k].ic} Nuevo comandante: <b>${CMDS[k].n}</b>. Elígelo en «Comandante».`);
  if(!save.cmd&&cmdOn('lluvia'))save.cmd='lluvia'}
 // Cofres y pase
 let chest=null;if(won&&g.mode!=='tutorial'){chest='comun';if(g.mode==='ladder'){save.ladderWins++;if(save.ladderWins%3===0)chest='raro'}
  if((g.mode==='daily'||g.mode==='event')&&bonus)chest='raro';if(g.mode==='campaign'&&bonus)chest=g.lvl===9?'epico':g.lvl===4?'raro':'comun'}
 if(g.mode==='auto'){const pl=g.auto.me.place||1;chest=pl===1?'raro':pl<=4?'comun':null}
 if(chest){addChest(chest);unl.push(`🎁 ¡Ganaste un <b>${CHESTS[chest].n}</b>!${featOn('inv')?' Ábrelo en el Inventario.':' Podrás abrirlo en el nivel '+FEATS.inv.lv+'.'}`)}
 if(featOn('pass',L0)){save.pass.xp=Math.min(PASS_MAX*PASS_STEP,save.pass.xp+xp);const P1=passLevel();if(P1>P0)unl.push(`🎟️ Pase de temporada: ¡nivel ${P1}! Reclama ${P1-P0>1?'tus premios':'tu premio'} en el Pase.`)}
 const xi=xpInfo(),dc=save.coins-c0,dt=save.trophies-t0;
 text+=`<div class="rw"><span class="chip">💰 +${dc}</span>${g.mode==='ladder'?`<span class="chip">🏆 ${dt>=0?'+':''}${dt}</span>`:''}<span class="chip">⭐ +${xp}</span></div>`
  +`<div style="font-size:14px;margin-top:6px">Nivel ${xi.L} · ${xi.cur}/${xi.need} ⭐</div><div class="xpbar"><i style="width:${Math.round(100*xi.cur/xi.need)}%"></i></div>`
  +unl.map(u=>`<div class="unl">${u}</div>`).join('');
 text+=`<div style="font-size:13px;opacity:.7;margin-top:6px">Semilla: ${g.o.seed}</div>`;
 const keep=g.mode!=='tutorial';
 if(keep){lastRep={id:Date.now(),date:new Date().toLocaleString('es'),name:save.name,o:g.o,acts:g.acts,won,wave:g.wave,kills:me.kills};replays.unshift(lastRep);replays.splice(20);persistReplays()}
 persist();setTimeout(()=>showResult(title,text,next,keep),900)}

