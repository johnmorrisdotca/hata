---
title: Bring your own flags
section: how-to
order: 8
description: Register a team's, a club's or a company's flags from the page, checked, prefixed and drawn like the built-in ones.
---

A page can register flags of its own (a team, a club, a company, a mark it has the right to show) and draw them through the same calls, element and lookup as the built-in flags. The package ships none, bundles none and sends nothing: `@johnmorrisdotca/hata/custom` is a separate entry, loaded by `flag()` and `<hata-flag>` only when a code begins `custom:`, so a page with no custom flags downloads none of it.

It follows the family's data door, as hoshi-stars does. You hand over a set: a source that says whose it is (an id, names and a credit in English and Japanese, a licence with its link, a page, the day) and gives the flags as records. A set that is not allowed (an empty credit, no licence, a bad id, an id already registered) is refused at once with a `TypeError`.

```mjs
import { customCreditLine, registerFlags } from "@johnmorrisdotca/hata/custom";
import { flag } from "@johnmorrisdotca/hata/load";

// A page's own flag: a set that says whose it is, and records of an id (custom:...), names and an SVG.
const club = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><path fill="#036" d="M0 0h3v2H0z"/><circle cx="1.5" cy="1" r=".5" fill="#fc0"/></svg>';
const done = await registerFlags({
  kind: "records",
  info: {
    id: "harbour",
    name: { en: "Harbour FC", ja: "ハーバーFC" },
    credit: { en: "Harbour FC crest, drawn by the club", ja: "ハーバーFCの紋章（クラブ作成）" },
    licence: { name: "Used with the club's permission", url: "https://example.org/permission" },
    url: "https://example.org/club",
    retrieved: "2026-11-13",
  },
  records: () => [{ id: "custom:harbour-fc", name: { en: "Harbour FC", ja: "ハーバーFC" }, svg: club, group: "Clubs" }],
});
// It is drawn through the same call as a country's.
console.log(done.added.join(), (await flag("custom:harbour-fc", { shape: "round" }))?.includes("clipPath"), customCreditLine("en"));
```

## Ids

A custom flag's id is `custom:` and a slug: lower-case letters, digits and hyphens, up to 48. The colon is in no ISO 3166 code, so a custom flag can never shadow a country, a region or a former country, and `org:` is the namespace of the [organisations'](organisations.md) flags, so it can never shadow one of those either. A record whose id is anything else is left out with the reason. An id already held by another set is left out and the first set keeps it; a set id registered twice is refused. `removeFlags(id)` takes a set out (and its id can be used again), `enableFlags(id, false)` hides it.

## What is checked

Every SVG is read by a strict reader into a tree, held to an allowlist, and written again from what was read, so what is drawn is exactly what passed. Nothing is cleaned: a record that holds anything not allowed is left out, listed in `rejected` with its reason, and never drawn.

- Elements: `svg g defs symbol path rect circle ellipse line polyline polygon use linearGradient radialGradient stop clipPath mask title desc`. No script, style, image, link, animation, filter, text or `foreignObject`, and no prefixed name.
- Attributes: the usual drawing ones, each read by its own rule. No event handler, `style` or `class`. `xmlns` is exactly the SVG namespace and `xmlns:xlink` exactly the XLink one.
- References: `href` and `url()` only as `#id` of an element in the same file, in any case or spacing; one that points anywhere else, or at an id that is not there, is refused. No `data:` or `javascript:`.
- Text: no character reference (`&#106;`, `&#x6a;`: refused, not decoded); in a title or a description only `&amp; &lt; &gt; &quot; &apos;`, written back escaped, and only text (no element inside one). No control character, line separator or direction override in a title, a description or a name.
- Limits: 64 KiB, 32 levels, 4,000 elements with each `<use>`, gradient `href`, `clip-path` and `mask` counted as what it points to (a loop of them is refused), 1,000 flags a page. A viewBox, and no width or height, on the root.
- Ids inside become `custom-<slug>--<id>` (letters, digits, underscores and hyphens), so two flags on one page cannot collide, whatever their slugs and ids.
- Names, groups and the credit are text, not markup: escape them if you write them into HTML. The registry is one per page (or per server process): on a server register once at start-up, never per request, or one visitor's flags are every visitor's.

## Look them up

`customFlag(id)`, `customName(id, lang)` and `customAspect(id)` answer like `flag`, `flagName` and `flagAspect`; `listCustomFlags({ group })`, `customGroups()` and `searchCustomFlags(query)` list and search them by group (`"custom"` unless the record names one), for a picker that shows them beside the built-in flags; `customCreditLine("en" | "ja")` writes whose flags are on the page, with the licence beside each. Nothing registered is kept after the page closes. Continue with [codes and names](codes-and-names.md).
