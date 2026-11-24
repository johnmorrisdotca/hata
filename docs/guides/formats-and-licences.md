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
| Element | `<hata-flag code="JP-13" shape="round" size="48">` | `@johnmorrisdotca/hata/element/define` | the core is 13 KB, 4.5 KB gzipped, with no flag in it |
| Framework component | typed `Flag` for React, Vue, Svelte and React Native | `@johnmorrisdotca/hata/react`, `/vue`, `/svelte`, `/react-native` | the flag's own module |
| Iframe | a page that draws one flag | the [embed page](embed-in-an-iframe.md) | one page and one flag |
| Saved file | SVG, PNG at the size you chose, and JSON of the flag's facts | the demo's detail panel, made in the browser when asked ([the guide](gallery-and-downloads.md)) | made on request; no PNG file is shipped |
| CSS class or sprite | | not built yet (MODULES-1426) | |
| PNG or WebP at set widths | | not built yet (MODULES-1427) | |

The largest flags carry a coat of arms or a seal drawn as their source draws it: Virginia's is 372.3 KB, and the list of flags over the 40 KB budget is in [docs/sizes.md](../sizes.md). Nothing is redrawn to make it smaller.

## Licences

The code of the package is MIT. The flags are not the package's own work: each is a drawing on Wikimedia Commons under the licence Commons states for that file, and it travels with the flag. Read it in code with `manifest(code).licence`, or all of them in [docs/provenance.md](../provenance.md). Of the 512 primary drawings there:

| Licence | Flags | What you must do |
| --- | --- | --- |
| Public domain | 496 | nothing is required; the author is kept in the manifest anyway |
| CC0 | 9 | nothing is required |
| OGL-om 1.0 | 1 (Oman) | keep the credit [NOTICE.md](../../NOTICE.md) gives for it |
| Copyrighted free use | 1 (Mississippi) | the holder allows any use with no condition, freer than CC BY; [NOTICE.md](../../NOTICE.md) still gives its credit, and keeping it is courteous |
| CC BY 2.5 | 1 variant (the local flag of Saint-Barthélemy, `BL--local`) | credit the author, link the licence and say if you changed the drawing; [NOTICE.md](../../NOTICE.md) has the credit |

Only drawings under the public domain, CC0 or CC BY are shipped, with the two accepted exceptions above ([decisions](../decisions.md)). A flag under CC BY-SA, the GFDL or a licence Commons does not state in a form the build reads is left out and listed with its reason in [docs/left-out.md](../left-out.md): hata does not ship anything share-alike or GPL.

The drawings made for the 4:3 and square frames come from flag-icons (MIT), and the places' names in the docs, the demo, `/names` and the element come from Kuni (MIT, Unicode-3.0 and CC0). [NOTICE.md](../../NOTICE.md), which ships in the package, carries those notices and says where every input came from.

## Can I use a flag in a product?

The licences above let you use the drawings in a product, for money or not. Public domain, CC0 and free use ask for nothing; Oman and the CC BY drawing ask for a credit, which [NOTICE.md](../../NOTICE.md) gives in words.

That is the licence of the drawing, and it is not the whole answer. A country's law may limit how its flag, its coat of arms or its seal may be used: on goods, in advertising, in a way that suggests official approval, or with disrespect. Commons marks most flags "insignia" for that reason, and `manifest(code).restrictions` carries the note for each flag. A few flags are restricted by law in places: Germany's flag of 1935 to 1945 is shipped for history and education, a default call never gives its drawing, and a page of history asks for it by name ([historic flags](historic-flags.md)). Hata cannot grant a right a country's law withholds: check before you put a flag on goods or in an advertisement.
