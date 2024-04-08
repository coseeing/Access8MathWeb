import { textmath2laObj as textmath2laObjFactory } from '@/lib/content-processor/math-process';
import asciimath2mmlFactory from '@/lib/content-processor/am2mml';
import latex2mmlFactory from '@/lib/content-processor/tex2mml';
import mml2svg from '@/lib/content-processor/mml2svg';

const textProcessorFactory =
  ({ latexDelimiter, htmlMathDisplay }) =>
  (rawTxt) => {
    return rawTxt.split('\n').map((line) => {
      return textmath2laObjFactory({
        latex_delimiter: latexDelimiter,
        asciimath_delimiter: 'graveaccent',
      })(line).reduce((a, b) => {
        let result;
        if (b.type === 'latex-content') {
          result = `<div class="sr-only">${latex2mmlFactory({
            display: htmlMathDisplay,
          })(b.data)}</div><div aria-hidden="true">${mml2svg(
            latex2mmlFactory({
              display: htmlMathDisplay,
            })(b.data),
          )}</div>`;
        } else if (b.type === 'asciimath-content') {
          result = `<div class="sr-only">${asciimath2mmlFactory({
            display: htmlMathDisplay,
          })(b.data)}</div><div aria-hidden="true">${mml2svg(
            asciimath2mmlFactory({
              display: htmlMathDisplay,
            })(b.data),
          )}</div>`;
        } else {
          result = `${b.data}`;
        }
        return a + result;
      }, '');
    });
  };

export default textProcessorFactory;
