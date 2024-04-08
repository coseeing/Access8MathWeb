/*************************************************************************
 *
 *  direct/mml2svg
 *
 *  Uses MathJax v3 to convert a MathML string to an SVG string.
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
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { MathML } = require('mathjax-full/js/input/mathml.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const {
  AssistiveMmlHandler,
} = require('mathjax-full/js/a11y/assistive-mml.js');

const argv = {
  _: [],
  em: 16,
  ex: 8,
  width: 1280,
  fontCache: true,
  'font-cache': true,
  assistiveMml: false,
  'assistive-mml': false,
};

//
//  Create DOM adaptor and register it for HTML documents
//
const adaptor = liteAdaptor();
const handler = RegisterHTMLHandler(adaptor);
if (argv.assistiveMml) AssistiveMmlHandler(handler);

//
//  Create input and output jax and a document using them on the content from the HTML file
//
const mml = new MathML();
const svg = new SVG({ fontCache: argv.fontCache ? 'local' : 'none' });
const html = mathjax.document('', { InputJax: mml, OutputJax: svg });

module.exports = (mstring) => {
  //
  //  Typeset the math from the command line
  //
  const node = html.convert(mstring || '', {
    display: !argv.inline,
    em: argv.em,
    ex: argv.ex,
    containerWidth: argv.width,
  });

  //
  //  If the --css option was specified, output the CSS,
  //  Otherwise, typeset the math and output the HTML
  //
  if (argv.css) {
    return adaptor.textContent(svg.styleSheet(html));
  } else {
    return adaptor.outerHTML(node);
  }
};
