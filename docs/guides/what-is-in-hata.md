---
title: What is in Hata
section: explanation
order: 4
description: Why Hata exists, what the 479 flags are, and what each part of the package promises.
---

## Why Hata

Hata is the flag set a site that already knows its countries and regions by ISO code (from [Kuni](https://github.com/johnmorrisdotca/kuni), say) can show beside them: 479 flags, every one drawn at the proportions its government gives it, as an SVG that scales to any size and looks the same on every system, which a flag emoji does not (Windows shows two letters). No other flag set has Japan's prefectures, all of Canada's provinces and territories, Germany's and Austria's states, Switzerland's cantons and Brazil's states together, or codes that match ISO 3166-2. Each flag is a module of its own, so a page carries only the flags it imports; one lookup loads any flag by its code when it is wanted. And every flag says where it comes from: the Wikimedia Commons file or the flag set it was drawn from, its author, its licence, and why that drawing was chosen. It works in [the demo](https://johnmorrisdotca.github.io/hata/) with nothing to install.

## What is in it

- **479 flags**: 246 of the 250 countries Kuni knows, 45 of Japan's 47 prefectures,
  13 of Canada's 13 provinces and territories, 57 of the United States' 57 states, district and outlying areas,
  8 of Australia's 8 states and territories, 3 of the United Kingdom's 4 countries, 16 of Germany's 16 states,
  17 of France's 26 regions and overseas collectivities, 26 of Switzerland's 26 cantons, 9 of Austria's 9 states
  and 27 of Brazil's 27 states and Federal District, and 12 former countries that a medal table or a record book
  still names (the Soviet Union, East and West Germany, Czechoslovakia, Yugoslavia, Serbia and Montenegro, and
  six more: see [disputed, former and historic flags](places-with-more-than-one-flag.md)). The 26 codes with no flag are listed with their reasons.
- **Disputed and alternative flags, offered side by side.** A place with more than one flag in real use has them all,
  each with a status (official, de facto, historical or local), dates, the reason it is offered and a source, and a
  `disputed` mark where more than one authority claims the place's flag: Afghanistan's Republic tricolour and the
  Taliban's flag, Bavaria's lozenges and stripes, Northern Ireland's Union Flag and former Ulster Banner, Syria's
  flag before and after 2024-12-08, and each French territory's local flag. Hata takes no side
  and says why each default was chosen ([disputed and alternative flags](places-with-more-than-one-flag.md#disputed-and-alternative-flags)).
- **True proportions.** Japan's 2:3, Canada's 1:2, the United States' 10:19, Switzerland's square, Nepal's two
  pennants: each flag is shipped as its government draws it, and `frame()` puts it in a 4:3, square or round frame
  when that is what a layout needs, never stretched.
- **Frames that keep the flag, whole and cropped.** A crop from the centre would turn Canada's square into a white square
  with a leaf, so every flag is offered both ways, `fit: "whole"` and `fit: "crop"`, and `auto` takes the crop only where it
  shows the flag fairly: kept at the side a person chose for 121 flags (the United States' canton, Uruguay's Sun of May), from
  the centre where that keeps every colour, and the whole flag otherwise. The manifest says which, and why ([frames](frames-whole-and-cropped.md)).
- **Embed it anywhere.** `<hata-flag>`, a custom element named for a screen reader in the page's language, an
  iframe page, and a builder in the demo that writes the code for an element, an `<img>`, an iframe, an ES module,
  React, Vue, Svelte or Angular ([the element, the iframe and the builder](embed-element-and-builder.md)).
- **The best accurate drawing.** Each flag's Commons drawing (the one Wikidata names) is compared in a browser with flag-icons',
  country-flag-icons' and circle-flags'; a set's drawing ships only where it is the same flag at the same proportions and smaller,
  or free where Commons' is not. Nothing is redrawn, and every shipped flag is proved to draw as its source does.
- **Safe to inline.** Scripts, event handlers, foreign objects and outside references are refused at build time, and every id and class
  carries the flag's own prefix, so two flags in one page cannot collide.
- **Small where it matters.** The main entry is 12 KB (3.7 KB gzipped) and carries no flag; the median flag is
  under 800 bytes; the lookup is 25 KB and then the flag's own file.
- **Provenance for every flag**, in `/manifest` and `manifest.json`: the file, its page, the Wikidata item, the
  licence, the author, the restrictions, and the dates.
- **Typed, documented, pure.** ESM with types; every export has a checked example; no dependencies, no network, no DOM.
