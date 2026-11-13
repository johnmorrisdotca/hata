// The flags of international organisations, one record each: the only place to add one. Hand-written, not made by
// scripts/build-data.ts. Each drawing is made from the body's published description of its flag, nothing copied, and
// a body is here only where the terms for its flag or emblem say a package under the MIT licence may carry it
// (the sentence and the day it was read are in NOTICE.md and in each record's `terms`). The bodies left out, and why,
// are in NOTICE.md.
//
// A record's `id` is `org:` and a lower-case slug: the colon can be in no ISO 3166 code, so an organisation's id can
// never shadow a country's. The ids of flags a page registers itself (MODULES-1244) will use the namespace `custom:`.
// A drawing's ids and classes begin with `org-<slug>-`, so two flags in one page cannot collide.

interface OrganisationRecord {
  /** `org:` and a lower-case slug (letters, digits and hyphens). */
  id: `org:${string}`;
  /** The body's name in English and in Japanese. */
  name: { en: string; ja: string };
  /** The flag, as an SVG string with a viewBox and no width or height. */
  svg: string;
  /** Where the terms for the flag were read, the day, and what they say. */
  terms: { url: string; read: string; says: string };
}

const ORGANISATIONS = [
  {
    id: "org:eu",
    name: { en: "European Union", ja: "欧州連合" },
    // 3:2. Twelve five-pointed gold stars, one point up, on a circle whose radius is a third of the height, centred on the
    // flag and spaced as the hours of a clock; each star's points lie on a circle of a eighteenth of the height.
    svg: '<svg data-hata-org="eu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><defs><path id="org-eu-star" fill="#fc0" d="M0 -33.33L7.48 -10.3L31.7 -10.3L12.11 3.93L19.59 26.97L0 12.73L-19.59 26.97L-12.11 3.93L-31.7 -10.3L-7.48 -10.3z"/></defs><path fill="#039" d="M0 0h900v600H0z"/><use href="#org-eu-star" x="450" y="100"/><use href="#org-eu-star" x="550" y="126.79"/><use href="#org-eu-star" x="623.21" y="200"/><use href="#org-eu-star" x="650" y="300"/><use href="#org-eu-star" x="623.21" y="400"/><use href="#org-eu-star" x="550" y="473.21"/><use href="#org-eu-star" x="450" y="500"/><use href="#org-eu-star" x="350" y="473.21"/><use href="#org-eu-star" x="276.79" y="400"/><use href="#org-eu-star" x="250" y="300"/><use href="#org-eu-star" x="276.79" y="200"/><use href="#org-eu-star" x="350" y="126.79"/></svg>',
    terms: {
      url: "https://european-union.europa.eu/legal-notice_en",
      read: "2026-11-13",
      says: "Anyone may use the EU emblem or its elements without permission, if the use suggests no connection with or support from the EU institutions or the Council of Europe, is not tied to anything against their aims, and is lawful; registering it or an imitation as a trademark is not acceptable.",
    },
  },
] as const satisfies readonly OrganisationRecord[];

export { ORGANISATIONS };
export type { OrganisationRecord };
