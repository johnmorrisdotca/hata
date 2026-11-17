import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { Flag } from "@johnmorrisdotca/hata/vue";

// Vue's server renderer waits for the flag by itself.
const html = await renderToString(createSSRApp(Flag, { code: "CA-ON", label: "Ontario" }));
console.log(html.includes("<svg"), html.includes('aria-label="Ontario"'));
