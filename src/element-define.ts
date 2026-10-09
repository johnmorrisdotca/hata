// The entry @johnmorrisdotca/hata/element/define (dist/element-define.js): importing it registers <hata-flag>, the
// one module of the package with an effect of its own, for a page that wants a single script tag:
//
//     <script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
//     <hata-flag code="JP-13" size="48"></hata-flag>

import { defineFlag } from "./element.js";

defineFlag();

export { defineFlag };
