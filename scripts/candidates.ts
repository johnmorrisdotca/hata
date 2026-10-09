// The drawings of each flag this package can choose between: Wikimedia Commons' file (the one Wikidata names), and
// the same flag in three MIT-licensed flag sets on npm, pinned in package.json and installed as development
// dependencies. None is redrawn here; one is chosen (scripts/choose.mjs) and shipped as it is drawn, optimised.
//
//   - flag-icons by Panayiotis Lipiridis: 4:3 and 1:1 drawings, careful, of every country and a few regions.
//   - country-flag-icons by @catamphetamine: 3:2 and 1:1 drawings, simplified, of every country.
//   - circle-flags by HatScripts: round drawings, of every country and some subdivisions.
//
// A flag is shipped at its TRUE proportions, the ones Commons draws it at from its construction sheet, so a set's
// drawing can be chosen only where its shape is the flag's own: flag-icons' 1:1 for Switzerland, country-flag-icons'
// 3:2 for a 2:3 flag. circle-flags never can (a circle is a framing, which frame() gives any flag), and is compared
// only as a check on the design.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { ROOT } from "./sources.ts";

type SourceName = "commons" | "flag-icons" | "country-flag-icons" | "circle-flags";

interface SetSource {
  name: Exclude<SourceName, "commons">;
  version: string;
  copyright: string; // The copyright line of the set's LICENSE, as it is written there
  home: string;
  shapes: { label: string; aspect: number | null; round: boolean; path: (code: string) => string }[];
}

interface Candidate {
  source: SourceName;
  label: string; // "flag-icons 4:3", "commons"
  file: string; // Commons' file name, or the path inside the package
  page: string; // Where a person can see it: the Commons page, or the file on jsDelivr at the pinned version
  aspect: number | null; // The shape the set draws at; null for Commons, whose drawing is the flag's own
  round: boolean;
  text: string;
}

const versionOf = (name: string): string => (JSON.parse(readFileSync(join(ROOT, "node_modules", name, "package.json"), "utf8")) as { version: string }).version;
const copyrightOf = (name: string, file: string): string => {
  const line = readFileSync(join(ROOT, "node_modules", name, file), "utf8")
    .split("\n")
    .find((one) => /^Copyright/i.test(one.trim()));
  if (line === undefined) throw new Error(`no copyright line in ${name}'s ${file}`);

  return line.trim();
};

const SETS: readonly SetSource[] = [
  {
    name: "flag-icons",
    version: versionOf("flag-icons"),
    copyright: copyrightOf("flag-icons", "LICENSE"),
    home: "https://github.com/lipis/flag-icons",
    shapes: [
      { label: "4:3", aspect: 4 / 3, round: false, path: (code) => `flags/4x3/${code.toLowerCase()}.svg` },
      { label: "1:1", aspect: 1, round: false, path: (code) => `flags/1x1/${code.toLowerCase()}.svg` },
    ],
  },
  {
    name: "country-flag-icons",
    version: versionOf("country-flag-icons"),
    copyright: copyrightOf("country-flag-icons", "LICENSE"),
    home: "https://gitlab.com/catamphetamine/country-flag-icons",
    shapes: [
      // Drawn on a viewBox of 513 by 342, which is 3:2 to a thousandth.
      { label: "3:2", aspect: 3 / 2, round: false, path: (code) => `3x2/${code.toUpperCase()}.svg` },
      { label: "1:1", aspect: 1, round: false, path: (code) => `1x1/${code.toUpperCase()}.svg` },
    ],
  },
  {
    name: "circle-flags",
    version: versionOf("circle-flags"),
    copyright: copyrightOf("circle-flags", "LICENSE.md"),
    home: "https://github.com/HatScripts/circle-flags",
    shapes: [{ label: "round", aspect: 1, round: true, path: (code) => `flags/${code.toLowerCase()}.svg` }],
  },
];

/** The sets' drawings of one place's flag, those that exist. */
const setCandidates = (code: string): Candidate[] =>
  SETS.flatMap((set) =>
    set.shapes.flatMap((shape) => {
      const file = shape.path(code);
      const path = join(ROOT, "node_modules", set.name, file);
      if (!existsSync(path)) return [];
      return [{ source: set.name, label: `${set.name} ${shape.label}`, file, page: `https://cdn.jsdelivr.net/npm/${set.name}@${set.version}/${file}`, aspect: shape.aspect, round: shape.round, text: readFileSync(path, "utf8") }];
    }),
  );

/** One set's details by name, for the manifest and NOTICE.md. */
const setNamed = (name: string): SetSource => {
  const found = SETS.find((set) => set.name === name);
  if (found === undefined) throw new Error(`${name} is not one of the flag sets`);

  return found;
};

export { SETS, setCandidates, setNamed };
export type { Candidate, SetSource, SourceName };
