---
title: 旗を引き伸ばさない枠
section: how-to
order: 21
description: 旗を4:3・正方形・円の枠に、全体または人が選んだ側での切り抜きで入れ、各枠がどう測られたかを確かめます。
---

## 1つの旗をすべての枠で

```ts
import { frame } from "@johnmorrisdotca/hata";
import { flag } from "@johnmorrisdotca/hata/load";
import canada from "@johnmorrisdotca/hata/flags/ca";
import usa from "@johnmorrisdotca/hata/flags/us";

await flag("CA", { shape: "1:1" });                // flag-icons' square of Canada, drawn for the shape
frame(canada, { shape: "4:3" });                   // cropped from the centre: the crop keeps every colour
frame(canada, { shape: "1:1" });                   // the whole flag: a centre crop would lose the red bars
frame(canada, { shape: "1:1", fit: "cover" });     // the centre crop anyway, because you asked for it
frame(canada, { shape: "round", label: "Canada" }); // the whole flag on a neutral disc, with role="img" and a title

// Whole and cropped, for every flag: the crop is kept where a person judged the flag's meaning to be.
await flag("US", { shape: "1:1", fit: "whole" });  // all of the stars and stripes, in a square
await flag("US", { shape: "1:1", fit: "crop" });   // the canton and a slice of the stripes, not the middle stripes
frame(usa, { shape: "1:1" });                      // auto: the same crop, kept at the hoist
frame(usa, { shape: "1:1", fit: "whole" });        // the whole flag
```

## 全体と切り抜き

どの旗も、4:3・正方形・円のそれぞれで、全体と切り抜きの両方を用意しています。`fit: "whole"`（CSSの `contain`）は
旗のすべてを見せます。`fit: "crop"` は、中央ではなく**その旗のために人が選んだ側**で切り抜きます。アメリカとウルグアイは
旗竿側で、カントンや五月の太陽が縞の一部とともに見えるようにします。ルワンダは太陽のあるはためく側です。三角形やぎざぎざの縁を持つ旗と、北欧の十字旗は
旗竿側です。側を選んだ人がいない旗では、中央から切り抜きます（日本の日の丸、紋章、三色旗）。既定の `fit: "auto"` は、切り抜きが旗を正しく見せるときは切り抜きを使い、
そうでないときは旗全体を使います。ブルー・エンサインは片方の隅にユニオン・フラッグ、もう一方に星や紋章があり、
正方形では両方は収まりません。`fit: "crop"` と指定した場合は、そのような旗でも必ず切り抜きます。`manifest(code).framings[shape].crop` には、すべての旗と
枠について、`auto` が使う切り抜き（`own`、`curated`、`centre`、`whole`）、その側（`at`）、理由（`why`）、切り抜きで失われる色（`loses`）が記録されています。
[枠の一覧](../../framing.md)には、すべての旗の側と理由があります。デモの旗のパネルでは各形について全体と切り抜きを並べて見られ、
旗の一覧には、「全体」と「切り抜き」の切り替えがあります。

## 枠の測り方

`pnpm data:framing` が、すべての旗の枠をブラウザーで測りました。枠が旗を保つとは、旗の5%以上を占める色のすべてが、元の割合の少なくとも半分を保つことです。4:3と
正方形では、次の順に選びます。すでにその形である旗はそのまま。その形のために手で作られたflag-iconsの絵で、色が保たれ同じデザインのもの。
選ばれた側または中央での切り抜きで、色が保たれるもの。それ以外は旗全体です。円は、正方形の選択を円に入れたものです。`flag(code, { shape })` はこれらをすべて使い、
`frame(svg)` は渡された1つのSVGにだけを対象にし、そのSVGが示す旗（`data-hata`）について測られたとおりにします。`manifest(code).framings` はすべての旗についてどれを使うかを示し、
どの旗のどの枠でも、理由なく色が失われれば、ブラウザーのテストが失敗します。

関連：[旗全体を保つか、切り抜きを選ぶ](framing.md)。
