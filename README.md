<h1 align="center">Hata <sub>旗</sub></h1>

<p align="center"><strong>Hata 旗: flags as SVG for every country, Japan's prefectures, Canada's provinces and territories, and the American states, keyed by ISO 3166 code.</strong><br>
At their true proportions, optimised and safe to inline, with the source, author and licence of every flag. One module per flag, a lookup that loads one by its code, and frames for 4:3, square and round that never stretch a flag. Zero dependencies.</p>

<p align="center" lang="ja">世界の国々、日本の都道府県、カナダの州と準州、アメリカの州の旗を、本来の縦横比の SVG で収録し、ISO 3166 のコードで引けるようにした、依存関係のない TypeScript パッケージです。</p>

<p align="center">
  <a href="https://github.com/johnmorrisdotca/hata/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/johnmorrisdotca/hata/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@johnmorrisdotca/hata"><img alt="npm" src="https://img.shields.io/npm/v/@johnmorrisdotca/hata?color=2f5d4a"></a>
  <a href="./LICENSE"><img alt="MIT licence" src="https://img.shields.io/badge/licence-MIT-2f5d4a"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-0-2f5d4a">
  <img alt="TypeScript" src="https://img.shields.io/badge/types-TypeScript-3178c6">
</p>

<p align="center"><a href="https://johnmorrisdotca.github.io/hata/"><strong>Try it →</strong></a> · <a href="https://johnmorrisdotca.github.io/hata/api.html">API reference</a></p>

<table align="center">
<tr>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hata/main/docs/images/hero-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hata/main/docs/images/hero-desk-light.webp" alt="The demo on a desk, in English: the header with its language chooser, the API reference link, five cloth patches and the Help switch, then the Flags and Quiz tabs. The Flags tab has a search box, the set buttons All, Countries, Japan, Canada and United States, a continent menu, the shapes Own, 4:3, 1:1 and Round, the line 358 of 358 flags with List (TXT) and Manifest (JSON) buttons, and the first rows of flags: Andorra, the United Arab Emirates, Afghanistan, Antigua and Barbuda, Anguilla and Albania, each with its name and code." width="600">
</picture>
<br><em>The gallery on a desk: every flag at its own proportions, found by name or code.</em>
</td>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hata/main/docs/images/quiz-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hata/main/docs/images/quiz-phone-light.webp" alt="The quiz on a phone, in Japanese: the scores 正解, 連続正解 and 最高連続正解, then question 1 of 10 on a green felt, Mie prefecture's green flag, and four prefecture names. 山梨県 was picked and is red, the right answer 三重県 is green, and the line under them says 残念！これは三重県の旗です。 above the 次の旗 button." width="190">
</picture>
<br><em>The quiz on a phone, in Japanese, after a wrong answer.</em>
</td>
</tr>
</table>

Hata is the flag set a site that already knows its countries and regions by ISO code (from [Kuni](https://github.com/johnmorrisdotca/kuni), say) can show beside them: 358 flags, every one drawn at the proportions its government gives it, as an SVG that scales to any size and looks the same on every system, which a flag emoji does not (Windows shows two letters). No other flag set has Japan's prefectures, all of Canada's provinces and territories, or codes that match ISO 3166-2. Each flag is a module of its own, so a page carries only the flags it imports; one lookup loads any flag by its code when it is wanted. And every flag says where it comes from: the Wikimedia Commons file or the flag set it was drawn from, its author, its licence, and why that drawing was chosen. It works in [the demo](https://johnmorrisdotca.github.io/hata/) with nothing to install.

## In 30 seconds

```sh
npm install @johnmorrisdotca/hata
```

```ts
import japan from "@johnmorrisdotca/hata/flags/jp";     // one flag, one module: 158 bytes
import { flag } from "@johnmorrisdotca/hata/load";

element.innerHTML = japan;                             // an <svg> with a viewBox: it fills its box, never stretched
const tokyo = await flag("JP-13");                     // any flag by its code, loaded when asked
const round = await flag("ca", { shape: "round", label: "Canada" });
await flag("XX");                                      // null: not a code with a flag
```

Install the scoped name: an unscoped `hata` on npm, if there is one, is somebody else's package.

## Who it is for

- **Forms and profiles** that show where somebody is from, beside a country or a prefecture they picked.
- **Sites rendered on a server**, which need a flag as a string, not a component, with no network and no DOM.
- **Japanese-language sites** that need the 47 prefectures' flags, and Canadian and American ones that need their
  provinces' and states' flags, keyed the same way as their countries.
- **Maps, quizzes and games**, which frame flags as square tiles or round markers and must not stretch them.
- **Anybody who has to say where a picture came from**: every flag has its source, author and licence in the
  manifest, and the package ships nothing under a share-alike licence.

## Features

- **358 flags**: 245 of the 250 countries Kuni knows, 45 of Japan's 47 prefectures,
  12 of Canada's 13 provinces and territories, and 56 of the United States' 57 states, district and outlying areas. The 9 codes with no flag
  are listed with their reasons.
- **True proportions.** Japan's 2:3, Canada's 1:2, the United States' 10:19, Switzerland's square, Nepal's two
  pennants: each flag is shipped as its government draws it, and `frame()` puts it in a 4:3, square or round frame
  when that is what a layout needs, cropped from the centre or shown whole, never stretched.
- **The best accurate drawing.** Each flag's Commons drawing (the one Wikidata names, usually from its
  construction sheet) is compared in a browser with flag-icons', country-flag-icons' and circle-flags'; a set's
  drawing ships only where it is the same flag at the same proportions and smaller, or free where Commons' is not.
  Nothing is redrawn, and every shipped flag is proved to draw as its source does.
- **Safe to inline.** Scripts, event handlers, foreign objects and references outside the picture are refused at
  build time, and every id and class carries the flag's own prefix, so two flags in one page cannot collide.
- **Small where it matters.** The main entry is 7.2 KB (2.6 KB gzipped) and carries no flag; the median flag is
  under 700 bytes; the lookup is 18 KB and then the flag's own file.
- **Provenance for every flag**, in `/manifest` and `manifest.json`: the file, its page, the Wikidata item, the
  licence, the author, the restrictions Commons notes, and the dates.
- **Typed, documented, pure and the same everywhere.** ESM with types; every export has a doc comment with an
  example, checked against the build; no dependencies, no network, no DOM.

## Use it in your project

### Install

```sh
npm install @johnmorrisdotca/hata
# or: pnpm add @johnmorrisdotca/hata
# or: yarn add @johnmorrisdotca/hata
```

It ships ES modules with types and `sideEffects: false`. Node 24 can also `require()` it.

### The entry points

| Entry | What it carries | Size |
| --- | --- | --- |
| `@johnmorrisdotca/hata` | The codes, `flagCode`, `flagUrl`, `frame`, `aspectOf`, `toDataUri`; no flag | 7.2 KB, 2.6 KB gzipped |
| `@johnmorrisdotca/hata/flags/<code>` | One flag's SVG string (`/flags/jp`, `/flags/jp-13`, `/flags/ca-on`, `/flags/us-tx`, lower case) | median 667 bytes; 158 bytes for Japan |
| `@johnmorrisdotca/hata/load` | `flag(code)`, one dynamic import per flag | 18 KB, 3.7 KB gzipped, then the flag's own file |
| `@johnmorrisdotca/hata/manifest` | Every flag's source, licence, author and why it was chosen, and the codes with no flag | 390 KB, 49 KB gzipped |
| `@johnmorrisdotca/hata/svg/<code>.svg` | Every flag as a file, for an `<img>`, a CSS `url()` or a CDN | the same as the module's string |
| `@johnmorrisdotca/hata/manifest.json` | The manifest as JSON | 438 KB |

### 1. One flag

```ts
import japan from "@johnmorrisdotca/hata/flags/jp";
import { svg as tokyo } from "@johnmorrisdotca/hata/flags/jp-13";

element.innerHTML = japan;
```

Each flag's types carry a doc comment naming the place, its proportions, its size and its source, so an editor
shows which flag an import is.

### 2. Any flag by its code

```ts
import { flag, flagDataUri } from "@johnmorrisdotca/hata/load";

const svg = await flag(form.country);              // "JP", "jp", "JP-13", "ca_on": any case
image.src = (await flagDataUri("US-TX")) ?? "";    // ready for an <img>
```

A code with no flag here, a malformed one, or anything that is not a code gives `null`, never a near miss. Only an
argument that is not a string throws.

### 3. Frames that never stretch

```ts
import { frame } from "@johnmorrisdotca/hata";
import canada from "@johnmorrisdotca/hata/flags/ca";

frame(canada, { shape: "4:3" });                   // cropped from the centre to fill 4:3
frame(canada, { shape: "1:1", fit: "contain" });   // all of the 1:2 flag in a square, clear above and below
frame(canada, { shape: "round", label: "Canada" }); // a circle, with role="img" and a title
```

### 4. An `<img>`, from the CDN or your own folder

```ts
import { flagUrl, toDataUri } from "@johnmorrisdotca/hata";

flagUrl("JP-13");                       // "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/jp-13.svg"
flagUrl("US-TX", { base: "/flags" });   // "/flags/us-tx.svg", for a copy of dist/svg/ in your own site
toDataUri(svg);                         // "data:image/svg+xml,…", smaller than base64
```

### 5. Where a flag comes from

```ts
import { leftOut, manifest } from "@johnmorrisdotca/hata/manifest";

manifest("JP-13");   // { source: "commons", file: "Flag of Tokyo Metropolis.svg", licence: { kind: "public-domain", … }, author, why, … }
manifest("YE")?.why; // why country-flag-icons' drawing was chosen over Commons'
leftOut("EH");       // { kind: "no-flag", reason: "Western Sahara has no flag of its own on Wikidata …" }
```

### In a page, with no bundler

```html
<img src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/jp-13.svg" alt="Tokyo" height="48">
<script type="module">
  import { flag } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/load.js";
  document.body.insertAdjacentHTML("beforeend", await flag("CA-ON"));
</script>
```

## Examples

### A country select with flags, from Kuni

```ts
import { countries } from "@johnmorrisdotca/kuni";
import { flagUrl } from "@johnmorrisdotca/hata";

const options = countries({ order: "ja" }).map((one) => ({ value: one.alpha2, label: one.name.ja, flag: flagUrl(one.alpha2) }));
// flag is null for the few places with no flag here: draw the name alone
```

### Square tiles and round markers, in CSS

A flag's SVG file in an `<img>` behaves like any picture, so CSS frames it without stretching it too:

```css
.tile img { width: 48px; height: 36px; object-fit: cover; }                       /* 4:3 */
.marker img { width: 32px; height: 32px; object-fit: cover; border-radius: 50%; } /* round */
```

### A credits page

```ts
import { MANIFEST } from "@johnmorrisdotca/hata/manifest";

const credits = MANIFEST.filter((one) => one.sameAs === null && one.attributionRequired)
  .map((one) => `${one.code}: ${one.file}, ${one.author}, ${one.licence.name}`);
```

## API

The [API reference](https://johnmorrisdotca.github.io/hata/api.html) lists every export of every entry point with its signature, its parameters, what it returns and an example. It is made from the source by `pnpm site`, so it cannot fall behind the code, and `pnpm check` fails if an export has no summary, no example, or a parameter it does not describe.

| Entry | Exports |
| --- | --- |
| `@johnmorrisdotca/hata` | `FLAG_CODES`, `isFlagCode`, `flagCode`, `flagUrl`, `aspectOf`, `frame`, `toDataUri`, `VERSION`, and the types `FlagCode`, `FlagUrlOptions`, `FrameOptions`, `Shape` and `Fit` |
| `@johnmorrisdotca/hata/flags/<code>` | the flag's SVG string as the default export and as `svg` |
| `@johnmorrisdotca/hata/load` | `flag`, `flagDataUri` and the type `FrameOptions` |
| `@johnmorrisdotca/hata/manifest` | `MANIFEST`, `LEFT_OUT`, `manifest`, `leftOut`, and the types `FlagRecord`, `LeftOutRecord`, `LicenceKind` and `FlagSource` |

A flag's record:

```ts
interface FlagRecord {
  code: string;                   // "JP-13"
  source: "commons" | "flag-icons" | "country-flag-icons";
  file: string;                   // "Flag of Tokyo Metropolis.svg", or the set's path: "3x2/YE.svg"
  page: string;                   // the Commons page, or the set's file on jsDelivr
  version: string | null;         // the set's version; null for Commons
  wikidata: string;               // "Q1490": the item whose flag image (P41) names the file
  licence: { kind: "public-domain" | "cc0" | "cc-by" | "mit"; name: string; url: string | null };
  author: string | null;          // as Commons gives it, or the set's copyright line
  credit: string | null;
  attributionRequired: boolean;
  restrictions: string[];         // ["insignia"]: limits apart from copyright, as Commons notes them
  templates: string[];            // the licence templates on the Commons page: ["PD-Japan-organization", …]
  uploaded: string | null;        // when Commons' current version was uploaded
  fetched: string;                // when the package read Wikidata and Commons
  reference: { file: string; page: string; licence: string } | null;  // Commons' file, where a set's drawing won
  why: string;                    // why this drawing, in a sentence or two
  sameAs: string | null;          // "FR" for Guadeloupe: the flag whose picture this is
  width: number;                  // the viewBox: width / height is the flag's proportions
  height: number;
  bytes: number;                  // the SVG's size
  gzip: number;
  notes: string[];                // text drawn with a font, an embedded raster picture
}
```

Every function is pure and every record it hands out is frozen.

## Where the flags come from

1. **Wikidata names each place's flag** (P41, flag image), a CC0 statement: the preferred one, with any that has
   ended left out. `scripts/data-config.ts` settles the few places where it leaves a choice, each with its reason.
2. **Wikimedia Commons has the drawing**, at the flag's true proportions, usually made from the government's
   construction sheet and cited on its page. `pnpm data:commons` downloads it, with its licence, author and
   licence templates, into `data-sources/`, checked by SHA-256.
3. **The flag sets are compared with it** (`pnpm data:choose`, in Chromium): flag-icons, country-flag-icons and
   circle-flags, all MIT. A set's drawing ships only where it is drawn at the flag's own proportions, draws the
   same flag (the same construction and colours, to 0.5% of pixels), and is at least 10% smaller, or is free where
   Commons' is not. On 2026-10-09 Commons' drawing won 357 times and country-flag-icons' once (Yemen, where
   Commons' file is marked CC BY-SA). Where a set draws a different design (an old flag, a local flag, a
   simplified emblem), the place was looked at and the verdict written down ([docs/compared.md](./docs/compared.md)).
4. **Each is optimised and checked** (`pnpm data`): SVGO 4, rounding measured per flag, ids prefixed, anything
   that could reach outside the picture refused, and `pnpm data:compare` proves every one draws within 0.1% of
   pixels of its source at 960 pixels wide.

Only drawings in the public domain, under CC0, under CC BY or under MIT are shipped. [docs/provenance.md](./docs/provenance.md)
lists every flag with its file, licence, author and why; [docs/left-out.md](./docs/left-out.md) the 9 codes with
no flag; [docs/decisions.md](./docs/decisions.md) the judgement calls, including the six flags left out for their
licence and the places where the sources disagree on the design, each with a recommendation.

## Sizes

Measured on 2026-10-09, SVG as shipped and gzipped at level 9:

| Set | Flags | SVG | Gzipped | Median flag |
| --- | --- | --- | --- | --- |
| Hata, the countries | 238 pictures | 1,993 KB | 666 KB | 547 B |
| Hata, Japan's prefectures | 45 | 23 KB | 13 KB | 438 B |
| Hata, Canada's provinces and territories | 12 | 370 KB | 131 KB | 14 KB |
| Hata, the American states and areas | 50 pictures | 4,853 KB | 1,766 KB | 85 KB |
| flag-icons 7.5.0, 4:3 (a crop, not the true proportions) | 271 | 1,955 KB | 651 KB | 804 B |
| country-flag-icons 1.6.20, 3:2 (simplified) | 265 | 174 KB | 87 KB | 479 B |
| circle-flags 2.8.3 (round) | 430 | 301 KB | 159 KB | 585 B |

The countries weigh what flag-icons' do, at their true proportions. The American states are most of the package
because their flags carry full seals, drawn as they are (Virginia's is 372 KB); 47 flags are over the 40 KB
budget, listed in [docs/sizes.md](./docs/sizes.md). A page pays only for the flags it imports or loads.

## Theming

A flag is its government's colours, so there is nothing to theme in it. What a page chooses is the frame: its
shape (`frame()` or CSS `object-fit`), a border or a shadow (a white or pale flag needs one on a white page, and a
dark one on a dark page), and its size. The demo is the worked example: [`demo/demo.js`](./demo/demo.js) and
[`demo/hata.css`](./demo/hata.css), over the family's shared stylesheet.

## Limits

| Limit | Value | Where |
| --- | --- | --- |
| Countries | 245 of the 250 Kuni knows | `FLAG_CODES` |
| Subdivisions | the first level of Japan (45 of 47), Canada (12 of 13) and the United States (56 of 57) | `FLAG_CODES` |
| Codes with no flag | 9 codes, each with its reason | `LEFT_OUT`, [docs/left-out.md](./docs/left-out.md) |
| Licences | public domain, CC0, CC BY and MIT only | `manifest(code).licence` |
| Largest flag | 372 KB (Virginia); 47 over the 40 KB budget | [docs/sizes.md](./docs/sizes.md) |

Not here: other countries' regions, cities, historical flags, ensigns and standards, and raster pictures. A flag's
licence covers the drawing; using a country's flag or seal may still be limited by its law (Commons marks most
flags "insignia"), which [NOTICE.md](./NOTICE.md) explains.

## Accessibility

A flag is a picture, so what Hata can do is make it easy to name.

- **A label on request.** `frame(svg, { label })` and `flag(code, { label })` give the SVG `role="img"`, an
  `aria-label` and a `<title>`; an `<img>` takes the place's name as its `alt`.
- **Never the only label.** The demo always writes the name beside a flag, in the page's language.
- **In the demo**, every control is at least 44 pixels square, the fields do not zoom on a phone, the detail
  panel is a modal dialog that Escape closes, and the page fits a phone at 390 pixels with no sideways scroll.
- **Not yet.** The demo's colours have not been measured against WCAG contrast ratios, and its Japanese has not
  been read by a native reader (see [Languages](#languages)).

## Browser and runtime support

The package is strings and plain functions, so it runs anywhere JavaScript does: any current browser and Node. The
SVG files work in every browser that shows SVG. Building it from source and running its data scripts needs Node 24
or later; CI tests on Node 24 on Linux, macOS and Windows. The demo is played in a real Chromium at a phone's width
(with touch) and a desk's, and in WebKit at a phone's width.

## Languages

The package itself has no words: its codes and SVG are the same in every language, and the manifest's reasons and
Commons' fields are in English as their sources give them. The demo speaks English and Japanese, with the places'
names from Kuni. Its Japanese was checked by a strong, but not a native, reader of Japanese. **Japanese: included;
not yet reviewed by a native reader. Corrections welcome.** Every line of the demo is listed beside its English in
[docs/strings-ja.md](./docs/strings-ja.md), and there is an [issue template](https://github.com/johnmorrisdotca/hata/issues/new?template=fix-a-translation.md) for fixing one.

## Roadmap

Not here yet, and each welcome as an [issue](https://github.com/johnmorrisdotca/hata/issues):

- The first level of more countries' regions (Germany's states, Australia's states, Brazil's states), from the
  same pipeline.
- The six flags left out for their licence, by decision or by a public-domain drawing on Commons
  ([docs/decisions.md](./docs/decisions.md)).
- A simplified drawing of the heaviest seals, as an option beside the full one, never in its place.

Left out on purpose: a React or other framework component (an SVG string and an `<img>` need none), redrawn flags,
and anything under a share-alike or GPL licence.

## Architecture

```text
src/
├── index.ts            the main entry: the codes, flagCode, flagUrl, and the helpers from svg.ts
├── svg.ts              aspectOf, frame and toDataUri: pure string work on a flag's SVG
├── load.ts             the "/load" entry: a flag by its code, by dynamic import
├── manifest.ts         the "/manifest" entry: every flag's record, and the codes left out
├── manifest.types.ts   the shapes of a flag's record and a code left out
├── version.ts          the package's version
├── data/               written by scripts/build-data.ts: the codes, the loaders, the manifest
└── flags/              written by scripts/build-data.ts: the "/flags/<code>" entries
```

`scripts/build-data.ts` (`pnpm data`) makes `src/flags/` and `src/data/` from the inputs in `data-sources/` and the
flag sets in `node_modules`, with no network and no browser, and checks every input's SHA-256 first; run twice, it
leaves the tree as it was. `scripts/choose.mjs` (`pnpm data:choose`) is the comparison that decides which drawing
ships; `scripts/optimise.ts` is the SVGO settings and the safety checks; `scripts/data-config.ts` holds the few
things decided by hand. Tests sit beside the code (`*.test.ts`). `scripts/` also builds the demo and its API page,
checks every export's documentation and checks the package as npm packs it; `demo/` is the page and `e2e/` its
browser tests.

## Data and licences

| What | From | Licence |
| --- | --- | --- |
| Which file is each place's flag | Wikidata, a snapshot of 2026-10-09 | CC0 |
| 357 flags' drawings | Wikimedia Commons, each file's own licence: 349 public domain, 7 CC0, 1 CC BY 2.5 | as stated on each file's page |
| Yemen's drawing | country-flag-icons 1.6.20 | MIT |
| The drawings compared but not shipped | flag-icons 7.5.0, circle-flags 2.8.3 | MIT |
| The places' names, in the docs and the demo | Kuni 1.0.0 (Unicode CLDR and Wikidata) | MIT, Unicode-3.0, CC0 |
| The pipeline, the frames, the lookups and the demo | written for this package | MIT |

[NOTICE.md](./NOTICE.md) carries the credit CC BY asks for, country-flag-icons' MIT notice, and the note on
insignia, and ships with the package. [data-sources/README.md](./data-sources/README.md) says where every input
came from and how to refresh it.

## The name

*Hata* (旗) is Japanese for "flag": a banner on a pole, as in 国旗 (*kokki*, a national flag), 旗揚げ (*hata-age*,
raising a flag, and so founding something) and 旗印 (*hatajirushi*, the emblem on a samurai's banner, and so a
cause). ([Wiktionary: 旗](https://en.wiktionary.org/wiki/旗), which gives "flag, banner".)

## Where it comes from, and where it is used

Hata was written for [Kuni](https://github.com/johnmorrisdotca/kuni), which showed each country's flag as an
emoji: a picture that cannot be sized, looks different on every system, and is two letters on Windows. A survey of
the flag sets on npm found none with Japan's prefectures, none with all of Canada's provinces and territories, and
none keyed by ISO 3166-2 codes; every one of them draws from Wikimedia Commons, so Hata goes there too, and says
which file each flag is.

### Used by

Nothing yet: it is new. Using Hata in something? Open an *Add my project* issue and we will add you.

### The family

Hata is not yet in the family's shared list (the template every demo's header and footer read), which is changed
in every repository at once; until it is, its demo adds itself, and Kuni, at the end. The list as it will be:

Hata is one of twenty-six packages, each made for the same site, each at
[github.com/johnmorrisdotca](https://github.com/johnmorrisdotca). The code of every one is MIT.

- [Korokoro](https://github.com/johnmorrisdotca/korokoro) (コロコロ): dice, with notation, exact odds, real sounds and the dice of many games. [Demo](https://johnmorrisdotca.github.io/korokoro/).
- [Kyuubu](https://github.com/johnmorrisdotca/kyuubu) (キューブ): a turning cube for the browser, 2×2 to 7×7, with record solves to replay. [Demo](https://johnmorrisdotca.github.io/kyuubu/).
- [Hitotsu](https://github.com/johnmorrisdotca/hitotsu) (一つ): a colour-card shedding game for two to eight, with the house rules people play. [Demo](https://johnmorrisdotca.github.io/hitotsu/).
- [Toranpu](https://github.com/johnmorrisdotca/toranpu) (トランプ): a deck of playing cards, card games with computer players, and solitaires. [Demo](https://johnmorrisdotca.github.io/toranpu/).
- [Tane](https://github.com/johnmorrisdotca/tane) (種): seeded random numbers and daily seeds, the same in every browser and on every server. [Demo](https://johnmorrisdotca.github.io/tane/).
- [Narabe](https://github.com/johnmorrisdotca/narabe) (並べ): one rules engine for abstract board games, from gomoku and Reversi to Go and checkers. [Demo](https://johnmorrisdotca.github.io/narabe/).
- [Tenka](https://github.com/johnmorrisdotca/tenka) (天下): world conquest for two to six, on a map of the real world. [Demo](https://johnmorrisdotca.github.io/tenka/).
- [Kumimoji](https://github.com/johnmorrisdotca/kumimoji) (組み文字): a crossword tile race, in English and Japanese kana. [Demo](https://johnmorrisdotca.github.io/kumimoji/).
- [Tsunagi](https://github.com/johnmorrisdotca/tsunagi) (繋ぎ): a line-joining logic puzzle whose every level has exactly one answer. [Demo](https://johnmorrisdotca.github.io/tsunagi/).
- [Jarajara](https://github.com/johnmorrisdotca/jarajara) (ジャラジャラ): mahjong tiles drawn as SVG, stacked layouts, and the matching solitaire Awase. [Demo](https://johnmorrisdotca.github.io/jarajara/).
- [Suido](https://github.com/johnmorrisdotca/suido) (水道): a pipe puzzle: turn the pieces until the water reaches every drain. [Demo](https://johnmorrisdotca.github.io/suido/).
- [Domino](https://github.com/johnmorrisdotca/domino) (ドミノ): dominoes and Mexican Train. [Demo](https://johnmorrisdotca.github.io/domino/).
- [Kotoba](https://github.com/johnmorrisdotca/kotoba) (言葉): word lists and word-game rules in English, French, German and Japanese. [Demo](https://johnmorrisdotca.github.io/kotoba/).
- [Sugoroku](https://github.com/johnmorrisdotca/sugoroku) (双六): backgammon and its variants, with the doubling cube and match play. [Demo](https://johnmorrisdotca.github.io/sugoroku/).
- [Kazu](https://github.com/johnmorrisdotca/kazu) (数): grid number puzzles: Sudoku and its variants, Futoshiki and Skyscrapers. [Demo](https://johnmorrisdotca.github.io/kazu/).
- [Meikyuu](https://github.com/johnmorrisdotca/meikyuu) (迷宮): mazes on squares, hexagons, triangles and circles, made from a seed and drawn through with a finger or the mouse. [Demo](https://johnmorrisdotca.github.io/meikyuu/).
- [Hikidashi](https://github.com/johnmorrisdotca/hikidashi) (引き出し): a drawer of small Japanese text tools: era dates, kanji numerals, readings and sentence difficulty. [Demo](https://johnmorrisdotca.github.io/hikidashi/).
- [Chizu](https://github.com/johnmorrisdotca/chizu) (地図): maps of the world and of countries' regions, in English and Japanese, with a quiz and callouts. [Demo](https://johnmorrisdotca.github.io/chizu/).
- [Bushu](https://github.com/johnmorrisdotca/bushu) (部首): find a kanji by the parts it is made of. [Demo](https://johnmorrisdotca.github.io/bushu/).
- [Tobiishi](https://github.com/johnmorrisdotca/tobiishi) (飛び石): peg solitaire with nine boards and seeded solvable challenges. [Demo](https://johnmorrisdotca.github.io/tobiishi/).
- [Jirai](https://github.com/johnmorrisdotca/jirai) (地雷): minesweeper on shaped grids with verified no-guess boards. [Demo](https://johnmorrisdotca.github.io/jirai/).
- [Gunjin](https://github.com/johnmorrisdotca/gunjin) (軍人): five hidden-rank strategy games with pass-the-device play. [Demo](https://johnmorrisdotca.github.io/gunjin/).
- [Karakuri](https://github.com/johnmorrisdotca/karakuri) (からくり): eight hyper-casual puzzle games, some of them physics: draw a shield, pull pins, cut ropes, slide blocks, pour tubes. [Demo](https://johnmorrisdotca.github.io/karakuri/).
- [Houseki](https://github.com/johnmorrisdotca/houseki) (宝石): gem and stone matching puzzles: falling triplets, stone collapse, colour chains and gem swap. [Demo](https://johnmorrisdotca.github.io/houseki/).
- [Kuni](https://github.com/johnmorrisdotca/kuni) (国): every country and its subdivisions, with ISO 3166 codes and names in English and Japanese. [Demo](https://johnmorrisdotca.github.io/kuni/).
- [Hata](https://github.com/johnmorrisdotca/hata) (旗): flags as SVG for every country, Japan's prefectures, Canada's provinces and the American states. [Demo](https://johnmorrisdotca.github.io/hata/).

**This package is Hata.** The demos of all twenty-six share one header and footer, so each links the rest.

## Development

```sh
pnpm install
pnpm check                # lint, types, build, every export's documentation, tests (sizes included), the packed package
pnpm test:package         # pack, install and import it as somebody who installed it would
pnpm test:demo            # build the demo and play it in a real browser, at a phone's width and a desk's
pnpm site                 # build the demo into site/, as the Pages workflow publishes it
pnpm screenshots:readme   # take the README's pictures from the built demo, in light and dark
pnpm data                 # rebuild src/flags, src/data and the lists in docs/ (no network, no browser)
pnpm data:compare         # draw every shipped flag beside its source, pixel by pixel
pnpm data:choose          # compare the drawings of every flag and choose what ships
pnpm docs:make            # rewrite docs/strings-ja.md after changing a word of the demo
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md); the commands are under [Development](#development), and the rules for the flags are in its own section. Please follow the [code of conduct](./CODE_OF_CONDUCT.md). A security concern is for the [security policy](./SECURITY.md), not a public issue.

## Changes

See [CHANGELOG.md](./CHANGELOG.md). The first version is 1.0.0.

## Licence

MIT, © John Morris. The flags are Wikimedia Commons' drawings, each under its own licence (public domain, CC0 or CC BY), and one from country-flag-icons (MIT); Wikidata (CC0) says which. [NOTICE.md](./NOTICE.md), which ships with the package, gives the credits and notices.
