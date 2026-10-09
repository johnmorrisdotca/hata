// The few things about the flags that are written by hand rather than read from Wikidata or Commons. Every entry
// says why it is here. scripts/select.ts and scripts/build-data.ts read this file; nothing else is hand-written.

// The first level of these countries' subdivisions has flags in this version. Kuni's lists are the ones checked, and
// a country is added only whole: every first-level code Kuni gives it has a flag here or a reason in NO_FLAG (or one
// the build writes itself, such as a licence that is not free). Japan, Canada and the United States came in 1.0.0;
// Australia, the United Kingdom, Germany and France in 1.1.0, with Switzerland, Austria and Brazil. Spain, Italy,
// Mexico and India wait (docs/decisions.md says why).
const SUBDIVISION_COUNTRIES = ["JP", "CA", "US", "AU", "GB", "DE", "FR", "CH", "AT", "BR"] as const;

// Subdivision codes that are the same place as a country code: France's overseas regions and collectivities, which
// ISO 3166 lists both as countries and as French subdivisions. The subdivision takes whatever the country's code
// takes, by the same rule and the same lines in CHOSEN, so a decision about Guadeloupe's flag is made once (see
// docs/decisions.md, the French territories) and the two codes share one picture.
const SAME_PLACE: Readonly<Record<string, string>> = {
  "FR-971": "GP",
  "FR-972": "MQ",
  "FR-973": "GF",
  "FR-974": "RE",
  "FR-976": "YT",
  "FR-BL": "BL",
  "FR-MF": "MF",
  "FR-NC": "NC",
  "FR-PF": "PF",
  "FR-PM": "PM",
  "FR-TF": "TF",
  "FR-WF": "WF",
};

// Subdivisions whose flag is a Commons file named here by hand, because the file Wikidata names is not the flag as
// it is flown: the government's service flag where the civil flag (the one anybody may fly) is the place's flag in
// everyday use, or a drawing at other proportions than the law's. The file need not be one of the item's
// statements; it is fetched from Commons and checked like any other, and its reason goes into the manifest.
const NAMED: Readonly<Record<string, { file: string; why: string }>> = {
  "AT-4": {
    file: "Flag of Tirol and Upper Austria.svg",
    why: "Upper Austria's flag (Landesflagge) is white over red, plain; Wikidata gives only the government's service flag (Landesdienstflagge), which adds the arms. Tyrol's flag is the same white over red.",
  },
  "AT-7": {
    file: "Flag of Tirol and Upper Austria.svg",
    why: "Tyrol's flag (Landesflagge) is white over red, plain; Wikidata prefers the government's service flag (Landesdienstflagge), which adds the eagle. Upper Austria's flag is the same white over red.",
  },
  "CH-GR": {
    file: "Flag of Canton of Graubünden.svg",
    why: "A canton's flag is square, as Switzerland's is; the drawing Wikidata names is 0.90:1. Commons' square drawing of the same flag is used.",
  },
};

// Where Wikidata's flag statements do not settle on one current file, the file to use and why. A code here is
// still checked: the file must be one of the item's statements, so a typo cannot bring in another picture.
const CHOSEN: Readonly<Record<string, { file: string; why: string }>> = {
  "DE-BY": {
    file: "Flag of Bavaria (lozengy).svg",
    why: "Bavaria has two flags of equal standing, white and blue in stripes or in lozenges, and Wikidata ranks neither first. The lozenges are the one the state's government and most people fly; the stripes are as official (docs/decisions.md).",
  },
  GP: {
    file: "Flag of France.svg",
    why: "Wikidata ranks two files preferred: France's flag, which is Guadeloupe's official flag, and the regional council's local flag. The official one is used, as Wikidata does for Réunion, French Guiana and Saint Martin (docs/decisions.md: the French territories are not all treated alike).",
  },
};

// Codes that more than one current Wikidata item carries, and the item that is the place Kuni means. The build
// stops at any other code with two current items, rather than take the first.
const ITEM: Readonly<Record<string, { item: string; why: string }>> = {
  AQ: { item: "Q51", why: "Antarctica. The other item is the Antarctic Treaty area, whose flag is the treaty's, not the continent's." },
  BQ: { item: "Q27561", why: "Caribbean Netherlands. The other item is the British Antarctic Territory, whose ISO code BQ was until 1979." },
  CY: { item: "Q229", why: "The Republic of Cyprus. The other item, also labelled Cyprus, is the island." },
  "CH-BE": { item: "Q11911", why: "The Canton of Bern. The other item, a mountain (Kleines Schneehorn), carries the canton's code by mistake." },
};

// Files whose licence is not public domain, CC0 or CC BY, brought in by the maintainer's decision, with the
// decision in words. Empty: every such file is left out and listed in docs/left-out.md until somebody decides.
const ACCEPTED: Readonly<Record<string, string>> = {};

// What a person found on looking at each place where a flag set draws something quite different from Commons
// (docs/compared.md, and the pictures from `pnpm data:sheet`). "same design" means the difference is a
// simplified emblem, another shade or another layout at the set's shape, and Commons' drawing is right; "design"
// means the sources show different flags, and docs/decisions.md says which ships and why. A test holds every
// flagged place to a line here, so a new difference is looked at.
const REVIEWED: Readonly<Record<string, string>> = {
  AF: "design: Wikidata's preferred flag is the Taliban's (since 2021-08-15); every set draws the Islamic Republic's tricolour.",
  BL: "design: Commons' drawing is the collectivity's local flag; flag-icons draws France's.",
  "FR-CP": "design: Wikidata gives France's flag, the only one flown on Clipperton Island; circle-flags draws an unofficial local design.",
  GF: "design: Wikidata gives France's flag; country-flag-icons and circle-flags draw the regional flag of French Guiana.",
  GP: "design: Commons gives France's flag (data-config CHOSEN); circle-flags draws a local flag.",
  MF: "design: Wikidata gives France's flag; the sets draw Saint Martin's local flag.",
  NC: "same design: every source draws the FLNKS (Kanak) flag, Wikidata's choice; which of New Caledonia's two flags to ship is in docs/decisions.md.",
  PM: "design: Commons' drawing is the local flag of Saint-Pierre and Miquelon; flag-icons and country-flag-icons draw France's.",
  RE: "design: Wikidata gives France's flag; circle-flags draws the Lofo, a flag proposed for Réunion.",
  SH: "design: Wikidata gives the Union Flag for Saint Helena, Ascension and Tristan da Cunha; the sets draw Saint Helena's own flag.",
  WF: "design: Commons' drawing is Wallis and Futuna's local flag; flag-icons draws France's.",
  YT: "design: Commons' drawing is Mayotte's local flag, with its lettering; flag-icons draws France's.",
};
const SAME_DESIGN = "same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one";
for (const code of ["AU-ACT", "BB", "BS", "BZ", "CA-BC", "DJ", "DM", "ES", "ET", "GS", "GY", "IO", "JM", "KI", "KN", "KY", "LK", "LT", "MP", "MU", "MY", "MZ", "NP", "PK", "PN", "SB", "SZ", "TM", "UM", "US", "US-DC", "US-MS", "US-SC", "US-UM", "US-VI", "US-WY", "UY", "VI", "ZW"]) {
  (REVIEWED as Record<string, string>)[code] = SAME_DESIGN;
}

// Codes with no flag in this version, and why. The coverage test holds every code of Kuni to either a flag or a
// line here (or a line the build writes itself, such as a licence that is not free).
const NO_FLAG: Readonly<Record<string, string>> = {
  "GB-NIR":
    "Northern Ireland has had no official flag of its own since 1973: the Union Flag is the only flag its government flies. The Ulster Banner (the former Government of Northern Ireland's, 1953 to 1972) and St Patrick's Saltire are flown by some and not by others, and Wikidata gives neither (see docs/decisions.md).",
  // France's regions: only those with a flag of their own in public use. Most regional councils use a logo, and the
  // banners on Commons for those regions are combinations of old provinces' arms that nobody adopted.
  "FR-ARA":
    "Auvergne-Rhône-Alpes has no flag: its regional council uses a logo, and the flag on Commons that Wikidata names joins the arms of the old provinces in a design that no authority adopted.",
  "FR-BFC":
    "Bourgogne-Franche-Comté has no flag: its regional council uses a logo, and the flag on Commons that Wikidata names joins the arms of Burgundy and Franche-Comté in a design that no authority adopted.",
  "FR-CVL":
    "Centre-Val de Loire has no flag: its regional council uses a logo, and the banner on Commons that Wikidata names is one no authority adopted.",
  "FR-GES": "Grand Est has no flag: its regional council uses a logo, and Wikidata names no flag for it.",
  "FR-HDF":
    "Hauts-de-France has no flag: its regional council uses a logo, and the flag on Commons that Wikidata names is a proposal that no authority adopted.",
  "FR-IDF":
    "Île-de-France has no flag: its regional council uses a logo, and the banner of fleurs-de-lis that Wikidata names is a cultural flag that no authority adopted.",
  "FR-OCC":
    "Occitanie has no flag: its regional council uses a logo joining the cross of Toulouse and the Catalan stripes, and the flag Wikidata names is one variant of it. The Occitan cross flag belongs to the wider cultural region of Occitania, not to this administrative one.",
  "FR-PAC":
    "Provence-Alpes-Côte d'Azur has no flag: its regional council uses a logo, and the flag on Commons that Wikidata names joins the arms of Provence, the Dauphiné and Nice in a design that no authority adopted. Provence's own flag covers only part of the region.",
  "FR-PDL":
    "Pays de la Loire has no flag: its regional council uses a logo, and the flag that Wikidata names is a cultural flag that no authority adopted.",
  AQ: "Antarctica has no official flag. Wikidata's flag for the code is the Antarctic Treaty's, on another item; the proposed flags (True South, Graham Bartram's) are no government's.",
  BQ: "The Caribbean Netherlands have no flag of their own: Bonaire, Sint Eustatius and Saba each have one, and the Netherlands' flag is the official one (see docs/decisions.md).",
  EH: "Western Sahara has no flag of its own on Wikidata. The flag often shown for it is the Sahrawi Arab Democratic Republic's, one claimant's; it is left out rather than chosen for the territory (see docs/decisions.md).",
};

// Flags whose meaning is at the hoist, by the pole, so that a frame that must crop them may crop from the fly and
// keep the hoist (scripts/framing.mjs; a crop is used only where it also keeps the flag's colours). Empty: no flag
// needs it yet. Every flag a centre crop would misrepresent is shown whole, or drawn again by flag-icons.
const FOCUS: Readonly<Record<string, "hoist">> = {};

// The size budget of one optimised flag, in bytes of SVG. Flags carrying a detailed coat of arms or seal go over
// it; the build lists them in docs/sizes.md and the size test holds the list, so a new one is a decision.
const BUDGET_BYTES = 40 * 1024;

// Flags may go over the budget only up to this, after which the build fails: a picture this large is not an icon.
const CEILING_BYTES = 400 * 1024;

export { ACCEPTED, BUDGET_BYTES, CEILING_BYTES, CHOSEN, FOCUS, ITEM, NAMED, NO_FLAG, REVIEWED, SAME_PLACE, SUBDIVISION_COUNTRIES };
