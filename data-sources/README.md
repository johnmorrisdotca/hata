# The inputs

Everything `pnpm data` (`scripts/build-data.ts`) reads that is not an npm package is kept here, so that the
build never touches the network and makes the same flags from the same files every time. `sources.json` lists
each snapshot with the address it came from, the day it was read and its SHA-256; the build refuses a file whose
bytes are not the recorded ones.

| File | From | Read | Licence |
| --- | --- | --- | --- |
| `wikidata-2026-10-09.json` | https://query.wikidata.org/sparql, the two queries written in the file | 2026-10-09 | CC0 |
| `commons-2026-10-09.json` | https://commons.wikimedia.org/w/api.php: each chosen file's address, size, SHA-1, upload time, licence and author fields, licence templates, and the SHA-256 of the copy kept here | 2026-10-09 | Facts about the files; each file's own licence is recorded in it |
| `commons/<file name>` | Each file Wikidata names as a place's flag, or `NAMED` names by hand, as Commons serves it (441 files, 16 MB) | 2026-10-09 | Each file's own, as Commons states it: see `commons-2026-10-09.json` and the file's page |

The flag sets the build also reads (flag-icons, country-flag-icons and circle-flags) are npm packages, pinned
to exact versions in `package.json` and checked by the lockfile's integrity hashes; they are not copied here.

## What the files under `commons/` are

They are the drawings on Wikimedia Commons, kept so the build can run with no network and a later change on
Commons shows as a diff here. **They are not all shipped**: a file whose licence is not public domain, CC0 or
CC BY (seven of them on 2026-10-09: CC BY-SA, a government licence, "copyrighted free use", and one with no
licence stated) is kept here as the reference the chooser compares other drawings with, and left out of the
package (`docs/left-out.md`). A code with a reason in `NO_FLAG` has no file here, even where Wikidata names one.
Each file stays under its own licence, with its author and page recorded in
`commons-2026-10-09.json`; nothing here is relicensed by this repository's MIT licence.

## Refreshing them

```sh
pnpm data:wikidata    # a new Wikidata snapshot, named for the day; the old one is removed
pnpm data:commons     # the files the new snapshot names, and what Commons says about each
pnpm data:choose      # compare each with the flag sets in a browser, and choose what ships (Chromium)
pnpm data             # build the flags, so the frames can be measured on them
pnpm data:framing     # measure each flag's 4:3, square and round frames (Chromium)
pnpm data             # rebuild src/flags and src/data from what is here (no network, no browser)
pnpm data:compare     # draw every shipped flag beside its source, pixel by pixel (Chromium)
```

`pnpm data:commons` is polite on purpose: fifty files a metadata request, one download a second, a backoff that
honours Commons' Retry-After, every request naming this project in its User-Agent, and no download of a file
already here with the right SHA-1. Nothing in the tests touches the network.

## The Wikidata snapshot

`wikidata-<day>.json` holds the answer to two SPARQL queries over query.wikidata.org, grouped by code and
sorted so that two snapshots compare line by line:

- for every ISO 3166-1 alpha-2 code (P297, deprecated statements left out): the item, its English label,
  whether it has ended (P576), and every flag image (P41) statement that is not deprecated, with its rank, its
  start and end (P580, P582), and what it applies to (P518) or is for (P3831);
- the same for the ISO 3166-2 codes (P300) Kuni lists at the first level of the countries in
  `SUBDIVISION_COUNTRIES`: Japan, Canada, the United States, Australia, the United Kingdom, Germany, France,
  Switzerland, Austria and Brazil (233 codes), and no others.

`scripts/select.ts` reads one current flag from it for each place: the preferred statements if there are any,
statements with an end left out, and `CHOSEN` and `ITEM` in `scripts/data-config.ts` where Wikidata leaves a
choice, and `NAMED` and `SAME_PLACE` where a file is named by hand or a subdivision is a country's code too.
Wikidata's structured data is CC0 (https://www.wikidata.org/wiki/Wikidata:Licensing).
