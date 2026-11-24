---
title: 軍の旗
section: how-to
order: 27
description: 軍艦旗と艦首旗を、期間と出典つきで専用の入口から描きます。日本の旭日旗も、2つの海軍の軍艦旗として含まれます。
---

軍艦は、艦尾に軍艦旗を、港では艦首に艦首旗を掲げます。Hataにはその5つがあり、専用の入口 `@johnmorrisdotca/hata/military` にあるので、国の旗だけを描くページはこれを読み込みません。idは `mil:` に国の2文字と小文字の名前を続けたもの（`mil:gb-white-ensign` など）です。国や地域のコードにはコロン（:）が含まれないため、軍の旗のidが国のコードに成り代わることはなく、`isFlagCode("mil:gb-white-ensign")` は偽です。

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { militaryFlag, militaryInfo, militaryName } from "@johnmorrisdotca/hata/military";

// A military flag is an SVG string, framed like a country's; its id begins with "mil:", and its record has its dates and its source.
const ensign = militaryFlag("mil:gb-white-ensign");
const round = ensign === null ? "" : frame(ensign, { shape: "round", label: militaryName("mil:gb-white-ensign", "ja") ?? "" });
console.log(ensign?.startsWith("<svg"), round.includes("clipPath"), militaryInfo("mil:gb-white-ensign")?.dates?.from);
```

`militaryFlag(id)` はSVG文字列、`militaryName(id, lang)` と `militaryAbout(id, lang)` は英語か日本語の名前と一文、`militaryAspect(id)` は幅÷高さ、`militaryInfo(id)` はパッケージが知っているすべて（期間、位置づけ、注記、出典）、`militaryIn("ensign")` は種類（`ensign`、`jack`）ごとのidを返します。`militaryId("gb-white-ensign")` は緩く書いたidを読み取り、`MILITARY_IDS` は全idの一覧です。旗がないidにはどれも `null` を返します。

## ここにあるもの

海上自衛隊の自衛艦旗（1954年6月30日から）と、旧日本海軍の軍艦旗（1889年10月7日から1945年まで）、イギリスのホワイト・エンサイン（英国海軍のもの、1864年から）と艦首旗としてのユニオン・ジャック（1801年から）、アメリカの海軍の艦首旗（50星の国旗の青い部分、1960年7月4日から）です。どの記録にも、期間、その期間を読んだページ、`status` があります。出典が構成（比、寸法）を示すものは `documented`、意匠と期間だけを示し、寸法はこのパッケージのものであるものは `reconstruction` です。どちらかは `note` に書いてあります。

## 旭日旗

日本の旭日旗（きょくじつき）は、この組にだけあり、パッケージのほかのどこにもありません。どの国の記録にも入っておらず、国の旗やバリアントとしては出さず、単独の項目もありません。海上自衛隊の自衛艦旗と、旧日本海軍の軍艦旗として、ほかの国の軍の旗のなかに、期間と出典つきで置いています。自衛艦旗は、日本語版Wikipediaの自衛艦旗の項が示す、自衛隊法施行令の様式（縦横比3対2、日章の直径は縦の半分、中心は旗の中心から横の6分の1だけ掲揚側、光線は11.25度、紅は英語版Wikipediaの旭日旗の項が示す #bd0029）で描きます。旧海軍の軍艦旗は、1954年の旗が海軍の様式に合わせて定められたと同じ項が述べているため、同じ図形で、より暗い紅（その値を示す出典はない）で描きます。旗は、歴史をもつ軍の旗としてあるがままに示します。その使われ方をめぐる議論には、このパッケージは立場をとりません。

## 除いたもの

ここにあるのは、出典が寸法を示すか、説明からきれいに描けるものだけです。除いたのは、紋章や印章を伴う軍艦旗・艦首旗・陸軍旗（ドイツ、フランス、イタリア、スペインの海軍の軍艦旗、ソ連海軍の旗、アメリカの陸軍・海兵隊・沿岸警備隊の旗、イギリス連隊の連隊旗）で、読んだ出典のどれにも比がなく、紋章の絵は推測になるからです。また、北欧の海軍の燕尾の軍艦旗とロシア海軍のアンドレイ旗は、ここで引ける形で、比と期間を示すページが見つかりませんでした。軍の旗は歴史の絵であり、今の軍のしるしとして使うものではありません。続けて[コードと名前](codes-and-names.md)を読んでください。
