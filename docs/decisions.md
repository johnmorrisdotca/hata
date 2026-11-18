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

## Official proportions: which are on file, and what "true" means

`scripts/official-flags.data.json` records, for 50 countries, the ratio a law or a government page gives, with its
page and whether the text was read. The 50 are the G20 countries (the EU is not a country), countries with a space
agency or a launch site, other large or well-known states of Europe, Asia and Africa, and Togo and Oman, which the
review named (Argentina is a G20 member). A test (`src/official-flags.test.ts`) holds every recorded
ratio to the shape the flag ships at; the file records what a government says and changes no drawing
(`scripts/official-ratios.data.json` is the one that does).

- **35 have an official ratio and every one matches the drawing**: 24 from a law (a constitution, an act, a decree) and
  11 from a government page. 27 of the 50 entries were read in the source's own text. For the others the source was
  found by a search but could not be opened here (`"read": false`), and they are the first to re-read.
- **Where no law fixes the shape**, the flag ships at the shape its Commons drawing has, and the data says "no official
  ratio": the United Kingdom (the Flag Institute's 3:5 is not a government's), France, Austria (2:3 is only for the
  federal service flag), Colombia and Togo. For Togo the 3:2 of the shipped file is not the constitution's: sources
  outside the government give 1:1.618, 3:5 and 2:3.
- **Left open**, because the text could not be read from here: Argentina (Decreto 1650/2010 hands the measures to IRAM
  standards that are not free to read; the 8:5 shipped is Commons'), Belgium, Egypt, Finland, Greece, Iran, Nigeria,
  the Netherlands, Türkiye and Ukraine.
- **Luxembourg's law allows two shapes**, 5:3 and 2:1; 5:3 is shipped.
- **The United States' 1:1.9** comes from the standard sizes of Executive Order 10834 (section 21); its drawing of the
  proportions is an attachment the Federal Register page does not show.

## Official colour values, beside the shipped ones

`scripts/official-colours.data.json` puts a government's own screen value (RGB or hex) beside the hex a drawing ships,
with the page. Nothing is redrawn: the drawings keep Commons' colours. A pair further apart than ΔE 5 (CIEDE2000: 2 is
seen on close inspection, 5 at a glance) is marked `mismatch`, and `src/official-colours.test.ts` holds the marks to the
numbers. Only a screen value counts; a Pantone, RAL, NCS or CIE value with no RGB (Sweden's, Poland's, Italy's,
Luxembourg's) is not recorded, because turning one into hex would be our guess, not the government's.

- **Germany**: the shipped red `#dd0000` is ΔE 7.4 from `#FF0000` and is marked; the gold `#ffce00` is ΔE 0.7 from
  `#FFCC00`. The values are the Federal Government's 2020 specification as Flags of the World reproduces it: the
  government's own document was not found online, so this is *reported*, not read. The 1996 Anordnung names the colours
  and gives no value, and the Interior Ministry told a correspondent in 1998 that it had fixed no shade.
- **Canada**: the Federal Identity Program's red is RGB 235/45/55 (`#EB2D37`), ΔE 6.8 from the shipped `#d52b1e`, and
  marked. The page names it for the FIP flag symbol and does not say it is the national flag's red, and Canadian
  Heritage's description of the flag gives no value (it points to CGSB standards).
- **Indonesia** (`#ff0000` and `#ffffff`, Undang-Undang 24/2009) and **Switzerland** (`#ff0000`, Annex 2 of SR 232.21)
  agree with their laws exactly.
- **For the maintainer**: whether a marked pair should ship the official value, as a changed colour in a drawing that is
  otherwise Commons' (the "nothing is redrawn" rule says no). Until then the package ships Commons' red for both.

## The detail review of eight flags with small emblems (Kenya, Slovakia, Angola, Zimbabwe, Mozambique, Mongolia, Iran, Uzbekistan)

The audit of 2026-10 marked these eight by byte size alone (1.0 to 1.9 KB; `docs/audit-2026-10.md`, "Detail") and left the
look to a person. On 2026-11-18 each shipped drawing was drawn at 1000 pixels beside the other public domain or CC0 Commons drawings
of the same flag that name an official source (a construction sheet made from the law, or a drawing taken from the state's own
text), and looked at. **None is simplified in a way that shows at the size of a flag; the byte count caught emblems that are simple
by design.** Nothing is changed. This is a look by one person, not a measurement, and the governments' own drawings were
not downloaded: where a Commons file is cited below, it cites the law or the government page, not the other way round.

| Code | Shipped | Beside | Seen |
| --- | --- | --- | --- |
| `KE` | 1.0 KB | "Flag of Kenya (2010 constitution).svg" (public domain, 3.4 KB, traced from the flag in the Constitution on parliament.go.ke) | The same shield, spears and white lens; the other draws the spearheads as separate blades and the centre oval wider. Not simplified. |
| `SK` | 1.2 KB | "Flag of Slovakia (construction sheet).svg" (public domain, 5.8 KB, from the annexes of Act 63/1993) | The same shield, double cross and three hills in the same place. Not simplified. |
| `AO` | 1.6 KB | "Flag of Angola using the specifications prescribed in "Manual Simbolos Nacionais", V01.05.2021D.svg" (public domain, 4.0 KB, uploaded 2026-04-21) | The same cogwheel, machete and star. The manual file's black is `#1f1f1f` where the shipped drawing has `#000000`: a colour question, not a detail one, not decided. |
| `ZW` | 1.8 KB | "Flag of Zimbabwe (construction sheet).svg" (public domain, 12.4 KB, from the Flag of Zimbabwe Act's schedule) | The Zimbabwe Bird has the same detail on its base and body. Not simplified. |
| `MZ` | 1.9 KB | no fuller public domain drawing found on Commons (the search turned up only the CIA's drawing and variants) | The rifle with its bayonet, the book, the hoe and the star are all drawn. Kept. |
| `MN` | 1.2 KB | "Flag of Mongolia (construction sheet).svg" (public domain, 14.4 KB) and "Flag of Mongolia (CMYK).svg" (CC0, 6.8 KB) | The same soyombo, shape for shape. Kept. |
| `IR` | 1.3 KB | "Flag of Iran (WFB 2004).svg" (public domain, 4.3 KB, the CIA's) | The emblem is the usual one; the writing along the two bands is drawn as a stylised repeating pattern, as on Commons' standard file, and the CIA's drawing has the same detail. Kept. |
| `UZ` | 1.3 KB | "Flag of Uzbekistan (Lex.uz).svg" and "(Constitution.uz).svg" (public domain, 1.2 and 1.3 KB, colours from the state's legal database and government sites) | The same crescent and twelve stars (3, 4 and 5). Only the shades differ. Kept. |

What was not done: the law's own drawing was not set beside the flag (Kenya's Constitution, Slovakia's Act 63/1993, Mongolia's and
Uzbekistan's flag laws, Angola's Manual de Símbolos Nacionais), and Mozambique's and Iran's constitutions give a description, not a drawing.
If a stricter check is wanted, that is the next one.

## Flag facts: the first slice (adoption and meaning of the 33 dated countries)

`scripts/flag-facts.data.json` holds, for each of the 33 countries with dated flags, when today's flag was adopted and what its colours
or symbols mean. **Adoption** is the dated flag's own `from`, `source` and `sourceKind`, repeated so the facts are in one place; a test
holds them to the dated flag, so they cannot drift. **Meaning** is one sentence in English and one in Japanese, in our own words (no text is
copied), and only where an official page states it: **5 of the 33 have one** (Argentina: the sun of the first coin; Indonesia: red and
white, from the explanation of Undang-Undang 24/2009; Iran: the three colours, from the Islamic Revolution Document Center; South
Korea: the taegeuk and trigrams, from the National Archives; Kazakhstan: the blue, from the President's site). The other 28 are `null`:
no official statement was read. Many laws only describe a flag, and a meaning from a book or an encyclopedia is not offered as official.
The Korean sentence is read from the archives' account of the first flag of 1882, whose symbols are the same. Not done yet: the rest of
the 33, a `hata/facts` entry that serves them (`flagFacts(code)`), the designer, and the other countries.

## Yemen: Commons' own drawing again, since its licence reads public domain

Until the Commons snapshot of 2026-11-02, Commons' machine-readable licence for *Flag of Yemen.svg* read CC BY-SA 4.0,
though the page's own permission field said `{{PD-Yemen}}{{PD-ineligible}}` and carried no Creative Commons template,
so country-flag-icons' drawing of the same three bands (MIT) shipped. The page now reads public domain (Commons'
licence field, `PD-Yemen`, `PD-ineligible`), the file itself is the same one (SHA-1 unchanged), and Commons' drawing
is the reference, so `pnpm data:choose YE` chooses it. It is drawn at the same 3:2 as before.

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
- **France**: 17 of the 26 codes. **Overseas**, the 12 codes that are also country codes (FR-971 Guadeloupe and
  GP, FR-972 and MQ, FR-973 and GF, FR-974 and RE, FR-976 and YT, and FR-BL, FR-MF, FR-NC, FR-PF, FR-PM, FR-TF,
  FR-WF) take their country code's flag through `SAME_PLACE`, so the open decision about the French territories
  below is made once and both codes follow it; Clipperton Island (FR-CP) flies France's flag, as Wikidata says.
  **The thirteen metropolitan regions**: a region has a flag here only where the flag is its own and in public use
  as the region's, adopted by its council or the established flag of the same territory. That is **Corsica**
  (the Moor's head, the Collectivity's flag), **Nouvelle-Aquitaine** (its council's flag since 2016, the lion and
  the waves), **Normandy** (the two leopards, the region's flag since the two Normandies were joined in 2016,
  flown across it and the centre of the council's logo) and **Brittany** (the Gwenn-ha-du, flown across the region
  though its official symbol is a logo; it came in on 2026-10-10 with a public-domain drawing, and its status is
  `local`: see Brittany below). The other nine use a logo, and the
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

## Authors Commons does not name

Every flag's record carries its author, as Commons' own `Artist` field gives it. On 2026-10-20 the audit
(`docs/audit-2026-10.md`) found 38 flags whose field is empty, and for 37 of them (the 38th, Schleswig-Holstein,
gained an author on Commons on 2026-10-11, in the new drawing it re-uploaded) the author is now read from the file's
description page, as it stood on 2026-10-20, and kept in `scripts/authors.data.json` with where on the page it says so,
one entry per Commons file. Two more flags' variant drawings (Guadeloupe's local flag and Wallis and Futuna's) were
empty the same way and are filled the same way.

- **A name the page gives is used as written**: "Drawn by SKopp", "Written by Jon Harald Søby … colours and ratio
  adjusted by Mevsfotw", "by Steve Hall" (the Open Clip Art Library artist), "by Tobias Jakobs", a `{{PD-user|E2m}}`
  licence (the user releasing the work as its author), the xrmap flag collection where the page says the drawing is
  from it (as Commons' own field already says "Xrmap" on four other flags).
- **Where the page names nobody, the author is "Unknown author"**, Commons' own words for some two dozen other flags. A source
  the page gives but no person (the Open Clip Art Library, a state's CD manual) is added in brackets. Nobody is named
  from the file history: an uploader is not an author unless the page says so.
- **A stale entry is removed.** A test fails when Commons gives a file an `Artist` of its own, so the record then follows
  Commons.

## For the maintainer: three flags left out for their licence

Each is on Commons under a licence that is not public domain, CC0 or CC BY, and no MIT set draws it at its true
proportions. Bringing one in is a line in `ACCEPTED` in `scripts/data-config.ts`, with the decision in words.
Brittany's joined them in 1.1.0 and left them on 2026-10-10, Manitoba's left them on 2026-10-20, Mississippi's left them on 2026-10-09 and Oman's left them on 2026-11-17 (all below).

| Code | Place | What Commons states | Recommendation |
| --- | --- | --- | --- |
| `JP-34` | Hiroshima | No licence template at all: the page carries only `{{Insignia}}` | **Fix at the source**: the drawing is a 1966 prefectural emblem, like the 44 others that Commons marks PD-Japan-organization or PD-ineligible. A licence template added on Commons brings it in with the next `pnpm data:commons`. Still out on 2026-10-09: Commons carries no licence tag for it. |
| `CC` | Cocos (Keeling) Islands | CC BY-SA 4.0 | **Leave out** (John, 2026-10-09). |
| `JP-37` | Kagawa | CC BY-SA 3.0 and GFDL, with the note "If you will use this file, you must get Kagawa Prefecture approval" | **Leave out** (John, 2026-10-09). |

**Brittany** came in on 2026-10-10 (John: "Brittany. Why would I not want it?"). It was left out on 2026-10-09 because the
drawing Wikidata names for `FR-BRE`, "Flag of Brittany.svg", is CC BY-SA 4.0 on Commons, and no flag set draws the Gwenn-ha-du
at its proportions under a licence that ships. Commons has a second drawing of the same flag, "Flag of Brittany (Gwenn ha du).svg"
(Gryffindor, 2012, from the Open Clip Art Library, which released it into the public domain), and its page, read on 2026-10-10,
carries the licence tags PD-OpenClipart, CC0 (`Cc-zero`), PD-old and PD-France, with Commons' machine-readable licence "Public
domain" and `Copyrighted: False`. It is one line in `NAMED`, so the build takes it instead of Wikidata's file, and the licence
check passes it like any public-domain flag. Its **status is `local`**: the Gwenn-ha-du (designed in 1923) is the flag flown across
Brittany, by its people, its towns and the buildings of the region's council, but the Région Bretagne's official symbol is a logo,
so no authority has made it the region's flag. It is therefore the default and the only variant of `FR-BRE`
(`variantsOf("FR-BRE")`, `status: "local"`), with the reason and a source, and the demo shows the status beside it. The CC BY-SA file
is no longer kept in `data-sources/commons/`. What would change it: Commons' CC BY-SA file is not shipped, and a Région Bretagne
statement making the flag official would make its status `official`.

**Manitoba** came in on 2026-10-20, on the terms John set on 2026-10-09 for leaving it out: "or name a public-domain drawing of the same
flag on Commons if one is made". The drawing Wikidata names for `CA-MB`, "Flag of the Province of Manitoba.svg", is CC BY-SA 4.0 on
Commons, and no flag set draws Manitoba's flag. Commons has a second drawing of the same flag, "Flag of Manitoba.svg" (Kooma's, kept up to
date by Echando una mano), 2:1 like the flag itself, and its page, read on 2026-10-20, carries the licence tags PD-author and PD-Layout,
with Commons' machine-readable licence "Public domain" and `Copyrighted: False`. It is one line in `NAMED`, so the build takes it instead
of Wikidata's file, and the licence check passes it like any public-domain flag. The CC BY-SA file is no longer kept in
`data-sources/commons/`. It is the Red Ensign with the province's shield, adopted in 1966, so it has no variants; like Ontario's, its
square, 4:3 and round frames show the whole flag, because the Union Flag in the canton and the shield in the fly are both what makes it
and no square crop holds both. What would change it: a reading of the Commons page by a person who finds that PD-author does not cover
the drawing; the file would then go back on the list above.

**Mississippi** came in on 2026-10-09 ("include Mississippi (copyrighted free use)"): Commons gives the licence as
"Copyrighted free use", under which the holder allows any use for any purpose with no condition, freer than CC BY. It is the one
line in `ACCEPTED`, its licence kind in the manifest is `accepted`, and the decision is written in the licence's name and credited in
NOTICE.md.

**Oman came in on 2026-11-17** (John: "Oman should be allowed. it's world data. keep."), and its licence status is this, plainly.
Commons gives the file "Flag of Oman.svg" the Open Government Licence – Oman 1.0 (OGL-om 1.0, attribution required), and marks it
`Copyrighted: True` with the restriction "insignia". It was left out on 2026-10-09 because it could not be confirmed that the licence
covers a flag. The licence was read in full that day (oman.om's certificate does not verify, so from the Internet Archive's copy of the
page): it lets anyone use "the data available on this website" for any commercial or non-commercial purpose, asking only that the source
be acknowledged, with a link to the licence where possible, and that nothing be done that would harm the Data Provider's honour or
reputation. **But its Article 6 excludes "official government emblems"**, and the national flag is one; and it covers data on oman.om,
while the Commons file was vectorised from qanoon.om, the legal gazette, which is another site. None of that has changed: the licence
still does not clearly cover this drawing, and no public-domain drawing of the flag exists on Commons. The decision to ship it is
John's, made knowing that. It is **one explicit line in `ACCEPTED`** in `scripts/data-config.ts`, keyed to the file "Flag of Oman.svg"
alone, so no other file under OGL-om or any other licence comes in with it, and the check that left it out is unchanged for every other
file. Its licence kind in the manifest is `accepted`; the licence name there carries the decision and the reason it was held back, and
NOTICE.md credits it with the licence's link, as the licence asks (the source acknowledged). The drawing is the Commons file itself,
as the snapshot of 2026-11-17 recorded it (the revision of 2025-07-28); Commons' file history names its authors, which is what the
file's own Artist field says ("See File history below for details."). The flag on the page was edited again on 2026-11-09 after
Royal Decree No. 99/2026; that decree has been read against the snapshot's revision (the next section). What
would change it: the Omani government stating that the flag may be used freely, or a person reading OGL-om as not covering the
flag and deciding to take it out again (remove the line in `ACCEPTED`, then `pnpm data:choose OM`).

## For the maintainer: Oman's flag after Royal Decree 99/2026

Royal Decree 99/2026 (issued 2026-10-29, Official Gazette 1672 of 2026-11-01, in force on 2026-11-02) amends the 2004 State Flag,
Emblem and National Anthem Law (Royal Decree 53/2004). It replaces Annex 1, the flag's specifications and measurements, and Annex 2,
the drawing of the emblem. The annexes are two images; the text was read on qanoon.om's copy of the decree (the Gazette itself is not
online as far as was found), and the images were looked at, not copied. What it says:

- **The design is the same**: a vertical red third at the hoist with the white emblem on its upper part, and three equal horizontal
  bands to its right, white over red over green. The decree gives the official measurements as one sheet: 350 cm by 200 cm, so
  **7:4** as shipped, the red unit 116.67 cm wide (a third of the length), each band 66.67 cm, the emblem 53.43 cm wide and 56 cm high,
  10.67 cm below the top and centred in the red unit.
- **No colour values**: it leaves the colours and fabrics to "the competent entity" and fixes no shade. The shipped `#028002` and `#db171b`
  stay; there is nothing official to set beside them (`scripts/official-colours.data.json` has no entry for Oman).
- **The emblem has a new drawing**: Annex 2 is a new outline drawing of the same things (the *khanjar* dagger with its decorated handle
  and belt, two crossed swords in their scabbards). At the size of the annexes no difference of design could be seen, so no dated flag
  is added: it is one design, drawn again.

The shipped drawing (Commons' revision of 2025-07-28, SHA-1 `eb7feb20`) has the right bands, shape and proportions, but its emblem is
62.6 cm by 62.5 cm of the sheet's 350 by 200 (the sheet says 53.4 by 56), 7.1 cm below the top (the sheet says 10.7).
Commons' file was redrawn on 2026-11-09 "per new decree" (SHA-1 `23854a23`, 257 KB against 109 KB); its emblem box is exactly the
sheet's, its colours `#007e3c` and `#df1a23` are the uploader's, and the page's history shows a change and a revert within two minutes that
evening. Nothing has been changed in the package. The choices are John's:

1. **Keep** the 2025-07-28 revision (as shipped). The flag is right in everything the decree fixes except the emblem's size.
2. **Take the 2026-11-09 revision**: `pnpm data:commons` with the file's new revision, `pnpm data:choose OM`, `pnpm data`. It follows the
   decree's sheet, but the file is a new drawing of the annex's emblem by one editor, the licence question above (Article 6, official
   emblems) applies to it again, it is more than twice the size as Commons has it, and the page was being reverted the day it changed.
3. **Wait** for Commons' history to settle and the Gazette's own copy to be found, then choose between 1 and 2.

Hand-drawing the emblem from the annex is not offered: nothing is redrawn here, and the annex's drawing is the emblem the licence does
not clearly cover.

## For the maintainer: places where the sources show different flags

`pnpm data:choose` compares every set's drawing with Commons' and lists where they differ in design; each was
looked at side by side (`pnpm data:sheet <out.png> --compared`) and the verdicts are in `REVIEWED`. Most are the
same flag drawn simplified or laid out again at another shape. These are not:

- **Afghanistan (AF).** Wikidata's preferred flag, since 2021-08-15, is the Taliban's white flag with the
  shahada; every flag set draws the Islamic Republic's black, red and green tricolour, which is still the flag
  at the United Nations. **Decided 2026-10-09: the tricolour is the default and the Taliban's flag is the `de-facto` variant**
  (below).
- **Saint Helena, Ascension and Tristan da Cunha (SH).** Wikidata gives the Union Flag, the territory's
  official flag as a whole; the sets draw Saint Helena's own blue ensign. **Decided 2026-10-09: Saint Helena's own flag is the
  default and the Union Flag is the `union-flag` variant.**
- **The French overseas territories.** Wikidata is not consistent: it gave France's tricolour for Guadeloupe
  (chosen here, `CHOSEN`), Réunion, French Guiana and Saint Martin, and a local flag for Saint Barthélemy,
  Saint-Pierre and Miquelon, Wallis and Futuna, Mayotte and Martinique. For New Caledonia it gives the FLNKS
  (Kanak) flag, which has flown beside France's there since 2010. **Decided 2026-10-09: each territory's official flag, else
  France's**, with the local flag a variant (below). **Martinique, corrected 2026-11-17:** its red, green and black flag
  was taken for a local one, and it is official: the Assembly of Martinique adopted it on 2023-02-02, by 44 votes to
  none. By the rule it is the default for `MQ` and `FR-972`, and France's tricolour is the `france` variant.
- **Caribbean Netherlands (BQ)** has no flag of its own: Bonaire, Sint Eustatius and Saba each have one, and
  the Netherlands' is the official flag. flag-icons draws the Netherlands', country-flag-icons Bonaire's. The
  package ships none. (Wikidata's other item with the code BQ is the British Antarctic Territory, which had it
  until 1979; `ITEM` keeps that one out.)
- **Antarctica (AQ)** has no official flag. Wikidata's flag for the code is the Antarctic Treaty's (CC BY-SA on
  Commons), on another item; the package ships none.
- **Western Sahara (EH).** Wikidata gives the territory no flag. flag-icons draws the Sahrawi Arab Democratic
  Republic's, which is one claimant's flag. The package ships none.

## Disputed and alternative flags

John, 2026-10-09: "yes" to the recommendations, and "do we have properties that say disputed flag or an option to choose regular
vs disputed? if so that's better". Hata had one flag for each code. Since then a place with more than one flag in real use has
them all as **variants** (`variantsOf(code)`, `flag(code, { variant })`, `<hata-flag variant>`, a module `/flags/<code>--<id>`
for each), each with a `status`, `from` and `until`, a `why` and a `source`, one marked the default, and a `disputed` mark on
the place. [variants.md](variants.md) lists them all with their drawings and licences. The package takes no side: a status says
what authority a flag has, and a default is the flag of the authority the world recognises, or the place's own flag where it
has one, never a flag chosen for being the one most flown.

- **Afghanistan** (`disputed`): default `republic`, the Islamic Republic's tricolour (2013 to 2021, official; still the flag at the
  United Nations, and flown by its representatives abroad and by those who oppose the new rulers); `de-facto`, the Taliban's flag
  (since 2021-08-15; Wikidata's preferred flag; no government outside it recognises it at the United Nations). The Commons file
  for the Taliban's flag carries the restriction "terrorism" and "noresize"; the manifest records it as Commons gives it.
- **Saint Helena**: default `saint-helena`, the island's own blue ensign; `union-flag`, the flag of the territory (Saint Helena,
  Ascension and Tristan da Cunha) as a whole, as Wikidata gives it.
- **The French territories**: each territory's official flag, else France's. **France's tricolour is the default** for
  Guadeloupe, French Guiana, Réunion, Mayotte, Saint-Barthélemy, Saint-Martin, Saint-Pierre and Miquelon, Wallis and
  Futuna and Clipperton, none of which has an official flag of its own, with the local flag a `local` variant where a drawing
  can ship: Guadeloupe's (red, with the sun and the fleurs-de-lis; the black-field one belongs to the independence movement and is
  not offered), French Guiana's green and yellow diagonal with a red star, Réunion's Lofo,
  Mayotte's, Saint-Barthélemy's, Saint-Pierre and Miquelon's and Wallis and Futuna's. **New Caledonia**, **French Polynesia**
  and **Martinique** have flags of their own that are official (the Kanak flag beside France's since 2010; French Polynesia's
  since its statute of 1984; Martinique's red, green and black flag, with a red triangle at the hoist, since its Assembly
  adopted it on 2023-02-02), so those are the defaults and France's tricolour is the `france` variant. Until 1.10.0 Martinique
  drew France's flag and kept its own as a `local` variant, on the ground that it had no official flag; that was out of
  date (MODULES-1409). Saint-Martin still has none: a competition for one was running in 2026, so it is looked at again
  when its council adopts a flag. The French Southern and Antarctic Lands
  keep the TAAF's own flag. **Not offered**: Saint-Martin's local flag ("Local flag of the Collectivity of Saint Martin.svg" is
  under the Licence Ouverte, which is not one of the licences John approved), Guadeloupe's "Flag of Guadeloupe (Local).svg" and
  Martinique's collectivity flag (CC BY-SA 4.0). Which territories' local flags count as "official" is a judgement from
  Wikipedia's articles on each flag; it is for John to confirm.
- **Bavaria**: `lozenges` (default, as before) and `stripes`, both official and of equal standing.
- **Northern Ireland** (`disputed`): no default, since it has had no flag of its own since 1973, as before; the variants are
  `union-flag` (official, the only flag its government flies, flown by many unionists and not by many nationalists) and
  `ulster-banner` (historical, 1953 to 1972, flown by many unionists and some sports teams, not by nationalists). John asked that
  Northern Ireland stay without a flag unless he says otherwise: `flag("GB-NIR")` is still `null` and it is still in
  `LEFT_OUT`; its flags are only for those who ask for one by name. Saint Patrick's Saltire is not offered (Wikidata does not
  give it and its use is not documented as the territory's flag).
- **Syria**: default `2025`, the green, white and black flag with three red stars (Wikidata's preferred flag since 2024-12-08);
  `assad-era`, the red, white and black flag with two green stars (historical, 1980 to 2024, still flown by supporters of the
  former governments and in some communities).
- **Brittany**: default and only variant `gwenn-ha-du`, status `local` (since 1923): the flag in real use across the region, though
  not the region's official symbol, which is a logo. It is the one place whose status is stated for a flag that is also its
  default, so that a user who needs to know whether a flag is official can ask (`variantsOf("FR-BRE")`); see Brittany above for the
  drawing and its licence.

**Considered and not offered**, each because no old flag is in common use today or the flag is not a place's flag:
**Libya's** 1977 to 2011 green flag (no flag used by more than a few); **Myanmar's** 1974 to 2010 flag, which came in with 1.7.0 as Burma's (`BUMM`, below); **Mississippi's, Utah's
and Minnesota's** flags before their recent changes (the old ones are replaced everywhere they are official); **civil and state
flags** that differ only by the arms on them (Belgium's civil flag, Bolivia's, Costa Rica's and Peru's state or war flags,
Saxony's state flag, Tyrol's and Vienna's state flags, Switzerland's civil ensign, Baden-Württemberg's banner); military ensigns
and standards, which are out of scope (README); the **Caribbean Netherlands** (`BQ`: the Netherlands' flag is official, Bonaire's
is public domain, and Sint Eustatius's and Saba's are CC BY-SA, so a partial set would mislead). Each could be a few lines in
`VARIANTS` in `scripts/data-config.ts` if John wants it.

How a variant is built: `VARIANTS` in `scripts/data-config.ts` names, for each place, the default and each variant's id, names,
status, dates, reason, source and Commons file; `pnpm data:commons` fetches the files, `pnpm data` checks each licence like any
flag's (a variant whose licence cannot ship is left out and listed in variants.md), optimises it, and writes its module (the module
of the flag it shares a drawing with, where there is one, such as France's tricolour), and `pnpm data:framing <code>--<id>`
measures its frames. A build that finds a new picture unmeasured writes everything as cropped from the centre and stops at the end,
naming what to measure; run `pnpm data:framing` for it and `pnpm data` again.

## Historic flags of present-day countries

Added in the next release (board ticket MODULES-1405). Hata had the flag of 12 former countries and a few dated variants; it had no earlier flags of countries that still
exist. They are now variants with `status: "historical"` and dates (`scripts/historic-flags.ts`, listed in [historical.md](historical.md#earlier-flags-of-present-day-countries)),
with `flag(code, { date })`, `variantOn(code, date)` and `<hata-flag date>` to ask for the flag in use on a day.

**Which countries.** Every national flag change since 1900 (and the flag in force on 1900-01-01) for the countries named in the ticket, researched 2026-11-17 from the pages
each variant names: the United States, Canada, the United Kingdom, Australia, New Zealand, South Africa, Japan, Russia, Ukraine, Kazakhstan, Turkey, Egypt, Germany,
France, Italy, Spain, Luxembourg, Norway, Sweden, China, India, Pakistan, Iran, Israel, South Korea, Vietnam, the Philippines, Indonesia, Brazil, Argentina, Mexico, Nigeria and the United Arab Emirates.
A country with no visible change since 1900 has one dated entry, the day its flag came in (United Kingdom 1801, France 1830, Luxembourg 1845, Norway 1899, New Zealand 1869).
**Not yet researched:** every other present-day country whose flag changed since 1900 (Afghanistan, Ethiopia, Iraq, Cambodia, Libya, Greece, Cuba, Chile and about a hundred more; the Wikidata
statements in `data-sources/wikidata-2026-10-09.json` are the place to start). They have no dated entries, and `variantOn` gives `null` for them.

**What counts as the national flag.** The flag the state itself used as its national flag, on land; not a naval or merchant ensign unless the country had no other. A flag that only
changed its shade or its specification is not a change (France's blue of 1976 and 2020, Italy's 2003 shades, Argentina's 1943 and 2010 specifications, Japan's red). Flags of the Soviet republics
(the RSFSR, the Ukrainian and Kazakh SSRs) are counted as the flags of Russia, Ukraine and Kazakhstan, because those states are the same states under new names; the Soviet Union's own flag stays under `SUHH`.
The Soviet republic flags are `historical`, and a place's flags before its state existed in its present form (China before 1949, India before 1947, Vietnam before 1945) are not included.

**Judgment calls to confirm.**
- **Canada** has the three Red Ensigns as the flag Canadians flew before 1965 and the Union Flag as its legal flag, both kept (MODULES-1447, below): the Union Flag was the national flag in law until 1965-02-15 (`variantOn("CA", date)`, the Canadian drawing is the United Kingdom's), and the Red Ensigns were flown (`{ role: "in-use" }`).
- **Japan** has two flags: the 1870 Hinomaru (7:10, disc 1/100 off centre) and the 1999 Act's (2:3, centred disc), because the 1999 Act changed the proportions and the position of the disc.
- **Germany** has six periods, not none: the black, white and red flag (to 1919-08-14), the Weimar black, red and gold flag (it looks like today's at 2:3 against 3:5), black, white and red again (1933-03-13 to 1935-09-17), **the swastika flag of 1935 to 1945, shipped as a restricted variant** (see [Restricted flags](#restricted-flags): its drawing is public domain on Commons, which tags it with a note on § 86a of the Strafgesetzbuch), and today's.
  The Allied civil ensign of 1946 to 1949 is left out (low confidence in its dates): `variantOn("DE", "1947")` is `null`.
- **Brazil's dates** are the days the decrees and laws came into force (1960-04-21, 1968-05-30, 1992-05-12), not the days they were signed.
- **Year-only dates** where no source gave a day: Canada's Red Ensign of 1868 (and Wikipedia is its only source), Iran's 1933 and 1964 redrawings, Russia's tricolour of 1896.

**Left out, and why (to add later).**
- *Drawing under CC BY-SA, which Hata does not ship:* Spain's flags of the monarchy to 1931, of Franco's state (1938 and 1945 arms) and of the 1977 transition; South Africa's Red Ensigns of 1910 and 1912; the Philippines' sky-blue flag of 1985 to 1986.
  A gap where a flag is not shipped gives `null`, not a wrong flag.
- *Licence history in doubt:* the Philippines' navy-blue flags of 1936 to 1985 and 1986 to 1998. Commons' only public-domain drawing was uploaded in 2007 as the uploader's own work under GFDL and CC BY-SA, and later marked `PD-Philippines`.
- *Drawing at the wrong proportions or too large:* the Philippines' 1898 and 1920 flags (the free drawings are 3:2, the flags 1:2); Mexico's frontal eagle of 1892 to 1916 (453 KB, over the 400 KB ceiling).
- *Not clearly the national flag, or dates not documented:* Turkey's Ottoman flag of 1844 to 1936 (no proven visible change before the law of 1936), Sweden's flags with the union mark (1844 to 1905) and of 1905 to 1906 (Wikipedia is the only source),
  Kazakhstan's SSR flags of 1937 and 1940, Iran's Qajar flag before 1907, Korea's Taegeukgi of the Korean Empire (the drawing on Commons is the 1882 pattern, not the one in use in 1900).
- *Restricted, not left out:* the swastika flag of 1935 to 1945 (see Restricted flags).

**Legal flag and flag in use** (MODULES-1447, John 2026-11-17: "keep both legal and what was used... add context or tags or metadata explaining it. someone might want an old flag and can choose or get a reason why they see X or Y"). Every earlier flag has `roles` (`legal`, `in-use` or both) and `roleDates`; where a flag is only one of them or the roles run on different days it has a `roleNote` with the reason and its source. `variantOn` and `flag({ date })` give the legal flag by default, name the other one, and `{ role: "in-use" }` picks it. The 80 flags (76 earlier ones, the three Union Flags added for Canada, Australia and New Zealand, and the restricted one) fall into: 68 legal and in use on the same days; 12 with a note (docs/historical.md lists them): Canada's three Red Ensigns (in use) and Union Flag (legal), Australia's three ensigns (in use, the last also legal from the Flags Act 1953 in force on 1954-04-14) and Union Flag (legal, and in use until the Blue Ensign was first flown on 1901-09-03), New Zealand's Ensign (in use from 1869, legal from the Act approved 1902-03-24) and Union Flag, and Ukraine's blue and yellow flag of 1991 (in use) and the Ukrainian SSR's (legal until 1992-01-28). The Union Flag is Canada's, Australia's and New Zealand's legal flag by the same drawing as the United Kingdom's: a line module, not a copy. New Zealand's legal reading before 1902 is the NZ Ministry for Culture and Heritage's, and Paul Christoffel (Journal of New Zealand Studies, 2017) argues the Union Flag was never the legal national flag; both are in the note. Where the roles are the same flag the other is `null`. Other places whose flag was flown before it was adopted (India 1947, Israel 1948) are the same flag in both roles here; their in-use days before the adoption are left for later. A role is a claim about law and practice and is only as good as its `roleNote`'s source.

**Sources.** Each variant's `source` is the page that documents its dates and `sourceKind` says what it is. <!-- variant-sources:start -->
43 have an official source (a government, parliament, archive or law text), 34 a reference and 2 only Wikipedia (listed as `encyclopedia`).
<!-- variant-sources:end -->
Official pages that would not load in the research (several government sites answer a robot with 403) are not cited; the references used instead are named in each flag's `source`.

**The dates that had only Wikipedia, read against official pages (2026-11-18).** Italy's Savoy-arms flag of 1861 is now `official`: the
Presidency of the Republic's page on the tricolour says the Kingdom was proclaimed on 17 March 1861 and its flag stayed, by custom,
the flag of the first war of independence, the tricolour with the Savoy shield that Charles Albert ordered on 23 March 1848.
The other two are left as they were, because what the official pages say is not what the data says, and each is a choice for the maintainer:

- **Canada's Red Ensign, `from: "1868"` (id `red-ensign-1868`).** No official page gives 1868. Canadian Heritage captions the
  ensign with the provincial shield "The Red Ensign of 1871 to 1921" and says it was flown unofficially "since the 1870s"; the Governor
  General's Public Register of Arms, Flags and Badges lists Red Ensigns of 1871, 1873, 1876, 1907, 1922 and 1957 and none of 1868.
  1868 is the year of the royal warrant (26 May 1868, Statistics Canada's Year Book) for the arms of the four provinces, not of the flag.
  Options: (a) keep 1868, so it stays marked `encyclopedia`; (b) `from: "1871"` with Canadian Heritage's page as an official source,
  keeping the id (which then misnames its year); (c) as (b) with a new id `red-ensign-1871` and `red-ensign-1868` kept as an alias,
  an addition to the public ids. (c) is the careful one. Not done: it changes what `flag("CA", { date })` answers for 1868 to 1870.
- **Russia's flag of June 1918, `from: "1918-06-17"` (id `rsfsr-1918`).** The Constitution of the RSFSR (adopted 10 July 1918), art. 90,
  describes the flag as red with the gold letters РСФСР or the full name at the top by the hoist (official text on pravo.by, "Monuments
  of the history of law"), and a search result for the Presidential Library's history page (which would not open here) dates the decree of the All-Russian Central Executive Committee that set a red
  flag with the full name to 14 April 1918. No official page found says 17 June 1918 (the date comes from ruwiki's account of the
  Committee approving Chekhonin's drawing). Options: (a) keep 17 June, `encyclopedia`; (b) `from: "1918-07-10"` with the Constitution as an
  official source, the days before it going to the earlier flag; (c) look for the Committee's minutes (the State Archive of the Russian Federation).

**Iran's flag, `from: "1980-07-06"`, is settled and unchanged.** The Islamic Revolution Document Center (irdc.ir, the page the flag already
cites) quotes the Council of the Revolution's resolution no. 6930: approved at the session of 15 Tir 1359 (1980-07-06), notified to the
Interior Ministry on 4 Mordad 1359 (1980-07-26), with the Islamic Republic's emblem in red and "Allahu Akbar" written 22 times in
white Kufic script along the borders of the green and red bands. The 29 July 1980 that Flags of the World and Wikipedia give (7 Mordad 1359)
is in no official source that was found; 6 July is the day the flag was decided, and the notification is three weeks later.

**Reading a date.** `from` is the first day a flag was in force and `until` the first day of its successor; a bare year or month is the whole of it, and where two flags share a bare year the later wins.
`null` means "not known here", never "no flag": see historical.md for the rules, including what a former country gives outside its years.

## Restricted flags

**Germany's national flag of 1935 to 1945** (the swastika flag) is a variant of `DE` with `restricted: { reason, reasonJa, law, allowedFor, allowedForJa }` (MODULES-1447, John 2026-11-17: shipped "for historic educational reasons", restricted). It was left out of 1.10.0 as a gap; it is now shipped, and every lookup treats it with care.

- **Why, and the law.** Displaying symbols of unconstitutional organisations is an offence under § 86a of Germany's Strafgesetzbuch, which does not apply where the use serves civic education, art, science, research, teaching or the reporting of history (§ 86(4), by § 86a(3)); and Austria's Verbotsgesetz (with the Abzeichengesetz) prohibits the Nazi symbols with similar limits. The statements Hata makes are those two laws' names (`restricted.law`: `"DE StGB §86a"`, `"AT Verbotsgesetz"`) and the plain sentence in `restricted.reason`, which a page can show beside the flag: "Flag of Nazi Germany, 1935–1945. Shown for history and education. Displaying it is restricted by law in Germany and Austria outside those purposes." This is not legal advice.
- **Who may use it, and how.** A page whose purpose is history, education, research or reporting of history, which says so beside the flag (the reason is there to show), and which is not selling or promoting. Commerce, decoration and any use that endorses are not within `allowedFor` ("education and history"). The caller opts in by name: `flag("DE", { date: "1940", allowRestricted: true })`, `variantsOf("DE", { allowRestricted: true })`, `<hata-flag code="DE" date="1940" allow-restricted>`. The call is the caller's statement that its use is one of those; the page that shows the flag is responsible for the law of where it is read.
- **What never gives it.** Without the opt-in `variantOn` returns it `withheld: true` with the restriction and its reason; `flag()` is `null`; `flagOn()` says `none.kind: "restricted"` with the reason; `<hata-flag>` draws nothing and sets `data-restricted` and `data-reason`. It is not in `variantsOf`, any record's `variants` (`manifest()`, `MANIFEST`, `LEFT_OUT`, `manifest.json`'s `flags`), `docs/variants.md`, the gallery, the demo's variant switch, the quiz and its random picks, the list downloads, or the CDN listing (`dist/svg/` has no file of it, so `flagUrl` cannot name one). `RESTRICTED` in `/manifest` and `manifest.json`'s `restricted` list it, for a tool that must know. Its module (`@johnmorrisdotca/hata/flags/de--swastika-1935`) is in the package, because that is how the drawing is delivered to a caller who opts in; importing it by name is the same statement. Other packages that list or draw flags (the quizzes and games, MODULES-1424 and MODULES-1419) must honour `restricted`: read `variant.restricted`, or never read `RESTRICTED`.
- **Where it is shown.** The Historic flags page shows it in Germany's row with a context note in English and Japanese (the sentence above), because that page is history. Nowhere else in the demo.
- **The drawing and its licence.** "Flag of Germany (1935–1945).svg", public domain on Commons ("German government", RGBl. I 1935 No. 122; Commons notes the restrictions `insignia` and `nazi`), passing the usual licence check; the restriction is not a copyright one.
- **Its dates.** From 1935-09-17, the day the Reichsflaggengesetz (enacted 1935-09-15 at Nuremberg, RGBl. I S. 1145) came into force, to 1945-05-23, the day the Reich's last authority, the Flensburg government, ended. The law itself was repealed on 1945-09-20 by Allied Control Council Law No. 1. The black, white and red flag of 1933 ends on 1935-09-17 with it (it was 1935-09-15 in 1.10.0). It is both `legal` and `in-use`: it was the only national flag in law and in practice.

## Former countries

Written 2026-10-20, for the medal table of [taisen-brackets](https://github.com/johnmorrisdotca/taisen-brackets), which needed a flag for
the Soviet Union, East and West Germany, Yugoslavia and the rest, and found none: until 1.7.0 Hata drew present-day places only.
[historical.md](historical.md) lists every code, alias and reason; this is why they are as they are.

- **A former country is a place of its own.** Its code is the ISO 3166-3 code where that standard has one (`SUHH`, `DDDE`, `CSHH`,
  `YUCS`, `CSXX`, `ANHH`, `BUMM`, `ZRCD`, `RHZW`), else the IOC's three letters (`FRG`, `BOH`, `WIF`). No present-day country has
  these codes, so nothing can be mistaken for a place that exists. ISO's own name for `RHZW`
  is Southern Rhodesia; Hata calls it Rhodesia, which is what the flag of 1968 to 1979 and the sports tables call it.
- **The other codes find it.** A table keeps the ISO 3166-1 alpha-2 and alpha-3 the place had (`SU`, `SUN`, `DD`, `DDR`, `YU`, `AN`, `ANT`, `BU`,
  `BUR`, `ZR`, `ZAR`, `RH`, `RHO`, `CSK`) or the IOC's three letters (`URS`, `GDR`, `TCH`, `YUG`, `SCG`, `AHO`, `BIR`, `ZAI`, `BWI`). These are
  `FLAG_ALIASES`, read by `flagCode`, `flag`, `flagName`, `manifest`, `leftOut` and `<hata-flag>`. This is the one place where Hata reads
  three-letter codes; the rule that alpha-3 codes are Kuni's to translate stays for every present-day place, because those are a standard
  Kuni already translates, and the IOC's letters are not one. An alias is never a code of a flag (`isFlagCode("URS")` is false), and the build
  stops if an alias is a place's code or two places share one.
- **`CS` finds nothing.** ISO 3166-1 gave it to Czechoslovakia (1974 to 1992) and to Serbia and Montenegro (2003 to 2006). A near miss
  would draw one country's flag for the other's row, so it is not an alias of either, it is `null` for `flag("CS")`, and `leftOut("CS")` tells
  the caller to say `CSHH` or `TCH`, `CSXX` or `SCG`. A site that holds only `CS` and a year can pick between them itself.
- **The flag is Wikidata's, named by hand.** Every flag statement of a former country has ended, which the rule for present-day places (leave out
  what has ended) would drop, so `HISTORICAL` in `scripts/data-config.ts` names the Commons file, and the build checks it is one of the flag
  images (P41) of the Wikidata item named beside it. The snapshot of the former countries' items is its own section
  (`pnpm data:wikidata -- --historical` asks only for them). The licence check is the same as for any flag: all twelve are public domain on Commons.
- **West Germany and Czechoslovakia fly today's flags.** The black, red and gold tricolour was the Federal Republic's from 1949 and is Germany's
  today; Czechoslovakia's flag of 1920 to 1992 is the Czech Republic's. Each is its own code with the same picture as the present-day
  place (`manifest("FRG").sameAs` is `DE`, `manifest("CSHH").sameAs` is `CZ`), so a table keeps its row, a page loads one drawing, and no
  drawing is made up. East Germany's is the hammer and compass flag of 1959 to 1990 (Wikidata's preferred statement); before 1959 it
  flew Germany's plain tricolour, which no sport used for it.
- **Yugoslavia has dated flags, and the default is the one sport knew.** The state used three: the Kingdom's tricolour (1918 to 1941), the
  Socialist Federal Republic's with the gold-edged red star (1946 to 1992) and the Federal Republic's plain tricolour (1992 to 2003, which
  Serbia and Montenegro kept to 2006). Hata has no way to choose by year, and does not pretend to: the default is the star flag, because
  Yugoslavia competed under it at every Olympic Games from 1948 to 1988 and at the world championships of its team sports, and the other two are variants
  (`kingdom`, `fry`) with their dates, asked for by name. `CSXX` (Serbia and Montenegro) is the Federal Republic's tricolour, the one file
  Commons keeps for 1992 to 2006, so `YUCS--fry` and `CSXX` are one picture. Two more variants are of the same kind: the Soviet Union's flag of
  1936 to 1955 (`1936`, the one it flew at Helsinki 1952) and Burma's of 1948 to 1974 (`union`), beside their defaults, the flags of 1955 to 1991 and
  1974 to 2010.
- **Burma, with the flag Myanmar kept to 2010.** `BUMM` is ISO 3166-3's code for the country as Burma (until 1989); the red flag with the
  blue canton, the cogwheel and the fourteen stars flew from 1974 to 2010, so it is the default for the name, the flag a table of the years
  1974 to 2010 means. Myanmar's flag since 2010 is `MM`'s.
- **The Netherlands Antilles are the flag of 1986 to 2010.** Its Commons file is public domain (`PD-shape`, the page names no author, so
  the author is recorded as unknown, with flagspot.net, the source the page gives). The flag of 1959 to 1986, with six stars, is CC BY-SA 2.5 on
  Commons and has no public-domain drawing, so it is not offered; there is no variant for it. The same goes for Rhodesia's blue ensign
  of 1964 to 1968, whose page carries a CC BY-SA 4.0 template beside the public-domain ones.
- **Bohemia and the West Indies Federation** are in because Olympic medal tables carry them (the IOC's `BOH`, 1900 to 1912, and `BWI`, the
  British West Indies of 1960). Their flags are public domain on Commons.
- **Olympic teams under the Olympic flag have no flag.** The Unified Team of 1992 (`EUN`), the United Team of Germany (`EUA`, the German
  tricolour with the white Olympic rings across it), Olympic Athletes from Russia (`OAR`), the Individual Neutral Athletes (`AIN`), the
  Independent Olympic Participants (`IOP`) and the Refugee Olympic Team (`EOR`, `ROT` in 2016) marched under the Olympic flag or a flag
  that carries the rings, which is the IOC's mark and not a country's. The Russian Olympic Committee's flag (`ROC`) is the committee's
  emblem on white, a federation's mark. The maintainer's instruction (2026-10-20) was not to ship the rings, so these are left out with their reasons in `LEFT_OUT`, and a
  site draws a badge with the code. The Russian Empire (`RU1`) had no single flag in sport (the black, yellow and white state flag, the white,
  blue and red tricolour and the imperial standard were each flown, and sources differ on which a team carried), and Australasia (`ANZ`, the
  combined team of 1908 and 1912) had none at all; both are left out the same way.
- **Not offered, because the place still exists under the same code.** Germany's own flags before 1945 (the Empire's black, white and red,
  Weimar's, the Third Reich's), Russia's before 1991, Ceylon's, Persia's, Siam's, the Gold Coast's and the other names of countries that now
  have an ISO code and a flag. A medal table lists them under the present-day country, as the IOC does, and an old flag of a place that
  still has a flag is a variant of it, not a place. They could come in as variants, one decision each.
- **Restrictions that are not about copyright** are recorded as Commons gives them. The Soviet Union's, Yugoslavia's, East Germany's and Burma's
  flags are marked `communist` and `insignia` (and the Soviet one `rusmilitarism`): showing a Soviet or communist-era symbol is limited by
  law in some countries (Ukraine, Latvia, Lithuania and others), and a site that serves those countries must read `manifest(code).restrictions`.
- **The Japanese names** (ソビエト連邦, 東ドイツ, 西ドイツ, チェコスロバキア, ユーゴスラビア, セルビア・モンテネグロ, オランダ領アンティル, ビルマ, ザイール,
  ローデシア, ボヘミア, 西インド連邦) are the usual ones, and share the Japanese's standing: not yet reviewed by a native reader.

### What to know about the former countries

- **A code two countries held finds neither.** `CS` was Czechoslovakia's until 1992 and Serbia and Montenegro's from
  2003, so `flag("CS")` is `null`, and `leftOut("CS")` says to use `CSHH` or `TCH`, `CSXX` or `SCG`.
- **West Germany and Czechoslovakia fly today's flags.** `FRG` and `CSHH` are separate codes with Germany's and Czechia's
  one picture, so a table can keep the row apart and the page loads the drawing once.
- **Yugoslavia's flag has dates.** The default is the Socialist Federal Republic's star flag (1946 to 1992), the one it
  competed under at every Games from 1948 to 1988; the plain tricolour of the Federal Republic (`fry`, 1992 to 2003, the
  flag of Serbia and Montenegro too) and the Kingdom's (`kingdom`, 1918 to 1941) are variants. The Soviet Union's flag of
  1936 to 1955 (`1936`) and Burma's of 1948 to 1974 (`union`) are the same kind of variant. No flag is picked by year:
  you ask for the one you mean.
- **An Olympic team under the Olympic flag has no flag to ship.** The Unified Team of 1992 (`EUN`), the United Team of
  Germany (`EUA`), the Russian Olympic Committee (`ROC`), Olympic Athletes from Russia (`OAR`), the Individual Neutral Athletes
  (`AIN`), the Independent Olympic Participants (`IOP`) and the Refugee Olympic Team (`EOR`) marched under the IOC's rings or a
  committee's emblem, which are marks and not a country's flag. They are in `LEFT_OUT` with that reason, so a page draws a
  badge with the code. So are the Russian Empire (`RU1`) and Australasia (`ANZ`), which had no one flag in sport.
- **Some restrictions are not about copyright.** Commons marks the Soviet Union's and other communist-era flags
  `communist` and `insignia`: showing them is limited by law in some countries. The manifest records it as Commons
  gives it (`manifest("SUHH")?.restrictions`).

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
  on a neutral disc otherwise. A crop kept at a side is used only where `FOCUS` records that a flag's meaning is
  there, because the colour test alone would pass a hoist crop of Canada that keeps half the leaf (see below: a later change
  filled `FOCUS`).
- **Why prefer flag-icons' drawing to a crop that passes**: it is laid out for the shape by a person, which a crop
  cannot be. The cost is size: 425 drawings, 2.8 MB in the package, of which a page loads only the frames it asks for.
- **`frame(svg)`** works on the one SVG it is given, so it cannot use another drawing: its default, `fit: "auto"`,
  crops where a crop passes and shows the whole flag where not, read from the name each shipped SVG carries
  (`data-hata="ca"`). An SVG that names no flag of this package is shown whole. **This changes 1.0.0's default**,
  which was always a crop; `fit: "cover"` gives the old frame.

### Whole and cropped, and where a crop is kept (after 1.1.0)

John, 2026-10-09, looking at the United States' square: it "should not be a zoomed out image, but a square variant …
the USA flag should just be left aligned which will capture the essence of the flag. That is how we should approach
many flags where there is a prominent top-left (or whatever) corner image with the body pattern … it requires a little
guesswork and can't just be the middle or a zoom-out. So we should offer both whole 1:1 and cropped 1:1 where the cropped
actually looks nice." What was done:

- **Both are offered for every flag**: `fit: "whole"` and `fit: "crop"`; `auto` takes the crop where it shows the flag
  fairly and the whole flag where not. A crop asked for by name always crops, so a crop that drops a colour is the caller's
  to ask for.
- **`FOCUS` was filled by hand**, by looking at every flag's whole picture beside its centre crop (406 flags, on
  2026-10-09), then at each chosen crop beside the whole flag. 121 flags have a line, each with its reason in
  `scripts/data-config.ts` and in [framing.md](framing.md): 84 at the square have a crop kept at a side, 37 are judged to have no
  good square crop and are shown whole by `auto`. The groups: a canton at the hoist (the United States and its states
  that have one, Liberia, Malaysia, Taiwan, Chile, Uruguay, Greece, China, Samoa and others), a triangle or wedge at the
  hoist (Cuba, the Czech Republic, Jordan, Palestine, Sudan, the Philippines, Puerto Rico and others), a band at the
  hoist (the Emirates, Benin, Belarus, Madagascar), an emblem nearer the hoist (Congo-Kinshasa, the Marshall Islands,
  Mongolia, Namibia, Turkey, Colorado, South Carolina, Texas), the Nordic crosses (set towards the hoist), and the fly for
  Rwanda and Zambia. The whole group: Blue and Red Ensigns, whose Union Flag and badge no square holds together, and
  flags whose design runs the length of the flag (Sri Lanka, Alaska, Newfoundland and Labrador, Qatar).
- **The colour test still applies to a chosen crop.** A crop kept at a side that drops a colour covering 5% of the flag is
  used by default only with a written reason (`loses` in `FOCUS`): nine flags, each looked at beside its whole flag
  (the Bahamas, Eritrea, Guinea-Bissau, Jordan, Malta, Namibia, the Solomon Islands, Seychelles, South Sudan). Qatar was
  looked at too and left whole: its serrated white band covers a third of the flag, so a square at the hoist is white.
- **Where flag-icons drew the square, that drawing is the crop** for `flag(code, { shape })`: it is the same judgement
  made by its author (its United States is the canton and stripes at the left). `FOCUS` is what `frame()` does with a
  flag's own SVG, which cannot use another drawing, so the two agree on the United States and Uruguay and differ
  nowhere that matters.
- **Not done**: a crop zoomed to the canton alone (the United States' stars without the stripes); a side is one of left,
  right, top, bottom, because a crop that fills a frame can move along one axis only.

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
