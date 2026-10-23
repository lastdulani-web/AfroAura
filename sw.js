const C='afroaura-v4';
const A=['./','index.html','manifest.json','logo.png','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png',
'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
'https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const own=new URL(e.request.url).origin===location.origin;
  const net=()=>fetch(e.request).then(n=>{
    if(n.ok||n.type==='opaque'){const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp))}
    return n});
  // own files: network first so updates arrive; libraries: cache first for offline use
  e.respondWith(own
    ?net().catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
    :caches.match(e.request).then(r=>r||net()));
});
