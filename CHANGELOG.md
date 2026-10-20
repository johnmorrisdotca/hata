# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

Flags of former countries, for the medal tables and record books that still name them (`docs/historical.md`, `docs/decisions.md`, "Former countries").

### Added

- **Twelve former countries**, each under a code no present-day country has: `SUHH` the Soviet Union, `DDDE` East Germany, `FRG` West Germany, `CSHH` Czechoslovakia, `YUCS` Yugoslavia, `CSXX` Serbia and Montenegro, `ANHH` the Netherlands Antilles, `BUMM` Burma, `ZRCD` Zaire, `RHZW` Rhodesia, `BOH` Bohemia and `WIF` the West Indies Federation (478 flags in all, and `/flags/<code>` modules, `dist/svg/<code>.svg` files and manifest records for each). The code is the ISO 3166-3 one where that standard has one, else the IOC's. Every drawing is a public-domain file on Commons that is one of the flag images of its Wikidata item (the build checks); West Germany's is Germany's picture and Czechoslovakia's is Czechia's (`manifest(code).sameAs`), kept as codes of their own so a table keeps the row.
- **`FLAG_ALIASES`**: the codes a table holds for them find them too, in any case, through `flagCode`, `flag`, `flagName`, `flagAspect`, `flagUrl`, `manifest`, `leftOut`, `variantsOf` and `<hata-flag>`: the ISO 3166-1 alpha-2 and alpha-3 (`SU`, `SUN`, `DD`, `DDR`, `YU`, `AN`, `BU`, `ZR`, `RH`, `CSK`, `ANT`, `BUR`, `ZAR`) and the IOC's letters (`URS`, `GDR`, `TCH`, `YUG`, `SCG`, `AHO`, `BIR`, `ZAI`, `RHO`, `BWI`). An alias is never a code of a flag (`isFlagCode("URS")` is false). **`CS` finds nothing** on purpose: Czechoslovakia and Serbia and Montenegro both held it, so `leftOut("CS")` says which codes to use.
- **Dated variants**: Yugoslavia's default is the Socialist Federal Republic's star flag (1946 to 1992, the one it competed under from 1948 to 1988), with the Federal Republic's tricolour (`fry`, 1992 to 2003) and the Kingdom's (`kingdom`, 1918 to 1941); the Soviet Union's flag of 1936 to 1955 (`1936`) and Burma's of 1948 to 1974 (`union`) are variants beside their defaults. Nothing is chosen by year: you ask for the one you mean.
- **Ten more codes with a reason and no flag**, in `LEFT_OUT`: the Olympic teams that marched under the Olympic flag or the committee's emblem, which are marks and not countries' flags (`EUN` the Unified Team of 1992, `EUA` the United Team of Germany, `ROC`, `OAR`, `AIN`, `IOP`, `EOR`), `RU1` the Russian Empire and `ANZ` Australasia (no one flag in sport), and the ambiguous `CS`. A page draws a badge with the code for these.
- `manifest(code).historical` (`from`, `until`, `aliases`) on a former country's record, and on a left-out team's.
- The demo's **Former countries** set in the gallery and in the quiz, `docs/historical.md`, and a section in the codes guide, in English and Japanese.
- `pnpm data:wikidata -- --historical` asks Wikidata for the former countries' items only, and puts them into the snapshot; `FOCUS` (the side a crop keeps) may now name a variant's own picture.

### Changed

- `FLAG_CODES` is countries, then subdivisions, then the former countries (it was the first two). `LEFT_OUT` is 27 codes (was 17). The main entry grows by 0.2 KB gzipped.
- The Netherlands Antilles' flag of 1959 to 1986 and Rhodesia's of 1964 to 1968 are not offered: their Commons pages are CC BY-SA (2.5, and 4.0 beside public-domain templates), which this package does not ship.
- Burma's flag of 1974 to 2010, once "considered and not offered", is now `BUMM`'s.

## [1.6.3] - 2026-10-20

The second batch from the October 2026 audit (`docs/audit-2026-10.md`): the Commons snapshot is refreshed, and every flag now names its author.

### Changed

- **Commons snapshot of 2026-10-20** (was 2026-10-09). Every chosen file was read again: 448 of the 449 are byte for byte the ones kept (same SHA-1), and thirteen of them changed only what Commons says about them, none of it touching a licence: licence sub-templates added (`PD-Japan-organization/layout` on Iwate, Kanagawa, Saitama, Shiga, Tochigi and Yamaguchi), footnote markers dropped from a credit line (British Columbia, Russia, Yamagata, the United Arab Emirates), the order of its two restrictions (Burkina Faso), and a re-upload of identical bytes (Christmas Island, Uzbekistan). The audit's fifteenth, the Philippines, reads as it did on 2026-10-09.
- **Schleswig-Holstein (`DE-SH`)**: Commons re-uploaded the drawing on 2026-10-11 (362 B to 232 B, 5:3 as before). It is the same flag, blue, white and red stripes, still public domain (`PD-Flag-Germany`); its blue is `#0f47af` (was `#0039ad`) and its red `#da121a` (was `#d61810`), and it now carries an author on Commons. Re-tuned, rebuilt and compared with its source at 0.000% of pixels different.

### Fixed

- **Every flag names its author.** 38 flags had none in their record (Commons' `Artist` field was empty): `CK FM GN GS GW JE KW MG MP MS NF TM TZ AT-1 AT-2 AT-5 AT-8 AT-9 BR-GO BR-PA DE-BB DE-HB DE-HE DE-MV DE-NI DE-SH DE-SL DE-ST DE-TH US-AR US-GA US-IA US-ME US-MI US-MP US-NC US-NM US-WI`, and the variant drawings of Guadeloupe's local flag and Wallis and Futuna. Schleswig-Holstein's comes from Commons; the others are read from each file's description page into `scripts/authors.data.json`, each with where on the page it says so: a name where the page gives one ("Drawn by SKopp", "Written by Jon Harald Søby", "by Steve Hall", `{{PD-user|E2m}}`, the xrmap flag collection), and "Unknown author", Commons' own words, where it names nobody. No author is taken from the file history. `docs/decisions.md` says how, and the manifest's `author` is now filled for every flag.

### Added

- A test that every flag and variant has an author, that a recorded author is used only where Commons' own field is empty, and that an entry is dropped once Commons gives the file an author.

## [1.6.2] - 2026-10-20

The first fixes from the October 2026 audit (`docs/audit-2026-10.md`): two flags were at the wrong shape.

### Fixed

- **Qatar (`QA`) is 28:11 (about 2.55:1), as the flag is, not 4.17:1.** Commons' file is a 75 by 18 drawing with `preserveAspectRatio="none"` for a 1400 by 550 picture, meant to be stretched; Hata dropped the attribute and shipped the unstretched drawing, 64% too wide with flattened scallops. The optimiser now scales a drawing like that into its width and height. The names table and the manifest follow the new shape.
- **Prince Edward Island (`CA-PE`) is 3:2, not 1.459:1.** The Provincial Flag Act's Schedule (R.S.P.E.I. 1988, Cap. P-27) gives six feet in the fly and four in the hoist, inclusive of the band. The Commons drawing is about 2.8% too narrow (seven band tiles across the top, not 7.2), so it is stretched across to 3:2. The ratio and its source are recorded in `scripts/official-ratios.data.json`, and the manifest's reason for the flag says so.
- The README's Subdivisions row said the United States was 56 of 57; it is 57 of 57.

### Added

- A test that every shipped Commons flag has the shape of its source file's width and height, or the official ratio recorded for it with a source and a reason, so a stretched or squeezed flag cannot come back, and that a recorded ratio is dropped once its drawing is right.

## [1.6.1] - 2026-10-20

### Added

- **Manitoba's flag** (`CA-MB`, 466 flags in all, 13 of Canada's 13 provinces and territories): the Red Ensign with the province's shield,
  from Commons' public-domain drawing "Flag of Manitoba.svg" (Kooma, kept up to date by Echando una mano; PD-author and PD-Layout),
  not the CC BY-SA file Wikidata names, which `NAMED` now replaces. It is 2:1, like the flag, and its square, 4:3 and round frames show
  the whole flag, as Ontario's do. Manitoba is no longer on the list of flags left out for their licence: 17 codes have no flag (was 18),
  and `docs/decisions.md` lists four flags left out for their licence (was five).
- A test that all 13 of Canada's provinces and territories (10 provinces, 3 territories) have a flag that loads as a whole SVG with no
  script, external reference or embedded picture.

## [1.6.0] - 2026-10-14

The flag is a custom element with the family's standard embed attributes and a shared builder, and the package has an English and Japanese documentation site with a checked example for every export. The flags, the codes, the variants and the loaders are unchanged.

### Added

- Add English/Japanese documentation guides, a complete drawing catalogue, checked public-export examples, local search and Markdown/llms references. Keep API anchors, native drawing data, provenance and existing wildcard assets; add language-aware Docs links to the gallery and builder.
- Add a shared standalone flag builder and standard embed/ page, compatible pixel-width and display-size attributes, composed load/error events, and styling inside shadow roots.
- Share a package-independent embed builder for option controls, preview adapters, code tabs and shareable links.

### Changed

- The API link in the header reads "API" in English, so that the header takes the same number of rows in English and in Japanese on a phone, as the demo's test of a language change asks.
- Synchronize documentation tooling for repository layouts, generated type references, Node entry points and repository-specific README links.
- Reconcile standard embeds with the released flag variants, whole/crop choices and Brittany; validate variant ids in the canonical frame and keep variant proportions in copied code.
- Group the package family by kind, alphabetize each group, and include the geography packages and REST in Pieces in the shared footer and README.
- Update the shared family description for addresses in all seven supported countries, including France and Germany.

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
