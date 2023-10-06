<template>
	<div class="relative">
		<Menu v-slot="{ open }">
			<MenuButton :aria-label="$t('default.more')">{{
				$t("default.more")
			}}</MenuButton>
			<div v-if="open" class="fixed z-10 inset-0 bg-black opacity-30" />
			<MenuItems
				class="absolute z-20 transform left-1/2 -translate-x-1/2 bg-white rounded-md shadow-lg border border-gray-200"
			>
				<MenuItem :key="addonDownload" v-slot="{ active }">
					<button
						:class="[
							active ? 'font-bold' : 'font-normal',
							'w-full whitespace-nowrap p-2',
						]"
						@click="addonDownloadClick"
					>
						{{ $t("default.addonDownload") }}
					</button>
				</MenuItem>
				<MenuItem
					v-for="locale in ABOUT_ITEM"
					:key="locale.id"
					v-slot="{ active }"
				>
					<button
						:class="[
							active ? 'font-bold' : 'font-normal',
							'w-full whitespace-nowrap p-2',
						]"
						@click="urlClick(locale.value)"
					>
						{{ $t("default." + locale.id) }}
					</button>
				</MenuItem>
			</MenuItems>
		</Menu>
	</div>
</template>
<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
const ABOUT_ITEM = Object.freeze([
	{ id: "tutorialVideo", value: "https://www.youtube.com/watch?v=E6DuuiuS6zo" },
	{
		id: "tutorialDownload",
		value:
			"https://drive.google.com/drive/folders/1fVrQjhHEypOGr3lVcqBsmk0f_u_FD1IP",
	},
	{ id: "caseSharing", value: "https://medium.com/p/cbf266d6f9b6" },
	{
		id: "audiovisualReport",
		value: "https://www.youtube.com/watch?v=11JjNgEJdrM",
	},
	{
		id: "ntnuNews",
		value: "https://pr.ntnu.edu.tw/ntnunews/index.php?mode=data&id=21099",
	},
	{
		id: "developmentRepository",
		value: "https://github.com/tsengwoody/Access8Math",
	},
]);
const addonDownloadClick = () => {
	fetch("https://www.nvaccess.org/addonStore/en/all/latest.json", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			// Handle the response data
			const result = data.filter((item) => item["addonId"] === "Access8Math");
			const link = document.createElement("a");
			link.href = result[0]["URL"];
			link.setAttribute("download", "export.txt");
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch((error) => {
			// Handle errors
			console.error("Fetch Error:", error);
		});
};
const urlClick = (url) => {
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("target", "blank");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
</script>
