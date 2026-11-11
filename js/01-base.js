// Brotes Rebeldes · Lienzo, escalado de pantalla y utilidades básicas (azar, límites).
"use strict";
// ============ SETUP ============
const cv=document.getElementById('cv'),cx=cv.getContext('2d');
const W=960,H=600,DPR=Math.min(2,window.devicePixelRatio||1);
cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);
const stage=document.getElementById('stage');
function fit(){const s=Math.min(innerWidth/W,innerHeight/H)*.98;stage.style.transform=`scale(${s}) translate(-50%,-50%)`}
addEventListener('resize',fit);fit();
const rand=(a,b)=>a+Math.random()*(b-a),randInt=n=>Math.floor(Math.random()*n),pick=a=>a[randInt(a.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function mulberry(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

