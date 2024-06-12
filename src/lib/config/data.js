import { type, pick, compose, mergeRight } from 'ramda';

export const DEFAULT_DATA = {
  title: '',
  htmlDocumentDisplay: 'markdown',
  htmlMathDisplay: 'block',
  latexDelimiter: 'bracket',
};

const KEYS = Object.keys(DEFAULT_DATA);

const pickConfigData = compose(mergeRight(DEFAULT_DATA), pick(KEYS));

export const asConfigData = (record) => {
  if (type(record) !== 'Object') {
    return DEFAULT_DATA;
  }

  return pickConfigData(record);
};
