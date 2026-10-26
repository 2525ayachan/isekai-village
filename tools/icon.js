// アイコン（ドット絵の家と木）を描いて PNG にする
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage();
  const out = await pg.evaluate(() => {
    const art = [
      '................',
      '................',
      '..GG........T...',
      '.GggG......TTT..',
      '.GgggG....TTtTT.',
      '..GgG....TTTtTT.',
      '...w.....TtTTTT.',
      '...w.....TTTTT..',
      '...w....RRRR.ww.',
      '..yy...RRRRRRw..',
      '..yy..RRRRRRRR..',
      '.......WWWWWW...',
      '.......WbWWDW...',
      '.......WWWWDW...',
      '.ssssssssssssss.',
      '................' ];
    const pal = { G:'#3f8f3a', g:'#5cb84a', T:'#2f7a37', t:'#58b04a', w:'#7a4b2a', R:'#c8452e', W:'#f3e6c8', b:'#6fb7e8', D:'#7a4b2a', y:'#f2c94c', s:'rgba(0,0,0,.18)' };
    const mk = (size, pad) => { const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      g.fillStyle = '#9ed36a'; g.fillRect(0, 0, size, size);
      const u = Math.floor((size - pad * 2) / 16), o = Math.floor((size - u * 16) / 2);
      art.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) { g.fillStyle = pal[ch]; g.fillRect(o + x * u, o + y * u, u, u); } }));
      return c.toDataURL('image/png').split(',')[1]; };
    return { a: mk(512, 64), b: mk(192, 24), c: mk(180, 20) };
  });
  fs.writeFileSync('' + require('path').join(__dirname, '..') + '/icon-512.png', Buffer.from(out.a, 'base64'));
  fs.writeFileSync('' + require('path').join(__dirname, '..') + '/icon-192.png', Buffer.from(out.b, 'base64'));
  fs.writeFileSync('' + require('path').join(__dirname, '..') + '/apple-touch-icon.png', Buffer.from(out.c, 'base64'));
  await b.close(); console.log('icons ok');
})();
