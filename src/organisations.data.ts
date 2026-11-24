// The flags of international organisations, one record each: the only place to add one. Hand-written, not made by
// scripts/build-data.ts. Each drawing is made from the body's published description of its flag, nothing copied, and
// a body is here only where the terms for its flag or emblem say a package under the MIT licence may carry it
// (the sentence and the day it was read are in NOTICE.md and in each record's `terms`). The bodies left out, and why,
// are in NOTICE.md.
//
// A record's `id` is `org:` and a lower-case slug: the colon can be in no ISO 3166 code, so an organisation's id can
// never shadow a country's. The ids of flags a page registers itself (MODULES-1244) will use the namespace `custom:`.
// A drawing's ids and classes begin with `org-<slug>-`, so two flags in one page cannot collide.

import type { DrawnLoader } from "./drawn";
import { ORGANISATIONS_FROM_COMMONS, ORGANISATIONS_FROM_COMMONS_LOADERS } from "./organisations.commons.data";

interface OrganisationRecord {
  /** `org:` and a lower-case slug (letters, digits and hyphens). */
  id: `org:${string}`;
  /** The body's name in English and in Japanese. */
  name: { en: string; ja: string };
  /** The flag's width over its height. The drawing is a module of its own (src/sets/organisations/<slug>.ts), loaded when it is asked for. */
  aspect: number;
  /** Where the terms for the flag were read, the day, and what they say. */
  terms: { url: string; read: string; says: string };
  /** For a drawing taken from Wikimedia Commons: its file, page, licence as Commons states it and author as Commons gives it. */
  source?: { file: string; page: string; licence: string; author: string };
}

const HAND_DRAWN = [
  {
    id: "org:eu",
    name: { en: "European Union", ja: "欧州連合" },
    // 3:2. Twelve five-pointed gold stars, one point up, on a circle whose radius is a third of the height, centred on the
    // flag and spaced as the hours of a clock; each star's points lie on a circle of a eighteenth of the height.
    aspect: 1.5,
    terms: {
      url: "https://european-union.europa.eu/legal-notice_en",
      read: "2026-11-13",
      says: "Anyone may use the EU emblem or its elements without permission, if the use suggests no connection with or support from the EU institutions or the Council of Europe, is not tied to anything against their aims, and is lawful; registering it or an imitation as a trademark is not acceptable.",
    },
  },
] as const satisfies readonly OrganisationRecord[];

// The European Union is drawn for this package; the others are Commons files (organisations.commons.data.ts).
type OrganisationRecordId = "org:eu" | (typeof ORGANISATIONS_FROM_COMMONS)[number]["id"];

const ORGANISATIONS: readonly (OrganisationRecord & { id: OrganisationRecordId })[] = [...HAND_DRAWN, ...ORGANISATIONS_FROM_COMMONS];

/** One dynamic import for each drawing, so that a page downloads only the flags it shows. */
const ORGANISATION_LOADERS: Readonly<Record<string, DrawnLoader>> = { "org:eu": () => import("./sets/organisations/eu"), ...ORGANISATIONS_FROM_COMMONS_LOADERS };

export { ORGANISATIONS, ORGANISATION_LOADERS };
export type { OrganisationRecord, OrganisationRecordId };
