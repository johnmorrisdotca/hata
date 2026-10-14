---
title: Getting started
section: tutorial
order: 1
description: Import one flag and retain its proportions.
---

## Use the native API

```ts
import japan from "@johnmorrisdotca/hata/flags/jp";
import { aspectOf } from "@johnmorrisdotca/hata";
console.log(japan.startsWith("<svg"),aspectOf(japan));
```

A fixed flag import contains the SVG string, not an image URL or a DOM node. Assign it to a host element in a browser, or retain it as text on a server. Each drawing has its own module, so a page carries only the flags it imports. Set height or width while preserving the SVG viewBox; stretching can misrepresent the flag.

## Choose a loading boundary

Use the root for codes, URLs and pure SVG helpers. Use `/load` for a code chosen at runtime, `/names` for captions and `/manifest` for source/author/licence metadata. The optional `/element/define` entry registers the browser element. See [loading](loading-flags.md), [the catalogue](flag-resources.md) and [framing](framing.md). Installing does not add runtime dependencies or a hosted service.
