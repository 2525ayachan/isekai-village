// 版：202610261216（ビルドごとに変わる。変わると新しい版として配られる）
const V = 'isekai-202610261216';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  e.respondWith(caches.open(V).then(c => c.match(r, { ignoreSearch: true }).then(hit => {
    const net = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque') && !CORE.includes('./' + new URL(r.url).pathname.split('/').pop())) c.put(r, res.clone()); return res; });
    return hit || net.catch(() => c.match('./index.html'));
  })));
});
