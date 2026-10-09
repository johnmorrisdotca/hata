// Packs the package the way it is published (`npm pack`, npm and not pnpm), installs the tarball into an empty
// project, and uses it as somebody who installed it would: every entry in `exports` imported, one flag by its own
// subpath, /load's dynamic import, an SVG file and manifest.json by their addresses, `require()` of the ESM build as
// Node 24 allows, and the types checked by TypeScript under Node's own resolution. A package whose `exports` name
// a file that is not in the tarball fails here, before it can be published. `pnpm test:package` builds first.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const windows = process.platform === "win32";
const scratch = mkdtempSync(join(tmpdir(), "hata-package-"));

// Run a command and hand back what it printed. On Windows, npm is a .cmd file, which only a shell runs.
function run(command, args, cwd, viaShell = false) {
  const shell = viaShell && windows;
  const ran = spawnSync(shell && /[\\/]/.test(command) ? `"${command}"` : command, args, { cwd, encoding: "utf8", shell, maxBuffer: 64 * 1024 * 1024 });
  if (ran.status !== 0) {
    console.error(`FAIL ${command} ${args.join(" ")}\n${ran.stdout}\n${ran.stderr}`);
    process.exit(1);
  }

  return ran.stdout;
}

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exit(1);
}

const { FLAG_CODES } = await import(new URL("../dist/index.js", import.meta.url).href);

// 1. Pack, with npm.
const packed = JSON.parse(run("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", scratch], root, true));
const tarball = join(scratch, packed[0].filename);
const inTarball = new Set(packed[0].files.map((file) => file.path));
console.log(`ok   npm pack: ${packed[0].filename}, ${packed[0].files.length} files, ${(packed[0].size / 1024 / 1024).toFixed(2)} MB packed, ${(packed[0].unpackedSize / 1024 / 1024).toFixed(2)} MB unpacked`);
const shipped = [...inTarball].filter((file) => file.startsWith("docs/") || file.startsWith("data-sources/") || file.startsWith("src/") || /\.(webp|png|jpe?g|gif)$/.test(file));
if (shipped.length > 0) fail(`the tarball holds pictures, sources, docs or data sources: ${shipped.slice(0, 5).join(", ")}`);
console.log("ok   nothing from src/, docs/ or data-sources/ and no raster picture is in the tarball");

// 2. Everything package.json points at is in the tarball; a wildcard is checked through every flag.
const targets = (entry) => (typeof entry === "string" ? [entry] : Object.values(entry).flatMap(targets));
const pointed = [pkg.main, pkg.module, pkg.types, ...Object.values(pkg.exports).flatMap(targets)].flatMap((file) => (file.includes("*") ? FLAG_CODES.map((code) => file.replace("*", file.includes("/svg/") ? `${code.toLowerCase()}.svg` : code.toLowerCase())) : [file]));
for (const file of new Set(pointed)) if (!inTarball.has(file.replace(/^\.\//, ""))) fail(`package.json points at ${file}, which is not in the tarball`);
console.log(`ok   every file package.json points at is in the tarball (${new Set(pointed).size}, every flag's module, types and SVG among them)`);
for (const named of pkg.files) {
  if (![...inTarball].some((file) => file === named || file.startsWith(`${named}/`))) fail(`package.json's files names ${named}, which is not in the tarball`);
}

// 3. Install it into an empty project.
const project = join(scratch, "project");
mkdirSync(project);
writeFileSync(join(project, "package.json"), JSON.stringify({ name: "scratch", private: true, version: "0.0.0", type: "module" }));
run("npm", ["install", "--no-audit", "--no-fund", "--silent", tarball], project, true);
console.log("ok   npm install of the tarball");

// 4. Every entry, one flag, the lookup, the files; and require() of the ESM build.
const japan = readFileSync(join(root, "dist", "svg", "jp.svg"), "utf8").trim();
writeFileSync(
  join(project, "esm.mjs"),
  `import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { FLAG_CODES, flagCode, frame, toDataUri, VERSION } from "${pkg.name}";
import japan, { svg } from "${pkg.name}/flags/jp";
import tokyo from "${pkg.name}/flags/jp-13";
import { flag } from "${pkg.name}/load";
import { manifest, MANIFEST, LEFT_OUT } from "${pkg.name}/manifest";
import json from "${pkg.name}/manifest.json" with { type: "json" };
import { flagName, flagAspect } from "${pkg.name}/names";
import { defineFlag, FLAG_ELEMENT_NAME } from "${pkg.name}/element";
import "${pkg.name}/element/define";
import canadaSquare from "${pkg.name}/flags/ca.1x1";
const wanted = ${JSON.stringify(japan)};
if (VERSION !== ${JSON.stringify(pkg.version)}) throw new Error("VERSION is " + VERSION);
if (japan !== wanted || svg !== wanted) throw new Error("flags/jp is not the built SVG");
if (FLAG_CODES.length !== ${FLAG_CODES.length} || flagCode("jp-13") !== "JP-13") throw new Error("the codes are wrong");
if ((await flag("JP-13")) !== tokyo || (await flag("XX")) !== null) throw new Error("/load answered wrongly");
if (!frame(japan, { shape: "round" }).includes("clipPath") || !toDataUri(japan).startsWith("data:image/svg+xml,")) throw new Error("the helpers answered wrongly");
if (flagName("JP-13", "ja") !== "東京都" || flagAspect("CA") !== 2) throw new Error("/names answered wrongly");
if (FLAG_ELEMENT_NAME !== "hata-flag" || typeof defineFlag !== "function") throw new Error("/element is wrong");
if ((await flag("CA", { shape: "1:1" })) !== canadaSquare) throw new Error("/load did not use the square drawn for Canada");
if (manifest("JP")?.code !== "JP" || MANIFEST.length !== FLAG_CODES.length || json.flags.length !== MANIFEST.length || json.leftOut.length !== LEFT_OUT.length) throw new Error("the manifest is wrong");
const file = readFileSync(createRequire(import.meta.url).resolve("${pkg.name}/svg/jp.svg"), "utf8").trim();
if (file !== wanted) throw new Error("svg/jp.svg is not the module's SVG");
const required = createRequire(import.meta.url)("${pkg.name}/flags/jp");
if (required.default !== wanted) throw new Error("require() of flags/jp gave " + typeof required.default);
console.log("every entry, flags/jp, flags/ca.1x1, /load, /names, /element, svg/jp.svg, manifest.json and require()");
`,
);
console.log(`ok   ${run(process.execPath, ["esm.mjs"], project).trim()}`);

// 5. The types, as TypeScript finds them through `exports` under Node's resolution.
writeFileSync(
  join(project, "types.mts"),
  `import { FLAG_CODES, flagCode, flagUrl, frame, type FlagCode, type FrameOptions } from "${pkg.name}";
import japan from "${pkg.name}/flags/jp";
import { flag, flagDataUri } from "${pkg.name}/load";
import { manifest, type FlagRecord, type Framing } from "${pkg.name}/manifest";
import { flagName } from "${pkg.name}/names";
import { defineFlag, type HataFlagElement } from "${pkg.name}/element";

const code: FlagCode | null = flagCode("jp");
const first: FlagCode = FLAG_CODES[0];
const options: FrameOptions = { shape: "round", fit: "contain", label: "Japan" };
const framed: string | null = frame(japan, options);
const url: string | null = flagUrl("JP");
const later: Promise<string | null> = flag("JP-13");
const uri: Promise<string | null> = flagDataUri("JP");
const record: FlagRecord | null = manifest("JP");
const square: Framing | undefined = record?.framings["1:1"];
const name: string | null = flagName("JP", "ja");
const define: (name?: string) => void = defineFlag;
type Element = HataFlagElement;
export { code, define, first, framed, later, name, record, square, uri, url };
export type { Element };
`,
);
writeFileSync(join(project, "tsconfig.json"), JSON.stringify({ compilerOptions: { module: "nodenext", moduleResolution: "nodenext", target: "es2022", lib: ["es2022", "dom"], strict: true, noEmit: true, types: [], skipLibCheck: false }, files: ["types.mts"] }));
run(process.execPath, [join(root, "node_modules", "typescript", "bin", "tsc"), "-p", project], project);
console.log("ok   types: every entry resolves and checks under nodenext");

rmSync(scratch, { recursive: true, force: true });
console.log("the package installs and runs as published, on", process.platform, process.version);
