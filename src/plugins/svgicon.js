import SvgIcon from "@/components/SvgIcon.vue";

const componentPlugin = {
	install: function (vue, options) {
		if (
			options &&
			options.imports &&
			Array.isArray(options.imports) &&
			options.imports.length > 0
		) {
			// 按需引入图标
			const { imports } = options;
			imports.forEach((name) => {
				require(`@/assets/svg/${name}.svg`);
			});
		} else {
			// 全量引入图标
			const ctx = require.context("@/assets/svg", true, /\.svg$/);
			ctx.keys().forEach((path) => {
				const temp = path.match(/.+\.svg$/);
				if (!temp) return;
				require(`@/assets/svg/${path.substr(2)}`);
			});
		}
		vue.component(SvgIcon.name, SvgIcon);
	},
};
export default componentPlugin;
