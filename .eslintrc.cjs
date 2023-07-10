module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
	rules: {
		"vue/multi-word-component-names": 0,
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"prettier/prettier": [
			"error",
			{
				useTabs: true,
				tabWidth: 2,
				endOfLine: "auto",
			},
		],
	},
};
