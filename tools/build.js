// pixel-town.html から GitHub Pages 用のアプリ（PWA）一式を作る
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', 'src', 'pixel-town.html'), OUT = path.join(__dirname, '..');
const game = fs.readFileSync(SRC, 'utf8');
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
const head = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#5a3a22">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="辺境開拓記">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>[hidden]{display:none!important} html,body{margin:0;padding:0}
#pwa-up{position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:99;display:flex;gap:8px;align-items:center;justify-content:space-between;background:#fffaf0;color:#3b2716;border:2px solid #a8703e;border-radius:8px;padding:8px 10px;font:14px/1.4 "DotGothic16",sans-serif;box-shadow:0 3px 0 rgba(90,58,34,.35)}
#pwa-up small{display:block;font-size:11px;line-height:1.4;color:#7a5a3a;margin-top:2px}
#pwa-up button{flex:none;font:inherit;border:0;border-radius:6px;padding:6px 12px;background:#a8703e;color:#fff;cursor:pointer}</style>
</head>
<body>
`;
const pwa = `
<div id="pwa-up" hidden><span>新しい版があります<small>更新すると最初の画面に戻ります。「つづきから」を押せば、続きから遊べます。</small></span><button type="button" id="pwa-go">更新する</button></div>
<script>
// アプリ化：オフラインでも動き、新しい版が出たらお知らせする（セーブはそのまま）
(function () {
  if (!('serviceWorker' in navigator) || location.protocol !== 'https:' && location.hostname !== 'localhost') return;
  var t0 = Date.now(), had = !!navigator.serviceWorker.controller, hooked = false;
  // 新しい版が入ったら：開いた直後ならそのまま切り替え、遊んでいる途中ならお知らせを出す
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!had) { had = true; return; }   // はじめての登録は版の更新ではない
    if (Date.now() - t0 < 5000) { location.reload(); return; }
    var bar = document.getElementById('pwa-up'); bar.hidden = false;
    document.getElementById('pwa-go').onclick = function () { location.reload(); };
  });
  function hook() {
    if (hooked) return;
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      hooked = true;
      setInterval(function () { reg.update().catch(function () {}); }, 30 * 60 * 1000);
      document.addEventListener('visibilitychange', function () { if (!document.hidden) reg.update().catch(function () {}); });
    }).catch(function () {});
  }
  // セーブを「消さないでほしいデータ」としてブラウザに頼む（容量が足りないときに勝手に消されにくくなる）
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(function (p) { if (!p) navigator.storage.persist(); }); } catch (e) {}
  hook(); window.addEventListener('online', hook);   // 電波がないときに開いたら、つながったときに登録しなおす
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), head + game + pwa);
fs.writeFileSync(path.join(OUT, 'sw.js'), `// 版：${stamp}（ビルドごとに変わる。変わると新しい版として配られる）
const V = 'isekai-${stamp}';
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
`);
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
  name: '異世界辺境開拓記', short_name: '辺境開拓記', lang: 'ja', start_url: './', scope: './', display: 'standalone', orientation: 'portrait',
  background_color: '#f7edd6', theme_color: '#5a3a22',
  icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }],
}, null, 2));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('built', stamp);
