/*************************************************************************
 *
 *  direct/am2mml
 *
 *  Uses MathJax v3 to convert an AsciiMath string to a MathML string.
 *
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2018 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

//
//  Load the packages needed for MathJax
//
const { AsciiMath } = require("mathjax-full/js/input/asciimath.js");
const {
	HTMLDocument,
} = require("mathjax-full/js/handlers/html/HTMLDocument.js");
const { liteAdaptor } = require("mathjax-full/js/adaptors/liteAdaptor.js");
const { STATE } = require("mathjax-full/js/core/MathItem.js");

//
//  Create the input jax
//
const asciimath = new AsciiMath();

//
//  Create an HTML document using a LiteDocument and the input jax
//
const html = new HTMLDocument("", liteAdaptor(), { InputJax: asciimath });

//
//  Create a MathML serializer
//
const {
	SerializedMmlVisitor,
} = require("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");
const visitor = new SerializedMmlVisitor();
const toMathML = (node) => visitor.visitTree(node, html);

module.exports =
	({ display }) =>
	(mstring) => {
		return toMathML(
			html.convert(mstring || "", {
				display: display === "block",
				end: STATE.CONVERT,
			})
		);
	};
