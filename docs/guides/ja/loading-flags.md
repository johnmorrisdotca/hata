---
title: 必要なときに旗を読む
section: how-to
order: 3
description: 一覧全体を読み込まずに、必要な絵を待ちます。
---

## 標準の API を使う

```ts
import { flag,flagDataUri } from "@johnmorrisdotca/hata/load";
const tokyo=await flag("JP-13");
console.log(tokyo?.startsWith("<svg"),(await flagDataUri("CA"))?.startsWith("data:"));
console.log(await flag("XX"));
```

読み込みは保存した旗のモジュールを使い、SVG または未対応のコード・別の旗に null を返す Promise です。表示する前に await します。表示側のビルドが部分ごとのファイルを作れます。最新の地理データの検索ではありません。モジュールの失敗は、素材やビルドの問題として伝えます。

## URL を選んで使う

主な入口の `flagUrl` は元の SVG の URL を返し、自分では取得しません。base で自分の素材を使え、既定の CDN は主な版を固定します。data URI は埋め込む表現で、URL はブラウザーに取得を頼みます。画像には地名の説明を付けます。固定の import は[一覧](flag-resources.md)にあります。
