import { useCallback } from 'react';

import { createMarkdownToReactParser } from '@coseeing/see-mark';

import Alert from '@/components/parser-components/alert/alert';
import {
  ExternalLinkTab,
  ExternalLinkTabTitle,
  ExternalLinkTitle,
} from '@/components/parser-components/external-link/external-link';
import Image, {
  ImageDisplay,
  ImageDisplayLink,
  ImageLink,
} from '@/components/parser-components/image/image';
import InternalLink from '@/components/parser-components/internal-link/internal-link';
import Iframe from '@/components/parser-components/iframe/iframe';
import YouTube from '@/components/parser-components/youtube/youtube';
import CodePen from '@/components/parser-components/codepen/codepen';

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
          image: Image,
          imageLink: ImageLink,
          imageDisplay: ImageDisplay,
          imageDisplayLink: ImageDisplayLink,
          iframe: Iframe,
          youtube: YouTube,
          codepen: CodePen,
        },
      })(markdown);
    },
    [imageFiles, latexDelimiter, documentFormat]
  );

  return seeMarkReactParse;
};

export default useSeeMarkParse;
