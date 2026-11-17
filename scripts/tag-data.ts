// The tags of each flag as the package ships them: what scripts/tags.mjs measured (scripts/tags.data.json), what
// Wikidata says each flag depicts and what Commons files each drawing under (data-sources/flag-tags-<day>.json,
// taken by scripts/fetch-tags.ts), and what a person found (TAG_REVIEWS), put through the tables of
// scripts/tag-config.ts. scripts/build-data.ts reads this for the manifest's `tags`, src/data/tags.data.ts and
// docs/tags.md; no flag's tags are typed by hand.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { readManifest, readSource, ROOT } from "./sources.ts";
import { CATEGORY_DESCRIBES, CATEGORY_TAGS, EMBLEM_COLOURS, FLAG_TAGS, TAG_REVIEWS, TAG_SOURCES, WIKIDATA_TAGS } from "./tag-config.ts";
import type { FlagTag, TagSource } from "./tag-config.ts";

type Bands = [hex: string, share: number][];
interface Measured {
  across: Bands | null;
  down: Bands | null;
  edgesAcross: Bands | null;
  edgesDown: Bands | null;
  text: boolean;
}
interface Snapshot {
  read: string;
  wikidata: { flags: Record<string, { flag: string; depicts: [id: string, label: string][] }[]>; kinds: Record<string, string[]>; labels: Record<string, string> };
  commons: { categories: Record<string, string[]> };
}
interface TagRecord {
  tag: FlagTag;
  source: TagSource;
  from: string;
}

const MEASURED = JSON.parse(readFileSync(join(ROOT, "scripts", "tags.data.json"), "utf8")) as Record<string, Measured>;
const sources = readManifest();
const snapshotFile = sources.files.find((file) => /^flag-tags-\d{4}-\d{2}-\d{2}\.json$/.test(file.path));
if (snapshotFile === undefined) throw new Error("data-sources/sources.json names no flag-tags snapshot: run pnpm data:tags:fetch");
const SNAPSHOT = JSON.parse(readSource(sources, snapshotFile.path).text) as Snapshot;

const TAG_IDS: readonly FlagTag[] = FLAG_TAGS.map((one) => one.id);
const number = (count: number): string => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][count] ?? String(count);

/** What Wikidata's flag item of a place says it depicts, as tags; none where the place has no one flag item. */
const fromWikidata = (item: string | null): TagRecord[] => {
  const flags = item === null ? [] : SNAPSHOT.wikidata.flags[item] ?? [];
  // A place with two flag items (a state flag and a civil one, say) does not say which one is drawn here.
  if (flags.length !== 1) return [];
  const found: TagRecord[] = [];
  for (const [thing, label] of flags[0]!.depicts) {
    const said = `${flags[0]!.flag} depicts ${label === "" ? thing : `${label} (${thing})`}`;
    const named = WIKIDATA_TAGS[thing];
    if (named !== undefined) {
      for (const tag of named.tags) found.push({ tag, source: "wikidata", from: said });
      continue;
    }
    for (const kind of SNAPSHOT.wikidata.kinds[thing] ?? []) {
      const of = WIKIDATA_TAGS[kind];
      if (of?.kinds !== true) continue;
      for (const tag of of.tags) found.push({ tag, source: "wikidata", from: `${said}, a kind of ${of.label} (${kind})` });
    }
  }

  return found;
};

/** What the categories of the drawing's Commons file suggest. */
const fromCommons = (file: string): TagRecord[] =>
  (SNAPSHOT.commons.categories[file] ?? [])
    .filter((category) => CATEGORY_DESCRIBES.test(category))
    .flatMap((category) => CATEGORY_TAGS.filter((rule) => rule.pattern.test(category)).flatMap((rule) => rule.tags.map((tag) => ({ tag, source: "unreviewed" as const, from: `Commons category "${category}"` }))));

/** What the drawing's own geometry gives: for certain where the whole flag is bands, as a guess where its edges are. */
const fromMeasure = (measured: Measured, colours: number): TagRecord[] => {
  const found: TagRecord[] = [];
  const whole = (bands: Bands | null, tag: FlagTag, way: string): void => {
    if (bands === null) return;
    if (bands.length === 1) found.push({ tag: "plain", source: "computed", from: "the whole flag is one colour" });
    else {
      found.push({ tag, source: "computed", from: `the whole flag is ${number(bands.length)} bands ${way}` });
      found.push({ tag: "plain", source: "computed", from: `the whole flag is ${number(bands.length)} bands ${way}, with nothing on them` });
    }
  };
  whole(measured.across, "stripes-horizontal", "across");
  whole(measured.down, "stripes-vertical", "down");
  if (measured.text) found.push({ tag: "text", source: "computed", from: "the drawing has a text element" });
  const across = measured.across === null && (measured.edgesAcross?.length ?? 0) > 1 ? measured.edgesAcross! : null;
  const down = measured.down === null && (measured.edgesDown?.length ?? 0) > 1 ? measured.edgesDown! : null;
  if (across !== null && down !== null) found.push({ tag: "cross", source: "unreviewed", from: "a band across and a band down, each the same at both edges" });
  else if (across !== null) found.push({ tag: "stripes-horizontal", source: "unreviewed", from: `the same ${number(across.length)} bands at the hoist and at the fly` });
  else if (down !== null) found.push({ tag: "stripes-vertical", source: "unreviewed", from: `the same ${number(down.length)} bands at the top and at the bottom` });
  if (colours >= EMBLEM_COLOURS) found.push({ tag: "emblem", source: "unreviewed", from: `${colours} colours, as a seal or a coat of arms has` });

  return found;
};

/**
 * The tags of a picture ("CA", "AF--de-facto"), in the order of FLAG_TAGS, each once with the most trusted source
 * that gives it; undefined where the picture is not measured yet. `item` is the place's Wikidata item (null for a
 * variant, whose flag item is not known), `file` the Commons file it is drawn from, `colours` how many it has.
 */
const tagsOfPicture = (key: string, about: { item: string | null; file: string; colours: number }): TagRecord[] | undefined => {
  const measured = MEASURED[key];
  if (measured === undefined) return undefined;
  const all = [...fromMeasure(measured, about.colours), ...fromWikidata(about.item), ...fromCommons(about.file)];
  const reviews = TAG_REVIEWS[key] ?? {};
  for (const tag of Object.keys(reviews) as FlagTag[]) if (!TAG_IDS.includes(tag)) throw new Error(`TAG_REVIEWS ${key}: ${tag} is not a tag of FLAG_TAGS`);
  const found: TagRecord[] = [];
  for (const tag of TAG_IDS) {
    if (reviews[tag] === "yes") {
      found.push({ tag, source: "reviewed", from: "a person looked at the flag (TAG_REVIEWS)" });
      continue;
    }
    const best = all.filter((one) => one.tag === tag).sort((a, b) => TAG_SOURCES.indexOf(a.source) - TAG_SOURCES.indexOf(b.source))[0];
    // A person's "no" takes away what Wikidata or a guess said; what is measured for certain stays.
    if (best !== undefined && !(reviews[tag] === "no" && best.source !== "computed")) found.push(best);
  }

  return found;
};

/**
 * src/data/tags.data.ts: every code and every "<code>--<variant>" with its tags, or with the key whose picture (and
 * so whose tags) it has. `rows` is [key, the picture's key, its tags], in the order to write them.
 */
const tagsDataFile = (header: string, rows: readonly (readonly [key: string, picture: string, tags: readonly TagRecord[]])[]): string => `${header}
// Every flag's tags, made by scripts/tag-data.ts from the measure (pnpm data:tags), Wikidata and Commons
// (pnpm data:tags:fetch, read ${SNAPSHOT.read}) and the reviews in scripts/tag-config.ts: by code, and by "<code>--<id>"
// for a variant. A tag is [its place in TAG_NAMES, its source's place in TAG_SOURCES]; a key whose picture is
// another's has that key instead of a list.

import type { TagName, TagSource } from "../manifest.types";

const TAG_NAMES = ${JSON.stringify(TAG_IDS)} as const satisfies readonly TagName[];

const TAG_SOURCES = ${JSON.stringify(TAG_SOURCES)} as const satisfies readonly TagSource[];

const TAGS: Readonly<Record<string, string | readonly (readonly [tag: number, source: number])[]>> = {
${rows.map(([key, picture, tags]) => (key !== picture ? `  ${JSON.stringify(key)}: ${JSON.stringify(picture)},` : `  ${JSON.stringify(key)}: [${tags.map((one) => `[${TAG_IDS.indexOf(one.tag)},${TAG_SOURCES.indexOf(one.source)}]`).join(",")}],`)).join("\n")}
};

export { TAG_NAMES, TAG_SOURCES, TAGS };
`;

/** docs/tags.md: the list of tags, and every picture's tags with the source of each and what it rests on. */
const tagsDoc = (rows: readonly (readonly [key: string, name: string, tags: readonly TagRecord[]])[]): string => {
  const cell = (text: string): string => text.replace(/\|/g, "\\|");
  const counts = TAG_IDS.map((tag) => [tag, TAG_SOURCES.map((source) => rows.filter(([, , tags]) => tags.some((one) => one.tag === tag && one.source === source)).length)] as const);

  return `# What is on each flag

Made by \`pnpm data\` (scripts/tag-data.ts); do not edit it by hand. Every flag and every variant with a drawing of
its own has tags from a closed list, and each tag says where it comes from:

- \`computed\`: measured from the drawing by a rule with no judgement in it (\`pnpm data:tags\`): the whole flag is
  bands across or down, or one colour.
- \`wikidata\`: the flag's Wikidata item says it depicts (P180) a thing of that kind (read ${SNAPSHOT.read}, CC0).
- \`unreviewed\`: an automated guess that nobody has checked: a category of the drawing's file on Wikimedia Commons,
  the same bands at both edges of the flag, or a great many colours.
- \`reviewed\`: a person looked at the flag and said so (\`TAG_REVIEWS\` in scripts/tag-config.ts).

Nothing automated passes as checked: a tag is \`reviewed\` only when a person has put it in \`TAG_REVIEWS\`, which
can also take a wrong tag away. To review a flag, look at it, add a line for it there, and run \`pnpm data\`.

## The tags

| Tag | When it applies | Flags | Reviewed | Computed | Wikidata | Unreviewed |
| --- | --- | --- | --- | --- | --- | --- |
${FLAG_TAGS.map((one, at) => `| \`${one.id}\` | ${cell(one.what)} | ${counts[at]![1].reduce((sum, count) => sum + count, 0)} | ${counts[at]![1].join(" | ")} |`).join("\n")}

## Every flag

${rows.filter(([, , tags]) => tags.length === 0).length} of the ${rows.length} pictures have no tag yet.

| Code | Flag | Tags, each with its source and what it rests on |
| --- | --- | --- |
${rows.map(([key, name, tags]) => `| \`${key}\` | ${cell(name)} | ${tags.map((one) => `\`${one.tag}\` (${one.source}: ${cell(one.from)})`).join("; ")} |`).join("\n")}
`;
};

export { tagsDataFile, tagsDoc, tagsOfPicture };
export type { TagRecord };
