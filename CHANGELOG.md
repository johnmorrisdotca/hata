# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

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
