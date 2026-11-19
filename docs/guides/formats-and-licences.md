---
title: Formats, sizes and licences
section: explanation
order: 3
description: Every form a hata flag comes in with what it weighs, the licences the drawings are under with how many flags are under each, and whether you can use a flag in a product.
---

## Formats and sizes

One drawing, in the forms below. Sizes are from [docs/sizes.md](../sizes.md), made by `pnpm data` and held by a test: the optimised SVG as shipped, and gzipped at level 9 as a server would send it.

| Form | What you get | How | What it weighs |
| --- | --- | --- | --- |
| SVG file | one `.svg` for each flag, `dist/svg/<code>.svg` | `flagUrl(code)` for a jsDelivr address, or `flagUrl(code, { base })` for your own copy | the median flag is 806 B; every flag together is 8890.7 KB, 3081.6 KB gzipped, and the countries alone 2119.6 KB, 725.0 KB gzipped |
| Module | the SVG as a string, one module a flag | `import jp from "@johnmorrisdotca/hata/flags/jp"` | the same bytes; a page pays only for the flags it imports |
| Module for a frame | the drawing made for a 4:3 or a square frame | `@johnmorrisdotca/hata/flags/<code>.4x3` and `.1x1` | 429 drawings, 2869.6 KB, 957.8 KB gzipped |
| By code at run time | a flag chosen while the page runs | `flag(code)` from `/load`, which loads one flag's own file | the lookup is 25 KB, then the flag |
| Data URI | the SVG as a `data:image/svg+xml` address, smaller than base64 | `toDataUri(svg)`, `flagDataUri(code)` | the SVG, a little larger |
| Element | `<hata-flag code="JP-13" shape="round" size="48">` | `@johnmorrisdotca/hata/element/define` | the core is 12 KB, 3.7 KB gzipped, with no flag in it |
| Framework component | typed `Flag` for React, Vue, Svelte and React Native | `@johnmorrisdotca/hata/react`, `/vue`, `/svelte`, `/react-native` | the flag's own module |
| Iframe | a page that draws one flag | the [embed page](embed-in-an-iframe.md) | one page and one flag |
| Saved file | SVG, PNG at the size you chose, and JSON of the flag's facts | the demo's detail panel, made in the browser when asked ([the guide](gallery-and-downloads.md)) | made on request; no PNG file is shipped |
| CSS class | `<span class="hata hata-jp">`, a class for each flag, and `hata-4x3`, `hata-1x1` and `hata-round` for the frames | `@johnmorrisdotca/hata/css`, or one group of them ([the guide](css-and-sprite.md)) | 88.4 KB, 8.4 KB gzipped, for all 479; the flags are fetched as the page shows them |
| SVG sprite | one SVG file of `<symbol id="hata-jp">` for each flag | `flagSprite(codes)` from `@johnmorrisdotca/hata/sheets`, or the files on the demo's site | 2.1 MB for the countries, 8.7 MB for all |
| PNG or WebP at set widths | a file for each flag at 20 to 1280 px wide, and in a square or round frame at 40 to 320 px | `https://johnmorrisdotca.github.io/hata/raster/png/w160/jp.png`, [below](#pictures-in-set-sizes-and-a-zip) | not in the npm package; 0.1 to 19.7 MB for every flag at one width |
| Zip | every flag's SVG, `manifest.json`, `LICENSES.md`, `NOTICE.md` and `LICENSE` | `https://johnmorrisdotca.github.io/hata/raster/hata-flags.zip` | 3.5 MB |

The largest flags carry a coat of arms or a seal drawn as their source draws it: Virginia's is 372.3 KB, and the list of flags over the 40 KB budget is in [docs/sizes.md](../sizes.md). Nothing is redrawn to make it smaller.

## Pictures in set sizes, and a zip

For a page, a document or a tool that wants a picture and not an SVG, every flag is also made as a PNG and as a WebP at set sizes, from the package's own SVG files, each time the demo site is published. They are not in the npm package (which holds no picture, to stay small) but on the demo's site, beside it:

```text
https://johnmorrisdotca.github.io/hata/raster/<format>/<folder>/<code>.<format>
https://johnmorrisdotca.github.io/hata/raster/png/w160/jp.png          Japan, 160 px wide, 107 px high
https://johnmorrisdotca.github.io/hata/raster/webp/round-80/ca-bc.webp   British Columbia in a round frame, 80 px across
```

The folder `w<width>` holds each flag at its own proportions, `<width>` pixels wide and as high as its proportions make it. `square-<size>` and `round-<size>` hold it in the package's 1:1 and round frames (the same pictures as `flag(code, { shape })`: cropped only where a crop keeps every colour), `<size>` pixels each way, with clear corners where round. The file name is the code in lower case. Both formats keep transparency, and the WebP is lossless, so it is the same picture as the PNG in fewer bytes.

| Width | PNG, every flag | PNG, median flag | WebP, every flag | WebP, median flag | A good use |
| --- | --- | --- | --- | --- | --- |
| `w20` | 0.1 MB | 0.3 KB | 0.1 MB | 0.2 KB | beside a line of text, in a table |
| `w40` | 0.3 MB | 0.5 KB | 0.2 MB | 0.2 KB | a form field, a dropdown option |
| `w80` | 0.6 MB | 1.0 KB | 0.3 MB | 0.4 KB | a dropdown option on a sharp screen, a list |
| `w160` | 1.4 MB | 2.0 KB | 0.7 MB | 0.7 KB | a card, a profile |
| `w320` | 3.4 MB | 4.3 KB | 1.5 MB | 1.4 KB | a phone's full width, a banner |
| `w640` | 8.3 MB | 9.5 KB | 3.3 MB | 2.7 KB | a heading, a slide |
| `w1280` | 19.7 MB | 23.0 KB | 6.6 MB | 5.5 KB | a poster, a full screen, print |
| `square-40` to `square-320` | 0.4 to 5.4 MB | 0.8 to 6.2 KB | 0.2 to 2.3 MB | 0.3 to 2.0 KB | tiles, a map's markers, an avatar |
| `round-40` to `round-320` | 0.6 to 7.0 MB | 1.3 to 9.9 KB | 0.3 to 3.0 MB | 0.6 to 3.6 KB | a round badge, a profile picture |

Sizes are of the files made for 1.14.0. Use the SVG wherever a page can (it is smaller than any picture of the larger sizes, and sharp at any size), WebP where a page wants a picture, and PNG where a tool does not read WebP: an office document, an email, an older app. Over a few hundred pixels, the largest flags (a coat of arms drawn as the source draws it) are the heavy ones: the biggest PNG is 308 KB.

**`hata-flags.zip`** is for a person who is not a developer and wants every flag in one file: all 479 SVGs in `svg/` (named by code, in lower case), `manifest.json`, `LICENSES.md`, `NOTICE.md` and `LICENSE`.

**The licence travels with the files.** `https://johnmorrisdotca.github.io/hata/raster/LICENSES.md` (and the same file in the zip) lists every flag's Commons file with its link, its author, its licence, whether the licence asks for a credit, and whether the square and round pictures use flag-icons' drawing made for the frame (MIT: its notice is in `NOTICE.md`). A picture is a copy of the drawing, so the drawing's licence and credit apply to it as they do to the SVG.

`pnpm site` makes them into `site/raster/`, and `pnpm rasters <folder>` makes them anywhere else (about a minute); they are made with `@resvg/resvg-js` and `@jsquash/webp`, development dependencies that the package does not carry.

## Licences

The code of the package is MIT. The flags are not the package's own work: each is a drawing on Wikimedia Commons under the licence Commons states for that file, and it travels with the flag. Read it in code with `manifest(code).licence`, or all of them in [docs/provenance.md](../provenance.md). Of the 479 primary drawings there:

| Licence | Flags | What you must do |
| --- | --- | --- |
| Public domain | 469 | nothing is required; the author is kept in the manifest anyway |
| CC0 | 8 | nothing is required |
| OGL-om 1.0 | 1 (Oman) | keep the credit [NOTICE.md](../../NOTICE.md) gives for it |
| Copyrighted free use | 1 (Mississippi) | the holder allows any use with no condition, freer than CC BY; [NOTICE.md](../../NOTICE.md) still gives its credit, and keeping it is courteous |
| CC BY 2.5 | 1 variant (the local flag of Saint-Barthélemy, `BL--local`) | credit the author, link the licence and say if you changed the drawing; [NOTICE.md](../../NOTICE.md) has the credit |

Only drawings under the public domain, CC0 or CC BY are shipped, with the two accepted exceptions above ([decisions](../decisions.md)). A flag under CC BY-SA, the GFDL or a licence Commons does not state in a form the build reads is left out and listed with its reason in [docs/left-out.md](../left-out.md): hata does not ship anything share-alike or GPL.

The drawings made for the 4:3 and square frames come from flag-icons (MIT), and the places' names in the docs, the demo, `/names` and the element come from Kuni (MIT, Unicode-3.0 and CC0). [NOTICE.md](../../NOTICE.md), which ships in the package, carries those notices and says where every input came from.

## Can I use a flag in a product?

The licences above let you use the drawings in a product, for money or not. Public domain, CC0 and free use ask for nothing; Oman and the CC BY drawing ask for a credit, which [NOTICE.md](../../NOTICE.md) gives in words.

That is the licence of the drawing, and it is not the whole answer. A country's law may limit how its flag, its coat of arms or its seal may be used: on goods, in advertising, in a way that suggests official approval, or with disrespect. Commons marks most flags "insignia" for that reason, and `manifest(code).restrictions` carries the note for each flag. A few flags are restricted by law in places: Germany's flag of 1935 to 1945 is shipped for history and education, a default call never gives its drawing, and a page of history asks for it by name ([historic flags](historic-flags.md)). Hata cannot grant a right a country's law withholds: check before you put a flag on goods or in an advertisement.
