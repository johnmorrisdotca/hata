// The entry @johnmorrisdotca/hata/names/ar: a country's name in Arabic, from Kuni's
// Unicode CLDR table. English and Japanese stay in /names. A page that asks for this language pays
// for this entry and not for the others.

import { NAMES_AR } from "../data/name-languages/ar.data";
import { flagNameIn } from "./extra";

/**
 * The name of a country in Arabic, as Kuni gives it from Unicode CLDR. A prefecture, a former
 * country, and any place Kuni does not name in Arabic is null.
 *
 * @param code - A flag's code, in any case: "JP", "jp", "DE". A former country's alias is read when that place has a name here.
 * @returns The Arabic name, or null when this language has no name for that flag.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { flagName } from "@johnmorrisdotca/hata/names/ar";
 *
 * console.log(flagName("JP"));
 * console.log(flagName("JP-13"));
 * ```
 */
const flagName = (code: string): string | null => flagNameIn(NAMES_AR, code);

export { flagName };
