# What is on each flag

Made by `pnpm data` (scripts/tag-data.ts); do not edit it by hand. Every flag and every variant with a drawing of
its own has tags from a closed list, and each tag says where it comes from:

- `computed`: measured from the drawing by a rule with no judgement in it (`pnpm data:tags`): the whole flag is
  bands across or down, or one colour.
- `wikidata`: the flag's Wikidata item says it depicts (P180) a thing of that kind (read 2026-11-17, CC0).
- `unreviewed`: an automated guess that nobody has checked: a category of the drawing's file on Wikimedia Commons,
  the same bands at both edges of the flag, or a great many colours.
- `reviewed`: a person looked at the flag and said so (`TAG_REVIEWS` in scripts/tag-config.ts).

Nothing automated passes as checked: a tag is `reviewed` only when a person has put it in `TAG_REVIEWS`, which
can also take a wrong tag away. To review a flag, look at it, add a line for it there, and run `pnpm data`.

## The tags

| Tag | When it applies | Flags | Reviewed | Computed | Wikidata | Unreviewed |
| --- | --- | --- | --- | --- | --- | --- |
| `plain` | Flat fields of colour with straight edges and nothing drawn on them: one colour, or bands across or down the whole flag. | 67 | 0 | 67 | 0 | 0 |
| `stripes-horizontal` | Bands across the flag, one above another. | 172 | 0 | 55 | 30 | 87 |
| `stripes-vertical` | Bands down the flag, side by side. | 60 | 0 | 12 | 7 | 41 |
| `stripes-diagonal` | A band or a division from corner to corner. | 16 | 0 | 0 | 10 | 6 |
| `cross` | A cross of any kind, upright or not; a Nordic cross and the crosses of a Union Flag count. | 65 | 0 | 0 | 43 | 22 |
| `nordic-cross` | A cross whose upright is nearer the hoist, as on Denmark's flag. | 7 | 0 | 0 | 7 | 0 |
| `saltire` | A diagonal cross, as on Scotland's or Jamaica's flag. | 45 | 0 | 0 | 34 | 11 |
| `canton` | A rectangle of its own in the corner by the hoist, as on the flag of the United States. | 43 | 0 | 0 | 12 | 31 |
| `stars` | One star or more, of any number of points, or a constellation. | 131 | 0 | 0 | 88 | 43 |
| `crescent` | A crescent moon. | 22 | 0 | 0 | 15 | 7 |
| `sun` | A sun, as a disc or with rays. | 36 | 0 | 0 | 21 | 15 |
| `circle` | A disc or a ring that is a shape of the flag itself. | 32 | 0 | 0 | 20 | 12 |
| `triangle` | A triangle, most often at the hoist. | 31 | 0 | 0 | 25 | 6 |
| `emblem` | A seal, a badge, a shield or another device placed on the flag; a coat of arms counts. | 104 | 0 | 0 | 52 | 52 |
| `coat-of-arms` | A coat of arms. | 66 | 0 | 0 | 48 | 18 |
| `animal` | An animal or a bird, real or of legend. | 54 | 0 | 0 | 23 | 31 |
| `plant` | A tree, a leaf, a flower or another plant. | 49 | 0 | 0 | 23 | 26 |
| `building` | A building, a tower or a bridge. | 4 | 0 | 0 | 1 | 3 |
| `weapon` | A sword, a spear or another weapon. | 17 | 0 | 0 | 8 | 9 |
| `crown` | A crown. | 11 | 0 | 0 | 7 | 4 |
| `map` | The outline of a land. | 11 | 0 | 0 | 9 | 2 |
| `text` | Letters or words, in any script. | 89 | 0 | 1 | 40 | 48 |

## Every flag

61 of the 528 pictures have no tag yet.

| Code | Flag | Tags, each with its source and what it rests on |
| --- | --- | --- |
| `AD` | Andorra | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (wikidata: Q81526 depicts coat of arms of Andorra (Q170553), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q81526 depicts coat of arms of Andorra (Q170553), a kind of coat of arms (Q14659)) |
| `AE` | United Arab Emirates |  |
| `AF` | Afghanistan | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom) |
| `AG` | Antigua & Barbuda | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `sun` (wikidata: Q135034 depicts Sun (Q525)); `triangle` (wikidata: Q135034 depicts pile (Q3205956)) |
| `AI` | Anguilla | `cross` (wikidata: Q189604 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q189604 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q189604 depicts coat of arms of Anguilla (Q752770), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q189604 depicts coat of arms of Anguilla (Q752770), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Flags with 3 fishes") |
| `AL` | Albania | `animal` (wikidata: Q48409 depicts double-headed eagle (Q622964)) |
| `AM` | Armenia | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `AO` | Angola | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `stars` (wikidata: Q124329 depicts five-pointed star (Q379860)) |
| `AR` | Argentina | `stripes-horizontal` (wikidata: Q130774 depicts fess (Q1088484)); `sun` (wikidata: Q130774 depicts Sun (Q525)) |
| `AS` | American Samoa | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `triangle` (wikidata: Q242502 depicts triangle (Q19821)); `emblem` (unreviewed: 9 colours, as a seal or a coat of arms has); `animal` (wikidata: Q242502 depicts bald eagle (Q127216), a kind of animal (Q729)); `weapon` (wikidata: Q242502 depicts club (Q392326), a kind of weapon (Q728)) |
| `AT` | Austria | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `AU` | Australia | `cross` (wikidata: Q81676 depicts Blue Ensign (Q885701)); `saltire` (wikidata: Q81676 depicts Blue Ensign (Q885701)); `canton` (wikidata: Q81676 depicts Blue Ensign (Q885701)); `stars` (wikidata: Q81676 depicts Crux (Q10542), a kind of constellation (Q8928)) |
| `AW` | Aruba | `stripes-horizontal` (wikidata: Q188839 depicts fess (Q1088484)); `stars` (unreviewed: Commons category "Flags with one red four-pointed star") |
| `AX` | Åland Islands | `cross` (wikidata: Q202610 depicts Nordic cross (Q13100174)); `nordic-cross` (wikidata: Q202610 depicts Nordic cross (Q13100174)) |
| `AZ` | Azerbaijan | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q82236 depicts star and crescent (Q3592503)); `crescent` (wikidata: Q82236 depicts star and crescent (Q3592503)) |
| `BA` | Bosnia & Herzegovina | `stars` (wikidata: Q162033 depicts five-pointed star (Q379860)) |
| `BB` | Barbados | `stripes-vertical` (wikidata: Q104351 depicts pale (Q593676)); `weapon` (wikidata: Q104351 depicts trident (Q271628), a kind of weapon (Q728)) |
| `BD` | Bangladesh | `sun` (wikidata: Q127179 depicts Sun (Q525)); `circle` (wikidata: Q127179 depicts roundel (Q1265761)) |
| `BE` | Belgium | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `BF` | Burkina Faso | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `stars` (wikidata: Q134252 depicts five-pointed star (Q379860)) |
| `BG` | Bulgaria | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `BH` | Bahrain | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom) |
| `BI` | Burundi | `cross` (unreviewed: a band across and a band down, each the same at both edges); `saltire` (wikidata: Q103084 depicts saltire (Q201960)); `stars` (wikidata: Q103084 depicts six-pointed star (Q27921428)) |
| `BJ` | Benin |  |
| `BM` | Bermuda | `cross` (wikidata: Q190064 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q190064 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (unreviewed: 10 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with coats of arms from the British possessions"); `animal` (unreviewed: Commons category "Flags with lions facing forward") |
| `BN` | Brunei | `stripes-diagonal` (wikidata: Q165872 depicts bend (Q805079)) |
| `BO` | Bolivia | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across); `emblem` (wikidata: Q134874 depicts coat of arms of Bolivia (Q207785), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q134874 depicts coat of arms of Bolivia (Q207785), a kind of coat of arms (Q14659)) |
| `BR` | Brazil | `stars` (wikidata: Q82194 depicts Sirius (Q3409), a kind of star (Q523)); `circle` (wikidata: Q82194 depicts disk (Q238231)); `text` (wikidata: Q82194 depicts motto (Q42470)) |
| `BS` | Bahamas | `stripes-horizontal` (wikidata: Q103447 depicts fess (Q1088484)); `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `triangle` (wikidata: Q103447 depicts equilateral triangle (Q157002)) |
| `BT` | Bhutan | `animal` (wikidata: Q134521 depicts Druk (Q2344734)) |
| `BW` | Botswana | `plain` (computed: the whole flag is five bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is five bands across) |
| `BY` | Belarus |  |
| `BZ` | Belize | `stripes-horizontal` (wikidata: Q169192 depicts bar (Q4857865)); `emblem` (wikidata: Q169192 depicts coat of arms of Belize (Q203016), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q169192 depicts coat of arms of Belize (Q203016), a kind of coat of arms (Q14659)) |
| `CA` | Canada | `stripes-vertical` (wikidata: Q80110 depicts pale (Q593676)); `plant` (wikidata: Q80110 depicts maple leaf (Q1068978)) |
| `CD` | Congo - Kinshasa | `stripes-diagonal` (wikidata: Q164584 depicts bend sinister (Q725356)); `stars` (wikidata: Q164584 depicts five-pointed star (Q379860)) |
| `CF` | Central African Republic | `stripes-horizontal` (wikidata: Q165775 depicts barry (Q15140897)); `stripes-vertical` (wikidata: Q165775 depicts pale (Q593676)); `stars` (wikidata: Q165775 depicts five-pointed star (Q379860)) |
| `CG` | Congo - Brazzaville | `stripes-diagonal` (wikidata: Q163333 depicts bend sinister (Q725356)) |
| `CH` | Switzerland |  |
| `CI` | Côte d’Ivoire | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `CK` | Cook Islands | `cross` (wikidata: Q193693 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q193693 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `stars` (wikidata: Q193693 depicts five-pointed star (Q379860)) |
| `CL` | Chile | `canton` (wikidata: Q160872 depicts canton (Q1267314)); `stars` (wikidata: Q160872 depicts five-pointed star (Q379860)) |
| `CM` | Cameroon | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `stars` (wikidata: Q159872 depicts five-pointed star (Q379860)) |
| `CN` | China | `stars` (wikidata: Q131147 depicts five-pointed star (Q379860)) |
| `CO` | Colombia | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `CR` | Costa Rica | `plain` (computed: the whole flag is five bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is five bands across); `emblem` (wikidata: Q170289 depicts coat of arms of Costa Rica (Q206398), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q170289 depicts coat of arms of Costa Rica (Q206398), a kind of coat of arms (Q14659)) |
| `CU` | Cuba | `stripes-horizontal` (wikidata: Q163008 depicts bar (Q4857865)); `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (wikidata: Q163008 depicts five-pointed star (Q379860)); `triangle` (wikidata: Q163008 depicts equilateral triangle (Q157002)) |
| `CV` | Cape Verde | `stripes-horizontal` (wikidata: Q102944 depicts barrulet (Q1815803)); `stars` (wikidata: Q102944 depicts five-pointed star (Q379860)) |
| `CW` | Curaçao | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (unreviewed: Commons category "Flags with stars, upper-left") |
| `CX` | Christmas Island | `stripes-diagonal` (unreviewed: Commons category "Diagonal bicolor blue and green flags"); `stars` (wikidata: Q336328 depicts Crux (Q10542), a kind of constellation (Q8928)); `circle` (wikidata: Q336328 depicts roundel (Q1265761)); `animal` (wikidata: Q336328 depicts White-tailed Tropicbird (Q528117), a kind of animal (Q729)); `map` (wikidata: Q336328 depicts map (Q4006)) |
| `CY` | Cyprus | `plant` (wikidata: Q4633 depicts olive branch (Q138550)); `map` (wikidata: Q4633 depicts map (Q4006)) |
| `CZ` | Czechia | `triangle` (wikidata: Q127155 depicts equilateral triangle (Q157002)) |
| `DE` | Germany | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `DJ` | Djibouti | `stars` (wikidata: Q102184 depicts five-pointed star (Q379860)); `triangle` (wikidata: Q102184 depicts equilateral triangle (Q157002)) |
| `DK` | Denmark | `cross` (wikidata: Q60149 depicts Nordic cross (Q13100174)); `nordic-cross` (wikidata: Q60149 depicts Nordic cross (Q13100174)) |
| `DM` | Dominica | `cross` (wikidata: Q179383 depicts cross (Q40843)); `saltire` (unreviewed: Commons category "Flags with crosses and saltires"); `stars` (wikidata: Q179383 depicts five-pointed star (Q379860)); `circle` (wikidata: Q179383 depicts roundel (Q2049919)); `animal` (wikidata: Q179383 depicts Imperial Amazon (Q1165844), a kind of animal (Q729)) |
| `DO` | Dominican Republic | `cross` (wikidata: Q184265 depicts cross (Q40843)); `saltire` (unreviewed: Commons category "Flags with crosses and saltires"); `emblem` (wikidata: Q184265 depicts coat of arms of the Dominican Republic (Q271201), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q184265 depicts coat of arms of the Dominican Republic (Q271201), a kind of coat of arms (Q14659)) |
| `DZ` | Algeria | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (wikidata: Q83392 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q83392 depicts star and crescent (Q3592503)) |
| `EC` | Ecuador | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (wikidata: Q165542 depicts coat of arms of Ecuador (Q244988), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q165542 depicts coat of arms of Ecuador (Q244988), a kind of coat of arms (Q14659)) |
| `EE` | Estonia | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `EG` | Egypt | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `animal` (wikidata: Q130458 depicts Eagle of Saladin (Q358209)) |
| `ER` | Eritrea | `triangle` (wikidata: Q170555 depicts pile issuant from dexter (Q27927595)); `emblem` (wikidata: Q170555 depicts emblem of Eritrea (Q109120), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q170555 depicts emblem of Eritrea (Q109120), a kind of coat of arms (Q14659)) |
| `ES` | Spain | `stripes-horizontal` (wikidata: Q121688 depicts fess (Q1088484)); `emblem` (wikidata: Q121688 depicts Coat of arms of Spain (Q170600), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q121688 depicts Coat of arms of Spain (Q170600), a kind of coat of arms (Q14659)) |
| `ET` | Ethiopia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (wikidata: Q162068 depicts Emblem of Ethiopia (Q193781), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q162068 depicts Emblem of Ethiopia (Q193781), a kind of coat of arms (Q14659)) |
| `FI` | Finland | `cross` (wikidata: Q47891 depicts Nordic cross (Q13100174)); `nordic-cross` (wikidata: Q47891 depicts Nordic cross (Q13100174)) |
| `FJ` | Fiji | `cross` (wikidata: Q182514 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q182514 depicts Union Jack (Q3173323)); `emblem` (wikidata: Q182514 depicts Fijian shield-of-arms (Q28033669), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q182514 depicts Fijian shield-of-arms (Q28033669), a kind of coat of arms (Q14659)) |
| `FK` | Falkland Islands | `cross` (wikidata: Q185273 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q185273 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q185273 depicts coat of arms of the Falkland Islands (Q437414), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q185273 depicts coat of arms of the Falkland Islands (Q437414), a kind of coat of arms (Q14659)); `text` (unreviewed: Commons category "Flags with mottos") |
| `FM` | Micronesia | `stars` (wikidata: Q190648 depicts five-pointed star (Q379860)) |
| `FO` | Faroe Islands | `cross` (wikidata: Q4575 depicts Nordic cross (Q13100174)); `nordic-cross` (wikidata: Q4575 depicts Nordic cross (Q13100174)) |
| `FR` | France | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `GA` | Gabon | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `GB` | United Kingdom | `cross` (wikidata: Q83278 depicts St George's Cross (Q614328)); `saltire` (wikidata: Q83278 depicts saltire (Q201960)) |
| `GD` | Grenada | `stars` (wikidata: Q103414 depicts five-pointed star (Q379860)); `circle` (wikidata: Q103414 depicts roundel (Q1265761)); `plant` (wikidata: Q103414 depicts nutmeg (Q83165), a kind of plant (Q756)) |
| `GE` | Georgia | `cross` (wikidata: Q26491 depicts St George's Cross (Q614328)) |
| `GG` | Guernsey | `cross` (unreviewed: a band across and a band down, each the same at both edges) |
| `GH` | Ghana | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q160676 depicts five-pointed star (Q379860)) |
| `GI` | Gibraltar | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `building` (unreviewed: Commons category "Castles on flags of the United Kingdom") |
| `GL` | Greenland | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `sun` (wikidata: Q184268 depicts Sun (Q525)); `circle` (wikidata: Q184268 depicts roundel (Q1265761)) |
| `GM` | Gambia | `plain` (computed: the whole flag is five bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is five bands across) |
| `GN` | Guinea | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `GQ` | Equatorial Guinea | `stripes-horizontal` (unreviewed: Commons category "Flags with three horizontal stripes of green, white and red color combination"); `stars` (unreviewed: Commons category "Flags with black bordered stars"); `triangle` (wikidata: Q170554 depicts triangle (Q19821)); `emblem` (wikidata: Q170554 depicts coat of arms of Equatorial Guinea (Q207533), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q170554 depicts coat of arms of Equatorial Guinea (Q207533), a kind of coat of arms (Q14659)); `plant` (unreviewed: Commons category "Flags with trees"); `text` (unreviewed: Commons category "Flags with black inscriptions") |
| `GR` | Greece | `stripes-horizontal` (wikidata: Q129132 depicts barry (Q15140897)); `cross` (wikidata: Q129132 depicts Greek cross (Q612908)); `canton` (wikidata: Q129132 depicts canton (Q1267314)) |
| `GS` | South Georgia & South Sandwich Islands | `cross` (wikidata: Q245213 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q245213 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q245213 depicts Coat of arms of South Georgia and the South Sandwich Islands (Q255719), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q245213 depicts Coat of arms of South Georgia and the South Sandwich Islands (Q255719), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Flags with lions facing left"); `text` (unreviewed: Commons category "Inscribed flags") |
| `GT` | Guatemala | `stripes-vertical` (wikidata: Q178179 depicts pale (Q593676)); `emblem` (unreviewed: 10 colours, as a seal or a coat of arms has) |
| `GU` | Guam | `emblem` (unreviewed: 10 colours, as a seal or a coat of arms has); `plant` (unreviewed: Commons category "Flags with 1 palm"); `text` (unreviewed: Commons category "Inscribed flags, names") |
| `GW` | Guinea-Bissau | `stars` (wikidata: Q102953 depicts five-pointed star (Q379860)) |
| `GY` | Guyana | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `triangle` (wikidata: Q171124 depicts equilateral triangle (Q157002)) |
| `HK` | Hong Kong SAR China | `stars` (unreviewed: Commons category "Flags with five red five-pointed stars"); `plant` (wikidata: Q186456 depicts Bauhinia × blakeana (Q378062), a kind of plant (Q756)) |
| `HN` | Honduras | `stripes-horizontal` (wikidata: Q102939 depicts fess (Q1088484)); `stars` (wikidata: Q102939 depicts five-pointed star (Q379860)) |
| `HR` | Croatia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (unreviewed: Commons category "Flags with star and crescent"); `crescent` (unreviewed: Commons category "Flags with 1 white crescent"); `emblem` (wikidata: Q133015 depicts Coat of arms of Croatia (Q184252), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q133015 depicts Coat of arms of Croatia (Q184252), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Flags with animals"); `crown` (unreviewed: Commons category "Flags with 3 crowns") |
| `HT` | Haiti | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `emblem` (wikidata: Q102987 depicts Coat of Arms of Haiti (Q207701), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q102987 depicts Coat of Arms of Haiti (Q207701), a kind of coat of arms (Q14659)) |
| `HU` | Hungary | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `ID` | Indonesia | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `IE` | Ireland | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `IL` | Israel | `stripes-horizontal` (wikidata: Q128480 depicts bar (Q4857865)); `stars` (wikidata: Q128480 depicts Star of David (Q161396)) |
| `IM` | Isle of Man | `stars` (unreviewed: Commons category "Flags with three yellow five-pointed stars") |
| `IN` | India | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly) |
| `IO` | British Indian Ocean Territory | `cross` (wikidata: Q329280 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q329280 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `plant` (wikidata: Q329280 depicts Q14080, a kind of plant (Q756)); `crown` (wikidata: Q329280 depicts crown (Q170984)) |
| `IQ` | Iraq | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `text` (wikidata: Q162781 depicts Takbir (Q191811)) |
| `IR` | Iran | `emblem` (wikidata: Q126622 depicts Emblem of Iran (Q188028)); `text` (unreviewed: Commons category "Flags with shahada") |
| `IS` | Iceland | `cross` (wikidata: Q93335 depicts Nordic cross (Q13100174)); `nordic-cross` (wikidata: Q93335 depicts Nordic cross (Q13100174)) |
| `IT` | Italy | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `JE` | Jersey | `cross` (unreviewed: a band across and a band down, each the same at both edges); `saltire` (unreviewed: Commons category "Flags with crosses and saltires"); `emblem` (unreviewed: Commons category "Flags with coats of arms from the British possessions"); `coat-of-arms` (unreviewed: Commons category "Flags with coats of arms from the British possessions"); `animal` (unreviewed: Commons category "Flags with leopards"); `crown` (unreviewed: Commons category "Flags with 1 crown") |
| `JM` | Jamaica | `cross` (unreviewed: a band across and a band down, each the same at both edges); `saltire` (wikidata: Q172517 depicts saltire (Q201960)) |
| `JO` | Jordan | `stars` (wikidata: Q170064 depicts seven-pointed star (Q3592528)); `triangle` (wikidata: Q170064 depicts triangle (Q19821)) |
| `JP` | Japan | `sun` (wikidata: Q43175 depicts Sun (Q525)); `circle` (wikidata: Q43175 depicts roundel (Q1265761)) |
| `KE` | Kenya | `stripes-horizontal` (unreviewed: the same five bands at the hoist and at the fly); `emblem` (wikidata: Q165905 depicts shield (Q131559)); `weapon` (wikidata: Q165905 depicts spear (Q44475), a kind of weapon (Q728)) |
| `KG` | Kyrgyzstan | `sun` (wikidata: Q165641 depicts Sun (Q525)) |
| `KH` | Cambodia | `stripes-horizontal` (wikidata: Q162999 depicts fess (Q1088484)); `building` (wikidata: Q162999 depicts Angkor Wat (Q43473), a kind of building (Q41176)) |
| `KI` | Kiribati | `stripes-horizontal` (wikidata: Q117758 depicts barry (Q15140897)); `sun` (wikidata: Q117758 depicts Sun (Q525)); `animal` (wikidata: Q117758 depicts Fregata (Q203472), a kind of animal (Q729)) |
| `KM` | Comoros | `stripes-horizontal` (wikidata: Q168917 depicts barry (Q15140897)); `stars` (wikidata: Q168917 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q168917 depicts crescent (Q5488888)); `triangle` (wikidata: Q168917 depicts triangle (Q19821)) |
| `KN` | St. Kitts & Nevis | `stripes-diagonal` (wikidata: Q181120 depicts bend sinister (Q725356)); `stars` (wikidata: Q181120 depicts five-pointed star (Q379860)) |
| `KP` | North Korea | `stripes-horizontal` (wikidata: Q103064 depicts fess (Q1088484)); `stars` (wikidata: Q103064 depicts five-pointed star (Q379860)); `circle` (wikidata: Q103064 depicts roundel (Q1265761)) |
| `KR` | South Korea |  |
| `KW` | Kuwait |  |
| `KY` | Cayman Islands | `cross` (wikidata: Q174487 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q174487 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q174487 depicts coat of arms of the Cayman Islands (Q457635), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q174487 depicts coat of arms of the Cayman Islands (Q457635), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Flags with 1 lion"); `text` (unreviewed: Commons category "Flags with mottos") |
| `KZ` | Kazakhstan | `sun` (wikidata: Q131650 depicts Sun (Q525)); `animal` (wikidata: Q131650 depicts Steppe eagle (Q179359), a kind of animal (Q729)) |
| `LA` | Laos | `stripes-horizontal` (wikidata: Q46008 depicts fess (Q1088484)); `circle` (wikidata: Q46008 depicts roundel (Q1265761)) |
| `LB` | Lebanon | `stripes-horizontal` (wikidata: Q36005 depicts fess (Q1088484)); `plant` (wikidata: Q36005 depicts Cedrus libani (Q61105), a kind of plant (Q756)) |
| `LC` | St. Lucia | `triangle` (wikidata: Q184596 depicts triangle (Q19821)) |
| `LI` | Liechtenstein | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `crown` (wikidata: Q103055 depicts crown (Q170984)) |
| `LK` | Sri Lanka | `animal` (wikidata: Q154823 depicts lion (Q140), a kind of animal (Q729)); `weapon` (wikidata: Q154823 depicts sword (Q12791), a kind of weapon (Q728)) |
| `LR` | Liberia | `canton` (wikidata: Q170795 depicts canton (Q1267314)); `stars` (wikidata: Q170795 depicts five-pointed star (Q379860)) |
| `LS` | Lesotho | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly) |
| `LT` | Lithuania | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `LU` | Luxembourg | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `LV` | Latvia | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `LY` | Libya | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q34599 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q34599 depicts star and crescent (Q3592503)) |
| `MA` | Morocco | `stars` (wikidata: Q159865 depicts pentagram (Q182186)) |
| `MC` | Monaco | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `MD` | Moldova | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (wikidata: Q167584 depicts coat of arms of Moldova (Q201044), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q167584 depicts coat of arms of Moldova (Q201044), a kind of coat of arms (Q14659)) |
| `ME` | Montenegro | `emblem` (wikidata: Q162980 depicts Coat of arms of Montenegro (Q191728), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q162980 depicts Coat of arms of Montenegro (Q191728), a kind of coat of arms (Q14659)) |
| `MG` | Madagascar |  |
| `MH` | Marshall Islands | `stripes-diagonal` (wikidata: Q200260 depicts bend sinister (Q725356)); `sun` (wikidata: Q200260 depicts Sun (Q525)) |
| `MK` | North Macedonia | `cross` (unreviewed: a band across and a band down, each the same at both edges); `sun` (wikidata: Q167119 depicts Sun (Q525)); `circle` (wikidata: Q167119 depicts roundel (Q1265761)) |
| `ML` | Mali | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `MM` | Myanmar (Burma) | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q163753 depicts five-pointed star (Q379860)) |
| `MN` | Mongolia | `stripes-vertical` (wikidata: Q165552 depicts pale (Q593676)) |
| `MO` | Macao SAR China | `stars` (wikidata: Q238759 depicts five-pointed star (Q379860)); `plant` (wikidata: Q238759 depicts flower (Q506)) |
| `MP` | Northern Mariana Islands | `stars` (wikidata: Q328889 depicts five-pointed star (Q379860)); `emblem` (unreviewed: 14 colours, as a seal or a coat of arms has); `plant` (wikidata: Q328889 depicts Plumeria (Q218123), a kind of plant (Q756)) |
| `MQ` | Martinique | `triangle` (unreviewed: Commons category "Flags with fields divided per chevron and 2-stripes (left, plain)") |
| `MR` | Mauritania | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q102977 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q102977 depicts star and crescent (Q3592503)) |
| `MS` | Montserrat | `cross` (wikidata: Q245269 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q245269 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q245269 depicts coat of arms of Montserrat (Q223483), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q245269 depicts coat of arms of Montserrat (Q223483), a kind of coat of arms (Q14659)) |
| `MT` | Malta | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom) |
| `MU` | Mauritius | `plain` (computed: the whole flag is four bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is four bands across) |
| `MV` | Maldives | `crescent` (wikidata: Q169441 depicts crescent (Q5488888)) |
| `MW` | Malawi | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `sun` (wikidata: Q103001 depicts Sun (Q525)) |
| `MX` | Mexico | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (wikidata: Q122462 depicts Mexican coat of arms (Q170867), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q122462 depicts Mexican coat of arms (Q170867), a kind of coat of arms (Q14659)); `plant` (unreviewed: Commons category "Flags with flowers") |
| `MY` | Malaysia | `canton` (wikidata: Q168935 depicts canton (Q1267314)); `stars` (wikidata: Q168935 depicts star and crescent (Q3592503)); `crescent` (wikidata: Q168935 depicts star and crescent (Q3592503)) |
| `MZ` | Mozambique | `stars` (wikidata: Q484249 depicts five-pointed star (Q379860)); `triangle` (wikidata: Q484249 depicts triangle (Q19821)); `weapon` (wikidata: Q484249 depicts Q37116, a kind of weapon (Q728)) |
| `NA` | Namibia | `stripes-diagonal` (wikidata: Q165822 depicts bend sinister (Q725356)); `sun` (wikidata: Q165822 depicts Sun (Q525)) |
| `NC` | New Caledonia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (unreviewed: Commons category "Devices on flags of France") |
| `NE` | Niger | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `sun` (wikidata: Q103046 depicts Sun (Q525)); `circle` (wikidata: Q103046 depicts roundel (Q1265761)) |
| `NF` | Norfolk Island | `stripes-vertical` (wikidata: Q235445 depicts pale (Q593676)); `plant` (wikidata: Q235445 depicts Araucaria heterophylla (Q161070), a kind of plant (Q756)) |
| `NG` | Nigeria | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `NI` | Nicaragua | `stripes-horizontal` (wikidata: Q172533 depicts fess (Q1088484)); `emblem` (wikidata: Q172533 depicts coat of arms of Nicaragua (Q213034), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q172533 depicts coat of arms of Nicaragua (Q213034), a kind of coat of arms (Q14659)) |
| `NL` | Netherlands | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `NO` | Norway | `cross` (wikidata: Q83149 depicts Nordic cross (Q13100174)); `nordic-cross` (wikidata: Q83149 depicts Nordic cross (Q13100174)) |
| `NP` | Nepal | `stars` (wikidata: Q159741 depicts dodecagram (Q3033697)); `crescent` (wikidata: Q159741 depicts crescent (Q5488888)); `sun` (wikidata: Q159741 depicts Sun (Q525)) |
| `NR` | Nauru | `stripes-horizontal` (wikidata: Q185277 depicts fess (Q1088484)); `stars` (wikidata: Q185277 depicts dodecagram (Q3033697)) |
| `NU` | Niue | `cross` (wikidata: Q202189 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q202189 depicts Union Jack (Q3173323)); `stars` (wikidata: Q202189 depicts Crux (Q10542), a kind of constellation (Q8928)); `circle` (wikidata: Q202189 depicts disk (Q238231)) |
| `NZ` | New Zealand | `cross` (wikidata: Q160260 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q160260 depicts Union Jack (Q3173323)); `stars` (wikidata: Q160260 depicts Crux (Q10542), a kind of constellation (Q8928)) |
| `OM` | Oman |  |
| `PA` | Panama | `stars` (wikidata: Q168941 depicts five-pointed star (Q379860)) |
| `PE` | Peru | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `PF` | French Polynesia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `sun` (unreviewed: Commons category "Flags with 1 sun") |
| `PG` | Papua New Guinea | `stars` (wikidata: Q185271 depicts Crux (Q10542), a kind of constellation (Q8928)); `animal` (wikidata: Q185271 depicts Raggiana Bird-of-paradise (Q749577), a kind of animal (Q729)) |
| `PH` | Philippines | `stars` (wikidata: Q134627 depicts five-pointed star (Q379860)); `sun` (wikidata: Q134627 depicts Sun (Q525)); `triangle` (wikidata: Q134627 depicts equilateral triangle (Q157002)) |
| `PK` | Pakistan | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (wikidata: Q128347 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q128347 depicts star and crescent (Q3592503)) |
| `PL` | Poland | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `PN` | Pitcairn Islands | `cross` (wikidata: Q235846 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q235846 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q235846 depicts coat of arms of the Pitcairn Islands (Q460585), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q235846 depicts coat of arms of the Pitcairn Islands (Q460585), a kind of coat of arms (Q14659)); `plant` (unreviewed: Commons category "Flags with flowers") |
| `PR` | Puerto Rico | `stripes-horizontal` (unreviewed: Commons category "Flags with five horizontal stripes, three red, two white"); `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (wikidata: Q15994084 depicts five-pointed star (Q379860)); `triangle` (wikidata: Q15994084 depicts isosceles triangle (Q875937)) |
| `PS` | Palestinian Territories | `stripes-horizontal` (unreviewed: Commons category "Flags with three horizontal stripes of black, white and green color combination"); `triangle` (wikidata: Q191731 depicts triangle (Q19821)) |
| `PT` | Portugal | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `emblem` (wikidata: Q128812 depicts coat of arms of Portugal (Q200195), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q128812 depicts coat of arms of Portugal (Q200195), a kind of coat of arms (Q14659)) |
| `PW` | Palau | `circle` (wikidata: Q188609 depicts roundel (Q1265761)) |
| `PY` | Paraguay | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (wikidata: Q170465 depicts coat of arms of Paraguay (Q211759), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q170465 depicts coat of arms of Paraguay (Q211759), a kind of coat of arms (Q14659)) |
| `QA` | Qatar | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom) |
| `RO` | Romania | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `RS` | Serbia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (wikidata: Q163832 depicts coat of arms of Serbia (Q199860), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q163832 depicts coat of arms of Serbia (Q199860), a kind of coat of arms (Q14659)) |
| `RU` | Russia | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `RW` | Rwanda | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `sun` (wikidata: Q170543 depicts Sun (Q525)) |
| `SA` | Saudi Arabia | `weapon` (wikidata: Q160877 depicts sword (Q12791), a kind of weapon (Q728)); `text` (wikidata: Q160877 depicts Shahada (Q41831)) |
| `SB` | Solomon Islands | `stripes-diagonal` (wikidata: Q75374 depicts bend sinister (Q725356)); `stars` (wikidata: Q75374 depicts five-pointed star (Q379860)) |
| `SC` | Seychelles |  |
| `SD` | Sudan | `triangle` (wikidata: Q102198 depicts triangle (Q19821)) |
| `SE` | Sweden | `cross` (wikidata: Q81286 depicts Nordic cross (Q13100174)); `nordic-cross` (wikidata: Q81286 depicts Nordic cross (Q13100174)) |
| `SG` | Singapore | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `stars` (wikidata: Q483659 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q483659 depicts crescent (Q5488888)) |
| `SH` | St. Helena | `cross` (unreviewed: Commons category "Union Jack cantons"); `saltire` (unreviewed: Commons category "Union Jack cantons"); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (unreviewed: 13 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with coats of arms from the British possessions"); `animal` (unreviewed: Commons category "Flags with birds") |
| `SI` | Slovenia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (wikidata: Q130807 depicts Coat of arms of Slovenia (Q173189), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q130807 depicts Coat of arms of Slovenia (Q173189), a kind of coat of arms (Q14659)) |
| `SK` | Slovakia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (wikidata: Q160861 depicts Coat of arms of Slovakia (Q189590), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q160861 depicts Coat of arms of Slovakia (Q189590), a kind of coat of arms (Q14659)) |
| `SL` | Sierra Leone | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `SM` | San Marino | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `emblem` (wikidata: Q168925 depicts coat of arms of San Marino (Q193715), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q168925 depicts coat of arms of San Marino (Q193715), a kind of coat of arms (Q14659)) |
| `SN` | Senegal | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `stars` (wikidata: Q134933 depicts five-pointed star (Q379860)) |
| `SO` | Somalia | `stars` (wikidata: Q159538 depicts five-pointed star (Q379860)) |
| `SR` | Suriname | `stripes-horizontal` (wikidata: Q180725 depicts fess (Q1088484)); `stars` (wikidata: Q180725 depicts five-pointed star (Q379860)) |
| `SS` | South Sudan | `stars` (wikidata: Q182782 depicts five-pointed star (Q379860)); `triangle` (wikidata: Q182782 depicts triangle (Q19821)) |
| `ST` | São Tomé & Príncipe | `stripes-horizontal` (wikidata: Q169907 depicts fess (Q1088484)); `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (wikidata: Q169907 depicts five-pointed star (Q379860)); `triangle` (wikidata: Q169907 depicts triangle (Q19821)) |
| `SV` | El Salvador | `stripes-horizontal` (wikidata: Q173554 depicts fess (Q1088484)); `sun` (unreviewed: Commons category "Flags with 1 sun"); `triangle` (unreviewed: Commons category "Flags with yellow triangles"); `emblem` (wikidata: Q173554 depicts coat of arms of El Salvador (Q242981), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q173554 depicts coat of arms of El Salvador (Q242981), a kind of coat of arms (Q14659)); `plant` (unreviewed: Commons category "Flags with laurel"); `text` (unreviewed: Commons category "Flags with mottos") |
| `SX` | Sint Maarten | `triangle` (unreviewed: Commons category "Flags with fields divided per chevron and 2-stripes (left)"); `emblem` (wikidata: Q604735 depicts Coat of arms of Sint Maarten (Q2301719), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q604735 depicts Coat of arms of Sint Maarten (Q2301719), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Flags with birds"); `building` (unreviewed: Commons category "Flags with buildings"); `text` (unreviewed: Commons category "Inscribed flags, expressions") |
| `SY` | Syria | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q45136 depicts five-pointed star (Q379860)) |
| `SZ` | Eswatini | `stripes-horizontal` (wikidata: Q102993 depicts fess (Q1088484)); `weapon` (wikidata: Q102993 depicts spear (Q44475), a kind of weapon (Q728)) |
| `TC` | Turks & Caicos Islands | `cross` (wikidata: Q204143 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q204143 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q204143 depicts Coat of arms of the Turks and Caicos Islands (Q462724), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q204143 depicts Coat of arms of the Turks and Caicos Islands (Q462724), a kind of coat of arms (Q14659)) |
| `TD` | Chad | `plain` (computed: the whole flag is three bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is three bands down) |
| `TF` | French Southern Territories | `canton` (unreviewed: Commons category "Flags with stripes, canton"); `stars` (wikidata: Q695125 depicts five-pointed star (Q379860)); `text` (unreviewed: Commons category "Flags with white inscriptions") |
| `TG` | Togo | `canton` (wikidata: Q103070 depicts canton (Q1267314)); `stars` (wikidata: Q103070 depicts five-pointed star (Q379860)) |
| `TH` | Thailand | `plain` (computed: the whole flag is five bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is five bands across) |
| `TJ` | Tajikistan | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q160124 depicts five-pointed star (Q379860)); `crown` (wikidata: Q160124 depicts crown (Q170984)) |
| `TK` | Tokelau | `stars` (wikidata: Q270377 depicts Crux (Q10542), a kind of constellation (Q8928)) |
| `TL` | Timor-Leste | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (wikidata: Q30768 depicts five-pointed star (Q379860)); `triangle` (wikidata: Q30768 depicts triangle (Q19821)) |
| `TM` | Turkmenistan | `stars` (wikidata: Q41327 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q41327 depicts crescent (Q5488888)) |
| `TN` | Tunisia | `stars` (wikidata: Q162789 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q162789 depicts star and crescent (Q3592503)); `circle` (wikidata: Q162789 depicts roundel (Q1265761)) |
| `TO` | Tonga | `cross` (wikidata: Q188072 depicts Greek cross (Q612908)); `canton` (wikidata: Q188072 depicts canton (Q1267314)) |
| `TR` | Türkiye | `stars` (wikidata: Q81952 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q81952 depicts star and crescent (Q3592503)) |
| `TT` | Trinidad & Tobago | `stripes-diagonal` (wikidata: Q184283 depicts bend (Q805079)) |
| `TV` | Tuvalu | `cross` (wikidata: Q105643 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q105643 depicts Union Jack (Q3173323)); `stars` (wikidata: Q105643 depicts five-pointed star (Q379860)); `map` (wikidata: Q105643 depicts map (Q4006)) |
| `TW` | Taiwan | `canton` (wikidata: Q173535 depicts canton (Q1267314)); `sun` (wikidata: Q173535 depicts Sun (Q525)) |
| `TZ` | Tanzania | `stripes-diagonal` (wikidata: Q170809 depicts bend sinister (Q725356)) |
| `UA` | Ukraine | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `UG` | Uganda | `stripes-horizontal` (unreviewed: the same six bands at the hoist and at the fly); `circle` (wikidata: Q103037 depicts roundel (Q1265761)); `animal` (wikidata: Q103037 depicts Grey Crowned Crane (Q335992), a kind of animal (Q729)) |
| `UM` | U.S. Outlying Islands |  |
| `US` | United States | `stars` (wikidata: Q42537 depicts five-pointed star (Q379860)) |
| `UY` | Uruguay | `canton` (wikidata: Q171103 depicts canton (Q1267314)); `sun` (wikidata: Q171103 depicts Sun (Q525)) |
| `UZ` | Uzbekistan | `stripes-horizontal` (unreviewed: the same five bands at the hoist and at the fly); `stars` (wikidata: Q483774 depicts five-pointed star (Q379860)); `crescent` (wikidata: Q483774 depicts crescent (Q5488888)) |
| `VA` | Vatican City | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `emblem` (unreviewed: 9 colours, as a seal or a coat of arms has); `crown` (wikidata: Q79198 depicts papal tiara (Q1063103)) |
| `VC` | St. Vincent & Grenadines | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom) |
| `VE` | Venezuela | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q165538 depicts five-pointed star (Q379860)) |
| `VG` | British Virgin Islands | `cross` (wikidata: Q204120 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q204120 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q204120 depicts coat of arms of the British Virgin Islands (Q435561), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q204120 depicts coat of arms of the British Virgin Islands (Q435561), a kind of coat of arms (Q14659)); `text` (unreviewed: Commons category "Flags with mottos") |
| `VI` | U.S. Virgin Islands | `animal` (wikidata: Q204666 depicts eagle (Q358148)); `plant` (wikidata: Q204666 depicts Lauraceae (Q26538), a kind of plant (Q756)); `weapon` (wikidata: Q204666 depicts arrow (Q45922), a kind of weapon (Q728)) |
| `VN` | Vietnam | `stars` (wikidata: Q131204 depicts five-pointed star (Q379860)) |
| `VU` | Vanuatu | `stripes-horizontal` (wikidata: Q185285 depicts fess (Q1088484)); `plant` (wikidata: Q185285 depicts fern (Q80005), a kind of plant (Q756)) |
| `WS` | Samoa | `canton` (wikidata: Q188477 depicts canton (Q1267314)); `stars` (wikidata: Q188477 depicts Crux (Q10542), a kind of constellation (Q8928)) |
| `XK` | Kosovo | `stars` (wikidata: Q168711 depicts five-pointed star (Q379860)); `map` (wikidata: Q168711 depicts map (Q4006)) |
| `YE` | Yemen | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `ZA` | South Africa | `stripes-horizontal` (wikidata: Q160250 depicts fess (Q1088484)); `triangle` (wikidata: Q160250 depicts triangle (Q19821)) |
| `ZM` | Zambia | `animal` (wikidata: Q170814 depicts African Fish Eagle (Q217497), a kind of animal (Q729)) |
| `ZW` | Zimbabwe | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `stars` (wikidata: Q159986 depicts five-pointed star (Q379860)); `triangle` (wikidata: Q159986 depicts isosceles triangle (Q875937)); `animal` (wikidata: Q159986 depicts Zimbabwe Bird (Q722475)) |
| `AT-1` | Burgenland | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `AT-2` | Carinthia | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `AT-3` | Lower Austria | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `AT-4` | Upper Austria | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `AT-5` | Salzburg | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `AT-6` | Styria | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `AU-ACT` | Australian Capital Territory | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (wikidata: Q252995 depicts Crux (Q10542), a kind of constellation (Q8928)); `emblem` (wikidata: Q252995 depicts coat of arms of Canberra (Q119097), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q252995 depicts coat of arms of Canberra (Q119097), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Flags with 2 animals") |
| `AU-NSW` | New South Wales | `cross` (wikidata: Q1064042 depicts St George's Cross (Q614328)); `saltire` (wikidata: Q1064042 depicts Union Jack (Q3173323)); `circle` (unreviewed: Commons category "Flags with white disks - British"); `animal` (unreviewed: Commons category "Lions on flags of Australia") |
| `AU-NT` | Northern Territory | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (wikidata: Q599323 depicts Crux (Q10542), a kind of constellation (Q8928)); `plant` (wikidata: Q599323 depicts Gossypium sturtianum (Q339803), a kind of plant (Q756)) |
| `AU-QLD` | Queensland | `cross` (wikidata: Q383109 depicts Maltese cross (Q225937), a kind of cross (Q40843)); `saltire` (wikidata: Q383109 depicts Union Jack (Q3173323)); `circle` (wikidata: Q383109 depicts roundel (Q1265761)); `crown` (wikidata: Q383109 depicts crown (Q170984)) |
| `AU-SA` | South Australia | `cross` (wikidata: Q912854 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q912854 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `circle` (wikidata: Q912854 depicts roundel (Q1265761)); `animal` (wikidata: Q912854 depicts piping shrike (Q7197420)) |
| `AU-TAS` | Tasmania | `cross` (wikidata: Q1074327 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q1074327 depicts Union Jack (Q3173323)); `circle` (wikidata: Q1074327 depicts roundel (Q1265761)); `animal` (wikidata: Q1074327 depicts lion (Q338814)) |
| `AU-VIC` | Victoria | `cross` (wikidata: Q34494 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q34494 depicts Union Jack (Q3173323)); `stars` (wikidata: Q34494 depicts Crux (Q10542), a kind of constellation (Q8928)); `crown` (wikidata: Q34494 depicts St Edward's Crown (Q1294341), a kind of crown (Q170984)) |
| `AU-WA` | Western Australia | `cross` (wikidata: Q1091279 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q1091279 depicts Union Jack (Q3173323)); `animal` (wikidata: Q1091279 depicts Black Swan (Q131044), a kind of animal (Q729)) |
| `BR-AC` | Acre | `stripes-diagonal` (unreviewed: Commons category "Diagonal bicolor green and yellow flags"); `stars` (wikidata: Q2976242 depicts star (Q1191504)); `triangle` (wikidata: Q2976242 depicts right triangle (Q158688)) |
| `BR-AL` | Alagoas | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (wikidata: Q2244303 depicts coat of arms (Q14659)); `coat-of-arms` (wikidata: Q2244303 depicts coat of arms (Q14659)) |
| `BR-AM` | Amazonas | `stripes-horizontal` (unreviewed: Commons category "Flags with trisection horizontal stripes (bicolor)"); `canton` (unreviewed: Commons category "Flags with blue cantons"); `stars` (unreviewed: Commons category "Flags with stars, canton") |
| `BR-AP` | Amapá |  |
| `BR-BA` | Bahia | `stripes-horizontal` (wikidata: Q2283932 depicts bar (Q4857865)); `canton` (wikidata: Q2283932 depicts canton (Q1559605)) |
| `BR-CE` | Ceará | `emblem` (unreviewed: 11 colours, as a seal or a coat of arms has) |
| `BR-DF` | Federal District | `weapon` (unreviewed: Commons category "Flags with arrows") |
| `BR-ES` | Espírito Santo | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `text` (unreviewed: Commons category "Inscribed flags") |
| `BR-GO` | Goiás | `stripes-horizontal` (unreviewed: Commons category "Flags with eight horizontal stripes"); `stars` (unreviewed: Commons category "Flags with five white five-pointed stars") |
| `BR-MA` | Maranhão | `stripes-horizontal` (unreviewed: Commons category "Flags with nine horizontal stripes"); `canton` (unreviewed: Commons category "Flags with cantons"); `stars` (unreviewed: Commons category "Flags with one white five-pointed star") |
| `BR-MG` | Minas Gerais | `triangle` (wikidata: Q2604262 depicts triangle (Q19821)); `text` (unreviewed: Commons category "Flags with Latin inscriptions") |
| `BR-MS` | Mato Grosso do Sul |  |
| `BR-MT` | Mato Grosso | `stars` (unreviewed: Commons category "Flags with circled stars") |
| `BR-PA` | Pará | `stripes-diagonal` (wikidata: Q4026492 depicts bend (Q805079)); `stars` (wikidata: Q4026492 depicts star (Q662639)) |
| `BR-PB` | Paraíba | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `text` (unreviewed: Commons category "White inscriptions on flags of Brazil") |
| `BR-PE` | Pernambuco | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `cross` (unreviewed: Commons category "Flags with 1 red cross"); `stars` (unreviewed: Commons category "Five-pointed stars on flags of Brazil"); `sun` (unreviewed: Commons category "Sun on flags of Brazil") |
| `BR-PI` | Piauí | `stripes-horizontal` (unreviewed: Commons category "Flags with thirteen horizontal stripes"); `canton` (unreviewed: Commons category "Flags with blue cantons"); `stars` (unreviewed: Commons category "Flags with one white five-pointed star"); `text` (unreviewed: Commons category "Flags with Portuguese inscriptions") |
| `BR-PR` | Paraná | `stripes-diagonal` (unreviewed: Commons category "Diagonal bicolor flags (left)"); `stars` (wikidata: Q2981712 depicts Crux (Q10542), a kind of constellation (Q8928)); `emblem` (unreviewed: 9 colours, as a seal or a coat of arms has); `plant` (unreviewed: Commons category "Flags with branches"); `text` (unreviewed: Commons category "Inscribed flags, names") |
| `BR-RJ` | Rio de Janeiro | `emblem` (unreviewed: 10 colours, as a seal or a coat of arms has) |
| `BR-RN` | Rio Grande do Norte | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `stars` (unreviewed: Commons category "Flags with one white five-pointed star"); `emblem` (unreviewed: 12 colours, as a seal or a coat of arms has); `plant` (unreviewed: Commons category "Flags with 2 palms") |
| `BR-RO` | Rondônia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `triangle` (unreviewed: Commons category "Flags with fields divided per chevron (bottom)") |
| `BR-RR` | Roraima | `stripes-horizontal` (unreviewed: Commons category "Flags with one red stripe (horizontal)"); `stars` (unreviewed: Commons category "Flags with one yellow five-pointed star (centered)") |
| `BR-RS` | Rio Grande do Sul | `stripes-diagonal` (unreviewed: Commons category "Diagonal striped flags (right)"); `stars` (unreviewed: Commons category "Flags with two black five-pointed stars"); `emblem` (unreviewed: 12 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from Brazil"); `weapon` (unreviewed: Commons category "Flags with swords") |
| `BR-SC` | Santa Catarina | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly) |
| `BR-SE` | Sergipe | `stripes-horizontal` (unreviewed: Commons category "Flags with quadrisection horizontal stripes (bicolor)"); `stars` (unreviewed: Commons category "Flags with five white five-pointed stars") |
| `BR-SP` | São Paulo | `stripes-horizontal` (unreviewed: Commons category "Flags with thirteen horizontal stripes"); `canton` (unreviewed: Commons category "Flags with red cantons"); `stars` (unreviewed: Commons category "Flags with four yellow five-pointed stars"); `map` (unreviewed: Commons category "Flags with geographic shapes in South America") |
| `BR-TO` | Tocantins | `stripes-diagonal` (unreviewed: Commons category "Diagonal striped flags (right)"); `sun` (unreviewed: Commons category "Flags with the sun, centered") |
| `CA-AB` | Alberta | `emblem` (wikidata: Q1122078 depicts coat of arms of Alberta (Q2060668), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q1122078 depicts coat of arms of Alberta (Q2060668), a kind of coat of arms (Q14659)) |
| `CA-BC` | British Columbia | `cross` (wikidata: Q637134 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q637134 depicts Union Jack (Q3173323)); `sun` (wikidata: Q637134 depicts Sun (Q525)); `crown` (wikidata: Q637134 depicts crown (Q170984)) |
| `CA-MB` | Manitoba | `cross` (wikidata: Q512175 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q512175 depicts Union Jack (Q3173323)); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (wikidata: Q512175 depicts coat of arms of Manitoba (Q1633922), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q512175 depicts coat of arms of Manitoba (Q1633922), a kind of coat of arms (Q14659)) |
| `CA-NB` | New Brunswick | `stripes-horizontal` (unreviewed: the same five bands at the hoist and at the fly); `emblem` (unreviewed: 10 colours, as a seal or a coat of arms has); `animal` (wikidata: Q1418784 depicts lion (Q140), a kind of animal (Q729)) |
| `CA-NL` | Newfoundland and Labrador | `cross` (wikidata: Q636719 depicts ordinary cross (Q1107393), a kind of cross (Q40843)); `saltire` (wikidata: Q636719 depicts saltire (Q201960)); `triangle` (wikidata: Q636719 depicts right triangle (Q158688)) |
| `CA-NS` | Nova Scotia | `cross` (unreviewed: a band across and a band down, each the same at both edges); `saltire` (wikidata: Q601976 depicts saltire (Q201960)); `emblem` (wikidata: Q601976 depicts Royal coat of arms in Scotland (Q217529), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q601976 depicts Royal coat of arms in Scotland (Q217529), a kind of coat of arms (Q14659)) |
| `CA-NT` | Northwest Territories | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (wikidata: Q1426561 depicts coat of arms of the Northwest Territories (Q1511867), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q1426561 depicts coat of arms of the Northwest Territories (Q1511867), a kind of coat of arms (Q14659)) |
| `CA-NU` | Nunavut | `stars` (wikidata: Q1426630 depicts Polaris (Q12980), a kind of star (Q523)) |
| `CA-ON` | Ontario | `cross` (wikidata: Q1165949 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q1165949 depicts Union Jack (Q3173323)); `emblem` (wikidata: Q1165949 depicts coat of arms of Ontario (Q1110507), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q1165949 depicts coat of arms of Ontario (Q1110507), a kind of coat of arms (Q14659)) |
| `CA-PE` | Prince Edward Island | `emblem` (unreviewed: 29 colours, as a seal or a coat of arms has); `animal` (wikidata: Q266618 depicts lion (Q338814)); `plant` (wikidata: Q266618 depicts notable oak tree (Q33036816), a kind of plant (Q756)) |
| `CA-QC` | Quebec | `cross` (wikidata: Q392167 depicts cross (Q40843)); `plant` (wikidata: Q392167 depicts fleur-de-lis (Q211568)) |
| `CA-SK` | Saskatchewan | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `emblem` (wikidata: Q693558 depicts coat of arms of Saskatchewan (Q1807488), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q693558 depicts coat of arms of Saskatchewan (Q1807488), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Flags with lions facing left"); `plant` (wikidata: Q693558 depicts Lilium philadelphicum (Q136874), a kind of plant (Q756)) |
| `CA-YT` | Yukon | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (wikidata: Q2062018 depicts coat of arms of Yukon (Q7406024), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q2062018 depicts coat of arms of Yukon (Q7406024), a kind of coat of arms (Q14659)); `plant` (wikidata: Q2062018 depicts Chamaenerion angustifolium (Q160104), a kind of plant (Q756)) |
| `CH-AG` | Aargau | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom) |
| `CH-AI` | Appenzell Innerrhoden |  |
| `CH-AR` | Appenzell Ausserrhoden |  |
| `CH-BE` | Bern | `animal` (unreviewed: Commons category "Flags with black bears") |
| `CH-BL` | Basel-Landschaft |  |
| `CH-BS` | Basel-Stadt |  |
| `CH-FR` | Fribourg | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `CH-GE` | Geneva |  |
| `CH-GL` | Glarus |  |
| `CH-GR` | Graubünden |  |
| `CH-JU` | Jura | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom) |
| `CH-LU` | Lucerne | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `CH-NE` | Neuchâtel | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom) |
| `CH-NW` | Nidwalden |  |
| `CH-OW` | Obwalden | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly) |
| `CH-SG` | St. Gallen |  |
| `CH-SH` | Schaffhausen |  |
| `CH-SO` | Solothurn | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `CH-SZ` | Schwyz |  |
| `CH-TG` | Thurgau |  |
| `CH-TI` | Ticino | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `CH-UR` | Uri |  |
| `CH-VD` | Vaud | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly) |
| `CH-VS` | Valais | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom) |
| `CH-ZG` | Zug | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `CH-ZH` | Zürich |  |
| `DE-BB` | Brandenburg | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `animal` (unreviewed: Commons category "Flags with eagles facing left") |
| `DE-BE` | Berlin | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `animal` (wikidata: Q819691 depicts Berlin bear (Q884928)) |
| `DE-BW` | Baden-Württemberg | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `DE-BY` | Bavaria |  |
| `DE-HB` | Bremen | `stripes-horizontal` (unreviewed: the same eight bands at the hoist and at the fly) |
| `DE-HE` | Hesse | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `DE-HH` | Hamburg |  |
| `DE-MV` | Mecklenburg-Vorpommern | `plain` (computed: the whole flag is five bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is five bands across) |
| `DE-NI` | Lower Saxony | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (wikidata: Q495469 depicts coat of arms of Lower Saxony (Q2920318), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q495469 depicts coat of arms of Lower Saxony (Q2920318), a kind of coat of arms (Q14659)) |
| `DE-NW` | North Rhine-Westphalia | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `DE-RP` | Rhineland-Palatinate | `stripes-horizontal` (unreviewed: Commons category "Flags with three horizontal stripes of black, red and yellow color combination"); `cross` (unreviewed: Commons category "Flags with the Cross of Trier"); `emblem` (unreviewed: 9 colours, as a seal or a coat of arms has) |
| `DE-SH` | Schleswig-Holstein | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `DE-SL` | Saarland | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly) |
| `DE-SN` | Saxony | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `DE-ST` | Saxony-Anhalt | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `emblem` (wikidata: Q687062 depicts coat of arms of Saxony-Anhalt (Q324151), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q687062 depicts coat of arms of Saxony-Anhalt (Q324151), a kind of coat of arms (Q14659)) |
| `DE-TH` | Thuringia | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `FR-20R` | Corse |  |
| `FR-BRE` | Brittany | `stripes-horizontal` (unreviewed: Commons category "Flags with five black stripes (horizontal)"); `canton` (wikidata: Q12188 depicts canton (Q1267314)) |
| `FR-NAQ` | Nouvelle-Aquitaine | `stripes-vertical` (unreviewed: the same seven bands at the top and at the bottom) |
| `FR-NOR` | Normandie | `animal` (unreviewed: Commons category "Flags with leopards") |
| `GB-ENG` | England | `cross` (wikidata: Q171117 depicts cross (Q40843)); `saltire` (unreviewed: Commons category "Flags with crosses and saltires") |
| `GB-SCT` | Scotland | `cross` (unreviewed: a band across and a band down, each the same at both edges); `saltire` (wikidata: Q102392 depicts saltire (Q201960)) |
| `GB-WLS` | Wales | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `animal` (wikidata: Q185692 depicts dragon (Q1254187)) |
| `JP-01` | Hokkaidō | `stars` (wikidata: Q10903291 depicts seven-pointed star (Q3592528)) |
| `JP-02` | Aomori | `map` (wikidata: Q7751423 depicts map (Q4006)) |
| `JP-03` | Iwate | `text` (wikidata: Q5456760 depicts text (Q234460)) |
| `JP-04` | Miyagi | `text` (wikidata: Q10375927 depicts text (Q234460)) |
| `JP-05` | Akita | `text` (wikidata: Q10375300 depicts text (Q234460)) |
| `JP-06` | Yamagata |  |
| `JP-07` | Fukushima | `text` (wikidata: Q10373575 depicts text (Q234460)) |
| `JP-08` | Ibaraki | `crescent` (unreviewed: Commons category "Flags with crescent-like design elements"); `plant` (unreviewed: Commons category "Flags with white roses") |
| `JP-09` | Tochigi | `text` (wikidata: Q10367791 depicts text (Q234460)) |
| `JP-10` | Gunma | `crescent` (wikidata: Q10364601 depicts crescent (Q5488888)); `text` (wikidata: Q10364601 depicts text (Q234460)) |
| `JP-11` | Saitama |  |
| `JP-12` | Chiba | `text` (wikidata: Q10341503 depicts text (Q234460)) |
| `JP-13` | Tokyo | `sun` (wikidata: Q20900820 depicts Sun (Q525)); `circle` (unreviewed: Commons category "Flags with centered circles"); `emblem` (unreviewed: Commons category "Flags with devices"); `text` (wikidata: Q20900820 depicts text (Q234460)) |
| `JP-14` | Kanagawa | `text` (wikidata: Q10340050 depicts text (Q234460)) |
| `JP-15` | Niigata | `text` (wikidata: Q10339074 depicts text (Q234460)) |
| `JP-16` | Toyama | `text` (wikidata: Q10331599 depicts text (Q234460)) |
| `JP-17` | Ishikawa | `map` (wikidata: Q7218569 depicts map (Q4006)); `text` (wikidata: Q7218569 depicts text (Q234460)) |
| `JP-18` | Fukui | `text` (wikidata: Q10333600 depicts text (Q234460)) |
| `JP-19` | Yamanashi | `text` (wikidata: Q10337049 depicts text (Q234460)) |
| `JP-20` | Nagano | `text` (wikidata: Q10338599 depicts text (Q234460)) |
| `JP-21` | Gifu | `text` (wikidata: Q8944860 depicts text (Q234460)) |
| `JP-22` | Shizuoka | `map` (wikidata: Q10330482 depicts map (Q4006)) |
| `JP-23` | Aichi | `text` (wikidata: Q10327845 depicts text (Q234460)) |
| `JP-24` | Mie | `text` (wikidata: Q10867036 depicts text (Q234460)) |
| `JP-25` | Shiga | `text` (wikidata: Q10323532 depicts text (Q234460)) |
| `JP-26` | Kyōto | `plant` (unreviewed: Commons category "Flags with 1 flower"); `text` (wikidata: Q10883252 depicts text (Q234460)) |
| `JP-27` | Ōsaka | `text` (wikidata: Q10938356 depicts text (Q234460)) |
| `JP-28` | Hyōgo | `text` (wikidata: Q10260857 depicts text (Q234460)) |
| `JP-29` | Nara | `crescent` (unreviewed: Commons category "Flags with crescent-like design elements"); `text` (wikidata: Q10942266 depicts text (Q234460)) |
| `JP-30` | Wakayama | `text` (wikidata: Q10259917 depicts text (Q234460)) |
| `JP-31` | Tottori | `text` (wikidata: Q10259860 depicts text (Q234460)) |
| `JP-32` | Shimane | `text` (wikidata: Q10255463 depicts text (Q234460)) |
| `JP-33` | Okayama | `text` (wikidata: Q11472270 depicts text (Q234460)) |
| `JP-35` | Yamaguchi | `text` (wikidata: Q11044739 depicts text (Q234460)) |
| `JP-36` | Tokushima | `text` (wikidata: Q11071629 depicts text (Q234460)) |
| `JP-38` | Ehime | `stripes-horizontal` (wikidata: Q11493576 depicts fess (Q1088484)); `plant` (wikidata: Q11493576 depicts flower (Q506)) |
| `JP-39` | Kōchi | `text` (wikidata: Q11672428 depicts text (Q234460)) |
| `JP-40` | Fukuoka | `plant` (wikidata: Q11592479 depicts flower (Q506)); `text` (wikidata: Q11592479 depicts text (Q234460)) |
| `JP-41` | Saga | `plant` (wikidata: Q10885976 depicts flower (Q506)) |
| `JP-42` | Nagasaki | `text` (wikidata: Q11652663 depicts text (Q234460)) |
| `JP-43` | Kumamoto | `map` (wikidata: Q11568240 depicts map (Q4006)); `text` (wikidata: Q11568240 depicts text (Q234460)) |
| `JP-44` | Ōita | `text` (wikidata: Q10933740 depicts text (Q234460)) |
| `JP-45` | Miyazaki | `text` (wikidata: Q10950393 depicts text (Q234460)) |
| `JP-46` | Kagoshima | `crescent` (unreviewed: Commons category "Flags with crescent-like design elements"); `map` (wikidata: Q8980339 depicts map (Q4006)) |
| `JP-47` | Okinawa | `circle` (wikidata: Q8980059 depicts roundel (Q1265761)); `text` (wikidata: Q8980059 depicts text (Q234460)) |
| `US-AK` | Alaska | `stars` (wikidata: Q156564 depicts Polaris (Q12980), a kind of star (Q523)) |
| `US-AL` | Alabama | `cross` (unreviewed: a band across and a band down, each the same at both edges); `saltire` (wikidata: Q497997 depicts saltire (Q201960)) |
| `US-AR` | Arkansas |  |
| `US-AZ` | Arizona | `stripes-horizontal` (unreviewed: the same four bands at the hoist and at the fly); `stars` (wikidata: Q632491 depicts five-pointed star (Q379860)); `sun` (unreviewed: Commons category "Radiant sun on flags of the United States") |
| `US-CA` | California | `stripes-horizontal` (wikidata: Q330517 depicts fess (Q1088484)); `stars` (wikidata: Q330517 depicts five-pointed star (Q379860)); `animal` (wikidata: Q330517 depicts Ursus arctos californicus (Q2565286), a kind of animal (Q729)) |
| `US-CO` | Colorado | `stripes-horizontal` (wikidata: Q492546 depicts fess (Q1088484)); `circle` (wikidata: Q492546 depicts roundel (Q1265761)); `text` (unreviewed: Commons category "Inscribed flags, C") |
| `US-CT` | Connecticut | `emblem` (unreviewed: 14 colours, as a seal or a coat of arms has) |
| `US-DC` | Washington DC | `stripes-horizontal` (wikidata: Q906340 depicts bar (Q4857865)); `stars` (wikidata: Q906340 depicts pentagram (Q182186)) |
| `US-DE` | Delaware | `emblem` (unreviewed: 14 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from the United States"); `animal` (unreviewed: Commons category "Animals on flags of the United States"); `plant` (unreviewed: Commons category "Plants on flags of the United States"); `weapon` (unreviewed: Commons category "Flags with weapons"); `text` (unreviewed: Commons category "Flags with Latin inscriptions") |
| `US-FL` | Florida | `cross` (unreviewed: a band across and a band down, each the same at both edges); `saltire` (wikidata: Q730106 depicts saltire (Q201960)); `stars` (unreviewed: Commons category "Flags with 2 stars"); `sun` (unreviewed: Commons category "Flags with 1 sun"); `circle` (unreviewed: Commons category "Flags with centered circles"); `emblem` (unreviewed: 12 colours, as a seal or a coat of arms has); `plant` (unreviewed: Commons category "Flowers on flags of the United States"); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-GA` | Georgia | `stars` (unreviewed: Commons category "Flags with thirteen white five-pointed stars"); `weapon` (unreviewed: Commons category "Flags with swords"); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-HI` | Hawaii | `cross` (wikidata: Q219726 depicts Union Jack (Q3173323)); `saltire` (wikidata: Q219726 depicts Union Jack (Q3173323)) |
| `US-IA` | Iowa | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom) |
| `US-ID` | Idaho | `emblem` (unreviewed: 16 colours, as a seal or a coat of arms has) |
| `US-IL` | Illinois | `emblem` (unreviewed: 12 colours, as a seal or a coat of arms has) |
| `US-IN` | Indiana | `stars` (wikidata: Q673117 depicts five-pointed star (Q379860)); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-KS` | Kansas | `stars` (unreviewed: Commons category "Flags with 34 stars"); `sun` (unreviewed: Commons category "Flags with 1 sun"); `circle` (unreviewed: Commons category "Flags with circles"); `emblem` (wikidata: Q284396 depicts Seal of Kansas (Q1810106), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q284396 depicts Seal of Kansas (Q1810106), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Animals on flags of the United States"); `plant` (wikidata: Q284396 depicts common sunflower (Q171497), a kind of plant (Q756)); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-KY` | Kentucky | `emblem` (wikidata: Q590821 depicts Seal of Kentucky (Q2063402), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q590821 depicts Seal of Kentucky (Q2063402), a kind of coat of arms (Q14659)); `plant` (unreviewed: Commons category "Plants on flags of the United States"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-LA` | Louisiana | `emblem` (unreviewed: 11 colours, as a seal or a coat of arms has); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-MA` | Massachusetts | `stars` (unreviewed: Commons category "One white five-pointed star on flags of the United States"); `emblem` (unreviewed: Commons category "Flags with arms"); `coat-of-arms` (unreviewed: Commons category "Flags with arms"); `weapon` (unreviewed: Commons category "Flags with swords"); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-MD` | Maryland | `cross` (unreviewed: Commons category "Flags with red crosses"); `emblem` (wikidata: Q752569 depicts escutcheon (Q331357), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q752569 depicts escutcheon (Q331357), a kind of coat of arms (Q14659)) |
| `US-ME` | Maine | `stars` (unreviewed: Commons category "Flags with one yellow five-pointed star"); `emblem` (unreviewed: 13 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from the United States"); `animal` (unreviewed: Commons category "Animals on flags of the United States"); `plant` (unreviewed: Commons category "Pines on flags of the United States"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-MI` | Michigan | `sun` (unreviewed: Commons category "Flags with 1 sun"); `emblem` (unreviewed: 14 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from the United States"); `animal` (unreviewed: Commons category "Animals on flags of the United States"); `weapon` (unreviewed: Commons category "Arrows on flags of the United States"); `text` (unreviewed: Commons category "Inscribed flags of the United States") |
| `US-MN` | Minnesota | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `map` (unreviewed: Commons category "Flags with geographic shapes in North America") |
| `US-MO` | Missouri | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `emblem` (unreviewed: 9 colours, as a seal or a coat of arms has) |
| `US-MS` | Mississippi | `stripes-vertical` (wikidata: Q301628 depicts pale (Q593676)); `stars` (wikidata: Q301628 depicts five-pointed star (Q379860)); `plant` (wikidata: Q301628 depicts Magnolia (Q157017), a kind of plant (Q756)) |
| `US-MT` | Montana | `sun` (unreviewed: Commons category "Flags with 1 sun"); `circle` (unreviewed: Commons category "Flags with circles"); `emblem` (unreviewed: 12 colours, as a seal or a coat of arms has); `plant` (unreviewed: Commons category "Trees on flags of the United States"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-NC` | North Carolina |  |
| `US-ND` | North Dakota | `stars` (unreviewed: Commons category "Flags with twelve yellow five-pointed stars"); `emblem` (unreviewed: 18 colours, as a seal or a coat of arms has); `animal` (unreviewed: Commons category "Eagles on flags of the United States"); `plant` (unreviewed: Commons category "Branches on flags of the United States"); `weapon` (unreviewed: Commons category "Arrows on flags of the United States"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-NE` | Nebraska | `circle` (unreviewed: Commons category "Flags with centered circles"); `plant` (unreviewed: Commons category "Trees on flags of the United States"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-NH` | New Hampshire | `stars` (unreviewed: Commons category "Flags with 11 stars"); `sun` (unreviewed: Commons category "Flags with 1 sun"); `circle` (unreviewed: Commons category "Flags with centered circles"); `emblem` (unreviewed: 13 colours, as a seal or a coat of arms has); `plant` (unreviewed: Commons category "Laurel wreaths on flags of the United States"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-NJ` | New Jersey | `emblem` (unreviewed: 13 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from the United States"); `animal` (unreviewed: Commons category "Flags with brown horses"); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-NM` | New Mexico | `sun` (wikidata: Q642998 depicts Zia sun (Q47538508)) |
| `US-NV` | Nevada | `stars` (unreviewed: Commons category "Flags with stars, upper-left"); `plant` (unreviewed: Commons category "Plants on flags of the United States"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-NY` | New York | `sun` (unreviewed: Commons category "Flags with 1 sun"); `emblem` (wikidata: Q19016 depicts coat of arms of New York (Q84069440), a kind of coat of arms (Q14659)); `coat-of-arms` (wikidata: Q19016 depicts coat of arms of New York (Q84069440), a kind of coat of arms (Q14659)); `animal` (unreviewed: Commons category "Eagles on flags of the United States"); `weapon` (unreviewed: Commons category "Flags with swords"); `crown` (unreviewed: Commons category "Flags with 1 crown"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `US-OH` | Ohio | `stars` (unreviewed: Commons category "Flags with stars, left (chevron)"); `circle` (unreviewed: Commons category "Flags with red disks (tricolor)"); `triangle` (unreviewed: Commons category "Flags with stars, left (chevron)"); `text` (unreviewed: Commons category "Inscribed flags, O") |
| `US-OK` | Oklahoma | `cross` (wikidata: Q258262 depicts cross (Q40843)); `emblem` (wikidata: Q258262 depicts shield (Q131559)); `plant` (wikidata: Q258262 depicts olive branch (Q138550)); `text` (wikidata: Q258262 depicts letter (Q9788)) |
| `US-OR` | Oregon | `stars` (unreviewed: Commons category "Flags with thirty-three five-pointed stars"); `sun` (unreviewed: Commons category "Flags with 1 sun"); `emblem` (wikidata: Q19427 depicts Seal of Oregon (Q2164980)); `animal` (wikidata: Q19427 depicts beaver (Q47542), a kind of animal (Q729)); `plant` (unreviewed: Commons category "Trees on flags of the United States"); `text` (unreviewed: Commons category "Inscribed flags, English names") |
| `US-PA` | Pennsylvania | `emblem` (unreviewed: 13 colours, as a seal or a coat of arms has) |
| `US-RI` | Rhode Island | `stars` (wikidata: Q520966 depicts five-pointed star (Q379860)); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-SC` | South Carolina | `crescent` (unreviewed: Commons category "1 white crescent on flags of the United States"); `plant` (wikidata: Q19373 depicts Sabal palmetto (Q1088471), a kind of plant (Q756)) |
| `US-SD` | South Dakota | `stars` (unreviewed: Commons category "Flags with two blue five-pointed stars"); `circle` (unreviewed: Commons category "Flags with centered circles"); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-TN` | Tennessee | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom) |
| `US-TX` | Texas |  |
| `US-UT` | Utah | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (unreviewed: Commons category "One white five-pointed star on flags of the United States") |
| `US-VA` | Virginia | `emblem` (unreviewed: 21 colours, as a seal or a coat of arms has) |
| `US-VT` | Vermont | `emblem` (unreviewed: 18 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from the United States"); `animal` (unreviewed: Commons category "Animals on flags of the United States"); `plant` (unreviewed: Commons category "Branches on flags of the United States"); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-WA` | Washington | `text` (unreviewed: Commons category "Inscribed flags of the United States") |
| `US-WI` | Wisconsin | `emblem` (unreviewed: 10 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with arms"); `animal` (unreviewed: Commons category "Animals on flags of the United States"); `text` (unreviewed: Commons category "Inscribed flags, English names") |
| `US-WV` | West Virginia | `emblem` (unreviewed: 16 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from the United States"); `plant` (unreviewed: Commons category "Flowers on flags of the United States"); `weapon` (unreviewed: Commons category "Flags with axes"); `text` (unreviewed: Commons category "Flags with mottos") |
| `US-WY` | Wyoming | `stars` (unreviewed: Commons category "Flags with one blue five-pointed star"); `circle` (unreviewed: Commons category "Flags with circles"); `animal` (unreviewed: Commons category "Flags with centered animals"); `text` (unreviewed: Commons category "Flags with English inscriptions") |
| `ANHH` | Netherlands Antilles | `cross` (unreviewed: a band across and a band down, each the same at both edges) |
| `BOH` | Bohemia | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `BUMM` | Burma |  |
| `BYAA` | Byelorussian Soviet Socialist Republic |  |
| `CSXX` | Serbia and Montenegro | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `DDDE` | East Germany | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `plant` (unreviewed: Commons category "Flags with plants") |
| `GEHH` | Gilbert and Ellice Islands | `emblem` (unreviewed: 8 colours, as a seal or a coat of arms has) |
| `HVBF` | Upper Volta | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `PCHH` | Pacific Islands (Trust Territory) |  |
| `RHZW` | Rhodesia | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (unreviewed: 20 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from the British possessions"); `animal` (unreviewed: Commons category "Flags with birds") |
| `SUHH` | Soviet Union | `stars` (wikidata: Q165230 depicts red star (Q208578)) |
| `VDVN` | Democratic Republic of Vietnam |  |
| `WIF` | West Indies Federation | `stripes-horizontal` (unreviewed: the same nine bands at the hoist and at the fly); `circle` (unreviewed: Commons category "Flags with centered orange disks") |
| `XAH` | Austria-Hungary |  |
| `XCS` | Confederate States of America |  |
| `XGE` | German Empire | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `XIT` | Kingdom of Italy | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `cross` (unreviewed: Commons category "Flags with 1 white cross"); `emblem` (unreviewed: Commons category "Flags with centered coat of arms from Italy"); `coat-of-arms` (unreviewed: Commons category "Flags with centered coat of arms from Italy") |
| `XKR` | Korean Empire |  |
| `XMK` | Manchukuo |  |
| `XOT` | Ottoman Empire |  |
| `XPR` | Prussia | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `XPS` | Papal States | `plain` (computed: the whole flag is two bands down, with nothing on them); `stripes-vertical` (computed: the whole flag is two bands down) |
| `XQI` | Qing Empire | `emblem` (unreviewed: 11 colours, as a seal or a coat of arms has) |
| `XSD` | Kingdom of Sardinia |  |
| `XSM` | Siam |  |
| `XSV` | South Vietnam | `plain` (computed: the whole flag is seven bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is seven bands across) |
| `XTB` | Tibet (1912 to 1950) | `emblem` (unreviewed: 10 colours, as a seal or a coat of arms has) |
| `XUA` | United Arab Republic | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly) |
| `XZB` | Sultanate of Zanzibar |  |
| `YDYE` | South Yemen |  |
| `YUCS` | Yugoslavia | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (wikidata: Q381988 depicts red star (Q208578)) |
| `ZRCD` | Zaire | `circle` (unreviewed: Commons category "Flags with centered yellow disks"); `emblem` (unreviewed: Commons category "Flags with arms"); `coat-of-arms` (unreviewed: Commons category "Flags with arms") |
| `US--stars-45` | United States: The 45-star flag | `stripes-horizontal` (unreviewed: Commons category "Flags with thirteen horizontal stripes"); `canton` (unreviewed: Commons category "Flags with stars, canton"); `stars` (unreviewed: Commons category "Flags with stars, canton") |
| `US--stars-46` | United States: The 46-star flag | `stripes-horizontal` (unreviewed: Commons category "Flags with thirteen horizontal stripes"); `canton` (unreviewed: Commons category "Flags with stars, canton"); `stars` (unreviewed: Commons category "Flags with stars, canton") |
| `US--stars-48` | United States: The 48-star flag | `stripes-horizontal` (unreviewed: Commons category "Flags with thirteen horizontal stripes"); `canton` (unreviewed: Commons category "Flags with stars, canton"); `stars` (unreviewed: Commons category "Flags with stars, canton") |
| `US--stars-49` | United States: The 49-star flag | `stripes-horizontal` (unreviewed: Commons category "Flags with thirteen horizontal stripes"); `canton` (unreviewed: Commons category "Flags with stars, canton"); `stars` (unreviewed: Commons category "Flags with stars, canton") |
| `CA--red-ensign-1868` | Canada: The Red Ensign (provincial-arms shield, from 1871) | `cross` (unreviewed: Commons category "Flags with the cross of Saint George"); `saltire` (unreviewed: Commons category "Union Jack cantons"); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (unreviewed: 10 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with coats of arms from Canada"); `plant` (unreviewed: Commons category "Flags with maple branches") |
| `CA--red-ensign-1922` | Canada: The Red Ensign (1921 arms, green leaves) | `cross` (unreviewed: Commons category "Union Jack cantons"); `saltire` (unreviewed: Commons category "Union Jack cantons"); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (unreviewed: 9 colours, as a seal or a coat of arms has); `coat-of-arms` (unreviewed: Commons category "Flags with coats of arms from Canada"); `plant` (unreviewed: Commons category "Flags with maple branches") |
| `CA--red-ensign-1957` | Canada: The Red Ensign (1957 arms, red leaves) | `cross` (unreviewed: Commons category "Union Jack cantons"); `saltire` (unreviewed: Commons category "Union Jack cantons"); `canton` (unreviewed: Commons category "Union Jack cantons"); `emblem` (unreviewed: Commons category "Flags with coats of arms from Canada"); `coat-of-arms` (unreviewed: Commons category "Flags with coats of arms from Canada"); `plant` (unreviewed: Commons category "Flags with maple branches") |
| `AU--federation-1901` | Australia: Australian flag as flown 1901 (competition winner) | `cross` (unreviewed: Commons category "Union Jack cantons"); `saltire` (unreviewed: Commons category "Union Jack cantons"); `canton` (unreviewed: Commons category "Union Jack cantons") |
| `AU--commonwealth-1903` | Australia: Australian flag 1903 (King's approved design) | `cross` (unreviewed: Commons category "Union Jack cantons"); `saltire` (unreviewed: Commons category "Union Jack cantons"); `canton` (unreviewed: Commons category "Union Jack cantons") |
| `ZA--orange-white-blue` | South Africa: 'Orange, White and Blue' flag (Oranje-Blanje-Blou) | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly) |
| `JP--hinomaru-1870` | Japan: Hinomaru (1870 specification, 7:10) |  |
| `RU--rsfsr-april-1918` | Russia: RSFSR flag, April 1918 (full name inscription) | `text` (unreviewed: Commons category "Flags with white inscriptions") |
| `RU--rsfsr-1918` | Russia: RSFSR flag, July 1918 (gold letters РСФСР) | `canton` (unreviewed: Commons category "Yellow on flags with red fields (cantons)") |
| `RU--rsfsr-1937` | Russia: RSFSR flag, 1937 (letters РСФСР) | `text` (computed: the drawing has a text element) |
| `RU--rsfsr-1954` | Russia: RSFSR flag, 1954 (blue stripe, hammer and sickle) | `stripes-vertical` (unreviewed: the same two bands at the top and at the bottom); `stars` (unreviewed: Commons category "Flags with stars, upper-left") |
| `RU--tricolour-1991` | Russia: Tricolour of 1991-1993 (1:2, azure and scarlet) | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `UA--unr-blue-yellow` | Ukraine: Blue-yellow flag (Ukrainian People's Republic 1918) | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `UA--ussr-1919` | Ukraine: Ukrainian SSR flag, 1919 (У.С.С.Р.) | `canton` (unreviewed: Commons category "Yellow on flags with red fields (cantons)"); `text` (unreviewed: Commons category "Inscribed flags, acronyms") |
| `UA--ussr-1929` | Ukraine: Ukrainian SSR flag, 1929 (УСРР) | `text` (unreviewed: Commons category "Inscribed flags, Ukrainian names") |
| `UA--ursr-1937` | Ukraine: Ukrainian SSR flag, 1937 (hammer, sickle, УРСР) | `text` (unreviewed: Commons category "Inscribed flags, acronyms") |
| `UA--ursr-1949` | Ukraine: Ukrainian SSR flag, 1949 (blue stripe) | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly); `stars` (unreviewed: Commons category "Flags with one red five-pointed star") |
| `UA--blue-yellow-1991` | Ukraine: Blue-yellow flag, 1991-1992 (1:2) | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `KZ--kazssr-1953` | Kazakhstan: Kazakh SSR flag, 1953 (blue stripe) | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `stars` (unreviewed: Commons category "Flags with one red five-pointed star") |
| `EG--khedivate-red` | Egypt: Red flag with three crescents and stars (Khedivate, Sultanate) | `stars` (unreviewed: Commons category "Flags with star and crescent"); `crescent` (unreviewed: Commons category "Flags with 3 white crescents") |
| `EG--green-crescent` | Egypt: Green flag with crescent and three stars (Kingdom) | `stars` (unreviewed: Commons category "Flags with three white five-pointed stars and 1 white crescent"); `crescent` (unreviewed: Commons category "Flags with three white five-pointed stars and 1 white crescent") |
| `EG--hawk-of-quraish` | Egypt: Flag with the Hawk of Quraish (Federation of Arab Republics) | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `animal` (unreviewed: Commons category "Flags with the Hawk of Quraish") |
| `DE--weimar-bkrg` | Germany: Black-red-gold (Weimar Republic) | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `ES--second-republic` | Spain: Red-yellow-purple (Second Republic) | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `animal` (unreviewed: Commons category "Flags with lions facing left"); `plant` (unreviewed: Commons category "Flags with flowers"); `building` (unreviewed: Commons category "Flags with castles"); `text` (unreviewed: Commons category "Flags with mottos") |
| `IR--lion-sun-tricolour-1907` | Iran: Tricolour with lion and sun (1907 constitutional flag) | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `sun` (unreviewed: Commons category "Flags with lion and sun"); `animal` (unreviewed: Commons category "Flags with lion and sun") |
| `IR--lion-sun-1933` | Iran: Tricolour with lion and sun (1933 redrawing) | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly); `sun` (unreviewed: Commons category "Flags with lion and sun"); `animal` (unreviewed: Commons category "Flags with lion and sun") |
| `IR--pahlavi-1964` | Iran: Pahlavi tricolour with lion and sun (1964 form) | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly) |
| `KR--taegeukgi-1948` | South Korea: Taegeukgi of the First Republic (before the 1949 standard) |  |
| `VN--drv-1945` | Vietnam: Flag of the Democratic Republic of Vietnam (1945 star) | `stars` (unreviewed: Commons category "Flags with one yellow five-pointed star (centered)") |
| `BR--republic-21-stars` | Brazil: Republic flag, 21 stars |  |
| `BR--republic-22-stars` | Brazil: 22 stars (Guanabara) |  |
| `BR--republic-23-stars` | Brazil: 23 stars (Acre) |  |
| `MX--carranza-1916` | Mexico: Profile eagle (Carranza, 1916) | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (unreviewed: 14 colours, as a seal or a coat of arms has) |
| `MX--enciso-1934` | Mexico: 1934 eagle | `stripes-vertical` (unreviewed: the same three bands at the top and at the bottom); `emblem` (unreviewed: 14 colours, as a seal or a coat of arms has) |
| `XCS--stars-and-bars` | Confederate States of America: The first national flag ("Stars and Bars") |  |
| `XCS--blood-stained-banner` | Confederate States of America: The third national flag ("Blood-Stained Banner") |  |
| `BYAA--1937` | Byelorussian Soviet Socialist Republic: The flag of 1937 to 1951 |  |
| `BYAA--1927` | Byelorussian Soviet Socialist Republic: The flag of 1927 to 1937 |  |
| `BYAA--1919` | Byelorussian Soviet Socialist Republic: The flag of 1919 to 1927 |  |
| `VDVN--gold-star-1945` | Democratic Republic of Vietnam: The flag of 1945 to 1955 | `stars` (unreviewed: Commons category "Flags with one yellow five-pointed star (centered)") |
| `XHW--1816` | Kingdom of Hawaii: The flag of 1816 |  |
| `XQI--triangular-1862` | Qing Empire: The triangular Yellow Dragon Flag | `emblem` (unreviewed: 11 colours, as a seal or a coat of arms has) |
| `XTX--burnet` | Republic of Texas: The Burnet Flag |  |
| `AF--de-facto` | Afghanistan: The Taliban's flag | `text` (unreviewed: Commons category "Flags with shahada") |
| `SH--union-flag` | St. Helena: The Union Flag | `cross` (unreviewed: Commons category "Flags with crosses and saltires"); `saltire` (unreviewed: Commons category "Flags with crosses and saltires") |
| `DE-BY--stripes` | Bavaria: White and blue stripes | `plain` (computed: the whole flag is two bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is two bands across) |
| `GB-NIR--ulster-banner` | Northern Ireland: The Ulster Banner | `cross` (unreviewed: a band across and a band down, each the same at both edges); `emblem` (unreviewed: 8 colours, as a seal or a coat of arms has) |
| `SY--assad-era` | Syria: The red, white and black flag | `stripes-horizontal` (unreviewed: the same three bands at the hoist and at the fly) |
| `GP--local` | Guadeloupe: Guadeloupe's local flag | `stripes-horizontal` (unreviewed: the same two bands at the hoist and at the fly) |
| `GF--local` | French Guiana: French Guiana's local flag | `stripes-diagonal` (unreviewed: Commons category "Diagonal bicolor green and yellow flags"); `stars` (unreviewed: Commons category "Flags with one red five-pointed star (centered)") |
| `RE--local` | Réunion: The Lofo | `stripes-horizontal` (unreviewed: the same five bands at the hoist and at the fly); `sun` (unreviewed: Commons category "Flags with partially hidden sun"); `triangle` (unreviewed: Commons category "Flags with fields divided per chevron (bottom)") |
| `YT--local` | Mayotte: Mayotte's local flag |  |
| `BL--local` | St. Barthélemy: Saint-Barthélemy's local flag | `emblem` (unreviewed: 12 colours, as a seal or a coat of arms has); `animal` (unreviewed: Commons category "Flags with pelicans"); `crown` (unreviewed: Commons category "Flags with 1 crown") |
| `PM--local` | St. Pierre & Miquelon: The local flag of Saint-Pierre and Miquelon | `emblem` (unreviewed: 9 colours, as a seal or a coat of arms has); `animal` (unreviewed: Commons category "Flags with lions facing left") |
| `WF--local` | Wallis & Futuna: The local flag of Wallis and Futuna | `canton` (unreviewed: Commons category "Flags with the national flag of France in the canton") |
| `SUHH--1936` | Soviet Union: The flag of 1936 to 1955 | `stars` (unreviewed: Commons category "Flags with one red five-pointed star") |
| `YUCS--kingdom` | Yugoslavia: The flag of the Kingdom | `plain` (computed: the whole flag is three bands across, with nothing on them); `stripes-horizontal` (computed: the whole flag is three bands across) |
| `BUMM--union` | Burma: The flag of 1948 to 1974 |  |
