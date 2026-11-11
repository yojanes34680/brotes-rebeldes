// Brotes Rebeldes · Service worker: guarda una copia de todos los archivos para jugar sin conexión.
// Con conexión siempre se carga la versión más nueva (y se actualiza la copia); sin conexión se usa la copia.
// Si agregas archivos al juego (un .js nuevo o una imagen), añádelos a FILES y cambia VERSION.
const VERSION='brotes-v2';
const FILES=['./','index.html','manifest.webmanifest',
 'js/00-idioma.js','js/idioma-en.js','js/idioma-en-fichas.js','js/01-base.js','js/02-audio.js','js/03-datos.js','js/04-progreso.js','js/05-arte-personajes.js',
 'js/06-arte-insectos.js','js/07-simulacion.js','js/08-render.js','js/09-interfaz.js','js/10-misiones.js','js/11-inicio.js',
 'assets/units/espina.png','assets/units/hielo.png','assets/units/fuego.png','assets/units/rayo.png','assets/units/rocio.png',
 'assets/icons/icon-192.png','assets/icons/icon-512.png','assets/icons/icon-maskable-512.png','assets/icons/apple-touch-icon.png','assets/icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 // Solo los archivos del juego; las páginas de pruebas siempre van a la red.
 if(r.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/tests/'))return;
 e.respondWith(fetch(r).then(res=>{if(res&&res.ok&&res.type==='basic'){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res})
  .catch(()=>caches.match(r,{ignoreSearch:true}).then(hit=>hit||new Response('Sin conexión y sin copia guardada de este archivo.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}}))))});
