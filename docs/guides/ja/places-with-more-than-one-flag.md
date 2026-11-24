---
title: 争いのある旗・かつての国・歴代の旗
section: how-to
order: 23
description: 地域が持った、または同時に持つ旗：争いのある旗と別の旗、メダル表が挙げるかつての国、ある日の旗を説明します。
---

## 争いのある旗と別の旗

実際に使われている旗が複数ある地域があります。Hataはそのすべてを収録し、それぞれに `status` を付け、**政治的などちらの側にも立ちません**。
既定は、世界が認める当局の旗（国際連合で議席を持つアフガニスタンのイスラム共和国）か、その地域に独自の旗があればそれ（セントヘレナのブルー・エンサインで、ユニオン・フラッグではありません）で、
そのほかの旗は呼び出し1つで取り出せます。隠されることも、偶然に既定になることもありません。

```ts
import { variantsOf, manifest } from "@johnmorrisdotca/hata/manifest";
import { flag } from "@johnmorrisdotca/hata/load";
import taliban from "@johnmorrisdotca/hata/flags/af--de-facto";

variantsOf("AF");
// [ { id: "republic", status: "official", default: true, from: "2013", … },
//   { id: "de-facto", status: "de-facto", default: false, from: "2021-08-15", why: "…", source: "https://…", module: "af--de-facto", drawing: { file, licence, author, … } } ]
manifest("AF")?.disputed;                             // true: two authorities claim it
await flag("AF");                                     // the Republic's tricolour
await flag("AF", { variant: "de-facto" });            // the Taliban's flag, framed like any flag: { shape, fit, label }
await flag("GB-NIR", { variant: "ulster-banner" });   // Northern Ireland has no flag of its own, so flag("GB-NIR") is null
```

```html
<hata-flag code="AF" variant="de-facto" size="48"></hata-flag>
```

- **`variantsOf(code)`**（`/manifest` から）は、その地域の旗を既定を先頭に並べます。`id`、英語と日本語の `name`、`status`
  （`official`、`de-facto`、`historical`、`local`）、`from` と `until`、`why`、`source`、SVGを持つ `module`、元になった `drawing` があります。
  `manifest(code)` は同じ一覧に、`disputed` と `defaultVariant` を加えて持ちます。
- **`flag(code, { variant })`**、`flagDataUri`、`<hata-flag variant>` は、ほかの旗と同じ枠でそれを描きます。存在しないidを指定すると `null` になります。
- **既定で独自の旗を持たない地域**（1973年以降の北アイルランド）は `FLAG_CODES` に入らず、`LEFT_OUT` に理由があり、実際に使われている旗は
  別の旗として、名前を指定して取り出します。**その地域の公式の象徴ではないが実際に使われている旗**（ブルターニュのグウェン・ハ・デュ）は、状態が `local` の既定です。
- **非推奨**（2.0で削除）：マルティニークの `local` と `/flags/mq--local`。`martinique` と `/flags/mq` の別名です。

[別の旗の一覧](../../variants.md)には、すべての別の旗の理由、出典、絵、ライセンスがあり、
[判断の記録](../../decisions.md)には、それぞれの既定を選んだ理由と、収録しないもの（リビアとミャンマーの以前の旗）が書かれています。
関連：[別の旗を明確に選ぶ](variants.md)。

## かつての国

メダル表や記録集、競技の歴史は、今はない国の名前を今も挙げます。Hataにはそのうち39か国の旗があり、どれも現在の国が使わないコードで引けます。
ISO 3166-3にコードがあればそれ（`SUHH` ソビエト連邦、`DDDE` 東ドイツ、`YUCS` ユーゴスラビア、`CSHH` チェコスロバキアなど。30のうち24）、なければIOCのコード
（`FRG` 西ドイツ、`BOH` ボヘミア、`WIF` 西インド諸島連邦）、それもなければHata独自の、`X` に2文字を続けたコード（`XAH` オーストリア＝ハンガリー、`XOT` オスマン帝国、`XHW` ハワイ王国。[かつての国](former-countries.md)に一覧があります）です。表に入っていそうなコードも、大文字小文字を問わず見つかります。`SU`、`DD`、`YU`、`BU` と、IOCの
`URS`、`GDR`、`TCH`、`YUG`、`SCG`、`ZAI`、`RHO`、`BWI` です。これらは `FLAG_ALIASES` です。

```ts
import { flag } from "@johnmorrisdotca/hata/load";
import { manifest } from "@johnmorrisdotca/hata/manifest";

await flag("URS");                         // the Soviet Union's flag of 1955 to 1991 (also "SU", "SUHH")
await flag("YUG", { variant: "kingdom" }); // Yugoslavia's flag before 1941, a variant with its dates
manifest("FRG")?.sameAs;                   // "DE": West Germany's flag is Germany's, the one picture
manifest("SUHH")?.historical;              // { from: "1922", until: "1991", aliases: ["SU", "SUN", "URS"] }
```

[かつての国の一覧](../../historical.md)には、すべてのコード、別名、年、理由があります。[判断の記録](../../decisions.md#what-to-know-about-the-former-countries)には注意点があります。

## 歴代の旗と、ある日の旗

今ある国も、別の旗を使っていたことがあります。Hataには、そのうち35か国の、1900年以降に使われた以前の国旗があり、それぞれ `historical` の別の旗として、`from`、`until`
（旗が変わる日は新しい旗のものです）、`source`、その種類を持ちます。**`flag(code, { date })`** はある日の旗を読み込み、`/manifest` の **`variantOn(code, date)`** は
その別の旗を探し、**`<hata-flag date>`** はそれを描きます。

法律がその国の旗と定めた旗と、人々が実際に掲げた旗は、別の旗だったことがあります。Hataは両方を収録し、それぞれに役割（`legal`、`in-use`、または両方）と、
2つが違う場合はその理由と出典を付けます。既定は法律上の旗で、`{ role: "in-use" }`（要素では `which="in-use"`）でもう一方を選べます。`flagOn()` は
絵、もう一方の旗、描くものがない場合は言葉での理由を加えます。

```ts
import { flag, flagOn } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

variantOn("CA", "1962-09-29")?.id;                        // "union-flag", Canada's legal flag; "1965-02-15" is "maple-leaf"
variantOn("CA", "1962-09-29")?.other?.id;                 // "red-ensign-1957", the flag flown, with `note.why` and its source
await flag("CA", { date: "1962-09-29", role: "in-use" }); // the Red Ensign
(await flagOn("SUHH", "1991-12-26")).none?.reason;        // "It had ended by 1991-12-26 (its years are 1922 to 1991)."
```

ドイツの1935年から1945年の旗は、歴史と教育のためだけに収録され、求められない限り出されません（`allowRestricted`、[判断の記録](../../decisions.md#restricted-flags)）。[歴代の旗のページ](https://johnmorrisdotca.github.io/hata/historic.html)には、すべての国が日付順に並び、法律上の旗と実際に使われた旗が違う場合は並べて見られます。[歴代の旗と、ある日の旗](historic-flags.md)、
[今ある国の以前の旗の一覧](../../historical.md#earlier-flags-of-present-day-countries)、[判断の記録](../../decisions.md#historic-flags-of-present-day-countries)に、そのほかがあります。
