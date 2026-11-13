// The check on an SVG a page hands over as a custom flag (MODULES-1244). Nothing is cleaned: the text is read by a small strict XML reader into a tree, every element and attribute
// is held to an allowlist, and, if the whole tree passes, the SVG that is drawn is written again from the tree. So what is drawn is exactly what passed, and anything else throws a
// `TypeError` that says why. No DOM, no network: pure string work, the same on a server and in a browser.

/** The most bytes (UTF-8) one custom flag's SVG may be. */
const MAX_SVG_BYTES = 64 * 1024;
/** The most elements one flag may have, counting each `<use>` as the elements of what it points to. */
const MAX_ELEMENTS = 4000;
/** The deepest the elements may nest. */
const MAX_DEPTH = 32;

const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

const ELEMENTS: ReadonlySet<string> = new Set(["svg", "g", "defs", "symbol", "path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "use", "linearGradient", "radialGradient", "stop", "clipPath", "mask", "title", "desc"]);

// How each attribute's value is read: a paint (a colour, or a local url(#id)), a reference to an id, a plain list of numbers, lengths and words, or an id.
const PAINT = new Set(["fill", "stroke", "stop-color"]);
const URL_ONLY = new Set(["clip-path", "mask"]);
const PLAIN = new Set([
  "d", "points", "transform", "viewBox", "preserveAspectRatio", "x", "y", "cx", "cy", "r", "rx", "ry", "x1", "y1", "x2", "y2", "fx", "fy", "width", "height", "offset", "opacity", "fill-opacity", "stroke-opacity", "stop-opacity",
  "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-dasharray", "stroke-dashoffset", "fill-rule", "clip-rule", "gradientUnits", "gradientTransform", "spreadMethod", "clipPathUnits", "maskUnits", "maskContentUnits",
]);

const ID = /^[A-Za-z_][A-Za-z0-9_-]{0,63}$/;
const NAME = /^[A-Za-z][A-Za-z0-9]*$/;
const ATTRIBUTE = /^[A-Za-z_][A-Za-z0-9_:-]*$/;
// Letters, digits, spaces, commas, points, signs, percent signs and brackets: enough for a path, a transform or a length, and nothing that can spell an address, a quote or a tag.
const PLAIN_VALUE = /^[A-Za-z0-9\s,.+\-%()]*$/;
const COLOUR = /^(?:none|currentcolor|transparent|[a-z]+|#[0-9a-f]{3,8}|(?:rgb|rgba|hsl|hsla)\([0-9\s.,%/-]+\))$/i;
const ENTITY = /&(?:amp|lt|gt|quot|apos);/g;

interface Node {
  name: string;
  attributes: [string, string][];
  children: (Node | string)[];
}

const refuse = (why: string): never => {
  throw new TypeError(why);
};

/** Every `url(...)` in a value, whatever its case or spacing ("URL( #a )"), each must be a local `#id`: the ids it names, in order, and the value with each written `url(#id)`. One function for every attribute that can hold one. */
const urlsIn = (value: string, where: string, write: (id: string) => string): string => {
  const written = value.replace(/url\s*\(\s*([^)]*?)\s*\)/gi, (_, target: string) => {
    const match = /^#([A-Za-z_][A-Za-z0-9_-]{0,63})$/.exec(target.trim());
    if (match === null) return refuse(`${where}: a url() may point only to a #id in the same file, not "${target.trim().slice(0, 40)}"`);
    return `url(#${write(match[1] ?? "")})`;
  });
  // A "url(" left over (a missing bracket) is not a reference this reader understands.
  if (/url\s*\(/i.test(written.replace(/url\(#[A-Za-z0-9_-]+\)/g, ""))) refuse(`${where}: a url( that is not a local #id`);

  return written;
};

/** Reads the text into a tree, or throws. Strict: quoted attributes only, no DOCTYPE, CDATA or processing instruction (but the XML declaration), no character references but the five named ones in a title or a description. */
const read = (text: string): Node => {
  let at = 0;
  const fail = (why: string): never => refuse(`the SVG is not well-formed here (offset ${at}): ${why}`);
  const root: Node = { name: "#root", attributes: [], children: [] };
  const stack: Node[] = [root];
  const top = (): Node => stack[stack.length - 1] ?? root;
  const declaration = /^\s*<\?xml\s+version="1\.[01]"(?:\s+encoding="[A-Za-z0-9-]+")?(?:\s+standalone="(?:yes|no)")?\s*\?>/.exec(text);
  if (declaration !== null) at = declaration[0].length;
  let elements = 0;
  while (at < text.length) {
    const lt = text.indexOf("<", at);
    const chunk = text.slice(at, lt < 0 ? text.length : lt);
    if (chunk !== "") {
      if (chunk.includes(">") && chunk.trim() !== "") fail("a > outside a tag");
      const parent = top();
      if (chunk.trim() !== "" || parent.name === "title" || parent.name === "desc") {
        if (parent.name !== "title" && parent.name !== "desc") fail("text outside a title or a description");
        if (/&(?!(?:amp|lt|gt|quot|apos);)/.test(chunk)) fail("a character reference (&#…;) or an unknown entity: only &amp; &lt; &gt; &quot; &apos; are read");
        parent.children.push(chunk.replace(ENTITY, (entity) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" })[entity] ?? entity));
      }
    }
    if (lt < 0) break;
    at = lt;
    if (text.startsWith("<!--", at)) {
      const end = text.indexOf("-->", at + 4);
      if (end < 0) fail("a comment that never ends");
      at = end + 3;
      continue;
    }
    if (text.startsWith("<!", at) || text.startsWith("<?", at)) fail("a DOCTYPE, CDATA section or processing instruction is not allowed");
    if (text.startsWith("</", at)) {
      const close = /^<\/([A-Za-z][A-Za-z0-9:]*)\s*>/.exec(text.slice(at, at + 80));
      if (close === null) fail("a closing tag that is not </name>");
      const open = stack.pop();
      if (stack.length === 0 || open?.name !== close?.[1]) fail(`</${close?.[1] ?? ""}> does not close <${open?.name ?? ""}>`);
      at += close?.[0].length ?? 0;
      continue;
    }
    const tag = /^<([A-Za-z][A-Za-z0-9:]*)/.exec(text.slice(at, at + 80));
    if (tag === null) fail("a < that starts no tag");
    const node: Node = { name: tag?.[1] ?? "", attributes: [], children: [] };
    at += tag?.[0].length ?? 0;
    for (;;) {
      const blank = /\s*/y;
      blank.lastIndex = at;
      blank.exec(text);
      const space = blank.lastIndex - at;
      at = blank.lastIndex;
      if (text.startsWith("/>", at) || text[at] === ">") break;
      if (space === 0 && at < text.length && node.attributes.length > 0) fail("attributes not separated by a space");
      const name = /^[^\s=/>"'<]+/.exec(text.slice(at, at + 80))?.[0];
      if (name === undefined || !ATTRIBUTE.test(name)) return fail(`an attribute name that is not allowed: ${JSON.stringify(text.slice(at, at + 20))}`);
      at += name.length;
      if (text[at] !== "=") fail(`the attribute ${name} has no value`);
      at += 1;
      const quote = text[at];
      if (quote !== '"' && quote !== "'") fail(`the value of ${name} is not quoted`);
      const end = text.indexOf(quote ?? '"', at + 1);
      if (end < 0) fail(`the value of ${name} never ends`);
      const value = text.slice(at + 1, end);
      if (node.attributes.some(([used]) => used === name)) fail(`the attribute ${name} twice`);
      node.attributes.push([name, value]);
      at = end + 1;
    }
    const selfClosing = text.startsWith("/>", at);
    at += selfClosing ? 2 : 1;
    elements += 1;
    if (elements > MAX_ELEMENTS) refuse(`more than ${MAX_ELEMENTS} elements`);
    top().children.push(node);
    if (!selfClosing) {
      stack.push(node);
      if (stack.length > MAX_DEPTH + 1) refuse(`elements nested deeper than ${MAX_DEPTH}`);
    }
  }
  if (stack.length !== 1) fail("an element that is never closed");
  const only = root.children.filter((child): child is Node => typeof child !== "string");
  if (only.length !== 1 || root.children.some((child) => typeof child === "string" && child.trim() !== "")) refuse("an SVG is exactly one <svg> element");

  return only[0] as Node;
};

/** True when the text holds a control character (a code under 32, or 127). */
const hasControl = (text: string): boolean => [...text].some((char) => (char.codePointAt(0) ?? 0) < 32 || char.codePointAt(0) === 127);

const escape = (text: string): string => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Checks an SVG a page gives as a custom flag, and writes it again as the SVG to draw: elements and attributes from an allowlist, every value read by its own rule, every reference a local `#id` that
 * is there, the ids prefixed with `custom-<slug>-`, and the size, depth and `<use>` expansion limited. It throws a `TypeError` that says what is wrong; it never returns a part-cleaned picture.
 *
 * @param svg - The page's SVG text.
 * @param slug - The flag's slug (the id without `custom:`), for the prefix of its ids and `data-hata-custom`.
 * @returns The SVG to draw, and its width over its height.
 * @throws TypeError when the SVG is too big, is not well-formed, or holds anything not allowed.
 */
const checkSvg = (svg: unknown, slug: string): { svg: string; aspect: number } => {
  if (typeof svg !== "string") return refuse("the SVG must be a string");
  if (new TextEncoder().encode(svg).length > MAX_SVG_BYTES) return refuse(`the SVG is over ${MAX_SVG_BYTES} bytes`);
  const tree = read(svg);
  if (tree.name !== "svg") refuse(`the root must be <svg>, not <${tree.name}>`);
  const prefix = `custom-${slug}-`;
  const defined = new Map<string, Node>();
  const referred: { id: string; from: string }[] = [];

  // Pass 1: the allowlist, each value, the ids.
  const walk = (node: Node, depth: number): void => {
    const where = `<${node.name}>`;
    if (!NAME.test(node.name) || !ELEMENTS.has(node.name)) refuse(`${where} is not an element a custom flag may use (not allowed: scripts, styles, images, links, animation, filters, text, foreignObject and anything with a prefix)`);
    if (depth > MAX_DEPTH) refuse(`elements nested deeper than ${MAX_DEPTH}`);
    const kept: [string, string][] = [];
    for (const [name, value] of node.attributes) {
      const here = `${where} ${name}`;
      if (hasControl(value) || value.length > MAX_SVG_BYTES) refuse(`${here}: a control character or a value too long`);
      if (value.includes("&")) refuse(`${here}: a character reference or entity in an attribute value is not allowed`);
      if (value.includes("<")) refuse(`${here}: a < in a value`);
      if (name === "xmlns") {
        if (node.name !== "svg" || value !== SVG_NS) refuse(`${here}: xmlns must be exactly ${SVG_NS}, on <svg> only`);
        continue;
      }
      if (name === "xmlns:xlink") {
        if (node.name !== "svg" || value !== XLINK_NS) refuse(`${here}: xmlns:xlink must be exactly ${XLINK_NS}, on <svg> only`);
        continue;
      }
      if (name === "id") {
        if (!ID.test(value)) refuse(`${here}: an id is a letter or underscore, then letters, digits, underscores and hyphens (${JSON.stringify(value.slice(0, 40))})`);
        if (defined.has(value)) refuse(`${here}: the id ${value} is used twice`);
        defined.set(value, node);
        kept.push(["id", prefix + value]);
        continue;
      }
      if (name === "href" || name === "xlink:href") {
        if (node.name !== "use" && node.name !== "linearGradient" && node.name !== "radialGradient") refuse(`${here}: only <use> and gradients may point to another element`);
        const match = /^#([A-Za-z_][A-Za-z0-9_-]{0,63})$/.exec(value);
        if (match === null) refuse(`${here}: a reference must be exactly a #id in the same file, not ${JSON.stringify(value.slice(0, 40))}`);
        referred.push({ id: match?.[1] ?? "", from: where });
        kept.push([name, `#${prefix}${match?.[1] ?? ""}`]);
        continue;
      }
      if (PAINT.has(name) || URL_ONLY.has(name)) {
        const written = urlsIn(value.trim(), here, (id) => {
          referred.push({ id, from: where });
          return prefix + id;
        });
        const bare = written.trim();
        const isUrl = /^url\(#[A-Za-z0-9_-]+\)(?:\s+\S.*)?$/.test(bare);
        if (URL_ONLY.has(name) ? !/^url\(#[A-Za-z0-9_-]+\)$/.test(bare) : !isUrl && !COLOUR.test(bare)) refuse(`${here}: ${JSON.stringify(value.slice(0, 40))} is not a colour or a local url(#id)`);
        if (isUrl && bare.includes(" ") && !COLOUR.test(bare.replace(/^url\(#[A-Za-z0-9_-]+\)\s+/, ""))) refuse(`${here}: the fallback after url(#id) is not a colour`);
        kept.push([name, bare]);
        continue;
      }
      if (PLAIN.has(name)) {
        if (!PLAIN_VALUE.test(value)) refuse(`${here}: ${JSON.stringify(value.slice(0, 40))} holds a character a number, length or path never needs`);
        if (/url\s*\(/i.test(value)) refuse(`${here}: a url( in a value that is not a paint or a reference`);
        kept.push([name, value]);
        continue;
      }
      refuse(`${here}: this attribute is not allowed (no style, class, event handler, prefixed attribute or anything not on the list)`);
    }
    node.attributes = kept;
    for (const child of node.children) if (typeof child !== "string") walk(child, depth + 1);
  };
  walk(tree, 1);

  // The root: a viewBox, and no width or height of its own.
  const rootAttributes = new Map(tree.attributes);
  if (tree.attributes.some(([name]) => name === "width" || name === "height")) refuse("<svg> must have a viewBox and no width or height (a flag fills the box it is put in)");
  const box = (rootAttributes.get("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  if (box.length !== 4 || box.some((n) => !Number.isFinite(n)) || (box[2] ?? 0) <= 0 || (box[3] ?? 0) <= 0) refuse("<svg> needs a viewBox of four numbers with a positive width and height");

  // Pass 2: every reference is to an id in this file, and `<use>` cannot grow without limit: each counts as what it points to, and a cycle is refused.
  for (const { id, from } of referred) if (!defined.has(id)) refuse(`${from} refers to #${id}, which is not in the file (a reference may not point into the page)`);
  const size = new Map<Node, number>();
  const measure = (node: Node, path: Set<Node>): number => {
    const known = size.get(node);
    if (known !== undefined) return known;
    if (path.has(node)) return refuse("a <use> that points back to itself or to an element that holds it");
    path.add(node);
    let total = 1;
    const target = node.name === "use" ? node.attributes.find(([name]) => name === "href" || name === "xlink:href") : undefined;
    if (target !== undefined) {
      const pointed = defined.get(target[1].slice(prefix.length + 1));
      if (pointed !== undefined) total += measure(pointed, path);
    }
    for (const child of node.children) if (typeof child !== "string") total += measure(child, path);
    path.delete(node);
    if (total > MAX_ELEMENTS) refuse(`the picture expands to more than ${MAX_ELEMENTS} elements once every <use> is counted as what it points to`);
    size.set(node, total);

    return total;
  };
  measure(tree, new Set());

  const write = (node: Node): string => {
    const attributes = node.attributes.map(([name, value]) => ` ${name}="${escape(value)}"`).join("");
    if (node.children.length === 0) return `<${node.name}${attributes}/>`;

    return `<${node.name}${attributes}>${node.children.map((child) => (typeof child === "string" ? escape(child) : write(child))).join("")}</${node.name}>`;
  };
  const head = ` data-hata-custom="${slug}" xmlns="${SVG_NS}"${rootAttributes.has("xmlns:xlink") ? ` xmlns:xlink="${XLINK_NS}"` : ""}`;
  const body = tree.attributes.filter(([name]) => name !== "xmlns" && name !== "xmlns:xlink").map(([name, value]) => ` ${name}="${escape(value)}"`).join("");
  const inner = tree.children.map((child) => (typeof child === "string" ? escape(child) : write(child))).join("");

  return { svg: `<svg${head}${body}>${inner}</svg>`, aspect: (box[2] ?? 1) / (box[3] ?? 1) };
};

export { checkSvg, hasControl, MAX_DEPTH, MAX_ELEMENTS, MAX_SVG_BYTES };
