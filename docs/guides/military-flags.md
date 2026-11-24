---
title: Military flags
section: how-to
order: 27
description: Draw naval ensigns and jacks, with their dates and sources, from their own entry point, among them the Rising Sun Flag of Japan as the ensign of two navies.
---

A warship flies an ensign at the stern and, in port, a jack at the bow. Hata has 60 of them, from more than thirty navies, as their own import, `@johnmorrisdotca/hata/military`, so a page that draws countries only does not download them. An id is `mil:`, the country's two letters and a lower-case slug, such as `mil:gb-white-ensign`; no country's or region's code contains a colon, so a military flag can never take the place of one, and `isFlagCode("mil:gb-white-ensign")` is false.

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { militaryFlag, militaryInfo, militaryName } from "@johnmorrisdotca/hata/military";

// A military flag is an SVG string, framed like a country's; its id begins with "mil:", and its record has its dates and its source.
const ensign = await militaryFlag("mil:gb-white-ensign");
const round = ensign === null ? "" : frame(ensign, { shape: "round", label: militaryName("mil:gb-white-ensign", "ja") ?? "" });
console.log(ensign?.startsWith("<svg"), round.includes("clipPath"), militaryInfo("mil:gb-white-ensign")?.dates?.from);
```

`militaryFlag(id)` loads the SVG string (a promise), `militaryName(id, lang)` and `militaryAbout(id, lang)` the name and a sentence in English or Japanese, `militaryAspect(id)` the width over the height, `militaryInfo(id)` everything the package knows of it (its dates, status, note and source), and `militaryIn("ensign")` the ids of one kind (`ensign` or `jack`). `militaryId("gb-white-ensign")` reads an id written loosely, and `MILITARY_IDS` lists them all. Each returns `null` for an id with no flag here.

## Size, and loading one drawing

The entry carries the records only: the ids, names, descriptions, dates, sources and notes, about 99 KB (11 KB gzipped), with no drawing in it. Each drawing is a module of its own, `@johnmorrisdotca/hata/military/gb-white-ensign` (a median of 1.5 KB, at most 134 KB), which the lookup loads by a dynamic import when it is asked for, as `/load` does for a country's flag. A page therefore carries the drawings it asks for and no others. You can import a module yourself (`import svg from "@johnmorrisdotca/hata/military/gb-white-ensign"`, the drawing of `mil:gb-white-ensign`); a restricted drawing is a module too, and is imported only by naming it.

## What is here

Five are drawn for this package from sources that give their construction: the Japan Maritime Self-Defense Force's ensign (since 1954-06-30) and the Imperial Japanese Navy's ensign (1889-10-07 to 1945), the United Kingdom's White Ensign (since 1864) and its Union Jack as the naval jack (since 1801), and the United States' Navy jack (the union of the 50-star flag, since 1960-07-04). The other 55 are Wikimedia Commons files, taken as the package takes country flags: each file's licence is read from Commons and only public domain and CC0 are shipped, never CC BY-SA; the file is optimised, and its page, licence and author are kept in the record and in [NOTICE.md](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md). They are the naval ensigns, jacks and war flags of Germany (the Bundesmarine's, and the war ensigns of 1871 to 1892, of the Weimar Republic and of the Reichsmarine, 1921 to 1933), France, Italy, Belgium, Denmark, Finland, Poland (with the ensign of 1919 to 1927), Greece, Russia, the Soviet Union, India, Pakistan, China (the People's Liberation Army Navy), Taiwan, Australia, Canada, New Zealand, Thailand, Singapore, South Africa, Egypt, Israel, Ukraine, Colombia, Indonesia, Argentina, Chile, Mexico, Norway, Portugal, Spain, South Korea, the Philippines, Ireland, Peru and Romania, and the national flags that the Union's armies and navy carried in 1861 to 1865. Each record has its dates where the file's title or description gives them (and none where it gives none: the flag is then the current one, as read on 2026-11-24), the page they were read from, and a `status`: `documented` where a source gives the design, `reconstruction` where the sizes are this package's. The `note` says which.

## Withheld by default: the Confederate battle flags

The battle flag of the Army of Northern Virginia (square, from 1861) and the Confederate States Navy's jack (the rectangular form, 1863 to 1865) are here for history, beside the United States' flags of the same years, and are shipped for history and education only. They are treated as Germany's flag of 1935 to 1945 is ([decisions](https://github.com/johnmorrisdotca/hata/blob/main/docs/decisions.md)): in no list, group or demo page, never given by default, and given only to a call that names them and asks: `militaryFlag("mil:cs-battle-flag", { allowRestricted: true })`. `MILITARY_RESTRICTED_IDS` lists them, and `militaryInfo(id)?.restricted` says why: "Confederate battle flag, 1861 to 1865. Shown for history and education. It is widely seen today as a symbol of racism and white supremacy." No law restricts them, so the record names none. The Confederacy's three national flags are not battle flags and are ordinary variants of the former country `XCS`.

## The Rising Sun Flag

Japan's Rising Sun Flag (旭日旗, *kyokujitsu-ki*) is in this set and nowhere else in the package. It is not in any country's record, it is not offered as a country's flag or variant, and it has no entry of its own: it is the ensign of the Japan Maritime Self-Defense Force and the war ensign of the Imperial Japanese Navy, each shown among the military flags of other countries, with its dates and its source. The Self-Defense Force's ensign is drawn to the construction in the Self-Defense Forces Act's enforcement order, as the Japanese Wikipedia's article on the ensign gives it (3 to 2, the sun's diameter half the hoist, its centre a sixth of the length from the middle toward the hoist, rays of 11.25 degrees, in the red #bd0029 that the Wikipedia article on the Rising Sun Flag gives). The navy's ensign is drawn to the same geometry, because that article says the 1954 ensign was set to the navy's pattern, in a darker red whose value no source gives. The flag is shown for what it is, a military flag with a history; this package takes no side in the disputes about its use.

## What is left out

Left out: Indonesia's ensign (its Commons file embeds a raster picture, not a vector), the Netherlands' and Sweden's naval jacks and Sweden's ensign (Commons has only CC BY-SA drawings of them), Brazil's naval jack (CC BY-SA), and the ensigns that are the national flag itself (the Netherlands', Turkey's, Brazil's, Mexico's, Argentina's, Chile's, Portugal's), which are in the country set; four Commons drawings over the size ceiling of 140 KB once optimised (the Imperial German Navy's war ensigns of 1892 and 1903, Italy's current ensign, Thailand's ensign and Colombia's ensign), listed in NOTICE.md; and army colours that carry an emblem or seal (the United States Army's, the British regiments'), for which no public-domain drawing of the colours of the period was found. A military flag is a historical picture, not a mark to use for an armed force today. Continue with [codes and names](codes-and-names.md).
