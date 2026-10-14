---
title: Retain source and licence metadata
section: how-to
order: 5
description: Read the chosen drawing record before reusing it.
---

## Use the native API

```ts
import { manifest,leftOut } from "@johnmorrisdotca/hata/manifest";
const drawing=manifest("JP-13");
console.log(drawing?.source,drawing?.author,drawing?.licence.name);
console.log(leftOut("XX"));
```

A flag record preserves its source, author, licence, source URL, drawing dimensions and framing decisions. Do not infer a flag's licence from the package MIT licence: each SVG carries its own source record. Keep attribution where the source licence requires it and read the insignia note before use.

## Preserve review decisions

The original [provenance](../provenance.md), [decisions](../decisions.md), [left-out list](../left-out.md) and [NOTICE](../../NOTICE.md) remain complete. `manifest` is null for a code without a primary drawing; `leftOut` can explain a known omission, but null can also mean an unknown code or an available flag. Known omissions distinguish no flag, no suitable SVG and licence limitations. No new drawing or licence choice is made by this documentation rollout.
