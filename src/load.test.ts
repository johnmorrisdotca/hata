// /load: a flag by its code, by dynamic import, framed when asked.
import { describe, expect, it } from "vitest";

import japan from "./flags/jp";
import tokyo from "./flags/jp-13";
import { FLAG_CODES } from "./index";
import { flag, flagDataUri } from "./load";
import { frame, toDataUri } from "./svg";

describe("flag", () => {
  it("loads the same string as the flag's own module, whatever case the code is in", async () => {
    expect(await flag("JP")).toBe(japan);
    expect(await flag("jp-13")).toBe(tokyo);
    expect(await flag(" Jp_13 ")).toBe(tokyo);
  });

  it("loads every flag there is", async () => {
    for (const code of FLAG_CODES) expect((await flag(code))?.startsWith("<svg"), code).toBe(true);
    // Every one of the 358 modules is transformed on first import, which takes longer than a test's usual five seconds.
  }, 60_000);

  it("frames it when asked, as frame() does", async () => {
    expect(await flag("JP", { shape: "round", label: "Japan" })).toBe(frame(japan, { shape: "round", label: "Japan" }));
  });

  it("answers null for a code with no flag or not a code, and throws at once for misuse", async () => {
    expect(await flag("XX")).toBeNull();
    expect(await flag("EH")).toBeNull();
    expect(await flag("")).toBeNull();
    expect(() => flag(7 as unknown as string)).toThrow(TypeError);
    expect(() => flag("JP", { shape: "star" as "round" })).toThrow(TypeError);
  });
});

describe("flagDataUri", () => {
  it("is the flag, framed when asked, as a data: URI; null for no flag", async () => {
    expect(await flagDataUri("JP")).toBe(toDataUri(japan));
    expect(await flagDataUri("jp", { shape: "1:1" })).toBe(toDataUri(frame(japan, { shape: "1:1" })!));
    expect(await flagDataUri("XX")).toBeNull();
  });
});
