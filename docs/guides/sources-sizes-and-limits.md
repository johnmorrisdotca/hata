---
title: Sources, sizes, limits and the flag record
section: explanation
order: 5
description: How a flag's drawing is chosen and checked, what each set of flags weighs, what is not here, and every field of a flag's record.
---

## Flag sources

1. **Wikidata names each place's flag** (P41, flag image), a CC0 statement: the preferred one, with any that has
   ended left out. `scripts/data-config.ts` settles the few places where it leaves a choice, each with its reason.
   A former country's statements have all ended, so its Commons file is named there by hand and checked to be one
   of its Wikidata item's flag images.
2. **Wikimedia Commons has the drawing**, at the flag's true proportions, usually made from the government's
   construction sheet and cited on its page. `pnpm data:commons` downloads it, with its licence, author and
   licence templates, into `data-sources/`, checked by SHA-256.
3. **The flag sets are compared with it** (`pnpm data:choose`, in Chromium): flag-icons, country-flag-icons and
   circle-flags, all MIT. A set's drawing ships only where it is drawn at the flag's own proportions, draws the
   same flag (the same construction and colours, to 0.5% of pixels), and is at least 10% smaller, or is free where
   Commons' is not. On 2026-10-09 Commons' drawing won 462 times and country-flag-icons' once (Yemen, where
   Commons' file is marked CC BY-SA). Where a set draws a different design (an old flag, a local flag, a
   simplified emblem), the place was looked at and the verdict written down ([the comparison](../compared.md)).
4. **Each is optimised and checked** (`pnpm data`): SVGO 4, rounding measured per flag, ids prefixed, anything
   that could reach outside the picture refused, and `pnpm data:compare` proves every one draws within 0.1% of
   pixels of its source at 960 pixels wide.

Only drawings in the public domain, under CC0, under CC BY or under MIT are shipped. [The provenance list](../provenance.md)
lists every flag with its file, licence, author and why; [the left-out list](../left-out.md) the 35 codes with
no flag; [the decisions](../decisions.md) the judgement calls, including the four flags left out for their
licence, which of France's regions have a flag, Germany's and Austria's civil flags, and the places where the
sources disagree on the design, each with a recommendation, and [the variant list](../variants.md) every place's other flags in real use.

## Sizes

Measured on 2026-10-09, SVG as shipped and gzipped at level 9:

| Set | Flags | SVG | Gzipped | Median flag |
| --- | --- | --- | --- | --- |
| Hata, the countries | 238 pictures | 1,997 KB | 669 KB | 562 B |
| Hata, Japan's prefectures | 45 | 24 KB | 14 KB | 456 B |
| Hata, Canada's provinces and territories | 12 | 370 KB | 131 KB | 14 KB |
| Hata, the American states and areas | 50 pictures | 4,854 KB | 1,767 KB | 85 KB |
| Hata, Australia's states and territories | 8 | 124 KB | 38 KB | 11 KB |
| Hata, the United Kingdom's countries | 3 | 13 KB | 6 KB | 208 B |
| Hata, Germany's states | 16 | 228 KB | 79 KB | 312 B |
| Hata, France's regions (the overseas ones fly their country code's flag) | 3 pictures | 66 KB | 15 KB | 19 KB |
| Hata, Switzerland's cantons | 26 | 220 KB | 69 KB | 4 KB |
| Hata, Austria's states | 6 pictures | 1 KB | 1 KB | 171 B |
| Hata, Brazil's states | 27 | 510 KB | 145 KB | 935 B |
| Hata, the drawings made for a frame (flag-icons' 4:3 and square) | 425 | 2,792 KB | 935 KB | |
| flag-icons 7.5.0, 4:3 (a crop, not the true proportions) | 271 | 1,955 KB | 651 KB | 804 B |
| country-flag-icons 1.6.20, 3:2 (simplified) | 265 | 174 KB | 87 KB | 479 B |
| circle-flags 2.8.3 (round) | 430 | 301 KB | 159 KB | 585 B |

The countries weigh what flag-icons' do, at their true proportions. The American states are most of the package
because their flags carry full seals (Virginia's is 372 KB); 55 flags are over the 40 KB budget, and 12 drawings made for a frame,
listed in [the sizes list](../sizes.md). A page pays only for the flags it imports or loads.

## Limits

| Limit | Value | Where |
| --- | --- | --- |
| Countries | 246 of the 250 Kuni knows | `FLAG_CODES` |
| Subdivisions | the first level of Japan (45 of 47), Canada (13 of 13), the United States (57 of 57), Australia (8 of 8), the United Kingdom (3 of 4), Germany (16 of 16), France (17 of 26), Switzerland (26 of 26), Austria (9 of 9) and Brazil (27 of 27) | `FLAG_CODES` |
| Former countries | 12 flags, 10 more codes with a reason (Olympic teams, and two without one flag) | `FLAG_CODES`, `LEFT_OUT`, [the former countries list](../historical.md) |
| Codes with no flag | 35 codes, each with its reason | `LEFT_OUT`, [the left-out list](../left-out.md) |
| Licences | public domain, CC0, CC BY and MIT only | `manifest(code).licence` |
| Largest flag | 372 KB (Virginia); 55 over the 40 KB budget | [the sizes list](../sizes.md) |

Not here: other countries' regions (the reasons are in [the decisions](../decisions.md)), the United Kingdom's counties, cities, the earlier flags of the countries not yet researched, ensigns, standards and raster pictures. A flag's licence covers the drawing; using a country's flag or seal may still be limited by its law (Commons marks most flags "insignia"), which [the notice](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md) explains.

## A flag's record

```ts no-check
interface FlagRecord {
  code: string;                   // "JP-13"
  source: "commons" | "flag-icons" | "country-flag-icons";
  file: string;                   // "Flag of Tokyo Metropolis.svg", or the set's path: "3x2/YE.svg"
  page: string;                   // the Commons page, or the set's file on jsDelivr
  version: string | null;         // the set's version; null for Commons
  wikidata: string;               // "Q1490": the item whose flag image (P41) names the file
  licence: { kind: "public-domain" | "cc0" | "cc-by" | "mit"; name: string; url: string | null };
  author: string | null;          // as Commons gives it, or the set's copyright line
  credit: string | null;
  attributionRequired: boolean;
  restrictions: string[];         // ["insignia"]: limits apart from copyright, as Commons notes them
  templates: string[];            // the licence templates on the Commons page: ["PD-Japan-organization", …]
  uploaded: string | null;        // when Commons' current version was uploaded
  fetched: string;                // when the package read Wikidata and Commons
  reference: { file: string; page: string; licence: string } | null;  // Commons' file, where a set's drawing won
  why: string;                    // why this drawing, in a sentence or two
  sameAs: string | null;          // "FR" for Guadeloupe: the flag whose picture this is
  width: number;                  // the viewBox: width / height is the flag's proportions
  height: number;
  bytes: number;                  // the SVG's size
  gzip: number;
  notes: string[];                // text drawn with a font, an embedded raster picture
  colours: { hex: string; share: number; name: string }[];  // "#bc002d", 0.1884, "red": measured from the drawing
  tags: { tag: string; source: string; from: string }[];  // docs/tags.md
  framings: Record<"4:3" | "1:1" | "round", Framing>;  // how each frame is made, and which crop: the `Framing` type
}
```

Every function is pure and every record it hands out is frozen. See also [retain source and licence metadata](provenance.md).
