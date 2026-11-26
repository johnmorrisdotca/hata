---
title: Samurai battle banners
section: how-to
order: 26
description: Draw the nobori, flags and uma-jirushi of Sengoku daimyo from their own entry point, each saying what is documented and what is reconstruction.
---

The armies of the Sengoku period went to battle under banners: the tall narrow *nobori*, the flags called *hata*, and the *uma-jirushi*, the sign carried beside a commander. Hata has twenty-one of them, as their own import, `@johnmorrisdotca/hata/samurai`, so a page that draws countries only does not download them. An id is `samurai:` and a lower-case slug, such as `samurai:sanada-rokumonsen`; no country's or region's code contains a colon, so a banner can never take the place of one, and `isFlagCode("samurai:ii-igeta")` is false.

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { samuraiFlag, samuraiInfo, samuraiName } from "@johnmorrisdotca/hata/samurai";

// A banner is an SVG string, framed like a country's; its id begins with "samurai:", and its record says what is documented.
const nobori = await samuraiFlag("samurai:sanada-rokumonsen");
const round = nobori === null ? "" : frame(nobori, { shape: "round", label: samuraiName("samurai:sanada-rokumonsen", "ja") ?? "" });
console.log(nobori?.startsWith("<svg"), round.includes("clipPath"), samuraiName("samurai:sanada-rokumonsen", "ja"));
console.log(samuraiInfo("samurai:sanada-rokumonsen")?.status);
```

`samuraiFlag(id)` loads the SVG string (a promise), `samuraiName(id, lang)` and `samuraiAbout(id, lang)` the name and a sentence in English or Japanese, `samuraiAspect(id)` the width over the height, `samuraiInfo(id)` everything the package knows of it, and `samuraiIn("nobori")` the ids of one kind (`nobori`, `hata` or `uma`). `samuraiId("ii-igeta")` reads an id written loosely, and `SAMURAI_IDS` lists them all. Each returns `null` for an id with no banner here.

## Size, and loading one drawing

The entry carries the records only: the ids, names, descriptions, dates, sources and notes, about 40 KB (6.8 KB gzipped), with no drawing in it. Each drawing is a module of its own, `@johnmorrisdotca/hata/samurai/ii-igeta` (a median of 388 B, at most 4.8 KB, the lettered ones the largest), which the lookup loads by a dynamic import when it is asked for, as `/load` does for a country's flag. A page therefore carries the drawings it asks for and no others. You can import a module yourself (`import svg from "@johnmorrisdotca/hata/samurai/ii-igeta"`, the drawing of `samurai:ii-igeta`); there is no other way to a drawing than its id or its module.

## What is documented, and what is not

Almost no banner of the period survives, and none is drawn here from a surviving cloth. Nine designs are the ones a reference gives in words: the Japanese Wikipedia's article on uma-jirushi (馬印), which lists the banners and signs of named commanders (Uesugi Kenshin's red disc on dark blue, Hojo Ujiyasu's five-colour steps, Date Masamune's large black banner, Toyotomi Hideyoshi's gold war fan with a red streamer, Tokugawa Ieyasu's gold fan, Oda Nobunaga's gold parasol, Ii Naomasa's gold well-curb on red), and its article on the Sanada clan (真田氏), which describes the Sanada nobori, all red with the six-coin crest. The words give the design and the ground, not the proportions, the shades or the order of the parts, so each drawing is a `reconstruction`, and its `note` says which part follows the source and which is this package's. Both pages are encyclopedia articles, and a better source, a museum's or a period record, is wanted for each.

## Drawn from a period picture: the roll book 御馬印

Twelve more are drawn from a picture painted in the period: the roll book 御馬印 (*Go-umajirushi*), roll 1, of the Kan'ei era (1624 to 1644), in the National Diet Library ([NDL 1286895](https://dl.ndl.go.jp/pid/1286895), public domain). It paints the banners and standards of the shogun's house and the daimyo, each lord's name beside his. The cloth's proportions and the place and size of its parts are measured from the photograph of the frame each record names (`source.url` opens that frame), so these are `documented`: Taitoku-in's banner with 五, the Lord of Mito's gold disc on black, the Lord of Echizen's red disc on white, Hoshina Higo's pale blue nobori with twenty-seven black dots, three of Sakai Kunai's, Uesugi Danjō's gold disc on black and his banner with 毘, Tōdō Izumi's three white discs on black, and Honda Mino's nobori with 本 and his gold band on black. The shades are this package's reading of the painting, and the loops that hold the cloth to the pole, the pole and any finial are not drawn. The characters 五, 毘 and 本 are lettered in Yuji Syuku, an SIL Open Font License brush font named in `NOTICE.md`, not traced from the page, so their brush is the font's.

Still left out: the written banners no period picture read here shows (Takeda Shingen's Fūrinkazan, Uesugi Kenshin's own 毘, Tokugawa Ieyasu's 厭離穢土欣求浄土), because no source read gives their colours and layout and a lettered drawing would be a guess; and the banners whose design is a bird, a crest of leaves or a hanging ornament that the sources name but do not describe. A banner is a historical picture, not a mark to use for a person or a family today. Continue with [codes and names](codes-and-names.md).
