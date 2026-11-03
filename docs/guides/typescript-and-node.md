---
title: TypeScript and Node
section: how-to
order: 16
description: Use the package's types, and read the same flag as SVG text on a server with no DOM.
---

The package ships its own types, for each entry point. A flag is plain SVG text, so the same call gives the same answer in Node, Deno, Bun, a worker and a browser. This file type-checks, then runs under Node 22.18 or later, which strips the types.

```ts
import japan from "@johnmorrisdotca/hata/flags/jp";
import { aspectOf, flagUrl, isFlagCode, type FlagCode } from "@johnmorrisdotca/hata";

const code: FlagCode = "JP-13";
console.log(japan.startsWith("<svg"), aspectOf(japan), flagUrl(code), isFlagCode("XX"));

// @ts-expect-error "XX" is not a flag's code
const unknown: FlagCode = "XX";
console.log(unknown);
```

`@ts-expect-error` is there to show that `"XX"` is not a flag's code; the compiler refuses it.

## On a server

A server reads the same SVG a browser does. There is no DOM, so the page is a string.

```mjs
import { flag } from "@johnmorrisdotca/hata/load";
import { flagName } from "@johnmorrisdotca/hata/names";

// A server reads the same SVG a browser does: pure, no DOM, no browser globals.
const svg = await flag("JP-13", { shape: "round" });
const page = `<!doctype html><title>${flagName("JP-13", "ja")}</title>${svg}`;
console.log(page.length > 300, flagName("JP-13", "ja"));
```

See [getting started](getting-started.md) for the first flag and [loading flags](loading-flags.md) for the others.
