---
title: はじめに
section: tutorial
order: 1
description: 旗を1つ読み込み、本来の縦横比を保ちます。
---

## 標準の API を使う

```ts
import japan from "@johnmorrisdotca/hata/flags/jp";
import { aspectOf } from "@johnmorrisdotca/hata";
console.log(japan.startsWith("<svg"),aspectOf(japan));
```

固定の import は SVG の文字列で、画像の URL や DOM の要素ではありません。ブラウザーでは表示する要素に入れ、サーバーでは文章として保てます。絵ごとのモジュールで、使う旗だけを読み込みます。SVG の viewBox を保って高さか幅を指定し、引き伸ばして旗の形を変えません。

## 読み込みの入口を選ぶ

主な入口はコード・URL・SVG の道具、`/load` は動的なコード、`/names` は説明、`/manifest` は資料・作者・ライセンスです。任意の `/element/define` はブラウザーの要素を登録します。[読み込み](loading-flags.md)、[一覧](flag-resources.md)、[枠](framing.md)へ進めます。実行時の依存関係や外部のサービスを加えません。
