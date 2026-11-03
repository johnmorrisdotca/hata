---
title: 通常の HTML と CDN
section: how-to
order: 13
description: jsDelivr や unpkg の script タグ1つで、通常のページに旗を載せます。
---

ビルドは要りません。`element/define` を読み込むと `<hata-flag>` のタグが登録されます。CDN の script タグで読み込めば、タグが `code` で指定した旗を自分で描きます。旗は1つずつ別のファイルで、タグが必要としたときに読み込まれます。

## jsDelivr

jsDelivr はパッケージのファイルをそのまま配るので、アドレスはビルド済みのファイルです。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata from jsDelivr</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
  </head>
  <body>
    <p>Tokyo: <hata-flag code="JP-13" label="Tokyo"></hata-flag></p>
  </body>
</html>
```

## unpkg

unpkg もパッケージのファイルをそのまま配ります。`?module` を付けると、ファイルの中の import をブラウザ用に書き換えてくれます。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata from unpkg</title>
    <script type="module" src="https://unpkg.com/@johnmorrisdotca/hata@1/dist/element-define.js?module"></script>
  </head>
  <body>
    <p>Tokyo: <hata-flag code="JP-13" label="Tokyo"></hata-flag></p>
  </body>
</html>
```

## 注意

- `<script type="module">` を使います。普通の script では `import` できません。
- ページを変えたくないときは、アドレスにメジャーバージョンを書きます (`@johnmorrisdotca/hata@1`)。
- 属性は [旗の要素とイベント](element-and-events.md) にあります。何も表示されないときは、[困ったとき](troubleshooting.md) を見てください。
