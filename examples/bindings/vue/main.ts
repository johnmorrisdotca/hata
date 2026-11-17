import { createApp, h } from "vue";
import { Flag } from "@johnmorrisdotca/hata/vue";

createApp({ render: () => h(Flag, { code: "JP-13", shape: "round", size: "large", label: "Tokyo", border: true }) }).mount("#app");
