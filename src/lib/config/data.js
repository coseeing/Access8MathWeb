import { type, pick, compose, mergeRight } from 'ramda';

const DEFAULT_DATA = {
  title: '',
  documentDisplay: 'markdown',
  display: 'block',
  latexDelimiter: 'bracket',
  entry: 'content.md',
};

const KEYS = Object.keys(DEFAULT_DATA);

const pickWithDefault = compose(mergeRight(DEFAULT_DATA), pick(KEYS));

export const asConfigData = (record) => {
  if (type(record) !== 'Object') {
    return DEFAULT_DATA;
  }

  return pickWithDefault(record);
};
