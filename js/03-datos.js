// Brotes Rebeldes · Datos del juego: plantas, plantel de 40 personajes, insectos, jefes y capítulos.
"use strict";
// ============ DATA ============
const UT={
 espina:{n:'Lanzaespinas',dmg:20,int:.8,shot:'#d8f0a0',d:'Dispara espinas al insecto más avanzado.'},
 hielo:{n:'Flor Escarcha',dmg:10,int:1,shot:'#e0f7ff',d:'Ralentiza a los insectos que golpea.'},
 fuego:{n:'Chile Ígneo',dmg:16,int:1.2,shot:'#ff9a2a',d:'Bolas de fuego con daño en área.'},
 rayo:{n:'Ortiga Voltaica',dmg:14,int:1.1,shot:'#fff27a',d:'Rayo que salta entre varios insectos.'},
 rocio:{n:'Rociera',dmg:8,int:1,shot:'#9fe0ff',d:'Genera rocío extra cada 6 s.'},
 veneno:{n:'Seta Tóxica',dmg:6,int:1,shot:'#c8f05a',d:'Veneno continuo que ignora corazas.'},
 trampa:{n:'Atrapamoscas',dmg:45,int:1.7,shot:'#ff8080',d:'Golpe fuerte; a veces devora al insecto.'},
 sol:{n:'Flor Solar',dmg:10,int:1,shot:'#ffe680',d:'Acelera a las plantas de al lado.'},
};
const ORDER=['espina','hielo','fuego','rayo','rocio','veneno','trampa','sol'];
// ===== PLANTEL DE 40 PERSONAJES (diseño propio) =====
// Rarezas: cobre y plata se consiguen fácil; oro y legendario solo en cofres raros/épicos y en el pase (nunca con dinero real).
const TIERS={cobre:{n:'Cobre',col:'#d08a4a',c2:'#6a3410',ord:0,buy:300,dup:120,up:1},plata:{n:'Plata',col:'#d8e2ee',c2:'#5a6a7c',ord:1,buy:900,dup:300,up:1.5},
 oro:{n:'Oro',col:'#ffd23f',c2:'#9a5a06',ord:2,buy:0,dup:600,up:2},leyenda:{n:'Legendario',col:'#d07aff',c2:'#4a127a',ord:3,buy:0,dup:1200,up:3}};
// Sinergias (partidas v:9): con 2 personajes DISTINTOS del mismo rol en el tablero se activa el nivel 1; con 3, el nivel 2.
// dmg/spd = daño/cadencia de las plantas de ese rol; all = cadencia de TODAS tus plantas; gen = rocío que generan los productores.
// Los roles con pocos personajes se agrupan: Francotirador cuenta como Tirador y Debilitador como Control.
const SYN_GROUP={franco:'tirador',debil:'control'},synRole=r=>SYN_GROUP[r]||r;
const SYN={tirador:{dmg:[.15,.3]},rafaga:{spd:[.12,.25]},area:{dmg:[.15,.3]},control:{dmg:[.15,.3]},veneno:{dmg:[.2,.4]},
 cadena:{dmg:[.15,.3]},apoyo:{all:[.05,.1]},productor:{gen:[.25,.5]},ejecutor:{dmg:[.2,.4]}};
const SYN_N={tirador:'Tiradores',control:'Control'};
function synText(r,t){const S=SYN[r];if(!S)return'';const v=x=>Math.round(x*100)+' %';
 if(S.dmg)return`+${v(S.dmg[t-1])} de daño`;if(S.spd)return`+${v(S.spd[t-1])} de cadencia`;if(S.all)return`+${v(S.all[t-1])} de cadencia a todo el jardín`;if(S.gen)return`+${v(S.gen[t-1])} de rocío`;return''}
// Personajes distintos de cada rol en una lista de ids (tablero o mazo) → {rol: cantidad}.
function roleCounts(keys){const seen={},n={};for(const k of keys){if(!k||seen[k]||!UT[k])continue;seen[k]=1;const r=synRole(UT[k].r);if(r)n[r]=(n[r]||0)+1}return n}
const synTier=c=>c>=3?2:c>=2?1:0;
const ROLES={tirador:{n:'Tirador',ic:'🎯',d:'Daño constante a un objetivo.'},rafaga:{n:'Ráfaga',ic:'💨',d:'Dispara muy rápido, golpes débiles.'},
 franco:{n:'Francotirador',ic:'🔭',d:'Lento pero devastador; busca al más fuerte.'},area:{n:'Daño en área',ic:'💥',d:'Daña a varios insectos a la vez.'},
 control:{n:'Control',ic:'❄️',d:'Ralentiza, congela, enraíza o empuja oleadas.'},veneno:{n:'Veneno',ic:'☠️',d:'Daño continuo que ignora corazas.'},
 cadena:{n:'Cadena',ic:'⚡',d:'Su ataque salta entre insectos.'},apoyo:{n:'Apoyo',ic:'✨',d:'Hace más fuertes a otras plantas.'},
 productor:{n:'Productor',ic:'💧',d:'Genera rocío extra.'},ejecutor:{n:'Ejecutor',ic:'🦷',d:'Remata insectos de un golpe.'},debil:{n:'Debilitador',ic:'🔻',d:'Marca insectos para que reciban más daño.'}};
// m = mecánica (solo personajes nuevos; los 8 clásicos conservan su lógica exacta), p = parámetros, pv = proyectil, sp = velocidad del proyectil.
const ROSTER=[
 // ---- COBRE ----
 {k:'espina',t:'cobre',r:'tirador',pv:'needle',q:'Centinela del huerto: nunca falla un tiro.'},
 {k:'hielo',t:'cobre',r:'control',pv:'flake',q:'Su aliento congela hasta la prisa de un mosquito.'},
 {k:'fuego',t:'cobre',r:'area',pv:'flame',q:'Picante de nacimiento, explosivo por vocación.'},
 {k:'rayo',t:'cobre',r:'cadena',pv:'spark',q:'Cargada de estática y de mal humor.'},
 {k:'rocio',t:'cobre',r:'productor',pv:'drop',q:'Riega al jardín entero con una sonrisa.'},
 {k:'veneno',t:'cobre',r:'veneno',pv:'spore',q:'Dulce por fuera, tóxica por dentro.'},
 {k:'trampa',t:'cobre',r:'ejecutor',pv:'fang',q:'Siempre tiene hambre. Siempre.'},
 {k:'sol',t:'cobre',r:'apoyo',pv:'sun',q:'Donde ella brilla, todos disparan más rápido.'},
 {k:'bellota',t:'cobre',r:'rafaga',n:'Bellotero',dmg:7,int:.32,m:'single',pv:'seed',sp:1100,shot:'#c08a4a',d:'Ametralla bellotas a toda velocidad.',q:'Pequeño, testarudo y con munición infinita.'},
 {k:'trebol',t:'cobre',r:'productor',n:'Trébol Suertudo',dmg:12,int:1,m:'luck',p:{v:3},pv:'coin',shot:'#ffe14a',d:'Cada insecto que elimina le da rocío (3 por nivel).',q:'La suerte no existe… salvo para él.'},
 // ---- PLATA ----
 {k:'cactus',t:'plata',r:'tirador',n:'Cactus Centinela',dmg:24,int:1,m:'pierce',p:{n:2},pv:'needle',sp:1200,shot:'#e8f0a0',d:'Sus agujas atraviesan al objetivo y a 2 insectos más.',q:'Paciente como el desierto, afilado como su sombra.'},
 {k:'nenufar',t:'plata',r:'control',n:'Nenúfar Burbuja',dmg:10,int:1.2,m:'slowaoe',p:{r:55,t:1.6},pv:'bubble',sp:650,shot:'#bff4ff',d:'Burbujas que ralentizan a todos los insectos de la zona.',q:'Flota tranquilo… y que todos vayan despacio.'},
 {k:'calabaza',t:'plata',r:'area',n:'Calabaza Mortero',dmg:46,int:2.2,m:'aoe',p:{r:66,f:.7},pv:'lob',sp:520,shot:'#ff9a2a',d:'Mortero lento y pesado con gran explosión.',q:'Hueca por dentro, pero llena de pólvora.'},
 {k:'diente',t:'plata',r:'control',n:'Diente de León Viento',dmg:14,int:1.3,m:'knock',p:{dist:24},pv:'puff',sp:800,shot:'#ffffff',d:'Ráfagas de viento que empujan a los insectos hacia atrás (no a jefes).',q:'Sopla una vez y la oleada retrocede.'},
 {k:'lavanda',t:'plata',r:'apoyo',n:'Lavanda Serena',dmg:8,int:1.1,m:'single',bdmg:.08,pv:'petal',shot:'#c8a0ff',d:'Las plantas vecinas hacen +12 % de daño por nivel de la Lavanda.',q:'Su perfume calma… y enfurece a sus aliados.'},
 {k:'pimiento',t:'plata',r:'rafaga',n:'Pimienta Doble',dmg:15,int:.9,m:'multi',p:{n:2},pv:'flame',sp:950,shot:'#ff6a2a',d:'Dispara a 2 insectos a la vez.',q:'Dos manos, dos chiles, cero piedad.'},
 {k:'helecho',t:'plata',r:'franco',n:'Helecho Arquero',dmg:70,int:2.4,m:'snipe',p:{bb:1.5},tgt:'strong',pv:'arrow',sp:1500,shot:'#d8ffb0',d:'Flecha lenta y certera al insecto con más vida (+50 % a jefes).',q:'Un disparo, un trofeo.'},
 {k:'abrojo',t:'plata',r:'debil',n:'Abrojo Marcador',dmg:12,int:.9,m:'mark',p:{v:.22,t:4},pv:'thorn',sp:1000,shot:'#d8a060',d:'Marca al insecto: recibe +22 % de daño (más por nivel) durante 4 s.',q:'Se pega donde más duele.'},
 {k:'menta',t:'plata',r:'control',n:'Menta Glacial',dmg:14,int:1,m:'freeze',p:{c:.1,t:1.1},pv:'flake',sp:900,shot:'#c8fff0',d:'Ralentiza y a veces congela por completo al insecto.',q:'Fresca, refrescante… y paralizante.'},
 {k:'zarza',t:'plata',r:'veneno',n:'Zarzamora Espinosa',dmg:8,int:1.1,m:'poisonaoe',p:{r:50,k:1.4},pv:'spore',sp:850,shot:'#b07ad8',d:'Envenena al objetivo y a los insectos cercanos.',q:'Sus frutos son deliciosos. Sus espinas, no.'},
 // ---- ORO ----
 {k:'orquidea',t:'oro',r:'cadena',n:'Orquídea Hechicera',dmg:22,int:1,m:'chain',p:{n:3,slow:1.2},pv:'petal',sp:900,shot:'#ff8ad8',d:'Hechizo que salta entre 3+ insectos y los ralentiza.',q:'Cada pétalo es un conjuro.'},
 {k:'bambu',t:'oro',r:'rafaga',n:'Bambú Ninja',dmg:11,int:.22,m:'pierce',p:{n:1},pv:'needle',sp:1400,shot:'#c8f08a',d:'Lluvia de agujas veloces que atraviesan a 2 insectos.',q:'Crece un metro por día. Ataca más rápido.'},
 {k:'loto',t:'oro',r:'apoyo',n:'Loto Sagrado',dmg:10,int:1.1,m:'single',gspd:.03,pv:'bubble',sp:700,shot:'#ffe6a0',d:'Todo el jardín dispara +3 % más rápido por nivel del Loto.',q:'Medita, y el jardín entero respira con él.'},
 {k:'baobab',t:'oro',r:'area',n:'Baobab Guardián',dmg:110,int:2.8,m:'aoe',p:{r:82,f:.65,stun:.5},pv:'lob',sp:480,shot:'#c8a07a',d:'Lanza troncos enormes: gran explosión que aturde 0,5 s.',q:'Mil años de paciencia, un segundo de furia.'},
 {k:'venus',t:'oro',r:'ejecutor',n:'Venus Devoradora',dmg:38,int:1.3,m:'exec',p:{th:.25},pv:'fang',sp:1000,shot:'#ff6a6a',d:'Devora de un bocado a los insectos con menos del 25 % de vida (no jefes).',q:'No muerde dos veces. No lo necesita.'},
 {k:'cerezo',t:'oro',r:'area',n:'Cerezo Tormenta',dmg:15,int:1,m:'multi',p:{n:4},pv:'petal',sp:900,shot:'#ffb8d8',d:'Tormenta de pétalos: ataca a 4 insectos a la vez.',q:'Florece una vez al año… y arrasa.'},
 {k:'cardo',t:'oro',r:'cadena',n:'Cardo Relámpago',dmg:30,int:1.2,m:'chain',p:{n:2},instant:1,pv:'bolt',shot:'#9ad8ff',d:'Relámpago instantáneo que salta a 2+ insectos.',q:'No hay escudo contra un rayo.'},
 {k:'aloe',t:'oro',r:'productor',n:'Aloe Alquimista',dmg:12,int:1.1,m:'single',gen:4,bdmg:.05,pv:'drop',sp:850,shot:'#8ae8b0',d:'Destila 4 de rocío por nivel cada 6 s y da +5 % de daño a sus vecinas.',q:'Cura, destila y transmuta. A veces explota.'},
 {k:'girasol',t:'oro',r:'rafaga',n:'Girasol Láser',dmg:9,int:.22,m:'single',instant:1,pv:'beam',shot:'#ffe14a',d:'Láser solar continuo e instantáneo.',q:'Mira al sol todo el día. Ahora dispara con él.'},
 {k:'mandragora',t:'oro',r:'control',n:'Mandrágora Aullante',dmg:14,int:2.2,m:'shout',p:{t:1.2},instant:1,pv:'ring',shot:'#ffd0a0',d:'Su grito daña y ralentiza a TODOS los insectos del sendero.',q:'Nunca la arranques de la tierra.'},
 // ---- LEGENDARIO ----
 {k:'roble',t:'leyenda',r:'apoyo',n:'Roble Eterno',dmg:80,int:2.4,m:'aoe',p:{r:78,f:.6},gdmg:.06,pv:'lob',sp:520,shot:'#d8b07a',d:'Bellotas gigantes en área y +6 % de daño por nivel a TODO el jardín.',q:'Plantado antes de que existieran los jardines.'},
 {k:'fenix',t:'leyenda',r:'area',n:'Flor Fénix',dmg:50,int:1.5,m:'aoe',p:{r:78,f:.7,burn:.8},pv:'phoenix',sp:850,shot:'#ffb02a',d:'Llamaradas en área que dejan a los insectos ardiendo.',q:'Renace de sus propias cenizas cada primavera.'},
 {k:'cristal',t:'leyenda',r:'control',n:'Rosa de Cristal',dmg:45,int:2,m:'freezeaoe',p:{r:72,t:1.4},pv:'flake',sp:800,shot:'#e0f8ff',d:'Congela por completo a todos los insectos de la zona.',q:'Tan bella que el tiempo se detiene a mirarla.'},
 {k:'trueno',t:'leyenda',r:'cadena',n:'Bonsái del Trueno',dmg:42,int:1.1,m:'chain',p:{n:6},instant:1,pv:'bolt',shot:'#c8f0ff',d:'Tormenta instantánea que salta entre 6+ insectos.',q:'Un árbol diminuto con una tormenta dentro.'},
 {k:'eclipse',t:'leyenda',r:'franco',n:'Girasol Eclipse',dmg:260,int:2.8,m:'snipe',p:{bb:2},tgt:'strong',instant:1,pv:'beam',shot:'#c86aff',d:'Rayo oscuro instantáneo al insecto más fuerte (x2 contra jefes).',q:'Cuando el sol se apaga, ella dispara.'},
 {k:'hongo',t:'leyenda',r:'veneno',n:'Rey Champiñón',dmg:14,int:1.8,m:'poisonaoe',p:{r:105,k:2.6},pv:'spore',sp:700,shot:'#e05a5a',d:'Nube de esporas gigante que envenena a toda una zona.',q:'Gobierna el reino bajo tus pies.'},
 {k:'hiedra',t:'leyenda',r:'control',n:'Hiedra Titán',dmg:55,int:1.8,m:'root',p:{r:52,t:1.6},pv:'vine',sp:900,shot:'#6ad04a',d:'Raíces que atrapan e inmovilizan al objetivo y a los cercanos.',q:'Lo que toca, ya no se mueve.'},
 {k:'nectar',t:'leyenda',r:'productor',n:'Néctar Dorado',dmg:15,int:1,m:'single',gen:8,bspd:.1,pv:'drop',sp:850,shot:'#ffd23f',d:'8 de rocío por nivel cada 6 s y +10 % de cadencia a sus vecinas.',q:'Cada gota vale su peso en oro.'},
 {k:'carnivora',t:'leyenda',r:'ejecutor',n:'Gran Carnívora',dmg:85,int:1.5,m:'exec',p:{th:.35,boss:.02},pv:'fang',sp:1000,shot:'#d86aff',d:'Devora insectos bajo el 35 % de vida; a los jefes les arranca un 2 % extra.',q:'La reina de la cadena alimenticia.'},
 {k:'estrella',t:'leyenda',r:'area',n:'Flor Estelar',dmg:32,int:1.7,m:'stars',p:{n:5},pv:'star',sp:850,shot:'#fff2a0',d:'Lluvia de 5 estrellas sobre insectos al azar.',q:'Cayó del cielo una noche y decidió quedarse.'}];
for(const R of ROSTER){UT[R.k]=Object.assign(UT[R.k]||{},R,UT[R.k]?{n:UT[R.k].n,dmg:UT[R.k].dmg,int:UT[R.k].int,shot:UT[R.k].shot,d:UT[R.k].d}:{})}
const ALL=ROSTER.map(R=>R.k);
const tierOf=k=>(UT[k]&&UT[k].t)||'cobre';
const CP=ALL.filter(k=>tierOf(k)==='cobre'||tierOf(k)==='plata');
// IA de duelos (v:4): a más nivel, personajes de más rareza.
// Comandantes de la IA (v:5): misma escala de rareza que sus personajes.
// v:8: bono de Lavanda a sus vecinas y curva de la IA del duelo por nivel (tier 0–9).
const LAV8=.12;
// Resultado con el bot sin mejoras: 80/50/30/30/30/20/20/0/0/0 % de victorias (antes 75/50/25 y 0 % desde el nivel 4).
const AI8={lv:t=>1+t*.25,skill:t=>.18+t*.045,cmdLv:t=>1+Math.floor(t*.4)};
// Rareza máxima que usa la IA según su nivel (v:8 abre plata, oro y legendario un nivel más tarde).
const aiMaxTier=(tier,v8)=>v8?(tier<=3?0:tier<=6?1:tier<=8?2:3):(tier<=2?0:tier<=5?1:tier<=8?2:3);
function aiCmdPool(tier,v8){const mx=aiMaxTier(tier,v8);return CMDK.filter(k=>TIERS[CMDS[k].t].ord<=mx)}
// Efectos de inicio de partida de algunos comandantes.
function cmdStart(b){if(b.cmd==='semillero')b.dew+=20}
function aiPool(tier,v8){const mx=aiMaxTier(tier,v8);return ALL.filter(k=>TIERS[tierOf(k)].ord<=mx)}
const BUGS={
 hormiga:{n:'Hormiga',hp:100,t:22,rw:5,s:1},
 cria:{n:'Cría',hp:45,t:16,rw:2,s:.7},
 mosquito:{n:'Mosquito',hp:60,t:12,rw:5,s:.9,fly:1},
 mariquita:{n:'Mariquita acorazada',hp:220,t:22,rw:8,s:1.05,armor:8},
 escarabajo:{n:'Escarabajo',hp:420,t:30,rw:12,s:1.25},
 cucaracha:{n:'Cucaracha',hp:180,t:18,rw:8,s:1.05,split:1},
 rinoceronte:{n:'Escarabajo Rinoceronte',hp:2200,t:56,rw:120,boss:1,s:2},
 avispa:{n:'Reina Avispa',hp:1900,t:50,rw:120,boss:1,s:2,summon:1,fly:1},
 mantis:{n:'Mantis Segadora',hp:2000,t:52,rw:120,boss:1,s:2,cut:1},
 ciempies:{n:'Ciempiés Acorazado',hp:2600,t:58,rw:140,boss:1,s:2,armor:14,curl:1},
 polilla:{n:'Polilla Sombra',hp:2100,t:48,rw:140,boss:1,s:2,fly:1,dust:1},
 termita:{n:'Termita Reina',hp:2400,t:60,rw:140,boss:1,s:2,heal:1},
 // ---- v:7: enemigos nuevos (x:1 = usan habilidades nuevas) ----
 pulgon:{n:'Pulgón Glotón',hp:40,t:15,rw:2,s:.7,x:1},
 grillo:{n:'Grillo Saltarín',hp:150,t:26,rw:6,s:1,x:1,jump:{t:3.2,f:.07}},
 caracol:{n:'Caracol Blindado',hp:360,t:40,rw:9,s:1.1,x:1,armor:12,regen:.02},
 luciernaga:{n:'Luciérnaga Animadora',hp:110,t:20,rw:7,s:.9,x:1,fly:1,haste:1},
 chinche:{n:'Chinche Apestosa',hp:210,t:24,rw:8,s:1,x:1,stink:1},
 oruga:{n:'Oruga Tragona',hp:300,t:32,rw:10,s:1.15,x:1,regen:.035},
 // semijefes: si llegan al final quitan 2 vidas
 tarantula:{n:'Tarántula Tejedora',hp:950,t:40,rw:45,s:1.5,x:1,elite:1,web:{t:6,n:2,d:2}},
 abejorro:{n:'Abejorro Guardián',hp:820,t:34,rw:45,s:1.5,x:1,elite:1,fly:1,guard:1},
 escorpion:{n:'Escorpión Rojo',hp:1000,t:38,rw:50,s:1.5,x:1,elite:1,armor:6,sting:1},
 langosta:{n:'Langosta Gigante',hp:860,t:36,rw:50,s:1.5,x:1,elite:1,jump:{t:4,f:.1},call:{k:'pulgon',n:3,t:7}},
 // jefes nuevos
 reyhormiga:{n:'Rey Hormiga',hp:2600,t:56,rw:140,boss:1,s:2,x:1,call:{k:'hormiga',n:4,t:6},rally:1},
 viuda:{n:'Viuda Reina',hp:2400,t:52,rw:140,boss:1,s:2,x:1,web:{t:7,n:4,d:2.5},call:{k:'cria',n:2,t:9}},
 gusano:{n:'Gusano Abismal',hp:3000,t:60,rw:150,boss:1,s:2,x:1,burrow:1},
};
const BOSSES=['rinoceronte','avispa','mantis'];
// Desde v:3 las partidas fuera de la campaña rotan los 6 jefes. Las repeticiones antiguas siguen usando BOSSES.
const BOSSES6=['rinoceronte','avispa','mantis','ciempies','polilla','termita'];
// Desde v:7 rotan 9 jefes y aparecen semijefes en las oleadas 3, 8, 13…
const BOSSES9=['rinoceronte','avispa','reyhormiga','mantis','ciempies','viuda','polilla','termita','gusano'],ELITES=['tarantula','abejorro','escorpion','langosta'];
const LEVELS=[
 {n:'Primeras hormigas',w:5,un:'veneno'},{n:'Zumbido nocturno',w:6},{n:'Corazas rojas',w:7,un:'trampa'},
 {n:'Plaga de cucarachas',w:8},{n:'El gran Rinoceronte',w:10,un:'sol'},{n:'Enjambre',w:10},
 {n:'El avispero',w:12},{n:'Muralla de escarabajos',w:12},{n:'La Mantis Segadora',w:15},{n:'Invasión final',w:20}];
// Vida de los insectos por nivel de campaña (dificultad Normal). Ajustada con tests/equilibrio.html para que un
// jugador sin mejoras gane cerca del 100 % al inicio del Huerto y ~85 % → ~20 % a lo largo del Pantano y el Invernadero.
// Los niveles largos (20–25 oleadas) llevan menos vida porque la vida ya crece en cada oleada.
const CAMP_HP=[[1,1.05,1.1,1.15,1.2,1.25,1.3,1.35,1.4,.9],[1.35,1.3,1.4,1.4,1.45,1.45,1.45,1.5,1.5,1],[1.5,1.45,1.5,1.5,1.6,1.5,1.45,1.35,1.15,.64]];
const CHAPTERS=[
 {n:'El Huerto',ic:'🥕',lv:LEVELS,hp:1,bosses:['rinoceronte','avispa','mantis','reyhormiga']},
 {n:'El Pantano',ic:'🐸',hp:1.9,bosses:['ciempies','polilla','avispa','viuda','gusano'],lv:[{n:'Niebla en los juncos',w:8},{n:'Charcas zumbonas',w:9},{n:'Corazas de barro',w:10},{n:'Lluvia de cucarachas',w:10},{n:'El Ciempiés despierta',w:10},
  {n:'Alas en la niebla',w:12},{n:'La Polilla Sombra',w:12},{n:'Raíces hundidas',w:13},{n:'Marea de escarabajos',w:14},{n:'El corazón del pantano',w:20}]},
 {n:'El Invernadero',ic:'🏡',hp:3.1,bosses:['termita','polilla','ciempies','mantis','rinoceronte'],lv:[{n:'Cristales empañados',w:10},{n:'Macetas rotas',w:10},{n:'Calor de mediodía',w:12},{n:'Plaga bajo el suelo',w:12},{n:'La Termita Reina',w:10},
  {n:'Enjambre en el techo',w:14},{n:'Regadera vacía',w:14},{n:'Cinco jefes',w:16},{n:'Última cosecha',w:18},{n:'La gran invasión',w:25}]}];
const clr=ch=>ch?(save.chapC[ch-1]||0):save.cleared;
function setClr(ch,v){if(ch)save.chapC[ch-1]=v;else save.cleared=v}
const chOpen=ch=>ch===0||clr(ch-1)>=10;
// Eventos rotativos: cambian cada semana (según el reloj de la computadora).
const EVENTS=[
 {id:'brasas',n:'Semana de las Brasas',ic:'🔥',d:'Tu mazo es solo Chile Ígneo. ¡Todo arde!',o:{deck:['fuego']}},
 {id:'estampida',n:'Estampida',ic:'💨',d:'Insectos un 60 % más rápidos, pero empiezas con 200 💧.',o:{spd:1.6,dew:200}},
 {id:'cristal',n:'Corazón de Cristal',ic:'💎',d:'Rocío casi infinito, pero solo tienes 1 corazón.',o:{dew:99999,lives:1}},
 {id:'jefes',n:'Noche de Jefes',ic:'👑',d:'Llega un jefe cada 3 oleadas.',o:{bossEvery:3}},
 {id:'enjambre',n:'Gran Enjambre',ic:'🐜',d:'El doble de insectos, pero con la mitad de vida.',o:{countMul:2,hpBase:.55}},
 {id:'coraza',n:'Semana Blindada',ic:'🛡️',d:'Todos los insectos tienen +6 de coraza (la Seta Tóxica la atraviesa).',o:{armorAdd:6}}];
const weekIdx=()=>Math.floor(Date.now()/864e5/7);
const curEvent=()=>EVENTS[weekIdx()%EVENTS.length];
const weekDaysLeft=()=>7-Math.floor(Date.now()/864e5)%7;
const MODS={rapidos:'Insectos veloces (+30 % de velocidad)',blindados:'Caparazones duros (+40 % de vida)',rico:'Rocío abundante (empiezas con 300)',sorpresa:'Mazo sorpresa (5 plantas al azar)',frenesi:'Frenesí (las oleadas llegan más rápido)'};
const RANKCOL=['#bbb','#8fd14f','#4fb3ff','#b06cff','#ff9a2a','#ff4a6a','#ffe14a','#ffffff'];

