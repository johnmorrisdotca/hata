# Notice: the flags' sources and licences

The code of this package is under the MIT licence (see [LICENSE](LICENSE)). The flags are not this package's own
work: each is a drawing on [Wikimedia Commons](https://commons.wikimedia.org/), under the licence Commons states
on that file's page, which travels with it. Each flag's manifest entry (`@johnmorrisdotca/hata/manifest`, and
`manifest.json`) records its Commons file, its page, its author as Commons gives it, its licence, the licence
templates on its page, the day its current version was uploaded and the day it was fetched.
[docs/provenance.md](docs/provenance.md) lists them all.

| What | Made from | Terms |
| --- | --- | --- |
| Which Commons file is each place's flag | Wikidata, the flag image (P41) of each country (P297) and subdivision (P300), the snapshot `data-sources/wikidata-2026-10-09.json` | CC0 |
| The flags themselves | Wikimedia Commons, one file a flag, kept in `data-sources/commons/` and recorded with their metadata in `data-sources/commons-2026-10-09.json` | Each file's own: public domain, CC0 or CC BY, below |
| The places' names, in the docs and the demo only | Kuni (`@johnmorrisdotca/kuni` 1.0.0, a development dependency), from Unicode CLDR and Wikidata | MIT, Unicode-3.0 and CC0 |
| The pipeline, the frames, the lookups and the demo | Written for this package | MIT |

## Which licences are shipped

Only flags whose file Commons states to be in the **public domain**, under **CC0**, or under **CC BY** (which
asks only that the author be credited) are in the package. A flag whose file is under CC BY-SA, the GFDL, or a
licence Commons does not state in a form the build reads, is left out and listed with its reason in
[docs/left-out.md](docs/left-out.md); bringing one in is the maintainer's decision, recorded in
`scripts/data-config.ts`.

Public domain on Commons is most often a government's own work (PD-USGov, PD-Japan-organization and their
like), a design too simple to be copyrighted (PD-ineligible, PD-shape, PD-textlogo), or a national law that
exempts its symbols (PD-Japan-exempt and others). The drawing of a public-domain flag may be somebody's work, and
Commons names them; nothing obliges a credit, and the manifest keeps it anyway.

## Not copyright: the insignia note

Commons marks most flags with **Insignia**: *"This image shows a flag, a coat of arms, a seal or some other
official insignia. The use of such symbols is restricted in many countries. These restrictions are independent
of the copyright status."* The licence of a file says what may be done with the drawing; the law of a country
may still restrict how its flag, its arms or a seal may be used (on goods, in advertising, in a way that
suggests official approval, or with disrespect). The manifest's `restrictions` field carries Commons' notes
(`insignia`, `trademarked`, `communist` and others) for each flag. This package cannot grant any right a
country's law withholds; check before using a flag commercially.

## Credit, where a licence asks for it

The flags whose licence asks that the author be credited, and the credit:

<!-- attributions:start -->
- `BL` St. Barthélemy: "Flag of Saint Barthélemy (local).svg", attributed as "I, Hoshie"; author as Commons gives it: The arms are from User:Manassas's Image:Blason St Barthélémy TOM entire.svg.; CC BY 2.5 (https://creativecommons.org/licenses/by/2.5); https://commons.wikimedia.org/wiki/File:Flag_of_Saint_Barth%C3%A9lemy_(local).svg
<!-- attributions:end -->

## The flag sets a drawing was taken from

Where a flag set's drawing is the same flag as Commons' at the same proportions and smaller, or free where
Commons' is not, it is shipped instead (`pnpm data:choose` decides, and each flag's manifest entry says why). The
sets are under the MIT licence, which asks that their copyright and permission notice go with every copy:

<!-- sets:start -->
### country-flag-icons 1.6.20

https://gitlab.com/catamphetamine/country-flag-icons, on npm as `country-flag-icons`. The drawings of `YE`.

```text
(The MIT License)

Copyright (c) 2020 @catamphetamine <purecatamphetamine@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
<!-- sets:end -->

## What was changed

Every flag is the Commons file optimised with SVGO 4 (whitespace, comments, metadata and editor data taken out,
numbers rounded to about a four-thousandth of the flag's width, paths and shapes written more briefly), with its
width and height replaced by a viewBox where it had none, and with every id and class name prefixed with the
flag's code, so two flags in one page cannot collide. Nothing is redrawn: the picture is Commons'. The
optimised flags are compared with the originals, pixel by pixel, before a version is released (`pnpm data:compare`).

## Not carried

Nothing from other flag sets (flag-icons, country-flag-icons, circle-flags): they were measured for comparison
only. No flag under a share-alike licence, and no file from anywhere but Wikimedia Commons.
