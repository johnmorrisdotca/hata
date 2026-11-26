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
Royal Decree No. 99/2026 and was in dispute there, so the snapshot's revision is kept until a person reads the new decree against it. What
would change it: the Omani government stating that the flag may be used freely, or a person reading OGL-om as not covering the
flag and deciding to take it out again (remove the line in `ACCEPTED`, then `pnpm data:choose OM`).

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
**The next fifteen** (MODULES-1607, read 2026-11-23). Portugal and Czechia are dated. Portugal's flag is the decree of 19 June 1911 on the Presidency's page; the monarchy's flag is not dated, because no official page that was read gives it. Czechia's flag is Act 3/1993, in force on 1 January 1993. The other thirteen are not added. Greece's presidency page, Chile's foreign ministry and its statute page, Poland's statute register and government site, Hungary's statute site, Bulgaria's parliament page, Romania's presidency page, Iraq's presidency page and Cambodia's page did not return the text. Ethiopia's, Libya's and Myanmar's hosts did not resolve. Cuba's presidency page loaded and does not state a date for the flag. Afghanistan was not given a date: no official page was read, and an earlier drawing was not taken from a share-alike file.

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

**Sources.** Each variant's `source` is the page that documents its dates and `sourceKind` says what it is. 45 have an official source (a government, parliament, archive or law text), 35 a reference and 1 only Wikipedia (listed as `encyclopedia`). Canada's provincial-arms Red Ensign is dated from 1871 on Canadian Heritage's timeline of the national flag (read 2026-11-23), not from 1868. Russia's letters flag is dated from 1918-07-10, the day the constitution adopted that day describes it (the text on Russian Wikisource, read 2026-11-23), not from 17 June. Italy's Savoy tricolour is still the one Wikipedia date: the Presidency's page answered a check and was not read. Iran's 1980-07-06 is unchanged.
Official pages that would not load in the research (several government sites answer a robot with 403) are not cited; the references used instead are named in each flag's `source`.

**Reading a date.** `from` is the first day a flag was in force and `until` the first day of its successor; a bare year or month is the whole of it, and where two flags share a bare year the later wins.
`null` means "not known here", never "no flag": see historical.md for the rules, including what a former country gives outside its years.

## Organisations' flags

*(MODULES-1413, MODULES-1813; John 2026-11-24.)* The European Union's flag is drawn for this package from the Union's description, under its terms. The rule for the other bodies: **a body whose own terms or law
explicitly restrict its flag or emblem stays out, whatever the licence of a drawing of it; a body with no terms found for its flag or emblem may come in**, as a public-domain or CC0 Commons drawing through
the licence check (or a drawing made from its published description), with a note saying that no terms were found and the day the page was read. No terms is not a licence, and the law of a country can still limit a flag.

- **In (read 2026-11-24):** CARICOM, the League of Arab States, the Commonwealth of Independent States, the Commonwealth of Nations, the Andean Community and the Organisation of Islamic Cooperation (its flag of 1981 to 2011). `organisationSource(id)` has each file, page, licence and author; `NOTICE.md` has what each body's page said.
- **Out, because their own terms or law restrict the flag or emblem:** the United Nations (the UN Flag Code and resolution 92(I)), NATO (advance authorisation for its logo, name and emblems), the Red Cross, Red Crescent and Red Crystal (the Geneva Conventions), the African Union (its emblem is trademarked or copyrighted and not to be used without approval), ASEAN (reserved copyright, use asked for in writing), the Nordic Council (use by others by permission) and the Olympic rings (the Olympic Charter).
- **Out, because the page could not be read** (a 403 or a browser check, which this package does not work around): the Organization of American States, Mercosur. **Out, for want of a drawing:** the Pacific Islands Forum.

## Samurai banners from a picture of about the period

*(MODULES-1818, 2026-11-26; second and third batches the same day.)* The ticket asked for the banners of forty or more daimyo from the Edo banner books in the NDL Digital Collections, the kanji banners lettered in an SIL OFL brush font, each cited to book and frame. The first two batches take twenty-four from one work, the handscroll 御馬印, 巻1 (scroll 1 of six; NDL 1286895, call number WA8-7), which the library marks as public domain. **It is a handscroll (絵巻), not a bound picture book**: the library's own slip in every photograph reads 「御馬印 6軸」 (six scrolls), frame 1 shows the scroll rolled and tied with its cord, and frame 39 its wooden roller; 1.19.0 called it a picture book (絵本) and is corrected here. The library dates it to around the Kan'ei years (1624 to 1644), an estimate: the scroll calls Tokugawa Hidetada by his posthumous name 台徳院, given in 1632, so it is later than that, and other copies of 御馬印 in the NDL catalogue are dated 1656. The records say "around the Kan'ei years (NDL's estimate)". Only flat cloth banners are taken, whose design is a ground and discs, bands or one written character; the three-dimensional standards (fans, gourds, plumes, umbrellas) and the banners with a crest drawn in detail (the Tokugawa hollyhock) wait.

- **What is measured, and what is not.** The cloth's proportions and the place and size of each disc, band and character are measured from the photograph of the frame, by filling each part from a point inside it; where the painter's outline and the colour wash beneath it are out of register (Echizen's red disc), the outline is followed. The drawings are `documented`. The shades are this package's reading of the painting. The loops that hold the cloth to the pole, the pole, finials and streamers are not drawn, and where the painter's hand moves a part (Tōdō's three discs drift sideways), the drawing keeps the design's line.
- **Which way the banners face.** The set keeps the painting's orientation: in 御馬印 the pole is on the right of each cloth (the loops are on its right edge), so the drawings are seen as painted, pole side on the right, and the `hoist` framing that puts a flag's pole on the left is not applied to them. A banner that is not symmetric is described in the drawing's own terms, left and right as drawn, with the pole side named: Matsudaira Echigo-no-kami's band runs from top right (pole side) to bottom left, and Koide's slant runs down from left to right.
- **Whose banner.** Each record names the lord as the book writes him (上杉弾正, 酒井宮内) and gives the house in words; a person is named only where the title leaves no doubt (台徳院 is Tokugawa Hidetada). 肥後, 和泉 and 美濃 in 保科肥後, 藤堂和泉守 and 本多美濃守 are courtesy titles (Higo-no-kami and so on), not the provinces they held, and no person is named for Hoshina, Sakai or Honda: Honda Tadamasa, the 美濃守 of Himeji, died in 1631, before the name 台徳院 was used.
- **The lettering is a font's, not the painter's.** 五, 毘 and 本 are the glyphs of Yuji Syuku (Kinuta Font Factory, SIL Open Font License 1.1), scaled into the box the painted character fills. The painter writes Uesugi Danjō's character as the variant 毗 (異体字, U+6BD7), its two parts side by side; Yuji Syuku has no 毗, so it is lettered as 毘, and the record's note says so. `scripts/fetch-glyphs.ts` reads the outlines with a small TrueType reader of its own, so no font library is added, and keeps only the characters used, in `data-sources/glyphs/` with the licence.
- **Second batch.** Twelve more from frames 25 to 37 of the same scroll: plain grounds, discs, bands, lozenges, and the Sanada six coins and the Ogasawara three stacked lozenges, both simple geometry. The lords are named by their courtesy titles (Kamon-no-kami, Yamato-no-kami and so on), and no person is named. Where a ground leaks in the photograph (a white cloth whose outline is broken), its box is taken from the frame by hand and its discs by filling.
- **Third batch.** Two more from scroll 1 (frames 31 and 32: Sakai Uta-no-kami's white disc, Sakai Awa-no-kami's gold zigzags) and nine from scroll 2 (NDL 1288242, frames 7 to 15), whose source and note name scroll 2. The character 山 is the fourth from Yuji Syuku. 酒井阿波守's zigzags are measured turn by turn from the photograph; where the cloth leans as it goes down, the drawing stands it straight. In scroll 2, as in scroll 1, a lord's items run leftwards from his name to the next name, so the banners before a name in the photograph belong to the section before. Taken with Docker unavailable on the machine, so the data step and the gzip sizes were not run in the container for this batch (the size budget is set from the build's minified size).
- **Fourth batch.** Fifteen more from scroll 2, frames 7 to 20 (the sections of Matsudaira Kai-no-kami to Mizoguchi Izumo-no-kami), and one from scroll 1, frame 38, where Matsudaira Tanba-no-kami's section runs on to the end of the scroll; two more are lettered 山. Taken are the flat banners only: the ones with a crest drawn in detail (Nanbu's crane, Sengoku's Eiraku coin), the paired foot soldiers' flags labelled あしがる, the two narrow flags of black and white bands (Sengoku's and Mizoguchi's, about 1 wide to 5 or more high, narrower than the 1 to 5 every drawing in the package keeps), the fans, plumes, umbrellas and other three-dimensional standards wait. Where a section paints two banners of one design and size (Aoyama's two pale blue banners with 山), one is taken and its note says so; where the painted cloth or its discs drift sideways (Asano's five discs), the drawing keeps the design's line. On a white ground the cloth is the colour of the paper, so its box is taken from its outline, and the pole-side edge is put at the middle of the loops. Scroll 2's frames 22 to 33, and Matsudaira Oki-no-kami's black banner with a white slant and six black discs (frame 9), are left for the next batch. Docker was not used for this batch, so the gzip sizes are measured on the Mac, not in the container.
- **Fifth batch.** Nine more from scroll 2: Matsudaira Oki-no-kami's nobori from frame 9, and frames 22 to 32 (the sections of Inaba Mino-no-kami to Kuki Nagato-no-kami, to the end of the scroll). The scroll writes some titles short or in old forms, and the records keep them as written: 安藤右京, 内藤左馬, 戸澤右京, 津輕越中守. A lord's items run leftwards from his name, so the two red discs on white just before 津輕越中守 belong to 戸澤右京; they are one design and size, so one is taken and its note says so. Tsugaru's gold disc on white is labelled 小むましるし (the small uma-jirushi) in kana, and its record quotes that. Left out, with their frames: the crests drawn in detail or made of named patterns (Inaba's 三 in a cut-cornered square, 23; Matsudaira Shikibu's nobori and large banner with a ring of white discs round a larger one, 24 and 25; Wakisaka's paired rings, 26 and 27; Naitō's two squares with square holes, 28 and 29; Tsugaru's 卍, 30 and 31; Kuki's nobori with a ring of white discs over black, 32, and his gold discs on black, 33); the foot soldiers' flags labelled あしがる (23, 25, 26, 32); and the fans, plumes, lanterns, umbrellas, streamers, antlered helmets and other three-dimensional standards. Docker was not used; the gzip sizes are the Mac's.
- **Sixth batch.** Ten more from scroll 3 (NDL 1288243, marked public domain), frames 7 to 33; its frames 2 to 5 are the scroll's list of names and frame 38 its closing words. The scroll writes 土屋民部 short, and the record keeps it as written (styled Minbu); 松平將監 is a whole post, 近衛將監, so it is titled Shōgen; 栗山加賀守 is read from its kana, くりやまかゞのかみ, as the first character could be taken for 粟, and the record's note says so. Taken by the same rule as before, so the black banner with a white ring just before 板倉周防守 belongs to 溝口伯耆守, the red banner with a black disc just before 黒田万吉 to 松平將監, and the red banner with a black disc between 永井日向守 and 板倉主水 to 永井日向守. Flat but not taken this time: Matsudaira Shōgen's red banner with a black disc (9), the same design as his nobori; the red nobori with three white discs and two white bands (15); the black banner with nine white discs scattered over it (24); and Ogasawara Shinano-no-kami's banner of black and white bands (27). Left out, with their frames: the crests (three stacked lozenges, 7 and 27; tomoe, 9, 10, 17 and 31; 四つ目 and its kin, 11 and 12; a crest in a ring, 12, 13 and 35; the torii, 14; lozenges and crosses, 19 and 20; a square in a square, 21; a crest over slanted stripes, 22; fans and 三 in a ring, 23; the ladder, 33 and 34); the lettering (Matsudaira Wakasa-no-kami's 利, 25 and 26; 南無阿弥陀仏 and いろはにほへと, 36; 太神宮, 37), characters the package does not keep from Yuji Syuku; the flags narrower than 1 to 5 (the black flag, 24; the gold flag, 31); the foot soldiers' flags labelled あしがる; and the fans, plumes, lanterns, umbrellas, gourds, rings, helmets and other three-dimensional standards. Docker was not used; the gzip sizes are the Mac's.
- **Seventh batch.** Eleven more from scroll 4 (NDL 1288217, marked public domain), frames 15 to 34; its frames 2 to 5 are the cover and the scroll's list of names, and frame 34 holds its closing words. Every lord in it is named by a whole title, written as the scroll writes it (浅野安藝守, 本田下総守, 宗對馬守). Taken by the same rule as before, so the banded nobori just before 本田下総守 belongs to 織田出雲守, the gold banner just before 宗對馬守 to 本田下総守, and the white banner with a red disc just before 毛利甲斐守 to 岡部美濃守. Flat but not taken this time: the plain gold banner (8), the red nobori (10) and the black and white nobori (12) in the sections at the head of the scroll, and the banded nobori of the section named by a personal name, 松平新太郎 (11). Left out, with their frames: the crests (the coins, 6; a small white mark on red, 9; a white square on black, 13 and 14; a cross in a ring, 15; a square with a square hole, 17; nine discs, 21; flower discs, 25; tomoe, 29 and 30; crests in a ring, 30 to 32); the gold banners with notched edges (7 and 8); the lettering (有, 21; 十, 22; 八, 30); the flags narrower than 1 to 5 (13, 14, 15, 25 and 26); the foot soldiers' flags labelled あしがる; and the fans, umbrellas, plumes, crescents, lanterns, helmets, streamers and other three-dimensional standards. Docker was not used; the gzip sizes are the Mac's.
- **Eighth batch.** Ten more from scroll 5 (NDL 1288244, marked public domain), frames 11 to 30; its frames 2 to 6 are the cover and the scroll's list of names, and frame 37 holds its closing words. 丹羽左京 and 中川内膳 are short forms and are styled Sakyō and Naizen; the others are whole titles. Names are written as the scroll writes them (來嶋, 杦原); 杦 is a variant of 杉, and the kana, すき…, give the reading Sugihara, as the record's note says. Taken by the same rule as before, so the two saltires just before 加藤出羽守 belong to 丹羽左京 (the larger, labelled 大馬しるし, is drawn), and the black banner with two white bands just before 丹羽左京 belongs to 來嶋出羽守. Flat but not taken this time: the white nobori with three black discs and the black nobori with nine white discs (7); the banded nobori and the narrow flag of white, black and white of 一柳監物 (8); the plain white nobori (12); the banded nobori and narrow flag of 松平周防守 (17); the black, white and black nobori of 松平右衛門佐 (19); the white narrow flag (24); the black banner of 松平長門守 (25); and the banded nobori of 伊達遠江守 (29). Left out, with their frames: the crests (小 in a ring, 8; rings and crests in rings, 9, 10 and 20; flowers, 10, 31 and 33; coins, 15 and 16; fans, 17; a square, 23 and 24; 卍, 26; a crest above a black foot, 27; 十, 28 and 31; tomoe, 32 and 33; 三 in a ring, 34; hats, 35 and 36); the sawtooth nobori of 丹羽左京 (13 and 14); the small flags with 山, narrower than 1 to 5 (24 and 25); the foot soldiers' flags labelled あしがる; and the fans, plumes, umbrellas, rings, crescents, helmets, streamers and other three-dimensional standards. Docker was not used; the gzip sizes are the Mac's.
- **Ninth batch.** Ten more from scroll 6 (NDL 1287803, marked public domain), the last, frames 7 to 36; its frames 2 to 6 are the cover and the scroll's list of names, and frames 39 and 40 hold its closing words. 長谷川式部 is a short form and is styled Shikibu; 向井將監 holds a whole post, like 松平將監, and is titled Shōgen; the others are whole titles. Names are written as the scroll writes them (龜井, 將監). Taken by the same rule as before, so the narrow white nobori with five red discs, painted between 向井將監 and 松倉豊後守, belongs to 向井將監. Left out, with their frames: the sections named by a person, 武田信玄 (22), 織田三七 (23) and 北條久太郎 (24); the crests (coins, 7 and 37; lozenges, 9, 10, 15, 20, 22 and 35; crests in rings, 9, 11 and 28; the torii, 12 and 13; squares, 17; a crescent in a ring, 18; triangles, 24 and 25; a crest on black, 27; flowers, 29; the mountain, 34); the lettering (南無阿弥陀仏 on a banner, 21); the waves (16), the zigzag (25) and the ladders (27 and 28); the foot soldiers' flags labelled あしがる; and the fans, plumes, umbrellas, bells, lanterns, rings, helmets, streamers and other three-dimensional standards. Flat but not taken this time are in the list below. Docker was not used; the gzip sizes are the Mac's.
- **The flat banners not yet taken, all six scrolls.** The pool for any later round, scroll and frame for each: scroll 2, the second pale blue banner with 山 of Aoyama (15) and the second red disc on white of Tozawa (30), both repeats of a drawn design; scroll 3, Matsudaira Shōgen's red banner with a black disc (9), the red nobori with three white discs and two white bands (15), the black banner with nine white discs scattered over it (24) and Ogasawara Shinano-no-kami's banner of black and white bands (27); scroll 4, the plain gold banner (8), the red nobori (10), the banded nobori of 松平新太郎 (11) and the black and white nobori (12); scroll 5, the white nobori with three black discs and the black nobori with nine white discs (7), 一柳監物's banded nobori and his narrow flag of white, black and white (8), the plain white nobori (12), 松平周防守's banded nobori and narrow flag (17), 松平右衛門佐's black, white and black nobori (19), the white narrow flag (24), 松平長門守's black banner (25) and 伊達遠江守's banded nobori (29); scroll 6, the black banner with two white bands (9), the white nobori with three black bullseyes (10), the black banner with a white bullseye (11), the plain red banner (15), the banded nobori (16), the white narrow flag (18), Matsushita Iwami-no-kami's smaller banner with a gold saltire and his gold narrow flag (19), 向井將監's white banner with a red disc (31), 井上河内守's plain black nobori (32), the plain black banner (33) and 真田伊豆守's narrow flag of white, red and white (36). Thirty-three in all; where no lord is named, the section is still to be checked.
- **Size.** The records grew the samurai entry from 19 KB to 40 KB (6.8 KB gzipped); its budget is raised from 24 KB to 48 KB, with the second batch's records the entry is 64 KB (9.0 KB gzipped) and its budget 72 KB, with the third's 85 KB and 96 KB, with the fourth's 118 KB and 136 KB, and with the fifth's 135 KB, still under 136 KB. Half of each handscroll record was the note and source every one of them shares but for the scroll and the frame, so the data file now builds those with one function, `book()`, that `scripts/draw-samurai.ts` writes from the same text it draws the records with; the records the entry gives are unchanged (a test compares them, field for field, with the script's), and the entry is 73 KB; with the sixth batch it is 81 KB, with the seventh 90 KB, with the eighth 99 KB, and with the ninth 107 KB. A lettered drawing carries the glyph's outline and is up to 4.8 KB, so the budget for one samurai drawing is raised from 4 KB to 6 KB.

## Ship signal flags: the Navy's special pennants

*(MODULES-1819, 2026-11-26.)* The ticket asked for the tactical flags and pennants "from a US Government publication (PD), as their own group in /signals". Hata holds no copy of the Navy's signal books (ACP 129, NWP 1-02.1), so it takes 18 of the special pennants drawn "per the U.S. Navy specification" by Carl Lindberg on Commons (`SpecialSignalPennant-<name>-USNSpec.svg`): each is public domain as "ineligible for copyright" plain geometry, passes the licence check and the optimiser as the military flags do, and nothing is redrawn.

- **A group of the signals entry.** The group is `tactical`, the ids are `usn:<slug>`, and the entry therefore has two id namespaces, `ics:` and `usn:` (`src/sets.test.ts` allows it for the signals set only). `SIGNAL_IDS` lists the Code's 40 and then the 18; `signalsFor` still spells only with the Code's. The entry grew from 58 KB to 91 KB (8.6 KB gzipped) and its budget from 64 KB to 96 KB.
- **The meanings follow the Navy's Signalman manual and the RCN's page**, in general terms and not the Navy's text: NAVEDTRA 14244 (navyaviation.tpub.com/14244: "Basic Maneuvering Flags", "Substitutes", "Correcting a Signal") for Corpen (the ships alter course in succession, as in a column wheel, and with a modifier it gives a formation's course), Turn (all together), Starboard, Formation, Station, the substitutes and cancelling a signal with Negative, and for reading numerals (fewer than three digits count in tens of degrees, so TURN STARBOARD 15 is 150 degrees; three give the course to steady on; the answering pennant is the decimal point, SPEED 1 6 ANS being 16.5 knots); the RCN's page (jproc.ca/rrp/rrp2/visual_flags.html) for Preparative, Designation, Interrogative, Emergency and Subdivision. Sea Flags' "Signal Flags" (McMillan) and Wikipedia's "Naval flag signalling" give names only. Screen is explained by none of them, so its meaning is only that the flags that follow give a signal about the screen. Each record's `note` says where the meaning is from, and the Navy's own books are the authority at sea.
- **Not added.** The numeral pennants are the Code's own (`ics:0` to `ics:9`). The Navy's Port, Division, Squadron and Flotilla pennants, and the allied (NATO ACP 129) set where it differs, have no public-domain file on Commons that was found. The Japanese names (回頭旗, 針路旗, 予令旗 and the others) are this package's, not yet reviewed by a native reader.

## Restricted flags

**Germany's national flag of 1935 to 1945** (the swastika flag) is a variant of `DE` with `restricted: { reason, reasonJa, law, allowedFor, allowedForJa }` (MODULES-1447, John 2026-11-17: shipped "for historic educational reasons", restricted). It was left out of 1.10.0 as a gap; it is now shipped, and every lookup treats it with care.

- **Why, and the law.** Displaying symbols of unconstitutional organisations is an offence under § 86a of Germany's Strafgesetzbuch, which does not apply where the use serves civic education, art, science, research, teaching or the reporting of history (§ 86(4), by § 86a(3)); and Austria's Verbotsgesetz (with the Abzeichengesetz) prohibits the Nazi symbols with similar limits. The statements Hata makes are those two laws' names (`restricted.law`: `"DE StGB §86a"`, `"AT Verbotsgesetz"`) and the plain sentence in `restricted.reason`, which a page can show beside the flag: "Flag of Nazi Germany, 1935–1945. Shown for history and education. Displaying it is restricted by law in Germany and Austria outside those purposes." This is not legal advice.
- **Who may use it, and how.** A page whose purpose is history, education, research or reporting of history, which says so beside the flag (the reason is there to show), and which is not selling or promoting. Commerce, decoration and any use that endorses are not within `allowedFor` ("education and history"). The caller opts in by name: `flag("DE", { date: "1940", allowRestricted: true })`, `variantsOf("DE", { allowRestricted: true })`, `<hata-flag code="DE" date="1940" allow-restricted>`. The call is the caller's statement that its use is one of those; the page that shows the flag is responsible for the law of where it is read.
- **What never gives it.** Without the opt-in `variantOn` returns it `withheld: true` with the restriction and its reason; `flag()` is `null`; `flagOn()` says `none.kind: "restricted"` with the reason; `<hata-flag>` draws nothing and sets `data-restricted` and `data-reason`. It is not in `variantsOf`, any record's `variants` (`manifest()`, `MANIFEST`, `LEFT_OUT`, `manifest.json`'s `flags`), `docs/variants.md`, the gallery, the demo's variant switch, the quiz and its random picks, the list downloads, or the CDN listing (`dist/svg/` has no file of it, so `flagUrl` cannot name one). `RESTRICTED` in `/manifest` and `manifest.json`'s `restricted` list it, for a tool that must know. Its module (`@johnmorrisdotca/hata/flags/de--swastika-1935`) is in the package, because that is how the drawing is delivered to a caller who opts in; importing it by name is the same statement. Other packages that list or draw flags (the quizzes and games, MODULES-1424 and MODULES-1419) must honour `restricted`: read `variant.restricted`, or never read `RESTRICTED`.
- **Where it is shown.** The Historic flags page shows it in Germany's row with a context note in English and Japanese (the sentence above), because that page is history. Nowhere else in the demo.
- **The drawing and its licence.** "Flag of Germany (1935–1945).svg", public domain on Commons ("German government", RGBl. I 1935 No. 122; Commons notes the restrictions `insignia` and `nazi`), passing the usual licence check; the restriction is not a copyright one.
- **Its dates.** From 1935-09-17, the day the Reichsflaggengesetz (enacted 1935-09-15 at Nuremberg, RGBl. I S. 1145) came into force, to 1945-05-23, the day the Reich's last authority, the Flensburg government, ended. The law itself was repealed on 1945-09-20 by Allied Control Council Law No. 1. The black, white and red flag of 1933 ends on 1935-09-17 with it (it was 1935-09-15 in 1.10.0). It is both `legal` and `in-use`: it was the only national flag in law and in practice.

**The Confederate battle flags** (the battle flag of the Army of Northern Virginia, square, from 1861, and the Confederate States Navy's jack, the rectangular form of 1863 to 1865) are in the military set (`@johnmorrisdotca/hata/military`, MODULES-1812, John 2026-11-24), beside the United States' flags of the same years, and are treated as the swastika flag is: shipped for history and education, never given by default. They are in `MILITARY_RESTRICTED_IDS`, in no list, group or demo page of the set, and `militaryFlag(id)` is `null` unless it is called with `{ allowRestricted: true }`; `militaryInfo(id)?.restricted` has the reason, in both languages, and who it is for (`allowedFor`: education and history). Unlike the swastika flag no law restricts them, so the restriction has no `law`: the reason is "Confederate battle flag, 1861 to 1865. Shown for history and education. It is widely seen today as a symbol of racism and white supremacy." The drawings are public domain on Commons ("Battle flag of the Confederate States of America (1-1).svg", "Naval jack of the Confederate States (1863–1865).svg") and pass the usual licence check. The Confederacy's three national flags are not battle flags and are ordinary variants of `XCS`, as the German black, white and red flags are of `DE`.

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

- **Every ISO 3166-3 code has a flag or a reason (MODULES-1808).** Thirty codes: 24 have a flag and six are in `LEFT_OUT` (British
  Antarctic Territory, Canton and Enderbury Islands, the New Hebrides, the Neutral Zone, Sikkim and East Timor), each with its reason.
  A territory that flew its country's flag (the Afars and the Issas, the French Southern and Antarctic Territories, Dronning Maud Land,
  Johnston, Midway, Wake, the Panama Canal Zone and the United States' other Pacific islands) draws that country's one picture, as West Germany does.
- **A state that never had an ISO 3166-3 code has a code of Hata's own: `X` and two letters.** ISO 3166 reserves `XAA` to `XZZ`
  for users and never assigns them, so none can ever be an official code. They are `XAH`, `XOT`, `XPR`, `XHW`, `XGE`, `XSV`, `XKR`,
  `XQI`, `XUA`, `XTX`, `XIT` and `XZB`, and the former-countries guide lists them. This is Hata's choice, not a standard's, and a
  code can be renamed before 2.0 if the maintainer prefers another scheme.
- **These states have no Wikidata item in the snapshot, so their Commons files are named by hand** (`item: null` in
  `scripts/former-flags.ts`; the manifest's `wikidata` is the empty string). Wikidata is not asked for more than the snapshot has. The Commons snapshot
  gained their 19 files on 2026-11-24 (each has a `fetched` day); the others were not read again.
- **A state with no flag in law says so.** Austria-Hungary's civil ensign is its flag in use only (`roles: ["in-use"]` and a `roleNote`),
  and so are the Qing Empire's Yellow Dragon Flags and the Kingdom of Hawaii's flag of 1816.
- **Tibet and Manchukuo are in** (`XTB`, `XMK`; John 2026-11-24, "same as the other former countries"): Tibet's snow lion flag dated by the years of its de facto independence, with its role `in-use` only and a note that its status is disputed, and Manchukuo's flag with the plain statement that it was a state set up by Japan in 1932 and recognised by few countries. The package takes no side on either's status. **Left out for a licence.** Gran Colombia and Tanganyika (every drawing under CC BY-SA). The Confederate States are in (`XCS`): the three national flags, as dated variants, like any former state; the battle flag is not a national flag and is in the military set (docs/guides/military-flags.md). Prussia's state flag with the arms (1892 to 1918) is drawn on Commons only at changed proportions
- **The next former states (MODULES-1820, 2026-11-26).** In: the Kingdom of Bavaria (`XBA`), the Kingdom of Saxony (`XSX`), the Kingdom of Württemberg (`XWU`), the Kingdom of Hejaz (`XHJ`), the Orange Free State (`XOF`), the Russian Empire (`XRE`) and the Dominion of Newfoundland (`XNF`), each a public-domain Commons file named by hand and dated from Wikipedia's articles. Bavaria's is the striped flag the article on the flag of Bavaria shows for 1806 to 1918, so `XBA` and `DE-BY`'s `stripes` are one picture. The Russian Empire's default is the tricolour (made the sole national flag on 1896-04-29), Russia's one picture; the black, yellow and white state flag of 1858 is a variant. Newfoundland's own flag was the Red Ensign with the colony's badge, so it is shown as the flag in use; the Union Flag was its national flag from 1931. The Olympic team `RU1` stays left out (no single flag in sport). **Not added, with the reason.** The Kingdom of the Two Sicilies (`XTS`): its public-domain drawing is 615 KB optimised, over the 400 KB ceiling, and the others are CC BY-SA or CC BY at another layout; it is in `LEFT_OUT`. The Transvaal and Biafra: Commons has only CC BY-SA drawings. The Ryukyu Kingdom: the one public-domain file says on its page that it is "not attested in Ryukyu Kingdom period sources", so no source gives a flag. Persia: the Kingdom's flags are already variants of `IR`. Gran Colombia, Tanganyika and Sikkim: only CC BY-SA drawings, and Hata does not redraw (the ticket asks for drawings from the law or the decree, which needs the maintainer's yes).
  or under a licence that is not shipped, so Prussia ships the plain black and white flag.

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
