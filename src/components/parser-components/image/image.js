import React from 'react';
import PropTypes from 'prop-types';
import { IconExternalLink } from '@tabler/icons-react';

import Tooltip from '@/components/core/tooltip';

const Image = ({ alt = '', source = '', display = '', target = '' }) => {
  const img = <img src={source} alt={alt} className="block w-full" />;

  const imgWithTooltip = alt ? <Tooltip label={alt}>{img}</Tooltip> : img;

  const imgWithLink = target ? (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block"
    >
      {imgWithTooltip}
      <span
        aria-hidden="true"
        className="absolute top-2 left-2 flex items-center justify-center bg-white rounded p-1 text-gray-700 shadow-shadow1"
      >
        <IconExternalLink size={20} />
      </span>
    </a>
  ) : (
    <span className="block">{imgWithTooltip}</span>
  );

  if (!display) return imgWithLink;

  return (
    <figure>
      {imgWithLink}
      <figcaption className="mt-3 text-center text-base text-text-secondary">
        {display}
      </figcaption>
    </figure>
  );
};

Image.propTypes = {
  alt: PropTypes.string,
  source: PropTypes.string,
  display: PropTypes.string,
  target: PropTypes.string,
};

export const ImageLink = (props) => <Image {...props} />;

export const ImageDisplay = (props) => <Image {...props} />;

export const ImageDisplayLink = (props) => <Image {...props} />;

export default Image;
