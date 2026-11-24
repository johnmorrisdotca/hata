---
title: 軍の旗
section: how-to
order: 27
description: 軍艦旗と艦首旗を、期間と出典つきで専用の入口から描きます。日本の旭日旗も、2つの海軍の軍艦旗として含まれます。
---

軍艦は、艦尾に軍艦旗を、港では艦首に艦首旗を掲げます。Hataには30を超える海軍のその60があり、専用の入口 `@johnmorrisdotca/hata/military` にあるので、国の旗だけを描くページはこれを読み込みません。idは `mil:` に国の2文字と小文字の名前を続けたもの（`mil:gb-white-ensign` など）です。国や地域のコードにはコロン（:）が含まれないため、軍の旗のidが国のコードに成り代わることはなく、`isFlagCode("mil:gb-white-ensign")` は偽です。

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { militaryFlag, militaryInfo, militaryName } from "@johnmorrisdotca/hata/military";

// A military flag is an SVG string, framed like a country's; its id begins with "mil:", and its record has its dates and its source.
const ensign = await militaryFlag("mil:gb-white-ensign");
const round = ensign === null ? "" : frame(ensign, { shape: "round", label: militaryName("mil:gb-white-ensign", "ja") ?? "" });
console.log(ensign?.startsWith("<svg"), round.includes("clipPath"), militaryInfo("mil:gb-white-ensign")?.dates?.from);
```

`militaryFlag(id)` はSVG文字列を（Promiseとして）読み込み、`militaryName(id, lang)` と `militaryAbout(id, lang)` は英語か日本語の名前と一文、`militaryAspect(id)` は幅÷高さ、`militaryInfo(id)` はパッケージが知っているすべて（期間、位置づけ、注記、出典）、`militaryIn("ensign")` は種類（`ensign`、`jack`）ごとのidを返します。`militaryId("gb-white-ensign")` は緩く書いたidを読み取り、`MILITARY_IDS` は全idの一覧です。旗がないidにはどれも `null` を返します。

## サイズと、1枚だけ読み込む方法

入口にあるのは記録だけです（ID、名前、説明、期間、出典、注記。約99 KB、gzipで11 KB）。絵は入っていません。絵はそれぞれ別のモジュール `@johnmorrisdotca/hata/military/gb-white-ensign`（中央値1.5 KB、最大134 KB）で、国の旗に `/load` がするのと同じく、検索が頼まれたときに動的importで読み込みます。そのため、ページに入るのは頼んだ絵だけです。モジュールは自分で読み込むこともできます（`import svg from "@johnmorrisdotca/hata/military/gb-white-ensign"` は `mil:gb-white-ensign` の絵）。既定では出さない絵もモジュールで、名前を挙げて読み込む場合にだけ読み込めます。

## ここにあるもの

5つは、構成を示す出典から、このパッケージのために描いたものです。海上自衛隊の自衛艦旗（1954年6月30日から）、旧日本海軍の軍艦旗（1889年10月7日から1945年まで）、イギリスのホワイト・エンサイン（1864年から）と艦首旗としてのユニオン・ジャック（1801年から）、アメリカの海軍の艦首旗（50星の国旗の青い部分、1960年7月4日から）です。残る55は、国の旗と同じやり方で取ったWikimedia Commonsのファイルです。ファイルごとにCommonsでライセンスを読み、パブリックドメインとCC0だけを収録し（CC BY-SAは収録しません）、ファイルを最適化し、ページ、ライセンス、作者を記録と [NOTICE.md](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md)（英語）に残します。ドイツ（連邦海軍の軍艦旗、1871年から1892年、ワイマール共和国、1921年から1933年のライヒスマリーネの軍艦旗）、フランス、イタリア、ベルギー、デンマーク、フィンランド、ポーランド（1919年から1927年の軍艦旗を含む）、ギリシャ、ロシア、ソビエト連邦、インド、パキスタン、中国（人民解放軍海軍）、台湾、オーストラリア、カナダ、ニュージーランド、タイ、シンガポール、南アフリカ、エジプト、イスラエル、ウクライナ、コロンビア、インドネシア、アルゼンチン、チリ、メキシコ、ノルウェー、ポルトガル、スペイン、韓国、フィリピン、アイルランド、ペルー、ルーマニアの軍艦旗・艦首旗・軍旗と、1861年から1865年に北軍と海軍が掲げた国旗です。どの記録にも、ファイルの名前か説明が期間を示す場合はその期間（示さない場合は期間なし。その旗は、2026年11月24日に読んだ時点の現行の旗です）、読んだページ、`status` があります。出典が意匠を示すものは `documented`、寸法がこのパッケージのものであるものは `reconstruction` です。どちらかは `note` に書いてあります。

## 既定では出さないもの：アメリカ連合国の軍旗

北バージニア軍の軍旗（正方形、1861年から）と、アメリカ連合国海軍の艦首旗（長方形のもの、1863年から1865年）は、同じ時期のアメリカの国旗と並べて歴史のために収録し、歴史と教育のためにだけ提供します。1935年から1945年のドイツの国旗と同じ扱い（[判断の記録](https://github.com/johnmorrisdotca/hata/blob/main/docs/decisions.md)）で、どの一覧にも、グループにも、デモのページにも出さず、既定では渡さず、名前を挙げて頼む呼び出しにだけ渡します：`militaryFlag("mil:cs-battle-flag", { allowRestricted: true })`。`MILITARY_RESTRICTED_IDS` が一覧で、`militaryInfo(id)?.restricted` が理由を述べます：「アメリカ連合国の軍旗（1861～1865年）。歴史と教育のために表示しています。今日では、人種差別と白人至上主義の象徴と広く見なされています。」これを制限する法律はないので、記録に法律は書きません。連合国の3つの国旗は軍旗ではなく、かつての国 `XCS` の通常のバリアントです。

## 旭日旗

日本の旭日旗（きょくじつき）は、この組にだけあり、パッケージのほかのどこにもありません。どの国の記録にも入っておらず、国の旗やバリアントとしては出さず、単独の項目もありません。海上自衛隊の自衛艦旗と、旧日本海軍の軍艦旗として、ほかの国の軍の旗のなかに、期間と出典つきで置いています。自衛艦旗は、日本語版Wikipediaの自衛艦旗の項が示す、自衛隊法施行令の様式（縦横比3対2、日章の直径は縦の半分、中心は旗の中心から横の6分の1だけ掲揚側、光線は11.25度、紅は英語版Wikipediaの旭日旗の項が示す #bd0029）で描きます。旧海軍の軍艦旗は、1954年の旗が海軍の様式に合わせて定められたと同じ項が述べているため、同じ図形で、より暗い紅（その値を示す出典はない）で描きます。旗は、歴史をもつ軍の旗としてあるがままに示します。その使われ方をめぐる議論には、このパッケージは立場をとりません。

## 除いたもの

除いたのは、インドネシアの軍艦旗（Commonsのファイルがラスター画像を埋め込んでおり、ベクターではない）、オランダとスウェーデンの艦首旗とスウェーデンの軍艦旗（Commonsにあるのは、CC BY-SAの絵だけ）、ブラジルの艦首旗（CC BY-SA）、国旗そのものである軍艦旗（オランダ、トルコ、ブラジル、メキシコ、アルゼンチン、チリ、ポルトガル。国の旗のほうにあります）、最適化後に上限の140 KBを超えるCommonsの絵4点（帝国ドイツ海軍の1892年と1903年の軍艦旗、イタリアの現行の軍艦旗、タイとコロンビアの軍艦旗。NOTICE.mdに一覧があります）、紋章や印章を伴う陸軍旗（アメリカ陸軍とイギリス連隊のもの。当時の旗のパブリックドメインの絵は見つかりませんでした）です。軍の旗は歴史の絵であり、今の軍のしるしとして使うものではありません。続けて[コードと名前](codes-and-names.md)を読んでください。
