<template>
	<div class="relative">
		<Menu v-slot="{ open }">
			<MenuButton :aria-label="$t('default.changeLanguage')">{{
				$t("default.language")
			}}</MenuButton>
			<div v-if="open" class="fixed z-10 inset-0 bg-black opacity-30" />
			<MenuItems
				class="absolute z-20 transform left-1/2 -translate-x-1/2 bg-white rounded-md shadow-lg border border-gray-200"
			>
				<MenuItem
					v-for="locale in SUPPORTED_LOCALE_OPTIONS"
					:key="locale.value"
					v-slot="{ active }"
				>
					<button
						:class="[
							active ? 'font-bold' : 'font-normal',
							'w-full whitespace-nowrap p-2',
						]"
						@click="changeLanguage(locale.value)"
					>
						{{ locale.label }}
					</button>
				</MenuItem>
			</MenuItems>
		</Menu>
	</div>
</template>
<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import router from "../router/index.js";
import createI18n, { loadLocaleMessages } from "../i18n.js";
import { useI18n } from "vue-i18n";
const SUPPORTED_LOCALE_OPTIONS = Object.freeze([
	{ label: "TC 中文", value: "zh" },
	{ label: "EN English", value: "en" },
]);

const { locales, messages } = loadLocaleMessages();
let { locale } = useI18n();

const changeLanguage = (lang) => {
	// change root locale
	locale.value = lang;
	// change router param
	router.push({ params: { locale: lang } });
	// Hot updates
	if (module.hot) {
		module.hot.accept(locales.id, () => {
			const { messages: newMessages } = loadLocaleMessages();
			console.log(newMessages);
			Object.keys(newMessages)
				.filter((locale) => messages[locale] !== newMessages[locale])
				.forEach((locale) => {
					messages[locale] = newMessages[locale];
					createI18n.setLocaleMessage(locale, messages[locale]);
				});
		});
	}
};
</script>
