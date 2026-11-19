---
title: Move to hata from another flag set
section: how-to
order: 18
description: The hata line that replaces each way of drawing a flag with flag-icons, country-flag-icons, circle-flags, react-world-flags or flagpack-core, and what changes.
---

Each section starts with a line from that set's own README (linked, read on 2026-11-17) and gives the hata line that does the same job. Install hata first, under its scoped name: `npm install @johnmorrisdotca/hata`. The [comparison](other-flag-sets.md) says what each set draws and where hata has no equal yet.

Three things are the same for every move. A hata code is the ISO 3166-1 alpha-2 code in either case (`gr` or `GR`), or an ISO 3166-2 code for a region (`JP-13`, `DE-BY`). A flag is drawn at its own proportions inside a box, never stretched, so a flag-icons `fi` of 4:3 and a hata flag of the same box differ for Japan, Canada, Switzerland and others: set the width, not both sides. And the licence of each drawing is its own, so read [formats, sizes and licences](formats-and-licences.md) before you ship.

## From flag-icons

[flag-icons](https://github.com/lipis/flag-icons) uses classes on an empty `span`.

```html
<span class="fi fi-gr"></span> <span class="fi fi-gr fis"></span>
```

In hata the element is the nearest thing. A squared flag is `shape="square"`.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
<hata-flag code="GR" size="32"></hata-flag> <hata-flag code="GR" shape="square" size="32"></hata-flag>
```

Or keep the class: hata has a stylesheet with a class for each flag, so `fi fi-gr` becomes `hata hata-gr` and `fi fi-gr fis` becomes `hata hata-gr hata-1x1` ([CSS classes and an SVG sprite](css-and-sprite.md), and the table of class names below).

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/css/hata.css" />
<span class="hata hata-gr"></span> <span class="hata hata-gr hata-1x1"></span>
```

What changes: a `hata` element is `1em` high, where an `fi` is `1.33em` wide, so set the size you want by `font-size` or `height`; and its width follows the flag's own proportions, not 4:3, unless you add `hata-4x3`. hata's classes begin with `hata`, so both sets' classes can be on one page while you move.

## From country-flag-icons

[country-flag-icons](https://github.com/catamphetamine/country-flag-icons/blob/master/README.md) has a React component, a string and a plain image for each flag.

```js no-check
import { US } from 'country-flag-icons/react/3x2'
import US from 'country-flag-icons/string/3x2/US'
```

```tsx no-check
import { Flag } from "@johnmorrisdotca/hata/react";
import us from "@johnmorrisdotca/hata/flags/us";   // the SVG as a string, one module a flag

<Flag code="US" label="United States" size="large" />
```

For `<img src="…/3x2/US.svg">`, use `flagUrl("US")`, which gives a jsDelivr address, or `flagUrl("US", { base: "/flags" })` for a copy of `dist/svg/` on your own site. Its `hasFlag(code)` is `isFlagCode(code)`, and its `countries` list is `FLAG_CODES`.

What changes: the flags are drawn at their true proportions, not 3:2. Its Unicode emoji output has no equal; the [README](../../README.md#where-it-comes-from-and-where-it-is-used) says why hata does not draw emoji (MODULES-1425).

## From circle-flags

[circle-flags](https://github.com/HatScripts/circle-flags/blob/gh-pages/README.md) is an image address and, for React, a separate package.

```html
<img src="https://hatscripts.github.io/circle-flags/flags/br.svg" width="48" />
```

```html
<hata-flag code="BR" shape="round" size="48"></hata-flag>
```

```ts no-check
import { flag } from "@johnmorrisdotca/hata/load";

const brazil = await flag("BR", { shape: "round", label: "Brazil" });   // an SVG string drawn for the circle
```

What changes: a round hata flag is drawn again for the circle where a crop would lose a colour (the red bars of Canada's), where a circle-flags drawing is one design for the circle. A circle-flags file for a place hata has no flag for (the README names `es-ib`, the Balearic Islands) has no equal yet (MODULES-1412).

## From react-world-flags

[react-world-flags](https://github.com/smucode/react-world-flags/blob/master/README.md) takes a code of two letters, three letters or three digits.

```jsx no-check
import Flag from 'react-world-flags'

<Flag code="nor" height="16" />
```

```tsx no-check
import { Flag } from "@johnmorrisdotca/hata/react";

<Flag code="NO" size={16} />
```

What changes: hata takes the two-letter code only (MODULES-1425), so convert a three-letter or numeric code first. Its bundle holds every flag and is about 1.3 MB gzipped, according to its README; hata's core is 3.7 kB gzipped with no flag in it, and each flag is a module of its own, loaded when a page asks.

## From flagpack-core

[flagpack-core](https://github.com/Yummygum/flagpack-core/blob/main/README.md) says each flag is imported on its own from its `flags` folder, and that the React, Vue and Svelte packages do that for you.

```tsx no-check
import { Flag } from "@johnmorrisdotca/hata/react";

<Flag code="GB-SCT" label="Scotland" />
```

Vue and Svelte are in [the framework guide](frameworks.md).

What changes: England, Scotland and Wales are `GB-ENG`, `GB-SCT` and `GB-WLS` in both; Northern Ireland has no flag of its own, so hata offers the Union Flag and the former Ulster Banner as named variants and `GB-NIR` alone gives null, where flagpack-core has `GB-NIR`. The United Kingdom's own flag is `GB` in hata.

## Class names, set by set

The same flag, in the class each set uses and in hata's. flag-icons and country-flag-icons name a class for a flag; circle-flags is image files only, and a round hata flag takes its place. A frame is a second class in hata, on the same element.

| What you want | flag-icons | country-flag-icons | circle-flags | hata |
| --- | --- | --- | --- | --- |
| Greece | `fi fi-gr` | `flag:GR` | `<img src=".../flags/gr.svg">` | `hata hata-gr` |
| Greece, square | `fi fi-gr fis` | no class (a `1x1` folder of files) | no | `hata hata-gr hata-1x1` |
| Greece, round | none | none | `<img src=".../flags/gr.svg">` (every file is round) | `hata hata-gr hata-round` |
| Scotland | `fi fi-gb-sct` | `flag:GB-SCT` | `<img src=".../flags/gb-sct.svg">` | `hata hata-gb-sct` |
| Bavaria | none | none | none | `hata hata-de-by` |
| The size | `font-size` (`1.33em` wide) | `font-size`, or `--CountryFlagIcon-height` | the `<img>`'s own | `font-size` or `height` (`1em` high) |

The stylesheet of one is not the stylesheet of another, so take the class from one set and the stylesheet from the same set: moving a page is replacing the class names above, and the one `<link>` for hata's stylesheet.

## What none of them give you

The source, author and licence of the flag you drew, from `manifest(code)`. Move that too: it is the reason to leave a set that does not say.

```ts
import { manifest } from "@johnmorrisdotca/hata/manifest";

console.log(manifest("NO")?.licence.name, manifest("NO")?.author);
```
