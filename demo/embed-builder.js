// An embed builder: a product's list of options in, a live preview and the exact code for the choices made out, as
// a custom element, an iframe, React, Vue, Svelte and Angular (and whatever else the product writes itself), each
// with a Copy button. Nothing here names a product or an option: the product describes itself (its package, its
// element, its embed page, the code only it can write) and its options, in the shapes below, so this one file can
// serve every package in the family unchanged. It follows Kyuubu's builder (demo/builder-code.js there): the code
// for a choice that is the default is not written, and an element attribute that is a flag is present or absent.
//
// Two halves. The pure one (`codeFor`, `allCode`, `attributesFor`, `embedAddress`, `settingsFrom`) touches no page
// and is unit-tested. The page one, `mountEmbedBuilder`, draws the controls, the preview and the tabs.
//
// A product:
//
//   {
//     name: "Hata",                                   // what the iframe's title starts with
//     package: "@johnmorrisdotca/hata",               // what a page imports
//     tag: "hata-flag",                               // the custom element
//     define: "@johnmorrisdotca/hata/element/define", // the import that registers it
//     cdn: "https://cdn.jsdelivr.net/npm/…/dist/element-define.js", // the script tag's src
//     embed: "https://…/embed.html",                  // the iframe page; the attributes are its query
//     formats: ["element", "img", "iframe", "module", "react", "vue", "svelte", "angular"],
//     frameSize(settings, context) => ({ width, height }), // the iframe's size
//     title(settings, context) => "Flag of Tokyo",    // the iframe's title
//     context(settings) => Promise<object>,           // anything the product's own writers need (optional)
//     preview(box, settings, context),                // draws the live preview into `box`
//     writers: { img: { label: { en, ja }, language, write(settings, attributes, context) } }, // its own formats
//   }
//
// An option:
//
//   { id: "shape", kind: "choice" | "number" | "boolean" | "text" | "fixed", default, attribute: "shape",
//     choices: [{ value: "round", label: { en, ja } }], min, max, step, required: false,
//     label: { en, ja }, help: { en, ja } }
//
// `fixed` is a choice the page makes for the person (the flag's code in Hata's detail panel): it is written into
// the code and not shown as a control. `required` writes an attribute even when it is the default.

/** The formats every product gets from this file, what each is called, and the language its code is in. */
export const FORMATS = {
  element: { label: { en: "Custom element", ja: "カスタム要素" }, language: "html" },
  iframe: { label: { en: "iframe", ja: "iframe" }, language: "html" },
  react: { label: { en: "React", ja: "React" }, language: "tsx" },
  vue: { label: { en: "Vue", ja: "Vue" }, language: "vue" },
  svelte: { label: { en: "Svelte", ja: "Svelte" }, language: "svelte" },
  angular: { label: { en: "Angular", ja: "Angular" }, language: "ts" },
};

/** The builder's own words; a page may pass others. */
export const BUILDER_WORDS = {
  en: { copy: "Copy", copied: "Copied.", copyFailed: "Could not copy: the code is selected, so press Ctrl+C or ⌘C.", preview: "Preview", code: "Code", options: "Options" },
  ja: { copy: "コピー", copied: "コピーしました。", copyFailed: "コピーできませんでした。コードを選択したので、Ctrl+C か ⌘C でコピーしてください。", preview: "プレビュー", code: "コード", options: "オプション" },
};

const quote = (text) => JSON.stringify(String(text));
const escapeAttribute = (text) => String(text).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

/** Whether a value is as good as not chosen: empty, or the option's default. */
function standing(option, value) {
  if (value === undefined || value === null || value === "") return true;
  if (option.default === undefined) return false;
  if (option.kind === "number") return Number(value) === Number(option.default);
  if (option.kind === "boolean") return Boolean(value) === Boolean(option.default);
  return String(value) === String(option.default);
}

/** Every option's value: the one given where it is one of the option's, else its default. */
export function settingsFrom(schema, values = {}) {
  const out = {};
  for (const option of schema) {
    const value = values[option.id];
    if (value === undefined || value === null) out[option.id] = option.default;
    else if (option.kind === "number") {
      const number = Number(value);
      out[option.id] = Number.isFinite(number) ? Math.min(option.max ?? Infinity, Math.max(option.min ?? -Infinity, number)) : option.default;
    } else if (option.kind === "boolean") out[option.id] = value === true || value === "1" || value === "true" || value === "";
    else if (option.kind === "choice") out[option.id] = option.choices.some((choice) => choice.value === value) ? value : option.default;
    else out[option.id] = String(value);
  }
  return out;
}

/** The element's attributes for the choices, in the order of the list: a flag present when on, nothing for a default. */
export function attributesFor(schema, settings) {
  const out = [];
  for (const option of schema) {
    if (option.attribute === undefined) continue;
    const value = settings[option.id];
    if (standing(option, value) && !option.required) continue;
    if (value === undefined || value === null || value === "") continue;
    if (option.kind === "boolean") {
      if (value) out.push([option.attribute, ""]);
    } else out.push([option.attribute, String(value)]);
  }
  return out;
}

/** The embed page's address for the choices: every attribute as a query parameter, a flag as `1`. */
export function embedAddress(product, schema, settings) {
  const query = attributesFor(schema, settings)
    .map(([name, value]) => `${name}=${encodeURIComponent(value === "" ? "1" : value)}`)
    .join("&");
  return `${product.embed}${query === "" ? "" : `?${query}`}`;
}

const attr = ([name, value]) => (value === "" ? ` ${name}` : ` ${name}="${escapeAttribute(value)}"`);
const tagOf = (tag, attributes, indent = "") => {
  const one = `<${tag}${attributes.map(attr).join("")}></${tag}>`;
  if (one.length + indent.length <= 80 || attributes.length < 3) return one;
  return `<${tag}\n${attributes.map((pair) => `${indent}  ${attr(pair).trim()}`).join("\n")}\n${indent}></${tag}>`;
};
const jsx = ([name, value], option) => {
  if (value === "") return name;
  return option?.kind === "number" && /^-?\d+(\.\d+)?$/.test(value) ? `${name}={${value}}` : `${name}=${quote(value)}`;
};

/**
 * The code for one format, or null where the product has no such format. `context` is what `product.context`
 * gave for these settings, for the product's own writers.
 */
export function codeFor(format, product, schema, settings, context = {}) {
  if (!product.formats.includes(format)) return null;
  const attributes = attributesFor(schema, settings);
  const optionOf = (name) => schema.find((option) => option.attribute === name);
  const own = product.writers?.[format];
  if (own !== undefined) return own.write(settings, attributes, context);
  const tag = product.tag;
  const define = `import "${product.define}";`;
  if (format === "element") return `<script type="module" src="${product.cdn}"></script>\n${tagOf(tag, attributes)}`;
  if (format === "iframe") {
    const { width, height } = product.frameSize(settings, context);
    const src = embedAddress(product, schema, settings).replaceAll("&", "&amp;");
    return `<iframe src="${src}" title="${escapeAttribute(product.title(settings, context))}" width="${width}" height="${height}" style="border:0;vertical-align:middle" loading="lazy"></iframe>`;
  }
  if (format === "react") {
    const props = attributes.map((pair) => jsx(pair, optionOf(pair[0])));
    const line = `<${tag} ${props.join(" ")} />`;
    const body = line.length > 64 ? `(\n    <${tag}\n${props.map((one) => `      ${one}`).join("\n")}\n    />\n  )` : line;
    return `// React 19 sets a custom element's properties, which write its attributes.\n${define}\n\nexport function Embed() {\n  return ${body};\n}`;
  }
  if (format === "vue") return `<script setup>\n${define}\n// In vite.config: vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("${tag.split("-")[0]}-") } } })\n</script>\n\n<template>\n  ${tagOf(tag, attributes, "  ")}\n</template>`;
  if (format === "svelte") return `<script>\n  ${define}\n</script>\n\n${tagOf(tag, attributes)}`;
  if (format === "angular") return `import { CUSTOM_ELEMENTS_SCHEMA, Component } from "@angular/core";\n${define}\n\n@Component({\n  selector: "app-embed",\n  schemas: [CUSTOM_ELEMENTS_SCHEMA],\n  template: \`${tagOf(tag, attributes, "    ")}\`,\n})\nexport class EmbedComponent {}`;
  return null;
}

/** Every format's code, by format: what the tabs show. */
export function allCode(product, schema, settings, context = {}) {
  return Object.fromEntries(product.formats.map((format) => [format, codeFor(format, product, schema, settings, context)]));
}

/** What a format is called, from this file or the product's own writer. */
export function formatLabel(product, format, lang) {
  const label = product.writers?.[format]?.label ?? FORMATS[format]?.label ?? { en: format, ja: format };
  return label[lang] ?? label.en;
}

/**
 * Draw the builder into `container`: the options as controls, the live preview, and a tab for each format with
 * its code and a Copy button. Returns `{ update(values), setLanguage(lang), settings() }`. Every element it makes
 * has a `data-testid` beginning `embed-`, and a class beginning `embed-` for the page's CSS; it uses the family's
 * `fam-` classes for buttons and fields where the page has them.
 */
export function mountEmbedBuilder(container, { product, schema, values = {}, lang = "en", words = BUILDER_WORDS, onChange } = {}) {
  let settings = settingsFrom(schema, values);
  let language = lang;
  let format = product.formats[0];
  let drawn = 0;
  const say = (key) => words[language]?.[key] ?? words.en[key];
  const make = (tag, props = {}, ...children) => {
    const element = Object.assign(document.createElement(tag), props);
    element.append(...children);
    return element;
  };

  const controls = make("div", { className: "embed-options" });
  controls.setAttribute("data-testid", "embed-options");
  const previewBox = make("div", { className: "embed-preview" });
  previewBox.setAttribute("data-testid", "embed-preview");
  const tabs = make("div", { className: "embed-tabs fam-seg" });
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("data-testid", "embed-tabs");
  const code = make("textarea", { className: "embed-code fam-field", readOnly: true, spellcheck: false, rows: 6 });
  code.setAttribute("data-testid", "embed-code");
  const copyButton = make("button", { type: "button", className: "fam-button embed-copy" });
  copyButton.setAttribute("data-testid", "embed-copy");
  const status = make("p", { className: "fam-fine embed-status" });
  status.setAttribute("aria-live", "polite");
  status.setAttribute("data-testid", "embed-status");
  const panel = make("div", { className: "embed-panel" }, make("div", { className: "embed-code-head" }, copyButton), code, status);
  panel.setAttribute("role", "tabpanel");
  container.replaceChildren(controls, previewBox, tabs, panel);

  const drawControls = () => {
    controls.replaceChildren(
      ...schema
        .filter((option) => option.kind !== "fixed")
        .map((option) => {
          const id = `embed-option-${option.id}`;
          const label = make("label", { htmlFor: id, className: "fam-label", textContent: option.label[language] ?? option.label.en });
          let field;
          if (option.kind === "choice") {
            field = make("select", { className: "fam-field" }, ...option.choices.map((choice) => make("option", { value: choice.value, textContent: choice.label[language] ?? choice.label.en })));
            field.value = settings[option.id];
          } else if (option.kind === "boolean") {
            field = make("input", { type: "checkbox", checked: Boolean(settings[option.id]) });
          } else if (option.kind === "number") {
            field = make("input", { type: "number", className: "fam-field", min: option.min ?? "", max: option.max ?? "", step: option.step ?? 1, value: settings[option.id], inputMode: "numeric" });
          } else field = make("input", { type: "text", className: "fam-field", value: settings[option.id] ?? "", spellcheck: false });
          field.id = id;
          field.setAttribute("data-testid", id);
          if (option.help) field.title = option.help[language] ?? option.help.en;
          field.addEventListener(option.kind === "text" || option.kind === "number" ? "input" : "change", () => {
            const value = option.kind === "boolean" ? field.checked : field.value;
            update({ [option.id]: value });
          });
          const row = make("div", { className: `embed-option embed-option-${option.kind}` });
          if (option.kind === "boolean") row.append(field, label);
          else row.append(label, field);
          return row;
        }),
    );
  };

  const drawTabs = () => {
    tabs.replaceChildren(
      ...product.formats.map((one) => {
        const button = make("button", { type: "button", textContent: formatLabel(product, one, language) });
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(one === format));
        button.setAttribute("aria-pressed", String(one === format));
        button.setAttribute("data-testid", `embed-tab-${one}`);
        button.addEventListener("click", () => {
          format = one;
          drawTabs();
          drawCode();
        });
        return button;
      }),
    );
    copyButton.textContent = say("copy");
  };

  let context = {};
  let codes = {};
  const drawCode = () => {
    code.value = codes[format] ?? "";
    code.rows = Math.min(14, Math.max(3, code.value.split("\n").length));
    code.setAttribute("aria-label", formatLabel(product, format, language));
    panel.setAttribute("data-format", format);
    status.textContent = "";
  };

  const redraw = async () => {
    const turn = ++drawn;
    const made = (await product.context?.(settings)) ?? {};
    if (turn !== drawn) return;
    context = made;
    codes = allCode(product, schema, settings, context);
    product.preview(previewBox, settings, context);
    drawCode();
    onChange?.(settings);
  };

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.value);
      status.textContent = say("copied");
    } catch (_error) {
      code.focus();
      code.select();
      status.textContent = say("copyFailed");
    }
  });

  function update(changes) {
    settings = settingsFrom(schema, { ...settings, ...changes });
    return redraw();
  }

  drawControls();
  drawTabs();
  const first = redraw();
  return {
    ready: first,
    update,
    settings: () => ({ ...settings }),
    setLanguage(next) {
      language = next;
      drawControls();
      drawTabs();
      return redraw();
    },
  };
}
