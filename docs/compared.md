# Where the flag sets draw something else

Made by `pnpm data` from `scripts/choices.data.json` and `REVIEWED` in `scripts/data-config.ts`; a test fails if
this list and the data differ, or a place on it has not been looked at. `pnpm data:choose` compares every set's
drawing of a flag, at whatever shape the set draws it (4:3, 3:2, 1:1 or round), with Commons' drawing put in the
same shape, cropped or stretched, at 96 pixels wide and by the names of the colours, so that fine detail and a
shade do not count. A set whose closest drawing still differs in more than a quarter of its pixels is listed
here, and a person has looked at the drawings side by side (`pnpm data:sheet <out.png> --compared`). Where the
difference is the design itself, [decisions.md](decisions.md) says which ships and why.

| Code | Place | Shipped | Sets that differ (closest drawing, share of pixels) | Looked at |
| --- | --- | --- | --- | --- |
| `AF` | Afghanistan | commons | flag-icons 96%, country-flag-icons 93%, circle-flags 76% | design: Wikidata's preferred flag is the Taliban's (since 2021-08-15); every set draws the Islamic Republic's tricolour. |
| `BB` | Barbados | commons | circle-flags 41% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `BL` | St. Barthélemy | commons | flag-icons 89%, country-flag-icons 45%, circle-flags 29% | design: Commons' drawing is the collectivity's local flag; flag-icons draws France's. |
| `BS` | Bahamas | commons | flag-icons 25% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `BZ` | Belize | commons | flag-icons 35% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `DJ` | Djibouti | commons | flag-icons 25% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `DM` | Dominica | commons | country-flag-icons 30% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `ES` | Spain | commons | country-flag-icons 47% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `ET` | Ethiopia | commons | flag-icons 33% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `GF` | French Guiana | commons | country-flag-icons 100%, circle-flags 79% | design: Wikidata gives France's flag; country-flag-icons and circle-flags draw the regional flag of French Guiana. |
| `GP` | Guadeloupe | commons | circle-flags 75% | design: Commons gives France's flag (data-config CHOSEN); circle-flags draws a local flag. |
| `GS` | South Georgia & South Sandwich Islands | commons | circle-flags 27% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `GY` | Guyana | commons | flag-icons 28%, circle-flags 30% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `IO` | British Indian Ocean Territory | commons | country-flag-icons 37%, circle-flags 48% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `JM` | Jamaica | commons | flag-icons 34%, country-flag-icons 35%, circle-flags 26% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `KI` | Kiribati | commons | flag-icons 26%, circle-flags 34% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `KN` | St. Kitts & Nevis | commons | country-flag-icons 38% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `KY` | Cayman Islands | commons | circle-flags 26% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `LK` | Sri Lanka | commons | flag-icons 55%, country-flag-icons 82%, circle-flags 65% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `LT` | Lithuania | commons | country-flag-icons 33% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `MF` | St. Martin | commons | country-flag-icons 55%, circle-flags 42% | design: Wikidata gives France's flag; the sets draw Saint Martin's local flag. |
| `MP` | Northern Mariana Islands | commons | flag-icons 28%, country-flag-icons 31% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `MU` | Mauritius | commons | circle-flags 26% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `MY` | Malaysia | commons | circle-flags 38% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `MZ` | Mozambique | commons | flag-icons 36%, circle-flags 32% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `NC` | New Caledonia | commons | circle-flags 28% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `NP` | Nepal | commons | country-flag-icons 26%, circle-flags 28% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `PK` | Pakistan | commons | flag-icons 76%, circle-flags 60% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `PM` | St. Pierre & Miquelon | commons | flag-icons 82%, country-flag-icons 90%, circle-flags 29% | design: Commons' drawing is the local flag of Saint-Pierre and Miquelon; flag-icons and country-flag-icons draw France's. |
| `PN` | Pitcairn Islands | commons | circle-flags 26% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `RE` | Réunion | commons | circle-flags 63% | design: Wikidata gives France's flag; circle-flags draws the Lofo, a flag proposed for Réunion. |
| `SB` | Solomon Islands | commons | flag-icons 29% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `SH` | St. Helena | commons | country-flag-icons 69%, circle-flags 58% | design: Wikidata gives the Union Flag for Saint Helena, Ascension and Tristan da Cunha; the sets draw Saint Helena's own flag. |
| `SZ` | Eswatini | commons | circle-flags 40% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `TM` | Turkmenistan | commons | circle-flags 25% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `UM` | U.S. Outlying Islands | commons | flag-icons 52%, country-flag-icons 51%, circle-flags 55% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `US` | United States | commons | circle-flags 38% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `UY` | Uruguay | commons | circle-flags 34% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `VI` | U.S. Virgin Islands | commons | country-flag-icons 36%, circle-flags 36% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `WF` | Wallis & Futuna | commons | flag-icons 62% | design: Commons' drawing is Wallis and Futuna's local flag; flag-icons draws France's. |
| `YT` | Mayotte | commons | flag-icons 83%, country-flag-icons 38%, circle-flags 29% | design: Commons' drawing is Mayotte's local flag, with its lettering; flag-icons draws France's. |
| `ZW` | Zimbabwe | commons | country-flag-icons 26% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `CA-BC` | British Columbia | commons | circle-flags 40% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `US-DC` | Washington DC | commons | circle-flags 27% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `US-SC` | South Carolina | commons | circle-flags 73% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `US-UM` | U.S. Outlying Islands | commons | circle-flags 55% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `US-VI` | U.S. Virgin Islands | commons | circle-flags 36% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
| `US-WY` | Wyoming | commons | circle-flags 30% | same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one |
