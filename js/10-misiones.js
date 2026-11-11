// Brotes Rebeldes · Misiones diarias y semanales, y logros permanentes.
"use strict";
// Solo cuentan los modos con premios (no el Taller ni el tutorial ni las repeticiones), igual que las monedas y la experiencia.
const QUEST_MODES=['campaign','survival','duel','ladder','mirror','event','daily','auto'];
const DUEL_MODES=['duel','ladder','mirror'];
// Tipos de misión. ev(m) devuelve cuánto suma una partida; max:true = cuenta la mejor marca en vez de sumar.
// m = {mode, won, kills, plants, merges, cmds, powers, maxRank, bosses, wave}
const QTYPES={
 kill:{ic:'🐜',t:n=>`Elimina ${n} insectos`,ev:m=>m.kills},
 win:{ic:'🏆',t:n=>`Gana ${n} partida${n>1?'s':''}`,ev:m=>m.won?1:0},
 plant:{ic:'🌱',t:n=>`Planta ${n} plantas`,ev:m=>m.plants},
 merge:{ic:'✨',t:n=>`Fusiona ${n} veces`,ev:m=>m.merges},
 rank:{ic:'⭐',t:n=>`Lleva una planta a la fase ${n}`,ev:m=>m.maxRank,max:true},
 cmd:{ic:'🌀',t:n=>`Usa la habilidad del comandante ${n} veces`,ev:m=>m.cmds},
 boss:{ic:'👑',t:n=>`Derrota ${n} jefe${n>1?'s':''}`,ev:m=>m.bosses},
 power:{ic:'⬆️',t:n=>`Potencia tus plantas ${n} veces`,ev:m=>m.powers},
 camp:{ic:'🗺️',t:n=>`Gana ${n} nivel${n>1?'es':''} de la campaña`,ev:m=>m.mode==='campaign'&&m.won?1:0},
 duel:{ic:'⚔️',t:n=>`Gana ${n} duelo${n>1?'s':''} (amistoso, Escalera o espejo)`,ev:m=>DUEL_MODES.includes(m.mode)&&m.won?1:0},
 surv:{ic:'♾️',t:n=>`Llega a la oleada ${n} en Supervivencia`,ev:m=>m.mode==='survival'?m.wave:0,max:true},
 dailyw:{ic:'📅',t:n=>`Supera ${n} desafíos diarios`,ev:m=>m.mode==='daily'&&m.won?1:0},
};
// [tipo, objetivo, monedas, gemas]
const DAILY_POOL=[['kill',150,90],['win',2,100],['plant',25,80],['merge',15,90],['rank',4,110],['cmd',3,80],['boss',1,100],['power',5,80],['camp',1,100],['duel',1,110],['surv',15,120]];
const WEEKLY_POOL=[['kill',1200,400,15],['win',12,450,15],['merge',90,400,15],['boss',6,450,20],['duel',5,450,20],['dailyw',3,400,15],['rank',5,500,25],['camp',6,450,20]];
function pickQuests(pool,n,seedStr){let h=0;for(const ch of seedStr)h=h*31+ch.charCodeAt(0)|0;const R=mulberry(h),p=pool.slice(),out=[];
 while(out.length<n&&p.length){const i=Math.floor(R()*p.length);const [k,n2,c,g]=p.splice(i,1)[0];out.push({k,n:n2,c,g:g||0,p:0,done:false,got:false})}return out}
// Renueva las misiones diarias cada día y las semanales cada semana (según el reloj de la computadora).
function questsFresh(){if(!save.quests||typeof save.quests!=='object')save.quests={};const Q=save.quests;let ch=false;
 if(Q.day!==dayKey()){Q.day=dayKey();Q.daily=pickQuests(DAILY_POOL,3,'d'+Q.day+PROF);ch=true}
 if(Q.week!==weekIdx()){Q.week=weekIdx();Q.weekly=pickQuests(WEEKLY_POOL,2,'w'+Q.week+PROF);ch=true}
 if(!Array.isArray(Q.daily))Q.daily=[];if(!Array.isArray(Q.weekly))Q.weekly=[];Q.total=Q.total|0;if(ch)persist();return Q}

// Logros permanentes: val() lee el progreso del guardado; se reclaman una sola vez.
const bossKills=()=>Object.keys(save.stats.kk||{}).reduce((a,k)=>a+(BUGS[k]&&BUGS[k].boss?save.stats.kk[k]:0),0);
const sumObj=o=>Object.values(o||{}).reduce((a,b)=>a+(b|0),0);
const ACHS=[
 {id:'win1',ic:'🌱',n:'Primer brote',d:'Gana tu primera partida.',to:1,val:()=>sumObj(save.stats.won),c:50},
 {id:'play50',ic:'🌿',n:'Jardinero constante',d:'Juega 50 partidas.',to:50,val:()=>sumObj(save.stats.played),c:300},
 {id:'kill1k',ic:'🐜',n:'Exterminador',d:'Elimina 1.000 insectos.',to:1000,val:()=>save.stats.kills|0,c:150},
 {id:'kill10k',ic:'🐞',n:'Plaga controlada',d:'Elimina 10.000 insectos.',to:10000,val:()=>save.stats.kills|0,c:500},
 {id:'kill50k',ic:'🦗',n:'Fin del enjambre',d:'Elimina 50.000 insectos.',to:50000,val:()=>save.stats.kills|0,c:1500,g:30},
 {id:'boss5',ic:'👑',n:'Cazajefes',d:'Derrota 5 jefes.',to:5,val:bossKills,c:200},
 {id:'boss25',ic:'🗡️',n:'Terror de los jefes',d:'Derrota 25 jefes.',to:25,val:bossKills,c:600,g:15},
 {id:'rank4',ic:'⭐',n:'Fusión dorada',d:'Lleva una planta a la fase 4 (Oro).',to:4,val:()=>save.stats.bestRank|0,c:150},
 {id:'rank5',ic:'🌟',n:'Leyenda del jardín',d:'Lleva una planta a la fase 5 (Leyenda).',to:5,val:()=>save.stats.bestRank|0,c:400,g:10},
 {id:'ch1',ic:'🌻',n:'Huerto liberado',d:'Completa el capítulo «El Huerto».',to:10,val:()=>clr(0),c:300},
 {id:'ch2',ic:'🐸',n:'Señor del Pantano',d:'Completa el capítulo «El Pantano».',to:10,val:()=>clr(1),c:500,g:10},
 {id:'ch3',ic:'🏛️',n:'Guardián del Invernadero',d:'Completa el capítulo «El Invernadero».',to:10,val:()=>clr(2),c:800,g:30},
 {id:'surv15',ic:'♾️',n:'Superviviente',d:'Supera 15 oleadas en Supervivencia.',to:15,val:()=>save.bestSurv|0,c:200},
 {id:'surv30',ic:'🛡️',n:'Inquebrantable',d:'Supera 30 oleadas en Supervivencia.',to:30,val:()=>save.bestSurv|0,c:600,g:15},
 {id:'lad250',ic:'🏆',n:'Escalador',d:'Llega a 250 trofeos (división Tallo).',to:250,val:()=>save.bestTrophies|0,c:300},
 {id:'lad700',ic:'🌳',n:'Árbol Ancestral',d:'Llega a 700 trofeos (división Árbol Ancestral).',to:700,val:()=>save.bestTrophies|0,c:1000,g:25},
 {id:'auto1',ic:'🥇',n:'Último jardín en pie',d:'Gana una Auto-batalla.',to:1,val:()=>save.stats.won.auto|0,c:300},
 {id:'daily7',ic:'📅',n:'Fiel a la cita',d:'Supera 7 desafíos diarios.',to:7,val:()=>save.stats.won.daily|0,c:300},
 {id:'col15',ic:'🃏',n:'Coleccionista',d:'Consigue 15 personajes.',to:15,val:()=>save.unlocked.length,c:200},
 {id:'col30',ic:'📚',n:'Gran colección',d:'Consigue 30 personajes.',to:30,val:()=>save.unlocked.length,c:600,g:15},
 {id:'col40',ic:'🏵️',n:'Jardín completo',d:'Consigue los 40 personajes.',to:40,val:()=>save.unlocked.length,c:1500,g:40},
 {id:'cmd4',ic:'🌾',n:'Estado mayor',d:'Consigue 4 comandantes.',to:4,val:()=>(save.cmds||[]).length,c:200},
 {id:'cmd16',ic:'🎖️',n:'Todos los jardineros',d:'Consigue los 16 comandantes.',to:16,val:()=>(save.cmds||[]).length,c:1500,g:40},
 {id:'quest20',ic:'📜',n:'Siempre cumple',d:'Completa 20 misiones.',to:20,val:()=>(save.quests&&save.quests.total)|0,c:400,g:10},
];
const achState=()=>{if(!save.ach||typeof save.ach!=='object')save.ach={};return save.ach};
const achReady=a=>a.val()>=a.to&&!achState()[a.id];

// Resumen de una partida a partir de las acciones grabadas y del tablero del jugador.
function matchSummary(g,won,me){const n={s:0,m:0,c:0,p:0};for(const a of g.acts||[])if(!a.p)n[a.a]=(n[a.a]||0)+1;
 let bosses=0;for(const k in me.kk||{})if(BUGS[k]&&BUGS[k].boss)bosses+=me.kk[k];
 return{mode:g.mode,won:!!won,kills:me.kills|0,plants:n.s,merges:n.m,cmds:n.c,powers:n.p,maxRank:me.maxR||1,bosses,wave:g.wave|0}}
// Se llama al terminar una partida con premios. Devuelve los avisos para la pantalla de resultados.
function questOnEnd(g,won,me){if(!QUEST_MODES.includes(g.mode)||g.replay)return[];const Q=questsFresh(),m=matchSummary(g,won,me),msgs=[];
 for(const q of[...Q.daily,...Q.weekly]){if(q.done)continue;const T=QTYPES[q.k];if(!T)continue;const v=T.ev(m)|0;q.p=T.max?Math.max(q.p,v):q.p+v;
  if(q.p>=q.n){q.p=q.n;q.done=true;msgs.push(`📜 Misión cumplida: <b>${T.t(q.n)}</b> — recógela en «Misiones».`)}}
 for(const a of ACHS)if(achReady(a)&&!(save.achSeen||[]).includes(a.id)){(save.achSeen=save.achSeen||[]).push(a.id);msgs.push(`🏅 Logro: <b>${a.n}</b> — recógelo en «Misiones».`)}
 return msgs}
function questClaimable(){const Q=questsFresh();return[...Q.daily,...Q.weekly].filter(q=>q.done&&!q.got).length+ACHS.filter(achReady).length}
function giveReward(c,g){save.coins+=c|0;if(g)save.gems=(save.gems||0)+g;sfx('chest')}
function claimQuest(list,i){const q=questsFresh()[list][i];if(!q||!q.done||q.got)return;q.got=true;save.quests.total=(save.quests.total|0)+1;giveReward(q.c,q.g);persist();
 notify(`+${q.c} 💰${q.g?` · +${q.g} 💎`:''}`);showQuests()}
function claimAch(id){const a=ACHS.find(x=>x.id===id);if(!a||!achReady(a))return;achState()[id]=true;giveReward(a.c,a.g);persist();notify(`🏅 ${a.n}: +${a.c} 💰${a.g?` · +${a.g} 💎`:''}`);showQuests()}
let QTAB='mis';
function untilReset(weekly){const now=new Date();let t;if(weekly){const ms=(weekIdx()+1)*7*864e5-Date.now();t=ms}else{const n=new Date(now);n.setHours(24,0,0,0);t=n-now}
 const h=Math.floor(t/36e5),d=Math.floor(h/24);return d?`${d} d ${h%24} h`:`${h} h ${Math.floor(t/6e4)%60} min`}
function qRow(L,ic,title,sub,p,n,rew,state,onClaim){const d=document.createElement('div');d.className='rowi qrow'+(state==='ready'?' ready':state==='got'?' got':'');
 const pct=Math.round(100*Math.min(1,p/n));
 d.innerHTML=`<span class="qi">${ic}</span><span class="qt"><b>${esc(title)}</b>${sub?`<small>${esc(sub)}</small>`:''}<span class="qbar"><i style="width:${pct}%"></i><em>${Math.min(p,n).toLocaleString('es')} / ${n.toLocaleString('es')}</em></span></span><span class="qr">${rew}</span>`;
 const b=document.createElement('button');b.className='small '+(state==='ready'?'gold':'');b.textContent=state==='got'?'✔ Recogido':state==='ready'?'Recoger':'En curso';b.disabled=state!=='ready';if(state==='ready')b.onclick=onClaim;d.appendChild(b);L.appendChild(d)}
function showQuests(tab){if(tab)QTAB=tab;const Q=questsFresh(),L=document.getElementById('qList');L.innerHTML='';
 document.querySelectorAll('#quests .qtab').forEach(b=>b.classList.toggle('on',b.dataset.t===QTAB));
 const rw=(c,g)=>`💰 ${c}${g?`<br>💎 ${g}`:''}`;
 if(QTAB==='mis'){const h=t=>{const e=document.createElement('div');e.className='qhead';e.textContent=t;L.appendChild(e)};
  h(`Misiones de hoy · se renuevan en ${untilReset(false)}`);
  Q.daily.forEach((q,i)=>qRow(L,QTYPES[q.k].ic,QTYPES[q.k].t(q.n),'',q.p,q.n,rw(q.c,q.g),q.got?'got':q.done?'ready':'',()=>claimQuest('daily',i)));
  h(`Misiones de la semana · se renuevan en ${untilReset(true)}`);
  Q.weekly.forEach((q,i)=>qRow(L,QTYPES[q.k].ic,QTYPES[q.k].t(q.n),'',q.p,q.n,rw(q.c,q.g),q.got?'got':q.done?'ready':'',()=>claimQuest('weekly',i)));
  const f=document.createElement('div');f.className='sub';f.style.marginTop='6px';f.textContent=`Cuentan las partidas de Campaña, Supervivencia, duelos, Evento, Desafío diario y Auto-batalla. Misiones completadas en total: ${Q.total}.`;L.appendChild(f)}
 else{const S=achState(),list=ACHS.slice().sort((a,b)=>(achReady(b)-achReady(a))||((!!S[a.id])-(!!S[b.id])));
  const got=ACHS.filter(a=>S[a.id]).length,h=document.createElement('div');h.className='qhead';h.textContent=`Logros: ${got} de ${ACHS.length}`;L.appendChild(h);
  for(const a of list)qRow(L,a.ic,a.n,a.d,a.val(),a.to,rw(a.c,a.g),S[a.id]?'got':achReady(a)?'ready':'',()=>claimAch(a.id))}
 show('quests')}
