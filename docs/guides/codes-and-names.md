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

## Keep a caption

`flagName` accepts English/Japanese language choices and returns null when a name is unavailable. Keep the code as an explicit fallback instead of inventing a translation. `flagAspect` returns width divided by height, or null for an unavailable primary flag. Language selection does not change the drawing or its source. Continue with [variants](variants.md) for a place without a default flag.
