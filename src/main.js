import { createApp } from "vue";
import "virtual:svg-icons-register";

import "./init.js";

import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import i18n from "./i18n";

createApp(App).use(i18n).use(store).use(router).mount("#app");
