// The entry @johnmorrisdotca/hata/element: <hata-flag>, a flag as a custom element, for a page with no framework
// and for one with any:
//
//     <hata-flag code="JP-13" shape="round" size="48"></hata-flag>
//
// `defineFlag()` registers it; importing @johnmorrisdotca/hata/element/define (dist/element-define.js on a CDN) does
// that by itself, which is all a script tag needs. It is drawn in the page's own document, with no shadow root, so
// the page's CSS sizes and dresses it like any inline element. Importing this file where there is no browser does
// nothing and throws nothing. The conventions are the family's, from Kyuubu's <kyuubu-cube>: the attributes are
// properties too, `lang` and `theme` as everywhere, and events named for the package.

import { flag } from "./load.js";
import { reflectAttributes } from "./reflect";
import { aspectOf, toDataUri } from "./svg";
import type { Shape } from "./svg";

/**
 * The attributes `<hata-flag>` reads. Changing any draws it afresh.
 *
 * - `code`: the flag's code, in any case ("JP", "jp-13", "CA-ON").
 * - `shape`: `own` (the default: the flag's own proportions), `4:3`, `1:1` or `round`. `flag` is the same as `own`.
 * - `size`: its height in CSS pixels (`48`). Left out, it is `1em`, the height of the text around it, and the page's
 *   CSS may set any height; the width follows from the shape.
 * - `fit`: `auto` (the default: the frame measured for that flag, or the drawing flag-icons made for the shape),
 *   `whole` (all of the flag), `crop` (a crop at the side chosen for the flag), `cover`, `hoist` or `contain`, as
 *   `frame()` takes them.
 * - `variant`: which of the place's flags in real use to draw, by its `id` from `variantsOf(code)`: Afghanistan's `de-facto`,
 *   Bavaria's `stripes`, Guadeloupe's `local`. Left out, the default; a place with no flag of its own by default
 *   (Northern Ireland: `union-flag`, `ulster-banner`) draws only when one is named.
 * - `label`: what a screen reader says. Left out, the place's name, in English or Japanese by `lang`.
 * - `lang`: `en` or `ja`, the language of the name read out. Left out, the page's language where the element is.
 * - `theme`: `auto` (the default), `light` or `dark`: the colour of the border on a light or a dark page.
 * - `border`: a hairline round the flag, so a white flag shows on a white page.
 * - `shadow`: a soft shadow under it.
 * - `loading`: `lazy` (the default: loaded when it comes near the screen) or `eager`.
 *
 * @example
 * ```ts
 * import { FLAG_ELEMENT_ATTRIBUTES } from "@johnmorrisdotca/hata/element";
 *
 * FLAG_ELEMENT_ATTRIBUTES.includes("shape"); // true
 * ```
 */
const FLAG_ELEMENT_ATTRIBUTES = ["code", "shape", "size", "fit", "variant", "label", "lang", "theme", "border", "shadow", "loading"] as const;

/**
 * The name the element is registered under.
 *
 * @example
 * ```ts
 * import { FLAG_ELEMENT_NAME } from "@johnmorrisdotca/hata/element";
 *
 * document.createElement(FLAG_ELEMENT_NAME); // <hata-flag>
 * ```
 */
const FLAG_ELEMENT_NAME = "hata-flag";

/**
 * What `<hata-flag>` adds to an ordinary element. Every attribute is also a property that writes it, as React, Vue
 * and Svelte set them; `border` and `shadow` read as booleans. `ready` settles when the picture is drawn, or
 * found to have no flag (it is then `false`).
 *
 * @example
 * ```ts
 * import "@johnmorrisdotca/hata/element/define";
 * import type { HataFlagElement } from "@johnmorrisdotca/hata/element";
 *
 * const tokyo = document.createElement("hata-flag") as HataFlagElement;
 * tokyo.code = "JP-13";
 * tokyo.size = 48;
 * document.body.append(tokyo);
 * await tokyo.ready; // true once drawn
 * ```
 */
type HataFlagElement = HTMLElement & {
  get code(): string | null;
  set code(value: string | null | undefined);
  get shape(): string | null;
  set shape(value: string | null | undefined);
  get size(): string | null;
  set size(value: string | number | null | undefined);
  get fit(): string | null;
  set fit(value: string | null | undefined);
  get variant(): string | null;
  set variant(value: string | null | undefined);
  get label(): string | null;
  set label(value: string | null | undefined);
  get theme(): string | null;
  set theme(value: string | null | undefined);
  get border(): boolean;
  set border(value: boolean | string | null | undefined);
  get shadow(): boolean;
  set shadow(value: boolean | string | null | undefined);
  get loading(): string | null;
  set loading(value: string | null | undefined);
  /** Settles when the picture is drawn (`true`) or there is no flag for the code (`false`). */
  readonly ready: Promise<boolean>;
};

/**
 * What `hata-load` and `hata-error` carry in `detail`: the code as asked, and for an error why nothing was drawn.
 *
 * @example
 * ```ts
 * import type { FlagElementEventDetail } from "@johnmorrisdotca/hata/element";
 *
 * document.addEventListener("hata-error", (event) => {
 *   const { code, reason } = (event as CustomEvent<FlagElementEventDetail>).detail;
 *   console.log(code, reason);
 * });
 * ```
 */
interface FlagElementEventDetail {
  /** The code, as the `code` attribute has it. */
  code: string;
  /** The shape it was drawn at: `own`, `4:3`, `1:1` or `round`. */
  shape: string;
  /** For `hata-error`: why nothing was drawn. */
  reason?: string;
}

const SHAPES = ["own", "4:3", "1:1", "round"] as const;
const FITS = ["auto", "whole", "crop", "cover", "hoist", "contain"] as const;
// The styles every <hata-flag> starts from, put once at the head of the document so that the page's own CSS,
// which comes after, can change any of them.
const BASE_CSS = `${FLAG_ELEMENT_NAME}{display:inline-block;height:1em;vertical-align:-0.125em;line-height:0;box-sizing:border-box;--hata-flag-border-light:rgba(0,0,0,.22);--hata-flag-border-dark:rgba(255,255,255,.32);--hata-flag-shadow:0 1px 3px rgba(0,0,0,.28)}${FLAG_ELEMENT_NAME}>img{display:block;width:100%;height:100%;-webkit-user-drag:none;user-select:none}`;
const warned = new Set<string>();
let made: CustomElementConstructor | null = null;

// The language a name is read in: the element's own lang, else the nearest one above it, else English.
const languageOf = (element: HTMLElement): "en" | "ja" => {
  const tag = element.getAttribute("lang") || element.closest("[lang]")?.getAttribute("lang") || document.documentElement.lang || "en";

  return /^ja\b/i.test(tag) ? "ja" : "en";
};

const build = (): CustomElementConstructor => {
  const element = class HataFlag extends HTMLElement {
    static observedAttributes = [...FLAG_ELEMENT_ATTRIBUTES];
    private drawing = 0;
    private watcher: IntersectionObserver | null = null;
    private settle: ((drawn: boolean) => void) | null = null;
    ready: Promise<boolean> = new Promise((resolve) => (this.settle = resolve));

    connectedCallback(): void {
      if (document.getElementById("hata-flag-style") === null) {
        const style = Object.assign(document.createElement("style"), { id: "hata-flag-style", textContent: BASE_CSS });
        document.head.prepend(style);
      }
      this.draw();
    }

    disconnectedCallback(): void {
      this.watcher?.disconnect();
      this.watcher = null;
    }

    attributeChangedCallback(): void {
      if (this.isConnected) this.draw();
    }

    private finish(drawn: boolean): void {
      this.settle?.(drawn);
      this.settle = null;
    }

    private draw(): void {
      const turn = ++this.drawing;
      this.watcher?.disconnect();
      this.watcher = null;
      if (this.settle === null) this.ready = new Promise((resolve) => (this.settle = resolve));
      const code = (this.getAttribute("code") ?? "").trim();
      const asked = (this.getAttribute("shape") ?? "own").trim();
      const shape = asked === "flag" ? "own" : (SHAPES as readonly string[]).includes(asked) ? asked : "own";
      const fitAsked = (this.getAttribute("fit") ?? "auto").trim();
      const fit = (FITS as readonly string[]).includes(fitAsked) ? (fitAsked as (typeof FITS)[number]) : "auto";
      const variant = (this.getAttribute("variant") ?? "").trim();
      const size = Number(this.getAttribute("size"));
      const on = (name: string): boolean => this.hasAttribute(name) && this.getAttribute(name) !== "false" && this.getAttribute(name) !== "0";
      this.style.height = Number.isFinite(size) && size > 0 ? `${size}px` : "";
      this.style.width = "";
      // The box is kept from the start: the shape's, or 3:2 until the flag's own proportions are read.
      this.style.aspectRatio = shape === "4:3" ? "4 / 3" : shape === "own" ? this.style.aspectRatio || "1.5" : "1";
      this.style.borderRadius = shape === "round" ? "50%" : "";
      const theme = this.getAttribute("theme");
      const dark = theme === "dark" || (theme !== "light" && typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches);
      const shadows = [on("border") ? `0 0 0 1px var(--hata-flag-border-${dark ? "dark" : "light"})` : "", on("shadow") ? "var(--hata-flag-shadow)" : ""].filter(Boolean);
      this.style.boxShadow = shadows.join(", ");
      this.setAttribute("role", "img");

      const load = async (): Promise<void> => {
        const names = await import("./names.js");
        if (turn !== this.drawing) return;
        const aspect = shape === "4:3" ? 4 / 3 : shape === "own" ? names.flagAspect(code) : 1;
        const name = names.flagName(code, languageOf(this));
        if (aspect === null || name === null) {
          this.missing(code, shape, `no flag for the code "${code}" in this version of @johnmorrisdotca/hata (its /manifest's LEFT_OUT gives the reason where Kuni knows the code)`);
          return;
        }
        this.style.aspectRatio = String(aspect);
        this.setAttribute("aria-label", this.getAttribute("label") ?? name);
        const options = { ...(shape === "own" ? {} : { shape: shape as Shape, fit }), ...(variant === "" ? {} : { variant }) };
        const svg = await flag(code, Object.keys(options).length === 0 ? undefined : options);
        if (turn !== this.drawing) return;
        // A variant is drawn at its own proportions, which are not always the place's default flag's.
        if (svg !== null && variant !== "" && shape === "own") this.style.aspectRatio = String(aspectOf(svg) ?? aspect);
        if (svg === null) {
          this.missing(code, shape, variant === "" ? `no flag for the code "${code}"` : `no variant "${variant}" of the flag for the code "${code}"`);
          return;
        }
        const image = this.querySelector(":scope > img") ?? Object.assign(document.createElement("img"), { alt: "", draggable: false, decoding: "async" });
        (image as HTMLImageElement).src = toDataUri(svg) ?? "";
        if (image.parentNode !== this) this.replaceChildren(image);
        this.removeAttribute("data-missing");
        this.dispatchEvent(new CustomEvent<FlagElementEventDetail>("hata-load", { detail: { code, shape }, bubbles: true }));
        this.finish(true);
      };
      const start = (): void => {
        load().catch((error: unknown) => this.missing(code, shape, String(error)));
      };
      // No code yet (a script may be about to set one): nothing to draw, and nothing to warn of.
      if (code === "") {
        this.missing(code, shape, "no code", true);
        return;
      }
      if (this.getAttribute("loading") !== "eager" && typeof IntersectionObserver === "function") {
        this.watcher = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            this.watcher?.disconnect();
            this.watcher = null;
            start();
          },
          { rootMargin: "200px" },
        );
        this.watcher.observe(this);
      } else start();
    }

    // Nothing to draw: the element is emptied and takes no room, says why once on the console, and tells the page.
    private missing(code: string, shape: string, reason: string, quiet = false): void {
      this.replaceChildren();
      this.removeAttribute("aria-label");
      this.removeAttribute("role");
      this.setAttribute("data-missing", "");
      this.style.width = "0px";
      if (quiet) {
        this.finish(false);
        return;
      }
      if (!warned.has(code)) {
        warned.add(code);
        console.warn(`<${FLAG_ELEMENT_NAME}>: ${reason}. Nothing is drawn.`);
      }
      this.dispatchEvent(new CustomEvent<FlagElementEventDetail>("hata-error", { detail: { code, shape, reason }, bubbles: true }));
      this.finish(false);
    }
  };
  reflectAttributes(element, FLAG_ELEMENT_ATTRIBUTES, ["border", "shadow"]);

  return element;
};

/**
 * Register `<hata-flag>`, once. Where there is no browser, or the name is already taken, it does nothing. A page
 * that wants another name passes it.
 *
 * @param name - The tag to register; `hata-flag` when left out.
 * @returns Nothing: the element is registered, or was already, or there is no browser to register it in.
 *
 * @example
 * ```ts
 * import { defineFlag } from "@johnmorrisdotca/hata/element";
 *
 * defineFlag();               // <hata-flag code="JP"></hata-flag>
 * defineFlag("my-flag");      // <my-flag code="JP"></my-flag> as well
 * ```
 */
const defineFlag = (name: string = FLAG_ELEMENT_NAME): void => {
  if (typeof customElements === "undefined" || typeof HTMLElement === "undefined") return;
  if (customElements.get(name) !== undefined) return;
  made ??= build();
  customElements.define(name, name === FLAG_ELEMENT_NAME ? made : class extends made {});
};

export { defineFlag, FLAG_ELEMENT_ATTRIBUTES, FLAG_ELEMENT_NAME };
export type { FlagElementEventDetail, HataFlagElement };
