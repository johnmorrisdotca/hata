---
title: Military flags
section: how-to
order: 27
description: Draw naval ensigns and jacks, with their dates and sources, from their own entry point, among them the Rising Sun Flag of Japan as the ensign of two navies.
---

A warship flies an ensign at the stern and, in port, a jack at the bow. Hata has five of them, as their own import, `@johnmorrisdotca/hata/military`, so a page that draws countries only does not download them. An id is `mil:`, the country's two letters and a lower-case slug, such as `mil:gb-white-ensign`; no country's or region's code contains a colon, so a military flag can never take the place of one, and `isFlagCode("mil:gb-white-ensign")` is false.

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { militaryFlag, militaryInfo, militaryName } from "@johnmorrisdotca/hata/military";

// A military flag is an SVG string, framed like a country's; its id begins with "mil:", and its record has its dates and its source.
const ensign = militaryFlag("mil:gb-white-ensign");
const round = ensign === null ? "" : frame(ensign, { shape: "round", label: militaryName("mil:gb-white-ensign", "ja") ?? "" });
console.log(ensign?.startsWith("<svg"), round.includes("clipPath"), militaryInfo("mil:gb-white-ensign")?.dates?.from);
```

`militaryFlag(id)` gives the SVG string, `militaryName(id, lang)` and `militaryAbout(id, lang)` the name and a sentence in English or Japanese, `militaryAspect(id)` the width over the height, `militaryInfo(id)` everything the package knows of it (its dates, status, note and source), and `militaryIn("ensign")` the ids of one kind (`ensign` or `jack`). `militaryId("gb-white-ensign")` reads an id written loosely, and `MILITARY_IDS` lists them all. Each returns `null` for an id with no flag here.

## What is here

The Japan Maritime Self-Defense Force's ensign (since 1954-06-30) and the Imperial Japanese Navy's ensign (1889-10-07 to 1945), the United Kingdom's White Ensign (the Royal Navy's, since 1864) and its Union Jack as the naval jack (since 1801), and the United States' Navy jack (the union of the 50-star flag, since 1960-07-04). Each record has its dates, the page they were read from, and a `status`: `documented` where a source gives the construction (the ratio, the sizes), `reconstruction` where it gives the design and the dates and the sizes are this package's. The `note` says which.

## The Rising Sun Flag

Japan's Rising Sun Flag (旭日旗, *kyokujitsu-ki*) is in this set and nowhere else in the package. It is not in any country's record, it is not offered as a country's flag or variant, and it has no entry of its own: it is the ensign of the Japan Maritime Self-Defense Force and the war ensign of the Imperial Japanese Navy, each shown among the military flags of other countries, with its dates and its source. The Self-Defense Force's ensign is drawn to the construction in the Self-Defense Forces Act's enforcement order, as the Japanese Wikipedia's article on the ensign gives it (3 to 2, the sun's diameter half the hoist, its centre a sixth of the length from the middle toward the hoist, rays of 11.25 degrees, in the red #bd0029 that the Wikipedia article on the Rising Sun Flag gives). The navy's ensign is drawn to the same geometry, because that article says the 1954 ensign was set to the navy's pattern, in a darker red whose value no source gives. The flag is shown for what it is, a military flag with a history; this package takes no side in the disputes about its use.

## What is left out

Only what a source describes in measurements or can be drawn cleanly from its description is here. Left out: the ensigns, jacks and army colours that carry an emblem, arms or a seal (the German, French, Italian and Spanish navies' ensigns, the Soviet Navy's, the United States' Army, Marine Corps and Coast Guard flags, the army colours of the British regiments), because no source read gives their proportions and a drawing of the emblem would be a guess; and the swallow-tailed ensigns of the Nordic navies and the Andreyevsky flag of the Russian navy, whose proportions and dates were not found on a page that could be cited here. A military flag is a historical picture, not a mark to use for an armed force today. Continue with [codes and names](codes-and-names.md).
