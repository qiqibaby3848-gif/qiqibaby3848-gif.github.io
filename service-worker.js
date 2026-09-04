const CACHE_NAME = 'movie-portal-v1';
const URLS_TO_CACHE = ['/', '/index.html'];

self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
);
self.skipWaiting();
});

self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
)
);
self.clients.claim();
});

self.addEventListener('fetch', event => {
const req = event.request;
if (req.method !== 'GET') return;
event.respondWith(
fetch(req).then(res => {
const resClone = res.clone();
caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
return res;
}).catch(() => caches.match(req).then(m => m || caches.match('/index.html')))
);
});
