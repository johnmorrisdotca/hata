<!--
  The entry @johnmorrisdotca/hata/svelte: a flag as a Svelte 5 component that draws the flag's SVG inline, from the per-flag modules, so that it works in
  a server render and in a static build as well as in the browser. The props are the element's (<hata-flag>). On a server, call `preloadFlags` from
  "@johnmorrisdotca/hata/bind" for the flags first: a server render does not wait. Svelte is an optional peer dependency.
-->
<script>
  import { boxStyle, cachedFlag, inlineSvg, resolveFlag, styleText } from "../bind.js";

  const props = $props();
  const asked = () => ({ code: props.code, shape: props.shape, fit: props.fit, size: props.size, width: props.width, label: props.label, lang: props.lang, border: props.border, shadow: props.shadow, theme: props.theme, date: props.date, variant: props.variant, which: props.which, allowRestricted: props.allowRestricted });

  let loaded = $state(null);
  const found = $derived(cachedFlag(asked()) ?? loaded);

  $effect(() => {
    const now = asked();
    let live = true;
    resolveFlag(now).then((one) => {
      if (live) loaded = one;
    });

    return () => {
      live = false;
    };
  });
</script>

{#if found}<span role="img" aria-label={found.name} data-hata-flag="" style={styleText(boxStyle(asked(), found.aspect))}>{@html inlineSvg(found.svg)}</span>{/if}
