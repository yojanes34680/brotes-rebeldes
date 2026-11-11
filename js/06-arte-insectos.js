// Brotes Rebeldes · Insectos: carácter de los clásicos, dibujo (enruta a la vista 3/4) y barra de vida.
"use strict";
// Carácter de los 12 insectos clásicos para el álbum (los nuevos lo tienen en su ficha B3, en 08-render.js).
const BUG_P={hormiga:'Alegre y despistada',cria:'Llorona y tierna',mosquito:'Burlón y travieso',mariquita:'Pasiva y aburrida',
 escarabajo:'Matón intimidante',cucaracha:'Nerviosa y paranoica',rinoceronte:'Furioso y agresivo',avispa:'Arrogante y altiva',
 mantis:'Fría y calculadora',ciempies:'Testarudo y blindado',polilla:'Misteriosa y teatral',termita:'Mandona y glotona'};
// Filtros para las variantes teñidas de cada insecto (golpe, ralentizado, envenenado); se aplican una vez al precalcular.
const TINTF={h:'brightness(0) invert(1)',s:'hue-rotate(170deg) saturate(1.3) brightness(1.1)',p:'hue-rotate(75deg) saturate(1.3)'};
// Rendimiento: con muchos insectos en pantalla se simplifica el dibujo (lo activa el render del tablero).
let LOWFX=false;
// Todos los insectos se dibujan en vista 3/4 con tiras de 12 cuadros precalculadas (ver 08-render.js).
function drawBug(c,k,x,y,s,t,ang,b){return drawBug3(c,k,x,y,s,t,ang,b)}
function hpBar(c,x,y,w,f,col){rr(c,x-w/2,y,w,5,2,'#000b');rr(c,x-w/2+1,y+1,(w-2)*clamp(f,0,1),3,1.5,col||'#7f5')}
