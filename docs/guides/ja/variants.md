---
title: 別の旗を明確に選ぶ
section: how-to
order: 6
description: 別の旗の状態・日付・資料の判断を保ちます。
---

## 標準の API を使う

```ts
import { variantsOf } from "@johnmorrisdotca/hata/manifest";
import { flag } from "@johnmorrisdotca/hata/load";
const choices=variantsOf("AF");
console.log(choices.map(choice=>choice.id));
if(choices[0]) console.log((await flag("AF",{variant:choices[0].id}))?.startsWith("<svg"));
```

別の旗は保存した id で区別し、作った表記や別の国として扱いません。記録は公式・事実上・歴史上・地域の状態、日付、理由、資料を保ちます。既定がない地域では明確に選びます。無効な id に読み込みは null を返し、一覧で元の選択と理由を示します。

## 黙って置き換えない

既定は記録した選択で、ほかの旗がないという主張ではありません。別の旗には状態を保ち、既定がない場合に黙って代用しません。ブルターニュの地域の旗や北アイルランドの明確な選択を、元の判断として保ちます。元の[別の旗](../../variants.md)と[判断](../../decisions.md)を読めます。
