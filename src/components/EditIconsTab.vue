<template>
	<div>
		<!--Main category icons of symbols-->
		<TabGroup
			as="div"
			@change="
				(main_k) => {
					main_active = main_k;
				}
			"
		>
			<div class="flex padding_bottom">
				<TabList
					as="div"
					class="flex-auto xl:flex-grow-0 flex flex-wrap xl:flex-nowrap bg-white"
				>
					<Tab
						as="button"
						v-for="(tab, main_k) in mains"
						:key="main_k"
						class="category-icon w-24 h-12 flex-basis-like-1/3 xl:flex-basis-auto flex-grow xl:flex-grow-0 xl:flex-shrink-0 order mx-0.5 border bg-gray-50 text-sm text-center cursor-pointer transition-color"
						:class="{ main_active: main_active === main_k }"
						@click="main_active = main_k"
					>
						{{ $t(`default.mains.${tab}`) }}
					</Tab>
				</TabList>
			</div>
			<div v-if="main_active === 1">
				<TabPanels
					as="div"
					class="bg-bg2 border border-gray-300 flex flex-wrap"
				>
					<button
						class="w-w5 h-w5 bg-white border group relative"
						:aria-label="$t(`default.markdown.${icon.id}`)"
						@click="$emit('insertLatex', icon)"
						v-for="icon in markdowns"
						:key="icon.id"
					>
						<SvgIcon :name="icon.id" :size="51" />
						<Tab
							as="div"
							class="absolute p-4 shadow-lg hidden bg-bg2 group-hover:block whitespace-nowrap z-10"
							style="left: 50%; transform: translateX(-50%); top: 55px"
						>
							{{ $t(`default.markdown.${icon.id}`) }}
						</Tab>
					</button>
				</TabPanels>
			</div>
			<div v-else-if="main_active === 0">
				<TabGroup
					as="div"
					@change="
						(k) => {
							active = k;
						}
					"
				>
					<div class="flex">
						<TabList
							as="div"
							class="flex-auto flex flex-wrap xl:flex-nowrap bg-white"
						>
							<Tab
								as="button"
								v-for="(tab, k) in tabs"
								:key="k"
								:aria-label="$t(`default.categorys.${tab}`)"
								class="group relative category-icon h-12 flex-basis-like-1/3 xl:flex-basis-auto flex-grow xl:flex-shrink-0 order mx-0.5 border bg-gray-50 cursor-pointer transition-color"
								:class="{ active: active === k }"
								@click="active = k"
							>
								<SvgIcon :name="tab" :size="48" />
								<div
									class="absolute p-4 shadow-lg hidden bg-bg2 group-hover:block whitespace-nowrap z-10"
									style="left: 50%; transform: translateX(-50%); top: 55px"
								>
									{{ $t(`default.categorys.${tab}`) }}
								</div>
							</Tab>
						</TabList>
					</div>
					<!--Sub category icons of symbols-->
					<TabPanels
						as="div"
						class="bg-bg2 border border-gray-300 flex flex-wrap"
					>
						<TabPanel v-for="(tab, k) in tabs" :key="k">
							<button
								class="w-w5 h-w5 bg-white border group relative"
								:aria-label="$t(`default.latexs.${icon.id}`)"
								@click="$emit('insertLatex', icon)"
								v-for="icon in orderLatexs.filter(
									(latex) => latex.category === tab.toLowerCase()
								)"
								:key="icon.id"
							>
								<SvgIcon :name="icon.id" :size="51" />
								<Tab
									as="div"
									class="absolute p-4 shadow-lg hidden bg-bg2 group-hover:block whitespace-nowrap z-10"
									style="left: 50%; transform: translateX(-50%); top: 55px"
								>
									{{ $t(`default.latexs.${icon.id}`) }}
								</Tab>
							</button>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
		</TabGroup>
	</div>
</template>

<script>
import { ref } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { compare } from "../utils/dataProcess";
import latexs from "../utils/latexs";
import markdowns from "../utils/markdowns";
import SvgIcon from "@/components/SvgIcon";
import tabs from "@/utils/tabs";

export default {
	emits: ["insertLatex"],
	components: {
		SvgIcon,
		TabGroup,
		TabList,
		Tab,
		TabPanels,
		TabPanel,
	},
	setup() {
		const mains = ["math", "mark_down"];
		const main_active = ref(0);
		const active = ref(0);
		const orderLatexs = latexs.sort(compare("order", "asc"));
		return {
			mains,
			main_active,
			tabs,
			active,
			orderLatexs,
			markdowns,
		};
	},
};
</script>

<style scoped lang="scss">
.category-icon {
	white-space: nowrap;
	background: #f9f9f9;

	.wrap &.active &:hover {
		background: white;
		color: #777;
	}

	&.active {
		font-weight: 900;
		color: #555;
	}
}
</style>
