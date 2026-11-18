---
title: Frames that never stretch a flag
section: how-to
order: 21
description: Put a flag in a 4:3, square or round frame, whole or cropped at the side a person chose, and see how each frame is measured.
---

## One flag in every frame

```ts
import { frame } from "@johnmorrisdotca/hata";
import { flag } from "@johnmorrisdotca/hata/load";
import canada from "@johnmorrisdotca/hata/flags/ca";
import usa from "@johnmorrisdotca/hata/flags/us";

await flag("CA", { shape: "1:1" });                // flag-icons' square of Canada, drawn for the shape
frame(canada, { shape: "4:3" });                   // cropped from the centre: the crop keeps every colour
frame(canada, { shape: "1:1" });                   // the whole flag: a centre crop would lose the red bars
frame(canada, { shape: "1:1", fit: "cover" });     // the centre crop anyway, because you asked for it
frame(canada, { shape: "round", label: "Canada" }); // the whole flag on a neutral disc, with role="img" and a title

// Whole and cropped, for every flag: the crop is kept where a person judged the flag's meaning to be.
await flag("US", { shape: "1:1", fit: "whole" });  // all of the stars and stripes, in a square
await flag("US", { shape: "1:1", fit: "crop" });   // the canton and a slice of the stripes, not the middle stripes
frame(usa, { shape: "1:1" });                      // auto: the same crop, kept at the hoist
frame(usa, { shape: "1:1", fit: "whole" });        // the whole flag
```

## Whole and cropped

Every flag is offered as the whole flag and as a crop, at 4:3, square and round. `fit: "whole"` (CSS's `contain`) shows
all of it. `fit: "crop"` crops it **at the side a person chose for that flag**, not at the middle: the United States and
Uruguay at the hoist, so that the canton or the Sun of May shows with a slice of the stripes; Rwanda at the fly, where its
sun is; flags with a triangle or a serrated edge, and the Nordic crosses, at the hoist. Where nobody chose a side the crop is from the
centre (Japan's disc, a coat of arms, a tricolour). `fit: "auto"`, the default, takes the crop where it shows the flag fairly and
the whole flag where it does not: a Blue Ensign has its Union Flag in one corner and its stars or badge in the other, and no square
holds both. A crop asked for by name always crops, even there. `manifest(code).framings[shape].crop` records, for every flag and
frame, which crop `auto` uses (`own`, `curated`, `centre` or `whole`), the side (`at`), the reason (`why`) and the colours a crop
drops (`loses`), and [the framing list](../framing.md) lists every flag with its side and reason. The demo's flag panel shows the
whole flag beside its crop at each shape, and the gallery has a Whole / Cropped switch.

## How a frame is measured

`pnpm data:framing` measured every flag's frames in a browser. A frame keeps a flag when every colour covering 5% of it still covers at least half that share. For 4:3 and
square it takes, in order: the flag itself where it is that shape already; flag-icons' drawing made by hand for the shape, where it keeps the colours and draws the same design;
a crop kept at the chosen side or from the centre, where that keeps them; and the whole flag otherwise. Round is the square's choice in a circle. `flag(code, { shape })` uses
all of these; `frame(svg)` works on the one SVG it is given, as measured for the flag the SVG names (`data-hata`). `manifest(code).framings` says which for every flag, and a
browser test fails if any frame of any flag loses a colour no reason excuses.

See also [keep whole flags or choose a crop](framing.md).
