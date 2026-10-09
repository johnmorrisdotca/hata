// The few things about the flags that are written by hand rather than read from Wikidata or Commons. Every entry
// says why it is here. scripts/select.ts and scripts/build-data.ts read this file; nothing else is hand-written.

// The first level of these countries' subdivisions has flags in this version. Kuni's lists are the ones checked.
const SUBDIVISION_COUNTRIES = ["JP", "CA", "US"] as const;

// Where Wikidata's flag statements do not settle on one current file, the file to use and why. A code here is
// still checked: the file must be one of the item's statements, so a typo cannot bring in another picture.
const CHOSEN: Readonly<Record<string, { file: string; why: string }>> = {
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
  GF: "design: Wikidata gives France's flag; country-flag-icons and circle-flags draw the regional flag of French Guiana.",
  GP: "design: Commons gives France's flag (data-config CHOSEN); circle-flags draws a local flag.",
  MF: "design: Wikidata gives France's flag; the sets draw Saint Martin's local flag.",
  PM: "design: Commons' drawing is the local flag of Saint-Pierre and Miquelon; flag-icons and country-flag-icons draw France's.",
  RE: "design: Wikidata gives France's flag; circle-flags draws the Lofo, a flag proposed for Réunion.",
  SH: "design: Wikidata gives the Union Flag for Saint Helena, Ascension and Tristan da Cunha; the sets draw Saint Helena's own flag.",
  WF: "design: Commons' drawing is Wallis and Futuna's local flag; flag-icons draws France's.",
  YT: "design: Commons' drawing is Mayotte's local flag, with its lettering; flag-icons draws France's.",
};
const SAME_DESIGN = "same design: the sets draw it simplified, in other shades, or laid out again at their shape; Commons' drawing is the full one";
for (const code of ["BB", "BS", "BZ", "CA-BC", "DJ", "DM", "ES", "ET", "GS", "GY", "IO", "JM", "KI", "KN", "KY", "LK", "LT", "MP", "MU", "MY", "MZ", "NC", "NP", "PK", "PN", "SB", "SZ", "TM", "UM", "US", "US-DC", "US-MS", "US-SC", "US-UM", "US-VI", "US-WY", "UY", "VI", "ZW"]) {
  (REVIEWED as Record<string, string>)[code] = SAME_DESIGN;
}

// Codes with no flag in this version, and why. The coverage test holds every code of Kuni to either a flag or a
// line here (or a line the build writes itself, such as a licence that is not free).
const NO_FLAG: Readonly<Record<string, string>> = {
  AQ: "Antarctica has no official flag. Wikidata's flag for the code is the Antarctic Treaty's, on another item; the proposed flags (True South, Graham Bartram's) are no government's.",
  BQ: "The Caribbean Netherlands have no flag of their own: Bonaire, Sint Eustatius and Saba each have one, and the Netherlands' flag is the official one (see docs/decisions.md).",
  EH: "Western Sahara has no flag of its own on Wikidata. The flag often shown for it is the Sahrawi Arab Democratic Republic's, one claimant's; it is left out rather than chosen for the territory (see docs/decisions.md).",
};

// The size budget of one optimised flag, in bytes of SVG. Flags carrying a detailed coat of arms or seal go over
// it; the build lists them in docs/sizes.md and the size test holds the list, so a new one is a decision.
const BUDGET_BYTES = 40 * 1024;

// Flags may go over the budget only up to this, after which the build fails: a picture this large is not an icon.
const CEILING_BYTES = 400 * 1024;

export { ACCEPTED, BUDGET_BYTES, CEILING_BYTES, CHOSEN, ITEM, NO_FLAG, REVIEWED, SUBDIVISION_COUNTRIES };
