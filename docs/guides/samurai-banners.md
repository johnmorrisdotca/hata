---
title: Samurai battle banners
section: how-to
order: 26
description: Draw the nobori, flags and uma-jirushi of Sengoku daimyo from their own entry point, each saying what is documented and what is reconstruction.
---

The armies of the Sengoku period went to battle under banners: the tall narrow *nobori*, the flags called *hata*, and the *uma-jirushi*, the sign carried beside a commander. Hata has nine of them, as their own import, `@johnmorrisdotca/hata/samurai`, so a page that draws countries only does not download them. An id is `samurai:` and a lower-case slug, such as `samurai:sanada-rokumonsen`; no country's or region's code contains a colon, so a banner can never take the place of one, and `isFlagCode("samurai:ii-igeta")` is false.

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { samuraiFlag, samuraiInfo, samuraiName } from "@johnmorrisdotca/hata/samurai";

// A banner is an SVG string, framed like a country's; its id begins with "samurai:", and its record says what is documented.
const nobori = samuraiFlag("samurai:sanada-rokumonsen");
const round = nobori === null ? "" : frame(nobori, { shape: "round", label: samuraiName("samurai:sanada-rokumonsen", "ja") ?? "" });
console.log(nobori?.startsWith("<svg"), round.includes("clipPath"), samuraiName("samurai:sanada-rokumonsen", "ja"));
console.log(samuraiInfo("samurai:sanada-rokumonsen")?.status);
```

`samuraiFlag(id)` gives the SVG string, `samuraiName(id, lang)` and `samuraiAbout(id, lang)` the name and a sentence in English or Japanese, `samuraiAspect(id)` the width over the height, `samuraiInfo(id)` everything the package knows of it, and `samuraiIn("nobori")` the ids of one kind (`nobori`, `hata` or `uma`). `samuraiId("ii-igeta")` reads an id written loosely, and `SAMURAI_IDS` lists them all. Each returns `null` for an id with no banner here.

## What is documented, and what is not

Almost no banner of the period survives, and none is drawn here from a surviving cloth. Each design is the one a reference gives in words: the Japanese Wikipedia's article on uma-jirushi (馬印), which lists the banners and signs of named commanders (Uesugi Kenshin's red disc on dark blue, Hojo Ujiyasu's five-colour steps, Date Masamune's large black banner, Toyotomi Hideyoshi's gold war fan with a red streamer, Tokugawa Ieyasu's gold fan, Oda Nobunaga's gold parasol, Ii Naomasa's gold well-curb on red), and its article on the Sanada clan (真田氏), which describes the Sanada nobori, all red with the six-coin crest. The words give the design and the ground, not the proportions, the shades or the order of the parts, so each drawing is a `reconstruction`, and its `note` says which part follows the source and which is this package's. Both pages are encyclopedia articles, and a better source, a museum's or a period record, is wanted for each.

Left out, for lack of a source that can be drawn cleanly: the banners that are written characters (Takeda Shingen's Fūrinkazan, Uesugi Kenshin's 毘, Tokugawa Ieyasu's 厭離穢土欣求浄土), because no source read gives their colours and layout and a hand-lettered drawing would be a guess; and the banners whose design is a bird, a crest of leaves or a hanging ornament that the sources name but do not describe. A banner is a historical picture, not a mark to use for a person or a family today. Continue with [codes and names](codes-and-names.md).
