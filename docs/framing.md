# How a crop of each flag is chosen

Made by `pnpm data`; a test fails if this list and the data differ. Every flag is offered both whole
(`fit: "whole"`: all of the flag, with clear bands, on a neutral disc when round) and cropped (`fit: "crop"`), at 4:3,
square and round. `fit: "auto"`, the default, picks the crop where one shows the flag fairly, and the whole flag where not.

What the crop is, in the order `auto` tries:

1. **The flag is that shape already**: nothing to crop.
2. **`flag(code, { shape })`, not `frame()`: the drawing flag-icons made by hand for the shape**, where it keeps the flag's
   colours and flag-icons does not draw another design. A person drew it for the shape, so it is a good crop; `frame()` works
   on one SVG and cannot use it, so for `frame()` the rows below are what a crop is.
3. **A crop kept at the side a person chose** (the table below). A flag whose meaning is in a canton or at the hoist (the United
   States' stars and stripes, Uruguay's Sun of May, the Bahamas' triangle) is cropped there, so that the emblem and a slice of
   the body show; a flag whose meaning is at the fly (Rwanda's sun) is cropped there. The crop must keep every colour that covers
   5% of the flag at no less than half its share, unless the reason beside the flag says why a colour may shrink.
4. **A crop from the centre** where nobody chose a side and the crop keeps the colours: Japan's disc, a coat of arms, a tricolour.
5. **The whole flag** where no crop keeps it true.

A crop asked for by name (`fit: "crop"`) always crops, at the chosen side, and from the centre where there is none: it is
yours to ask for even where the default is the whole flag. The side of every flag is in `manifest(code).framings[shape].crop`.

Judged on 2026-10-09 by looking at every flag's whole picture beside its centre crop, and again at the chosen crop beside the whole flag.

## Flags with a side chosen by hand (120)

"Default" is what `frame()` does with `auto` at the square: the crop at the side, or the whole flag where the measure says the crop loses a colour
no reason excuses, or where a person judged that no crop shows the flag.

| Code | Place | Crop | Default of `frame()` at the square | Why |
| --- | --- | --- | --- | --- |
| `AE` | United Arab Emirates | kept at the hoist (left) | the crop | A bar or band at the hoist (a different colour or a pattern) is part of what makes the flag this one, and a crop from the left keeps it beside the main field; the centre crop drops it. |
| `AI` | Anguilla | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `AS` | American Samoa | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `AU` | Australia | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `AW` | Aruba | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `AX` | Åland Islands | kept at the hoist (left) | the crop | The cross is set towards the hoist, as on the other Nordic flags, so a crop from the centre puts it in the wrong place; a crop from the left keeps its shape and its place. |
| `BH` | Bahrain | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `BJ` | Benin | kept at the hoist (left) | the crop | A bar or band at the hoist (a different colour or a pattern) is part of what makes the flag this one, and a crop from the left keeps it beside the main field; the centre crop drops it. |
| `BM` | Bermuda | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `BS` | Bahamas | kept at the hoist (left) | the crop, a colour shrunk (see why) | The black triangle at the hoist is the Bahamas' flag at a glance, and a crop from the left keeps it with the three stripes it points into; the centre crop shows only the stripes. The gold band is shorter in the crop because the triangle takes most of its width, and it still reads as a band between two aqua ones. |
| `BY` | Belarus | kept at the hoist (left) | the crop | A bar or band at the hoist (a different colour or a pattern) is part of what makes the flag this one, and a crop from the left keeps it beside the main field; the centre crop drops it. |
| `CD` | Congo - Kinshasa | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `CF` | Central African Republic | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `CK` | Cook Islands | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `CL` | Chile | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `CN` | China | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `CU` | Cuba | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `CW` | Curaçao | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `CX` | Christmas Island | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `CZ` | Czechia | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `DJ` | Djibouti | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `DK` | Denmark | kept at the hoist (left) | the crop | The cross is set towards the hoist, as on the other Nordic flags, so a crop from the centre puts it in the wrong place; a crop from the left keeps its shape and its place. |
| `ER` | Eritrea | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. The green and blue fields are cut to the corners above and below the red triangle, and the triangle with its emblem is what makes the flag. |
| `FI` | Finland | kept at the hoist (left) | the crop | The cross is set towards the hoist, as on the other Nordic flags, so a crop from the centre puts it in the wrong place; a crop from the left keeps its shape and its place. |
| `FJ` | Fiji | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `FK` | Falkland Islands | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `FO` | Faroe Islands | kept at the hoist (left) | the crop | The cross is set towards the hoist, as on the other Nordic flags, so a crop from the centre puts it in the wrong place; a crop from the left keeps its shape and its place. |
| `GQ` | Equatorial Guinea | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `GR` | Greece | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `GS` | South Georgia & South Sandwich Islands | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `GW` | Guinea-Bissau | kept at the hoist (left) | the crop, a colour shrunk (see why) | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. The green band is half as long, and the red bar with its black star and the yellow and green bands are all there. |
| `IO` | British Indian Ocean Territory | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `IS` | Iceland | kept at the hoist (left) | the crop | The cross is set towards the hoist, as on the other Nordic flags, so a crop from the centre puts it in the wrong place; a crop from the left keeps its shape and its place. |
| `JO` | Jordan | kept at the hoist (left) | the crop, a colour shrunk (see why) | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. The white band is shorter because the red triangle takes most of the width, and the three bands and the triangle with its star are all there. |
| `KM` | Comoros | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `KP` | North Korea | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `KW` | Kuwait | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `KY` | Cayman Islands | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `LK` | Sri Lanka | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `LR` | Liberia | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `MG` | Madagascar | kept at the hoist (left) | the crop | A bar or band at the hoist (a different colour or a pattern) is part of what makes the flag this one, and a crop from the left keeps it beside the main field; the centre crop drops it. |
| `MH` | Marshall Islands | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `MN` | Mongolia | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `MS` | Montserrat | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `MT` | Malta | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. The red field is narrower in the crop, and the white field with the George Cross in its corner, which is what makes the flag, is whole. |
| `MY` | Malaysia | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `MZ` | Mozambique | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `NA` | Namibia | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. The green triangle is cut short, and the sun, the red diagonal and the blue field are all there. |
| `NO` | Norway | kept at the hoist (left) | the crop | The cross is set towards the hoist, as on the other Nordic flags, so a crop from the centre puts it in the wrong place; a crop from the left keeps its shape and its place. |
| `NR` | Nauru | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `NU` | Niue | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `NZ` | New Zealand | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `PH` | Philippines | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `PN` | Pitcairn Islands | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `PR` | Puerto Rico | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `PS` | Palestinian Territories | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `QA` | Qatar | centre, on request only | the whole flag | The serrated white band covers the hoist for more than a third of the flag, so a square at the hoist is white and a square from the centre is plain maroon; neither is the flag, which is both. |
| `RW` | Rwanda | kept at the fly (right) | the crop | The emblem sits in the fly, away from the pole, so a crop from the right keeps it with the stripes beside it. |
| `SB` | Solomon Islands | kept at the hoist (left) | the crop, a colour shrunk (see why) | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. The green triangle is cut short, and the stars on the blue field and the yellow diagonal are all there, large. |
| `SC` | Seychelles | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. The white and green rays are shorter, and the five rays fanning from the hoist, which is the flag, are all there. |
| `SD` | Sudan | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `SE` | Sweden | kept at the hoist (left) | the crop | The cross is set towards the hoist, as on the other Nordic flags, so a crop from the centre puts it in the wrong place; a crop from the left keeps its shape and its place. |
| `SG` | Singapore | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `SS` | South Sudan | kept at the hoist (left) | the crop, a colour shrunk (see why) | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. The red and green stripes are shorter because the triangle takes most of the width, and the black stripe, the triangle and its star are all there. |
| `ST` | São Tomé & Príncipe | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `SX` | Sint Maarten | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `TC` | Turks & Caicos Islands | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `TF` | French Southern Territories | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `TG` | Togo | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `TK` | Tokelau | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `TL` | Timor-Leste | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `TM` | Turkmenistan | kept at the hoist (left) | the crop | A bar or band at the hoist (a different colour or a pattern) is part of what makes the flag this one, and a crop from the left keeps it beside the main field; the centre crop drops it. |
| `TO` | Tonga | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `TR` | Türkiye | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `TV` | Tuvalu | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `TW` | Taiwan | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `UM` | U.S. Outlying Islands | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `US` | United States | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `UY` | Uruguay | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `UZ` | Uzbekistan | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `VG` | British Virgin Islands | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `VU` | Vanuatu | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `WS` | Samoa | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `ZA` | South Africa | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `ZM` | Zambia | kept at the fly (right) | the crop | The emblem sits in the fly, away from the pole, so a crop from the right keeps it with the stripes beside it. |
| `ZW` | Zimbabwe | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `AU-NSW` | New South Wales | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `AU-NT` | Northern Territory | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `AU-QLD` | Queensland | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `AU-SA` | South Australia | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `AU-TAS` | Tasmania | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `AU-VIC` | Victoria | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `AU-WA` | Western Australia | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `BR-AC` | Acre | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `BR-AM` | Amazonas | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `BR-BA` | Bahia | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `BR-GO` | Goiás | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `BR-MA` | Maranhão | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `BR-MS` | Mato Grosso do Sul | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `BR-PI` | Piauí | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `BR-SE` | Sergipe | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `BR-SP` | São Paulo | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `CA-NL` | Newfoundland and Labrador | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `CA-NU` | Nunavut | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `CA-ON` | Ontario | centre, on request only | the whole flag | A Blue or Red Ensign: the Union Flag in the canton and a badge or stars in the fly make the flag, and no square crop holds both, so a crop would show one half of it. |
| `CA-SK` | Saskatchewan | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `DE-HB` | Bremen | kept at the hoist (left) | the crop | A bar or band at the hoist (a different colour or a pattern) is part of what makes the flag this one, and a crop from the left keeps it beside the main field; the centre crop drops it. |
| `DE-RP` | Rhineland-Palatinate | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `FR-BRE` | Brittany | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `US-AK` | Alaska | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `US-CO` | Colorado | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `US-DC` | Washington DC | centre, on request only | the whole flag | The meaning is spread across the whole flag (two emblems, or a design that runs from one end to the other), so any square crop is a part of it that another flag could share. |
| `US-GA` | Georgia | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `US-HI` | Hawaii | kept at the hoist (left) | the crop | An emblem sits in a canton at the hoist and the flag's body runs on from it, so a crop from the left keeps the emblem and a slice of the body, as a hand-drawn square of the flag does; the centre crop shows only the body. |
| `US-MN` | Minnesota | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `US-NC` | North Carolina | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `US-NV` | Nevada | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `US-OH` | Ohio | kept at the hoist (left) | the crop | A triangle, chevron or wedge at the hoist holds the flag's emblem or its meaning, and a crop from the left keeps it with the stripes it points into; the centre crop shows the stripes and loses it. |
| `US-SC` | South Carolina | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |
| `US-TX` | Texas | kept at the hoist (left) | the crop | The flag's emblem sits nearer the hoist than the middle, so a crop from the left shows all of it where the centre crop cuts it. |

## Flags shown whole by default because a crop loses a colour (20)

Nobody chose a side for these, and the measure found that a centre crop drops a colour covering 5% of the flag.

| Code | Place | The centre crop at the square loses |
| --- | --- | --- |
| `AF` | Afghanistan | black 31% to 15% |
| `BI` | Burundi | green 36% to 15% |
| `CA` | Canada | red 65% to 29% |
| `GD` | Grenada | red 39% to 19% |
| `GU` | Guam | red 15% to 6% |
| `IE` | Ireland | green 34% to 12%, orange 34% to 11% |
| `JM` | Jamaica | black 32% to 9% |
| `MD` | Moldova | blue 34% to 12%, red 34% to 13% |
| `MX` | Mexico | green 34% to 16%, red 34% to 16% |
| `NF` | Norfolk Island | green 71% to 36% |
| `NG` | Nigeria | green 68% to 22% |
| `VC` | St. Vincent & Grenadines | blue 25% to 7% |
| `BR-SC` | Santa Catarina | white 12% to 5% |
| `CA-NB` | New Brunswick | blue 9% to 4% |
| `CA-NT` | Northwest Territories | blue 51% to 2% |
| `CA-YT` | Yukon | green 30% to 9%, blue 31% to 12% |
| `US-IA` | Iowa | red 27% to 10% |
| `US-MS` | Mississippi | red 41% to 3% |
| `US-WV` | West Virginia | blue 27% to 10% |
| `US-WY` | Wyoming | red 23% to 7% |
