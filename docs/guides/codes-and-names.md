---
title: Read codes and names
section: how-to
order: 2
description: Distinguish exact code checks from normalized lookup.
---

## Use the native API

```ts
import { flagCode,isFlagCode,FLAG_CODES } from "@johnmorrisdotca/hata";
import { flagName,flagAspect } from "@johnmorrisdotca/hata/names";
console.log(flagCode("jp_13"),isFlagCode("JP-13"),isFlagCode("jp-13"),FLAG_CODES.length);
console.log(flagName("JP-13","ja"),flagAspect("JP-13"));
```

`isFlagCode` checks the exact stored uppercase primary code; `flagCode` normalizes the documented case and underscore forms and returns null for a code with no primary flag. A full subdivision code identifies a region; a country code is not its subdivision. The primary-code list is distinct from the larger catalogue of adapted drawings and variants.

## Ask for a former country

A medal table or a record book still names the Soviet Union, East Germany and Yugoslavia. Hata has their flags under codes no present-day country uses: the ISO 3166-3 code where that standard has one (`SUHH`, `DDDE`, `YUCS`), else the IOC's (`FRG`, `BOH`, `WIF`). The codes a table is likely to hold are `FLAG_ALIASES`, and `flagCode`, `flag`, `flagName` and `manifest` read them; `isFlagCode` and `FLAG_CODES` hold only the code itself.

```ts
import { flagCode, isFlagCode, FLAG_ALIASES } from "@johnmorrisdotca/hata";
import { flagName } from "@johnmorrisdotca/hata/names";
console.log(flagCode("urs"), flagCode("GDR"), isFlagCode("URS"), FLAG_ALIASES.TCH);
console.log(flagName("YUG"), flagCode("CS"));
```

A code that two countries held (`CS`: Czechoslovakia, then Serbia and Montenegro) is no alias, and `flagCode("CS")` is null, because a near miss would draw the wrong country. An Olympic team that marched under the Olympic flag (`EUN`) has no flag to ship and is in `LEFT_OUT` with the reason, so keep the code as a badge. [Every code, alias and reason](../historical.md) is listed.

## Read an alpha-3 or numeric code

A table from elsewhere often holds `JPN` or `392` where hata keys flags by `JP`. `findFlagCode` in `/names` reads those too, from Kuni's table of the countries that have a flag, and everything `flagCode` reads (a subdivision, a former country's code or alias). It is in `/names` because its two tables are data, and the main entry stays small. A code that finds no flag, or that two places held, is null.

```ts
import { findFlagCode } from "@johnmorrisdotca/hata/names";
console.log(findFlagCode("jpn"), findFlagCode("392"), findFlagCode("004"), findFlagCode("urs"), findFlagCode("XXX"));
```

## Keep a caption

`flagName` accepts English/Japanese language choices and returns null when a name is unavailable. Keep the code as an explicit fallback instead of inventing a translation. `flagAspect` returns width divided by height, or null for an unavailable primary flag. Language selection does not change the drawing or its source. Continue with [variants](variants.md) for a place without a default flag.

## Look a code up

The demo has [a page of every code](https://johnmorrisdotca.github.io/hata/codes.html) with its English and Japanese names, its flag and links to the flag's SVG file and its gallery entry. Type a code or part of a name, in either language, to narrow it; the codes with no flag are listed too, with the reason.
