import { textmath2laObj as textmath2laObjFactory } from '@/lib/content-processor/math-process';

import mathTabList from '@/lib/tabs/math/index';

export const bdconvert = (mode) => (data) => {
  return data
    .split('\n')
    .map((line) => {
      let latexDelimiter = 'dollar';
      if (mode === 'b2d') {
        latexDelimiter = 'bracket';
      } else if (mode === 'd2b') {
        latexDelimiter = 'dollar';
      }
      return textmath2laObjFactory({
        latexDelimiter,
        asciimathDelimiter: 'graveaccent',
      })(line).reduce((a, b) => {
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

const allMathSubTabs = mathTabList.reduce((acc, mathTab) => {
  return acc.concat(mathTab.subTabs || []);
}, []);

export const myCompletions = (context) => {
  let word = context.matchBefore(new RegExp('\\\\\\w*'));
  if (!word || (word.from == word.to && !context.explicit)) return null;
  const options = allMathSubTabs.map((item) => {
    return {
      label: item.latex,
      type: 'text',
      apply: item.latex,
    };
  });
  return {
    from: word.from,
    options,
  };
};
