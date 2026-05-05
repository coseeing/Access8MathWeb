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

const Img = ({ source = '', alt = '', onError }) => (
  <img src={source} alt={alt} className="block w-full" onError={onError} />
);

Img.propTypes = {
  source: PropTypes.string,
  alt: PropTypes.string,
  onError: PropTypes.func,
};

const LinkedImg = ({ source = '', alt = '', target = '', broken = false, onError }) => (
  <a href={target} target="_blank" rel="noopener noreferrer" className="relative block">
    <Img source={source} alt={alt} onError={onError} />
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

LinkedImg.propTypes = {
  source: PropTypes.string,
  alt: PropTypes.string,
  target: PropTypes.string,
  broken: PropTypes.bool,
  onError: PropTypes.func,
};

const AltTooltip = ({ alt = '', disabled = false, children }) => {
  if (!alt || disabled) return children;
  return (
    <span className="block overflow-hidden">
      <Tooltip label={alt}>
        <span className="block -mt-[15px] pt-[15px]">{children}</span>
      </Tooltip>
    </span>
  );
};

AltTooltip.propTypes = {
  alt: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const Caption = ({ display = '', children }) => (
  <figure>
    {children}
    <figcaption className="mt-3 text-center text-base text-text-secondary">{display}</figcaption>
  </figure>
);

Caption.propTypes = {
  display: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Image = ({ alt = '', source = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return (
    <AltTooltip alt={alt} disabled={broken}>
      <Img source={source} alt={alt} onError={onError} />
    </AltTooltip>
  );
};

Image.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
};

export const ImageLink = ({ alt = '', source = '', target = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return (
    <AltTooltip alt={alt} disabled={broken}>
      <LinkedImg source={source} alt={alt} target={target} broken={broken} onError={onError} />
    </AltTooltip>
  );
};

ImageLink.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
  target: PropTypes.string,
};

export const ImageDisplay = ({ alt = '', display = '', source = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return (
    <Caption display={display}>
      <AltTooltip alt={alt} disabled={broken}>
        <Img source={source} alt={alt} onError={onError} />
      </AltTooltip>
    </Caption>
  );
};

ImageDisplay.propTypes = {
  alt: PropTypes.string,
  display: PropTypes.string,
  source: PropTypes.string,
};

export const ImageDisplayLink = ({ alt = '', display = '', source = '', target = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return (
    <Caption display={display}>
      <AltTooltip alt={alt} disabled={broken}>
        <LinkedImg source={source} alt={alt} target={target} broken={broken} onError={onError} />
      </AltTooltip>
    </Caption>
  );
};

ImageDisplayLink.propTypes = {
  alt: PropTypes.string,
  display: PropTypes.string,
  source: PropTypes.string,
  target: PropTypes.string,
};

export default Image;
