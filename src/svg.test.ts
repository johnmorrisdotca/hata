// The helpers on a flag's SVG string: its aspect ratio, frames that never stretch it, and data: URIs.
import { describe, expect, it } from "vitest";

import { aspectOf, frame, toDataUri } from "./svg";

const japan = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><path fill="#fff" d="M0 0h900v600H0z"/><circle cx="450" cy="300" r="180" fill="#bc002d"/></svg>';
const canada = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500"><path fill="#d52b1e" d="M0 0h1000v500H0z"/></svg>';

describe("aspectOf", () => {
  it("reads width over height from the viewBox", () => {
    expect(aspectOf(japan)).toBe(1.5);
    expect(aspectOf(canada)).toBe(2);
    expect(aspectOf('<svg viewBox="-10 -5 19,10"></svg>')).toBe(1.9);
  });

  it("answers null for a string that is not an SVG with a usable viewBox", () => {
    expect(aspectOf("")).toBeNull();
    expect(aspectOf("<div></div>")).toBeNull();
    expect(aspectOf('<svg width="10" height="5"></svg>')).toBeNull();
    expect(aspectOf('<svg viewBox="0 0 0 5"></svg>')).toBeNull();
    expect(aspectOf('<svg viewBox="0 0 a b"></svg>')).toBeNull();
  });

  it("throws only for an argument that is not a string", () => {
    expect(() => aspectOf(42 as unknown as string)).toThrow(TypeError);
    expect(() => aspectOf(null as unknown as string)).toThrow(TypeError);
  });
});

describe("frame", () => {
  it("hands the flag back as it was at its own shape, with nothing asked", () => {
    expect(frame(japan)).toBe(japan);
    expect(frame(japan, { shape: "flag" })).toBe(japan);
  });

  it("frames at 4:3 and 1:1 by nesting the whole flag, cropped from the centre or shown whole, never stretched", () => {
    const four = frame(canada, { shape: "4:3", fit: "cover" })!;
    expect(four).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 640 480">/);
    expect(four).toContain('viewBox="0 0 1000 500" x="0" y="0" width="640" height="480" preserveAspectRatio="xMidYMid slice"');
    expect(aspectOf(four)).toBeCloseTo(4 / 3);
    const square = frame(canada, { shape: "1:1", fit: "contain" })!;
    expect(square).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(aspectOf(square)).toBe(1);
    expect(square).not.toContain('preserveAspectRatio="none"');
    expect(frame(canada, { shape: "1:1", fit: "hoist" })).toContain('preserveAspectRatio="xMinYMid slice"');
  });

  it("shows a picture that names no flag of this package whole by default, since nothing was measured for it", () => {
    expect(frame(canada, { shape: "4:3" })).toBe(frame(canada, { shape: "4:3", fit: "contain" }));
    expect(frame(japan, { shape: "round" })).toBe(frame(japan, { shape: "round", fit: "contain" }));
  });

  it("puts the whole flag on a neutral disc in a round frame, its corners touching the circle", () => {
    const round = frame(canada, { shape: "round", fit: "contain" })!;
    expect(round).toContain('<circle cx="256" cy="256" r="256" fill="#e6e6e6"/>');
    // 2:1 inside a circle of radius 256: half-diagonal 256, so 457.95 by 228.97, centred.
    expect(round).toContain('x="27.03" y="141.51" width="457.95" height="228.97" preserveAspectRatio="xMidYMid meet"');
  });

  it("frames round with a clip path of its own, the same id for the same flag and another for another", () => {
    const one = frame(japan, { shape: "round", fit: "cover" })!;
    expect(one).toMatch(/<clipPath id="(hata-round-[a-z0-9]+)"><circle cx="256" cy="256" r="256"\/><\/clipPath>/);
    const id = /clipPath id="([^"]+)"/.exec(one)![1];
    expect(one).toContain(`clip-path="url(#${id})"`);
    expect(frame(japan, { shape: "round", fit: "cover" })).toBe(one);
    expect(frame(canada, { shape: "round", fit: "cover" })).not.toContain(id);
    expect(frame(japan, { shape: "round", fit: "contain" })).not.toContain(id);
  });

  it("labels it for assistive technology, escaped", () => {
    const labelled = frame(japan, { label: 'Japan <"日本">' })!;
    expect(labelled).toMatch(/^<svg [^>]* role="img" aria-label="Japan &lt;&quot;日本&quot;&gt;"><title>Japan &lt;&quot;日本&quot;&gt;<\/title>/);
    expect(frame(japan, { shape: "round", label: "Japan" })).toMatch(/^<svg [^>]*role="img" aria-label="Japan"><title>Japan<\/title>/);
  });

  it("answers null for a string that is not an SVG with a viewBox, and throws for misuse", () => {
    expect(frame("nothing", { shape: "round" })).toBeNull();
    expect(() => frame(japan, { shape: "oval" as "round" })).toThrow(TypeError);
    expect(() => frame(japan, { fit: "fill" as "cover" })).toThrow(TypeError);
    expect(() => frame(japan, { label: 3 as unknown as string })).toThrow(TypeError);
    expect(() => frame(japan, null as unknown as object)).toThrow(TypeError);
    expect(() => frame(undefined as unknown as string)).toThrow(TypeError);
  });
});

describe("toDataUri", () => {
  it("escapes only what a data: URI must, and decodes back to the same SVG", () => {
    const uri = toDataUri(japan)!;
    expect(uri.startsWith("data:image/svg+xml,%3Csvg ")).toBe(true);
    expect(uri).not.toMatch(/[<>"#]/);
    expect(decodeURIComponent(uri.slice("data:image/svg+xml,".length))).toBe(japan);
    const tricky = `<svg viewBox="0 0 1 1"><text font-family="'A'">50% #1 東京 🗾\n</text></svg>`;
    expect(decodeURIComponent(toDataUri(tricky)!.slice(19))).toBe(tricky);
    expect(toDataUri(tricky)!.length).toBeLessThan(encodeURIComponent(tricky).length + 30);
  });

  it("answers null for a string that is not an SVG, and throws for misuse", () => {
    expect(toDataUri("<p>no</p>")).toBeNull();
    expect(() => toDataUri({} as string)).toThrow(TypeError);
  });
});
