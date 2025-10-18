<!-- =============================
= sw.js (service worker)
============================== -->
/* Save the following as: sw.js (same folder) */
const CACHE = 'skyrim-rng-v1';
const ASSETS = [
'./',
'./index.html',
'./manifest.webmanifest'
];
self.addEventListener('install', (e)=>{
e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
e.waitUntil(
caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
);
});
self.addEventListener('fetch', (e)=>{
e.respondWith(
caches.match(e.request).then(res=> res || fetch(e.request).then(net=>{
const copy = net.clone();
caches.open(CACHE).then(c=> c.put(e.request, copy)).catch(()=>{});
return net;
}).catch(()=>caches.match('./index.html')))
);
});