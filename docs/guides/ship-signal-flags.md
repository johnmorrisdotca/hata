---
title: Ship signal flags
section: how-to
order: 25
description: Draw the flags of the International Code of Signals (letters, numeral pennants, substitutes and the answering pennant) and the US Navy's special pennants from their own entry point, with their meanings in English and Japanese.
---

The flags a ship flies to spell a word or send a signal are the International Code of Signals' 26 alphabet flags, 10 numeral pennants, 3 substitutes and the answering pennant. They are their own import, `@johnmorrisdotca/hata/signals`, so a page that draws countries only does not download them. An id is `ics:` and a lower-case slug: `ics:a` to `ics:z`, `ics:0` to `ics:9`, `ics:sub-1` to `ics:sub-3` and `ics:answer`. 18 of the US Navy's special pennants (Turn, Corpen, Speed, Station, Formation and the rest) are in the same entry as a group of their own, `tactical`: an id is `usn:` and a lower-case slug, `usn:turn`, `usn:corpen`, `usn:substitute-4`. The Navy's numeral pennants are the Code's own, `ics:0` to `ics:9`. No country's or region's code contains a colon, so a signal can never take the place of one, and `isFlagCode("ics:a")` is false.

```mjs
import { frame } from "@johnmorrisdotca/hata";
import { signalFlag, signalMeaning, signalsFor } from "@johnmorrisdotca/hata/signals";

// A hoist that spells a word: one flag a letter, each an SVG string framed like a country's; its id begins with "ics:".
const hoist = signalsFor("SOS 7");
const first = await signalFlag(hoist[0] ?? "");
const round = frame(first ?? "", { shape: "round", label: "S" });
console.log(hoist.join(" "), round?.includes("clipPath"));
console.log(signalMeaning("ics:o"), signalMeaning("ics:o", "ja"));
```

`signalFlag(id)` loads the SVG string (a promise), `signalName(id, lang)` the name ("A: Alfa", "A旗（アルファ）"), `signalMeaning(id, lang)` what the flag means or does, `signalAspect(id)` the width over the height, `signalInfo(id)` everything the package knows of it, and `signalsFor(text)` the flags that spell a text. `signalId("a")` reads an id written loosely and answers `"ics:a"`, and `SIGNAL_IDS` lists them all: the Code's 40 in the order of its plate, then 18 of the Navy's special pennants. Each returns `null` for an id the Code does not have.

## Size, and loading one drawing

The entry carries the records only: the ids, names, descriptions, dates, sources and notes, about 91 KB (8.6 KB gzipped), with no drawing in it. Each drawing is a module of its own, `@johnmorrisdotca/hata/signals/a` (a median of 324 B, at most 500 B), which the lookup loads by a dynamic import when it is asked for, as `/load` does for a country's flag. A page therefore carries the drawings it asks for and no others. You can import a module yourself (`import svg from "@johnmorrisdotca/hata/signals/a"`, the drawing of `ics:a`); there is no other way to a drawing than its id or its module.

## Where the drawings come from

Each flag is drawn for this package, under the MIT licence, as geometry written out in `scripts/draw-signals.ts` (run `pnpm draw` to make `src/sets/signals.data.ts` from it); nothing is traced or copied from a picture. The specification is the Code itself: Pub. 102, the United States edition of 1969 (revised 2003), a work of the United States Government with no copyright claimed. Its plate shows every flag and pennant, and its text names the five colours (red, yellow, blue, black, white) and gives the meaning of each single-letter signal. The meanings in English are the Code's own words.

The Code gives no construction sheet and no measurements, so the designs follow the plate and the proportions were measured from it and rounded: a letter flag is 6 long to 5 high, A and B are swallow-tailed with the notch a third of the length deep, a numeral pennant is 7 long to 2 high at the hoist and tapers to 0.38 of that at the fly, a substitute is a triangle 3 long to 2 high, and the answering pennant is 3 long to 1 high. The values of the colours are this package's, because the Code names the colours and gives no values. Other drawings of the same flags differ slightly in these proportions; every record says so in its `note`.

The 18 special pennants of the Navy that are here are the other kind: Wikimedia Commons files, taken as the country flags are, each public domain and by Carl Lindberg, who drew them "per the U.S. Navy specification" (the file pages call them ineligible for copyright, being plain geometry). The file's licence is read from Commons, the drawing is optimised as a country's flag is, and its page, licence and author are in the record (`signalInfo("usn:turn")?.source`) and in `NOTICE.md`. Their meanings follow, in general terms, the Navy's Signalman training manual, NAVEDTRA 14244 (navyaviation.tpub.com/14244: "Basic Maneuvering Flags", "Substitutes" and "Correcting a Signal"), and the Royal Canadian Navy's visual signalling page (jproc.ca/rrp/rrp2/visual_flags.html), which gives the Preparative, Designation, Interrogative, Emergency and Subdivision pennants their uses; Joseph McMillan's "Signal Flags" page on Sea Flags and Wikipedia's "Naval flag signalling" were read for the names. Numerals of fewer than three digits count in tens of degrees, so "Turn, Starboard, 15" is a turn together of 150 degrees; three digits give the course to steady on. The Navy's own signal books are the authority at sea. Not here: the Port, Division, Squadron and Flotilla pennants, which are the Navy's too but have no public-domain file on Commons, and the allied (NATO) set of ACP 129 where it differs from the Navy's.

The flags are for signalling and for pictures of it. A flag's meaning at sea is the Code's, and this package does not replace the Code for a ship that signals. Continue with [codes and names](codes-and-names.md).
