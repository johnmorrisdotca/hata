# Decisions, and the ones left for the maintainer

Written by hand, beside the lists `pnpm data` makes ([left-out.md](left-out.md), [compared.md](compared.md),
[provenance.md](provenance.md), [sizes.md](sizes.md)). Each section says what was decided, why, and what would
change it. The ones marked **for the maintainer** are not decided: the package ships the conservative answer until
somebody does, and each is one line in `scripts/data-config.ts`.

## How a flag is chosen

1. **The place's flag is the one Wikidata names** (P41, flag image): its preferred statement, with any statement
   that has an end left out. Where Wikidata leaves a choice, `CHOSEN` and `ITEM` in `scripts/data-config.ts`
   settle it, with the reason written there.
2. **Commons' drawing of it is the reference.** Commons draws a flag at its true proportions, usually from the
   government's construction sheet, which its page cites.
3. **A flag set's drawing may ship instead** (flag-icons, country-flag-icons; circle-flags never, because a circle
   is a framing), but only where it is drawn at the flag's own proportions, draws the same flag (no more than 0.5%
   of pixels differ at 480 pixels wide, no colour channel off by more than 32), and is at least 10% smaller, or is
   free where Commons' file is not. `scripts/choose.mjs` applies these rules in Chromium and writes its reasons
   into each flag's manifest entry.
4. **Nothing is redrawn.** The shipped SVG is the chosen drawing optimised, and `pnpm data:compare` proves every one
   draws within 0.1% of pixels of its source at 960 pixels wide.

On 2026-10-09 that gave 357 drawings from Commons and one from country-flag-icons. No set drawing was both the
same flag and 10% smaller: Commons' simple flags already optimise to a couple of hundred bytes, and where a set's
drawing is smaller it is because it is simplified (a smaller emblem, a disc of the wrong size, another shade),
which is not the same flag. Japan is the example: country-flag-icons' disc is 0.56 of the height where the law
says 0.6.

## Yemen: a flag set's drawing, because Commons' file is marked CC BY-SA

Commons' machine-readable licence for *Flag of Yemen.svg* reads CC BY-SA 4.0, though the page's own permission
field says `{{PD-Yemen}}{{PD-ineligible}}` and carries no Creative Commons template. country-flag-icons draws the
same three bands at the same 2:3, under MIT, so it ships, and the manifest says why. A tricolour is not
copyrightable anyway; the choice only keeps the package's licensing simple.

## For the maintainer: six flags left out for their licence

Each is on Commons under a licence that is not public domain, CC0 or CC BY, and no MIT set draws it at its true
proportions. Bringing one in is a line in `ACCEPTED` in `scripts/data-config.ts`, with the decision in words.

| Code | Place | What Commons states | Recommendation |
| --- | --- | --- | --- |
| `US-MS` | Mississippi | "Copyrighted free use": the holder allows any use for any purpose, with no condition | **Accept.** It is freer than CC BY; it was left out only because it is not one of the three named licences. |
| `OM` | Oman | Open Government Licence – Oman 1.0, attribution required | **Accept with credit**, once someone has read the licence's terms (oman.om); it is meant to work like CC BY. |
| `JP-34` | Hiroshima | No licence template at all: the page carries only `{{Insignia}}` | **Fix at the source**: the drawing is a 1966 prefectural emblem, like the 44 others that Commons marks PD-Japan-organization or PD-ineligible. A licence template added on Commons brings it in with the next `pnpm data:commons`. |
| `CA-MB` | Manitoba | CC BY-SA 4.0 (a drawing from the Canadian Heraldic Authority's register) | **Leave out**, or name a public-domain drawing of the same flag on Commons if one is made. Share-alike would bind every user of the package. |
| `CC` | Cocos (Keeling) Islands | CC BY-SA 4.0 | **Leave out**, as Manitoba. |
| `JP-37` | Kagawa | CC BY-SA 3.0 and GFDL, with the note "If you will use this file, you must get Kagawa Prefecture approval" | **Leave out.** |

## For the maintainer: places where the sources show different flags

`pnpm data:choose` compares every set's drawing with Commons' and lists where they differ in design; each was
looked at side by side (`pnpm data:sheet <out.png> --compared`) and the verdicts are in `REVIEWED`. Most are the
same flag drawn simplified or laid out again at another shape. These are not:

- **Afghanistan (AF).** Wikidata's preferred flag, since 2021-08-15, is the Taliban's white flag with the
  shahada; every flag set draws the Islamic Republic's black, red and green tricolour, which is still the flag
  at the United Nations. The package ships Wikidata's. Choosing the tricolour is `CHOSEN` with a reason.
- **Saint Helena, Ascension and Tristan da Cunha (SH).** Wikidata gives the Union Flag, the territory's
  official flag as a whole; the sets draw Saint Helena's own blue ensign. The package ships the Union Flag.
- **The French overseas territories.** Wikidata is not consistent: it gives France's tricolour for Guadeloupe
  (chosen here, `CHOSEN`), Réunion, French Guiana and Saint Martin, and a local flag for Saint Barthélemy,
  Saint-Pierre and Miquelon, Wallis and Futuna, Mayotte and Martinique. For New Caledonia it gives the FLNKS
  (Kanak) flag, which has flown beside France's there since 2010. The sets disagree among themselves too.
  The package ships Wikidata's answer for each. One rule for all (France's flag everywhere, as the official
  flag; or the local flag wherever there is one) would be a handful of `CHOSEN` lines.
- **Caribbean Netherlands (BQ)** has no flag of its own: Bonaire, Sint Eustatius and Saba each have one, and
  the Netherlands' is the official flag. flag-icons draws the Netherlands', country-flag-icons Bonaire's. The
  package ships none. (Wikidata's other item with the code BQ is the British Antarctic Territory, which had it
  until 1979; `ITEM` keeps that one out.)
- **Antarctica (AQ)** has no official flag. Wikidata's flag for the code is the Antarctic Treaty's (CC BY-SA on
  Commons), on another item; the package ships none.
- **Western Sahara (EH).** Wikidata gives the territory no flag. flag-icons draws the Sahrawi Arab Democratic
  Republic's, which is one claimant's flag. The package ships none.

## The size budget

A flag's budget is 40 KB of SVG, and no flag may be over 400 KB. 47 flags are over the budget, all of them
because they carry a detailed coat of arms or seal drawn as it is: most of the American states (Virginia 372 KB,
New York, Pennsylvania, Idaho, Louisiana, Florida, Vermont, West Virginia), Prince Edward Island, and countries
with full arms (El Salvador, Ecuador, Spain, Mexico, the Falklands, the Vatican, Haiti). They are shipped, because
a simplified seal is not the state's flag; [sizes.md](sizes.md) lists them and the size test holds the list, so a
new one is noticed. A page pays only for the flags it imports or loads.

## Rounding, and the plugins left off

SVGO's `convertTransform` is off: on Niue's flag it moved the stars off the Union Jack. Every drawing is rounded
to the fewest decimals at which it still draws within 0.1% of pixels of its source at 960 pixels wide, measured by
`pnpm data:choose`, because a flag drawn inside a scaled group (Iran's emblem, Fukuoka's mark) needs more decimals
than its viewBox suggests. One drawing, the Northwest Territories', keeps its path data as drawn, because
`convertPathData` changes it visibly at any precision.
