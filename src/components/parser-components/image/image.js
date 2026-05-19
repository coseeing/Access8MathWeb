import React, { useId, useState } from 'react';
import PropTypes from 'prop-types';
import { IconExternalLink } from '@tabler/icons-react';

import { useTranslation } from '@/lib/i18n';

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

const LinkedImg = ({ source = '', alt = '', target = '', broken = false, onError }) => {
  const t = useTranslation('common');
  const newTabDescriptionId = useId();
  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      aria-describedby={newTabDescriptionId}
      className="relative block"
    >
      <Img source={source} alt={alt} onError={onError} />
      {!broken && (
        <span
          aria-hidden="true"
          className="absolute top-2 left-2 flex items-center justify-center bg-white rounded p-1 text-gray-700 shadow-shadow1"
        >
          <IconExternalLink size={20} />
        </span>
      )}
      <span id={newTabDescriptionId} className="sr-only" aria-hidden="true">
        {t('openInNewTab')}
      </span>
    </a>
  );
};

LinkedImg.propTypes = {
  source: PropTypes.string,
  alt: PropTypes.string,
  target: PropTypes.string,
  broken: PropTypes.bool,
  onError: PropTypes.func,
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
  const { onError } = useImageBroken(source);
  return <Img source={source} alt={alt} onError={onError} />;
};

Image.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
};

export const ImageLink = ({ alt = '', source = '', target = '' }) => {
  const { broken, onError } = useImageBroken(source);
  return <LinkedImg source={source} alt={alt} target={target} broken={broken} onError={onError} />;
};

ImageLink.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
  target: PropTypes.string,
};

export const ImageDisplay = ({ alt = '', display = '', source = '' }) => {
  const { onError } = useImageBroken(source);
  return (
    <Caption display={display}>
      <Img source={source} alt={alt} onError={onError} />
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
      <LinkedImg source={source} alt={alt} target={target} broken={broken} onError={onError} />
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
