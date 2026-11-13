// Yalnız uygulama kabuğunu önbelleğe alır; veri (latest.json, görseller) her zaman ağdan gelir.
const K = 'hamdata-kabuk-v68';
const KABUK = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(K).then(c => c.addAll(KABUK)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== K).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return;
  if (/\.enc$/.test(u.pathname)) return;           // veri: ağdan
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(K).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
});
