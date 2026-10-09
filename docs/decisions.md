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

On 2026-10-09 that gave 462 drawings from Commons and one from country-flag-icons. No set drawing was both the
same flag and 10% smaller: Commons' simple flags already optimise to a couple of hundred bytes, and where a set's
drawing is smaller it is because it is simplified (a smaller emblem, a disc of the wrong size, another shade),
which is not the same flag. Japan is the example: country-flag-icons' disc is 0.56 of the height where the law
says 0.6.

## Yemen: a flag set's drawing, because Commons' file is marked CC BY-SA

Commons' machine-readable licence for *Flag of Yemen.svg* reads CC BY-SA 4.0, though the page's own permission
field says `{{PD-Yemen}}{{PD-ineligible}}` and carries no Creative Commons template. country-flag-icons draws the
same three bands at the same 2:3, under MIT, so it ships, and the manifest says why. A tricolour is not
copyrightable anyway; the choice only keeps the package's licensing simple.

## Which countries' regions are here, and how one is added

1.1.0 added the first level of Australia, the United Kingdom, Germany and France, and then of Switzerland, Austria
and Brazil, to Japan's, Canada's and the United States'. A country comes in whole or not at all: every first-level
code Kuni (1.1.0) gives it has a flag here or a reason in `docs/left-out.md`, and the coverage test holds the
list. The codes and names are Kuni's; Wikidata names each one's flag, as for a country, so the same rules, the same
licence check, the same comparison with the flag sets and the same pixel proof apply. `SUBDIVISION_COUNTRIES` in
`scripts/data-config.ts` is the list.

- **Australia**: all eight states and territories, each the government's flag, every one public domain.
- **The United Kingdom**: England (St George's Cross), Scotland (the Saltire) and Wales (the Red Dragon).
  **Northern Ireland has no flag of its own**: since the Parliament of Northern Ireland was abolished (1973) the
  only official flag there is the Union Flag. The Ulster Banner (the old government's, 1953 to 1972) and St
  Patrick's Saltire are each flown by one community and not the other, and Wikidata gives neither. It is left out
  with that reason. **The counties** are not here because Kuni lists only the four countries at the first level.
  When Kuni lists counties, the rule would be the Flag Institute's UK Flag Registry: a county flag registered
  there is in public use and has a public-domain drawing on Commons for most; a county with none (most council
  areas, the metropolitan boroughs) would be left out with that reason. For the maintainer: ship the Union Flag for
  `GB-NIR` instead (as the package does for Saint Helena), which is a line in `NO_FLAG`.
- **Germany**: all sixteen states, each its **civil flag** (Landesflagge), the one anybody may fly. Where a state
  has a service flag with the arms as well (Landesdienstflagge), it is not used: Baden-Württemberg's black and
  gold, Hesse's red and white, Saxony's white and green, Thuringia's white and red, and the plain flags of
  Mecklenburg-Vorpommern, North Rhine-Westphalia and Schleswig-Holstein. Five states' only flag carries the arms,
  so the arms ship: Brandenburg, Lower Saxony, Rhineland-Palatinate, Saarland, and Saxony-Anhalt (whose plain
  black and yellow was abolished by its 2017 law, for being confused with Baden-Württemberg's). Berlin's bear and
  Hamburg's castle are their civil flags. **Bavaria** has two of equal standing, white and blue in lozenges or in
  stripes; Wikidata ranks neither first, and `CHOSEN` takes the lozenges, the one the state government flies. For
  the maintainer: the stripes are one line, if they are preferred.
- **France**: 16 of the 26 codes. **Overseas**, the 12 codes that are also country codes (FR-971 Guadeloupe and
  GP, FR-972 and MQ, FR-973 and GF, FR-974 and RE, FR-976 and YT, and FR-BL, FR-MF, FR-NC, FR-PF, FR-PM, FR-TF,
  FR-WF) take their country code's flag through `SAME_PLACE`, so the open decision about the French territories
  below is made once and both codes follow it; Clipperton Island (FR-CP) flies France's flag, as Wikidata says.
  **The thirteen metropolitan regions**: a region has a flag here only where the flag is its own and in public use
  as the region's, adopted by its council or the established flag of the same territory. That is **Corsica**
  (the Moor's head, the Collectivity's flag), **Nouvelle-Aquitaine** (its council's flag since 2016, the lion and
  the waves) and **Normandy** (the two leopards, the region's flag since the two Normandies were joined in 2016,
  flown across it and the centre of the council's logo). **Brittany**'s Gwenn-ha-du is just such a flag, but
  Commons' drawing is CC BY-SA 4.0, so it is left out for its licence (below). The other nine use a logo, and the
  banners on Commons for them join the arms of old provinces in designs nobody adopted: Auvergne-Rhône-Alpes,
  Bourgogne-Franche-Comté, Centre-Val de Loire, Grand Est, Hauts-de-France, Île-de-France, Occitanie (whose
  Occitan cross belongs to the wider cultural region), Pays de la Loire and Provence-Alpes-Côte d'Azur (Provence's
  own flag covers part of it). Each is in `NO_FLAG` with its reason.
- **Switzerland**: all 26 cantons, square as Switzerland's flag is, every one public domain. Graubünden's drawing
  that Wikidata names is 0.90:1; `NAMED` uses Commons' square drawing of the same flag.
- **Austria**: all nine states, each its civil flag: Wikidata gives Upper Austria and Tyrol (preferred) their
  service flags with the arms, so `NAMED` uses their plain white over red, which they share; Salzburg, Vienna and
  Vorarlberg share red over white. Six pictures for nine codes.
- **Brazil**: all 26 states and the Federal District, each the state's official flag, every one public domain.

**Waiting, and why.** Each could come in with a decision; none could be made complete and clean today:

- **Spain**: seven of the nineteen communities' drawings on Commons are CC BY-SA (the Basque Country, Cantabria,
  Melilla, Andalusia, Aragon, Ceuta, and Asturias' preferred gala flag), and no MIT set draws them at their
  proportions. Shipping twelve of nineteen is not careful expansion.
- **Italy**: five of twenty regions' drawings are CC BY-SA (Veneto, Tuscany, Apulia, Sardinia, Emilia-Romagna, the
  last only a de facto flag).
- **Mexico**: most states have no official flag; Wikidata names one for 14 of the 32, several of them unofficial
  white banners with the state's arms.
- **India**: no state has an official flag (Jammu and Kashmir's ended in 2019); Wikidata names two, Karnataka's
  proposed one and Delhi's, and neither is adopted.

## For the maintainer: seven flags left out for their licence

Each is on Commons under a licence that is not public domain, CC0 or CC BY, and no MIT set draws it at its true
proportions. Bringing one in is a line in `ACCEPTED` in `scripts/data-config.ts`, with the decision in words.
Brittany's joined them in 1.1.0.

| Code | Place | What Commons states | Recommendation |
| --- | --- | --- | --- |
| `US-MS` | Mississippi | "Copyrighted free use": the holder allows any use for any purpose, with no condition | **Accept.** It is freer than CC BY; it was left out only because it is not one of the three named licences. |
| `OM` | Oman | Open Government Licence – Oman 1.0, attribution required | **Accept with credit**, once someone has read the licence's terms (oman.om); it is meant to work like CC BY. |
| `JP-34` | Hiroshima | No licence template at all: the page carries only `{{Insignia}}` | **Fix at the source**: the drawing is a 1966 prefectural emblem, like the 44 others that Commons marks PD-Japan-organization or PD-ineligible. A licence template added on Commons brings it in with the next `pnpm data:commons`. |
| `CA-MB` | Manitoba | CC BY-SA 4.0 (a drawing from the Canadian Heraldic Authority's register) | **Leave out**, or name a public-domain drawing of the same flag on Commons if one is made. Share-alike would bind every user of the package. |
| `CC` | Cocos (Keeling) Islands | CC BY-SA 4.0 | **Leave out**, as Manitoba. |
| `JP-37` | Kagawa | CC BY-SA 3.0 and GFDL, with the note "If you will use this file, you must get Kagawa Prefecture approval" | **Leave out.** |
| `FR-BRE` | Brittany | CC BY-SA 4.0 | **Fix at the source**: the Gwenn-ha-du is nine stripes and eleven ermine spots, a 1923 design; a public-domain drawing on Commons (or a PD template on this one, which its author could add) brings it in. Until then, leave out. |

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

## Frames: no frame may misrepresent a flag

1.0.0 framed a flag at 4:3, square or round by cropping it from the centre unless asked otherwise. That turned
Canada's square into a white square with a leaf, which reads as another flag. Since 1.1.0 each flag's frames are
measured (`pnpm data:framing`, `scripts/framing.mjs`) and recorded in `scripts/framings.data.json` and every
record's `framings`:

- **The test of a frame**: every colour that covers at least 5% of the flag still covers at least half that share
  of the frame (colours by name, so a shade does not count). The same test runs in the browser suite on every frame
  of every flag as `/load` hands it out (`e2e/framing.demo.mjs`), and it fails on Canada's centre crop.
- **What is used**, for 4:3 and square: the flag itself where it is that shape; else **flag-icons' drawing made by
  hand for that shape**, where it passes the test and flag-icons is not listed in `docs/compared.md` as drawing
  another design (it is MIT, ships as `/flags/<code>.4x3` and `.1x1`, and is optimised and proved pixel by pixel
  like every flag); else a **crop from the centre** where it passes; else **the whole flag**, with clear bands.
  Round is the square's choice in a circle; a circle may crop only where the square may, and shows the whole flag
  on a neutral disc otherwise. A crop from the hoist is used only where `FOCUS` records that a flag's meaning is
  at the hoist, because the colour test alone would pass a hoist crop of Canada that keeps half the leaf; `FOCUS`
  is empty.
- **Why prefer flag-icons' drawing to a crop that passes**: it is laid out for the shape by a person, which a crop
  cannot be. The cost is size: 425 drawings, 2.8 MB in the package, of which a page loads only the frames it asks for.
- **`frame(svg)`** works on the one SVG it is given, so it cannot use another drawing: its default, `fit: "auto"`,
  crops where a crop passes and shows the whole flag where not, read from the name each shipped SVG carries
  (`data-hata="ca"`). An SVG that names no flag of this package is shown whole. **This changes 1.0.0's default**,
  which was always a crop; `fit: "cover"` gives the old frame.

On 2026-10-09: 212 flags drawn again for 4:3 and 213 for the square, 215 and 183 cropped, 2 and 10 shown whole
(Sri Lanka, Timor-Leste, the Bahamas, Jamaica, Burundi, South Sudan, Wallis and Futuna, Santa Catarina, Yukon,
the Northwest Territories).

## Embedding: the family's conventions

`<hata-flag>` follows Kyuubu's `<kyuubu-cube>`: `defineFlag(name?)`, `FLAG_ELEMENT_NAME`,
`FLAG_ELEMENT_ATTRIBUTES`, every attribute a property too (`reflect.ts`, the same helper), drawn in the page's
document with no shadow root, `lang` and `theme` as in the family, events named for the package (`hata-load`,
`hata-error`), `dist/element-define.js` for a script tag and `/element/define` for a bundler, and an `embed.html`
that takes the attributes as its query and posts its events to the page around it. Where it differs:

- **`size` is a height in pixels**, as a flag in a line of text needs, and left out it is `1em`. Kyuubu's `size` is
  the cube's dimension (3 for 3×3). The family standard should give `size` one meaning, or name a pixel size
  `height` or `width` everywhere.
- **It is `inline-block`**, not Kyuubu's `block`: a flag sits in a sentence. Its base styles are a stylesheet put at
  the head of the document, so the page's CSS overrides them without `!important`, where Kyuubu writes
  `style.display` on the element.
- **The builder** (`demo/embed-builder.js`) names no product, so it can move to the family's template unchanged;
  Kyuubu's `builder-code.js` still names its makers and its required options inside. Hata's side is
  `demo/embed-hata.js`: the options, and the formats only Hata writes (`<img>`, a data: URI, an ES module).

## The size budget

A flag's budget is 40 KB of SVG, and no flag may be over 400 KB. 55 flags are over the budget, all of them
because they carry a detailed coat of arms or seal drawn as it is: most of the American states (Virginia 372 KB,
New York, Pennsylvania, Idaho, Louisiana, Florida, Vermont, West Virginia), Prince Edward Island, and countries
with full arms (El Salvador, Ecuador, Spain, Mexico, the Falklands, the Vatican, Haiti); since 1.1.0 also Saarland,
Geneva, and six of Brazil's states (Alagoas, Rio Grande do Norte, Rio Grande do Sul, Paraná, Rio de Janeiro, Santa
Catarina), and twelve of flag-icons' drawings made for a frame (Serbia's, Bolivia's, Mexico's, Spain's, El
Salvador's and Montenegro's, at 4:3 and square). They are shipped, because
a simplified seal is not the state's flag; [sizes.md](sizes.md) lists them and the size test holds the list, so a
new one is noticed. A page pays only for the flags it imports or loads.

## Rounding, and the plugins left off

SVGO's `convertTransform` is off: on Niue's flag it moved the stars off the Union Jack. Every drawing is rounded
to the fewest decimals at which it still draws within 0.1% of pixels of its source at 960 pixels wide, measured by
`pnpm data:choose`, because a flag drawn inside a scaled group (Iran's emblem, Fukuoka's mark) needs more decimals
than its viewBox suggests. One drawing, the Northwest Territories', keeps its path data as drawn, because
`convertPathData` changes it visibly at any precision.
