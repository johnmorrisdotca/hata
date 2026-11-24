// The part the sets drawn for this package share (the ship signal flags, the samurai banners, the military flags and the
// medieval banners; the organisations' flags keep their own entry). Not an entry point of the package: each entry file
// (`signals.ts`, `samurai.ts` ...) calls `drawnSet` with its prefix and its records, and wraps what it gives in documented exports.
//
// A set has its own id namespace: `<prefix>:<slug>`. The colon is in no ISO 3166 code, so no id here can shadow a country's.
// Every function is pure and works on strings: no DOM, no network, the same answer on a server and in a browser.

import { mustBeString } from "./svg";

/** Where a drawing's facts were read, and what kind of page it is. */
interface DrawnSource {
  title: string;
  url: string;
  /** `official` (a government, a standards body, a museum or an archive), `reference` (a scholarly work or a reference site) or `encyclopedia` (Wikipedia: a better page is wanted). */
  kind: "official" | "reference" | "encyclopedia";
  /** The day the page was read. */
  read: string;
  /** What the page says that this drawing relies on. */
  says: string;
  /** For a drawing taken from Wikimedia Commons: its file name, its licence as Commons states it and its author as Commons gives it. */
  file?: string;
  licence?: string;
  author?: string;
}

/** What is known of a drawing: `official` (the body's own specification), `documented` (a period or museum source shows it) or `reconstruction` (drawn from a description or a later picture). */
type DrawnStatus = "official" | "documented" | "reconstruction";

/** A drawing that is shipped for history and education and never given by default: why, and who it is for, in both languages. No law restricts it. */
interface DrawnRestriction {
  reason: string;
  reasonJa: string;
  allowedFor: string;
  allowedForJa: string;
}

interface DrawnRecord {
  id: string;
  /** Left out of every list and withheld from every call unless asked for by name with `allowRestricted: true`. */
  restricted?: DrawnRestriction;
  /** A group of the set for a menu: "letter", "numeral" ... */
  group: string;
  name: { en: string; ja: string };
  about: { en: string; ja: string };
  status: DrawnStatus;
  /** The years or days it was in use, where it has them (a banner, an ensign); null where it has none (a signal). */
  dates: { from: string | null; until: string | null } | null;
  /** What is documented and what is reconstruction, in words; empty for an official drawing. */
  note: { en: string; ja: string };
  source: DrawnSource;
  /** The drawing's width over its height, kept here so that it is known before the drawing is loaded. */
  aspect: number;
}

/** What a generator makes a record from: the record and its drawing, an SVG string with a viewBox and no width or height. The drawing is in a module of its own (`<set>/<slug>.ts`), not in the record. */
type DrawnDrawing = Omit<DrawnRecord, "aspect"> & { svg: string };

/** A module that holds one drawing: its SVG string, loaded by a dynamic import when the drawing is asked for. */
type DrawnLoader = () => Promise<{ svg: string }>;

/** A drawing's record as the set gives it, copied: the id, the group, both names, what it is, its status, its dates, the note on what is documented, its source and its aspect ratio. */
interface DrawnInfo {
  id: string;
  group: string;
  name: { en: string; ja: string };
  about: { en: string; ja: string };
  status: DrawnStatus;
  dates: { from: string | null; until: string | null } | null;
  note: { en: string; ja: string };
  source: DrawnSource;
  aspect: number;
  /** Why the drawing is withheld by default, or null. */
  restricted: DrawnRestriction | null;
}

const drawnSet = <const Records extends readonly DrawnRecord[]>(prefix: string, all: Records, loaders: Readonly<Record<string, DrawnLoader>>) => {
  // A restricted drawing is in no list and no group: only a call that names it, and asks, gives it.
  const records = all.filter((one) => one.restricted === undefined) as unknown as Records;
  const byId: ReadonlyMap<string, Records[number]> = new Map(all.map((one) => [one.id, one as Records[number]]));
  const idOf = (input: string): string | null => {
    const written = mustBeString(input, "id").trim().toLowerCase();
    const id = written.startsWith(`${prefix}:`) ? written : `${prefix}:${written}`;

    return byId.has(id) ? id : null;
  };
  const lang = (language: string, pair: { en: string; ja: string }): string => (/^ja\b/i.test(String(language)) ? pair.ja : pair.en);

  return {
    ids: records.map((one) => one.id) as readonly Records[number]["id"][],
    isId: (value: unknown): boolean => typeof value === "string" && byId.has(value) && byId.get(value)?.restricted === undefined,
    restrictedIds: all.filter((one) => one.restricted !== undefined).map((one) => one.id),
    idOf,
    flag: async (id: string, allowRestricted: boolean = false): Promise<string | null> => {
      const known = idOf(id);
      const found = known === null ? undefined : byId.get(known);
      const load = found === undefined || (found.restricted !== undefined && !allowRestricted) ? undefined : loaders[found.id];

      return load === undefined ? null : (await load()).svg;
    },
    name: (id: string, language: string): string | null => {
      const known = idOf(id);
      const found = known === null ? undefined : byId.get(known);

      return found === undefined ? null : lang(language, found.name);
    },
    about: (id: string, language: string): string | null => {
      const known = idOf(id);
      const found = known === null ? undefined : byId.get(known);

      return found === undefined ? null : lang(language, found.about);
    },
    aspect: (id: string): number | null => {
      const known = idOf(id);
      const found = known === null ? undefined : byId.get(known);

      return found === undefined ? null : found.aspect;
    },
    info: (id: string): DrawnInfo | null => {
      const known = idOf(id);
      const found = known === null ? undefined : byId.get(known);
      if (found === undefined) return null;

      return {
        id: found.id,
        group: found.group,
        name: { ...found.name },
        about: { ...found.about },
        status: found.status,
        dates: found.dates === null ? null : { ...found.dates },
        note: { ...found.note },
        source: { ...found.source },
        aspect: found.aspect,
        restricted: found.restricted === undefined ? null : { ...found.restricted },
      };
    },
    inGroup: (group: string): readonly Records[number]["id"][] => records.filter((one) => one.group === group).map((one) => one.id),
  };
};

export { drawnSet };
export type { DrawnDrawing, DrawnInfo, DrawnLoader, DrawnRecord, DrawnRestriction, DrawnSource, DrawnStatus };
