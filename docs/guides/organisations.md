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

`organisationFlag(id)` gives the SVG string, `organisationName(id, lang)` the name in English or Japanese, `organisationAspect(id)` the width over the height, and `organisationTerms(id)` the page where the terms for the flag were read, the day, and what they say. `organisationId("EU")` reads an id written loosely and answers `"org:eu"`; `ORGANISATION_IDS` lists them all. Each returns `null` for an id with no flag here.

## Which organisations are here

A body's flag is here only where the terms for its flag or emblem let a package under the MIT licence carry it, and each drawing is made from the body's published description, never copied. Today that is the European Union. The bodies left out, with the reason and the page read, are listed in [NOTICE.md](https://github.com/johnmorrisdotca/hata/blob/main/NOTICE.md); a flag's use can still be limited by the law of a country, as for any flag. Continue with [codes and names](codes-and-names.md).
