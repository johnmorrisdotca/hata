import { createApp } from "vue";
import Flag from "./Flag.vue";

const app = createApp(Flag);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("hata-");
app.mount("#app");
