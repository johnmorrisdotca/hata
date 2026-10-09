// The documents and the demo, held to the source. Plain JavaScript, so that `pnpm docs:make` (scripts/docs.mjs)
// can run this file with leave to write docs/strings-ja.md.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import process from "node:process";

import { describe, expect, it } from "vitest";

import { WORDS } from "../demo/words.js";
import { REVIEWED } from "../scripts/data-config.ts";
import * as main from "./index.ts";
import * as element from "./element.ts";
import * as load from "./load.ts";
import * as manifest from "./manifest.ts";
import * as names from "./names.ts";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const readme = readFileSync("README.md", "utf8");

// A README section's text, from its heading to the next heading of the same level.
const section = (heading, level = "##") => {
  const from = readme.indexOf(`\n${level} ${heading}\n`);
  if (from < 0) throw new Error(`no "${level} ${heading}" in the README`);
  const next = readme.indexOf(`\n${level} `, from + 5);
  return readme.slice(from, next < 0 ? undefined : next);
};

describe("the README", () => {
  it("names every entry package.json exports", () => {
    const exported = Object.keys(pkg.exports).filter((key) => key !== "." && key !== "./package.json").map((key) => `${pkg.name}/${key.slice(2).replace("*", "<code>")}`.replace("/svg/<code>", "/svg/<code>.svg"));
    for (const entry of exported) expect(readme, entry).toContain(`\`${entry}\``);
  });

  it("names in its API table every runtime export of every entry", () => {
    const table = section("API");
    const rowOf = (entry) => table.split("\n").find((line) => line.startsWith(`| \`${entry}\``)) ?? "";
    for (const [entry, module] of [[pkg.name, main], [`${pkg.name}/load`, load], [`${pkg.name}/manifest`, manifest], [`${pkg.name}/names`, names], [`${pkg.name}/element`, element]]) {
      const row = rowOf(entry);
      for (const name of Object.keys(module)) expect(row, `${name} is not in the API table's row for ${entry}`).toContain(`\`${name}\``);
    }
  });

  it("names in its Architecture tree every hand-written source file, and nothing that is not one", () => {
    const tree = section("Architecture");
    const named = [...tree.matchAll(/[├└]── ([\w.-]+\.ts)\b/g)].map((match) => match[1]).sort();
    const files = readdirSync("src").filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts")).sort();
    expect(named).toEqual(files);
  });

  it("gives the counts the data gives", () => {
    const count = (prefix) => main.FLAG_CODES.filter((code) => (prefix === "" ? code.length === 2 : code.startsWith(prefix))).length;
    expect(readme).toContain(`${main.FLAG_CODES.length} flags`);
    expect(readme).toContain(`${count("")} of the 250 countries`);
    expect(readme).toContain(`${count("JP-")} of Japan's 47 prefectures`);
    expect(readme).toContain(`${count("CA-")} of Canada's 13 provinces and territories`);
    expect(readme).toContain(`${count("US-")} of the United States' 57`);
    for (const [prefix, words] of [["AU-", "of Australia's 8"], ["GB-", "of the United Kingdom's 4"], ["DE-", "of Germany's 16"], ["FR-", "of France's 26"], ["CH-", "of Switzerland's 26"], ["AT-", "of Austria's 9"], ["BR-", "of Brazil's 27"]]) expect(readme).toContain(`${count(prefix)} ${words}`);
    expect(readme).toContain(`${manifest.LEFT_OUT.length} codes`);
  });

  it("pins a CDN address to this package's major version", () => {
    const major = pkg.version.split(".")[0];
    for (const pin of readme.split(`${pkg.name}@`).slice(1).map((rest) => /^\d+/.exec(rest)?.[0]).filter(Boolean)) expect(pin).toBe(major);
  });

  it("says the Japanese has not been reviewed by a native reader, and links the way to correct it", () => {
    expect(readme).toContain("not yet reviewed by a native reader");
    expect(readme).toContain("issues/new?template=fix-a-translation.md");
  });

  it("gives every picture alt text and a dark twin that exists", () => {
    const pictures = [...readme.matchAll(/<img src="https:\/\/raw\.githubusercontent\.com\/johnmorrisdotca\/hata\/main\/(docs\/images\/[\w-]+\.webp)" alt="([^"]*)"/g)];
    expect(pictures.length).toBeGreaterThan(0);
    for (const [, file, alt] of pictures) {
      expect(alt.length, file).toBeGreaterThan(40);
      expect(existsSync(file), file).toBe(true);
      expect(existsSync(file.replace("-light.", "-dark.")), file).toBe(true);
    }
  });
});

describe("the other documents", () => {
  it("say the version package.json says, and keep Unreleased in the changelog above a dated version", () => {
    expect(main.VERSION).toBe(pkg.version);
    const log = readFileSync("CHANGELOG.md", "utf8");
    expect(log).toContain("\n## [Unreleased]\n");
    expect(log).toMatch(new RegExp(`\\n## \\[${pkg.version.replace(/\./g, "\\.")}\\] - \\d{4}-\\d{2}-\\d{2}\\n`));
  });

  it("keep SECURITY.md and CODE_OF_CONDUCT.md equal to the family's master text, and CONTRIBUTING.md starting with it", () => {
    for (const file of ["SECURITY.md", "CODE_OF_CONDUCT.md"]) expect(readFileSync(file, "utf8"), file).toBe(readFileSync(`scripts/community/${file}`, "utf8"));
    const master = readFileSync("scripts/community/CONTRIBUTING.md", "utf8");
    expect(readFileSync("CONTRIBUTING.md", "utf8").startsWith(`${master}\n## Particular to Hata\n`)).toBe(true);
  });

  it("have the files a visitor looks for", () => {
    for (const file of [".github/ISSUE_TEMPLATE/report-a-bug.md", ".github/ISSUE_TEMPLATE/suggest-a-feature.md", ".github/ISSUE_TEMPLATE/fix-a-translation.md", ".github/ISSUE_TEMPLATE/add-my-project.md", ".github/pull_request_template.md", "SECURITY.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "LICENSE", "NOTICE.md", "docs/decisions.md", "docs/provenance.md", "docs/left-out.md", "docs/sizes.md", "docs/framing.md", "docs/compared.md", "data-sources/README.md"]) {
      expect(existsSync(file), file).toBe(true);
    }
  });

  it("carry in NOTICE.md the insignia note and the sets' licences, and ship it", () => {
    const notice = readFileSync("NOTICE.md", "utf8");
    expect(notice).toContain("Insignia");
    expect(notice).toContain("CC0");
    expect(notice).toContain("The MIT License");
    expect(pkg.files).toContain("NOTICE.md");
  });

  it("leave no place in docs/compared.md that nobody has looked at", () => {
    const listed = [...readFileSync("docs/compared.md", "utf8").matchAll(/^\| `([A-Z-]+)` /gm)].map((match) => match[1]);
    expect(listed.length).toBeGreaterThan(0);
    for (const code of listed) expect(REVIEWED[code], `${code} is in docs/compared.md with no line in REVIEWED`).toBeDefined();
  });
});

describe("the demo's words", () => {
  it("are in both languages, the same keys in each, with the same placeholders", () => {
    expect(Object.keys(WORDS.ja).sort()).toEqual(Object.keys(WORDS.en).sort());
    for (const key of Object.keys(WORDS.ja)) {
      expect(WORDS.ja[key], key).not.toBe("");
      const holes = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
      expect(holes(WORDS.ja[key]), key).toEqual(holes(WORDS.en[key]));
    }
  });

  it("keep docs/strings-ja.md as the demo's words, English beside Japanese (pnpm docs:make rewrites it)", () => {
    const cell = (text) => String(text).replace(/\|/g, "\\|").replace(/\n/g, " ");
    const lines = [
      "# Hata's demo words, in English and Japanese",
      "",
      "Made from `demo/words.js` by `pnpm docs:make`; a test fails if the two differ, so this list is never out of date.",
      "",
      "**The Japanese has not yet been reviewed by a native reader.** If a line reads wrongly or unnaturally, please",
      "open a *Fix a translation* issue with the string's name. `{name}` and the other braces are filled in when shown.",
      "",
      "| Name | English | Japanese |",
      "| --- | --- | --- |",
    ];
    for (const key of Object.keys(WORDS.en)) lines.push(`| \`${key}\` | ${cell(WORDS.en[key])} | ${cell(WORDS.ja[key] ?? "")} |`);
    const made = `${lines.join("\n")}\n`;
    if (process.env.UPDATE_DOCS === "1") writeFileSync("docs/strings-ja.md", made);
    expect(readFileSync("docs/strings-ja.md", "utf8")).toBe(made);
  });
});
