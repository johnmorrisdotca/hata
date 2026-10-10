# Sizes

Made by `pnpm data`; a test fails if this list and the data differ. Sizes are of the optimised SVG as shipped
(`dist/svg/<code>.svg`, and the string in `/flags/<code>`), and gzipped at level 9 as a server would send it.

| | Pictures | SVG | Gzipped |
| --- | --- | --- | --- |
| Every flag | 431 (465 codes; 34 share another's picture) | 8493.7 KB | 2977.2 KB |
| The same drawings as their sources have them | 431 | 14666.2 KB | |
| The median flag | | 756 B | |
| The countries alone | 233 | 2067.6 KB | 704.9 KB |
| Drawings made for a frame (flag-icons' 4:3 and square, `/flags/<code>.4x3`, `.1x1`) | 423 | 2827.1 KB | 948.7 KB |

## Over the budget

The budget is 40.0 KB a flag; a flag may not be larger than 400.0 KB, or the build stops.
The flags over the budget carry a detailed coat of arms or seal, drawn as it is in their source; they are shipped,
and listed here so a new one is noticed (the size test holds this list).

| Code | Place | SVG | Gzipped | As its source has it |
| --- | --- | --- | --- | --- |
| `US-VA` | Virginia | 372.3 KB | 148.0 KB | 386.7 KB |
| `US-NY` | New York | 356.1 KB | 99.3 KB | 588.1 KB |
| `US-PA` | Pennsylvania | 350.2 KB | 142.4 KB | 469.2 KB |
| `US-ID` | Idaho | 333.1 KB | 126.8 KB | 620.8 KB |
| `CA-PE` | Prince Edward Island | 239.6 KB | 81.8 KB | 465.5 KB |
| `US-LA` | Louisiana | 225.8 KB | 88.6 KB | 629.3 KB |
| `AF` | Afghanistan | 216.6 KB | 90.3 KB | 227.0 KB |
| `US-FL` | Florida | 215.4 KB | 90.7 KB | 210.7 KB |
| `US-VT` | Vermont | 202.3 KB | 76.1 KB | 357.6 KB |
| `US-WV` | West Virginia | 200.8 KB | 55.5 KB | 568.2 KB |
| `US-SD` | South Dakota | 199.5 KB | 76.1 KB | 205.8 KB |
| `US-MI` | Michigan | 186.7 KB | 73.5 KB | 243.8 KB |
| `US-ME` | Maine | 184.1 KB | 63.3 KB | 229.8 KB |
| `US-MO` | Missouri | 173.2 KB | 47.1 KB | 177.1 KB |
| `US-OR` | Oregon | 161.0 KB | 68.8 KB | 165.7 KB |
| `BR-AL` | Alagoas | 153.5 KB | 29.9 KB | 265.9 KB |
| `US-NE` | Nebraska | 147.1 KB | 54.0 KB | 329.5 KB |
| `SV` | El Salvador | 143.7 KB | 32.6 KB | 274.1 KB |
| `MP` | Northern Mariana Islands | 130.0 KB | 43.1 KB | 161.0 KB |
| `US-WI` | Wisconsin | 127.0 KB | 48.8 KB | 201.0 KB |
| `US-IA` | Iowa | 123.9 KB | 51.4 KB | 128.5 KB |
| `DE-SL` | Saarland | 114.7 KB | 38.9 KB | 187.3 KB |
| `ES` | Spain | 110.1 KB | 23.3 KB | 152.2 KB |
| `US-NJ` | New Jersey | 105.4 KB | 35.0 KB | 202.4 KB |
| `US-WY` | Wyoming | 105.2 KB | 42.7 KB | 182.9 KB |
| `EC` | Ecuador | 102.0 KB | 33.9 KB | 272.6 KB |
| `US-ND` | North Dakota | 101.8 KB | 37.1 KB | 221.6 KB |
| `US-KY` | Kentucky | 100.8 KB | 39.2 KB | 131.9 KB |
| `US-WA` | Washington | 93.6 KB | 34.8 KB | 259.1 KB |
| `VA` | Vatican City | 91.9 KB | 21.0 KB | 139.6 KB |
| `US-DE` | Delaware | 88.9 KB | 27.9 KB | 104.7 KB |
| `US-CA` | California | 86.8 KB | 31.3 KB | 161.8 KB |
| `US-NH` | New Hampshire | 85.4 KB | 24.7 KB | 103.0 KB |
| `MX` | Mexico | 83.2 KB | 30.1 KB | 114.4 KB |
| `US-CT` | Connecticut | 83.0 KB | 26.4 KB | 80.3 KB |
| `FK` | Falkland Islands | 81.4 KB | 19.4 KB | 125.3 KB |
| `US-MT` | Montana | 75.5 KB | 29.9 KB | 98.6 KB |
| `US-IL` | Illinois | 75.4 KB | 29.2 KB | 101.1 KB |
| `HT` | Haiti | 75.4 KB | 11.1 KB | 172.6 KB |
| `SM` | San Marino | 74.2 KB | 28.0 KB | 129.7 KB |
| `BR-RN` | Rio Grande do Norte | 72.4 KB | 12.2 KB | 109.7 KB |
| `BR-RS` | Rio Grande do Sul | 71.7 KB | 25.3 KB | 203.3 KB |
| `US-MA` | Massachusetts | 65.4 KB | 21.9 KB | 125.0 KB |
| `US-KS` | Kansas | 64.9 KB | 17.0 KB | 240.5 KB |
| `BR-PR` | Paraná | 62.1 KB | 21.9 KB | 177.1 KB |
| `CH-GE` | Geneva | 61.5 KB | 12.7 KB | 76.4 KB |
| `ME` | Montenegro | 56.8 KB | 22.2 KB | 120.9 KB |
| `BR-RJ` | Rio de Janeiro | 56.7 KB | 21.5 KB | 343.5 KB |
| `US-OK` | Oklahoma | 56.7 KB | 20.1 KB | 96.0 KB |
| `BR-SC` | Santa Catarina | 47.9 KB | 17.1 KB | 77.1 KB |
| `US-NV` | Nevada | 45.5 KB | 17.4 KB | 128.6 KB |
| `GS` | South Georgia & South Sandwich Islands | 41.4 KB | 15.4 KB | 51.7 KB |
| `BZ` | Belize | 40.8 KB | 14.8 KB | 70.2 KB |
| `DO` | Dominican Republic | 40.7 KB | 14.7 KB | 198.8 KB |

## Drawings made for a frame over the budget

They carry the same coats of arms as the flags, drawn again by flag-icons; a page loads one only when it asks for that frame.

| Module | Place | SVG | Gzipped | As flag-icons has it |
| --- | --- | --- | --- | --- |
| `rs.4x3` | Serbia | 175.3 KB | 48.5 KB | 177.4 KB |
| `rs.1x1` | Serbia | 174.9 KB | 48.2 KB | 177.2 KB |
| `bo.1x1` | Bolivia | 100.3 KB | 24.3 KB | 102.3 KB |
| `bo.4x3` | Bolivia | 98.5 KB | 24.0 KB | 100.5 KB |
| `mx.4x3` | Mexico | 81.6 KB | 28.7 KB | 82.8 KB |
| `es.1x1` | Spain | 78.6 KB | 15.0 KB | 80.2 KB |
| `es.4x3` | Spain | 77.5 KB | 14.3 KB | 79.1 KB |
| `mx.1x1` | Mexico | 77.2 KB | 26.9 KB | 78.3 KB |
| `sv.1x1` | El Salvador | 71.7 KB | 21.2 KB | 75.9 KB |
| `sv.4x3` | El Salvador | 71.3 KB | 20.9 KB | 75.5 KB |
| `me.1x1` | Montenegro | 55.3 KB | 21.0 KB | 55.6 KB |
| `me.4x3` | Montenegro | 54.7 KB | 20.7 KB | 55.1 KB |

## Worth knowing about some pictures

Nothing: no flag draws text with a font or embeds a raster picture.
