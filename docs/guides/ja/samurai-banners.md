---
title: 武士の戦場の旗
section: how-to
order: 26
description: 戦国大名の幟、旗、馬印を専用の入口から描き、確かめられていることと復元とをそれぞれの記録で読みます。
---

戦国時代の軍勢は、旗を掲げて戦いました。縦に長い幟（のぼり）、旗（はた）と呼ばれる旗、そして大将のそばに立てる馬印（うまじるし）です。Hataにはその9つがあり、専用の入口 `@johnmorrisdotca/hata/samurai` にあるので、国の旗だけを描くページはこれを読み込みません。idは `samurai:` に小文字の名前を続けたもの（`samurai:sanada-rokumonsen` など）です。国や地域のコードにはコロン（:）が含まれないため、旗のidが国のコードに成り代わることはなく、`isFlagCode("samurai:ii-igeta")` は偽です。

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { samuraiFlag, samuraiInfo, samuraiName } from "@johnmorrisdotca/hata/samurai";

// A banner is an SVG string, framed like a country's; its id begins with "samurai:", and its record says what is documented.
const nobori = await samuraiFlag("samurai:sanada-rokumonsen");
const round = nobori === null ? "" : frame(nobori, { shape: "round", label: samuraiName("samurai:sanada-rokumonsen", "ja") ?? "" });
console.log(nobori?.startsWith("<svg"), round.includes("clipPath"), samuraiName("samurai:sanada-rokumonsen", "ja"));
console.log(samuraiInfo("samurai:sanada-rokumonsen")?.status);
```

`samuraiFlag(id)` はSVG文字列を（Promiseとして）読み込み、`samuraiName(id, lang)` と `samuraiAbout(id, lang)` は英語か日本語の名前と一文、`samuraiAspect(id)` は幅÷高さ、`samuraiInfo(id)` はパッケージが知っているすべて、`samuraiIn("nobori")` は種類（`nobori`、`hata`、`uma`）ごとのidを返します。`samuraiId("ii-igeta")` は緩く書いたidを読み取り、`SAMURAI_IDS` は全idの一覧です。旗がないidにはどれも `null` を返します。

## サイズと、1枚だけ読み込む方法

入口にあるのは記録だけです（ID、名前、説明、期間、出典、注記。約19 KB、gzipで3.9 KB）。絵は入っていません。絵はそれぞれ別のモジュール `@johnmorrisdotca/hata/samurai/ii-igeta`（中央値388 B、最大735 B）で、国の旗に `/load` がするのと同じく、検索が頼まれたときに動的importで読み込みます。そのため、ページに入るのは頼んだ絵だけです。モジュールは自分で読み込むこともできます（`import svg from "@johnmorrisdotca/hata/samurai/ii-igeta"` は `samurai:ii-igeta` の絵）。絵に行く道は、IDかモジュールだけです。

## 確かめられていることと、そうでないこと

この時代の旗はほとんど残っておらず、現存する布から描いたものはありません。どの意匠も、参考文献のことばから描いたものです。出典は、名のある大将の旗や印を挙げる日本語版Wikipediaの「馬印」の項（上杉謙信の紺地に朱の丸、北条氏康の五色段々、伊達政宗の黒の大四半、豊臣秀吉の金の軍配に朱の吹き流し、徳川家康の金扇、織田信長の金塗りの唐傘、井伊直政の赤地に金の井桁）と、総赤で六連銭の紋を付けた真田の幟を述べる「真田氏」の項です。ことばが示すのは意匠と地の色で、縦横の比、色合い、各部の並びではないため、どの絵も `reconstruction`（復元）であり、`note` には、どこが出典に従い、どこがこのパッケージのものかを書いてあります。どちらも百科事典の項なので、博物館や当時の記録など、より確かな出典が望まれます。

きれいに描ける出典がないため除いたものは、文字の旗（武田信玄の風林火山、上杉謙信の毘、徳川家康の厭離穢土欣求浄土）です。読んだ出典のどれにも色や配置がなく、手で書いた文字の絵は推測になるからです。鳥や葉の紋、垂れ飾りなど、出典が名前だけを挙げて形を述べていない旗も除きました。旗は歴史の絵であり、今の人や家のしるしとして使うものではありません。続けて[コードと名前](codes-and-names.md)を読んでください。
