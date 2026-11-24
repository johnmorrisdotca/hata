---
title: 歴代の旗と、ある日の旗
section: how-to
order: 18
description: ある日に国が使っていた旗を取り出し、国の以前の旗を日付と出典つきで一覧にし、すべての国の旗を1つのページで見ます。
---

メダル表や年表、歴史の授業で必要なのは、現在の旗ではなく、その日にその国が使っていた旗です。Hataには、今も存在する35か国の以前の旗（アメリカの星48個の星条旗、カナダのレッド・エンサイン、日本の1870年の日の丸など）が、日付つきの別の旗として入っています。かつての国12か国の旗もあります。

## ある日の旗

`flag(code, { date })` はその日の旗を読み込み、`variantOn(code, date)` はその旗の記録を探します。指定しなければ、法律上の国旗（その国の旗として法律が定めた旗）が返ります。実際に掲げられていた旗は次の節にあります。日付は `"1962-09-29"`、`"1962-09"`、`"1962"`（その月または年の最初の日）、または `Date`（UTCで読みます）です。

```ts
import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const legal = variantOn("CA", "1962-09-29");
console.log(legal?.id, legal?.from, legal?.until);    // "union-flag" "1867-07-01" "1965-02-15"：法律上の国旗。レッド・エンサインは実際に掲げられた旗です（次の節）
console.log(variantOn("CA", "1965-02-15")?.id);       // "maple-leaf"：旗が変わる日は新しい旗のものです
console.log(variantOn("US", "1950")?.id);             // "stars-48"
console.log((await flag("JP", { date: "1950" }))?.startsWith("<svg")); // 7対10の1870年の日の丸
console.log(variantOn("CA", "2030-01-01")?.default);  // true：最も新しい変更のあとは現在の旗です
```

ページでは `<hata-flag code="CA" date="1962-09-29">` で描けます。枠のオプションはすべて使え、`variant` も併せて指定したときは、`variant` が `date` より優先されます。

## 法律上の国旗と、実際に使われた旗

法律がその国の旗と定めた旗と、人々が実際に掲げた旗は、別の旗だったことがあります。Hataは両方を収録しています。以前の旗にはすべて `roles`（`legal`、`in-use`、または両方）とそれぞれの期間があり、どちらか一方だけの旗には、理由と出典を示す `roleNote` が付きます。1867年から1965年のカナダがその例です。法律上の国旗はユニオン・フラッグで、実際に掲げられたのはレッド・エンサインでした。`variantOn` は何も指定しなければ法律上の旗を返し、その日にもう1つ別の旗があること、その理由も知らせます。`{ role: "in-use" }` で、もう一方を選べます。

```ts
import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const legal = variantOn("CA", "1962-09-29");
console.log(legal?.id, legal?.role);                    // "union-flag" "legal"
console.log(legal?.other?.id, legal?.other?.role);      // "red-ensign-1957" "in-use"
console.log(legal?.other?.note?.why);                   // why: the government kept the Union Flag as the national flag in law
console.log(legal?.other?.note?.source);                // the page that says so
console.log(variantOn("CA", "1962-09-29", { role: "in-use" })?.id); // "red-ensign-1957"
console.log(variantOn("US", "1950")?.other);            // null: one flag was both
console.log((await flag("CA", { date: "1962-09-29", role: "in-use" }))?.startsWith("<svg"));
```

役割の期間は、旗そのものの期間と違うことがあります。オーストラリアのブルー・エンサインは1901年から掲げられ、法律上の国旗になったのは1954年なので、`roleDates.legal.from` は `1954-04-14` です。ページでは `<hata-flag code="CA" date="1962-09-29" which="in-use">` でもう一方を描けます（属性名が `which` なのは、`role` が要素の設定するARIAのロールだからです）。[歴代の旗](https://johnmorrisdotca.github.io/hata/historic.html)のページは、法律上の国旗と実際に使われた旗が違う国では、その2つを理由とともに並べて表示します。すべての役割は[historical.md](../../historical.md#legal-flag-and-flag-in-use)に一覧があります。

## 答えがないとき

パッケージがその日のその地域の旗を知らないとき、`variantOn` と `flag(code, { date })` は `null` を返します。これは「旗がない」ではなく「ここでは分かっていない」という意味です。次のような場合です。

- その地域の最初の日付つきの旗より前（`variantOn("CA", "1850")` は `null`）。
- その日の旗を収録していない空白（図が自由に使えない、または日付の出典がないため）。スペインの1939年から1981年の旗などです。一覧は[判断の記録](../../decisions.md#historic-flags-of-present-day-countries)にあります。
- 日付つきの旗がない地域。まだ調べていないすべての国がこれに当たります。

`flagOn(code, date)` は、`null` だけを返すことはありません。描くものがないときは、`none` に種類（`not-yet`、`ended`、`gap`、`other-role`、`undated`、`unknown`、`restricted`）と理由の文が入ります。`/load` の `await flagOn(code, date)` は、図も一緒に返します。

```ts
import { flagOn } from "@johnmorrisdotca/hata/manifest";

console.log(flagOn("CA", "1850").none?.kind);          // "not-yet"
console.log(flagOn("SUHH", "1992-01-01").none?.reason); // "It had ended by 1992-01-01 (its years are 1922 to 1991)."
```

かつての国は、存在していた期間のうち、その日にあたる日付つきの旗がある場合にだけ答えが返ります。`variantOn("SUHH", "1960")` は1955年の旗で、`variantOn("SUHH", "1991-12-26")` はソビエト連邦が1991年12月25日に終わったので `null` です。日付なしの旗がほしいときは `flag("SUHH")` を使います。日付に答えがないときに現在の旗を使いたい場合は、気づかないうちに置き換わらないよう、自分でその処理を書きます。

```ts
import { flag } from "@johnmorrisdotca/hata/load";

const drawn = (await flag("ZA", { date: "1920-06-01" })) ?? (await flag("ZA")); // 1920年の旗はないので、自分で選んで現在の旗にします
console.log(drawn?.startsWith("<svg"));
```

## 完全な例

Nodeで動かすときの全体は次のとおりです。

```js
import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn, variantsOf } from "@johnmorrisdotca/hata/manifest";

// The flag a country had on a day: Canada's Red Ensign in 1962 (the flag flown; the legal flag was the Union Flag), the Maple Leaf from 1965-02-15, and today's flag after the newest change.
const ensign = variantOn("CA", "1962-09-29", { role: "in-use" });
const leaf = variantOn("CA", "1965-02-15");
const earlier = await flag("CA", { date: "1962-09-29", role: "in-use" });
const unknown = await flag("CA", { date: "1850" }); // null: no flag is known for that day, which is not the same as no flag
console.log(ensign?.id, leaf?.id, earlier === (await flag("CA", { variant: "red-ensign-1957" })), unknown, variantsOf("US").length);
```

## 使用が制限された旗

1935年から1945年のドイツの国旗は、歴史と教育のために収録していますが、その目的以外で掲示することは法律で制限されています（ドイツ刑法86a条。教育、歴史、芸術、研究の例外は86条4項。オーストリアはナチス禁止法）。通常の呼び出しでは図を返しません。`variantOn("DE", "1940")` は `withheld` を付けて、`restricted.reason` と法律を添えて返し、`flag("DE", { date: "1940" })` は `null`、`<hata-flag date="1940">` は何も描かずに理由を示します。一覧、選択画面、クイズ、パック、CDNの一覧のどれにも入りません。歴史や授業のページでは、名前を指定して取り出します。

```ts
import { flag, flagOn } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const found = variantOn("DE", "1940");
console.log(found?.withheld, found?.restricted?.allowedFor); // true "education and history"
console.log(await flag("DE", { date: "1940" }));             // null
console.log((await flagOn("DE", "1940")).none?.reason);      // the restriction, in a sentence
console.log((await flag("DE", { date: "1940", allowRestricted: true }))?.startsWith("<svg")); // for history and education only
```

だれがどう使えるかは[decisions.md](../../decisions.md#restricted-flags)にあります。これは法的な助言ではありません。この旗を表示するページには、読者の国の法律で認められる場合にだけ表示する責任があります。

## 国の以前の旗

`variantsOf(code)` は、国の以前の旗を古い順に一覧にします。各項目には、`from`（使われた最初の日）、`until`（次の旗が始まった最初の日）、日付の出典である `source`、その出典の種類を示す `sourceKind` があります。`sourceKind` は `official`（政府・議会・公文書・法令の本文）、`reference`（Flags of the Worldや学術論文）、`encyclopedia`（Wikipedia。より確かな出典が必要）のいずれかです。

```ts
import { variantsOf } from "@johnmorrisdotca/hata/manifest";

for (const one of variantsOf("US")) console.log(`${one.from} to ${one.until ?? "today"}: ${one.name} (${one.sourceKind})`);
```

## すべての国を1つのページで

[歴代の旗](https://johnmorrisdotca.github.io/hata/historic.html)のページでは、すべての国とかつての国について、旗を年代順に並べ、それぞれの年、位置づけ、出典を示します。大陸や、1900年以降に変わったかどうかで絞り込めます。ページはマニフェストから作られるので、パッケージにあるものと一致します。同じデータは[historical.md](../../historical.md#earlier-flags-of-present-day-countries)にあり、その判断と、あとに回した課題は[decisions.md](../../decisions.md#historic-flags-of-present-day-countries)にあります。
