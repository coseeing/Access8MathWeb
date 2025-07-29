import { useCallback } from 'react';

import { createMarkdownToReactParser } from '@coseeing/see-mark';

import Alert from '@/components/parser-components/alert/alert';
import InternalLink from '@/components/parser-components/internal-link/inetrnal-link';

const useSeeMarkParse = ({ latexDelimiter, htmlMathDisplay, imageFiles }) => {
  const seeMarkReactParse = useCallback(
    (markdown) => {
      return createMarkdownToReactParser({
        options: {
          latexDelimiter,
          htmlMathDisplay,
          imageFiles,
        },
        components: { alert: Alert, internalLink: InternalLink },
      })(markdown);
    },
    [imageFiles, latexDelimiter, htmlMathDisplay]
  );

  return seeMarkReactParse;
};

export default useSeeMarkParse;
