const CACHE = "yvexor-v2-unique-home-2026-09-05";
const CORE = ["/", "/manifest.webmanifest", "/app-icon-192.png", "/app-icon-512.png"];
self.addEventListener("install", event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE))); });
self.addEventListener("activate", event => { event.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("yvexor-") && key !== CACHE).map(key => caches.delete(key)))), self.clients.claim()])); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request,{cache:"no-store"}).then(response => { const copy=response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request,copy))); return response; }).catch(() => caches.match(event.request).then(match => match || caches.match("/"))));
    return;
  }
  event.respondWith(caches.match(event.request).then(match => match || fetch(event.request).then(response => { if(response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request,response.clone()))); return response; })));
});
