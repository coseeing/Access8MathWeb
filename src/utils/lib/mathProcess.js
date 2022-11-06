const LaTeX_delimiter_dict = {
	latex: {
		start: "\\\\\\l",
		end: "\\\\\\l",
		type: "latex",
	},
	bracket: {
		start: "\\\\\\(",
		end: "\\\\\\)",
		type: "latex",
	},
	dollar: {
		start: "\\$",
		end: "\\$",
		type: "latex",
	},
};

const AsciiMath_delimiter_dict = {
	asciimath: {
		start: "\\\\\\a",
		end: "\\\\\\a",
		type: "asciimath",
	},
	graveaccent: {
		start: "`",
		end: "`",
		type: "asciimath",
	},
};

const textmath2laObj =
	({ latex_delimiter, asciimath_delimiter }) =>
	(input) => {
		const LaTeX_delimiter = LaTeX_delimiter_dict[latex_delimiter];
		const AsciiMath_delimiter = AsciiMath_delimiter_dict[asciimath_delimiter];

		const latex_restring = `(?<=[^\\\\]?)${LaTeX_delimiter.start}(.*?[^\\\\])?${LaTeX_delimiter.end}`;
		const asciimath_restring = `(?<=[^\\\\]?)${AsciiMath_delimiter.start}(.*?[^\\\\])?${AsciiMath_delimiter.end}`;
		const reTexMath = new RegExp(
			`${latex_restring}|${asciimath_restring}`,
			"g"
		);

		const datas = [];
		let m = null;
		let start = 0;
		let end = input.length;
		let nextStart = 0;
		do {
			m = reTexMath.exec(input);
			if (m) {
				start = nextStart;
				end = m.index;
				if (start !== end) {
					datas.push({
						type: "text-content",
						data: input.slice(start, end),
					});
				}
				// const delimiterObj = Object.values(delimiter_dict);
				const AsciiMath_delimiter_raw_start = AsciiMath_delimiter.start.replace(
					/\\\\\\/g,
					"\\"
				);
				let data, type;
				if (m[0].startsWith(AsciiMath_delimiter_raw_start)) {
					type = "asciimath-content";
					data = m[2];
				} else {
					type = "latex-content";
					data = m[1];
				}

				datas.push({
					type,
					data,
				});
				nextStart = m.index + m[0].length;
			} else {
				start = nextStart;
				end = input.length;
				if (start !== end) {
					datas.push({
						type: "text-content",
						data: input.slice(start, end),
					});
				}
			}
		} while (m);
		return datas;
	};

module.exports = {
	textmath2laObj,
};
