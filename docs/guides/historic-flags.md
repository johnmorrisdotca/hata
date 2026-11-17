---
title: Historic flags and the flag of a date
section: how-to
order: 18
description: Ask for the flag a country had in use on a day, list a country's earlier flags with their dates and sources, and see every country's flags on one page.
---

A medal table, a timeline or a history lesson needs the flag a country had on the day, not today's. Hata has the earlier flags of 33 countries that still exist (the United States' 48 stars, Canada's Red Ensign, Japan's 1870 Hinomaru and more), each a variant with its dates, and the flag of each of the 12 former countries.

## The flag of a day

`flag(code, { date })` loads the flag of a day, and `variantOn(code, date)` finds its variant: by default the legal flag, the one the law made the country's (see the next section for the flag flown in practice). A date is `"1962-09-29"`, `"1962-09"`, `"1962"` (the first day of that month or year) or a `Date` (read in UTC).

```ts
import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const legal = variantOn("CA", "1962-09-29");
console.log(legal?.id, legal?.from, legal?.until);    // "union-flag" "1867-07-01" "1965-02-15": the legal flag; the Red Ensign was flown (below)
console.log(variantOn("CA", "1965-02-15")?.id);       // "maple-leaf": the day a flag changes belongs to the new flag
console.log(variantOn("US", "1950")?.id);             // "stars-48"
console.log((await flag("JP", { date: "1950" }))?.startsWith("<svg")); // the 1870 Hinomaru, at 7:10
console.log(variantOn("CA", "2030-01-01")?.default);  // true: after the newest change, today's flag
```

In a page, `<hata-flag code="CA" date="1962-09-29">` draws it. Every frame option works on it, and a `variant` named as well wins over the `date`.

## The legal flag and the flag in use

What the law made a country's flag and what its people flew were sometimes two flags. Hata keeps both: every earlier flag has `roles` (`legal`, `in-use` or both) and the days of each, and where a flag is only one of them, a `roleNote` says why and names its source. Canada from 1867 to 1965 is the example: the Union Flag was the legal flag, and the Red Ensigns were flown. `variantOn` gives the legal flag unless asked, says that another flag exists that day and why, and `{ role: "in-use" }` picks the other.

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

The role's days can differ from the flag's own: Australia's Blue Ensign was flown from 1901 and became the national flag in law in 1954, so its `roleDates.legal.from` is `1954-04-14`. In a page, `<hata-flag code="CA" date="1962-09-29" which="in-use">` draws the other (the attribute is `which`, because `role` is the ARIA role the element sets). The [Historic flags](https://johnmorrisdotca.github.io/hata/historic.html) page shows both side by side with the reason, and [historical.md](../historical.md#legal-flag-and-flag-in-use) lists every role.

## When there is no answer

`variantOn` and `flag(code, { date })` give `null` when the package does not know a flag for the place on that day. That is not "no flag": it is "not known here". It happens

- before a place's first dated flag (`variantOn("CA", "1850")` is `null`),
- in a gap where the flag of that day is not shipped, because its drawing is not free or its dates are not documented (Spain's flags between 1939 and 1981; [decisions](../decisions.md#historic-flags-of-present-day-countries) lists them),
- for a place with no dated flags, which is every country not yet researched.

`flagOn(code, date)` never answers with a bare `null`: where there is nothing to draw, `none` has a `kind` and a sentence saying why (`not-yet`, `ended`, `gap`, `other-role`, `undated`, `unknown` or `restricted`), and `await flagOn(code, date)` from `/load` brings the drawing too.

```ts
import { flagOn } from "@johnmorrisdotca/hata/manifest";

console.log(flagOn("CA", "1850").none?.kind);          // "not-yet"
console.log(flagOn("SUHH", "1992-01-01").none?.reason); // "It had ended by 1992-01-01 (its years are 1922 to 1991)."
```

A former country has an answer only within the years it existed and only where one of its dated flags covers the day: `variantOn("SUHH", "1960")` is its flag of 1955, and `variantOn("SUHH", "1991-12-26")` is `null`, because the Soviet Union ended on 1991-12-25. Ask `flag("SUHH")` for its flag without a date. To fall back to today's flag where a date has no answer, write it yourself, so that it is never silent:

```ts
import { flag } from "@johnmorrisdotca/hata/load";

const drawn = (await flag("ZA", { date: "1920-06-01" })) ?? (await flag("ZA")); // the package has none for 1920: today's, by your choice
console.log(drawn?.startsWith("<svg"));
```

## A complete example

The whole of it, as it runs in Node:

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

## A restricted flag

Germany's national flag of 1935 to 1945 is shipped for history and education, and the law restricts displaying it outside those purposes (Germany's StGB §86a, with the exception for education, history, art and research of §86(4), and Austria's Verbotsgesetz). A default call never gives its drawing: `variantOn("DE", "1940")` returns it `withheld`, with `restricted.reason` and the laws, `flag("DE", { date: "1940" })` is `null`, `<hata-flag date="1940">` draws nothing and says why, and it is in no list, picker, quiz, pack or CDN listing. A page of history or teaching asks for it by name.

```ts
import { flag, flagOn } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const found = variantOn("DE", "1940");
console.log(found?.withheld, found?.restricted?.allowedFor); // true "education and history"
console.log(await flag("DE", { date: "1940" }));             // null
console.log((await flagOn("DE", "1940")).none?.reason);      // the restriction, in a sentence
console.log((await flag("DE", { date: "1940", allowRestricted: true }))?.startsWith("<svg")); // for history and education only
```

Who may use it, and how, is in [decisions.md](../decisions.md#restricted-flags). This is not legal advice: the page that shows the flag is responsible for showing it only where the law of the reader's country allows.

## A country's earlier flags

`variantsOf(code)` lists them oldest to newest with `from` (the first day in use) and `until` (the first day of the flag that followed), a `source` that documents the dates and a `sourceKind` that says what the source is: `official` (a government, parliament, archive or law text), `reference` (Flags of the World or a scholarly article) or `encyclopedia` (Wikipedia, a better source wanted).

```ts
import { variantsOf } from "@johnmorrisdotca/hata/manifest";

for (const one of variantsOf("US")) console.log(`${one.from} to ${one.until ?? "today"}: ${one.name} (${one.sourceKind})`);
```

## Every country on one page

The [Historic flags](https://johnmorrisdotca.github.io/hata/historic.html) page shows every country and former country with all of its flags side by side in date order, each with its years, status and source, and filters by continent and by whether the flag changed since 1900. It is made from the manifest, so it holds exactly what the package holds. The same data is in [historical.md](../historical.md#earlier-flags-of-present-day-countries), and the choices behind it, with what is left for later, are in [decisions.md](../decisions.md#historic-flags-of-present-day-countries).
