const CACHE = "yvexor-v2";
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(["/", "/manifest.webmanifest", "/icon.svg"]))));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener("fetch", e => { if (e.request.method === "GET") e.respondWith(fetch(e.request).then(r => { const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r; }).catch(()=>caches.match(e.request).then(r=>r||caches.match("/")))); });
self.addEventListener("sync", e => { if(e.tag === "yvexor-contact") e.waitUntil(Promise.resolve()); });
self.addEventListener("push", e => { const data=e.data?.json() || {}; e.waitUntil(self.registration.showNotification(data.title || "YVEXOR", { body:data.body || "Votre projet avance.", icon:"/icon.svg" })); });
