import { renderToString } from "react-dom/server";
import { Flag, preloadFlags } from "@johnmorrisdotca/hata/react";

// renderToString cannot wait, so load the flags first; a streaming render (renderToPipeableStream, prerender) waits for them by itself.
await preloadFlags([{ code: "JP-13", shape: "round", label: "Tokyo" }]);
const html = renderToString(<Flag code="JP-13" shape="round" size="medium" label="Tokyo" />);
console.log(html.includes("<svg"), html.includes('aria-label="Tokyo"'));
