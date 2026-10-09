# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

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
