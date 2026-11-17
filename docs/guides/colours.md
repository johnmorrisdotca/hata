---
title: Find flags by their colours
section: how-to
order: 19
description: Read each flag's colours as exact hex values with the share each covers, and list the flags that have the colours you name.
---

Every flag's colours are measured from its own drawing and kept in their own import, `@johnmorrisdotca/hata/search`, so a page that only draws flags does not download them. `coloursOf(code)` gives a flag's colours, the one that covers most of it first: the exact hex the drawing has, the share of the flag it covers, and a name from a closed list.

```mjs
import { COLOUR_NAMES, coloursOf, flagsWith } from "@johnmorrisdotca/hata/search";

// Japan: white over four fifths of the flag, and the red of the disc.
console.log(coloursOf("JP"));
// The flags that are red and white and nothing else: no other colour covers more than 3% of the flag.
console.log(flagsWith({ colours: ["red", "white"], only: true }).includes("CA"));
// The names a colour can have, for a row of chips.
console.log(COLOUR_NAMES.join(", "));
```

## What a colour is

The names are `red`, `orange`, `yellow`, `green`, `light-blue`, `blue`, `purple`, `brown`, `black`, `grey` and `white`. A name is the word a person would use of a flag, not a shade: navy and royal blue are both `blue`, and the hex says which. `light-blue` is the sky blue of Argentina's flag. The name comes from a rule on the colour's hue, saturation and lightness, the same for every flag.

`flagsWith({ colours })` lists the codes whose flag has every colour named: the colours of that name cover at least 1% of the flag. With `only: true` it leaves out a flag with any other colour over 3%, so the small emblem on Mexico's flag does not keep it out of green, white and red. A place's default flag is the one looked at; `coloursOf(code, { variant })` gives another of its flags' colours.

## How the colours are measured

`pnpm data:colours` draws each shipped flag 1200 pixels wide, at its own proportions and never in a frame or a crop, and counts every pixel by its exact colour. A colour that covers at least 0.1% of the flag is one of its colours; the smoothed edge of lettering and the steps of a gradient go to the nearest of them. Nothing is typed by hand: the measure is in `scripts/colours.data.json`, and the manifest's `colours` for each flag is the same list. Continue with [codes and names](codes-and-names.md).
