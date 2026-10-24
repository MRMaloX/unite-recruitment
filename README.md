# ユナイト募集

アカウント登録不要の静的Webアプリです。入力内容はブラウザー内だけで扱います。

## ローカルで起動

Python 3 がある場合、`outputs` ディレクトリで次を実行して `http://localhost:8000` を開きます。

```sh
python -m http.server 8000
```

## 公開

この `outputs` ディレクトリの内容を Cloudflare Pages の Direct Upload、または GitHub Pages の公開ディレクトリとして配置してください。ビルド工程は不要です。HTTPSで配信するとPWAのインストールとオフラインキャッシュが利用できます。

## 構成

- `index.html` — 入力画面とプレビュー
- `styles.css` — レスポンシブデザイン
- `app.js` — 投稿文生成、コピー、X投稿画面起動、リセット
- `manifest.webmanifest` / `icon.svg` — PWA設定とアイコン
- `apple-touch-icon.png` / `icon-192.png` / `icon-512.png` — iPhone・Android向けアイコン
- `service-worker.js` — 静的ファイルのキャッシュ
