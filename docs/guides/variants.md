---
title: Choose a flag variant explicitly
section: how-to
order: 6
description: Keep variant status, dates and source decisions visible.
---

## Use the native API

```ts
import { variantsOf } from "@johnmorrisdotca/hata/manifest";
import { flag } from "@johnmorrisdotca/hata/load";
const choices=variantsOf("AF");
console.log(choices.map(choice=>choice.id));
if(choices[0]) console.log((await flag("AF",{variant:choices[0].id}))?.startsWith("<svg"));
```

Variants are identified by a stored id, not an invented spelling or another primary country. Their metadata retains official, de-facto, historical or local status, dates, why and sources. A place without a default requires an explicit choice. The loader returns null for an invalid id; the gallery shows the native choices and explanations.

## Avoid silent replacement

A default drawing is a documented choice, not a claim that no alternatives exist. Retain the status when showing an alternative and never silently substitute one for a missing primary flag. Brittany's local drawing and Northern Ireland's explicit choices retain the original decisions. The full original [variant reference](../variants.md) and [decisions](../decisions.md) explain each case.
