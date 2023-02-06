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
				<button class="home-btn" @click="LaTeXSepConvert('d2b')">
					{{ $t("default.dollar2bracket") }}
				</button>
				<button class="home-btn" @click="LaTeXSepConvert('b2d')">
					{{ $t("default.bracket2dollar") }}
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
				<textarea
					v-if="basic === true"
					class="left-side-input-textarea flex-1 resize-none p-3 border border-bd1 overflow-y-scroll rounded-b-lg"
					ref="inputArea"
					type="text"
					v-model="data"
				/>
				<div
					v-else
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
			<div class="flex md:mb-m3 w-100">
				<p role="heading" aria-level="1" class="text-2xl md:text-3xl w-100">
					{{ $t("default.result") }}
				</p>
				<button
					@click="showSettingModal = true"
					:aria-label="$t('default.useSetting')"
				>
					<SvgIcon
						name="settings"
						:size="34"
						color="#313746"
						class="cursor-pointer"
					/>
				</button>
			</div>
			<template v-if="selecteds['HTML_document_display'] === 'markdown'">
				<div
					v-html="contentmd"
					class="right-side-input-textarea border-2 overflow-scroll p-4 flex-1 rounded-lg"
				/>
			</template>
			<template v-else>
				<div
					class="right-side-input-textarea border-2 overflow-scroll p-4 flex-1 rounded-lg"
				>
					<template v-for="(line, key) in content" :key="key">
						<span><span v-html="line" /></span><br />
					</template>
				</div>
			</template>
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
		<Modal v-if="showSettingModal" @close="showSettingModal = false">
			<template v-slot:header>
				<div class="text-4xl font-bold">{{ $t("default.useSetting") }}</div>
			</template>
			<template v-slot:body>
				<div class="mt-m2">
					<div
						v-for="(setting, id) in settings[$i18n.locale]"
						:key="id"
						class="py-2 px-m2 text-left text-lg"
					>
						<div>
							<b>{{ setting.name }}</b>
						</div>
						<div
							class="py-1 pr-4 inline-block"
							v-for="(option, o) in setting.options"
							:key="o"
						>
							<input
								:id="option.value"
								type="radio"
								:value="option.value"
								v-model="selecteds[id]"
								:name="id"
							/>
							<label :for="option.value">{{ option.display }}</label>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:footer>
				<button class="btn-style_1" @click="showSettingModal = false">
					{{ $t("default.SettingFinish") }}
				</button>
			</template>
		</Modal>
	</div>
</template>

<script setup>
import { ref, computed, onUpdated, onMounted } from "vue"; //new add
import { marked as markedFactory } from "@/utils/lib/markdownProcess.js";
import { textmath2laObj as textmath2laObjFactory } from "@/utils/lib/mathProcess.js";
import asciimath2mmlFactory from "@/utils/lib/am2mml.js";
import latex2mmlFactory from "@/utils/lib/tex2mml.js";
import mml2svg from "@/utils/lib/mml2svg.js";
import { getFileDataAsText } from "@/utils/utils";
import { useTip } from "../utils/tips";
import settings from "../utils/setting";
import EditIconsTab from "@/components/EditIconsTab.vue";
import Modal from "../components/Modal.vue";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState, EditorSelection } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { autocompletion } from "@codemirror/autocomplete";
import latexs from "../utils/latexs";

const basic = false;
const selecteds = ref({
	HTML_document_display: "markdown",
	HTML_math_display: "block",
	color_match: "blackTextOnWhiteBackground",
	LaTeX_delimiter: "bracket",
});
const selectionStart = ref(-1);
const selectionEnd = ref(-1);
const showUseTipModal = ref(false);
const showSettingModal = ref(false);
const inputArea = ref(null);
const importFile = ref(null);
const codemirrorView = ref(null); //new add
const data = ref("");
const content = computed(() => {
	return data.value.split("\n").map((line) => {
		return textmath2laObjFactory({
			latex_delimiter: selecteds.value["LaTeX_delimiter"],
			asciimath_delimiter: "graveaccent",
		})(line).reduce((a, b) => {
			let result;
			if (b.type === "latex-content") {
				result = `<div class="sr-only">${latex2mmlFactory({
					display: selecteds.value["HTML_math_display"],
				})(b.data)}</div><div aria-hidden="true">${mml2svg(
					latex2mmlFactory({
						display: selecteds.value["HTML_math_display"],
					})(b.data)
				)}</div>`;
			} else if (b.type === "asciimath-content") {
				result = `<div class="sr-only">${asciimath2mmlFactory({
					display: selecteds.value["HTML_math_display"],
				})(b.data)}</div><div aria-hidden="true">${mml2svg(
					asciimath2mmlFactory({
						display: selecteds.value["HTML_math_display"],
					})(b.data)
				)}</div>`;
			} else {
				result = `${b.data}`;
			}
			return a + result;
		}, "");
	});
});
const contentmd = computed(() => {
	return markedFactory({
		latex_delimiter: selecteds.value["LaTeX_delimiter"],
		asciimath_delimiter: "graveaccent",
		display: selecteds.value["HTML_math_display"],
	})(data.value);
});
const bdconvert = (mode) => (data) => {
	return data
		.split("\n")
		.map((line) => {
			let latex_delimiter = "dollar";
			if (mode === "b2d") {
				latex_delimiter = "bracket";
			} else if (mode === "d2b") {
				latex_delimiter = "dollar";
			}
			return textmath2laObjFactory({
				latex_delimiter,
				asciimath_delimiter: "graveaccent",
			})(line).reduce((a, b) => {
				let result;
				if (b.type === "latex-content") {
					if (mode === "b2d") {
						result = `$${b.data}$`;
					} else if (mode === "d2b") {
						result = `\\(${b.data}\\)`;
					} else {
						result = `\\(${b.data}\\)`;
					}
				} else if (b.type === "asciimath-content") {
					result = `\`${b.data}\``;
				} else {
					result = `${b.data}`;
				}
				return a + result;
			}, "");
		})
		.reduce((a, b) => {
			return a + b + "\n";
		}, "");
};
// new add
let insertMark;
let insertLatex;
let importAction;
let LaTeXSepConvert;
if (basic) {
	insertMark = () => {
		const target = inputArea.value;
		const selectedText = target.value.slice(
			target.selectionStart,
			target.selectionEnd
		);
		let LaTeX_delimiter_start = "\\(";
		let LaTeX_delimiter_end = "\\)";
		if (selecteds.value["LaTeX_delimiter"] === "bracket") {
			LaTeX_delimiter_start = "\\(";
			LaTeX_delimiter_end = "\\)";
		} else if (selecteds.value["LaTeX_delimiter"] === "dollar") {
			LaTeX_delimiter_start = "$";
			LaTeX_delimiter_end = "$";
		}
		const startOffset = LaTeX_delimiter_start.length;
		const endOffset = LaTeX_delimiter_end.length;
		const content = `${LaTeX_delimiter_start}${selectedText}${LaTeX_delimiter_end}`;
		data.value =
			data.value.slice(0, target.selectionStart) +
			content +
			data.value.slice(target.selectionEnd, data.value.length);
		selectionStart.value = target.selectionStart + startOffset;
		selectionEnd.value = target.selectionEnd + endOffset;
	};
	insertLatex = (e) => {
		const { latex, offset } = e;
		const target = inputArea.value;
		const content = latex;
		data.value =
			data.value.slice(0, target.selectionStart) +
			content +
			data.value.slice(target.selectionEnd, data.value.length);
		selectionStart.value = target.selectionStart + latex.length + offset;
		selectionEnd.value = target.selectionStart + latex.length + offset;
	};
	importAction = async (e) => {
		try {
			const file = e.target.files[0];
			data.value = await getFileDataAsText(file);
		} catch (err) {
			console.log(err);
		}
	};
	LaTeXSepConvert = (mode) => {
		data.value = bdconvert(mode)(data.value);
	};
} else {
	insertMark = () => {
		let LaTeX_delimiter_start = "\\(";
		let LaTeX_delimiter_end = "\\)";
		if (selecteds.value["LaTeX_delimiter"] === "bracket") {
			LaTeX_delimiter_start = "\\(";
			LaTeX_delimiter_end = "\\)";
		} else if (selecteds.value["LaTeX_delimiter"] === "dollar") {
			LaTeX_delimiter_start = "$";
			LaTeX_delimiter_end = "$";
		}
		const startOffset = LaTeX_delimiter_start.length;
		const endOffset = LaTeX_delimiter_end.length;
		const view = codemirrorView.value;
		view.dispatch(
			view.state.changeByRange((range) => {
				return {
					changes: [
						{ from: range.from, insert: LaTeX_delimiter_start },
						{ from: range.to, insert: LaTeX_delimiter_end },
					],
					range: EditorSelection.range(
						range.from + startOffset,
						range.to + endOffset
					),
				};
			})
		);
		view.focus();
	};
	insertLatex = (e) => {
		const { latex, offset } = e;
		const view = codemirrorView.value;
		view.dispatch(
			view.state.changeByRange((range) => ({
				changes: [
					{
						from: range.from,
						insert: latex.slice(0, latex.length + offset),
					},
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
	importAction = async (e) => {
		try {
			const file = e.target.files[0];
			data.value = await getFileDataAsText(file);
			createView(data.value);
		} catch (err) {
			console.log(err);
		}
	};
	LaTeXSepConvert = (mode) => {
		const value = bdconvert(mode)(data.value);
		createView(value);
	};
}
// new add
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
onUpdated(() => {
	if (selectionStart.value >= 0 && selectionEnd.value >= 0) {
		const target = inputArea.value;
		target.setSelectionRange(selectionStart.value, selectionEnd.value);
		target.focus();
		selectionStart.value = -1;
		selectionEnd.value = -1;
	}
});
onMounted(() => {
	createView();
});
const myCompletions = (context) => {
	let word = context.matchBefore(new RegExp("\\\\\\w*"));
	if (!word || (word.from == word.to && !context.explicit)) return null;
	const options = latexs.map((item) => {
		return {
			label: item.latex,
			type: "text",
			apply: item.latex,
		};
	});
	return {
		from: word.from,
		options,
	};
};
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
				autocompletion({
					override: [myCompletions],
				}),
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
</script>
<style scoped lang="scss">
.left-side-input-textarea,
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
