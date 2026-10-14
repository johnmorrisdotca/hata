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

## Keep a caption

`flagName` accepts English/Japanese language choices and returns null when a name is unavailable. Keep the code as an explicit fallback instead of inventing a translation. `flagAspect` returns width divided by height, or null for an unavailable primary flag. Language selection does not change the drawing or its source. Continue with [variants](variants.md) for a place without a default flag.
