---
title: Historic flags and the flag of a date
section: how-to
order: 18
description: Ask for the flag a country had in use on a day, list a country's earlier flags with their dates and sources, and see every country's flags on one page.
---

A medal table, a timeline or a history lesson needs the flag a country had on the day, not today's. Hata has the earlier flags of 33 countries that still exist (the United States' 48 stars, Canada's Red Ensign, Japan's 1870 Hinomaru and more), each a variant with its dates, and the flag of each of the 12 former countries.

## The flag of a day

`flag(code, { date })` loads the flag in use on a day, and `variantOn(code, date)` finds its variant. A date is `"1962-09-29"`, `"1962-09"`, `"1962"` (the first day of that month or year) or a `Date` (read in UTC).

```ts
import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const ensign = variantOn("CA", "1962-09-29");
console.log(ensign?.id, ensign?.from, ensign?.until); // "red-ensign-1957" "1957-10-08" "1965-02-15"
console.log(variantOn("CA", "1965-02-15")?.id);       // "maple-leaf": the day a flag changes belongs to the new flag
console.log(variantOn("US", "1950")?.id);             // "stars-48"
console.log((await flag("JP", { date: "1950" }))?.startsWith("<svg")); // the 1870 Hinomaru, at 7:10
console.log(variantOn("CA", "2030-01-01")?.default);  // true: after the newest change, today's flag
```

In a page, `<hata-flag code="CA" date="1962-09-29">` draws it. Every frame option works on it, and a `variant` named as well wins over the `date`.

## When there is no answer

`variantOn` and `flag(code, { date })` give `null` when the package does not know a flag for the place on that day. That is not "no flag": it is "not known here". It happens

- before a place's first dated flag (`variantOn("CA", "1850")` is `null`),
- in a gap where the flag of that day is not shipped, because its drawing is not free or its dates are not documented (Spain's flags between 1939 and 1981, the swastika flag of Germany, 1935 to 1945; [decisions](../decisions.md#historic-flags-of-present-day-countries) lists them),
- for a place with no dated flags, which is every country not yet researched.

A former country has an answer only within the years it existed and only where one of its dated flags covers the day: `variantOn("SUHH", "1960")` is its flag of 1955, and `variantOn("SUHH", "1991-12-26")` is `null`, because the Soviet Union ended on 1991-12-25. Ask `flag("SUHH")` for its flag without a date. To fall back to today's flag where a date has no answer, write it yourself, so that it is never silent:

```ts
import { flag } from "@johnmorrisdotca/hata/load";

const drawn = (await flag("DE", { date: "1940-06-01" })) ?? (await flag("DE")); // the package has none for 1940: today's, by your choice
console.log(drawn?.startsWith("<svg"));
```

## A complete example

The whole of it, as it runs in Node:

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

## A country's earlier flags

`variantsOf(code)` lists them oldest to newest with `from` (the first day in use) and `until` (the first day of the flag that followed), a `source` that documents the dates and a `sourceKind` that says what the source is: `official` (a government, parliament, archive or law text), `reference` (Flags of the World or a scholarly article) or `encyclopedia` (Wikipedia, a better source wanted).

```ts
import { variantsOf } from "@johnmorrisdotca/hata/manifest";

for (const one of variantsOf("US")) console.log(`${one.from} to ${one.until ?? "today"}: ${one.name} (${one.sourceKind})`);
```

## Every country on one page

The [Historic flags](https://johnmorrisdotca.github.io/hata/historic.html) page shows every country and former country with all of its flags side by side in date order, each with its years, status and source, and filters by continent and by whether the flag changed since 1900. It is made from the manifest, so it holds exactly what the package holds. The same data is in [historical.md](../historical.md#earlier-flags-of-present-day-countries), and the choices behind it, with what is left for later, are in [decisions.md](../decisions.md#historic-flags-of-present-day-countries).
