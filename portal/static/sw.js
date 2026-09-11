// Never cache private pages, API responses, session-bearing redirects or uploads.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>YVEXOR hors connexion</title><body><h1>Vous êtes hors connexion</h1><p>Vos données restent protégées. Reconnectez-vous à Internet, puis actualisez la page.</p></body></html>',
    {headers: {'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}}
  )));
});
