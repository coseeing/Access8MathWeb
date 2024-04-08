import mathTabList from '@/lib/tabs/math/index';

const allMathSubTabs = mathTabList.reduce((acc, mathTab) => {
  return acc.concat(mathTab.subTabs || []);
}, []);

const autoCompletions = (context) => {
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

export default autoCompletions;
