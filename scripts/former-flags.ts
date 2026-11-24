// The former countries added in the board ticket MODULES-1808: every ISO 3166-3 code the package had not yet, and the larger states
// that no longer exist and never had one. Spread into HISTORICAL and VARIANTS in data-config.ts, as historic-flags.ts is.
//
// The codes. An ISO 3166-3 code is four letters (SUHH, DDDE ...) and is the place's own where there is one. A state with no ISO
// 3166-3 code (Austria-Hungary, the Ottoman Empire, Prussia ...) has a code that Hata gives it, three letters beginning with X: ISO 3166
// keeps the whole range XAA to XZZ for users to assign and never gives it to a country, so such a code can never be an official code
// of anything, now or later. They are Hata's own and are listed as such in docs/guides/places-with-more-than-one-flag.md.
//
// Every Commons file here is named by hand: none of these places has a Wikidata item in the snapshot (the package does not ask
// Wikidata for more), so `item` is null. The build checks each file's licence like any other and the build leaves out, with its
// reason, one whose licence is not public domain, CC0 or CC BY.
//
// Dates were read on 2026-11-24 from the pages named in `source`; `sourceKind` says what kind of page each is. `from` is the first day
// of the flag and `until` the first day of its successor, as precisely as a source gives it.
import type { HistoricalSpec, RoleSpec, VariantSet } from "./data-config.ts";

const BOTH: readonly RoleSpec[] = ["legal", "in-use"];

const FLAG_OF_THE_UNITED_STATES = "Flag of the United States.svg";
const FLAG_OF_FRANCE = "Flag of France.svg";

// A place whose flag is its governing country's, drawn once: the territory's own entry in the codes, with the dates it flew that flag.
const parentFlag = (parent: string, name: string, nameJa: string, from: string | null, until: string | null, why: string, source: string, sourceKind: "official" | "reference" | "encyclopedia"): VariantSet => ({
  disputed: false,
  default: "own",
  variants: [{ id: "own", name, nameJa, status: "official", roles: BOTH, from, until, why: `${why} It is ${parent}'s flag, drawn once for both codes.`, source, sourceKind, file: null }],
});

const FORMER_HISTORICAL: Readonly<Record<string, HistoricalSpec>> = {
  // ISO 3166-3
  AIDJ: {
    en: "French Territory of the Afars and the Issas",
    ja: "フランス領アファール・イッサ",
    item: null,
    from: "1967",
    until: "1977",
    aliases: ["AFI"],
    file: FLAG_OF_FRANCE,
    why: "The territory (French Somaliland until 1967-07-05, now Djibouti) was an overseas territory of France and flew the French tricolour, as every French territory's official flag is France's (docs/decisions.md). It had no flag of its own; the code's years are 1967 to 1977 (independence on 1977-06-27).",
  },
  BYAA: {
    en: "Byelorussian Soviet Socialist Republic",
    ja: "白ロシア・ソビエト社会主義共和国",
    item: null,
    from: "1919",
    until: "1991",
    aliases: [],
    file: "Flag of the Byelorussian Soviet Socialist Republic (1951–1991).svg",
    why: "The flag of 1951 to 1991 (red over light blue, with the hammer, sickle and star at the hoist, and a white ornament at the hoist edge), flown by the republic until 1991-09-19 and by a founding member of the United Nations. Its three earlier flags are variants with their dates. Belarus is `BY`.",
  },
  DYBJ: {
    en: "Dahomey",
    ja: "ダホメ",
    item: null,
    from: "1960",
    until: "1975",
    aliases: ["DY", "DHY"],
    file: "Flag of Benin.svg",
    why: "Dahomey (now Benin) flew from 1959-11-16 the green, yellow and red flag that Benin flies again since 1990-08-01, so `DYBJ` and `BJ` are one drawing. The state was independent from 1960-08-01 until it became the People's Republic of Benin on 1975-11-30, and the flag it then flew, a green field with a red star, was never adopted by law.",
  },
  FQHH: {
    en: "French Southern and Antarctic Territories",
    ja: "フランス領南方・南極地域",
    item: null,
    from: "1955",
    until: "1979",
    aliases: ["FQ"],
    file: FLAG_OF_FRANCE,
    why: "The territory (created 1955-08-06, `TF` since the code changed in 1979) flew the French tricolour; it had no flag of its own until 2007. Each French territory's official flag is France's (docs/decisions.md).",
  },
  GEHH: {
    en: "Gilbert and Ellice Islands",
    ja: "ギルバート・エリス諸島",
    item: null,
    from: "1916",
    until: "1979",
    aliases: ["GEL"],
    file: "Flag of the Gilbert and Ellice Islands (1937–1976).svg",
    why: "The British colony's Blue Ensign with the colony's badge (a frigate bird over the sun and the sea), the colony's flag from 1937 until it split in 1975 and 1976 into Tuvalu and the Gilbert Islands (Kiribati, independent in 1979). Commons' drawing is both the colony's and the Gilbert Islands' (1976 to 1979) ensign.",
  },
  HVBF: {
    en: "Upper Volta",
    ja: "オートボルタ",
    item: null,
    from: "1960",
    until: "1984",
    aliases: ["HV", "HVO"],
    file: "Flag of Upper Volta.svg",
    why: "The black, white and red horizontal tricolour of the Republic of Upper Volta, independent from 1960-08-05 until it became Burkina Faso on 1984-08-04.",
  },
  JTUM: {
    en: "Johnston Island",
    ja: "ジョンストン島",
    item: null,
    from: "1960",
    until: "1986",
    aliases: ["JT", "JTN"],
    file: FLAG_OF_THE_UNITED_STATES,
    why: "An atoll of the United States (now part of the United States Minor Outlying Islands, `UM`), flying the United States' flag; it had none of its own. Its years here begin with the 50-star flag (1960); the code's own are 1974 to 1986.",
  },
  MIUM: {
    en: "Midway Islands",
    ja: "ミッドウェー諸島",
    item: null,
    from: "1960",
    until: "1986",
    aliases: ["MI", "MID"],
    file: FLAG_OF_THE_UNITED_STATES,
    why: "An atoll of the United States (now part of the United States Minor Outlying Islands, `UM`), flying the United States' flag; it had none of its own. Its years here begin with the 50-star flag (1960); the code's own are 1974 to 1986.",
  },
  NQAQ: {
    en: "Dronning Maud Land",
    ja: "ドロンニング・モード・ランド",
    item: null,
    from: "1939",
    until: "1983",
    aliases: ["NQ", "ATN"],
    file: "Flag of Norway.svg",
    why: "The Antarctic sector Norway claimed on 1939-01-14 (a dependency since 1957), flying Norway's flag; it has none of its own. The code's years are 1974 to 1983.",
  },
  PCHH: {
    en: "Pacific Islands (Trust Territory)",
    ja: "太平洋諸島信託統治領",
    item: null,
    from: "1947",
    until: "1986",
    aliases: ["PC", "PCI"],
    file: "Flag of the Trust Territory of the Pacific Islands.svg",
    why: "The United Nations trust territory under United States administration (from 1947 until 1986): a light blue field with a ring of six white stars, one for each district. It is a public-domain drawing under CC0.",
  },
  PUUM: {
    en: "United States Miscellaneous Pacific Islands",
    ja: "アメリカ領太平洋諸島（その他）",
    item: null,
    from: "1960",
    until: "1986",
    aliases: ["PU", "PUS"],
    file: FLAG_OF_THE_UNITED_STATES,
    why: "The small islands of the United States in the Pacific that the ISO list gave one code (now part of the United States Minor Outlying Islands, `UM`), flying the United States' flag; they had none of their own. Its years here begin with the 50-star flag (1960); the code's own are 1974 to 1986.",
  },
  PZPA: {
    en: "Panama Canal Zone",
    ja: "パナマ運河地帯",
    item: null,
    from: "1903",
    until: "1979",
    aliases: ["PZ", "PCZ"],
    file: FLAG_OF_THE_UNITED_STATES,
    why: "The strip of the United States around the canal (1903-11-18 to 1979-10-01) flew the United States' flag. The Governor of the Panama Canal had a flag of his own, the zone's seal on blue (1915), which is the Governor's and not the territory's, so it is not shipped.",
  },
  VDVN: {
    en: "Democratic Republic of Vietnam",
    ja: "ベトナム民主共和国",
    item: null,
    from: "1945",
    until: "1976",
    aliases: ["VD", "VDR"],
    file: "Flag of North Vietnam (1955–1976).svg",
    why: "North Vietnam's flag from 1955-11-30 (a gold star on red, the star smaller and its points straighter than before); the flag of 1945 to 1955 is a variant. Vietnam is `VN`, with the same two drawings.",
  },
  WKUM: {
    en: "Wake Island",
    ja: "ウェーク島",
    item: null,
    from: "1960",
    until: "1986",
    aliases: ["WK", "WAK"],
    file: FLAG_OF_THE_UNITED_STATES,
    why: "An atoll of the United States (now part of the United States Minor Outlying Islands, `UM`), flying the United States' flag; it had none of its own. Its years here begin with the 50-star flag (1960); the code's own are 1974 to 1986.",
  },
  YDYE: {
    en: "South Yemen",
    ja: "南イエメン",
    item: null,
    from: "1967",
    until: "1990",
    aliases: ["YD", "YMD"],
    file: "Flag of South Yemen.svg",
    why: "The flag of the People's Republic of Southern Yemen and the People's Democratic Republic of Yemen: red, white and black bands with a light blue triangle at the hoist holding a red star, flown from 1967-11-30 until the union with North Yemen on 1990-05-22.",
  },
  // States with no ISO 3166-3 code, under Hata's own codes (X, then two letters)
  XAH: {
    en: "Austria-Hungary",
    ja: "オーストリア＝ハンガリー",
    item: null,
    from: "1867",
    until: "1918",
    aliases: [],
    file: "Ensign of Austro-Hungarian civil fleet (1869-1918).svg",
    why: "Austria-Hungary had no single national flag: the compromise of 1867 left each half its own symbols, and only the coat of arms was common. The flag the Dual Monarchy flew in common, at sea and from its consulates, is the civil ensign decreed on 1869-02-18 with the arms of Austria and of Hungary side by side, shipped here and often shown as the empire's flag.",
  },
  XOT: {
    en: "Ottoman Empire",
    ja: "オスマン帝国",
    item: null,
    from: "1299",
    until: "1922",
    aliases: [],
    file: "Flag of the Ottoman Empire (1844–1922).svg",
    why: "The red flag with a white crescent and a five-pointed star, the Empire's national flag from 1844 until the sultanate was abolished in 1922. The flag with an eight-pointed star of 1793 to 1844 has no free drawing on Commons.",
  },
  XPR: {
    en: "Prussia",
    ja: "プロイセン",
    item: null,
    from: "1701",
    until: "1947",
    aliases: [],
    file: "Civil flag of Prussia 1701-1935.svg",
    why: "Prussia's black over white, the colours of the kingdom and then of the Free State (1918 to 1947), the Prussian flag from 1823 until the Reich's flag law of 1935. The kingdom's state flag with the arms (1892 to 1918) is drawn on Commons at changed proportions or under a licence that does not ship, so it is left out.",
  },
  XHW: {
    en: "Kingdom of Hawaii",
    ja: "ハワイ王国",
    item: null,
    from: "1795",
    until: "1893",
    aliases: [],
    file: "Flag of Hawaii.svg",
    why: "The flag of eight stripes and the Union Jack in the canton, flown by the Kingdom from 1845-05-25 until the monarchy was overthrown on 1893-01-17 and kept, unchanged, by the Republic, the Territory and the State, so it is the same drawing as Hawaii's (`US-HI`). The flag of 1816 to 1845 is a variant.",
  },
  XGE: {
    en: "German Empire",
    ja: "ドイツ帝国",
    item: null,
    from: "1871",
    until: "1918",
    aliases: [],
    file: "Flag of Germany (1867–1918).svg",
    why: "The black, white and red horizontal tricolour of the North German Confederation and the German Empire, the Reich's flag from 1871 until the republic. It is the same drawing as the `imperial-bwr` flag of Germany (`DE`).",
  },
  XSV: {
    en: "South Vietnam",
    ja: "ベトナム共和国（南ベトナム）",
    item: null,
    from: "1955",
    until: "1975",
    aliases: [],
    file: "Flag of South Vietnam.svg",
    why: "The Republic of Vietnam's yellow flag with three red stripes, flown from the republic's proclamation on 1955-10-26 until 1975-04-30. The State of Vietnam flew it from 1949.",
  },
  XKR: {
    en: "Korean Empire",
    ja: "大韓帝国",
    item: null,
    from: "1897",
    until: "1910",
    aliases: [],
    file: "Flag of Korea (1882–1910).svg",
    why: "The Taegukgi as drawn in the earliest surviving depiction (1882), with the trigrams in a different arrangement from South Korea's flag today, flown by Joseon and by the Korean Empire (1897-10-12 to 1910-08-29).",
  },
  XQI: {
    en: "Qing Empire",
    ja: "清",
    item: null,
    from: "1644",
    until: "1912",
    aliases: [],
    file: "Flag of China (1889–1912).svg",
    why: "The Yellow Dragon Flag in its rectangular form of 1889, which came into use as China's national flag in the late 1880s without a law that made it one. The triangular flag of 1862 to 1889 is a variant.",
  },
  XUA: {
    en: "United Arab Republic",
    ja: "アラブ連合共和国",
    item: null,
    from: "1958",
    until: "1971",
    aliases: [],
    file: "Flag of the United Arab Republic (1958–1971), Flag of Syria (1980–2024).svg",
    why: "The red, white and black flag with two green stars of the union of Egypt and Syria (1958; Syria left in 1961, and Egypt kept the name until 1971-09-02). The same drawing is the `uar` flag of Egypt and was Syria's flag from 1980 to 2024.",
  },
  XTX: {
    en: "Republic of Texas",
    ja: "テキサス共和国",
    item: null,
    from: "1836",
    until: "1846",
    aliases: [],
    file: "Flag of Texas.svg",
    why: "The Lone Star Flag, the Republic's national flag from 1839-01-25 until annexation (1845-12-29, the republic's government ended in 1846), the flag Texas still flies, so it is the same drawing as `US-TX`. The Burnet Flag of 1836 to 1839 is a variant.",
  },
  XIT: {
    en: "Kingdom of Italy",
    ja: "イタリア王国",
    item: null,
    from: "1861",
    until: "1946",
    aliases: [],
    file: "Flag of Italy (1861–1946).svg",
    why: "The tricolour with the Savoy arms on the white band (crowned on the state and war flags, uncrowned on the civil flag, which is the drawing shipped), the flag of the Kingdom from 1861-03-17 until the republic of 1946-06-19. It is the same drawing as the `savoy-arms-1861` flag of Italy (`IT`).",
  },
  XZB: {
    en: "Sultanate of Zanzibar",
    ja: "ザンジバル・スルタン国",
    item: null,
    from: "1963",
    until: "1964",
    aliases: [],
    file: "Flag of Zanzibar (December 1963-January 1964).svg",
    why: "The red flag of the independent Sultanate, from independence on 1963-12-10 until the revolution of 1964-01-12; Zanzibar then joined Tanganyika to make Tanzania (`TZ`).",
  },

  XCS: {
    en: "Confederate States of America",
    ja: "アメリカ連合国",
    item: null,
    from: "1861",
    until: "1865",
    aliases: [],
    file: "Flag of the Confederate States (1863–1865).svg",
    why: "The second national flag of the Confederate States, the \"Stainless Banner\" (a white field with the battle flag in the canton), the flag of the longest part of the state's life, from 1863-05-01 to 1865-03-04; the first and the third national flags are variants with their dates. The Confederate battle flag (the \"Southern Cross\") was never a national flag and is not shipped as one.",
  },
  XPS: {
    en: "Papal States",
    ja: "教皇領",
    item: null,
    from: "754",
    until: "1870",
    aliases: [],
    file: "Flag of the Papal States (1808-1870).svg",
    why: "The yellow and white flag of the Papal States, the state's flag from 1808 until Rome was taken on 1870-09-20, as the Commons drawing's title gives the years. Square, as drawn.",
  },
  XSD: {
    en: "Kingdom of Sardinia",
    ja: "サルデーニャ王国",
    item: null,
    from: "1720",
    until: "1861",
    aliases: [],
    file: "State Flag and War Ensign of the Savoyard States (1816-1848).svg",
    why: "The state flag and war ensign of the Savoyard states from 1816 to 1848, with the cross of Savoy and the blue border; from 1851 the Kingdom flew the tricolour with the Savoy arms, the same drawing as the Kingdom of Italy's, which is the `tricolour` variant.",
  },
  XSM: {
    en: "Siam",
    ja: "シャム",
    item: null,
    from: "1782",
    until: "1939",
    aliases: [],
    file: "Flag of Siam (1855).svg",
    why: "The white elephant on red, Siam's national flag from 1855 until the tricolour replaced it (the file's description says 1916, and other sources date the tricolour to 1917-09-28). The country was named Thailand from 1939.",
  },
  XTB: {
    en: "Tibet (1912 to 1950)",
    ja: "チベット（1912年から1950年）",
    item: null,
    from: "1912",
    until: "1950",
    aliases: [],
    file: "Flag of Tibet.svg",
    why: "The snow lion flag that Tibet flew in the years of its de facto independence, from 1913 until the People's Liberation Army entered Tibet in 1950, and that the Tibetan government in exile flies today. The Commons drawing is titled 1914 to 1951; the flag is dated here by the years of those events. This package takes no side on Tibet's status today.",
  },
  XMK: {
    en: "Manchukuo",
    ja: "満洲国",
    item: null,
    from: "1932",
    until: "1945",
    aliases: [],
    file: "Flag of Manchukuo.svg",
    why: "The flag of Manchukuo, a state set up by Japan in 1932 in Manchuria and recognised by few countries, which ended in 1945: a yellow field with red, blue, white and black bands in the upper left. This package takes no side on its status.",
  },
  // Left out, each with its reason (docs/left-out.md): file null
  BQAQ: {
    en: "British Antarctic Territory",
    ja: "英領南極地域",
    item: null,
    from: "1962",
    until: "1979",
    aliases: [],
    file: null,
    why: "The territory (created 1962, code BQ until 1979, and still a territory) used the Falkland Islands' flag until a Blue Ensign with its coat of arms was introduced on 1969-05-30 as a government ensign. The only drawing on Commons is the flag granted on 1998-04-21, and no source read says the ensign of 1969 is the same drawing, so none is shipped.",
  },
  CTKI: {
    en: "Canton and Enderbury Islands",
    ja: "カントン・エンダーベリー諸島",
    item: null,
    from: "1939",
    until: "1979",
    aliases: ["CT", "CTE"],
    file: null,
    why: "The islands were run jointly by the United Kingdom and the United States (1939 to 1979, when they joined Kiribati) and had no flag of their own: each power flew its own, so there is no one flag to ship.",
  },
  NHVU: {
    en: "New Hebrides",
    ja: "ニューヘブリディーズ諸島",
    item: null,
    from: "1906",
    until: "1980",
    aliases: ["NH", "NHB"],
    file: null,
    why: "The Anglo-French condominium (1906 to 1980, now Vanuatu, `VU`) had no flag of its own: Britain and France each flew theirs. Commons' drawing is the British administration's Blue Ensign alone, which would show one of the two powers as the territory's flag, so it is not shipped.",
  },
  NTHH: {
    en: "Neutral Zone",
    ja: "中立地帯",
    item: null,
    from: "1974",
    until: "1993",
    aliases: ["NT", "NTZ"],
    file: null,
    why: "The neutral zones of Saudi Arabia with Iraq and with Kuwait were land that no state governed as its own, and had no flag. The years are those of the code, 1974 to 1993.",
  },
  SKIN: {
    en: "Sikkim",
    ja: "シッキム",
    item: null,
    from: "1642",
    until: "1975",
    aliases: [],
    file: null,
    why: "The Kingdom's flags on Commons are reconstructions drawn by a contributor, and the last of them (1967 to 1975, the flag at the end of the Kingdom) is under CC BY-SA 2.5, which this package does not ship; the two earlier ones are public domain, but a Kingdom shown with the flag it had a decade before its end would misrepresent it, and no source for the dates of each was found.",
  },
  TPTL: {
    en: "East Timor",
    ja: "東ティモール",
    item: null,
    from: "1974",
    until: "1993",
    aliases: ["TP", "TMP"],
    file: null,
    why: "In the years of the code (1974 to 1993) East Timor was Portuguese Timor, then from 1976 a province of Indonesia: it flew Portugal's flag and then Indonesia's, and had none of its own that was in lasting use. Timor-Leste (`TL`) has its flag since independence.",
  },
  XGC: {
    en: "Gran Colombia",
    ja: "大コロンビア",
    item: null,
    from: "1819",
    until: "1831",
    aliases: [],
    file: null,
    why: "Every drawing of its flags on Commons is under CC BY-SA 3.0 or 4.0, which this package does not ship (docs/decisions.md).",
  },
  XTA: {
    en: "Tanganyika",
    ja: "タンガニーカ",
    item: null,
    from: "1961",
    until: "1964",
    aliases: [],
    file: null,
    why: "The flag of independent Tanganyika (1961 to 1964, green, black and gold) is on Commons under CC BY-SA 3.0, which this package does not ship (docs/decisions.md).",
  },
};

const FORMER_VARIANTS: Readonly<Record<string, VariantSet>> = {
  XCS: {
    disputed: false,
    default: "stainless-banner",
    variants: [
      { id: "stars-and-bars", name: "The first national flag (\"Stars and Bars\")", nameJa: "第1国旗（「スターズ・アンド・バーズ」）", status: "historical", roles: BOTH, from: "1861-03-04", until: "1863-05-01", why: "Three horizontal bars of red, white and red, with a blue canton holding a ring of white stars (seven at first, thirteen by 1862), adopted by the Confederate Congress on 1861-03-04 and replaced on 1863-05-01.", source: "https://en.wikipedia.org/wiki/Flags_of_the_Confederate_States_of_America", sourceKind: "encyclopedia", file: "Flag of the Confederate States (1861–1863).svg" },
      { id: "stainless-banner", name: "The second national flag (\"Stainless Banner\")", nameJa: "第2国旗（「ステンレス・バナー」）", status: "historical", roles: BOTH, from: "1863-05-01", until: "1865-03-04", why: "A white field with the battle flag in the canton, adopted by the Confederate Congress and in use from 1863-05-01 until 1865-03-04.", source: "https://en.wikipedia.org/wiki/Flags_of_the_Confederate_States_of_America", sourceKind: "encyclopedia", file: null },
      { id: "blood-stained-banner", name: "The third national flag (\"Blood-Stained Banner\")", nameJa: "第3国旗（「ブラッド・ステインド・バナー」）", status: "historical", roles: BOTH, from: "1865-03-04", until: "1865", why: "The second national flag with a red vertical bar at the fly, adopted on 1865-03-04 and in use until the Confederacy was disbanded in 1865.", source: "https://en.wikipedia.org/wiki/Flags_of_the_Confederate_States_of_America", sourceKind: "encyclopedia", file: "Flag of the Confederate States (1865).svg" },
    ],
  },
  XPS: {
    disputed: false,
    default: "yellow-white",
    variants: [
      { id: "yellow-white", name: "The yellow and white flag", nameJa: "黄色と白の旗", status: "official", roles: BOTH, from: "1808", until: "1870-09-20", why: "Yellow and white, the Papal States' flag from 1808 until Rome was taken by the Kingdom of Italy on 1870-09-20.", source: "https://en.wikipedia.org/wiki/Papal_States", sourceKind: "encyclopedia", file: null },
    ],
  },
  XSD: {
    disputed: false,
    default: "savoy-1816",
    variants: [
      { id: "savoy-1816", name: "The state flag and war ensign of 1816 to 1848", nameJa: "1816年から1848年の国旗・軍艦旗", status: "official", roles: BOTH, from: "1816", until: "1848", why: "The state flag and war ensign of the Savoyard states, with the cross of Savoy, from 1816 to 1848.", source: "https://en.wikipedia.org/wiki/Kingdom_of_Sardinia", sourceKind: "encyclopedia", file: null },
      { id: "tricolour", name: "The tricolour with the Savoy arms", nameJa: "サヴォイア家の紋章入りの三色旗", status: "official", roles: BOTH, from: "1851", until: "1861-03-17", why: "The green, white and red tricolour with the Savoy arms on the white band, the Kingdom of Sardinia's flag from 1851 until the Kingdom of Italy was proclaimed on 1861-03-17; the same drawing as `XIT`'s.", source: "https://en.wikipedia.org/wiki/Flag_of_Italy", sourceKind: "encyclopedia", file: "Flag of Italy (1861–1946).svg" },
    ],
  },
  XSM: {
    disputed: false,
    default: "white-elephant",
    variants: [
      { id: "white-elephant", name: "The white elephant flag", nameJa: "白象旗", status: "official", roles: BOTH, from: "1855", until: "1917", why: "A white elephant on a red field, Siam's national flag from 1855 until the red, white and blue tricolour replaced it (the file's description says 1916, other sources 1917-09-28).", source: "https://en.wikipedia.org/wiki/Flag_of_Thailand", sourceKind: "encyclopedia", file: null },
    ],
  },
  XTB: {
    disputed: false,
    default: "snow-lion",
    variants: [
      { id: "snow-lion", name: "The snow lion flag", nameJa: "雪獅子旗", status: "official", roles: [{ role: "in-use" }], from: "1916", until: "1950", roleNote: { why: "Tibet's government flew the flag in the years of its de facto independence; its status in international law in those years and today is disputed, and no law of a recognised state made it a national flag.", source: "https://en.wikipedia.org/wiki/Flag_of_Tibet", sourceKind: "encyclopedia" }, why: "The snow lion flag, introduced by the 13th Dalai Lama in 1916 and flown by Tibet's government until 1950.", source: "https://en.wikipedia.org/wiki/Flag_of_Tibet", sourceKind: "encyclopedia", file: null },
    ],
  },
  XMK: {
    disputed: false,
    default: "five-colours",
    variants: [
      { id: "five-colours", name: "The Manchukuo flag", nameJa: "満洲国旗", status: "official", roles: BOTH, from: "1932", until: "1945", why: "A yellow field with a canton of red, blue, white and black bands, flown by Manchukuo, a state set up by Japan in 1932 and recognised by few countries, until it ended in 1945.", source: "https://en.wikipedia.org/wiki/Manchukuo", sourceKind: "encyclopedia", file: null },
    ],
  },
  AIDJ: parentFlag("France", "France's flag", "フランスの国旗", "1967-07-05", "1977-06-27", "The French tricolour flew over the territory from the day it was renamed French Territory of the Afars and the Issas until independence.", "https://en.wikipedia.org/wiki/French_Somaliland", "encyclopedia"),
  BYAA: {
    disputed: false,
    default: "1951",
    variants: [
      { id: "1951", name: "The flag of 1951 to 1991", nameJa: "1951年から1991年の国旗", status: "official", roles: BOTH, from: "1951-12-25", until: "1991-09-19", why: "Red over light blue with the hammer and sickle and the star at the hoist, and the white national ornament at the hoist edge; replaced on 1991-09-19 by the white, red and white flag.", source: "https://en.wikipedia.org/wiki/Flag_of_the_Byelorussian_Soviet_Socialist_Republic", sourceKind: "encyclopedia", file: null },
      { id: "1937", name: "The flag of 1937 to 1951", nameJa: "1937年から1951年の国旗", status: "historical", roles: BOTH, from: "1937-02-19", until: "1951-12-25", why: "Red with the hammer and sickle in the canton and the Cyrillic initials of the republic above it.", source: "https://en.wikipedia.org/wiki/Flag_of_the_Byelorussian_Soviet_Socialist_Republic", sourceKind: "encyclopedia", file: "Flag of the Byelorussian Soviet Socialist Republic (1937–1951).svg" },
      { id: "1927", name: "The flag of 1927 to 1937", nameJa: "1927年から1937年の国旗", status: "historical", roles: BOTH, from: "1927-04-11", until: "1937-02-19", why: "Red with the republic's initials in four languages in the canton.", source: "https://en.wikipedia.org/wiki/Flag_of_the_Byelorussian_Soviet_Socialist_Republic", sourceKind: "encyclopedia", file: "Flag of the Byelorussian Soviet Socialist Republic (1927–1937).svg" },
      { id: "1919", name: "The flag of 1919 to 1927", nameJa: "1919年から1927年の国旗", status: "historical", roles: BOTH, from: "1919-02-03", until: "1927-04-11", why: "Red with the Cyrillic initials of the republic in gold in the upper left.", source: "https://en.wikipedia.org/wiki/Flag_of_the_Byelorussian_Soviet_Socialist_Republic", sourceKind: "encyclopedia", file: "Flag of the Byelorussian Soviet Socialist Republic (1919–1927).svg" },
    ],
  },
  DYBJ: {
    disputed: false,
    default: "dahomey",
    variants: [
      { id: "dahomey", name: "Dahomey's flag", nameJa: "ダホメの国旗", status: "official", roles: BOTH, from: "1959-11-16", until: "1975-11-30", why: "Green at the hoist, yellow over red in the fly, chosen on 1959-11-16 while Dahomey was still autonomous and kept at independence on 1960-08-01. The same drawing is the flag of Benin (`BJ`), which took it back on 1990-08-01.", source: "https://en.wikipedia.org/wiki/Flag_of_Benin", sourceKind: "encyclopedia", file: null },
    ],
  },
  FQHH: parentFlag("France", "France's flag", "フランスの国旗", "1955-08-06", null, "The French tricolour has flown over the territory since it was created, and still does.", "https://en.wikipedia.org/wiki/French_Southern_and_Antarctic_Lands", "encyclopedia"),
  GEHH: {
    disputed: false,
    default: "colony",
    variants: [
      { id: "colony", name: "The colony's Blue Ensign", nameJa: "植民地の青色船舶旗", status: "official", roles: BOTH, from: "1937", until: "1976", why: "The British Blue Ensign with the colony's badge in the fly, the colony's state ensign from the grant of its arms in 1937 until the colony was divided in 1975 and 1976.", source: "https://en.wikipedia.org/wiki/Flag_of_Kiribati", sourceKind: "encyclopedia", file: null },
    ],
  },
  HVBF: {
    disputed: false,
    default: "tricolour",
    variants: [
      { id: "tricolour", name: "The tricolour", nameJa: "三色旗", status: "official", roles: BOTH, from: "1960-08-05", until: "1984-08-04", why: "Black, white and red horizontal bands, adopted when the country became independent and replaced on 1984-08-04 by Burkina Faso's flag.", source: "https://en.wikipedia.org/wiki/Flag_of_Burkina_Faso", sourceKind: "encyclopedia", file: null },
    ],
  },
  JTUM: parentFlag("the United States", "The United States' flag", "アメリカ合衆国の国旗", "1960-07-04", null, "The 50-star flag has flown over the atoll since 1960-07-04.", "https://www.law.cornell.edu/uscode/text/4/1", "official"),
  MIUM: parentFlag("the United States", "The United States' flag", "アメリカ合衆国の国旗", "1960-07-04", null, "The 50-star flag has flown over the atoll since 1960-07-04.", "https://www.law.cornell.edu/uscode/text/4/1", "official"),
  NQAQ: parentFlag("Norway", "Norway's flag", "ノルウェーの国旗", "1939-01-14", null, "Norway's flag has flown over the sector since Norway claimed it.", "https://en.wikipedia.org/wiki/Queen_Maud_Land", "encyclopedia"),
  PCHH: {
    disputed: false,
    default: "six-stars",
    variants: [
      { id: "six-stars", name: "The flag of the six districts", nameJa: "六つの地区の旗", status: "official", roles: BOTH, from: "1965-08-19", until: "1986-11-03", why: "Light blue with six white stars in a ring, one for each district. A contest in the Yap district chose it, the Council of Micronesia approved it in 1962 and the High Commissioner and the Congress of Micronesia made it official on 1965-08-19. The trust ended on 1986-11-03; each district had its own flag by the early 1980s, so its use faded earlier.", source: "https://en.wikipedia.org/wiki/Flag_of_the_Trust_Territory_of_the_Pacific_Islands", sourceKind: "encyclopedia", file: null },
    ],
  },
  PUUM: parentFlag("the United States", "The United States' flag", "アメリカ合衆国の国旗", "1960-07-04", null, "The 50-star flag has flown over the islands since 1960-07-04.", "https://www.law.cornell.edu/uscode/text/4/1", "official"),
  PZPA: parentFlag("the United States", "The United States' flag", "アメリカ合衆国の国旗", "1960-07-04", "1979-10-01", "The 50-star flag flew over the zone from 1960-07-04 until the zone was abolished on 1979-10-01.", "https://www.law.cornell.edu/uscode/text/4/1", "official"),
  VDVN: {
    disputed: false,
    default: "gold-star-1955",
    variants: [
      { id: "gold-star-1955", name: "The flag of 1955 to 1976", nameJa: "1955年から1976年の国旗", status: "official", roles: BOTH, from: "1955-11-30", until: "1976-07-02", why: "A gold star on red, the star smaller and its points straighter than before; Vietnam kept it for the reunited country on 1976-07-02.", source: "https://web.archive.org/web/2013/http://vbqppl.moj.gov.vn/vbpq/Lists/Vn%20bn%20php%20lut/View_Detail.aspx?ItemID=1080", sourceKind: "official", file: null },
      { id: "gold-star-1945", name: "The flag of 1945 to 1955", nameJa: "1945年から1955年の国旗", status: "historical", roles: BOTH, from: "1945-09-05", until: "1955-11-30", why: "The first flag of the republic, a gold star on red with wider, more obtuse points.", source: "https://web.archive.org/web/2013/http://vbqppl.moj.gov.vn/vbpq/Lists/Vn%20bn%20php%20lut/View_Detail.aspx?ItemID=820", sourceKind: "official", file: "Flag of North Vietnam (1945–1955).svg" },
    ],
  },
  WKUM: parentFlag("the United States", "The United States' flag", "アメリカ合衆国の国旗", "1960-07-04", null, "The 50-star flag has flown over the atoll since 1960-07-04.", "https://www.law.cornell.edu/uscode/text/4/1", "official"),
  YDYE: {
    disputed: false,
    default: "pdry",
    variants: [
      { id: "pdry", name: "The flag of the republic", nameJa: "共和国の国旗", status: "official", roles: BOTH, from: "1967-11-30", until: "1990-05-22", why: "Red, white and black bands with a light blue triangle at the hoist and a red star in it, adopted at independence on 1967-11-30 and replaced by Yemen's flag on 1990-05-22.", source: "https://en.wikipedia.org/wiki/Flag_of_South_Yemen", sourceKind: "encyclopedia", file: null },
    ],
  },
  XAH: {
    disputed: false,
    default: "civil-ensign",
    variants: [
      {
        id: "civil-ensign", name: "The civil ensign with both coats of arms", nameJa: "二つの紋章の入った商船旗", status: "official", roles: [{ role: "in-use" }], from: "1869-08-01", until: "1918-11",
        roleNote: { why: "The law made no flag the Dual Monarchy's: the 1867 compromise and the Croatian-Hungarian settlement of 1868 left each half its own symbols, so no flag is the legal national flag. This one, decreed on 1869-02-18, was flown at sea and by the consulates, and is often shown for the whole monarchy.", source: "https://en.wikipedia.org/wiki/Flag_of_Austria-Hungary", sourceKind: "encyclopedia" },
        why: "Red, white and red with the arms of Austria and of Hungary side by side in the white band, in use from 1869-08-01 until the monarchy ended in November 1918.", source: "https://en.wikipedia.org/wiki/Flag_of_Austria-Hungary", sourceKind: "encyclopedia", file: null,
      },
    ],
  },
  XOT: {
    disputed: false,
    default: "1844",
    variants: [
      { id: "1844", name: "The flag of 1844 to 1922", nameJa: "1844年から1922年の国旗", status: "official", roles: BOTH, from: "1844", until: "1922-11-01", why: "The red flag with a white crescent and five-pointed star, adopted as the national flag in 1844 in the Tanzimat reforms (a source dates the five-pointed star to Mahmud II's notices of 1826); the sultanate was abolished on 1922-11-01.", source: "https://en.wikipedia.org/wiki/Flag_of_the_Ottoman_Empire", sourceKind: "encyclopedia", file: null },
    ],
  },
  XPR: {
    disputed: false,
    default: "black-white",
    variants: [
      { id: "black-white", name: "Black over white", nameJa: "黒と白の旗", status: "official", roles: BOTH, from: "1823-03-12", until: "1935", why: "The black and white flag of the kingdom, the Free State and the province, the state's national and merchant flag after 1823-03-12 (black, white and black from 1818); the Free State kept it by the ministry's decree of 1921-12-16, and the Reich's flag law of 1935 ended the states' flags.", source: "https://en.wikipedia.org/wiki/Flag_of_Prussia", sourceKind: "encyclopedia", file: null },
    ],
  },
  XHW: {
    disputed: false,
    default: "1845",
    variants: [
      { id: "1845", name: "The flag of 1845", nameJa: "1845年の国旗", status: "official", roles: BOTH, from: "1845-05-25", until: "1893-01-17", why: "Eight stripes of white, red and blue and the Union Jack in the canton, unfurled in its present form on 1845-05-25 and kept after the monarchy fell on 1893-01-17.", source: "https://en.wikipedia.org/wiki/Flag_of_Hawaii", sourceKind: "encyclopedia", file: null },
      { id: "1816", name: "The flag of 1816", nameJa: "1816年の旗", status: "historical", roles: [{ role: "in-use" }], from: "1816", until: "1845-05-25", roleNote: { why: "No law or decree for the flag of these years is known; it is the flag visitors described, drawn from the account of the artist Louis Choris, and visitors recorded other numbers of stripes.", source: "https://en.wikipedia.org/wiki/Flag_of_Hawaii", sourceKind: "encyclopedia" }, why: "An early form of the flag with the Union Jack in the canton, as visitors described it from 1816 (the number of stripes they recorded varies).", source: "https://en.wikipedia.org/wiki/Flag_of_Hawaii", sourceKind: "encyclopedia", file: "Flag of Hawaii (1816).svg" },
    ],
  },
  XGE: {
    disputed: false,
    default: "bwr",
    variants: [
      { id: "bwr", name: "Black, white and red", nameJa: "黒・白・赤の旗", status: "official", roles: BOTH, from: "1871-04-16", until: "1918-11-09", why: "The horizontal tricolour of the North German Confederation (1867), kept as the Empire's by the constitution of 1871. The Emperor abdicated on 1918-11-09; the colours stayed the flag until the constitution of 1919-08-14, as the `imperial-bwr` flag of Germany shows.", source: "https://en.wikipedia.org/wiki/Flag_of_Germany", sourceKind: "encyclopedia", file: null },
    ],
  },
  XSV: {
    disputed: false,
    default: "yellow-three-stripes",
    variants: [
      { id: "yellow-three-stripes", name: "The yellow flag with three red stripes", nameJa: "黄地に三本の赤い線の旗", status: "official", roles: BOTH, from: "1955-10-26", until: "1975-04-30", why: "Yellow with three red stripes, the flag of the State of Vietnam (1948 to 1955) that the Republic of Vietnam kept until the fall of Saigon on 1975-04-30.", source: "https://en.wikipedia.org/wiki/Flag_of_South_Vietnam", sourceKind: "encyclopedia", file: null },
    ],
  },
  XKR: {
    disputed: false,
    default: "taegukgi-1882",
    variants: [
      { id: "taegukgi-1882", name: "The Taegukgi of 1882", nameJa: "1882年の太極旗", status: "official", roles: BOTH, from: "1882", until: "1910-08-29", why: "A white flag with the red and blue taegeuk and four trigrams, as published in 1882 and flown by Joseon and by the Korean Empire (1897-10-12) until the annexation of 1910-08-29. The arrangement of the trigrams differs from today's.", source: "https://en.wikipedia.org/wiki/Flag_of_Korea", sourceKind: "encyclopedia", file: null },
    ],
  },
  XQI: {
    disputed: false,
    default: "dragon-1889",
    variants: [
      {
        id: "dragon-1889", name: "The rectangular Yellow Dragon Flag", nameJa: "長方形の黄竜旗", status: "official", roles: [{ role: "in-use" }], from: "1889", until: "1912-01-10",
        roleNote: { why: "The flag was made for official occasions and the dynasty's ships, not as a national flag, and no law made it one; from the late 1880s it came into use as the national flag.", source: "https://en.wikipedia.org/wiki/Flag_of_China", sourceKind: "encyclopedia" },
        why: "A blue dragon with a red pearl on yellow, in the rectangular form of 1889, used until the Five-Colour Flag was adopted on 1912-01-10.", source: "https://en.wikipedia.org/wiki/Flag_of_China", sourceKind: "encyclopedia", file: null,
      },
      {
        id: "triangular-1862", name: "The triangular Yellow Dragon Flag", nameJa: "三角形の黄竜旗", status: "historical", roles: [{ role: "in-use" }], from: "1862", until: "1889",
        roleNote: { why: "The flag was made for official occasions and the dynasty's ships, not as a national flag, and no law made it one.", source: "https://en.wikipedia.org/wiki/Flag_of_China", sourceKind: "encyclopedia" },
        why: "The triangular form of the Yellow Dragon Flag, adopted in 1862 and replaced by the rectangular form in 1889.", source: "https://en.wikipedia.org/wiki/Flag_of_China", sourceKind: "encyclopedia", file: "Flag of China (1862–1889).svg",
      },
    ],
  },
  XUA: {
    disputed: false,
    default: "two-stars",
    variants: [
      { id: "two-stars", name: "The flag with two green stars", nameJa: "緑の星二つの旗", status: "official", roles: BOTH, from: "1958-04-08", until: "1971-09-02", why: "Red, white and black bands with two green five-pointed stars in the white band, adopted on 1958-04-08 (the date and the source are those of Egypt's `uar` flag) and replaced when the state became the Arab Republic of Egypt on 1971-09-02 (the flag of the federation of 1972 is Egypt's `hawk-of-quraish`).", source: "https://manshurat.org/node/71072", sourceKind: "official", file: null },
    ],
  },
  XTX: {
    disputed: false,
    default: "lone-star",
    variants: [
      { id: "lone-star", name: "The Lone Star Flag", nameJa: "ローンスター旗", status: "official", roles: BOTH, from: "1839-01-25", until: "1846", why: "A blue vertical band with a white star, a white and a red horizontal band, adopted on 1839-01-25 and flown until the Republic became a state of the United States.", source: "https://en.wikipedia.org/wiki/Flag_of_Texas", sourceKind: "encyclopedia", file: null },
      { id: "burnet", name: "The Burnet Flag", nameJa: "バーネット旗", status: "historical", roles: BOTH, from: "1836-12-10", until: "1839-01-25", why: "A gold star on azure, the Republic's first national flag from 1836-12-10 to 1839-01-25.", source: "https://en.wikipedia.org/wiki/Flag_of_Texas", sourceKind: "encyclopedia", file: "Flag of the Republic of Texas (1836–1839).svg" },
    ],
  },
  XIT: {
    disputed: false,
    default: "savoy-arms",
    variants: [
      { id: "savoy-arms", name: "The tricolour with the Savoy arms", nameJa: "サヴォイア家の紋章入りの三色旗", status: "official", roles: BOTH, from: "1861-03-17", until: "1946-06-19", why: "Green, white and red verticals with the shield of the House of Savoy on the white band; the drawing shown is the civil flag's, and the state and war flags added the crown.", source: "https://en.wikipedia.org/wiki/Flag_of_Italy", sourceKind: "encyclopedia", file: null },
    ],
  },
  XZB: {
    disputed: false,
    default: "sultanate",
    variants: [
      { id: "sultanate", name: "The Sultanate's flag", nameJa: "スルタン国の国旗", status: "official", roles: BOTH, from: "1963-12-10", until: "1964-01-12", why: "A red flag, flown from independence on 1963-12-10 until the revolution of 1964-01-12.", source: "https://en.wikipedia.org/wiki/Zanzibar", sourceKind: "encyclopedia", file: null },
    ],
  },
};

export { FORMER_HISTORICAL, FORMER_VARIANTS };
