---
title: 中世の旗
section: how-to
order: 28
description: 年代を示す文献を挙げた中世の旗の小さな選集を専用の入口から描き、確かめられていることと復元とを読みます。
---

騎士の旗、騎士団の旗、十字軍の十字。Hataには中世の旗が42点あり、専用の入口 `@johnmorrisdotca/hata/medieval` にあるので、国の旗だけを描くページはこれを読み込みません。idは `med:` に小文字の名前を続けたもの（`med:red-cross` など）です。国や地域のコードにはコロン（:）が含まれないため、旗のidが国のコードに成り代わることはなく、`isFlagCode("med:red-cross")` は偽です。

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { medievalFlag, medievalInfo, medievalName } from "@johnmorrisdotca/hata/medieval";

// A banner is an SVG string, framed like a country's; its id begins with "med:", and its record says what its source documents.
const banner = await medievalFlag("med:red-cross");
const round = banner === null ? "" : frame(banner, { shape: "round", label: medievalName("med:red-cross", "ja") ?? "" });
console.log(banner?.startsWith("<svg"), round.includes("clipPath"), medievalInfo("med:red-cross")?.dates?.from);
```

`medievalFlag(id)` はSVG文字列を（Promiseとして）読み込み、`medievalName(id, lang)` と `medievalAbout(id, lang)` は英語か日本語の名前と一文、`medievalAspect(id)` は幅÷高さ、`medievalInfo(id)` はパッケージが知っているすべて（期間、位置づけ、注記、出典）、`medievalIn("order")` は種類（`order`、`cross`、`kingdom`、`empire`、`city`）ごとのidを返します。`medievalId("red-cross")` は緩く書いたidを読み取り、`MEDIEVAL_IDS` は全idの一覧です。旗がないidにはどれも `null` を返します。

## サイズと、1枚だけ読み込む方法

入口にあるのは記録だけです（ID、名前、説明、期間、出典、注記。約83 KB、gzipで12 KB）。絵は入っていません。絵はそれぞれ別のモジュール `@johnmorrisdotca/hata/medieval/red-cross`（中央値1.6 KB、最大110 KB）で、国の旗に `/load` がするのと同じく、検索が頼まれたときに動的importで読み込みます。そのため、ページに入るのは頼んだ絵だけです。モジュールは自分で読み込むこともできます（`import svg from "@johnmorrisdotca/hata/medieval/red-cross"` は `med:red-cross` の絵）。絵に行く道は、IDかモジュールだけです。

## 旗の出どころ

6つは、年代を示すページから、このパッケージのために描いたものです。テンプル騎士団の黒と白（1220年代のジャック・ド・ヴィトリ、1250年ごろから1259年のマシュー・パリス、1290年ごろの壁画）、白地に赤い十字（遅くとも1218年からのジェノヴァの年代記）、赤地に白十字のデンマーク（1396年より前に編まれたゲルレ紋章集の55葉裏）、アラゴンの紋章（1159年のアルフォンソ2世の印章）、青地に白い斜め十字のスコットランド（1507年の海軍の旗として記録）、赤地に白十字の聖ヨハネ騎士団（1130年の紋章と1248年の赤い上着）です。残る36は、国の旗と同じやり方で取ったWikimedia Commonsの絵です。ファイルごとにCommonsでライセンスを読み、パブリックドメインとCC0だけを収録し（CC BY-SAは収録しません。優れた紋章の絵にもCC BY-SAのものが多く、除いています）、ファイルを最適化し、ページ、ライセンス、作者を記録と [NOTICE.md](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md)（英語）に残します。イングランド、フランス、ナバラ、レオン、ポルトガル、ハンガリーの王旗、神聖ローマ帝国の赤地の白十字と軍旗、ドイツ騎士団の旗、ジェノヴァ、フィレンツェ、ピサ、ミラノ、ラグーザ、教皇領の旗、ビザンツの帝国旗、ムラービト朝・アイユーブ朝・サラディンの旗、オワイン・グリンドゥールの金の竜、ブルゴーニュ十字、初期のスイス十字などです。

どれも、印章、紋章集、年代記、地図から知られる旗の現代の絵で、当時の旗は残っていません。そのため、どれも `reconstruction`（復元）で、`note` に、出典が示すことと描いた人のものを書いてあります。期間は、ファイルの名前か説明が示すもの（世紀で示す場合は世紀）で、示さない場合は期間なしです。出典が食い違うところ（テンプル騎士団の旗でどちらの半分が黒か）は、どちらに従ったかを注記に書いています。出典は百科事典の項とCommonsの説明なので、博物館や当時の記録など、より確かな出典が望まれます。

除いたものは、ヴェネツィアの聖マルコの獅子（最適化後301 KBで、上限の140 KBを超える）、CC BY-SAの絵のすべて、パブリックドメインかCC0の絵が見つからなかった旗（オリフラム、ボヘミアの獅子、リトアニアのヴィーティス、ノヴゴロド、カスティーリャの城、シチリア）です。旗は歴史の絵であり、今の騎士団や家のしるしとして使うものではありません。続けて[コードと名前](codes-and-names.md)を読んでください。
