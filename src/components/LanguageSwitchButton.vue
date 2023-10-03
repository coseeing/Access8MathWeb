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
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const SUPPORTED_LOCALE_OPTIONS = Object.freeze([
	{ label: "TC 中文", value: "zh" },
	{ label: "EN English", value: "en" },
]);
let { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const changeLanguage = (lang) => {
	// change root locale
	locale.value = lang;
	// change router param
	router.push({ params: { locale: lang } });
};
watch(() => route.params, changeLanguage(route.params.locale));
</script>
