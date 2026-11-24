---
title: Medieval banners
section: how-to
order: 28
description: Draw a small curated set of medieval banners from their own entry point, each citing the page that dates it and saying what is documented and what is reconstruction.
---

A knight's banner, a military order's, a crusader's cross: Hata has six medieval banners as their own import, `@johnmorrisdotca/hata/medieval`, so a page that draws countries only does not download them. An id is `med:` and a lower-case slug, such as `med:red-cross`; no country's or region's code contains a colon, so a banner can never take the place of one, and `isFlagCode("med:red-cross")` is false.

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { medievalFlag, medievalInfo, medievalName } from "@johnmorrisdotca/hata/medieval";

// A banner is an SVG string, framed like a country's; its id begins with "med:", and its record says what its source documents.
const banner = medievalFlag("med:red-cross");
const round = banner === null ? "" : frame(banner, { shape: "round", label: medievalName("med:red-cross", "ja") ?? "" });
console.log(banner?.startsWith("<svg"), round.includes("clipPath"), medievalInfo("med:red-cross")?.dates?.from);
```

`medievalFlag(id)` gives the SVG string, `medievalName(id, lang)` and `medievalAbout(id, lang)` the name and a sentence in English or Japanese, `medievalAspect(id)` the width over the height, `medievalInfo(id)` everything the package knows of it (its dates, status, note and source), and `medievalIn("order")` the ids of one kind (`order`, `cross` or `kingdom`). `medievalId("red-cross")` reads an id written loosely, and `MEDIEVAL_IDS` lists them all. Each returns `null` for an id with no banner here.

## What is documented, and what is not

Each banner is one that a page cites with a date and a source: the Templars' black and white (Jacques de Vitry in the 1220s, Matthew Paris about 1250 to 1259 and a fresco of about 1290), the red cross on white (the Genoese annals from at least 1218), Denmark's white cross on red (folio 55v of the Gelre Armorial, compiled before 1396, the earliest known coloured picture of the Dannebrog), the arms of Aragon (the seal of Alfonso II of 1159), Scotland's white saltire on blue (recorded as a naval flag for 1507) and the Hospitallers' white cross on red (the arms given by Pope Innocent II in 1130, and the red surcoat of 1248). The sources give the design, never the proportions, and no banner of the time survives, so every drawing is a `reconstruction`, and its `note` says what the source documents and what is this package's: the proportions, the shades, the width of the arms and the rectangular cloth. Where the sources disagree (which half of the Templars' banner was black), the note says which this package followed. The pages are encyclopedia articles, and a better source, a museum's or a period record, is wanted for each.

Left out: the Teutonic Order's white banner with a black cross, for which no page that dates the banner was found; the lions of England and the fleurs-de-lis of France, whose animals and flowers cannot be drawn cleanly from a blazon alone; and the Oriflamme, whose colours no source read settles. A banner is a historical picture, not a mark to use for an order or a house today. Continue with [codes and names](codes-and-names.md).
