# 異世界辺境開拓記

スマホで遊ぶ、ドット絵の村づくりゲーム。

- 遊ぶ：https://2525ayachan.github.io/isekai-village/
- ホーム画面に追加すると、アプリのように全画面で開ける（オフラインでも動く）

## ファイル

- `src/pixel-town.html` … ゲーム本体（ここを直す）
- `tools/build.js` … 本体から公開用の `index.html`・`sw.js`・`manifest.webmanifest` を作る（`node tools/build.js`）
- `tools/icon.js` … アイコンを描き直す（Playwright が必要）
- ルートの `index.html` などは build.js が作るので、直接は直さない

## 更新のしかた

1. `src/pixel-town.html` を直す
2. `node tools/build.js`
3. コミットして main に push → 1〜2分で GitHub Pages に反映される

セーブは遊ぶ人のブラウザに残る。更新してもセーブは消えない（形が変わるときは `migrateSave` に直し方を足す）。
