import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconExternalLink } from '@tabler/icons-react';

import Tooltip from '@/components/core/tooltip';

const useImageBroken = (source) => {
  const [erroredSource, setErroredSource] = useState(null);
  return {
    broken: erroredSource === source,
    onError: () => setErroredSource(source),
  };
};

const renderImg = (source, alt, onError) => (
  <img src={source} alt={alt} className="block w-full" onError={onError} />
);

const LinkedImage = ({ source = '', alt = '', target = '', broken = false, onError }) => (
  <a href={target} target="_blank" rel="noopener noreferrer" className="relative block">
    <img src={source} alt={alt} className="block w-full" onError={onError} />
    {!broken && (
      <span
        aria-hidden="true"
        className="absolute top-2 left-2 flex items-center justify-center bg-white rounded p-1 text-gray-700 shadow-shadow1"
      >
        <IconExternalLink size={20} />
      </span>
    )}
  </a>
);

LinkedImage.propTypes = {
  source: PropTypes.string,
  alt: PropTypes.string,
  target: PropTypes.string,
  broken: PropTypes.bool,
  onError: PropTypes.func,
};

const withAltTooltip = (content, alt, broken) =>
  alt && !broken ? (
    <span className="block overflow-hidden">
      <Tooltip label={alt}>
        <span className="block -mt-[15px] pt-[15px]">{content}</span>
      </Tooltip>
    </span>
  ) : (
    content
  );

const withDisplayCaption = (content, display) => (
  <figure>
    {content}
    <figcaption className="mt-3 text-center text-base text-text-secondary">{display}</figcaption>
  </figure>
);

const Image = ({ alt = '', source = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return withAltTooltip(renderImg(source, alt, onError), alt, broken);
};

Image.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
};

export const ImageLink = ({ alt = '', source = '', target = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return withAltTooltip(
    <LinkedImage source={source} alt={alt} target={target} broken={broken} onError={onError} />,
    alt,
    broken
  );
};

ImageLink.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
  target: PropTypes.string,
};

export const ImageDisplay = ({ alt = '', display = '', source = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return withDisplayCaption(withAltTooltip(renderImg(source, alt, onError), alt, broken), display);
};

ImageDisplay.propTypes = {
  alt: PropTypes.string,
  display: PropTypes.string,
  source: PropTypes.string,
};

export const ImageDisplayLink = ({ alt = '', display = '', source = '', target = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return withDisplayCaption(
    withAltTooltip(
      <LinkedImage source={source} alt={alt} target={target} broken={broken} onError={onError} />,
      alt,
      broken
    ),
    display
  );
};

ImageDisplayLink.propTypes = {
  alt: PropTypes.string,
  display: PropTypes.string,
  source: PropTypes.string,
  target: PropTypes.string,
};

export default Image;
