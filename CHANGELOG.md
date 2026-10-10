# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.5.0] - 2026-10-10

### Added

- **Brittany's flag** (`FR-BRE`, 465 flags in all, 17 of France's 26 regions): the Gwenn-ha-du, from Commons' public-domain
  drawing "Flag of Brittany (Gwenn ha du).svg" (Open Clip Art Library; PD-OpenClipart, CC0, PD-old and PD-France), not the CC BY-SA
  file Wikidata names, which `NAMED` now replaces. It is the default and the only variant of `FR-BRE`, with the status `local`
  (`variantsOf("FR-BRE")`): the flag in real use across the region, though the Région Bretagne's official symbol is a logo. Its
  square, 4:3 and round frames keep the ermine canton at the hoist (`FOCUS`). The demo shows its status and reason in the panel.

### Changed

- **Brittany is no longer on the list of flags left out for their licence**: 18 codes have no flag (was 19), and
  `docs/decisions.md` lists five flags left out for their licence (was six), with Brittany's decision dated 2026-10-10.
- **The README's pictures are re-taken** (`docs/images`): the gallery's count (465 of 465 flags) and the Markdown and SQL list buttons were out of date
  in the hero, and `pnpm screenshots:readme` stopped at the detail picture because two frames matched one selector; it waits on the first.

## [1.4.0] - 2026-10-09

### Added

- **The demo's list of flags also downloads as a Markdown table and as SQL**, beside the TXT list: the flags shown, with their code, names, source, licence and file. The Markdown is a GitHub table (`|` escaped, a line break `<br>`); the SQL is a `CREATE TABLE flags` and an `INSERT` a row, with double-quoted names, single-quoted text and NULL for what is missing, and runs in SQLite, PostgreSQL and MySQL (MySQL needs `ANSI_QUOTES` and `NO_BACKSLASH_ESCAPES`, which the file's second line says). The writers are `demo/downloads.js`, the same file in kuni, chizu and hata, held to one hash and tested by loading the SQL into SQLite.

## [1.3.0] - 2026-10-09

### Added

- **Disputed and alternative flags.** A place with more than one flag in real use has them all as variants, each with a
  `status` (`official`, `de-facto`, `historical` or `local`), `from` and `until`, a `why`, a `source` and its Commons
  drawing, one marked the default, and a `disputed` mark on the place where more than one authority claims its flag.
  Hata takes no side; `docs/variants.md` lists them and `docs/decisions.md` says why each default was chosen.
  - `variantsOf(code)` from `/manifest`, and the type `Variant`; `FlagRecord` and `LeftOutRecord` gain `disputed`,
    `defaultVariant` and `variants`.
  - `flag(code, { variant })` and `flagDataUri` from `/load` (the new type `FlagOptions`), `<hata-flag variant="…">`, and a
    module and an SVG file for each variant: `/flags/af--de-facto`, `svg/af--de-facto.svg`. A variant is loaded from its own
    table, so `/load` stays small.
  - Offered: Afghanistan (the Islamic Republic's tricolour, the Taliban's flag), Saint Helena (its own flag, the Union
    Flag), Bavaria (lozenges, stripes), Northern Ireland (the Union Flag, the former Ulster Banner), Syria (the flag since
    2024-12-08, the Assad-era flag), New Caledonia and French Polynesia (their own flag, France's), and the local flag of
    Guadeloupe, Martinique, French Guiana, Réunion, Mayotte, Saint-Barthélemy, Saint-Pierre and Miquelon and Wallis and
    Futuna beside France's.
  - The demo: a "disputed" mark on the card, a switch between a place's flags in its panel with the status, dates, reason
    and source of the one shown, Northern Ireland's flags from the list of places with no flag, and a `variant` field in the
    embed builder. The Japanese is not yet read by a native reader.
- **Mississippi's flag** (`US-MS`, 464 flags in all), under Commons' "Copyrighted free use" licence, accepted by decision
  (`ACCEPTED`); its licence kind in the manifest is `accepted`.

### Changed

- **Afghanistan's flag is the Islamic Republic's black, red and green tricolour**, as every flag set draws it and as it is
  still at the United Nations; Wikidata's preferred flag, the Taliban's, is the `de-facto` variant.
- **Saint Helena's flag is the island's own blue ensign**, not the Union Flag, which is its `union-flag` variant.
- **Each French territory's flag is its official flag, else France's.** Martinique, Mayotte, Saint-Barthélemy,
  Saint-Pierre and Miquelon and Wallis and Futuna now give France's tricolour, with the local flag they gave before as
  their `local` variant; Guadeloupe, French Guiana, Réunion and Saint-Martin already gave France's, with a `local` variant
  for the first three. New Caledonia keeps the Kanak flag and French Polynesia its own, with France's as a variant.
- `pnpm data` stops at its end, naming what to measure, when a picture has no line in `scripts/framings.data.json`,
  where it used to stop at the first.

### Left out, on purpose

- **Oman's flag**, again: the Open Government Licence – Oman 1.0 was read (2026-10-09) and does not cover an official government
  emblem, and the drawing came from another site than the one the licence covers. Manitoba, Kagawa, Cocos and Brittany
  stay out as John asked; Hiroshima waits for a licence tag on Commons. Northern Ireland has no default flag, as before.

## [1.2.0] - 2026-10-09

### Added

- **Every flag is offered whole and cropped.** `fit: "whole"` shows all of the flag (the same as `contain`) and
  `fit: "crop"` crops it at the side a person chose for that flag, not at the middle. `fit: "auto"`, the default,
  takes the crop where it shows the flag fairly and the whole flag where it does not. `frame()`, `flag()` and
  `<hata-flag fit="…">` take both. The sides a crop can be kept at are `left` (the hoist), `right` (the fly), `top`,
  `bottom` and `centre`.
- **121 flags have a side chosen by hand** (`FOCUS` in `scripts/data-config.ts`, each with its reason, listed in
  `docs/framing.md`): the United States, Uruguay, Chile, Taiwan and the other flags with a canton at the hoist,
  and the American states with one, kept at the left so that the emblem and a slice of the stripes show; Cuba,
  the Czech Republic, Bahrain and the other flags with a triangle or a serrated edge at the hoist; the Nordic
  crosses, set towards the hoist; Rwanda and Zambia at the fly. 37 more (the Blue Ensigns, Alaska, Sri Lanka, Qatar
  and others whose meaning is spread across the flag) are shown whole by default, because no square crop holds them.
- **`crop` in every manifest `framings` record**, and the type `FramingCrop`: which crop `auto` uses (`own`,
  `curated`, `centre` or `whole`), the side (`at`), the reason (`why`) and the colours the crop drops (`loses`).
- **The demo** shows the whole flag beside its crop at 4:3, square and round in the flag's panel, each labelled with
  how it was made and which is the default; the gallery has a Best / Whole / Cropped switch for the framed shapes;
  and the embed builder offers `fit`. A browser test draws every chosen crop and checks it is the flag cut at the
  side `FOCUS` names.

### Changed

- **A crop of a flag with a side chosen for it is kept there by default**: `frame(usa, { shape: "1:1" })` is the canton
  and a slice of the stripes, where 1.1.0 gave the middle stripes. A crop that drops a colour covering 5% of the flag
  is the default only where the reason beside the flag says why (nine flags: the Bahamas, Eritrea, Guinea-Bissau,
  Jordan, Malta, Namibia, the Solomon Islands, Seychelles and South Sudan); otherwise the flag is shown whole. The 37
  flags judged to have no good square crop (the Blue Ensigns among them) are now shown whole by `auto`, where 1.1.0
  gave a centre crop that showed half of each.
- **`Fit`** gains `whole` and `crop`; `hoist` and `cover` are unchanged. `Framing.method` can be `crop` (no longer
  `hoist`, which was never produced) and `Framing.fit` can be `crop`.
- The main entry is 11 KB (3.9 KB gzipped), from 10 KB, for the table of sides.

## [1.1.0] - 2026-10-09

### Added

- **105 more flags, 463 in all**: the first level of seven more countries, each whole (every code Kuni 1.1.0
  gives it has a flag or a reason). Australia's 8 states and territories; the United Kingdom's England, Scotland
  and Wales (Northern Ireland has no flag of its own); Germany's 16 states, each its civil flag (Bavaria's
  lozenges); France's Corsica, Nouvelle-Aquitaine and Normandy, and its 13 overseas codes, which fly their
  country code's flag (nine regions use a logo, and Brittany's drawing is CC BY-SA); Switzerland's 26 cantons;
  Austria's 9 states, each its civil flag; and Brazil's 26 states and Federal District. Spain, Italy, Mexico and
  India wait, for the reasons in `docs/decisions.md`.
- **`<hata-flag>`**, a custom element (`@johnmorrisdotca/hata/element`, and `/element/define` or
  `dist/element-define.js` to register it): `code`, `shape`, `size`, `fit`, `label`, `lang`, `theme`, `border`,
  `shadow` and `loading`; named for a screen reader from Kuni's names in the page's language; lazy; `hata-load`
  and `hata-error` events; a code with no flag draws nothing and warns once. The family's conventions, from
  Kyuubu's `<kyuubu-cube>`.
- **`embed.html`** in the demo: one flag for an iframe, from the same attributes in its address.
- **`@johnmorrisdotca/hata/names`**: `flagName(code, lang)` and `flagAspect(code)`.
- **Drawings made for a frame**: flag-icons' 4:3 and square drawings of 212 and 213 flags, as
  `/flags/<code>.4x3` and `.1x1` and `svg/<code>.4x3.svg` and `.1x1.svg`, used by `flag(code, { shape })`.
- **`framings` in every manifest record**, and the type `Framing`: how each frame is made, and what a centre crop
  would lose.
- The demo: the new countries in the gallery's set list (now a menu) and the quiz (Australia's, Brazil's,
  Germany's and Switzerland's regions, and Europe's together), the frames each say how they were made, and
  **Embed this flag**, a builder that writes the code for an element, an `<img>`, a data: URI, an iframe, an ES
  module, React, Vue, Svelte or Angular, each with a Copy button.

### Changed

- **Frames no longer misrepresent a flag.** `frame()`'s default fit is now `auto`: a crop from the centre only
  where it keeps every colour that covers 5% of the flag at half its share or more, and the whole flag otherwise
  (on a neutral disc when round). 1.0.0 always cropped, which turned Canada's square into a white square with a
  leaf; `fit: "cover"` gives the old frame. `flag(code, { shape })` uses flag-icons' drawing made for the shape
  where there is one. A new fit, `hoist`, crops from the fly. Every frame of every flag is checked in a browser.
- Every shipped SVG names its flag on its root (`data-hata="ca"`), which is how `frame()` finds its measured fit.
- Kuni 1.1.0 for the codes and names. The Wikidata snapshot asks only for the codes Kuni lists at the first level.

## [1.0.0] - 2026-10-09

The first version: flags as SVG for every country, and for the first-level subdivisions of Japan, Canada and the
United States, keyed by the ISO 3166 codes Kuni uses.

### Added

- **358 flags** at their true proportions: 245 of the 250 countries Kuni knows, 45 of Japan's 47 prefectures,
  12 of Canada's 13 provinces and territories, and 56 of the United States' 57 states, district and outlying
  areas. 345 pictures, since some places fly another's flag (Guadeloupe and France, Bouvet Island and Norway).
- **`@johnmorrisdotca/hata/flags/<code>`**: one module for each flag (`/flags/jp`, `/flags/jp-13`,
  `/flags/ca-on`, `/flags/us-tx`), its SVG string as the default export and as `svg`, with types whose doc
  comment names the place, its proportions, its size and its source.
- **`@johnmorrisdotca/hata`**: `FLAG_CODES`, `isFlagCode`, `flagCode` (either case, an underscore for the
  hyphen), `flagUrl` (the SVG file on jsDelivr or in a folder of one's own), `aspectOf`, `frame` (4:3, 1:1 or
  round, cropped or whole, with a label for assistive technology, never stretched) and `toDataUri`, and no flag.
- **`@johnmorrisdotca/hata/load`**: `flag(code, options)` and `flagDataUri(code, options)`, one dynamic import
  for each flag.
- **`@johnmorrisdotca/hata/manifest`** and **`manifest.json`**: each flag's source, file and page, Wikidata
  item, licence, author, restrictions (insignia), licence templates, upload and fetch dates, proportions, size,
  and why that drawing was chosen; and `LEFT_OUT`, the nine codes with no flag, each with its reason.
- **`@johnmorrisdotca/hata/svg/<code>.svg`**: every flag as a file.
- Every unknown or malformed code gives `null`; only an argument of the wrong type throws.
- The flags are chosen and built by a checksummed pipeline: `pnpm data:wikidata` and `pnpm data:commons` fetch
  Wikidata's flag image for each place and the Commons file it names, with its licence and author, into
  `data-sources/`; `pnpm data:choose` compares each with flag-icons', country-flag-icons' and circle-flags'
  drawings in a browser and keeps the best accurate one at the flag's true proportions (357 from Commons, one
  from country-flag-icons); `pnpm data` optimises them with SVGO 4, prefixes their ids, refuses anything that
  could reach outside the picture, and writes the modules and the lists in `docs/`; `pnpm data:compare` proves
  every shipped flag draws within 0.1% of pixels of its source.
- Only public-domain, CC0, CC BY and MIT drawings are shipped. Six flags whose only drawing is under another
  licence are left out and listed, with a recommendation each, in `docs/decisions.md`.
- `pnpm check` holds every export, in the shipped types, to a summary, an example, its parameters and what
  `null` means, and type-checks every example against the build.
- A demo with a gallery of every flag (search in English or Japanese, filters, frames, a detail panel with the
  flag's source and licence, code to copy, and SVG, PNG and JSON downloads) and a flag quiz (seeded, shareable,
  with streaks; countries, prefectures, provinces and states), in English and Japanese, an API reference page,
  and browser tests at a phone's width and a desk's.
