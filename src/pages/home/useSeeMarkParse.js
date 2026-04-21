import { useCallback } from 'react';

import { createMarkdownToReactParser } from '@coseeing/see-mark';

import Alert from '@/components/parser-components/alert/alert';
import {
  ExternalLinkTab,
  ExternalLinkTabTitle,
  ExternalLinkTitle,
} from '@/components/parser-components/external-link/external-link';
import InternalLink from '@/components/parser-components/internal-link/internal-link';

const useSeeMarkParse = ({ latexDelimiter, documentFormat, imageFiles }) => {
  const seeMarkReactParse = useCallback(
    (markdown) => {
      return createMarkdownToReactParser({
        options: {
          latexDelimiter,
          documentFormat,
          imageFiles,
          shouldBuildImageObjectURL: true,
        },
        components: {
          alert: Alert,
          internalLink: InternalLink,
          externalLinkTab: ExternalLinkTab,
          externalLinkTitle: ExternalLinkTitle,
          externalLinkTabTitle: ExternalLinkTabTitle,
        },
      })(markdown);
    },
    [imageFiles, latexDelimiter, documentFormat]
  );

  return seeMarkReactParse;
};

export default useSeeMarkParse;
