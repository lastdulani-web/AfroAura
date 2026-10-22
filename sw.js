const C='afroaura-v2';
const A=['./','index.html','manifest.json','icon.svg',
'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.93/epub.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const own=new URL(e.request.url).origin===location.origin;
  const net=()=>fetch(e.request).then(n=>{const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp));return n});
  // own files: network first (so updates arrive), cache as offline fallback; libraries: cache first
  e.respondWith(own
    ?net().catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
    :caches.match(e.request).then(r=>r||net()));
});
