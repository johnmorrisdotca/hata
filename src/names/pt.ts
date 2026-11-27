// The entry @johnmorrisdotca/hata/names/pt: a country's name in Portuguese, from Kuni's
// Unicode CLDR table. English and Japanese stay in /names. A page that asks for this language pays
// for this entry and not for the others.

import { NAMES_PT } from "../data/name-languages/pt.data";
import { flagNameIn } from "./extra";

/**
 * The name of a country in Portuguese, as Kuni gives it from Unicode CLDR. A prefecture, a former
 * country, and any place Kuni does not name in Portuguese is null.
 *
 * @param code - A flag's code, in any case: "JP", "jp", "DE". A former country's alias is read when that place has a name here.
 * @returns The Portuguese name, or null when this language has no name for that flag.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```ts
 * import { flagName } from "@johnmorrisdotca/hata/names/pt";
 *
 * console.log(flagName("JP"));
 * console.log(flagName("JP-13"));
 * ```
 */
const flagName = (code: string): string | null => flagNameIn(NAMES_PT, code);

export { flagName };
