// Brotes Rebeldes · Idiomas. El juego está escrito en español; este archivo traduce al mostrar:
// los textos de las pantallas HTML (también los que se crean después) y los que se dibujan en el lienzo.
// Si un texto no está en el diccionario se muestra en español, así nunca queda una pantalla vacía.
"use strict";
const LANG_KEY='brotes_rebeldes_lang';
let LANG='es';try{LANG=localStorage.getItem(LANG_KEY)||'es'}catch(e){}
if(LANG!=='en')LANG='es';
document.documentElement.lang=LANG;
// Diccionarios: exact = texto completo; pat = [expresión, reemplazo] para textos con números o nombres ($1, $2…).
const I18N={en:{exact:{},pat:[]}};
const I18N_CACHE=new Map(),I18N_OUT=new Set(),I18N_MISS=new Set();let I18N_RAW=false;// RAW: texto ya traducido (p. ej. líneas de un párrafo partido)
function i18nAdd(lang,exact,pat){const D=I18N[lang];Object.assign(D.exact,exact||{});for(const [re,rep] of pat||[])D.pat.push([re instanceof RegExp?re:new RegExp('^'+re+'$'),rep])}
// Lista cómoda de traducciones [español, otro idioma]: «#» = un número y «{}» = cualquier texto (nombres, modos…),
// en el mismo orden en los dos lados. Los «{}» se traducen a su vez si están en el diccionario.
function i18nList(lang,list){const ex={},pat=[];for(const [es,tr] of list){if(!/#|\{\}/.test(es)){ex[es]=tr;continue}
 const src=es.replace(/[.*+?^$()|[\]\\]/g,'\\$&').replace(/#|\{\}/g,m=>m==='#'?'([\\d.,]+)':'(.+?)');let j=0;
 pat.push([new RegExp('^'+src+'$'),tr.replace(/#|\{\}/g,()=>'$'+(++j))])}i18nAdd(lang,ex,pat)}
// Traduce un texto (sin espacios sobrantes). Devuelve el original si no hay traducción.
function T(s){if(LANG==='es'||I18N_RAW||typeof s!=='string')return s;const k=s.trim();if(!k)return s;
 let r=I18N_CACHE.get(k);if(r===undefined){const D=I18N[LANG];r=D.exact[k];
  if(r===undefined)for(const [re,rep] of D.pat){if(re.test(k)){r=k.replace(re,(...m)=>rep.replace(/\$(\d)/g,(_,n)=>{const v=m[+n];return v===undefined?'':T(v)}));break}}
  if(r===undefined){r=null;if(/[a-záéíóúñ¡¿]{3}/i.test(k)&&!I18N_OUT.has(k))I18N_MISS.add(k)}else I18N_OUT.add(r);
  if(I18N_CACHE.size>6000)I18N_CACHE.clear();I18N_CACHE.set(k,r)}
 if(r===null)return s;return s.replace(k,r)}
// Marca como ya traducido un texto armado en el código a partir de partes traducidas (así no se cuenta como pendiente).
function TX(s){if(LANG!=='es')I18N_OUT.add(String(s).trim());return s}
// Nombre corto para etiquetas pequeñas: en español la primera palabra, en inglés la última («Cactus Centinela» → «Cactus», «Sentinel Cactus» → «Cactus»).
function shortN(s){const t=T(s),w=t.split(' ');return TX(LANG==='es'?w[0]:w[w.length-1])}
function setLang(l){try{localStorage.setItem(LANG_KEY,l)}catch(e){}location.reload()}
// Pantallas HTML: traduce los nodos de texto y los atributos title/placeholder/aria-label, también los que aparecen después.
function i18nNode(n){if(LANG==='es')return;
 if(n.nodeType===3){const v=n.nodeValue;if(!v||!v.trim())return;const t=T(v);if(t!==v)n.nodeValue=t;return}
 if(n.nodeType!==1||n.tagName==='SCRIPT'||n.tagName==='STYLE')return;
 for(const a of ['title','placeholder','aria-label']){const v=n.getAttribute&&n.getAttribute(a);if(v){const t=T(v);if(t!==v)n.setAttribute(a,t)}}
 for(const c of n.childNodes)i18nNode(c)}
if(LANG!=='es'){
 const run=()=>{i18nNode(document.body);document.title=T(document.title);
  new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')i18nNode(m.target);else for(const a of m.addedNodes)i18nNode(a)}})
   .observe(document.body,{subtree:true,childList:true,characterData:true})};
 // Espera a que carguen todos los scripts (incluidos los diccionarios) antes de traducir la página.
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',run);else setTimeout(run,0)}
// Marca el idioma activo en los selectores.
function markLang(){document.querySelectorAll('.langrow button').forEach(b=>b.classList.toggle('on',(b.getAttribute('onclick')||'').includes(`'${LANG}'`)))}
addEventListener('DOMContentLoaded',markLang);
