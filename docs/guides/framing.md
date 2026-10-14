---
title: Keep whole flags or choose a crop
section: how-to
order: 4
description: Separate curated loading from framing an existing SVG.
---

## Use the native API

```ts
import { frame,aspectOf } from "@johnmorrisdotca/hata";
import usa from "@johnmorrisdotca/hata/flags/us";
import { flag } from "@johnmorrisdotca/hata/load";
const round=frame(usa,{shape:"round",fit:"whole"});
console.log(round===null?null:aspectOf(round));
console.log((await flag("CA",{shape:"1:1",fit:"auto"}))?.startsWith("<svg"));
```

`frame(svg)` works only with the one drawing supplied. `flag(code,{shape})` may choose an adapted drawing made for a square/4:3 frame. Neither stretches. `whole` (also `contain`) retains the whole flag with clear bands or a neutral round disc. `crop` explicitly fills using the curated side where one exists, even when auto would retain the whole flag.

## Choose the fit

`auto` follows recorded framing decisions for recognised package drawings and shows an unrecognised SVG whole. `cover` centre-crops; `hoist` keeps the pole side. A crop can omit a colour or emblem, so retain the reason in metadata. The complete original [framing decisions](../framing.md) describe coverage and chosen sides. Frame shape `flag` means original proportions; the builder calls that choice `own`.
