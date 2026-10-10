# The codes with no flag in this version, and why

Made by `pnpm data`; a test fails if this list and the data differ. Every code Kuni knows (483: the
250 countries and the first level of JP, CA, US, AU, GB, DE, FR, CH, AT, BR) either has a flag or is here with its reason.
The decisions behind the reasons are in [decisions.md](decisions.md).

| Code | Place | Why | Commons file |
| --- | --- | --- | --- |
| `AQ` | Antarctica | Antarctica has no official flag. Wikidata's flag for the code is the Antarctic Treaty's, on another item; the proposed flags (True South, Graham Bartram's) are no government's. |  |
| `BQ` | Caribbean Netherlands | The Caribbean Netherlands have no flag of their own: Bonaire, Sint Eustatius and Saba each have one, and the Netherlands' flag is the official one (see docs/decisions.md). |  |
| `CC` | Cocos (Keeling) Islands | Commons gives its licence as CC BY-SA 4.0, which is not public domain, CC0 or CC BY, and no MIT flag set draws the same flag at its proportions | [Flag of the Cocos (Keeling) Island.svg](https://commons.wikimedia.org/wiki/File:Flag_of_the_Cocos_(Keeling)_Island.svg) |
| `EH` | Western Sahara | Western Sahara has no flag of its own on Wikidata. The flag often shown for it is the Sahrawi Arab Democratic Republic's, one claimant's; it is left out rather than chosen for the territory (see docs/decisions.md). |  |
| `OM` | Oman | Commons gives its licence as OGL-om 1.0, which is not public domain, CC0 or CC BY, and no MIT flag set draws the same flag at its proportions | [Flag of Oman.svg](https://commons.wikimedia.org/wiki/File:Flag_of_Oman.svg) |
| `CA-MB` | Manitoba | Commons gives its licence as CC BY-SA 4.0, which is not public domain, CC0 or CC BY, and no MIT flag set draws the same flag at its proportions | [Flag of the Province of Manitoba.svg](https://commons.wikimedia.org/wiki/File:Flag_of_the_Province_of_Manitoba.svg) |
| `FR-ARA` | Auvergne-Rhône-Alpes | Auvergne-Rhône-Alpes has no flag: its regional council uses a logo, and the flag on Commons that Wikidata names joins the arms of the old provinces in a design that no authority adopted. |  |
| `FR-BFC` | Burgundy-Franche-Comté | Bourgogne-Franche-Comté has no flag: its regional council uses a logo, and the flag on Commons that Wikidata names joins the arms of Burgundy and Franche-Comté in a design that no authority adopted. |  |
| `FR-CVL` | Centre-Val de Loire | Centre-Val de Loire has no flag: its regional council uses a logo, and the banner on Commons that Wikidata names is one no authority adopted. |  |
| `FR-GES` | Grand-Est | Grand Est has no flag: its regional council uses a logo, and Wikidata names no flag for it. |  |
| `FR-HDF` | Hauts-de-France | Hauts-de-France has no flag: its regional council uses a logo, and the flag on Commons that Wikidata names is a proposal that no authority adopted. |  |
| `FR-IDF` | Île-de-France | Île-de-France has no flag: its regional council uses a logo, and the banner of fleurs-de-lis that Wikidata names is a cultural flag that no authority adopted. |  |
| `FR-OCC` | Occitanie | Occitanie has no flag: its regional council uses a logo joining the cross of Toulouse and the Catalan stripes, and the flag Wikidata names is one variant of it. The Occitan cross flag belongs to the wider cultural region of Occitania, not to this administrative one. |  |
| `FR-PAC` | Provence-Alpes-Côte-d’Azur | Provence-Alpes-Côte d'Azur has no flag: its regional council uses a logo, and the flag on Commons that Wikidata names joins the arms of Provence, the Dauphiné and Nice in a design that no authority adopted. Provence's own flag covers only part of the region. |  |
| `FR-PDL` | Pays-de-la-Loire | Pays de la Loire has no flag: its regional council uses a logo, and the flag that Wikidata names is a cultural flag that no authority adopted. |  |
| `GB-NIR` | Northern Ireland | Northern Ireland has had no official flag of its own since 1973: the Union Flag is the only flag its government flies. The Ulster Banner (the former Government of Northern Ireland's, 1953 to 1972) and St Patrick's Saltire are flown by some and not by others, and Wikidata gives neither. It has no default flag here; the Union Flag and the Ulster Banner are its variants, asked for by name (`flag("GB-NIR", { variant: "union-flag" })`, docs/decisions.md). |  |
| `JP-34` | Hiroshima | Commons gives its licence as not stated, which is not public domain, CC0 or CC BY, and no MIT flag set draws the same flag at its proportions | [Flag of Hiroshima Prefecture.svg](https://commons.wikimedia.org/wiki/File:Flag_of_Hiroshima_Prefecture.svg) |
| `JP-37` | Kagawa | Commons gives its licence as CC BY-SA 3.0, which is not public domain, CC0 or CC BY, and no MIT flag set draws the same flag at its proportions | [Flag of Kagawa Prefecture.svg](https://commons.wikimedia.org/wiki/File:Flag_of_Kagawa_Prefecture.svg) |

## Left out for their licence, for the maintainer to decide

These files are on Commons under a licence that is not public domain, CC0 or CC BY, and no MIT flag set draws the
same flag at its true proportions, so they are not bundled. Each could come in by a decision, recorded in
`ACCEPTED` in `scripts/data-config.ts`: accepting the licence as it is (CC BY-SA would bind every user of the
package to share alike), or naming a public-domain drawing of the same flag on Commons.

| Code | Place | Commons file | Licence as Commons states it | A public-domain template on the page too |
| --- | --- | --- | --- | --- |
| `CC` | Cocos (Keeling) Islands | [Flag of the Cocos (Keeling) Island.svg](https://commons.wikimedia.org/wiki/File:Flag_of_the_Cocos_(Keeling)_Island.svg) | CC BY-SA 4.0 | no |
| `OM` | Oman | [Flag of Oman.svg](https://commons.wikimedia.org/wiki/File:Flag_of_Oman.svg) | OGL-om 1.0 | no |
| `CA-MB` | Manitoba | [Flag of the Province of Manitoba.svg](https://commons.wikimedia.org/wiki/File:Flag_of_the_Province_of_Manitoba.svg) | CC BY-SA 4.0 | no |
| `JP-34` | Hiroshima | [Flag of Hiroshima Prefecture.svg](https://commons.wikimedia.org/wiki/File:Flag_of_Hiroshima_Prefecture.svg) | not stated | no |
| `JP-37` | Kagawa | [Flag of Kagawa Prefecture.svg](https://commons.wikimedia.org/wiki/File:Flag_of_Kagawa_Prefecture.svg) | CC BY-SA 3.0 | no |
