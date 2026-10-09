// Which Commons file is each place's flag, decided from the Wikidata snapshot alone, by one rule used by both the
// fetch (scripts/fetch-commons.ts, which downloads only the chosen files) and the build (scripts/build-data.ts):
//
//   1. Items that have ended (P576, "dissolved") are left out, and so are statements with an end (P582). Where
//      more than one current item carries the code, ITEM in data-config.ts must name the one meant.
//   2. If any statement left is ranked preferred, only the preferred ones count.
//   3. If one file is left, it is the flag. If several are, CHOSEN in data-config.ts must name one of them.
//   4. None left, or no item for the code: no flag, with that reason.
//
// Two lines of data-config.ts come first: SAME_PLACE (a subdivision code that is a country's code too, such as
// FR-971 for Guadeloupe, takes the country's selection whole) and NAMED (a subdivision whose Commons file is named
// by hand: its civil flag where Wikidata gives the service flag with the arms, or a drawing at the law's proportions).

import { CHOSEN, ITEM, NAMED, SAME_PLACE } from "./data-config.ts";

interface FlagStatement {
  file: string;
  rank: "preferred" | "normal";
  start?: string;
  end?: string;
  part?: string[];
  role?: string[];
}

interface WikidataItem {
  id: string;
  label: string | null;
  ended: boolean;
  flags: FlagStatement[];
}

interface WikidataSnapshot {
  read: string;
  countries: Record<string, WikidataItem[]>;
  subdivisions: Record<string, WikidataItem[]>;
}

type Selection =
  | { code: string; file: string; item: string; rule: "only" | "preferred" | "chosen" | "named"; why?: string; others: string[] }
  | { code: string; file: null; item: string | null; reason: string };

const select = (code: string, items: readonly WikidataItem[] | undefined): Selection => {
  let current = (items ?? []).filter((item) => !item.ended);
  if (current.length > 1) {
    const named = ITEM[code];
    if (named === undefined) throw new Error(`${code} is carried by ${current.length} current Wikidata items (${current.map((item) => `${item.id} ${item.label}`).join(", ")}): name one in ITEM in scripts/data-config.ts`);
    current = current.filter((item) => item.id === named.item);
    if (current.length === 0) throw new Error(`data-config.ts names ${named.item} for ${code}, which is not one of its current items`);
  }
  if (current.length === 0) return { code, file: null, item: null, reason: "Wikidata has no current item with this code" };
  const named = NAMED[code];
  if (named !== undefined) return { code, file: named.file, item: current[0]!.id, rule: "named", why: named.why, others: [...new Set(current.flatMap((item) => item.flags.filter((flag) => flag.end === undefined).map((flag) => flag.file)))] };
  const statements = current.flatMap((item) => item.flags.filter((flag) => flag.end === undefined).map((flag) => ({ ...flag, item: item.id })));
  if (statements.length === 0) return { code, file: null, item: current[0]!.id, reason: "Wikidata gives no current flag image (P41) for this place" };
  const preferred = statements.filter((flag) => flag.rank === "preferred");
  const counted = preferred.length > 0 ? preferred : statements;
  const files = [...new Set(counted.map((flag) => flag.file))];
  const others = [...new Set(statements.map((flag) => flag.file))].filter((file) => !files.includes(file) || files.length > 1);
  const chosen = CHOSEN[code];
  if (chosen !== undefined) {
    const found = counted.find((flag) => flag.file === chosen.file);
    if (found === undefined) throw new Error(`data-config.ts chooses ${chosen.file} for ${code}, which is not one of its flag statements: ${files.join(", ")}`);

    return { code, file: chosen.file, item: found.item, rule: "chosen", why: chosen.why, others: others.filter((file) => file !== chosen.file) };
  }
  if (files.length > 1) throw new Error(`${code} has ${files.length} current flag images on Wikidata (${files.join(", ")}): name one in CHOSEN in scripts/data-config.ts`);
  const only = counted[0]!;

  return { code, file: only.file, item: only.item, rule: preferred.length > 0 && statements.length > 1 ? "preferred" : "only", others: others.filter((file) => file !== only.file) };
};

/**
 * One place's selection from the whole snapshot: a country by its code, a subdivision by its own, and a code in
 * SAME_PLACE by the country it is the same place as (the selection keeps the subdivision's code).
 */
const selectPlace = (code: string, snapshot: Pick<WikidataSnapshot, "countries" | "subdivisions">): Selection => {
  const same = SAME_PLACE[code];
  if (same !== undefined) return { ...select(same, snapshot.countries[same]), code };

  return select(code, (code.includes("-") ? snapshot.subdivisions : snapshot.countries)[code]);
};

export { select, selectPlace };
export type { FlagStatement, Selection, WikidataItem, WikidataSnapshot };
