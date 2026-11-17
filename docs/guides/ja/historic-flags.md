---
title: 歴代の旗と、ある日の旗
section: how-to
order: 18
description: ある日に国が使っていた旗を取り出し、国の以前の旗を日付と出典つきで一覧にし、すべての国の旗を1つのページで見ます。
---

メダル表や年表、歴史の授業で必要なのは、現在の旗ではなく、その日にその国が使っていた旗です。Hataには、今も存在する33か国の以前の旗（アメリカの星48個の星条旗、カナダのレッド・エンサイン、日本の1870年の日の丸など）が、日付つきの別の旗として入っています。かつての国12か国の旗もあります。

## ある日の旗

`flag(code, { date })` はその日に使われていた旗を読み込み、`variantOn(code, date)` はその旗の記録を探します。日付は `"1962-09-29"`、`"1962-09"`、`"1962"`（その月または年の最初の日）、または `Date`（UTCで読みます）です。

```ts
import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const ensign = variantOn("CA", "1962-09-29");
console.log(ensign?.id, ensign?.from, ensign?.until); // "red-ensign-1957" "1957-10-08" "1965-02-15"
console.log(variantOn("CA", "1965-02-15")?.id);       // "maple-leaf"：旗が変わる日は新しい旗のものです
console.log(variantOn("US", "1950")?.id);             // "stars-48"
console.log((await flag("JP", { date: "1950" }))?.startsWith("<svg")); // 7対10の1870年の日の丸
console.log(variantOn("CA", "2030-01-01")?.default);  // true：最も新しい変更のあとは現在の旗です
```

ページでは `<hata-flag code="CA" date="1962-09-29">` で描けます。枠のオプションはすべて使え、`variant` も併せて指定したときは、`variant` が `date` より優先されます。

## 答えがないとき

パッケージがその日のその地域の旗を知らないとき、`variantOn` と `flag(code, { date })` は `null` を返します。これは「旗がない」ではなく「ここでは分かっていない」という意味です。次のような場合です。

- その地域の最初の日付つきの旗より前（`variantOn("CA", "1850")` は `null`）。
- その日の旗を収録していない空白（図が自由に使えない、または日付の出典がないため）。スペインの1939年から1981年の旗や、ドイツの1935年から1945年のハーケンクロイツの旗などです。一覧は[判断の記録](../../decisions.md#historic-flags-of-present-day-countries)にあります。
- 日付つきの旗がない地域。まだ調べていないすべての国がこれに当たります。

かつての国は、存在していた期間のうち、その日にあたる日付つきの旗がある場合にだけ答えが返ります。`variantOn("SUHH", "1960")` は1955年の旗で、`variantOn("SUHH", "1991-12-26")` はソビエト連邦が1991年12月25日に終わったので `null` です。日付なしの旗がほしいときは `flag("SUHH")` を使います。日付に答えがないときに現在の旗を使いたい場合は、気づかないうちに置き換わらないよう、自分でその処理を書きます。

```ts
import { flag } from "@johnmorrisdotca/hata/load";

const drawn = (await flag("DE", { date: "1940-06-01" })) ?? (await flag("DE")); // 1940年の旗はないので、自分で選んで現在の旗にします
console.log(drawn?.startsWith("<svg"));
```

## 完全な例

Nodeで動かすときの全体は次のとおりです。

```js
import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn, variantsOf } from "@johnmorrisdotca/hata/manifest";

// The flag a country had on a day: Canada's Red Ensign in 1962, the Maple Leaf from 1965-02-15, and today's flag after the newest change.
const ensign = variantOn("CA", "1962-09-29");
const leaf = variantOn("CA", "1965-02-15");
const earlier = await flag("CA", { date: "1962-09-29" });
const unknown = await flag("CA", { date: "1850" }); // null: no flag is known for that day, which is not the same as no flag
console.log(ensign?.id, leaf?.id, earlier === (await flag("CA", { variant: "red-ensign-1957" })), unknown, variantsOf("US").length);
```

## 国の以前の旗

`variantsOf(code)` は、国の以前の旗を古い順に一覧にします。各項目には、`from`（使われた最初の日）、`until`（次の旗が始まった最初の日）、日付の出典である `source`、その出典の種類を示す `sourceKind` があります。`sourceKind` は `official`（政府・議会・公文書・法令の本文）、`reference`（Flags of the Worldや学術論文）、`encyclopedia`（Wikipedia。より確かな出典が必要）のいずれかです。

```ts
import { variantsOf } from "@johnmorrisdotca/hata/manifest";

for (const one of variantsOf("US")) console.log(`${one.from} to ${one.until ?? "today"}: ${one.name} (${one.sourceKind})`);
```

## すべての国を1つのページで

[歴代の旗](https://johnmorrisdotca.github.io/hata/historic.html)のページでは、すべての国とかつての国について、旗を年代順に並べ、それぞれの年、位置づけ、出典を示します。大陸や、1900年以降に変わったかどうかで絞り込めます。ページはマニフェストから作られるので、パッケージにあるものと一致します。同じデータは[historical.md](../../historical.md#earlier-flags-of-present-day-countries)にあり、その判断と、あとに回した課題は[decisions.md](../../decisions.md#historic-flags-of-present-day-countries)にあります。
