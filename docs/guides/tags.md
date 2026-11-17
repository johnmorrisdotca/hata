---
title: Find flags by what is on them
section: how-to
order: 20
description: Read each flag's tags (stripes, stars, a cross, an emblem) with the source of each, and list the flags that have the tags you name.
---

Each flag has tags from a closed list, such as `stripes-horizontal`, `stars`, `cross` or `emblem`, kept with the colours in `@johnmorrisdotca/hata/search`. `tagsOf(code)` gives a flag's tags, and each one says where it comes from, so a page can tell a checked fact from a guess.

```mjs
import { FLAG_TAGS, flagsWith, tagsOf } from "@johnmorrisdotca/hata/search";

// Germany is three bands across and nothing else: measured from the drawing.
console.log(tagsOf("DE"));
// The flags Wikidata says carry a Nordic cross.
console.log(flagsWith({ tags: ["nordic-cross"] }).includes("DK"));
// Only what was measured or checked by a person: the guesses are left out.
console.log(flagsWith({ tags: ["stripes-vertical"], sources: ["reviewed", "computed"] }).includes("FR"));
// Every tag a flag can have, for a row of chips.
console.log(FLAG_TAGS.length);
```

## Where a tag comes from

- `computed`: measured from the drawing by a rule with no judgement in it. The whole flag is bands across or down, or one colour.
- `wikidata`: the flag's item on Wikidata says it depicts a thing of that kind: a five-pointed star, a coat of arms, a Nordic cross.
- `unreviewed`: an automated guess that nobody has checked: a category of the drawing's file on Wikimedia Commons, the same bands at both edges of the flag, or a great many colours.
- `reviewed`: a person looked at the flag and said so.

Nothing automated passes as checked. Show an `unreviewed` tag as a guess, or leave it out with `sources`. A flag with no tag yet has an empty list, which does not say that it is plain: the tags are filled in as flags are reviewed, the countries first.

## Where to read more

`manifest(code).tags` has the same tags with what each one rests on (the measure, the Wikidata statement or the Commons category), and [the list of every flag's tags](https://github.com/johnmorrisdotca/hata/blob/main/docs/tags.md) says when each tag applies. `flagsWith` takes colours and tags together; see [find flags by their colours](colours.md).
