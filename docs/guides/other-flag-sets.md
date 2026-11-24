---
title: Hata and the other flag sets
section: explanation
order: 2
description: What hata and seven other flag sets each say they draw, in which formats and with which licence, and what hata does not have yet.
---

Most flag packages draw the same few hundred flags, so the choice is about shapes, formats, codes and licences. This page puts hata beside seven sets that people reach for. Every statement about another set is taken from that set's own README, linked below, and read on 2026-11-17; "its README does not say" means exactly that, not that the set lacks the thing. Every statement about hata is from [the README](../../README.md) and the guides, and a test that checks the docs holds the numbers.

The sets: [flag-icons](https://github.com/lipis/flag-icons), [country-flag-icons](https://github.com/catamphetamine/country-flag-icons/blob/master/README.md), [circle-flags](https://github.com/HatScripts/circle-flags/blob/gh-pages/README.md), [react-world-flags](https://github.com/smucode/react-world-flags/blob/master/README.md), [svg-country-flags](https://github.com/hampusborgos/country-flags/blob/main/README.md) (the `country-flags` repository), [world-flags-sprite](https://github.com/lafeber/world-flags-sprite/blob/master/README.md) and [flagpack-core](https://github.com/Yummygum/flagpack-core/blob/main/README.md).

## What each set draws

| Set | What its README says it contains | Shapes |
| --- | --- | --- |
| hata | 506 flags: 246 of the 250 countries, the first-level regions of ten countries, 39 former countries and the dated earlier flags of some present-day ones | each flag at its own proportions, and 4:3, square and round frames that never stretch it |
| flag-icons | "A curated collection of all country flags in SVG, plus the CSS" | 4:3, and a squared version (`fis`) |
| country-flag-icons | every ISO 3166-1 country, plus `EU`, `IC`, `AC`, `TA`, `XK`, `XA`, `XO`, `XC`, `BQ-BO`, `BQ-SA`, `BQ-SE`, `GB-ENG`, `GB-NIR`, `GB-SCT`, `GB-WLS` and `ES-CT` | 3:2 |
| circle-flags | "A collection of circular SVG country flags"; the README also names regional files such as `es-ib` (the Balearic Islands) and `aq-true_south` | round |
| react-world-flags | "SVG flags of the world for react" | its README does not say |
| svg-country-flags | "accurate renders of all the worlds flags", named by 2-letter code, `GB-ENG` and the like, and `XK` for Kosovo | SVG as rendered; its README does not give a ratio |
| world-flags-sprite | "The flags of all countries in the world in one sprite" | one sprite, class `f32` |
| flagpack-core | "250+ flag icons", every ISO 3166 country plus `BQ-SA`, `BQ-BO`, `BQ-SE`, `GB-ENG`, `GB-SCT`, `GB-WLS`, `GB-NIR` | its README does not say |

## How you get a flag

| Set | Formats and ways to use it | Framework components |
| --- | --- | --- |
| hata | an SVG file for each flag, a module that holds the SVG string, a data URI, the `<hata-flag>` element, an iframe page; the demo saves SVG, PNG and JSON in the browser | typed React, Vue, Svelte and React Native components; the element for the rest |
| flag-icons | CSS classes (`.fi .fi-xx`), SVG files, SASS with a list of the countries to include | its README names none |
| country-flag-icons | SVG files, JavaScript strings, CSS classes with the SVG inlined as data URLs, Unicode emoji; `hasFlag` and `countries` | React components for every flag; an experimental one for Vue 3 |
| circle-flags | SVG files, at an address of the form `…/flags/xx.svg` | separate packages for React, React Native / Expo and SolidJS, each linked from its README |
| react-world-flags | a React component that draws an `img` with the SVG inlined as a data URI | React; its README says the bundle is about 1.3 MB gzipped and points to a v2 beta |
| svg-country-flags | SVG files and PNG exports at 100, 250 and 1000 px wide; a JSON file from code to name; a script for other widths | its README names none |
| world-flags-sprite | one CSS sprite, `<li class="flag ar">` | its README names none |
| flagpack-core | SVG files, one import each, and a `countryCodeList.json` | separate React, Vue and Svelte packages, linked from its README |

## Codes, names and licences

| Set | Codes it takes | Names and data | Licence its README states |
| --- | --- | --- | --- |
| hata | ISO 3166-1 alpha-2 and ISO 3166-2 codes (case and underscore forms are normalised), and aliases for former countries | English and Japanese names, and for each flag its source, author, licence, proportions, colours and tags | MIT for the code; each flag's own licence, public domain, CC0 and a few others, listed on the [formats, sizes and licences](formats-and-licences.md) page |
| flag-icons | alpha-2 | its README does not say | its README does not say |
| country-flag-icons | alpha-2 | its README does not say | its README does not say |
| circle-flags | alpha-2 | a fixed palette of eleven colours for contributors | MIT |
| react-world-flags | alpha-2, alpha-3 or numeric | its README does not say | its README does not say |
| svg-country-flags | alpha-2 | a JSON file from code to country name | says that flags are in the public domain, and that there may be other restrictions on how a flag can be used |
| world-flags-sprite | alpha-2 or alpha-3 | its README does not say | its README does not say |
| flagpack-core | alpha-2 | `countryCodeList.json` | MIT |

## Where hata has something the others' READMEs do not mention

- **The licence, author and source of every flag**, kept with it and read in code (`manifest(code)`), and a licence page that holds only flags it can carry.
- **True proportions and frames that do not stretch.** Japan is 2:3, Canada 1:2, Switzerland square; a round frame is drawn again for the circle where a crop would lose a colour.
- **Disputed and alternative flags side by side**, each with a status, dates and a reason, and the flag of a date for 35 countries.
- **Colours and tags for every flag**, as exact hex values and a closed list of tags, each with its source (`/search`, [colours](colours.md), [tags](tags.md)).
- **A small core.** The main entry is 4.0 kB gzipped and carries no flag, and a page pays only for the flags it imports.
- **A gallery, a builder, a quiz and a docs site** in English and Japanese.

## What hata does not have yet, and why

Each row is a gap against one of the sets above or a thing people ask a flag set for. The ticket is on the family's board; the README's Roadmap says the same in fewer words.

| Not here | Where it is found | Why it is not here | Ticket |
| --- | --- | --- | --- |
| CSS classes and one sprite sheet (`fi-xx` style) | flag-icons, country-flag-icons, world-flags-sprite | not built yet; hata ships SVG strings and files | MODULES-1426 |
| PNG or WebP files at set widths, and a zip of everything | svg-country-flags (PNG 100, 250, 1000 px) | the demo makes PNG in the browser; no file is shipped | MODULES-1427 |
| Lookup by alpha-3, numeric or emoji, and a `flagEmoji` | react-world-flags, world-flags-sprite, country-flag-icons | the lookup takes alpha-2 and subdivision codes only; the README says why it does not draw emoji | MODULES-1425 |
| Names in more languages | | English and Japanese today | MODULES-1432 |
| Flags of organisations beyond the EU (the UN, the African Union, NATO…) | | an organisation's flag goes in only where its terms let an MIT package carry it | MODULES-1417 |
| Cultural, indigenous and stateless-nation flags | | needs a decision on how far to go; a page can register its own with `/custom` | MODULES-1418 |
| Spain's and Italy's regions, and the regions of Russia, India, Portugal, the Netherlands, Indonesia, Pakistan and Ethiopia | circle-flags' README names `es-ib` | several of Spain's and Italy's regional drawings are CC BY-SA, which hata does not ship ([decisions](../decisions.md)) | MODULES-1412, MODULES-1415 |
| Antarctica, Western Sahara and the Caribbean Netherlands' islands | country-flag-icons and flagpack-core carry the three `BQ-` islands; circle-flags' README names `aq-true_south` | no country's official flag; to be offered as variants with no default | MODULES-1414 |
| Ascension, Tristan da Cunha, Abkhazia, South Ossetia, Northern Cyprus | country-flag-icons | not ISO 3166-1 countries | MODULES-1416 |
| Civil, state and war ensigns as kinds of one flag | | not built yet | MODULES-1413 |
| Facts about a flag: adoption date, designer, what the colours mean | | needs sources that can be carried under MIT | MODULES-1420 |
| A dated log of flag changes | | not built yet | MODULES-1410 |
| More kinds of quiz question, and a matching game | | not built yet | MODULES-1424, MODULES-1419 |
| A map to choose a flag from | | a recipe on [Chizu](https://github.com/johnmorrisdotca/chizu) is planned | MODULES-1430 |

Not planned: redrawn flags, anything share-alike or GPL, and Angular or Solid components (the element works there).

## Which to choose

- You need the flag as a CSS class on an element and nothing else: flag-icons or the world-flags-sprite do that today, and hata does not yet.
- You need round icons and nothing else: circle-flags.
- You need the right flag at the right proportions, with its licence and author, in any shape, for any country or region listed here: hata.
- You need all of that and a PNG at 250 px: svg-country-flags has the PNG, and hata draws the SVG.

Moving from one of them is on [Move to hata from another flag set](moving-to-hata.md).
