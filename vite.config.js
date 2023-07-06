import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const resourcesPath = `${__dirname}/src`;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		base: env.BASE_URL,
		// server.hmr.overlay
		server: {
			port: 3000,
			hmr: {
				overlay: false,
			},
		},
		resolve: {
			alias: {
				"@": resolve(`${resourcesPath}`),
			},
			extensions: [".js", ".vue", ".css", ".scss"],
		},
		plugins: [
			vue(),
			VueI18nPlugin({
				include: [resolve(__dirname, "./src/locales/**")],
				runtimeOnly: false,
				compositionOnly: true,
				fullInstall: true,
			}),
			createSvgIconsPlugin({
				iconDirs: [resolve(__dirname, "./src/assets/svg/**/*/")],
				symbolId: `icon-[name]`,
				inject: "body-first",
			}),
		],
	};
});
