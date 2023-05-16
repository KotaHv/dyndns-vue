/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";

// Plugins
import { registerPlugins } from "@/plugins";

import { useDynDNS } from "@/stores/dyndns";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

(async () => {
  const store = useDynDNS();
  await store.getDynDNS();
  registerPlugins(app);
  app.mount("#app");
})();
