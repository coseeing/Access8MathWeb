import { useCallback } from 'react';

import { createMarkdownToReactParser } from '@coseeing/see-mark';

import Alert from '@/components/parser-components/alert/alert';

const useSeeMarkParse = ({ latexDelimiter, htmlMathDisplay, imageFiles }) => {
  const seeMarkReactParse = useCallback(
    (markdown) => {
      return createMarkdownToReactParser({
        options: {
          latexDelimiter,
          htmlMathDisplay,
          imageFiles,
        },
        components: { alert: Alert },
      })(markdown);
    },
    [imageFiles, latexDelimiter, htmlMathDisplay]
  );

  return seeMarkReactParse;
};

export default useSeeMarkParse;
