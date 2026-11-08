const C='water-v4',F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const nav=e.request.mode==='navigate';
 e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{
  if(r.ok){const a=r.clone(),b=r.clone();caches.open(C).then(ch=>{ch.put(nav?'index.html':e.request,a);if(nav)ch.put('./',b)})}
  return r
 }).catch(()=>nav?caches.match('index.html'):caches.match(e.request,{ignoreSearch:true})));
});
