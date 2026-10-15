---
title: 必要なときに旗を読む
section: how-to
order: 3
description: 一覧全体を読み込まずに、必要な絵を待ちます。
---

## 標準のAPIを使う

```ts
import { flag,flagDataUri } from "@johnmorrisdotca/hata/load";
const tokyo=await flag("JP-13");
console.log(tokyo?.startsWith("<svg"),(await flagDataUri("CA"))?.startsWith("data:"));
console.log(await flag("XX"));
```

読み込みは保存した旗のモジュールを使い、SVGまたは未対応のコード・別の旗にnullを返すPromiseです。表示する前にawaitします。表示側のビルドが部分ごとのファイルを作れます。最新の地理データの検索ではありません。モジュールの失敗は、素材やビルドの問題として伝えます。

## URLを選んで使う

主な入口の`flagUrl`は元のSVGのURLを返し、自分では取得しません。baseで自分の素材を使え、既定のCDNは主な版を固定します。data URIは埋め込む表現で、URLはブラウザーに取得を頼みます。画像には地名の説明を付けます。固定のimportは[一覧](flag-resources.md)にあります。

## HTMLの画像の書き方

ページに直接書く場合の例です。画像には地名の説明を付けます。

```html
<img src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/jp-13.svg" alt="Tokyo" height="48">
<img src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/ca.1x1.svg" alt="Canada" height="48" style="border-radius:50%">
<script type="module">
  import { flag } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/load.js";
  document.body.insertAdjacentHTML("beforeend", await flag("CA-ON"));
</script>
```
