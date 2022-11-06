<template>
	<div
		class="home flex flex-wrap pt-10 md:pt-p2 h-screen w-screen overflow-x-hidden overflow-y-auto"
	>
		<!--Left side input panel-->
		<div
			class="w-2/4 p-p1 flex-basis-like-1/1 flex-grow md:flex-1 bg-bg1 text-left pt-p1 pl-p3 pr-p3 flex flex-col"
		>
			<p role="heading" aria-level="1" class="text-2xl md:text-3xl">
				{{ $t("default.editContent") }}
			</p>
			<div class="mt-8 md:mt-m1 flex justify-end items-center mb-m2">
				<button class="home-btn" @click="insertMark">
					{{ $t("default.mark") }}
				</button>
				<button class="home-btn" @click="importClick">
					{{ $t("default.import") }}
				</button>
				<button class="home-btn" @click="exportClick">
					{{ $t("default.export") }}
				</button>
				<button
					class="transform hover:scale-110 transition-scale"
					@click="showUseTipModal = true"
					:aria-label="$t('default.descript')"
				>
					<SvgIcon
						name="question-circle"
						:size="34"
						color="#313746"
						class="cursor-pointer"
					/>
				</button>
			</div>
			<EditIconsTab @insert-latex="insertLatex" />
			<div class="flex flex-1">
				<div
					id="codemirror"
					class="left-side-input-textarea flex-1 resize-none border border-bd1 overflow-y-scroll rounded-b-lg"
				></div>
				<input
					type="file"
					ref="importFile"
					class="hidden"
					@change="importAction"
				/>
			</div>
		</div>
		<!--Right side output panel-->
		<div
			class="w-2/4 flex-basis-like-1/1 flex-grow md:flex-1 text-left p-p1 pt-p1 pl-p3 flex flex-col"
		>
			<p
				role="heading"
				aria-level="1"
				class="text-2xl md:text-3xl mb-m2 md:mb-m3"
			>
				{{ $t("default.result") }}
			</p>
			<div
				v-html="marked(contentmd)"
				class="right-side-input-textarea border-2 overflow-scroll p-4 flex-1 rounded-lg"
			/>
		</div>
		<Modal v-if="showUseTipModal" @close="showUseTipModal = false">
			<template v-slot:header>
				<div class="text-4xl font-bold">{{ $t("default.useDescript") }}</div>
			</template>
			<template v-slot:body>
				<div class="mt-m2">
					<div
						v-for="(tip, k) in useTip[$i18n.locale]"
						:key="k"
						class="py-p5 px-m2 text-left text-lg"
					>
						<b>{{ tip.title }}</b>
						<p>{{ tip.content }}</p>
					</div>
				</div>
			</template>
			<template v-slot:footer>
				<button class="btn-style_1" @click="showUseTipModal = false">
					{{ $t("default.understand") }}
				</button>
			</template>
		</Modal>
	</div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { marked as markedFactory } from "@/utils/lib/markdownProcess.js";
import { textmath2laObj as textmath2laObjFactory } from "@/utils/lib/mathProcess.js";
import asciimath2mmlFactory from "@/utils/lib/am2mml.js";
import latex2mmlFactory from "@/utils/lib/tex2mml.js";
import mml2svg from "@/utils/lib/mml2svg.js";
import { getFileDataAsText } from "@/utils/utils";
import { useTip } from "../utils/tips";
import EditIconsTab from "@/components/EditIconsTab.vue";
import Modal from "../components/Modal.vue";

const latex2mml = latex2mmlFactory({ display: "block" });
const asciimath2mml = asciimath2mmlFactory({ display: "block" });
const marked = markedFactory({
	latex_delimiter: "bracket",
	asciimath_delimiter: "graveaccent",
	display: "inline",
});
const textmath2laObj = textmath2laObjFactory({
	latex_delimiter: "bracket",
	asciimath_delimiter: "graveaccent",
});

// import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { EditorSelection } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";

export default {
	name: "Home",
	components: { EditIconsTab, Modal },
	setup() {
		const showUseTipModal = ref(false);
		const importFile = ref(null);
		const codemirrorView = ref(null);

		/*const data = ref(
			`\\(ax^2+bx+c=0 (a\\ne 0)\\) solution is：\\(x_{1,2} = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\) or \\(x_{1,2} = {2c \\over -b \\pm \\sqrt{b^2-4ac} }\\)`
		);*/
		const data = ref("");
		const content = computed(() => {
			return data.value.split("\n").map((line) => {
				return textmath2laObj(line).reduce((a, b) => {
					let result;
					if (b.type === "latex-content") {
						result = `<div class="sr-only">${latex2mml(
							b.data
						)}</div><div aria-hidden="true">${mml2svg(
							latex2mml(b.data)
						)}</div>`;
					} else if (b.type === "asciimath-content") {
						result = `<div class="sr-only">${asciimath2mml(
							b.data
						)}</div><div aria-hidden="true">${mml2svg(
							asciimath2mml(b.data)
						)}</div>`;
					} else {
						result = `${b.data}`;
					}
					return a + result;
				}, "");
			});
		});

		const contentmd = computed(() => marked(data.value));

		const insertMark = () => {
			const view = codemirrorView.value;
			view.dispatch(
				view.state.changeByRange((range) => {
					return {
						changes: [
							{ from: range.from, insert: "\\(" },
							{ from: range.to, insert: "\\)" },
						],
						range: EditorSelection.range(range.from + 2, range.to + 2),
					};
				})
			);
			view.focus();
		};

		const insertLatex = (e) => {
			const { latex, offset } = e;
			const view = codemirrorView.value;
			view.dispatch(
				view.state.changeByRange((range) => ({
					changes: [
						{ from: range.from, insert: latex.slice(0, latex.length + offset) },
						{
							from: range.to,
							insert: latex.slice(latex.length + offset, latex.length),
						},
					],
					range: EditorSelection.range(
						range.from + latex.length + offset,
						range.from + latex.length + offset
					),
				}))
			);
			view.focus();
		};

		const importAction = async (e) => {
			try {
				const file = e.target.files[0];
				data.value = await getFileDataAsText(file);
				createView(data.value);
			} catch (err) {
				console.log(err);
			}
		};

		const importClick = () => {
			importFile.value.click();
		};

		const exportClick = () => {
			const output = data.value;
			const url = window.URL.createObjectURL(new Blob([output]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "export.txt");
			document.body.appendChild(link);
			link.click();
		};

		onMounted(() => {
			createView();
		});

		const createView = (content = "") => {
			if (codemirrorView.value) {
				codemirrorView.value.destroy();
			}
			const editorView = EditorView.theme({
				"&": {
					fontSize: "16px",
					backgroundColor: "white",
					minHeight: "300px",
					height: "100%",
				},
				".cm-scroller": { overflow: "auto" },
			});
			codemirrorView.value = new EditorView({
				state: EditorState.create({
					doc: content,
					extensions: [
						basicSetup,
						markdown(),
						EditorView.updateListener.of((update) => {
							data.value = update.view.state.doc.toString();
						}),
						editorView,
						EditorView.lineWrapping,
					],
				}),
				parent: document.getElementById("codemirror"),
			});
		};

		return {
			marked,
			data,
			content,
			contentmd,
			insertMark,
			insertLatex,
			useTip,
			showUseTipModal,
			importFile,
			importAction,
			importClick,
			exportClick,
		};
	},
};
</script>
<style scoped lang="scss">
.right-side-input-textarea {
	min-height: 300px;
}

// .right-side-input-textarea {
// 	vertical-align: middle;
// }
.right-side-input-textarea::v-deep {
	> * {
		// display: inline-block;
		margin: var(--spacing-2-5) var(--spacing-5);
		vertical-align: middle;
	}

	ol {
		list-style-type: decimal;
	}

	ul {
		list-style-type: disc;
	}

	table {
		border: 1px solid black;
		tr {
			border: inherit;
		}
		td,
		th {
			@apply p-1;
			border: 1px solid black;
		}
	}

	svg {
		@apply inline-block;
	}
}
</style>
