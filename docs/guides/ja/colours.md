---
title: 色で旗を探す
section: how-to
order: 19
description: 旗の色を正確な16進数の値と面積の割合で読み、指定した色を持つ旗の一覧を出します。
---

旗の色はそれぞれの絵から測ったもので、専用の入口 `@johnmorrisdotca/hata/search` にあります。旗を描くだけのページはこれを読み込みません。`coloursOf(code)` は旗の色を、面積の大きい順に返します。絵にある正確な16進数の値、その色が旗に占める割合、決まった一覧から選んだ名前の三つです。

```mjs
import { COLOUR_NAMES, coloursOf, flagsWith } from "@johnmorrisdotca/hata/search";

// Japan: white over four fifths of the flag, and the red of the disc.
console.log(coloursOf("JP"));
// The flags that are red and white and nothing else: no other colour covers more than 3% of the flag.
console.log(flagsWith({ colours: ["red", "white"], only: true }).includes("CA"));
// The names a colour can have, for a row of chips.
console.log(COLOUR_NAMES.join(", "));
```

## 色の名前

名前は `red`（赤）、`orange`（オレンジ）、`yellow`（黄）、`green`（緑）、`light-blue`（水色）、`blue`（青）、`purple`（紫）、`brown`（茶）、`black`（黒）、`grey`（灰色）、`white`（白）です。名前は人が旗について言うときの言葉で、細かい色合いではありません。紺も明るい青も `blue` で、違いは16進数の値でわかります。`light-blue` はアルゼンチンの旗の空色です。名前は色相・彩度・明るさのきまりで決まり、どの旗にも同じきまりを使います。

`flagsWith({ colours })` は、指定した色をすべて持つ旗のコードを返します。その名前の色が旗の1%以上を占めていれば「持つ」と数えます。`only: true` を付けると、ほかの色が3%を超える旗を外します。メキシコの旗の小さな紋章は3%より小さいので、緑・白・赤の旗に入ります。調べるのはその場所の既定の旗です。別の旗の色は `coloursOf(code, { variant })` で読めます。

## 色の測り方

`pnpm data:colours` は、同梱する旗をそれぞれ幅1200ピクセルで、旗そのものの比率のまま（枠や切り抜きではなく）描き、すべてのピクセルを正確な色ごとに数えます。旗の0.1%以上を占める色がその旗の色です。文字のなめらかな縁やグラデーションの途中の色は、いちばん近い色に入れます。手で入力した数字はありません。測った結果は `scripts/colours.data.json` にあり、マニフェストの各旗の `colours` も同じ一覧です。続けて [コードと名前](codes-and-names.md) を読んでください。
