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

## For the maintainer: four flags left out for their licence

Each is on Commons under a licence that is not public domain, CC0 or CC BY, and no MIT set draws it at its true
proportions. Bringing one in is a line in `ACCEPTED` in `scripts/data-config.ts`, with the decision in words.
Brittany's joined them in 1.1.0 and left them on 2026-10-10, Manitoba's left them on 2026-10-20, and Mississippi's left them on 2026-10-09 (all below).

| Code | Place | What Commons states | Recommendation |
| --- | --- | --- | --- |
| `OM` | Oman | Open Government Licence – Oman 1.0, attribution required | **Left out: the licence could not be confirmed to cover a flag** (read 2026-10-09, below). |
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

**Oman was read and is left out.** On 2026-10-09 the Open Government Licence – Oman 1.0 was read in full (oman.om's certificate
does not verify, so from the Internet Archive's copy of the page). It lets anyone use "the data available on this website" for any
commercial or non-commercial purpose, asking only that the source be acknowledged, with a link to the licence where possible, and
that nothing be done that would harm the Data Provider's honour or reputation. **But Article 6 excludes "official government
emblems"**, and the national flag is one; and the licence covers data on oman.om, while the Commons file was vectorised from
qanoon.om, the legal gazette, which is another site. So the licence cannot be confirmed to cover this drawing, and Oman is left
out, as John asked ("if it cannot be confirmed, leave it out"). Asking the Omani government for a statement, or finding a
public-domain drawing on Commons, would settle it.

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
  France's**, with the local flag a variant (below).
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
  Guadeloupe, Martinique, French Guiana, Réunion, Mayotte, Saint-Barthélemy, Saint-Martin, Saint-Pierre and Miquelon, Wallis and
  Futuna and Clipperton, none of which has an official flag of its own, with the local flag a `local` variant where a drawing
  can ship: Guadeloupe's (red, with the sun and the fleurs-de-lis; the black-field one belongs to the independence movement and is
  not offered), Martinique's red, green and black flag, French Guiana's green and yellow diagonal with a red star, Réunion's Lofo,
  Mayotte's, Saint-Barthélemy's, Saint-Pierre and Miquelon's and Wallis and Futuna's. **New Caledonia** and **French Polynesia**
  have flags of their own that are official (the Kanak flag beside France's since 2010; French Polynesia's since its statute
  of 1984), so those are the defaults and France's tricolour is the `france` variant. The French Southern and Antarctic Lands
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
