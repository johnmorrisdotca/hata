// The entry @johnmorrisdotca/hata/organisations: the flags of international organisations, apart from the countries'
// so that a page with countries only does not pay for them. Ids are `org:<slug>` ("org:eu"), a namespace no ISO 3166
// code can be in. Every function reads the table in organisations.data.ts, so adding an organisation is one record.
//
// Every function is pure and works on strings: no DOM, no network, the same answer on a server and in a browser.

import { ORGANISATIONS } from "./organisations.data";
import { aspectOf, mustBeString } from "./svg";

/**
 * The id of an organisation's flag, written exactly as this package writes it: `org:` and a lower-case slug.
 * Country and region codes never contain a colon, so no organisation id can be taken for one.
 *
 * @example
 * ```ts
 * import { type OrganisationId } from "@johnmorrisdotca/hata/organisations";
 *
 * const european: OrganisationId = "org:eu";
 * console.log(european);
 * ```
 */
type OrganisationId = (typeof ORGANISATIONS)[number]["id"];

/**
 * Every organisation id with a flag, in the order of the table.
 *
 * @example
 * ```ts
 * import { ORGANISATION_IDS } from "@johnmorrisdotca/hata/organisations";
 *
 * console.log(ORGANISATION_IDS); // ["org:eu"]
 * ```
 */
const ORGANISATION_IDS: readonly OrganisationId[] = ORGANISATIONS.map((one) => one.id);

const BY_ID: ReadonlyMap<string, (typeof ORGANISATIONS)[number]> = new Map(ORGANISATIONS.map((one) => [one.id, one]));

/**
 * True for one of the ids with a flag here, written exactly as this package writes it: "org:eu". Lower case is
 * required, and a country's code ("JP") is not an organisation's id; `organisationId` is the forgiving one.
 *
 * @param value - Anything.
 * @returns `true` when `value` is a string in `ORGANISATION_IDS`, and `false` for anything else, never throwing.
 *
 * @example
 * ```ts
 * import { isOrganisationId } from "@johnmorrisdotca/hata/organisations";
 *
 * console.log(isOrganisationId("org:eu")); // true
 * console.log(isOrganisationId("ORG:EU")); // false: see organisationId
 * console.log(isOrganisationId("EU"));     // false: no ISO code is an id here
 * ```
 */
const isOrganisationId = (value: unknown): value is OrganisationId => typeof value === "string" && BY_ID.has(value);

/**
 * The id of an organisation's flag, from an id written loosely: either case, with spaces around it. The `org:` may
 * be left off ("EU", " eu ").
 *
 * @param input - An id, with or without `org:`, in any case.
 * @returns The id as this package writes it (`"org:eu"`), or `null` when it is no id or the organisation has no flag here.
 * @throws TypeError when `input` is not a string.
 *
 * @example
 * ```ts
 * import { organisationId } from "@johnmorrisdotca/hata/organisations";
 *
 * console.log(organisationId("ORG:EU")); // "org:eu"
 * console.log(organisationId(" eu "));   // "org:eu"
 * console.log(organisationId("org:xx")); // null
 * ```
 */
const organisationId = (input: string): OrganisationId | null => {
  const written = mustBeString(input, "id").trim().toLowerCase();
  const id = written.startsWith("org:") ? written : `org:${written}`;

  return isOrganisationId(id) ? id : null;
};

/**
 * An organisation's flag as an SVG string, the same kind of string a country's module holds: it has a viewBox and no
 * width or height. `frame()` and `toDataUri()` from the main entry take it like any other.
 *
 * @param id - An organisation's id, in any case, with or without `org:` ("org:eu", "EU").
 * @returns The SVG string, or `null` when the id has no flag here.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { frame } from "@johnmorrisdotca/hata";
 * import { organisationFlag } from "@johnmorrisdotca/hata/organisations";
 *
 * const european = organisationFlag("org:eu"); // "<svg …>"
 * console.log(european === null ? null : frame(european, { shape: "round", label: "European Union" }));
 * console.log(organisationFlag("org:xx"));     // null
 * ```
 */
const organisationFlag = (id: string): string | null => {
  const known = organisationId(id);

  return known === null ? null : (BY_ID.get(known)?.svg ?? null);
};

/**
 * An organisation's name, in English or Japanese: what a screen reader should say for the flag, or a caption. Any
 * language tag that starts with `ja` is Japanese; anything else is English.
 *
 * @param id - An organisation's id, in any case, with or without `org:`.
 * @param lang - `"en"` (the default), `"ja"`, or a language tag such as `"ja-JP"`.
 * @returns The name, or `null` when the id has no flag here.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { organisationName } from "@johnmorrisdotca/hata/organisations";
 *
 * console.log(organisationName("org:eu"));       // "European Union"
 * console.log(organisationName("org:eu", "ja")); // "欧州連合"
 * console.log(organisationName("org:xx"));       // null
 * ```
 */
const organisationName = (id: string, lang: string = "en"): string | null => {
  const known = organisationId(id);
  const found = known === null ? undefined : BY_ID.get(known);
  if (found === undefined) return null;

  return /^ja\b/i.test(String(lang)) ? found.name.ja : found.name.en;
};

/**
 * An organisation's flag's width over its height, from its viewBox: 1.5 for the European Union's 3:2. For keeping a
 * box before the picture is drawn.
 *
 * @param id - An organisation's id, in any case, with or without `org:`.
 * @returns The aspect ratio, or `null` when the id has no flag here.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { organisationAspect } from "@johnmorrisdotca/hata/organisations";
 *
 * console.log(organisationAspect("org:eu")); // 1.5
 * console.log(organisationAspect("org:xx")); // null
 * ```
 */
const organisationAspect = (id: string): number | null => {
  const svg = organisationFlag(id);

  return svg === null ? null : aspectOf(svg);
};

/**
 * Where the terms for an organisation's flag were read: the page, the day, and what they say. A flag is here only
 * where those terms let an MIT package carry it; `NOTICE.md` has the same sentences.
 *
 * @param id - An organisation's id, in any case, with or without `org:`.
 * @returns `{ url, read, says }`, or `null` when the id has no flag here.
 * @throws TypeError when `id` is not a string.
 *
 * @example
 * ```ts
 * import { organisationTerms } from "@johnmorrisdotca/hata/organisations";
 *
 * console.log(organisationTerms("org:eu")?.url); // "https://european-union.europa.eu/legal-notice_en"
 * console.log(organisationTerms("org:xx"));      // null
 * ```
 */
const organisationTerms = (id: string): { url: string; read: string; says: string } | null => {
  const known = organisationId(id);
  const found = known === null ? undefined : BY_ID.get(known);

  return found === undefined ? null : { ...found.terms };
};

export { isOrganisationId, ORGANISATION_IDS, organisationAspect, organisationFlag, organisationId, organisationName, organisationTerms };
export type { OrganisationId };
