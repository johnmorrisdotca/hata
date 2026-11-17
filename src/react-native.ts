// The entry @johnmorrisdotca/hata/react-native: a flag as a React Native component, drawn by react-native-svg's `SvgXml`, which the app hands to `createFlag` (so this
// package imports nothing from React Native, and a bundler never has to resolve it). The props are the element's that make sense in a native view.

import { createElement } from "react";
import type { ComponentType } from "react";

import { preloadFlags } from "./bind.js";
import type { FlagProps } from "./bind.js";
import { useFlag } from "./react.js";

const SIZES: Readonly<Record<string, number>> = { small: 24, medium: 48, large: 96 };

/**
 * What a native flag takes: `<hata-flag>`'s `code`, `shape`, `fit`, `label`, `lang`, `date`, `variant`, `which` and `allowRestricted`, and a `size`
 * (`small`, `medium`, `large` or a number of points, 24 by default) for its height, or a `width`.
 *
 * @example
 * ```ts
 * import type { NativeFlagProps } from "@johnmorrisdotca/hata/react-native";
 *
 * const props: NativeFlagProps = { code: "JP", size: "medium", label: "Japan" };
 * console.log(props.code);
 * ```
 */
type NativeFlagProps = Pick<FlagProps, "code" | "shape" | "fit" | "label" | "lang" | "date" | "variant" | "which" | "allowRestricted" | "size" | "width">;

/**
 * What `createFlag` needs of react-native-svg's `SvgXml`: a component that takes the SVG as `xml`, a size and an accessibility label.
 *
 * @example
 * ```ts
 * import { createElement } from "react";
 * import { createFlag, type SvgXmlLike } from "@johnmorrisdotca/hata/react-native";
 *
 * const stand: SvgXmlLike = (props) => createElement("svg", { "aria-label": props.accessibilityLabel });
 * console.log(typeof createFlag(stand)); // "function"
 * ```
 */
type SvgXmlLike = ComponentType<{ xml: string; width: number; height: number; accessibilityRole: "image"; accessibilityLabel: string }>;

/**
 * Make the native flag component from react-native-svg's `SvgXml`. The component draws the flag at the height of `size` (24 points by default) and the flag's
 * proportions, or at `width`, with the place's name as its accessibility label. Make it once, at the top of a module.
 *
 * @param SvgXml - `SvgXml` from react-native-svg.
 * @returns The component: it gives a React element, or `null` when the package has no flag for it, or it is not loaded yet in React 18 (`preloadFlags` loads it first).
 * @throws TypeError when `code` is not a string, when the component is rendered.
 *
 * @example
 * ```ts
 * import { createElement } from "react";
 * import { createFlag } from "@johnmorrisdotca/hata/react-native";
 *
 * const SvgXml = (props: { xml: string }) => createElement("svg", { dangerouslySetInnerHTML: { __html: props.xml } }); // react-native-svg's, in an app
 * const Flag = createFlag(SvgXml as never);
 * console.log(typeof Flag); // "function": <Flag code="JP" size="medium" /> in a view
 * ```
 */
const createFlag =
  (SvgXml: SvgXmlLike) =>
  (props: NativeFlagProps): ReturnType<typeof createElement> | null => {
    const found = useFlag(props);
    if (found === null) return null;
    const size = typeof props.size === "string" && Object.hasOwn(SIZES, props.size) ? SIZES[props.size]! : Number(props.size);
    const wide = Number(props.width);
    const height = Number.isFinite(wide) && wide > 0 ? wide / found.aspect : Number.isFinite(size) && size > 0 ? size : 24;

    return createElement(SvgXml, { xml: found.svg, width: height * found.aspect, height, accessibilityRole: "image", accessibilityLabel: found.name });
  };

export { createFlag, preloadFlags };
export type { NativeFlagProps, SvgXmlLike };
