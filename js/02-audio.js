// Brotes Rebeldes · Música y efectos de sonido sintetizados con Web Audio.
"use strict";
// ============ AUDIO (renovado) ============
// Todo se sintetiza con Web Audio (sin archivos): instrumentos (arpa, flauta, cuerdas, metales, bajo, percusión y campanas),
// reverberación generada, compresor final y 3 temas musicales: inicio (bosque encantado), batalla y jefe.
const AU={ctx:null,master:null,music:null,sfx:null,rev:null,last:{},step:0,next:0,timer:null,mode:'menu',theme:null,loop:0};
function auInit(){if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return}
 try{const C=new(window.AudioContext||window.webkitAudioContext)();AU.ctx=C;
  const comp=C.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=12;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.2;comp.connect(C.destination);
  AU.master=C.createGain();AU.master.connect(comp);AU.music=C.createGain();AU.music.connect(AU.master);AU.sfx=C.createGain();AU.sfx.connect(AU.master);
  const len=Math.floor(C.sampleRate*2.2),ir=C.createBuffer(2,len,C.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
  const cv=C.createConvolver();cv.buffer=ir;AU.rev=C.createGain();AU.rev.gain.value=.32;AU.rev.connect(cv);cv.connect(AU.master);
  auVol();musicStart()}catch(e){AU.ctx=null}}
function auVol(){if(!AU.ctx)return;const o=save.opts;AU.master.gain.value=o.vol;AU.music.gain.value=o.mus*.42;AU.sfx.gain.value=o.fx*.6}
const NOTE=n=>261.63*Math.pow(2,n/12);
let NOISE=null;
function noiseBuf(){const C=AU.ctx;if(!NOISE){NOISE=C.createBuffer(1,C.sampleRate,C.sampleRate);const a=NOISE.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}return NOISE}
// Salida con envío opcional a la reverberación.
function out(node,dest,wet){node.connect(dest||AU.sfx);if(wet&&AU.rev){const g=AU.ctx.createGain();g.gain.value=wet;node.connect(g);g.connect(AU.rev)}}
// Oscilador con envolvente, deslizamiento de tono, filtro paso bajo y vibrato opcionales.
function osc(f,d,o){const C=AU.ctx;if(!C)return;o=o||{};const t=C.currentTime+(o.at||0),s=C.createOscillator(),g=C.createGain();s.type=o.type||'sine';s.frequency.setValueAtTime(f,t);if(o.det)s.detune.value=o.det;
 if(o.slide&&o.slide!==1)s.frequency.exponentialRampToValueAtTime(Math.max(20,f*o.slide),t+(o.st||d));
 const a=o.a||.005,v=o.v||.2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);
 if(o.sus){g.gain.setValueAtTime(v,t+Math.max(a,d-(o.rel||.1)));g.gain.linearRampToValueAtTime(0,t+d)}else g.gain.exponentialRampToValueAtTime(.0005,t+d);
 let node=s;if(o.lp){const fl=C.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(o.lp,t);if(o.lpEnd)fl.frequency.exponentialRampToValueAtTime(o.lpEnd,t+d);fl.Q.value=o.q||.7;s.connect(fl);node=fl}
 if(o.vib){const l=C.createOscillator(),lg=C.createGain();l.frequency.value=o.vib;lg.gain.value=f*.012;l.connect(lg);lg.connect(s.frequency);l.start(t);l.stop(t+d+.05)}
 node.connect(g);out(g,o.dest,o.wet);s.start(t);s.stop(t+d+.05)}
// Ruido filtrado (soplidos, golpes, platillos).
function nz(d,o){const C=AU.ctx;if(!C)return;o=o||{};const t=C.currentTime+(o.at||0),s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=noiseBuf();
 f.type=o.ft||'bandpass';f.frequency.setValueAtTime(o.f||1200,t);if(o.fEnd)f.frequency.exponentialRampToValueAtTime(o.fEnd,t+d);f.Q.value=o.q||1;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.v||.2,t+(o.a||.003));g.gain.exponentialRampToValueAtTime(.0005,t+d);s.connect(f);f.connect(g);out(g,o.dest,o.wet);s.start(t,Math.random()*.5);s.stop(t+d+.05)}
// Instrumentos
const INS={
 harp:(n,at,v,dest)=>{const f=NOTE(n);osc(f,1.1,{type:'triangle',v:v||.12,at,dest,wet:.35,lp:4200,lpEnd:900});osc(f*2,.5,{v:(v||.12)*.35,at,dest,wet:.2})},
 pluck:(n,at,v,dest)=>osc(NOTE(n),.22,{type:'triangle',v:v||.1,at,dest,lp:2600,lpEnd:500,wet:.15}),
 flute:(n,d,at,v,dest)=>{const f=NOTE(n);osc(f,d,{v:v||.09,a:.06,sus:1,rel:.12,vib:5.2,at,dest,wet:.4,lp:3000});nz(.08,{f:f*2,q:3,v:.015,at,dest})},
 pad:(ns,d,at,v,dest)=>{for(const n of ns)for(const det of [-7,7])osc(NOTE(n),d,{type:'sawtooth',det,v:v||.035,a:.4,sus:1,rel:.5,lp:1100,at,dest,wet:.5})},
 brass:(n,d,at,v,dest)=>{const f=NOTE(n);for(const det of [-5,5])osc(f,d,{type:'sawtooth',det,v:v||.06,a:.03,sus:1,rel:.08,lp:600,lpEnd:2200,at,dest,wet:.25})},
 bass:(n,d,at,v,dest)=>{const f=NOTE(n);osc(f,d,{type:'triangle',v:v||.22,at,dest});osc(f/2,d,{v:(v||.22)*.7,at,dest})},
 kick:(at,v,dest)=>{osc(150,.32,{v:v||.55,slide:.28,st:.12,at,dest});nz(.03,{f:4000,v:.05,at,dest})},
 snare:(at,v,dest)=>{nz(.16,{f:1800,q:.6,v:v||.22,at,dest,wet:.15});osc(220,.08,{type:'triangle',v:(v||.22)*.5,slide:.6,at,dest})},
 hat:(at,v,dest)=>nz(.05,{ft:'highpass',f:7000,v:v||.05,at,dest}),
 taiko:(at,v,dest)=>{osc(90,.7,{v:v||.6,slide:.5,st:.3,at,dest,wet:.35});nz(.3,{ft:'lowpass',f:500,v:(v||.6)*.35,at,dest,wet:.3})},
 bell:(n,at,v,dest)=>{const f=NOTE(n);for(const [m,k] of [[1,1],[2.76,.45],[5.4,.22]])osc(f*m,1.2/m+.2,{v:(v||.1)*k,at,dest,wet:.45})}};
// Temas: acordes por compás (semitonos desde Do) y melodía en corcheas (huecos = silencio).
const THEMES={
 menu:{bpm:92,chords:[[2,5,9],[0,4,7],[-5,-1,2],[2,5,9],[2,5,9],[5,9,12],[0,4,7],[-3,1,4]],
  mel:[[14,,12,14,17,,14,],[12,,,10,12,,7,],[11,,14,,19,17,14,],[14,,,,,,,],[17,,19,17,14,,12,],[12,14,17,,21,,19,],[19,17,16,,12,,14,],[13,,,16,,,,]]},
 game:{bpm:126,chords:[[-3,0,4],[-7,-3,0],[0,4,7],[-5,-1,2],[-3,0,4],[-7,-3,0],[-5,-1,2],[-8,-4,-1]],
  mel:[[9,,12,16,,16,14,12],[14,,12,9,,,5,],[7,,12,,16,15,16,19],[19,,,17,16,,14,],[21,,19,,16,,12,14],[17,,16,,14,,12,],[14,,16,17,19,,23,],[20,,,,16,,,]]},
 boss:{bpm:140,chords:[[2,5,9],[-2,2,5],[-5,-2,2],[-3,1,4]],mel:[[14,,13,14,,17,,14],[10,,,9,10,,14,],[7,,10,,14,,10,7],[9,,,13,,16,,]]}};
function musicStart(){if(AU.timer||!AU.ctx)return;AU.next=AU.ctx.currentTime+.1;AU.timer=setInterval(musicTick,90)}
function musicTick(){const C=AU.ctx;if(!C||C.state!=='running')return;if(!save.opts.mus){AU.next=C.currentTime+.1;return}
 const boss=AU.mode==='game'&&G&&G.boards&&G.boards[0]&&G.boards[0].insects.some(i=>(i.def.boss||i.def.elite)&&!i.dead);
 const th=AU.mode!=='game'?'menu':boss?'boss':'game';if(th!==AU.theme){AU.theme=th;AU.step=0;AU.loop=0;AU.next=Math.max(AU.next,C.currentTime+.05)}
 const T=THEMES[th],sp=60/T.bpm/4,M=AU.music;
 while(AU.next<C.currentTime+.3){const s=AU.step,bars=T.chords.length,bar=Math.floor(s/16)%bars,b16=s%16,ch=T.chords[bar],at=Math.max(0,AU.next-C.currentTime),mm=b16%2===0?T.mel[bar][b16/2]:undefined;
  if(s>0&&s%(16*bars)===0)AU.loop++;
  if(th==='menu'){
   if(b16===0)INS.pad(ch,sp*16,at,.03,M);
   if(b16%8===0)INS.bass(ch[0]-12,sp*7,at,.14,M);
   if(b16%2===0){const k=b16/2;INS.harp(ch[[0,1,2,1,0,2,1,2][k]]+12+(k>=4?12:0),at,.07,M)}
   if(mm!==undefined&&AU.loop%2===1)INS.flute(mm+12,sp*3.5,at,.07,M);
   if(b16%4===2)INS.hat(at,.012,M)}
  else if(th==='game'){
   if(b16===0)INS.pad(ch,sp*16,at,.02,M);
   if(b16%2===0)INS.bass(ch[0]-12+(b16%8===4?12:0),sp*1.8,at,.15,M);
   if(b16===0||b16===8||(b16===10&&bar%2))INS.kick(at,.5,M);
   if(b16===4||b16===12)INS.snare(at,.17,M);
   if(b16%2===0)INS.hat(at,b16%4===2?.04:.022,M);
   INS.pluck(ch[[0,1,2,1][b16%4]]+12,at,.04,M);
   if(mm!==undefined&&AU.loop%2===1)INS.brass(mm+12,sp*2.8,at,.04,M)}
  else{
   if(b16===0){INS.pad(ch.map(n=>n-12),sp*16,at,.03,M);INS.brass(ch[0],sp*3,at,.06,M)}
   INS.pluck(ch[0]-12+(b16%2?12:0)+(b16%8===7?1:0),at,.07,M);
   if(b16===0||b16===6||b16===8||b16===14)INS.taiko(at,b16===0?.55:.38,M);
   if(b16===4||b16===12)INS.snare(at,.18,M);
   if(bar===3&&b16>=12)INS.snare(at,.09,M);
   if(mm!==undefined&&AU.loop>=1)INS.brass(mm,sp*2.6,at,.045,M)}
  AU.step++;AU.next+=sp}}
// Efectos: el disparo suena según el elemento del proyectil.
const SHOTK={flame:'fire',phoenix:'fire',lob:'thump',seed:'thump',flake:'ice',fang:'ice',drop:'water',bubble:'water',spore:'puff',puff:'puff',petal:'leaf',vine:'leaf',thorn:'twang',needle:'twang',arrow:'twang',spark:'zap',bolt:'zap',beam:'zap',sun:'shine',star:'shine',coin:'shine',ring:'shine'};
const SHOT={
 fire:()=>{nz(.22,{f:900,fEnd:300,q:.7,v:.09});osc(NOTE(-12),.15,{type:'sawtooth',v:.03,slide:.6,lp:600})},
 ice:()=>{osc(NOTE(31+Math.random()*3),.25,{v:.05,wet:.4});osc(NOTE(38),.18,{v:.025,at:.03,wet:.4})},
 water:()=>{osc(NOTE(12),.12,{v:.08,slide:2.2});nz(.06,{f:2500,v:.03})},
 puff:()=>nz(.18,{ft:'lowpass',f:1400,fEnd:300,v:.08}),
 leaf:()=>nz(.14,{f:3000,fEnd:1200,q:.5,v:.05}),
 thump:()=>{osc(NOTE(-5),.12,{v:.12,slide:.5});nz(.05,{f:800,v:.05})},
 twang:()=>{osc(NOTE(19+Math.random()*4),.09,{type:'triangle',v:.06,slide:.7,lp:3000});nz(.04,{f:5000,v:.03})},
 zap:()=>{osc(NOTE(28),.1,{type:'square',v:.03,slide:.3,lp:3000});nz(.06,{ft:'highpass',f:4000,v:.04})},
 shine:()=>INS.bell(24+((Math.random()*3)|0)*2,0,.035),
 magic:()=>{osc(NOTE(24),.12,{v:.05,slide:1.5,wet:.3});osc(NOTE(31),.1,{v:.025,at:.02,wet:.3})}};
const SFX={
 shot:k=>(SHOT[SHOTK[(UT[k]||{}).pv]]||SHOT.magic)(),
 hit:()=>{osc(NOTE(-10),.08,{v:.07,slide:.5});nz(.05,{f:1400,v:.05})},
 crit:()=>{osc(NOTE(-12),.18,{v:.14,slide:.4});nz(.12,{f:2200,v:.1});INS.bell(31,.02,.06)},
 kill:()=>{nz(.09,{f:1800,fEnd:500,v:.08});osc(NOTE(14),.08,{type:'triangle',v:.05,slide:.5});INS.bell(36,.05,.03)},
 plant:()=>{nz(.12,{ft:'lowpass',f:900,v:.1});osc(NOTE(7),.12,{type:'triangle',v:.12,slide:1.6,at:.03,wet:.2})},
 merge:r=>{const top=Math.min(5,r||2);[0,4,7,12,16].slice(0,2+top).forEach((s2,i)=>INS.bell(12+s2+top*2,i*.06,.07));if(top>=5){osc(NOTE(-12),.8,{type:'sawtooth',v:.06,lp:500,lpEnd:2400,wet:.4});nz(.6,{f:3000,fEnd:8000,v:.05,wet:.5})}},
 power:()=>{osc(NOTE(12),.25,{v:.12,slide:2,wet:.3});INS.bell(31,.12,.06)},
 leak:()=>{osc(NOTE(-24),.5,{type:'sawtooth',v:.16,slide:.5,lp:500});INS.taiko(0,.5);osc(NOTE(7),.12,{type:'square',v:.05,at:.05,lp:2000});osc(NOTE(3),.2,{type:'square',v:.05,at:.18,lp:2000})},
 wave:()=>{INS.brass(7,.18,0,.08);INS.brass(12,.4,.18,.09);INS.snare(0,.12)},
 elite:()=>{INS.brass(-5,.3,0,.09);INS.brass(-2,.5,.28,.1);INS.taiko(0,.5);INS.taiko(.28,.4)},
 boss:()=>{osc(NOTE(-29),1.2,{type:'sawtooth',v:.2,slide:.6,lp:400,lpEnd:150,wet:.4});osc(NOTE(-22),1,{type:'square',v:.08,slide:.7,lp:300,at:.05});nz(1,{ft:'lowpass',f:300,v:.2,wet:.4});INS.taiko(0,.8);INS.taiko(.35,.6);INS.taiko(.6,.7)},
 bossdie:()=>{nz(1.2,{ft:'lowpass',f:1200,fEnd:100,v:.3,wet:.5});osc(NOTE(-24),1,{v:.3,slide:.3});[0,4,7,12].forEach((s2,i)=>INS.brass(s2,.6,.3+i*.1,.06))},
 elitedie:()=>{nz(.6,{ft:'lowpass',f:1500,fEnd:150,v:.2,wet:.4});osc(NOTE(-17),.5,{v:.22,slide:.35})},
 cmd:()=>{nz(.6,{f:600,fEnd:3000,v:.12,wet:.4});[0,7,12,19].forEach((s2,i)=>INS.brass(s2+5,.35,i*.07,.06));INS.taiko(0,.5)},
 win:()=>{[[0,0],[4,.15],[7,.3],[12,.45]].forEach(([s2,at])=>INS.brass(s2,.3,at,.09));INS.brass(12,.9,.65,.1);INS.brass(16,.9,.65,.07);INS.taiko(0,.4);INS.taiko(.45,.4);nz(1.2,{ft:'highpass',f:5000,v:.06,at:.65,wet:.5});INS.bell(24,.65,.08)},
 lose:()=>{[[7,0],[3,.3],[0,.6],[-5,.9]].forEach(([s2,at])=>INS.flute(s2+12,.4,at,.08));INS.pad([-12,-9,-5],2,.9,.04)},
 click:()=>{nz(.03,{f:2400,q:2,v:.08});osc(NOTE(19),.04,{type:'triangle',v:.04})},
 chest:()=>{nz(.35,{f:500,fEnd:200,q:3,v:.1});[0,4,7,12,16,19].forEach((s2,i)=>INS.bell(12+s2,.35+i*.07,.07))}};
// Solo suenan los jardines que estás mirando (no los rivales de la IA ni los de la Auto-batalla fuera de pantalla).
const audible=b=>!!(G&&b&&!G.over&&(G.mode==='versus'?true:b===G.boards[0]));
function sfx(name,arg){if(!AU.ctx||AU.ctx.state!=='running'||!save.opts.fx)return;const now=performance.now(),key=name==='shot'?'shot:'+(SHOTK[(UT[arg]||{}).pv]||'m'):name,min={shot:70,hit:55,kill:45,plant:40,crit:110}[name]||25;
 if(now-(AU.last[key]||0)<min)return;AU.last[key]=now;try{SFX[name](arg)}catch(e){}}
addEventListener('pointerdown',auInit,{capture:true});addEventListener('keydown',auInit,{capture:true});
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button'))sfx('click')},true);

