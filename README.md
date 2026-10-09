<h1 align="center">Hata <sub>旗</sub></h1>

<p align="center"><strong>Hata 旗: flags as SVG for every country, and the regions of Japan, Canada, the United States, Australia, the United Kingdom, Germany, France, Switzerland, Austria and Brazil, keyed by ISO 3166 code.</strong><br>
At their true proportions, optimised and safe to inline, with the source, author and licence of every flag. One module per flag, a lookup that loads one by its code, frames for 4:3, square and round that never stretch or misrepresent a flag, and a <code>&lt;hata-flag&gt;</code> element to embed one anywhere. Zero dependencies.</p>

<p align="center" lang="ja">世界の国々と、日本・カナダ・アメリカ・オーストラリア・イギリス・ドイツ・フランス・スイス・オーストリア・ブラジルの地域の旗を、本来の縦横比の SVG で収録し、ISO 3166 のコードで引けるようにした、依存関係のない TypeScript パッケージです。</p>

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
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hata/main/docs/images/hero-desk-light.webp" alt="The demo on a desk, in English: the header with its language chooser, the API reference link, five cloth patches and the Help switch, then the Flags and Quiz tabs. The Flags tab has a search box, a menu of which flags to show (All, the countries, or one of ten countries' regions), a continent menu, the shapes Own, 4:3, 1:1 and Round, the line 463 of 464 flags with List (TXT) and Manifest (JSON) buttons, and the first rows of flags: Andorra, the United Arab Emirates, Afghanistan, Antigua and Barbuda, Anguilla and Albania, each with its name and code." width="600">
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

Hata is the flag set a site that already knows its countries and regions by ISO code (from [Kuni](https://github.com/johnmorrisdotca/kuni), say) can show beside them: 464 flags, every one drawn at the proportions its government gives it, as an SVG that scales to any size and looks the same on every system, which a flag emoji does not (Windows shows two letters). No other flag set has Japan's prefectures, all of Canada's provinces and territories, Germany's and Austria's states, Switzerland's cantons and Brazil's states together, or codes that match ISO 3166-2. Each flag is a module of its own, so a page carries only the flags it imports; one lookup loads any flag by its code when it is wanted. And every flag says where it comes from: the Wikimedia Commons file or the flag set it was drawn from, its author, its licence, and why that drawing was chosen. It works in [the demo](https://johnmorrisdotca.github.io/hata/) with nothing to install.

## In 30 seconds

```sh
npm install @johnmorrisdotca/hata
```

```ts
import japan from "@johnmorrisdotca/hata/flags/jp";     // one flag, one module: 158 bytes
import { flag } from "@johnmorrisdotca/hata/load";

element.innerHTML = japan;                             // an <svg> with a viewBox: it fills its box, never stretched
const tokyo = await flag("JP-13");                     // any flag by its code, loaded when asked
const round = await flag("ca", { shape: "round", label: "Canada" }); // drawn for the circle, red bars and all
await flag("XX");                                      // null: not a code with a flag
```

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
<hata-flag code="DE-BY" shape="round" size="48"></hata-flag>
```

Install the scoped name: an unscoped `hata` on npm, if there is one, is somebody else's package.

## Who it is for

- **Forms and profiles** that show where somebody is from, beside a country or a prefecture they picked.
- **Sites rendered on a server**, which need a flag as a string, not a component, with no network and no DOM.
- **Japanese-language sites** that need the 47 prefectures' flags, and Canadian, American, Australian, British,
  German, French, Swiss, Austrian and Brazilian ones that need their regions' flags, keyed the same way as their
  countries.
- **Any page at all**, with one script tag and a `<hata-flag>`, or an iframe where no script is allowed.
- **Maps, quizzes and games**, which frame flags as square tiles or round markers and must not stretch them.
- **Anybody who has to say where a picture came from**: every flag has its source, author and licence in the
  manifest, and the package ships nothing under a share-alike licence.

## Features

- **464 flags**: 245 of the 250 countries Kuni knows, 45 of Japan's 47 prefectures,
  12 of Canada's 13 provinces and territories, 57 of the United States' 57 states, district and outlying areas,
  8 of Australia's 8 states and territories, 3 of the United Kingdom's 4 countries, 16 of Germany's 16 states,
  16 of France's 26 regions and overseas collectivities, 26 of Switzerland's 26 cantons, 9 of Austria's 9 states
  and 27 of Brazil's 27 states and Federal District. The 19 codes with no flag are listed with their reasons:
  Northern Ireland has no flag of its own, and most of France's regions use a logo rather than a flag.
- **Disputed and alternative flags, offered side by side.** A place with more than one flag in real use has them all,
  each with a status (official, de facto, historical or local), dates, the reason it is offered and a source, and a
  `disputed` mark where more than one authority claims the place's flag: Afghanistan's Republic tricolour and the
  Taliban's flag, Bavaria's lozenges and stripes, Northern Ireland's Union Flag and former Ulster Banner, Syria's
  flag before and after 2024-12-08, and the local flag of each French territory beside France's. Hata takes no side
  and says why each default was chosen ([below](#disputed-and-alternative-flags)).
- **True proportions.** Japan's 2:3, Canada's 1:2, the United States' 10:19, Switzerland's square, Nepal's two
  pennants: each flag is shipped as its government draws it, and `frame()` puts it in a 4:3, square or round frame
  when that is what a layout needs, never stretched.
- **Frames that keep the flag, whole and cropped.** A crop from the centre turns Canada's square into a white square
  with a leaf, and shows the middle stripes of the United States' flag and not its stars. Every flag is offered both
  ways, `fit: "whole"` and `fit: "crop"`, and the default (`auto`) takes the crop only where it shows the flag fairly:
  kept at the side a person chose for 121 flags (the canton and a slice of the stripes for the United States, the Sun of
  May for Uruguay, the triangle for Cuba; 37 of them are shown whole by default, because no square crop holds them), from the centre where that keeps every colour, and the whole flag otherwise.
  The manifest says which, and why, for every flag and frame.
- **Embed it anywhere.** `<hata-flag>`, a custom element named for a screen reader in the page's language, an
  iframe page, and a builder in the demo that writes the code for an element, an `<img>`, an iframe, an ES module,
  React, Vue, Svelte or Angular.
- **The best accurate drawing.** Each flag's Commons drawing (the one Wikidata names, usually from its
  construction sheet) is compared in a browser with flag-icons', country-flag-icons' and circle-flags'; a set's
  drawing ships only where it is the same flag at the same proportions and smaller, or free where Commons' is not.
  Nothing is redrawn, and every shipped flag is proved to draw as its source does.
- **Safe to inline.** Scripts, event handlers, foreign objects and references outside the picture are refused at
  build time, and every id and class carries the flag's own prefix, so two flags in one page cannot collide.
- **Small where it matters.** The main entry is 11 KB (3.9 KB gzipped) and carries no flag; the median flag is
  under 800 bytes; the lookup is 25 KB and then the flag's own file.
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

It ships ES modules with types; nothing has a side effect but `/element/define`, which registers `<hata-flag>`.
Node 24 can also `require()` it.

### The entry points

| Entry | What it carries | Size |
| --- | --- | --- |
| `@johnmorrisdotca/hata` | The codes, `flagCode`, `flagUrl`, `frame`, `aspectOf`, `toDataUri`; no flag | 10 KB, 3.5 KB gzipped |
| `@johnmorrisdotca/hata/flags/<code>` | One flag's SVG string (`/flags/jp`, `/flags/jp-13`, `/flags/ca-on`, `/flags/de-by`, lower case); `/flags/<code>.1x1` and `.4x3`, flag-icons' drawing made for that frame, where there is one | median 755 bytes; 176 bytes for Japan |
| `@johnmorrisdotca/hata/load` | `flag(code, { shape, fit, variant })`, one dynamic import per flag | 26 KB, 5.7 KB gzipped, then the flag's own file (and a 3.6 KB gzipped table when a frame is asked for, and a 0.5 KB one when a variant is) |
| `@johnmorrisdotca/hata/names` | `flagName(code, lang)` and `flagAspect(code)`: each flag's place in English and Japanese, from Kuni | 24 KB, 8.7 KB gzipped |
| `@johnmorrisdotca/hata/element` | `<hata-flag>`: `defineFlag`, `FLAG_ELEMENT_NAME`, `FLAG_ELEMENT_ATTRIBUTES` | 8 KB, 2.8 KB gzipped, then /load and /names |
| `@johnmorrisdotca/hata/element/define` | Registers `<hata-flag>` when imported (`dist/element-define.js` on a CDN) | a line, then /element |
| `@johnmorrisdotca/hata/manifest` | Every flag's source, licence, author and why it was chosen, how each frame is made, the flags in real use besides (`variantsOf`), and the codes with no flag | 970 KB, 88 KB gzipped |
| `@johnmorrisdotca/hata/svg/<code>.svg` | Every flag as a file, for an `<img>`, a CSS `url()` or a CDN; `<code>.1x1.svg` and `.4x3.svg` too | the same as the module's string |
| `@johnmorrisdotca/hata/manifest.json` | The manifest as JSON | 848 KB |

### 1. One flag

```ts
import japan from "@johnmorrisdotca/hata/flags/jp";
import { svg as tokyo } from "@johnmorrisdotca/hata/flags/jp-13";
import bavaria from "@johnmorrisdotca/hata/flags/de-by";

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

### 3. Frames that never stretch, and never misrepresent

```ts
import { frame } from "@johnmorrisdotca/hata";
import { flag } from "@johnmorrisdotca/hata/load";
import canada from "@johnmorrisdotca/hata/flags/ca";

await flag("CA", { shape: "1:1" });                // flag-icons' square of Canada, drawn for the shape
frame(canada, { shape: "4:3" });                   // cropped from the centre: the crop keeps every colour
frame(canada, { shape: "1:1" });                   // the whole flag: a centre crop would lose the red bars
frame(canada, { shape: "1:1", fit: "cover" });     // the centre crop anyway, because you asked for it
frame(canada, { shape: "round", label: "Canada" }); // the whole flag on a neutral disc, with role="img" and a title

// Whole and cropped, for every flag: the crop is kept where a person judged the flag's meaning to be.
await flag("US", { shape: "1:1", fit: "whole" });  // all of the stars and stripes, in a square
await flag("US", { shape: "1:1", fit: "crop" });   // the canton and a slice of the stripes, not the middle stripes
frame(usa, { shape: "1:1" });                      // auto: the same crop, kept at the hoist
frame(usa, { shape: "1:1", fit: "whole" });        // the whole flag
```

#### Whole and cropped

Every flag is offered as the whole flag and as a crop, at 4:3, square and round. `fit: "whole"` (CSS's `contain`) shows
all of it. `fit: "crop"` crops it **at the side a person chose for that flag**, not at the middle: the United States and
Uruguay at the hoist, so that the canton or the Sun of May shows with a slice of the stripes; Rwanda at the fly, where its
sun is; Cuba, the Czech Republic and the other flags with a triangle or a serrated edge at the hoist at the hoist too;
and the Nordic crosses at the hoist, where the cross is. Where nobody chose a side the crop is from the centre (Japan's
disc, a coat of arms, a tricolour). `fit: "auto"`, the default, takes the crop where it shows the flag fairly and the whole flag
where it does not: a Blue Ensign (Australia, New Zealand, Fiji and the territories) has its Union Flag in one corner and its
stars or badge in the other, and no square holds both. A crop asked for by name always crops, even there, so a crop that
drops a colour is yours to ask for. `manifest(code).framings[shape].crop` records, for every flag and frame, which crop `auto`
uses (`own`, `curated`, `centre` or `whole`), the side (`at`), the reason (`why`) and the colours a crop at that side drops
(`loses`; a crop that drops a colour covering 5% of the flag is used by default only where the reason says why), and
[docs/framing.md](./docs/framing.md) lists every flag with its side and reason. The demo's flag panel shows the whole flag
beside its crop at each shape, and the gallery has a Whole / Cropped switch.

`pnpm data:framing` measured every flag's frames in a browser. A frame keeps a flag when every colour covering 5%
of the flag still covers at least half that share. For 4:3 and square it takes, in order: the flag itself where it
is that shape already; flag-icons' drawing made by hand for the shape, where it keeps the colours and draws the
same design; a crop from the centre, where that keeps them; and the whole flag otherwise. Round is the square's
choice in a circle. Where a person chose a side for the flag, a crop kept at that side comes before the centre one
(see "Whole and cropped" below). `flag(code, { shape })` uses all of these; `frame(svg)` works on the one SVG it is given,
so it crops or shows the flag whole, as measured for the flag the SVG names (`data-hata`). `manifest(code).framings`
says which for every flag, and a browser test fails if any frame of any flag loses a colour no reason excuses. Of the 430
pictures, 211 are drawn again for 4:3 and 212 for the square; `frame()` on a flag's own SVG crops at a chosen side for 81 and
83, from the centre for 308 and 276, and shows the whole flag for 36 and 43 (the rest are already that shape).

### 4. Embed it anywhere

One script tag and an element, for any page:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
<p>Where I live: <hata-flag code="CA-BC"></hata-flag> British Columbia</p>
<hata-flag code="JP-13" shape="round" size="48" border shadow></hata-flag>
```

| Attribute | What it does |
| --- | --- |
| `code` | The flag's code, in any case: `JP`, `jp-13`, `CA-ON`, `DE-BY` |
| `shape` | `own` (the default: its own proportions), `4:3`, `1:1` or `round`, framed as `flag(code, { shape })` frames it |
| `size` | Its height in CSS pixels; left out, `1em`, the height of the text around it, and any CSS height works |
| `variant` | Which of the place's flags in real use to draw, by its `id` from `variantsOf(code)`: `de-facto`, `stripes`, `local`; left out, the default |
| `fit` | `auto` (the default), `whole` (all of the flag), `crop` (a crop at the side chosen for the flag), `cover`, `hoist` or `contain`, as `frame()` takes them |
| `label` | What a screen reader says; left out, the place's name |
| `lang` | `en` or `ja`, the language of that name; left out, the language of the page where the element is |
| `theme` | `auto` (the default), `light` or `dark`: the colour of the border on a light or a dark page |
| `border`, `shadow` | A hairline round the flag (a white flag on a white page needs one), and a soft shadow |
| `loading` | `lazy` (the default: loaded as it comes near the screen) or `eager` |

It is drawn in the page's own document, with no shadow root: `role="img"` and an `aria-label`, and an `<img>` of
the flag inside, so it is crisp at any size and the page's CSS sizes it like any inline element
(`--hata-flag-border-light`, `--hata-flag-border-dark` and `--hata-flag-shadow` change the border and shadow).
Every attribute is a property too, as React 19, Vue and Svelte set them, and `await element.ready` waits for the
picture. It fires `hata-load` when drawn and `hata-error` when there is no flag for the code; then it draws nothing,
takes no room, and says why once on the console. These are the family's conventions, from
[Kyuubu](https://github.com/johnmorrisdotca/kyuubu)'s `<kyuubu-cube>`.

For a site that allows no scripts, an iframe of the demo's embed page, which takes the same attributes as its query:

```html
<iframe src="https://johnmorrisdotca.github.io/hata/embed.html?code=JP-13&amp;shape=round&amp;size=48" title="Flag of Tokyo" width="56" height="56" style="border:0" loading="lazy"></iframe>
```

In a framework, import the definition once and use the tag:

```ts
import "@johnmorrisdotca/hata/element/define";
// React 19: <hata-flag code="FR-20R" size={32} />
// Vue: <hata-flag code="FR-20R" size="32" /> (with isCustomElement for "hata-")
// Svelte: <hata-flag code="FR-20R" size="32" />; Angular: CUSTOM_ELEMENTS_SCHEMA
```

The [demo](https://johnmorrisdotca.github.io/hata/)'s detail panel has an **Embed this flag** builder: choose the
shape, the height, the language, the border, the shadow and the theme, see it live, and copy the exact code as a
custom element, a plain `<img>` of the CDN's file (framed by CSS as the package frames it), a data: URI, an iframe,
an ES module, React, Vue, Svelte or Angular. The builder is one self-contained module,
[`demo/embed-builder.js`](./demo/embed-builder.js), that names no product: Hata's options and the code only Hata
writes are in [`demo/embed-hata.js`](./demo/embed-hata.js).

### Disputed and alternative flags

A place can have more than one flag in real use. Hata ships them all, with a `status` for each, and **takes no political
side**: the default is the flag of the authority the world recognises (Afghanistan's Islamic Republic, which holds its seat
at the United Nations), or the place's own flag where it has one (Saint Helena's blue ensign, not the Union Flag), and
every other flag is one call away, never hidden and never the default by accident.

```ts
import { variantsOf, manifest } from "@johnmorrisdotca/hata/manifest";
import { flag } from "@johnmorrisdotca/hata/load";
import taliban from "@johnmorrisdotca/hata/flags/af--de-facto";

variantsOf("AF");
// [ { id: "republic", status: "official", default: true, from: "2013", … },
//   { id: "de-facto", status: "de-facto", default: false, from: "2021-08-15", why: "…", source: "https://…", module: "af--de-facto", drawing: { file, licence, author, … } } ]
manifest("AF")?.disputed;                             // true: two authorities claim it
await flag("AF");                                     // the Republic's tricolour
await flag("AF", { variant: "de-facto" });            // the Taliban's flag, framed like any flag: { shape, fit, label }
await flag("GB-NIR", { variant: "ulster-banner" });   // Northern Ireland has no flag of its own, so flag("GB-NIR") is null
```

```html
<hata-flag code="AF" variant="de-facto" size="48"></hata-flag>
```

- **`variantsOf(code)`** (from `/manifest`) lists a place's flags, the default first. Each has an `id`, an English and a Japanese
  `name`, a `status`, `from` and `until`, a `why`, a `source` (a page that documents the claim), `default`, the `module` that
  has its SVG (`/flags/af--de-facto`; the default's is the place's own) and the `drawing` it comes from: its Commons file, page,
  licence, author and size. `manifest(code)` carries the same list with `disputed` and `defaultVariant`.
- **Statuses.** `official`: adopted by the authority that has the right to. `de-facto`: flown by whoever holds the territory,
  without that recognition. `historical`: no longer official, and still flown. `local`: in use there, and not made the
  place's own flag by its authority.
- **`flag(code, { variant })`**, `flagDataUri` and `<hata-flag variant>` draw one; every frame option works on it, and it
  is framed as measured for its own picture. A code that is the same place as another (Guadeloupe's `FR-971` and `GP`) has that
  place's variants. An id the place does not have gives `null`.
- **A place with no flag of its own by default** is left out of `FLAG_CODES` and has a reason in `LEFT_OUT`, and its flags in
  use are its variants, asked for by name: Northern Ireland has had no flag of its own since 1973, so `flag("GB-NIR")` is `null`
  and `variantsOf("GB-NIR")` gives the Union Flag (official) and the former Ulster Banner (historical, 1953 to 1972).
- **The demo** puts a "disputed" mark on the card, a switch between a place's flags in its panel with the status, dates, reason
  and source of the one shown, and a `variant` field in the embed builder.

[docs/variants.md](./docs/variants.md) lists every variant with its reason, source, drawing and licence, and
[docs/decisions.md](./docs/decisions.md) says why each default was chosen and what is not offered, such as Libya's and Myanmar's
earlier flags and Saint-Martin's local flag.

### 5. An `<img>`, from the CDN or your own folder



```ts
import { flagUrl, toDataUri } from "@johnmorrisdotca/hata";

flagUrl("JP-13");                       // "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/jp-13.svg"
flagUrl("US-TX", { base: "/flags" });   // "/flags/us-tx.svg", for a copy of dist/svg/ in your own site
toDataUri(svg);                         // "data:image/svg+xml,…", smaller than base64
```

### 6. Where a flag comes from

```ts
import { leftOut, manifest } from "@johnmorrisdotca/hata/manifest";

manifest("JP-13");   // { source: "commons", file: "Flag of Tokyo Metropolis.svg", licence: { kind: "public-domain", … }, author, why, … }
manifest("YE")?.why; // why country-flag-icons' drawing was chosen over Commons'
manifest("CA")?.framings["1:1"]; // { method: "adapted", fit: "contain", source: "flag-icons", coverLoses: ["red 65% to 29%"], … }
leftOut("EH");       // { kind: "no-flag", reason: "Western Sahara has no flag of its own on Wikidata …" }
```

### 7. Names, for a caption or a screen reader

```ts
import { flagAspect, flagName } from "@johnmorrisdotca/hata/names";

flagName("DE-BY");        // "Bavaria"
flagName("DE-BY", "ja");  // "バイエルン自由州"
flagAspect("CH");         // 1: Switzerland's flag is square
```

### In a page, with no bundler

```html
<img src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/jp-13.svg" alt="Tokyo" height="48">
<img src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/svg/ca.1x1.svg" alt="Canada" height="48" style="border-radius:50%">
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

A flag's SVG file in an `<img>` behaves like any picture, so CSS frames it without stretching it too. Use
`manifest(code).framings` to frame it as the package does: the `.1x1.svg` or `.4x3.svg` file where the method is
`adapted`, `object-fit: contain` where the fit is `contain`, and `cover` otherwise, with `object-position: left` (or
`right`) where the fit is `crop` and `crop.at` says so.

```css
.tile img { width: 48px; height: 36px; object-fit: cover; }                       /* 4:3 */
.marker img { width: 32px; height: 32px; object-fit: cover; border-radius: 50%; } /* round */
.marker img.whole { object-fit: contain; background: #e6e6e6; }                   /* where a crop would lose a colour */
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
| `@johnmorrisdotca/hata/load` | `flag`, `flagDataUri` and the types `FlagOptions` and `FrameOptions` |
| `@johnmorrisdotca/hata/names` | `flagName`, `flagAspect` and the type `NameLanguage` |
| `@johnmorrisdotca/hata/element` | `defineFlag`, `FLAG_ELEMENT_NAME`, `FLAG_ELEMENT_ATTRIBUTES`, and the types `HataFlagElement` and `FlagElementEventDetail` |
| `@johnmorrisdotca/hata/element/define` | `defineFlag`, after registering `<hata-flag>` |
| `@johnmorrisdotca/hata/manifest` | `MANIFEST`, `LEFT_OUT`, `manifest`, `leftOut`, `variantsOf`, and the types `FlagRecord`, `Framing`, `FramingCrop`, `LeftOutRecord`, `LicenceKind`, `FlagSource` and `Variant` |

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
  framings: Record<"4:3" | "1:1" | "round", {
    method: "own" | "adapted" | "cover" | "crop" | "contain";  // how flag(code, { shape }) frames it
    fit: "cover" | "crop" | "contain";  // what frame() does with the flag's own SVG
    crop: { rule: "own" | "curated" | "centre" | "whole"; at: "left" | "right" | "top" | "bottom" | "centre"; why: string | null; loses: string[] };  // which crop, at which side, and why
    source: "flag-icons" | null; file: string | null; page: string | null; bytes: number | null;  // an adapted drawing
    coverLoses: string[];         // what a centre crop would lose: ["red 65% to 29%"]
  }>;
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
   Commons' is not. On 2026-10-09 Commons' drawing won 462 times and country-flag-icons' once (Yemen, where
   Commons' file is marked CC BY-SA). Where a set draws a different design (an old flag, a local flag, a
   simplified emblem), the place was looked at and the verdict written down ([docs/compared.md](./docs/compared.md)).
4. **Each is optimised and checked** (`pnpm data`): SVGO 4, rounding measured per flag, ids prefixed, anything
   that could reach outside the picture refused, and `pnpm data:compare` proves every one draws within 0.1% of
   pixels of its source at 960 pixels wide.

Only drawings in the public domain, under CC0, under CC BY or under MIT are shipped. [docs/provenance.md](./docs/provenance.md)
lists every flag with its file, licence, author and why; [docs/left-out.md](./docs/left-out.md) the 19 codes with
no flag; [docs/decisions.md](./docs/decisions.md) the judgement calls, including the six flags left out for their
licence, which of France's regions have a flag, Germany's and Austria's civil flags, and the places where the
sources disagree on the design, each with a recommendation, and [docs/variants.md](./docs/variants.md) every place's other flags in real use.

## Sizes

Measured on 2026-10-09, SVG as shipped and gzipped at level 9:

| Set | Flags | SVG | Gzipped | Median flag |
| --- | --- | --- | --- | --- |
| Hata, the countries | 238 pictures | 1,997 KB | 669 KB | 562 B |
| Hata, Japan's prefectures | 45 | 24 KB | 14 KB | 456 B |
| Hata, Canada's provinces and territories | 12 | 370 KB | 131 KB | 14 KB |
| Hata, the American states and areas | 50 pictures | 4,854 KB | 1,767 KB | 85 KB |
| Hata, Australia's states and territories | 8 | 124 KB | 38 KB | 11 KB |
| Hata, the United Kingdom's countries | 3 | 13 KB | 6 KB | 208 B |
| Hata, Germany's states | 16 | 228 KB | 79 KB | 312 B |
| Hata, France's regions (the overseas ones fly their country code's flag) | 3 pictures | 66 KB | 15 KB | 19 KB |
| Hata, Switzerland's cantons | 26 | 220 KB | 69 KB | 4 KB |
| Hata, Austria's states | 6 pictures | 1 KB | 1 KB | 171 B |
| Hata, Brazil's states | 27 | 510 KB | 145 KB | 935 B |
| Hata, the drawings made for a frame (flag-icons' 4:3 and square) | 425 | 2,792 KB | 935 KB | |
| flag-icons 7.5.0, 4:3 (a crop, not the true proportions) | 271 | 1,955 KB | 651 KB | 804 B |
| country-flag-icons 1.6.20, 3:2 (simplified) | 265 | 174 KB | 87 KB | 479 B |
| circle-flags 2.8.3 (round) | 430 | 301 KB | 159 KB | 585 B |

The countries weigh what flag-icons' do, at their true proportions. The American states are most of the package
because their flags carry full seals, drawn as they are (Virginia's is 372 KB); 55 flags are over the 40 KB
budget, and 12 drawings made for a frame, listed in [docs/sizes.md](./docs/sizes.md). A page pays only for the flags it imports or loads.

## Theming

A flag is its government's colours, so there is nothing to theme in it. What a page chooses is the frame: its
shape (`flag(code, { shape })`, `frame()` or CSS `object-fit`), a border or a shadow (`<hata-flag border shadow
theme="dark">`, and its three CSS custom properties) (a white or pale flag needs one on a white page, and a
dark one on a dark page), and its size. The demo is the worked example: [`demo/demo.js`](./demo/demo.js) and
[`demo/hata.css`](./demo/hata.css), over the family's shared stylesheet.

## Limits

| Limit | Value | Where |
| --- | --- | --- |
| Countries | 245 of the 250 Kuni knows | `FLAG_CODES` |
| Subdivisions | the first level of Japan (45 of 47), Canada (12 of 13), the United States (56 of 57), Australia (8 of 8), the United Kingdom (3 of 4), Germany (16 of 16), France (16 of 26), Switzerland (26 of 26), Austria (9 of 9) and Brazil (27 of 27) | `FLAG_CODES` |
| Codes with no flag | 19 codes, each with its reason | `LEFT_OUT`, [docs/left-out.md](./docs/left-out.md) |
| Licences | public domain, CC0, CC BY and MIT only | `manifest(code).licence` |
| Largest flag | 372 KB (Virginia); 55 over the 40 KB budget | [docs/sizes.md](./docs/sizes.md) |

Not here: other countries' regions (Spain's, Italy's, Mexico's and India's wait, for the reasons in
[docs/decisions.md](./docs/decisions.md)), the United Kingdom's counties (Kuni lists the four countries only), cities, historical flags, ensigns and standards, and raster pictures. A flag's
licence covers the drawing; using a country's flag or seal may still be limited by its law (Commons marks most
flags "insignia"), which [NOTICE.md](./NOTICE.md) explains.

## Accessibility

A flag is a picture, so what Hata can do is make it easy to name.

- **A label on request.** `frame(svg, { label })` and `flag(code, { label })` give the SVG `role="img"`, an
  `aria-label` and a `<title>`; an `<img>` takes the place's name as its `alt`.
- **Named by default in the element.** `<hata-flag>` is `role="img"` with the place's name from Kuni as its
  `aria-label`, in English or Japanese by the page's language, unless `label` says otherwise; a code with no flag
  leaves no unnamed picture behind.
- **A frame that does not mislead.** A square or round flag never drops the colours that make it the flag.
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

- The first level of more countries' regions, a whole country at a time: Spain and Italy once their regions'
  drawings on Commons are free (several are CC BY-SA), Mexico and India only for the states with an official flag.
- The six flags left out for their licence, by decision or by a public-domain drawing on Commons
  ([docs/decisions.md](./docs/decisions.md)).
- A simplified drawing of the heaviest seals, as an option beside the full one, never in its place.

Left out on purpose: a React or other framework component (`<hata-flag>` works in every framework), redrawn flags,
and anything under a share-alike or GPL licence.

## Architecture

```text
src/
├── index.ts            the main entry: the codes, flagCode, flagUrl, and the helpers from svg.ts
├── svg.ts              aspectOf, frame and toDataUri: pure string work on a flag's SVG
├── load.ts             the "/load" entry: a flag by its code, by dynamic import, framed as measured
├── names.ts            the "/names" entry: each flag's place in English and Japanese, and its aspect ratio
├── element.ts          the "/element" entry: <hata-flag>
├── element-define.ts   the "/element/define" entry: registers <hata-flag>
├── reflect.ts          an element's attributes as properties too, the family's way
├── manifest.ts         the "/manifest" entry: every flag's record, and the codes left out
├── manifest.types.ts   the shapes of a flag's record, a frame and a code left out
├── version.ts          the package's version
├── data/               written by scripts/build-data.ts: the codes, the loaders, the variants' loaders, the names, the frames, the manifest
└── flags/              written by scripts/build-data.ts: the "/flags/<code>" entries, the "<code>--<id>" variants, and the ".1x1" and ".4x3" drawings
```

`scripts/build-data.ts` (`pnpm data`) makes `src/flags/` and `src/data/` from the inputs in `data-sources/` and the
flag sets in `node_modules`, with no network and no browser, and checks every input's SHA-256 first; run twice, it
leaves the tree as it was. `scripts/choose.mjs` (`pnpm data:choose`) is the comparison that decides which drawing
ships; `scripts/framing.mjs` (`pnpm data:framing`) measures how each flag is framed; `scripts/optimise.ts` is the SVGO settings and the safety checks; `scripts/data-config.ts` holds the few
things decided by hand. Tests sit beside the code (`*.test.ts`). `scripts/` also builds the demo and its API page,
checks every export's documentation and checks the package as npm packs it; `demo/` is the page and `e2e/` its
browser tests.

## Data and licences

| What | From | Licence |
| --- | --- | --- |
| Which file is each place's flag | Wikidata, a snapshot of 2026-10-09 | CC0 |
| 462 flags' drawings | Wikimedia Commons, each file's own licence: 450 public domain, 10 CC0, 2 CC BY 2.5 (Saint Barthélemy's one picture, under two codes) | as stated on each file's page |
| Yemen's drawing | country-flag-icons 1.6.20 | MIT |
| The 425 drawings made for a frame | flag-icons 7.5.0 | MIT |
| The drawings compared but not shipped | circle-flags 2.8.3 | MIT |
| The places' names, in the docs, the demo, `/names` and `<hata-flag>` | Kuni 1.1.0 (Unicode CLDR and Wikidata) | MIT, Unicode-3.0, CC0 |
| The pipeline, the frames, the lookups and the demo | written for this package | MIT |

[NOTICE.md](./NOTICE.md) carries the credit CC BY asks for, country-flag-icons' and flag-icons' MIT notices, and the note on
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
