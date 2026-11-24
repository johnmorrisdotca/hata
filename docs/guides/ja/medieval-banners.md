---
title: 中世の旗
section: how-to
order: 28
description: 年代を示す文献を挙げた中世の旗の小さな選集を専用の入口から描き、確かめられていることと復元とを読みます。
---

騎士の旗、騎士団の旗、十字軍の十字。Hataには中世の旗が6つあり、専用の入口 `@johnmorrisdotca/hata/medieval` にあるので、国の旗だけを描くページはこれを読み込みません。idは `med:` に小文字の名前を続けたもの（`med:red-cross` など）です。国や地域のコードにはコロン（:）が含まれないため、旗のidが国のコードに成り代わることはなく、`isFlagCode("med:red-cross")` は偽です。

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { medievalFlag, medievalInfo, medievalName } from "@johnmorrisdotca/hata/medieval";

// A banner is an SVG string, framed like a country's; its id begins with "med:", and its record says what its source documents.
const banner = medievalFlag("med:red-cross");
const round = banner === null ? "" : frame(banner, { shape: "round", label: medievalName("med:red-cross", "ja") ?? "" });
console.log(banner?.startsWith("<svg"), round.includes("clipPath"), medievalInfo("med:red-cross")?.dates?.from);
```

`medievalFlag(id)` はSVG文字列、`medievalName(id, lang)` と `medievalAbout(id, lang)` は英語か日本語の名前と一文、`medievalAspect(id)` は幅÷高さ、`medievalInfo(id)` はパッケージが知っているすべて（期間、位置づけ、注記、出典）、`medievalIn("order")` は種類（`order`、`cross`、`kingdom`）ごとのidを返します。`medievalId("red-cross")` は緩く書いたidを読み取り、`MEDIEVAL_IDS` は全idの一覧です。旗がないidにはどれも `null` を返します。

## 確かめられていることと、そうでないこと

どの旗も、年代と出典を挙げたページがあるものです。テンプル騎士団の黒と白（1220年代のジャック・ド・ヴィトリ、1250年ごろから1259年のマシュー・パリス、1290年ごろの壁画）、白地に赤十字（遅くとも1218年からのジェノヴァの年代記）、赤地に白十字のデンマーク（1396年より前に編まれたゲルレ紋章集の55葉裏で、ダンネブロの現存する最古の彩色画）、アラゴンの紋章（1159年のアルフォンソ2世の印章）、青地に白い斜め十字のスコットランド（1507年の海軍の旗として記録）、赤地に白十字の聖ヨハネ騎士団（1130年に教皇インノケンティウス2世が授けた紋章と、1248年の赤い上着）です。出典が示すのは意匠で、縦横の比ではなく、当時の旗は残っていないため、どの絵も `reconstruction`（復元）であり、`note` に、出典が示すことと、このパッケージのもの（縦横の比、色合い、腕の太さ、長方形の布）を書いてあります。出典が食い違うところ（テンプル騎士団の旗でどちらの半分が黒か）は、このパッケージがどちらに従ったかを注記に書いています。出典はどれも百科事典の項なので、博物館や当時の記録など、より確かな出典が望まれます。

除いたものは、年代を示すページが見つからなかったドイツ騎士団の白地に黒十字の旗、紋章の記述だけではきれいに描けないイングランドの獅子とフランスのユリ、読んだ出典のどれも色を定めていないオリフラムです。旗は歴史の絵であり、今の騎士団や家のしるしとして使うものではありません。続けて[コードと名前](codes-and-names.md)を読んでください。
