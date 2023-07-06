import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

export default createI18n({
	locale: import.meta.env.VITE_APP_I18N_LOCALE || "en",
	fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || "en",
	messages,
	legacy: false,
});
