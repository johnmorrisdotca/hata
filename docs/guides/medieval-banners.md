---
title: Medieval banners
section: how-to
order: 28
description: Draw a small curated set of medieval banners from their own entry point, each citing the page that dates it and saying what is documented and what is reconstruction.
---

A knight's banner, a military order's, a crusader's cross: Hata has 42 medieval banners as their own import, `@johnmorrisdotca/hata/medieval`, so a page that draws countries only does not download them. An id is `med:` and a lower-case slug, such as `med:red-cross`; no country's or region's code contains a colon, so a banner can never take the place of one, and `isFlagCode("med:red-cross")` is false.

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { medievalFlag, medievalInfo, medievalName } from "@johnmorrisdotca/hata/medieval";

// A banner is an SVG string, framed like a country's; its id begins with "med:", and its record says what its source documents.
const banner = await medievalFlag("med:red-cross");
const round = banner === null ? "" : frame(banner, { shape: "round", label: medievalName("med:red-cross", "ja") ?? "" });
console.log(banner?.startsWith("<svg"), round.includes("clipPath"), medievalInfo("med:red-cross")?.dates?.from);
```

`medievalFlag(id)` loads the SVG string (a promise), `medievalName(id, lang)` and `medievalAbout(id, lang)` the name and a sentence in English or Japanese, `medievalAspect(id)` the width over the height, `medievalInfo(id)` everything the package knows of it (its dates, status, note and source), and `medievalIn("order")` the ids of one kind (`order`, `cross`, `kingdom`, `empire` or `city`). `medievalId("red-cross")` reads an id written loosely, and `MEDIEVAL_IDS` lists them all. Each returns `null` for an id with no banner here.

## Size, and loading one drawing

The entry carries the records only: the ids, names, descriptions, dates, sources and notes, about 83 KB (12 KB gzipped), with no drawing in it. Each drawing is a module of its own, `@johnmorrisdotca/hata/medieval/red-cross` (a median of 1.6 KB, at most 110 KB), which the lookup loads by a dynamic import when it is asked for, as `/load` does for a country's flag. A page therefore carries the drawings it asks for and no others. You can import a module yourself (`import svg from "@johnmorrisdotca/hata/medieval/red-cross"`, the drawing of `med:red-cross`); there is no other way to a drawing than its id or its module.

## Where the banners come from

Six are drawn for this package from pages that date them: the Templars' black and white (Jacques de Vitry in the 1220s, Matthew Paris about 1250 to 1259 and a fresco of about 1290), the red cross on white (the Genoese annals from at least 1218), Denmark's white cross on red (folio 55v of the Gelre Armorial, compiled before 1396), the arms of Aragon (the seal of Alfonso II of 1159), Scotland's white saltire on blue (recorded as a naval flag for 1507) and the Hospitallers' white cross on red (the arms of 1130 and the red surcoat of 1248). The other 36 are Wikimedia Commons drawings, taken as the package takes country flags: each file's licence is read from Commons and only public domain and CC0 are shipped, never CC BY-SA (many fine heraldry drawings there are, and are left out); the file is optimised, and its page, licence and author are kept in the record and in [NOTICE.md](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md). They include the royal banners of England, France, Navarre, León, Portugal and Hungary, the Holy Roman Empire's red cross and war banner, the Teutonic Order's, the flags of Genoa, Florence, Pisa, Milan, Ragusa and the Papal States, the Byzantine imperial banners, the Almoravid, Ayyubid and Saladin banners, Owain Glyn Dŵr's golden dragon, the Cross of Burgundy and the early Swiss cross.

Every one is a modern drawing of a banner known from a seal, an armorial, a chronicle or a map, and no banner of the time survives, so every one is a `reconstruction`; its `note` says what the source documents and what is the drawer's. Its dates are the ones its file's title or description gives (a century where it gives that), and none where it gives none. Where sources disagree (which half of the Templars' banner was black), the note says which was followed. The pages are encyclopedia articles and Commons descriptions, and a better source, a museum's or a period record, is wanted for each.

Left out: the Lion of St Mark of Venice (301 KB once optimised, over the 140 KB ceiling), every Commons drawing under CC BY-SA, and the banners for which no public-domain or CC0 drawing was found (the Oriflamme, Bohemia's lion, Lithuania's Vytis, Novgorod's, Castile's castle, Sicily's). A banner is a historical picture, not a mark to use for an order or a house today. Continue with [codes and names](codes-and-names.md).
