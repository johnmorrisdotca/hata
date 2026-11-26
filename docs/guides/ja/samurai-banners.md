---
title: 武士の戦場の旗
section: how-to
order: 26
description: 戦国大名の幟、旗、馬印を専用の入口から描き、確かめられていることと復元とをそれぞれの記録で読みます。
---

戦国時代の軍勢は、旗を掲げて戦いました。縦に細長い幟（のぼり）、ふつうの旗（はた）、そして大将のそばに立てる馬印（うまじるし）です。Hataにはその44点があり、専用の入口 `@johnmorrisdotca/hata/samurai` にあるので、国の旗だけを描くページはこれを読み込みません。idは `samurai:` に小文字の名前を続けたもの（`samurai:sanada-rokumonsen` など）です。国や地域のコードにはコロン（:）が含まれないため、旗のidが国のコードに成り代わることはなく、`isFlagCode("samurai:ii-igeta")` は偽です。

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

入口にあるのは記録だけです（ID、名前、説明、期間、出典、注記。約85 KB、gzipで11 KB）。絵は入っていません。絵はそれぞれ別のモジュール `@johnmorrisdotca/hata/samurai/ii-igeta`（中央値388 B、最大4.8 KB。文字のある旗がいちばん大きい）で、国の旗に `/load` がするのと同じく、検索が頼まれたときに動的importで読み込みます。そのため、ページに入るのは頼んだ絵だけです。モジュールは自分で読み込むこともできます（`import svg from "@johnmorrisdotca/hata/samurai/ii-igeta"` は `samurai:ii-igeta` の絵）。絵に行く道は、IDかモジュールだけです。

## 確かめられていることと、そうでないこと

この時代の旗はほとんど残っておらず、現存する布から描いたものはありません。9点の図案は、参考にした文献の記述から描いたものです。出典は、名のある大将の旗や印を挙げる日本語版Wikipediaの「馬印」の項（上杉謙信の紺地に朱の丸、北条氏康の五色段々、伊達政宗の黒の大四半、豊臣秀吉の金の軍配に朱の吹き流し、徳川家康の金扇、織田信長の金塗りの唐傘、井伊直政の赤地に金の井桁）と、総赤で六連銭の紋を付けた真田の幟を述べる「真田氏」の項です。記述が示すのは図案と地の色で、縦横の比、色合い、各部の並びではないため、どの絵も `reconstruction`（復元）であり、`note` には、どこが出典に従い、どこがこのパッケージのものかを書いてあります。どちらも百科事典の項なので、博物館や当時の記録など、より確かな出典が望まれます。

## やや後の絵から描いたもの：絵巻『御馬印』

ほかの35点は、国立国会図書館の絵巻『御馬印』（全6巻。巻1は[NDL 1286895](https://dl.ndl.go.jp/pid/1286895)、巻2は[NDL 1288242](https://dl.ndl.go.jp/pid/1288242)、保護期間満了）の絵をもとに描きました。図書館はこの絵巻を寛永年間（1624年から1644年）ごろとしていますが、これは推定です。絵巻の中で徳川秀忠を、1632年におくられた名前の「台徳院」と呼んでいるので、それより後に作られたものです。将軍と大名の旗や馬印を、それぞれの殿様の名前とともに描いています。布の縦横の比と、図柄の位置と大きさは、それぞれの記録が示すコマの写真から測ったので、これらは `documented`（記録あり）です。台徳院の五の字の旗、水戸中納言の黒地に金の丸、越前宰相の白地に朱の丸、保科肥後の浅葱（あさぎ、薄い青）の地に黒い丸27個の幟、酒井宮内の3点、上杉弾正の黒地に金の丸と毘の字の旗、藤堂和泉守の黒地に白の丸三つ、本多美濃守の本の字の幟と黒地に金の帯の旗です。2回目に加えたのは、井伊掃部頭の朱一色の幟と旗、小出大和守の白と黒の斜め分けの幟と白地に朱の丸の旗、寺沢志摩守の白地に黒の丸三つの幟、真田河内守の黒地に六連銭の大馬印と白地に朱の帯の幟、高力摂津守の黒地に白の丸の幟、松平下総守の黒地に金の菱の幟と旗、小笠原右近大夫の黒地に三階菱の大馬印、松平丹波守の白地に黒の帯六つの幟です。3回目に加えたのは、巻1の酒井雅楽頭の黒地に白の丸の旗と酒井阿波守の黒地に金の稲妻の幟、巻2の松平甲斐守の白地に朱の蛇の目の旗と金一色の旗、松平越後守の朱地に金の斜めの帯の旗、松平山城守の朱地に白の九曜の旗と黒地に金の輪の旗、松平出羽守の黒地に白の丸の旗と幟、大久保加賀守の黒地に白の輪の幟、青山大蔵少輔の浅葱地に白の山の字の幟です。色合いはこのパッケージが絵から読み取ったもので、布を竿に留める輪、竿、竿の先の飾りは描いていません。向きは絵のままで、竿の側は絵と同じく右です。斜めの帯などの向きは、描いた絵で見たとおりに書いています。五・毘・本・山の文字は、絵から写したものではなく、`NOTICE.md` に書いたSIL Open Font Licenseの筆文字フォントYuji Syukuの字形で書いたので、筆づかいはフォントのものです。上杉弾正の旗の字は、絵では異体字の「毗」ですが、フォントにこの字がないので「毘」で書きました。

今も入れていないのは、読んだ絵に描かれていない文字の旗（上杉謙信本人の毘、武田信玄の風林火山、徳川家康の厭離穢土欣求浄土）です。鳥や葉などの細かい家紋を描いた旗、垂れ飾り、立体の馬印は、まだ入れていません。旗は歴史の絵であり、今の人や家のしるしとして使うものではありません。続けて[コードと名前](codes-and-names.md)を読んでください。
