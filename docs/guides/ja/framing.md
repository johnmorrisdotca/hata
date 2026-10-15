---
title: 旗の全体か切り抜きかを選ぶ
section: how-to
order: 4
description: 枠用の絵の読み込みと、手元のSVGの枠を分けます。
---

## 標準のAPIを使う

```ts
import { frame,aspectOf } from "@johnmorrisdotca/hata";
import usa from "@johnmorrisdotca/hata/flags/us";
import { flag } from "@johnmorrisdotca/hata/load";
const round=frame(usa,{shape:"round",fit:"whole"});
console.log(round===null?null:aspectOf(round));
console.log((await flag("CA",{shape:"1:1",fit:"auto"}))?.startsWith("<svg"));
```

`frame(svg)`は渡した絵だけを扱い、`flag(code,{shape})`は正方形や4:3用の絵を選べます。どちらも引き伸ばしません。`whole`（`contain`も同じ）は帯や円の背景で全体を保ちます。`crop`は選んだ側を使って枠を満たし、autoが全体を選ぶ場合にも切り抜きます。

## 枠への収め方を選ぶ

`auto`は収録した絵の記録に従い、不明なSVGは全体を表示します。`cover`は中心、`hoist`は旗竿側を保ちます。色や紋章が欠ける切り抜きには、資料の理由を保ちます。元の[枠の判断](../../framing.md)で読めます。形の`flag`は本来の比率で、作成画面では`own`と呼びます。
