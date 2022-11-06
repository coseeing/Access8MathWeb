import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import svgiconPlugin from "./plugins/svgicon";
import i18n from "./i18n";

createApp(App)
	.use(i18n)
	.use(store)
	.use(router)
	.use(svgiconPlugin, {
		imports: [],
	})
	.mount("#app");
