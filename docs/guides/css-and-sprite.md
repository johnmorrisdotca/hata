---
title: CSS classes and an SVG sprite
section: how-to
order: 24
description: Put a flag on a page with a class on an element, or with an SVG sprite, and take only the flags the page uses.
---

A flag can be a class on an empty element, as a set of icons is, or a symbol in one SVG file. Both draw the flag at its true proportions, never stretched, and both are made from the package's own drawings. Neither is needed for the `<hata-flag>` element or an `<img>`; they are for a page whose styles already name a class for a flag, or one that wants one file for many flags.

## A class for a flag

The stylesheet has a class for each flag, `hata-` and the code in lower case, and one class, `hata`, for what they share. Put both on an element with no content.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata classes from jsDelivr</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/css/hata.css" />
  </head>
  <body>
    <p style="font-size: 48px">
      <span class="hata hata-jp" role="img" aria-label="Japan"></span>
      <span class="hata hata-ca-bc hata-round" role="img" aria-label="British Columbia"></span>
    </p>
  </body>
</html>
```

| Class | What it does |
| --- | --- |
| `hata` | An inline box `1em` high, drawing its flag as a background, with the width its proportions give. Set `font-size` or `height` to change the size. |
| `hata-<code>` | The flag: `hata-jp`, `hata-jp-13`, `hata-ca-bc`, `hata-us-tx`, and a former country's, `hata-suhh`. |
| `hata-4x3`, `hata-1x1`, `hata-round` | The flag in that frame, as `flag(code, { shape })` frames it: the drawing made for the frame where there is one, a crop kept at the side measured for it, or the whole flag (on a neutral disc when round). |

A class draws a picture, so give the element `role="img"` and a name in `aria-label`, or leave it out and put the name in the text beside it. The classes begin with `hata`, so they sit beside flag-icons' while a site moves ([moving from flag-icons](moving-to-hata.md#from-flag-icons)).

## Which stylesheet

The stylesheets name the SVG files with `url()`, so a page loads a flag only when an element shows it. The classes are small; the flags are not (a coat of arms is hundreds of kilobytes), and a bundler such as Vite or webpack copies every file a stylesheet names into the build. So there is a stylesheet for each group, and a page takes the groups it shows.

| Import | Classes | Size | Gzipped |
| --- | --- | --- | --- |
| `@johnmorrisdotca/hata/css` | all 479 | 88.4 KB | 8.4 KB |
| `@johnmorrisdotca/hata/css/countries` | the 246 countries | 60.2 KB | 5.4 KB |
| `@johnmorrisdotca/hata/css/former` | the 12 former countries | 2.0 KB | 0.5 KB |
| `@johnmorrisdotca/hata/css/<country>-regions` | one country's regions: `jp-regions` (45), `ca-regions` (13), `us-regions` (57), `au`, `gb`, `de`, `fr`, `ch`, `at` and `br` | 1.1 to 7.6 KB | 0.4 to 1.2 KB |

```ts no-check
import "@johnmorrisdotca/hata/css/countries";
import "@johnmorrisdotca/hata/css/jp-regions";
```

On a CDN the same files are at `https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/css/<name>.css`, and their `url()` finds the SVG files beside them. With the flags inlined as data URLs, as some sets do, the whole set would be some 3 MB gzipped; here it is 8.4 KB and the flags a page shows.

To take only the flags a page uses, write a stylesheet of them, from your own build or on the command line (from a checkout of this repository, after `pnpm install`):

```js
import { flagCss, flagSprite } from "@johnmorrisdotca/hata/sheets";

// The classes and the symbols of the flags a page uses, written to the files the page serves.
const css = await flagCss(["jp", "ca-bc"], { base: "/flags" });
const sprite = await flagSprite(["jp", "ca-bc"]);
console.log(css.includes(".hata-jp{"), sprite.includes('<symbol id="hata-ca-bc"'));
```

`base` is the folder the SVG files will be in on your site (a copy of `node_modules/@johnmorrisdotca/hata/dist/svg`); left out, it is `../svg`. The command line does the same: `pnpm css --only jp,ca-bc --base /flags --out flags.css`, and `pnpm sprite --only jp,ca-bc --out flags.svg`; left out, `--only` means every flag.

## A sprite

A sprite is one SVG file of symbols, one for each flag, with the id `hata-<code>`. A page draws one with `<use>`:

```html
<svg viewBox="0 0 3 2" width="48" role="img" aria-label="Japan"><use href="flags.svg#hata-jp"/></svg>
```

Give the outer `<svg>` a `viewBox` of the flag's proportions (`flagAspect(code)` from `/names` gives the ratio: 3:2 for Japan) and a width; the flag fills it without stretching. A browser reads a sprite file only from the page's own origin, so a CDN's will not draw: put the file on your own site, or write the `<svg>` of symbols into the page. A flag that shares another's picture (French Guiana's is France's) is written once in a sprite, and the other's symbol uses it.

The sprites for the groups above are made each time the demo site is published, at `https://johnmorrisdotca.github.io/hata/sprite/<name>.svg` (`countries`, `former`, `jp-regions`, `us-regions` and the rest, and `hata` for everything). They are big, because each flag is its full drawing:

| File | Size | Gzipped |
| --- | --- | --- |
| `hata.svg` (all 479) | 8.7 MB | 3.0 MB |
| `countries.svg` | 2.1 MB | 0.68 MB |
| `us-regions.svg` | 4.9 MB | 1.8 MB |
| `jp-regions.svg` | 22 KB | 8 KB |

Write a sprite of the few flags a page uses with `flagSprite`, and it is a few kilobytes.

## Licences

Each class and symbol draws a Commons drawing, under the licence the manifest gives for that flag (`manifest(code).licence`, and [formats, sizes and licences](formats-and-licences.md)). A page that shows a flag whose licence asks for a credit owes that credit, whichever way it draws the flag. The stylesheet's first line says where each drawing's source, author and licence are kept.
