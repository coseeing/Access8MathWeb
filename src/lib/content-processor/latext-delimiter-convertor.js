const textMathToLatexObjectFactory = require('./text-math-to-latex-object-process');

const latexDelimiterConvertor = (mode) => (data) => {
  return data
    .split('\n')
    .map((line) => {
      let latexDelimiter = 'dollar';
      if (mode === 'b2d') {
        latexDelimiter = 'bracket';
      } else if (mode === 'd2b') {
        latexDelimiter = 'dollar';
      }

      const textMathParser = textMathToLatexObjectFactory({
        latexDelimiter,
        asciimathDelimiter: 'graveaccent',
      });

      return textMathParser(line).reduce((a, b) => {
        let result;
        if (b.type === 'latex-content') {
          if (mode === 'b2d') {
            result = `$${b.data}$`;
          } else if (mode === 'd2b') {
            result = `\\(${b.data}\\)`;
          } else {
            result = `\\(${b.data}\\)`;
          }
        } else if (b.type === 'asciimath-content') {
          result = `\`${b.data}\``;
        } else {
          result = `${b.data}`;
        }
        return a + result;
      }, '');
    })
    .reduce((a, b) => {
      return a + b + '\n';
    }, '');
};

module.exports = latexDelimiterConvertor;
