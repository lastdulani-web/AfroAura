const C='afroaura-v1';
const A=['./','index.html','manifest.json','icon.svg',
'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/epub.js/0.3.93/epub.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{
    const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp));return n
  }).catch(()=>caches.match('index.html'))));
});
