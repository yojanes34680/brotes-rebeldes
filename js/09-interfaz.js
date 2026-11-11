// Brotes Rebeldes · Controles y pantallas: menús, editor, colección, inventario, pase y avisos.
"use strict";
// ============ DIÁLOGOS PROPIOS (reemplazan alert/confirm del navegador) ============
let DLG=null;
function uiDialog(msg,o){o=o||{};return new Promise(res=>{const el=document.getElementById('dlg'),bo=document.getElementById('dlgOk'),bc=document.getElementById('dlgNo');
 if(DLG)DLG(false);document.getElementById('dlgMsg').textContent=msg;const ti=document.getElementById('dlgTitle');ti.textContent=o.title||'';ti.classList.toggle('hidden',!o.title);bo.textContent=o.ok||'Aceptar';bo.className=o.danger?'red':'gold';
 bc.textContent=o.cancel||'';bc.classList.toggle('hidden',!o.cancel);const prev=document.activeElement;
 const done=v=>{if(DLG!==done)return;DLG=null;el.classList.add('hidden');try{if(prev&&prev.focus)prev.focus()}catch(e){}res(v)};
 DLG=done;bo.onclick=()=>done(true);bc.onclick=()=>done(false);el.classList.remove('hidden');setTimeout(()=>bo.focus(),0)})}
function uiAlert(msg){return uiDialog(msg)}
function uiConfirm(msg,ok,danger){return uiDialog(msg,{ok:ok||'Sí',cancel:'Cancelar',danger})}
addEventListener('keydown',e=>{if(!DLG)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();DLG(false)}},true);
// ============ GUÍAS DE PRIMERA VEZ ============
// Al abrir cada pantalla por primera vez aparece una explicación corta; los botones del inicio sin visitar llevan «NUEVO».
const GUIDES={
 deck:{t:'🃏 Mazo y colección',m:'Tu mazo son 5 personajes: cada vez que pulsas PLANTAR sale uno de ellos al azar.\nToca una carta para ver sus números, mejorarla o meterla en el mazo.\nConsejo: 2 o 3 personajes distintos del mismo rol activan una sinergia.'},
 cmds:{t:'🎖️ Comandantes',m:'El comandante te acompaña en cada partida.\nTiene una habilidad activa (su botón o la tecla Q, con recarga) y una pasiva que funciona siempre.\nSúbelo de nivel con monedas para que sea más fuerte.'},
 inv:{t:'🎁 Inventario',m:'Aquí abres los cofres que ganas jugando (sus probabilidades están a la vista) y equipas abonos, reliquias y aspectos.'},
 pass:{t:'🎟️ Pase de temporada',m:'Cada partida te da experiencia ⭐ que sube el pase.\nSus 30 niveles gratis tienen premios; lo que no recojas se entrega solo al terminar la temporada.'},
 shop:{t:'🛒 Tienda',m:'Mejoras permanentes con monedas (sirven en Campaña, Supervivencia y Eventos), ofertas del día y una sección Premium con gemas.\nLas gemas solo se ganan jugando: aquí no hay pagos reales.'},
 event:{t:'🎪 Evento semanal',m:'Cada semana cambia la regla especial.\nSupera las 15 oleadas para llevarte el premio grande, una vez por semana.'},
 replays:{t:'🎬 Repeticiones',m:'Se guardan tus últimas 20 partidas. Puedes verlas a x1, x2 o x4, o usarlas para enfrentarte a tu Rival espejo.'},
 taller:{t:'🧰 Taller',m:'Herramientas para experimentar, sin premios: Jardín libre para probar combinaciones, editor de oleadas propias y duelo local para 2 personas en la misma pantalla.'},
 quests:{t:'📜 Misiones y logros',m:'Tienes 3 misiones diarias y 2 semanales que se renuevan solas, y logros permanentes.\nCuando cumplas una, vuelve aquí para recoger el premio.'},
 album:{t:'📖 Álbum',m:'Fichas de las plantas y de los insectos, con sus números y su carácter. Úsalo para conocer a cada enemigo antes de enfrentarlo.'},
 modes:{t:'⇄ Modos de juego',m:'Elige qué modo arranca el botón JUGAR del inicio.\nLos modos nuevos se abren al subir tu nivel de jugador.'}};
const seenG=id=>{const S=save.seen||{};return!!(S.__vet||S[id])};
function guideFor(id){const Gd=GUIDES[id];if(!Gd||seenG(id))return;if(!save.seen||typeof save.seen!=='object')save.seen={};save.seen[id]=1;persist();
 setTimeout(()=>{if(!document.getElementById(id).classList.contains('hidden'))uiDialog(Gd.m,{title:Gd.t,ok:'¡Entendido!'})},150)}
function markNew(){document.querySelectorAll('#menu [data-g]').forEach(b=>{let t=b.querySelector('.newtag');const on=!b.disabled&&!seenG(b.dataset.g);
 if(on&&!t){t=document.createElement('span');t.className='newtag';t.textContent='NUEVO';b.appendChild(t)}else if(!on&&t)t.remove()})}
// ============ APP INSTALABLE (PWA) ============
// Chrome y Edge avisan cuando el juego se puede instalar; guardamos ese aviso para lanzarlo desde Opciones.
let INSTALL_EV=null;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();INSTALL_EV=e;updInstall()});
addEventListener('appinstalled',()=>{INSTALL_EV=null;updInstall();notify('📲 ¡Brotes Rebeldes quedó instalado como app!')});
function updInstall(){const b=document.getElementById('optInstall'),i=document.getElementById('optInstallInfo');if(!b||!i)return;b.classList.toggle('hidden',!INSTALL_EV);
 i.textContent=isStandalone()?'✔ Ya estás jugando en la app.':INSTALL_EV?'Funciona sin conexión y abre en su propia ventana.':location.protocol==='file:'?'Para instalarlo, abre el juego desde una web (http o https) en Chrome o Edge.':/iPhone|iPad/.test(navigator.userAgent)?'En iPhone: botón Compartir → «Añadir a pantalla de inicio».':'Usa «Instalar» en el menú del navegador (Chrome o Edge).'}
async function installApp(){if(!INSTALL_EV)return;INSTALL_EV.prompt();try{await INSTALL_EV.userChoice}catch(e){}INSTALL_EV=null;updInstall()}
// ============ CRÉDITOS ============
// Escribe aquí tu nombre (o el de tu estudio) para que aparezca en los créditos.
const AUTHOR='';
function showCredits(){const a=AUTHOR||T('el autor del juego');
 uiDialog(`${T('Idea, diseño e ilustraciones de Lanzaespinas, Flor Escarcha, Chile Ígneo, Ortiga Voltaica y Rociera:')} ${a}.\n`+
  T('Programación, arte por código de los 40 personajes, 25 insectos y 16 comandantes, música y efectos de sonido: creados para este juego con ayuda de Claude (Anthropic).')+'\n'+
  T('No usa imágenes, sonidos, textos ni código de otros juegos.')+'\n'+`© ${new Date().getFullYear()} ${a}. `+T('Todos los derechos reservados.'),{title:T('📜 Créditos'),ok:'OK'})}
// ============ PANTALLA COMPLETA ============
function toggleFullscreen(){const d=document,el=d.documentElement,fail=()=>notify('Este navegador no permite la pantalla completa.','err');
 try{if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);return}
  const rq=el.requestFullscreen||el.webkitRequestFullscreen;if(!rq)return fail();const p=rq.call(el);
  const lock=()=>{try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}catch(e){}};
  if(p&&p.then)p.then(lock,fail);else lock()}catch(e){fail()}}
// ============ INPUT ============
// En pantallas táctiles los botones chicos de la esquina aceptan toques un poco por fuera de su dibujo.
const BTN_PAUSE_T={x:BTN_PAUSE.x-2,y:BTN_PAUSE.y-10,w:BTN_PAUSE.w+12,h:BTN_PAUSE.h+20},BTN_SPEED_T={x:BTN_SPEED.x-10,y:BTN_SPEED.y-10,w:BTN_SPEED.w+12,h:BTN_SPEED.h+20};
// Si el sistema interrumpe el toque (llamada, gesto, otra ventana) se suelta lo que se estaba arrastrando.
function cancelDrag(){if(G&&G.drag){const b=G.boards[G.drag.p||0];G.drag=null;if(b)b.sel=-1}}
cv.addEventListener('pointercancel',cancelDrag);addEventListener('blur',cancelDrag);
cv.addEventListener('contextmenu',e=>e.preventDefault());
// Al cambiar de pestaña o minimizar: la partida se pausa y el sonido se detiene.
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelDrag();
 if(scene==='game'&&G&&!G.over&&!G.paused&&!CRASH){G.paused=true;show('pause')}
 try{if(AU.ctx&&AU.ctx.state==='running')AU.ctx.suspend()}catch(e){}}
 else{try{if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume()}catch(e){}}});
function pos(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]}
cv.addEventListener('pointerdown',e=>{e.preventDefault();if(scene!=='game'||!G||G.paused||G.over)return;const [x,y]=pos(e);const me=G.boards[0],tch=e.pointerType==='touch'||e.pointerType==='pen';
 if(inR(x,y,tch?BTN_PAUSE_T:BTN_PAUSE)){G.paused=true;show('pause');return}
 if((!G.duel||G.replay)&&inR(x,y,tch?BTN_SPEED_T:BTN_SPEED)){const S=G.replay?[1,2,4]:[1,1.5,2,3];G.speed=S[(S.indexOf(G.speed)+1)%S.length];return}
 if(G.replay)return;
 if(G.mode==='auto'){autoDown(x,y,e);return}
 if(G.mode==='versus'){vsDown(x,y,e);return}
 if(G.mode==='sandbox'&&sbxDown(x,y))return;
 const ct=controls();if(inR(x,y,ct.sum)){doAct({a:'s'});me.sel=-1;return}
 if(ct.cmd&&inR(x,y,ct.cmd)){doAct({a:'c'});return}
 for(const cd of ct.cards)if(inR(x,y,cd)){doAct({a:'p',k:cd.k});return}
 const i=slotAt(me,x,y);if(i<0){me.sel=-1;return}
 if(me.sel>=0&&me.sel!==i&&placeAct(me,me.sel,i)){me.sel=-1;return}
 if(me.slots[i]){G.drag={from:i,x,y,sx:x,sy:y,moved:false};try{cv.setPointerCapture(e.pointerId)}catch(_){}}else me.sel=-1});
cv.addEventListener('pointermove',e=>{if(!G||!G.drag)return;const [x,y]=pos(e);G.drag.x=x;G.drag.y=y;if(Math.hypot(x-G.drag.sx,y-G.drag.sy)>10)G.drag.moved=true});
cv.addEventListener('pointerup',e=>{if(!G||!G.drag)return;const [x,y]=pos(e);const d=G.drag,me=G.boards[d.p||0];G.drag=null;
 if(d.moved){if(G.mode==='auto'){if(inR(x,y,AUTO_UI.sell))doAct({a:'sell',i:d.from});else{const j=slotAt(me,x,y);if(j>=0&&j!==d.from)doAct(me.slots[j]?{a:'m',i:d.from,j}:{a:'mv',i:d.from,j})}}
  else{const j=slotAt(me,x,y);if(j>=0&&j!==d.from)placeAct(me,d.from,j,d.p)}me.sel=-1}else me.sel=me.sel===d.from?-1:d.from});
addEventListener('keydown',e=>{if(scene!=='game'||!G||G.over)return;if((e.key==='Escape'||e.key==='p')&&!G.paused){G.paused=true;show('pause');e.brHandled=1;return}
 if(G.mode==='versus'){if(!G.paused&&!G.replay)vsKey(e);return}
 if(e.key===' '&&!G.paused){e.preventDefault();doAct({a:'s'})}
 if((e.key==='q'||e.key==='Q')&&!G.paused)doAct({a:'c'});
 kbGame(e)});
// Teclado completo en partida (fase 7): flechas/WASD mueven un cursor; Enter/F elige y fusiona; 1–9 potencia (o compra en la Auto-batalla).
function kbGame(e){if(G.paused||G.over)return;const c=e.code,mv={KeyW:[0,-1],ArrowUp:[0,-1],KeyS:[0,1],ArrowDown:[0,1],KeyA:[-1,0],ArrowLeft:[-1,0],KeyD:[1,0],ArrowRight:[1,0]}[c];
 if(c==='KeyV'&&(!G.duel||G.replay)){const S=G.replay?[1,2,4]:[1,1.5,2,3];G.speed=S[(S.indexOf(G.speed)+1)%S.length];return}
 if(G.replay)return;const b=G.boards[0],auto=G.mode==='auto';if(G.kc===undefined)G.kc=7;
 if(mv){e.preventDefault();G.kcOn=true;G.kc=clamp(Math.floor(G.kc/COLS)+mv[1],0,ROWS-1)*COLS+clamp(G.kc%COLS+mv[0],0,COLS-1);return}
 const i=G.kc;
 if(c==='Enter'||c==='KeyF'){e.preventDefault();G.kcOn=true;if(auto&&G.auto.phase!=='shop')return;
  if(G.mode==='sandbox'&&G.sbx.rm){if(b.slots[i])doAct({a:'rm',i});return}
  if(G.mode==='sandbox'&&!b.slots[i]&&b.sel<0){doAct({a:'place',i,k:G.sbx.k,r:G.sbx.r});return}
  if(b.sel>=0&&b.sel!==i){if(auto){if(canMerge(b,b.sel,i))doAct({a:'m',i:b.sel,j:i});else if(!b.slots[i])doAct({a:'mv',i:b.sel,j:i})}else placeAct(b,b.sel,i);b.sel=-1}else b.sel=b.slots[i]&&b.sel!==i?i:-1;return}
 const d=/^Digit([1-9])$/.exec(c);if(d){const n=+d[1]-1;if(auto){if(n<5)doAct({a:'buy',i:n})}else if(b.deck[n])doAct({a:'p',k:b.deck[n]});return}
 if(auto){if(c==='KeyR')doAct({a:'rr'});else if(c==='KeyG')doAct({a:'go'});else if(c==='KeyX'&&b.sel>=0){doAct({a:'sell',i:b.sel});b.sel=-1}}
 else if(G.mode==='sandbox'){if(c==='KeyN')doAct({a:'wave'});else if(c==='KeyX')G.sbx.rm=!G.sbx.rm;else if(c==='KeyT'){G.sbx.k=ALL[(ALL.indexOf(G.sbx.k)+1)%ALL.length]}}}
function drawKbCursor(c,g){if(!g.kcOn||g.mode==='versus')return;const b=g.boards[0],[x,y]=slotXY(b,g.kc),cs=b.cs;c.setLineDash([6,4]);rr(c,x-cs/2+2,y-cs/2+2,cs-4,cs-4,10,null,'#ffffff',3);c.setLineDash([])}
// Navegación de menús con teclado: Tab recorre botones (con borde visible) y Escape vuelve atrás.
let kbUser=false;addEventListener('keydown',e=>{if(['Tab','Enter','Escape'].includes(e.key)||e.key.startsWith('Arrow'))kbUser=true},true);addEventListener('pointerdown',()=>{kbUser=false;if(G)G.kcOn=false},true);
addEventListener('keydown',e=>{if(e.key!=='Escape'||e.brHandled)return;const vis=screens.find(s=>!document.getElementById(s).classList.contains('hidden'));if(!vis)return;
 if(vis==='pause'){resume();return}if(!['menu','name','result','chest'].includes(vis))vis==='editor'?showTaller():show('menu')});

// ============ MENUS ============
const screens=['quests','menu','levels','deck','howto','pause','result','replays','options','name','album','cmds','inv','chest','pass','news','event','taller','editor','modes','card','cmdcard','shop'];
function showTaller(){const S=save.sbx;
 const mk=(id,labels,key)=>{const el=document.getElementById(id);el.innerHTML='';labels.forEach((lab,i)=>{const b=document.createElement('button');b.className='small tog'+(S[key]===i?' on':'');b.textContent=lab;b.onclick=()=>{S[key]=i;persist();showTaller()};el.appendChild(b)})};
 mk('sbDew',['100','1000','∞'],'dew');mk('sbInf',['Normales (3)','Infinitas'],'inf');mk('sbAuto',['Manuales','Automáticas'],'auto');mk('sbHp',['x0,5','x1','x2','x5'],'hp');
 document.getElementById('p2Name').value=save.p2name||'Jugador 2';
 const n=save.waveSets.length;document.getElementById('tcSets').textContent=n?`Tienes ${n} conjunto${n>1?'s':''} guardado${n>1?'s':''}.`:'Todavía no tienes conjuntos.';
 show('taller')}
// ===== Editor de oleadas =====
const ED_HP=[.5,1,1.5,2,3],ED_MAXW=50,ED_MAXG=8;
let edIdx=0;
function defaultSet(name){return{name,hp:1,waves:[[{k:'hormiga',n:8}],[{k:'hormiga',n:6},{k:'mosquito',n:4}],[{k:'mariquita',n:5},{k:'cucaracha',n:3}],[{k:'escarabajo',n:3},{k:'rinoceronte',n:1}]]}}
function newSet(){if(save.waveSets.length>=10){uiAlert('Puedes guardar hasta 10 conjuntos. Borra alguno primero.');return}save.waveSets.push(defaultSet(`Mis oleadas ${save.waveSets.length+1}`));edIdx=save.waveSets.length-1;persist();showEditor()}
function showEditor(){if(!save.waveSets.length){save.waveSets.push(defaultSet('Mis oleadas 1'));persist()}edIdx=clamp(edIdx,0,save.waveSets.length-1);
 const L=document.getElementById('edSets');L.innerHTML='';save.waveSets.forEach((s,i)=>{const b=document.createElement('button');b.className='small tog'+(i===edIdx?' on':'');b.textContent=`${s.name} (${s.waves.length})`;b.onclick=()=>{edIdx=i;showEditor()};L.appendChild(b)});
 const M=document.getElementById('edMain'),sc=M.scrollTop,S=save.waveSets[edIdx];M.innerHTML='';
 const top=document.createElement('div');top.className='wrow';top.innerHTML='<b>Nombre</b>';const nm=document.createElement('input');nm.type='text';nm.maxLength=40;nm.value=S.name;nm.onchange=()=>{S.name=nm.value.trim().slice(0,40)||'Sin nombre';persist();showEditor()};top.appendChild(nm);
 top.insertAdjacentHTML('beforeend','<b style="margin-left:8px">Vida</b>');const hs=document.createElement('select');ED_HP.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent='x'+String(v).replace('.',',');if(v===S.hp)o.selected=true;hs.appendChild(o)});hs.onchange=()=>{S.hp=+hs.value;persist()};top.appendChild(hs);
 M.appendChild(top);M.insertAdjacentHTML('beforeend','<div style="font-size:12px;opacity:.75">Además, la vida de los insectos crece un 12 % en cada oleada. Toca un grupo para quitarlo.</div>');
 S.waves.forEach((W,wi)=>{const r=document.createElement('div');r.className='wrow';r.insertAdjacentHTML('beforeend',`<b style="width:80px">Oleada ${wi+1}</b>`);
  W.forEach((gr,gi)=>{const ch=document.createElement('span');ch.className='chipb';ch.textContent=`${BUGS[gr.k].n} ×${gr.n} ✕`;ch.onclick=()=>{W.splice(gi,1);persist();showEditor()};r.appendChild(ch)});
  if(!W.length)r.insertAdjacentHTML('beforeend','<span style="opacity:.6">(vacía)</span>');
  if(W.length<ED_MAXG){const sel=document.createElement('select');for(const k in BUGS){const o=document.createElement('option');o.value=k;o.textContent=BUGS[k].n+(BUGS[k].boss?' (jefe)':'');sel.appendChild(o)}
   const num=document.createElement('input');num.type='number';num.min=1;num.max=40;num.value=5;const add=document.createElement('button');add.className='small';add.textContent='＋';
   add.onclick=()=>{const n=clamp(Math.round(+num.value)||1,1,BUGS[sel.value].boss?5:40);W.push({k:sel.value,n});persist();showEditor()};r.append(sel,num,add)}
  const dup=document.createElement('button');dup.className='small';dup.textContent='⧉';dup.title='Duplicar oleada';dup.onclick=()=>{if(S.waves.length>=ED_MAXW)return;S.waves.splice(wi+1,0,JSON.parse(JSON.stringify(W)));persist();showEditor()};
  const del=document.createElement('button');del.className='small red';del.textContent='🗑';del.title='Borrar oleada';del.onclick=()=>{S.waves.splice(wi,1);persist();showEditor()};r.append(dup,del);M.appendChild(r)});
 const bt=document.createElement('div');bt.className='row';bt.style.justifyContent='flex-start';
 const b=(lab,cls,fn)=>{const x=document.createElement('button');x.className='small '+(cls||'');x.textContent=lab;x.onclick=fn;bt.appendChild(x)};
 b('＋ Añadir oleada','',()=>{if(S.waves.length>=ED_MAXW){uiAlert(`Máximo ${ED_MAXW} oleadas.`);return}S.waves.push([{k:'hormiga',n:6}]);persist();showEditor();M.scrollTop=1e6});
 b('⬇ Exportar','',()=>exportSet(S));b('🗑 Borrar conjunto','red',async()=>{if(!await uiConfirm(`¿Borrar «${S.name}»?`,'Borrar',true))return;save.waveSets.splice(edIdx,1);edIdx=0;persist();showEditor()});
 b('▶ Jugar','gold',()=>startCustom(S));M.appendChild(bt);
 show('editor');M.scrollTop=sc}
function exportSet(S){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({app:'brotes-rebeldes',kind:'waves',ver:1,set:S},null,1)],{type:'application/json'}));
 a.download=`oleadas-${S.name.replace(/[^\w-]+/g,'_')}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function cleanSet(s){if(!s||typeof s!=='object'||!Array.isArray(s.waves))return null;
 const waves=s.waves.slice(0,ED_MAXW).filter(Array.isArray).map(W=>W.slice(0,ED_MAXG).filter(g=>g&&BUGS[g.k]).map(g=>({k:g.k,n:clamp(Math.round(+g.n)||1,1,BUGS[g.k].boss?5:40)})));
 return{name:String(s.name||'Importado').slice(0,40),hp:ED_HP.includes(+s.hp)?+s.hp:1,waves}}
function importSet(inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;f.text().then(t=>{let d;try{d=JSON.parse(t)}catch(e){uiAlert('El archivo no es válido.');return}
 const s=d&&d.app==='brotes-rebeldes'&&d.kind==='waves'?cleanSet(d.set):null;if(!s||!s.waves.length){uiAlert('El archivo no es un conjunto de oleadas de Brotes Rebeldes.');return}
 if(save.waveSets.length>=10){uiAlert('Puedes guardar hasta 10 conjuntos. Borra alguno primero.');return}save.waveSets.push(s);edIdx=save.waveSets.length-1;persist();showEditor()})}
function showEvent(){const e=curEvent(),done=save.eventWeek===weekIdx(),wk=weekIdx();
 document.getElementById('evT').textContent=`${e.ic} ${e.n}`;
 document.getElementById('evBody').innerHTML=`<p><b>Regla especial:</b> ${e.d}</p><p>Objetivo: sobrevive <b>15 oleadas</b>. Dificultad fija (Normal).</p>
  <p>${done?'✔ Ya cobraste el premio grande de esta semana. Si vuelves a ganar: 30 💰 y un cofre común.':'Premio por la primera victoria de la semana: <b>200 💰, 40 💎 y un Cofre raro</b>.'}</p><p style="opacity:.8">Quedan ${weekDaysLeft()} día${weekDaysLeft()>1?'s':''} de evento.</p>`;
 document.getElementById('evNext').textContent=TX(T('Próximas semanas:')+' '+[1,2,3].map(n=>{const x=EVENTS[(wk+n)%EVENTS.length];return `${x.ic} ${T(x.n)}`}).join(' · '));
 show('event')}
function show(id){screens.forEach(s=>document.getElementById(s).classList.toggle('hidden',s!==id));
 if(kbUser)setTimeout(()=>{const f=document.querySelector('#'+id+' button:not([disabled]):not(.back)');if(f)f.focus()},0);document.querySelectorAll('.coinv').forEach(e=>e.textContent=save.coins);document.querySelectorAll('.trov').forEach(e=>e.textContent=save.trophies);document.querySelectorAll('.gemv').forEach(e=>e.textContent=save.gems||0);
 if(id==='menu'){scene='menu';G=null;AU.mode='menu';const xi=xpInfo();
  document.getElementById('pName').textContent=save.name||'Jardín';document.getElementById('pLv').textContent=`Nv ${xi.L}`;document.querySelector('#pXp i').style.width=Math.round(100*xi.cur/xi.need)+'%';
  document.querySelectorAll('#menu [data-f]').forEach(b=>{const F=FEATS[b.dataset.f],ok=featOn(b.dataset.f);b.disabled=!ok;b.classList.toggle('locked',!ok);b.title=ok?'':`${F.n}: se desbloquea en el nivel ${F.lv}`});
  const badge=(id,v)=>{const e=document.getElementById(id);e.textContent=v||'';e.classList.toggle('on',!!v)};
  badge('bNews',newsItems().filter(i=>i[3]).length);badge('bPass',featOn('pass')?passUnclaimed().length:0);
  badge('bChest',featOn('inv')?(save.inv.chests.comun||0)+(save.inv.chests.raro||0)+(save.inv.chests.epico||0):0);
  badge('bEvent',featOn('event')&&save.eventWeek!==weekIdx()?'!':0);badge('bDaily',featOn('daily')&&save.daily!==dayKey()?'!':0);badge('bQuest',questClaimable());markNew();
  const m=curMain();document.getElementById('mName').textContent=`${m.ic} ${m.n}`;document.getElementById('mInfo').textContent=m.info()}
 guideFor(id)}
// ===== Inicio: un modo principal + JUGAR; el resto de modos en «Cambiar modo» =====
const MAINM=[
 {id:'ladder',f:'ladder',ic:'🏆',n:'Escalera',d:'Duelos por trofeos y divisiones.',go:()=>startLadder(),info:()=>`División ${DIVS[divOf(save.trophies)][1]} · ${save.trophies} 🏆`},
 {id:'duel',f:'duel',ic:'⚔️',n:'Duelo amistoso',d:'Contra la IA, sin arriesgar trofeos.',go:()=>startDuel(),info:()=>`IA ${dif().n}`},
 {id:'mirror',f:'mirror',ic:'👥',n:'Rival espejo',d:'Una IA que juega con tu estilo.',go:()=>startMirror(),info:()=>`${mirrorPool().length} partidas para imitar`},
 {id:'auto',f:'auto',ic:'🎲',n:'Auto-batalla',d:'8 jardines: tienda y combate automático.',go:()=>startAuto(),info:()=>'Gana el último jardín en pie'},
 {id:'campaign',f:'campaign',ic:'🌱',n:'Campaña',d:'3 capítulos y 30 niveles.',go:()=>showLevels(),info:()=>`${save.cleared+save.chapC[0]+save.chapC[1]}/30 niveles`},
 {id:'survival',f:'survival',ic:'♾️',n:'Supervivencia',d:'Oleadas sin fin.',go:()=>startSurvival(),info:()=>`Récord: ${save.bestSurv} oleadas`},
 {id:'daily',f:'daily',ic:'📅',n:'Desafío diario',d:'Reglas nuevas cada día.',go:()=>startDaily(),info:()=>save.daily===dayKey()?'Premio de hoy cobrado':'¡Premio disponible hoy!'},
 {id:'event',f:'event',ic:'🎪',n:'Evento',d:'Una regla especial cada semana.',go:()=>showEvent(),info:()=>curEvent().n},
 {id:'tutorial',f:'tutorial',ic:'🎓',n:'Tutorial',d:'Aprende lo básico en 4 pasos.',go:()=>startTutorial(),info:()=>save.tut?'Completado':'Recomendado para empezar'}];
function curMain(){let m=MAINM.find(x=>x.id===save.mainMode);if(m&&featOn(m.f))return m;return MAINM.find(x=>x.id===(!save.tut?'tutorial':featOn('ladder')?'ladder':'campaign'))}
function playMain(){curMain().go()}
function showModes(){const g=document.getElementById('modeGrid');g.innerHTML='';const cur=curMain();
 for(const m of MAINM){const ok=featOn(m.f),b=document.createElement('button');b.className='mcard'+(m===cur?' on':'');b.disabled=!ok;
  b.innerHTML=`<span class="i">${ok?m.ic:'🔒'}</span><span><b>${m.n}</b>${m.d}<br>${ok?`<em>${esc(m.info())}</em>`:`Se desbloquea en el nivel ${FEATS[m.f].lv}`}</span>`;
  b.onclick=()=>{save.mainMode=m.id;persist();show('menu')};g.appendChild(b)}
 show('modes')}
function hideAll(){screens.forEach(s=>document.getElementById(s).classList.add('hidden'))}
function resume(){hideAll();if(G)G.paused=false}
function toMenu(){show('menu')}
function restart(){hideAll();if(current)current()}
function nextLevel(){hideAll();if(nextFn)nextFn()}
function showResult(title,text,next,canReplay,notice){document.getElementById('resTitle').textContent=title;document.getElementById('resText').innerHTML=text;nextFn=next;document.getElementById('resNext').classList.toggle('hidden',!next);
 document.getElementById('resReplay').classList.toggle('hidden',!canReplay||!lastRep);document.getElementById('resAgain').classList.toggle('hidden',!!notice);show('result')}
function watchLast(){if(lastRep)startReplay(lastRep)}
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function showReplays(){const L=document.getElementById('repList');L.innerHTML='';
 if(!replays.length)L.innerHTML='<div class="sub">Todavía no hay repeticiones. ¡Juega una partida!</div>';
 replays.forEach(r=>{const d=document.createElement('div');d.className='rowi';
  d.innerHTML=`<span>${r.won?'🏅':'💀'} <b>${esc(modeLabel(r.o))}</b> · oleada ${r.wave} · ${r.kills} insectos<br><small style="opacity:.7">${esc(r.date)} · semilla ${r.o.seed}</small></span>`;
  const b=document.createElement('button');b.className='small gold';b.textContent='▶ Ver';b.onclick=()=>startReplay(r);d.appendChild(b);
  if(featOn('mirror')&&mirrorPool().includes(r)){const m=document.createElement('button');m.className='small';m.textContent='👥 Desafiar';m.title='Juega contra una IA con el mazo y el estilo de esta partida';m.onclick=()=>startMirror(r);d.appendChild(m)}
  L.appendChild(d)});show('replays')}
function playSeed(){const v=Number(document.getElementById('seedIn').value.trim());if(!Number.isInteger(v)||v<0||v>4294967295){uiAlert('Escribe un número de semilla entre 0 y 4294967295.');return}startSurvival(v)}
function showOptions(){updInstall();document.getElementById('optName').value=save.name;
 const mk=(id,labels,cur,fn)=>{const s=document.getElementById(id);s.innerHTML='';labels.forEach((lab,i)=>{const b=document.createElement('button');b.className='small tog'+(i===cur?' on':'');b.textContent=lab;b.onclick=()=>{fn(i);persist();showOptions()};s.appendChild(b)})};
 mk('optDiff',DIFFS.map(d=>d.n),save.opts.diff,i=>save.opts.diff=i);
 const SP=[1,1.5,2];mk('optSpd',SP.map(v=>'x'+v),Math.max(0,SP.indexOf(save.opts.spd)),i=>save.opts.spd=SP[i]);
 document.getElementById('optFlash').classList.toggle('on',!!save.opts.noFlash);document.getElementById('optCb').classList.toggle('on',!!save.opts.cb);
 mk('optTs',['Normal','Grande','Muy grande'],save.opts.ts||0,i=>{save.opts.ts=i;applyA11y()});
 mk('optArt',['Dibujo del juego','Ilustraciones (5 personajes)'],save.opts.art||0,setArt);
 mk('optBio',['Según el nivel',...BIOMES],save.opts.bio||0,i=>save.opts.bio=i);
 for(const [id,k] of [['vVol','vol'],['vMus','mus'],['vFx','fx']]){const el=document.getElementById(id);el.value=Math.round(save.opts[k]*100);document.getElementById(id+'L').textContent=el.value+'%'}
 const P=document.getElementById('optProf');P.innerHTML='';
 for(let i=0;i<3;i++){const inf=i===PROF?{name:save.name||'(sin nombre)',lv:plLevel()}:profInfo(i),b=document.createElement('button');b.className='small tog'+(i===PROF?' on':'');
  b.textContent=`${i+1} · ${inf?`${inf.name} (Nv ${inf.lv})`:'vacío'}`;b.title=i===PROF?'Perfil actual':inf?'Cambiar a este perfil':'Crear un perfil nuevo';if(i!==PROF)b.onclick=()=>switchProfile(i);P.appendChild(b);
  if(inf&&i!==PROF){const x=document.createElement('button');x.className='small red';x.textContent='✕';x.title='Borrar este perfil';x.onclick=()=>deleteProfile(i);P.appendChild(x)}}
 const st=save.stats,tot=o=>Object.values(o).reduce((a,b)=>a+b,0);
 document.getElementById('optStats').innerHTML=`Partidas: ${tot(st.played)} · Victorias: ${tot(st.won)} · Insectos eliminados: ${st.kills}<br>Fusión más alta: nivel ${st.bestRank} · Récord supervivencia: ${save.bestSurv} · Mejor marca en Escalera: ${save.bestTrophies} 🏆<br>`
  +(Object.keys(MODE_N).filter(k=>st.played[k]).map(k=>`${MODE_N[k]}: ${st.won[k]||0}/${st.played[k]}`).join(' · ')||'Sin partidas todavía');
 show('options')}
function toggleFlash(){save.opts.noFlash=!save.opts.noFlash;persist();showOptions()}
function toggleCb(){save.opts.cb=!save.opts.cb;persist();showOptions()}
function setVol(k,el){save.opts[k]=clamp(+el.value/100,0,1);document.getElementById(el.id+'L').textContent=el.value+'%';auVol();persist();if(k!=='mus')sfx('click')}
function applyA11y(){const t=clamp(save.opts.ts|0,0,2);TS=[1,1.12,1.25][t];document.body.classList.toggle('ts1',t===1);document.body.classList.toggle('ts2',t===2)}
function profInfo(i){try{const k=profKeys(i)[0];const raw=localStorage.getItem(k)||(i===0?localStorage.getItem('brotes_rebeldes_v2'):null);if(!raw)return null;const s=JSON.parse(raw);return{name:s.name||'(sin nombre)',lv:plLevel(s.xp||0)}}catch(e){return null}}
function switchProfile(i){persist();persistReplays();try{localStorage.setItem(PROF_KEY,String(i))}catch(e){uiAlert('No se pudo cambiar de perfil: el navegador no permite guardar datos.');return}location.reload()}
async function deleteProfile(i){const inf=profInfo(i);if(i===PROF||!inf)return;if(!await uiConfirm(`¿Borrar el perfil ${i+1} (${inf.name})? Se pierde su progreso y sus repeticiones.`,'Borrar perfil',true))return;
 try{for(const k of profKeys(i))localStorage.removeItem(k);localStorage.removeItem(profKeys(i)[0]+'_danado');if(i===0)localStorage.removeItem('brotes_rebeldes_v2')}catch(e){}showOptions()}
function saveName(id,first){const v=document.getElementById(id).value.trim().slice(0,16);if(!v){uiAlert('Escribe un nombre.');return}save.name=v;persist();if(first)show('menu');else showOptions()}
function exportSave(){const data=JSON.stringify({app:'brotes-rebeldes',ver:4,exported:new Date().toISOString(),save,replays});
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download=`brotes-rebeldes-${(save.name||'jardin').replace(/[^\w-]+/g,'_')}-${dayKey()}.json`;
 document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function importSave(inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;
 f.text().then(async t=>{let d;try{d=JSON.parse(t)}catch(e){uiAlert('El archivo no es un guardado válido.');return}
  if(!d||d.app!=='brotes-rebeldes'||!d.save||typeof d.save!=='object'){uiAlert('El archivo no es un guardado de Brotes Rebeldes.');return}
  if(!await uiConfirm('Esto reemplaza tu progreso actual por el del archivo. ¿Seguir?','Reemplazar',true))return;
  for(const k of Object.keys(save))delete save[k];Object.assign(save,defSave());loadInto(d.save);migrate(d.save);
  replays=Array.isArray(d.replays)?d.replays.filter(r=>r&&r.o&&Array.isArray(r.acts)).slice(0,20):[];persist();persistReplays();showOptions()})}
async function resetSave(){if(!await uiConfirm('¿Borrar TODO el progreso y las repeticiones?\nNo se puede deshacer, salvo que tengas un archivo exportado.','Borrar todo',true))return;
 try{localStorage.removeItem(SAVE_KEY);localStorage.removeItem(OLD_KEY);localStorage.removeItem(REP_KEY);localStorage.removeItem(BAK_KEY);localStorage.removeItem(SAVE_KEY+'_danado')}catch(e){}location.reload()}
function checkSeason(){const sid=seasonId();if(save.season===null){save.season=sid;persist();return null}if(save.season===sid)return null;
 const d=divOf(save.trophies),c=60*(d+1),old=save.trophies;save.coins+=c;save.trophies=Math.floor(save.trophies/2);save.season=sid;persist();
 return `Terminó la temporada de la Escalera.<br>Llegaste a <b>${DIVS[d][1]}</b> con ${old} 🏆: +${c} 💰.<br>Tus trofeos bajan a ${save.trophies} para la nueva temporada.`}
let curCh=0;
function showLevels(ch){if(ch!==undefined)curCh=ch;if(!chOpen(curCh))curCh=0;const g=document.getElementById('lvlGrid');g.innerHTML='';
 const tb=document.getElementById('chTabs');tb.innerHTML='';
 CHAPTERS.forEach((C,j)=>{const b=document.createElement('button');const ok=chOpen(j);b.className='small tog'+(j===curCh?' on':'');b.disabled=!ok;b.textContent=ok?`${C.ic} ${C.n} · ${clr(j)}/10`:`🔒 ${C.n}`;b.title=ok?'':'Completa el capítulo anterior';b.onclick=()=>showLevels(j);tb.appendChild(b)});
 const C=CHAPTERS[curCh],cl=clr(curCh);
 C.lv.forEach((L,i)=>{const b=document.createElement('button');b.className='lvl'+(i<cl?' gold':'');b.disabled=i>cl;
  b.innerHTML=`<b>${i+1}</b>${i<=cl?L.n:'🔒'}<span style="font-size:12px;opacity:.8">${L.w} oleadas</span>`;b.onclick=()=>startCampaign(curCh,i);g.appendChild(b)});show('levels')}
let swapK=null;
function selectDeck(i){save.decks[save.deckIdx]=save.deck.slice();save.deckIdx=i;save.deck=save.decks[i].filter(k=>save.unlocked.includes(k));
 for(const k of ALL)if(save.deck.length<5&&save.unlocked.includes(k)&&!save.deck.includes(k))save.deck.push(k);save.decks[i]=save.deck.slice();swapK=null;persist();showDeck()}
// ===== Colección (40 personajes) y tarjeta de estadísticas =====
let colFilter='all',cardK=null,cardFrom='deck',cardPick=false;
const upCost=k=>Math.round(plv(k)*100*TIERS[tierOf(k)].up);
const campUnlock=k=>LEVELS.findIndex(L=>L.un===k);
// Miniaturas vivas en Mazo y colección: respiran y hacen un ataque de muestra cada 3 s (a 30 cuadros/s, solo si se ven).
const LIVECARDS=[];
function animCards(t){for(let j=LIVECARDS.length-1;j>=0;j--)if(!LIVECARDS[j].cv.isConnected)LIVECARDS.splice(j,1);if(!LIVECARDS.length||((animCards.f=(animCards.f||0)+1)%2))return;
 LIVECARDS.forEach((L,i)=>{if(!L.cv.offsetParent)return;const c2=L.cv.getContext('2d'),z=2*L.size/76;c2.setTransform(1,0,0,1,0,0);c2.clearRect(0,0,L.cv.width,L.cv.height);c2.setTransform(z,0,0,z,0,0);const ph=(t/3+i*.21)%1,af=ph<.1?.3-ph*3:0;drawUnit(c2,L.k,38,40,.5,t+i,0,0,save.skin[L.k],af)})}
function charCard(k,size){const U=UT[k],T=TIERS[tierOf(k)],un=save.unlocked.includes(k),d=document.createElement('div');d.className='ccard'+(un?'':' lk');d.style.setProperty('--tc',T.col);
 const pc=document.createElement('canvas');pc.width=(size||76)*2;pc.height=(size||76)*2;const c2=pc.getContext('2d');c2.scale(2*(size||76)/76,2*(size||76)/76);drawUnit(c2,k,38,40,.5,0,0,0,save.skin[k]);if(un)LIVECARDS.push({cv:pc,k,size:size||76});d.appendChild(pc);
 d.insertAdjacentHTML('beforeend',`<span class="ri">${ROLES[U.r].ic}</span>${save.deck.includes(k)?'<span class="dk">✔</span>':''}<div class="nm">${un?'':'🔒 '}${U.n}</div><div class="lv">${un?`Nivel ${plv(k)}/10`:T.n}</div>`);
 d.onclick=()=>showCard(k,'deck');return d}
function showDeck(){const tb=document.getElementById('deckTabs');tb.innerHTML='';
 if(featOn('decks'))for(let i=0;i<3;i++){const b=document.createElement('button');b.className='small tog'+(i===save.deckIdx?' on':'');b.textContent=`Mazo ${i+1}`;b.onclick=()=>selectDeck(i);tb.appendChild(b)}
 const ds=document.getElementById('deckSlots');ds.innerHTML='';save.deck.forEach(k=>ds.appendChild(charCard(k,70)));
 {const n=roleCounts(save.deck),parts=Object.keys(n).sort((a,b)=>n[b]-n[a]).map(r=>{const R=ROLES[r]||{n:r,ic:''},t=synTier(n[r]);const nm=SYN_N[r]||R.n;return t?`<span class="on">${R.ic} ${nm} ×${n[r]}: ${synText(r,t)}</span>`:`${R.ic} ${nm} ×1`});
  document.getElementById('deckSyn').innerHTML=`<b>Sinergias</b> <span>(2 personajes distintos del mismo rol en el tablero = nivel 1; 3 = nivel 2):</span> `+parts.map(p=>p.startsWith('<span')?p:`<span>${p}</span>`).join(' · ')}
 const fl=document.getElementById('colFilter');fl.innerHTML='';const own=ALL.filter(k=>save.unlocked.includes(k)).length;
 for(const [id,lab] of [['all',`Todos (${own}/40)`],['cobre','Cobre'],['plata','Plata'],['oro','Oro'],['leyenda','Legendario']]){const b=document.createElement('button');b.className='small tog'+(colFilter===id?' on':'');b.textContent=lab;
  if(TIERS[id])b.style.borderColor=TIERS[id].col;b.onclick=()=>{colFilter=id;showDeck()};fl.appendChild(b)}
 const g=document.getElementById('deckGrid');g.innerHTML='';ALL.filter(k=>colFilter==='all'||tierOf(k)===colFilter).forEach(k=>g.appendChild(charCard(k)));show('deck')}
function howGet(k){const t=tierOf(k),ci=campUnlock(k);if(t==='cobre')return ci>=0?`Se desbloquea al superar el nivel ${ci+1} de la Campaña (El Huerto).`:save.unlocked.includes(k)&&['espina','hielo','fuego','rayo','rocio'].includes(k)?'Disponible desde el inicio.':`Reclútalo por ${TIERS.cobre.buy} 💰.`;
 if(t==='plata')return `Reclútalo por ${TIERS.plata.buy} 💰 o consíguelo en cofres (común 6 %, raro 12 %).`;
 if(t==='oro')return 'Premium: solo en cofres raros (4 %) y épicos (17 %), y en el Pase (niveles 10 y 20).';
 return 'Premium: solo en cofres épicos (9 %) y como premio final del Pase (nivel 30).'}
function showCard(k,from){cardK=k;cardFrom=from||cardFrom;cardPick=false;renderCard();show('card')}
function renderCard(){const k=cardK,U=UT[k],T=TIERS[tierOf(k)],R=ROLES[U.r],un=save.unlocked.includes(k),l=plv(k),inD=save.deck.includes(k);
 document.getElementById('scard').style.setProperty('--tc',T.col);document.getElementById('cTier').textContent=T.n.toUpperCase();
 const P=U.p||{},n=(U.m==='multi'||U.m==='stars')?P.n:1,dmg=U.dmg*(1+.1*(l-1)),dps=dmg*n/U.int;
 const maxD=Math.max(...ALL.map(x=>UT[x].dmg)),maxR=Math.max(...ALL.map(x=>1/UT[x].int)),maxP=Math.max(...ALL.map(x=>UT[x].dmg*((UT[x].p||{}).n&&(UT[x].m==='multi'||UT[x].m==='stars')?UT[x].p.n:1)/UT[x].int));
 const row=(lab,v,mx,txtv)=>`<div class="srow"><span>${lab}</span><div class="bar"><i style="width:${Math.round(100*Math.sqrt(Math.min(1,v/mx)))}%"></i></div><b>${txtv}</b></div>`;
 const tg=U.tgt==='strong'?'El insecto con más vida':(U.m==='multi'?`Los ${P.n} más avanzados`:U.m==='stars'?`${P.n} insectos al azar`:U.m==='shout'?'Todos los insectos':'El insecto más avanzado');
 const speed=U.instant?'Instantáneo':(U.sp||900)>=1200?'Muy rápido':(U.sp||900)>=900?'Rápido':(U.sp||900)>=700?'Medio':'Lento (parabólico)';
 const ci=campUnlock(k),canBuy=!un&&T.buy>0&&ci<0;
 let html=`<div class="cn">${U.n}</div><div class="cr">${R.ic} ${R.n} · <span style="opacity:.8;font-weight:400">${R.d}</span></div><div class="cq">«${U.q}»</div>
  ${row('Daño por disparo',dmg,maxD,Math.round(dmg))}${row('Cadencia',1/U.int,maxR,(1/U.int).toFixed(2)+'/s')}${row('Daño por segundo',dps,maxP,Math.round(dps))}
  <div class="cbox"><b style="color:#ffe9a8">Especial:</b> ${U.d}</div>
  <div class="cbox" style="display:grid;grid-template-columns:1fr 1fr;gap:2px 10px"><span>🎯 Objetivo: <b>${tg}</b></span><span>🏹 Proyectil: <b>${speed}</b></span><span>⭐ Mejora permanente: <b>${l}/10</b> (+10 % daño c/u)</span><span>🧬 Fusión: x${2} a x7 de nivel</span></div>
  <div class="cbox"><b style="color:#ffe9a8">Cómo conseguirlo:</b> ${un?'✔ Ya lo tienes.':howGet(k)}</div>`;
 if(cardPick)html+=`<div class="cbox"><b>¿A quién reemplaza en el mazo?</b><div class="cacts" id="cPick" style="margin-top:4px"></div></div>`;
 html+=`<div class="cacts" id="cActs"></div>`;document.getElementById('cInfo').innerHTML=html;
 const A=document.getElementById('cActs'),btn=(lab,cls,fn,dis)=>{const b=document.createElement('button');b.className=cls||'';b.textContent=lab;b.disabled=!!dis;b.onclick=fn;A.appendChild(b)};
 if(un&&!inD)btn('🃏 Usar en el mazo','gold',()=>{cardPick=true;renderCard()});else if(inD)btn('✔ En tu mazo','',()=>{},true);
 if(un)btn(l>=10?'Mejora máxima':`⬆ Mejorar 💰${upCost(k)}`,'',()=>{const c=upCost(k);if(save.coins<c)return;save.coins-=c;save.lv[k]=l+1;persist();renderCard();document.querySelectorAll('.coinv').forEach(e=>e.textContent=save.coins)},l>=10||save.coins<upCost(k));
 if(canBuy)btn(`🛒 Reclutar 💰${T.buy}`,'gold',()=>{if(save.coins<T.buy)return;save.coins-=T.buy;save.unlocked.push(k);persist();sfx('chest');renderCard()},save.coins<T.buy);
 btn('← Volver','red',()=>{cardK=null;cardFrom==='album'?showAlbum('plants'):showDeck()});
 if(cardPick){const pk=document.getElementById('cPick');save.deck.forEach((d,i)=>{const b=document.createElement('button');b.className='small';b.textContent=UT[d].n;b.onclick=()=>{save.deck[i]=k;save.decks[save.deckIdx]=save.deck.slice();persist();cardPick=false;renderCard()};pk.appendChild(b)})}}
function drawCardPortrait(t){const cv3=document.getElementById('cardCv');if(!cv3)return;const c=cv3.getContext('2d');c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,260,300);
 const ph=t%2.4,af=ph<.3?.3-ph:0,k=cardK;drawUnit(c,k,130,186,1.55,t,0,0,save.skin[k],af);
 if(!save.unlocked.includes(k)){c.globalCompositeOperation='source-atop';c.fillStyle='rgba(10,16,12,.78)';c.fillRect(0,0,260,300);c.globalCompositeOperation='source-over';txt(c,'🔒',130,150,46,'#fff')}}
let cmdFilter='all',cmdK=null;
function showCmds(){const fl=document.getElementById('cmdFilter');fl.innerHTML='';const own=CMDK.filter(k=>save.cmds.includes(k)).length;
 for(const [id,lab] of [['all',`Todos (${own}/16)`],['cobre','Cobre'],['plata','Plata'],['oro','Oro'],['leyenda','Legendario']]){const b=document.createElement('button');b.className='small tog'+(cmdFilter===id?' on':'');b.textContent=lab;if(TIERS[id])b.style.borderColor=TIERS[id].col;b.onclick=()=>{cmdFilter=id;showCmds()};fl.appendChild(b)}
 const g=document.getElementById('cmdGrid');g.innerHTML='';
 for(const k of CMDK){const C=CMDS[k],T=TIERS[C.t];if(cmdFilter!=='all'&&C.t!==cmdFilter)continue;const own2=save.cmds.includes(k),d=document.createElement('div');d.className='mcd'+(own2?'':' lk');d.style.setProperty('--tc',T.col);
  const pc=document.createElement('canvas');pc.width=pc.height=128;pc.getContext('2d').drawImage(bustSprite(k),0,0,128,128);d.appendChild(pc);
  d.insertAdjacentHTML('beforeend',`<div><b>${own2?'':'🔒 '}${C.n}</b><span style="color:${T.col};font-weight:700">${T.n}</span> · ${C.ic} ${C.an}<br>${own2?`Nivel ${save.cmdLv[k]||1}/10`:'No lo tienes'}</div>${save.cmd===k?'<span class="sel">✔</span>':''}`);
  d.onclick=()=>showCmdCard(k);g.appendChild(d)}
 show('cmds')}
function cmdHow(k){const t=CMDS[k].t;if(k==='lluvia')return 'Se consigue gratis al desbloquear los comandantes (nivel 4).';
 if(t==='cobre')return `Reclútalo por ${CMD_BUY.cobre} 💰.`;if(t==='plata')return `Reclútalo por ${CMD_BUY.plata} 💰 o consíguelo en cofres (común 2 %, raro 4 %).`;
 if(t==='oro')return 'Premium: solo en cofres raros (2 %) y épicos (6 %), y en el Pase (nivel 15).';return 'Premium: solo en cofres épicos (4 %) y en el Pase (nivel 25).'}
function showCmdCard(k){cmdK=k;renderCmdCard();show('cmdcard')}
function renderCmdCard(){const k=cmdK,C=CMDS[k],T=TIERS[C.t],own=save.cmds.includes(k),L=save.cmdLv[k]||1,on=featOn('cmd');
 document.getElementById('mcard').style.setProperty('--tc',T.col);document.getElementById('mTier').textContent=T.n.toUpperCase();
 const pips=[...Array(10)].map((_,i)=>`<span class="pip${i<L?' on':''}"></span>`).join('');
 let h=`<div class="cn">${C.n}</div><div class="cr">${C.ti}</div><div class="cq">${C.q}</div>
  <div class="abil"><h4><span class="tag">ACTIVA</span>${C.ic} ${C.an}<span class="cdc">⏱ Recarga ${Math.round(ccd(C,L))} s · tecla Q</span></h4>${C.ad(L)}
   ${L<10?`<div class="nx">▲ Nivel ${L+1}: ${C.ad(L+1)} · Recarga ${Math.round(ccd(C,L+1))} s</div>`:'<div class="nx">★ Nivel máximo alcanzado</div>'}</div>
  <div class="abil" style="border-style:dashed"><h4><span class="tag">PASIVA</span>Siempre activa</h4>${C.pd}</div>
  <div class="cbox" style="display:flex;align-items:center;gap:10px"><b>Nivel ${L}/10</b><span class="pips">${pips}</span><span style="opacity:.75;font-size:12px">+10 % de potencia y −3 % de recarga por nivel</span></div>
  <div class="cbox"><b style="color:#ffe9a8">Cómo conseguirlo:</b> ${own?'✔ Ya lo tienes.':cmdHow(k)}${on?'':` <i>(Los comandantes se desbloquean en el nivel ${FEATS.cmd.lv}.)</i>`}</div><div class="cacts" id="mActs"></div>`;
 document.getElementById('cmInfo').innerHTML=h;const A=document.getElementById('mActs'),btn=(lab,cls,fn,dis)=>{const b=document.createElement('button');b.className=cls||'';b.textContent=lab;b.disabled=!!dis;b.onclick=fn;A.appendChild(b)};
 if(own&&on)btn(save.cmd===k?'✔ Es tu comandante':'🎖️ Elegir como comandante',save.cmd===k?'':'gold',()=>{save.cmd=k;persist();renderCmdCard()},save.cmd===k);
 if(own)btn(L>=10?'Nivel máximo':`⬆ Subir a nivel ${L+1} · 💰${cmdUpCost(k)}`,'',()=>{const c=cmdUpCost(k);if(save.coins<c)return;save.coins-=c;save.cmdLv[k]=L+1;persist();sfx('chest');renderCmdCard()},L>=10||save.coins<cmdUpCost(k));
 const price=CMD_BUY[C.t];if(!own&&price&&k!=='lluvia')btn(`🛒 Reclutar · 💰${price}`,'gold',()=>{if(save.coins<price)return;save.coins-=price;save.cmds.push(k);if(!save.cmd)save.cmd=k;persist();sfx('chest');renderCmdCard()},save.coins<price);
 btn('← Volver','red',()=>{cmdK=null;showCmds()});document.querySelectorAll('.coinv').forEach(e=>e.textContent=save.coins)}
function drawCmdPortrait(t){const cv3=document.getElementById('cmdCv');if(!cv3)return;const c=cv3.getContext('2d');c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,260,300);
 const k=cmdK,C=CMDS[k];if(HPORT[k])drawAvatar(c,k,130,168,102,t,!save.cmds.includes(k));else drawAvatar(c,k,130,140,112,t,!save.cmds.includes(k));
 rr(c,40,262,180,28,12,'rgba(0,0,0,.65)',C.col,2);txt(c,`${C.ic} ${C.an}`,130,276,14,'#fff')}
function bugInfo(B){const t=[];if(B.boss)t.push('Jefe: si llega al final pierdes todas las vidas');if(B.armor)t.push('Coraza: resta daño a cada golpe');if(B.fly)t.push('Vuela');if(B.split)t.push('Al morir se divide en 2 crías');if(B.summon)t.push('Invoca mosquitos');if(B.cut)t.push('Corta tus plantas');if(B.curl)t.push('Se enrolla: 2 s quieto e invulnerable');if(B.dust)t.push('Su polvo duerme 3 plantas durante 3 s');if(B.heal)t.push('Cura a todos los insectos');if(B.elite)t.push('Semijefe: si llega al final pierdes 2 vidas');if(B.jump)t.push('Salta hacia adelante');if(B.regen)t.push('Se regenera');if(B.haste)t.push('Acelera a los insectos cercanos');if(B.stink)t.push('Al morir duerme a la planta más cercana');if(B.web)t.push(`Atrapa ${B.web.n} plantas en su telaraña`);if(B.guard)t.push('Da escudos a los insectos cercanos');if(B.sting)t.push('Su picadura frena a una planta');if(B.call)t.push(`Llama refuerzos (${BUGS[B.call.k].n})`);if(B.rally)t.push('Acelera a las hormigas');if(B.burrow)t.push('Se entierra: invisible e invulnerable');
 const sp=B.t<=14?'muy rápido':B.t<=20?'rápido':B.t<=26?'normal':'lento';return{sp,t}}
function showAlbum(tab){document.getElementById('albP').classList.toggle('on',tab==='plants');document.getElementById('albI').classList.toggle('on',tab==='bugs');
 const g=document.getElementById('albGrid');g.innerHTML='';const st=save.stats;
 const card=(draw,html,dark)=>{const d=document.createElement('div');d.className='item';const pc=document.createElement('canvas');pc.width=128;pc.height=128;const c2=pc.getContext('2d');c2.scale(2,2);draw(c2);if(dark){c2.globalCompositeOperation='source-atop';c2.fillStyle='#46584c';c2.fillRect(0,0,64,64);c2.globalCompositeOperation='source-over'}d.appendChild(pc);d.insertAdjacentHTML('beforeend',html);g.appendChild(d)};
 if(tab==='plants')ALL.forEach(k=>{const U=UT[k],un=save.unlocked.includes(k);
  card(c2=>drawUnit(c2,k,32,30,.62,0,0,0),`<div class="nm">${U.n}</div><div>${un?U.d:'🔒 Se desbloquea en la campaña'}</div>`
   +(un?`<div class="st">Daño base ${U.dmg} · ${(1/U.int).toFixed(2)} disparos/s<br>Mejora permanente: nivel ${plv(k)}/10<br>Plantadas: ${st.pl[k]||0} · Fusión máxima: ${st.mr[k]?'nivel '+st.mr[k]:'—'}</div>`:''),!un)});
 else Object.keys(BUGS).forEach(k=>{const B=BUGS[k],seen=(st.kk[k]||0)>0,info=bugInfo(B);
  card(c2=>drawBug(c2,k,32,42,B.boss?1.05:1.5,0,0,null),`<div class="nm">${seen?B.n+(B.boss?' 👑':B.elite?' ⭐':''):'???'}</div>`
   +(seen?`<div class="st">${persLine(k)}<span>Vida base ${B.hp} · Velocidad: ${info.sp}</span>${info.t.length?'<br>'+info.t.map(x=>`<span>${x}</span>`).join(' · '):''}<br><span>Eliminados: ${st.kk[k]}</span></div>`:'<div>Elimina uno para descubrirlo.</div>'),!seen)});
 if(tab==='plants')[...g.children].forEach((el,i)=>{el.style.cursor='pointer';el.style.borderColor=TIERS[tierOf(ALL[i])].col;el.onclick=()=>showCard(ALL[i],'album')});
 show('album')}

// ===== Inventario =====
function miniCanvas(draw,px){const pc=document.createElement('canvas');pc.width=px*2;pc.height=px*2;const c2=pc.getContext('2d');c2.scale(2,2);draw(c2);return pc}
function drawChest(c,x,y,col,open,s){c.save();c.translate(x,y);c.scale(s,s);
 E(c,0,4,46,8);c.fillStyle='rgba(0,0,0,.3)';c.fill();
 RRp(c,-40,-38,80,40,7);P(c,LG(c,0,-38,0,2,['#a8703a','#6b4420']),3);
 for(const bx of [-26,22]){RRp(c,bx-2,-38,6,40,2);P(c,col,1.8)}
 c.save();c.translate(-40,-38-open*16);c.rotate(-open*.38);RRp(c,0,-22,80,24,10);P(c,LG(c,0,-22,0,2,['#c88a4a','#7a4a1c']),3);
 for(const bx of [14,62]){RRp(c,bx-2,-22,6,24,2);P(c,col,1.8)}c.restore();
 if(open<.2){RRp(c,-7,-44,14,14,3);P(c,LG(c,0,-44,0,-30,['#fff6b0','#ffd23f','#c88a10']),2)}
 c.restore()}
let invTab='chests';
function showInv(tab){const TABS=[['chests','🎁 Cofres','inv'],['gear','🧪 Equipo','gear'],['relics','🏺 Reliquias','relics'],['skins','🎨 Aspectos','inv']];
 invTab=tab||invTab;if(!featOn(TABS.find(t=>t[0]===invTab)[2]))invTab='chests';
 const tb=document.getElementById('invTabs');tb.innerHTML='';
 for(const [id,lab,f] of TABS){const b=document.createElement('button');const ok=featOn(f);b.className='small tog'+(id===invTab?' on':'');b.disabled=!ok;b.textContent=ok?lab:`🔒 ${FEATS[f].n} · Nv ${FEATS[f].lv}`;b.onclick=()=>showInv(id);tb.appendChild(b)}
 const B=document.getElementById('invBody');B.innerHTML='';
 if(invTab==='chests'){const g=document.createElement('div');g.className='ccards';
  for(const k in CHESTS){const C=CHESTS[k],n=save.inv.chests[k]||0,d=document.createElement('div');d.className='cc';
   d.appendChild(miniCanvas(c=>drawChest(c,75,84,C.col,0,1.05),75));
   d.insertAdjacentHTML('beforeend',`<div class="n">${C.n} · ×${n}</div><div class="prob">${C.rolls} premio${C.rolls>1?'s':''}, cada uno:<br>${C.t.map(e=>`${e[0]} % ${KIND_N[e[1]]}${e[1]==='coins'?` (${e[2]}–${e[3]})`:''}`).join('<br>')}</div>`);
   const b=document.createElement('button');b.className='small gold';b.textContent='Abrir';b.disabled=!n;b.onclick=()=>openChest(k);d.appendChild(b);g.appendChild(d)}
  B.appendChild(g);B.insertAdjacentHTML('beforeend','<div class="sub" style="margin:4px 0 0;font-size:14px">Los cofres se consiguen jugando o en la Tienda. Un aspecto o reliquia repetido se cambia por 150 💰.</div>')}
 else if(invTab==='gear'){B.insertAdjacentHTML('beforeend',`<div class="sub" style="margin:0;font-size:14px">Abonos disponibles: ${Object.keys(GEAR).map(k=>`${GEAR[k].ic} ${GEAR[k].n} ×${save.inv.gear[k]||0} (${GEAR[k].d})`).join(' · ')}<br>Toca una ranura para cambiar de abono; el que quitas vuelve al inventario.</div>`);
  for(const k of ALL){if(!save.unlocked.includes(k))continue;const e=save.eq[k]||[null,null],r=document.createElement('div');r.className='grow';
   r.appendChild(miniCanvas(c=>drawUnit(c,k,24,27,.36,0,0,0,save.skin[k]),24));r.insertAdjacentHTML('beforeend',`<span class="nm">${UT[k].n}${save.deck.includes(k)?' ✔':''}</span>`);
   for(let i=0;i<2;i++){const b=document.createElement('button');b.className='small slot';b.textContent=e[i]?`${GEAR[e[i]].ic} ${GEAR[e[i]].n}`:'＋ Ranura vacía';b.onclick=()=>cycleSlot(k,i);r.appendChild(b)}
   B.appendChild(r)}}
 else if(invTab==='relics'){B.insertAdjacentHTML('beforeend',`<div class="sub" style="margin:0;font-size:14px">Equipadas: ${save.relEq.length}/2. Toca una reliquia tuya para ponerla o quitarla. Se consiguen en cofres raros, épicos y en el pase.</div>`);
  const g=document.createElement('div');g.className='rels';
  for(const k in RELICS){const R=RELICS[k],own=save.relics.includes(k),on=save.relEq.includes(k),d=document.createElement('div');d.className='cmd'+(own?'':' locked')+(on?' on':'');
   d.innerHTML=`<div class="ic" style="font-size:36px;width:44px">${own?R.ic:'❔'}</div><div><b>${own?R.n:'???'}</b>${on?' ✔':''}<br>${own?R.d:'Todavía no la tienes.'}</div>`;
   if(own)d.onclick=()=>{if(on)save.relEq=save.relEq.filter(x=>x!==k);else if(save.relEq.length<2)save.relEq.push(k);else{uiAlert('Ya tienes 2 reliquias equipadas. Quita una primero.');return}persist();showInv('relics')};g.appendChild(d)}
  B.appendChild(g)}
 else if(invTab==='skins'){B.insertAdjacentHTML('beforeend','<div class="sub" style="margin:0;font-size:14px">Los aspectos son solo estéticos. Se consiguen en cofres y en el pase.</div>');
  for(const k of ALL){if(!save.unlocked.includes(k))continue;const r=document.createElement('div');r.className='skrow';r.insertAdjacentHTML('beforeend',`<span style="width:130px;font-weight:700;color:#ffe9a8">${UT[k].n}</span>`);
   for(const s of [null,...Object.keys(SKINS)]){const own=!s||(save.skins[k]||[]).includes(s)||(SKINS[s].prem&&(save.premSkins||[]).includes(s)),on=(save.skin[k]||null)===s,d=document.createElement('div');d.className='skc'+(on?' on':'')+(own?'':' lk');
    d.appendChild(miniCanvas(c=>drawUnit(c,k,24,27,.36,0,0,0,s),24));d.insertAdjacentHTML('beforeend',`<span>${own?'':'🔒 '}${s?SKINS[s].n:'Original'}</span>`);
    if(own)d.onclick=()=>{if(s)save.skin[k]=s;else delete save.skin[k];persist();showInv('skins')};r.appendChild(d)}
   B.appendChild(r)}}
 show('inv')}
function cycleSlot(k,i){const e=save.eq[k]=save.eq[k]||[null,null],cur=e[i],keys=Object.keys(GEAR);if(cur)save.inv.gear[cur]=(save.inv.gear[cur]||0)+1;e[i]=null;
 for(let n=cur?keys.indexOf(cur)+1:0;n<keys.length;n++)if((save.inv.gear[keys[n]]||0)>0){e[i]=keys[n];save.inv.gear[keys[n]]--;break}
 persist();showInv('gear')}
let chestAnim=null;
function openChest(type){if(!((save.inv.chests[type]||0)>0))return;save.inv.chests[type]--;const res=rollChest(type);persist();sfx('chest');
 const C=CHESTS[type],R=document.getElementById('chestRes'),btns=document.getElementById('chestBtns'),more=document.getElementById('chestMore');
 document.getElementById('chestT').textContent=C.n;R.innerHTML='';btns.style.visibility='hidden';show('chest');
 const c=document.getElementById('chestCv').getContext('2d'),t0=performance.now(),sp=[...Array(40)].map(()=>({vx:rand(-170,170),vy:rand(-280,-80)}));let shown=false;
 cancelAnimationFrame(chestAnim);
 const fr=now=>{const t=(now-t0)/1000,open=t>1.1,dt=t-1.1;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,320,200);
  if(open){const g=c.createRadialGradient(160,110,8,160,110,140);g.addColorStop(0,C.col);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=Math.min(1,dt*3)*.8;c.fillStyle=g;c.fillRect(0,0,320,200);c.globalAlpha=1}
  drawChest(c,160+(open?0:Math.sin(t*42)*Math.min(1,t)*5),170,C.col,open?Math.min(1,dt*4):0,1.6);
  if(open)for(const s of sp)circ(c,160+s.vx*dt,110+s.vy*dt+320*dt*dt,3,'#ffe680');
  if(open&&!shown){shown=true;res.forEach((r,i)=>R.insertAdjacentHTML('beforeend',`<div class="unl popin" style="animation-delay:${i*.18}s">${r.ic} ${esc(r.txt)}</div>`));
   setTimeout(()=>{btns.style.visibility='visible'},res.length*180+200);
   const left=save.inv.chests[type]||0;more.textContent=`Abrir otro (${left})`;more.disabled=!left;more.onclick=()=>openChest(type)}
  if(t<2.4)chestAnim=requestAnimationFrame(fr)};
 chestAnim=requestAnimationFrame(fr)}

// ===== Pase de temporada =====
const daysLeft=()=>28-Math.floor(Date.now()/864e5)%28;
const PASS_IC={chest:'🎁',coins:'💰',gear:'🧪',skin:'🎨',relic:'🏺',cpl:'✨',cor:'🌟',cle:'👑',mcp:'🎖️',mco:'🎖️',mcl:'🎖️'};
function showPass(msg){const L=passLevel(),xp=save.pass.xp,un=passUnclaimed();
 document.getElementById('passInfo').textContent=L>=PASS_MAX?`¡Pase completo! Quedan ${daysLeft()} días de temporada.`:`Nivel ${L}/${PASS_MAX} · ${xp%PASS_STEP}/${PASS_STEP} ⭐ para el siguiente · Quedan ${daysLeft()} días de temporada`;
 document.querySelector('#passBar i').style.width=(L>=PASS_MAX?100:xp%PASS_STEP)+'%';
 const g=document.getElementById('passGrid');g.innerHTML='';
 const P=!!save.pass.prem,pc=save.pass.pclaimed||[],pp=document.getElementById('passPrem');pp.innerHTML='';
 if(P)pp.innerHTML='<b style="color:#e8c0ff">👑 Pase Premium activo esta temporada</b>&nbsp;· cada nivel también da su premio 💎 de abajo.';
 else{pp.insertAdjacentHTML('beforeend','<span>👑 <b style="color:#e8c0ff">Pase Premium</b>: suma la fila 💎 (gemas, monedas y 3 cofres legendarios).</span>');
  for(const [cur,txt,ok] of [['coins',`Activar 💰 ${PASS_PREM_COINS}`,save.coins>=PASS_PREM_COINS],['gems',`Activar 💎 ${PASS_PREM_GEMS}`,(save.gems||0)>=PASS_PREM_GEMS]]){const b=document.createElement('button');b.className='small '+(cur==='gems'?'gem':'gold');b.textContent=txt;b.disabled=!ok;b.onclick=()=>{buyPassPrem(cur);showPass('👑 ¡Pase Premium activado!')};pp.appendChild(b)}}
 for(let i=1;i<=PASS_MAX;i++){const r=passReward(i),got=save.pass.claimed.includes(i),can=i<=L&&!got,pr=premReward(i),pgot=pc.includes(i),pcan=P&&i<=L&&!pgot,d=document.createElement('div');d.className='pl'+(got&&(pgot||!P)?' got done':can?' claim':'')+(pcan?' pclaim':'');
  d.innerHTML=`<span style="opacity:.75">Nv ${i}</span><span class="ic">${got?'✔':PASS_IC[r.k]}</span><span>${rewardLabel(r)}</span><span class="pp">${P?(pgot?'✔ ':''):'🔒 '}${premLabel(pr)}</span>`;
  if(can||pcan)d.onclick=()=>{const out=[];if(can)out.push(claimPass(i));if(pcan)out.push(claimPrem(i));persist();showPass(out.map(it=>`${it.ic} ${esc(it.txt)}`).join(' · '))};g.appendChild(d)}
 document.getElementById('passAll').disabled=!un.length&&!premUnclaimed().length;document.querySelectorAll('.coinv').forEach(e=>e.textContent=save.coins);document.querySelectorAll('.gemv').forEach(e=>e.textContent=save.gems||0);document.getElementById('passMsg').innerHTML=msg||'';show('pass')}
function claimAllPass(){const got=[...passUnclaimed().map(L=>claimPass(L)),...premUnclaimed().map(L=>claimPrem(L))];persist();showPass(got.map(it=>`${it.ic} ${esc(it.txt)}`).join(' · '))}

// ===== Avisos (generados por el juego, sin conexión) =====
// [icono, texto, acción, ¿requiere atención?]
function newsItems(){const it=[],L=plLevel();
 if(!save.tut)it.push(['🎓','¿Primera vez? El tutorial te enseña lo básico en 4 pasos.','tutorial',false]);
 const ch=(save.inv.chests.comun||0)+(save.inv.chests.raro||0)+(save.inv.chests.epico||0);
 if(ch)it.push(['🎁',`Tienes ${ch} cofre${ch>1?'s':''} de semillas sin abrir.`,featOn('inv')?'inv':null,featOn('inv')]);
 if(featOn('pass')){const u=passUnclaimed().length;it.push(['🎟️',u?`Tienes ${u} premio${u>1?'s':''} del pase sin reclamar.`:`Pase de temporada: nivel ${passLevel()}/${PASS_MAX}. Quedan ${daysLeft()} días.`,'pass',u>0])}
 if(featOn('daily')&&save.daily!==dayKey())it.push(['📅','El desafío diario de hoy está disponible: premio de 150 💰, 5 💎 y un cofre raro.','daily',true]);
 if(featOn('event')){const e=curEvent(),done=save.eventWeek===weekIdx();it.push([e.ic,`Evento de la semana: ${e.n}. ${e.d} ${done?'Ya cobraste su premio grande.':'Premio: 200 💰, 40 💎 y un cofre raro.'} Quedan ${weekDaysLeft()} días.`,'event',!done])}
 if(featOn('ladder'))it.push(['🏆',`Temporada de la Escalera: quedan ${daysLeft()} días. Vas en ${DIVS[divOf(save.trophies)][1]} con ${save.trophies} 🏆.`,null,false]);
 let nx=null;for(const f in FEATS)if(FEATS[f].lv>L&&(!nx||FEATS[f].lv<nx.lv))nx={lv:FEATS[f].lv};for(const k in CMDS)if(CMDS[k].lv>L&&(!nx||CMDS[k].lv<nx.lv))nx={lv:CMDS[k].lv};
 if(nx){const names=[...Object.values(FEATS).filter(f=>f.lv===nx.lv).map(f=>f.n),...Object.values(CMDS).filter(c=>c.lv===nx.lv).map(c=>c.n)];it.push(['🔓',`En el nivel ${nx.lv} se desbloquea: ${names.join(', ')}.`,null,false])}
 return it}
function showNews(){const L=document.getElementById('newsList');L.innerHTML='';const it=newsItems();
 if(!it.length)L.innerHTML='<div class="sub">No hay novedades.</div>';
 const go={tutorial:startTutorial,inv:()=>showInv('chests'),pass:()=>showPass(),daily:startDaily,event:()=>showEvent()};
 for(const [ic,tx,act,hot] of it){const d=document.createElement('div');d.className='rowi';if(hot)d.style.borderColor='#ffcf4a';d.innerHTML=`<span><span style="font-size:22px">${ic}</span> ${tx}</span>`;
  if(act&&go[act]){const b=document.createElement('button');b.className='small gold';b.textContent='Ir';b.onclick=go[act];d.appendChild(b)}L.appendChild(d)}
 show('news')}

