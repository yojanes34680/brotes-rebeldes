// Brotes Rebeldes · Guardado, perfiles, comandantes, objetos, cofres, pase y tienda.
"use strict";
// ============ SAVE ============
// v3: guardado versionado; migra automáticamente desde v2. Las repeticiones van en una clave aparte.
// Perfiles (fase 7): hasta 3. El perfil 1 usa las claves de siempre, así no se pierde nada guardado antes.
const PROF_KEY='brotes_rebeldes_profile';let PROF=0;try{PROF=clamp(parseInt(localStorage.getItem(PROF_KEY),10)||0,0,2)}catch(e){}
const profKeys=i=>i?[`brotes_rebeldes_v3_p${i+1}`,`brotes_rebeldes_replays_p${i+1}`,`brotes_rebeldes_v3_p${i+1}_respaldo`]:['brotes_rebeldes_v3','brotes_rebeldes_replays','brotes_rebeldes_v3_respaldo'];
const SAVE_KEY=profKeys(PROF)[0],OLD_KEY=PROF?'brotes_rebeldes_none':'brotes_rebeldes_v2',REP_KEY=profKeys(PROF)[1],BAK_KEY=profKeys(PROF)[2];
function defSave(){return{ver:4,name:'',coins:0,gems:0,up:{},premSkins:[],shopDay:'',shopBought:[],cleared:0,unlocked:['espina','hielo','fuego','rayo','rocio'],deck:['espina','hielo','fuego','rayo','rocio'],lv:{},bestSurv:0,daily:'',trophies:0,bestTrophies:0,season:null,tut:0,
 xp:0,cmd:null,cmds:null,cmdLv:{},decks:null,deckIdx:0,mainMode:'',chapC:[0,0],eventWeek:-1,waveSets:[],p2name:'Jugador 2',vs:{d1:0,c1:'',d2:0,c2:''},stars:{},mastery:{},sbx:{dew:1,inf:1,auto:0,hp:1},
 inv:{chests:{comun:0,raro:0,epico:0},gear:{fuerza:0,veloz:0,certero:0}},eq:{},relics:[],relEq:[],skins:{},skin:{},pass:{season:null,xp:0,claimed:[]},ladderWins:0,quests:{},ach:{},achSeen:[],seen:{},
 opts:{diff:1,spd:1,noFlash:false,vol:.8,mus:.5,fx:.8,cb:false,ts:0,art:0},stats:{played:{},won:{},kills:0,bestRank:1,pl:{},kk:{},mr:{}}}}
const save=defSave();
function loadInto(s){if(!s||typeof s!=='object')return;for(const k of Object.keys(save)){if(s[k]===undefined||s[k]===null&&save[k]!==null)continue;
 const d=save[k];if(d&&typeof d==='object'&&!Array.isArray(d)&&typeof s[k]==='object')Object.assign(d,s[k]);else save[k]=s[k]}}
// Avisos breves arriba de la pantalla (errores de guardado, recuperaciones, fallos del juego).
let TOAST_T=0;
function notify(msg,kind,ms){const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.className=kind==='err'?'err':'';clearTimeout(TOAST_T);TOAST_T=setTimeout(()=>el.classList.add('off'),ms||5000)}
// Guardado seguro: se valida al cargar; si está dañado se usa la copia de respaldo (la del inicio de la última sesión)
// y el dañado se conserva en otra clave por si se puede rescatar.
function validSave(s){if(!s||typeof s!=='object'||Array.isArray(s))return false;
 for(const k of ['coins','gems','xp','trophies','cleared','bestSurv'])if(s[k]!==undefined&&!(typeof s[k]==='number'&&isFinite(s[k])&&s[k]>=0))return false;
 for(const k of ['deck','unlocked'])if(s[k]!==undefined&&!(Array.isArray(s[k])&&s[k].every(x=>typeof x==='string')))return false;
 if(Array.isArray(s.deck)&&s.deck.length!==5)return false;
 for(const k of ['opts','lv','inv','stats','up','eq'])if(s[k]!==undefined&&s[k]!==null&&(typeof s[k]!=='object'||Array.isArray(s[k])))return false;
 return true}
function readSave(k){let raw;try{raw=localStorage.getItem(k)}catch(e){return{blocked:1}}if(!raw)return{none:1};try{const o=JSON.parse(raw);return validSave(o)?{s:o,raw}:{bad:raw}}catch(e){return{bad:raw}}}
let rawSave=null,LOAD_NOTE='',FROM_BAK=false;
{let r=readSave(SAVE_KEY);if(r.none)r=readSave(OLD_KEY);
 if(r.blocked)LOAD_NOTE='⚠ El navegador no permite guardar datos: tu progreso NO se guardará al cerrar. Exporta tu guardado desde Opciones antes de salir.';
 else if(r.bad!==undefined){try{localStorage.setItem(SAVE_KEY+'_danado',r.bad)}catch(e){}const b=readSave(BAK_KEY);
  if(b.s){r=b;FROM_BAK=true;LOAD_NOTE='⚠ Tu guardado estaba dañado. Se recuperó la copia de respaldo del inicio de tu última sesión; puede faltar lo último que jugaste.'}
  else LOAD_NOTE='⚠ Tu guardado estaba dañado y no había copia de respaldo, así que empiezas de cero. El archivo dañado se conservó por si se puede rescatar.'}
 if(r.s){rawSave=r.s;loadInto(r.s)}}
let SAVE_WARN=0;
function persist(){const data=JSON.stringify(save);
 for(let i=0;i<2;i++){try{localStorage.setItem(SAVE_KEY,data);return true}catch(e){
  // Si el almacenamiento está lleno, se liberan repeticiones antiguas y se reintenta una vez.
  if(i===0&&replays.length>5){replays.splice(5);try{localStorage.setItem(REP_KEY,JSON.stringify(replays))}catch(_){}}}}
 if(Date.now()-SAVE_WARN>60000){SAVE_WARN=Date.now();notify('⚠ No se pudo guardar tu progreso: el almacenamiento del navegador está lleno o bloqueado. Exporta tu guardado desde Opciones para no perderlo.','err',9000)}
 return false}
function writeBackup(){try{localStorage.setItem(BAK_KEY,JSON.stringify(save))}catch(e){}}
const plv=k=>save.lv[k]||1;
let replays=[];try{const r=JSON.parse(localStorage.getItem(REP_KEY));if(Array.isArray(r))replays=r}catch(e){}
function persistReplays(){try{localStorage.setItem(REP_KEY,JSON.stringify(replays))}catch(e){replays.splice(10);try{localStorage.setItem(REP_KEY,JSON.stringify(replays))}catch(_){}}}
const DIFFS=[{n:'Fácil',hp:.75,ai:1},{n:'Normal',hp:1,ai:3},{n:'Difícil',hp:1.3,ai:6},{n:'Pesadilla',hp:1.7,ai:9}];
const dif=()=>DIFFS[save.opts.diff]||DIFFS[1];
const DIVS=[[0,'Semilla'],[100,'Brote'],[250,'Tallo'],[450,'Flor'],[700,'Árbol Ancestral']];
function divOf(t){let d=0;DIVS.forEach((x,i)=>{if(t>=x[0])d=i});return d}
const seasonId=()=>Math.floor(Date.now()/864e5/28);
const MODE_N={tutorial:'Tutorial',campaign:'Campaña',survival:'Supervivencia',daily:'Desafío diario',duel:'Duelo amistoso',ladder:'Escalera',event:'Evento',mirror:'Rival espejo',auto:'Auto-batalla',sandbox:'Jardín libre',custom:'Oleadas propias',versus:'Duelo local'};
// Nivel de jugador: subir del nivel L al L+1 cuesta 60+40·(L−1) ⭐.
const xpNeed=L=>60+40*(L-1);
function xpInfo(xp){xp=xp===undefined?save.xp:xp;let L=1;while(L<50&&xp>=xpNeed(L)){xp-=xpNeed(L);L++}return{L,cur:xp,need:xpNeed(L)}}
const plLevel=xp=>xpInfo(xp).L;
const FEATS={
 campaign:{n:'Campaña',lv:1},survival:{n:'Supervivencia',lv:1},tutorial:{n:'Tutorial',lv:1},deck:{n:'Mazo y mejoras',lv:1},album:{n:'Álbum',lv:1},
 duel:{n:'Duelo amistoso',lv:2,d:'Enfréntate a la IA sin arriesgar trofeos.'},replays:{n:'Repeticiones',lv:2,d:'Vuelve a ver tus últimas 20 partidas.'},
 ladder:{n:'Escalera',lv:3,d:'Duelos por trofeos y divisiones, con temporadas de 4 semanas.'},daily:{n:'Desafío diario',lv:3,d:'Una partida al día con reglas especiales y premio.'},
 cmd:{n:'Comandante',lv:4,d:'Elige un Jardinero Comandante: habilidad activa (tecla Q) y pasiva.'},decks:{n:'Tres mazos',lv:5,d:'Guarda hasta 3 mazos y cambia entre ellos.'},
 news:{n:'Avisos',lv:1},inv:{n:'Inventario',lv:2,d:'Abre tus cofres de semillas y elige aspectos para tus plantas.'},pass:{n:'Pase de temporada',lv:3,d:'30 niveles de recompensas gratis en cada temporada.'},
 gear:{n:'Equipo de plantas',lv:4,d:'Pon abonos en tus plantas: 2 ranuras por planta.'},
 event:{n:'Eventos',lv:3,d:'Cada semana, una regla especial con premio.'},auto:{n:'Auto-batalla',lv:4,d:'8 jardines, tienda entre rondas y combate automático: gana el último en pie.'},mirror:{n:'Rival espejo',lv:5,d:'Enfréntate a una IA que juega con tu mazo y tu estilo de partidas anteriores.'},relics:{n:'Reliquias',lv:6,d:'Equipa hasta 2 reliquias con efectos para toda la partida.'}};
const featOn=(f,L)=>(L||plLevel())>=FEATS[f].lv;
// ===== 16 JARDINEROS COMANDANTES (4 por rareza) =====
// Nivel 1–10: la habilidad activa gana potencia (pw = +10 % por nivel) y recarga más rápido (−3 % por nivel).
// Los 4 originales conservan en nivel 1 sus números exactos (repeticiones antiguas idénticas).
const cpw=L=>1+.1*(L-1),ccd=(C,L)=>C.cd*(1-.03*(L-1)),f1=v=>(Math.round(v*10)/10).toString().replace('.',',');
const CMDS={
 // ---- COBRE ----
 lluvia:{t:'cobre',n:'Abuela Nimbo',ti:'La que llama a las nubes',ic:'🌧️',col:'#5cc8ff',cd:35,an:'Lluvia',
  ad:L=>`Ganas ${Math.round(50*cpw(L))} 💧 + ${f1(10*cpw(L))} por oleada y ralentizas a todos los insectos ${f1(4+.2*(L-1))} s.`,pd:'Las Rocieras generan un 50 % más de rocío.',q:'«Una buena lluvia lo arregla todo, cariño.»'},
 poda:{t:'cobre',n:'Podador Brezo',ti:'Tijeras del Huerto',ic:'✂️',col:'#9be06a',cd:50,an:'Poda',
  ad:L=>`Quita el ${Math.round(30*cpw(L))} % de su vida máxima a todos los insectos (${f1(10*cpw(L))} % a los jefes).`,pd:'Lanzaespinas y Atrapamoscas hacen +15 % de daño.',q:'«Lo que sobra, se corta.»'},
 semillero:{t:'cobre',n:'Tío Semillero',ti:'Bolsillos sin fondo',ic:'🌱',col:'#c8a060',cd:50,an:'Siembra rápida',
  ad:L=>`Planta gratis ${2+(L>=5)+(L>=10)} plantas de tu mazo en macetas libres.`,pd:'Empiezas cada partida con +20 💧.',q:'«Una semilla hoy, un ejército mañana.»'},
 espantap:{t:'cobre',n:'Espantapájaros Paja',ti:'El susto del maizal',ic:'🌾',col:'#e0a040',cd:45,an:'Susto',
  ad:L=>`Asusta a todos los insectos y los hace retroceder ${Math.round(220*cpw(L))} pasos por el sendero (los jefes, un tercio), ralentizados 2 s.`,pd:'Los insectos voladores reciben +15 % de daño.',q:'«¡BU!… perdón, me emociono.»'},
 // ---- PLATA ----
 escarcha:{t:'plata',n:'Hada Escarcha',ti:'Aliento del invierno',ic:'❄️',col:'#bfeaff',cd:40,an:'Helada',
  ad:L=>`Congela a todos los insectos ${f1(4+.25*(L-1))} s (a los jefes, ${f1(2+.25*(L-1))} s).`,pd:'La ralentización de Flor Escarcha dura un 30 % más.',q:'«Shhh… el invierno no tiene prisa.»'},
 polen:{t:'plata',n:'Capitana Polen',ti:'As de la colmena',ic:'🌼',col:'#ffd23f',cd:55,an:'Polinizar',
  ad:L=>`Sube un nivel a ${1+(L>=5)+(L>=10)} de tus plantas de nivel más bajo.`,pd:'Cada planta nueva encarece la siguiente en 8 💧 en vez de 10.',q:'«¡Escuadrilla, a polinizar!»'},
 herrera:{t:'plata',n:'Herrera Musgo',ti:'Forjadora de espinas',ic:'🔨',col:'#ff8a4a',cd:50,an:'Forja',
  ad:L=>`Durante 8 s todas tus plantas hacen +${Math.round(40*cpw(L))} % de daño.`,pd:'Todas tus plantas hacen +5 % de daño.',gD:.05,q:'«Cada espina, templada a mano.»'},
 brujo:{t:'plata',n:'Brujo Raíz',ti:'Susurros del subsuelo',ic:'🔮',col:'#c8ff4a',cd:45,an:'Maldición',
  ad:L=>`Maldice a todos los insectos: reciben +${Math.round(30*cpw(L))} % de daño durante ${f1(6+.3*(L-1))} s.`,pd:'Cada insecto eliminado te da +1 💧.',q:'«Las raíces lo escuchan todo.»'},
 // ---- ORO ----
 general:{t:'oro',n:'General Girasol',ti:'Comandante del Frente Dorado',ic:'🌻',col:'#ffd23f',cd:55,an:'Carga',
  ad:L=>`Durante 6 s todas tus plantas disparan un ${Math.round(100+5*(L-1))} % más rápido.`,pd:'Todas tus plantas disparan un 6 % más rápido.',gS:.06,q:'«¡Jardín, en formación! ¡Fuego a discreción!»'},
 alquimista:{t:'oro',n:'Alquimista Zafiro',ti:'Transmutadora de plagas',ic:'⚗️',col:'#4ae0ff',cd:50,an:'Transmutar',
  ad:L=>`Disuelve el ${Math.round(25*cpw(L))} % de la vida máxima de todos los insectos (no jefes) y te da 2 💧 por cada uno.`,pd:'Tus productores de rocío generan un 30 % más.',q:'«Plaga en rocío: solo es química.»'},
 tormenta:{t:'oro',n:'Señora Tormenta',ti:'Dueña de los relámpagos',ic:'⛈️',col:'#28e8ff',cd:55,an:'Diluvio eléctrico',
  ad:L=>`Caen ${12+(L-1)} rayos sobre insectos al azar; cada uno quita el ${Math.round(15*cpw(L))} % de su vida máxima (${f1(4*cpw(L))} % a jefes).`,pd:'Los insectos ralentizados reciben +10 % de daño.',q:'«¿Oyes ese trueno? Es mi turno.»'},
 guardian:{t:'oro',n:'Guardián Sauce',ti:'Protector de las orillas',ic:'🌳',col:'#7aff6a',cd:45,an:'Escudo de raíces',
  ad:L=>`Recuperas 1 ❤ (si estás al máximo, un escudo bloquea el próximo insecto que llegue al final) y las raíces inmovilizan a todos los insectos ${f1(3+.15*(L-1))} s (jefes, 3/4 de ese tiempo).`,pd:'Los jefes avanzan un 10 % más lento.',q:'«Mientras yo esté, nadie cruza el río.»'},
 // ---- LEGENDARIO ----
 reina:{t:'leyenda',n:'Reina Primavera',ti:'Soberana de todas las flores',ic:'🌸',col:'#ff9ac0',cd:90,an:'Floración',
  ad:L=>`La mitad de tus plantas (las de nivel más bajo) suben ${L>=8?2:1} fase${L>=8?'s':''} (máx. fase V).`,pd:'+10 % de daño a todo el jardín y cada planta cuesta 5 💧 menos.',gD:.1,q:'«Despertad, hijas mías. Es primavera.»'},
 dragon:{t:'leyenda',n:'Verdragón',ti:'El dragón de hojas',ic:'🐉',col:'#5ad84a',cd:60,an:'Aliento verde',
  ad:L=>`Aliento que quita el ${Math.min(95,Math.round(60*cpw(L)))} % de la vida máxima a todos los insectos (${Math.round(15*cpw(L))} % a jefes) y los deja ardiendo.`,pd:'+12 % de daño a todo el jardín.',gD:.12,q:'«Dormí mil años bajo el musgo. Ya desperté.»'},
 cronos:{t:'leyenda',n:'Guardián del Reloj Solar',ti:'Señor de las horas',ic:'⏳',col:'#ffe680',cd:60,an:'Detener el tiempo',
  ad:L=>`Detiene el tiempo: todos los insectos quedan congelados ${f1(5+.3*(L-1))} s (jefes ${f1(2.5+.15*(L-1))} s) mientras tus plantas siguen disparando.`,pd:'Todas tus plantas disparan un 10 % más rápido.',gS:.1,q:'«El tiempo es un jardín. Y yo lo podo.»'},
 oraculo:{t:'leyenda',n:'Oráculo del Bosque',ti:'La que ve todos los caminos',ic:'👁️',col:'#ff6aff',cd:55,an:'Profecía',
  ad:L=>`Durante ${f1(12+.5*(L-1))} s cada disparo tiene un ${Math.round(35+2*(L-1))} % de ser crítico (daño x3).`,pd:'Recibes +15 💧 al empezar cada oleada.',q:'«Ya vi cómo termina esta oleada. Ganamos.»'}};
// Recargas de las reglas v:7 (para reproducir repeticiones antiguas igual que se jugaron).
const CD_V7={lluvia:45,guardian:90,reina:70};
const CMD_OLD=['lluvia','poda','escarcha','polen'];// orden original (repeticiones v2–v4)
const CMD_OLDLV={lluvia:4,poda:6,escarcha:8,polen:10};
const CMDK=Object.keys(CMDS);
const CMD_UP=[150,300,600,1200],CMD_BUY={cobre:500,plata:1200};
const cmdUpCost=k=>CMD_UP[TIERS[CMDS[k].t].ord]*(save.cmdLv[k]||1);
const cmdOn=(k,L)=>!!CMDS[k]&&featOn('cmd',L)&&save.cmds.includes(k);
// ===== Objetos (fase 3): abonos, reliquias, aspectos, cofres y pase =====
const GEAR={fuerza:{n:'Abono de Fuerza',ic:'💪',d:'+12 % de daño'},veloz:{n:'Abono Veloz',ic:'⚡',d:'+10 % de cadencia'},certero:{n:'Abono Certero',ic:'🎯',d:'+15 % de daño a jefes'}};
const RELICS={semilla:{n:'Semilla Dorada',ic:'🌰',d:'Empiezas cada partida con +30 💧.'},caracol:{n:'Caracol de Ámbar',ic:'🐌',d:'Los insectos se mueven un 5 % más lento.'},
 petalo:{n:'Pétalo Eterno',ic:'🌸',d:'+5 % de daño a todas tus plantas.'},gota:{n:'Gota Infinita',ic:'💧',d:'+15 % de rocío al empezar cada oleada.'},
 corteza:{n:'Corteza Vieja',ic:'🌳',d:'El primer insecto que llega al final no te quita vidas.'},brujula:{n:'Brújula de Polen',ic:'🧭',d:'La habilidad del comandante recarga un 15 % más rápido.'}};
const SKINS={otono:{n:'Otoño',f:'hue-rotate(-55deg) saturate(1.15)'},lunar:{n:'Lunar',f:'hue-rotate(170deg) brightness(.92)'},real:{n:'Real',f:'sepia(.5) saturate(1.7) brightness(1.08)',crown:1},
 aurora:{n:'Aurora',f:'hue-rotate(110deg) saturate(1.6) brightness(1.1)',prem:1},obsidiana:{n:'Obsidiana',f:'grayscale(.6) contrast(1.3) brightness(.78)',prem:1},solar:{n:'Oro solar',f:'sepia(.85) saturate(2.4) hue-rotate(-12deg) brightness(1.15)',crown:1,prem:1}};
// t: [probabilidad %, tipo, mín, máx]. Los repetidos se cambian por 150 💰.
const CHESTS={comun:{n:'Cofre común',rolls:1,col:'#c8964e',t:[[55,'coins',40,80],[27,'gear'],[10,'skin'],[6,'cpl'],[2,'mcp']]},
 raro:{n:'Cofre raro',rolls:2,col:'#4fb3ff',t:[[34,'coins',90,150],[26,'gear'],[10,'skin'],[8,'relic'],[12,'cpl'],[4,'cor'],[4,'mcp'],[2,'mco']]},
 epico:{n:'Cofre épico',rolls:3,col:'#b06cff',t:[[20,'coins',150,250],[22,'gear'],[12,'skin'],[11,'relic'],[16,'cor'],[9,'cle'],[6,'mco'],[4,'mcl']]},
 legend:{n:'Cofre legendario',rolls:3,col:'#ffcf4a',t:[[28,'cle'],[18,'mcl'],[20,'cor'],[12,'mco'],[10,'relic'],[12,'coins',300,500]]}};
const KIND_N={coins:'Monedas',gear:'Abono',skin:'Aspecto',relic:'Reliquia',cpl:'Personaje plata',cor:'Personaje oro',cle:'Personaje legendario',mcp:'Comandante plata',mco:'Comandante oro',mcl:'Comandante legendario'};
const MC_KIND={mcp:'plata',mco:'oro',mcl:'leyenda'},MC_DUP={plata:400,oro:900,leyenda:1800};
const CH_KIND={cpl:'plata',cor:'oro',cle:'leyenda'};
const PASS_MAX=30,PASS_STEP=100;
function passReward(L){if(L===30)return{k:'cle'};if(L===15)return{k:'mco'};if(L===25)return{k:'mcl'};if(L===10||L===20)return{k:'cor'};if(L===25)return{k:'chest',v:'epico'};if(L%5===0)return{k:'chest',v:'raro'};if(L===12||L===24)return{k:'relic'};if(L%10===8)return{k:'skin'};
 if(L%3===0)return{k:'gear'};if(L%2===0)return{k:'chest',v:'comun'};return{k:'coins',v:40+L*5}}
function rewardLabel(r){if(CH_KIND[r.k]||MC_KIND[r.k])return KIND_N[r.k];return r.k==='chest'?`${CHESTS[r.v].n}`:r.k==='coins'?`${r.v} 💰`:r.k==='gear'?'Abono al azar':r.k==='skin'?'Aspecto al azar':'Reliquia al azar'}
const gc=(b,k,type)=>(b.gear[k]||[]).filter(x=>x===type).length;
// Entrega un objeto (fuera de la simulación: usa Math.random). Devuelve {ic,txt}.
function giveItem(kind,a,b2){
 if(kind==='coins'){const n=a+Math.floor(Math.random()*(b2-a+1));save.coins+=n;return{ic:'💰',txt:`${n} monedas`}}
 if(kind==='gear'){const k=pick(Object.keys(GEAR));save.inv.gear[k]=(save.inv.gear[k]||0)+1;return{ic:GEAR[k].ic,txt:GEAR[k].n}}
 if(MC_KIND[kind]){const tr=MC_KIND[kind],opts=CMDK.filter(k=>CMDS[k].t===tr&&!save.cmds.includes(k));
  if(opts.length){const k=pick(opts);save.cmds.push(k);if(!save.cmd&&featOn('cmd'))save.cmd=k;return{ic:CMDS[k].ic,txt:`¡Nuevo comandante ${TIERS[tr].n.toLowerCase()}: ${CMDS[k].n}!`,cmd:k}}
  const v=MC_DUP[tr];save.coins+=v;return{ic:'💰',txt:`${v} monedas (tienes todos los comandantes ${TIERS[tr].n.toLowerCase()})`}}
 if(CH_KIND[kind]){const tr=CH_KIND[kind],opts=ALL.filter(k=>tierOf(k)===tr&&!save.unlocked.includes(k));
  if(opts.length){const k=pick(opts);save.unlocked.push(k);return{ic:tr==='leyenda'?'👑':tr==='oro'?'🌟':'✨',txt:`¡Nuevo personaje ${TIERS[tr].n.toLowerCase()}: ${UT[k].n}!`,char:k}}
  const v=TIERS[tr].dup;save.coins+=v;return{ic:'💰',txt:`${v} monedas (tienes todos los ${TIERS[tr].n.toLowerCase()})`}}
 if(kind==='skin'){const opts=[];for(const p of save.unlocked)if(UT[p])for(const s in SKINS)if(!SKINS[s].prem&&!(save.skins[p]||[]).includes(s))opts.push([p,s]);
  if(opts.length){const [p,s]=pick(opts);(save.skins[p]=save.skins[p]||[]).push(s);return{ic:'🎨',txt:`Aspecto ${SKINS[s].n} para ${UT[p].n}`}}}
 if(kind==='relic'){const opts=Object.keys(RELICS).filter(k=>!save.relics.includes(k));if(opts.length){const k=pick(opts);save.relics.push(k);return{ic:RELICS[k].ic,txt:`Reliquia: ${RELICS[k].n}`}}}
 save.coins+=150;return{ic:'💰',txt:'150 monedas (repetido)'}}
function rollChest(type){const C=CHESTS[type],out=[];for(let i=0;i<C.rolls;i++){let r=Math.random()*100;for(const e of C.t){if(r<e[0]){out.push(giveItem(e[1],e[2],e[3]));break}r-=e[0]}}return out}
function addChest(type,n){save.inv.chests[type]=(save.inv.chests[type]||0)+(n||1)}
// ===================== TIENDA, GEMAS PREMIUM Y PASE PREMIUM =====================
// 💎 Gemas: moneda premium que se gana jugando (evento semanal, desafío diario y Pase Premium). No hay pagos con dinero real: todo es local.
const UPGRADES={
 dew:{n:'Regadera grande',ic:'💧',d:l=>`Empiezas cada partida con +${15*l} 💧 de rocío.`,max:5},
 dmg:{n:'Fertilizante',ic:'🧪',d:l=>`Todas tus plantas hacen +${3*l} % de daño.`,max:5},
 cost:{n:'Semillas baratas',ic:'🌱',d:l=>`Plantar empieza costando ${l} 💧 menos.`,max:5},
 cmd:{n:'Silbato de mando',ic:'📯',d:l=>`La habilidad del comandante recarga un ${4*l} % más rápido.`,max:5},
 oro:{n:'Bolsa de semillas',ic:'💰',d:l=>`Ganas un ${6*l} % más de monedas al terminar cada partida.`,max:5}};
const UP_PRICE=[250,600,1100,1800,2800],UP_MODES=['campaign','survival','event'];
const upLv=k=>(save.up&&save.up[k])||0;
// Foto de las mejoras para la partida (solo modos contra insectos); queda guardada en la repetición.
function upSnap(mode){if(!UP_MODES.includes(mode))return null;const u={dew:upLv('dew'),dmg:upLv('dmg'),cost:upLv('cost'),cmd:upLv('cmd')};return u.dew||u.dmg||u.cost||u.cmd?u:null}
const PASS_PREM_COINS=1500,PASS_PREM_GEMS=150;
function premReward(L){if(L%10===0)return{k:'chest',v:'legend'};if(L%5===0)return{k:'gems',v:40};if(L%2===0)return{k:'gems',v:15};return{k:'coins',v:80+L*6}}
function premLabel(r){return r.k==='gems'?`${r.v} 💎`:r.k==='coins'?`${r.v} 💰`:'👑 '+CHESTS[r.v].n}
function claimPrem(L){const r=premReward(L);(save.pass.pclaimed=save.pass.pclaimed||[]).push(L);if(r.k==='gems'){save.gems=(save.gems||0)+r.v;return{ic:'💎',txt:`${r.v} gemas`}}if(r.k==='coins'){save.coins+=r.v;return{ic:'💰',txt:`${r.v} monedas`}}addChest(r.v);return{ic:'👑',txt:CHESTS[r.v].n}}
const premUnclaimed=()=>{if(!save.pass.prem)return[];const L=passLevel(),pc=save.pass.pclaimed||[],o=[];for(let i=1;i<=L;i++)if(!pc.includes(i))o.push(i);return o};
function buyPassPrem(cur){if(save.pass.prem)return false;if(cur==='gems'){if((save.gems||0)<PASS_PREM_GEMS)return false;save.gems-=PASS_PREM_GEMS}else{if(save.coins<PASS_PREM_COINS)return false;save.coins-=PASS_PREM_COINS}save.pass.prem=true;save.pass.pclaimed=save.pass.pclaimed||[];persist();sfx('chest');return true}
// Ofertas del día (con monedas): 3 por día según la fecha, una con 30 % de descuento; 1 compra de cada una por día.
const DEALS=[
 {id:'raro',ic:'🎁',n:'Cofre raro',d:'2 premios al azar.',p:300,give:()=>{addChest('raro');return'Cofre raro a tu inventario'}},
 {id:'epico',ic:'🎁',n:'Cofre épico',d:'3 premios con más rareza.',p:800,give:()=>{addChest('epico');return'Cofre épico a tu inventario'}},
 {id:'abono',ic:'🧪',n:'Pack de abono x3',d:'3 abonos al azar para equipar.',p:250,give:()=>{for(let i=0;i<3;i++)giveItem('gear');return'3 abonos a tu equipo'}},
 {id:'comun',ic:'🎁',n:'3 cofres comunes',d:'Tres cofres básicos.',p:220,give:()=>{addChest('comun',3);return'3 cofres comunes a tu inventario'}},
 {id:'reliq',ic:'🏺',n:'Reliquia misteriosa',d:'Una reliquia que aún no tengas.',p:650,give:()=>giveItem('relic').txt},
 {id:'aspecto',ic:'🎨',n:'Aspecto sorpresa',d:'Un aspecto normal al azar.',p:400,give:()=>giveItem('skin').txt}];
function dayHash(n){let h=2166136261;const k=dayKey()+':'+n;for(let i=0;i<k.length;i++){h^=k.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967296}
const todayDeals=()=>DEALS.map((d,i)=>[dayHash(i),d]).sort((a,b)=>a[0]-b[0]).slice(0,3).map(x=>x[1]);
// Tienda premium (con gemas).
const PREM=[
 {id:'legend',ic:'👑',n:'Cofre legendario',d:'3 premios: personajes y comandantes legendarios u oro, reliquias o monedas.',g:120,give:()=>{addChest('legend');return'Cofre legendario a tu inventario'}},
 {id:'epico',ic:'🎁',n:'Cofre épico',d:'3 premios con más rareza.',g:50,give:()=>{addChest('epico');return'Cofre épico a tu inventario'}},
 {id:'coins',ic:'💰',n:'Saco de monedas',d:'1.000 monedas al instante.',g:40,give:()=>{save.coins+=1000;return'1000 monedas'}}];
let shopTab='up';
function showShop(tab,msg){shopTab=tab||shopTab;if(save.shopDay!==dayKey()){save.shopDay=dayKey();save.shopBought=[]}
 const T=document.getElementById('shopTabs');T.innerHTML='';
 for(const [id,lab] of [['up','⬆ Mejoras'],['deals','🏷️ Ofertas del día'],['prem','💎 Premium']]){const b=document.createElement('button');b.className='small'+(shopTab===id?(id==='prem'?' gem':' gold'):'');b.textContent=lab;b.onclick=()=>showShop(id);T.appendChild(b)}
 const Gd=document.getElementById('shopGrid');Gd.innerHTML='';
 const add=o=>{const el=document.createElement('div');el.className='sitem'+(o.prem?' prem':'');el.innerHTML=`<span class="i">${o.ic}</span><b>${esc(o.n)}</b><div>${o.d}</div>${o.x?`<div class="lvp">${o.x}</div>`:''}`;
  const b=document.createElement('button');b.className='small '+(o.prem?'gem':'gold');b.textContent=o.bt;b.disabled=!o.can;if(o.can)b.onclick=o.fn;el.appendChild(b);Gd.appendChild(el)};
 let note='';
 if(shopTab==='up'){note='Las mejoras son permanentes y se aplican en Campaña, Supervivencia y Eventos (no en los duelos). Quedan guardadas en cada repetición.';
  for(const k in UPGRADES){const U=UPGRADES[k],l=upLv(k),max=l>=U.max,p=UP_PRICE[l];
   add({ic:U.ic,n:U.n,d:max?U.d(l):`${l?'Ahora: '+U.d(l)+'<br>':''}Siguiente: ${U.d(l+1)}`,x:`Nivel ${l}/${U.max}`,bt:max?'Máximo':`💰 ${p}`,can:!max&&save.coins>=p,
    fn:()=>{save.coins-=p;save.up=save.up||{};save.up[k]=l+1;persist();sfx('power');showShop('up',`${U.ic} ${U.n} sube a nivel ${l+1}.`)}})}}
 else if(shopTab==='deals'){note='Las ofertas cambian cada día. Puedes comprar cada una una vez por día.';
  todayDeals().forEach((D,i)=>{const p=Math.round(D.p*(i===0?.7:1)),got=(save.shopBought||[]).includes(D.id);
   add({ic:D.ic,n:D.n+(i===0?' · −30 %':''),d:D.d,x:got?'Comprado hoy':'1 por día',bt:got?'✔ Comprado':`💰 ${p}`,can:!got&&save.coins>=p,fn:()=>{save.coins-=p;save.shopBought.push(D.id);const t=D.give();persist();sfx('chest');showShop('deals',`✔ ${esc(t)}`)}})})}
 else{note='Las 💎 gemas se ganan jugando: 40 por ganar el evento semanal, 5 por el desafío diario y hasta 300 por temporada con el Pase Premium.';
  const gem=(cost,fn)=>({bt:`💎 ${cost}`,can:(save.gems||0)>=cost,prem:1,fn:()=>{save.gems-=cost;const t=fn();persist();sfx('chest');showShop('prem',`💎 ${esc(t)}`)}});
  add(Object.assign({ic:'🎟️',n:'Pase Premium',d:'Activa la fila premium del pase de esta temporada: gemas, monedas y 3 cofres legendarios.',x:save.pass.prem?'Activo esta temporada':''},save.pass.prem?{bt:'✔ Activo',can:false,prem:1}:gem(PASS_PREM_GEMS,()=>{save.pass.prem=true;save.pass.pclaimed=save.pass.pclaimed||[];return'¡Pase Premium activado! Reclama sus premios en el Pase.'})));
  for(const P of PREM)add(Object.assign({ic:P.ic,n:P.n,d:P.d},gem(P.g,P.give)));
  for(const k in SKINS)if(SKINS[k].prem){const own=(save.premSkins||[]).includes(k);add(Object.assign({ic:'🎨',n:'Aspecto '+SKINS[k].n,d:'Exclusivo: para todos tus personajes, también los que consigas después.',x:own?'Ya lo tienes':''},own?{bt:'✔',can:false,prem:1}:gem(150,()=>{(save.premSkins=save.premSkins||[]).push(k);return`Aspecto ${SKINS[k].n} desbloqueado. Equípalo en Cofres → Aspectos.`})))}
  for(const k of ALL)if(tierOf(k)==='leyenda'&&!save.unlocked.includes(k))add(Object.assign({ic:'👑',n:UT[k].n,d:'Personaje legendario: se une a tu colección al instante.'},gem(280,()=>{save.unlocked.push(k);return`¡${UT[k].n} se une a tu colección!`})));
  if(Array.isArray(save.cmds))for(const k of CMDK)if(CMDS[k].t==='leyenda'&&!save.cmds.includes(k))add(Object.assign({ic:CMDS[k].ic,n:CMDS[k].n,d:'Comandante legendario: se une a tus comandantes al instante.'},gem(320,()=>{save.cmds.push(k);return`¡${CMDS[k].n} se une a tus comandantes!`})))}
 document.getElementById('shopMsg').innerHTML=msg||note;show('shop')}
function claimPass(L){const r=passReward(L);save.pass.claimed.push(L);if(r.k==='chest'){addChest(r.v);return{ic:'🎁',txt:CHESTS[r.v].n}}if(r.k==='coins'){save.coins+=r.v;return{ic:'💰',txt:`${r.v} monedas`}}return giveItem(r.k)}
const passLevel=()=>Math.min(PASS_MAX,Math.floor(save.pass.xp/PASS_STEP));
const passUnclaimed=()=>{const L=passLevel(),o=[];for(let i=1;i<=L;i++)if(!save.pass.claimed.includes(i))o.push(i);return o};
function checkPassSeason(){const sid=seasonId();if(save.pass.season===sid)return 0;let n=0;if(save.pass.season!==null)for(const L of passUnclaimed()){claimPass(L);n++}for(const L of premUnclaimed()){claimPrem(L);n++}
 save.pass={season:sid,xp:0,claimed:[],prem:false,pclaimed:[]};persist();return n}
// Migración a v4: quien ya tenía progreso empieza en nivel 5 para no perder acceso a nada.
function migrate(raw){
 if(raw&&raw.xp===undefined&&(save.coins||save.cleared||save.trophies||save.bestSurv||save.tut))save.xp=Math.max(save.xp,480);
 if(!Array.isArray(save.decks)||save.decks.length!==3||!save.decks.every(d=>Array.isArray(d)&&d.length===5))save.decks=[save.deck.slice(),save.deck.slice(),save.deck.slice()];
 save.deckIdx=clamp(save.deckIdx|0,0,2);if(save.cmd&&!CMDS[save.cmd])save.cmd=null;
 if(!Array.isArray(save.chapC)||save.chapC.length!==2)save.chapC=[0,0];
 save.relics=(save.relics||[]).filter(k=>RELICS[k]);save.relEq=(save.relEq||[]).filter(k=>save.relics.includes(k)).slice(0,2);
 // v5: los comandantes pasan a ser propios (antes se abrían por nivel de jugador); se conservan los que ya tenías.
 if(!Array.isArray(save.cmds)){save.cmds=[];if(featOn('cmd'))for(const k in CMD_OLDLV)if(plLevel()>=CMD_OLDLV[k])save.cmds.push(k)}
 save.cmds=save.cmds.filter(k=>CMDS[k]);if(!save.cmdLv||typeof save.cmdLv!=='object')save.cmdLv={};
 if(save.cmd&&!save.cmds.includes(save.cmd))save.cmd=null;
 if(!save.cmd&&cmdOn('lluvia'))save.cmd='lluvia';
 // Guías de primera vez: quien ya jugaba bastante (nivel 6+) no las ve, ni las marcas «NUEVO».
 if(raw&&raw.seen===undefined&&plLevel()>=6)save.seen={__vet:1};
 save.ver=5}
migrate(rawSave);
// Respaldo: si el guardado cargó bien, se copia al empezar la sesión; si se recuperó del respaldo, se repara el principal.
if(FROM_BAK)persist();else if(rawSave)writeBackup();
// Azar de la simulación: todo lo que cambia el resultado de la partida usa sr() (con semilla).
// Lo puramente visual (chispas, rayos dibujados) sigue usando Math.random.
const newSeed=()=>Math.floor(Math.random()*4294967296);
let SR=Math.random;const sr=()=>SR(),spick=a=>a[Math.floor(sr()*a.length)];

