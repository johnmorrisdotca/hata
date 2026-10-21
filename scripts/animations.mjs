// Makes the README's moving pictures into docs/images, as animated webp: flags moving through the frames (their own proportions, 4:3, square, round), the thirteen provinces and territories of Canada passing by
// as round flags, the former countries one after another with their years, and the `<hata-flag>` element drawing a different flag as its attributes change. Each is drawn from the built demo (`site/`)
// by the package's own files (the manifest's frames, the flags' SVG, the real element), in a light and a dark twin, named like every README picture (<subject>-desk-<light|dark>.webp, each
// under 200 kB). Playwright takes one png per step and `img2webp` (libwebp's tool: `brew install webp`) joins them into a looping lossy animation; a step holds as long as its scene says.
// The page is served to the browser without a port (the way `pnpm screenshots:readme` does it), so no port is used.
//
//   node scripts/animations.mjs                 all of them (needs the demo built: `pnpm animations` builds it first)
//   ONLY=frames-live node scripts/animations.mjs one scene (frames-live, provinces, former, element), both twins
//   IMAGES_OUT=dir                              writes somewhere else than docs/images
//   QUALITY=75                                  the webp quality
//   SLOW=2                                      how many times longer than a scene says each step stays (2: half the speed, which is how the README's pictures are made)
//   FRAMES_OUT=dir                              also keeps every step as a png there, to look at
//
// `pnpm screenshots:readme` leaves these pictures alone (the hero is a still screenshot, not one of these), and the scene files are not shipped.
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = join(root, "site");
const out = process.env.IMAGES_OUT ?? join(root, "docs", "images");
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const quality = Number(process.env.QUALITY ?? 75);
const slow = Number(process.env.SLOW ?? 2);
const framesOut = process.env.FRAMES_OUT ?? null;
const MAX_BYTES = 200 * 1024;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

if (spawnSync("img2webp", ["-version"], { stdio: "ignore" }).status === null) throw new Error("img2webp is not installed: `brew install webp` (libwebp's animation tool)");
if (!existsSync(join(site, "index.html"))) throw new Error("site/ is not built: run `pnpm animations` (it builds the demo first)");
mkdirSync(out, { recursive: true });

// The former countries' years, from docs/historical.md (the table `pnpm data` writes): | `SUHH` | Soviet Union (…) | 1922 to 1991 | …
const years = Object.fromEntries(
  [...readFileSync(join(root, "docs", "historical.md"), "utf8").split("## Codes with no flag")[0].matchAll(/^\| `([A-Z]+)` \| ([^|(]+?) \([^|]*\) \| ([^|]+?) \|/gm)].map(([, code, name, span]) => [code, { name, span }]),
);

// Each scene's `setup` runs in the page (it is sent as text, so it carries what it uses) and returns the steps: `count`, `delay(i)` in milliseconds and `paint(i, box)`, which draws step i into the box.
const heroFlags = async () => {
  const { MANIFEST } = await import("/dist/manifest.js");
  const records = new Map(MANIFEST.map((record) => [record.code, record]));
  const codes = ["JP", "CA", "US", "CH", "NP", "BR", "JP-13", "DE-BY"];
  const shapes = ["flag", "4:3", "1:1", "round"];
  const labels = { flag: "Its own proportions", "4:3": "4:3", "1:1": "Square", round: "Round" };
  const H = 64, W = 84;
  /** The box a flag has in a shape: its own proportions fit in W by H, a frame is as high as H. */
  const boxOf = (code, shape) => {
    const ratio = records.get(code).width / records.get(code).height;
    if (shape === "flag") { const h = Math.min(H, W / ratio); return { w: h * ratio, h, r: 0 }; }
    return shape === "4:3" ? { w: H * 4 / 3, h: H, r: 0 } : { w: H, h: H, r: shape === "round" ? 50 : 0 };
  };
  const pictureOf = (code, shape) => {
    const record = records.get(code);
    const framing = shape === "flag" ? null : record.framings[shape];
    const drawn = framing?.method === "adapted";
    const owner = (record.sameAs ?? code).toLowerCase();
    const src = drawn ? `/dist/svg/${owner}.${shape === "4:3" ? "4x3" : "1x1"}.svg` : `/dist/svg/${code.toLowerCase()}.svg`;
    const fit = framing === null || drawn ? "cover" : framing.fit === "contain" ? "contain" : "cover";
    const at = framing && !drawn && framing.fit === "crop" ? framing.crop.at : framing?.fit === "hoist" ? "left" : "centre";
    return { src, fit, at };
  };
  // A hold on each shape, then a move to the next in six steps, the sizes and the corners eased between the two.
  const MOVE = 5;
  const steps = [];
  shapes.forEach((shape, at) => {
    steps.push({ from: shape, to: shape, t: 0, delay: 1300 });
    const next = shapes[(at + 1) % shapes.length];
    for (let i = 1; i <= MOVE; i += 1) steps.push({ from: shape, to: next, t: i / (MOVE + 1), delay: 55 });
  });
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
  const mix = (a, b, t) => a + (b - a) * ease(t);
  return {
    count: steps.length, delay: (i) => steps[i].delay,
    paint: (i, box) => {
      const { from, to, t } = steps[i];
      box.style.cssText += ";height:150px;display:grid;grid-template-rows:auto 1fr;justify-items:center;padding:12px 10px 8px;box-sizing:border-box";
      const label = t === 0 ? labels[from] : labels[t < 0.5 ? from : to];
      const cells = codes.map((code) => {
        const a = boxOf(code, from), b = boxOf(code, to);
        const p = pictureOf(code, t < 0.5 ? from : to);
        const w = mix(a.w, b.w, t), h = mix(a.h, b.h, t), r = mix(a.r, b.r, t);
        const position = { centre: "center", left: "left center", right: "right center", top: "center top", bottom: "center bottom" }[p.at] ?? "center";
        const back = p.fit === "contain" && (to === "round" || from === "round") ? "background:#e6e6e6;" : "";
        return `<div style="display:grid;grid-template-rows:${H}px auto;justify-items:center;align-items:center;gap:6px;width:${W + 8}px"><img src="${p.src}" alt="" style="display:block;width:${w}px;height:${h}px;border-radius:${r}%;object-fit:${p.fit};object-position:${position};${back}box-shadow:0 0 0 1px color-mix(in srgb, var(--ink) 20%, transparent)"><code style="font-size:12px;color:var(--muted)">${code}</code></div>`;
      }).join("");
      box.innerHTML = `<p style="margin:0 0 6px;font:700 20px var(--font);letter-spacing:-.01em">${label}</p><div style="display:flex;flex-wrap:nowrap;justify-content:center;align-content:center;width:100%">${cells.slice(0)}</div>`;
    },
  };
};

const provinces = async () => {
  const { MANIFEST } = await import("/dist/manifest.js");
  const { NAMES } = await import("/names.js");
  const records = new Map(MANIFEST.map((record) => [record.code, record]));
  // From the west to the east, then the territories: a ring passes over each in turn.
  const codes = ["CA-BC", "CA-AB", "CA-SK", "CA-MB", "CA-ON", "CA-QC", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"];
  const SIZE = 74;
  const srcOf = (code) => {
    const record = records.get(code);
    return record.framings.round.method === "adapted" ? `/dist/svg/${(record.sameAs ?? code).toLowerCase()}.1x1.svg` : `/dist/svg/${code.toLowerCase()}.svg`;
  };
  const fitOf = (code) => (records.get(code).framings.round.fit === "contain" ? "contain" : "cover");
  const cell = (code, lit) => `<div style="display:grid;justify-items:center;gap:6px;width:104px;text-align:center"><img src="${srcOf(code)}" alt="" style="display:block;width:${SIZE}px;height:${SIZE}px;border-radius:50%;object-fit:${fitOf(code)};${fitOf(code) === "contain" ? "background:#e6e6e6;" : ""}box-shadow:${lit ? "0 0 0 4px var(--accent)" : "0 0 0 1px color-mix(in srgb, var(--ink) 20%, transparent)"}"><div style="font:${lit ? 700 : 600} 12.5px/1.2 var(--font);color:${lit ? "var(--accent)" : "var(--ink)"};min-height:2.4em">${NAMES[code].en}</div></div>`;
  return {
    count: codes.length, delay: (i) => (i === codes.length - 1 ? 1400 : 520),
    paint: (i, box) => {
      box.style.cssText += ";height:290px;box-sizing:border-box;padding:14px 10px 6px;text-align:center";
      const row = (list) => `<div style="display:flex;justify-content:center;gap:4px;margin-top:8px">${list.map((code) => cell(code, code === codes[i])).join("")}</div>`;
      box.innerHTML = `<p style="margin:0;font:700 20px var(--font);letter-spacing:-.01em">Canada's ten provinces and three territories</p>${row(codes.slice(0, 7))}${row(codes.slice(7))}`;
    },
  };
};

const former = async (scheme, years) => {
  const { MANIFEST } = await import("/dist/manifest.js");
  const records = new Map(MANIFEST.map((record) => [record.code, record]));
  const codes = Object.keys(years);
  return {
    count: codes.length, delay: () => 1100,
    paint: (i, box) => {
      const code = codes[i];
      const record = records.get(code);
      const ratio = record.width / record.height;
      const h = Math.min(150, 230 / ratio);
      box.style.cssText += ";height:210px;display:flex;align-items:center;justify-content:center;gap:34px;padding:10px 30px;box-sizing:border-box";
      const dots = codes.map((_, at) => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 3px;background:${at === i ? "var(--ink)" : "color-mix(in srgb, var(--ink) 22%, transparent)"}"></span>`).join("");
      box.innerHTML = `<img src="/dist/svg/${code.toLowerCase()}.svg" alt="" style="display:block;height:${h}px;width:${h * ratio}px;box-shadow:0 0 0 1px color-mix(in srgb, var(--ink) 20%, transparent)"><div style="display:grid;gap:4px;min-width:300px"><div style="font:600 12px var(--font);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)">A country that no longer exists</div><div style="font:700 28px/1.1 var(--font);letter-spacing:-.01em">${years[code].name}</div><div style="font:600 18px var(--font);font-variant-numeric:tabular-nums">${years[code].span}</div><code style="font-size:13px;color:var(--muted)">${code}</code><div style="margin-top:8px">${dots}</div></div>`;
    },
  };
};

const element = async () => {
  await import("/dist/element-define.js");
  // The element is changed one attribute at a time: the code, then the shape and the size, as a page would.
  const steps = [
    { code: "JP", shape: "own", size: "large" }, { code: "CA-BC", shape: "own", size: "large" }, { code: "CA-BC", shape: "round", size: "large" }, { code: "DE-BY", shape: "round", size: "large" },
    { code: "DE-BY", shape: "1:1", size: "large" }, { code: "US-TX", shape: "1:1", size: "large" }, { code: "US-TX", shape: "4:3", size: "large" }, { code: "SUHH", shape: "4:3", size: "large" }, { code: "SUHH", shape: "own", size: "large" },
  ];
  const mark = (text, changed) => (changed ? `<b style="color:var(--accent);font-weight:700">${text}</b>` : text);
  return {
    count: steps.length, delay: () => 1250,
    paint: async (i, box) => {
      const now = steps[i], before = steps[(i + steps.length - 1) % steps.length];
      box.style.cssText += ";height:200px;display:flex;align-items:center;justify-content:center;gap:44px;padding:10px 30px;box-sizing:border-box";
      const codeText = `&lt;hata-flag<br>&nbsp;&nbsp;code="${mark(now.code, i > 0 && now.code !== before.code)}"<br>&nbsp;&nbsp;shape="${mark(now.shape, i > 0 && now.shape !== before.shape)}"<br>&nbsp;&nbsp;size="large"&gt;&lt;/hata-flag&gt;`;
      box.innerHTML = `<pre style="margin:0;padding:16px 20px;border-radius:12px;background:color-mix(in srgb, var(--ink) 7%, transparent);font:600 17px/1.55 var(--mono);white-space:pre">${codeText}</pre><div style="display:grid;place-items:center;width:230px;height:140px"><hata-flag code="${now.code}" shape="${now.shape}" size="${now.size}" loading="eager" border></hata-flag></div>`;
      const el = box.querySelector("hata-flag");
      for (let wait = 0; wait < 60 && !el.querySelector("img, svg"); wait += 1) await new Promise((done) => setTimeout(done, 50));
      const image = el.querySelector("img");
      if (image && !image.complete) await new Promise((done) => { image.addEventListener("load", done, { once: true }); image.addEventListener("error", done, { once: true }); });
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    },
  };
};

const SCENES = [
  { name: "frames-live", width: 760, setup: heroFlags },
  { name: "provinces", width: 760, setup: provinces },
  { name: "former", width: 760, setup: former, data: years },
  { name: "element", width: 760, setup: element },
];

const work = mkdtempSync(join(tmpdir(), "hata-animations-"));
const browser = await chromium.launch();
try {
  for (const scene of SCENES) {
    if (only && !only.includes(scene.name)) continue;
    for (const scheme of ["light", "dark"]) {
      const context = await browser.newContext({ viewport: { width: scene.width, height: 600 }, colorScheme: scheme, deviceScaleFactor: 1.25, reducedMotion: "reduce", locale: "en-US" });
      const page = await context.newPage();
      await page.route("https://hata.test/**", (route) => {
        const { pathname } = new URL(route.request().url());
        const file = join(site, pathname.endsWith("/") ? `${pathname}index.html` : pathname);
        if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
        return route.fulfill({ body: readFileSync(file), contentType: TYPES[extname(file)] ?? "application/octet-stream" });
      });
      await page.goto("https://hata.test/?lang=en&help=off");
      await page.waitForSelector('main[data-ready="true"]');
      const info = await page.evaluate(async ({ source, width, scheme, data }) => {
        const box = document.createElement("div");
        box.id = "scene";
        box.style.cssText = `width:${width}px;background:var(--surface);color:var(--ink);font-family:var(--font);margin:0`;
        document.body.replaceChildren(box);
        document.body.style.background = "var(--surface)";
        const made = await (0, eval)(`(${source})`)(scheme, data);
        globalThis.paint = async (i) => { await made.paint(i, box); await Promise.all([...box.querySelectorAll("img")].map((image) => (image.complete ? null : new Promise((done) => { image.addEventListener("load", done, { once: true }); image.addEventListener("error", done, { once: true }); })))); };
        return { count: made.count, delays: Array.from({ length: made.count }, (_, i) => made.delay(i)) };
      }, { source: scene.setup.toString(), width: scene.width, scheme, data: scene.data ?? null });
      const dir = join(work, `${scene.name}-${scheme}`);
      mkdirSync(dir);
      const args = [];
      for (let i = 0; i < info.count; i += 1) {
        await page.evaluate(async (n) => { await globalThis.paint(n); }, i);
        const file = join(dir, `${String(i).padStart(3, "0")}.png`);
        writeFileSync(file, await (await page.$("#scene")).screenshot({ type: "png", animations: "disabled" }));
        args.push("-d", String(Math.round(info.delays[i] * slow)), file);
        if (framesOut) { mkdirSync(framesOut, { recursive: true }); copyFileSync(file, join(framesOut, `${scene.name}-${scheme}-${String(i).padStart(2, "0")}.png`)); }
      }
      const target = join(out, `${scene.name}-desk-${scheme}.webp`);
      const run = spawnSync("img2webp", ["-loop", "0", "-lossy", "-q", String(quality), "-m", "6", ...args, "-o", target], { encoding: "utf8" });
      if (run.status !== 0) throw new Error(`img2webp failed: ${run.stderr}`);
      const size = statSync(target).size;
      if (size > MAX_BYTES) throw new Error(`${target} is ${size} bytes, over 200 kB: lower QUALITY or the number of steps`);
      console.log(`ok   ${scene.name}-desk-${scheme}.webp  ${Math.round(size / 1024)} kB, ${info.count} frames`);
      await context.close();
    }
  }
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}
