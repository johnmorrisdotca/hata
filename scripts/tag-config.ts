// What is on a flag, as tags from a closed list: the list, and the tables that turn what Wikidata and Commons say
// into tags. Hand-written, like scripts/data-config.ts; scripts/tag-data.ts applies it to the snapshots and the
// measures, so no flag's tags are typed here. A person's review of a flag's tags goes in TAG_REVIEWS, at the end.

// The closed list. A tag is a thing a person sees on the flag, in kebab case; `what` says when it applies.
const FLAG_TAGS = [
  { id: "plain", what: "Flat fields of colour with straight edges and nothing drawn on them: one colour, or bands across or down the whole flag." },
  { id: "stripes-horizontal", what: "Bands across the flag, one above another." },
  { id: "stripes-vertical", what: "Bands down the flag, side by side." },
  { id: "stripes-diagonal", what: "A band or a division from corner to corner." },
  { id: "cross", what: "A cross of any kind, upright or not; a Nordic cross and the crosses of a Union Flag count." },
  { id: "nordic-cross", what: "A cross whose upright is nearer the hoist, as on Denmark's flag." },
  { id: "saltire", what: "A diagonal cross, as on Scotland's or Jamaica's flag." },
  { id: "canton", what: "A rectangle of its own in the corner by the hoist, as on the flag of the United States." },
  { id: "stars", what: "One star or more, of any number of points, or a constellation." },
  { id: "crescent", what: "A crescent moon." },
  { id: "sun", what: "A sun, as a disc or with rays." },
  { id: "circle", what: "A disc or a ring that is a shape of the flag itself." },
  { id: "triangle", what: "A triangle, most often at the hoist." },
  { id: "emblem", what: "A seal, a badge, a shield or another device placed on the flag; a coat of arms counts." },
  { id: "coat-of-arms", what: "A coat of arms." },
  { id: "animal", what: "An animal or a bird, real or of legend." },
  { id: "plant", what: "A tree, a leaf, a flower or another plant." },
  { id: "building", what: "A building, a tower or a bridge." },
  { id: "weapon", what: "A sword, a spear or another weapon." },
  { id: "crown", what: "A crown." },
  { id: "map", what: "The outline of a land." },
  { id: "text", what: "Letters or words, in any script." },
] as const;
type FlagTag = (typeof FLAG_TAGS)[number]["id"];

// Where a tag comes from. `computed`: measured from the drawing by a rule with no judgement in it. `wikidata`: the
// flag's Wikidata item says it depicts (P180) a thing of that kind. `unreviewed`: an automated guess (a Commons
// category of the file, or a rule of thumb on the drawing) that nobody has checked. `reviewed`: a person looked at
// the flag and said so, in TAG_REVIEWS. The most trusted source a tag has is the one recorded.
const TAG_SOURCES = ["reviewed", "computed", "wikidata", "unreviewed"] as const;
type TagSource = (typeof TAG_SOURCES)[number];

// Wikidata items and the tags they stand for. A flag item's "depicts" (P180) value gives a tag when it is one of
// these items. A thing that is none of them gives the tags of each item marked `kinds` that it is an instance of,
// a subclass of or a taxon under (P31, P279 and P171, any number of steps: Sirius is a star, a country's coat of
// arms is a coat of arms, a beaver is an animal). Only a few are marked: Wikidata's classes are loose higher up (a
// lion is, some steps on, a text), so a kind is followed only where it was looked at. The label is Wikidata's
// English one, read with the snapshot; a test holds each to the snapshot so that an id cannot be mistyped.
const WIKIDATA_TAGS: Readonly<Record<string, { label: string; tags: readonly FlagTag[]; kinds?: true }>> = {
  Q379860: { label: "five-pointed star", tags: ["stars"] },
  Q27921428: { label: "six-pointed star", tags: ["stars"] },
  Q3592528: { label: "seven-pointed star", tags: ["stars"] },
  Q20750867: { label: "eight-pointed star", tags: ["stars"] },
  Q3033697: { label: "dodecagram", tags: ["stars"] },
  Q182186: { label: "pentagram", tags: ["stars"] },
  Q208578: { label: "red star", tags: ["stars"] },
  Q161396: { label: "Star of David", tags: ["stars"] },
  Q2915591: { label: "Commonwealth Star", tags: ["stars"] },
  Q523: { label: "star", tags: ["stars"], kinds: true },
  Q662639: { label: "star", tags: ["stars"] },
  Q1191504: { label: "star", tags: ["stars"] },
  Q8928: { label: "constellation", tags: ["stars"], kinds: true },
  Q3592503: { label: "star and crescent", tags: ["stars", "crescent"] },
  Q5488888: { label: "crescent", tags: ["crescent"] },
  Q525: { label: "Sun", tags: ["sun"] },
  Q1047667: { label: "Sun of May", tags: ["sun"] },
  Q193294: { label: "sunrise", tags: ["sun"] },
  Q47538508: { label: "Zia sun", tags: ["sun"] },
  Q1265761: { label: "roundel", tags: ["circle"] },
  Q2049919: { label: "roundel", tags: ["circle"] },
  Q238231: { label: "disk", tags: ["circle"] },
  Q17278: { label: "circle", tags: ["circle"] },
  Q19821: { label: "triangle", tags: ["triangle"], kinds: true },
  Q157002: { label: "equilateral triangle", tags: ["triangle"] },
  Q875937: { label: "isosceles triangle", tags: ["triangle"] },
  Q158688: { label: "right triangle", tags: ["triangle"] },
  Q3205956: { label: "pile", tags: ["triangle"] },
  Q27927595: { label: "pile issuant from dexter", tags: ["triangle"] },
  Q1088484: { label: "fess", tags: ["stripes-horizontal"] },
  Q4857865: { label: "bar", tags: ["stripes-horizontal"] },
  Q15140897: { label: "barry", tags: ["stripes-horizontal"] },
  Q1815803: { label: "barrulet", tags: ["stripes-horizontal"] },
  Q593676: { label: "pale", tags: ["stripes-vertical"] },
  Q805079: { label: "bend", tags: ["stripes-diagonal"] },
  Q725356: { label: "bend sinister", tags: ["stripes-diagonal"] },
  Q40843: { label: "cross", tags: ["cross"], kinds: true },
  Q612908: { label: "Greek cross", tags: ["cross"] },
  Q614328: { label: "St George's Cross", tags: ["cross"] },
  Q891515: { label: "Bolnisi cross", tags: ["cross"] },
  Q13100174: { label: "Nordic cross", tags: ["cross", "nordic-cross"] },
  Q201960: { label: "saltire", tags: ["saltire"] },
  Q1585890: { label: "Saint Patrick's Saltire", tags: ["saltire"] },
  Q3173323: { label: "Union Jack", tags: ["cross", "saltire"] },
  Q885701: { label: "Blue Ensign", tags: ["canton", "cross", "saltire"] },
  Q1267314: { label: "canton", tags: ["canton"] },
  Q1559605: { label: "canton", tags: ["canton"] },
  Q14659: { label: "coat of arms", tags: ["coat-of-arms", "emblem"], kinds: true },
  Q131559: { label: "shield", tags: ["emblem"] },
  Q188028: { label: "Emblem of Iran", tags: ["emblem"] },
  Q2164980: { label: "Seal of Oregon", tags: ["emblem"] },
  Q729: { label: "animal", tags: ["animal"], kinds: true },
  Q338814: { label: "lion", tags: ["animal"] },
  Q622964: { label: "double-headed eagle", tags: ["animal"] },
  Q358209: { label: "Eagle of Saladin", tags: ["animal"] },
  Q2344734: { label: "Druk", tags: ["animal"] },
  Q722475: { label: "Zimbabwe Bird", tags: ["animal"] },
  Q1254187: { label: "dragon", tags: ["animal"] },
  Q884928: { label: "Berlin bear", tags: ["animal"] },
  Q358148: { label: "eagle", tags: ["animal"] },
  Q7197420: { label: "piping shrike", tags: ["animal"] },
  Q756: { label: "plant", tags: ["plant"], kinds: true },
  Q506: { label: "flower", tags: ["plant"] },
  Q138550: { label: "olive branch", tags: ["plant"] },
  Q1068978: { label: "maple leaf", tags: ["plant"] },
  Q211568: { label: "fleur-de-lis", tags: ["plant"] },
  Q41176: { label: "building", tags: ["building"], kinds: true },
  Q728: { label: "weapon", tags: ["weapon"], kinds: true },
  Q170984: { label: "crown", tags: ["crown"], kinds: true },
  Q1063103: { label: "papal tiara", tags: ["crown"] },
  Q4006: { label: "map", tags: ["map"] },
  Q234460: { label: "text", tags: ["text"] },
  Q42470: { label: "motto", tags: ["text"] },
  Q41831: { label: "Shahada", tags: ["text"] },
  Q191811: { label: "Takbir", tags: ["text"] },
  Q9788: { label: "letter", tags: ["text"] },
};

// Commons categories of a flag's file and the tags they suggest, as `unreviewed`. Only a category that says what
// is on a flag is read (CATEGORY_DESCRIBES: "Flags with ...", "... on flags", "Horizontal bicolor ... flags"), so
// that "Flags of the Austrian Circle" is not a circle; then each pattern is tried on its name, and every one that
// matches gives its tags. Commons' categories are written by anyone, in many ways: these are guesses until a
// person has looked.
const CATEGORY_DESCRIBES = /^(Flags with |Flags based on (hiragana|katakana|kanji)|(Horizontal|Vertical|Diagonal) |(Kanji|Hiragana|Katakana) flags|Inscribed flags|Union Jack cantons|Saint Patrick's Saltire$)| on flags\b|\(text\)$/i;
const CATEGORY_TAGS: readonly { pattern: RegExp; tags: readonly FlagTag[] }[] = [
  { pattern: /\b(stars?|mullets?|pentagrams?|constellations?|Southern Cross|Big Dipper)\b/i, tags: ["stars"] },
  { pattern: /\bcrescents?\b/i, tags: ["crescent"] },
  { pattern: /\bsuns?\b/i, tags: ["sun"] },
  { pattern: /\b(circles?|dis[ck]s?|roundels?|rings?)\b/i, tags: ["circle"] },
  { pattern: /\b(triangles?|chevrons?)\b/i, tags: ["triangle"] },
  { pattern: /\b(Nordic|Scandinavian) cross/i, tags: ["cross", "nordic-cross"] },
  { pattern: /\bsaltires?\b/i, tags: ["saltire"] },
  { pattern: /\bcross(es)?\b/i, tags: ["cross"] },
  { pattern: /\bUnion Jack\b/i, tags: ["cross", "saltire"] },
  { pattern: /\bcantons?\b/i, tags: ["canton"] },
  { pattern: /\b(coats? of arms|with arms)\b/i, tags: ["coat-of-arms", "emblem"] },
  { pattern: /\b(seals?|emblems?|badges?|shields?|escutcheons?|devices)\b/i, tags: ["emblem"] },
  { pattern: /\b(animals?|birds?|eagles?|lions?|leopards?|horses?|bears?|dragons?|fish(es)?|dolphins?|bulls?|deer|wolves|wolf|martens?|falcons?|hawks?|pelicans?|swans?|parrots?|bees?)\b/i, tags: ["animal"] },
  { pattern: /\b(plants?|trees?|pines?|leaves|leaf|flowers?|sunflowers?|wreaths?|laurel|palms?|branches|roses?|lil(y|ies)|fleurs?-de-l[iy]s|cherry blossoms?|maple)\b/i, tags: ["plant"] },
  { pattern: /\b(buildings?|castles?|towers?|bridges?|churches|church|temples?|mosques?|gates?)\b/i, tags: ["building"] },
  { pattern: /\b(weapons?|swords?|spears?|arrows?|guns?|rifles?|axes?|tridents?|machetes?)\b/i, tags: ["weapon"] },
  { pattern: /\bcrowns?\b/i, tags: ["crown"] },
  { pattern: /\b(maps?|geographic shapes)\b/i, tags: ["map"] },
  { pattern: /(\(text\)$|^Inscribed flags|^(Kanji|Hiragana|Katakana) flags|^Flags based on (hiragana|katakana|kanji)|\b(text|inscriptions?|mottos?|mottoes|letters?|lettering|words?|calligraphy|shahada)\b)/i, tags: ["text"] },
  { pattern: /(^Horizontal |\bhorizontal stripes?\b|stripes? \(horizontal\))/i, tags: ["stripes-horizontal"] },
  { pattern: /(^Vertical |\bvertical stripes?\b|stripes? \(vertical\))/i, tags: ["stripes-vertical"] },
  { pattern: /(^Diagonal |\bdiagonal stripes?\b|stripes? \(diagonal\))/i, tags: ["stripes-diagonal"] },
];

// A flag with this many measured colours or more is guessed to carry an emblem: a seal or a coat of arms is drawn
// in many colours, and stripes, crosses and stars are not.
const EMBLEM_COLOURS = 8;

// What a person found on looking at a flag: for a picture's key ("JP", "AF--de-facto"), each tag looked at and
// whether the flag has it. "yes" records the tag as `reviewed` (and adds it where no source gave it); "no" takes an
// automated or Wikidata tag away. Few until somebody reviews: the countries first (MODULES-1422).
const TAG_REVIEWS: Readonly<Record<string, Readonly<Partial<Record<FlagTag, "yes" | "no">>>>> = {
  // 4 U.S.C. § 1: "thirteen horizontal stripes, alternate red and white".
  US: { "stripes-horizontal": "yes" },
};

export { CATEGORY_DESCRIBES, CATEGORY_TAGS, EMBLEM_COLOURS, FLAG_TAGS, TAG_REVIEWS, TAG_SOURCES, WIKIDATA_TAGS };
export type { FlagTag, TagSource };
