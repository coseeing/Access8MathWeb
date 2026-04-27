import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconExternalLink } from '@tabler/icons-react';

import Tooltip from '@/components/core/tooltip';

const renderImg = (source, alt) => <img src={source} alt={alt} className="block w-full" />;

const LinkedImage = ({ source = '', alt = '', target = '' }) => {
  const [erroredSource, setErroredSource] = useState(null);
  const imageBroken = erroredSource === source;

  return (
    <a href={target} target="_blank" rel="noopener noreferrer" className="relative block">
      <img
        src={source}
        alt={alt}
        className="block w-full"
        onError={() => setErroredSource(source)}
      />
      {!imageBroken && (
        <span
          aria-hidden="true"
          className="absolute top-2 left-2 flex items-center justify-center bg-white rounded p-1 text-gray-700 shadow-shadow1"
        >
          <IconExternalLink size={20} />
        </span>
      )}
    </a>
  );
};

LinkedImage.propTypes = {
  source: PropTypes.string,
  alt: PropTypes.string,
  target: PropTypes.string,
};

const withAltTooltip = (content, alt) =>
  alt ? (
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

const Image = ({ alt = '', source = '' }) => withAltTooltip(renderImg(source, alt), alt);

Image.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
};

export const ImageLink = ({ alt = '', source = '', target = '' }) =>
  withAltTooltip(<LinkedImage source={source} alt={alt} target={target} />, alt);

ImageLink.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
  target: PropTypes.string,
};

export const ImageDisplay = ({ alt = '', display = '', source = '' }) =>
  withDisplayCaption(withAltTooltip(renderImg(source, alt), alt), display);

ImageDisplay.propTypes = {
  alt: PropTypes.string,
  display: PropTypes.string,
  source: PropTypes.string,
};

export const ImageDisplayLink = ({ alt = '', display = '', source = '', target = '' }) =>
  withDisplayCaption(
    withAltTooltip(<LinkedImage source={source} alt={alt} target={target} />, alt),
    display
  );

ImageDisplayLink.propTypes = {
  alt: PropTypes.string,
  display: PropTypes.string,
  source: PropTypes.string,
  target: PropTypes.string,
};

export default Image;
