const textMathToLatexObjectFactory = require('./text-math-to-latex-object-process');
const asciimath2mmlFactory = require('./ascii-math-to-mml');
const latex2mmlFactory = require('./tex-to-mml');
const mml2svg = require('./mml-to-svg');

const textProcessorFactory =
  ({ latexDelimiter, htmlMathDisplay, asciimathDelimiter }) =>
  (rawTxt) => {
    const textMathParser = textMathToLatexObjectFactory({
      latexDelimiter: latexDelimiter,
      asciimathDelimiter: asciimathDelimiter,
    });

    return rawTxt.split('\n').map((line) => {
      return textMathParser(line).reduce((a, b) => {
        let result;
        if (b.type === 'latex-content') {
          result = `<div class="sr-only">${latex2mmlFactory({
            htmlMathDisplay,
          })(b.data)}</div><div aria-hidden="true">${mml2svg(
            latex2mmlFactory({
              htmlMathDisplay,
            })(b.data),
          )}</div>`;
        } else if (b.type === 'asciimath-content') {
          result = `<div class="sr-only">${asciimath2mmlFactory({
            display: htmlMathDisplay,
          })(b.data)}</div><div aria-hidden="true">${mml2svg(
            asciimath2mmlFactory({
              htmlMathDisplay,
            })(b.data),
          )}</div>`;
        } else {
          result = `${b.data}`;
        }
        return a + result;
      }, '');
    });
  };

module.exports = textProcessorFactory;
