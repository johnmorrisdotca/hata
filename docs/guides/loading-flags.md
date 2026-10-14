---
title: Load flags on demand
section: how-to
order: 3
description: Await a drawing without importing the whole catalogue.
---

## Use the native API

```ts
import { flag,flagDataUri } from "@johnmorrisdotca/hata/load";
const tokyo=await flag("JP-13");
console.log(tokyo?.startsWith("<svg"),(await flagDataUri("CA"))?.startsWith("data:"));
console.log(await flag("XX"));
```

The loader imports a stored flag module and returns a Promise of SVG text or null for an unsupported code/variant. Await it before inserting the SVG. A host bundler can create its own chunks; loading is not a live geographic-data lookup. A module failure rejects and should be reported as an asset/bundling error.

## Use URLs intentionally

`flagUrl` from the root returns an original raw SVG URL and does not fetch it. Its optional base allows self-hosted assets; the default CDN is pinned to the package major. A data URI is an inline representation, whereas a URL asks an image/browser to fetch the asset. Keep the accessible place name on an image. Fixed imports remain in [the catalogue](flag-resources.md).

## Original HTML image recipes

```html
<img src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/jp-13.svg" alt="Tokyo" height="48">
<img src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/ca.1x1.svg" alt="Canada" height="48" style="border-radius:50%">
<script type="module">
  import { flag } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/load.js";
  document.body.insertAdjacentHTML("beforeend", await flag("CA-ON"));
</script>
```
