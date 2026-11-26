// The ship signal flags: the Code's 26 letters, 10 numeral pennants, 3 substitutes and the answering pennant, and the US Navy's 18 special pennants, with their meanings.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { signalRecords, signalFiles, signalsNoticeText } from "../scripts/draw-signals";
import { isSignalId, SIGNAL_IDS, signalAspect, signalFlag, signalId, signalInfo, signalMeaning, signalName, signalsFor } from "./signals";

const TACTICAL = ["code-answer", "corpen", "designation", "emergency", "formation", "interrogative", "negative", "preparative", "screen", "speed", "starboard", "station", "subdivision", "substitute-1", "substitute-2", "substitute-3", "substitute-4", "turn"];

describe("the ids", () => {
  it("are the Code's 40 flags in the order of its plate, then the Navy's 18, and are read loosely or exactly", () => {
    expect(SIGNAL_IDS).toHaveLength(58);
    expect(SIGNAL_IDS.slice(0, 3)).toEqual(["ics:a", "ics:b", "ics:c"]);
    expect(SIGNAL_IDS.slice(26, 36)).toEqual(["ics:0", "ics:1", "ics:2", "ics:3", "ics:4", "ics:5", "ics:6", "ics:7", "ics:8", "ics:9"]);
    expect(SIGNAL_IDS.slice(36, 40)).toEqual(["ics:sub-1", "ics:sub-2", "ics:sub-3", "ics:answer"]);
    expect(SIGNAL_IDS.slice(40)).toEqual(TACTICAL.map((slug) => `usn:${slug}`));
    expect(signalId("USN:Turn")).toBe("usn:turn");
    expect(signalId("usn:xx")).toBeNull();
    expect(isSignalId("usn:corpen")).toBe(true);
    expect(signalId(" A ")).toBe("ics:a");
    expect(signalId("ICS:7")).toBe("ics:7");
    expect(signalId("answer")).toBe("ics:answer");
    expect(signalId("ics:xx")).toBeNull();
    expect(isSignalId("ics:a")).toBe(true);
    expect(isSignalId("A")).toBe(false);
    expect(isSignalId(3)).toBe(false);
    expect(() => signalId(3 as unknown as string)).toThrow(TypeError);
  });
});

describe("the drawings", () => {
  it("are what scripts/draw-signals.ts makes, so the data file cannot drift from the geometry", () => {
    for (const [path, text] of signalFiles()) expect(readFileSync(`src/sets/${path}`, "utf8"), path).toBe(text);
    expect(signalRecords().map((one) => one.id)).toEqual([...SIGNAL_IDS]);
    const notice = readFileSync("NOTICE.md", "utf8");
    expect(notice).toBe(signalsNoticeText(notice));
  });

  it("are 6 to 5 for a letter, a tapering pennant for a figure, a triangle for a substitute", () => {
    for (const id of SIGNAL_IDS.slice(0, 26)) expect(signalAspect(id), id).toBeCloseTo(1.2, 5);
    for (const id of SIGNAL_IDS.slice(26, 36)) expect(signalAspect(id), id).toBeCloseTo(3.5, 5);
    for (const id of SIGNAL_IDS.slice(36, 39)) expect(signalAspect(id), id).toBeCloseTo(1.5, 5);
    expect(signalAspect("ics:answer")).toBe(3);
  });

  it("draw A as a white hoist third and a swallow-tailed blue fly, and Y as nine stripes", async () => {
    const alfa = (await signalFlag("ics:a")) ?? "";
    expect(alfa).toContain('fill="#ffffff" d="M0 0L240 0L240 600L0 600z"');
    expect(alfa).toContain("M240 0L720 0L480 300L720 600L240 600z");
    expect(((await signalFlag("ics:y"))?.match(/z/g) ?? []).length).toBe(1 + 5);
  });
});

describe("the names and the meanings", () => {
  it("give the Code's own words for a letter, and the Japanese beside them", async () => {
    expect(signalName("ics:a")).toBe("A: Alfa");
    expect(signalName("A", "ja-JP")).toBe("A旗（アルファ）");
    expect(signalMeaning("ics:a")).toBe("I have a diver down; keep well clear at slow speed.");
    expect(signalMeaning("o")).toBe("Man overboard.");
    expect(signalMeaning("o", "ja")).toBe("人が海に落ちました。");
    expect(signalName("ics:0")).toBe("0: Nadazero");
    for (const id of SIGNAL_IDS) {
      expect(signalName(id), id).toBeTruthy();
      expect(signalMeaning(id, "ja"), id).toMatch(/[぀-ヿ一-鿿]/);
    }
    expect(signalName("ics:xx")).toBeNull();
    expect(signalMeaning("ics:xx")).toBeNull();
    expect(signalAspect("ics:xx")).toBeNull();
    expect(await signalFlag("ics:xx")).toBeNull();
    expect(signalInfo("ics:xx")).toBeNull();
  });

  it("say where each drawing was read and that its design is the Code's own", () => {
    const info = signalInfo("ics:k");
    expect(info?.group).toBe("letter");
    expect(info?.status).toBe("official");
    expect(info?.source.kind).toBe("official");
    expect(info?.source.url).toBe("https://archive.org/details/pub-102");
    expect(info?.note.en).toMatch(/measured from the plate/);
    expect(signalInfo("ics:k")).not.toBe(signalInfo("ics:k"));
  });
});

describe("signalsFor", () => {
  it("spells a text with one flag a letter or figure and none for anything else", () => {
    expect(signalsFor("Hata 7")).toEqual(["ics:h", "ics:a", "ics:t", "ics:a", "ics:7"]);
    expect(signalsFor("旗!")).toEqual([]);
    expect(() => signalsFor(1 as unknown as string)).toThrow(TypeError);
  });
});

describe("the Navy's special pennants", () => {
  it("are a group of their own, taken from public-domain files on Commons with the author and licence kept", async () => {
    for (const slug of TACTICAL) {
      const info = signalInfo(`usn:${slug}`);
      expect(info?.group, slug).toBe("tactical");
      expect(info?.status, slug).toBe("documented");
      expect(info?.source.licence, slug).toBe("Public domain");
      expect(info?.source.author, slug).toBe("Carl Lindberg");
      expect(info?.source.file, slug).toMatch(/^SpecialSignalPennant-.+-USNSpec\.svg$/);
      expect(signalAspect(`usn:${slug}`), slug).toBeGreaterThan(0.8);
      expect(await signalFlag(`usn:${slug}`), slug).toMatch(/^<svg /);
      expect((signalMeaning(`usn:${slug}`) ?? "").length, slug).toBeGreaterThan(20);
      expect((signalMeaning(`usn:${slug}`, "ja") ?? "").length, slug).toBeGreaterThan(10);
    }
  });

  it("are named in English and Japanese, and the turn pennant says how it is used", () => {
    expect(signalName("usn:turn")).toBe("Turn pennant");
    expect(signalName("usn:turn", "ja")).toBe("回頭旗");
    expect(signalName("usn:corpen", "ja")).toBe("針路旗（コーペン）");
    expect(signalMeaning("usn:turn")).toMatch(/TURN STARBOARD 15/);
  });
});
