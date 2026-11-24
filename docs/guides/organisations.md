---
title: Use the flags of international organisations
section: how-to
order: 7
description: Draw an organisation's flag from its own entry point, with an id that is never a country code.
---

The flags of international organisations are their own import, `@johnmorrisdotca/hata/organisations`, so a page that draws countries only does not download them. An organisation's id is `org:` and a lower-case slug, such as `org:eu`. A country's or region's code never contains a colon, so an organisation can never take the place of one, and `isFlagCode("org:eu")` is false. The ids of flags a page registers itself will begin `custom:`, a namespace of their own for the same reason.

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { organisationFlag, organisationName } from "@johnmorrisdotca/hata/organisations";

// An organisation's flag is an SVG string, framed like a country's; its id begins with "org:".
const svg = organisationFlag("org:eu");
const round = svg === null ? "" : frame(svg, { shape: "round", label: organisationName("org:eu", "ja") ?? "" });
console.log(svg?.startsWith("<svg"), round.includes("clipPath"), organisationName("org:eu", "ja"));
```

`organisationFlag(id)` gives the SVG string (at once, for the European Union, whose drawing the entry holds; `null` for a body whose drawing is a module of its own) and `loadOrganisationFlag(id)` loads any body's (a promise), `organisationName(id, lang)` the name in English or Japanese, `organisationAspect(id)` the width over the height, and `organisationTerms(id)` the page where the terms for the flag were read, the day, and what they say. `organisationId("EU")` reads an id written loosely and answers `"org:eu"`; `ORGANISATION_IDS` lists them all. Each returns `null` for an id with no flag here.

## Size, and loading one drawing

The entry carries the records and the European Union's drawing (about 7 KB, 2.5 KB gzipped); the drawings of the bodies taken from Commons are modules of their own, `@johnmorrisdotca/hata/organisations/<slug>` (a median of 885 B, at most 40 KB), which `loadOrganisationFlag(id)` loads by a dynamic import when it is asked for, as `/load` does for a country's flag, so a page carries the drawings it asks for and no others. You can import a module yourself (`import svg from "@johnmorrisdotca/hata/organisations/caricom"`). `organisationFlag(id)` is synchronous as it always was, and answers for the drawing the entry holds.

## Which organisations are here

The European Union's flag is drawn for this package from the Union's own description, under its terms. Six more are Wikimedia Commons drawings in the public domain or CC0, read through the licence check and optimised as a country's flag is: CARICOM, the League of Arab States, the Commonwealth of Independent States, the Commonwealth of Nations, the Andean Community and the Organisation of Islamic Cooperation (its flag of 1981 to 2011). They are here because the body's own page states no terms for its flag or emblem, which is not a licence: each record says that no terms were found, with the page and the day read (`organisationTerms(id)`), and `organisationSource(id)` gives the Commons file, page, licence and author. A body whose own terms or law restrict its flag or emblem is never here, whatever the licence of a drawing: the United Nations, NATO, the Red Cross and Red Crescent, the African Union, ASEAN, the Nordic Council and the Olympic rings. A flag's use can still be limited by the law of a country, as for any flag. The bodies left out, with the reason, the page read and what it said on each day, are listed in [NOTICE.md](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md), and the rule is in [decisions](../decisions.md). Continue with [codes and names](codes-and-names.md).
