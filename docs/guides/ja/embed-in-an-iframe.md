---
title: iframe で旗を埋め込む
section: how-to
order: 17
description: スクリプトを使えないページでも、デモの埋め込みページを iframe で載せて旗を表示します。
---

スクリプトを使えないサイトでも、デモの埋め込みページを iframe で載せれば旗を表示できます。自分でコードを書く必要はありません。アドレスで、旗 (`code`)、枠の形 (`shape`)、高さ (`size`)、名前の言語 (`lang`)、テーマ (`theme`) を選びます。`border` と `shadow` はオン・オフの指定です。キーは `<hata-flag>` の属性名と同じです。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata in an iframe</title>
  </head>
  <body>
    <iframe
      src="https://johnmorrisdotca.github.io/hata/embed.html?code=JP-13&shape=round&size=48"
      title="Flag of Tokyo"
      width="56"
      height="56"
      loading="lazy"
      style="border: 0"
    ></iframe>
  </body>
</html>
```

このページは旗を1つ描くだけで、何も保存せず、ほかの場所から何も読み込みません。旗を描き終えると、まわりのページに `postMessage({ hata: "load", code })` で知らせます。そのコードの旗がないときは `{ hata: "error", code, reason }` です。どちらも、信用する前に `event.origin` を確かめてください。[旗のビルダー](https://johnmorrisdotca.github.io/hata/builder.html) は、選んだ旗についてこの iframe とほかの形式のコードを書いてくれます。

[埋め込みビルダー](https://johnmorrisdotca.github.io/hata/builder.html)は、このコードを書き出します。コードは、ファミリー共通の埋め込みパネルに出ます。旗をページに入れる方法ごとのタブ（カスタム要素、`<img>`、`data:` URI、iframe、ESモジュール、React 19、Vue、Svelte、Angular、プレーンなHTML、iframeのアドレス）、コピー、選んだ設定で埋め込みページを開くリンク、このガイド、選んだ旗の図のクレジット（作者、ライセンス、出どころ）があります。コードに入るのは、初期値と異なる選択だけです。「この旗へのリンクをコピー」と「最初からやり直す」はコピーの隣にあり、選んだタブはアドレスに残ります。
